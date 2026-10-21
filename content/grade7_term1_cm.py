"""Grade 7 Mathematics – Curriculum Map, 1st Trimester, SY 2026-2027.

Source of truth: DepEd MATATAG Grade 7 Mathematics Three-Term Budget of Work
for Learning Competencies, First Term (last updated April 17, 2026) –
sources/deped/MATATAG-Grade7-Mathematics-Three-Term-BOW-SY2026-2027.pdf

Content standards, performance standards, and every competency marked as
DepEd (True, shown with ★) are copied verbatim from that document.

Schedule: 5 math meetings per 6-day cycle, 10 usable cycles (C1–C10 = 50
meetings); C11 is a buffer. DepEd Week n ≈ Cycle n.
Competency codes follow UbD: A = Acquisition, M = Meaning-making, T = Transfer.
"""

HEADER = {
    "lines": [
        "LA SALLE GREEN HILLS",
        "Mathematics Department (Grade 7)",
        "1st Trimester, SY 2026 - 2027",
    ],
    "title": "CURRICULUM MAP",
    "note": "Aligned with the DepEd MATATAG Grade 7 Mathematics Three-Term Budget of Work "
            "for Learning Competencies (First Term). Competencies marked ★ are DepEd "
            "learning competencies quoted verbatim.",
}

STANDARDS = [
    {
        "label": "CONTENT STANDARDS",
        "lead": "The learners should have knowledge and understanding of…",
        "items": [
            "regular and irregular polygons and their features/properties",
            "determination of measures of angles and number of sides of polygons",
            "application of percentages",
            "use of rates",
            "rational numbers",
            "square roots of perfect squares, cube roots of perfect cubes, and irrational numbers",
        ],
    },
    {
        "label": "PERFORMANCE STANDARDS",
        "lead": "By the end of the term, the learners are able to…",
        "items": [
            "draw, and describe the features/properties of, regular and irregular polygons.",
            "use percentages in different contexts.",
            "identify and use rates.",
            "create a financial plan.",
            "describe, order, and perform operations on, rational numbers.",
            "determine square roots of perfect squares and cube roots of perfect cubes, and "
            "identify irrational numbers.",
        ],
        "groups": [
            {"title": "NCTM Process Standards:", "items": []},
            {"title": "Problem Solving", "items": [
                "Students build new mathematical knowledge and solve problems that arise in "
                "mathematics and in other contexts."]},
            {"title": "Reasoning and Proof", "items": [
                "Students make and investigate mathematical conjectures and develop and "
                "evaluate mathematical arguments."]},
            {"title": "Communication", "items": [
                "Students communicate their mathematical thinking coherently and clearly to "
                "peers, teachers, and others."]},
            {"title": "Connections", "items": [
                "Students recognize and apply mathematics in contexts outside of mathematics."]},
            {"title": "Representation", "items": [
                "Students use representations (drawings, number lines, tables, models) to "
                "model and interpret mathematical phenomena."]},
        ],
    },
    {
        "label": "ESSENTIAL QUESTION/S:",
        "lead": "The learners will keep considering:",
        "numbered": True,
        "items": [
            "How do the shapes and angles around me follow mathematical rules, and how can I "
            "use these rules to draw and design with precision?",
            "How can I use percentages and rates to make smart, honest, and responsible "
            "decisions about money?",
            "Why do we need different kinds of numbers, and how do they all fit together on "
            "the number line?",
        ],
    },
    {
        "label": "ENDURING UNDERSTANDING:",
        "lead": "The learners will understand that:",
        "numbered": True,
        "items": [
            "Polygons and angles follow predictable relationships – angle pairs, interior and "
            "exterior angles, and angle sums – that allow us to measure, draw, and design "
            "accurately.",
            "Percentages and rates are powerful tools for comparing quantities, judging value, "
            "and planning how to use resources wisely for ourselves and for others.",
            "Rational and irrational numbers together fill the number line; understanding "
            "their forms and operations helps us compute and reason accurately in everyday "
            "life.",
        ],
    },
    {
        "label": "TRANSFER GOAL",
        "text": "The learners will be able to independently use percentages, rates, and "
                "operations on rational numbers to create a realistic financial plan – such as "
                "budgeting for a class outreach or fundraising activity for a partner community "
                "– and justify every decision with mathematical evidence, demonstrating "
                "responsible stewardship of resources in the service of others.",
    },
]

ROADMAP = {
    "title": "TERM 1 ROADMAP AT A GLANCE",
    "subtitle": "5 meetings per cycle · 10 usable cycles (50 meetings) · Cycle 11 reserved "
                "as buffer",
    "columns": ["UNIT", "BIG QUESTION", "DepEd WEEKS", "CYCLES", "SIGNATURE TASK"],
    "widths": [3000, 4160, 1500, 1800, 2500],
    "rows": [
        {"cells": ["Unit A · SHAPE UP! Polygons and Angles",
                   "Why do honeycombs use hexagons and stop signs have eight sides?",
                   "Weeks 1–3", "C1,M2 – C4,M1",
                   "SA1.1 Polygon Design Challenge"]},
        {"cells": ["Unit B · MONEY SMART! Percentages, Financial Planning, and Rates",
                   "Is “Buy 1, Take 1” really the same as 50% off?",
                   "Weeks 4–6", "C4,M2 – C6,M5",
                   "SA1.2 Best Buy Battle · PT1.1 launch"]},
        {"cells": ["Unit C · NUMBER LINE ADVENTURES! Rational Numbers and Roots",
                   "Can a square tile have an area of exactly 2 square units?",
                   "Weeks 7–10", "C7,M1 – C10,M1",
                   "SA1.3 Rational Relay"]},
        {"kind": "pt",
         "cells": ["Performance Task · BUDGET FOR A CAUSE",
                   "How can wise budgeting help me serve others?",
                   "Week 5 (Create a financial plan)", "C5 – C10,M3",
                   "PT1.1 Financial Plan Pitch"]},
        {"kind": "exam",
         "cells": ["Review and Term Exam", "What have I mastered, and what will I improve?",
                   "—", "C10,M4 – C10,M5", "TE1.1 Term Exam"]},
        {"kind": "buffer",
         "cells": ["Buffer Cycle", "—", "—", "C11",
                   "Make-up assessments, remediation, and enrichment"]},
    ],
    "legend": "Row colors in the map: green = unit banner · yellow = quiz · blue = performance "
              "task · orange = review/term exam · gray = buffer.",
}

R360 = "Uploaded materials in Ranger 360"
SLIDES = "Teacher’s Google presentation"

ROWS = [
    # ------------------------------------------------------------ Orientation
    {
        "type": "row",
        "meetings": "1 Meeting",
        "range": "(C1,M1)",
        "topic": "Class Orientation: “Math Is Everywhere!”",
        "subtopics": ["Course outline and Term 1 roadmap", "Grading system and class policies"],
        "comps": [
            "Review the course outline and the Term 1 roadmap.",
            "Describe the intended learning outcomes, grading components, and their "
            "percentage weights.",
            "Explain classroom policies, attendance requirements, and academic integrity "
            "guidelines.",
        ],
        "assess": [
            ("Formative", "CP1.1 – Recitation"),
            ("Formative", "CP1.1 – “My Math Story” one-minute reflection"),
        ],
        "acts": [
            "^^HOOK:^^ “Math Around Me” – spot the math hidden in a photo of a Filipino "
            "street scene (shapes, prices, speed signs).",
            ("Discussion on the following:", [
                "Course outline and roadmap",
                "Methods of assessment",
                "Class goals, policies, and expectations",
            ]),
        ],
        "res": [SLIDES, "Student Handbook", R360],
        "pillars": ["ZS", "SF"],
    },

    # ------------------------------------------------------------ Unit A
    {
        "type": "banner",
        "title": "UNIT A · SHAPE UP! Polygons and Angles",
        "sub": "DepEd Term 1, Weeks 1–3 · Measurement and Geometry · C1,M2 to C4,M1 (15 meetings)",
        "question": "Why do honeycombs use hexagons and stop signs have eight sides?",
    },
    {
        "type": "row",
        "meetings": "5 Meetings",
        "range": "(C1,M2 to C2,M1)",
        "topic": "A. Drawing Polygons",
        "subtopics": [
            "Regular and irregular polygons with 5, 6, 8, or 10 sides",
            "Drawing polygons from side and angle measurements",
            "Drawing triangles, quadrilaterals, and regular polygons with given angle measures",
        ],
        "comps": [
            ("A1", True, "Draw and describe regular and irregular polygons with 5, 6, 8, or "
                         "10 sides, based on measurements of sides and angles, using a ruler "
                         "and protractor."),
            ("A2", True, "Draw triangles, quadrilaterals, and regular polygons (5, 6, 8, or 10 "
                         "sides) with given angle measures."),
            ("M1", False, "Explain how equal sides and equal angles make a polygon regular."),
            ("M2", False, "Appreciate precision and care in using measuring tools."),
        ],
        "assess": [
            ("Formative", "CP1.1 – Recitation"),
            ("Formative", "CP1.1 – “Draw-It-Right” pair check"),
            ("Summative", "LW1.1 – Polygon Construction Lab (C2,M1)"),
        ],
        "acts": [
            "^^HOOK:^^ “Polygon Spotting” – find polygons in a parol, floor tiles, road "
            "signs, and honeycombs.",
            "Teacher demo: measuring and drawing angles with a protractor.",
            "“Draw-It-Right” pair challenge – one partner dictates measures, the other draws.",
            "LW1.1 – Polygon Construction Lab",
        ],
        "res": [SLIDES, "Ruler, protractor, and grid paper", "GeoGebra (polygon tools)",
                R360, "Student’s LW1.1 output uploaded in Ranger 360"],
        "pillars": ["ZS"],
    },
    {
        "type": "row",
        "meetings": "5 Meetings",
        "range": "(C2,M2 to C3,M1)",
        "topic": "B. Angle Pairs and Classifying Polygons",
        "subtopics": [
            "Angle pairs: complementary, supplementary, adjacent, linear pair, and vertical "
            "angles",
            "Classifying polygons by number of sides, regular or irregular, and convex or "
            "non-convex",
        ],
        "comps": [
            ("A3", True, "Describe and explain the relationships between angle pairs based "
                         "on their measures."),
            ("A4", True, "Classify polygons according to the number of sides, whether they "
                         "are regular or irregular, and whether they are convex or "
                         "non-convex."),
            ("M3", False, "Find unknown angle measures using angle-pair relationships."),
            ("M4", False, "Justify the classification of a polygon using its properties."),
        ],
        "assess": [
            ("Formative", "CP1.1 – Recitation"),
            ("Summative", "LW1.2 – Angle Hunt (C2,M4)"),
            ("Formative", "CP1.2 – Practice Set #1: Polygons and Angle Pairs (C3,M1)"),
        ],
        "acts": [
            "^^HOOK:^^ “Scissors and Clocks” – what angle pairs do open scissors and clock "
            "hands make?",
            "LW1.2 – Angle Hunt: photograph, measure, and name angle pairs around the campus.",
            "“Polygon Sort” card game – regular/irregular, convex/non-convex.",
            "CP1.2 – Practice Set #1",
        ],
        "res": [SLIDES, "Protractor and device camera", "Polygon Sort cards", R360,
                "Student’s LW1.2 output uploaded in Ranger 360"],
        "pillars": ["CM", "ZS"],
    },
    {
        "type": "row",
        "meetings": "4 Meetings",
        "range": "(C3,M2 to C3,M5)",
        "topic": "C. Angles of Polygons",
        "subtopics": [
            "Interior and exterior angles of a polygon",
            "Sum of interior angles; each angle of a regular polygon",
            "Finding the number of sides from angle measures",
        ],
        "comps": [
            ("A5", True, "Deduce the relationship between the exterior angle and adjacent "
                         "interior angle of a polygon."),
            ("A6", True, "Determine the measures of angles and the number of sides of "
                         "polygons."),
            ("M5", False, "Discover the interior-angle-sum pattern by dividing polygons into "
                          "triangles."),
            ("T1", False, "Design a polygon-based pattern (tile, parol, or logo) with correct "
                          "angle measures."),
        ],
        "assess": [
            ("Formative", "CP1.1 – Recitation"),
            ("Summative", "SA1.1 – Polygon Design Challenge (C3,M5)"),
        ],
        "acts": [
            "^^HOOK:^^ “Tear-and-Tape Triangle” – tear off the corners of a paper triangle: "
            "what do they always make?",
            "“Triangle Split” discovery table – find the angle-sum pattern.",
            "“Walk the Polygon” – walk a taped floor polygon and turn at each corner to feel "
            "the exterior angles.",
            "SA1.1 – Polygon Design Challenge",
        ],
        "res": [SLIDES, "Paper, scissors, and masking tape", "GeoGebra", R360,
                "Student’s SA1.1 output uploaded in Ranger 360"],
        "pillars": ["ZS"],
    },
    {
        "type": "row",
        "kind": "quiz",
        "meetings": "1 Meeting",
        "range": "(C4,M1)",
        "topic": "A, B, C",
        "comp_lead": False,
        "comps": ["A1–A6, M1–M5, T1"],
        "assess": [("Summative", "QZ1.1 – Polygons and Angles")],
        "acts": ["QZ1.1 – A 25-item quiz (multiple choice and constructed response), with "
                 "drawing items using ruler and protractor."],
        "res": ["Teacher-made QZ1.1 in Ranger 360", "Ruler and protractor"],
        "pillars": ["SF"],
    },

    # ------------------------------------------------------------ Unit B
    {
        "type": "banner",
        "title": "UNIT B · MONEY SMART! Percentages, Financial Planning, and Rates",
        "sub": "DepEd Term 1, Weeks 4–6 · Number and Algebra · C4,M2 to C6,M5 (14 meetings)",
        "question": "Is “Buy 1, Take 1” really the same as 50% off?",
    },
    {
        "type": "row",
        "meetings": "5 Meetings",
        "range": "(C4,M2 to C5,M1)",
        "topic": "D. Percentages in Real Life",
        "subtopics": [
            "Percentage increase and percentage decrease",
            "Money problems: discount, commission, sales tax, and simple interest",
        ],
        "comps": [
            ("A7", True, "Solve problems involving: a. percentage increase; b. percentage "
                         "decrease."),
            ("A8", True, "Solve money problems involving percentages (e. g., discount, "
                         "commission, sales tax, simple interest)."),
            ("M6", False, "Compare promos and deals to decide which offer gives the best "
                          "value."),
            ("M7", False, "Reflect on honest pricing and responsible spending."),
        ],
        "assess": [
            ("Formative", "CP1.1 – Recitation"),
            ("Summative", "LW1.3 – Discount Showdown (C4,M5)"),
            ("Formative", "CP1.3 – Practice Set #2: Percentages (C5,M1)"),
        ],
        "acts": [
            "^^HOOK:^^ “Sale Ka Ba?” – vote on which mall promo is the better deal, then "
            "check with math.",
            "“Price Watch” – compute percentage increase/decrease from news on fare and rice "
            "prices.",
            "LW1.3 – Discount Showdown: compute discounts, sales tax, and final prices from "
            "real flyers.",
            "“Sari-Sari Store Simulation” – commission and simple interest role play.",
            "CP1.3 – Practice Set #2",
        ],
        "res": [SLIDES, "Mall flyers and online store screenshots", "Calculator", R360,
                "Student’s LW1.3 output uploaded in Ranger 360"],
        "pillars": ["SF", "ZS"],
    },
    {
        "type": "row",
        "kind": "pt",
        "meetings": "4 Meetings",
        "range": "(C5,M2 to C5,M5)",
        "topic": "E. Creating a Financial Plan",
        "subtopics": [
            "Needs and wants; income, expenses, and savings",
            "Budgeting and setting savings goals",
            "Launch of PT1.1 “Budget for a Cause”",
        ],
        "comps": [
            ("A9", True, "Create a financial plan."),
            ("M8", False, "Distinguish needs from wants and set realistic savings goals."),
            ("T2", False, "Draft a group financial plan for a class outreach or fundraising "
                          "activity using percentages."),
        ],
        "assess": [
            ("Formative", "CP1.1 – Recitation"),
            ("Summative", "PT1.1 – Scaffold #1: Goals and Draft Budget (C5,M5)"),
        ],
        "acts": [
            "^^HOOK:^^ “₱500 Baon Challenge” – how would you make ₱500 last a whole week?",
            "“Needs or Wants?” quick-sort game",
            "Budget Builder – plan a weekly baon budget in a Google Sheets template.",
            "Launch of PT1.1 “Budget for a Cause”; Scaffold #1",
        ],
        "res": [SLIDES, "Google Sheets budget template",
                "Teacher-prepared PT1.1 Guidelines and Rubric", R360],
        "pillars": ["ZS", "CM"],
    },
    {
        "type": "row",
        "meetings": "4 Meetings",
        "range": "(C6,M1 to C6,M4)",
        "topic": "F. Rates",
        "subtopics": [
            "Rates and unit rates",
            "Speed as a rate; price per unit and other everyday rates",
        ],
        "comps": [
            ("A10", True, "Identify and explain the uses of rates."),
            ("A11", True, "Solve problems involving rates (e.g., speed)."),
            ("M9", False, "Use unit rates to compare options and make informed decisions."),
            ("T3", False, "Canvass prices and use unit rates to choose best-value items for "
                          "the PT1.1 budget."),
        ],
        "assess": [
            ("Formative", "CP1.1 – Recitation"),
            ("Summative", "SA1.2 – Best Buy Battle (C6,M3)"),
            ("Summative", "PT1.1 – Scaffold #2: Price Canvass and Unit-Rate Comparison "
                          "(C6,M4)"),
        ],
        "acts": [
            "^^HOOK:^^ “Hallway Speed Trial” – time a 20-meter walk and compute your speed.",
            "“Commute Check” – compare jeepney, bus, and train travel rates.",
            "SA1.2 – Best Buy Battle: sachet vs. bottle vs. bulk – which is cheaper per unit?",
            "PT1.1 – Scaffold #2",
        ],
        "res": [SLIDES, "Stopwatch app and measuring tape", "Grocery price lists and receipts",
                R360, "Student’s SA1.2 output uploaded in Ranger 360"],
        "pillars": ["ZS"],
    },
    {
        "type": "row",
        "kind": "quiz",
        "meetings": "1 Meeting",
        "range": "(C6,M5)",
        "topic": "D, E, F",
        "comp_lead": False,
        "comps": ["A7–A11, M6–M9, T2–T3"],
        "assess": [("Summative", "QZ1.2 – Percentages, Financial Planning, and Rates")],
        "acts": ["QZ1.2 – A 25-item quiz (multiple choice and word problems)."],
        "res": ["Teacher-made QZ1.2 in Ranger 360", "Calculator"],
        "pillars": ["SF"],
    },

    # ------------------------------------------------------------ Unit C
    {
        "type": "banner",
        "title": "UNIT C · NUMBER LINE ADVENTURES! Rational Numbers, Roots, and Irrational "
                 "Numbers",
        "sub": "DepEd Term 1, Weeks 7–10 · Number and Algebra · C7,M1 to C10,M1 (16 meetings)",
        "question": "Can a square tile have an area of exactly 2 square units?",
    },
    {
        "type": "row",
        "meetings": "4 Meetings",
        "range": "(C7,M1 to C7,M4)",
        "topic": "G. Rational Numbers",
        "subtopics": [
            "Rational numbers as fractions, decimals, and percentages",
            "Ordering rational numbers on the number line",
        ],
        "comps": [
            ("A12", True, "Describe given rational numbers as fractions, decimals, or "
                          "percentages."),
            ("A13", True, "Order rational numbers on a number line."),
            ("M10", False, "Explain why a fraction can be written as a terminating or repeating "
                           "decimal."),
        ],
        "assess": [
            ("Formative", "CP1.1 – Recitation"),
            ("Summative", "LW1.4 – Human Number Line (C7,M3)"),
        ],
        "acts": [
            "^^HOOK:^^ “Same Number, Different Outfit” – race to match ½, 0.5, and 50%.",
            "“Conversion Dominoes” in small groups",
            "LW1.4 – Human Number Line: learners holding number cards order themselves.",
            "“Which Is Bigger?” mini-debates",
        ],
        "res": [SLIDES, "Number cards and a rope number line", "Desmos or GeoGebra number line",
                R360],
        "pillars": ["CM"],
    },
    {
        "type": "row",
        "meetings": "7 Meetings",
        "range": "(C7,M5 to C9,M1)",
        "topic": "H. Operations on Rational Numbers",
        "subtopics": [
            "Addition and subtraction of fractions and decimals",
            "Multiplication and division of fractions and decimals",
            "Multi-step problems involving rational numbers",
        ],
        "comps": [
            ("A14", True, "Perform operations on rational numbers."),
            ("M11", False, "Choose efficient strategies (fraction or decimal form) when "
                           "computing."),
            ("T4", False, "Finalize the PT1.1 financial plan by computing totals, shares, and "
                          "savings."),
        ],
        "assess": [
            ("Formative", "CP1.1 – Recitation"),
            ("Formative", "CP1.4 – Practice Set #3: Rational Numbers (C8,M3)"),
            ("Summative", "SA1.3 – Rational Relay (C8,M5)"),
            ("Summative", "PT1.1 – Scaffold #3: Final Budget Computations (C9,M1)"),
        ],
        "acts": [
            "^^HOOK:^^ “Recipe Rescale” – halve or triple a leche flan recipe with fractional "
            "measures.",
            "Fraction wall and area models for multiplying and dividing",
            "“Mental Math Sprint” warm-ups",
            "SA1.3 – Rational Relay team challenge",
            "PT1.1 – Scaffold #3",
        ],
        "res": [SLIDES, "Fraction tiles and recipe cards", R360,
                "Teacher-prepared PT1.1 Guidelines and Rubric",
                "Student’s SA1.3 output uploaded in Ranger 360"],
        "pillars": ["ZS", "CM"],
    },
    {
        "type": "row",
        "meetings": "4 Meetings",
        "range": "(C9,M2 to C9,M5)",
        "topic": "I. Square Roots, Cube Roots, and Irrational Numbers",
        "subtopics": [
            "Perfect squares and perfect cubes",
            "Square roots and cube roots",
            "Irrational numbers and their locations on the number line",
        ],
        "comps": [
            ("A15", True, "Determine the square roots of perfect squares and the cube roots of "
                          "perfect cubes."),
            ("A16", True, "Identify irrational numbers involving square roots and cube roots, "
                          "and their locations on the number line."),
            ("M12", False, "Estimate a square root or cube root between two consecutive whole "
                           "numbers."),
        ],
        "assess": [
            ("Formative", "CP1.1 – Recitation"),
            ("Summative", "LW1.5 – Root Locator (C9,M4)"),
        ],
        "acts": [
            "^^HOOK:^^ “Build the Square” – which numbers of tiles make perfect squares? "
            "Which cubes make perfect cubes?",
            "“Perfect Square Bingo”",
            "LW1.5 – Root Locator: estimate and plot roots like √2, √10, and ∛20 on a "
            "number line.",
            "“Rational or Irrational?” sorting game",
        ],
        "res": [SLIDES, "Square tiles and unit cubes", "Calculator and GeoGebra", R360,
                "Student’s LW1.5 output uploaded in Ranger 360"],
        "pillars": ["ZS"],
    },
    {
        "type": "row",
        "kind": "quiz",
        "meetings": "1 Meeting",
        "range": "(C10,M1)",
        "topic": "G, H, I",
        "comp_lead": False,
        "comps": ["A12–A16, M10–M12, T4"],
        "assess": [("Summative", "QZ1.3 – Rational Numbers and Roots")],
        "acts": ["QZ1.3 – A 25-item quiz (multiple choice and constructed response)."],
        "res": ["Teacher-made QZ1.3 in Ranger 360"],
        "pillars": ["SF"],
    },

    # ------------------------------------------------------------ PT, review, exam
    {
        "type": "row",
        "kind": "pt",
        "meetings": "2 Meetings",
        "range": "(C10,M2 to C10,M3)",
        "topic": "Final Performance Task: “Budget for a Cause”",
        "subtopics": [
            "Presentation of the group financial plan for a class outreach or fundraising "
            "activity",
        ],
        "comps": [
            ("T5", False, "Create and present a financial plan that applies percentages, "
                          "rates, and operations on rational numbers."),
            ("T6", False, "Defend budget decisions using mathematical evidence and respond to "
                          "questions respectfully."),
        ],
        "assess": [("Summative", "PT1.1 – Financial Plan Pitch")],
        "acts": [
            "“Shark Tank”-style pitch to a class panel",
            "Peer feedback using the PT1.1 rubric",
            "Reflection: “How does wise budgeting help me serve others?”",
        ],
        "res": ["Teacher-prepared PT1.1 Guidelines and Rubric", "Google Sheets and Slides",
                "Students’ PT1.1 output uploaded in Ranger 360"],
        "pillars": ["CM", "ZS", "SF"],
    },
    {
        "type": "row",
        "kind": "exam",
        "meetings": "1 Meeting",
        "range": "(C10,M4)",
        "topic": "Term Review: “Math Amazing Race”",
        "comp_lead": False,
        "comps": ["A1–A16, M1–M12, T1–T4"],
        "assess": [("Formative", "CP1.1 – Review stations")],
        "acts": ["Team review stations covering Units A, B, and C"],
        "res": ["Teacher-prepared review station cards", R360],
        "pillars": ["CM"],
    },
    {
        "type": "row",
        "kind": "exam",
        "meetings": "1 Meeting",
        "range": "(C10,M5)",
        "topic": "Term Exam",
        "comp_lead": False,
        "comps": ["A1–A16, M1–M12, T1–T4"],
        "assess": [("Summative", "TE1.1 – Term Exam")],
        "acts": ["TE1.1 – Term Exam covering Units A, B, and C"],
        "res": ["Teacher-made TE1.1"],
        "pillars": ["SF"],
    },
    {
        "type": "row",
        "kind": "buffer",
        "meetings": "Buffer Cycle",
        "range": "(C11)",
        "topic": "Buffer",
        "comp_lead": False,
        "comps": ["As needed"],
        "assess": [("Summative", "Make-up assessments")],
        "acts": [
            "Make-up assessments for excused absences",
            "Remediation and enrichment",
            "Adjustments for class suspensions and school activities",
        ],
        "res": [R360],
        "pillars": ["ZS"],
    },
]

SIGNATORIES = [
    {"label": "Prepared by:", "names": ["[Name of Teacher]", "[Name of Teacher]"],
     "role": "Grade 7 Mathematics Teacher"},
    {"label": "Approved by:", "names": ["[Name of Subject Coordinator]"],
     "role": "Subject Coordinator"},
]
