"""Compile only canonical authored v5 Markdown. Legacy sources are archival."""
from __future__ import annotations
import argparse
from collections import Counter
from pathlib import Path

from format_v5 import BANK, VERSION, read_bank, write_json, section_targets, content_assets

OUT = BANK / "web-data"
EXAM_LABELS = {"midterm": "期中", "final": "期末", "stage-test": "阶段测验",
               "lab-quiz": "Lab测验", "quiz": "小测", "practice": "练习", "other": "其他"}


def generated_payloads(modules, papers, questions):
    by_id = {q["id"]: q for q in questions}
    published = {q["id"] for q in questions if q["publication"]["state"] == "published"}
    module_entries = []
    for module in modules:
        ids = [q["id"] for q in questions if module["id"] in q["classification"]["moduleIds"]]
        module_entries.append(dict(module, questionIds=ids, questionCount=len(ids),
                                   publishedQuestionCount=len(set(ids) & published),
                                   quizQuestionCount=len(set(ids) & published)))
    paper_entries = []
    for paper in papers:
        ids = paper["questionIds"]
        counts = Counter(by_id[qid]["type"] for qid in ids if qid in published)
        stats = {"questionCount": len(ids), "publishedQuestionCount": len(set(ids) & published),
                 "quizQuestionCount": len(set(ids) & published),
                 "verifiedAnswerCount": sum(by_id[qid]["solution"]["state"] == "available" for qid in ids),
                 "singleChoiceCount": counts["single-choice"], "multipleChoiceCount": counts["multiple-choice"],
                 "fillCount": counts["fill"], "shortAnswerCount": counts["short-answer"],
                 "compositeCount": counts["composite"]}
        paper_entries.append(dict(paper, stats=stats))
    catalog = {
        "schemaVersion": VERSION, "title": "PKU ICS 历年题题库", "contentFormat": "Markdown",
        "questionsFile": "questions.json", "papersFile": "papers.json", "assetBase": "./web-data/",
        "modules": module_entries,
        "filters": {"examTypes": sorted({EXAM_LABELS[p["examKind"]] for p in papers}),
                    "years": sorted({p["year"] for p in papers if p["year"] is not None})},
        "stats": {"questions": len(questions), "publishedQuestions": len(published),
                  "quizQuestions": len(published), "withheldQuestions": len(questions) - len(published),
                  "papers": len(papers), "quizGroups": sum(q["type"] == "composite" and q["id"] in published for q in questions)}
    }
    return {"catalog.json": catalog, "questions.json": {"schemaVersion": VERSION, "questions": questions},
            "papers.json": {"schemaVersion": VERSION, "papers": paper_entries}}


def main():
    modules, papers, questions = read_bank()
    payloads = generated_payloads(modules, papers, questions)
    for filename, payload in payloads.items():
        write_json(OUT / filename, payload)
    print("Compiled v5: %d authored questions, %d published, %d papers (no v3 adapters)" % (
        len(questions), payloads["catalog.json"]["stats"]["publishedQuestions"], len(papers)))


def deployed_payloads(modules, papers, questions):
    published = [q for q in questions if q["publication"]["state"] == "published"]
    ids = {q["id"] for q in published}
    filtered_papers = [dict(p, questionIds=[qid for qid in p["questionIds"] if qid in ids]) for p in papers]
    filtered_papers = [p for p in filtered_papers if p["questionIds"]]
    result = generated_payloads(modules, filtered_papers, published)
    result["catalog.json"]["stats"].update(sourceQuestions=len(questions), withheldQuestions=len(questions) - len(published))
    return result


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--deploy", type=Path)
    args = parser.parse_args()
    if args.deploy:
        destination = args.deploy.resolve()
        if destination != (BANK.parent / "_site" / "web-data").resolve():
            raise ValueError("deployment output must be _site/web-data")
        for filename, payload in deployed_payloads(*read_bank()).items():
            write_json(destination / filename, payload)
    else:
        main()
