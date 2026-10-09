"""Validate every authored file, every emitted record, indices, and asset links."""
import argparse
import json
from pathlib import Path

from build_web_data import generated_payloads, deployed_payloads
from format_v5 import BANK, VERSION, load_json, read_bank, validate_question, validate_links


def main(web=None):
    modules, papers, questions = read_bank()
    expected = generated_payloads(modules, papers, questions)
    web = Path(web) if web else BANK / "web-data"
    if any((web / old).exists() for old in ("groups.json", "answer-blocks.json", "questions")):
        raise ValueError("obsolete v3 generated files must not remain")
    if web.resolve() == (BANK / "web-data").resolve():
        for filename, payload in expected.items():
            if load_json(web / filename) != payload:
                raise ValueError("generated data is stale: " + filename)
    else:
        for filename, payload in deployed_payloads(modules, papers, questions).items():
            if load_json(web / filename) != payload:
                raise ValueError("deployed data differs from canonical published subset: " + filename)
        # Deployed data is the published subset, never old compatibility objects.
        payload = load_json(web / "questions.json")
        if payload["schemaVersion"] != VERSION:
            raise ValueError("deployed data is not v5")
        emitted = payload["questions"]
        expected_published = [q for q in questions if q["publication"]["state"] == "published"]
        if emitted != expected_published:
            raise ValueError("deployed question set/content drifted")
        for question in emitted:
            validate_question(question, {module["id"] for module in modules})
        ids = {q["id"] for q in emitted}
        deployed_papers = load_json(web / "papers.json")["papers"]
        for paper in deployed_papers:
            original = next(p for p in papers if p["id"] == paper["id"])
            if paper["questionIds"] != [qid for qid in original["questionIds"] if qid in ids]:
                raise ValueError("deployed paper order drifted")
        if any((web / old).exists() for old in ("groups.json", "answer-blocks.json", "questions")):
            raise ValueError("obsolete v3 output must not be deployed")
    print("v5 full validation: %d questions, %d papers; all schemas, cross-references, Markdown anchors and assets valid" % (len(questions), len(papers)))


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--web")
    args = parser.parse_args()
    main(args.web)
