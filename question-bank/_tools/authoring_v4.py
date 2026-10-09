# -*- coding: utf-8 -*-
"""Parse one explicitly named, human-authored v4 question Markdown file.

This module deliberately has no directory walker, migration command, OCR cleanup,
or content heuristics. It parses declared structure and preserves Markdown.
"""
from __future__ import print_function

import argparse
import datetime as dt
import json
import re
import sys

try:
    import tomllib
except ImportError:  # pragma: no cover - Python < 3.11
    tomllib = None


ID_RE = re.compile(r"^q-[a-f0-9]{16}$")
PAPER_ID_RE = re.compile(r"^p-[a-f0-9]{16}$")
PART_ID_RE = re.compile(r"^[A-Za-z][A-Za-z0-9_-]*$")
CONTROL_RE = re.compile(r"^%%%\s+(stem|solution|option\s*:\s*([A-Z][A-Z0-9_-]*)|blank\s*:\s*([A-Za-z][A-Za-z0-9_-]*))\s*$")
PART_CONTROL_RE = re.compile(
    r"^%%%\s+(part-stem|part-solution)\s*:\s*([a-z][a-z0-9_-]*)\s*$|"
    r"^%%%\s+(part-option|part-blank)\s*:\s*([a-z][a-z0-9_-]*)\s+([A-Za-z][A-Za-z0-9_-]*)\s*$")
QUESTION_TYPES = {"single-choice", "multiple-choice", "fill", "short-answer", "composite"}
STATUSES = {"draft", "review", "published"}
WIDTHS = {"short", "medium", "long"}
ALLOWED_META = {
    "schema_version", "id", "status", "reviewed_by", "reviewed_at", "type",
    "paper_id", "paper_order", "number_display", "number_major_display",
    "number_major_value", "number_minor_display", "number_minor_value",
    "number_parts", "module_primary", "modules", "tags", "correct_options",
    "blanks", "parts", "source_document", "source_start", "source_end", "source_pages",
}


class AuthoringError(ValueError):
    pass


def _required(meta, name):
    value = meta.get(name)
    if value is None or value == "" or value == []:
        raise AuthoringError("missing required metadata: %s" % name)
    return value


def _trim_boundary_newlines(lines):
    while lines and not lines[0].strip():
        lines = lines[1:]
    while lines and not lines[-1].strip():
        lines = lines[:-1]
    return "\n".join(lines)


def _front_matter(text):
    lines = text.replace("\r\n", "\n").replace("\r", "\n").split("\n")
    if not lines or lines[0] != "+++":
        raise AuthoringError("file must start with TOML delimiter +++")
    try:
        end = lines.index("+++", 1)
    except ValueError:
        raise AuthoringError("missing closing TOML delimiter +++")
    if tomllib is None:
        raise AuthoringError("Python 3.11+ is required (tomllib unavailable)")
    try:
        meta = tomllib.loads("\n".join(lines[1:end]))
    except Exception as exc:
        raise AuthoringError("invalid TOML metadata: %s" % exc)
    return meta, lines[end + 1:]


def _sections(lines):
    result = []
    current = None
    body = []
    for line_no, line in enumerate(lines, 1):
        part_match = PART_CONTROL_RE.match(line)
        if part_match:
            if current is not None:
                result.append((current[0], current[1], _trim_boundary_newlines(body)))
            simple_kind, simple_part, item_kind, item_part, item_id = part_match.groups()
            if simple_kind:
                current = (simple_kind, (simple_part, None))
            else:
                current = (item_kind, (item_part, item_id))
            body = []
            continue
        match = CONTROL_RE.match(line)
        if match:
            if current is not None:
                result.append((current[0], current[1], _trim_boundary_newlines(body)))
            raw, option_id, blank_id = match.groups()
            if raw == "stem":
                current = ("stem", None)
            elif raw == "solution":
                current = ("solution", None)
            elif option_id:
                current = ("option", option_id)
            else:
                current = ("blank", blank_id)
            body = []
        elif line.startswith("%%%"): 
            raise AuthoringError("unknown control line in body: %s" % line)
        else:
            if current is None and line.strip():
                raise AuthoringError("body content appears before first %%% section")
            if current is not None:
                body.append(line)
    if current is not None:
        result.append((current[0], current[1], _trim_boundary_newlines(body)))
    if not result:
        raise AuthoringError("question body has no sections")
    return result


def _validate_meta(meta):
    unknown = sorted(set(meta) - ALLOWED_META)
    if unknown:
        raise AuthoringError("unknown metadata: %s" % ", ".join(unknown))
    if meta.get("schema_version") != 4:
        raise AuthoringError("schema_version must be 4")
    qid = _required(meta, "id")
    if not isinstance(qid, str) or not ID_RE.match(qid):
        raise AuthoringError("id must match q-[a-f0-9]{16}")
    paper_id = _required(meta, "paper_id")
    if not isinstance(paper_id, str) or not PAPER_ID_RE.match(paper_id):
        raise AuthoringError("paper_id must match p-[a-f0-9]{16}")
    status = _required(meta, "status")
    if status not in STATUSES:
        raise AuthoringError("status must be draft, review, or published")
    qtype = _required(meta, "type")
    if qtype not in QUESTION_TYPES:
        raise AuthoringError("unsupported type: %s" % qtype)
    if qtype == "composite":
        parts = _required(meta, "parts")
        if not isinstance(parts, list) or len(parts) < 2:
            raise AuthoringError("composite questions require at least two [[parts]] items")
        part_ids = [item.get("id") for item in parts if isinstance(item, dict)]
        if len(part_ids) != len(parts) or any(not isinstance(pid, str) or not re.match(
                r"^[a-z][a-z0-9_-]*$", pid) for pid in part_ids):
            raise AuthoringError("every composite part requires a valid lowercase id")
        if len(set(part_ids)) != len(part_ids):
            raise AuthoringError("composite part ids must be unique")
        if "blanks" in meta or "correct_options" in meta:
            raise AuthoringError("composite answers belong to each [[parts]] item, not the question root")
    elif "parts" in meta:
        raise AuthoringError("only composite questions may declare [[parts]]")
    for name in ("paper_order",):
        if not isinstance(_required(meta, name), int) or meta[name] < 1:
            raise AuthoringError("%s must be a positive integer" % name)
    for name in ("number_display", "number_major_display", "number_major_value",
                 "module_primary", "source_document"):
        if not isinstance(_required(meta, name), str):
            raise AuthoringError("%s must be a string" % name)
    minor = (meta.get("number_minor_display"), meta.get("number_minor_value"))
    if (minor[0] is None) != (minor[1] is None):
        raise AuthoringError("number_minor_display and number_minor_value must appear together")
    modules = _required(meta, "modules")
    if not isinstance(modules, list) or not all(isinstance(x, str) and x for x in modules):
        raise AuthoringError("modules must be a non-empty string array")
    if meta["module_primary"] not in modules:
        raise AuthoringError("modules must contain module_primary")
    if len(set(modules)) != len(modules):
        raise AuthoringError("modules must not contain duplicates")
    if status == "published":
        _required(meta, "reviewed_by")
        reviewed_at = _required(meta, "reviewed_at")
        if isinstance(reviewed_at, dt.date):
            pass
        elif isinstance(reviewed_at, str):
            try:
                dt.date.fromisoformat(reviewed_at)
            except ValueError:
                raise AuthoringError("reviewed_at must be an ISO date")
        else:
            raise AuthoringError("reviewed_at must be an ISO date")
    starts = meta.get("source_start")
    ends = meta.get("source_end")
    if (starts is None) != (ends is None):
        raise AuthoringError("source_start and source_end must appear together")
    if starts is not None and (not isinstance(starts, int) or not isinstance(ends, int)
                               or starts < 1 or ends < starts):
        raise AuthoringError("source line range is invalid")


def _markdown_block(content):
    return {"type": "markdown", "content": content}


def _solution_payload(status, solution, correct=None, blank_answers=None):
    blocks = [_markdown_block(solution)] if solution else []
    return {
        "status": "verified" if status == "published" else "needs-review",
        "correctOptionIds": correct or [],
        "blankAnswers": blank_answers or [],
        "referenceAnswer": {"blocks": blocks},
    }


def _parse_composite(meta, sections):
    part_meta = {item["id"]: item for item in meta["parts"]}
    allowed_part_meta = {"id", "label", "type", "correct_options", "blanks"}
    shared_blocks = []
    overall_solution = ""
    part_sections = {part_id: [] for part_id in part_meta}

    for kind, item_id, content in sections:
        if kind == "stem":
            if not content:
                raise AuthoringError("shared stem section must not be empty")
            shared_blocks.append(_markdown_block(content))
        elif kind == "solution":
            if overall_solution:
                raise AuthoringError("composite question allows at most one root solution")
            overall_solution = content
        elif kind.startswith("part-"):
            part_id, local_id = item_id
            if part_id not in part_meta:
                raise AuthoringError("part section references undeclared part: %s" % part_id)
            part_sections[part_id].append((kind[5:], local_id, content))
        else:
            raise AuthoringError("composite root cannot contain %s; use part-* controls" % kind)
    if not shared_blocks:
        raise AuthoringError("composite question requires a shared %%% stem section")

    parts = []
    for item in meta["parts"]:
        unknown = sorted(set(item) - allowed_part_meta)
        if unknown:
            raise AuthoringError("part %s has unknown metadata: %s" % (
                item["id"], ", ".join(unknown)))
        part_id = item["id"]
        label = item.get("label")
        qtype = item.get("type")
        if not isinstance(label, str) or not label:
            raise AuthoringError("part %s requires a non-empty label" % part_id)
        if qtype not in QUESTION_TYPES - {"composite"}:
            raise AuthoringError("part %s has unsupported type: %s" % (part_id, qtype))
        declared_blanks = {blank.get("id"): blank for blank in item.get("blanks", [])}
        if None in declared_blanks or len(declared_blanks) != len(item.get("blanks", [])):
            raise AuthoringError("part %s has invalid or duplicate blank metadata" % part_id)
        used_blanks = []
        stem_blocks = []
        options = []
        option_ids = []
        solution = None
        for kind, local_id, content in part_sections[part_id]:
            if kind == "stem":
                if not content:
                    raise AuthoringError("part %s stem must not be empty" % part_id)
                stem_blocks.append(_markdown_block(content))
            elif kind == "blank":
                if qtype != "fill" or content:
                    raise AuthoringError("part-blank is only an empty placeholder inside a fill part")
                blank = declared_blanks.get(local_id)
                if not blank or local_id in used_blanks:
                    raise AuthoringError("part %s blank %s is undeclared or repeated" % (part_id, local_id))
                if blank.get("width") not in WIDTHS:
                    raise AuthoringError("part %s blank %s has invalid width" % (part_id, local_id))
                stem_blocks.append({
                    "type": "blank", "id": local_id, "label": blank.get("label", ""),
                    "placeholder": blank.get("placeholder", ""), "width": blank["width"],
                })
                used_blanks.append(local_id)
            elif kind == "option":
                if qtype not in {"single-choice", "multiple-choice"} or not content:
                    raise AuthoringError("part-option requires a non-empty choice part option")
                if not re.match(r"^[A-Z][A-Z0-9_-]*$", local_id) or local_id in option_ids:
                    raise AuthoringError("part %s option id is invalid or repeated: %s" % (part_id, local_id))
                option_ids.append(local_id)
                options.append({"id": local_id, "content": [_markdown_block(content)]})
            elif kind == "solution":
                if solution is not None or not content:
                    raise AuthoringError("part %s requires exactly one non-empty solution" % part_id)
                solution = content
        if not stem_blocks or solution is None:
            raise AuthoringError("part %s requires a stem and solution" % part_id)

        correct = item.get("correct_options", [])
        blank_answers = []
        if qtype in {"single-choice", "multiple-choice"}:
            if len(options) < 2 or not isinstance(correct, list) or not correct:
                raise AuthoringError("choice part %s requires options and correct_options" % part_id)
            if len(set(correct)) != len(correct) or any(value not in option_ids for value in correct):
                raise AuthoringError("part %s correct_options reference invalid options" % part_id)
            if qtype == "single-choice" and len(correct) != 1:
                raise AuthoringError("single-choice part %s requires one correct option" % part_id)
            if declared_blanks:
                raise AuthoringError("choice part %s cannot declare blanks" % part_id)
        elif correct or "correct_options" in item:
            raise AuthoringError("non-choice part %s cannot declare correct_options" % part_id)

        if qtype == "fill":
            if set(used_blanks) != set(declared_blanks):
                raise AuthoringError("every blank in part %s must appear exactly once" % part_id)
            for blank_id in used_blanks:
                blank = declared_blanks[blank_id]
                accepted = blank.get("accepted_answers")
                if not isinstance(accepted, list) or not accepted:
                    raise AuthoringError("part %s blank %s requires accepted_answers" % (part_id, blank_id))
                blank_answers.append({
                    "blankId": blank_id, "acceptedAnswers": accepted,
                    "caseSensitive": bool(blank.get("case_sensitive", False)),
                    "trimWhitespace": bool(blank.get("trim_whitespace", True)),
                })
        elif declared_blanks:
            raise AuthoringError("only a fill part may declare blanks")

        part = {
            "id": part_id, "label": label, "type": qtype,
            "stem": {"blocks": stem_blocks},
            "solution": _solution_payload(meta["status"], solution, correct, blank_answers),
        }
        if options:
            part["options"] = options
        parts.append(part)

    reviewed_at = meta.get("reviewed_at")
    if isinstance(reviewed_at, dt.date):
        reviewed_at = reviewed_at.isoformat()
    question = {
        "schemaVersion": 4,
        "id": meta["id"],
        "publication": {"status": meta["status"], "reviewedBy": meta.get("reviewed_by"),
                        "reviewedAt": reviewed_at},
        "paperId": meta["paper_id"], "paperOrder": meta["paper_order"],
        "questionNumber": {
            "display": meta["number_display"],
            "major": {"display": meta["number_major_display"], "value": meta["number_major_value"]},
            "minor": ({"display": meta["number_minor_display"], "value": meta["number_minor_value"]}
                      if meta.get("number_minor_display") is not None else None),
            "parts": meta.get("number_parts", []),
        },
        "classification": {"primaryModuleId": meta["module_primary"],
                           "moduleIds": meta["modules"], "tags": meta.get("tags", [])},
        "type": "composite", "stem": {"blocks": shared_blocks}, "parts": parts,
        "solution": _solution_payload(meta["status"], overall_solution),
        "source": {"document": meta["source_document"]},
    }
    if meta.get("source_start") is not None:
        question["source"]["lines"] = {"start": meta["source_start"], "end": meta["source_end"]}
    if "source_pages" in meta:
        question["source"]["pages"] = meta["source_pages"]
    return question


def parse_text(text):
    meta, body_lines = _front_matter(text)
    _validate_meta(meta)
    sections = _sections(body_lines)
    qtype = meta["type"]
    if qtype == "composite":
        return _parse_composite(meta, sections)
    stem_blocks = []
    options = []
    option_ids = []
    solution = None
    declared_blanks = {item.get("id"): item for item in meta.get("blanks", [])}
    used_blanks = []
    phase = "stem"

    for kind, item_id, content in sections:
        if kind == "stem":
            if phase != "stem":
                raise AuthoringError("stem sections must precede options and solution")
            if not content:
                raise AuthoringError("stem section must not be empty")
            stem_blocks.append(_markdown_block(content))
        elif kind == "blank":
            if phase != "stem" or qtype != "fill":
                raise AuthoringError("blank sections are only allowed inside fill stems")
            if content:
                raise AuthoringError("blank control section cannot contain Markdown")
            if item_id not in declared_blanks:
                raise AuthoringError("blank %s has no [[blanks]] metadata" % item_id)
            if item_id in used_blanks:
                raise AuthoringError("blank %s appears more than once" % item_id)
            blank = declared_blanks[item_id]
            width = blank.get("width")
            if width not in WIDTHS:
                raise AuthoringError("blank %s has invalid width" % item_id)
            stem_blocks.append({
                "type": "blank", "id": item_id, "label": blank.get("label", ""),
                "placeholder": blank.get("placeholder", ""), "width": width,
            })
            used_blanks.append(item_id)
        elif kind == "option":
            if qtype not in {"single-choice", "multiple-choice"}:
                raise AuthoringError("only choice questions may contain option sections")
            if phase == "solution":
                raise AuthoringError("option sections must precede solution")
            phase = "options"
            if not content:
                raise AuthoringError("option %s must not be empty" % item_id)
            if item_id in option_ids:
                raise AuthoringError("duplicate option id: %s" % item_id)
            option_ids.append(item_id)
            options.append({"id": item_id, "content": [_markdown_block(content)]})
        elif kind == "solution":
            if solution is not None:
                raise AuthoringError("exactly one solution section is allowed")
            phase = "solution"
            if not content:
                raise AuthoringError("solution section must not be empty")
            solution = content

    if not stem_blocks:
        raise AuthoringError("at least one stem section is required")
    if solution is None:
        raise AuthoringError("a solution section is required")

    correct = meta.get("correct_options", [])
    if qtype in {"single-choice", "multiple-choice"}:
        if len(options) < 2:
            raise AuthoringError("choice questions require at least two options")
        if not isinstance(correct, list) or not correct:
            raise AuthoringError("choice questions require correct_options")
        if len(set(correct)) != len(correct) or any(x not in option_ids for x in correct):
            raise AuthoringError("correct_options must reference unique declared options")
        if qtype == "single-choice" and len(correct) != 1:
            raise AuthoringError("single-choice requires exactly one correct option")
    elif options or "correct_options" in meta:
        raise AuthoringError("non-choice questions cannot declare options or correct_options")

    blank_answers = []
    if qtype == "fill":
        if set(used_blanks) != set(declared_blanks):
            raise AuthoringError("every [[blanks]] item must appear exactly once in the stem")
        for blank_id in used_blanks:
            blank = declared_blanks[blank_id]
            accepted = blank.get("accepted_answers")
            if not isinstance(accepted, list) or not accepted:
                raise AuthoringError("blank %s requires accepted_answers" % blank_id)
            blank_answers.append({
                "blankId": blank_id,
                "acceptedAnswers": accepted,
                "caseSensitive": bool(blank.get("case_sensitive", False)),
                "trimWhitespace": bool(blank.get("trim_whitespace", True)),
            })
    elif declared_blanks:
        raise AuthoringError("only fill questions may declare [[blanks]]")

    reviewed_at = meta.get("reviewed_at")
    if isinstance(reviewed_at, dt.date):
        reviewed_at = reviewed_at.isoformat()
    question = {
        "schemaVersion": 4,
        "id": meta["id"],
        "publication": {
            "status": meta["status"],
            "reviewedBy": meta.get("reviewed_by"),
            "reviewedAt": reviewed_at,
        },
        "paperId": meta["paper_id"],
        "paperOrder": meta["paper_order"],
        "questionNumber": {
            "display": meta["number_display"],
            "major": {"display": meta["number_major_display"], "value": meta["number_major_value"]},
            "minor": ({"display": meta["number_minor_display"], "value": meta["number_minor_value"]}
                      if meta.get("number_minor_display") is not None else None),
            "parts": meta.get("number_parts", []),
        },
        "classification": {
            "primaryModuleId": meta["module_primary"],
            "moduleIds": meta["modules"],
            "tags": meta.get("tags", []),
        },
        "type": qtype,
        "stem": {"blocks": stem_blocks},
        "solution": {
            "status": "verified" if meta["status"] == "published" else "needs-review",
            "correctOptionIds": correct,
            "blankAnswers": blank_answers,
            "referenceAnswer": {"blocks": [_markdown_block(solution)]},
        },
        "source": {"document": meta["source_document"]},
    }
    if options:
        question["options"] = options
    if meta.get("source_start") is not None:
        question["source"]["lines"] = {"start": meta["source_start"], "end": meta["source_end"]}
    if "source_pages" in meta:
        question["source"]["pages"] = meta["source_pages"]
    return question


def parse_file(path):
    with open(path, "r", encoding="utf-8") as handle:
        return parse_text(handle.read())


def main(argv=None):
    parser = argparse.ArgumentParser(description="Validate one human-authored v4 question file")
    parser.add_argument("file", help="exact .md file to validate; directories are not accepted")
    parser.add_argument("--json", action="store_true", help="print the mechanical JSON projection")
    args = parser.parse_args(argv)
    try:
        question = parse_file(args.file)
    except (OSError, AuthoringError) as exc:
        print("ERROR: %s" % exc, file=sys.stderr)
        return 1
    if args.json:
        print(json.dumps(question, ensure_ascii=False, indent=2))
    else:
        print("OK %s (%s, %s)" % (question["id"], question["type"], question["publication"]["status"]))
    return 0


if __name__ == "__main__":
    sys.exit(main())
