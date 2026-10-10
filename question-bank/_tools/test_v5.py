"""Contract regression tests; no network calls or authored-file mutations."""
import copy
import unittest

from jsonschema.exceptions import ValidationError
from format_v5 import (BANK, read_bank, validate_question, validate_links, parse_authored,
                       dump_authored, section_targets, blank_spans, content_assets)


class ContractTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.modules, cls.papers, cls.questions = read_bank()

    def example(self, kind):
        return copy.deepcopy(next(q for q in self.questions if q["type"] == kind))

    def invalid(self, question):
        with self.assertRaises((ValueError, ValidationError)):
            validate_question(question)

    def test_all_authored_round_trip(self):
        for question in self.questions:
            self.assertEqual(parse_authored(dump_authored(question)), question, question["id"])

    def test_current_template_is_valid(self):
        question = parse_authored((BANK / "templates/question-v5.md").read_text(encoding="utf-8"))
        validate_question(question, {m["id"] for m in self.modules})

    def test_fences_and_whitespace_remain_exact(self):
        question = self.example("short-answer")
        question["stem"]["text"] = '\n段落  \n\n````c\n  int x;\n%%% reference\n```\n````\n\n'
        self.assertEqual(parse_authored(dump_authored(question)), question)

    def test_missing_duplicate_and_unknown_sections_fail(self):
        text = dump_authored(self.example("short-answer"))
        for bad in (text.replace("%%% stem\n", "%%% wrong\n"), text + "%%% stem\nagain\n",
                    text.split("%%% reference\n")[0], text.rstrip("\n")):
            with self.assertRaises(ValueError):
                parse_authored(bad)

    def test_version_and_extra_fields_fail(self):
        q = self.example("single-choice")
        q["schemaVersion"] = 3
        self.invalid(q)
        q["schemaVersion"] = "5"
        q["layout"] = {}
        self.invalid(q)

    def test_choice_key_cardinality_and_references(self):
        q = self.example("single-choice")
        q["solution"]["correctOptionIds"] = [q["options"][0]["id"], q["options"][1]["id"]]
        self.invalid(q)
        q["solution"]["correctOptionIds"] = ["H"]
        q["options"] = q["options"][:2]
        self.invalid(q)
        q["options"][1]["id"] = q["options"][0]["id"]
        self.invalid(q)

    def test_part_solution_type_is_checked(self):
        q = self.example("composite")
        part = q["parts"][0]
        part["type"] = "short-answer"
        part.pop("options", None)
        part["solution"]["grading"] = "choice"
        part["solution"]["correctOptionIds"] = ["A"]
        self.invalid(q)

    def test_explicit_blanks_match_rules(self):
        q = self.example("fill")
        q["stem"] = {"format": "markdown", "text": "x={{blank:x}}", "blanks": [
            {"id": "x", "marker": "{{blank:x}}", "occurrence": 0, "width": "short"}]}
        q["solution"].update(grading="blanks", blankAnswers=[{
            "blankId": "x", "method": "exact", "acceptedAnswers": ["42"],
            "normalize": {"trimWhitespace": True, "caseSensitive": True}}])
        validate_question(q)
        q["solution"]["blankAnswers"][0]["blankId"] = "y"
        self.invalid(q)
        q["solution"]["blankAnswers"][0]["blankId"] = "x"
        q["stem"]["blanks"] = []
        self.invalid(q)

    def test_repeated_logical_blank_and_overlap(self):
        content = {"text": "____ and ____", "blanks": [
            {"id": "x", "marker": "____", "occurrence": 0},
            {"id": "x", "marker": "____", "occurrence": 1}]}
        self.assertEqual(len(blank_spans(content)), 2)
        content["blanks"][1]["occurrence"] = 0
        with self.assertRaises(ValueError):
            blank_spans(content)

    def test_select_blank_contract(self):
        q = self.example("fill")
        widget = {"kind": "select", "multiple": True, "exclusiveValues": ["E"],
                  "options": [{"value": "A", "label": "<"}, {"value": "B", "label": ">"},
                              {"value": "E", "label": "none"}]}
        q["stem"] = {"format": "markdown", "text": "{{blank:x}} / {{blank:x}}", "blanks": [
            {"id": "x", "marker": "{{blank:x}}", "occurrence": i, "width": "short", "input": copy.deepcopy(widget)}
            for i in range(2)]}
        q["solution"].update(grading="blanks", blankAnswers=[
            {"blankId": "x", "method": "selection", "correctValues": ["A", "B"]}])
        validate_question(q)
        for mutate in (
            lambda bad: bad["solution"]["blankAnswers"][0].update(correctValues=["Z"]),
            lambda bad: bad["solution"]["blankAnswers"][0].update(correctValues=["A", "A"]),
            lambda bad: bad["solution"]["blankAnswers"][0].update(correctValues=["A", "E"]),
            lambda bad: bad["stem"]["blanks"][0].pop("input"),
            lambda bad: bad["stem"]["blanks"][0]["input"].update(multiple=False),
        ):
            bad = copy.deepcopy(q)
            mutate(bad)
            self.invalid(bad)
        for blank in q["stem"]["blanks"]:
            blank["input"]["multiple"] = False
        self.invalid(q)  # Two keys cannot grade a single-select input.
        q["solution"]["blankAnswers"][0]["correctValues"] = ["A"]
        validate_question(q)
        for blank in q["stem"]["blanks"]:
            blank["input"]["options"][1]["value"] = "A"
        self.invalid(q)

    def test_select_blank_rejects_text_rule_and_unknown_exclusion(self):
        q = self.example("fill")
        q["stem"] = {"format": "markdown", "text": "{{blank:x}}", "blanks": [
            {"id": "x", "marker": "{{blank:x}}", "occurrence": 0, "width": "short",
             "input": {"kind": "select", "multiple": False, "options": [
                 {"value": "yes", "label": "是"}, {"value": "no", "label": "否"}]}}]}
        q["solution"].update(grading="blanks", blankAnswers=[
            {"blankId": "x", "method": "exact", "acceptedAnswers": ["yes"],
             "normalize": {"trimWhitespace": True, "caseSensitive": True}}])
        self.invalid(q)
        q["solution"]["blankAnswers"] = [{"blankId": "x", "method": "self"}]
        validate_question(q)
        q["stem"]["blanks"][0]["input"]["exclusiveValues"] = ["missing"]
        self.invalid(q)

    def test_human_review_must_not_be_fabricated(self):
        q = self.example("short-answer")
        q["publication"].update(state="published", basis="human-review", reviewer=None, reviewedAt=None)
        self.invalid(q)

    def test_unclassified_choices_not_publishable(self):
        q = self.example("unclassified-choice")
        q["publication"]["state"] = "published"
        self.invalid(q)

    def test_retired_invalid_question_is_backed_up_but_not_deployed(self):
        from build_web_data import deployed_payloads
        retired = next(q for q in self.questions if q["id"] == "q-622ae65ab616a110")
        self.assertEqual(retired["publication"]["state"], "review")
        self.assertIn("retired-invalid-question", retired["publication"]["issues"])
        self.assertIn("p = func;", retired["stem"]["text"])
        self.assertEqual([o["id"] for o in retired["options"]], ["A", "B", "C", "D"])
        deployed = deployed_payloads(self.modules, self.papers, self.questions)
        self.assertNotIn(retired["id"], [q["id"] for q in deployed["questions.json"]["questions"]])
        for paper in deployed["papers.json"]["papers"]:
            self.assertNotIn(retired["id"], paper["questionIds"])
        for module in deployed["catalog.json"]["modules"]:
            self.assertNotIn(retired["id"], module["questionIds"])
        bad = copy.deepcopy(retired)
        bad["publication"]["state"] = "published"
        self.invalid(bad)

    def test_reported_ambiguous_questions_are_excluded_from_all_deployed_indexes(self):
        from build_web_data import deployed_payloads
        deployed = deployed_payloads(self.modules, self.papers, self.questions)
        for question_id in ("q-f39f4e62d028f8d6", "q-3376fb77c2e3a398"):
            self.assertNotIn(question_id, [q["id"] for q in deployed["questions.json"]["questions"]])
            for paper in deployed["papers.json"]["papers"]:
                self.assertNotIn(question_id, paper["questionIds"])
            for module in deployed["catalog.json"]["modules"]:
                self.assertNotIn(question_id, module["questionIds"])

    def test_duplicate_paper_order_fails(self):
        papers = copy.deepcopy(self.papers)
        papers[0]["questionIds"].append(papers[0]["questionIds"][0])
        with self.assertRaises((ValueError, ValidationError)):
            validate_links(self.questions, papers)

    def test_asset_validation_uses_markdown_tokens(self):
        self.assertEqual(content_assets({"text": '```\n![not an image](assets/missing.png)\n```'}), set())
        for text in ('![bad](https://example.org/a.png)', '![bad](assets/../x.png)',
                     '![bad](assets/missing-v5-test-image.png)'):
            with self.assertRaises(ValueError):
                content_assets({"text": text})


if __name__ == "__main__":
    unittest.main(verbosity=2)
