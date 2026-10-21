"""Grade 7 Mathematics – Learning Guide, 1st Trimester, SY 2026-2027.

Companion to content/grade7_term1_cm.py; codes, meetings, and assessments match
the CM. Source of truth: DepEd MATATAG Mathematics Curriculum Guide (Grade 7,
Quarter 1 and Quarter 2 items 1–2) as sequenced in the DepEd Three-Term Budget of
Work, First Term (see sources/deped/).

ID# tags follow the usage in the LSGH Grade 10 sample LG:
    ID#1 objectives / goals      ID#2 recall, hook, prior knowledge
    ID#3 presenting the concept  ID#4 teacher discussion / elaboration
    ID#5 guided practice         ID#6 demonstration and hands-on performance
    ID#7 sharing and feedback    ID#8 valuing                 ID#9 assessment and reflection
"""

HEADER = {
    "lines": [
        "LA SALLE GREEN HILLS",
        "Mathematics Department (Grade 7)",
        "1st Trimester, SY 2026-2027",
    ],
    "title": "LEARNING GUIDE",
}

OVERVIEW = [
    "Grade 7 Mathematics in the first trimester takes learners on three connected "
    "adventures. In **Shape Up!**, they draw, classify, and measure polygons, discovering "
    "the rules that govern angle pairs and the interior and exterior angles of polygons. "
    "In **Money Smart!**, they use percentages and rates to compare prices, compute "
    "discounts, taxes, commissions, and simple interest, and create a financial plan. In "
    "**Number Line Adventures!**, they describe, order, and operate on rational numbers, "
    "find square roots and cube roots, and locate irrational numbers on the number line.",
    "For their end-of-term performance task, **Budget for a Cause**, learners work as a "
    "class finance committee to create and pitch a financial plan for a class outreach or "
    "fundraising activity for a partner community. They apply percentages, rates, and "
    "operations on rational numbers, and justify every peso with mathematical evidence – "
    "practicing responsible stewardship of resources in the service of others.",
    "Each lesson opens with a short simulation from the **LSGH Math 7 SimBook** as its hook, "
    "to spark curiosity and a first look at the pattern. The lesson itself is then taught in "
    "the usual way – the teacher’s discussion, definitions, and step-by-step worked examples "
    "– and practiced through the SimBook’s Check Yourself items and its Exercises (Part A "
    "Skills Practice, Part B Problem Solving, Part C Challenge). Each lesson below shows its "
    "SIM HOOK cards: the sim, the tab, the mission, and the expected discovery.",
]

OUTCOMES = [
    ("Math.G7.1", "Draw, classify, and reason about polygons and angles, and apply "
                  "percentages, rates, rational numbers, and roots to make sound and "
                  "responsible decisions in real-life situations."),
]

POLICIES = [
    {
        "label": "Guidelines on Make-Up for Missed Summative Assessment\n(Short Absence)",
        "items": [
            "Parents or authorized guardians shall report a student's absence through the "
            "“Send an Excuse Form” facility in the Ranger360 Homeroom Folder. Students have "
            "five (5) school days after returning to school to request a make-up assessment.",
            "The Learning Community Coordinator (LCC) shall evaluate the request and "
            "communicate the decision through official channels. Approved requests shall "
            "allow students to complete missed summative assessments.",
            "After the Excuse Form is approved, a QR code shall be sent to the parent or "
            "guardian to complete the Make-up Request Form.",
            "Upon receiving the Make-Up Request, the subject teacher shall notify the student "
            "of the make-up assessment schedule via Ranger360. The assessment must be "
            "completed within ten (10) school days.",
            "A student who fails to appear for the scheduled make-up assessment shall receive "
            "a score of zero (0) for the missed requirement.",
        ],
        "note": "*For Long Absences and Absences during Trimestral Examinations, please refer "
                "to the Student Handbook.",
    },
    {
        "label": "Submission of Requirements",
        "items": [
            "Requirements must be submitted on or before the deadline. Late submission of "
            "requirements without any valid reason will not be accepted.",
            "Please ensure that you carefully follow all submission guidelines and "
            "instructions to avoid any deductions. Taking the time to review the rubric "
            "before submitting any project or assessment will help you meet expectations and "
            "perform your best.",
        ],
    },
    {
        "label": "Ranger360 Responsibility",
        "items": [
            "Students shall check Ranger360 daily for announcements, course requirements, "
            "assessment scores, and other important updates, and are encouraged to provide "
            "their parents or guardians with access to their account.",
            "All materials posted in Ranger360 are school property. Students shall use these "
            "materials for academic purposes only.",
        ],
    },
    {
        "label": "Student – Teacher Consultation Time",
        "items": ["Students are encouraged to request a consultation with their teachers. "
                  "Please refer to the Student Handbook for the procedure."],
    },
    {
        "label": "Parent-Teacher Consultation",
        "items": ["Parents who wish to consult with the teachers may refer to the Student "
                  "Handbook for the procedure."],
    },
    {
        "label": "Additional Mathematics Department Policies",
        "items": [
            "Students are required to bring their Mathematics notebook, a ruler, a "
            "protractor, and a scientific calculator to every Mathematics class.",
            "Solutions must be shown for all problem-solving items in seatwork, quizzes, and "
            "examinations. Answers without supporting solutions may not receive full credit.",
            "Calculators may be used only when the teacher allows them. Calculators on "
            "phones or other devices are not allowed during quizzes and examinations.",
            "Learning devices used for Ranger360 and digital activities (e.g., GeoGebra, "
            "Desmos, Google Sheets) should be fully charged before class.",
            ("Failure to comply may lead to the following:", [
                "1st offense: Oral warning",
                "2nd offense: Written reminder",
                "Repeated offenses: Issuance of a Student Responsibility Report (SRR)",
            ]),
            "Students may be allowed to make up missed tasks if the reason is valid.",
        ],
    },
]

ASSESSMENT = [
    {
        "component": "Written Works (WW)",
        "weight": "20%",
        "groups": [
            ("CP - Participation – seatwork, recitation (40%)", [
                "CP1.1 - Recitation every meeting",
                "CP1.2 - Practice Set #1: Polygons and Angle Pairs (C3, M1)",
                "CP1.3 - Practice Set #2: Percentages (C5, M1)",
                "CP1.4 - Practice Set #3: Rational Numbers (C8, M3)",
            ]),
            ("QZ - Quizzes (60%)", [
                "QZ1.1 - Polygons and Angles (C4, M1)",
                "QZ1.2 - Percentages, Financial Planning, and Rates (C6, M5)",
                "QZ1.3 - Rational Numbers and Roots (C10, M1)",
            ]),
        ],
    },
    {
        "component": "Performance Task (PT)",
        "weight": "60%",
        "groups": [
            ("LW - Guided Hands-on Activities (30%)", [
                "LW1.1 - Polygon Construction Lab (C2, M1)",
                "LW1.2 - Angle Hunt (C2, M4)",
                "LW1.3 - Discount Showdown (C4, M5)",
                "LW1.4 - Human Number Line (C7, M3)",
                "LW1.5 - Root Locator (C9, M4)",
            ]),
            ("SA - Challenge Hands-on Activities (40%)", [
                "SA1.1 - Polygon Design Challenge (C3, M5)",
                "SA1.2 - Best Buy Battle (C6, M3)",
                "SA1.3 - Rational Relay (C8, M5)",
            ]),
            ("PT – End of Term PT (30%)", [
                "PT1.1 - Budget for a Cause: Financial Plan Pitch",
                "Scaffolding#1 - Goals and Draft Budget (C5, M5)",
                "Scaffolding#2 - Price Canvass and Unit-Rate Comparison (C6, M4)",
                "Scaffolding#3 - Final Budget Computations (C9, M1)",
                "Final Pitch (C10, M2 to C10, M3)",
            ]),
        ],
    },
    {
        "component": "Final Exam",
        "weight": "20%",
        "groups": [("TE – Term Exam (100%) (C10, M5)", [])],
    },
]

STANDARDS = [
    {
        "label": "CONTENT STANDARD",
        "body": [
            ("lead", "The learners should have knowledge and understanding of…"),
            ("bul", [
                "regular and irregular polygons and their features/properties",
                "determination of measures of angles and number of sides of polygons",
                "application of percentages",
                "use of rates",
                "rational numbers",
                "square roots of perfect squares, cube roots of perfect cubes, and irrational "
                "numbers",
            ]),
        ],
    },
    {
        "label": "PERFORMANCE STANDARD",
        "body": [
            ("lead", "By the end of the term, the learners are able to…"),
            ("bul", [
                "draw, and describe the features/properties of, regular and irregular "
                "polygons.",
                "use percentages in different contexts.",
                "identify and use rates.",
                "create a financial plan.",
                "describe, order, and perform operations on, rational numbers.",
                "determine square roots of perfect squares and cube roots of perfect cubes, "
                "and identify irrational numbers.",
            ]),
            ("h", "Strands of Mathematical Proficiency (MATATAG Mathematics Curriculum "
                  "Framework, from NRC 2001):"),
            ("sub", "Conceptual Understanding",
             ["comprehension of mathematical concepts, operations, and relations"]),
            ("sub", "Procedural Fluency",
             ["skill in carrying out procedures flexibly, accurately, efficiently, and "
              "appropriately"]),
            ("sub", "Strategic Competence",
             ["ability to formulate, represent, and solve mathematical problems"]),
            ("sub", "Adaptive Reasoning",
             ["capacity for logical thought, reflection, explanation, and justification"]),
            ("sub", "Productive Disposition",
             ["habitual inclination to see mathematics as sensible, useful, and worthwhile, "
              "coupled with a belief in diligence and one’s own efficacy"]),
        ],
    },
    {
        "label": "ENDURING UNDERSTANDING",
        "body": [
            ("lead", "The learners will understand that:"),
            ("num", [
                "Polygons and angles follow predictable relationships – angle pairs, interior "
                "and exterior angles, and angle sums – that allow us to measure, draw, and "
                "design accurately.",
                "Percentages and rates are powerful tools for comparing quantities, judging "
                "value, and planning how to use resources wisely for ourselves and for "
                "others.",
                "Rational and irrational numbers together fill the number line; understanding "
                "their forms and operations helps us compute and reason accurately in "
                "everyday life.",
            ]),
        ],
    },
    {
        "label": "ESSENTIAL QUESTIONS",
        "body": [
            ("lead", "The learners will keep considering:"),
            ("num", [
                "How do the shapes and angles around me follow mathematical rules, and how can "
                "I use these rules to draw and design with precision?",
                "How can I use percentages and rates to make smart, honest, and responsible "
                "decisions about money?",
                "Why do we need different kinds of numbers, and how do they all fit together "
                "on the number line?",
            ]),
        ],
    },
    {
        "label": "TRANSFER GOAL",
        "body": [
            ("p", "The learners will be able to independently use percentages, rates, and "
                  "operations on rational numbers to create a realistic financial plan – such "
                  "as budgeting for a class outreach or fundraising activity for a partner "
                  "community – and justify every decision with mathematical evidence, "
                  "demonstrating responsible stewardship of resources in the service of "
                  "others."),
        ],
    },
    {
        "label": "PERFORMANCE TASK",
        "body": [
            ("center", "PT1.1 Budget for a Cause –"),
            ("center", "G.R.A.S.P. Performance Task"),
            ("h", "G – Goal"),
            ("p", "Your goal is to create a realistic financial plan for a class outreach or "
                  "fundraising activity that will benefit a partner community, using "
                  "percentages, rates, and operations on rational numbers to make every peso "
                  "count."),
            ("h", "R – Role"),
            ("p", "You are a member of your class’s Finance Committee, entrusted with planning "
                  "how the class will raise, spend, and save money for its chosen cause."),
            ("h", "A – Audience"),
            ("lead", "Your primary audience includes:"),
            ("bul", [
                "A panel of teachers acting as the class adviser and moderators",
                "Your classmates, who will vote on and carry out the plan",
                "The partner community that will benefit from the activity",
            ]),
            ("h", "S – Situation"),
            ("p", "Your class has a seed fund of ₱5,000 and plans to raise more through a "
                  "small fundraiser (e.g., a bake sale). The money will be used to prepare "
                  "items for a partner community (e.g., school supply kits or snack packs). "
                  "Prices vary across stores, some items are on sale, receipts include 12% "
                  "VAT, and the class must keep a reserve for unexpected expenses. The panel "
                  "will approve only plans that are accurate, realistic, and well justified."),
            ("h", "P – Product / Performance"),
            ("lead", "You will create:"),
            ("p", "A **Financial Plan** in Google Sheets and a **5-minute pitch** that "
                  "includes:"),
            ("bul", [
                "The goal, the beneficiaries, and the number of items to prepare",
                "Projected income: seed fund and fundraiser (cost, selling price, markup %, "
                "expected sales, and profit)",
                "An expense list with a price canvass and unit-rate comparison of at least "
                "five items from two stores",
                "Discounts and 12% VAT computations, and a contingency reserve of at least "
                "10%",
                "An allocation summary showing each category as a percentage of the total "
                "budget",
                "A timeline and a reflection on how the plan serves others",
            ]),
            ("h", "S – Success Criteria / Standards"),
            ("lead", "Your work will be assessed based on:"),
            ("bul", [
                ("Mathematical Accuracy", [
                    "Correct computations of percentages, rates, and operations on "
                    "rational numbers. (15 points)"]),
                ("Use of Percentages and Rates in Decisions", [
                    "Discounts, VAT, markup, and unit rates are used to choose best-value "
                    "options. (10 points)"]),
                ("Completeness and Organization of the Financial Plan", [
                    "All required parts are present, clearly labeled, and easy to follow. "
                    "(10 points)"]),
                ("Justification and Pitch", [
                    "Decisions are explained with mathematical evidence; questions are "
                    "answered clearly and respectfully. (10 points)"]),
                ("Stewardship and Reflection", [
                    "The plan is realistic, responsible, and centered on serving others. "
                    "(5 points)"]),
            ]),
            ("p", "**Total: 50 points**"),
        ],
    },
]

UNITS = [
    {"title": "Unit A · SHAPE UP! Polygons and Angles", "lessons": [
        ("A. Drawing Polygons", [
            "Regular and irregular polygons with 5, 6, 8, or 10 sides",
            "Drawing polygons, triangles, and quadrilaterals with given measures"]),
        ("B. Angle Pairs and Classifying Polygons", [
            "Complementary, supplementary, adjacent, linear pair, and vertical angles",
            "Classifying polygons by sides, regular or irregular, convex or non-convex"]),
        ("C. Angles of Polygons", [
            "Interior and exterior angles; angle sums",
            "Measures of angles and number of sides of polygons"]),
    ]},
    {"title": "Unit B · MONEY SMART! Percentages, Financial Planning, and Rates",
     "lessons": [
        ("D. Percentages in Real Life", [
            "Percentage increase and decrease",
            "Discount, commission, sales tax, and simple interest"]),
        ("E. Creating a Financial Plan", [
            "Needs and wants; income, expenses, and savings; budgeting"]),
        ("F. Rates", ["Rates and unit rates; speed; price per unit"]),
    ]},
    {"title": "Unit C · NUMBER LINE ADVENTURES! Rational Numbers, Roots, and Irrational "
              "Numbers", "lessons": [
        ("G. Rational Numbers", [
            "Fractions, decimals, and percentages; ordering on the number line"]),
        ("H. Operations on Rational Numbers", [
            "Adding, subtracting, multiplying, and dividing fractions and decimals"]),
        ("I. Square Roots, Cube Roots, and Irrational Numbers", [
            "Perfect squares and cubes; irrational numbers on the number line"]),
    ]},
    {"title": "End-of-Term Performance Task: Budget for a Cause", "lessons": [
        ("Scaffolding#1:", ["Goals and draft budget"]),
        ("Scaffolding#2:", ["Price canvass and unit-rate comparison"]),
        ("Scaffolding#3:", ["Final budget computations"]),
        ("Final Pitch:", ["Presentation of the financial plan to the panel"]),
    ]},
]

MARK = [
    ("A1.", "Draw and describe regular and irregular polygons with 5, 6, 8, or 10 sides, "
            "based on measurements of sides and angles, using a ruler and protractor. ★"),
    ("A2.", "Draw triangles, quadrilaterals, and regular polygons (5, 6, 8, or 10 sides) with "
            "given angle measures. ★"),
    ("M1.", "Explain how equal sides and equal angles make a polygon regular."),
    ("M2.", "Appreciate precision and care in using measuring tools."),
    ("A3.", "Describe and explain the relationships between angle pairs based on their "
            "measures. ★"),
    ("A4.", "Classify polygons according to the number of sides, whether they are regular or "
            "irregular, and whether they are convex or non-convex. ★"),
    ("M3.", "Find unknown angle measures using angle-pair relationships."),
    ("M4.", "Justify the classification of a polygon using its properties."),
    ("A5.", "Deduce the relationship between the exterior angle and adjacent interior angle "
            "of a polygon. ★"),
    ("A6.", "Determine the measures of angles and the number of sides of polygons. ★"),
    ("M5.", "Discover the interior-angle-sum pattern by dividing polygons into triangles."),
    ("T1.", "Design a polygon-based pattern (tile, parol, or logo) with correct angle "
            "measures."),
    ("A7.", "Solve problems involving: a. percentage increase, and b. percentage decrease. ★"),
    ("A8.", "Solve money problems involving percentages (e. g., discount, commission, sales "
            "tax, simple interest). ★"),
    ("M6.", "Compare promos and deals to decide which offer gives the best value."),
    ("M7.", "Reflect on honest pricing and responsible spending."),
    ("A9.", "Create a financial plan. ★"),
    ("M8.", "Distinguish needs from wants and set realistic savings goals."),
    ("T2.", "Draft a group financial plan for a class outreach or fundraising activity using "
            "percentages."),
    ("A10.", "Identify and explain the uses of rates. ★"),
    ("A11.", "Solve problems involving rates (e.g., speed). ★"),
    ("M9.", "Use unit rates to compare options and make informed decisions."),
    ("T3.", "Canvass prices and use unit rates to choose best-value items for the PT1.1 "
            "budget."),
    ("A12.", "Describe given rational numbers as fractions, decimals, or percentages. ★"),
    ("A13.", "Order rational numbers on a number line. ★"),
    ("M10.", "Explain why a fraction can be written as a terminating or repeating decimal."),
    ("A14.", "Perform operations on rational numbers. ★"),
    ("M11.", "Choose efficient strategies (fraction or decimal form) when computing."),
    ("T4.", "Finalize the PT1.1 financial plan by computing totals, shares, and savings."),
    ("A15.", "Determine the square roots of perfect squares and the cube roots of perfect "
             "cubes. ★"),
    ("A16.", "Identify irrational numbers involving square roots and cube roots, and their "
             "locations on the number line. ★"),
    ("M12.", "Estimate a square root or cube root between two consecutive whole numbers."),
    ("T5.", "Create and present a financial plan that applies percentages, rates, and "
            "operations on rational numbers."),
    ("T6.", "Defend budget decisions using mathematical evidence and respond to questions "
            "respectfully."),
]

R360 = "Materials uploaded in Ranger360"

# STAGES is appended below (lesson development).

# ============================================================== DRAW (Acquisition)

ORIENTATION = [
    ("cycle", "CYCLE 1, Meeting 1"),
    ("lesson", "LESSON: Class Orientation – “Math Is Everywhere!”"),
    ("h", "INTRODUCTION:"),
    ("q", "Welcome to Grade 7 Mathematics! This term, we will become shape designers, smart "
          "shoppers, and number-line explorers. Mathematics is not just a subject we study "
          "in this room – it is in the parol we hang at Christmas, in every “SALE” sign at "
          "the mall, and in every peso of our baon. Today, we will set the stage for the "
          "term: what we will learn, how we will be assessed, and how we will work "
          "together as a Lasallian community of learners."),
    ("h", "OBJECTIVES: (ID#1)"),
    ("obj", ["Review the course outline and the Term 1 roadmap.",
             "Describe the intended learning outcomes, grading components, and their "
             "percentage weights.",
             "Explain classroom policies, attendance requirements, and academic integrity "
             "guidelines."], ["ZS", "SF"]),
    ("h", "ACTIVITIES:"),
    ("ts", "Before we look at the course outline, let’s warm up our math eyes. How much math "
           "can you find in one picture?"),
    ("step", "(ID#2) ^^HOOK:^^ “Math Around Me” – The teacher shows a photo of a busy "
             "Filipino street scene (a sari-sari store, a jeepney, road signs, and a mall "
             "sale banner). In one minute, students list as many examples of math as they can "
             "find.", ["Possible answers: the octagon-shaped STOP sign, “20% OFF” banners, "
                       "prices per kilo, a 60 km/h speed limit sign, fractions on a recipe "
                       "poster."]),
    ("ts", "Look at what you found – shapes, percentages, prices, speeds, and fractions. "
           "Those are exactly the three units of our term! Let’s see how they fit together."),
    ("step", "(ID#3) The teacher will discuss the course outline and the Term 1 roadmap: "
             "Unit A – Shape Up!, Unit B – Money Smart!, Unit C – Number Line Adventures!, "
             "and the performance task “Budget for a Cause.”"),
    ("ts", "Now that you know what we will learn, let’s talk about how your progress will be "
           "measured. Each assessment is a chance to show what you can do."),
    ("step", "(ID#4) The teacher will discuss the methods of assessment (Written Works, "
             "Performance Task, and Term Exam) and their percentage weights."),
    ("ts", "Good habits make good mathematicians. Let’s agree on how we will work together "
           "in this class."),
    ("step", "(ID#5) The teacher will review the classroom procedures and the Mathematics "
             "Department policies, including the required materials: notebook, ruler, "
             "protractor, and scientific calculator."),
    ("h", "WRAP UP ACTIVITY: “My Math Story” One-minute Reflection (ID#6)"),
    ("p", "Complete the following sentences and write your answers directly in Ranger360:"),
    ("bul", ["One thing I am excited to learn this term is ________.",
             "One math habit I want to build is ________.",
             "I feel ___/5 ready for Grade 7 Math."]),
    ("h", "VALUING STATEMENT: (ID#8)"),
    ("q", "As Lasallians, we strive for excellence and integrity. In Math class, this means "
          "showing our solutions honestly, asking questions when we are stuck, and helping "
          "one another grow. Next meeting, we begin Unit A by drawing our very first "
          "polygons."),
    ("res", ["Teacher’s Google presentation - Class Orientation", "Student Handbook", R360]),
]

LESSON_A = [
    ("sep",),
    ("cycle", "CYCLE 1, Meetings 2 to 5, and CYCLE 2, Meeting 1"),
    ("lesson", "LESSON 1: A. Drawing Polygons"),
    ("h", "INTRODUCTION:"),
    ("q", "Why do bees build their honeycombs out of hexagons? Why do STOP signs have eight "
          "sides? Shapes with straight sides – polygons – are everywhere. In this lesson, "
          "you will learn what makes a polygon regular or irregular, and you will draw "
          "polygons accurately using a ruler and a protractor, just like architects and "
          "designers do. Let us start by recalling our objectives."),
    ("h", "OBJECTIVES: (ID#1)"),
    ("obj", ["Draw and describe regular and irregular polygons with 5, 6, 8, or 10 sides, "
             "based on measurements of sides and angles, using a ruler and protractor.",
             "Draw triangles, quadrilaterals, and regular polygons (5, 6, 8, or 10 sides) with "
             "given angle measures.",
             "Explain how equal sides and equal angles make a polygon regular.",
             "Appreciate precision and care in using measuring tools."], ["ZS"]),
    ("h", "ACTIVITIES:"),
    ("meet", "Meeting 1 (C1, M2): What Is a Polygon?"),
    ("ts", "Let’s go on a shape hunt. Look closely at these photos – what shapes can you "
           "see, and how many sides do they have?"),
    ("step", "(ID#2) ^^HOOK:^^ “Polygon Spotting” – Students identify the shapes in photos of "
             "a honeycomb, a STOP sign, capiz window panes, floor tiles, and a parol, and "
             "count their sides.",
     ["Expected answers: honeycomb cell – hexagon (6); STOP sign – octagon (8); capiz "
      "panes and tiles – squares (4); the outline of a star parol – a 10-sided figure."]),
    ("ts", "All of these shapes are made of straight sides joined end to end. Mathematicians "
           "call them polygons. Let’s define them carefully."),
    ("sim", {'kind': 'SIM HOOK', 'title': 'Polygon Studio – Explore', 'tool': 'LSGH Math 7 SimBook · Lesson 1 · Polygon Studio (Explore tab)', 'link': 'https://claude.ai/artifact/LrpohtVMd8ifUt7nkd7FFr#lesson1', 'setup': 'Pairs, one device; record findings in the notebook', 'mission': ['Choose 5, 6, 8, and 10 sides. Record the interior angle of each regular polygon.', 'Press “Mess it up,” then drag the vertices. Watch the side and angle readouts.', 'Try to make a hexagon whose sides are all equal but whose angles are not.'], 'questions': ['When does the sim say REGULAR?', 'What happens to each angle as the number of sides grows?'], 'discovery': 'A polygon is regular only when all sides AND all angles are equal; each interior angle grows with the number of sides (108°, 120°, 135°, 144°).'}),
    ("step", "(ID#3) The teacher will discuss the definition and parts of a polygon (sides, "
             "vertices, interior angles, diagonals) and the difference between regular and "
             "irregular polygons."),
    ("ex", "Key Ideas", [
        "- A **polygon** is a closed plane figure formed by three or more line segments "
        "(sides) that meet only at their endpoints (vertices).",
        "- A **regular polygon** has all sides equal AND all angles equal. Otherwise, it is "
        "**irregular**.",
        "- Polygon or not? Triangle – yes. Circle – no (curved). An open figure – no (not "
        "closed). A five-pointed star outline – yes (it has 10 straight sides).",
    ]),
    ("meet", "Meeting 2 (C1, M3): Measuring and Drawing Angles"),
    ("ts", "Before we can draw polygons accurately, we need to master our most important "
           "tool – the protractor."),
    ("step", "(ID#4) The teacher will demonstrate how to measure and draw angles with a "
             "protractor: place the center mark on the vertex, line up the baseline with "
             "one side, and read from the scale that starts at 0°.",
     ["Common error: reading the wrong scale (e.g., writing 60° for an angle of 120°). "
      "Always ask: “Is my angle smaller or bigger than a right angle?”"]),
    ("step", "(ID#5) Guided practice: Students measure the angles of given polygons on a "
             "worksheet, then draw angles of 45°, 108°, 120°, 135°, and 144°."),
    ("meet", "Meeting 3 (C1, M4): Drawing Regular Polygons"),
    ("ts", "Now let’s combine our ruler and protractor to draw a perfect regular hexagon – "
           "the shape of a honeycomb cell."),
    ("sim", {'kind': 'SIM HOOK', 'title': 'Polygon Studio – Build It', 'tool': 'LSGH Math 7 SimBook · Lesson 1 · Polygon Studio (Build It tab)', 'link': 'https://claude.ai/artifact/LrpohtVMd8ifUt7nkd7FFr#lesson1', 'setup': 'Pairs, one device; record findings in the notebook', 'mission': ['Enter a side length, an interior angle, and the number of sides, then press “Draw it.”', 'Find the interior angle that closes each regular polygon in the challenge list.', 'Try 6 sides with 110°. What happens to the gap?'], 'questions': ['Why does the wrong angle leave a gap?', 'What turn does the pen make at each corner?'], 'discovery': 'Only the correct interior angle closes the polygon; the pen turns 180° minus that angle at every corner.'}),
    ("step", "(ID#6) The teacher will demonstrate the steps in drawing a regular hexagon with "
             "sides of 4 cm."),
    ("ex", "Expected Output: Drawing a Regular Hexagon (side 4 cm)", [
        "1. Draw side AB = 4 cm.",
        "2. At B, use the protractor to mark an interior angle of 120°. Draw BC = 4 cm.",
        "3. Repeat at C, D, and E: mark 120°, then draw 4 cm.",
        "4. The sixth side should end exactly at A. If it does not close, re-check your "
        "angles.",
        "Interior angle of each regular polygon (to be explained in Lesson 3):",
        "  Pentagon – 108° · Hexagon – 120° · Octagon – 135° · Decagon – 144°",
    ]),
    ("step", "(ID#5) “Draw-It-Right” pair challenge – Partner A dictates the measures of a "
             "regular pentagon (side 3 cm, angles 108°) while Partner B draws; then they swap "
             "for a regular octagon (side 2.5 cm, angles 135°). Partners check if the last "
             "side closes exactly."),
    ("meet", "Meeting 4 (C1, M5): Triangles and Quadrilaterals with Given Angles"),
    ("ts", "Polygons don’t have to be regular. Let’s draw triangles and quadrilaterals from "
           "given angle measures and see what we discover."),
    ("step", "(ID#4) The teacher will discuss drawing triangles and quadrilaterals with given "
             "angle measures."),
    ("ex", "Worked Examples", [
        "- Draw triangle ABC with AB = 6 cm, ∠A = 50°, and ∠B = 60°. Draw the two angles at "
        "the ends of AB; where the rays meet is C. Measure ∠C: it is **70°**.",
        "- Draw quadrilateral PQRS with PQ = 5 cm, ∠P = 90°, ∠Q = 90°, QR = 4 cm, and "
        "∠R = 120°. Measure ∠S: it is **60°**.",
        "- Draw an irregular pentagon with angles 120°, 100°, 110°, 90°, and 120°. Describe it: "
        "5 sides, angles not all equal → irregular.",
        "What do you notice about the sum of the angles of each triangle? (Always 180°.) Of "
        "each quadrilateral? (Always 360°.) We will explain why in Lesson 3.",
    ]),
    ("step", "(ID#5) Students draw two triangles and one quadrilateral on the board and in "
             "their notebooks (CP1.1 – Recitation)."),
    ("meet", "Meeting 5 (C2, M1): Polygon Construction Lab"),
    ("ts", "You now have all the skills you need. It’s time to show what you can do in our "
           "first guided hands-on activity."),
    ("step", "(ID#6) The students will accomplish LW1.1 Polygon Construction Lab:",
     ["Station 1: a regular pentagon with sides of 3 cm",
      "Station 2: a regular octagon with sides of 2.5 cm",
      "Station 3: an irregular hexagon from given side and angle measures",
      "Station 4: a triangle with two given angles",
      "For each figure, write a description: number of sides, regular or irregular, and why."]),
    ("step", "(ID#9) Using the given rubric (accuracy of sides within 1 mm and angles within "
             "2°, labels, neatness, and description), students check their own work before "
             "uploading a photo of their output to Ranger360."),
    ("h", "VALUING STATEMENT: (ID#8)"),
    ("q", "A builder who measures carelessly ends up with crooked walls. Precision is a form "
          "of excellence and respect – for our work and for the people who will use it. As "
          "Lasallians, we strive to do even small tasks with care and integrity."),
    ("h", "EXIT TICKET: (ID#9)"),
    ("bul", ["Why does a regular hexagon “close” perfectly when every angle is 120°?",
             "Name one mistake to avoid when using a protractor."]),
    ("h", "SYNTHESIS:"),
    ("q", "In this lesson, we learned what polygons are, the difference between regular and "
          "irregular polygons, and how to draw them accurately using a ruler and a "
          "protractor. Next meeting, we will explore how angles relate to one another and how "
          "to classify polygons."),
    ("res", ["LSGH Math 7 SimBook - Lesson 1 (https://claude.ai/artifact/LrpohtVMd8ifUt7nkd7FFr#lesson1)",
             "SimBook Exercises 1 – Part A as seatwork; Parts B and C as homework",
             "Teacher’s Google presentation - Lesson 1: Drawing Polygons",
             "Ruler, protractor, and grid paper", "GeoGebra (polygon tools)", R360,
             "Uploaded students’ LW1.1 Polygon Construction Lab output in Ranger360"]),
]

LESSON_B = [
    ("sep",),
    ("cycle", "CYCLE 2, Meetings 2 to 5, and CYCLE 3, Meeting 1"),
    ("lesson", "LESSON 2: B. Angle Pairs and Classifying Polygons"),
    ("h", "SHORT RECAP OF PREVIOUS LESSON: (ID#2)"),
    ("q", "Last time, we drew regular and irregular polygons. Who can tell me the difference "
          "between the two? What is the measure of each angle of a regular hexagon?"),
    ("h", "INTRODUCTION:"),
    ("q", "Angles rarely live alone. Open a pair of scissors, look at a window grill, or "
          "watch the hands of a clock – angles come in pairs with special relationships. "
          "Today, we will discover these angle pairs and use them to find unknown angles. "
          "We will also learn how to classify polygons like a true geometry expert."),
    ("h", "OBJECTIVES: (ID#1)"),
    ("obj", ["Describe and explain the relationships between angle pairs based on their "
             "measures.",
             "Classify polygons according to the number of sides, whether they are regular "
             "or irregular, and whether they are convex or non-convex.",
             "Find unknown angle measures using angle-pair relationships.",
             "Justify the classification of a polygon using its properties."], ["CM", "ZS"]),
    ("h", "ACTIVITIES:"),
    ("meet", "Meeting 1 (C2, M2): Meet the Angle Pairs"),
    ("ts", "Let’s start with something you use every day – a pair of scissors."),
    ("step", "(ID#2) ^^HOOK:^^ “Scissors and Clocks” – Students open a pair of scissors and "
             "observe the four angles formed. Which angles look equal? Which ones together "
             "make a straight line?"),
    ("sim", {'kind': 'SIM HOOK', 'title': 'Angle Pair Lab – Intersecting Lines and Split an Angle', 'tool': 'LSGH Math 7 SimBook · Lesson 2 · Angle Pair Lab (Intersecting Lines and Split an Angle tab)', 'link': 'https://claude.ai/artifact/LrpohtVMd8ifUt7nkd7FFr#lesson2', 'setup': 'Pairs, one device; record findings in the notebook', 'mission': ['Intersecting Lines: rotate both lines and record three positions in a table.', 'Use “Highlight” to show the vertical pair, then the linear pair.', 'Split an Angle: drag the ray inside a 90° angle, then a 180° angle.'], 'questions': ['Which angles are always equal?', 'Which pairs always add up to the same total?'], 'discovery': 'Vertical angles are always equal; a linear pair always adds to 180°; complementary angles add to 90°, supplementary angles to 180°.'}),
    ("step", "(ID#3) The teacher will discuss the five kinds of angle pairs."),
    ("ex", "Key Ideas and Examples", [
        "- **Complementary angles** – two angles whose measures add up to 90°. The "
        "complement of 35° is 55°.",
        "- **Supplementary angles** – two angles whose measures add up to 180°. The "
        "supplement of 128° is 52°.",
        "- **Adjacent angles** – two angles with a common vertex and a common side, and no "
        "common interior points.",
        "- **Linear pair** – two adjacent angles whose non-common sides form a straight line; "
        "they are supplementary. If one angle is 115°, the other is 65°.",
        "- **Vertical angles** – opposite angles formed by two intersecting lines; they are "
        "equal. If one angle is 40°, its vertical angle is 40° and each adjacent angle is "
        "140°.",
    ]),
    ("meet", "Meeting 2 (C2, M3): Angle Detectives"),
    ("ts", "Now that we know the relationships, let’s use them like detectives to find "
           "missing angles."),
    ("step", "(ID#4) The teacher will discuss how to find unknown angles using angle-pair "
             "relationships."),
    ("step", "(ID#5) “Angle Detective” board work (CP1.1 – Recitation):"),
    ("ex", "Expected Answers", [
        "- Two angles are complementary, and one is twice the other. Split 90° into 3 equal "
        "parts: the angles are **30° and 60°**.",
        "- Three angles together form a straight line: 48°, 75°, and ?. "
        "180° − 48° − 75° = **57°**.",
        "- Four angles meet at a point: 120°, 95°, 85°, and ?. "
        "360° − 300° = **60°**.",
    ]),
    ("meet", "Meeting 3 (C2, M4): Angle Hunt"),
    ("ts", "Angle pairs are not just in our textbooks – they are all around our campus. "
           "Let’s go find them!"),
    ("step", "(ID#6) The students will accomplish LW1.2 Angle Hunt in groups:",
     ["Photograph five examples of angle pairs around the campus (e.g., stair railings, "
      "window grills, an open door, intersecting walkways).",
      "Measure the angles with a protractor (or with GeoGebra on the photo).",
      "Name each angle pair and verify its relationship (sum of 90°, sum of 180°, or equal "
      "measures)."]),
    ("step", "(ID#9) Using the given rubric, groups check their work for completeness and "
             "accuracy before uploading to Ranger360."),
    ("meet", "Meeting 4 (C2, M5): Classifying Polygons"),
    ("ts", "We have names for angle pairs. Polygons have names too – and a polygon can be "
           "described in more than one way."),
    ("sim", {'kind': 'SIM HOOK', 'title': 'Angle Pair Lab – Classify Polygons', 'tool': 'LSGH Math 7 SimBook · Lesson 2 · Angle Pair Lab (Classify Polygons tab)', 'link': 'https://claude.ai/artifact/LrpohtVMd8ifUt7nkd7FFr#lesson2', 'setup': 'Pairs, one device; record findings in the notebook', 'mission': ['Build a pentagon, then push one vertex toward the centre until an angle turns red.', 'Turn on “Show diagonals.” Count the diagonals that fall outside.', 'Repeat with a hexagon and an octagon.'], 'questions': ['What makes a polygon non-convex?', 'What happens to the diagonals when it is non-convex?'], 'discovery': 'A polygon is non-convex when an interior angle is greater than 180°; then at least one diagonal lies outside.'}),
    ("step", "(ID#3) The teacher will discuss how polygons are classified."),
    ("table", ["Sides", "Name", "Sides", "Name"], [
        ["3", "Triangle", "7", "Heptagon"],
        ["4", "Quadrilateral", "8", "Octagon"],
        ["5", "Pentagon", "9", "Nonagon"],
        ["6", "Hexagon", "10", "Decagon"],
    ]),
    ("ex", "Key Ideas", [
        "- **Regular or irregular:** equal sides alone are not enough (a rhombus has equal "
        "sides but unequal angles), and equal angles alone are not enough (a rectangle has "
        "equal angles but unequal sides).",
        "- **Convex:** every interior angle is less than 180°; all diagonals lie inside.",
        "- **Non-convex:** at least one interior angle is greater than 180°; some diagonal "
        "lies outside. Example: the outline of a five-pointed star parol is a non-convex "
        "decagon.",
    ]),
    ("step", "(ID#5) “Polygon Sort” card game – In groups, students sort polygon cards into "
             "regular/irregular and convex/non-convex, and justify each placement."),
    ("meet", "Meeting 5 (C3, M1): Practice Set #1"),
    ("ts", "Let’s check how well we can use angle pairs and classify polygons on our own."),
    ("step", "(ID#5) The students will answer CP1.2 – Practice Set #1."),
    ("ex", "Expected Answers (sample items)", [
        "- Find the supplement of 74°. → **106°**",
        "- Find the complement of 18°. → **72°**",
        "- Two lines intersect; one angle is 132°. Find the other three. → **48°, 132°, 48°**",
        "- A hexagon has all sides 3 cm, but its angles are not all equal. → **irregular "
        "hexagon**",
        "- A quadrilateral has an angle of 210°. → **non-convex quadrilateral**",
    ]),
    ("h", "VALUING STATEMENT: (ID#8)"),
    ("q", "Angle pairs depend on each other – change one, and its partner changes too. In "
          "the same way, we depend on one another in our groups and in our community. "
          "Listening, sharing, and building on each other’s ideas is how we grow in "
          "communion."),
    ("h", "EXIT TICKET: (ID#9)"),
    ("bul", ["Can two acute angles be supplementary? Explain.",
             "Draw a non-convex pentagon and mark the angle that is greater than 180°."]),
    ("h", "SYNTHESIS:"),
    ("q", "Today, we learned five angle-pair relationships and used them to find unknown "
          "angles. We also classified polygons by their number of sides, whether they are "
          "regular or irregular, and whether they are convex or non-convex. Next, we will "
          "discover the rules for the angles inside and outside polygons."),
    ("res", ["LSGH Math 7 SimBook - Lesson 2 (https://claude.ai/artifact/LrpohtVMd8ifUt7nkd7FFr#lesson2)",
             "SimBook Exercises 2 – Part A as seatwork; Parts B and C as homework",
             "Teacher’s Google presentation - Lesson 2: Angle Pairs and Classifying Polygons",
             "Protractor and device camera", "Polygon Sort cards", R360,
             "Uploaded students’ LW1.2 Angle Hunt output in Ranger360"]),
]

LESSON_C = [
    ("sep",),
    ("cycle", "CYCLE 3, Meetings 2 to 5"),
    ("lesson", "LESSON 3: C. Angles of Polygons"),
    ("h", "SHORT RECAP OF PREVIOUS LESSON: (ID#2)"),
    ("q", "What is a linear pair, and what is the sum of its angles? How do we know if a "
          "polygon is convex?"),
    ("h", "INTRODUCTION:"),
    ("q", "In Lesson 1, we noticed that the angles of every triangle add up to 180° and those "
          "of every quadrilateral add up to 360°. Is there a rule for pentagons, hexagons, "
          "and beyond? Today we will discover it ourselves – and finally answer our Big "
          "Question: why do honeycombs use hexagons?"),
    ("h", "OBJECTIVES: (ID#1)"),
    ("obj", ["Deduce the relationship between the exterior angle and adjacent interior angle "
             "of a polygon.",
             "Determine the measures of angles and the number of sides of polygons.",
             "Discover the interior-angle-sum pattern by dividing polygons into triangles.",
             "Design a polygon-based pattern (tile, parol, or logo) with correct angle "
             "measures."], ["ZS"]),
    ("h", "ACTIVITIES:"),
    ("meet", "Meeting 1 (C3, M2): Interior and Exterior Angles"),
    ("ts", "Let’s begin with a little paper magic."),
    ("step", "(ID#2) ^^HOOK:^^ “Tear-and-Tape Triangle” – Students draw any triangle, tear "
             "off its three corners, and tape them side by side. The three angles always form "
             "a straight line: 180°."),
    ("step", "(ID#3) The teacher will discuss interior and exterior angles of a polygon."),
    ("ex", "Key Ideas and Examples", [
        "- An **exterior angle** is formed by one side of a polygon and the extension of the "
        "adjacent side.",
        "- An exterior angle and its adjacent interior angle form a linear pair, so "
        "**exterior angle + adjacent interior angle = 180°**.",
        "- If an interior angle is 135°, its exterior angle is 180° − 135° = **45°**.",
        "- If an exterior angle is 72°, the adjacent interior angle is **108°**.",
    ]),
    ("meet", "Meeting 2 (C3, M3): Triangle Split"),
    ("ts", "Can we use triangles to find the angle sum of any polygon? Let’s find out."),
    ("sim", {'kind': 'SIM HOOK', 'title': 'Angle Sum Machine – Triangle Split', 'tool': 'LSGH Math 7 SimBook · Lesson 3 · Angle Sum Machine (Triangle Split tab)', 'link': 'https://claude.ai/artifact/LrpohtVMd8ifUt7nkd7FFr#lesson3', 'setup': 'Pairs, one device; record findings in the notebook', 'mission': ['Visit at least five polygons and let the sim fill the data table.', 'Tick “Irregular.” Compare the measured sum with the formula.'], 'questions': ['How many triangles does an n-sided polygon split into?', 'Does the sum change when the polygon is irregular?'], 'discovery': 'An n-sided polygon splits into n − 2 triangles, so its interior angles add up to (n − 2) × 180°, regular or not.'}),
    ("step", "(ID#4) “Triangle Split” discovery table – From one vertex, students draw all "
             "possible diagonals of each polygon, count the triangles formed, and look for "
             "the pattern."),
    ("table", ["Polygon", "Sides (n)", "Triangles", "Sum of Interior Angles"], [
        ["Triangle", "3", "1", "180°"],
        ["Quadrilateral", "4", "2", "360°"],
        ["Pentagon", "5", "3", "540°"],
        ["Hexagon", "6", "4", "720°"],
        ["Octagon", "8", "6", "1 080°"],
        ["Decagon", "10", "8", "1 440°"],
    ]),
    ("ex", "Pattern and Example", [
        "- Sum of interior angles = (n − 2) × 180°",
        "- An irregular pentagon has angles of 100°, 110°, 95°, and 120°. The fifth angle is "
        "540° − 425° = **115°**.",
    ]),
    ("step", "(ID#5) Students find missing angles of irregular polygons on the board (CP1.1 – "
             "Recitation)."),
    ("meet", "Meeting 3 (C3, M4): Walk the Polygon"),
    ("ts", "What happens if we walk around a polygon and turn at every corner?"),
    ("sim", {'kind': 'SIM HOOK', 'title': 'Angle Sum Machine – Turtle Walk and Honeycomb Test', 'tool': 'LSGH Math 7 SimBook · Lesson 3 · Angle Sum Machine (Turtle Walk and Honeycomb Test tab)', 'link': 'https://claude.ai/artifact/LrpohtVMd8ifUt7nkd7FFr#lesson3', 'setup': 'Pairs, one device; record findings in the notebook', 'mission': ['Turtle Walk: walk a triangle, a hexagon, and a decagon. Record the total turn each time.', 'Honeycomb Test: add copies of each regular polygon around a point.'], 'questions': ['What is the total turn for every polygon?', 'Which polygons fit around a point with no gaps?'], 'discovery': 'The exterior angles of a convex polygon add up to 360°; triangles, squares, and hexagons tile because their angles divide 360° exactly.'}),
    ("step", "(ID#6) “Walk the Polygon” – Volunteers walk along a polygon taped on the floor, "
             "turning at each vertex. After one full trip, they have turned exactly once "
             "around: the exterior angles add up to 360°."),
    ("ex", "Key Ideas and Examples", [
        "- Sum of exterior angles (one at each vertex) = **360°** for any convex polygon.",
        "- Regular polygon: each exterior angle = 360° ÷ n; each interior angle = 180° − "
        "exterior angle.",
        "- Regular octagon (STOP sign): exterior = 360° ÷ 8 = 45°; interior = **135°**.",
        "- A regular polygon has exterior angles of 24°: n = 360° ÷ 24° = **15 sides**.",
        "- A regular polygon has interior angles of 140°: exterior = 40°, so n = 360° ÷ 40° "
        "= **9 sides (nonagon)**.",
        "- The interior angles of a polygon add up to 1 800°: n − 2 = 10, so n = **12 "
        "sides**.",
        "- Can a regular polygon have interior angles of 130°? Exterior = 50°, and "
        "360° ÷ 50° = 7.2 is not a whole number, so **no**.",
        "- **Big Question:** three regular hexagons meet at a point because 3 × 120° = 360°, "
        "so they fit with no gaps. Regular pentagons (108°) cannot: 360° ÷ 108° is not a "
        "whole number, so gaps appear.",
    ]),
    ("meet", "Meeting 4 (C3, M5): Polygon Design Challenge"),
    ("ts", "You know the rules of polygon angles. Now, let’s use them to create something "
           "beautiful."),
    ("step", "(ID#6, ID#7) The students will be asked to accomplish SA1.1 Polygon Design "
             "Challenge:",
     ["Design a parol frame, a floor-tile pattern, or a logo for a school event using at "
      "least two kinds of regular polygons.",
      "Label all interior and exterior angle measures and show the computations.",
      "Explain why the pieces fit (or do not fit) together at each vertex."]),
    ("step", "(ID#9) Using the given rubric (accuracy of angle measures – 10 pts; "
             "computations – 10 pts; design and creativity – 5 pts; explanation – 5 pts), the "
             "students reflect on their work, checking for completeness and accuracy."),
    ("step", "The teacher will remind the students of their upcoming QZ1.1 next meeting.",
     ["Coverage: Lessons 1 to 3 – drawing polygons, angle pairs, classifying polygons, and "
      "angles of polygons. Bring a ruler and a protractor."]),
    ("h", "VALUING STATEMENT: (ID#8)"),
    ("q", "Hexagons fit together perfectly because each one does its part exactly. When each "
          "of us does our best, our class works together just as well. Excellence is not "
          "about being better than others – it is about giving our best for the good of all."),
    ("h", "EXIT TICKET: (ID#9)"),
    ("bul", ["Find the measure of each interior angle of a regular decagon. (144°)",
             "A regular polygon has exterior angles of 30°. How many sides does it have? (12)"]),
    ("h", "SYNTHESIS:"),
    ("q", "We discovered that an exterior angle and its adjacent interior angle add up to "
          "180°, that the interior angles of a polygon add up to (n − 2) × 180°, and that the "
          "exterior angles add up to 360°. With these, we can find any angle of a regular "
          "polygon, or its number of sides."),
    ("res", ["LSGH Math 7 SimBook - Lesson 3 (https://claude.ai/artifact/LrpohtVMd8ifUt7nkd7FFr#lesson3)",
             "SimBook Exercises 3 – Part A as seatwork; Parts B and C as homework",
             "Teacher’s Google presentation - Lesson 3: Angles of Polygons",
             "Paper, scissors, and masking tape", "GeoGebra", R360,
             "Uploaded students’ SA1.1 Polygon Design Challenge output in Ranger360"]),
]

QUIZ_1 = [
    ("sep",),
    ("cycle", "CYCLE 4, Meeting 1"),
    ("lesson", "QZ1.1 – Polygons and Angles"),
    ("ts", "You have 5 minutes to review your notes on polygons and angles. After that, "
           "you will take QZ1.1. Remember to show your solutions."),
    ("step", "(ID#9) The students will take QZ1.1, a 25-item quiz (multiple choice and "
             "constructed response, including drawing items with a ruler and protractor). "
             "Before this, they will be allowed to review for 5 minutes.",
     ["Coverage: A1–A6, M1–M5, T1"]),
    ("ts", "May I see the hands of those who found the quiz manageable? Great work! Hold on "
           "to that confidence – next, we move from shapes to money."),
    ("pillar", ["SF"], ["Taking the quiz honestly reflects integrity and the value of "
                        "doing one’s own work."]),
    ("res", ["Teacher-made QZ1.1 in Ranger360", "Ruler and protractor"]),
]

STAGE_DRAW = ORIENTATION + LESSON_A + LESSON_B + LESSON_C + QUIZ_1

# ============================================================== TUNE (Make-Meaning)

LESSON_D = [
    ("cycle", "CYCLE 4, Meetings 2 to 5, and CYCLE 5, Meeting 1"),
    ("lesson", "LESSON 4: D. Percentages in Real Life"),
    ("h", "INTRODUCTION:"),
    ("q", "50% OFF! Buy 1, Take 1! Extra 20% off! Malls and online shops compete for "
          "our attention with promos. But which deal is really the best? Today we begin "
          "Unit B – Money Smart! You will learn to compute percentage increase and "
          "decrease, discounts, sales tax, commission, and simple interest, so you can make "
          "smart and honest decisions about money."),
    ("h", "OBJECTIVES: (ID#1)"),
    ("obj", ["Solve problems involving: a. percentage increase, and b. percentage decrease.",
             "Solve money problems involving percentages (e. g., discount, commission, sales "
             "tax, simple interest).",
             "Compare promos and deals to decide which offer gives the best value.",
             "Reflect on honest pricing and responsible spending."], ["SF", "ZS"]),
    ("h", "ACTIVITIES:"),
    ("meet", "Meeting 1 (C4, M2): Sale Ka Ba?"),
    ("ts", "Imagine you need two shirts that cost ₱600 each. Three stores have different "
           "promos. Vote first – then let’s check with math!"),
    ("step", "(ID#2) ^^HOOK:^^ “Sale Ka Ba?” – Students vote on the best deal, then compute."),
    ("ex", "Expected Output", [
        "- Store A – 50% off each shirt: 2 × ₱300 = **₱600**",
        "- Store B – Buy 1, Take 1: pay for one shirt = **₱600**",
        "- Store C – 30% off, plus an extra 20% off: ₱600 × 0.70 = ₱420; ₱420 × 0.80 = ₱336 "
        "per shirt → 2 × ₱336 = **₱672**",
        "If you need two shirts, Stores A and B tie. If you need only one, Store A is best "
        "(₱300). “30% + 20% off” is only 44% off, not 50%!",
    ]),
    ("sim", {'kind': 'SIM HOOK', 'title': 'LSGH Mini Mall – Promo Lab', 'tool': 'LSGH Math 7 SimBook · Lesson 4 · LSGH Mini Mall (Promo Lab tab)', 'link': 'https://claude.ai/artifact/LrpohtVMd8ifUt7nkd7FFr#lesson4', 'setup': 'Pairs, one device; record findings in the notebook', 'mission': ['Buy 2 school shirts with 50% off, then with Buy 1 Take 1. Compare the totals.', 'Set 30% off plus an extra 20% off. Read the REAL discount on the percent bar.', 'Turn the 12% VAT on and off. Watch the receipt.'], 'questions': ['Why is 30% + 20% off not 50% off?', 'When is Buy 1 Take 1 the same as 50% off?'], 'discovery': 'Each percentage is taken of a base; successive discounts use different bases, so 30% + 20% off is only 44% off.'}),
    ("step", "(ID#3) The teacher will review finding the percentage of a number and "
             "converting among percentages, decimals, and fractions (e.g., 15% of 240 = "
             "0.15 × 240 = 36)."),
    ("meet", "Meeting 2 (C4, M3): Percentage Increase and Decrease"),
    ("ts", "Prices go up and down all the time. How do we describe these changes fairly?"),
    ("sim", {'kind': 'SIM HOOK', 'title': 'LSGH Mini Mall – Price Change', 'tool': 'LSGH Math 7 SimBook · Lesson 4 · LSGH Mini Mall (Price Change tab)', 'link': 'https://claude.ai/artifact/LrpohtVMd8ifUt7nkd7FFr#lesson4', 'setup': 'Pairs, one device; record findings in the notebook', 'mission': ['Enter ₱50 → ₱55, then ₱600 → ₱800, then ₱800 → ₱600.', 'Compare each percentage change with its reverse change.'], 'questions': ['Why do ₱600 → ₱800 and ₱800 → ₱600 give different percentages?'], 'discovery': 'Percentage change is always computed from the ORIGINAL amount.'}),
    ("step", "(ID#4) The teacher will discuss percentage increase and percentage decrease."),
    ("ex", "Key Idea and Examples", [
        "- Percentage change = (amount of change ÷ original amount) × 100%",
        "- Rice goes from ₱50 to ₱55 per kilo: 5 ÷ 50 = 0.10 → **10% increase**",
        "- Shoes go from ₱800 to ₱600: 200 ÷ 800 = 0.25 → **25% decrease**",
        "- ₱1 250 increased by 8%: ₱1 250 × 1.08 = **₱1 350**",
        "- ₱480 decreased by 15%: ₱480 × 0.85 = **₱408**",
        "Watch out: always divide by the ORIGINAL amount. ₱600 → ₱800 is a 33.3% increase, "
        "but ₱800 → ₱600 is a 25% decrease.",
    ]),
    ("step", "(ID#5) “Price Watch” – Using a teacher-prepared table of price changes (e.g., "
             "fares, rice, gasoline), pairs compute and interpret the percentage changes."),
    ("meet", "Meeting 3 (C4, M4): Money Problems"),
    ("ts", "Percentages are everywhere in business: in discounts, taxes, commissions, and "
           "interest. Let’s learn each one."),
    ("sim", {'kind': 'SIM HOOK', 'title': 'LSGH Mini Mall – Money Tools', 'tool': 'LSGH Math 7 SimBook · Lesson 4 · LSGH Mini Mall (Money Tools tab)', 'link': 'https://claude.ai/artifact/LrpohtVMd8ifUt7nkd7FFr#lesson4', 'setup': 'Pairs, one device; record findings in the notebook', 'mission': ['Compute the commission on ₱80 000 at 5%.', 'Find the simple interest on ₱10 000 at 3% for 2 years, then for 5 years.'], 'questions': ['How does the interest grow each year?'], 'discovery': 'Commission and simple interest are a rate times a base; simple interest grows by the same amount every year (I = P × r × t).'}),
    ("step", "(ID#4) The teacher will discuss discount, sales tax, commission, and simple "
             "interest."),
    ("ex", "Worked Examples", [
        "- **Discount:** A ₱1 200 bag is 30% off. Discount = 0.30 × ₱1 200 = ₱360; sale "
        "price = **₱840**.",
        "- **Sales tax (12% VAT):** A ₱500 item → tax = ₱60; total = **₱560**.",
        "- **Commission:** A salesperson earns 5% of ₱80 000 in sales → **₱4 000**.",
        "- **Simple interest (I = P × r × t):** ₱10 000 at 3% per year for 2 years → "
        "I = 10 000 × 0.03 × 2 = **₱600**; total amount = ₱10 600.",
    ]),
    ("step", "(ID#5) “Sari-Sari Store Simulation” – In groups, students role-play a store "
             "owner, a sales agent, and a customer, computing commissions, VAT, and simple "
             "interest on a store loan."),
    ("meet", "Meeting 4 (C4, M5): Discount Showdown"),
    ("ts", "Let’s use real flyers to see whether the promos are as good as they look."),
    ("step", "(ID#6) The students will accomplish LW1.3 Discount Showdown:",
     ["Using mall flyers and online store screenshots, compute the discount, sale price, "
      "VAT (where applicable), and final price of five items.",
      "Rank the deals from best to worst value and explain one “tricky” promo."]),
    ("step", "(ID#9) Using the given rubric and sample output, the students reflect on their "
             "work, checking for completeness and accuracy."),
    ("meet", "Meeting 5 (C5, M1): Practice Set #2"),
    ("step", "(ID#5) The students will answer CP1.3 – Practice Set #2."),
    ("ex", "Expected Answers (sample items)", [
        "- A school bus fee increased from ₱2 000 to ₱2 300. → **15% increase**",
        "- A tablet’s price dropped from ₱12 500 to ₱10 000. → **20% decrease**",
        "- ₱2 400 rubber shoes at 25% off → **₱1 800**",
        "- An ₱850 meal plus 12% VAT → **₱952**",
        "- A 3% commission on ₱150 000 → **₱4 500**",
        "- ₱5 000 at 2.5% simple interest per year for 3 years → I = **₱375**; total = "
        "₱5 375",
        "- ₱1 000 with 20% off, then another 10% off → ₱800 → **₱720** (a 28% discount, "
        "not 30%)",
    ]),
    ("h", "VALUING STATEMENT: (ID#8)"),
    ("q", "Percentages help us see through promos that look better than they are. Being "
          "money smart also means being honest – charging fair prices, giving the right "
          "change, and asking ourselves: “Do I really need this?” before we buy."),
    ("h", "EXIT TICKET: (ID#9)"),
    ("bul", ["Is a 20% discount followed by a 20% price increase back to the original price? "
             "Explain using ₱100.",
             "When would “Buy 1, Take 1” NOT be a good deal for you?"]),
    ("h", "SYNTHESIS:"),
    ("q", "We learned how to compute percentage increase and decrease, discounts, sales tax, "
          "commission, and simple interest. We also learned to look closely before trusting "
          "a promo. Next, we will use these skills to build our own financial plan."),
    ("res", ["LSGH Math 7 SimBook - Lesson 4 (https://claude.ai/artifact/LrpohtVMd8ifUt7nkd7FFr#lesson4)",
             "SimBook Exercises 4 – Part A as seatwork; Parts B and C as homework",
             "Teacher’s Google presentation - Lesson 4: Percentages in Real Life",
             "Mall flyers and online store screenshots", "Calculator", R360,
             "Uploaded students’ LW1.3 Discount Showdown output in Ranger360"]),
]

LESSON_E = [
    ("sep",),
    ("cycle", "CYCLE 5, Meetings 2 to 5"),
    ("lesson", "LESSON 5: E. Creating a Financial Plan"),
    ("h", "SHORT RECAP OF PREVIOUS LESSON: (ID#2)"),
    ("q", "What is 12% VAT on a ₱250 item? Why should we divide by the original amount when "
          "computing percentage change?"),
    ("h", "INTRODUCTION:"),
    ("q", "Have you ever run out of baon before the week ended? A financial plan helps us "
          "decide ahead of time how to use our money for what matters most. Today, you will "
          "learn to build a budget using percentages, set savings goals, and begin your "
          "performance task – Budget for a Cause."),
    ("h", "OBJECTIVES: (ID#1)"),
    ("obj", ["Create a financial plan.",
             "Distinguish needs from wants and set realistic savings goals.",
             "Draft a group financial plan for a class outreach or fundraising activity "
             "using percentages."], ["ZS", "CM"]),
    ("h", "ACTIVITIES:"),
    ("meet", "Meeting 1 (C5, M2): The ₱500 Baon Challenge"),
    ("step", "(ID#2) ^^HOOK:^^ “₱500 Baon Challenge” – Students list how they would spend "
             "₱500 for five school days, then compare plans with a partner."),
    ("sim", {'kind': 'SIM HOOK', 'title': 'Baon Life Sim – Plan and Live the Week', 'tool': 'LSGH Math 7 SimBook · Lesson 5 · Baon Life Sim (Plan and Live the Week tab)', 'link': 'https://claude.ai/artifact/LrpohtVMd8ifUt7nkd7FFr#lesson5', 'setup': 'Individual, one device each', 'mission': ['Plan: split a ₱500 baon using 50-30-20.', 'Live the Week: play five days of Life Cards and decide on every optional card.', 'Change your plan and play again. Compare the two weeks.'], 'questions': ['Which Life Card hurt your budget the most?', 'Did you reach your savings target?'], 'discovery': 'A financial plan gives every peso a job before the week starts; a reserve and daily tracking keep the savings goal within reach.'}),
    ("step", "(ID#3) The teacher will discuss the parts of a financial plan: goal, income, "
             "expenses (needs and wants), savings, and timeline."),
    ("step", "(ID#5) “Needs or Wants?” quick-sort game – transportation fare, lunch, school "
             "supplies, milk tea, mobile load, a new game skin, and others. Students explain "
             "items that can be either, depending on the situation."),
    ("meet", "Meeting 2 (C5, M3): Building a Budget"),
    ("ts", "A good budget gives every peso a job. Let’s use percentages to plan."),
    ("step", "(ID#4) The teacher will discuss budgeting using the 50-30-20 guide: 50% for "
             "needs, 30% for wants, and 20% for savings."),
    ("table", ["Category", "Item", "Amount", "% of ₱500"], [
        ["Needs", "Fare", "₱150", "30%"],
        ["Needs", "Lunch", "₱100", "20%"],
        ["Wants", "Snacks", "₱100", "20%"],
        ["Wants", "Mobile load", "₱50", "10%"],
        ["Savings", "Savings jar", "₱100", "20%"],
        ["", "Total", "₱500", "100%"],
    ]),
    ("ex", "Savings Goal Example", [
        "- Goal: ₱1 800 rubber shoes. Saving ₱100 per week → 1 800 ÷ 100 = **18 weeks**.",
        "- To reach the goal in 12 weeks: 1 800 ÷ 12 = **₱150 per week**, which is 30% of a "
        "₱500 weekly baon.",
    ]),
    ("sim", {'kind': 'SIM HOOK', 'title': 'Baon Life Sim – Savings Goal', 'tool': 'LSGH Math 7 SimBook · Lesson 5 · Baon Life Sim (Savings Goal tab)', 'link': 'https://claude.ai/artifact/LrpohtVMd8ifUt7nkd7FFr#lesson5', 'setup': 'Pairs, one device; record findings in the notebook', 'mission': ['How many weeks to save ₱1 800 at ₱100 a week?', 'How much a week to reach ₱1 800 in 12 weeks? What percent of the baon is that?'], 'questions': [], 'discovery': 'weeks = goal ÷ weekly savings; weekly savings = goal ÷ weeks.'}),
    ("step", "(ID#6) Budget Builder – Students build their own weekly budget in a Google "
             "Sheets template, using formulas to compute each item as a percentage of the "
             "total (e.g., =C2/500)."),
    ("meet", "Meeting 3 (C5, M4): Launching Budget for a Cause"),
    ("ts", "Now let’s use our budgeting skills not just for ourselves, but for others."),
    ("step", "(ID#3) The teacher will introduce PT1.1 Budget for a Cause: the G.R.A.S.P. "
             "description, the rubric, the scaffolding schedule, and the groupings (4 to 5 "
             "members)."),
    ("step", "(ID#4) The teacher will model sample fundraiser computations."),
    ("ex", "Worked Example: Bake Sale", [
        "- Cost per brownie: ₱18. Markup: 50% → selling price = ₱18 × 1.50 = **₱27**.",
        "- Sell 120 brownies: revenue = 120 × ₱27 = ₱3 240; cost = 120 × ₱18 = ₱2 160.",
        "- Profit = ₱3 240 − ₱2 160 = **₱1 080**.",
    ]),
    ("meet", "Meeting 4 (C5, M5): PT1.1 Scaffolding#1"),
    ("step", "(ID#6) The students will accomplish PT1.1 Scaffolding#1 – Goals and Draft "
             "Budget:",
     ["Choose the beneficiaries and the items to prepare.",
      "Estimate the income: seed fund of ₱5 000 plus the fundraiser.",
      "Draft the allocation of the budget by category, in pesos and in percentages, "
      "including a contingency reserve of at least 10%."]),
    ("step", "(ID#9) Using the Scaffolding#1 checklist, groups review their draft before "
             "uploading it to Ranger360."),
    ("h", "VALUING STATEMENT: (ID#8)"),
    ("q", "Every peso entrusted to us for others is a responsibility. Planning carefully, "
          "spending wisely, and accounting for every centavo is how we serve with "
          "integrity."),
    ("h", "EXIT TICKET: (ID#9)"),
    ("bul", ["Why is a contingency reserve important in a financial plan?",
             "Give one need and one want in your own weekly budget."]),
    ("res", ["LSGH Math 7 SimBook - Lesson 5 (https://claude.ai/artifact/LrpohtVMd8ifUt7nkd7FFr#lesson5)",
             "SimBook Exercises 5 – Part A as seatwork; Parts B and C as homework",
             "Teacher’s Google presentation - Lesson 5: Creating a Financial Plan",
             "Google Sheets budget template",
             "Teacher-prepared PT1.1 Guidelines and Rubric", R360]),
]

LESSON_F = [
    ("sep",),
    ("cycle", "CYCLE 6, Meetings 1 to 4"),
    ("lesson", "LESSON 6: F. Rates"),
    ("h", "SHORT RECAP OF PREVIOUS LESSON: (ID#2)"),
    ("q", "What are the parts of a financial plan? What does the 50-30-20 guide mean?"),
    ("h", "INTRODUCTION:"),
    ("q", "How fast do you walk? Which is cheaper – shampoo in sachets or in a bottle? To "
          "answer these, we compare two different quantities at the same time. That "
          "comparison is called a rate. Today, you will learn to use rates to make smart "
          "choices, including for your performance task."),
    ("h", "OBJECTIVES: (ID#1)"),
    ("obj", ["Identify and explain the uses of rates.",
             "Solve problems involving rates (e.g., speed).",
             "Use unit rates to compare options and make informed decisions.",
             "Canvass prices and use unit rates to choose best-value items for the PT1.1 "
             "budget."], ["ZS"]),
    ("h", "ACTIVITIES:"),
    ("meet", "Meeting 1 (C6, M1): Hallway Speed Trial"),
    ("step", "(ID#2) ^^HOOK:^^ “Hallway Speed Trial” – In pairs, students time each other "
             "walking 20 meters and compute their walking speed (e.g., 20 m in 16 s = "
             "1.25 m/s)."),
    ("sim", {'kind': 'SIM HOOK', 'title': 'Rate Racer – Race', 'tool': 'LSGH Math 7 SimBook · Lesson 6 · Rate Racer (Race tab)', 'link': 'https://claude.ai/artifact/LrpohtVMd8ifUt7nkd7FFr#lesson6', 'setup': 'Pairs, one device; record findings in the notebook', 'mission': ['Predict the faster vehicle, then race: jeepney 12 km in 45 min vs. train 12 km in 30 min.', 'Change the train’s distance and time so both have the SAME speed.', 'Read the double number lines: what is the distance in 1 hour?'], 'questions': ['Is the vehicle that finishes first always the faster one?'], 'discovery': 'Speed is a unit rate – distance per 1 hour; equal unit rates mean equal speeds.'}),
    ("step", "(ID#3) The teacher will discuss rates and unit rates."),
    ("ex", "Key Ideas", [
        "- A **rate** compares two quantities with different units (e.g., 150 km in 3 hours).",
        "- A **unit rate** is a rate per one unit (e.g., 50 km per hour).",
        "- Everyday rates: speed (km/h), price per unit (₱/kg), pay (₱/hour), water flow "
        "(L/min), heart rate (beats/min), typing speed (words/min).",
    ]),
    ("meet", "Meeting 2 (C6, M2): Speed, Distance, and Time"),
    ("step", "(ID#4) The teacher will discuss problems involving speed."),
    ("ex", "Worked Examples", [
        "- speed = distance ÷ time; distance = speed × time; time = distance ÷ speed",
        "- A bus travels 150 km in 3 hours → **50 km/h**.",
        "- At 60 km/h, a 120-km trip takes **2 hours**.",
        "- A cyclist rides at 18 km/h for 2.5 hours → **45 km**.",
        "- 1.25 m/s = 1.25 × 3 600 m per hour = 4 500 m per hour = **4.5 km/h**.",
    ]),
    ("step", "(ID#5) “Commute Check” – Pairs compare two routes to school:",
     ["Route A (jeepney): 12 km in 45 minutes for ₱25 → 16 km/h; about ₱2.08 per km",
      "Route B (train and walk): 12 km in 30 minutes for ₱30 → 24 km/h; ₱2.50 per km",
      "Which route would you choose, and why? (Answers may vary: faster vs. cheaper.)"]),
    ("meet", "Meeting 3 (C6, M3): Best Buy Battle"),
    ("step", "(ID#6, ID#7) The students will accomplish SA1.2 Best Buy Battle, starting with the SimBook Best Buy tab (Lesson 6) – predict first, then reveal the unit prices:"),
    ("ex", "Expected Output (sample)", [
        "- Shampoo: sachet 12 mL for ₱8 → ₱0.67 per mL; bottle 180 mL for ₱95 → ₱0.53 per "
        "mL; 1 L refill for ₱420 → ₱0.42 per mL. The refill has the **lowest unit price**.",
        "- Rice: 5 kg for ₱275 → ₱55 per kg; 25 kg for ₱1 300 → **₱52 per kg**.",
        "- But the cheapest unit price is not always the best choice: consider your budget "
        "today, storage, and whether you will use it all.",
    ]),
    ("step", "(ID#9) Using the given rubric (correct unit rates, sound decision, clear "
             "justification), the students reflect on their work."),
    ("meet", "Meeting 4 (C6, M4): PT1.1 Scaffolding#2"),
    ("step", "(ID#6) The students will accomplish PT1.1 Scaffolding#2 – Price Canvass and "
             "Unit-Rate Comparison:",
     ["Canvass at least five items from two stores (actual or online).",
      "Compute unit prices and choose the best-value option for each item.",
      "Update the draft budget from Scaffolding#1."]),
    ("step", "The teacher will remind the students of their upcoming QZ1.2 next meeting.",
     ["Coverage: Lessons 4 to 6 – percentages, financial planning, and rates. Bring a "
      "calculator."]),
    ("h", "VALUING STATEMENT: (ID#8)"),
    ("q", "Comparing unit prices helps us avoid waste. A wise consumer chooses not just what "
          "is cheapest, but what is needed – leaving more resources for others."),
    ("h", "EXIT TICKET: (ID#9)"),
    ("bul", ["A faucet fills a 36-L pail in 4 minutes. What is the rate of flow? (9 L/min)",
             "Name one rate you used this week outside of school."]),
    ("res", ["LSGH Math 7 SimBook - Lesson 6 (https://claude.ai/artifact/LrpohtVMd8ifUt7nkd7FFr#lesson6)",
             "SimBook Exercises 6 – Part A as seatwork; Parts B and C as homework",
             "Teacher’s Google presentation - Lesson 6: Rates",
             "Stopwatch app and measuring tape", "Grocery price lists and receipts", R360,
             "Uploaded students’ SA1.2 Best Buy Battle output in Ranger360"]),
]

QUIZ_2 = [
    ("sep",),
    ("cycle", "CYCLE 6, Meeting 5"),
    ("lesson", "QZ1.2 – Percentages, Financial Planning, and Rates"),
    ("step", "(ID#9) The students will take QZ1.2, a 25-item quiz (multiple choice and word "
             "problems). Before this, they will be allowed to review for 5 minutes.",
     ["Coverage: A7–A11, M6–M9, T2–T3"]),
    ("pillar", ["SF"], ["Answering honestly and showing complete solutions reflect "
                        "integrity in one’s work."]),
    ("res", ["Teacher-made QZ1.2 in Ranger360", "Calculator"]),
]

LESSON_G = [
    ("sep",),
    ("cycle", "CYCLE 7, Meetings 1 to 4"),
    ("lesson", "LESSON 7: G. Rational Numbers"),
    ("h", "INTRODUCTION:"),
    ("q", "Welcome to Unit C – Number Line Adventures! One-half, 0.5, and 50% look "
          "different, but they are the same number in different outfits. Today, you will "
          "learn to describe rational numbers as fractions, decimals, and percentages, and "
          "to order them on the number line."),
    ("h", "OBJECTIVES: (ID#1)"),
    ("obj", ["Describe given rational numbers as fractions, decimals, or percentages.",
             "Order rational numbers on a number line.",
             "Explain why a fraction can be written as a terminating or repeating decimal."],
     ["CM"]),
    ("p", "__Teacher’s note: this term works with non-negative rational numbers; negative "
          "numbers are introduced with integers in Term 2.__"),
    ("h", "ACTIVITIES:"),
    ("meet", "Meeting 1 (C7, M1): Same Number, Different Outfit"),
    ("step", "(ID#2) ^^HOOK:^^ “Same Number, Different Outfit” – Students race to match "
             "cards: ½, 0.5, 50%; ¾, 0.75, 75%; ⅕, 0.2, 20%; ⅛, 0.125, 12.5%."),
    ("sim", {'kind': 'SIM HOOK', 'title': 'Number Line Explorer – Converter', 'tool': 'LSGH Math 7 SimBook · Lesson 7 · Number Line Explorer (Converter tab)', 'link': 'https://claude.ai/artifact/LrpohtVMd8ifUt7nkd7FFr#lesson7', 'setup': 'Pairs, one device; record findings in the notebook', 'mission': ['Type 3/8, 2/3, 7/20, and 5/12. Record each decimal and percentage.', 'Read why each decimal terminates or repeats.'], 'questions': ['Which denominators give terminating decimals?'], 'discovery': 'A fraction in lowest terms terminates only when its denominator has no prime factors other than 2 and 5.'}),
    ("step", "(ID#3) The teacher will discuss rational numbers and how to convert among their "
             "forms."),
    ("ex", "Key Ideas and Examples", [
        "- A **rational number** can be written as a ÷ b (a fraction), where a and b are "
        "integers and b ≠ 0.",
        "- 3/8 = 3 ÷ 8 = **0.375 = 37.5%**",
        "- 0.45 = 45/100 = **9/20 = 45%**",
        "- 2/3 = 0.666… (the 6 repeats) ≈ **66.67%**",
        "- 125% = **1.25 = 5/4 = 1¼**",
    ]),
    ("meet", "Meeting 2 (C7, M2): Terminating or Repeating?"),
    ("step", "(ID#4) The teacher will discuss terminating and repeating decimals."),
    ("ex", "Key Ideas and Examples", [
        "- 7/20 = 0.35 (terminates) – the denominator 20 = 2 × 2 × 5.",
        "- 5/12 = 0.41666… (repeats) – the denominator 12 has a factor of 3.",
        "- **Rule:** a fraction in lowest terms gives a terminating decimal only when its "
        "denominator has no prime factors other than 2 and 5. Otherwise, the decimal repeats.",
        "- Repeating decimals are rational too: 0.333… = 1/3 and 0.1212… = 12/99 = 4/33.",
    ]),
    ("step", "(ID#5) “Conversion Dominoes” – In small groups, students connect domino cards "
             "showing equal fractions, decimals, and percentages."),
    ("meet", "Meeting 3 (C7, M3): Human Number Line"),
    ("sim", {'kind': 'SIM HOOK', 'title': 'Number Line Explorer – Order It and Zoom Between', 'tool': 'LSGH Math 7 SimBook · Lesson 7 · Number Line Explorer (Order It and Zoom Between tab)', 'link': 'https://claude.ai/artifact/LrpohtVMd8ifUt7nkd7FFr#lesson7', 'setup': 'Pairs, one device; record findings in the notebook', 'mission': ['Order It: deal three sets of mixed cards and order them from least to greatest.', 'Zoom Between: find three numbers between 0.7 and 0.72.'], 'questions': ['Which strategy made ordering easiest?', 'Do you ever run out of numbers in between?'], 'discovery': 'Converting to one form (decimals) makes ordering easy; between any two rational numbers there is always another.'}),
    ("step", "(ID#6) The students will accomplish LW1.4 Human Number Line: each student holds "
             "a card and the class arranges itself from least to greatest, then justifies "
             "the order."),
    ("ex", "Expected Output", [
        "Cards: 3/4, 0.7, 72%, 2/3, 1¼, 1.2, 0.05, 1/8",
        "Order: 0.05 < 1/8 (0.125) < 2/3 (0.667) < 0.7 < 72% (0.72) < 3/4 (0.75) < 1.2 < 1¼ "
        "(1.25)",
        "Strategies: convert to decimals, use common denominators, or use benchmarks (0, ½, "
        "1).",
    ]),
    ("step", "(ID#9) Using the given rubric, students write a reflection on the strategy they "
             "used to place their number, then upload it to Ranger360."),
    ("meet", "Meeting 4 (C7, M4): Which Is Bigger?"),
    ("step", "(ID#5, ID#7) “Which Is Bigger?” mini-debates – Pairs defend their answers:",
     ["5/8 or 0.6? → 5/8 = 0.625, so 5/8 is bigger.",
      "33% or 1/3? → 1/3 = 33.33…%, so 1/3 is bigger.",
      "0.09 or 0.1? → 0.1 = 0.10, so 0.1 is bigger.",
      "Find a number between 0.7 and 0.72. → 0.71 (there is always another rational number "
      "in between!)"]),
    ("h", "VALUING STATEMENT: (ID#8)"),
    ("q", "The same number can wear different outfits – a fraction, a decimal, or a "
          "percentage. People, too, may express the same idea in different ways. Listening "
          "to understand one another builds communion in our class."),
    ("h", "EXIT TICKET: (ID#9)"),
    ("bul", ["Will 7/40 give a terminating or a repeating decimal? Why?",
             "Order from least to greatest: 0.4, 3/8, 45%."]),
    ("res", ["LSGH Math 7 SimBook - Lesson 7 (https://claude.ai/artifact/LrpohtVMd8ifUt7nkd7FFr#lesson7)",
             "SimBook Exercises 7 – Part A as seatwork; Parts B and C as homework",
             "Teacher’s Google presentation - Lesson 7: Rational Numbers",
             "Number cards and a rope number line", "Desmos or GeoGebra number line", R360]),
]

LESSON_H = [
    ("sep",),
    ("cycle", "CYCLE 7, Meeting 5, CYCLE 8, Meetings 1 to 5, and CYCLE 9, Meeting 1"),
    ("lesson", "LESSON 8: H. Operations on Rational Numbers"),
    ("h", "SHORT RECAP OF PREVIOUS LESSON: (ID#2)"),
    ("q", "How do we write 3/5 as a decimal and as a percentage? Which is greater, 0.7 or "
          "2/3?"),
    ("h", "INTRODUCTION:"),
    ("q", "Recipes, budgets, measurements, and prices all use fractions and decimals. In this "
          "lesson, you will add, subtract, multiply, and divide rational numbers, choose the "
          "most efficient strategy, and use these skills to finalize your financial plan."),
    ("h", "OBJECTIVES: (ID#1)"),
    ("obj", ["Perform operations on rational numbers.",
             "Choose efficient strategies (fraction or decimal form) when computing.",
             "Finalize the PT1.1 financial plan by computing totals, shares, and savings."],
     ["ZS", "CM"]),
    ("h", "ACTIVITIES:"),
    ("meet", "Meeting 1 (C7, M5): Adding and Subtracting Fractions"),
    ("step", "(ID#2) ^^HOOK:^^ “Recipe Rescale” – A leche flan recipe needs ¾ cup of sugar. "
             "How much is needed for half a recipe? (⅜ cup) For three times the recipe? "
             "(2¼ cups)"),
    ("sim", {'kind': 'SIM HOOK', 'title': 'Fraction Kitchen – Kakanin Kitchen and Fraction Bars', 'tool': 'LSGH Math 7 SimBook · Lesson 8 · Fraction Kitchen (Kakanin Kitchen and Fraction Bars tab)', 'link': 'https://claude.ai/artifact/LrpohtVMd8ifUt7nkd7FFr#lesson8', 'setup': 'Pairs, one device; record findings in the notebook', 'mission': ['Kakanin Kitchen: scale the puto recipe for ½, 2½, and 3 batches.', 'Serve five orders for the kitchen inspector.', 'Fraction Bars: show 2/3 + 3/4 and 5/6 − 1/4.'], 'questions': ['Why must both bars be cut into the same-size pieces?'], 'discovery': 'Adding and subtracting need a common denominator; scaling a recipe multiplies every amount by the same number.'}),
    ("step", "(ID#3) The teacher will discuss adding and subtracting fractions and mixed "
             "numbers."),
    ("ex", "Worked Examples", [
        "- 2/3 + 3/4 = 8/12 + 9/12 = 17/12 = **1 5/12**",
        "- 5/6 − 1/4 = 10/12 − 3/12 = **7/12**",
        "- 3½ − 1¾ = 7/2 − 7/4 = 14/4 − 7/4 = 7/4 = **1¾**",
    ]),
    ("meet", "Meeting 2 (C8, M1): Adding and Subtracting Decimals"),
    ("step", "(ID#4) The teacher will discuss adding and subtracting decimals by lining up "
             "the decimal points."),
    ("ex", "Worked Examples", [
        "- 4.75 + 12.6 = **17.35**",
        "- 20 − 7.85 = **12.15**",
        "- ₱150.75 + ₱89.50 = **₱240.25**",
    ]),
    ("step", "(ID#5) “Mental Math Sprint” – Timed warm-up of 10 quick fraction and decimal "
             "sums and differences."),
    ("meet", "Meeting 3 (C8, M2): Multiplying and Dividing Fractions"),
    ("sim", {'kind': 'SIM HOOK', 'title': 'Fraction Kitchen – Fraction Bars (× and ÷)', 'tool': 'LSGH Math 7 SimBook · Lesson 8 · Fraction Kitchen (Fraction Bars (× and ÷) tab)', 'link': 'https://claude.ai/artifact/LrpohtVMd8ifUt7nkd7FFr#lesson8', 'setup': 'Pairs, one device; record findings in the notebook', 'mission': ['Show 2/5 × 15/8 with the area model.', 'Show 3/4 ÷ 3/8 and 2½ ÷ 1/4.'], 'questions': ['Why can dividing by a fraction give a bigger answer?'], 'discovery': 'Dividing asks “how many of these fit?”, so dividing by a number less than 1 gives a larger result.'}),
    ("step", "(ID#4) The teacher will discuss multiplying and dividing fractions using area "
             "models and the fraction wall."),
    ("ex", "Worked Examples", [
        "- 2/5 × 15/8 = 30/40 = **3/4**",
        "- 3/4 of 24 = **18**",
        "- 3/4 ÷ 3/8 = 3/4 × 8/3 = **2** (there are two 3/8’s in 3/4)",
        "- 2½ ÷ 1/4 = 5/2 × 4 = **10**",
    ]),
    ("meet", "Meeting 4 (C8, M3): Multiplying and Dividing Decimals; Practice Set #3"),
    ("sim", {'kind': 'SIM HOOK', 'title': 'Fraction Kitchen – Decimal Grid', 'tool': 'LSGH Math 7 SimBook · Lesson 8 · Fraction Kitchen (Decimal Grid tab)', 'link': 'https://claude.ai/artifact/LrpohtVMd8ifUt7nkd7FFr#lesson8', 'setup': 'Pairs, one device; record findings in the notebook', 'mission': ['Show 0.6 × 0.5, 0.3 × 0.4, and 0.8 × 0.9 on the hundred grid.'], 'questions': ['Why is the product smaller than both factors?'], 'discovery': 'Multiplying by a number less than 1 gives a smaller product; the number of decimal places adds up.'}),
    ("step", "(ID#4) The teacher will discuss multiplying and dividing decimals."),
    ("ex", "Worked Examples", [
        "- 3.2 × 0.15 = **0.48**",
        "- 0.6 × 0.5 = **0.3**",
        "- 7.2 ÷ 0.04 = 720 ÷ 4 = **180**",
    ]),
    ("step", "(ID#5) The students will answer CP1.4 – Practice Set #3."),
    ("ex", "Expected Answers (sample items)", [
        "- 5/6 + 2/9 = 15/18 + 4/18 = 19/18 = **1 1/18**",
        "- 4⅓ − 2⅚ = 26/6 − 17/6 = 9/6 = **1½**",
        "- 3/7 × 14/15 = **2/5**",
        "- 5/8 ÷ 1¼ = 5/8 × 4/5 = **1/2**",
        "- 12.5 × 0.08 = **1**",
        "- 9.6 ÷ 0.3 = **32**",
        "- A 5½-m ribbon is cut into ¾-m pieces → **7 pieces**, with ¼ m left over",
    ]),
    ("meet", "Meeting 5 (C8, M4): Multi-step Problems"),
    ("step", "(ID#4) The teacher will discuss solving multi-step problems and choosing "
             "between fraction and decimal forms."),
    ("ex", "Worked Example", [
        "Ana has ₱1 000. Ana spends 2/5 of it on books and 0.25 of the remainder on snacks. "
        "How much is left?",
        "- Books: 2/5 × ₱1 000 = ₱400 → remainder ₱600",
        "- Snacks: 0.25 × ₱600 = ₱150 → **₱450 left**",
        "Strategy: fractions are convenient when denominators divide evenly; decimals are "
        "convenient for money.",
    ]),
    ("step", "(ID#5) In groups, students solve three multi-step problems and present one "
             "solution to the class."),
    ("meet", "Meeting 6 (C8, M5): Rational Relay"),
    ("step", "(ID#6, ID#7) The students will accomplish SA1.3 Rational Relay – Teams of four "
             "pass their answer to the next member, whose problem uses it:"),
    ("ex", "Expected Output (sample relay)", [
        "- Leg 1: 1/2 + 3/4 = **5/4**",
        "- Leg 2: (answer) × 0.8 = **1**",
        "- Leg 3: (answer) ÷ 1/6 = **6**",
        "- Leg 4: (answer) − 2.75 = **3.25**",
    ]),
    ("step", "(ID#9) Using the given rubric (accuracy, complete solutions, and teamwork), "
             "teams reflect on their performance."),
    ("meet", "Meeting 7 (C9, M1): PT1.1 Scaffolding#3"),
    ("step", "(ID#6) The students will accomplish PT1.1 Scaffolding#3 – Final Budget "
             "Computations:",
     ["Compute the totals, the percentage of the budget for each category, the discounts, "
      "and the 12% VAT.",
      "Compute the cost per beneficiary (e.g., ₱4 500 for 36 kits = ₱125 per kit).",
      "Check that the total expenses and the contingency reserve do not exceed the available "
      "funds."]),
    ("step", "(ID#9) Using the PT1.1 rubric, groups check the accuracy of every computation "
             "before uploading."),
    ("h", "VALUING STATEMENT: (ID#8)"),
    ("q", "Accurate computation is a form of honesty. When we handle money for others, every "
          "centavo matters. Checking our work carefully shows that we take our "
          "responsibility seriously."),
    ("h", "EXIT TICKET: (ID#9)"),
    ("bul", ["Compute 1.5 × 2/3 in two ways: using fractions and using decimals. Which was "
             "easier?",
             "How many ⅓-cup servings are in 2½ cups of juice? (7½)"]),
    ("res", ["LSGH Math 7 SimBook - Lesson 8 (https://claude.ai/artifact/LrpohtVMd8ifUt7nkd7FFr#lesson8)",
             "SimBook Exercises 8 – Part A as seatwork; Parts B and C as homework",
             "Teacher’s Google presentation - Lesson 8: Operations on Rational Numbers",
             "Fraction tiles and recipe cards", R360,
             "Teacher-prepared PT1.1 Guidelines and Rubric",
             "Uploaded students’ SA1.3 Rational Relay output in Ranger360"]),
]

LESSON_I = [
    ("sep",),
    ("cycle", "CYCLE 9, Meetings 2 to 5"),
    ("lesson", "LESSON 9: I. Square Roots, Cube Roots, and Irrational Numbers"),
    ("h", "SHORT RECAP OF PREVIOUS LESSON: (ID#2)"),
    ("q", "What is 3/4 ÷ 3/8? Why is it bigger than 3/4?"),
    ("h", "INTRODUCTION:"),
    ("q", "Here is our Big Question for Unit C: can a square tile have an area of exactly "
          "2 square units? To answer it, we need square roots – and we will discover a new "
          "kind of number that cannot be written as a fraction at all."),
    ("h", "OBJECTIVES: (ID#1)"),
    ("obj", ["Determine the square roots of perfect squares and the cube roots of perfect "
             "cubes.",
             "Identify irrational numbers involving square roots and cube roots, and their "
             "locations on the number line.",
             "Estimate a square root or cube root between two consecutive whole numbers."],
     ["ZS"]),
    ("h", "ACTIVITIES:"),
    ("meet", "Meeting 1 (C9, M2): Build the Square"),
    ("step", "(ID#2) ^^HOOK:^^ “Build the Square” – Using square tiles, students find which "
             "numbers from 1 to 30 can form a complete square (1, 4, 9, 16, 25). Using unit "
             "cubes, which numbers can form a complete cube? (1, 8, 27)"),
    ("sim", {'kind': 'SIM HOOK', 'title': 'Roots Lab – Square Builder and Cube Builder', 'tool': 'LSGH Math 7 SimBook · Lesson 9 · Roots Lab (Square Builder and Cube Builder tab)', 'link': 'https://claude.ai/artifact/LrpohtVMd8ifUt7nkd7FFr#lesson9', 'setup': 'Pairs, one device; record findings in the notebook', 'mission': ['Square Builder: slide from 1 to 100 tiles and list every perfect square.', 'Cube Builder: build cubes with edges 1 to 5 and list the perfect cubes.'], 'questions': ['Which numbers of tiles make a complete square?'], 'discovery': 'Perfect squares and cubes are whole numbers multiplied by themselves two or three times; the side or edge is the root.'}),
    ("step", "(ID#3) The teacher will discuss perfect squares, perfect cubes, square roots, "
             "and cube roots."),
    ("ex", "Key Ideas", [
        "- √49 = 7 because 7 × 7 = 49. ∛64 = 4 because 4 × 4 × 4 = 64.",
        "- Perfect squares: 1, 4, 9, 16, 25, 36, 49, 64, 81, 100, 121, 144, 169, 196, 225",
        "- Perfect cubes: 1, 8, 27, 64, 125, 216, 343, 512, 729, 1 000",
    ]),
    ("step", "(ID#5) “Perfect Square Bingo” – The teacher calls out roots; students mark the "
             "matching perfect squares and cubes."),
    ("meet", "Meeting 2 (C9, M3): Roots in Context"),
    ("step", "(ID#4) The teacher will discuss more square roots and cube roots, including "
             "fractions and decimals."),
    ("ex", "Worked Examples", [
        "- √144 = **12**; √400 = **20**; ∛1 000 = **10**",
        "- √(9/25) = **3/5**; √0.36 = **0.6**; ∛(8/27) = **2/3**",
        "- A square garden has an area of 81 m² → each side is **9 m**.",
        "- A cube-shaped box has a volume of 216 cm³ → each edge is **6 cm**.",
    ]),
    ("meet", "Meeting 3 (C9, M4): Root Locator"),
    ("step", "(ID#3) The teacher will discuss irrational numbers."),
    ("ex", "Key Ideas and Examples", [
        "- An **irrational number** cannot be written as a fraction; its decimal never ends "
        "and never repeats. Examples: √2, √10, ∛20, π.",
        "- √10 is between √9 = 3 and √16 = 4, closer to 3 (≈ 3.16).",
        "- ∛20 is between ∛8 = 2 and ∛27 = 3 (≈ 2.71).",
        "- √50 is between 7 and 8 (≈ 7.07).",
        "- **Big Question:** yes! A square with an area of 2 square units has sides of √2 ≈ "
        "1.414 units. Draw it on dot paper using the diagonals of four 1 × 1 squares: the "
        "tilted square takes up half of a 2 × 2 square.",
    ]),
    ("sim", {'kind': 'SIM HOOK', 'title': 'Roots Lab – Root Estimator and Square of Area 2', 'tool': 'LSGH Math 7 SimBook · Lesson 9 · Roots Lab (Root Estimator and Square of Area 2 tab)', 'link': 'https://claude.ai/artifact/LrpohtVMd8ifUt7nkd7FFr#lesson9', 'setup': 'Pairs, one device; record findings in the notebook', 'mission': ['Root Estimator: estimate √10 and ∛20 to two decimal places with as few guesses as possible.', 'Square of Area 2: explain why the tilted square has an area of 2, then show more digits of √2.'], 'questions': ['Do the digits of √2 ever end or repeat?'], 'discovery': 'Roots that are not whole numbers lie between two whole numbers; √2 is irrational – its decimal never ends and never repeats.'}),
    ("step", "(ID#6) The students will accomplish LW1.5 Root Locator: estimate and plot √2, "
             "√5, √10, ∛20, and √50 on a number line, then check with a calculator."),
    ("step", "(ID#9) Using the given rubric and sample output, the students reflect on their "
             "work, checking for completeness and accuracy."),
    ("meet", "Meeting 4 (C9, M5): Rational or Irrational?"),
    ("step", "(ID#5, ID#7) “Rational or Irrational?” sorting game – Groups sort and justify:",
     ["Rational: √16 (= 4), 0.333…, ∛27 (= 3), √(1/4) (= ½), 1.414 (a terminating decimal)",
      "Irrational: √15, π, ∛9",
      "Trap: 1.414 is rational – it is only an approximation of √2!"]),
    ("step", "The teacher will remind the students of their upcoming QZ1.3 next meeting.",
     ["Coverage: Lessons 7 to 9 – rational numbers, operations on rational numbers, and "
      "roots."]),
    ("h", "VALUING STATEMENT: (ID#8)"),
    ("q", "Some answers cannot be written exactly – like √2 – but we can estimate them "
          "closer and closer. Learning works the same way: we keep improving step by step. "
          "That is the growth mindset of a Lasallian learner."),
    ("h", "EXIT TICKET: (ID#9)"),
    ("bul", ["Between which two consecutive whole numbers is √30? (5 and 6)",
             "Is √36 rational or irrational? Explain."]),
    ("res", ["LSGH Math 7 SimBook - Lesson 9 (https://claude.ai/artifact/LrpohtVMd8ifUt7nkd7FFr#lesson9)",
             "SimBook Exercises 9 – Part A as seatwork; Parts B and C as homework",
             "Teacher’s Google presentation - Lesson 9: Square Roots, Cube Roots, and "
             "Irrational Numbers", "Square tiles, unit cubes, and dot paper",
             "Calculator and GeoGebra", R360,
             "Uploaded students’ LW1.5 Root Locator output in Ranger360"]),
]

QUIZ_3 = [
    ("sep",),
    ("cycle", "CYCLE 10, Meeting 1"),
    ("lesson", "QZ1.3 – Rational Numbers and Roots"),
    ("step", "(ID#9) The students will take QZ1.3, a 25-item quiz (multiple choice and "
             "constructed response). Before this, they will be allowed to review for 5 "
             "minutes.", ["Coverage: A12–A16, M10–M12, T4"]),
    ("pillar", ["SF"], ["Answering honestly and showing complete solutions reflect "
                        "integrity in one’s work."]),
    ("res", ["Teacher-made QZ1.3 in Ranger360"]),
]

STAGE_TUNE = (LESSON_D + LESSON_E + LESSON_F + QUIZ_2 + LESSON_G + LESSON_H + LESSON_I
              + QUIZ_3)

# ============================================================== RELEASE (Transfer)

PT_FINAL = [
    ("cycle", "CYCLE 10, Meetings 2 to 3"),
    ("lesson", "PT1.1 – Budget for a Cause: Financial Plan Pitch"),
    ("ts", "This is the moment your Finance Committee has prepared for. Today, you will "
           "present your plan to the panel. Remember: every number must tell a story, and "
           "every decision must be backed by mathematical evidence."),
    ("p", "__(Note: Please refer to the detailed G.R.A.S.P. description and rubric on top of "
          "this LG.)__"),
    ("p", "(ID#1) **Goal:** Present a realistic financial plan for a class outreach or "
          "fundraising activity that benefits a partner community, using percentages, rates, "
          "and operations on rational numbers."),
    ("step", "(ID#2) Scaffolding#1 – Goals and Draft Budget was completed in C5, M5."),
    ("step", "(ID#3) Scaffolding#2 – Price Canvass and Unit-Rate Comparison was completed in "
             "C6, M4."),
    ("step", "(ID#4, ID#5) Scaffolding#3 – Final Budget Computations was completed in "
             "C9, M1."),
    ("step", "(ID#6, ID#7) “Shark Tank”-style pitch – Each group presents its financial plan "
             "in 5 minutes, followed by 2 minutes of questions from the panel and classmates.",
     ["Show the goal and beneficiaries, the projected income, the expense list with unit-rate "
      "comparisons, the discounts and VAT, the contingency reserve, and the allocation "
      "summary.",
      "Classmates give feedback using a peer-feedback slip (one strength, one question, one "
      "suggestion)."]),
    ("step", "(ID#8) Reflection: “How does wise budgeting help me serve others?” Each student "
             "writes 3 to 5 sentences in Ranger360."),
    ("step", "(ID#9) Using the given rubric, each group reflects on its work and output, "
             "checking for accuracy and completeness."),
    ("pillar", ["CM", "ZS", "SF"], [
        "The group pitch requires listening, dialogue, and respect for different ideas – "
        "building trust and confidence among peers.",
        "Accurate computations and realistic planning reflect excellence and accountability "
        "in decision-making.",
        "Planning for the needs of a partner community lives out Lasallian faith and values "
        "through responsible stewardship.",
    ]),
    ("res", ["Teacher-prepared PT1.1 Guidelines and Rubric", "Google Sheets and Slides",
             "Peer-feedback slips",
             "Uploaded students’ PT1.1 output in Ranger360"]),
]

REVIEW = [
    ("sep",),
    ("cycle", "CYCLE 10, Meeting 4"),
    ("lesson", "Term Review: “Math Amazing Race”"),
    ("ts", "Before the Term Exam, let’s race through everything we have learned this term!"),
    ("step", "(ID#5, ID#7) Teams rotate through five review stations. Each team must answer "
             "correctly before moving on:",
     ["Station 1 – Polygons: find each interior angle of a regular pentagon (108°).",
      "Station 2 – Percentages: a ₱1 500 item is 20% off, plus 12% VAT (₱1 344).",
      "Station 3 – Rates: which is cheaper, 3 kg for ₱165 or 5 kg for ₱260? (5 kg at ₱52 "
      "per kg)",
      "Station 4 – Rational numbers: 2/3 + 0.25 (11/12)",
      "Station 5 – Roots: between which two whole numbers is ∛50? (3 and 4)"]),
    ("step", "(ID#9) Each student lists two topics to review further at home."),
    ("pillar", ["CM"]),
    ("res", ["Teacher-prepared review station cards", R360]),
]

TERM_EXAM = [
    ("sep",),
    ("cycle", "CYCLE 10, Meeting 5"),
    ("lesson", "TERM EXAM"),
    ("h", "(ID#1, ID#8) Goals/Objectives:"),
    ("bul", ["Draw, classify, and determine the angles of polygons.",
             "Solve problems involving percentages, financial planning, and rates.",
             "Describe, order, and perform operations on rational numbers.",
             "Determine square roots and cube roots, and identify irrational numbers."]),
    ("h", "(ID#2) Preparations"),
    ("p", "__The students will settle down, prepare their ruler, protractor, and calculator, "
          "and listen to the instructions.__"),
    ("h", "TE1.1 Term Exam"),
    ("step", "(ID#3, ID#4) Part I – Multiple Choice: concepts and skills from Units A, B, "
             "and C."),
    ("step", "(ID#5, ID#6) Part II – Constructed Response: drawing polygons, computing "
             "angles, and showing complete solutions."),
    ("step", "(ID#7, ID#9) Part III – Problem Solving: real-life problems involving "
             "percentages, rates, rational numbers, and roots.",
     ["__The students demonstrate higher-order reasoning and transfer of learning to "
      "real-life decisions.__"]),
    ("pillar", ["SF"], [
        "Answering the exam honestly and independently reflects integrity.",
        "Solving real-life problems calls for ethical and responsible decision-making."]),
    ("res", ["Teacher-made TE1.1"]),
    ("sep",),
    ("cycle", "CYCLE 11 (Buffer)"),
    ("p", "Cycle 11 is reserved for make-up assessments for excused absences, remediation "
          "and enrichment, and adjustments for class suspensions and school activities."),
]

STAGE_RELEASE = PT_FINAL + REVIEW + TERM_EXAM

STAGES = [
    {"name": "DRAW", "desc": "Acquisition\n(Factual or Procedural Knowledge)",
     "blocks": STAGE_DRAW},
    {"name": "TUNE", "desc": "Make-Meaning\n(Understanding, Processing)",
     "blocks": STAGE_TUNE},
    {"name": "RELEASE", "desc": "Transfer\n(to Real-world applications or new situations as "
                                "evidence of their learning)", "blocks": STAGE_RELEASE},
]

SIGNATORIES = [
    {"label": "Prepared by:", "names": ["[Name of Teacher]", "[Name of Teacher]"],
     "role": "Grade 7 Mathematics Teacher"},
    {"label": "Approved by:", "names": ["[Name of Subject Coordinator]"],
     "role": "Mathematics Subject Coordinator"},
]
