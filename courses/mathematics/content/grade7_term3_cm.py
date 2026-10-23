"""Grade 7 Mathematics – Curriculum Map, 3rd Trimester, SY 2026-2027.

Source of truth: DepEd MATATAG Mathematics Curriculum Guide, Grade 7 Quarter 3
competencies 9–12 and Quarter 4, as assigned to the Third Term by the DepEd Three-Term
Budget of Work (sources/deped/). Content standards, performance standards, and
competencies marked DepEd (True, shown with ★) are quoted verbatim.

Sequence note: the bar-model equations of BOW Week 3 are taught with the properties of
equality (Week 5) in Lesson E, so that all equation work sits in Unit I.

Schedule: 5 meetings per cycle, 10 usable cycles (50 meetings); C11 is a buffer.
"""

import importlib.util
from pathlib import Path

_spec = importlib.util.spec_from_file_location("g7t1cm", Path(__file__).with_name("grade7_term1_cm.py"))
_t1 = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(_t1)

SIMBOOK = "https://claude.ai/artifact/LrpohtVMd8ifUt7nkd7FFr"

HEADER = {
    "lines": ["LA SALLE GREEN HILLS", "Mathematics Department (Grade 7)", "3rd Trimester, SY 2026 - 2027"],
    "title": "CURRICULUM MAP",
    "note": "Aligned with the DepEd MATATAG Mathematics Curriculum Guide (Grade 7, Quarter 3 items 9–12 "
            "and Quarter 4) as sequenced in the DepEd Three-Term Budget of Work (Third Term). "
            "Competencies marked ★ are DepEd learning competencies quoted verbatim.",
}

STANDARDS = [
    {
        "label": "CONTENT STANDARDS",
        "lead": "The learners should have knowledge and understanding of…",
        "items": [
            "the four operations with integers",
            "simplification of numerical expressions involving integers",
            "absolute value of an integer",
            "the solution of simple equations",
            "the evaluation of algebraic expressions following substitution",
            "the rearrangement of a formula to make a different variable the subject of the formula",
            "outcomes from experiments",
            "operations using scientific notation",
        ],
    },
    {
        "label": "PERFORMANCE STANDARDS",
        "lead": "By the end of the term, the learners are able to…",
        "items": [
            "perform the four operations with integers.",
            "simplify numerical expressions involving integers.",
            "identify the absolute value of an integer.",
            "solve simple equations.",
            "substitute into an algebraic expression to evaluate the expression.",
            "rearrange a formula to make a different variable the subject of the formula.",
            "gather data from experiments and represent the data in different forms.",
            "write numbers in scientific notation and perform operations on numbers written in scientific notation.",
        ],
        "groups": _t1.STANDARDS[1]["groups"],
    },
    {
        "label": "ESSENTIAL QUESTION/S:",
        "lead": "The learners will keep considering:",
        "numbered": True,
        "items": [
            "How do gains and losses, ups and downs, combine into one result?",
            "How can letters and equations help us describe and solve problems we cannot yet see the answer to?",
            "How can experiments and powers of ten help us make sense of chance and of very large or very small quantities?",
        ],
    },
    {
        "label": "ENDURING UNDERSTANDING:",
        "lead": "The learners will understand that:",
        "numbered": True,
        "items": [
            "Operations on integers follow consistent rules that come from models (chips, number lines) and "
            "patterns, and the order of operations makes every expression mean one thing.",
            "An equation is a balance: doing the same thing to both sides keeps it true, which lets us find "
            "unknowns and rearrange formulas.",
            "Repeated experiments reveal patterns in chance, and scientific notation lets us write and compute "
            "with the very large and the very small.",
        ],
    },
    {
        "label": "TRANSFER GOAL",
        "text": "The learners will be able to independently design and test a fair, fun chance game for a "
                "school event – collecting experiment data, representing outcomes in tables and graphs, writing "
                "the scoring and earnings rules as algebraic expressions and equations with integers – and use "
                "the results to make and defend a sound prize plan.",
    },
]

ROADMAP = {
    "title": "TERM 3 ROADMAP AT A GLANCE",
    "subtitle": "5 meetings per cycle · 10 usable cycles (50 meetings) · Cycle 11 reserved as buffer · "
                "Every lesson has its own simulation in the LSGH Math SimBook",
    "columns": ["UNIT", "BIG QUESTION", "DepEd WEEKS", "CYCLES", "SIGNATURE SIMS", "SIGNATURE TASK"],
    "widths": [2500, 3000, 1300, 1600, 2560, 2000],
    "rows": [
        {"cells": ["Unit H · INTEGER POWER! Operations on Integers", "If you owe ₱50 and then earn ₱80, how much do you really have?",
                   "Weeks 1–3", "C1,M2 – C4,M1", "Integer Chips · Sign Machine · Distance Finder", "SA3.1 GEMDAS Relay"]},
        {"cells": ["Unit I · ALGEBRA STARTER! Expressions, Equality, Formulas, and Equations", "How can one letter stand for every possible number?",
                   "Weeks 3–7", "C4,M2 – C8,M1", "Expression Machine · Balance Lab · Formula Rearranger · Equation Builder", "SA3.3 Word Problem Studio"]},
        {"cells": ["Unit J · CHANCE AND SCALE! Experiments and Scientific Notation", "How many heads will you get in 100 tosses – and how big is a billion?",
                   "Weeks 8–10", "C8,M2 – C10,M2", "Chance Lab · Powers-of-Ten Zoom", "LW3.7 Coin and Die Lab"]},
        {"kind": "pt", "cells": ["Performance Task · FAMILY DAY CHANCE BOOTH", "Can we design a booth game that is fun, fair, and still raises funds?",
                                 "Weeks 1–9 (integers, equations, experiments)", "C8,M1 – C10,M3", "Chance Lab · Equation Builder · Integer Chips", "PT3.1 Chance Booth Proposal"]},
        {"kind": "exam", "cells": ["Review and Term Exam", "What have I mastered this year, and what will I improve?", "—", "C10,M4 – C10,M5", "SimBook self-checks", "TE3.1 Term Exam"]},
        {"kind": "buffer", "cells": ["Buffer Cycle", "—", "—", "C11", "SimBook for remediation", "Make-up assessments, remediation, and enrichment"]},
    ],
    "legend": "Row colors in the map: green = unit banner · yellow = quiz · blue = performance task · orange = review/term exam · gray = buffer.",
}

R360 = "Uploaded materials in Ranger 360"
SB = lambda n, sim: f"LSGH Math SimBook – Term 3 Lesson {n} (hook sim, lesson slides with notes, and Exercises)"


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
    {"type": "row", "meetings": "1 Meeting", "range": "(C1,M1)", "topic": "Class Orientation: “Math Has Rules – and Chances!”",
     "subtopics": ["Term 3 roadmap and performance task", "Grading system and class policies"],
     "comps": ["Review the Term 3 course outline and roadmap.", "Describe the learning outcomes, grading components, and their percentage weights.",
               "Explain classroom policies, attendance requirements, and academic integrity guidelines."],
     "assess": [("Formative", "CP3.1 – Recitation"), ("Formative", "CP3.1 – “Term 2 to Term 3” one-minute reflection")],
     "acts": ["^^HOOK:^^ “Up and Down” – an elevator, a thermometer, and a piggy bank: what happens when ups and downs combine?",
              ("Discussion on the following:", ["Course outline and roadmap", "Methods of assessment", "Class goals, policies, and expectations"])],
     "res": ["Teacher’s Google presentation", "Student Handbook", R360], "pillars": ["ZS", "SF"]},

    {"type": "banner", "title": "UNIT H · INTEGER POWER! Operations on Integers",
     "sub": "DepEd Term 3, Weeks 1–3 · Number and Algebra · C1,M2 to C4,M1 (15 meetings)",
     "question": "If you owe ₱50 and then earn ₱80, how much do you really have?"},
    lesson("5 Meetings", "(C1,M2 to C2,M1)", "A. Adding and Subtracting Integers",
           ["Integer chips and zero pairs", "Number-line hops and bar models", "Subtracting as adding the opposite"],
           [("A1", True, "Add and subtract integers; using concrete models (e.g., counters, integer chips), pictorial models (e.g., bar models, number lines), and with integers written as numerals."),
            ("M1", False, "Explain the sign of a sum or difference using zero pairs and the idea that subtracting means adding the opposite.")],
           [("Formative", "CP3.1 – Recitation"), ("Summative", "LW3.1 – Integer Chip Mat (C1,M4)"),
            ("Formative", "CP3.2 – Practice Set #1: Adding and Subtracting Integers (C2,M1)")],
           "“Baon Ledger” – a week of baon, snacks, and savings: are you ahead or behind?",
           "Integer Chips (Chip Board, Number Line Hops, Bar Model)",
           ["LW3.1 – Integer Chip Mat: model sums and differences with two-colored chips", "CP3.2 – Practice Set #1"],
           [SB(1, "Integer Chips"), "Two-colored counters or bottle caps", R360], ["ZS"]),
    lesson("6 Meetings", "(C2,M2 to C3,M2)", "B. Multiplying and Dividing Integers; Order of Operations",
           ["Multiplication as repeated groups", "Sign rules from patterns", "Division as the inverse of multiplication",
            "Number properties and GEMDAS"],
           [("A2", True, "Multiply and divide integers."),
            ("A3", True, "Simplify numerical expressions involving integers using number properties and the order of operations (GEMDAS)."),
            ("M2", False, "Explain the sign rules for multiplication and division using patterns.")],
           [("Formative", "CP3.1 – Recitation"), ("Summative", "LW3.2 – Sign Rule Patterns (C2,M4)"),
            ("Summative", "SA3.1 – GEMDAS Relay (C3,M1)"), ("Formative", "CP3.3 – Practice Set #2: Operations on Integers (C3,M2)")],
           "“Diving Pattern” – a diver goes down 3 m every minute. Where are they after 4 minutes? 4 minutes ago?",
           "Sign Machine (Groups of Chips, Sign Patterns, GEMDAS Stepper)",
           ["LW3.2 – Sign Rule Patterns: complete product tables and generalize", "SA3.1 – GEMDAS Relay: teams simplify in turns, one step per learner",
            "CP3.3 – Practice Set #2"],
           [SB(2, "Sign Machine"), "Relay cards", R360], ["ZS", "CM"]),
    lesson("3 Meetings", "(C3,M3 to C3,M5)", "C. Absolute Value",
           ["Absolute value as distance from zero", "Opposites have the same absolute value", "Distance between two integers"],
           [("A4", True, "Identify the absolute value of an integer, and its meaning on the number line."),
            ("M3", False, "Use absolute value to find the distance between two integers in real-life situations.")],
           [("Formative", "CP3.1 – Recitation"), ("Summative", "LW3.3 – Distance Walk (C3,M5)")],
           "“How Far?” – the top of Mt. Pulag and the floor of Manila Bay: which is farther from sea level?",
           "Distance Finder (Distance from Zero, Real Distances)",
           ["LW3.3 – Distance Walk: walk a floor number line and record distances from zero"],
           [SB(3, "Distance Finder"), "Floor number line (masking tape)", R360], ["ZS"]),
    quiz("(C4,M1)", "A, B, C", "A1–A4, M1–M3", "QZ3.1", "Operations on Integers and Absolute Value", 25),

    {"type": "banner", "title": "UNIT I · ALGEBRA STARTER! Expressions, Equality, Formulas, and Equations",
     "sub": "DepEd Term 3, Weeks 3–7 · Number and Algebra · C4,M2 to C8,M1 (20 meetings)",
     "question": "How can one letter stand for every possible number?"},
    lesson("5 Meetings", "(C4,M2 to C5,M1)", "D. Variables, Constants, and Algebraic Expressions",
           ["Variables, constants, terms, and coefficients", "Evaluating expressions by substitution", "Translating verbal phrases"],
           [("A5", True, "Distinguish a variable from a constant in an algebraic expression."),
            ("A6", True, "Evaluate algebraic expressions given the value/s of the variable/s."),
            ("A7", True, "Translate verbal phrases into algebraic expressions."),
            ("M4", False, "Explain why a variable can take many values while a constant stays fixed.")],
           [("Formative", "CP3.1 – Recitation"), ("Summative", "LW3.4 – Expression Machine Cards (C4,M4)"),
            ("Formative", "CP3.4 – Practice Set #3: Expressions (C5,M1)")],
           "“Jeepney Fare Machine” – the fare is ₱13 plus ₱2 for every extra kilometer. What is the fare for any trip?",
           "Expression Machine (Variable or Constant?, Evaluate, Translate)",
           ["LW3.4 – Expression Machine Cards: input–output cards and phrase–expression matching", "CP3.4 – Practice Set #3"],
           [SB(4, "Expression Machine"), "Input–output and phrase cards", R360], ["ZS"]),
    lesson("5 Meetings", "(C5,M2 to C6,M1)", "E. Bar Models and the Properties of Equality",
           ["Equations as balances", "Solving simple equations with bar models", "Properties of equality"],
           [("A8", True, "Solve simple equations represented by bar models to find unknowns."),
            ("A9", True, "Illustrate the properties of equality."),
            ("M5", False, "Justify each step in solving an equation using a property of equality.")],
           [("Formative", "CP3.1 – Recitation"), ("Summative", "LW3.5 – Balance Model (C5,M4)"),
            ("Summative", "SA3.2 – Property Proof (C6,M1)")],
           "“Mystery Bag” – a balance with a bag of unknown marbles on one side. How many are inside?",
           "Balance Lab (Bar Model, Balance Scale, Name the Property)",
           ["LW3.5 – Balance Model: solve equations on a hanger balance or with paper bars",
            "SA3.2 – Property Proof: solve and justify each step with a property"],
           [SB(5, "Balance Lab"), "Hanger balance or paper strips, paper clips", R360], ["ZS", "SF"]),
    lesson("4 Meetings", "(C6,M2 to C6,M5)", "F. Formulas: Solving for a Variable",
           ["Formulas from geometry, motion, money, and science", "Making a different variable the subject", "Checking by substitution"],
           [("A10", True, "Solve one variable in terms of the other variables in a formula."),
            ("M6", False, "Check a rearranged formula by substituting values.")],
           [("Formative", "CP3.1 – Recitation"), ("Summative", "LW3.6 – Formula Flip (C6,M4)")],
           "“Road Trip to Baguio” – 250 km at 50 km/h. How long is the trip? Which formula tells us directly?",
           "Formula Rearranger (Rearrange, Use It)",
           ["LW3.6 – Formula Flip: rearrange formula cards and check with numbers"],
           [SB(6, "Formula Rearranger"), "Formula cards", R360], ["ZS"]),
    quiz("(C7,M1)", "D, E, F", "A5–A10, M4–M6", "QZ3.2", "Expressions, Equality, and Formulas", 25),
    lesson("5 Meetings", "(C7,M2 to C8,M1)", "G. Writing and Solving Equations",
           ["Writing equations from situations", "Finding a non-negative unknown", "Problems with expressions and formulas"],
           [("A11", True, "Write equations in algebraic form."),
            ("A12", True, "Find the value of an unknown in an equation where the unknown is non-negative."),
            ("A13", True, "Solve problems involving algebraic expressions and formulas."),
            ("M7", False, "Check a solution by substituting it back into the equation."),
            ("T1", False, "Write the scoring and earnings rules of the PT3.1 booth as expressions and equations.")],
           [("Formative", "CP3.1 – Recitation"), ("Formative", "CP3.5 – Practice Set #4: Equations (C7,M4)"),
            ("Summative", "SA3.3 – Word Problem Studio (C7,M5)"), ("Summative", "PT3.1 – Scaffold #1: Booth Rules and Scoring Equation (C8,M1)")],
           "“Ipon Challenge” – saving ₱25 a day, when will you reach ₱300 for a new pair of shoes?",
           "Equation Builder (Story to Equation, Solve It, Problem Solving)",
           ["CP3.5 – Practice Set #4", "SA3.3 – Word Problem Studio: write, solve, and check equation stories",
            "Launch of PT3.1 “Family Day Chance Booth”; Scaffold #1"],
           [SB(7, "Equation Builder"), "Teacher-prepared PT3.1 Guidelines and Rubric", R360], ["ZS", "SF"], kind="pt"),

    {"type": "banner", "title": "UNIT J · CHANCE AND SCALE! Experiments and Scientific Notation",
     "sub": "DepEd Term 3, Weeks 8–10 · Data and Probability · Number and Algebra · C8,M2 to C10,M2 (11 meetings)",
     "question": "How many heads will you get in 100 tosses – and how big is a billion?"},
    lesson("5 Meetings", "(C8,M2 to C9,M1)", "H. Experiments and Outcomes",
           ["Experiments, trials, and outcomes", "Outcomes in words and symbols", "Tables and graphs of results", "Solving problems using outcomes"],
           [("A14", True, "Collect data from experiments (e.g., number of heads obtained when tossing a coin, a number of times, number of prime numbers obtained when rolling a die a number of times)."),
            ("A15", True, "Express outcomes in words and/or symbols, and represent outcomes in tables and/or graphs."),
            ("A16", True, "Solve problems using the outcomes of experiments."),
            ("M8", False, "Explain why results vary from one experiment to another and settle as the number of trials grows."),
            ("T2", False, "Run and record at least 50 trial plays of the PT3.1 booth game.")],
           [("Formative", "CP3.1 – Recitation"), ("Summative", "LW3.7 – Coin and Die Lab (C8,M3)"),
            ("Summative", "PT3.1 – Scaffold #2: Booth Experiment Data (C8,M5)"), ("Summative", "PT3.1 – Scaffold #3: Prize Plan (C9,M1)")],
           "“Heads or Tails Showdown” – each learner predicts the number of heads in 20 tosses, then tosses.",
           "Chance Lab (Coin Toss, Die Roll, Spinner Booth)",
           ["LW3.7 – Coin and Die Lab: pool class data and graph it", "PT3.1 – Scaffolds #2 and #3"],
           [SB(8, "Chance Lab"), "Coins, dice, paper spinners", "Google Sheets", R360], ["ZS", "CM"], kind="pt"),
    lesson("5 Meetings", "(C9,M2 to C10,M1)", "I. Scientific Notation",
           ["Powers of ten", "Writing very large and very small numbers in scientific notation, and vice versa",
            "Multiplying, dividing, adding, and subtracting in scientific notation"],
           [("A17", True, "Write numbers in scientific notation to represent very large or very small numbers, and vice versa."),
            ("A18", True, "Perform operations on numbers expressed in scientific notation."),
            ("M9", False, "Explain how the exponent shows the size of a number.")],
           [("Formative", "CP3.1 – Recitation"), ("Summative", "LW3.8 – Powers-of-Ten Scale Strip (C9,M4)"),
            ("Formative", "CP3.6 – Practice Set #5: Scientific Notation (C10,M1)")],
           "“From a Virus to the Sun” – arrange picture cards from smallest to largest. How many zeros?",
           "Powers-of-Ten Zoom (Zoom, Convert, Operate)",
           ["LW3.8 – Powers-of-Ten Scale Strip: place objects on a strip by their power of ten", "CP3.6 – Practice Set #5"],
           [SB(9, "Powers-of-Ten Zoom"), "Picture cards, adding-machine paper strip", R360], ["ZS", "CM"]),
    quiz("(C10,M2)", "G, H, I", "A11–A18, M7–M9, T1–T2", "QZ3.3", "Equations, Experiments, and Scientific Notation", 25),

    {"type": "row", "kind": "pt", "meetings": "1 Meeting", "range": "(C10,M3)", "topic": "Final Performance Task: “Family Day Chance Booth”",
     "subtopics": ["Booth pitch: rules, experiment data, scoring equation, and prize plan"],
     "comps": [("T3", False, "Present the booth’s outcomes in words, symbols, a table, and a graph, using the experiment data."),
               ("T4", False, "Use the scoring and earnings equations, with integers for gains and losses, to predict results for 200 players."),
               ("T5", False, "Defend the booth’s fairness and prize plan with evidence and answer questions respectfully.")],
     "assess": [("Summative", "PT3.1 – Chance Booth Proposal")],
     "acts": ["Booth fair: groups set up prototype booths and let classmates play", "3-minute pitch per group to a panel",
              "Reflection: “When is a game of chance fair, and why does it matter?”"],
     "res": ["Teacher-prepared PT3.1 Guidelines and Rubric", "Booth materials (coins, dice, spinners)", "Students’ PT3.1 output uploaded in Ranger 360"],
     "pillars": ["CM", "ZS", "SF"]},
    {"type": "row", "kind": "exam", "meetings": "1 Meeting", "range": "(C10,M4)", "topic": "Term Review: “Algebra Amazing Race”", "comp_lead": False,
     "comps": ["A1–A18, M1–M9, T1–T2"], "assess": [("Formative", "CP3.1 – Review stations")],
     "acts": ["Team race stations covering Units H, I, and J"], "res": ["Teacher-prepared station cards", R360], "pillars": ["CM"]},
    {"type": "row", "kind": "exam", "meetings": "1 Meeting", "range": "(C10,M5)", "topic": "Term Exam", "comp_lead": False,
     "comps": ["A1–A18, M1–M9, T1–T2"], "assess": [("Summative", "TE3.1 – Term Exam")],
     "acts": ["TE3.1 – Term Exam covering Units H, I, and J"], "res": ["Teacher-made TE3.1"], "pillars": ["SF"]},
    {"type": "row", "kind": "buffer", "meetings": "Buffer Cycle", "range": "(C11)", "topic": "Buffer", "comp_lead": False,
     "comps": ["As needed"], "assess": [("Summative", "Make-up assessments")],
     "acts": ["Make-up assessments for excused absences", "Remediation and enrichment using the SimBook", "Adjustments for class suspensions and school activities"],
     "res": [R360], "pillars": ["ZS"]},
]

SIGNATORIES = _t1.SIGNATORIES
