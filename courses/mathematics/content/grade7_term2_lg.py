"""Grade 7 Mathematics – Learning Guide, 2nd Trimester, SY 2026-2027.

Companion to content/grade7_term2_cm.py (same codes, meetings, and assessments).
Source of truth: DepEd MATATAG Mathematics CG, Grade 7 Quarter 2 items 3–12 and
Quarter 3 items 1–8, as sequenced in the DepEd Three-Term Budget of Work (Second Term).
ID# tags follow the Term 1 LG (see its docstring).
"""

import importlib.util
from pathlib import Path


def _load(name):
    spec = importlib.util.spec_from_file_location(name, Path(__file__).with_name(f"{name}.py"))
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod


_t1 = _load("grade7_term1_lg")
_cm = _load("grade7_term2_cm")
SIMBOOK = _cm.SIMBOOK
R360 = "Materials uploaded in Ranger360"

HEADER = {"lines": ["LA SALLE GREEN HILLS", "Mathematics Department (Grade 7)", "2nd Trimester, SY 2026-2027"], "title": "LEARNING GUIDE"}

OVERVIEW = [
    "Grade 7 Mathematics in the second trimester moves from numbers to the world they measure. In **Measure Up!**, "
    "learners convert units within the metric system and across systems, and find the volume of cylinders and "
    "pyramids. In **Set It Up!**, they describe sets with Venn diagrams and map the family of real numbers. In "
    "**Data Detectives!**, they collect data from fair samples, organize it in frequency tables, and choose and "
    "interpret graphs. In **Integer World!**, they meet the negative numbers and learn to compare and order integers.",
    "For their end-of-term performance task, **Hydration Station**, learners act as student health researchers: they "
    "survey a fair sample of learners about their daily water intake, organize and graph the data, and design a "
    "cylindrical refill tank sized to the class’s needs – using sampling, statistics, volume, and unit conversion "
    "together.",
    "Each lesson opens with a short simulation from the **LSGH Math 7 SimBook** as its hook. The lesson itself is "
    "taught in the usual way – the teacher’s discussion, definitions, and step-by-step worked examples, presented on "
    "the SimBook’s lesson slides with speaker notes – and practiced through the SimBook’s Check Yourself items and its "
    "Exercises (Part A Skills Practice, Part B Problem Solving, Part C Challenge).",
]

OUTCOMES = [("Math.G7.2", "Measure and compare quantities and volumes across units, organize numbers and data with "
                          "sets, tables, and graphs, and use integers to describe and compare real-life quantities.")]

POLICIES = _t1.POLICIES

ASSESSMENT = [
    {"component": "Written Works (WW)", "weight": "20%", "groups": [
        ("CP - Participation – seatwork, recitation (40%)", [
            "CP2.1 - Recitation every meeting", "CP2.2 - Practice Set #1: Conversions (C2, M4)", "CP2.3 - Practice Set #2: Sets (C5, M5)",
            "CP2.4 - Practice Set #3: Graphs (C8, M2)", "CP2.5 - Practice Set #4: Integers (C10, M2)"]),
        ("QZ - Quizzes (60%)", ["QZ2.1 - Units of Measure and Volume (C4, M5)", "QZ2.2 - Sets, Real Numbers, and Sampling (C7, M1)",
                                "QZ2.3 - Organizing and Graphing Data (C8, M5)"])]},
    {"component": "Performance Task (PT)", "weight": "60%", "groups": [
        ("LW - Guided Hands-on Activities (30%)", ["LW2.1 - Metric Measuring Lab (C2, M2)", "LW2.2 - Can Lab (C3, M3)", "LW2.3 - Pyramid Model (C4, M2)",
                                                   "LW2.4 - Venn Survey (C5, M3)", "LW2.5 - Real Number Sort (C6, M2)", "LW2.6 - Class Data FDT (C7, M4)",
                                                   "LW2.7 - Integer Walk (C9, M3)"]),
        ("SA - Challenge Hands-on Activities (40%)", ["SA2.1 - Unit Detective (C2, M5)", "SA2.2 - Packaging Challenge (C4, M4)", "SA2.4 - Graph Makeover (C8, M3)"]),
        ("PT – End of Term PT (30%)", ["PT2.1 - Hydration Station Report", "Scaffolding#1 - Survey Plan and Sampling Method (C6, M5)",
                                       "Scaffolding#2 - Data Tables and Graphs (C8, M4)", "Scaffolding#3 - Tank Design and Conversions (C9, M4)",
                                       "Final Report (C10, M3)"])]},
    {"component": "Final Exam", "weight": "20%", "groups": [("TE – Term Exam (100%) (C10, M5)", [])]},
]


def _std(block):
    body = [("lead", block["lead"]), ("bul", block["items"])] if "items" in block and not block.get("numbered") else None
    return body


STANDARDS = [
    {"label": "CONTENT STANDARD", "body": [("lead", _cm.STANDARDS[0]["lead"]), ("bul", _cm.STANDARDS[0]["items"])]},
    {"label": "PERFORMANCE STANDARD", "body": [("lead", _cm.STANDARDS[1]["lead"]), ("bul", _cm.STANDARDS[1]["items"])] + _t1.STANDARDS[1]["body"][2:]},
    {"label": "ENDURING UNDERSTANDING", "body": [("lead", _cm.STANDARDS[3]["lead"]), ("num", _cm.STANDARDS[3]["items"])]},
    {"label": "ESSENTIAL QUESTIONS", "body": [("lead", _cm.STANDARDS[2]["lead"]), ("num", _cm.STANDARDS[2]["items"])]},
    {"label": "TRANSFER GOAL", "body": [("p", _cm.STANDARDS[4]["text"])]},
    {"label": "PERFORMANCE TASK", "body": [
        ("center", "PT2.1 Hydration Station –"), ("center", "G.R.A.S.P. Performance Task"),
        ("h", "G – Goal"),
        ("p", "Your goal is to find out how much water Grade 7 learners drink in a day and to design a cylindrical "
              "refill tank that can supply your class for one school day."),
        ("h", "R – Role"),
        ("p", "You are a team of student health researchers working with the school clinic."),
        ("h", "A – Audience"), ("lead", "Your primary audience includes:"),
        ("bul", ["The school nurse and the class adviser", "Your classmates", "The school facilities office, who would build the station"]),
        ("h", "S – Situation"),
        ("p", "The clinic wants data, not guesses. Your team must survey a fairly chosen sample of learners, organize "
              "the results, and use them to size a refill tank. Survey answers may come in glasses, millilitres, or "
              "litres, and tank sizes are measured in centimetres – so units must be converted carefully."),
        ("h", "P – Product / Performance"), ("lead", "You will create:"),
        ("p", "A **Hydration Station Report** (poster or slides) and a **3-minute presentation** that includes:"),
        ("bul", ["Your survey question, sampling technique, and sample size, with reasons",
                 "A frequency distribution table of daily water intake",
                 "Two appropriate graphs with an interpretation of each",
                 "A cylindrical tank design (radius and height) with its volume in cm³ and in litres",
                 "Recommendations supported by your data"]),
        ("h", "S – Success Criteria / Standards"), ("lead", "Your work will be assessed based on:"),
        ("bul", [("Sampling and Data Collection", ["A fair sampling technique, a clear survey question, and an adequate sample. (10 points)"]),
                 ("Frequency Distribution Table", ["Correct classes, tallies, and frequencies. (10 points)"]),
                 ("Graphs and Interpretation", ["Appropriate, accurate graphs with correct conclusions. (10 points)"]),
                 ("Volume and Unit Conversion", ["Correct cylinder volume and conversion to litres; the tank meets the class’s need. (15 points)"]),
                 ("Recommendations and Presentation", ["Evidence-based, clear, and respectful. (5 points)"])]),
        ("p", "**Total: 50 points**"),
    ]},
]

UNITS = [
    {"title": "Unit D · MEASURE UP! Units of Measure and Volume", "lessons": [
        ("A. Converting Units of Measure", ["Metric prefixes; length, mass, and capacity", "Converting between the metric and English systems"]),
        ("B. Volume of a Cylinder", ["From the area of a circle to V = πr²h", "Problems involving cylinders"]),
        ("C. Volume of Square and Rectangular Pyramids", ["V = ⅓Bh", "Estimating and solving problems"])]},
    {"title": "Unit E · SET IT UP! Sets and the Real Numbers", "lessons": [
        ("D. Sets, Subsets, Union, and Intersection", ["Notation, subsets, and Venn diagrams"]),
        ("E. Subsets of Real Numbers", ["Natural, whole, integer, rational, irrational, and real numbers"])]},
    {"title": "Unit F · DATA DETECTIVES! Sampling, Tables, and Graphs", "lessons": [
        ("F. Data Collection and Sampling Techniques", ["Survey, interview, observation, experiment, records", "Random, systematic, stratified, convenience"]),
        ("G. Organizing and Graphing Data", ["Frequency distribution tables", "Pie, bar, and line graphs; stem-and-leaf plots"])]},
    {"title": "Unit G · INTEGER WORLD! The Set of Integers", "lessons": [
        ("H. The Set of Integers", ["Positive and negative integers, zero, and opposites"]),
        ("I. Comparing and Ordering Integers", ["The number line; < and >"])]},
    {"title": "End-of-Term Performance Task: Hydration Station", "lessons": [
        ("Scaffolding#1:", ["Survey plan and sampling method"]), ("Scaffolding#2:", ["Data tables and graphs"]),
        ("Scaffolding#3:", ["Tank design and conversions"]), ("Final Report:", ["Presentation to the panel"])]},
]

MARK = []
for r in _cm.ROWS:
    for c in r.get("comps", []):
        if isinstance(c, tuple):
            MARK.append((f"{c[0]}.", c[2] + (" ★" if c[1] else "")))


# ------------------------------------------------------------------ helpers

def card(n_global, n_term, sim, tab, mission, questions, discovery, setup="Pairs, one device; record findings in the notebook"):
    return ("sim", {"kind": "SIM HOOK", "title": f"{sim} – {tab}",
                    "tool": f"LSGH Math 7 SimBook · Term 2 Lesson {n_term} · {sim} ({tab} tab)",
                    "link": f"{SIMBOOK}#lesson{n_global}", "setup": setup, "mission": mission,
                    "questions": questions, "discovery": discovery})


def lesson(cycle, title, intro, objectives, pillars, body, valuing, exit_ticket, synthesis, res, recap=None, sep=True):
    blocks = [("sep",)] if sep else []
    blocks += [("cycle", cycle), ("lesson", title)]
    if recap:
        blocks += [("h", "SHORT RECAP OF PREVIOUS LESSON: (ID#2)"), ("q", recap)]
    blocks += [("h", "INTRODUCTION:"), ("q", intro), ("h", "OBJECTIVES: (ID#1)"), ("obj", objectives, pillars), ("h", "ACTIVITIES:")]
    blocks += body
    blocks += [("h", "VALUING STATEMENT: (ID#8)"), ("q", valuing), ("h", "EXIT TICKET: (ID#9)"), ("bul", exit_ticket),
               ("h", "SYNTHESIS:"), ("q", synthesis), ("res", res)]
    return blocks


def quiz(cycle, code, title, coverage, items=25, sep=True):
    return ([("sep",)] if sep else []) + [
        ("cycle", cycle), ("lesson", f"{code} – {title}"),
        ("step", f"(ID#9) The students will take {code}, a {items}-item quiz (multiple choice and constructed response). "
                 "Before this, they will be allowed to review for 5 minutes.", [f"Coverage: {coverage}"]),
        ("pillar", ["SF"], ["Answering honestly and showing complete solutions reflect integrity in one’s work."]),
        ("res", [f"Teacher-made {code} in Ranger360"])]


def res(n_term, n_global, title, extra):
    return [f"LSGH Math 7 SimBook - Term 2 Lesson {n_term} ({SIMBOOK}#lesson{n_global})",
            f"SimBook Lesson {n_term} slides with speaker notes (use Present for the projector)",
            f"SimBook Exercises {n_term} – Part A as seatwork; Parts B and C as homework",
            f"Teacher’s Google presentation - Lesson {n_term}: {title}", *extra, R360]


# ------------------------------------------------------------------ DRAW

ORIENTATION = [
    ("cycle", "CYCLE 1, Meeting 1"), ("lesson", "LESSON: Class Orientation – “Math Is Measured!”"),
    ("h", "INTRODUCTION:"),
    ("q", "Welcome back! Last term we worked with shapes, money, and numbers. This term we measure the world – "
          "lengths, masses, and the space inside containers – and we become data detectives who learn the truth "
          "about a group from a small, fair sample."),
    ("h", "OBJECTIVES: (ID#1)"),
    ("obj", ["Review the Term 2 course outline and roadmap.", "Describe the learning outcomes, grading components, and their percentage weights.",
             "Explain classroom policies, attendance requirements, and academic integrity guidelines."], ["ZS", "SF"]),
    ("h", "ACTIVITIES:"),
    ("step", "(ID#2) ^^HOOK:^^ “Guess the Measure” – groups estimate the length of the classroom, the mass of a textbook, "
             "and the amount of water in a jug, then check with real tools."),
    ("step", "(ID#3) The teacher will discuss the Term 2 roadmap: Units D to G and the performance task “Hydration Station.”"),
    ("step", "(ID#4) The teacher will discuss the methods of assessment and their weights."),
    ("step", "(ID#5) The teacher will review classroom procedures and the Mathematics Department policies."),
    ("h", "WRAP UP ACTIVITY: “Term 1 to Term 2” One-minute Reflection (ID#6)"),
    ("bul", ["One skill from Term 1 I am proud of is ____.", "One thing I want to improve this term is ____."]),
    ("h", "VALUING STATEMENT: (ID#8)"),
    ("q", "Accurate measurement and honest data are acts of integrity. This term, let us measure carefully and report truthfully."),
    ("res", ["Teacher’s Google presentation - Class Orientation", "Student Handbook", R360]),
]

L_A = lesson(
    "CYCLE 1, Meetings 2 to 5, and CYCLE 2, Meetings 1 to 5", "LESSON 1: A. Converting Units of Measure",
    "Road signs show kilometres, recipes use grams and cups, and some products still use inches and pounds. To compare "
    "measurements, we must convert them to the same unit. Today we learn the metric staircase and the conversion "
    "factors between systems.",
    ["Convert units of measure within the International System of Units (SI) and across different systems of measure.",
     "Decide whether to multiply or divide when converting, and check that the answer makes sense.",
     "Use conversions to compare real measurements from different sources."], ["ZS"],
    [("meet", "Meetings 1–2 (C1, M2–M3): The Metric Staircase"),
     ("step", "(ID#2) ^^HOOK:^^ “Fun Run Mystery” – Is a 5-km fun run longer than a 3-mile run? Learners vote."),
     card(10, 1, "Unit Ladder", "Metric Staircase",
          ["Start at 2.5 km and roll the ball down to m, cm, and mm.", "Switch to mass and capacity and repeat."],
          ["Which way does the decimal point move when the unit gets smaller?"],
          "Each step down multiplies by 10 (the decimal point moves right); each step up divides by 10."),
     ("step", "(ID#3) The teacher will discuss the SI base units and prefixes (kilo to milli) and the rule for converting within the metric system."),
     ("ex", "Worked Examples", ["- 2.5 km → m: 3 steps down, × 1 000 = **2 500 m**", "- 350 cm → m: 2 steps up, ÷ 100 = **3.5 m**",
                                "- 4.2 kg → g: × 1 000 = **4 200 g**", "- 750 mL → L: ÷ 1 000 = **0.75 L**"]),
     ("step", "(ID#5) Board drill: learners convert measurements called out by the teacher (CP2.1 – Recitation)."),
     ("meet", "Meetings 3–4 (C1, M4–M5): Measuring and Converting"),
     ("step", "(ID#6) The students will accomplish LW2.1 Metric Measuring Lab (C2, M2 is the submission): measure the length of the room in metres, "
              "a book in centimetres, a coin in millimetres, and a water bottle in millilitres, then convert each to two other units."),
     ("step", "(ID#9) Using the rubric, groups check their measurements and conversions before submitting."),
     ("meet", "Meetings 5–7 (C2, M1–M3): Across Systems"),
     card(10, 1, "Unit Ladder", "Across Systems",
          ["Slide along the inches ruler and read the centimetres.", "Find 20 lb in kilograms and 3 mi in kilometres."],
          ["Is the answer bigger or smaller than the starting number? Why?"],
          "Across systems, multiply or divide by a conversion factor such as 1 in = 2.54 cm or 1 mi ≈ 1.609 km."),
     ("step", "(ID#4) The teacher will discuss English units and conversion factors (inch, foot, mile, pound, gallon)."),
     ("ex", "Worked Examples", ["- 12 in × 2.54 = **30.48 cm**", "- 3 mi × 1.609 = **4.827 km**, so a 5-km run is longer",
                                "- 5 ft 2 in = 62 in → 62 × 2.54 = **157.48 cm**"]),
     ("meet", "Meeting 8 (C2, M4): Practice Set #1"),
     ("step", "(ID#5) The students will answer CP2.2 – Practice Set #1 (SimBook Exercises 1, Part A, may be used)."),
     ("meet", "Meeting 9 (C2, M5): Unit Detective"),
     ("step", "(ID#6, ID#7) The students will accomplish SA2.1 Unit Detective: compare product labels and road signs written in different units "
              "and decide which is bigger, longer, or heavier, showing every conversion."),
     ("step", "(ID#9) Using the rubric, the students reflect on their work, checking for completeness and accuracy.")],
    "Measurements are promises: a seller who labels 1 kg must give 1 kg. Converting carefully and honestly protects "
    "everyone who relies on our numbers.",
    ["Convert 0.45 km to metres. (450 m)", "Which is heavier: 2 lb or 1 kg? (1 kg ≈ 2.2 lb, so 1 kg)"],
    "We learned to move up and down the metric staircase and to cross between systems using conversion factors. Next, "
    "we use measurement to find how much a cylinder holds.",
    res(1, 10, "Converting Units of Measure", ["Meter sticks, tape measures, kitchen scale, measuring cups", "Product labels and road-sign photos"]),
    sep=True)

L_B = lesson(
    "CYCLE 3, Meetings 1 to 4", "LESSON 2: B. Volume of a Cylinder",
    "Cans, water tanks, and drinking glasses are cylinders. How do we know how much they hold? Today we build the "
    "volume formula from something we already know – the area of a circle.",
    ["Explain inductively the volume of a cylinder using the area of a circle, leading to the identification of the formula.",
     "Find the volume of a cylinder.", "Solve problems involving the volumes of cylinders.",
     "Explain how changing the radius or the height changes the volume."], ["ZS"],
    [("meet", "Meeting 1 (C3, M1): Stacking Circles"),
     ("step", "(ID#2) ^^HOOK:^^ “Which Can Holds More?” – a tall, thin can or a short, wide one? Learners predict."),
     card(11, 2, "Cylinder Lab", "Stack the Circles",
          ["Keep r = 3 cm and raise the height from 1 to 5 cm.", "Keep the height and double the radius from 2 to 4 cm."],
          ["How does the volume change in each case?"],
          "A cylinder is a stack of circles: V = (area of base) × height = πr²h. Doubling the radius makes the volume 4 times as big."),
     ("step", "(ID#3) The teacher will discuss the parts of a cylinder and derive V = πr²h from the coin-stack model (π ≈ 3.14)."),
     ("ex", "Worked Examples", ["- r = 3 cm, h = 5 cm: 3.14 × 9 × 5 = **141.3 cm³**", "- d = 10 cm, h = 8 cm: r = 5; 3.14 × 25 × 8 = **628 cm³**"]),
     ("meet", "Meeting 2 (C3, M2): Problems with Cylinders"),
     ("step", "(ID#4) The teacher will discuss problems involving tanks and glasses, including 1 cm³ = 1 mL and 1 m³ = 1 000 L."),
     ("ex", "Worked Example", ["A tank has r = 1 m and h = 2 m: V = 3.14 × 1 × 2 = 6.28 m³ = **6 280 L**"]),
     ("meet", "Meeting 3 (C3, M3): Can Lab"),
     ("step", "(ID#6) The students will accomplish LW2.2 Can Lab: measure the radius and height of three real cans, compute each volume, "
              "then check by filling with water and reading the measuring cup."),
     ("step", "(ID#9) Groups explain any difference between the computed and measured volumes."),
     ("meet", "Meeting 4 (C3, M4): Which Holds More?"),
     card(11, 2, "Cylinder Lab", "Which Holds More?", ["Predict, then pour, for all three pairs of containers."], ["Why can a shorter cylinder hold more?"],
          "Because the radius is squared, a wider cylinder can hold more even when it is shorter."),
     ("step", "(ID#5) Learners answer SimBook Exercises 2, Part A, as seatwork.")],
    "Knowing how much a tank holds helps a community plan its water. Careful computation is a way of caring for others.",
    ["Find the volume of a cylinder with r = 2 cm and h = 10 cm. (125.6 cm³)", "If the height doubles, what happens to the volume? (It doubles.)"],
    "We built the formula V = πr²h by stacking circles, and used it to solve problems about cans and tanks. Next, we "
    "compare pyramids with prisms.",
    res(2, 11, "Volume of a Cylinder", ["Empty cans, rulers, measuring cups, water"]))

L_C = lesson(
    "CYCLE 3, Meeting 5, and CYCLE 4, Meetings 1 to 4", "LESSON 3: C. Volume of Square and Rectangular Pyramids",
    "A pyramid and a box can have the same base and the same height. How do their volumes compare? Today we find out "
    "by pouring – and discover the formula for the volume of a pyramid.",
    ["Explore inductively the volume of square and rectangular pyramids using rectangular prisms, leading to the identification of the formula.",
     "Estimate volumes of square and rectangular pyramids.", "Solve problems involving volumes of square or rectangular pyramids.",
     "Explain why the volume of a pyramid is one-third of the prism with the same base and height."], ["ZS", "CM"],
    [("meet", "Meeting 1 (C3, M5): Pour Three Times"),
     ("step", "(ID#2) ^^HOOK:^^ “Sand Pour” – the teacher fills a pyramid with rice and asks: how many pours fill the box?"),
     card(12, 3, "Pyramid Lab", "Pour Three Times", ["Pour until the prism is full.", "Change the base and height and repeat."],
          ["Is it always the same number of pours?"], "Three pyramids fill a prism with the same base and height, so V = ⅓Bh."),
     ("step", "(ID#3) The teacher will discuss the parts of a pyramid and the formula V = ⅓Bh for square and rectangular bases."),
     ("ex", "Worked Examples", ["- Square pyramid, s = 6 cm, h = 9 cm: ⅓ × 36 × 9 = **108 cm³**", "- Rectangular pyramid, 8 cm × 5 cm, h = 12 cm: ⅓ × 40 × 12 = **160 cm³**"]),
     ("meet", "Meetings 2–3 (C4, M1–M2): Estimating and the Pyramid Model"),
     card(12, 3, "Pyramid Lab", "Estimate", ["Estimate three pyramids within 15%."], ["What box would you picture first?"],
          "Picture the box around the pyramid, then take one-third of its volume."),
     ("step", "(ID#6) The students will accomplish LW2.3 Pyramid Model (C4, M2): build a paper pyramid and a paper prism with the same base and height and test with rice."),
     ("meet", "Meetings 3–4 (C4, M3–M4): Problems and the Packaging Challenge"),
     ("step", "(ID#4) The teacher will discuss problems involving tents, paperweights, and finding a missing height."),
     ("ex", "Worked Example", ["A square pyramid has V = 96 cm³ and s = 6 cm: 96 = ⅓ × 36 × h = 12h, so **h = 8 cm**"]),
     ("step", "(ID#6, ID#7) The students will accomplish SA2.2 Packaging Challenge: design a pyramid-shaped gift box that holds 200 cm³ of candy, "
              "choosing whole-number dimensions and showing the computations."),
     ("step", "The teacher will remind the students of QZ2.1 next meeting (Lessons 1 to 3).")],
    "A pyramid is one-third of its box – small parts working together make a whole. In our groups, each member’s part "
    "matters to the final result.",
    ["Find the volume of a square pyramid with s = 4 cm and h = 6 cm. (32 cm³)", "A prism holds 150 cm³. What does a pyramid with the same base and height hold? (50 cm³)"],
    "We discovered that V = ⅓Bh by pouring, and used it to estimate and solve problems. Next, we review Unit D in QZ2.1.",
    res(3, 12, "Volume of Pyramids", ["Cardboard nets, rice or sand"]))

QZ1 = quiz("CYCLE 4, Meeting 5", "QZ2.1", "Units of Measure and Volume", "A1–A7, M1–M3, T1")

# ------------------------------------------------------------------ TUNE

L_D = lesson(
    "CYCLE 5, Meetings 1 to 5", "LESSON 4: D. Sets, Subsets, Union, and Intersection",
    "Who likes basketball, who likes volleyball, and who likes both? Sets and Venn diagrams let us organize groups and "
    "see exactly what they share.",
    ["Describe sets and their subsets, the union of sets, and the intersection of sets",
     "Illustrate sets and their subsets, the union of sets, and the intersection of sets, through the use of Venn diagrams.",
     "Use Venn diagrams to solve counting problems from surveys."], ["CM"],
    [("meet", "Meeting 1 (C5, M1): Sets and Elements"),
     ("step", "(ID#2) ^^HOOK:^^ “Stand in the Circle” – two rope circles on the floor: stand in the circle(s) of the sports you like."),
     card(13, 4, "Venn Lab", "Venn Lab", ["Sort 1 to 20 for A = even numbers and B = multiples of 3.", "Try A = multiples of 4 and B = even numbers."],
          ["Which numbers land in the middle?", "What happens to circle A in the second case?"],
          "A ∪ B holds everything in A or B; A ∩ B holds only what is in both. If all of A is in B, then A ⊆ B."),
     ("step", "(ID#3) The teacher will discuss sets, elements, roster and rule notation, the empty set, and the universal set."),
     ("meet", "Meeting 2 (C5, M2): Subsets, Union, Intersection, Complement"),
     ("step", "(ID#4) The teacher will discuss subsets, union, intersection, complement, and disjoint sets."),
     ("ex", "Worked Example", ["U = {1, …, 10}, A = {2, 4, 6, 8, 10}, B = {1, 2, 3, 4, 5}",
                               "- A ∪ B = {1, 2, 3, 4, 5, 6, 8, 10}; A ∩ B = {2, 4}; A′ = {1, 3, 5, 7, 9}",
                               "- n(A ∪ B) = n(A) + n(B) − n(A ∩ B) = 5 + 5 − 2 = **8**"]),
     ("meet", "Meeting 3 (C5, M3): Venn Survey"),
     ("step", "(ID#6) The students will accomplish LW2.4 Venn Survey: survey the class on two preferences, draw the Venn diagram, and write A ∪ B and A ∩ B."),
     ("meet", "Meeting 4 (C5, M4): Survey Problems"),
     ("ex", "Worked Example", ["Of 40 learners, 25 like basketball, 20 like volleyball, and 10 like both.",
                               "- Only basketball: **15**; only volleyball: **10**; either: **35**; neither: **5**"]),
     ("step", "(ID#5) Groups solve three survey problems using Venn diagrams."),
     ("meet", "Meeting 5 (C5, M5): Practice Set #2"),
     ("step", "(ID#5) The students will answer CP2.3 – Practice Set #2 (SimBook Exercises 4, Part A).")],
    "A Venn diagram shows that groups can overlap. In our class, too, we share more than what divides us – the "
    "intersection is where community grows.",
    ["A = {1, 3, 5}, B = {3, 5, 7}. Find A ∩ B. ({3, 5})", "Is {a} a subset of {a, b}? (Yes)"],
    "We described sets and illustrated unions, intersections, and subsets with Venn diagrams. Next, we use sets to map "
    "the family of real numbers.",
    res(4, 13, "Sets, Subsets, Union, and Intersection", ["Two hula hoops or rope circles"]), sep=False)

L_E = lesson(
    "CYCLE 6, Meetings 1 to 2", "LESSON 5: E. Subsets of Real Numbers",
    "Natural, whole, integer, rational, irrational – numbers come in families that sit inside one another. Today we draw "
    "the family tree of the real numbers.",
    ["Illustrate the different subsets of real numbers.", "Justify the classification of a number into the subsets of the real numbers."], ["ZS"],
    [("step", "(ID#2) ^^HOOK:^^ “Number Family Tree” – where does each number live?"),
     card(14, 5, "Real Number Map", "Real Number Map", ["Drag every card into the smallest set it belongs to."],
          ["Why are √16 and −√9 not irrational?"], "ℕ ⊆ W ⊆ ℤ ⊆ ℚ ⊆ ℝ, and the irrational numbers complete the real numbers."),
     ("step", "(ID#3) The teacher will discuss the subsets of the real numbers and how they are nested."),
     ("ex", "Worked Example", ["- √16 = 4 → natural, whole, integer, rational, real", "- −3 → integer, rational, real", "- 0.25 = 1/4 → rational, real",
                               "- √2 → irrational, real"]),
     ("step", "(ID#6) The students will accomplish LW2.5 Real Number Sort (C6, M2): classify 20 number cards in a nested diagram and justify five of them.")],
    "Every number has a place in the real number family. In the same way, every learner has a place in our community.",
    ["Is 0 a natural number? (No – it is whole.)", "Name a number that is rational but not an integer. (e.g., 1/2)"],
    "We mapped the real numbers into nested subsets. Next, we turn from numbers to data.",
    res(5, 14, "Subsets of Real Numbers", ["Number cards"]))

L_F = lesson(
    "CYCLE 6, Meetings 3 to 5", "LESSON 6: F. Data Collection and Sampling Techniques",
    "We cannot ask all 400 learners every question. A well-chosen sample can tell us about everyone – but a careless one "
    "can mislead us. Today we learn how to collect data fairly.",
    ["Investigate different data collection and sampling techniques.", "Explain how the choice of sampling technique can make results fair or biased.",
     "Plan a fair survey for the PT2.1 Hydration Station Report."], ["ZS", "SF"],
    [("meet", "Meeting 1 (C6, M3): Ways to Collect Data"),
     ("step", "(ID#2) ^^HOOK:^^ “Ask the Gate” – does asking only the learners at the gate tell the truth about everyone?"),
     card(15, 6, "Sampling Lab", "Which Method?", ["Match each situation to a data collection method."], [], "Surveys, interviews, observations, experiments, and existing records each suit different questions."),
     ("step", "(ID#3) The teacher will discuss population, census, sample, and the five data collection methods."),
     ("meet", "Meeting 2 (C6, M4): Sampling Techniques"),
     card(15, 6, "Sampling Lab", "Sampling Lab", ["Take 10 random samples, then 10 convenience samples.", "Increase the sample size to 100."],
          ["Which method is biased?", "What happens to the spread of the estimates?"],
          "Random, systematic, and stratified samples are fair; convenience samples are biased. Larger samples are more reliable."),
     ("step", "(ID#4) The teacher will discuss random, systematic (k = N ÷ n), stratified, and convenience sampling."),
     ("ex", "Worked Examples", ["- 40 out of 400 systematically: k = 400 ÷ 40 = **10**",
                                "- 240 of 600 learners are Grade 7; stratified sample of 50 → 0.4 × 50 = **20** Grade 7 learners"]),
     ("meet", "Meeting 3 (C6, M5): PT2.1 Launch and Scaffold #1"),
     ("step", "(ID#3) The teacher will introduce PT2.1 Hydration Station: the G.R.A.S.P. description, rubric, and groupings."),
     ("step", "(ID#6) The students will accomplish PT2.1 – Scaffold #1: write the survey question, choose a sampling technique and sample size, and justify them."),
     ("step", "The teacher will remind the students of QZ2.2 next meeting (Lessons 4 to 6).")],
    "Honest data begins with a fair sample. Choosing people fairly – not just our friends or whoever is nearby – is a "
    "matter of justice and integrity.",
    ["Choosing every 8th name on a list is what kind of sampling? (Systematic)", "Why is asking only your friends a biased sample?"],
    "We learned five ways to collect data and four ways to choose a sample. Next, we organize and graph data.",
    res(6, 15, "Data Collection and Sampling", ["Teacher-prepared PT2.1 Guidelines and Rubric"]))

QZ2 = quiz("CYCLE 7, Meeting 1", "QZ2.2", "Sets, Real Numbers, and Sampling", "A8–A11, M4–M6, T2")

L_G = lesson(
    "CYCLE 7, Meetings 2 to 5, and CYCLE 8, Meetings 1 to 4", "LESSON 7: G. Organizing and Graphing Data",
    "A list of 40 numbers says little at first glance. Organized in a table and drawn as the right graph, the same data "
    "tells a clear story. Today we become data storytellers.",
    ["Organize statistical data in a frequency distribution table.",
     "Use appropriate graphs to represent organized data: pie graph, bar graph, line graph, and stem-and-leaf plot.",
     "Interpret statistical graphs.", "Choose the most appropriate graph for a data set and justify the choice.",
     "Organize and graph the PT2.1 survey data."], ["ZS", "CM"],
    [("meet", "Meetings 1–2 (C7, M2–M3): Frequency Distribution Tables"),
     ("step", "(ID#2) ^^HOOK:^^ “Misleading Graph” – a graph with a cut-off axis. What is wrong with it?"),
     card(16, 7, "Graph Studio", "Frequency Table", ["Slide the class width from 10 to 5."], ["Which class is the modal class each time?"],
          "An FDT groups data into classes; the frequencies always add up to the total."),
     ("step", "(ID#3) The teacher will discuss classes, class limits, class width, tallies, frequency, and the modal class."),
     ("ex", "Worked Example", ["40 quiz scores, classes of width 10: 10–19: 2 · 20–29: 11 · 30–39: 19 · 40–49: 8", "- Total = 40; modal class **30–39**"]),
     ("meet", "Meeting 3 (C7, M4): Class Data FDT"),
     ("step", "(ID#6) The students will accomplish LW2.6 Class Data FDT: collect the class’s heights or travel times and build an FDT."),
     ("meet", "Meetings 4–5 (C7, M5 – C8, M1): Choosing and Drawing Graphs"),
     card(16, 7, "Graph Studio", "Bar ↔ Pie, Line Graph, Stem-and-Leaf", ["Show the snack data as a bar graph and as a pie graph.", "Draw the line graph and build the stem-and-leaf plot."],
          ["Which graph shows parts of a whole? Which shows change over time?"], "Bar → compare; pie → parts of a whole; line → change over time; stem-and-leaf → every value."),
     ("step", "(ID#4) The teacher will discuss bar, pie, and line graphs and stem-and-leaf plots, including pie angles = (part ÷ whole) × 360°."),
     ("ex", "Worked Example", ["15 of 50 learners chose siomai: 15 ÷ 50 × 360° = **108°**"]),
     ("meet", "Meeting 6 (C8, M2): Practice Set #3"),
     ("step", "(ID#5) The students will answer CP2.4 – Practice Set #3 (SimBook Exercises 7, Part A)."),
     ("meet", "Meeting 7 (C8, M3): Graph Makeover"),
     ("step", "(ID#6, ID#7) The students will accomplish SA2.4 Graph Makeover: redraw three poorly chosen graphs using the right type and write one conclusion for each."),
     ("meet", "Meeting 8 (C8, M4): PT2.1 Scaffold #2"),
     ("step", "(ID#6) The students will accomplish PT2.1 – Scaffold #2: build the FDT and two graphs of the group’s survey data."),
     ("step", "The teacher will remind the students of QZ2.3 next meeting (Lesson 7).")],
    "Graphs can inform or mislead. As Lasallians, we present data truthfully – with honest scales and clear labels – so "
    "that others can make good decisions.",
    ["What is the angle of a sector that is 25% of a pie graph? (90°)", "Which graph would you use to show daily temperatures for a week? (Line graph)"],
    "We organized data in frequency tables and chose the right graph for each purpose. Next, we meet the integers.",
    res(7, 16, "Organizing and Graphing Data", ["Graphing paper, protractor, compass", "Google Sheets"]))

QZ3 = quiz("CYCLE 8, Meeting 5", "QZ2.3", "Organizing and Graphing Data", "A12–A14, M7, T3", items=20)

L_H = lesson(
    "CYCLE 9, Meetings 1 to 4", "LESSON 8: H. The Set of Integers",
    "Basements, freezing temperatures, and debts all call for numbers less than zero. Today we meet the negative numbers "
    "and the set of integers.",
    ["Describe the set of integers.", "Use positive and negative numbers to describe directions or opposites in real-life situations.",
     "Interpret the meaning of zero and of opposites in different contexts.", "Design the PT2.1 refill tank, converting its volume to litres."], ["CM"],
    [("meet", "Meeting 1 (C9, M1): Meet the Integers"),
     ("step", "(ID#2) ^^HOOK:^^ “Basement or Rooftop?” – which floor number does a basement get?"),
     card(17, 8, "Integer Elevator", "Integer Elevator", ["Ride to Basement 3, then switch to Thermometer, Sea level, and Money."],
          ["What does 0 mean in each context?", "What is the opposite of −4?"],
          "Integers are the whole numbers and their opposites; positive and negative describe opposite directions, and 0 is neither."),
     ("step", "(ID#3) The teacher will discuss the set of integers, positive and negative integers, zero, and opposites."),
     ("meet", "Meeting 2 (C9, M2): Integers in Real Life"),
     ("step", "(ID#4) The teacher will discuss real-life situations described by integers (money, temperature, elevation, games)."),
     ("ex", "Worked Examples", ["- a deposit of ₱200 → **200**", "- 12 °C below zero → **−12**", "- 3 floors below the ground floor → **−3**"]),
     ("meet", "Meeting 3 (C9, M3): Integer Walk"),
     ("step", "(ID#6) The students will accomplish LW2.7 Integer Walk: on a floor number line, act out situation cards and record each integer and its opposite."),
     ("meet", "Meeting 4 (C9, M4): PT2.1 Scaffold #3"),
     ("step", "(ID#6) The students will accomplish PT2.1 – Scaffold #3: compute the class’s daily water need from the survey, design a cylindrical tank (r and h), "
              "and convert its volume from cm³ to litres.")],
    "Every positive has an opposite. Learning to see the other side – of a number or of a person’s view – helps us "
    "understand one another.",
    ["Write an integer for a loss of 7 points. (−7)", "What is the opposite of −20? (20)"],
    "We described the integers and used them for real-life situations. Next, we compare and order integers.",
    res(8, 17, "The Set of Integers", ["Floor number line (masking tape)"]))

L_I = lesson(
    "CYCLE 9, Meeting 5, and CYCLE 10, Meetings 1 to 2", "LESSON 9: I. Comparing and Ordering Integers",
    "Which is colder: −8 °C or −5 °C? With negative numbers, our usual sense of “bigger” can trick us. The number line "
    "settles every question.",
    ["Locate integers on the number line.", "Compare and order integers.", "Explain how to compare negative integers using their distance from zero."], ["ZS"],
    [("meet", "Meeting 1 (C9, M5): Comparing"),
     ("step", "(ID#2) ^^HOOK:^^ “World Weather” – order city temperatures from coldest to warmest."),
     card(18, 9, "Integer Number Line", "Compare", ["Place a at −4 and b at 3; then put both on negative numbers."], ["Which is greater, and why?"],
          "The number farther to the right is greater; for negatives, the one closer to 0 is greater."),
     ("step", "(ID#3) The teacher will discuss locating integers on the number line and comparing them with < and >."),
     ("ex", "Worked Examples", ["- −7 < −4 (−4 is closer to 0)", "- 0 > −9", "- Order: −4, 7, −1, 0, 3 → **−4, −1, 0, 3, 7**"]),
     ("meet", "Meeting 2 (C10, M1): Ordering"),
     card(18, 9, "Integer Number Line", "Order", ["Order three sets of integers and the city temperatures."], [], "Ordering from least to greatest means reading the number line from left to right."),
     ("step", "(ID#5) Human number line game: learners holding integer cards arrange themselves."),
     ("meet", "Meeting 3 (C10, M2): Practice Set #4"),
     ("step", "(ID#5) The students will answer CP2.5 – Practice Set #4 (SimBook Exercises 9, Part A).")],
    "On the number line, every integer has its exact place. Each of us, too, has a place and a role to fulfil in our community.",
    ["Which is greater: −12 or −3? (−3)", "Order from least to greatest: 2, −6, 0, −1. (−6, −1, 0, 2)"],
    "We located, compared, and ordered integers using the number line. Next, we present our Hydration Station reports.",
    res(9, 18, "Comparing and Ordering Integers", ["Integer cards"]))

# ------------------------------------------------------------------ RELEASE

PT_FINAL = [
    ("cycle", "CYCLE 10, Meeting 3"), ("lesson", "PT2.1 – Hydration Station Report"),
    ("ts", "Today your team presents its findings to the school nurse and the class. Let the data speak, and support every recommendation with evidence."),
    ("p", "__(Note: Please refer to the detailed G.R.A.S.P. description and rubric on top of this LG.)__"),
    ("p", "(ID#1) **Goal:** Report how much water learners drink, and present a cylindrical refill tank sized to the class’s needs."),
    ("step", "(ID#2) Scaffold #1 – Survey Plan and Sampling Method was completed in C6, M5."),
    ("step", "(ID#3, ID#4) Scaffold #2 – Data Tables and Graphs was completed in C8, M4."),
    ("step", "(ID#5) Scaffold #3 – Tank Design and Conversions was completed in C9, M4."),
    ("step", "(ID#6, ID#7) Gallery walk and 3-minute group reports with questions from the panel; classmates give feedback using a peer slip."),
    ("step", "(ID#8) Reflection: “How can data help us care for our health and for one another?”"),
    ("step", "(ID#9) Using the rubric, each group reflects on its work and output."),
    ("pillar", ["CM", "ZS", "SF"], ["Reporting together builds dialogue and respect for others’ findings.",
                                   "Accurate data and computations reflect excellence and accountability.",
                                   "Caring for others’ health lives out Lasallian faith and values."]),
    ("res", ["Teacher-prepared PT2.1 Guidelines and Rubric", "Google Sheets and Slides", "Students’ PT2.1 output uploaded in Ranger360"]),
]
REVIEW = [
    ("sep",), ("cycle", "CYCLE 10, Meeting 4"), ("lesson", "Term Review: “Data Detective Escape Room”"),
    ("step", "(ID#5, ID#7) Teams solve five locks: (1) 3.2 km = ? m (3 200); (2) volume of a cylinder with r = 2, h = 5 (62.8); "
             "(3) n(A ∪ B) when n(A) = 8, n(B) = 6, n(A ∩ B) = 3 (11); (4) the pie angle for 20% (72); (5) the least of −3, −11, 0, 4 (−11)."),
    ("step", "(ID#9) Each student lists two topics to review further."),
    ("pillar", ["CM"]), ("res", ["Teacher-prepared station cards", "SimBook Check Yourself for every Term 2 lesson", R360]),
]
TERM_EXAM = [
    ("sep",), ("cycle", "CYCLE 10, Meeting 5"), ("lesson", "TERM EXAM"),
    ("h", "(ID#1, ID#8) Goals/Objectives:"),
    ("bul", ["Convert units of measure and find volumes of cylinders and pyramids.", "Describe sets and the subsets of real numbers.",
             "Collect, organize, graph, and interpret data.", "Describe, compare, and order integers."]),
    ("step", "(ID#3, ID#4) Part I – Multiple Choice: concepts and skills from Units D to G."),
    ("step", "(ID#5, ID#6) Part II – Constructed Response: conversions, volumes, Venn diagrams, and an FDT with a graph."),
    ("step", "(ID#7, ID#9) Part III – Problem Solving: real-life problems involving measurement, sets, data, and integers."),
    ("pillar", ["SF"], ["Answering the exam honestly and independently reflects integrity."]),
    ("res", ["Teacher-made TE2.1"]),
    ("sep",), ("cycle", "CYCLE 11 (Buffer)"),
    ("p", "Cycle 11 is reserved for make-up assessments for excused absences, remediation and enrichment (using the SimBook), "
          "and adjustments for class suspensions and school activities."),
]

STAGES = [
    {"name": "DRAW", "desc": "Acquisition\n(Factual or Procedural Knowledge)", "blocks": ORIENTATION + L_A + L_B + L_C + QZ1},
    {"name": "TUNE", "desc": "Make-Meaning\n(Understanding, Processing)", "blocks": L_D + L_E + L_F + QZ2 + L_G + QZ3 + L_H + L_I},
    {"name": "RELEASE", "desc": "Transfer\n(to Real-world applications or new situations as evidence of their learning)", "blocks": PT_FINAL + REVIEW + TERM_EXAM},
]

SIGNATORIES = _t1.SIGNATORIES
