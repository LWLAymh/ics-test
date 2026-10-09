"""The one v5 authoring dialect, schema checks, and semantic cross-reference checks.

No OCR, Markdown rewriting, question-type inference, or answer extraction occurs here.
The jsonschema dependency is mandatory: a missing validator is a build failure.
"""
from __future__ import annotations

import copy
import json
from pathlib import Path
import re
from functools import lru_cache
from urllib.parse import unquote

from jsonschema import Draft202012Validator, FormatChecker
from markdown_it import MarkdownIt

BANK = Path(__file__).resolve().parents[1]
VERSION = "5"
KINDS = {"single-choice", "multiple-choice", "fill", "short-answer", "composite"}
CONTROL = re.compile(r"^%%% (stem|reference|option: ([A-Z][A-Z0-9_-]*)|part-stem: ([A-Za-z][A-Za-z0-9_-]*)|part-reference: ([A-Za-z][A-Za-z0-9_-]*)|part-option: ([A-Za-z][A-Za-z0-9_-]*) ([A-Z][A-Z0-9_-]*))$")
FENCE = re.compile(r"^ {0,3}(`{3,}|~{3,})(.*)$")
MARKER = re.compile(r"\{\{blank:([A-Za-z][A-Za-z0-9_-]*)\}\}")


def load_json(path):
    return json.loads(Path(path).read_text(encoding="utf-8"))


def write_json(path, value):
    path = Path(path)
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(value, ensure_ascii=False, indent=2) + "\n", encoding="utf-8", newline="\n")


def validator(name):
    schema = load_json(BANK / "schema" / (name + "-v5.schema.json"))
    Draft202012Validator.check_schema(schema)
    return Draft202012Validator(schema, format_checker=FormatChecker())


QUESTION_VALIDATOR = validator("question")
PAPER_VALIDATOR = validator("paper")
MARKDOWN = MarkdownIt("commonmark", {"html": False}).enable("table")


@lru_cache(maxsize=None)
def directory_names(directory):
    return {entry.name for entry in directory.iterdir()}


def content_assets(content):
    paths = set()
    def visit(tokens):
        for token in tokens:
            if token.type == "image":
                src = unquote(token.attrGet("src") or "")
                # Legacy authored Markdown uses ../../assets/ relative to original
                # documents. Preserve its text but resolve only this exact prefix.
                src = re.sub(r"^(?:\.\./)+(?=assets/)", "", src)
                if (not src.startswith("assets/") or "\\" in src or
                        any(part in ("..", ".", "") for part in src.split("/")) or
                        ":" in src or "?" in src or "#" in src):
                    raise ValueError("image must use a safe repository assets/ path: " + src)
                if not (BANK / src).is_file():
                    raise ValueError("missing image: " + src)
                parent = BANK
                for segment in src.split("/"):
                    if segment not in directory_names(parent):
                        raise ValueError("image path casing differs from repository: " + src)
                    parent = parent / segment
                paths.add(src)
            if token.children:
                visit(token.children)
    visit(MARKDOWN.parse(content["text"]))
    return paths


def section_targets(question):
    targets = {"stem": question["stem"], "reference": question["solution"]["reference"]}
    for option in question.get("options", []):
        targets["option: " + option["id"]] = option["content"]
    for part in question.get("parts", []):
        prefix = part["id"]
        targets["part-stem: " + prefix] = part["stem"]
        targets["part-reference: " + prefix] = part["solution"]["reference"]
        for option in part.get("options", []):
            targets["part-option: " + prefix + " " + option["id"]] = option["content"]
    return targets


def dump_authored(question):
    meta = copy.deepcopy(question)
    targets = section_targets(meta)
    sections = [(key, value.pop("text")) for key, value in targets.items()]
    # Exactly one separator newline follows each body. It is removed by parse_authored.
    # Leading/trailing content newlines, indentation, and Markdown are otherwise intact.
    return "+++json\n" + json.dumps(meta, ensure_ascii=False, indent=2) + "\n+++\n" + "".join(
        "%%% " + key + "\n" + body + "\n" for key, body in sections)


def parse_authored(text):
    text = text.replace("\r\n", "\n")
    if not text.startswith("+++json\n"):
        raise ValueError("v5 file must start with +++json")
    end = text.find("\n+++\n", 8)
    if end < 0:
        raise ValueError("missing closing +++")
    question = json.loads(text[8:end])
    targets = section_targets(question)
    if any("text" in target for target in targets.values()):
        raise ValueError("Markdown text belongs in body sections, not JSON metadata")
    seen = set()
    current = None
    body = []
    fence = None

    def finish():
        if current is not None:
            value = "".join(body)
            if not value.endswith("\n"):
                raise ValueError("each section needs one terminating separator newline")
            targets[current]["text"] = value[:-1]

    for line in text[end + 5:].splitlines(keepends=True):
        bare = line.removesuffix("\n")
        match = CONTROL.fullmatch(bare) if fence is None else None
        if match:
            finish()
            current = match.group(1)
            if current not in targets or current in seen:
                raise ValueError("unknown or duplicate section: " + current)
            seen.add(current)
            body = []
            continue
        if bare.startswith("%%%") and fence is None:
            raise ValueError("unknown section: " + bare)
        if current is None:
            raise ValueError("content before first body section")
        body.append(line)
        fm = FENCE.match(bare)
        if fm:
            marker, info = fm.groups()
            if fence is None:
                fence = (marker[0], len(marker))
            elif marker[0] == fence[0] and len(marker) >= fence[1] and not info.strip():
                fence = None
    finish()
    if fence is not None:
        raise ValueError("unclosed fenced code block")
    if seen != set(targets):
        raise ValueError("missing body sections: " + ", ".join(sorted(set(targets) - seen)))
    return question


def blank_spans(content, check_markers=True):
    text = content["text"]
    spans = []
    for blank in content.get("blanks", []):
        start = -1
        for _ in range(blank["occurrence"] + 1):
            start = text.find(blank["marker"], start + 1)
            if start < 0:
                raise ValueError("blank anchor not found: " + blank["id"])
        spans.append((start, start + len(blank["marker"]), blank))
    spans.sort(key=lambda span: span[0])
    if any(a[1] > b[0] for a, b in zip(spans, spans[1:])):
        raise ValueError("overlapping blank anchors")
    for match in MARKER.finditer(text) if check_markers else []:
        if not any(start == match.start() and end == match.end() and blank["id"] == match.group(1)
                   for start, end, blank in spans):
            raise ValueError("undeclared explicit blank marker: " + match.group(0))
    return spans


def check_content(content, allow_blanks=False, check_markers=False):
    if content.get("blanks") and not allow_blanks:
        raise ValueError("blanks are only allowed in a fill stem")
    blank_spans(content, check_markers)
    content_assets(content)


def validate_response(node):
    kind = node["type"]
    stem = node["stem"]
    check_content(stem, kind == "fill", True)
    options = node.get("options", [])
    ids = [option["id"] for option in options]
    if len(ids) != len(set(ids)):
        raise ValueError("duplicate option IDs")
    for option in options:
        check_content(option["content"])
        if not option["content"]["text"].strip():
            raise ValueError("empty option content")
    solution = node["solution"]
    check_content(solution["reference"])
    if solution["grading"] == "choice":
        if not set(solution["correctOptionIds"]) <= set(ids):
            raise ValueError("correctOptionIds references missing option")
    if kind in ("single-choice", "multiple-choice") and solution["state"] == "available" and solution["grading"] == "self":
        issues = node.get("issues", node.get("publication", {}).get("issues", []))
        if "answer-key-unresolved" not in issues:
            raise ValueError("self-graded choice must declare unresolved answer key")
    if solution["grading"] == "blanks":
        bindings = {blank["id"] for blank in stem.get("blanks", [])}
        answers = [rule["blankId"] for rule in solution["blankAnswers"]]
        if len(answers) != len(set(answers)) or set(answers) != bindings:
            raise ValueError("blank answer IDs must match all declared blanks exactly")
    if kind == "fill" and not stem.get("blanks"):
        if "blank-positions-unresolved" not in node.get("issues", node.get("publication", {}).get("issues", [])):
            raise ValueError("fill without anchors must explicitly declare unresolved blank positions")
        if solution["grading"] not in ("self", "none"):
            raise ValueError("unresolved blank positions cannot be auto graded")
    if solution["state"] == "available" and kind != "composite" and not solution["reference"]["text"].strip():
        raise ValueError("available solution needs a visible reference")
    if kind == "unclassified-choice" and node.get("publication", {}).get("state") == "published":
        raise ValueError("unclassified choice cannot be published")
    for source in node["sources"]:
        lines = source.get("lines")
        if lines and lines["start"] > lines["end"]:
            raise ValueError("source line range is reversed")


def validate_question(question, modules=None):
    QUESTION_VALIDATOR.validate(question)
    validate_response(question)
    classification = question["classification"]
    module_ids = set(classification["moduleIds"])
    if classification["primaryModuleId"] not in module_ids:
        raise ValueError("primary module must be included in moduleIds")
    if modules is not None and not module_ids <= set(modules):
        raise ValueError("unknown module IDs")
    parts = question.get("parts", [])
    if len({part["id"] for part in parts}) != len(parts):
        raise ValueError("duplicate part IDs")
    for part in parts:
        validate_response(part)
        if not set(part["moduleIds"]) <= module_ids:
            raise ValueError("part modules must be included in question classification")
        if part["type"] == "unclassified-choice" and question["publication"]["state"] == "published":
            raise ValueError("unclassified composite part cannot be published")
    if parts and question["solution"]["grading"] == "parts":
        if question["solution"]["state"] != "available":
            raise ValueError("aggregate availability must be explicit")
        if not any(part["solution"]["state"] == "available" for part in parts):
            raise ValueError("available composite needs at least one gradable part")


def read_bank(root=BANK):
    root = Path(root)
    index = load_json(root / "authored" / "index.json")
    if index["schemaVersion"] != VERSION:
        raise ValueError("authored index must be v5")
    modules = index["modules"]
    if len({module["id"] for module in modules}) != len(modules):
        raise ValueError("duplicate modules")
    paper_payload = load_json(root / "authored" / "papers.json")
    if paper_payload["schemaVersion"] != VERSION:
        raise ValueError("paper index must be v5")
    papers = paper_payload["papers"]
    questions = []
    for path in sorted((root / "authored").glob("p-*/*.md")):
        question = parse_authored(path.read_text(encoding="utf-8"))
        validate_question(question, {module["id"] for module in modules})
        if path.stem != question["id"] or path.parent.name != question["paperId"]:
            raise ValueError("authored path and IDs disagree: " + str(path))
        questions.append(question)
    validate_links(questions, papers)
    claimed = [q["id"] for q in questions] + [p["id"] for q in questions for p in q.get("parts", [])]
    if len(claimed) != len(set(claimed)):
        raise ValueError("question/part IDs must be globally unique")
    return modules, papers, questions


def validate_links(questions, papers):
    by_id = {question["id"]: question for question in questions}
    if len(by_id) != len(questions):
        raise ValueError("duplicate question IDs")
    if len({paper["id"] for paper in papers}) != len(papers):
        raise ValueError("duplicate paper IDs")
    seen = set()
    for paper in papers:
        PAPER_VALIDATOR.validate(paper)
        for order, qid in enumerate(paper["questionIds"], 1):
            question = by_id.get(qid)
            if not question or question["paperId"] != paper["id"] or question["paperOrder"] != order:
                raise ValueError("paper membership/order mismatch: " + qid)
            if qid in seen:
                raise ValueError("question appears in multiple papers: " + qid)
            seen.add(qid)
    if seen != set(by_id):
        raise ValueError("questions missing from paper index")
