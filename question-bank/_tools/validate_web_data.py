# -*- coding: utf-8 -*-
"""校验 web-data v3 的题目、试卷清单、答案状态与资源引用。"""
import io
import json
import os
import sys


HERE = os.path.dirname(os.path.abspath(__file__))
BASE = os.path.dirname(HERE)
WEB = os.path.join(BASE, "web-data")


def load(rel):
    with io.open(os.path.join(WEB, *rel.split("/")), encoding="utf-8") as f:
        return json.load(f)


def main():
    errors = []
    warnings = []
    catalog = load("catalog.json")
    if catalog.get("schemaVersion") != 3:
        errors.append("catalog schemaVersion 必须为 3")

    questions = {}
    published_total = 0
    withheld_total = 0
    for module in catalog.get("modules", []):
        payload = load(module["questionFile"])
        module_published = 0
        module_choices = 0
        for q in payload.get("questions", []):
            qid = q.get("id")
            if not qid or qid in questions:
                errors.append("题目 ID 缺失或重复: %r" % qid)
                continue
            questions[qid] = q
            status = (q.get("answer") or {}).get("status")
            direct = ((q.get("contentV3") or {}).get("answer")
                      or (q.get("layout") or {}).get("answer") or "")
            if status == "verified" and not direct.strip():
                errors.append("%s 标记 verified 但没有结构化答案" % qid)
            kind = (q.get("interaction") or {}).get("kind")
            interaction = q.get("interaction") or {}
            presentation = q.get("presentation") or {}
            if presentation.get("status") not in ("ready", "needs-review"):
                errors.append("%s 缺少合法 presentation.status" % qid)
            if kind in ("choice", "legacy"):
                warnings.append("%s 尚未显式声明交互类型" % qid)
            if kind in ("single-choice", "multiple-choice"):
                module_choices += 1
                if presentation.get("status") == "ready":
                    module_published += 1
                    published_total += 1
                else:
                    withheld_total += 1
                choice_ids = [c.get("id") for c in interaction.get("choices", [])]
                correct_ids = interaction.get("correctChoiceIds", [])
                if len(choice_ids) < 2 or len(choice_ids) != len(set(choice_ids)):
                    errors.append("%s 的选择题选项缺失或 ID 重复" % qid)
                if status == "verified" and not correct_ids:
                    errors.append("%s 已校对但没有 correctChoiceIds" % qid)
                if any(cid not in choice_ids for cid in correct_ids):
                    errors.append("%s 的 correctChoiceIds 引用了不存在的选项" % qid)
                if kind == "single-choice" and len(correct_ids) > 1:
                    errors.append("%s 声明为单选但有多个正确选项" % qid)
            for asset in q.get("assets", []):
                if not asset.startswith("assets/") or ".." in asset.split("/"):
                    errors.append("%s 资源路径越界: %s" % (qid, asset))
                elif not os.path.isfile(os.path.join(BASE, *asset.split("/"))):
                    errors.append("%s 资源不存在: %s" % (qid, asset))
        if module_published != module.get("publishedQuestionCount"):
            errors.append("%s publishedQuestionCount 不准确" % module.get("id"))
        if module_choices != module.get("choiceQuestionCount"):
            errors.append("%s choiceQuestionCount 不准确" % module.get("id"))

    if published_total != (catalog.get("stats") or {}).get("publishedChoiceQuestions"):
        errors.append("catalog.stats.publishedChoiceQuestions 不准确")
    if withheld_total != (catalog.get("stats") or {}).get("withheldChoiceQuestions"):
        errors.append("catalog.stats.withheldChoiceQuestions 不准确")

    papers_payload = load(catalog.get("papersFile", "papers.json"))
    seen_paper_questions = set()
    for paper in papers_payload.get("papers", []):
        ids = paper.get("questionIds", [])
        if len(ids) != paper.get("questionCount"):
            errors.append("%s questionCount 与 questionIds 数量不一致" % paper.get("id"))
        if len(ids) != len(set(ids)):
            errors.append("%s 内有重复题目 ID" % paper.get("id"))
        verified = 0
        single_choices = 0
        multiple_choices = 0
        orders = []
        for qid in ids:
            q = questions.get(qid)
            if not q:
                errors.append("%s 引用了不存在的题目 %s" % (paper.get("id"), qid))
                continue
            if q.get("paperId") != paper.get("id"):
                errors.append("%s 的 paperId 与清单不一致" % qid)
            orders.append(q.get("paperOrder"))
            if (q.get("answer") or {}).get("status") == "verified":
                verified += 1
            kind = (q.get("interaction") or {}).get("kind")
            ready = (q.get("presentation") or {}).get("status") == "ready"
            if ready and kind == "single-choice":
                single_choices += 1
            elif ready and kind == "multiple-choice":
                multiple_choices += 1
            seen_paper_questions.add(qid)
        if len(orders) != len(set(orders)):
            errors.append("%s 内 paperOrder 重复" % paper.get("id"))
        if verified != paper.get("verifiedAnswerCount"):
            errors.append("%s verifiedAnswerCount 不准确" % paper.get("id"))
        if bool(verified == len(ids)) != bool(paper.get("complete")):
            errors.append("%s complete 状态不准确" % paper.get("id"))
        if single_choices != paper.get("singleChoiceCount"):
            errors.append("%s singleChoiceCount 不准确" % paper.get("id"))
        if multiple_choices != paper.get("multipleChoiceCount"):
            errors.append("%s multipleChoiceCount 不准确" % paper.get("id"))
        if single_choices + multiple_choices != paper.get("publishedQuestionCount"):
            errors.append("%s publishedQuestionCount 不准确" % paper.get("id"))

    missing = sorted(set(questions) - seen_paper_questions)
    if missing:
        errors.append("有 %d 道题未进入 papers.json" % len(missing))

    print("web-data v3 校验：%d 道题，%d 份试卷，%d 个错误，%d 个迁移提醒" % (
        len(questions), len(papers_payload.get("papers", [])), len(errors), len(warnings)))
    for message in errors[:20]:
        print("ERROR " + message)
    for message in warnings[:5]:
        print("WARN  " + message)
    if len(warnings) > 5:
        print("WARN  另有 %d 条旧题迁移提醒" % (len(warnings) - 5))
    return 1 if errors else 0


if __name__ == "__main__":
    sys.exit(main())
