"""Grade 8 Mathematics – Learning Guide, 1st Trimester, SY 2026-2027.

Companion to content/grade8_term1_cm.py (same codes, meetings, and assessments; lesson objectives
are read from the CM rows). Source of truth: DepEd MATATAG Grade 8 Mathematics Three-Term Budget of
Work, First Term. ID# tags follow the Grade 7 Term 1 LG (see its docstring).
"""

import importlib.util
from pathlib import Path


def _load(name):
    spec = importlib.util.spec_from_file_location(name, Path(__file__).with_name(f"{name}.py"))
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod


_g7 = _load("grade7_term1_lg")
_cm = _load("grade8_term1_cm")
SIMBOOK = _cm.SIMBOOK
R360 = "Materials uploaded in Ranger360"

HEADER = {"lines": ["LA SALLE GREEN HILLS", "Mathematics Department (Grade 8)", "1st Trimester, SY 2026-2027"], "title": "LEARNING GUIDE"}

OVERVIEW = [
    "Grade 8 Mathematics in the first trimester builds the tools of algebra. In **Data Check!**, learners find the mean, "
    "median, and mode of ungrouped data and decide which one tells the truth. In **Polynomial Power!**, they model real "
    "situations with algebraic expressions, operate on monomials and discover the laws of exponents, multiply polynomials "
    "and recognize special products, and factor polynomials completely. In **Rational Thinking!**, they simplify and "
    "operate on rational algebraic expressions and solve rational equations, including work problems. In **Patterns and "
    "Planes!**, they find rules for sequences and use the Cartesian plane to plot points and find distances and midpoints.",
    "For their end-of-term performance task, **Community Hub Planner**, learners act as student planners for their "
    "barangay: they factor the lot’s area expression to find its possible dimensions, summarize a resident survey with "
    "measures of central tendency, and use distance and midpoint on a coordinate map to place the hub fairly.",
    "Each lesson opens with a short simulation from the **LSGH Math 8 SimBook** as its hook. The lesson itself is taught "
    "in the usual way – the teacher’s discussion, definitions, and step-by-step worked examples, presented on the "
    "SimBook’s lesson slides with speaker notes – and practiced through the SimBook’s Check Yourself items and its "
    "Exercises (Part A Skills Practice, Part B Problem Solving, Part C Challenge).",
]

OUTCOMES = [("Math.G8.1", "Summarize data with measures of central tendency, use polynomials and rational expressions to "
                          "model and solve problems, and use patterns and the coordinate plane to describe and locate.")]

POLICIES = _g7.POLICIES

ASSESSMENT = [
    {"component": "Written Works (WW)", "weight": "20%", "groups": [
        ("CP - Participation – seatwork, recitation (40%)", [
            "CP1.1 - Recitation every meeting", "CP1.2 - Practice Set #1: Monomials and Exponents (C3, M1)",
            "CP1.3 - Practice Set #2: Products (C4, M3)", "CP1.4 - Practice Set #3: Rational Expressions (C7, M2)"]),
        ("QZ - Quizzes (60%)", ["QZ1.1 - Central Tendency, Polynomials, and Factoring (C5, M5)",
                                "QZ1.2 - Rational Algebraic Expressions and Equations (C8, M3)",
                                "QZ1.3 - Sequences and the Cartesian Plane (C10, M2)"])]},
    {"component": "Performance Task (PT)", "weight": "60%", "groups": [
        ("LW - Guided Hands-on Activities (30%)", ["LW1.1 - Class Data Survey (C1, M4)", "LW1.2 - Model It (C2, M2)",
                                                   "LW1.3 - Algebra Tiles Lab (C3, M4)", "LW1.4 - Factor Puzzle (C5, M1)",
                                                   "LW1.5 - Simplify and Restrict (C6, M3)", "LW1.6 - Pattern Hunt (C9, M1)",
                                                   "LW1.7 - Campus Map (C9, M5)"]),
        ("SA - Challenge Hands-on Activities (40%)", ["SA1.1 - Special Products Relay (C4, M2)", "SA1.2 - Work Together Challenge (C8, M1)"]),
        ("PT – End of Term PT (30%)", ["PT1.1 - Community Hub Plan", "Scaffolding#1 - Lot Plan (C5, M4)",
                                       "Scaffolding#2 - Resident Survey Summary (C8, M2)", "Scaffolding#3 - Hub Map (C10, M1)",
                                       "Final Presentation (C10, M3)"])]},
    {"component": "Final Exam", "weight": "20%", "groups": [("TE – Term Exam (100%) (C10, M5)", [])]},
]

STANDARDS = [
    {"label": "CONTENT STANDARD", "body": [("lead", _cm.STANDARDS[0]["lead"]), ("bul", _cm.STANDARDS[0]["items"])]},
    {"label": "PERFORMANCE STANDARD", "body": [("lead", _cm.STANDARDS[1]["lead"]), ("bul", _cm.STANDARDS[1]["items"])] + _g7.STANDARDS[1]["body"][2:]},
    {"label": "ENDURING UNDERSTANDING", "body": [("lead", _cm.STANDARDS[3]["lead"]), ("num", _cm.STANDARDS[3]["items"])]},
    {"label": "ESSENTIAL QUESTIONS", "body": [("lead", _cm.STANDARDS[2]["lead"]), ("num", _cm.STANDARDS[2]["items"])]},
    {"label": "TRANSFER GOAL", "body": [("p", _cm.STANDARDS[4]["text"])]},
    {"label": "PERFORMANCE TASK", "body": [
        ("center", "PT1.1 Community Hub Planner –"), ("center", "G.R.A.S.P. Performance Task"),
        ("h", "G – Goal"),
        ("p", "Your goal is to plan a community hub – a study and reading space – for your barangay: find the possible "
              "dimensions of its lot, learn what residents need from a survey, and place it fairly on the map."),
        ("h", "R – Role"),
        ("p", "You are a team of student planners working with the barangay council."),
        ("h", "A – Audience"), ("lead", "Your primary audience includes:"),
        ("bul", ["The barangay captain and council", "Residents of the two puroks the hub will serve", "Your classmates"]),
        ("h", "S – Situation"),
        ("p", "The council has a lot whose area is given by a polynomial expression and a coordinate map of the barangay. "
              "It wants the hub placed fairly between the two puroks, and its opening hours set from what residents report."),
        ("h", "P – Product / Performance"), ("lead", "You will create:"),
        ("p", "A **Community Hub Plan** (poster or slides) and a **3-minute presentation** that includes:"),
        ("bul", ["The factored area expression and two possible sets of lot dimensions",
                 "A resident survey summary with the mean, median, and mode, and the measure you chose and why",
                 "A coordinate map with the hub at the midpoint of the two puroks and the distances to key places",
                 "Recommendations supported by your computations"]),
        ("h", "S – Success Criteria / Standards"), ("lead", "Your work will be assessed based on:"),
        ("bul", [("Lot Dimensions", ["Correct, complete factoring and sensible dimensions. (15 points)"]),
                 ("Survey Summary", ["Correct measures of central tendency and a justified choice. (10 points)"]),
                 ("Hub Map", ["Correct coordinates, distances, and midpoint. (15 points)"]),
                 ("Recommendations and Presentation", ["Clear, evidence-based, and respectful. (10 points)"])]),
        ("p", "**Total: 50 points**"),
    ]},
]

UNITS = [
    {"title": "Unit A · DATA CHECK! Measures of Central Tendency", "lessons": [
        ("A. Measures of Central Tendency", ["Mean, median, and mode of ungrouped data", "Drawing conclusions"])]},
    {"title": "Unit B · POLYNOMIAL POWER! Expressions, Special Products, and Factoring", "lessons": [
        ("B. Algebraic Expressions as Models", ["Modeling real-life situations"]),
        ("C. Operations on Monomials and the Laws of Exponents", ["Like terms; laws of exponents"]),
        ("D. Multiplying Polynomials and Special Products", ["Area models; special products"]),
        ("E. Factoring Polynomials", ["Common monomial factor, difference of two squares, trinomials"])]},
    {"title": "Unit C · RATIONAL THINKING! Rational Algebraic Expressions and Equations", "lessons": [
        ("F. Rational Algebraic Expressions", ["Simplifying and operating"]),
        ("G. Rational Algebraic Equations", ["Cross-multiplication; work problems"])]},
    {"title": "Unit D · PATTERNS AND PLANES! Sequences and the Cartesian Plane", "lessons": [
        ("H. Sequences and Patterns", ["Finding the rule"]),
        ("I. The Cartesian Plane, Distance, and Midpoint", ["Plotting points; distance and midpoint"])]},
    {"title": "End-of-Term Performance Task: Community Hub Planner", "lessons": [
        ("Scaffolding#1:", ["Lot plan"]), ("Scaffolding#2:", ["Resident survey summary"]),
        ("Scaffolding#3:", ["Hub map"]), ("Final Presentation:", ["Presentation to the panel"])]},
]

MARK = []
for r in _cm.ROWS:
    for c in r.get("comps", []):
        if isinstance(c, tuple):
            MARK.append((f"{c[0]}.", c[2] + (" ★" if c[1] else "")))


def objectives(letter):
    """The lesson's competencies, word for word from the CM row."""
    row = next(r for r in _cm.ROWS if r.get("type") == "row" and r.get("topic", "").startswith(f"{letter}. "))
    return [c[2] for c in row["comps"] if isinstance(c, tuple)], row["pillars"]


# ------------------------------------------------------------------ helpers

def card(n_global, n_term, sim, tab, mission, questions, discovery, setup="Pairs, one device; record findings in the notebook"):
    return ("sim", {"kind": "SIM HOOK", "title": f"{sim} – {tab}",
                    "tool": f"LSGH Math 8 SimBook · Term 1 Lesson {n_term} · {sim} ({tab} tab)",
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
    return [f"LSGH Math 8 SimBook - Term 1 Lesson {n_term} ({SIMBOOK}#lesson{n_global})",
            f"SimBook Lesson {n_term} slides with speaker notes (use Present for the projector)",
            f"SimBook Exercises {n_term} – Part A as seatwork; Parts B and C as homework",
            f"Teacher’s Google presentation - Lesson {n_term}: {title}", *extra, R360]




# ------------------------------------------------------------------ DRAW

ORIENTATION = [
    ("cycle", "CYCLE 1, Meeting 1"), ("lesson", "LESSON: Class Orientation – “Math Builds Our Community!”"),
    ("h", "INTRODUCTION:"),
    ("q", "Welcome to Grade 8! This year, the numbers you know become the tools of algebra. This term we summarize data, "
          "build and break apart polynomials, work with algebraic fractions, find patterns, and map our community on the "
          "coordinate plane – and use all of these to plan a community hub."),
    ("h", "OBJECTIVES: (ID#1)"),
    ("obj", ["Review the Term 1 course outline and roadmap.", "Describe the learning outcomes, grading components, and their percentage weights.",
             "Explain classroom policies, attendance requirements, and academic integrity guidelines."], ["ZS", "SF"]),
    ("h", "ACTIVITIES:"),
    ("step", "(ID#2) ^^HOOK:^^ “Mystery Lot” – a vacant lot’s area is x² + 7x + 12. What could its length and width be? Learners guess."),
    ("step", "(ID#3) The teacher will discuss the Term 1 roadmap: Units A to D and the performance task “Community Hub Planner.”"),
    ("step", "(ID#4) The teacher will discuss the methods of assessment and their weights."),
    ("step", "(ID#5) The teacher will review classroom procedures and the Mathematics Department policies."),
    ("h", "WRAP UP ACTIVITY: “Grade 7 to Grade 8” One-minute Reflection (ID#6)"),
    ("bul", ["One skill from Grade 7 I am proud of is ____.", "One thing I want to master in Grade 8 is ____."]),
    ("h", "VALUING STATEMENT: (ID#8)"),
    ("q", "Mathematics is a tool for serving others. This term, let us use it carefully and honestly for our community."),
    ("res", ["Teacher’s Google presentation - Class Orientation", "Student Handbook", R360]),
]

L_A = lesson(
    "CYCLE 1, Meetings 2 to 5", "LESSON 1: A. Measures of Central Tendency",
    "“The average allowance in our class is ₱136.” Is that true for most of us? One very large value can change the "
    "average. Today we learn three ways to find the center of data – and how to choose the fair one.",
    *objectives("A"),
    [("meet", "Meetings 1–2 (C1, M2–M3): Mean, Median, and Mode"),
     ("step", "(ID#2) ^^HOOK:^^ “Average Allowance” – one classmate’s very large allowance changes the class average. Is it still fair?"),
     card(1, 1, "Center Finder", "Balance Point", ["Drag the values and watch where the beam balances.", "Move one value far to the right."],
          ["Where does the beam balance? What happens to the median?"],
          "The mean is the balance point of the data; the median is the middle value; the mode is the most frequent value."),
     ("step", "(ID#3) The teacher will discuss the mean, median (odd and even number of values), and mode of ungrouped data."),
     ("ex", "Worked Examples", ["Travel times (minutes): 12, 15, 15, 18, 20, 25, 35",
                                "- Mean = 140 ÷ 7 = **20 min**; median = **18 min**; mode = **15 min**"]),
     ("meet", "Meeting 3 (C1, M4): Class Data Survey"),
     ("step", "(ID#6) The students will accomplish LW1.1 Class Data Survey: collect the class’s travel times, compute the mean, median, and mode, and write a conclusion."),
     ("meet", "Meeting 4 (C1, M5): Outliers and Choosing a Measure"),
     card(1, 1, "Center Finder", "Outlier Effect and Which Measure?", ["Add and remove the outlier.", "Choose the best measure for each scenario."],
          ["Which measure resists the outlier?"], "The median resists outliers; the mode suits categories; the mean uses every value."),
     ("step", "(ID#4) The teacher will discuss outliers and drawing conclusions from the measures."),
     ("ex", "Worked Example", ["Allowances (₱): 50, 60, 60, 70, 80, 500", "- Mean = 820 ÷ 6 ≈ **₱136.67**; median = (60 + 70) ÷ 2 = **₱65**; mode = **₱60**",
                               "- The median best describes a typical learner, because ₱500 is an outlier"])],
    "A fair summary describes everyone, not just the loudest value. Choosing the right measure is an act of honesty.",
    ["Find the median of 4, 9, 2, 7, 5. (5)", "Which measure would a shoe store use to decide which size to stock most? (Mode)"],
    "We found the mean, median, and mode and learned when each is fair. Next, we use algebra to model real situations.",
    res(1, 1, "Measures of Central Tendency", ["Class survey sheet"]))

L_B = lesson(
    "CYCLE 2, Meetings 1 to 2", "LESSON 2: B. Algebraic Expressions as Models",
    "A load plan costs ₱99 plus ₱5 for each day of data. Instead of computing every case, one expression describes them all.",
    *objectives("B"),
    [("meet", "Meeting 1 (C2, M1): Building Models"),
     ("step", "(ID#2) ^^HOOK:^^ “Load Plan” – ₱99 plus ₱5 a day: what does a month cost? Any number of days?"),
     card(2, 2, "Expression Modeler", "Build the Model", ["Build the expressions for the garden and the load plan.", "Slide x and watch the picture."],
          ["What does each term mean in the situation?"], "An algebraic expression models a situation: each term stands for a part of it."),
     ("step", "(ID#3) The teacher will discuss modeling real-life situations with algebraic expressions."),
     ("ex", "Worked Examples", ["- A garden x m wide and 3 m longer: perimeter **4x + 6**, area **x² + 3x**",
                                "- Load plan for d days: **99 + 5d**; for 30 days: 99 + 150 = **₱249**"]),
     ("meet", "Meeting 2 (C2, M2): Model It"),
     card(2, 2, "Expression Modeler", "Match It", ["Match every situation to its expression."], [], "Key words and quantities show how to build the model."),
     ("step", "(ID#6) The students will accomplish LW1.2 Model It: write expressions for five school and home situations and evaluate them.")],
    "Models help us plan wisely – for our budget, our time, and our community.",
    ["Write an expression for the cost of n notebooks at ₱35 each plus a ₱20 bag. (35n + 20)", "Evaluate 4x + 6 when x = 5. (26)"],
    "We modeled situations with algebraic expressions. Next, we learn to operate on monomials.",
    res(2, 2, "Algebraic Expressions as Models", []))

L_C = lesson(
    "CYCLE 2, Meetings 3 to 5, and CYCLE 3, Meeting 1", "LESSON 3: C. Operations on Monomials and the Laws of Exponents",
    "Fold a sheet of paper in half, again and again. After 5 folds there are 2⁵ = 32 layers; after 10 folds, 1 024. "
    "Exponents describe repeated multiplication – and they follow simple laws.",
    *objectives("C"),
    [("meet", "Meeting 1 (C2, M3): Adding and Subtracting Monomials"),
     ("step", "(ID#2) ^^HOOK:^^ “Paper Fold” – how many layers after 5 folds? 10?"),
     card(3, 3, "Exponent Lab", "Like Terms", ["Combine the tiles for 3x + 2x and 4x² − x²."], ["Can x² and x tiles combine?"],
          "Only like terms combine: add or subtract their numerical coefficients."),
     ("step", "(ID#3) The teacher will discuss like terms and adding and subtracting monomials."),
     ("ex", "Worked Examples", ["- 3x + 5x = **8x**", "- 7a² − 2a² = **5a²**", "- 4x + 3y cannot be combined"]),
     ("meet", "Meetings 2–3 (C2, M4–M5): Multiplying and Dividing Monomials"),
     card(3, 3, "Exponent Lab", "Expand the Powers and Laws Table", ["Expand x³ · x², x⁵ ÷ x², and (x²)³.", "Predict each law before revealing it."],
          ["How do the exponents combine?"],
          "aᵐ · aⁿ = aᵐ⁺ⁿ; aᵐ ÷ aⁿ = aᵐ⁻ⁿ; (aᵐ)ⁿ = aᵐⁿ; (ab)ⁿ = aⁿbⁿ; a⁰ = 1 (a ≠ 0)."),
     ("step", "(ID#4) The teacher will derive the laws of exponents from repeated multiplication."),
     ("ex", "Worked Examples", ["- (3x²)(4x³) = **12x⁵**", "- 12x⁶ ÷ 3x² = **4x⁴**", "- (x²)³ = **x⁶**", "- x³ ÷ x³ = x⁰ = **1**"]),
     ("meet", "Meeting 4 (C3, M1): Practice Set #1"),
     ("step", "(ID#5) The students will answer CP1.2 – Practice Set #1 (SimBook Exercises 3, Part A, may be used).")],
    "Exponents grow quickly – like small acts of kindness that multiply when shared.",
    ["Simplify (2a³)(5a⁴). (10a⁷)", "Simplify (y⁴)². (y⁸)"],
    "We operated on monomials and derived the laws of exponents. Next, we multiply polynomials and find special products.",
    res(3, 3, "Operations on Monomials and the Laws of Exponents", ["Algebra tiles"]))

L_D = lesson(
    "CYCLE 3, Meetings 2 to 5, and CYCLE 4, Meetings 1 to 3", "LESSON 4: D. Multiplying Polynomials and Special Products",
    "A square garden x m on a side grows by 2 m on each side. Is the new area just 4 m² more? Area models show exactly "
    "how the new area is built.",
    *objectives("D"),
    [("meet", "Meetings 1–2 (C3, M2–M3): Multiplying Polynomials"),
     ("step", "(ID#2) ^^HOOK:^^ “Bigger Garden” – a square garden grows by 2 m on each side. Is the new area just 4 m² more?"),
     card(4, 4, "Area Builder", "Area Model", ["Build (x + 3)(x + 5) with the sliders.", "Try negative values for a and b."],
          ["Where does the middle term come from?"], "Each part of one factor multiplies each part of the other: the distributive property."),
     ("step", "(ID#3) The teacher will discuss multiplying a monomial by a polynomial and a binomial by a polynomial with area models."),
     ("ex", "Worked Examples", ["- 2x(x² − 3x + 4) = **2x³ − 6x² + 8x**", "- (x + 3)(x + 5) = **x² + 8x + 15**",
                                "- (x + 2)(x² + x − 1) = **x³ + 3x² + x − 2**"]),
     ("meet", "Meeting 3 (C3, M4): Algebra Tiles Lab"),
     ("step", "(ID#6) The students will accomplish LW1.3 Algebra Tiles Lab: build products with tiles and record each step."),
     ("meet", "Meetings 4–5 (C3, M5 – C4, M1): Special Products"),
     card(4, 4, "Area Builder", "Special Products", ["Pull apart (a + b)² and (a + b)(a − b)."], ["Why does the middle term disappear in (a + b)(a − b)?"],
          "(a + b)² = a² + 2ab + b²; (a − b)² = a² − 2ab + b²; (a + b)(a − b) = a² − b²."),
     ("step", "(ID#4) The teacher will discuss special products: the square of a binomial and the product of the sum and difference of two terms."),
     ("ex", "Worked Examples", ["- (x + 2)² = **x² + 4x + 4** – the garden grows by 4x + 4 m², not 4 m²",
                                "- (2x − 3)(2x + 3) = **4x² − 9**", "- (3y − 1)² = **9y² − 6y + 1**"]),
     ("meet", "Meeting 6 (C4, M2): Special Products Relay"),
     ("step", "(ID#6, ID#7) The students will accomplish SA1.1 Special Products Relay: teams race through special products and check each with an area model."),
     ("meet", "Meeting 7 (C4, M3): Practice Set #2"),
     card(4, 4, "Area Builder", "Pattern Match", ["Match each product to its pattern."], [], "Recognizing the pattern makes multiplying fast."),
     ("step", "(ID#5) The students will answer CP1.3 – Practice Set #2 (SimBook Exercises 4, Part A).")],
    "Every part of one factor meets every part of the other. In a community, too, everyone’s contribution counts.",
    ["Multiply (x + 4)(x − 4). (x² − 16)", "Expand (x + 5)². (x² + 10x + 25)"],
    "We multiplied polynomials and learned the special product patterns. Next, we reverse the process: factoring.",
    res(4, 4, "Multiplying Polynomials and Special Products", ["Algebra tiles"]))

L_E = lesson(
    "CYCLE 4, Meetings 4 to 5, and CYCLE 5, Meetings 1 to 4", "LESSON 5: E. Factoring Polynomials",
    "Multiplying turns factors into a product. Factoring goes the other way: from the area x² + 7x + 12 back to the "
    "length and width of the lot.",
    *objectives("E"),
    [("meet", "Meetings 1–2 (C4, M4–M5): Common Monomial Factor and Difference of Two Squares"),
     ("step", "(ID#2) ^^HOOK:^^ “Mystery Lot” returns – rearrange the tiles of x² + 7x + 12 into a rectangle."),
     card(5, 5, "Factor Puzzle", "Make a Rectangle", ["Arrange the tiles of x² + 7x + 12 into a rectangle.", "Try x² + 6x + 9."],
          ["What are the side lengths? Why is the second one a square?"], "When the tiles form a rectangle, its sides are the factors."),
     ("step", "(ID#3) The teacher will discuss factoring the greatest common monomial factor and the difference of two squares."),
     ("ex", "Worked Examples", ["- 6x² + 9x = **3x(2x + 3)**", "- x² − 49 = **(x + 7)(x − 7)**", "- 2x² − 8 = 2(x² − 4) = **2(x + 2)(x − 2)**"]),
     ("meet", "Meetings 3–4 (C5, M1–M2): Factoring Trinomials"),
     ("step", "(ID#6) The students will accomplish LW1.4 Factor Puzzle (C5, M1): factor polynomials with tiles and check by multiplying."),
     card(5, 5, "Factor Puzzle", "Factor Detective", ["Decide the type, then factor completely, for five polynomials."], [],
          "Always take out the common factor first, then look for a special pattern or two numbers with the right sum and product."),
     ("step", "(ID#4) The teacher will discuss factoring quadratic trinomials, including perfect square trinomials."),
     ("ex", "Worked Examples", ["- x² + 7x + 12: 3 × 4 = 12 and 3 + 4 = 7 → **(x + 3)(x + 4)**", "- x² + 6x + 9 = **(x + 3)²**",
                                "- x² − x − 12: −4 × 3 = −12 and −4 + 3 = −1 → **(x − 4)(x + 3)**"]),
     ("meet", "Meeting 5 (C5, M3): Problems"),
     card(5, 5, "Factor Puzzle", "Problems", ["Solve the area and dimension problems."], [], "Factoring an area expression gives possible dimensions."),
     ("ex", "Worked Example", ["A lot has area x² + 7x + 12 m² = (x + 3)(x + 4) m². If x = 10: **13 m by 14 m**, and 13 × 14 = 182 = 100 + 70 + 12 ✓"]),
     ("meet", "Meeting 6 (C5, M4): PT1.1 Launch and Scaffold #1"),
     ("step", "(ID#3) The teacher will introduce PT1.1 Community Hub Planner: the G.R.A.S.P. description, rubric, and groupings."),
     ("step", "(ID#6) The students will accomplish PT1.1 – Scaffold #1: factor the lot’s area expression and give two possible sets of dimensions."),
     ("step", "The teacher will remind the students of QZ1.1 next meeting (Lessons 1 to 5).")],
    "Breaking a problem into its factors helps us understand it. Working through hard things step by step is a habit of excellence.",
    ["Factor x² − 25. ((x + 5)(x − 5))", "Factor x² + 9x + 20. ((x + 4)(x + 5))"],
    "We factored polynomials of different types and used factoring to solve problems. Next, we review in QZ1.1.",
    res(5, 5, "Factoring Polynomials", ["Algebra tiles", "Teacher-prepared PT1.1 Guidelines and Rubric"]))

QZ1 = quiz("CYCLE 5, Meeting 5", "QZ1.1", "Central Tendency, Polynomials, and Factoring", "A1–A9, M1–M5, T1", items=30)

# ------------------------------------------------------------------ TUNE

L_F = lesson(
    "CYCLE 6, Meetings 1 to 5, and CYCLE 7, Meetings 1 to 2", "LESSON 6: F. Rational Algebraic Expressions",
    "Is (x² − 9)/(x − 3) the same as x + 3? Try x = 5: both give 8. Try x = 3: one gives 6 and the other cannot be computed. "
    "Rational algebraic expressions behave like fractions – with one important warning.",
    *objectives("F"),
    [("meet", "Meetings 1–3 (C6, M1–M3): Simplifying and Excluded Values"),
     ("step", "(ID#2) ^^HOOK:^^ “Same Answer?” – is (x² − 9)/(x − 3) the same as x + 3? Try x = 5. Try x = 3."),
     card(6, 6, "Fraction Machine", "Simplify and Restrictions", ["Simplify three expressions and watch the common factors cancel.", "Slide x to an excluded value."],
          ["What happens at the excluded value?"], "Cancel common factors, not terms; values that make a denominator zero are excluded."),
     ("step", "(ID#3) The teacher will discuss rational algebraic expressions, excluded values, and simplifying by factoring."),
     ("ex", "Worked Examples", ["- (x² − 9)/(x − 3) = (x + 3)(x − 3)/(x − 3) = **x + 3**, x ≠ 3",
                                "- (x² + 5x + 6)/(x² − 4) = (x + 2)(x + 3)/((x + 2)(x − 2)) = **(x + 3)/(x − 2)**, x ≠ ±2"]),
     ("step", "(ID#6) The students will accomplish LW1.5 Simplify and Restrict (C6, M3): simplify expressions and state their excluded values."),
     ("meet", "Meetings 4–6 (C6, M4 – C7, M1): Operations"),
     card(6, 6, "Fraction Machine", "Operate", ["Multiply, divide, add, and subtract with the machine."], [],
          "Operations follow the rules for fractions: multiply across, divide by multiplying by the reciprocal, and use the LCD to add or subtract."),
     ("step", "(ID#4) The teacher will discuss multiplying, dividing, adding, and subtracting rational algebraic expressions."),
     ("ex", "Worked Examples", ["- (x/(x + 1)) · ((x² − 1)/x²) = **(x − 1)/x**, x ≠ 0, −1",
                                "- 2/x + 3/(x + 1) = (2(x + 1) + 3x)/(x(x + 1)) = **(5x + 2)/(x(x + 1))**"]),
     ("meet", "Meeting 7 (C7, M2): Practice Set #3"),
     ("step", "(ID#5) The students will answer CP1.4 – Practice Set #3 (SimBook Exercises 6, Part A).")],
    "Some values are not allowed – and knowing our limits is wisdom. Careful checking keeps our answers honest.",
    ["Simplify (x² − 16)/(x + 4). (x − 4, x ≠ −4)", "What value of x is excluded in 5/(x − 7)? (7)"],
    "We simplified and operated on rational algebraic expressions and stated excluded values. Next, we solve rational equations.",
    res(6, 6, "Rational Algebraic Expressions", []), sep=False)

L_G = lesson(
    "CYCLE 7, Meetings 3 to 5, and CYCLE 8, Meetings 1 to 2", "LESSON 7: G. Rational Algebraic Equations",
    "Three friends can paint a wall in 4 hours. How long would five friends take? Questions like this lead to equations "
    "with algebraic fractions – and cross-multiplication solves them.",
    *objectives("G"),
    [("meet", "Meetings 1–2 (C7, M3–M4): Cross-Multiplication"),
     ("step", "(ID#2) ^^HOOK:^^ “Paint the Wall” – 3 friends take 4 hours. Do 5 friends take 2.4 hours?"),
     card(7, 7, "Work-Rate Lab", "Cross-Multiply", ["Solve three equations and check each.", "Find the equation whose answer must be rejected."],
          ["Why must some answers be rejected?"], "Cross-multiplying turns a proportion into a linear equation; any answer that makes a denominator zero is rejected."),
     ("step", "(ID#3) The teacher will discuss solving rational algebraic equations by cross-multiplication and checking."),
     ("ex", "Worked Examples", ["- 3/(x + 2) = 5/(x + 6) → 3(x + 6) = 5(x + 2) → 3x + 18 = 5x + 10 → **x = 4**; check: 3/6 = 5/10 ✓",
                                "- x/(x − 2) = 2/(x − 2) → x = 2, which makes the denominator zero → **no solution**"]),
     ("meet", "Meetings 3–4 (C7, M5 – C8, M1): Work and Proportion Problems"),
     card(7, 7, "Work-Rate Lab", "Work Together", ["Set each worker’s time and watch the tank fill."], [],
          "Rates add: 1/a + 1/b = 1/t, where t is the time working together."),
     ("ex", "Worked Examples", ["- Ana paints a room in 6 h and Ben in 3 h: 1/6 + 1/3 = 1/t → 1/2 = 1/t → **t = 2 h**",
                                "- 3 friends × 4 h = 12 friend-hours; 5 friends: 12 ÷ 5 = **2.4 h**"]),
     ("step", "(ID#6, ID#7) The students will accomplish SA1.2 Work Together Challenge (C8, M1): solve and check work and proportion problems in teams."),
     ("meet", "Meeting 5 (C8, M2): PT1.1 Scaffold #2"),
     ("step", "(ID#6) The students will accomplish PT1.1 – Scaffold #2: survey residents (classmates’ families) on travel time and preferred hours, "
              "and summarize with the mean, median, and mode."),
     ("step", "The teacher will remind the students of QZ1.2 next meeting (Lessons 6 and 7).")],
    "Working together finishes the job sooner. Our shared effort is worth more than the sum of our separate efforts.",
    ["Solve 2/x = 6/9. (3)", "Pipe A fills a tank in 4 h and pipe B in 12 h. How long together? (3 h)"],
    "We solved rational equations by cross-multiplication and used them for work and proportion problems. Next, we review in QZ1.2.",
    res(7, 7, "Rational Algebraic Equations", []))

QZ2 = quiz("CYCLE 8, Meeting 3", "QZ1.2", "Rational Algebraic Expressions and Equations", "A10–A12, M6–M7")

L_H = lesson(
    "CYCLE 8, Meetings 4 to 5, and CYCLE 9, Meetings 1 to 2", "LESSON 8: H. Sequences and Patterns",
    "How many matchsticks make 10 squares in a row? 100? Instead of building them all, we find the rule.",
    *objectives("H"),
    [("meet", "Meetings 1–2 (C8, M4–M5): Growing Patterns"),
     ("step", "(ID#2) ^^HOOK:^^ “Matchstick Squares” – how many matchsticks for 10 squares in a row? For 100?"),
     card(8, 8, "Pattern Builder", "Growing Patterns", ["Grow the matchstick pattern to step 6 and record the terms."], ["By how much does each term grow?"],
          "A constant difference means the rule is linear: add the same number each time."),
     ("step", "(ID#3) The teacher will discuss sequences, terms, and finding the next term from a pattern."),
     ("ex", "Worked Examples", ["- Matchsticks: 4, 7, 10, … → add 3 → rule **3n + 1**; 10 squares: **31**; 100 squares: **301**",
                                "- 5, 8, 11, … → **3n + 2**", "- 2, 6, 18, … → multiply by 3 → next term **54**"]),
     ("meet", "Meeting 3 (C9, M1): Pattern Hunt"),
     card(8, 8, "Pattern Builder", "Find the Rule and Real Patterns", ["Discover the rule for five sequences.", "Explore the savings and seating patterns."], [],
          "Rules can add a constant, multiply by a constant, or follow other patterns such as square numbers."),
     ("step", "(ID#6) The students will accomplish LW1.6 Pattern Hunt: find, describe, and test rules for patterns found around the school."),
     ("meet", "Meeting 4 (C9, M2): Rules in Words and Symbols"),
     ("ex", "Worked Example", ["Savings: ₱50, then ₱20 more each week: 50, 70, 90, … → **20n + 30**; week 10: **₱230**"]),
     ("step", "(ID#5) Learners answer SimBook Exercises 8, Part A.")],
    "Patterns help us see order in the world. Steady habits, like steady sequences, lead somewhere predictable and good.",
    ["Find the next term: 1, 4, 9, 16, … (25)", "Write the rule for 7, 11, 15, … (4n + 3)"],
    "We found and wrote rules for sequences. Next, we map points on the Cartesian plane.",
    res(8, 8, "Sequences and Patterns", ["Matchsticks or toothpicks"]))

L_I = lesson(
    "CYCLE 9, Meetings 3 to 5, and CYCLE 10, Meeting 1", "LESSON 9: I. The Cartesian Plane, Distance, and Midpoint",
    "How far is the canteen from the gate – in a straight line? On a coordinate map, every place has an address of two "
    "numbers, and distances and midpoints can be computed.",
    *objectives("I"),
    [("meet", "Meeting 1 (C9, M3): The Cartesian Plane"),
     ("step", "(ID#2) ^^HOOK:^^ “Treasure Grid” – find the hidden treasure using coordinate clues."),
     card(9, 9, "Barangay Map", "Plot It", ["Plot the gate, canteen, chapel, and court.", "Read the coordinates of five places."],
          ["In which quadrant is each place?"], "Every point has an ordered pair (x, y); the axes divide the plane into four quadrants."),
     ("step", "(ID#3) The teacher will discuss the Cartesian coordinate plane: axes, origin, quadrants, and ordered pairs."),
     ("meet", "Meeting 2 (C9, M4): Distance"),
     card(9, 9, "Barangay Map", "Distance", ["Drag two points and watch the right triangle."], ["How are the legs of the triangle found?"],
          "The distance between two points is √((x₂ − x₁)² + (y₂ − y₁)²), from the right triangle on the grid."),
     ("step", "(ID#4) The teacher will discuss the distance between two points (horizontal, vertical, and the distance formula)."),
     ("ex", "Worked Examples", ["- (1, 2) to (4, 6): √(3² + 4²) = √25 = **5 units**",
                                "- Gate (0, 0) to canteen (6, 8): √(36 + 64) = **10 units** = 10 × 50 m = **500 m**"]),
     ("meet", "Meeting 3 (C9, M5): Midpoint and Campus Map"),
     card(9, 9, "Barangay Map", "Midpoint", ["Find the waiting shed halfway between two places."], [],
          "The midpoint is ((x₁ + x₂)/2, (y₁ + y₂)/2)."),
     ("ex", "Worked Example", ["Midpoint of (−4, 1) and (6, −3) = ((−4 + 6)/2, (1 + (−3))/2) = **(1, −1)**"]),
     ("step", "(ID#6) The students will accomplish LW1.7 Campus Map: map campus landmarks on a grid and compute distances and midpoints."),
     ("meet", "Meeting 4 (C10, M1): PT1.1 Scaffold #3"),
     ("step", "(ID#6) The students will accomplish PT1.1 – Scaffold #3: place the hub at the midpoint of the two puroks and compute its distances to key places."),
     ("step", "The teacher will remind the students of QZ1.3 next meeting (Lessons 8 and 9).")],
    "A fair place for a community hub is one that serves everyone. Mathematics can help us be fair to all.",
    ["In which quadrant is (−2, −5)? (Quadrant III)", "Find the midpoint of (2, 3) and (8, 7). ((5, 5))"],
    "We plotted points, found distances, and located midpoints on the Cartesian plane. Next, we review and present our community hub plans.",
    res(9, 9, "The Cartesian Plane, Distance, and Midpoint", ["Graphing paper"]))

QZ3 = quiz("CYCLE 10, Meeting 2", "QZ1.3", "Sequences and the Cartesian Plane", "A13–A16, M8–M9, T2", items=20)

# ------------------------------------------------------------------ RELEASE

PT_FINAL = [
    ("cycle", "CYCLE 10, Meeting 3"), ("lesson", "PT1.1 – Community Hub Plan"),
    ("ts", "Today your team presents its community hub plan to the barangay council. Let your computations make the case."),
    ("p", "__(Note: Please refer to the detailed G.R.A.S.P. description and rubric on top of this LG.)__"),
    ("p", "(ID#1) **Goal:** Present a community hub plan with lot dimensions, a survey summary, and a fair location on the map."),
    ("step", "(ID#2) Scaffold #1 – Lot Plan was completed in C5, M4."),
    ("step", "(ID#3, ID#4) Scaffold #2 – Resident Survey Summary was completed in C8, M2."),
    ("step", "(ID#5) Scaffold #3 – Hub Map was completed in C10, M1."),
    ("step", "(ID#6, ID#7) Gallery walk and 3-minute group presentations with questions from the panel; classmates give feedback using a peer slip."),
    ("step", "(ID#8) Reflection: “How can mathematics help us serve our community?”"),
    ("step", "(ID#9) Using the rubric, each group reflects on its work and output."),
    ("pillar", ["CM", "ZS", "SF"], ["Planning together builds dialogue and respect for others’ ideas.",
                                   "Accurate computations reflect excellence and accountability.",
                                   "Serving the community lives out Lasallian faith and values."]),
    ("res", ["Teacher-prepared PT1.1 Guidelines and Rubric", "Students’ PT1.1 output uploaded in Ranger360"]),
]
REVIEW = [
    ("sep",), ("cycle", "CYCLE 10, Meeting 4"), ("lesson", "Term Review: “Math Amazing Race”"),
    ("step", "(ID#5, ID#7) Teams race through six stations: (1) the mean of 4, 7, 7, 10, 12 (8); (2) expand (x + 4)² (x² + 8x + 16); "
             "(3) factor x² − x − 12 ((x − 4)(x + 3)); (4) simplify (x² − 16)/(x + 4) (x − 4); (5) the next term of 3, 7, 11 (15); "
             "(6) the distance from (0, 0) to (5, 12) (13)."),
    ("step", "(ID#9) Each student lists two topics to review further."),
    ("pillar", ["CM"]), ("res", ["Teacher-prepared station cards", "SimBook Check Yourself for every Term 1 lesson", R360]),
]
TERM_EXAM = [
    ("sep",), ("cycle", "CYCLE 10, Meeting 5"), ("lesson", "TERM EXAM"),
    ("h", "(ID#1, ID#8) Goals/Objectives:"),
    ("bul", ["Determine measures of central tendency and draw conclusions.", "Model situations, operate on monomials, multiply polynomials, and factor completely.",
             "Simplify and operate on rational algebraic expressions and solve rational equations.",
             "Find rules for sequences, and plot points and find distances and midpoints on the Cartesian plane."]),
    ("step", "(ID#3, ID#4) Part I – Multiple Choice: concepts and skills from Units A to D."),
    ("step", "(ID#5, ID#6) Part II – Constructed Response: special products, factoring, rational expressions, and coordinate computations."),
    ("step", "(ID#7, ID#9) Part III – Problem Solving: real-life problems involving data, polynomials, rational equations, and the coordinate plane."),
    ("pillar", ["SF"], ["Answering the exam honestly and independently reflects integrity."]),
    ("res", ["Teacher-made TE1.1"]),
    ("sep",), ("cycle", "CYCLE 11 (Buffer)"),
    ("p", "Cycle 11 is reserved for make-up assessments for excused absences, remediation and enrichment (using the SimBook), "
          "and adjustments for class suspensions and school activities."),
]

STAGES = [
    {"name": "DRAW", "desc": "Acquisition\n(Factual or Procedural Knowledge)", "blocks": ORIENTATION + L_A + L_B + L_C + L_D + L_E + QZ1},
    {"name": "TUNE", "desc": "Make-Meaning\n(Understanding, Processing)", "blocks": L_F + L_G + QZ2 + L_H + L_I + QZ3},
    {"name": "RELEASE", "desc": "Transfer\n(to Real-world applications or new situations as evidence of their learning)", "blocks": PT_FINAL + REVIEW + TERM_EXAM},
]

SIGNATORIES = [
    {"label": "Prepared by:", "names": ["[Name of Teacher]", "[Name of Teacher]"], "role": "Grade 8 Mathematics Teacher"},
    {"label": "Approved by:", "names": ["[Name of Subject Coordinator]"], "role": "Subject Coordinator"},
]
