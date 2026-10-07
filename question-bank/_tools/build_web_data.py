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
OUT = os.path.join(BASE, "web-data")
QUESTIONS_OUT = os.path.join(OUT, "questions")
SCHEMA_VERSION = 2

IMAGE = re.compile(r"(!\[[^\]]*\]\()([^\s)]+)([^)]*\))")
INLINE_ANSWER = re.compile(r"(?:答案|参考答案|Answer)\s*[：:]", re.IGNORECASE)

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


def main():
    os.makedirs(QUESTIONS_OUT, exist_ok=True)
    all_materials = build_modules.load()

    aliases = collections.defaultdict(list)
    materials = []
    for material in all_materials:
        if material.get("dup_of"):
            aliases[material["dup_of"]].append(material["rel"])
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
    ids_seen = set()
    missing_assets = []

    for material in materials:
        if material["kind"] != "questions":
            continue
        for item in material["items"]:
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
                # answer.inline：显式 answer 段优先；没有该段时退回原有「正文含答案标记」
                # 判定，保证与旧路径的池子语义完全一致（否则会悄无声息地少一批题）。
                inline = (bool(cur["answer"].strip())
                          or bool(INLINE_ANSWER.search(content)))
            else:
                content = normalize_markdown_assets(
                    build_modules.slice_of(material, start, end), material["rel"])
                inline = bool(INLINE_ANSWER.search(content))

            assets = asset_paths(content)
            for asset in assets:
                if not os.path.isfile(os.path.join(BASE, *asset.split("/"))):
                    missing_assets.append((question_id, asset))

            related_answers = list(answer_ids_by_source.get(material["rel"], []))
            related_answers.extend(supplemental_answer_ids.get(material["rel"], []))
            question = {
                "id": question_id,
                "moduleId": module["id"],
                "year": material["year"] or None,
                "examType": material["cat"],
                "exam": material["label"],
                "questionNo": item.get("qno", ""),
                "summary": item.get("note", ""),
                "content": content,
                "assets": assets,
                "formatted": formatted,
                "answer": {
                    "inline": inline,
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
                question["source"]["curated"] = posixpath.join("_curated", curated_rel)
            questions_by_module[module["id"]].append(question)

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
            "papers": len(paper_keys),
            "answerBlocks": len(answer_blocks),
        },
        "answerBlocksFile": "answer-blocks.json",
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
