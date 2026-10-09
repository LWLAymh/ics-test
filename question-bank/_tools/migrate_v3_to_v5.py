"""One-time STRUCTURAL migration, never a question-content repair script.

Copies explicit v3 layout/interaction data verbatim, retaining existing group IDs.
The only legacy regex is the documented v3 fill-placeholder grammar: its exact
matches become literal anchors; the Markdown itself is not changed at all.
Never infer selection multiplicity, answer keys, missing blanks, or provenance.
"""
from __future__ import annotations

import argparse
import copy
import hashlib
import json
from pathlib import Path
import re
import subprocess

import curated
from format_v5 import BANK, dump_authored, load_json, parse_authored, read_bank, section_targets, write_json

BASELINE = BANK / "migration" / "v3-baseline.json"
GAPS = re.compile(r"\{\{blank:([A-Za-z][A-Za-z0-9_-]*)\}\}|_+\s*(?:\(\d{1,2}\)|[①②③④⑤⑥⑦⑧⑨⑩])\s*_+|_{2,}|＿{2,}|（[\s　]{2,}）|\([\s　]{2,}\)")
CHINESE = dict(zip("一二三四五六七八九十", map(str, range(1, 11))))


def capture():
    if BASELINE.exists():
        raise ValueError("baseline already exists; will not overwrite it")
    catalog = load_json(BANK / "web-data" / "catalog.json")
    if catalog["schemaVersion"] != 3:
        raise ValueError("capture requires unchanged v3 web-data")
    records = []
    fields = ("id", "paperId", "paperOrder", "moduleId", "questionNo", "summary", "layout",
              "interaction", "partInteraction", "group", "presentation", "answer", "source")
    for module in catalog["modules"]:
        for raw in load_json(BANK / "web-data" / module["questionFile"])["questions"]:
            record = {key: raw[key] for key in fields if key in raw}
            if not raw.get("formatted") or "layout" not in raw:
                raise ValueError("migration requires explicit layout: " + raw["id"])
            record["provenance"] = curated.load(BANK / raw["source"]["curated"])["provenance"]
            records.append(record)
    papers = load_json(BANK / "web-data" / "papers.json")["papers"]
    value = {
        "schemaVersion": 3,
        "sourceCommit": subprocess.check_output(["git", "rev-parse", "HEAD"], cwd=BANK.parent, text=True).strip(),
        "modules": [{k: m[k] for k in ("id", "number", "name", "title")} for m in catalog["modules"]],
        "papers": papers, "records": records,
    }
    write_json(BASELINE, value)
    print("Captured %d v3 fragments (immutable migration evidence)" % len(records))


def number(display):
    result = {"display": display, "major": None, "minor": None, "parts": []}
    match = re.fullmatch(r"(Problem [A-Z]|Lab 任务|[^ ]+)\s+([^ ]+)(?:\s+(.+))?", display)
    if match:
        major, minor, rest = match.groups()
        result["major"] = {"display": major, "value": None}
        result["minor"] = {"display": minor, "value": None}
        result["parts"] = [rest] if rest else []
    elif display:
        result["major"] = {"display": display, "value": None}
    for key in ("major", "minor"):
        item = result[key]
        if not item:
            continue
        label = item["display"]
        if re.fullmatch(r"\d+", label):
            item["value"] = label
        elif re.fullmatch(r"第[一二三四五六七八九十]题", label):
            item["value"] = CHINESE[label[1:-1]]
        elif re.fullmatch(r"Problem [A-Z]", label):
            item["value"] = label[-1]
    return result


def content(text, bindings=None):
    result = {"format": "markdown", "text": text}
    if bindings is not None:
        result["blanks"] = bindings
    return result


def binding_list(stem):
    bindings = []
    for index, match in enumerate(GAPS.finditer(stem)):
        marker = match.group(0)
        # Occurrence counts overlapping exact literal matches, matching JS indexOf.
        occurrence = sum(stem.startswith(marker, pos) for pos in range(match.start()))
        bindings.append({"id": match.group(1) or "legacy-gap-%d" % index,
                         "marker": marker, "occurrence": occurrence, "width": "medium"})
    return bindings


def source(raw):
    src = raw["source"]
    return {"legacyId": raw["id"], "document": src["document"],
            "lines": src["lines"], "curated": src["curated"],
            "aliases": src.get("aliases", []), "provenance": raw["provenance"],
            "editorNote": raw.get("summary", "")}


def response(raw):
    layout = raw["layout"]
    interaction = raw.get("partInteraction", raw["interaction"])
    kind = interaction["kind"]
    decision = load_json(BANK / "migration" / "decisions.json").get(raw["id"], {})
    kind = decision.get("type", kind)
    if kind == "choice":
        kind = "unclassified-choice"
    if kind not in ("single-choice", "multiple-choice", "unclassified-choice", "fill", "short-answer"):
        raise ValueError("undeclared unsupported leaf kind: " + raw["id"])
    stem = layout["stem"]
    bindings = binding_list(stem) if kind == "fill" else None
    issues = list(raw["presentation"].get("issues", []))
    if kind == "unclassified-choice":
        issues.append("selection-multiplicity-unresolved")
    if kind == "fill" and not bindings:
        issues.append("blank-positions-unresolved")
    solution = {"state": "available" if raw["answer"]["status"] == "verified" else raw["answer"]["status"],
                "grading": "self", "reference": content(layout["answer"]),
                "provenance": {"origin": "unknown", "crossChecked": None,
                               "note": "Migrated from v3; answer text and any attribution are preserved. Legacy verified did not establish official provenance."}}
    explicit_provenance = load_json(BANK / "migration" / "answer-provenance.json")["answers"].get(raw["id"])
    if explicit_provenance:
        solution["provenance"] = copy.deepcopy(explicit_provenance)
    if solution["state"] != "available":
        solution["grading"] = "none"
        solution["reason"] = "原有答案状态为 " + raw["answer"]["status"]
    elif kind in ("single-choice", "multiple-choice", "unclassified-choice"):
        keys = interaction.get("correctChoiceIds", [])
        if not keys:
            issues.append("answer-key-unresolved")
        else:
            solution["grading"] = "choice"
            solution["correctOptionIds"] = keys
    elif bindings:
        solution["grading"] = "blanks"
        existing = {item["id"]: item for item in interaction.get("blankAnswers", [])}
        solution["blankAnswers"] = []
        for blank in bindings:
            if any(rule["blankId"] == blank["id"] for rule in solution["blankAnswers"]):
                continue
            rule = {"blankId": blank["id"], "method": "self"}
            old = existing.get(blank["id"])
            if old:
                rule.update({"method": "exact", "acceptedAnswers": old["acceptedAnswers"],
                             "normalize": {"caseSensitive": old.get("caseSensitive", False),
                                           "trimWhitespace": old.get("trimWhitespace", True)}})
            solution["blankAnswers"].append(rule)
    result = {"id": raw["id"], "number": number(raw["questionNo"]), "type": kind,
              "moduleIds": [raw["moduleId"]], "stem": content(stem, bindings),
              "solution": solution, "sources": [source(raw)], "issues": list(dict.fromkeys(issues))}
    if kind.endswith("choice"):
        result["options"] = [{"id": option["key"], "content": content(option["content"])}
                             for option in layout["choices"]]
    return result


def convert(baseline):
    records = {raw["id"]: raw for raw in baseline["records"]}
    groups = {}
    for raw in records.values():
        if "group" in raw:
            groups.setdefault(raw["group"]["questionId"], []).append(raw)
    questions, papers, mapping = [], [], {}
    for old_paper in baseline["papers"]:
        ordered = []
        emitted = set()
        for old_id in old_paper["questionIds"]:
            raw = records[old_id]
            qid = raw.get("group", {}).get("questionId", old_id)
            mapping[old_id] = {"questionId": qid, "partId": old_id if "group" in raw else None}
            if qid in emitted:
                continue
            emitted.add(qid)
            members = sorted(groups.get(qid, [raw]), key=lambda item: item.get("group", {}).get("order", 0))
            leaves = [response(item) for item in members]
            module_ids = list(dict.fromkeys(mid for leaf in leaves for mid in leaf["moduleIds"]))
            issues = list(dict.fromkeys(issue for leaf in leaves for issue in leaf["issues"]))
            published = all(item["presentation"]["status"] == "ready" and
                            leaf["type"] != "unclassified-choice" for item, leaf in zip(members, leaves))
            common = {"schemaVersion": "5", "id": qid, "revision": 1,
                      "paperId": old_paper["id"], "paperOrder": len(ordered) + 1,
                      "number": number(raw.get("group", {}).get("title", raw["questionNo"])),
                      "classification": {"primaryModuleId": module_ids[0], "moduleIds": module_ids, "tags": []},
                      "publication": {"state": "published" if published else "review", "basis": "legacy-migration",
                                      "reviewer": None, "reviewedAt": None, "issues": issues},
                      "sources": [source(item) for item in members]}
            if len(members) > 1:
                common.update({"type": "composite", "stem": content(""), "parts": leaves,
                               "solution": {"state": "available", "grading": "parts", "reference": content(""),
                                            "provenance": {"origin": "unknown", "crossChecked": None}}})
            else:
                common.update({key: value for key, value in leaves[0].items()
                               if key in ("type", "stem", "options", "solution")})
            ordered.append(qid)
            questions.append(common)
        exam_kind = {"期中": "midterm", "期末": "final", "阶段测验": "stage-test",
                     "Lab测验": "lab-quiz"}.get(old_paper["examType"], "other")
        sequence_match = re.fullmatch(r"第(\d+)次", old_paper["title"] or "")
        papers.append({"schemaVersion": "5", "id": old_paper["id"], "revision": 1,
                       "displayName": old_paper["displayName"], "title": None,
                       "year": old_paper["year"], "academicYear": None, "term": "unknown",
                       "examKind": exam_kind, "sequence": int(sequence_match.group(1)) if sequence_match else None,
                       "questionIds": ordered, "coverage": {"state": "unknown", "note": "旧 complete 字段只表示有无答案，不能证明原卷收录完整。"},
                       "sourceDocuments": list(dict.fromkeys(records[qid]["source"]["document"] for qid in old_paper["questionIds"]))})
    return questions, papers, mapping


def migrate(refresh=False):
    if (BANK / "authored").exists() and not refresh:
        raise ValueError("authored/ already exists; migration will never overwrite human edits")
    baseline = load_json(BASELINE)
    questions, papers, mapping = convert(baseline)
    for question in questions:
        path = BANK / "authored" / question["paperId"] / (question["id"] + ".md")
        if path.exists():
            current = parse_authored(path.read_text(encoding="utf-8"))
            if current["revision"] != 1 or current["publication"]["basis"] != "legacy-migration":
                raise ValueError("will not overwrite reviewed authored metadata: " + str(path))
            before = {key: item["text"] for key, item in section_targets(current).items()}
            after = {key: item["text"] for key, item in section_targets(question).items()}
            if before != after:
                raise ValueError("will not overwrite modified authored Markdown: " + str(path))
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(dump_authored(question), encoding="utf-8", newline="\n")
    write_json(BANK / "authored" / "index.json", {"schemaVersion": "5", "modules": baseline["modules"]})
    write_json(BANK / "authored" / "papers.json", {"schemaVersion": "5", "papers": papers})
    write_json(BANK / "migration" / "id-map.json", {"schemaVersion": "5", "legacyQuestionIds": mapping})
    verify()


def verify():
    baseline = load_json(BASELINE)
    expected, expected_papers, expected_map = convert(baseline)
    _, papers, actual = read_bank()
    if papers != expected_papers:
        raise ValueError("paper metadata/order changed during migration")
    by_id = {question["id"]: question for question in actual}
    if set(by_id) != {question["id"] for question in expected}:
        raise ValueError("question lost or added during migration")
    for question in expected:
        if by_id[question["id"]] != question:
            raise ValueError("migration changed declared content or grading: " + question["id"])
    if load_json(BANK / "migration" / "id-map.json")["legacyQuestionIds"] != expected_map:
        raise ValueError("legacy ID mapping drifted")
    published = sum(question["publication"]["state"] == "published" for question in actual)
    report = {"sourceCommit": baseline["sourceCommit"], "sourceFragments": len(baseline["records"]),
              "questions": len(actual), "composites": sum(question["type"] == "composite" for question in actual),
              "publishedQuestions": published, "retainedForReview": len(actual) - published,
              "papers": len(papers), "mappedLegacyIds": len(expected_map),
              "markdownAndGradingPreserved": True,
              "explicitHumanDecisions": load_json(BANK / "migration" / "decisions.json"),
              "unresolvedFillParts": [node["id"] for question in actual for node in question.get("parts", [question])
                                      if "blank-positions-unresolved" in node.get("issues", question["publication"]["issues"])],
              "baselineSha256": hashlib.sha256(BASELINE.read_bytes()).hexdigest()}
    write_json(BANK / "migration" / "report.json", report)
    print("v5 migration verified: %d fragments -> %d questions, %d published, %d papers; all Markdown/keys/IDs preserved" % (
        report["sourceFragments"], len(actual), published, len(papers)))


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("action", choices=("capture", "migrate", "verify", "refresh-generated"))
    args = parser.parse_args()
    {"capture": capture, "migrate": migrate, "verify": verify,
     "refresh-generated": lambda: migrate(refresh=True)}[args.action]()
