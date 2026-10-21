"""Grade 7 Mathematics – Learning Guide, 3rd Trimester, SY 2026-2027.

Companion to content/grade7_term3_cm.py (same codes, meetings, and assessments).
Source of truth: DepEd MATATAG Mathematics CG, Grade 7 Quarter 3 items 9–12 and
Quarter 4, as sequenced in the DepEd Three-Term Budget of Work (Third Term).
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
_cm = _load("grade7_term3_cm")
SIMBOOK = _cm.SIMBOOK
R360 = "Materials uploaded in Ranger360"

HEADER = {"lines": ["LA SALLE GREEN HILLS", "Mathematics Department (Grade 7)", "3rd Trimester, SY 2026-2027"], "title": "LEARNING GUIDE"}

OVERVIEW = [
    "Grade 7 Mathematics in the third trimester gives numbers their full power. In **Integer Power!**, learners add, "
    "subtract, multiply, and divide integers with chips, number lines, and patterns, simplify expressions with GEMDAS, "
    "and read absolute value as distance. In **Algebra Starter!**, letters enter: learners tell variables from constants, "
    "evaluate and write expressions, solve equations with bar models and the properties of equality, rearrange formulas, "
    "and solve problems with equations. In **Chance and Scale!**, they run experiments with coins, dice, and spinners, "
    "represent the outcomes, and write and compute with very large and very small numbers in scientific notation.",
    "For their end-of-term performance task, **Family Day Chance Booth**, learners act as a booth design team for the "
    "school’s Family Day: they invent a chance game, test it with at least 50 trial plays, show the outcomes in words, "
    "symbols, tables, and graphs, write the scoring and earnings rules as equations with integers, and defend a fair "
    "prize plan.",
    "Each lesson opens with a short simulation from the **LSGH Math 7 SimBook** as its hook. The lesson itself is "
    "taught in the usual way – the teacher’s discussion, definitions, and step-by-step worked examples, presented on "
    "the SimBook’s lesson slides with speaker notes – and practiced through the SimBook’s Check Yourself items and its "
    "Exercises (Part A Skills Practice, Part B Problem Solving, Part C Challenge).",
]

OUTCOMES = [("Math.G7.3", "Perform operations on integers, use expressions, equations, and formulas to model and solve "
                          "problems, and use experiments and scientific notation to describe chance and scale in real life.")]

POLICIES = _t1.POLICIES

ASSESSMENT = [
    {"component": "Written Works (WW)", "weight": "20%", "groups": [
        ("CP - Participation – seatwork, recitation (40%)", [
            "CP3.1 - Recitation every meeting", "CP3.2 - Practice Set #1: Adding and Subtracting Integers (C2, M1)",
            "CP3.3 - Practice Set #2: Operations on Integers (C3, M2)", "CP3.4 - Practice Set #3: Expressions (C5, M1)",
            "CP3.5 - Practice Set #4: Equations (C7, M4)", "CP3.6 - Practice Set #5: Scientific Notation (C10, M1)"]),
        ("QZ - Quizzes (60%)", ["QZ3.1 - Operations on Integers and Absolute Value (C4, M1)",
                                "QZ3.2 - Expressions, Equality, and Formulas (C7, M1)",
                                "QZ3.3 - Equations, Experiments, and Scientific Notation (C10, M2)"])]},
    {"component": "Performance Task (PT)", "weight": "60%", "groups": [
        ("LW - Guided Hands-on Activities (30%)", ["LW3.1 - Integer Chip Mat (C1, M4)", "LW3.2 - Sign Rule Patterns (C2, M4)",
                                                   "LW3.3 - Distance Walk (C3, M5)", "LW3.4 - Expression Machine Cards (C4, M4)",
                                                   "LW3.5 - Balance Model (C5, M4)", "LW3.6 - Formula Flip (C6, M4)",
                                                   "LW3.7 - Coin and Die Lab (C8, M3)", "LW3.8 - Powers-of-Ten Scale Strip (C9, M4)"]),
        ("SA - Challenge Hands-on Activities (40%)", ["SA3.1 - GEMDAS Relay (C3, M1)", "SA3.2 - Property Proof (C6, M1)",
                                                      "SA3.3 - Word Problem Studio (C7, M5)"]),
        ("PT – End of Term PT (30%)", ["PT3.1 - Chance Booth Proposal", "Scaffolding#1 - Booth Rules and Scoring Equation (C8, M1)",
                                       "Scaffolding#2 - Booth Experiment Data (C8, M5)", "Scaffolding#3 - Prize Plan (C9, M1)",
                                       "Final Pitch (C10, M3)"])]},
    {"component": "Final Exam", "weight": "20%", "groups": [("TE – Term Exam (100%) (C10, M5)", [])]},
]

STANDARDS = [
    {"label": "CONTENT STANDARD", "body": [("lead", _cm.STANDARDS[0]["lead"]), ("bul", _cm.STANDARDS[0]["items"])]},
    {"label": "PERFORMANCE STANDARD", "body": [("lead", _cm.STANDARDS[1]["lead"]), ("bul", _cm.STANDARDS[1]["items"])] + _t1.STANDARDS[1]["body"][2:]},
    {"label": "ENDURING UNDERSTANDING", "body": [("lead", _cm.STANDARDS[3]["lead"]), ("num", _cm.STANDARDS[3]["items"])]},
    {"label": "ESSENTIAL QUESTIONS", "body": [("lead", _cm.STANDARDS[2]["lead"]), ("num", _cm.STANDARDS[2]["items"])]},
    {"label": "TRANSFER GOAL", "body": [("p", _cm.STANDARDS[4]["text"])]},
    {"label": "PERFORMANCE TASK", "body": [
        ("center", "PT3.1 Family Day Chance Booth –"), ("center", "G.R.A.S.P. Performance Task"),
        ("h", "G – Goal"),
        ("p", "Your goal is to design and test a chance game for the LSGH Family Day booth that is fun to play, honest "
              "about its chances, and still raises funds for the class."),
        ("h", "R – Role"),
        ("p", "You are a booth design team of the Grade 7 class."),
        ("h", "A – Audience"), ("lead", "Your primary audience includes:"),
        ("bul", ["The Family Day committee (parents and teachers)", "Your class adviser", "Your classmates, who will play-test your game"]),
        ("h", "S – Situation"),
        ("p", "The committee approves only booths that show evidence. Each proposal must report at least 50 trial plays, "
              "state the possible outcomes clearly, and show – using equations with integers for gains (+) and losses (−) – "
              "how many points or pesos the booth expects to give out and take in for 200 players."),
        ("h", "P – Product / Performance"), ("lead", "You will create:"),
        ("p", "A **Chance Booth Proposal** (poster or slides), a **prototype** of the game, and a **3-minute pitch** that includes:"),
        ("bul", ["The game rules and the list of possible outcomes, in words and in symbols",
                 "A table and a graph of at least 50 trial plays, with the relative frequency of winning",
                 "The scoring rule written as an algebraic expression, and the earnings equation (with integers)",
                 "A prediction for 200 players, and a prize plan within the budget",
                 "An explanation of why the game is fair and honest to players"]),
        ("h", "S – Success Criteria / Standards"), ("lead", "Your work will be assessed based on:"),
        ("bul", [("Experiment and Data", ["At least 50 trials, recorded accurately in a table and a graph. (10 points)"]),
                 ("Outcomes in Words and Symbols", ["Complete, correct list of outcomes and events. (10 points)"]),
                 ("Expressions and Equations", ["Correct scoring expression and earnings equation, with correct integer operations. (15 points)"]),
                 ("Prediction and Prize Plan", ["Reasonable prediction from the data; the plan stays within budget. (10 points)"]),
                 ("Pitch and Fairness", ["Clear, honest, and respectful; questions answered with evidence. (5 points)"])]),
        ("p", "**Total: 50 points**"),
    ]},
]

UNITS = [
    {"title": "Unit H · INTEGER POWER! Operations on Integers", "lessons": [
        ("A. Adding and Subtracting Integers", ["Integer chips, number lines, and bar models", "Subtracting as adding the opposite"]),
        ("B. Multiplying and Dividing Integers; Order of Operations", ["Sign rules", "Number properties and GEMDAS"]),
        ("C. Absolute Value", ["Distance from zero; distance between integers"])]},
    {"title": "Unit I · ALGEBRA STARTER! Expressions, Equality, Formulas, and Equations", "lessons": [
        ("D. Variables, Constants, and Algebraic Expressions", ["Evaluating expressions", "Translating verbal phrases"]),
        ("E. Bar Models and the Properties of Equality", ["Solving simple equations with bar models", "Properties of equality"]),
        ("F. Formulas: Solving for a Variable", ["Making a different variable the subject"]),
        ("G. Writing and Solving Equations", ["Equations in algebraic form", "Problems with expressions and formulas"])]},
    {"title": "Unit J · CHANCE AND SCALE! Experiments and Scientific Notation", "lessons": [
        ("H. Experiments and Outcomes", ["Collecting and representing outcomes", "Solving problems using outcomes"]),
        ("I. Scientific Notation", ["Writing numbers in scientific notation", "Operations in scientific notation"])]},
    {"title": "End-of-Term Performance Task: Family Day Chance Booth", "lessons": [
        ("Scaffolding#1:", ["Booth rules and scoring equation"]), ("Scaffolding#2:", ["Booth experiment data"]),
        ("Scaffolding#3:", ["Prize plan"]), ("Final Pitch:", ["Booth fair and presentation to the panel"])]},
]

MARK = []
for r in _cm.ROWS:
    for c in r.get("comps", []):
        if isinstance(c, tuple):
            MARK.append((f"{c[0]}.", c[2] + (" ★" if c[1] else "")))


# ------------------------------------------------------------------ helpers

def card(n_global, n_term, sim, tab, mission, questions, discovery, setup="Pairs, one device; record findings in the notebook"):
    return ("sim", {"kind": "SIM HOOK", "title": f"{sim} – {tab}",
                    "tool": f"LSGH Math 7 SimBook · Term 3 Lesson {n_term} · {sim} ({tab} tab)",
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
    return [f"LSGH Math 7 SimBook - Term 3 Lesson {n_term} ({SIMBOOK}#lesson{n_global})",
            f"SimBook Lesson {n_term} slides with speaker notes (use Present for the projector)",
            f"SimBook Exercises {n_term} – Part A as seatwork; Parts B and C as homework",
            f"Teacher’s Google presentation - Lesson {n_term}: {title}", *extra, R360]



# ------------------------------------------------------------------ DRAW

ORIENTATION = [
    ("cycle", "CYCLE 1, Meeting 1"), ("lesson", "LESSON: Class Orientation – “Math Has Rules – and Chances!”"),
    ("h", "INTRODUCTION:"),
    ("q", "Welcome to the last term of Grade 7! Last term we met the integers. This term we put them to work, let letters "
          "stand for numbers, solve equations, run experiments with chance, and write numbers as large as the distance to "
          "the Sun and as small as a virus."),
    ("h", "OBJECTIVES: (ID#1)"),
    ("obj", ["Review the Term 3 course outline and roadmap.", "Describe the learning outcomes, grading components, and their percentage weights.",
             "Explain classroom policies, attendance requirements, and academic integrity guidelines."], ["ZS", "SF"]),
    ("h", "ACTIVITIES:"),
    ("step", "(ID#2) ^^HOOK:^^ “Up and Down” – an elevator goes up 5 floors and down 8; a thermometer rises 3° and falls 6°; "
             "a piggy bank gains ₱20 and loses ₱35. Where does each one end up?"),
    ("step", "(ID#3) The teacher will discuss the Term 3 roadmap: Units H to J and the performance task “Family Day Chance Booth.”"),
    ("step", "(ID#4) The teacher will discuss the methods of assessment and their weights."),
    ("step", "(ID#5) The teacher will review classroom procedures and the Mathematics Department policies."),
    ("h", "WRAP UP ACTIVITY: “Term 2 to Term 3” One-minute Reflection (ID#6)"),
    ("bul", ["One skill from Term 2 I am proud of is ____.", "One thing I want to master before Grade 8 is ____."]),
    ("h", "VALUING STATEMENT: (ID#8)"),
    ("q", "Rules make games fair and mathematics reliable. This term, let us follow the rules honestly – in our solutions and in our games."),
    ("res", ["Teacher’s Google presentation - Class Orientation", "Student Handbook", R360]),
]

L_A = lesson(
    "CYCLE 1, Meetings 2 to 5, and CYCLE 2, Meeting 1", "LESSON 1: A. Adding and Subtracting Integers",
    "Money comes in and goes out; temperatures rise and fall. To combine gains and losses we add and subtract integers. "
    "Today we use chips, number lines, and bar models to find the rules.",
    ["Add and subtract integers; using concrete models (e.g., counters, integer chips), pictorial models (e.g., bar models, number lines), and with integers written as numerals.",
     "Explain the sign of a sum or difference using zero pairs and the idea that subtracting means adding the opposite."], ["ZS"],
    [("meet", "Meetings 1–2 (C1, M2–M3): Integer Chips and Zero Pairs"),
     ("step", "(ID#2) ^^HOOK:^^ “Baon Ledger” – a week of baon (+), snacks (−), and savings: is the learner ahead or behind on Friday?"),
     card(19, 1, "Integer Chips", "Chip Board",
          ["Show 5 + (−3) with chips and remove the zero pairs.", "Show −4 + (−2), then 2 − 5 (add zero pairs to take away 5)."],
          ["What is left after the zero pairs disappear?", "When is the sum negative?"],
          "A positive and a negative chip make a zero pair. Same signs: add and keep the sign. Different signs: subtract and take the sign of the larger number of chips."),
     ("step", "(ID#3) The teacher will discuss the rules for adding integers with like and unlike signs."),
     ("ex", "Worked Examples", ["- 7 + (−3) = **4**", "- −6 + (−5) = **−11**", "- −9 + 4 = **−5**"]),
     ("step", "(ID#5) Board drill: learners add integers called out by the teacher (CP3.1 – Recitation)."),
     ("meet", "Meeting 3 (C1, M4): Integer Chip Mat"),
     ("step", "(ID#6) The students will accomplish LW3.1 Integer Chip Mat: model ten sums and differences with two-colored chips, "
              "sketch each mat, and write the number sentence."),
     ("meet", "Meeting 4 (C1, M5): Number Lines, Bar Models, and Subtraction"),
     card(19, 1, "Integer Chips", "Number Line Hops and Bar Model",
          ["Hop 3 − 7 and 3 + (−7). Compare.", "Build −2 − (−6) as a bar model."],
          ["Why do 3 − 7 and 3 + (−7) land on the same point?"],
          "Subtracting an integer is the same as adding its opposite: a − b = a + (−b)."),
     ("step", "(ID#4) The teacher will discuss subtraction as adding the opposite, with number lines and bar models."),
     ("ex", "Worked Examples", ["- 3 − 7 = 3 + (−7) = **−4**", "- −2 − (−6) = −2 + 6 = **4**",
                                "- Baguio was 18 °C at noon and 9 °C at night: 9 − 18 = **−9**, a drop of 9 °C"]),
     ("meet", "Meeting 5 (C2, M1): Practice Set #1"),
     ("step", "(ID#5) The students will answer CP3.2 – Practice Set #1 (SimBook Exercises 1, Part A, may be used).")],
    "Zero pairs remind us that a gain can cancel a loss. When we make a mistake, a good act can restore what was lost – "
    "and honesty about our “negatives” is the first step.",
    ["Find −8 + 5. (−3)", "Find 4 − (−6). (10)"],
    "We added and subtracted integers with chips, number lines, and bar models, and learned that subtracting means adding "
    "the opposite. Next, we multiply and divide integers.",
    res(1, 19, "Adding and Subtracting Integers", ["Two-colored counters or bottle caps"]))

L_B = lesson(
    "CYCLE 2, Meetings 2 to 5, and CYCLE 3, Meetings 1 to 2", "LESSON 2: B. Multiplying and Dividing Integers; Order of Operations",
    "A diver goes down 3 m every minute. Where are they after 4 minutes – and where were they 4 minutes ago? Patterns "
    "will show us why a negative times a negative is positive.",
    ["Multiply and divide integers.",
     "Simplify numerical expressions involving integers using number properties and the order of operations (GEMDAS).",
     "Explain the sign rules for multiplication and division using patterns."], ["ZS", "CM"],
    [("meet", "Meetings 1–2 (C2, M2–M3): Groups and Sign Patterns"),
     ("step", "(ID#2) ^^HOOK:^^ “Diving Pattern” – a diver descends 3 m per minute. Where are they after 4 minutes? 4 minutes ago?"),
     card(20, 2, "Sign Machine", "Groups of Chips and Sign Patterns",
          ["Show 3 × (−2) as 3 groups of −2.", "Run the pattern 3 × (−2), 2 × (−2), 1 × (−2), 0 × (−2), then keep going."],
          ["By how much does each product change?", "What must (−1) × (−2) be to keep the pattern?"],
          "Same signs give a positive product; different signs give a negative product. Division follows the same sign rules."),
     ("step", "(ID#3) The teacher will discuss the sign rules for multiplying and dividing integers, and division as the inverse of multiplication."),
     ("ex", "Worked Examples", ["- 4 × (−3) = **−12**", "- (−5) × (−6) = **30**", "- −36 ÷ 4 = **−9**", "- −42 ÷ (−7) = **6**"]),
     ("meet", "Meeting 3 (C2, M4): Sign Rule Patterns"),
     ("step", "(ID#6) The students will accomplish LW3.2 Sign Rule Patterns: complete multiplication tables from −4 to 4, color the positive and negative products, and write the rules."),
     ("meet", "Meeting 4 (C2, M5): Number Properties and GEMDAS"),
     card(20, 2, "Sign Machine", "GEMDAS Stepper", ["Predict the next step before pressing Step for three expressions."],
          ["Which operation comes first when there are no grouping symbols?"],
          "Grouping, Exponents, Multiplication and Division (left to right), then Addition and Subtraction (left to right)."),
     ("step", "(ID#4) The teacher will discuss the number properties (commutative, associative, distributive, identity, inverse) and GEMDAS."),
     ("ex", "Worked Examples", ["- −3 + 4 × (−2) = −3 + (−8) = **−11**", "- (−6 + 2)² ÷ 8 = (−4)² ÷ 8 = 16 ÷ 8 = **2**",
                                "- 5 × (−7) + 5 × (−3) = 5 × (−10) = **−50** (distributive property)"]),
     ("meet", "Meeting 5 (C3, M1): GEMDAS Relay"),
     ("step", "(ID#6, ID#7) The students will accomplish SA3.1 GEMDAS Relay: in teams, each learner does one step of a multi-step expression; "
              "the next learner checks it before continuing."),
     ("meet", "Meeting 6 (C3, M2): Practice Set #2"),
     ("step", "(ID#5) The students will answer CP3.3 – Practice Set #2 (SimBook Exercises 2, Part A).")],
    "In the GEMDAS relay, every step depends on the one before it. Doing our part carefully and checking a teammate’s "
    "work with kindness is how a community reaches the right answer together.",
    ["Find (−8) × (−4). (32)", "Simplify 10 − 2 × (−3). (16)"],
    "We multiplied and divided integers using sign rules found from patterns, and simplified expressions with GEMDAS. "
    "Next, we measure the distance of an integer from zero.",
    res(2, 20, "Multiplying and Dividing Integers; Order of Operations", ["Relay cards"]))

L_C = lesson(
    "CYCLE 3, Meetings 3 to 5", "LESSON 3: C. Absolute Value",
    "The peak of Mt. Pulag is about 2 900 m above sea level; a diver may be 30 m below it. How far from sea level is "
    "each? Distance is never negative – that is the idea of absolute value.",
    ["Identify the absolute value of an integer, and its meaning on the number line.",
     "Use absolute value to find the distance between two integers in real-life situations."], ["ZS"],
    [("meet", "Meeting 1 (C3, M3): Distance from Zero"),
     ("step", "(ID#2) ^^HOOK:^^ “How Far?” – the top of Mt. Pulag and the floor of Manila Bay: which is farther from sea level?"),
     card(21, 3, "Distance Finder", "Distance from Zero", ["Drag the point to −6, then to 6.", "Try three other pairs of opposites."],
          ["What do a number and its opposite have in common?"],
          "The absolute value |a| is the distance of a from 0 on the number line, so it is never negative, and |a| = |−a|."),
     ("step", "(ID#3) The teacher will discuss absolute value as distance, the notation |a|, and why |a| ≥ 0."),
     ("ex", "Worked Examples", ["- |−9| = **9**; |9| = **9**; |0| = **0**", "- −|−4| = **−4**", "- |−7| + |3| = 7 + 3 = **10**"]),
     ("meet", "Meeting 2 (C3, M4): Distances in Real Life"),
     card(21, 3, "Distance Finder", "Real Distances", ["Find the distance between −5 and 8, and between two elevations."], ["How does |a − b| give the distance?"],
          "The distance between two integers a and b on the number line is |a − b|."),
     ("step", "(ID#4) The teacher will discuss distance between two integers and real-life uses (elevation, temperature change)."),
     ("ex", "Worked Example", ["A diver is at −12 m and a bird is at 25 m: |25 − (−12)| = **37 m** apart"]),
     ("meet", "Meeting 3 (C3, M5): Distance Walk"),
     ("step", "(ID#6) The students will accomplish LW3.3 Distance Walk: walk to integers on a floor number line and record each distance from zero and between partners."),
     ("step", "The teacher will remind the students of QZ3.1 next meeting (Lessons 1 to 3).")],
    "Absolute value counts the distance, not the direction. Whatever direction others come from, we can measure how far "
    "they have travelled and honor their effort.",
    ["Find |−15|. (15)", "How far apart are −3 and 4 on the number line? (7)"],
    "We learned that absolute value is distance from zero and used it to find distances between integers. Next, we review "
    "Unit H in QZ3.1.",
    res(3, 21, "Absolute Value", ["Floor number line (masking tape)"]))

QZ1 = quiz("CYCLE 4, Meeting 1", "QZ3.1", "Operations on Integers and Absolute Value", "A1–A4, M1–M3")

# ------------------------------------------------------------------ TUNE

L_D = lesson(
    "CYCLE 4, Meetings 2 to 5, and CYCLE 5, Meeting 1", "LESSON 4: D. Variables, Constants, and Algebraic Expressions",
    "A jeepney fare is ₱13 for the first 4 km plus ₱2 for every extra kilometer. One expression, 13 + 2k, gives the fare for "
    "every trip. Today we learn the language of algebra.",
    ["Distinguish a variable from a constant in an algebraic expression.", "Evaluate algebraic expressions given the value/s of the variable/s.",
     "Translate verbal phrases into algebraic expressions.", "Explain why a variable can take many values while a constant stays fixed."], ["ZS"],
    [("meet", "Meeting 1 (C4, M2): Variables and Constants"),
     ("step", "(ID#2) ^^HOOK:^^ “Jeepney Fare Machine” – the teacher calls out trip lengths; learners race to give the fare."),
     card(22, 4, "Expression Machine", "Variable or Constant?", ["Tap every variable, constant, and coefficient in four expressions."],
          ["Which parts change from trip to trip, and which stay the same?"],
          "A variable is a letter that can stand for different numbers; a constant has a fixed value. In 2k, 2 is the coefficient of k."),
     ("step", "(ID#3) The teacher will discuss variables, constants, terms, coefficients, and algebraic expressions."),
     ("meet", "Meetings 2–3 (C4, M3–M4): Evaluating Expressions"),
     card(22, 4, "Expression Machine", "Evaluate", ["Slide x and y and watch the output of 3x − 2y.", "Find x so that 13 + 2x = 25."],
          ["What happens to the output when x goes up by 1?"],
          "To evaluate, substitute each value for its variable (use parentheses for negatives), then simplify with GEMDAS."),
     ("ex", "Worked Examples", ["- 13 + 2k when k = 6: 13 + 2(6) = **25**", "- 3x − 2y when x = −2, y = 5: 3(−2) − 2(5) = **−16**",
                                "- a² − 4a when a = −3: (−3)² − 4(−3) = 9 + 12 = **21**"]),
     ("step", "(ID#6) The students will accomplish LW3.4 Expression Machine Cards (C4, M4): complete input–output cards for five expressions and match phrase cards."),
     ("meet", "Meeting 4 (C4, M5): Translating Verbal Phrases"),
     card(22, 4, "Expression Machine", "Translate", ["Match ten phrases to their expressions."], ["Why is “5 less than n” written n − 5 and not 5 − n?"],
          "Key words show the operation: sum, more than → +; difference, less than → −; product, twice → ×; quotient → ÷."),
     ("ex", "Worked Examples", ["- five more than a number → **n + 5**", "- twice a number decreased by 3 → **2n − 3**",
                                "- the quotient of a number and 4 → **n ÷ 4**", "- 5 less than a number → **n − 5**"]),
     ("meet", "Meeting 5 (C5, M1): Practice Set #3"),
     ("step", "(ID#5) The students will answer CP3.4 – Practice Set #3 (SimBook Exercises 4, Part A).")],
    "A variable can take many values, yet the expression stays faithful to its rule. Like a good friend, it gives a "
    "dependable answer for every situation.",
    ["Evaluate 4x + 7 when x = −2. (−1)", "Translate: three times a number, increased by 8. (3n + 8)"],
    "We distinguished variables from constants, evaluated expressions by substitution, and translated phrases into "
    "algebra. Next, we use bar models and balances to solve equations.",
    res(4, 22, "Variables, Constants, and Algebraic Expressions", ["Input–output and phrase cards"]), sep=False)

L_E = lesson(
    "CYCLE 5, Meetings 2 to 5, and CYCLE 6, Meeting 1", "LESSON 5: E. Bar Models and the Properties of Equality",
    "A balance with a mystery bag on one side and marbles on the other is an equation. If we keep it balanced while we "
    "take things away, we find what is in the bag.",
    ["Solve simple equations represented by bar models to find unknowns.", "Illustrate the properties of equality.",
     "Justify each step in solving an equation using a property of equality."], ["ZS", "SF"],
    [("meet", "Meetings 1–2 (C5, M2–M3): Bar Models"),
     ("step", "(ID#2) ^^HOOK:^^ “Mystery Bag” – a bag and 4 marbles balance 11 marbles. How many marbles are in the bag?"),
     card(23, 5, "Balance Lab", "Bar Model", ["Solve x + 4 = 11 and 3x = 18 with the bars."], ["Which part of the bar is the unknown?"],
          "A bar model shows the whole and its parts; the unknown is the part that is left after removing what we know."),
     ("step", "(ID#3) The teacher will discuss equations, solutions, and solving simple equations with bar models."),
     ("ex", "Worked Examples", ["- x + 4 = 11: the whole is 11, one part is 4, so **x = 7**", "- 3x = 18: three equal parts make 18, so **x = 6**",
                                "- 2x + 5 = 17: 2x = 12, so **x = 6**"]),
     ("meet", "Meetings 3–4 (C5, M4–M5): The Balance and the Properties of Equality"),
     card(23, 5, "Balance Lab", "Balance Scale", ["Solve 2x + 3 = 11 on the balance, naming the property used at each step."],
          ["What happens to the beam if you remove 3 from one side only?"],
          "Doing the same operation to both sides keeps the equation balanced: the addition, subtraction, multiplication, and division properties of equality."),
     ("step", "(ID#4) The teacher will discuss the properties of equality: reflexive, symmetric, transitive, substitution, addition, subtraction, multiplication, and division."),
     ("step", "(ID#6) The students will accomplish LW3.5 Balance Model (C5, M4): solve four equations on a hanger balance or with paper bars and record each step."),
     ("ex", "Worked Example", ["2x + 3 = 11", "- 2x = 8 (subtraction property of equality: subtract 3)", "- **x = 4** (division property of equality: divide by 2)"]),
     ("meet", "Meeting 5 (C6, M1): Property Proof"),
     card(23, 5, "Balance Lab", "Name the Property", ["Name the property shown in each card."], [], "Each property of equality says what we may do without breaking the balance."),
     ("step", "(ID#6, ID#7) The students will accomplish SA3.2 Property Proof: solve five equations and justify every step with a property of equality.")],
    "A balance stays level only when both sides are treated the same. Fairness – giving each side what is due – is at the "
    "heart of both equations and justice.",
    ["Solve x + 9 = 15. (6)", "If a = b, then b = a. Which property is this? (Symmetric)"],
    "We solved equations with bar models and balances and named the properties of equality that justify each step. "
    "Next, we use the same moves to rearrange formulas.",
    res(5, 23, "Bar Models and the Properties of Equality", ["Hanger balance or paper strips, paper clips"]))

L_F = lesson(
    "CYCLE 6, Meetings 2 to 5", "LESSON 6: F. Formulas: Solving for a Variable",
    "A trip to Baguio is 250 km at 50 km/h. The formula d = rt gives distance – but we want the time. Today we learn to "
    "rearrange a formula so it answers the question we are asking.",
    ["Solve one variable in terms of the other variables in a formula.", "Check a rearranged formula by substituting values."], ["ZS"],
    [("meet", "Meetings 1–2 (C6, M2–M3): Rearranging Formulas"),
     ("step", "(ID#2) ^^HOOK:^^ “Road Trip to Baguio” – 250 km at 50 km/h: how long is the trip? Which formula tells us directly?"),
     card(24, 6, "Formula Rearranger", "Rearrange", ["Make t the subject of d = rt, then w the subject of P = 2l + 2w."],
          ["Which operation undoes multiplication? addition?"],
          "To make a variable the subject, undo the operations around it in reverse order, doing the same to both sides."),
     ("step", "(ID#3) The teacher will discuss formulas, the subject of a formula, and rearranging with the properties of equality."),
     ("ex", "Worked Examples", ["- d = rt → **t = d ÷ r**", "- P = 2l + 2w → P − 2l = 2w → **w = (P − 2l) ÷ 2**",
                                "- I = Prt → **r = I ÷ (Pt)**", "- F = (9/5)C + 32 → **C = (5/9)(F − 32)**"]),
     ("meet", "Meeting 3 (C6, M4): Formula Flip"),
     ("step", "(ID#6) The students will accomplish LW3.6 Formula Flip: rearrange six formula cards for a given variable and check each with numbers."),
     ("meet", "Meeting 4 (C6, M5): Using Rearranged Formulas"),
     card(24, 6, "Formula Rearranger", "Use It", ["Find the time for 250 km at 50 km/h, and the width of a 30-m fence with l = 9 m."], [],
          "Rearranging first, then substituting, gives the answer in one step – and substituting back checks it."),
     ("ex", "Worked Example", ["P = 30 m, l = 9 m: w = (30 − 18) ÷ 2 = **6 m**. Check: 2(9) + 2(6) = 30 ✓"]),
     ("step", "The teacher will remind the students of QZ3.2 next meeting (Lessons 4 to 6).")],
    "A formula can be turned around to answer a new question. Looking at a problem from another side is a habit that "
    "helps us understand people, too.",
    ["Make r the subject of d = rt. (r = d ÷ t)", "Make l the subject of A = lw. (l = A ÷ w)"],
    "We rearranged formulas to make a different variable the subject and checked by substitution. Next, we review in "
    "QZ3.2, then write and solve our own equations.",
    res(6, 24, "Formulas: Solving for a Variable", ["Formula cards"]))

QZ2 = quiz("CYCLE 7, Meeting 1", "QZ3.2", "Expressions, Equality, and Formulas", "A5–A10, M4–M6")

L_G = lesson(
    "CYCLE 7, Meetings 2 to 5, and CYCLE 8, Meeting 1", "LESSON 7: G. Writing and Solving Equations",
    "Saving ₱25 a day, when will you have ₱300 for new shoes? Writing the situation as an equation turns a question into "
    "something we can solve – and check.",
    ["Write equations in algebraic form.", "Find the value of an unknown in an equation where the unknown is non-negative.",
     "Solve problems involving algebraic expressions and formulas.", "Check a solution by substituting it back into the equation.",
     "Write the scoring and earnings rules of the PT3.1 booth as expressions and equations."], ["ZS", "SF"],
    [("meet", "Meeting 1 (C7, M2): Story to Equation"),
     ("step", "(ID#2) ^^HOOK:^^ “Ipon Challenge” – saving ₱25 a day, when will you reach ₱300?"),
     card(25, 7, "Equation Builder", "Story to Equation", ["Build the equation for three stories."], ["Which quantity is the unknown? What is equal to what?"],
          "An equation states that two expressions are equal; name the unknown, write each side, then join them with =."),
     ("step", "(ID#3) The teacher will discuss writing equations from verbal sentences and situations."),
     ("ex", "Worked Examples", ["- Ana saves ₱25 a day for d days and has ₱300 → **25d = 300**",
                                "- A number increased by 12 is 40 → **n + 12 = 40**", "- Twice a number less 5 is 17 → **2n − 5 = 17**"]),
     ("meet", "Meeting 2 (C7, M3): Solving for a Non-negative Unknown"),
     card(25, 7, "Equation Builder", "Solve It", ["Slide d until both sides of 25d = 300 match, then solve with inverse operations."],
          ["Why does guess-and-check get slow for big numbers?"],
          "Inverse operations solve any simple equation quickly; substituting the answer back checks it."),
     ("ex", "Worked Examples", ["- 25d = 300 → d = 300 ÷ 25 = **12 days**. Check: 25(12) = 300 ✓", "- 2n − 5 = 17 → 2n = 22 → **n = 11**"]),
     ("meet", "Meeting 3 (C7, M4): Practice Set #4"),
     ("step", "(ID#5) The students will answer CP3.5 – Practice Set #4 (SimBook Exercises 7, Part A)."),
     ("meet", "Meeting 4 (C7, M5): Word Problem Studio"),
     card(25, 7, "Equation Builder", "Problem Solving", ["Solve the perimeter, cost, and area problems."], [], "Read, name the unknown, write the equation, solve, and check."),
     ("step", "(ID#6, ID#7) The students will accomplish SA3.3 Word Problem Studio: write, solve, and check three equation stories from school life, "
              "including one that uses a formula."),
     ("meet", "Meeting 5 (C8, M1): PT3.1 Launch and Scaffold #1"),
     ("step", "(ID#3) The teacher will introduce PT3.1 Family Day Chance Booth: the G.R.A.S.P. description, rubric, and groupings."),
     ("step", "(ID#6) The students will accomplish PT3.1 – Scaffold #1: write the booth rules, the scoring rule as an expression, and the earnings "
              "equation E = (fee × players) − (prize × winners).")],
    "An equation keeps its promise: what is on one side equals what is on the other. Let our words and actions be "
    "equal, too – saying what we mean and doing what we say.",
    ["Write and solve: a number decreased by 8 is 15. (n − 8 = 15; n = 23)", "Solve 6x + 4 = 40. (6)"],
    "We wrote equations from situations, solved them for non-negative unknowns, and checked our answers. Next, we run "
    "experiments with chance.",
    res(7, 25, "Writing and Solving Equations", ["Teacher-prepared PT3.1 Guidelines and Rubric"]))

L_H = lesson(
    "CYCLE 8, Meetings 2 to 5, and CYCLE 9, Meeting 1", "LESSON 8: H. Experiments and Outcomes",
    "Toss a coin 20 times. Will you get exactly 10 heads? Today we run experiments, record what happens, and find the "
    "patterns hiding in chance.",
    ["Collect data from experiments (e.g., number of heads obtained when tossing a coin, a number of times, number of prime numbers obtained when rolling a die a number of times).",
     "Express outcomes in words and/or symbols, and represent outcomes in tables and/or graphs.",
     "Solve problems using the outcomes of experiments.",
     "Explain why results vary from one experiment to another and settle as the number of trials grows.",
     "Run and record at least 50 trial plays of the PT3.1 booth game."], ["ZS", "CM"],
    [("meet", "Meetings 1–2 (C8, M2–M3): Coins and Dice"),
     ("step", "(ID#2) ^^HOOK:^^ “Heads or Tails Showdown” – each learner predicts the number of heads in 20 tosses, then tosses."),
     card(26, 8, "Chance Lab", "Coin Toss", ["Toss 10 times, then 100 times, then 1 000 times."], ["What happens to the fraction of heads as the tosses grow?"],
          "Results vary in small experiments, but the relative frequency of heads settles near 1/2 as the number of tosses grows."),
     ("step", "(ID#3) The teacher will discuss experiment, trial, outcome, event, and relative frequency (number of times ÷ number of trials)."),
     card(26, 8, "Chance Lab", "Die Roll", ["Roll 60 times and count the prime numbers."], ["Which outcomes make up the event “a prime number”?"],
          "Outcomes can be listed in words or symbols, e.g. S = {1, 2, 3, 4, 5, 6} and E = {2, 3, 5}."),
     ("step", "(ID#6) The students will accomplish LW3.7 Coin and Die Lab (C8, M3): pool the class’s coin and die results in a frequency table and bar graph."),
     ("meet", "Meeting 3 (C8, M4): Solving Problems with Outcomes"),
     ("step", "(ID#4) The teacher will discuss using experimental results to make predictions."),
     ("ex", "Worked Examples", ["- 60 rolls gave 28 primes: relative frequency = 28/60 = **7/15 ≈ 0.47**",
                                "- A spinner landed on red 18 times in 50 spins. Predict for 200 spins: 18/50 × 200 = **72**"]),
     ("meet", "Meeting 4 (C8, M5): PT3.1 Scaffold #2"),
     card(26, 8, "Chance Lab", "Spinner Booth", ["Adjust the prize sector and run 200 plays."], ["Is the booth fair to players? Does it still raise funds?"],
          "A booth’s results can be predicted from many trials; the rules decide who the game favors."),
     ("step", "(ID#6) The students will accomplish PT3.1 – Scaffold #2: run at least 50 trial plays of their booth game, record them in a table, and graph them."),
     ("meet", "Meeting 5 (C9, M1): PT3.1 Scaffold #3"),
     ("step", "(ID#6) The students will accomplish PT3.1 – Scaffold #3: predict the number of winners for 200 players and use the earnings equation, "
              "with integers for gains and losses, to make a prize plan within the budget.")],
    "Chance is not cheating – unless the rules are hidden. A Lasallian booth is honest about its chances and fair to "
    "every player.",
    ["A coin landed heads 13 times in 25 tosses. What is the relative frequency of heads? (13/25 = 0.52)",
     "List the outcomes of rolling a die that are even. ({2, 4, 6})"],
    "We collected data from experiments, expressed outcomes in words, symbols, tables, and graphs, and solved problems "
    "using the results. Next, we write very large and very small numbers in scientific notation.",
    res(8, 26, "Experiments and Outcomes", ["Coins, dice, paper spinners", "Google Sheets"]))

L_I = lesson(
    "CYCLE 9, Meetings 2 to 5, and CYCLE 10, Meeting 1", "LESSON 9: I. Scientific Notation",
    "The Sun is about 150 000 000 km away; a virus is about 0.000 000 1 m wide. Counting zeros is slow and risky. "
    "Scientific notation writes both in a short, clear way.",
    ["Write numbers in scientific notation to represent very large or very small numbers, and vice versa.",
     "Perform operations on numbers expressed in scientific notation.", "Explain how the exponent shows the size of a number."], ["ZS", "CM"],
    [("meet", "Meeting 1 (C9, M2): Powers of Ten"),
     ("step", "(ID#2) ^^HOOK:^^ “From a Virus to the Sun” – arrange picture cards from smallest to largest."),
     card(27, 9, "Powers-of-Ten Zoom", "Zoom", ["Zoom from a virus to the Earth–Sun distance, stopping at each object."],
          ["How does the exponent change each time the scale is 10 times bigger?"],
          "Each step up multiplies by 10 and adds 1 to the exponent; small numbers have negative exponents."),
     ("step", "(ID#3) The teacher will discuss powers of ten, including 10⁰ = 1 and negative exponents such as 10⁻³ = 0.001."),
     ("meet", "Meetings 2–3 (C9, M3–M4): Writing Scientific Notation"),
     card(27, 9, "Powers-of-Ten Zoom", "Convert", ["Slide the decimal point to write 4 500 000 and 0.000 32 in scientific notation."],
          ["Which direction gives a positive exponent?"], "A number in scientific notation is a × 10ⁿ, with 1 ≤ a < 10 and n an integer."),
     ("step", "(ID#4) The teacher will discuss writing numbers in scientific notation and in standard form."),
     ("ex", "Worked Examples", ["- 4 500 000 = **4.5 × 10⁶**", "- 0.000 32 = **3.2 × 10⁻⁴**", "- 7.08 × 10⁵ = **708 000**"]),
     ("step", "(ID#6) The students will accomplish LW3.8 Powers-of-Ten Scale Strip (C9, M4): place 12 object cards on a paper strip by their power of ten and write each size in scientific notation."),
     ("meet", "Meeting 4 (C9, M5): Operations in Scientific Notation"),
     card(27, 9, "Powers-of-Ten Zoom", "Operate", ["Multiply, divide, and add numbers in scientific notation, then normalize the answers."], [],
          "Multiply or divide the coefficients and add or subtract the exponents; add or subtract only when the powers of ten match."),
     ("ex", "Worked Examples", ["- (3 × 10⁴)(2 × 10⁵) = **6 × 10⁹**", "- (8 × 10⁷) ÷ (4 × 10³) = **2 × 10⁴**",
                                "- (5 × 10³)(4 × 10²) = 20 × 10⁵ = **2 × 10⁶**", "- 3.2 × 10⁵ + 1.5 × 10⁵ = **4.7 × 10⁵**"]),
     ("meet", "Meeting 5 (C10, M1): Practice Set #5"),
     ("step", "(ID#5) The students will answer CP3.6 – Practice Set #5 (SimBook Exercises 9, Part A)."),
     ("step", "The teacher will remind the students of QZ3.3 next meeting (Lessons 7 to 9).")],
    "From a virus to the Sun, creation spans an amazing range of sizes. Scientific notation helps us appreciate and care "
    "for a world far bigger – and far smaller – than what we can see.",
    ["Write 36 000 000 in scientific notation. (3.6 × 10⁷)", "Write 5 × 10⁻³ in standard form. (0.005)"],
    "We wrote very large and very small numbers in scientific notation and computed with them. Next, we review and "
    "pitch our Family Day booths.",
    res(9, 27, "Scientific Notation", ["Picture cards, adding-machine paper strip"]))

QZ3 = quiz("CYCLE 10, Meeting 2", "QZ3.3", "Equations, Experiments, and Scientific Notation", "A11–A18, M7–M9, T1–T2")

# ------------------------------------------------------------------ RELEASE

PT_FINAL = [
    ("cycle", "CYCLE 10, Meeting 3"), ("lesson", "PT3.1 – Family Day Chance Booth Proposal"),
    ("ts", "Today your team opens its prototype booth to classmates and pitches it to the Family Day committee. Let your data and equations make the case."),
    ("p", "__(Note: Please refer to the detailed G.R.A.S.P. description and rubric on top of this LG.)__"),
    ("p", "(ID#1) **Goal:** Present a fun, fair chance game with tested results, a scoring equation, and a prize plan for 200 players."),
    ("step", "(ID#2) Scaffold #1 – Booth Rules and Scoring Equation was completed in C8, M1."),
    ("step", "(ID#3, ID#4) Scaffold #2 – Booth Experiment Data was completed in C8, M5."),
    ("step", "(ID#5) Scaffold #3 – Prize Plan was completed in C9, M1."),
    ("step", "(ID#6, ID#7) Booth fair (classmates play-test each booth) and 3-minute pitches with questions from the panel; classmates give feedback using a peer slip."),
    ("step", "(ID#8) Reflection: “When is a game of chance fair, and why does it matter?”"),
    ("step", "(ID#9) Using the rubric, each group reflects on its work and output."),
    ("pillar", ["CM", "ZS", "SF"], ["Designing a booth together builds teamwork and respect for others’ ideas.",
                                   "Accurate data, equations, and computations reflect excellence and accountability.",
                                   "A game that is honest about its chances lives out Lasallian integrity."]),
    ("res", ["Teacher-prepared PT3.1 Guidelines and Rubric", "Booth materials (coins, dice, spinners)", "Students’ PT3.1 output uploaded in Ranger360"]),
]
REVIEW = [
    ("sep",), ("cycle", "CYCLE 10, Meeting 4"), ("lesson", "Term Review: “Algebra Amazing Race”"),
    ("step", "(ID#5, ID#7) Teams race through six stations: (1) −7 + 12 − (−3) (8); (2) 4 − 3 × (−2)² (−8); (3) |−9| − |4| (5); "
             "(4) solve 3x + 7 = 31 (8); (5) make h the subject of A = bh (h = A ÷ b); (6) (6 × 10⁵)(3 × 10²) (1.8 × 10⁸)."),
    ("step", "(ID#9) Each student lists two topics to review further."),
    ("pillar", ["CM"]), ("res", ["Teacher-prepared station cards", "SimBook Check Yourself for every Term 3 lesson", R360]),
]
TERM_EXAM = [
    ("sep",), ("cycle", "CYCLE 10, Meeting 5"), ("lesson", "TERM EXAM"),
    ("h", "(ID#1, ID#8) Goals/Objectives:"),
    ("bul", ["Perform the four operations with integers and simplify expressions with GEMDAS; find absolute values.",
             "Evaluate and write expressions, solve simple equations, and rearrange formulas.",
             "Collect and represent outcomes of experiments and solve problems using them.",
             "Write numbers in scientific notation and compute with them."]),
    ("step", "(ID#3, ID#4) Part I – Multiple Choice: concepts and skills from Units H to J."),
    ("step", "(ID#5, ID#6) Part II – Constructed Response: integer computations, equations with justified steps, a rearranged formula, and scientific notation."),
    ("step", "(ID#7, ID#9) Part III – Problem Solving: real-life problems involving integers, equations, formulas, and experiment data."),
    ("pillar", ["SF"], ["Answering the exam honestly and independently reflects integrity."]),
    ("res", ["Teacher-made TE3.1"]),
    ("sep",), ("cycle", "CYCLE 11 (Buffer)"),
    ("p", "Cycle 11 is reserved for make-up assessments for excused absences, remediation and enrichment (using the SimBook), "
          "and adjustments for class suspensions and school activities."),
]

STAGES = [
    {"name": "DRAW", "desc": "Acquisition\n(Factual or Procedural Knowledge)", "blocks": ORIENTATION + L_A + L_B + L_C + QZ1},
    {"name": "TUNE", "desc": "Make-Meaning\n(Understanding, Processing)", "blocks": L_D + L_E + L_F + QZ2 + L_G + L_H + L_I + QZ3},
    {"name": "RELEASE", "desc": "Transfer\n(to Real-world applications or new situations as evidence of their learning)", "blocks": PT_FINAL + REVIEW + TERM_EXAM},
]

SIGNATORIES = _t1.SIGNATORIES
