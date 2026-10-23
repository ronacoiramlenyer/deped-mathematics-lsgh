"""Grade 7 Mathematics – Curriculum Map, 2nd Trimester, SY 2026-2027.

Source of truth: DepEd MATATAG Mathematics Curriculum Guide, Grade 7 Quarter 2
competencies 3–12 and Quarter 3 competencies 1–8, as assigned to the Second Term by
the DepEd Three-Term Budget of Work (sources/deped/). Content standards, performance
standards, and competencies marked DepEd (True, shown with ★) are quoted verbatim.

Schedule: 5 meetings per cycle, 10 usable cycles (50 meetings); C11 is a buffer.
"""

import importlib.util
from pathlib import Path

_spec = importlib.util.spec_from_file_location("g7t1cm", Path(__file__).with_name("grade7_term1_cm.py"))
_t1 = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(_t1)

SIMBOOK = "https://claude.ai/artifact/LrpohtVMd8ifUt7nkd7FFr"

HEADER = {
    "lines": ["LA SALLE GREEN HILLS", "Mathematics Department (Grade 7)", "2nd Trimester, SY 2026 - 2027"],
    "title": "CURRICULUM MAP",
    "note": "Aligned with the DepEd MATATAG Mathematics Curriculum Guide (Grade 7, Quarter 2 items 3–12 "
            "and Quarter 3 items 1–8) as sequenced in the DepEd Three-Term Budget of Work (Second Term). "
            "Competencies marked ★ are DepEd learning competencies quoted verbatim.",
}

STANDARDS = [
    {
        "label": "CONTENT STANDARDS",
        "lead": "The learners should have knowledge and understanding of…",
        "items": [
            "conversion of units of measure",
            "volume of square and rectangular pyramids, and cylinders",
            "sets and subsets, and the union and intersection of sets using Venn diagrams",
            "subset of real numbers",
            "data collection and sampling techniques, and the presentation of data in appropriate "
            "tables and graphs",
            "interpretation of statistical graphs",
            "the set of integers, and comparing and ordering integers",
        ],
    },
    {
        "label": "PERFORMANCE STANDARDS",
        "lead": "By the end of the term, the learners are able to…",
        "items": [
            "convert units of measure from different systems of measure.",
            "find the volume of square and rectangular pyramids, and the volume of cylinders.",
            "describe sets and their subsets, and the union and intersection of sets.",
            "illustrates sets and subsets, and union and intersection of sets, using Venn diagrams.",
            "collect data, and organize data in a frequency distribution table.",
            "represent and interpret data in different types of graphs.",
            "compare and order integers, including through the use of the number line.",
        ],
        "groups": _t1.STANDARDS[1]["groups"],
    },
    {
        "label": "ESSENTIAL QUESTION/S:",
        "lead": "The learners will keep considering:",
        "numbered": True,
        "items": [
            "How do we measure and compare the space objects occupy, even when the units are different?",
            "How can sets, diagrams, and the number line help us see how numbers and groups are related?",
            "How can data from a small sample tell a trustworthy story about a whole group?",
        ],
    },
    {
        "label": "ENDURING UNDERSTANDING:",
        "lead": "The learners will understand that:",
        "numbered": True,
        "items": [
            "Measurements can be converted within and across systems using powers of ten and conversion "
            "factors, and the volume of a solid is built from the area of its base and its height.",
            "Sets, Venn diagrams, and the number line organize numbers and show their relationships – "
            "from subsets of the real numbers to the order of the integers.",
            "Fairly chosen samples, well-organized tables, and appropriate graphs turn raw data into "
            "evidence for sound decisions.",
        ],
    },
    {
        "label": "TRANSFER GOAL",
        "text": "The learners will be able to independently gather data from a fairly chosen sample, organize "
                "and represent it in appropriate tables and graphs, and use measurement and volume to design "
                "a practical solution for their school community – such as a water refill station sized to "
                "the class’s needs – and justify their recommendations with evidence.",
    },
]

ROADMAP = {
    "title": "TERM 2 ROADMAP AT A GLANCE",
    "subtitle": "5 meetings per cycle · 10 usable cycles (50 meetings) · Cycle 11 reserved as buffer · "
                "Every lesson has its own simulation in the LSGH Math SimBook",
    "columns": ["UNIT", "BIG QUESTION", "DepEd WEEKS", "CYCLES", "SIGNATURE SIMS", "SIGNATURE TASK"],
    "widths": [2500, 3000, 1300, 1600, 2560, 2000],
    "rows": [
        {"cells": ["Unit D · MEASURE UP! Units and Volume", "Is a 5-km fun run longer than 3 miles?",
                   "Weeks 1–4", "C1,M2 – C4,M5", "Unit Ladder · Cylinder Lab · Pyramid Lab", "SA2.2 Packaging Challenge"]},
        {"cells": ["Unit E · SET IT UP! Sets and the Real Numbers", "Is every whole number also a rational number?",
                   "Weeks 5–6", "C5,M1 – C6,M2", "Venn Lab · Real Number Map", "LW2.4 Venn Survey"]},
        {"cells": ["Unit F · DATA DETECTIVES! Sampling, Tables, and Graphs", "Can asking 40 students tell us about all 400?",
                   "Weeks 6–8", "C6,M3 – C8,M5", "Sampling Lab · Graph Studio", "SA2.4 Graph Makeover"]},
        {"cells": ["Unit G · INTEGER WORLD! The Set of Integers", "Which is colder: −8 °C or −5 °C?",
                   "Weeks 9–10", "C9,M1 – C10,M2", "Integer Elevator · Integer Number Line", "LW2.7 Integer Walk"]},
        {"kind": "pt", "cells": ["Performance Task · HYDRATION STATION", "Do we drink enough water – and how big should our refill tank be?",
                                 "Weeks 1–8 (data, volume, units)", "C6 – C10,M3", "Sampling Lab · Graph Studio · Cylinder Lab", "PT2.1 Hydration Station Report"]},
        {"kind": "exam", "cells": ["Review and Term Exam", "What have I mastered, and what will I improve?", "—", "C10,M4 – C10,M5", "SimBook self-checks", "TE2.1 Term Exam"]},
        {"kind": "buffer", "cells": ["Buffer Cycle", "—", "—", "C11", "SimBook for remediation", "Make-up assessments, remediation, and enrichment"]},
    ],
    "legend": "Row colors in the map: green = unit banner · yellow = quiz · blue = performance task · orange = review/term exam · gray = buffer.",
}

R360 = "Uploaded materials in Ranger 360"
SB = lambda n, sim: f"LSGH Math SimBook – Term 2 Lesson {n} (hook sim, lesson slides with notes, and Exercises)"


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
    {"type": "row", "meetings": "1 Meeting", "range": "(C1,M1)", "topic": "Class Orientation: “Math Is Measured!”",
     "subtopics": ["Term 2 roadmap and performance task", "Grading system and class policies"],
     "comps": ["Review the Term 2 course outline and roadmap.", "Describe the learning outcomes, grading components, and their percentage weights.",
               "Explain classroom policies, attendance requirements, and academic integrity guidelines."],
     "assess": [("Formative", "CP2.1 – Recitation"), ("Formative", "CP2.1 – “Term 1 to Term 2” one-minute reflection")],
     "acts": ["^^HOOK:^^ “Guess the Measure” – estimate the length of the classroom, the mass of a book, and the water in a jug.",
              ("Discussion on the following:", ["Course outline and roadmap", "Methods of assessment", "Class goals, policies, and expectations"])],
     "res": ["Teacher’s Google presentation", "Student Handbook", R360], "pillars": ["ZS", "SF"]},

    {"type": "banner", "title": "UNIT D · MEASURE UP! Units of Measure and Volume",
     "sub": "DepEd Term 2, Weeks 1–4 · Measurement and Geometry · C1,M2 to C4,M5 (19 meetings)",
     "question": "Is a 5-km fun run longer than 3 miles?"},
    lesson("9 Meetings", "(C1,M2 to C2,M5)", "A. Converting Units of Measure",
           ["Metric prefixes and the SI staircase", "Length, mass, and capacity conversions", "Converting between the metric and English systems"],
           [("A1", True, "Convert units of measure within the International System of Units (SI) and across different systems of measure."),
            ("M1", False, "Decide whether to multiply or divide when converting, and check that the answer makes sense."),
            ("T1", False, "Use conversions to compare real measurements (distances, masses, capacities) from different sources.")],
           [("Formative", "CP2.1 – Recitation"), ("Summative", "LW2.1 – Metric Measuring Lab (C2,M2)"),
            ("Formative", "CP2.2 – Practice Set #1: Conversions (C2,M4)"), ("Summative", "SA2.1 – Unit Detective (C2,M5)")],
           "“Fun Run Mystery” – is a 5-km run longer than a 3-mile run? Vote, then find out.",
           "Unit Ladder (Metric Staircase, Across Systems)",
           ["LW2.1 – Metric Measuring Lab: measure classroom objects and convert", "CP2.2 – Practice Set #1",
            "SA2.1 – Unit Detective: compare product labels and road signs in different units"],
           [SB(1, "Unit Ladder"), "Meter sticks, tape measures, kitchen scale, measuring cups", "Product labels and road-sign photos", R360],
           ["ZS"]),
    lesson("4 Meetings", "(C3,M1 to C3,M4)", "B. Volume of a Cylinder",
           ["Parts of a cylinder", "From the area of a circle to V = πr²h", "Problems involving cylinders"],
           [("A2", True, "Explain inductively the volume of a cylinder using the area of a circle, leading to the identification of the formula."),
            ("A3", True, "Find the volume of a cylinder."),
            ("A4", True, "Solve problems involving the volumes of cylinders."),
            ("M2", False, "Explain how changing the radius or the height changes the volume.")],
           [("Formative", "CP2.1 – Recitation"), ("Summative", "LW2.2 – Can Lab (C3,M3)")],
           "“Which Can Holds More?” – a tall, thin can or a short, wide one?",
           "Cylinder Lab (Stack the Circles, Which Holds More?)",
           ["Coin-stack model of a cylinder", "LW2.2 – Can Lab: measure real cans, compute, then check with water"],
           [SB(2, "Cylinder Lab"), "Empty cans, rulers, measuring cups, water", R360], ["ZS"]),
    lesson("5 Meetings", "(C3,M5 to C4,M4)", "C. Volume of Square and Rectangular Pyramids",
           ["Pyramids and prisms with the same base and height", "V = ⅓Bh", "Estimating and solving problems"],
           [("A5", True, "Explore inductively the volume of square and rectangular pyramids using rectangular prisms, leading to the identification of the formula."),
            ("A6", True, "Estimate volumes of square and rectangular pyramids."),
            ("A7", True, "Solve problems involving volumes of square or rectangular pyramids."),
            ("M3", False, "Explain why the volume of a pyramid is one-third of the prism with the same base and height.")],
           [("Formative", "CP2.1 – Recitation"), ("Summative", "LW2.3 – Pyramid Model (C4,M2)"), ("Summative", "SA2.2 – Packaging Challenge (C4,M4)")],
           "“Sand Pour” – how many pyramids of sand fill a box?",
           "Pyramid Lab (Pour Three Times, Estimate)",
           ["LW2.3 – Pyramid Model: build a paper pyramid and prism and test with rice", "SA2.2 – Packaging Challenge: design a pyramid box with a given volume"],
           [SB(3, "Pyramid Lab"), "Cardboard nets, rice or sand", R360], ["ZS", "CM"]),
    quiz("(C4,M5)", "A, B, C", "A1–A7, M1–M3, T1", "QZ2.1", "Units of Measure and Volume", 25),

    {"type": "banner", "title": "UNIT E · SET IT UP! Sets and the Real Numbers",
     "sub": "DepEd Term 2, Weeks 5–6 · Number and Algebra · C5,M1 to C6,M2 (7 meetings)",
     "question": "Is every whole number also a rational number?"},
    lesson("5 Meetings", "(C5,M1 to C5,M5)", "D. Sets, Subsets, Union, and Intersection",
           ["Sets, elements, and notation", "Subsets and the universal set", "Union, intersection, and complement with Venn diagrams"],
           [("A8", True, "Describe sets and their subsets, the union of sets, and the intersection of sets"),
            ("A9", True, "Illustrate sets and their subsets, the union of sets, and the intersection of sets, through the use of Venn diagrams."),
            ("M4", False, "Use Venn diagrams to solve counting problems from surveys.")],
           [("Formative", "CP2.1 – Recitation"), ("Summative", "LW2.4 – Venn Survey (C5,M3)"), ("Formative", "CP2.3 – Practice Set #2: Sets (C5,M5)")],
           "“Stand in the Circle” – a floor Venn diagram: learners who like basketball, volleyball, or both.",
           "Venn Lab",
           ["LW2.4 – Venn Survey: survey the class on two preferences and draw the Venn diagram", "CP2.3 – Practice Set #2"],
           [SB(4, "Venn Lab"), "Two hula hoops or rope circles", R360], ["CM"]),
    lesson("2 Meetings", "(C6,M1 to C6,M2)", "E. Subsets of Real Numbers",
           ["Natural, whole, integer, rational, irrational, and real numbers", "How the sets are nested"],
           [("A10", True, "Illustrate the different subsets of real numbers."),
            ("M5", False, "Justify the classification of a number into the subsets of the real numbers.")],
           [("Formative", "CP2.1 – Recitation"), ("Summative", "LW2.5 – Real Number Sort (C6,M2)")],
           "“Number Family Tree” – where does each number live?",
           "Real Number Map",
           ["LW2.5 – Real Number Sort: classify number cards in a nested diagram"],
           [SB(5, "Real Number Map"), "Number cards", R360], ["ZS"]),

    {"type": "banner", "title": "UNIT F · DATA DETECTIVES! Sampling, Tables, and Graphs",
     "sub": "DepEd Term 2, Weeks 6–8 · Data and Probability · C6,M3 to C8,M5 (13 meetings)",
     "question": "Can asking 40 students tell us about all 400?"},
    lesson("3 Meetings", "(C6,M3 to C6,M5)", "F. Data Collection and Sampling Techniques",
           ["Population, census, and sample", "Survey, interview, observation, experiment, and existing records", "Random, systematic, stratified, and convenience sampling"],
           [("A11", True, "Investigate different data collection and sampling techniques."),
            ("M6", False, "Explain how the choice of sampling technique can make results fair or biased."),
            ("T2", False, "Plan a fair survey for the PT2.1 Hydration Station Report.")],
           [("Formative", "CP2.1 – Recitation"), ("Summative", "PT2.1 – Scaffold #1: Survey Plan and Sampling Method (C6,M5)")],
           "“Ask the Gate” – does asking only the learners at the gate tell the truth about everyone?",
           "Sampling Lab (Sampling Lab, Which Method?)",
           ["Data collection method sort", "Launch of PT2.1 “Hydration Station”; Scaffold #1"],
           [SB(6, "Sampling Lab"), "Teacher-prepared PT2.1 Guidelines and Rubric", R360], ["ZS", "SF"], kind="pt"),
    quiz("(C7,M1)", "D, E, F", "A8–A11, M4–M6, T2", "QZ2.2", "Sets, Real Numbers, and Sampling", 25),
    lesson("8 Meetings", "(C7,M2 to C8,M4)", "G. Organizing and Graphing Data",
           ["Frequency distribution tables", "Pie, bar, and line graphs; stem-and-leaf plots", "Interpreting statistical graphs"],
           [("A12", True, "Organize statistical data in a frequency distribution table."),
            ("A13", True, "Use appropriate graphs to represent organized data: pie graph, bar graph, line graph, and stem-and-leaf plot."),
            ("A14", True, "Interpret statistical graphs."),
            ("M7", False, "Choose the most appropriate graph for a data set and justify the choice."),
            ("T3", False, "Organize and graph the PT2.1 survey data.")],
           [("Formative", "CP2.1 – Recitation"), ("Summative", "LW2.6 – Class Data FDT (C7,M4)"), ("Formative", "CP2.4 – Practice Set #3: Graphs (C8,M2)"),
            ("Summative", "SA2.4 – Graph Makeover (C8,M3)"), ("Summative", "PT2.1 – Scaffold #2: Data Tables and Graphs (C8,M4)")],
           "“Misleading Graph” – a news graph that tells the wrong story. What is wrong?",
           "Graph Studio (Frequency Table, Bar ↔ Pie, Line Graph, Stem-and-Leaf)",
           ["LW2.6 – Class Data FDT", "CP2.4 – Practice Set #3", "SA2.4 – Graph Makeover: redraw a poor graph with the right type", "PT2.1 – Scaffold #2"],
           [SB(7, "Graph Studio"), "Graphing paper, protractor, compass", "Google Sheets", R360], ["ZS", "CM"]),
    quiz("(C8,M5)", "G", "A12–A14, M7, T3", "QZ2.3", "Organizing and Graphing Data", 20),

    {"type": "banner", "title": "UNIT G · INTEGER WORLD! The Set of Integers",
     "sub": "DepEd Term 2, Weeks 9–10 · Number and Algebra · C9,M1 to C10,M2 (7 meetings)",
     "question": "Which is colder: −8 °C or −5 °C?"},
    lesson("4 Meetings", "(C9,M1 to C9,M4)", "H. The Set of Integers",
           ["Positive and negative integers, and zero", "Opposites", "Integers in real-life situations"],
           [("A15", True, "Describe the set of integers."),
            ("A16", True, "Use positive and negative numbers to describe directions or opposites in real-life situations."),
            ("M8", False, "Interpret the meaning of zero and of opposites in different contexts."),
            ("T4", False, "Design the PT2.1 refill tank, converting its volume to litres.")],
           [("Formative", "CP2.1 – Recitation"), ("Summative", "LW2.7 – Integer Walk (C9,M3)"), ("Summative", "PT2.1 – Scaffold #3: Tank Design and Conversions (C9,M4)")],
           "“Basement or Rooftop?” – which floor number does a basement get?",
           "Integer Elevator",
           ["LW2.7 – Integer Walk: a floor number line with elevator, temperature, and money cards", "PT2.1 – Scaffold #3"],
           [SB(8, "Integer Elevator"), "Floor number line (masking tape)", R360], ["CM"]),
    lesson("3 Meetings", "(C9,M5 to C10,M2)", "I. Comparing and Ordering Integers",
           ["Locating integers on the number line", "Comparing integers with < and >", "Ordering integers"],
           [("A17", True, "Locate integers on the number line."),
            ("A18", True, "Compare and order integers."),
            ("M9", False, "Explain how to compare negative integers using their distance from zero.")],
           [("Formative", "CP2.1 – Recitation"), ("Formative", "CP2.5 – Practice Set #4: Integers (C10,M2)")],
           "“World Weather” – order cities from coldest to warmest.",
           "Integer Number Line (Compare, Order)",
           ["Human number line ordering game", "CP2.5 – Practice Set #4"],
           [SB(9, "Integer Number Line"), "Integer cards", R360], ["ZS"]),

    {"type": "row", "kind": "pt", "meetings": "1 Meeting", "range": "(C10,M3)", "topic": "Final Performance Task: “Hydration Station”",
     "subtopics": ["Presentation of the survey report and the refill-tank design"],
     "comps": [("T5", False, "Present a data-based report with appropriate tables and graphs, and a refill-tank design with correct volume and unit conversions."),
               ("T6", False, "Justify recommendations using the data and answer questions respectfully.")],
     "assess": [("Summative", "PT2.1 – Hydration Station Report")],
     "acts": ["Gallery walk of group posters", "3-minute report per group to a panel", "Reflection: “How can data help us care for our health?”"],
     "res": ["Teacher-prepared PT2.1 Guidelines and Rubric", "Google Sheets and Slides", "Students’ PT2.1 output uploaded in Ranger 360"],
     "pillars": ["CM", "ZS", "SF"]},
    {"type": "row", "kind": "exam", "meetings": "1 Meeting", "range": "(C10,M4)", "topic": "Term Review: “Data Detective Escape Room”", "comp_lead": False,
     "comps": ["A1–A18, M1–M9, T1–T4"], "assess": [("Formative", "CP2.1 – Review stations")],
     "acts": ["Team escape-room stations covering Units D, E, F, and G"], "res": ["Teacher-prepared station cards", R360], "pillars": ["CM"]},
    {"type": "row", "kind": "exam", "meetings": "1 Meeting", "range": "(C10,M5)", "topic": "Term Exam", "comp_lead": False,
     "comps": ["A1–A18, M1–M9, T1–T4"], "assess": [("Summative", "TE2.1 – Term Exam")],
     "acts": ["TE2.1 – Term Exam covering Units D, E, F, and G"], "res": ["Teacher-made TE2.1"], "pillars": ["SF"]},
    {"type": "row", "kind": "buffer", "meetings": "Buffer Cycle", "range": "(C11)", "topic": "Buffer", "comp_lead": False,
     "comps": ["As needed"], "assess": [("Summative", "Make-up assessments")],
     "acts": ["Make-up assessments for excused absences", "Remediation and enrichment using the SimBook", "Adjustments for class suspensions and school activities"],
     "res": [R360], "pillars": ["ZS"]},
]

SIGNATORIES = _t1.SIGNATORIES
