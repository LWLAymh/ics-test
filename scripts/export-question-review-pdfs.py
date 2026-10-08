# -*- coding: utf-8 -*-
"""Export the current question bank to searchable review PDFs.

This is intentionally a read-only presentation tool. It does not infer types,
rewrite Markdown, fix fences, or write to question-bank/. Every displayed type
and content fragment comes from the generated v3 data as-is.

Rendering policy: **no content heuristics**. The exporter only honours structure
the data explicitly declares — fenced code, inline code, `$...$` formulas,
`^{}`/`_{}` scripts, Markdown tables/headings/quotes/lists, Markdown or HTML
images, and the small inline HTML whitelist. Anything not explicitly marked is
printed as ordinary text (an unfenced code block therefore looks like a
paragraph, and that visible defect is exactly what a reviewer should see).
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
IMAGE_RE = re.compile(r"!\[([^\]]*)\]\(([^\s)]+)(?:\s+[\"']([^\"')]*)[\"'])?\)")
FENCE_RE = re.compile(r"^\s*```\s*([A-Za-z0-9_+-]*)\s*$")
INLINE_CODE_RE = re.compile(r"`([^`\n]+)`")
BOLD_RE = re.compile(r"\*\*([^*\n]+)\*\*")
COMMENT_RE = re.compile(r"<!--(.*?)-->", re.S)
HEADING_RE = re.compile(r"^(#{1,6})\s+(.*)$")
QUOTE_RE = re.compile(r"^\s*>(?:\s(.*))?$")
ULIST_RE = re.compile(r"^(\s*)[-*+]\s+(.*)$")
OLIST_RE = re.compile(r"^(\s*)(\d+)[.)]\s+(.*)$")
HR_RE = re.compile(r"^\s*(?:-{3,}|\*{3,}|_{3,})\s*$")
TABLE_ROW_RE = re.compile(r"^\s*\|.*\|\s*$")
HTML_IMG_RE = re.compile(r"<img\b[^>]*?src=[\"']([^\"']+)[\"'][^>]*>", re.I)
# 允许在题面里直通到 PDF 的少量行内标签（reportlab 认识它们）
HTML_INLINE = {
    "sub": "<sub>", "/sub": "</sub>",
    "sup": "<super>", "/sup": "</super>",
    "u": "<u>", "/u": "</u>",
    "b": "<b>", "/b": "</b>",
    "strong": "<b>", "/strong": "</b>",
    "i": "<i>", "/i": "</i>",
    "em": "<i>", "/em": "</i>",
    "br": "<br/>", "br/": "<br/>",
}
HTML_INLINE_RE = re.compile(r"</?([A-Za-z][A-Za-z0-9]*)\s*/?>")
# Markdown 反斜杠转义：`\$`、`\*`、`\_`、`` \` ``、`\<` …
ESCAPE_RE = re.compile(r"\\([!-/:-@\[-`{-~])")
# 行内公式：同一段内成对、内容不像汇编操作数的 `$...$`
MATH_RE = re.compile(r"\$([^$\n]{1,160}?)\$")
SCRIPT_RE = re.compile(r"([\^_])\{([^{}\\]+)\}")
MONO_FONT_CANDIDATES = [
    Path(r"C:\Windows\Fonts\consola.ttf"),
    Path(r"C:\Windows\Fonts\CascadiaMono.ttf"),
    Path(r"C:\Windows\Fonts\lucon.ttf"),
    Path("/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf"),
    Path("/System/Library/Fonts/Menlo.ttc"),
]
MONO_BOLD_CANDIDATES = [
    Path(r"C:\Windows\Fonts\consolab.ttf"),
    Path(r"C:\Windows\Fonts\CascadiaMono.ttf"),
]
CJK_RE = re.compile(r"[\u3000-\u9fff\uff00-\uffef]")
TAG_TOKEN_RE = re.compile(r"(</?(?:sub|super|u|b|i)>|<br/>)")
# 没有信息量的 alt 文本（数据里大量 `![图](...)`），不作为图注重复打印
GENERIC_ALT = {"图", "图片", "img", "image", "figure", "pic"}


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


def first_existing(candidates: Iterable[Path]) -> Path | None:
    for candidate in candidates:
        if candidate.is_file():
            return candidate
    return None


def find_mono_font(explicit: str | None = None) -> Path | None:
    """等宽字体只用于纯 ASCII 代码块；找不到时退回正文字体，不报错。"""
    candidates = []
    if explicit:
        candidates.append(Path(explicit))
    env_font = os.environ.get("ICS_REVIEW_PDF_MONO_FONT")
    if env_font:
        candidates.append(Path(env_font))
    candidates.extend(MONO_FONT_CANDIDATES)
    return first_existing(candidates)


def register_fonts(font_path: Path, mono_path: Path | None = None):
    try:
        pdfmetrics.registerFont(TTFont("ReviewSans", str(font_path)))
        pdfmetrics.registerFont(TTFont("ReviewSansBold", str(font_path)))
    except Exception as exc:
        raise SystemExit("无法加载字体 %s: %s" % (font_path, exc))
    if mono_path is None:
        mono_path = find_mono_font()
    if mono_path is None:
        pdfmetrics.registerFont(TTFont("ReviewMono", str(font_path)))
        pdfmetrics.registerFont(TTFont("ReviewMonoBold", str(font_path)))
        return None
    bold = first_existing(MONO_BOLD_CANDIDATES) or mono_path
    pdfmetrics.registerFont(TTFont("ReviewMono", str(mono_path)))
    pdfmetrics.registerFont(TTFont("ReviewMonoBold", str(bold)))
    return mono_path


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
        "heading": ParagraphStyle(
            "Heading", parent=base["BodyText"], fontName="ReviewSansBold",
            fontSize=12, leading=17, textColor=colors.HexColor("#173A5E"),
            spaceBefore=3 * mm, spaceAfter=2 * mm,
        ),
        "quote": ParagraphStyle(
            "Quote", parent=base["BodyText"], fontName="ReviewSans",
            fontSize=9.5, leading=14, textColor=colors.HexColor("#475569"),
            leftIndent=5 * mm, rightIndent=3 * mm, spaceBefore=2 * mm, spaceAfter=3 * mm,
            backColor=colors.HexColor("#F5F7FA"), borderPadding=3 * mm,
        ),
        "list": ParagraphStyle(
            "List", parent=base["BodyText"], fontName="ReviewSans",
            fontSize=10.5, leading=16, textColor=colors.HexColor("#263442"),
            leftIndent=8 * mm, bulletIndent=3 * mm, spaceAfter=1 * mm,
        ),
        "cell": ParagraphStyle(
            "Cell", parent=base["BodyText"], fontName="ReviewSans",
            fontSize=9, leading=13, textColor=colors.HexColor("#263442"),
        ),
        "cell_head": ParagraphStyle(
            "CellHead", parent=base["BodyText"], fontName="ReviewSansBold",
            fontSize=9, leading=13, textColor=colors.HexColor("#173A5E"),
        ),
        "warning": ParagraphStyle(
            "Warning", parent=base["BodyText"], fontName="ReviewSans",
            fontSize=9, leading=13, textColor=colors.HexColor("#9A3412"),
            backColor=colors.HexColor("#FFF7ED"), borderPadding=3 * mm,
        ),
        "note": ParagraphStyle(
            "Note", parent=base["BodyText"], fontName="ReviewSans",
            fontSize=8, leading=11, textColor=colors.HexColor("#B45309"),
        ),
    }


class Stash:
    """把已经生成好的行内标签片段寄存起来，避免随后被 html.escape 二次转义。"""

    def __init__(self):
        self.items: list[str] = []

    def put(self, html_fragment: str) -> str:
        self.items.append(html_fragment)
        return "\x00%d\x00" % (len(self.items) - 1)

    def restore(self, text: str) -> str:
        def repl(match):
            return self.items[int(match.group(1))]
        return re.sub("\x00(\\d+)\x00", repl, text)


def _protect_escape(match, stash: "Stash") -> str:
    r"""反转义 Markdown 反斜杠转义。

    `\$` 是**显式转义的字面美元符号**（汇编操作数 `movq \$0x1, %rax`），必须寄存成
    占位符，否则会被当公式定界符；其余 `\*`、`\_`、`` \` `` 直接还原成原字符。
    """
    if match.group(1) == "$":
        return stash.put("$")
    return match.group(1)


def balance_tags(text: str) -> str:
    """丢掉配对不上的行内标签（数据里常见 `</sup>` 残留），避免整份 PDF 导出失败。"""
    tokens = TAG_TOKEN_RE.split(text)
    stack: list[tuple[str, int]] = []
    keep: set[int] = set()
    for index, token in enumerate(tokens):
        match = re.fullmatch(r"<(/?)(sub|super|u|b|i)>", token or "")
        if not match:
            continue
        if not match.group(1):
            stack.append((match.group(2), index))
        elif stack and stack[-1][0] == match.group(2):
            _, open_index = stack.pop()
            keep.add(open_index)
            keep.add(index)
    out = []
    for index, token in enumerate(tokens):
        if (re.fullmatch(r"</?(?:sub|super|u|b|i)>", token or "") and index not in keep):
            continue
        out.append(token)
    return "".join(out)


def safe_paragraph(markup_text: str, style, *, raw: str = "") -> Flowable:
    """Paragraph 解析失败时退回转义文本，绝不让一道坏题毁掉整次导出。"""
    try:
        return Paragraph(markup_text, style)
    except Exception:
        safe = html.escape(" ".join(str(raw or markup_text).split()))
        try:
            return Paragraph(safe or "&nbsp;", style)
        except Exception:
            return Preformatted(str(raw or markup_text), style)


def inline_markup(text: str, sheet: dict, *, mono_font: str = "ReviewMono") -> str:
    r"""转义原始文本，然后只还原**显式书写**的行内 Markdown / 行内 HTML。

    渲染器不做内容推断：只处理数据里确实写出来的结构标记——
    行内代码 `` `code` ``、显式转义 `\$`、公式 `$...$`、上下标 `^{}`/`_{}`、
    白名单行内标签（`<sub>`/`<sup>`/`<u>`/`<br>`）、粗体 `**...**`。
    没有这些标记的文本一律按普通文字原样排版，让缺陷可见而不是被脚本猜掉。
    """
    stash = Stash()
    text = str(text or "").replace("\r\n", "\n").replace("\r", "\n")

    text = INLINE_CODE_RE.sub(
        lambda m: stash.put('<font name="%s" color="#7C2D12">%s</font>'
                            % (mono_font, html.escape(m.group(1)))), text)
    text = COMMENT_RE.sub(
        lambda m: stash.put('<font color="#B45309" size="7.5">［注释：%s］</font>'
                            % html.escape(" ".join(m.group(1).split())[:120])), text)
    text = ESCAPE_RE.sub(lambda m: _protect_escape(m, stash), text)

    def inline_tag(match):
        key = ("/" if match.group(0).startswith("</") else "") + match.group(1).lower()
        if key in HTML_INLINE:
            return stash.put(HTML_INLINE[key])
        return match.group(0)
    text = HTML_INLINE_RE.sub(inline_tag, text)

    def math(match):
        """`$...$` 是数据里显式写的行内公式，不做任何「像不像公式」的判断。"""

        def script(tag_match):
            tag = "super" if tag_match.group(1) == "^" else "sub"
            return "<%s>%s</%s>" % (tag, tag_match.group(2), tag)
        return stash.put("<i>%s</i>" % SCRIPT_RE.sub(script, html.escape(match.group(1))))
    text = MATH_RE.sub(math, text)
    text = text.replace("\n", stash.put("<br/>"))

    escaped = html.escape(text, quote=False)
    escaped = BOLD_RE.sub(lambda m: "<b>%s</b>" % m.group(1), escaped)
    escaped = SCRIPT_RE.sub(
        lambda m: "<%s>%s</%s>" % ("super" if m.group(1) == "^" else "sub", m.group(2),
                                   "super" if m.group(1) == "^" else "sub"), escaped)
    return balance_tags(stash.restore(escaped))


def code_style(text: str, sheet: dict) -> ParagraphStyle:
    """纯 ASCII 代码用等宽字体；含中文注释的代码退回正文字体（否则会掉字）。"""
    if CJK_RE.search(text or ""):
        return sheet["code"]
    style = ParagraphStyle("CodeMono", parent=sheet["code"], fontName="ReviewMono")
    return style


def scaled_image(path: Path, max_width: float, max_height: float):
    image = Image(str(path))
    factor = min(max_width / image.imageWidth, max_height / image.imageHeight, 1.0)
    image.drawWidth = image.imageWidth * factor
    image.drawHeight = image.imageHeight * factor
    image.hAlign = "LEFT"
    return image


def image_flowables(src: str, alt: str, title: str, sheet: dict, max_width: float,
                    *, html_image: bool = False) -> list[Flowable]:
    """渲染一张图片；文件缺失时打印醒目的警告，而不是把标记原样漏出去。"""
    out: list[Flowable] = []
    asset = (BANK / src).resolve()
    try:
        asset.relative_to(BANK.resolve())
    except ValueError:
        asset = Path("__outside_question_bank__")
    if asset.is_file():
        try:
            out.append(scaled_image(asset, max_width, 110 * mm))
            caption = (title or alt or "").strip()
            if caption and caption not in GENERIC_ALT:
                out.append(Paragraph("图：" + html.escape(caption), sheet["meta"]))
            out.append(Spacer(1, 3 * mm))
            return out
        except Exception as exc:
            out.append(Paragraph(
                "图片无法载入：%s（%s）" % (html.escape(src), html.escape(str(exc))),
                sheet["warning"]))
            return out
    label = "图片缺失（原始 HTML 图片）：" if html_image else "图片缺失："
    out.append(Paragraph(label + html.escape(src), sheet["warning"]))
    return out


def split_table_cells(row: str) -> list[str]:
    """`| a | b |` -> ['a', 'b']，支持 `\\|` 转义。"""
    body = row.strip()
    if body.startswith("|"):
        body = body[1:]
    if body.endswith("|"):
        body = body[:-1]
    parts: list[str] = []
    current: list[str] = []
    index = 0
    while index < len(body):
        char = body[index]
        if char == "\\" and index + 1 < len(body) and body[index + 1] == "|":
            current.append("|")
            index += 2
            continue
        if char == "|":
            parts.append("".join(current).strip())
            current = []
            index += 1
            continue
        current.append(char)
        index += 1
    parts.append("".join(current).strip())
    return parts


def is_separator_row(cells: list[str]) -> bool:
    return bool(cells) and all(re.fullmatch(r":?-{1,}:?", cell or "") for cell in cells)


def table_flowables(rows: list[str], sheet: dict, max_width: float) -> list[Flowable]:
    """Markdown 表格渲染成真正的表格；解析不了就退回等宽文本，不吞内容。"""
    grid = [split_table_cells(row) for row in rows]
    grid = [cells for cells in grid if cells and not is_separator_row(cells)]
    if not grid:
        return []
    if sum(len(cell) for cells in grid for cell in cells) > 6000:
        return [Preformatted("\n".join(rows), code_style("\n".join(rows), sheet), maxLineLength=110)]
    width = max(len(cells) for cells in grid)
    grid = [cells + [""] * (width - len(cells)) for cells in grid]
    head, body = grid[0], grid[1:]
    weights = []
    for column in range(width):
        longest = max(len(re.sub(r"[`*]", "", cells[column])) for cells in grid)
        weights.append(max(4, min(longest, 40)))
    total = float(sum(weights))
    col_widths = [max_width * weight / total for weight in weights]

    def cell(text: str, style) -> Paragraph:
        return safe_paragraph(inline_markup(text, sheet) or "&nbsp;", style, raw=text)

    data = [[cell(text, sheet["cell_head"]) for text in head]]
    for cells in body:
        data.append([cell(text, sheet["cell"]) for text in cells])
    table = Table(data, colWidths=col_widths, repeatRows=1, splitByRow=1)
    table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#EEF3F8")),
        ("BOX", (0, 0), (-1, -1), 0.5, colors.HexColor("#D8E2EC")),
        ("INNERGRID", (0, 0), (-1, -1), 0.35, colors.HexColor("#E5EBF1")),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LEFTPADDING", (0, 0), (-1, -1), 2 * mm),
        ("RIGHTPADDING", (0, 0), (-1, -1), 2 * mm),
        ("TOPPADDING", (0, 0), (-1, -1), 1.2 * mm),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 1.2 * mm),
    ]))
    return [table, Spacer(1, 3 * mm)]


def join_paragraph(lines: list[str]) -> str:
    """段落内的软换行按 Markdown 规则并成空格。

    只有**显式**的硬换行（行尾两个空格）或 `<br>` 才断行。不做「缩进就当代码」
    之类的猜测：没写围栏的代码就该以普通段落出现，让审阅时看见这个缺陷本身。
    """
    out: list[str] = []
    for index, line in enumerate(lines):
        hard = len(line) - len(line.rstrip()) >= 2
        out.append(line.rstrip())
        if index != len(lines) - 1:
            out.append("\n" if hard else " ")
    return "".join(out)


def paragraph_flowables(lines: list[str], sheet: dict, max_width: float,
                        mono_font: str) -> list[Flowable]:
    text = HTML_IMG_RE.sub(lambda m: "![HTML 图片](%s)" % m.group(1), join_paragraph(lines))
    out: list[Flowable] = []
    position = 0
    for match in IMAGE_RE.finditer(text):
        before = text[position:match.start()]
        if before.strip():
            result_text = inline_markup(before, sheet, mono_font=mono_font)
            out.append(safe_paragraph(result_text, sheet["question"], raw=before))
        alt, src, title = match.group(1), match.group(2), match.group(3)
        out.extend(image_flowables(src, alt, title, sheet, max_width,
                                   html_image=(alt or "").strip() == "HTML 图片"))
        position = match.end()
    tail = text[position:]
    if tail.strip():
        out.append(safe_paragraph(inline_markup(tail, sheet, mono_font=mono_font),
                                  sheet["question"], raw=tail))
    return out


def markdown_flowables(markdown: str, sheet: dict, *, max_width: float,
                       mono_font: str = "ReviewMono") -> list[Flowable]:
    """把声明过的 Markdown 渲染成 PDF：围栏代码、表格、标题、引用、列表、图片。

    仍然**不猜**内容：没有围栏的代码不会被自动识别成代码块，只会原样排版，
    这样审阅时能直接看到「代码没进围栏」这个缺陷本身。
    """
    lines = str(markdown or "").replace("\r\n", "\n").replace("\r", "\n").split("\n")
    result: list[Flowable] = []
    paragraph: list[str] = []
    index = 0
    total = len(lines)

    def flush_paragraph():
        if paragraph:
            result.extend(paragraph_flowables(list(paragraph), sheet, max_width, mono_font))
            paragraph.clear()

    while index < total:
        line = lines[index]
        fence = FENCE_RE.match(line)
        if fence:
            flush_paragraph()
            code: list[str] = []
            language = fence.group(1)
            index += 1
            while index < total and not FENCE_RE.match(lines[index]):
                code.append(lines[index])
                index += 1
            if index >= total:
                # 保留显式缺陷，而不是悄悄替作者补上闭合围栏
                code.append("[未闭合的代码围栏]")
            index += 1
            label = ("[%s]\n" % language) if language else ""
            body = label + "\n".join(code)
            result.append(Preformatted(body, code_style(body, sheet), maxLineLength=110))
            continue
        if TABLE_ROW_RE.match(line):
            flush_paragraph()
            rows = []
            while index < total and TABLE_ROW_RE.match(lines[index]):
                rows.append(lines[index])
                index += 1
            result.extend(table_flowables(rows, sheet, max_width))
            continue
        if HR_RE.match(line):
            flush_paragraph()
            result.append(HRFlowable(width="100%", thickness=0.6, color=colors.HexColor("#CBD5E1")))
            result.append(Spacer(1, 2 * mm))
            index += 1
            continue
        heading = HEADING_RE.match(line)
        if heading:
            flush_paragraph()
            result.append(safe_paragraph(
                inline_markup(heading.group(2), sheet, mono_font=mono_font),
                sheet["heading"], raw=heading.group(2)))
            index += 1
            continue
        if QUOTE_RE.match(line):
            flush_paragraph()
            bucket = []
            while index < total and QUOTE_RE.match(lines[index]):
                bucket.append(QUOTE_RE.match(lines[index]).group(1) or "")
                index += 1
            result.append(safe_paragraph(
                inline_markup("\n".join(bucket), sheet, mono_font=mono_font),
                sheet["quote"], raw="\n".join(bucket)))
            continue
        unordered = ULIST_RE.match(line)
        ordered = OLIST_RE.match(line)
        if unordered or ordered:
            flush_paragraph()
            while index < total:
                item_ul = ULIST_RE.match(lines[index])
                item_ol = OLIST_RE.match(lines[index])
                if item_ul:
                    marker, text = item_ul.group(1), item_ul.group(2)
                    bullet = "\u2022 "
                elif item_ol:
                    marker, text = item_ol.group(1), item_ol.group(3)
                    bullet = item_ol.group(2) + ". "
                else:
                    break
                indent = min(len(marker.replace("\t", "    ")), 6)
                style = ParagraphStyle("List%d" % indent, parent=sheet["list"],
                                       leftIndent=(8 + 4 * indent) * mm,
                                       firstLineIndent=-4 * mm)
                result.append(safe_paragraph(
                    inline_markup(bullet + text, sheet, mono_font=mono_font), style,
                    raw=bullet + text))
                index += 1
            continue
        if not line.strip():
            flush_paragraph()
            index += 1
            continue
        paragraph.append(line)
        index += 1

    flush_paragraph()
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
        Paragraph("导出器只读取并呈现现有数据：围栏代码用等宽字体、Markdown 表格渲染成表格、行内公式去掉定界符、"
                  "图片按原位插入；解析不了的结构会显式标注，不会被静默吞掉。", sheet["cover_body"]),
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
    parser.add_argument("--mono-font", help="path to a monospace TrueType font used for code blocks")
    parser.add_argument("--module", action="append", help="only export this module id; may be repeated")
    parser.add_argument("--keep-output", action="store_true", help="do not clear existing output directory")
    args = parser.parse_args(list(argv) if argv is not None else None)

    font_path = find_font(args.font)
    mono_path = register_fonts(font_path, find_mono_font(args.mono_font))
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
        "monoFont": str(mono_path) if mono_path else None,
        "answerIncluded": False,
        "typeCounts": dict(sorted(collections.Counter(row["type"] for row in rows).items())),
    }
    write_manifest(output, rows, summary)
    print("完成：%d 道题，%d 个 PDF，输出到 %s" % (len(rows), len(modules), output))
    return 0


if __name__ == "__main__":
    sys.exit(main())

