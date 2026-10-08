# -*- coding: utf-8 -*-
"""Export the current question bank to searchable review PDFs.

This is intentionally a read-only presentation tool. It does not infer types,
rewrite Markdown, fix fences, or write to question-bank/. Every displayed type
and content fragment comes from the generated v3 data as-is.
"""
from __future__ import annotations

import argparse
import collections
import csv
import datetime as dt
import html
import json
import os
from pathlib import Path
import re
import shutil
import sys
from typing import Iterable

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (
    BaseDocTemplate, Flowable, Frame, HRFlowable, Image, Indenter, PageBreak, PageTemplate,
    Paragraph, Preformatted, Spacer, Table, TableStyle,
)


ROOT = Path(__file__).resolve().parents[1]
BANK = ROOT / "question-bank"
WEB_DATA = BANK / "web-data"
DEFAULT_OUTPUT = ROOT / "output" / "pdf" / "question-review"
TYPE_LABELS = {
    "single-choice": "单选题",
    "multiple-choice": "多选题",
    "fill": "填空题",
    "short-answer": "简答题",
    "composite": "复合题",
    "choice": "选择题（单/多选未明确）",
    "legacy": "旧题（题型未明确）",
}
IMAGE_RE = re.compile(r"!\[([^\]]*)\]\(([^\s)]+)(?:\s+[^)]*)?\)")
FENCE_RE = re.compile(r"^\s*```\s*([A-Za-z0-9_+-]*)\s*$")
INLINE_CODE_RE = re.compile(r"`([^`\n]+)`")
BOLD_RE = re.compile(r"\*\*([^*\n]+)\*\*")


class QuestionMarker(Flowable):
    """Zero-height marker used for page manifest entries and PDF bookmarks."""

    def __init__(self, question_id: str, title: str):
        super().__init__()
        self.question_id = question_id
        self.title = title
        self.width = 0
        self.height = 0

    def draw(self):
        pass


class ReviewDocTemplate(BaseDocTemplate):
    def __init__(self, filename: str, *, module_title: str, manifest_rows: list[dict], **kwargs):
        super().__init__(filename, **kwargs)
        self.module_title = module_title
        self.manifest_rows = manifest_rows
        frame = Frame(
            self.leftMargin, self.bottomMargin, self.width, self.height,
            id="content", leftPadding=0, rightPadding=0, topPadding=0, bottomPadding=0,
        )
        self.addPageTemplates(PageTemplate(id="review", frames=[frame], onPage=self._page_chrome))

    def _page_chrome(self, canvas, doc):
        canvas.saveState()
        canvas.setStrokeColor(colors.HexColor("#D8E2EC"))
        canvas.setLineWidth(0.6)
        canvas.line(self.leftMargin, 15 * mm, A4[0] - self.rightMargin, 15 * mm)
        canvas.setFont("ReviewSans", 8)
        canvas.setFillColor(colors.HexColor("#64748B"))
        canvas.drawString(self.leftMargin, 10 * mm, self.module_title)
        canvas.drawRightString(A4[0] - self.rightMargin, 10 * mm, "第 %d 页" % doc.page)
        canvas.restoreState()

    def afterFlowable(self, flowable):
        if isinstance(flowable, QuestionMarker):
            key = "q_" + re.sub(r"[^A-Za-z0-9_]", "_", flowable.question_id)
            self.canv.bookmarkPage(key)
            self.canv.addOutlineEntry(flowable.title, key, level=0, closed=False)
            self.manifest_rows.append({"question_id": flowable.question_id, "page": self.page})


def load_json(path: Path):
    return json.loads(path.read_text(encoding="utf-8"))


def find_font(explicit: str | None = None) -> Path:
    candidates = []
    if explicit:
        candidates.append(Path(explicit))
    env_font = os.environ.get("ICS_REVIEW_PDF_FONT")
    if env_font:
        candidates.append(Path(env_font))
    candidates.extend([
        Path(r"C:\Windows\Fonts\NotoSansSC-VF.ttf"),
        Path(r"C:\Windows\Fonts\msyh.ttc"),
        Path("/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc"),
        Path("/usr/share/fonts/truetype/noto/NotoSansCJK-Regular.ttc"),
        Path("/System/Library/Fonts/PingFang.ttc"),
    ])
    for candidate in candidates:
        if candidate.is_file():
            return candidate
    raise SystemExit(
        "找不到中文字体。请通过 --font 指定 Noto Sans CJK/微软雅黑等字体，"
        "或设置 ICS_REVIEW_PDF_FONT。")


def register_fonts(font_path: Path):
    try:
        pdfmetrics.registerFont(TTFont("ReviewSans", str(font_path)))
        pdfmetrics.registerFont(TTFont("ReviewSansBold", str(font_path)))
    except Exception as exc:
        raise SystemExit("无法加载字体 %s: %s" % (font_path, exc))


def styles():
    base = getSampleStyleSheet()
    return {
        "cover_title": ParagraphStyle(
            "CoverTitle", parent=base["Title"], fontName="ReviewSansBold",
            fontSize=24, leading=32, textColor=colors.HexColor("#173A5E"),
            alignment=TA_CENTER, spaceAfter=12 * mm,
        ),
        "cover_body": ParagraphStyle(
            "CoverBody", parent=base["BodyText"], fontName="ReviewSans",
            fontSize=11, leading=18, textColor=colors.HexColor("#475569"),
            alignment=TA_CENTER, spaceAfter=4 * mm,
        ),
        "question": ParagraphStyle(
            "Question", parent=base["BodyText"], fontName="ReviewSans",
            fontSize=11, leading=18, textColor=colors.HexColor("#17202A"),
            spaceAfter=4 * mm, allowWidows=0, allowOrphans=0,
        ),
        "meta": ParagraphStyle(
            "Meta", parent=base["BodyText"], fontName="ReviewSans",
            fontSize=8.5, leading=12, textColor=colors.HexColor("#334155"),
        ),
        "id": ParagraphStyle(
            "Id", parent=base["BodyText"], fontName="ReviewSansBold",
            fontSize=10, leading=14, textColor=colors.white,
        ),
        "option_key": ParagraphStyle(
            "OptionKey", parent=base["BodyText"], fontName="ReviewSansBold",
            fontSize=10, leading=15, textColor=colors.HexColor("#245B8E"),
        ),
        "option": ParagraphStyle(
            "Option", parent=base["BodyText"], fontName="ReviewSans",
            fontSize=10.5, leading=16, textColor=colors.HexColor("#263442"),
        ),
        "code": ParagraphStyle(
            "Code", parent=base["Code"], fontName="ReviewSans",
            fontSize=8.5, leading=12, textColor=colors.HexColor("#1E293B"),
            leftIndent=4 * mm, rightIndent=4 * mm, spaceBefore=2 * mm, spaceAfter=3 * mm,
            backColor=colors.HexColor("#EEF3F8"), borderPadding=4 * mm,
        ),
        "warning": ParagraphStyle(
            "Warning", parent=base["BodyText"], fontName="ReviewSans",
            fontSize=9, leading=13, textColor=colors.HexColor("#9A3412"),
            backColor=colors.HexColor("#FFF7ED"), borderPadding=3 * mm,
        ),
    }


def inline_markup(text: str) -> str:
    """Escape raw text, then apply only explicitly authored inline Markdown."""
    escaped = html.escape(text, quote=False)
    escaped = INLINE_CODE_RE.sub(
        lambda m: '<font name="ReviewSans" color="#7C2D12">%s</font>' % m.group(1), escaped)
    escaped = BOLD_RE.sub(lambda m: "<b>%s</b>" % m.group(1), escaped)
    return escaped


def scaled_image(path: Path, max_width: float, max_height: float):
    image = Image(str(path))
    factor = min(max_width / image.imageWidth, max_height / image.imageHeight, 1.0)
    image.drawWidth = image.imageWidth * factor
    image.drawHeight = image.imageHeight * factor
    image.hAlign = "LEFT"
    return image


def markdown_flowables(markdown: str, sheet: dict, *, max_width: float) -> list[Flowable]:
    """Render declared Markdown conservatively; never infer code or formulas."""
    lines = str(markdown or "").replace("\r\n", "\n").replace("\r", "\n").split("\n")
    result: list[Flowable] = []
    paragraph: list[str] = []
    code: list[str] | None = None
    code_lang = ""

    def flush_paragraph():
        if paragraph:
            text = " ".join(line.strip() for line in paragraph).strip()
            if text:
                result.append(Paragraph(inline_markup(text), sheet["question"]))
            paragraph.clear()

    def flush_code():
        nonlocal code, code_lang
        if code is not None:
            label = ("[%s]\n" % code_lang) if code_lang else ""
            result.append(Preformatted(label + "\n".join(code), sheet["code"], maxLineLength=110))
            code = None
            code_lang = ""

    for line in lines:
        fence = FENCE_RE.match(line)
        if fence:
            if code is None:
                flush_paragraph()
                code = []
                code_lang = fence.group(1)
            else:
                flush_code()
            continue
        if code is not None:
            code.append(line)
            continue
        image_match = IMAGE_RE.fullmatch(line.strip())
        if image_match:
            flush_paragraph()
            alt, src = image_match.groups()
            asset = (BANK / src).resolve()
            try:
                asset.relative_to(BANK.resolve())
            except ValueError:
                asset = Path("__outside_question_bank__")
            if asset.is_file():
                try:
                    result.append(scaled_image(asset, max_width, 110 * mm))
                    if alt:
                        result.append(Paragraph("图：" + html.escape(alt), sheet["meta"]))
                    result.append(Spacer(1, 3 * mm))
                except Exception as exc:
                    result.append(Paragraph(
                        "图片无法载入：%s（%s）" % (html.escape(src), html.escape(str(exc))),
                        sheet["warning"]))
            else:
                result.append(Paragraph("图片缺失：" + html.escape(src), sheet["warning"]))
            continue
        if not line.strip():
            flush_paragraph()
            continue
        if line.lstrip().startswith("|"):
            flush_paragraph()
            result.append(Preformatted(line, sheet["code"], maxLineLength=110))
        else:
            paragraph.append(line)
    flush_paragraph()
    if code is not None:
        # Preserve the visible defect instead of silently closing an authored fence.
        code.append("[未闭合的代码围栏]")
        flush_code()
    return result or [Paragraph("（空题面）", sheet["warning"])]


def question_flowables(question: dict, module: dict, sheet: dict, usable_width: float) -> list[Flowable]:
    interaction = question.get("interaction") or {}
    kind = interaction.get("kind") or "legacy"
    qid = str(question.get("id") or "missing-id")
    qno = str(question.get("questionNo") or "（无题号）")
    exam = str(question.get("exam") or "（未知试卷）")
    source = question.get("source") or {}
    source_doc = str(source.get("curated") or source.get("document") or "（无源文件）")
    paper_order = question.get("paperOrder")
    type_text = "%s（%s）" % (TYPE_LABELS.get(kind, "未知题型"), kind)
    marker_title = "%s · %s · %s" % (qid, type_text, qno)
    result: list[Flowable] = [QuestionMarker(qid, marker_title)]

    id_cell = Paragraph("ID&nbsp;&nbsp;%s" % html.escape(qid), sheet["id"])
    type_cell = Paragraph("题型&nbsp;&nbsp;%s" % html.escape(type_text), sheet["id"])
    header = Table([[id_cell, type_cell]], colWidths=[usable_width * 0.54, usable_width * 0.46])
    header.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (0, 0), colors.HexColor("#245B8E")),
        ("BACKGROUND", (1, 0), (1, 0), colors.HexColor("#8A4B20")),
        ("BOX", (0, 0), (-1, -1), 0.5, colors.HexColor("#D8E2EC")),
        ("INNERGRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#D8E2EC")),
        ("LEFTPADDING", (0, 0), (-1, -1), 4 * mm),
        ("RIGHTPADDING", (0, 0), (-1, -1), 4 * mm),
        ("TOPPADDING", (0, 0), (-1, -1), 3 * mm),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 3 * mm),
    ]))
    result.extend([header, Spacer(1, 3 * mm)])

    meta_rows = [
        ["试卷", exam, "卷内顺序", str(paper_order or "-")],
        ["原卷题号", qno, "知识模块", "%s / %s" % (module.get("name", ""), module.get("title", ""))],
        ["源文件", source_doc, "paper ID", str(question.get("paperId") or "-")],
    ]
    meta_table = Table(
        [[Paragraph(html.escape(str(cell)), sheet["meta"]) for cell in row] for row in meta_rows],
        colWidths=[20 * mm, usable_width * 0.34, 22 * mm, usable_width * 0.36],
    )
    meta_table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (0, -1), colors.HexColor("#EEF3F8")),
        ("BACKGROUND", (2, 0), (2, -1), colors.HexColor("#EEF3F8")),
        ("BOX", (0, 0), (-1, -1), 0.5, colors.HexColor("#D8E2EC")),
        ("INNERGRID", (0, 0), (-1, -1), 0.35, colors.HexColor("#E5EBF1")),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LEFTPADDING", (0, 0), (-1, -1), 2.5 * mm),
        ("RIGHTPADDING", (0, 0), (-1, -1), 2.5 * mm),
        ("TOPPADDING", (0, 0), (-1, -1), 2 * mm),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 2 * mm),
    ]))
    result.extend([meta_table, Spacer(1, 6 * mm)])

    layout = question.get("layout") or {}
    stem = layout.get("stem") if question.get("formatted") else question.get("content")
    result.extend(markdown_flowables(stem or "", sheet, max_width=usable_width))

    choices = layout.get("choices") or interaction.get("choices") or []
    if choices:
        result.append(Spacer(1, 2 * mm))
        for choice in choices:
            key = str(choice.get("key") or choice.get("id") or "?")
            content = str(choice.get("content") or "")
            option_body = markdown_flowables(content, sheet, max_width=usable_width - 18 * mm)
            # A table cell cannot split across pages. Keep only the option label in
            # a small table and let the authored Markdown flow naturally below it.
            key_table = Table(
                [[Paragraph("选项 " + html.escape(key), sheet["option_key"])]],
                colWidths=[usable_width],
            )
            key_table.setStyle(TableStyle([
                ("BACKGROUND", (0, 0), (-1, -1), colors.HexColor("#EEF5FB")),
                ("BOX", (0, 0), (-1, -1), 0.5, colors.HexColor("#D8E2EC")),
                ("LEFTPADDING", (0, 0), (-1, -1), 3 * mm),
                ("RIGHTPADDING", (0, 0), (-1, -1), 3 * mm),
                ("TOPPADDING", (0, 0), (-1, -1), 2 * mm),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 2 * mm),
            ]))
            result.extend([
                key_table,
                Indenter(left=6 * mm, right=3 * mm),
                Spacer(1, 2 * mm),
                *option_body,
                Indenter(left=-6 * mm, right=-3 * mm),
                HRFlowable(width="100%", thickness=0.5, color=colors.HexColor("#D8E2EC")),
                Spacer(1, 3 * mm),
            ])
    return result


def safe_slug(value: str) -> str:
    slug = re.sub(r"[^A-Za-z0-9._-]+", "-", value).strip("-.")
    return slug or "questions"


def collect_modules():
    catalog = load_json(WEB_DATA / "catalog.json")
    modules = []
    for module in catalog.get("modules", []):
        payload = load_json(WEB_DATA / module["questionFile"])
        modules.append((module, payload.get("questions", [])))
    return catalog, modules


def write_manifest(output: Path, rows: list[dict], summary: dict):
    (output / "manifest.json").write_text(
        json.dumps({"summary": summary, "questions": rows}, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8")
    fields = [
        "question_id", "type", "type_label", "pdf", "page", "module_id", "module_title",
        "paper_id", "paper_order", "exam", "question_no", "source_document", "source_curated",
    ]
    with (output / "manifest.csv").open("w", encoding="utf-8-sig", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=fields, extrasaction="ignore")
        writer.writeheader()
        writer.writerows(rows)


def build_module_pdf(module: dict, questions: list[dict], output: Path, sheet: dict) -> list[dict]:
    filename = "%02d-%s.pdf" % (module.get("number", 0), safe_slug(module.get("fileSlug") or module.get("id", "module")))
    path = output / filename
    page_rows: list[dict] = []
    doc = ReviewDocTemplate(
        str(path), module_title="%s · %s" % (module.get("name", ""), module.get("title", "")),
        manifest_rows=page_rows, pagesize=A4,
        leftMargin=18 * mm, rightMargin=18 * mm, topMargin=18 * mm, bottomMargin=22 * mm,
        title="ICS 题面审阅 - %s" % module.get("title", ""),
        author="ICS Test",
        subject="题面、选项与题型人工审阅；不含答案",
    )
    usable_width = A4[0] - doc.leftMargin - doc.rightMargin
    counts = collections.Counter((q.get("interaction") or {}).get("kind") or "legacy" for q in questions)
    count_text = " · ".join(
        "%s %d" % (TYPE_LABELS.get(kind, kind), count)
        for kind, count in sorted(counts.items(), key=lambda item: item[0]))
    story: list[Flowable] = [
        Spacer(1, 28 * mm),
        Paragraph("ICS 题面审阅", sheet["cover_title"]),
        Paragraph("%s · %s" % (html.escape(module.get("name", "")), html.escape(module.get("title", ""))), sheet["cover_title"]),
        Paragraph("共 %d 道题" % len(questions), sheet["cover_body"]),
        Paragraph(html.escape(count_text), sheet["cover_body"]),
        Spacer(1, 8 * mm),
        Paragraph("每道题显示稳定 ID、当前题型、题干、选项、试卷定位和源文件。导出器不主动附加答案字段；若答案误混入题面，将原样显示以暴露问题。", sheet["cover_body"]),
        Paragraph("导出器只读取并呈现现有数据，不会自动修复 Markdown，也不会推断题型。", sheet["cover_body"]),
        PageBreak(),
    ]
    base_rows = []
    for index, question in enumerate(questions):
        if index:
            story.append(PageBreak())
        story.extend(question_flowables(question, module, sheet, usable_width))
        kind = (question.get("interaction") or {}).get("kind") or "legacy"
        source = question.get("source") or {}
        base_rows.append({
            "question_id": question.get("id"),
            "type": kind,
            "type_label": TYPE_LABELS.get(kind, "未知题型"),
            "pdf": filename,
            "module_id": module.get("id"),
            "module_title": module.get("title"),
            "paper_id": question.get("paperId"),
            "paper_order": question.get("paperOrder"),
            "exam": question.get("exam"),
            "question_no": question.get("questionNo"),
            "source_document": source.get("document"),
            "source_curated": source.get("curated"),
        })
    doc.build(story)
    page_by_id = {row["question_id"]: row["page"] for row in page_rows}
    for row in base_rows:
        row["page"] = page_by_id.get(row["question_id"])
    return base_rows


def main(argv: Iterable[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="Generate searchable PDFs for manual question/type review")
    parser.add_argument("--output", type=Path, default=DEFAULT_OUTPUT, help="output directory")
    parser.add_argument("--font", help="path to a Chinese TrueType/OpenType font")
    parser.add_argument("--module", action="append", help="only export this module id; may be repeated")
    parser.add_argument("--keep-output", action="store_true", help="do not clear existing output directory")
    args = parser.parse_args(list(argv) if argv is not None else None)

    font_path = find_font(args.font)
    register_fonts(font_path)
    output = args.output.resolve()
    if output == ROOT.resolve() or ROOT.resolve() not in output.parents:
        raise SystemExit("output must be a subdirectory of the repository")
    if output.exists() and not args.keep_output:
        shutil.rmtree(output)
    output.mkdir(parents=True, exist_ok=True)

    catalog, modules = collect_modules()
    selected = set(args.module or [])
    if selected:
        known = {module.get("id") for module, _ in modules}
        unknown = sorted(selected - known)
        if unknown:
            raise SystemExit("unknown module id(s): %s" % ", ".join(unknown))
        modules = [(module, questions) for module, questions in modules if module.get("id") in selected]

    sheet = styles()
    rows: list[dict] = []
    for module, questions in modules:
        print("生成 %s：%d 道题" % (module.get("title"), len(questions)), flush=True)
        rows.extend(build_module_pdf(module, questions, output, sheet))
    summary = {
        "generatedAt": dt.datetime.now().astimezone().isoformat(timespec="seconds"),
        "schemaVersion": catalog.get("schemaVersion"),
        "questionCount": len(rows),
        "pdfCount": len(modules),
        "font": str(font_path),
        "answerIncluded": False,
        "typeCounts": dict(sorted(collections.Counter(row["type"] for row in rows).items())),
    }
    write_manifest(output, rows, summary)
    print("完成：%d 道题，%d 个 PDF，输出到 %s" % (len(rows), len(modules), output))
    return 0


if __name__ == "__main__":
    sys.exit(main())

