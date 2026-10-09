# -*- coding: utf-8 -*-
"""v4.1 设计稿的一致性校验（**不读题库、不参与发布**）。

做三件事：
  1. 校验两份 JSON Schema 自身是否合法；
  2. 抽取 docs/QUESTION_AUTHORING_V4_1.md 里标记为 `json v4.1-question` /
     `json v4.1-paper` 的规范示例，逐个校验必须通过；
  3. 抽取标记为 `json v4.1-invalid` / `json v4.1-invalid-paper` 的反面示例，
     确认它们**必须**被拒绝——否则说明 schema 没有真正拦住那类缺陷。

缺少 jsonschema 时打印 SKIP 并以 0 退出（CI 上默认没装这个库，不应因此失败）。
本地安装：pip install jsonschema
"""
import io
import json
import os
import re
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
BANK = os.path.dirname(HERE)
ROOT = os.path.dirname(BANK)
DOC = os.path.join(ROOT, "docs", "QUESTION_AUTHORING_V4_1.md")
SCHEMA_DIR = os.path.join(BANK, "schema")

FENCE = re.compile(r"^```json[ \t]+(v4\.1-[a-z-]+)[ \t]*\n(.*?)^```[ \t]*$",
                   re.S | re.M)

ROUTES = {
    "v4.1-question": ("question-v4.1.schema.json", True),
    "v4.1-paper": ("paper-v4.1.schema.json", True),
    "v4.1-invalid": ("question-v4.1.schema.json", False),
    "v4.1-invalid-paper": ("paper-v4.1.schema.json", False),
}


def main():
    try:
        import jsonschema
    except ImportError:
        print("SKIP 未安装 jsonschema，跳过 v4.1 设计稿一致性校验")
        print("     pip install jsonschema  然后重跑：python _tools/v4_1_conformance.py")
        return 0

    schemas = {}
    bad = 0
    for name in ("question-v4.1.schema.json", "paper-v4.1.schema.json"):
        path = os.path.join(SCHEMA_DIR, name)
        if not os.path.isfile(path):
            print("FAIL 缺少 schema: %s" % path)
            bad += 1
            continue
        doc = json.load(io.open(path, encoding="utf-8"))
        try:
            jsonschema.Draft202012Validator.check_schema(doc)
        except Exception as exc:                      # noqa: BLE001
            print("FAIL %s 不是合法的 JSON Schema: %s" % (name, exc))
            bad += 1
            continue
        schemas[name] = jsonschema.Draft202012Validator(
            doc, format_checker=jsonschema.FormatChecker())
        print("ok   schema %s（$id=%s）" % (name, doc.get("$id", "?")))

    if not os.path.isfile(DOC):
        print("FAIL 找不到设计文档: %s" % DOC)
        return 1

    text = io.open(DOC, encoding="utf-8").read()
    blocks = FENCE.findall(text)
    if not blocks:
        print("FAIL 文档里没有找到任何 v4.1 示例块")
        return 1

    counts = {}
    for tag, body in blocks:
        if tag not in ROUTES:
            print("FAIL 未知的示例标记: %s" % tag)
            bad += 1
            continue
        schema_name, expect_valid = ROUTES[tag]
        counts[tag] = counts.get(tag, 0) + 1
        if schema_name not in schemas:
            continue
        try:
            instance = json.loads(body)
        except ValueError as exc:
            print("FAIL [%s] 示例不是合法 JSON: %s" % (tag, exc))
            bad += 1
            continue
        errors = sorted(schemas[schema_name].iter_errors(instance), key=lambda e: list(e.path))
        got_valid = not errors
        if got_valid == expect_valid:
            label = "ok  " if expect_valid else "ok   （按预期被拒绝）"
            print("%s [%s] %s" % (label, tag, instance.get("id", "?")))
        else:
            bad += 1
            if expect_valid:
                print("FAIL [%s] %s 应当通过却报错：" % (tag, instance.get("id", "?")))
            else:
                print("FAIL [%s] %s 应当被拒绝却通过了" % (tag, instance.get("id", "?")))
            for err in errors[:4]:
                print("       %s: %s" % ("/".join(str(p) for p in err.absolute_path) or "<root>",
                                         err.message[:150]))

    print("")
    print("示例统计: " + ", ".join("%s=%d" % kv for kv in sorted(counts.items())))
    if bad:
        print("v4.1 一致性校验：失败 %d 项" % bad)
        return 1
    print("v4.1 一致性校验：全部通过")
    return 0


if __name__ == "__main__":
    sys.exit(main())
