"""Grade 8 Mathematics – Curriculum Map, 1st Trimester, SY 2026-2027.

Source of truth: DepEd MATATAG Grade 8 Mathematics Three-Term Budget of Work, First Term
(sources/deped/MATATAG-Grade8-Mathematics-Three-Term-BOW-SY2026-2027.pdf). Content standards,
performance standards, and competencies marked DepEd (True, shown with ★) are quoted verbatim.

Schedule: 5 meetings per cycle, 10 usable cycles (50 meetings); C11 is a buffer.
Competency codes follow UbD: A = Acquisition, M = Meaning-making, T = Transfer.
"""

import importlib.util
from pathlib import Path

_spec = importlib.util.spec_from_file_location("g7t1cm", Path(__file__).with_name("grade7_term1_cm.py"))
_g7 = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(_g7)

SIMBOOK = "https://claude.ai/artifact/MATH8-SIMBOOK"  # replaced with the published link

HEADER = {
    "lines": ["LA SALLE GREEN HILLS", "Mathematics Department (Grade 8)", "1st Trimester, SY 2026 - 2027"],
    "title": "CURRICULUM MAP",
    "note": "Aligned with the DepEd MATATAG Grade 8 Mathematics Three-Term Budget of Work (First Term). "
            "Competencies marked ★ are DepEd learning competencies quoted verbatim.",
}

STANDARDS = [
    {
        "label": "CONTENT STANDARDS",
        "lead": "The learners should have knowledge and understanding of…",
        "items": [
            "measures of central tendency of ungrouped data",
            "algebraic expressions and operations with monomials, binomials, and multinomials",
            "special products for binomials, and factorization of polynomials",
            "rational algebraic expressions and equations",
            "rules for obtaining terms in sequences",
            "plotting points, and finding distance and the midpoint of line segments on the Cartesian coordinate plane",
        ],
    },
    {
        "label": "PERFORMANCE STANDARDS",
        "lead": "By the end of the term, the learners are able to…",
        "items": [
            "determine measures of central tendency of ungrouped data and use the measures to draw conclusions.",
            "add and subtract monomials, and multiply combinations of monomials, binomials, and multinomials.",
            "obtain special binomial products.",
            "factorize different types of polynomials.",
            "simplify, and operate with, rational algebraic expressions and solve simple rational algebraic equations.",
            "obtain the rule for finding the next term in a sequence.",
            "plot points, find the distance between two points, and find the midpoint of line segments, on the Cartesian coordinate plane.",
        ],
        "groups": _g7.STANDARDS[1]["groups"],
    },
    {
        "label": "ESSENTIAL QUESTION/S:",
        "lead": "The learners will keep considering:",
        "numbered": True,
        "items": [
            "How can a single number fairly describe a whole set of data?",
            "How do algebraic expressions, products, and factors help us describe and build real things?",
            "How do patterns and coordinates help us predict what comes next and where things are?",
        ],
    },
    {
        "label": "ENDURING UNDERSTANDING:",
        "lead": "The learners will understand that:",
        "numbered": True,
        "items": [
            "Measures of central tendency summarize data, and choosing the right one depends on the shape of the data.",
            "Polynomials and rational expressions follow the same rules as numbers: multiplying and factoring are reverse "
            "processes, and area models make the patterns visible.",
            "Patterns can be captured as rules, and the coordinate plane turns locations into numbers we can compute with.",
        ],
    },
    {
        "label": "TRANSFER GOAL",
        "text": "The learners will be able to independently use data, algebraic models, and the coordinate plane to plan a "
                "practical improvement for their community – such as a community hub sized to a lot and placed fairly "
                "between the places people need to reach – and justify their decisions with computations.",
    },
]

ROADMAP = {
    "title": "TERM 1 ROADMAP AT A GLANCE",
    "subtitle": "5 meetings per cycle · 10 usable cycles (50 meetings) · Cycle 11 reserved as buffer · "
                "Every lesson has its own simulation in the LSGH Math 8 SimBook",
    "columns": ["UNIT", "BIG QUESTION", "DepEd WEEKS", "CYCLES", "SIGNATURE SIMS", "SIGNATURE TASK"],
    "widths": [2500, 3000, 1300, 1600, 2560, 2000],
    "rows": [
        {"cells": ["Unit A · DATA CHECK! Measures of Central Tendency", "Which “average” tells the truth about our class?",
                   "Week 1", "C1,M2 – C1,M5", "Center Finder", "LW1.1 Class Data Survey"]},
        {"cells": ["Unit B · POLYNOMIAL POWER! Expressions, Special Products, and Factoring", "How can one expression describe every size of garden?",
                   "Weeks 1–6", "C2,M1 – C5,M5", "Expression Modeler · Exponent Lab · Area Builder · Factor Puzzle", "SA1.1 Special Products Relay"]},
        {"cells": ["Unit C · RATIONAL THINKING! Rational Algebraic Expressions and Equations", "If 3 friends can paint a wall in 4 hours, how long would it take 5 friends?",
                   "Weeks 6–8", "C6,M1 – C8,M3", "Fraction Machine · Work-Rate Lab", "SA1.2 Work Together Challenge"]},
        {"cells": ["Unit D · PATTERNS AND PLANES! Sequences and the Cartesian Plane", "How far is the canteen from the gate – as the crow flies?",
                   "Weeks 9–10", "C8,M4 – C10,M2", "Pattern Builder · Barangay Map", "LW1.7 Campus Map"]},
        {"kind": "pt", "cells": ["Performance Task · COMMUNITY HUB PLANNER", "Where should our barangay’s new community hub go, and how big can it be?",
                                 "Weeks 1–10", "C5,M4 – C10,M3", "Factor Puzzle · Center Finder · Barangay Map", "PT1.1 Community Hub Plan"]},
        {"kind": "exam", "cells": ["Review and Term Exam", "What have I mastered, and what will I improve?", "—", "C10,M4 – C10,M5", "SimBook self-checks", "TE1.1 Term Exam"]},
        {"kind": "buffer", "cells": ["Buffer Cycle", "—", "—", "C11", "SimBook for remediation", "Make-up assessments, remediation, and enrichment"]},
    ],
    "legend": "Row colors in the map: green = unit banner · yellow = quiz · blue = performance task · orange = review/term exam · gray = buffer.",
}

R360 = "Uploaded materials in Ranger 360"
SB = lambda n: f"LSGH Math 8 SimBook – Term 1 Lesson {n} (hook sim, lesson slides with notes, and Exercises)"


def lesson(meetings, rng, topic, subtopics, comps, assess, hook, sim, acts, res, pillars, kind=None):
    row = {"type": "row", "meetings": meetings, "range": rng, "topic": topic, "subtopics": subtopics,
           "comps": comps, "assess": assess,
           "acts": [f"^^HOOK:^^ {hook}", f"^^SIM HOOK:^^ SimBook – {sim}"] + acts,
           "res": res, "pillars": pillars}
    if kind:
        row["kind"] = kind
    return row


def quiz(rng, letters, codes, code, title, items):
    return {"type": "row", "kind": "quiz", "meetings": "1 Meeting", "range": rng, "topic": letters, "comp_lead": False,
            "comps": [codes], "assess": [("Summative", f"{code} – {title}")],
            "acts": [f"{code} – A {items}-item quiz (multiple choice and constructed response)."],
            "res": [f"Teacher-made {code} in Ranger 360"], "pillars": ["SF"]}


ROWS = [
    {"type": "row", "meetings": "1 Meeting", "range": "(C1,M1)", "topic": "Class Orientation: “Math Builds Our Community!”",
     "subtopics": ["Term 1 roadmap and performance task", "Grading system and class policies"],
     "comps": ["Review the Term 1 course outline and roadmap.", "Describe the learning outcomes, grading components, and their percentage weights.",
               "Explain classroom policies, attendance requirements, and academic integrity guidelines."],
     "assess": [("Formative", "CP1.1 – Recitation"), ("Formative", "CP1.1 – “Grade 7 to Grade 8” one-minute reflection")],
     "acts": ["^^HOOK:^^ “Mystery Lot” – a vacant lot’s area is x² + 7x + 12. What could its length and width be?",
              ("Discussion on the following:", ["Course outline and roadmap", "Methods of assessment", "Class goals, policies, and expectations"])],
     "res": ["Teacher’s Google presentation", "Student Handbook", R360], "pillars": ["ZS", "SF"]},

    {"type": "banner", "title": "UNIT A · DATA CHECK! Measures of Central Tendency",
     "sub": "DepEd Term 1, Week 1 · Data and Probability · C1,M2 to C1,M5 (4 meetings)",
     "question": "Which “average” tells the truth about our class?"},
    lesson("4 Meetings", "(C1,M2 to C1,M5)", "A. Measures of Central Tendency",
           ["Mean, median, and mode of ungrouped data", "Effect of outliers", "Drawing conclusions from the measures"],
           [("A1", True, "Determine measures of central tendency of ungrouped data."),
            ("A2", True, "Draw conclusions from statistical data using the measures of central tendency."),
            ("M1", False, "Choose the most appropriate measure of central tendency for a data set and justify the choice.")],
           [("Formative", "CP1.1 – Recitation"), ("Summative", "LW1.1 – Class Data Survey (C1,M4)")],
           "“Average Allowance” – one classmate’s very large allowance changes the class average. Is it still fair?",
           "Center Finder (Balance Point, Outlier Effect, Which Measure?)",
           ["LW1.1 – Class Data Survey: collect travel times, compute the mean, median, and mode, and write a conclusion"],
           [SB(1), "Class survey sheet", R360], ["ZS"]),

    {"type": "banner", "title": "UNIT B · POLYNOMIAL POWER! Expressions, Special Products, and Factoring",
     "sub": "DepEd Term 1, Weeks 1–6 · Number and Algebra · C2,M1 to C5,M5 (20 meetings)",
     "question": "How can one expression describe every size of garden?"},
    lesson("2 Meetings", "(C2,M1 to C2,M2)", "B. Algebraic Expressions as Models",
           ["Translating real-life situations into algebraic expressions", "Evaluating models"],
           [("A3", True, "Model real-life situations using algebraic expressions."),
            ("M2", False, "Explain what each part of an expression means in the situation it models.")],
           [("Formative", "CP1.1 – Recitation"), ("Summative", "LW1.2 – Model It (C2,M2)")],
           "“Load Plan” – ₱99 plus ₱5 a day: what does a month cost? Any number of days?",
           "Expression Modeler (Build the Model, Match It)",
           ["LW1.2 – Model It: write expressions for five school and home situations and evaluate them"],
           [SB(2), R360], ["ZS"]),
    lesson("4 Meetings", "(C2,M3 to C3,M1)", "C. Operations on Monomials and the Laws of Exponents",
           ["Adding and subtracting like terms", "Multiplying and dividing monomials", "Laws of exponents, including the zero exponent"],
           [("A4", True, "Add and subtract simple monomials."),
            ("A5", True, "Multiply and divide simple monomials, leading to the derivation of the laws of exponents."),
            ("M3", False, "Explain the laws of exponents using repeated multiplication.")],
           [("Formative", "CP1.1 – Recitation"), ("Formative", "CP1.2 – Practice Set #1: Monomials and Exponents (C3,M1)")],
           "“Paper Fold” – fold a sheet of paper in half again and again. How many layers after 5 folds? 10?",
           "Exponent Lab (Like Terms, Expand the Powers, Laws Table)",
           ["Algebra tiles: combining like terms", "Deriving the laws of exponents from repeated factors", "CP1.2 – Practice Set #1"],
           [SB(3), "Algebra tiles", R360], ["ZS"]),
    lesson("7 Meetings", "(C3,M2 to C4,M3)", "D. Multiplying Polynomials and Special Products",
           ["Monomial × polynomial and binomial × polynomial", "Area models and the distributive property",
            "Special products: square of a binomial, sum and difference of two terms"],
           [("A6", True, "Multiply simple monomials and binomials with simple binomials and multinomials, using the distributive property with various techniques and models."),
            ("A7", True, "Use special product patterns to multiply binomials."),
            ("M4", False, "Explain special product patterns using area models.")],
           [("Formative", "CP1.1 – Recitation"), ("Summative", "LW1.3 – Algebra Tiles Lab (C3,M4)"),
            ("Summative", "SA1.1 – Special Products Relay (C4,M2)"), ("Formative", "CP1.3 – Practice Set #2: Products (C4,M3)")],
           "“Bigger Garden” – a square garden grows by 2 m on each side. Is the new area just 4 m² more?",
           "Area Builder (Area Model, Special Products, Pattern Match)",
           ["LW1.3 – Algebra Tiles Lab: build products with tiles and record each step",
            "SA1.1 – Special Products Relay: teams race through special products, checking with area models", "CP1.3 – Practice Set #2"],
           [SB(4), "Algebra tiles", R360], ["ZS", "CM"]),
    lesson("6 Meetings", "(C4,M4 to C5,M4)", "E. Factoring Polynomials",
           ["Common monomial factor", "Difference of two squares", "Quadratic trinomials, including perfect square trinomials",
            "Problems involving special products and factors"],
           [("A8", True, "Completely factor different types of polynomials (polynomials with common monomial factor; difference of two squares; quadratic trinomials, including perfect square trinomials)."),
            ("A9", True, "Solve problems involving special products and factors of polynomials."),
            ("M5", False, "Check a factorization by multiplying the factors."),
            ("T1", False, "Use factoring to find possible dimensions of the PT1.1 community hub lot.")],
           [("Formative", "CP1.1 – Recitation"), ("Summative", "LW1.4 – Factor Puzzle (C5,M1)"),
            ("Summative", "PT1.1 – Scaffold #1: Lot Plan (C5,M4)")],
           "“Mystery Lot” returns – rearrange the tiles of x² + 7x + 12 into a rectangle.",
           "Factor Puzzle (Make a Rectangle, Factor Detective, Problems)",
           ["LW1.4 – Factor Puzzle: factor polynomials with tiles and check by multiplying",
            "Launch of PT1.1 “Community Hub Planner”; Scaffold #1"],
           [SB(5), "Algebra tiles", "Teacher-prepared PT1.1 Guidelines and Rubric", R360], ["ZS", "SF"], kind="pt"),
    quiz("(C5,M5)", "A, B, C, D, E", "A1–A9, M1–M5, T1", "QZ1.1", "Central Tendency, Polynomials, and Factoring", 30),

    {"type": "banner", "title": "UNIT C · RATIONAL THINKING! Rational Algebraic Expressions and Equations",
     "sub": "DepEd Term 1, Weeks 6–8 · Number and Algebra · C6,M1 to C8,M3 (13 meetings)",
     "question": "If 3 friends can paint a wall in 4 hours, how long would it take 5 friends?"},
    lesson("7 Meetings", "(C6,M1 to C7,M2)", "F. Rational Algebraic Expressions",
           ["Rational algebraic expressions and excluded values", "Simplifying by factoring",
            "Multiplying, dividing, adding, and subtracting rational algebraic expressions"],
           [("A10", True, "Simplify rational algebraic expressions."),
            ("A11", True, "Perform operations on rational algebraic expressions."),
            ("M6", False, "Explain why values that make a denominator zero are excluded.")],
           [("Formative", "CP1.1 – Recitation"), ("Summative", "LW1.5 – Simplify and Restrict (C6,M3)"),
            ("Formative", "CP1.4 – Practice Set #3: Rational Expressions (C7,M2)")],
           "“Same Answer?” – is (x² − 9)/(x − 3) the same as x + 3? Try x = 5. Try x = 3.",
           "Fraction Machine (Simplify, Operate, Restrictions)",
           ["LW1.5 – Simplify and Restrict: simplify expressions and state their excluded values", "CP1.4 – Practice Set #3"],
           [SB(6), R360], ["ZS"]),
    lesson("5 Meetings", "(C7,M3 to C8,M2)", "G. Rational Algebraic Equations",
           ["Solving rational equations by cross-multiplication", "Checking for excluded values", "Work and proportion problems"],
           [("A12", True, "Solve problems involving simple rational algebraic equations (using cross-multiplication)."),
            ("M7", False, "Check solutions and reject any value that makes a denominator zero.")],
           [("Formative", "CP1.1 – Recitation"), ("Summative", "SA1.2 – Work Together Challenge (C8,M1)"),
            ("Summative", "PT1.1 – Scaffold #2: Resident Survey Summary (C8,M2)")],
           "“Paint the Wall” – 3 friends take 4 hours. Do 5 friends take 2.4 hours?",
           "Work-Rate Lab (Cross-Multiply, Work Together, Proportion Problems)",
           ["SA1.2 – Work Together Challenge: solve and check work and proportion problems in teams", "PT1.1 – Scaffold #2"],
           [SB(7), R360], ["ZS", "CM"], kind="pt"),
    quiz("(C8,M3)", "F, G", "A10–A12, M6–M7", "QZ1.2", "Rational Algebraic Expressions and Equations", 25),

    {"type": "banner", "title": "UNIT D · PATTERNS AND PLANES! Sequences and the Cartesian Plane",
     "sub": "DepEd Term 1, Weeks 9–10 · Number and Algebra · C8,M4 to C10,M2 (9 meetings)",
     "question": "How far is the canteen from the gate – as the crow flies?"},
    lesson("4 Meetings", "(C8,M4 to C9,M2)", "H. Sequences and Patterns",
           ["Patterns in figures and numbers", "Finding the next term", "Writing the rule"],
           [("A13", True, "Formulate the rule for finding the next term in a sequence by looking for patterns."),
            ("M8", False, "Describe a pattern in words and as a rule, and test the rule on the next terms.")],
           [("Formative", "CP1.1 – Recitation"), ("Summative", "LW1.6 – Pattern Hunt (C9,M1)")],
           "“Matchstick Squares” – how many matchsticks for 10 squares in a row? For 100?",
           "Pattern Builder (Growing Patterns, Find the Rule, Real Patterns)",
           ["LW1.6 – Pattern Hunt: find, describe, and test rules for patterns found around the school"],
           [SB(8), "Matchsticks or toothpicks", R360], ["ZS"]),
    lesson("4 Meetings", "(C9,M3 to C10,M1)", "I. The Cartesian Plane, Distance, and Midpoint",
           ["The coordinate plane: axes, origin, quadrants", "Plotting points and reading coordinates",
            "Distance between two points", "Midpoint of a line segment"],
           [("A14", True, "Illustrate and describe the Cartesian coordinate plane."),
            ("A15", True, "Plot points on the Cartesian coordinate plane and determine the coordinates of a point on the plane."),
            ("A16", True, "Solve problems involving distance between two points and midpoint of a line segment on the Cartesian coordinate plane."),
            ("M9", False, "Explain how the distance formula comes from a right triangle on the grid."),
            ("T2", False, "Locate the PT1.1 community hub using distance and midpoint.")],
           [("Formative", "CP1.1 – Recitation"), ("Summative", "LW1.7 – Campus Map (C9,M5)"),
            ("Summative", "PT1.1 – Scaffold #3: Hub Map (C10,M1)")],
           "“Treasure Grid” – find the hidden treasure using coordinate clues.",
           "Barangay Map (Plot It, Distance, Midpoint)",
           ["LW1.7 – Campus Map: map campus landmarks on a grid and compute distances and midpoints", "PT1.1 – Scaffold #3"],
           [SB(9), "Graphing paper", R360], ["ZS", "CM"], kind="pt"),
    quiz("(C10,M2)", "H, I", "A13–A16, M8–M9, T2", "QZ1.3", "Sequences and the Cartesian Plane", 20),

    {"type": "row", "kind": "pt", "meetings": "1 Meeting", "range": "(C10,M3)", "topic": "Final Performance Task: “Community Hub Planner”",
     "subtopics": ["Presentation of the community hub plan"],
     "comps": [("T3", False, "Present a community hub plan that uses factoring for the lot dimensions, measures of central tendency of a resident survey, and distance and midpoint to place the hub."),
               ("T4", False, "Justify the plan with correct computations and answer questions respectfully.")],
     "assess": [("Summative", "PT1.1 – Community Hub Plan")],
     "acts": ["Gallery walk of group plans", "3-minute presentation per group to a panel", "Reflection: “How can mathematics help us serve our community?”"],
     "res": ["Teacher-prepared PT1.1 Guidelines and Rubric", "Students’ PT1.1 output uploaded in Ranger 360"],
     "pillars": ["CM", "ZS", "SF"]},
    {"type": "row", "kind": "exam", "meetings": "1 Meeting", "range": "(C10,M4)", "topic": "Term Review: “Math Amazing Race”", "comp_lead": False,
     "comps": ["A1–A16, M1–M9, T1–T2"], "assess": [("Formative", "CP1.1 – Review stations")],
     "acts": ["Team race stations covering Units A, B, C, and D"], "res": ["Teacher-prepared station cards", R360], "pillars": ["CM"]},
    {"type": "row", "kind": "exam", "meetings": "1 Meeting", "range": "(C10,M5)", "topic": "Term Exam", "comp_lead": False,
     "comps": ["A1–A16, M1–M9, T1–T2"], "assess": [("Summative", "TE1.1 – Term Exam")],
     "acts": ["TE1.1 – Term Exam covering Units A, B, C, and D"], "res": ["Teacher-made TE1.1"], "pillars": ["SF"]},
    {"type": "row", "kind": "buffer", "meetings": "Buffer Cycle", "range": "(C11)", "topic": "Buffer", "comp_lead": False,
     "comps": ["As needed"], "assess": [("Summative", "Make-up assessments")],
     "acts": ["Make-up assessments for excused absences", "Remediation and enrichment using the SimBook", "Adjustments for class suspensions and school activities"],
     "res": [R360], "pillars": ["ZS"]},
]

SIGNATORIES = [
    {"label": "Prepared by:", "names": ["[Name of Teacher]", "[Name of Teacher]"], "role": "Grade 8 Mathematics Teacher"},
    {"label": "Approved by:", "names": ["[Name of Subject Coordinator]"], "role": "Subject Coordinator"},
]
