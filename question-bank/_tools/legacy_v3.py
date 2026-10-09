# -*- coding: utf-8 -*-
"""把现有的分类结果导出为适合网页消费的 JSON 数据。

源数据仍然只有两类：
  - 原文/**/*.md：题目文字与图片引用；
  - _cls/*.json：题目区间、模块、题号与摘要。

本脚本不解析生成后的模块 Markdown，以免把展示格式反向当成数据源。输出全部写入
web-data/，其中 catalog.json 是入口，每个模块的题目单独一个文件，避免首页一次加载
整套题库。
"""
import collections
import hashlib
import io
import json
import os
import posixpath
import re

import build_modules
import curated


HERE = os.path.dirname(os.path.abspath(__file__))
BASE = os.path.dirname(HERE)
OUT = os.path.join(BASE, "migration", "legacy-v3-output")
QUESTIONS_OUT = os.path.join(OUT, "questions")
SCHEMA_VERSION = 3
PUBLISHED_KINDS = (
    "single-choice", "multiple-choice", "fill", "short-answer", "composite")
PUBLISHED_CHOICE_KINDS = ("single-choice", "multiple-choice")
CODE_DECLARATION = re.compile(
    r"\b(?:int|char|short|long|float|double|void|struct|union)\s+[*A-Za-z_]",
    re.IGNORECASE)
ASSEMBLY_LINE = re.compile(
    r"(?m)^\s*(?:mov|lea|push|pop|call|ret|jmp|cmp|add|sub|xor)[a-z]*\b",
    re.IGNORECASE)
PAGE_ARTIFACT = re.compile(r"<!--\s*=+\s*page\s+\d+\s*=+\s*-->", re.IGNORECASE)

IMAGE = re.compile(r"(!\[[^\]]*\]\()([^\s)]+)([^)]*\))")
INLINE_ANSWER = re.compile(
    r"(?:^|\n)\s*(?:参考答案|答案|答|Answer)\s*[：:]", re.IGNORECASE)

MODULE_META = []
for number, (name, file_slug, title) in enumerate(build_modules.MODULES, 1):
    MODULE_META.append({
        "id": file_slug.split("-", 1)[1].lower().replace("-", "_"),
        "number": number,
        "name": name,
        "title": title,
        "fileSlug": file_slug,
    })
MODULE_BY_NAME = {m["name"]: m for m in MODULE_META}


def write_json(path, value):
    with io.open(path, "w", encoding="utf-8", newline="\n") as f:
        json.dump(value, f, ensure_ascii=False, indent=2)
        f.write("\n")


def short_id(prefix, *parts):
    raw = "\0".join(str(p) for p in parts).encode("utf-8")
    return "%s-%s" % (prefix, hashlib.sha256(raw).hexdigest()[:16])


def normalize_markdown_assets(markdown, source_rel):
    """把相对原文文件的图片路径改成相对题库根目录的 assets/... 路径。

    两种来源都要认：
      - 机器生成的 `原文` 写 `../../assets/<cat>/…`（相对 .md 文件的正确相对路径），
        需要 prefix 后 normpath 归一；
      - 人工誊写的 3 个文件写根相对的 `assets/<cat>/…`，**已经是目标形态，
        再 prefix 会变成 `原文/<cat>/assets/…`（磁盘上不存在，图会 404）**。
    所以以 `assets/` 开头的直接放行。
    """
    source_path = posixpath.join("原文", source_rel)

    def replace(match):
        target = match.group(2)
        if "://" in target or target.startswith(("/", "#", "data:")):
            return match.group(0)
        if target.startswith("assets/"):
            return match.group(0)          # 已经是仓库根相对
        normalized = posixpath.normpath(posixpath.join(posixpath.dirname(source_path), target))
        return match.group(1) + normalized + match.group(3)

    return IMAGE.sub(replace, markdown)


def asset_paths(markdown):
    paths = []
    for match in IMAGE.finditer(markdown):
        target = match.group(2)
        if target.startswith("assets/") and target not in paths:
            paths.append(target)
    return paths


def meaningful_answer(markdown):
    """答案不能只剩“答案：”标签；图片答案也算有效。"""
    text = re.sub(r"(?:参考答案|答案|答|Answer)\s*[：:]", "", markdown or "", flags=re.IGNORECASE)
    text = re.sub(r"<!--\s*=+\s*page\s+\d+\s*=+\s*-->", "", text, flags=re.IGNORECASE)
    if asset_paths(text):
        return True
    return bool(text.strip())


def answer_status(markdown):
    """只发布明确可用的答案；可疑拆分必须进入人工复核。"""
    if not meaningful_answer(markdown):
        return "missing"
    markers = len(INLINE_ANSWER.findall(markdown or ""))
    if markers > 1:
        return "needs-review"
    return "verified"


def inline_answer_fragment(markdown):
    match = INLINE_ANSWER.search(markdown or "")
    if not match:
        return ""
    start = match.start() + (1 if (markdown or "")[match.start():].startswith("\n") else 0)
    return (markdown or "")[start:]


def split_inline_answer(markdown):
    match = INLINE_ANSWER.search(markdown or "")
    if not match:
        return (markdown or "", "")
    start = match.start() + (1 if (markdown or "")[match.start():].startswith("\n") else 0)
    return ((markdown or "")[:match.start()].strip(), (markdown or "")[start:].strip())


CHOICE_ANSWER = re.compile(
    # 标签形态：答案：C / 答案：选C / 答案为C / 答案是C / 正确答案：C
    r"(?:参考|正确)?答案\s*(?:[:：]\s*(?:选|为)?|(?:为|是)\s*)\s*"
    # 带分隔符的多选（A、B / A&B）优先；否则取同一行内连续的字母串。
    # 必须用 [ \t] 而不是 \s：`答案：D` 后面紧跟的解析行常以 `A...` 开头，
    # 用 \s 会把它吞进答案，字母串变成 `DA` 而被误判为乱序。
    r"([A-H](?![A-Z0-9])(?:[ \t]*(?:[、,，/&+]|和|及)[ \t]*[A-H](?![A-Z0-9]))+"
    r"|[A-H]+(?![A-Z0-9]))",
    re.IGNORECASE)
BARE_ANSWER = re.compile(r"^\s*(?:选)?\s*([A-H]{1,8})\s*[。．.!！]?\s*$", re.IGNORECASE)


def answer_letters(answer, choice_ids):
    """正确选项字母，按选项顺序归一。

    原文里答案有四种写法，都要认（前端 simpleExpected 是同一套口径，这里必须一致，
    否则会出现「前端判分能对上、correctChoiceIds 却是空」的静默错位）：
      答案：C / 答案：选C / 答案为C / 正确答案：C，……      —— 带标签
      c                                                     —— 小写字母
      B                                                     —— 只有字母、没有标签
    连写多选（ABD）按字母序判定为多选题答案；乱序的（如 FFFA）不是答案，丢弃。
    """
    text = (answer or "").strip()
    match = CHOICE_ANSWER.search(text) or BARE_ANSWER.match(text)
    if not match:
        return []
    raw = match.group(1)
    letters = re.sub(r"[^A-H]", "", raw.upper())
    if not letters:
        return []
    # 连写多选（无分隔符）通常按字母序；乱序的（如 FFFA、FBAC）不是选项答案，丢弃。
    # 带分隔符的写法（A、B 或 A&D）已经表达了边界，直接接受并排序。
    has_separator = bool(re.search(r"[、,，/&+]|和|及", raw))
    if len(letters) > 1 and not has_separator and "".join(sorted(set(letters))) != letters:
        return []
    if any(c not in choice_ids for c in letters):
        return []
    return sorted(set(letters))


def interaction_for(layout):
    if not layout:
        return {"kind": "legacy", "declared": False}
    mode = layout.get("mode")
    if mode == "choice":
        selection = layout.get("selection")
        interaction = {
            "kind": (selection + "-choice") if selection else "choice",
            "declared": bool(selection),
            "choices": [
                {"id": choice["key"], "content": choice["content"]}
                for choice in layout.get("choices", [])
            ],
        }
        answer_match = answer_letters(layout.get("answer", ""), 
                                      [c["key"] for c in layout.get("choices", [])])
        if answer_match:
            interaction["correctChoiceIds"] = list(answer_match)
        return interaction
    interaction = {"kind": {
        "fill": "fill",
        "short": "short-answer",
        "composite": "composite",
    }.get(mode, "legacy"), "declared": True}
    if mode == "fill" and layout.get("blankAnswers"):
        interaction["blankAnswers"] = list(layout["blankAnswers"])
    return interaction


def presentation_for(layout, interaction):
    """发布前的保守排版门禁；可疑题保留在源题库，但不进入线上题池。"""
    if not layout:
        return {"status": "needs-review", "issues": ["not-structured"]}
    stem = layout.get("stem", "")
    issues = []
    if PAGE_ARTIFACT.search(stem):
        issues.append("page-artifact-in-stem")
    if re.search(r"<img\b", stem, re.IGNORECASE):
        issues.append("raw-html-image")
    if interaction.get("kind") in PUBLISHED_CHOICE_KINDS and "```" not in stem:
        # 打分前先剥掉**已经是显式结构**的部分：
        #   * Markdown 表格行（`| … |`）—— 表格本身保留了行列结构，不是「丢了围栏的代码」；
        #   * 行内代码 `` `…` `` —— 已经显式标出来了。
        # 否则「信号量 P/V 表」这类题会因为表格单元格里的 `;` 被误判成未围栏代码。
        scored = re.sub(r"(?m)^\s*\|.*$", "", stem)
        scored = re.sub(r"`[^`\n]*`", "", scored)
        score = min(scored.count(";"), 3)
        score += 2 if "{" in scored or "}" in scored else 0
        score += 2 if ASSEMBLY_LINE.search(scored) else 0
        score += 1 if CODE_DECLARATION.search(scored) else 0
        # 只统计一行开头的水平缩进；\s 会跨过空行，把普通段落误当代码。
        score += 1 if re.search(r"(?m)^[ \t]{2,}\S", scored) else 0
        if score >= 3:
            issues.append("code-like-content-without-fence")
    return {"status": "needs-review" if issues else "ready", "issues": issues}


def is_published_question(question):
    return (question.get("interaction", {}).get("kind") in PUBLISHED_KINDS
            and question.get("presentation", {}).get("status") == "ready")


def main():
    os.makedirs(QUESTIONS_OUT, exist_ok=True)
    all_materials = build_modules.load()
    materials_by_rel = {material["rel"]: material for material in all_materials}

    aliases = collections.defaultdict(list)
    materials = []
    for material in all_materials:
        if material.get("dup_of"):
            aliases[material["dup_of"]].append(material["rel"])
        elif not material.get("publish_as_paper", True):
            continue
        else:
            materials.append(material)

    answer_blocks = []
    answer_ids_by_source = collections.defaultdict(list)

    for material in materials:
        for index, section in enumerate(material["ans"], 1):
            start, end = section.get("start"), section.get("end")
            if not isinstance(start, int) or not isinstance(end, int):
                continue
            if start < 1 or start > end or end > len(material["lines"]):
                continue
            block_id = short_id("a", material["rel"], start, end)
            content = normalize_markdown_assets(
                build_modules.slice_of(material, start, end), material["rel"])
            block = {
                "id": block_id,
                "label": section.get("note") or "参考答案 / 解析 %d" % index,
                "content": content,
                "assets": asset_paths(content),
                "source": {
                    "document": posixpath.join("原文", material["rel"]),
                    "lines": {"start": start, "end": end},
                },
            }
            answer_blocks.append(block)
            answer_ids_by_source[material["rel"]].append(block_id)

    # 勘误材料通过 applies_to 指向它所补充的试卷。
    supplemental_answer_ids = collections.defaultdict(list)
    for material in materials:
        if material["kind"] == "questions":
            continue
        ids = answer_ids_by_source.get(material["rel"], [])
        for target in material["applies_to"]:
            supplemental_answer_ids[target].extend(ids)

    questions_by_module = collections.defaultdict(list)
    papers = collections.OrderedDict()
    ids_seen = set()
    group_registry = collections.defaultdict(lambda: {"title": None, "orders": set(), "members": []})
    missing_assets = []

    for material in materials:
        if material["kind"] != "questions":
            continue
        # 同一套卷子可能按章节拆成多个维护文件。canonical_paper 显式指向
        # 其正式试卷来源；这些文件共享一个 paperId，但题目仍保留各自 source。
        canonical_rel = material.get("canonical_paper") or material["rel"]
        canonical_material = materials_by_rel.get(canonical_rel, material)
        paper_id = short_id("p", canonical_material["cat"], canonical_material["stem"])
        paper = papers.setdefault(paper_id, {
            "id": paper_id,
            "year": canonical_material["year"] or None,
            "examType": canonical_material["cat"],
            # `title` 是下拉里的短名，可以为空（前端会跳过空字段，只显示「年份 · 类别」）；
            # `displayName` 永远非空，给报告、日志这类需要完整名字的地方用。
            "title": canonical_material["label"],
            "displayName": build_modules.display_name(canonical_material),
            "questionIds": [],
            "verifiedAnswerCount": 0,
            "singleChoiceCount": 0,
            "multipleChoiceCount": 0,
            "fillCount": 0,
            "shortAnswerCount": 0,
            "compositeCount": 0,
        })
        for item in material["items"]:
            paper_order = len(paper["questionIds"]) + 1
            module = MODULE_BY_NAME.get(item.get("module"))
            start, end = item.get("start"), item.get("end")
            if not module or not isinstance(start, int) or not isinstance(end, int):
                continue
            if start < 1 or start > end or end > len(material["lines"]):
                continue

            # source + qno 通常已经唯一；把区间加入哈希可明确区分同题号的重复段落。
            question_id = short_id("q", material["rel"], item.get("qno", ""), start, end)
            if question_id in ids_seen:
                raise ValueError("duplicate question id: %s" % question_id)
            ids_seen.add(question_id)

            curated_rel = item.get("curated")
            layout = None
            formatted = False
            question_group = None
            if curated_rel:
                cpath = os.path.join(BASE, "_curated", *curated_rel.split("/"))
                if not os.path.isfile(cpath):
                    raise ValueError("curated 指向的文件不存在: %s" % curated_rel)
                cur = curated.load(cpath)
                errs = curated.check_assertions(cur)
                if errs:
                    raise ValueError("curated %s 不合格: %s" % (curated_rel, errs))
                # curated 里的图片路径在 scaffold 阶段已归一为仓库根相对 assets/…，
                # 这里**不能**再走 normalize_markdown_assets（会二次拼接）。
                content = curated.build_content(cur)
                layout = curated.build_layout(cur)
                formatted = True
                if cur.get("group"):
                    question_group = {
                        "id": "%s:%s" % (paper_id, cur["group"]),
                        "questionId": short_id("q", paper_id, "group", cur["group"]),
                        "title": cur["group_title"],
                        "order": cur["group_order"],
                    }
                    group_key = (paper_id, cur["group"])
                    registered = group_registry[group_key]
                    if registered["title"] not in (None, cur["group_title"]):
                        raise ValueError("同一组合题的 group_title 不一致: %s" % (group_key,))
                    if cur["group_order"] in registered["orders"]:
                        raise ValueError("同一组合题的 group_order 重复: %s order=%s" % (
                            group_key, cur["group_order"]))
                    registered["title"] = cur["group_title"]
                    registered["orders"].add(cur["group_order"])
                    registered["members"].append(question_id)
                # answer.inline：显式 answer 段优先；没有该段时退回原有「正文含答案标记」
                # 判定，保证与旧路径的池子语义完全一致（否则会悄无声息地少一批题）。
                answer_source = cur["answer"]
                if not meaningful_answer(answer_source) and INLINE_ANSWER.search(content):
                    answer_source = inline_answer_fragment(content)
                status = answer_status(answer_source)
                if status == "verified" and not meaningful_answer(cur["answer"]):
                    split_prompt, split_answer = split_inline_answer(content)
                    layout = dict(layout)
                    layout["stem"] = split_prompt
                    layout["answer"] = split_answer
                inline = status == "verified"
            else:
                content = normalize_markdown_assets(
                    build_modules.slice_of(material, start, end), material["rel"])
                status = answer_status(inline_answer_fragment(content)) if INLINE_ANSWER.search(content) else "missing"
                inline = status == "verified"

            assets = asset_paths(content)
            for asset in assets:
                if not os.path.isfile(os.path.join(BASE, *asset.split("/"))):
                    missing_assets.append((question_id, asset))

            related_answers = list(answer_ids_by_source.get(material["rel"], []))
            related_answers.extend(supplemental_answer_ids.get(material["rel"], []))
            question = {
                "id": question_id,
                "paperId": paper_id,
                "paperOrder": paper_order,
                "moduleId": module["id"],
                "year": canonical_material["year"] or None,
                "examType": canonical_material["cat"],
                "exam": build_modules.display_name(canonical_material),
                "questionNo": item.get("qno", ""),
                "summary": item.get("note", ""),
                "content": content,
                "assets": assets,
                "formatted": formatted,
                "answer": {
                    "inline": inline,
                    "status": status,
                    "relatedBlockIds": list(dict.fromkeys(related_answers)),
                },
                "source": {
                    "document": posixpath.join("原文", material["rel"]),
                    "lines": {"start": start, "end": end},
                    "aliases": [posixpath.join("原文", p) for p in aliases.get(material["rel"], [])],
                },
            }
            if formatted:
                question["layout"] = layout
                declared_interaction = interaction_for(layout)
                if question_group:
                    # 分组片段不是独立作答单元。保留片段原始题型供维护和后续
                    # v4 迁移使用，但发布接口把它声明为组合题的一部分，避免对
                    # 单个片段做错误的自动判分或统计。
                    question["partInteraction"] = declared_interaction
                    question["interaction"] = {
                        "kind": "composite",
                        "declared": True,
                        "partKind": declared_interaction.get("kind"),
                    }
                else:
                    question["interaction"] = declared_interaction
                question["contentV3"] = {
                    "format": "markdown",
                    "prompt": layout.get("stem", ""),
                    "answer": layout.get("answer", ""),
                }
                question["source"]["curated"] = posixpath.join("_curated", curated_rel)
            else:
                question["interaction"] = interaction_for(None)
            if question_group:
                question["group"] = question_group
            question["presentation"] = presentation_for(layout, question["interaction"])
            questions_by_module[module["id"]].append(question)
            paper["questionIds"].append(question_id)
            kind = question.get("interaction", {}).get("kind")
            if is_published_question(question) and kind == "single-choice":
                paper["singleChoiceCount"] += 1
            elif is_published_question(question) and kind == "multiple-choice":
                paper["multipleChoiceCount"] += 1
            elif is_published_question(question) and kind == "fill":
                paper["fillCount"] += 1
            elif is_published_question(question) and kind == "short-answer":
                paper["shortAnswerCount"] += 1
            elif is_published_question(question) and kind == "composite":
                paper["compositeCount"] += 1
            if status == "verified":
                paper["verifiedAnswerCount"] += 1

    for group_key, registered in group_registry.items():
        member_count = len(registered["members"])
        if member_count < 2:
            raise ValueError("组合题至少需要两个片段: %s" % (group_key,))
        expected_orders = set(range(1, member_count + 1))
        if registered["orders"] != expected_orders:
            raise ValueError("组合题 group_order 必须从 1 连续编号: %s orders=%s" % (
                group_key, sorted(registered["orders"])))

    if missing_assets:
        preview = ", ".join("%s: %s" % x for x in missing_assets[:5])
        raise ValueError("missing %d referenced assets (%s)" % (len(missing_assets), preview))

    module_entries = []
    categories = set()
    years = set()
    paper_keys = set()
    total_questions = 0
    for module in MODULE_META:
        questions = questions_by_module[module["id"]]
        filename = module["fileSlug"] + ".json"
        payload = {
            "schemaVersion": SCHEMA_VERSION,
            "module": {k: module[k] for k in ("id", "number", "name", "title")},
            "questions": questions,
        }
        write_json(os.path.join(QUESTIONS_OUT, filename), payload)
        paper_count = len({(q["examType"], q["exam"]) for q in questions})
        entry = {k: module[k] for k in ("id", "number", "name", "title")}
        entry.update({
            "questionCount": len(questions),
            "choiceQuestionCount": sum(
                1 for q in questions
                if q.get("interaction", {}).get("kind") in PUBLISHED_CHOICE_KINDS),
            "declaredQuestionCount": sum(
                1 for q in questions
                if q.get("interaction", {}).get("kind") in PUBLISHED_KINDS),
            "publishedQuestionCount": sum(
                1 for q in questions if is_published_question(q)),
            "paperCount": paper_count,
            "questionFile": "questions/" + filename,
        })
        module_entries.append(entry)
        total_questions += len(questions)
        for q in questions:
            categories.add(q["examType"])
            if q["year"] is not None:
                years.add(q["year"])
            paper_keys.add((q["examType"], q["exam"]))

    write_json(os.path.join(OUT, "answer-blocks.json"), {
        "schemaVersion": SCHEMA_VERSION,
        "answerBlocks": answer_blocks,
    })
    paper_entries = []
    for paper in papers.values():
        paper["questionCount"] = len(paper["questionIds"])
        paper["publishedQuestionCount"] = sum(
            paper[name] for name in (
                "singleChoiceCount", "multipleChoiceCount", "fillCount",
                "shortAnswerCount", "compositeCount"))
        paper["complete"] = paper["verifiedAnswerCount"] == paper["questionCount"]
        paper_entries.append(paper)
    paper_entries.sort(key=lambda p: (
        -(p["year"] or 0), build_modules.CAT_ORDER.get(p["examType"], 99), p["title"]))
    write_json(os.path.join(OUT, "papers.json"), {
        "schemaVersion": SCHEMA_VERSION,
        "papers": paper_entries,
    })
    write_json(os.path.join(OUT, "catalog.json"), {
        "schemaVersion": SCHEMA_VERSION,
        "title": "PKU ICS 历年题题库",
        "contentFormat": "Markdown",
        "assetBase": "../",
        "modules": module_entries,
        "filters": {
            "examTypes": sorted(categories, key=lambda x: build_modules.CAT_ORDER.get(x, 99)),
            "years": sorted(years),
        },
        "stats": {
            "questions": total_questions,
            "publishedChoiceQuestions": sum(
                sum(1 for q in questions_by_module[module["id"]]
                    if is_published_question(q)
                    and q.get("interaction", {}).get("kind") in PUBLISHED_CHOICE_KINDS)
                for module in module_entries),
            "withheldChoiceQuestions": sum(
                sum(1 for q in questions_by_module[module["id"]]
                    if q.get("interaction", {}).get("kind") in PUBLISHED_CHOICE_KINDS
                    and not is_published_question(q))
                for module in module_entries),
            "publishedQuestions": sum(
                module["publishedQuestionCount"] for module in module_entries),
            "withheldQuestions": sum(
                module["declaredQuestionCount"] - module["publishedQuestionCount"]
                for module in module_entries),
            "papers": len(paper_keys),
            "answerBlocks": len(answer_blocks),
        },
        "answerBlocksFile": "answer-blocks.json",
        "papersFile": "papers.json",
    })

    # 防止删除模块后旧 JSON 悄悄残留。
    expected = {m["fileSlug"] + ".json" for m in MODULE_META}
    unexpected = [name for name in os.listdir(QUESTIONS_OUT)
                  if name.endswith(".json") and name not in expected]
    if unexpected:
        raise ValueError("unexpected generated question files: %s" % ", ".join(unexpected))

    print("built web data: %d questions, %d answer blocks, %d modules" % (
        total_questions, len(answer_blocks), len(module_entries)))


if __name__ == "__main__":
    main()
