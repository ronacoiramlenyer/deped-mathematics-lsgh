"""Fundamentals of Data Analytics – Learning Guide, SY 2026-2027.

Companion to content/data_analytics_cm.py: the same sessions (S1–S80), codes, and assessments.
Lesson objectives are read from the CM rows so the two documents cannot drift apart.
Source of truth: DepEd Strengthened SHS Curriculum Guide, Fundamentals of Data Analytics
(sources/deped/). ID# tags follow the Mathematics LGs (see grade7_term1_lg.py).
"""

import importlib.util
import re
from pathlib import Path


def _load(name, path):
    spec = importlib.util.spec_from_file_location(name, path)
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod


_here = Path(__file__).resolve().parent
_cm = _load("da_cm", _here / "data_analytics_cm.py")
_math = _load("g7t1lg", _here.parents[1] / "mathematics" / "content" / "grade7_term1_lg.py")

SIMBOOK = "https://claude.ai/artifact/9cN5TM7ne3kwXFBk2yMYJW"
R360 = "Materials uploaded in Ranger360"
SHEET = "Python reference sheet (teacher-provided)"

HEADER = {"lines": ["LA SALLE GREEN HILLS", "Senior High School · Fundamentals of Data Analytics (Academic Elective)",
                    "One-Term Course, SY 2026-2027"], "title": "LEARNING GUIDE"}

OVERVIEW = [
    "Fundamentals of Data Analytics introduces the work of a data analyst from start to finish. In **Foundations**, "
    "learners define data analytics, tell data types apart, follow the data life cycle, and learn the privacy and "
    "ethical rules that protect people behind the data. In **Data Collection and Management**, they gather data by "
    "manual entry, from public datasets, and with a first Python script, then explore it and keep it safe with backups "
    "and documentation. In **Spreadsheet and Python Processing**, they clean messy data, answer questions with "
    "conditional and lookup functions, and summarize with pivot tables.",
    "In **Statistical Data Analysis**, learners compute descriptive statistics and run t-tests, z-tests, correlation, and "
    "regression – and explain what the results do and do not prove. In **Data Visualization and Storytelling**, they "
    "build honest charts in Google Sheets, interactive dashboards in Looker Studio, and data stories that lead to "
    "action. The course ends with a **Culminating Project and Peer Verification**: each group completes its own "
    "analytics project, then independently checks another group’s work and presents an evidence-based critique.",
    "Tools: Google Sheets → Google Colab (Python with pandas, kept deliberately simple) → Looker Studio; jamovi or JASP "
    "as optional statistical software. Each lesson opens with a simulation from the **Data Analytics SimBook** as its "
    "hook, is taught through the SimBook’s lesson slides with speaker notes, and is practiced through its Check "
    "Yourself items and Exercises (Part A Skills Practice, Part B Problem Solving, Part C Challenge).",
]

OUTCOMES = [("DA.SHS.1", "Carry out the data analytics workflow responsibly – collecting, cleaning, and documenting "
                         "data; analyzing it with spreadsheet functions and statistics; and communicating evidence-based "
                         "insights through visualizations, dashboards, and data stories – and critically verify the "
                         "analytical work of others.")]

POLICIES = [p for p in _math.POLICIES if not p["label"].startswith("Additional")] + [{
    "label": "Additional Data Analytics Policies",
    "items": [
        "Students are required to bring a fully charged learning device with access to their school Google account "
        "(Google Sheets, Google Colab, and Looker Studio) to every class.",
        "Datasets with personal information must be handled according to the Data Privacy Act of 2012 (RA 10173): "
        "collect only what is needed, ask for consent, anonymize before sharing, and never post raw personal data.",
        "Every dataset used for a requirement must cite its source. Keep a backup of raw data and a processing log of "
        "every change; work without a log may not receive full credit.",
        "During practical exams, only the teacher-provided Python reference sheet and the tools named in the exam may be "
        "used. AI tools may be used only when the teacher allows them, and their use must be declared.",
        ("Failure to comply may lead to the following:", [
            "1st offense: Oral warning",
            "2nd offense: Written reminder",
            "Repeated offenses: Issuance of a Student Responsibility Report (SRR)",
        ]),
        "Students may be allowed to make up missed tasks if the reason is valid.",
    ],
}]

ASSESSMENT = [
    {"component": "Written Works (WW)", "weight": "20%", "groups": [
        ("CP - Participation – seatwork, recitation, case discussions (40%)", [
            "CP - Recitation every session", "CP - Ethics case discussion (S6)", "CP - Two-minute data story (S67)",
            "CP - Verification log (S76)", "CP - Improvement plan and reflection (S80)"]),
        ("QZ - Quiz (60%)", ["QZ1 - Foundations of Data Analytics (S8)"])]},
    {"component": "Performance Task (PT)", "weight": "60%", "groups": [
        ("LW - Guided Lab Works (25%)", [
            "LW1 - Data Type Sort (S3)", "LW2 - Collect It Three Ways (S12)", "LW3 - Dataset Stewardship (S17)",
            "LW4 - Spreadsheet Investigation (S25)", "LW5 - Python Cleaning Challenge (S27)", "LW6 - Function Drills (S31)",
            "LW7 - Pivot Lab (S37)", "LW8 - Describe the Data (S45)", "LW9 - Chart Makeover (S59)"]),
        ("SA - Challenge Activities (25%)", [
            "SA1 - Data Detective (S8)", "SA2 - Formula Challenge (S33)", "SA3 - Statistical Investigation (S52)",
            "SA4 - Dashboard Challenge (S65)"]),
        ("PE - Practical Exams (50%)", [
            "PE1 - Collect, Explore, and Secure (S19)", "PE2 - Clean, Process, and Summarize (S38)",
            "PE3 - Statistical Analysis (S53)"])]},
    {"component": "Culminating Project", "weight": "20%", "groups": [
        ("PM - Project Milestones (40%)", [
            "PM1 - Project Proposal and Dataset (S20–S21)", "PM2 - Clean Dataset and Processing Log (S39–S40)",
            "PM3 - Analysis and Findings (S54)", "PM4 - Dashboard and Data Story (S68)"]),
        ("FP - Final Project and Peer Verification (60%)", ["Critique presentations and responses (S77–S79)"])]},
]

_std = {b["label"]: b for b in _cm.STANDARDS}
_cs = _std["CONTENT STANDARDS"]
_iste = _std["ISTE STANDARDS"]

STANDARDS = [
    {"label": "CONTENT STANDARD", "body": [("lead", _cs["lead"])] + [
        x for g in _cs["groups"] for x in (("h", g["title"]), ("bul", g["items"]))]},
    {"label": "PERFORMANCE STANDARD", "body": [("bul", _std["PERFORMANCE STANDARDS"]["items"])]},
    {"label": "ISTE STANDARDS", "body": [("lead", _iste["lead"])] + [("sub", g["title"], g["items"]) for g in _iste["groups"]]},
    {"label": "ENDURING UNDERSTANDING", "body": [("lead", _std["ENDURING UNDERSTANDING:"]["lead"]), ("num", _std["ENDURING UNDERSTANDING:"]["items"])]},
    {"label": "ESSENTIAL QUESTIONS", "body": [("lead", _std["ESSENTIAL QUESTION/S:"]["lead"]), ("num", _std["ESSENTIAL QUESTION/S:"]["items"])]},
    {"label": "TRANSFER GOAL", "body": [("p", _std["TRANSFER GOAL"]["text"])]},
    {"label": "CULMINATING PROJECT", "body": [
        ("center", "Data Analytics Project and Independent Peer Verification –"), ("center", "G.R.A.S.P. Performance Task"),
        ("h", "G – Goal"),
        ("p", "Your goal is to answer a real question about your school or community with data – and to check, as an "
              "independent reviewer, whether another group’s answer can be trusted."),
        ("h", "R – Role"),
        ("p", "You are a team of data analysts. Later, you also act as the independent verification team for another group."),
        ("h", "A – Audience"), ("lead", "Your primary audience includes:"),
        ("bul", ["A panel of teachers and school administrators who will act on the findings",
                 "The group whose project you verify", "Your classmates"]),
        ("h", "S – Situation"),
        ("p", "The school wants decisions based on evidence. Your team chooses a question (attendance, canteen sales, "
              "a community survey, study habits, or a public dataset), collects or obtains the data responsibly, and builds "
              "the analysis step by step through four milestones. Before any finding is accepted, another team must be "
              "able to rebuild it from your documentation."),
        ("h", "P – Product / Performance"), ("lead", "You will create:"),
        ("bul", ["A **project package**: raw data and its source, a data dictionary, a processing log, the cleaned dataset, "
                 "the analysis sheet, an interactive dashboard, and a data story with recommendations and limitations",
                 "A **verification log and critique** of another group’s project, presented in 3–5 minutes with evidence "
                 "of strengths, issues, data-quality problems, analytical limitations, and recommended improvements",
                 "A **response** to the critique of your own project and an improvement plan"]),
        ("h", "S – Success Criteria / Standards"), ("lead", "Your work will be assessed based on:"),
        ("bul", [("Data and Documentation", ["Responsible collection, cited source, data dictionary, and processing log. (10 points)"]),
                 ("Processing Accuracy", ["Correct cleaning, formulas, and summaries that others can rebuild. (10 points)"]),
                 ("Analysis and Interpretation", ["Appropriate statistics, correct results, and honest limitations. (10 points)"]),
                 ("Dashboard and Data Story", ["Clear, honest visuals and recommendations that follow from the evidence. (10 points)"]),
                 ("Peer Verification and Response", ["An evidence-based, respectful critique and a constructive response. (10 points)"])]),
        ("p", "**Total: 50 points**"),
    ]},
]

UNITS = [
    {"title": "Unit 1 · Foundations of Data Analytics", "lessons": [
        ("Lesson 1: What Is Data Analytics?", ["Types of data", "The data life cycle and types of data analysis"]),
        ("Lesson 2: Data Privacy and Ethics", ["The Data Privacy Act of 2012", "Ethics in analytics"]),
        ("Lesson 3: Applications and Careers in Data Analytics", ["Industries, skills, and careers"])]},
    {"title": "Unit 2 · Data Collection and Management", "lessons": [
        ("Lesson 4: Data Sources and Collection Methods", ["Manual entry, public datasets, and scripts"]),
        ("Lesson 5: Exploring and Securing Data", ["Exploratory data analysis", "Backups and documentation"])]},
    {"title": "Unit 3 · Spreadsheet and Python Processing", "lessons": [
        ("Lesson 6: Cleaning and Converting Data", ["Sheets functions and pandas"]),
        ("Lesson 7: Conditional and Lookup Functions", ["IF, COUNTIFS, SUMIFS, AVERAGEIFS, XLOOKUP, INDEX/MATCH"]),
        ("Lesson 8: Tables, Pivot Tables, and Aggregation", ["Pivot tables, slicers, and groupby"])]},
    {"title": "Unit 4 · Statistical Data Analysis", "lessons": [
        ("Lesson 9: Descriptive Statistics", ["Central tendency, variation, percentiles, and quartiles"]),
        ("Lesson 10: Inferential Statistics", ["t-test, z-test, correlation, and regression"])]},
    {"title": "Unit 5 · Data Visualization and Storytelling", "lessons": [
        ("Lesson 11: Visualizing Data in Spreadsheets", ["Charts, conditional formatting, sparklines, and slicers"]),
        ("Lesson 12: Interactive Dashboards in Looker Studio", ["Visual elements, controls, drill-down"]),
        ("Lesson 13: Data Storytelling", ["Context, narrative, and visuals"])]},
    {"title": "Unit 6 · Culminating Project and Peer Verification", "lessons": [
        ("Lesson 14: Completing the Analytics Project", ["The complete workflow and documentation"]),
        ("Lesson 15: Independent Peer Verification", ["Verifying, critiquing, and responding"]),
        ("Project Milestones:", ["PM1 Proposal and Dataset · PM2 Clean Dataset · PM3 Analysis · PM4 Dashboard and Story"]),
        ("Final Project:", ["Critique presentations and responses"])]},
]

MARK = []
for _r in _cm.ROWS:
    for _c in _r.get("comps", []):
        if isinstance(_c, tuple):
            MARK.append((f"{_c[0]}.", _c[2] + (" ★" if _c[1] else "")))


# ------------------------------------------------------------------ helpers

def _row(n):
    for r in _cm.ROWS:
        if r.get("type") == "row" and re.match(rf"Lesson {n}:", r.get("topic", "")):
            return r
    raise KeyError(n)


def objectives(n):
    """The lesson's competencies, word for word from the CM."""
    out = []
    for c in _row(n)["comps"]:
        text = c[2] if isinstance(c, tuple) else c
        out.append(text[0].upper() + text[1:])
    return out


def card(n, tab, mission, questions, discovery, setup="Pairs, one device; record findings in the notebook"):
    sim = _cm.SIMS[n].split(" (")[0]
    return ("sim", {"kind": "SIM HOOK", "title": f"{sim} – {tab}",
                    "tool": f"Data Analytics SimBook · Lesson {n} · {sim} ({tab} tab)",
                    "link": f"{SIMBOOK}#lesson{n}", "setup": setup, "mission": mission,
                    "questions": questions, "discovery": discovery})


def lesson(n, sessions, intro, body, valuing, exit_ticket, synthesis, extra_res, sep=True):
    r = _row(n)
    title = r["topic"].split(": ", 1)[1]
    blocks = [("sep",)] if sep else []
    blocks += [("cycle", sessions), ("lesson", f"LESSON {n}: {title}"),
               ("h", "INTRODUCTION:"), ("q", intro), ("h", "OBJECTIVES: (ID#1)"), ("obj", objectives(n), r["pillars"]),
               ("h", "ACTIVITIES:")]
    blocks += body
    blocks += [("h", "VALUING STATEMENT: (ID#8)"), ("q", valuing), ("h", "EXIT TICKET: (ID#9)"), ("bul", exit_ticket),
               ("h", "SYNTHESIS:"), ("q", synthesis), ("res", res(n, title, extra_res))]
    return blocks


def res(n, title, extra):
    return [f"Data Analytics SimBook - Lesson {n} ({SIMBOOK}#lesson{n})",
            f"SimBook Lesson {n} slides with speaker notes (use Present for the projector)",
            f"SimBook Exercises {n} – Part A as seatwork; Parts B and C as homework",
            f"Teacher’s Google presentation - Lesson {n}: {title}", *extra, R360]


def checkpoint(sessions, title, steps, pillars, resources, sep=True):
    return ([("sep",)] if sep else []) + [("cycle", sessions), ("lesson", title)] + steps + [
        ("pillar", pillars[0], pillars[1]), ("res", resources)]


def practical(session, code, title, tasks):
    return checkpoint(session, f"{code} – Practical Exam: {title}", [
        ("p", "(ID#1) **Goal:** Show that you can perform the task with the right tool, accurately, and explain your results."),
        ("step", f"(ID#5, ID#6) The students will take {code}, a hands-on exam on a teacher-prepared dataset:", tasks),
        ("step", "(ID#9) The exam is scored on execution, accuracy, interpretation, documentation, and communication. "
                 "The Python reference sheet is permitted where Python is used.")],
        (["SF"], ["Working independently and honestly on a practical exam reflects integrity."]),
        [f"Teacher-prepared {code} dataset and rubric", SHEET])


def milestone(sessions, code, title, steps, sep=True):
    return checkpoint(sessions, f"{code} – Project Milestone: {title}", [
        ("p", "__(Note: Please refer to the G.R.A.S.P. description and rubric on top of this LG.)__")] + steps,
        (["CM", "ZS"], ["Building the project together develops shared responsibility and dialogue.",
                        "Documenting every step reflects excellence and accountability."]),
        ["Teacher-prepared Project Guidelines and Rubric", R360], sep)


# ------------------------------------------------------------------ DRAW

ORIENTATION = [
    ("cycle", "SESSION 1"), ("lesson", "LESSON: Course Orientation – “Every Decision Has Data Behind It”"),
    ("h", "INTRODUCTION:"),
    ("q", "Every day, people decide with data – what to stock in the canteen, when to schedule a class, how to plan for "
          "a typhoon. This course teaches you to ask good questions of data, prepare it carefully, analyze it honestly, and "
          "show what it means to people who must act on it."),
    ("h", "OBJECTIVES: (ID#1)"),
    ("obj", ["Describe the course outline, tools, project, and assessment components.",
             "Explain classroom policies and the responsible use of school devices and accounts."], ["ZS", "SF"]),
    ("h", "ACTIVITIES:"),
    ("step", "(ID#2) ^^HOOK:^^ “Guess the Data” – the teacher shows a mystery dashboard of school data. What happened, and how do we know?"),
    ("step", "(ID#3) The teacher will discuss the course roadmap: six units, the tools (Google Sheets, Google Colab, Looker "
             "Studio), and the culminating project with independent peer verification."),
    ("step", "(ID#4) The teacher will discuss the methods of assessment and their weights, including practical exams."),
    ("step", "(ID#5) Learners sign in to Google Sheets, Colab, and Looker Studio with their school accounts and open the Data Analytics SimBook."),
    ("h", "WRAP UP ACTIVITY: Data Diary (ID#6)"),
    ("bul", ["One decision I made today was ____.", "The data behind it was ____."]),
    ("h", "VALUING STATEMENT: (ID#8)"),
    ("q", "Data is about people. As Lasallians, we handle it with honesty and respect for the people it describes."),
    ("res", ["Teacher’s Google presentation - Course Orientation", "Student Handbook", f"Data Analytics SimBook ({SIMBOOK})", R360]),
]

L1 = lesson(
    1, "SESSIONS 2 to 4",
    "A school records attendance every day. Is that just a list – or can it tell us which days, sections, and reasons "
    "need attention? Today we learn what data analytics is and the kinds of data it works with.",
    [("meet", "Session 2: Data and Data Analytics"),
     ("step", "(ID#2) ^^HOOK:^^ “Data Everywhere” – learners list every piece of data their phones collected about them this morning."),
     card(1, "Sort the Data", ["Sort all the cards into the four bins.", "Switch to structured vs unstructured and sort again."],
          ["Which cards were hardest to place? Why?"],
          "Data can be qualitative (nominal, ordinal) or quantitative (discrete, continuous), and structured or unstructured."),
     ("step", "(ID#3) The teacher will define data and data analytics, and discuss the types and levels of data (nominal, ordinal, interval, ratio)."),
     ("ex", "Worked Example", ["- Favorite snack → **qualitative, nominal**", "- Grade level (11, 12) → **qualitative, ordinal**",
                               "- Number of siblings → **quantitative, discrete**", "- Daily allowance in ₱ → **quantitative, continuous (ratio)**"]),
     ("meet", "Session 3: Data Type Sort"),
     ("step", "(ID#6) The students will accomplish LW1 Data Type Sort: classify every column of three real datasets and justify five choices."),
     ("meet", "Session 4: The Data Life Cycle and Types of Analysis"),
     card(1, "Life Cycle and Which Analysis?", ["Step through the LSGH Attendance Watch case.", "Match each question to a type of analysis."],
          ["Which stage protects the data? Which stage turns it into a decision?"],
          "Plan → collect → store → process → analyze → share → archive or destroy; descriptive, diagnostic, predictive, and prescriptive analytics answer different questions."),
     ("step", "(ID#4) The teacher will discuss the data life cycle and the four types of data analysis."),
     ("ex", "Worked Example", ["- What was last month’s attendance rate? → **descriptive**", "- Why do Mondays dip? → **diagnostic**",
                               "- What will next month’s rate be? → **predictive**", "- Which schedule should we adopt? → **prescriptive**"])],
    "Behind every row of data is a person. Knowing what kind of data we hold helps us treat it – and them – correctly.",
    ["Classify “temperature in °C”. (Quantitative, continuous – interval)", "“Which product will sell most next week?” is what type of analysis? (Predictive)"],
    "We defined data analytics, classified data types, and followed the data life cycle. Next, we learn the privacy and "
    "ethical rules that protect the people behind the data.",
    ["Sample datasets in Google Sheets"])

L2 = lesson(
    2, "SESSIONS 5 to 6",
    "A class list with names, birthdays, and addresses is shared in a group chat. What could go wrong? Today we learn why "
    "data privacy matters and how ethical analysts handle personal data.",
    [("meet", "Session 5: Data Privacy"),
     ("step", "(ID#2) ^^HOOK:^^ “Would You Click Agree?” – learners read a real app’s privacy terms and list what they gave away."),
     card(2, "Anonymize", ["Remove, mask, or generalize columns until no learner can be picked out.", "Keep the grade column useful."],
          ["How many rows look identical now? What did you have to give up?"],
          "Anonymizing protects people but removes detail; analysts keep only what the question needs."),
     ("step", "(ID#3) The teacher will discuss personal and sensitive personal information and the principles of the Data "
              "Privacy Act of 2012 (RA 10173): transparency, legitimate purpose, and proportionality."),
     ("ex", "Worked Example", ["Before sharing a survey: remove names and LRNs, turn birthdays into age bands, keep only the barangay "
                               "if the question needs location → the data still answers the question, but no learner can be identified."]),
     ("meet", "Session 6: Data Ethics"),
     card(2, "Ethics Calls", ["Decide on all nine scenarios: Okay, Not okay, or Okay if…"], ["Which principle did each scenario break or keep?"],
          "Ethical analytics asks for consent, uses data only for its stated purpose, avoids bias, and is transparent."),
     ("step", "(ID#4, ID#7) Case discussion (CP – Ethics case discussion): a leaked class list and a biased scholarship ranking. "
              "Groups decide what went wrong and how it should have been done.")],
    "Protecting someone’s data is a way of respecting their dignity. We collect only what we need and keep it safe.",
    ["Name one piece of sensitive personal information. (e.g., health records)", "What does “legitimate purpose” mean? (Data is used only for the purpose people agreed to.)"],
    "We learned why privacy matters and how ethical principles guide analytics. Next, we see where data analytics is used "
    "and who does this work.",
    ["Republic Act No. 10173 (Data Privacy Act of 2012) – summary", "National Privacy Commission learning materials"])

L3 = lesson(
    3, "SESSION 7",
    "Hospitals, malls, sports teams, and the government all use data to decide. Today we explore where data analytics is "
    "applied and what skills a data analyst needs.",
    [("step", "(ID#2) ^^HOOK:^^ “Day in the Life” – a short profile of a Filipino data analyst."),
     card(3, "Industry Map and Skill Builder", ["Explore three sectors.", "Set the skill sliders to match your strengths."],
          ["Which career matches your profile best?"],
          "Every sector follows question → data → analysis → decision; analysts combine statistics, tools, communication, and ethics."),
     ("step", "(ID#3, ID#4) The teacher will discuss applications of data analytics in different industries and the skills and careers in the field."),
     ("step", "(ID#6) Career-skills gallery walk and self-assessment of data analyst skills.")],
    "Our skills grow when we use them to serve others. Data analytics is a way to help communities make better choices.",
    ["Give one use of data analytics in health. (e.g., tracking dengue cases)", "Name two skills of a data analyst. (e.g., statistics, communication)"],
    "We saw how data analytics is used and what skills it needs. Next, we check our understanding in QZ1 and the Data Detective case.",
    ["Job postings and career profiles"])

CHECK1 = checkpoint("SESSION 8", "Unit 1 Check: QZ1 and SA1 – Data Detective", [
    ("step", "(ID#9) The students will take QZ1, a 20-item quiz on Lessons 1 to 3.", ["Coverage: A1.1–A1.7, M1–M2"]),
    ("step", "(ID#6, ID#7) The students will accomplish SA1 Data Detective: for a real-world scenario, decide what data is needed, "
             "what questions can be investigated, and what limitations and ethical concerns apply."),
    ("step", "Project groups are formed and list three project ideas.")],
    (["ZS"], ["Answering honestly and thinking critically reflect integrity and excellence."]),
    ["Teacher-made QZ1 and SA1 case in Ranger360"])

L4 = lesson(
    4, "SESSIONS 9 to 13",
    "A news report says rice prices went up by 8%. Where did that number come from? Today we learn where data comes from "
    "and three ways to collect it: by hand, from public datasets, and with a script.",
    [("meet", "Session 9: Data Sources"),
     ("step", "(ID#2) ^^HOOK:^^ “Where Did This Number Come From?” – trace a news statistic back to its source."),
     card(4, "Source Sorter", ["Sort every source into internal, external, interview, or real-time."], ["Which sources can you trust most? Why?"],
          "Data comes from internal and external sources, interviews, and real-time feeds; each has strengths and risks."),
     ("step", "(ID#3) The teacher will discuss internal, external, interview, and real-time data sources."),
     ("meet", "Sessions 10–11: Three Ways to Collect"),
     card(4, "Three Ways", ["Collect the same data by manual entry, a public dataset import, and a script."], ["Which way was fastest? Which had errors?"],
          "Manual entry is flexible but error-prone; public datasets and scripts are faster and more consistent when the source is reliable."),
     ("step", "(ID#4) The teacher will demonstrate a Google Form linked to Sheets, importing a public CSV, and a first Colab notebook."),
     ("ex", "Worked Example", ["- Google Sheets: **=IMPORTDATA(\"https://…/rice_prices.csv\")**",
                               "- Python: **import pandas as pd** · **df = pd.read_csv(url)** · **df.head()**"]),
     ("meet", "Session 12: Collect It Three Ways"),
     ("step", "(ID#6) The students will accomplish LW2 Collect It Three Ways: answer one question using manual entry, a public dataset, and a script, then compare."),
     ("meet", "Session 13: Is It Reliable?"),
     card(4, "Is It Reliable?", ["Rate five sources on relevance, reliability, timeliness, and privacy."], [],
          "A good source is relevant to the question, reliable, current, and respectful of privacy."),
     ("step", "(ID#5) Learners answer SimBook Exercises 4, Part A, as seatwork.")],
    "Good decisions need good sources. Citing where data comes from is honest and lets others check our work.",
    ["Is a school’s enrollment list internal or external data for the school? (Internal)", "Write the pandas line that reads a CSV. (df = pd.read_csv(\"file.csv\"))"],
    "We identified data sources and collected data three ways. Next, we explore datasets and keep them safe.",
    ["Google Forms, Sheets, and Colab", SHEET, "PSA OpenSTAT and data.gov.ph datasets"])

L5 = lesson(
    5, "SESSIONS 14 to 18",
    "You receive a dataset with no description. What is in it? Can it answer your question? Today we learn to explore "
    "data before analyzing it – and to back it up so no work is lost.",
    [("meet", "Sessions 14–15: Exploratory Data Analysis"),
     ("step", "(ID#2) ^^HOOK:^^ “First Look” – five minutes with an undescribed dataset: what can learners find out?"),
     card(5, "Explore", ["Profile every column of the attendance dataset.", "Compare with the pandas output."],
          ["Which column has missing values? Which looks suspicious?"],
          "Exploration shows each column’s type, range, missing values, and odd entries before any analysis."),
     ("step", "(ID#3) The teacher will discuss exploratory data analysis and why it guides the analysis that follows."),
     ("ex", "Worked Example", ["- Python: **df.info()** → columns, types, non-missing counts",
                               "- **df.describe()** → count, mean, min, max of numeric columns",
                               "- **df[\"section\"].value_counts()** → how many rows per section"]),
     ("meet", "Session 16: Backups and Documentation"),
     card(5, "Version History", ["Make three edits, then restore an earlier version.", "Try the same with no backup."], [],
          "Backups and version history protect data and let us track and undo changes."),
     ("step", "(ID#4) The teacher will discuss backups, version history, naming conventions (e.g., attendance_2026-10-21_v3.csv), and data dictionaries."),
     ("meet", "Session 17: Dataset Stewardship"),
     ("step", "(ID#6) The students will accomplish LW3 Dataset Stewardship: inspect a dataset, judge its suitability for a question, "
              "identify data-management issues, and document it with a data dictionary."),
     ("meet", "Session 18: Review"),
     ("step", "(ID#5) Learners answer SimBook Exercises 5, Part A, and review for PE1.")],
    "Taking care of data is stewardship. A careful analyst protects the work of others and leaves a clear record.",
    ["Which pandas command lists column types? (df.info())", "Why keep the raw data unchanged? (So every change can be checked and undone.)"],
    "We explored datasets and learned to secure and document them. Next, we show these skills in PE1 and start our projects.",
    ["Google Sheets and Colab", "EDA checklist and data dictionary template"])

PE1 = practical("SESSION 19", "PE1", "Collect, Explore, and Secure", [
    "Import a dataset by two methods (Sheets import and pandas).", "Explore it and report three findings and one data issue.",
    "Back it up with a proper file name and write its data dictionary."])

PM1 = milestone("SESSIONS 20 to 21", "PM1", "Project Proposal and Dataset", [
    ("step", "(ID#6) Groups write the project question, its audience, the dataset source and collection method, and a privacy and ethics check."),
    ("step", "(ID#7, ID#9) Teacher consultation; groups submit PM1 with the raw dataset and its data dictionary.")])

# ------------------------------------------------------------------ TUNE

L6 = lesson(
    6, "SESSIONS 22 to 27",
    "The canteen sales sheet says siomai sold 40 plates – but “siomai”, “Siomai ”, and “SIOMAI” are counted as different "
    "items, and some rows appear twice. Today we clean data so it can be trusted.",
    [("meet", "Sessions 22–23: Finding Problems"),
     ("step", "(ID#2) ^^HOOK:^^ “The Dirty Dozen” – twelve ways the canteen sales sheet went wrong. How many can learners spot?"),
     card(6, "Spot the Problems", ["Flag every blank, duplicate, and inconsistent entry."], ["Which problem changes the totals most?"],
          "Missing values, duplicates, and inconsistent entries must be found before analysis."),
     ("step", "(ID#3) The teacher will discuss detecting missing values, duplicates, and inconsistencies with spreadsheet functions."),
     ("ex", "Worked Example", ["- Count blanks: **=COUNTBLANK(D2:D51)**", "- Flag duplicates: **=COUNTIF($A$2:$A$51, A2)>1**",
                               "- Fix spacing and case: **=PROPER(TRIM(C2))**"]),
     ("meet", "Session 24: Converting Formats and Types"),
     card(6, "Clean It", ["Apply each cleaning step and read the processing log."], ["What is the pandas line for each Sheets fix?"],
          "Each cleaning step has a spreadsheet formula and a pandas equivalent; the processing log records every change."),
     ("step", "(ID#4) The teacher will discuss converting text to numbers and dates, and consistent formats."),
     ("ex", "Worked Example", ["- Price stored as “₱45” → **=VALUE(SUBSTITUTE(D2, \"₱\", \"\"))**",
                               "- pandas: **df[\"item\"] = df[\"item\"].str.strip().str.title()** · **df = df.drop_duplicates()**",
                               "- pandas: **df[\"date\"] = pd.to_datetime(df[\"date\"])**"]),
     ("meet", "Session 25: Spreadsheet Investigation"),
     ("step", "(ID#6) The students will accomplish LW4 Spreadsheet Investigation: clean the Canteen Sales case data and summarize it with spreadsheet calculations."),
     ("meet", "Session 26: Python Cleaning"),
     ("step", "(ID#4) Guided Colab notebook: missing values (isna, dropna, fillna), duplicates, selecting and dropping columns, and exporting with to_csv."),
     ("meet", "Session 27: Python Cleaning Challenge"),
     card(6, "Before / After", ["Compare the totals before and after cleaning."], [], "Dirty data gives wrong answers; cleaning changes the decision."),
     ("step", "(ID#6) The students will accomplish LW5 Python Cleaning Challenge with the reference sheet, then compare their result with LW4.")],
    "Cleaning data is careful, honest work. We record every change so that no one is misled by what we did.",
    ["Write a formula that flags duplicates in column A. (=COUNTIF($A$2:$A$51, A2)>1)", "Which pandas method removes duplicate rows? (drop_duplicates())"],
    "We found and fixed messy data in Sheets and pandas and logged every change. Next, we answer questions with conditional and lookup functions.",
    ["Google Sheets and Colab", "Canteen Sales case dataset", SHEET])

L7 = lesson(
    7, "SESSIONS 28 to 33",
    "The canteen manager asks: how many siomai were sold on Mondays? What is the price of turon? Instead of counting by "
    "hand, one formula can answer each question.",
    [("meet", "Sessions 28–29: Conditional Functions"),
     ("step", "(ID#2) ^^HOOK:^^ “Ask the Sheet” – five questions from the canteen manager; learners race to answer each with one formula."),
     card(7, "Conditional", ["Build COUNTIFS, SUMIFS, and AVERAGEIFS for three questions."], ["Which rows light up? Why?"],
          "Conditional functions count, add, or average only the rows that meet the criteria."),
     ("step", "(ID#3) The teacher will discuss IF, COUNTIF(S), SUMIF(S), and AVERAGEIF(S)."),
     ("ex", "Worked Example", ["- Count siomai sales: **=COUNTIF(C2:C51, \"Siomai\")**",
                               "- Monday siomai sales in ₱: **=SUMIFS(E2:E51, C2:C51, \"Siomai\", B2:B51, \"Mon\")**",
                               "- Label big orders: **=IF(E2>=100, \"Big\", \"Regular\")**"]),
     ("meet", "Session 30: Lookup Functions"),
     card(7, "Lookup", ["Look up three prices with VLOOKUP, XLOOKUP, and INDEX/MATCH.", "Move a column and try again."],
          ["Which lookup breaks when columns move?"], "XLOOKUP and INDEX/MATCH keep working when columns move; VLOOKUP needs the key in the first column."),
     ("step", "(ID#4) The teacher will discuss VLOOKUP, XLOOKUP, INDEX, and MATCH with exact matches."),
     ("ex", "Worked Example", ["- **=XLOOKUP(\"Turon\", A2:A10, C2:C10)**", "- **=INDEX(C2:C10, MATCH(\"Turon\", A2:A10, 0))**"]),
     ("meet", "Session 31: Function Drills"),
     ("step", "(ID#6) The students will accomplish LW6 Function Drills on the Canteen Sales case: sales per item, per day, and per cashier."),
     ("meet", "Session 32: Combining Functions"),
     card(7, "Combine", ["Assemble three combined formulas from tokens."], [], "Combining lookups and conditions answers more complex questions in one formula."),
     ("step", "(ID#4) The teacher will discuss formulas that combine conditional and lookup functions."),
     ("meet", "Session 33: Formula Challenge"),
     ("step", "(ID#6, ID#7) The students will accomplish SA2 Formula Challenge: answer ten management questions with combined formulas and check each by another method.")],
    "A formula is only as good as the question behind it. We check our results before others rely on them.",
    ["Write a formula for the total sales of Turon in E2:E51 (items in C2:C51). (=SUMIF(C2:C51, \"Turon\", E2:E51))",
     "Which lookup works when the key is not in the first column? (XLOOKUP or INDEX/MATCH)"],
    "We used conditional and lookup functions, alone and combined. Next, we summarize data with tables and pivot tables.",
    ["Google Sheets", "Function reference card"])

L8 = lesson(
    8, "SESSIONS 34 to 37",
    "Which canteen item really sells best – by day, by category, and as a share of all sales? A pivot table answers in "
    "seconds what would take a whole session by hand.",
    [("meet", "Session 34: Tables and Aggregation"),
     ("step", "(ID#2) ^^HOOK:^^ “Which Item Really Sells?” – the teacher builds one pivot table live."),
     card(8, "Pivot Builder", ["Put Item in Rows and Sales in Values.", "Show values as % of total, then running total and rank.", "Add a slicer for Day."],
          ["Which item has the largest share? Does it change on Fridays?"],
          "Pivot tables summarize data by groups; showing values as percentages, differences, running totals, and ranks reveals patterns."),
     ("step", "(ID#3) The teacher will discuss tables, table slicers, and aggregation (sum, average, count)."),
     ("meet", "Sessions 35–36: Pivot Tables"),
     ("step", "(ID#4) The teacher will discuss pivot tables with multiple values and filtering pivot table data."),
     ("ex", "Worked Example", ["Rows: Item · Values: SUM of Sales → Siomai ₱2,745 of ₱7,615 (sample data)",
                               "- Show as % of grand total: 2,745 ÷ 7,615 = **36.0%**",
                               "- pandas: **df.groupby(\"item\")[\"sales\"].sum()**"]),
     ("meet", "Session 37: Pivot Lab"),
     ("step", "(ID#6) The students will accomplish LW7 Pivot Lab: build pivots with % of total, running totals, and ranks, then filter them."),
     ("step", "The teacher will remind the students of PE2 next session.")],
    "Summaries help leaders see the whole picture. We summarize fairly, without hiding the groups that matter.",
    ["What does “show as % of grand total” do? (Shows each group’s share of the total.)", "Write the pandas equivalent of Rows: Day, Values: SUM of Sales. (df.groupby(\"day\")[\"sales\"].sum())"],
    "We summarized data with tables and pivot tables. Next, we show our processing skills in PE2 and clean our project data.",
    ["Google Sheets and Colab"])

PE2 = practical("SESSION 38", "PE2", "Clean, Process, and Summarize", [
    "Clean a dataset in Sheets or Colab and keep a processing log.", "Answer questions with conditional and lookup formulas.",
    "Summarize the data with a filtered pivot table."])

PM2 = milestone("SESSIONS 39 to 40", "PM2", "Clean Dataset and Processing Log", [
    ("step", "(ID#6) Groups clean the project dataset, log every change, and build summary tables and pivot tables that answer the first project questions."),
    ("step", "(ID#9) Groups submit PM2 and check one another’s logs for completeness.")])

L9 = lesson(
    9, "SESSIONS 41 to 46",
    "The class’s “average allowance” is ₱500 – until one learner with ₱1,800 joins. What number tells the truth? Today we "
    "learn the measures that describe data fairly.",
    [("meet", "Sessions 41–42: Measures of Central Tendency"),
     ("step", "(ID#2) ^^HOOK:^^ “Average Allowance?” – one large allowance changes the mean. Which number tells the truth?"),
     card(9, "Drag the Data", ["Add the ₱1,800 outlier.", "Drag the dots closer together, then spread them out."],
          ["Which moves more, the mean or the median?", "What happens to the SD?"],
          "The mean is pulled by outliers; the median resists them. Range, variance, and SD measure spread."),
     ("step", "(ID#3) The teacher will discuss the mean, median, and mode, and when to use each."),
     ("meet", "Sessions 43–44: Measures of Variation, Percentiles, and Quartiles"),
     ("step", "(ID#4) The teacher will discuss range, variance, standard deviation (sample vs population), percentiles, and quartiles."),
     ("ex", "Worked Example", ["Study hours: 12, 15, 11, 18, 14, 20, 15 (sample data)",
                               "- Mean = 105 ÷ 7 = **15**; median = **15**; mode = **15**; range = 20 − 11 = **9**",
                               "- Squared deviations: 9, 0, 16, 9, 1, 25, 0 → sum 60",
                               "- VAR.S = 60 ÷ 6 = **10**; STDEV.S = √10 ≈ **3.16**"]),
     card(9, "Box and Quartiles", ["Read Q1, the median, and Q3.", "Slide to P90."], [], "Quartiles split ordered data into four parts; P90 has 90% of the values at or below it."),
     ("meet", "Session 45: Describe the Data"),
     ("step", "(ID#6) The students will accomplish LW8 Describe the Data: compute descriptives of the Study Habits Survey case in Sheets "
              "(AVERAGE, MEDIAN, MODE, VAR.S, STDEV.S, PERCENTILE, QUARTILE) and compare with jamovi or JASP."),
     ("meet", "Session 46: Choosing a Fair Summary"),
     ("step", "(ID#5) Learners choose and justify fair summaries for three skewed datasets (SimBook Exercises 9, Part A).")],
    "Summaries can include or hide people. Choosing a fair summary is choosing to tell the truth about everyone in the data.",
    ["Find the median of 4, 9, 2, 7, 5. (5)", "Which is more affected by an outlier, the mean or the median? (The mean)"],
    "We described data with measures of center and spread. Next, we use inferential statistics to test claims.",
    ["Google Sheets", "jamovi or JASP (optional)", "Study Habits Survey case dataset"])

L10 = lesson(
    10, "SESSIONS 47 to 52",
    "Do learners who study longer get higher scores? Do two sections really differ – or is it chance? Today we test claims "
    "with data and learn what the results can and cannot prove.",
    [("meet", "Sessions 47–48: Hypotheses and the t-test"),
     ("step", "(ID#2) ^^HOOK:^^ “Does Studying Longer Mean Higher Grades?” – learners guess, then test with data."),
     card(10, "Two Groups", ["Change the difference, spread, and sample size.", "Find a setting where the result becomes significant."],
          ["What makes the p-value smaller?"],
          "A bigger difference, less spread, or a larger sample gives a smaller p-value."),
     ("step", "(ID#3) The teacher will discuss populations and samples, null and alternative hypotheses, p-values, and the 0.05 significance level."),
     ("ex", "Worked Example", ["Section A mean 9 h, Section B mean 11 h, SD 2 h each, n = 12 each (sample data)",
                               "- t = 2 ÷ (2 × √(2/12)) ≈ **2.45**, df = 22", "- **=T.TEST(A2:A13, B2:B13, 2, 2)** ≈ **0.023**",
                               "- 0.023 < 0.05 → reject H₀: the difference is **statistically significant**"]),
     ("meet", "Session 49: The z-test"),
     card(10, "z-test", ["Run a one-sample z-test with a known σ."], [], "The z-test compares a sample mean with a claimed value when σ is known."),
     ("step", "(ID#4) The teacher will discuss the one-sample z-test and Z.TEST (one-tailed in Google Sheets; two-tailed p = 2 × the smaller tail)."),
     ("meet", "Sessions 50–51: Correlation and Regression"),
     card(10, "Correlation and Regression", ["Drag points to change r.", "Predict a score from the regression line."],
          ["Does a strong correlation prove that one causes the other?"],
          "r measures the strength and direction of a linear relationship; regression predicts; correlation is not causation."),
     ("step", "(ID#4) The teacher will discuss CORREL, SLOPE, INTERCEPT, RSQ, and trendlines."),
     ("ex", "Worked Example", ["Regression line: score = 52 + 4.5 × hours (sample data)", "- 6 hours → 52 + 27 = **79**",
                               "- r = 0.8 → a strong positive relationship – **not proof** that studying more causes higher scores"]),
     ("meet", "Session 52: Statistical Investigation"),
     ("step", "(ID#6, ID#7) The students will accomplish SA3 Statistical Investigation: select a method for a case, obtain the results "
              "with the tool, and explain what the findings do and do not establish.")],
    "Honest analysts say what the evidence supports – and no more. Stating limitations is a sign of integrity.",
    ["p = 0.12 at α = 0.05: significant or not? (Not significant)", "Name the Sheets function for the correlation coefficient. (CORREL)"],
    "We tested claims with t-tests, z-tests, correlation, and regression, and explained their limits. Next, we show our "
    "statistics skills in PE3 and analyze our project data.",
    ["Google Sheets", "jamovi or JASP (optional)"])

PE3 = practical("SESSION 53", "PE3", "Statistical Analysis", [
    "Compute descriptive statistics for a dataset.", "Run one inferential test (t-test, z-test, correlation, or regression).",
    "Interpret the result and state one limitation."])

PM3 = milestone("SESSION 54", "PM3", "Analysis and Findings", [
    ("step", "(ID#6) Groups compute descriptive statistics of their project data, run an inferential test where appropriate, and write findings with limitations."),
    ("step", "(ID#9) Groups submit the PM3 analysis worksheet and findings statement.")])

L11 = lesson(
    11, "SESSIONS 55 to 59",
    "Two charts of the same air quality data lead to opposite conclusions. How can that be? Today we learn to choose and "
    "build charts that show data clearly and honestly.",
    [("meet", "Session 55: Why Visualize?"),
     ("step", "(ID#2) ^^HOOK:^^ “Same Data, Two Stories” – two charts of the same data; which one is honest?"),
     card(11, "Chart Types", ["Morph the data through every chart type.", "Answer the chart-choice prompts."],
          ["Which chart compares? Which shows a trend? A part of a whole? A relationship?"],
          "Column/bar → compare; line → trend; pie → part of a whole; scatter → relationship; combo → two measures."),
     ("step", "(ID#3) The teacher will discuss the importance of data visualization and choosing chart types."),
     ("meet", "Sessions 56–57: Charts, Conditional Formatting, and Sparklines"),
     card(11, "Format It", ["Turn on the color scale and sparklines."], [], "Conditional formatting and sparklines show patterns inside a table."),
     ("step", "(ID#4) The teacher will demonstrate column, line, pie, bar, scatter, and combo charts, conditional formatting, and **=SPARKLINE(B2:M2)**."),
     ("meet", "Session 58: Filters, Timelines, and Slicers – and Honest Charts"),
     card(11, "Honest or Misleading? and Slicers", ["Move the y-axis start and judge each chart.", "Filter the pivot chart by station, month, and city."], [],
          "A truncated axis exaggerates differences; filters and slicers let viewers explore without changing the data."),
     ("step", "(ID#4) The teacher will discuss report filters, timelines (date ranges), and slicers on pivot tables and charts."),
     ("meet", "Session 59: Chart Makeover"),
     ("step", "(ID#6) The students will accomplish LW9 Chart Makeover: redesign three misleading charts and explain each fix.")],
    "A chart can inform or mislead. We design visuals that respect our audience’s right to the truth.",
    ["Which chart shows change over time best? (Line chart)", "What makes a bar chart misleading? (e.g., a y-axis that does not start at zero)"],
    "We built clear, honest charts and interactive pivot charts in Sheets. Next, we build dashboards in Looker Studio.",
    ["Google Sheets", "Metro Manila Air Quality case dataset (public data)"])

L12 = lesson(
    12, "SESSIONS 60 to 65",
    "The principal has five minutes. One page must answer the most important questions – and let them explore the rest. "
    "That page is a dashboard.",
    [("meet", "Sessions 60–61: Setting Up Looker Studio"),
     ("step", "(ID#2) ^^HOOK:^^ “The One-Page Answer” – what should the principal see first?"),
     card(12, "Build", ["Add a scorecard, a column chart, a table, and a drop-down control.", "Edit their properties until all goals are met."],
          ["Which widget answers the principal’s first question?"],
          "Dashboards combine cards, charts, tables, and controls around the audience’s questions."),
     ("step", "(ID#3) The teacher will demonstrate: Create → Report → Add data (Google Sheets connector) → Add a chart → Add a control; "
              "the Setup and Style panels."),
     ("meet", "Sessions 62–63: Sorting, Filtering, Drill-down, and Hierarchy"),
     card(12, "Explore", ["Choose a region in the control.", "Drill down from region to city to school, then sort the table."], [],
          "Controls cross-filter every chart; drill-down follows a dimension hierarchy."),
     ("step", "(ID#4) The teacher will discuss editing properties, sorting, filtering, drill-down, and creating dimension hierarchies."),
     ("meet", "Session 64: Choosing Visuals"),
     card(12, "Choose the Visual", ["Pick the best visual element for each question."], [], "The right visual depends on the question and the transformed data."),
     ("step", "(ID#4) Guided build of an air quality dashboard step by step."),
     ("meet", "Session 65: Dashboard Challenge"),
     ("step", "(ID#6, ID#7) The students will accomplish SA4 Dashboard Challenge: turn an analyzed dataset into an interactive Looker Studio "
              "dashboard with a short, evidence-based explanation.")],
    "A good dashboard serves its users. We design for the people who must make decisions, not to impress.",
    ["What Looker Studio element shows a single number like total enrollment? (Scorecard)", "What does drill-down let viewers do? (Move from a general level to a detailed level, e.g., region → city.)"],
    "We built interactive dashboards with controls and drill-down. Next, we turn our insights into a data story.",
    ["Looker Studio", "Google Sheets data sources"])

L13 = lesson(
    13, "SESSIONS 66 to 67",
    "A chart with no story is easy to ignore. The same chart with one clear sentence of context can change a decision. "
    "Today we learn data storytelling.",
    [("meet", "Session 66: The Story Arc"),
     ("step", "(ID#2) ^^HOOK:^^ “So What?” – a chart with no story versus the same chart with one sentence of context."),
     card(13, "Story Arc and Emphasis", ["Put the story cards in order.", "Declutter the chart, highlight one bar, and choose a headline."],
          ["Which headline states an insight that the data supports?"],
          "A data story moves from question and context to evidence, insight, and recommendation; emphasis guides the eye."),
     ("step", "(ID#3) The teacher will discuss context, narrative, visuals, annotations, and insight headlines."),
     ("meet", "Session 67: Know Your Audience"),
     card(13, "Know Your Audience", ["Choose the best version of one finding for the principal, parents, and classmates."], [],
          "The same finding is told differently for each audience, without changing the facts."),
     ("step", "(ID#5, ID#7) Two-minute data stories with peer feedback (CP – Two-minute data story).")],
    "Stories move people. We tell data stories that are true, fair to the evidence, and useful to our community.",
    ["What comes after the evidence in a data story? (The insight, then the recommendation)", "Rewrite “Sales by item” as an insight headline. (e.g., “Siomai brings in over a third of canteen sales”)"],
    "We learned to turn analysis into stories that lead to action. Next, we prepare our dashboards and stories for PM4.",
    ["Storyboard template"])

PM4 = milestone("SESSION 68", "PM4", "Dashboard and Data Story", [
    ("step", "(ID#6) Groups build the project dashboard and draft the data story with recommendations and limitations."),
    ("step", "(ID#9) Groups submit the dashboard link and the data story draft.")])

# ------------------------------------------------------------------ RELEASE

L14 = lesson(
    14, "SESSIONS 69 to 72",
    "Could a stranger rebuild your results from your files alone? Today we finish the project and prepare a package that "
    "anyone can check.",
    [("meet", "Sessions 69–70: The Complete Workflow"),
     ("step", "(ID#2) ^^HOOK:^^ “Ready for Review?” – a checklist a stranger could use to rebuild your results."),
     card(14, "Workflow", ["Place every artifact on the right stage.", "Load Group 2’s package and find what is missing."], [],
          "Every stage of the workflow leaves an artifact: question, raw data, dictionary, log, clean data, analysis, dashboard, story, limitations."),
     ("step", "(ID#3, ID#4) The teacher will discuss the complete analytics workflow and final documentation."),
     ("meet", "Sessions 71–72: Reproducibility Check"),
     card(14, "Reproducibility Check", ["Check your own package against all ten items."], ["Where would a stranger get stuck?"],
          "Documentation makes results reproducible and trustworthy."),
     ("step", "(ID#6) Groups finalize their projects with the teacher’s checklist and hand over their packages to the reviewing group.")],
    "Clear documentation is a gift to others. It lets them trust, check, and build on our work.",
    ["Name three items in a project package. (e.g., data dictionary, processing log, dashboard link)", "Why include limitations? (So readers know what the findings do not prove.)"],
    "We completed and documented our projects. Next, we verify another group’s project.",
    ["Teacher-prepared Project Guidelines and Rubric", "Project checklist"])

L15 = lesson(
    15, "SESSIONS 73 to 76",
    "Real analysts and scientists check each other’s work before results are trusted. Now it is your turn to be the "
    "independent reviewer.",
    [("meet", "Session 73: Trust, but Verify"),
     ("step", "(ID#2) ^^HOOK:^^ “Trust, but Verify” – how real analysts and scientists review each other’s work."),
     card(15, "Find the Issues", ["Find all six planted issues in Group 4’s mini project.", "Re-compute with fixes."],
          ["Which issue changed a number? Which changed the conclusion?"],
          "Verification re-checks data, formulas, charts, claims, privacy, and sources."),
     ("ex", "Worked Example", ["Group 4’s Juice total uses **=SUMIF(C2:C8, \"Juice\", D2:D8)** but the data runs to row 10",
                               "- Corrected: **=SUMIF(C2:C10, \"Juice\", D2:D10)** → Juice rises from **₱180 to ₱280** (sample data)"]),
     ("meet", "Sessions 74–75: Verifying and Writing the Critique"),
     card(15, "Write the Critique", ["Build a critique: strength, issue + evidence, impact, recommendation."], [], "A good critique is specific, evidence-based, and respectful."),
     ("step", "(ID#6) Groups rebuild key results of the project they review and log what matches and what does not."),
     ("meet", "Session 76: Preparing to Respond"),
     card(15, "Respond", ["Answer four review points: accept, clarify, or justify with evidence."], [], "Responding well means accepting valid points and explaining with evidence."),
     ("step", "(ID#9) Groups complete the verification log (CP – Verification log) and prepare the critique presentation.")],
    "Correcting with charity and receiving correction with humility build a community that seeks the truth together.",
    ["Name two things a verifier re-checks. (e.g., formulas, chart axes)", "What should every critique point include? (Evidence and a recommendation)"],
    "We verified another group’s work and prepared an evidence-based critique. Next, we present our critiques and respond.",
    ["Peer verification rubric and log template"])

FINAL = [
    ("sep",), ("cycle", "SESSIONS 77 to 79"), ("lesson", "FP – Final Project: Critique Presentations and Responses"),
    ("ts", "Today the focus is on the critical review of another group’s project. Present your evidence clearly and respectfully – and respond to your reviewers with openness."),
    ("p", "__(Note: Please refer to the detailed G.R.A.S.P. description and rubric on top of this LG.)__"),
    ("p", "(ID#1) **Goal:** Present an evidence-based critique of another group’s project and respond constructively to the critique of your own."),
    ("step", "(ID#2) PM1 – Project Proposal and Dataset was completed in S20–S21."),
    ("step", "(ID#3, ID#4) PM2 – Clean Dataset and Processing Log (S39–S40) and PM3 – Analysis and Findings (S54) were completed."),
    ("step", "(ID#5) PM4 – Dashboard and Data Story was completed in S68; the verification log was completed in S76."),
    ("step", "(ID#6, ID#7) Each group presents its critique of another group’s project (3–5 minutes): strengths, issues with evidence, "
             "data-quality problems, analytical limitations, and recommended improvements. The reviewed group responds. Panel questions follow."),
    ("step", "(ID#9) Using the rubric, each group reflects on its critique and its response."),
    ("pillar", ["CM", "ZS", "SF"], ["Respectful critique and open response build dialogue and trust.",
                                   "Accurate, documented, and verified work reflects excellence and accountability.",
                                   "Telling the truth about data, including its limits, lives out Lasallian integrity."]),
    ("res", ["Teacher-prepared Project Guidelines and Rubric", "Students’ project and critique uploaded in Ranger360"]),
]
SYNTHESIS = [
    ("sep",), ("cycle", "SESSION 80"), ("lesson", "Course Synthesis: “Improve, Then Share”"),
    ("step", "(ID#6) Groups write an improvement plan from the critique they received."),
    ("step", "(ID#8) Reflection: “How will I use data responsibly after this course?”"),
    ("pillar", ["SF", "ZS"], ["Learning from feedback reflects a growth mindset and humility."]),
    ("res", [R360]),
]

STAGES = [
    {"name": "DRAW", "desc": "Acquisition\n(Factual or Procedural Knowledge)",
     "blocks": ORIENTATION + L1 + L2 + L3 + CHECK1 + L4 + L5 + PE1 + PM1},
    {"name": "TUNE", "desc": "Make-Meaning\n(Understanding, Processing)",
     "blocks": L6[1:] + L7 + L8 + PE2 + PM2 + L9 + L10 + PE3 + PM3 + L11 + L12 + L13 + PM4},
    {"name": "RELEASE", "desc": "Transfer\n(to Real-world applications or new situations as evidence of their learning)",
     "blocks": L14[1:] + L15 + FINAL + SYNTHESIS},
]

SIGNATORIES = [
    {"label": "Prepared by:", "names": ["[Name of Teacher]", "[Name of Teacher]"],
     "role": "Fundamentals of Data Analytics Teacher"},
    {"label": "Approved by:", "names": ["[Name of Subject Coordinator]"],
     "role": "Subject Coordinator"},
]
