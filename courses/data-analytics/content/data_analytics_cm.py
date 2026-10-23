"""Fundamentals of Data Analytics – Curriculum Map, SY 2026-2027.

Source of truth: DepEd Strengthened SHS Curriculum Guide, Fundamentals of Data Analytics
(sources/deped/). Content standards, performance standards, and learning competencies
marked DepEd (True, shown with ★) are quoted verbatim. Codes A1.n and A2.n follow the CG's
two parts: Part 1 Data Analytics (LC 1–14) and Part 2 Data Analysis, Visualization, and
Storytelling (LC 1–15). M = meaning-making, T = transfer, and L = LSGH-added tool skills
(Python/pandas in Google Colab, folded into Units 2–3 as the "scripts" method of A1.9).

Schedule: one-term course, 80 one-hour sessions (S1 to S80). The project is developed
throughout the course through four milestones (PM1–PM4) and finished in Unit 6.
Course design follows course-spec.md; see cg-alignment.md for the unit-to-CG mapping.
"""

import re

HEADER = {
    "lines": ["LA SALLE GREEN HILLS", "Senior High School · Fundamentals of Data Analytics (Academic Elective)",
              "One-Term Course, SY 2026 - 2027"],
    "title": "CURRICULUM MAP",
    "note": "Aligned with the DepEd Strengthened Senior High School Curriculum Guide for Fundamentals of Data "
            "Analytics (Elective: Academic · 80 hours for one term · Pre-requisite: None). Competencies marked ★ are "
            "DepEd learning competencies quoted verbatim. Tools: Google Sheets → Google Colab (Python/pandas) → "
            "Looker Studio; jamovi or JASP as optional statistical software.",
}

ISTE = "ISTE Standards for Students (2016)"

STANDARDS = [
    {
        "label": "CONTENT STANDARDS",
        "lead": "The learners demonstrate an understanding that…",
        "groups": [
            {"title": "Data Analytics", "items": [
                "data analytics involves understanding different types of data, the stages of the data life cycle, and the "
                "various types of data analysis that support informed and evidence-based decisions.",
                "data privacy and ethical principles guide the responsible collection, handling, and analysis of data, "
                "ensuring that individuals’ rights are protected and that analytics practices adhere to legal and moral standards.",
                "data analytics is widely applied across real-world contexts and industries, and that the field requires "
                "specific skills and offers diverse career opportunities.",
                "data can come from various internal and external sources, and that appropriate collection methods, such as "
                "using public data sets, scripts, and manual entry, are essential for obtaining reliable and relevant information.",
                "effective data processing requires securing data through backups, detecting and addressing missing or "
                "inconsistent entries, converting data formats accurately based on given requirements, and refining datasets "
                "using tools such as filters and pivot tables to prepare information for deeper analysis.",
            ]},
            {"title": "Data Analysis, Visualization, and Storytelling", "items": [
                "descriptive and inferential statistics are essential tools for understanding, summarizing, and analyzing data, "
                "and that spreadsheets or statistical software enable them to compute measures, perform tests, and draw "
                "meaningful conclusions from datasets.",
                "conditional and lookup functions enable efficient data analysis, retrieval, and processing, and that combining "
                "these functions supports more complex and dynamic data analysis tasks.",
                "data visualization enhances the interpretation and communication of information, and that spreadsheets provide "
                "tools such as charts, conditional formatting, tables, pivot tables, and slicers for creating clear and effective "
                "visual representations of data.",
                "data visualization software enables the creation of interactive dashboards by importing data, selecting "
                "appropriate visual elements, and applying functions such as sorting, filtering, and drilldown to explore "
                "insights dynamically.",
                "data storytelling is a powerful method of communicating insights by combining visuals, context, and narrative "
                "to help audiences understand and act on data.",
                "a data analytics project requires planning, designing, analyzing, and presenting real-world data to apply "
                "statistical methods, visualization tools, and ethical considerations in solving practical problems.",
            ]},
        ],
    },
    {
        "label": "PERFORMANCE STANDARDS",
        "items": [
            "The learners can illustrate data life cycle and uphold data privacy and ethical principles. They process data "
            "accurately and securely by creating backups, cleaning datasets to address missing or inconsistent entries, "
            "converting data formats based on specified requirements, and using spreadsheet tools such as filters and pivot "
            "tables to refine datasets and generate meaningful insights for decision-making.",
            "The learners can perform statistical analyses, apply conditional and lookup functions, create visualizations using "
            "spreadsheets and data visualization software, communicate insights through data storytelling, and design and "
            "present a complete data analytics project using real-world data.",
        ],
    },
    {
        "label": "ISTE STANDARDS",
        "lead": f"{ISTE} addressed in this course:",
        "groups": [
            {"title": "1.2 Digital Citizen", "items": [
                "Students recognize the rights, responsibilities and opportunities of living, learning and working in an "
                "interconnected digital world, and they act and model in ways that are safe, legal and ethical. "
                "(Units 1, 2, 6 – data privacy, ethics, and responsible handling)"]},
            {"title": "1.3 Knowledge Constructor", "items": [
                "Students critically curate a variety of resources using digital tools to construct knowledge, produce creative "
                "artifacts and make meaningful learning experiences for themselves and others. (Units 2, 4 – evaluating sources "
                "and drawing evidence-based conclusions)"]},
            {"title": "1.5 Computational Thinker", "items": [
                "Students develop and employ strategies for understanding and solving problems in ways that leverage the power "
                "of technological methods to develop and test solutions. (Units 2–4 – collecting, cleaning, and analyzing data "
                "with spreadsheets, Python, and statistical software)"]},
            {"title": "1.6 Creative Communicator", "items": [
                "Students communicate clearly and express themselves creatively for a variety of purposes using the platforms, "
                "tools, styles, formats and digital media appropriate to their goals. (Units 5–6 – visualizations, dashboards, "
                "and data stories)"]},
            {"title": "1.7 Global Collaborator", "items": [
                "Students use digital tools to broaden their perspectives and enrich their learning by collaborating with others "
                "and working effectively in teams locally and globally. (Unit 6 – group projects and independent peer verification)"]},
        ],
    },
    {
        "label": "ESSENTIAL QUESTION/S:",
        "lead": "The learners will keep considering:",
        "numbered": True,
        "items": [
            "What makes data trustworthy enough to base a decision on?",
            "How do we turn raw, messy data into evidence – responsibly and accurately?",
            "How do we show and tell what the data says without misleading our audience?",
        ],
    },
    {
        "label": "ENDURING UNDERSTANDING:",
        "lead": "The learners will understand that:",
        "numbered": True,
        "items": [
            "Data analytics follows a life cycle – from asking a question and collecting data to processing, analyzing, and "
            "communicating it – and every stage is bound by privacy and ethics.",
            "The quality of a conclusion depends on the quality of the data: careful cleaning, documentation, and appropriate "
            "statistical methods make findings reliable, and stating their limits makes them honest.",
            "Visualizations, dashboards, and stories turn analysis into action, and an independent review by others is how "
            "analytical work earns trust.",
        ],
    },
    {
        "label": "TRANSFER GOAL",
        "text": "The learners will be able to independently carry out a complete data analytics project on a real-world question "
                "– collecting and documenting data responsibly, cleaning and analyzing it with appropriate tools and statistics, "
                "and communicating evidence-based insights through an interactive dashboard and a data story – and critically "
                "verify the analytical work of others.",
    },
]

ROADMAP = {
    "title": "COURSE ROADMAP AT A GLANCE",
    "subtitle": "80 one-hour sessions in one term (S1–S80) · the group project grows through four milestones and ends "
                "with independent peer verification",
    "columns": ["UNIT", "BIG QUESTION", "CG CONTENT", "SESSIONS", "TOOLS AND CASE", "PROJECT MILESTONE"],
    "widths": [2500, 3000, 1600, 1300, 2360, 2200],
    "rows": [
        {"cells": ["Unit 1 · Foundations of Data Analytics", "What can data tell us – and what should it never be used for?",
                   "Part 1: 1–3", "S1 – S8 (8)", "Case: LSGH Attendance Watch", "Groups formed; project ideas"]},
        {"cells": ["Unit 2 · Data Collection and Management", "Where does good data come from, and how do we keep it safe?",
                   "Part 1: 4–5 (backups)", "S9 – S21 (13)", "Google Forms · Sheets · Colab (first notebook)", "PM1 Project Proposal and Dataset"]},
        {"cells": ["Unit 3 · Spreadsheet and Python Processing", "How do we turn messy data into a dataset we can trust?",
                   "Part 1: 5 · Part 2: 2–3", "S22 – S40 (19)", "Sheets · Colab (pandas) · Case: Canteen Sales", "PM2 Clean Dataset and Processing Log"]},
        {"cells": ["Unit 4 · Statistical Data Analysis", "What do the numbers really show – and what do they not prove?",
                   "Part 2: 1", "S41 – S54 (14)", "Sheets · jamovi/JASP · Case: Study Habits Survey", "PM3 Analysis and Findings"]},
        {"cells": ["Unit 5 · Data Visualization and Storytelling", "How do we show the data so others understand and act?",
                   "Part 2: 3–5", "S55 – S68 (14)", "Sheets · Looker Studio · Case: Metro Manila Air Quality", "PM4 Dashboard and Data Story"]},
        {"kind": "pt", "cells": ["Unit 6 · Culminating Project and Peer Verification", "Would our findings survive an independent check?",
                                 "Part 2: 6", "S69 – S80 (12)", "All tools", "FP Final Project and Peer Verification"]},
    ],
    "legend": "Row colors in the map: green = unit banner · yellow = practical exam / quiz · blue = project milestone · gray = course closing.",
}

R = "Course materials uploaded in Ranger 360"
SIMBOOK = "Data Analytics SimBook"

# SimBook lesson number -> sim name and tabs
SIMS = {
    1: "Data Lens (Sort the Data, Life Cycle, Which Analysis?)",
    2: "Privacy Shield (Anonymize, Ethics Calls)",
    3: "Analytics Everywhere (Industry Map, Skill Builder)",
    4: "Collect It Three Ways (Source Sorter, Three Ways, Is It Reliable?)",
    5: "First Look (Explore, Version History)",
    6: "Data Cleaner (Spot the Problems, Clean It, Before / After)",
    7: "Formula Lab (Conditional, Lookup, Combine)",
    8: "Pivot Builder",
    9: "Spread Lab (Drag the Data, Box and Quartiles, Formulas)",
    10: "Test Lab (Two Groups, z-test, Correlation and Regression)",
    11: "Chart Chooser (Chart Types, Format It, Honest or Misleading?, Slicers)",
    12: "Dashboard Builder (Build, Explore, Choose the Visual)",
    13: "Story Builder (Story Arc, Emphasis, Know Your Audience)",
    14: "Project Pipeline (Workflow, Reproducibility Check)",
    15: "Verify It (Find the Issues, Write the Critique, Respond)",
}


def row(sessions, rng, topic, subtopics, comps, assess, hook, acts, res, pillars, kind=None):
    n = int(sessions.split()[0])
    r = {"type": "row", "meetings": f"{n} Session{'s' if n > 1 else ''}", "range": rng, "topic": topic,
         "subtopics": subtopics, "comps": comps, "assess": assess,
         "acts": ([f"^^HOOK:^^ {hook}"] if hook else []) + acts, "res": res, "pillars": pillars}
    if kind:
        r["kind"] = kind
    return r


def check(sessions, rng, topic, comps, assess, acts, res, kind="quiz"):
    return row(sessions, rng, topic, [], comps, assess, None, acts, res, ["ZS"], kind) | {"comp_lead": False}


def milestone(sessions, rng, code, title, subtopics, comps, acts, res):
    return row(sessions, rng, f"Project Milestone: {code} {title}", subtopics, comps,
               [("Summative", f"{code} – {title}")], None, acts, res, ["CM", "ZS"], "pt")


ROWS = [
    # ------------------------------------------------------------ Unit 1
    {"type": "banner", "title": "UNIT 1 · FOUNDATIONS OF DATA ANALYTICS",
     "sub": "CG Part 1 · Data; Data Privacy and Ethics; Applications of Data Analytics · S1 to S8 (8 sessions)",
     "question": "What can data tell us – and what should it never be used for?"},
    row("1 Session", "(S1)", "Course Orientation: “Every Decision Has Data Behind It”",
        ["Course outline, tools, and project", "Grading system and class policies"],
        ["Describe the course outline, tools, project, and assessment components.",
         "Explain classroom policies and the responsible use of school devices and accounts."],
        [("Formative", "CP – Recitation"), ("Formative", "CP – Data Diary: one decision I made today and the data behind it")],
        "“Guess the Data” – a mystery dashboard of school data. What happened, and how do we know?",
        [("Discussion on the following:", ["Course outline and roadmap", "Methods of assessment", "Accounts and tool setup (Sheets, Colab, Looker Studio)"])],
        ["Teacher’s Google presentation", "Student Handbook", R], ["ZS", "SF"]),
    row("3 Sessions", "(S2 to S4)", "Lesson 1: What Is Data Analytics?",
        ["Data and data analytics", "Types of data (qualitative/quantitative; discrete/continuous; nominal, ordinal, interval, ratio; structured/unstructured)",
         "The data life cycle", "Types of data analysis: descriptive, diagnostic, predictive, prescriptive"],
        [("A1.1", True, "define data analytics."),
         ("A1.2", True, "differentiate data types."),
         ("A1.3", True, "discuss data life cycle and types of data analysis."),
         ("M1", False, "Match an analytical question to the type of analysis that can answer it.")],
        [("Formative", "CP – Recitation"), ("Summative", "LW1 – Data Type Sort (S3)")],
        "“Data Everywhere” – learners list every piece of data their phones collected about them this morning.",
        ["LW1 – Data Type Sort: classify columns from three real datasets", "Life-cycle mapping of the LSGH Attendance Watch case"],
        ["Teacher’s Google presentation", "Sample datasets in Google Sheets", R], ["ZS"]),
    row("2 Sessions", "(S5 to S6)", "Lesson 2: Data Privacy and Ethics",
        ["Personal and sensitive personal information", "The Data Privacy Act of 2012 (RA 10173): consent, purpose, proportionality",
         "Anonymization and responsible sharing", "Ethics: bias, fairness, transparency"],
        [("A1.4", True, "explain the importance of data privacy."),
         ("A1.5", True, "discuss data ethics in performing tasks related to data analytics."),
         ("M2", False, "Judge whether a data practice is ethical, using privacy principles as criteria.")],
        [("Formative", "CP – Recitation"), ("Formative", "CP – Ethics case discussion (S6)")],
        "“Would You Click Agree?” – learners read a real app’s privacy terms and decide what they gave away.",
        ["Case discussion: a leaked class list; a biased scholarship ranking", "Anonymize a sample student dataset"],
        ["Republic Act No. 10173 (Data Privacy Act of 2012) – summary", "National Privacy Commission learning materials", R], ["SF", "CM"]),
    row("1 Session", "(S7)", "Lesson 3: Applications and Careers in Data Analytics",
        ["Data analytics in business, health, government, sports, and education", "Skills of a data analyst", "Careers in the field"],
        [("A1.6", True, "identify real-world applications of data analytics."),
         ("A1.7", True, "identify skills that data analysts should possess and career opportunities in the field of data analytics.")],
        [("Formative", "CP – Recitation")],
        "“Day in the Life” – a short profile of a Filipino data analyst.",
        ["Career-skills gallery walk", "Self-assessment of data analyst skills"],
        ["Job postings and career profiles", R], ["ZS"]),
    check("1 Session", "(S8)", "Unit 1 Check: “Data Detective”",
          ["A1.1–A1.7, M1–M2"],
          [("Summative", "QZ1 – Foundations of Data Analytics"), ("Summative", "SA1 – Data Detective")],
          ["QZ1 – a 20-item quiz", "SA1 – Data Detective: for a real-world scenario, decide what data is needed, what questions can be "
           "investigated, and what limitations and ethical concerns apply", "Project groups are formed and list three project ideas"],
          ["Teacher-made QZ1 and SA1 case in Ranger 360"]),

    # ------------------------------------------------------------ Unit 2
    {"type": "banner", "title": "UNIT 2 · DATA COLLECTION AND MANAGEMENT",
     "sub": "CG Part 1 · Data Sources and Collection Methods; Data Processing (exploration and backups) · S9 to S21 (13 sessions)",
     "question": "Where does good data come from, and how do we keep it safe?"},
    row("5 Sessions", "(S9 to S13)", "Lesson 4: Data Sources and Collection Methods",
        ["Internal, external, interview, and real-time data", "Manual data entry with Google Forms and Sheets",
         "Public datasets (e.g., PSA OpenSTAT, data.gov.ph, PAGASA)", "Scripts: loading a public CSV in Google Colab with pandas",
         "Importing and exporting files (CSV, XLSX); file naming and folders"],
        [("A1.8", True, "identify different types of data sources (e.g. internal, external, interview, and real-time data)."),
         ("A1.9", True, "discuss data collection methods from public datasets scripts and manual data entry."),
         ("L1", False, "Load a CSV file into a pandas DataFrame in Google Colab and export it to Google Sheets."),
         ("M3", False, "Evaluate whether a data source is reliable and relevant to an analytical question.")],
        [("Formative", "CP – Recitation"), ("Summative", "LW2 – Collect It Three Ways (S12)")],
        "“Where Did This Number Come From?” – trace a news statistic back to its source.",
        ["Build a Google Form, collect class responses, and link them to Sheets", "Download a public dataset and import it into Sheets",
         "First Colab notebook: pd.read_csv() from a public URL", "LW2 – Collect It Three Ways: the same question answered by manual entry, a public dataset, and a script"],
        ["Google Forms, Sheets, and Colab", "Python reference sheet (teacher-provided)", "PSA OpenSTAT and data.gov.ph datasets", R], ["ZS"]),
    row("5 Sessions", "(S14 to S18)", "Lesson 5: Exploring and Securing Data",
        ["Exploratory data analysis (EDA): shape, columns, types, ranges, first questions",
         "EDA in Sheets (column stats, sorting, filters) and in pandas (head, info, describe, value_counts)",
         "Backups, version history, and tracking changes", "Data documentation: data dictionary and change log"],
        [("A1.10", True, "recognize the importance of exploratory data analysis in understanding data and guiding subsequent analysis."),
         ("A1.11", True, "create backups of data to maintain security and track changes."),
         ("L2", False, "Examine a DataFrame with head(), info(), describe(), and value_counts()."),
         ("M4", False, "Use the results of exploration to state what a dataset can and cannot answer.")],
        [("Formative", "CP – Recitation"), ("Summative", "LW3 – Dataset Stewardship (S17)")],
        "“First Look” – learners get a dataset with no description. What can they find out in five minutes?",
        ["EDA checklist on the LSGH Attendance Watch dataset", "Backup routine: Drive copies, version history, and naming conventions",
         "LW3 – Dataset Stewardship: inspect a dataset, judge its suitability for a question, identify data-management issues, and document it"],
        ["Google Sheets and Colab", "EDA checklist and data dictionary template", R], ["ZS", "SF"]),
    check("1 Session", "(S19)", "Practical Exam 1: Collect, Explore, and Secure",
          ["A1.8–A1.11, L1–L2, M3–M4"],
          [("Summative", "PE1 – Practical Exam: import a dataset by two methods, explore it, back it up, and document it")],
          ["PE1 – a hands-on exam scored on execution, accuracy, interpretation, documentation, and communication",
           "Python reference sheet permitted"],
          ["Teacher-prepared PE1 dataset and rubric"]),
    milestone("2 Sessions", "(S20 to S21)", "PM1", "Project Proposal and Dataset",
              ["Project question and audience", "Dataset source, collection method, and privacy check", "Data dictionary and backup plan"],
              [("T1", False, "Propose a data analytics project with a clear question, a suitable real-world dataset, and a privacy and ethics check.")],
              ["Group consultation with the teacher", "PM1 – Proposal submitted with the raw dataset and its data dictionary"],
              ["Teacher-prepared Project Guidelines and Rubric", R]),

    # ------------------------------------------------------------ Unit 3
    {"type": "banner", "title": "UNIT 3 · SPREADSHEET AND PYTHON PROCESSING",
     "sub": "CG Part 1 · Data Processing; Part 2 · Conditional and Lookup Functions; tables and pivot tables · S22 to S40 (19 sessions)",
     "question": "How do we turn messy data into a dataset we can trust?"},
    row("6 Sessions", "(S22 to S27)", "Lesson 6: Cleaning and Converting Data",
        ["Missing values, duplicates, and inconsistencies (COUNTBLANK, COUNTIF, UNIQUE, TRIM, PROPER, data validation)",
         "Converting formats and types (VALUE, DATEVALUE, TEXT, SPLIT, number and date formats)",
         "The same tasks in pandas: isna, drop_duplicates, str.strip, astype, to_datetime, to_csv",
         "Sorting, filtering, and logging every change"],
        [("A1.12", True, "identify missing values, duplicates, and inconsistencies in data using spreadsheet functions."),
         ("A1.13", True, "convert data formats and types consistently and accurately based on specific requirements."),
         ("L3", False, "Clean a dataset in pandas – handle missing values, remove duplicates, select and drop columns, and convert types – and export the result."),
         ("M5", False, "Justify each cleaning decision and record it in a processing log.")],
        [("Formative", "CP – Recitation"), ("Summative", "LW4 – Spreadsheet Investigation (S25)"),
         ("Summative", "LW5 – Python Cleaning Challenge (S27)")],
        "“The Dirty Dozen” – twelve ways a canteen sales sheet went wrong. How many can learners spot?",
        ["LW4 – Spreadsheet Investigation: clean the Canteen Sales case data and summarize it with spreadsheet calculations",
         "LW5 – Python Cleaning Challenge: clean the same data in a prepared Colab notebook with the reference sheet, then compare results"],
        ["Google Sheets and Colab", "Canteen Sales case dataset", "Python reference sheet (teacher-provided)", R], ["ZS", "SF"]),
    row("6 Sessions", "(S28 to S33)", "Lesson 7: Conditional and Lookup Functions",
        ["IF, COUNTIF, COUNTIFS, SUMIF, SUMIFS, AVERAGEIF, AVERAGEIFS", "VLOOKUP, XLOOKUP, INDEX, and MATCH",
         "Combining conditional and lookup functions in one formula"],
        [("A2.3", True, "apply conditional functions (e.g., AVERAGEIF, AVERAGEIFS, COUNTIF, COUNTIFS, IF, SUMIF, and SUMIFS) to analyze and summarize data based on specific areas."),
         ("A2.4", True, "utilize lookup functions (e.g., XLOOKUP, INDEX, MATCH, and VLOOKUP) to retrieve data from different locations within a spreadsheet."),
         ("A2.5", True, "construct formulas that combine conditional and lookup functions to perform complex data analysis and processing tasks."),
         ("M6", False, "Choose the function that answers a given question and check the result by another method.")],
        [("Formative", "CP – Recitation"), ("Summative", "LW6 – Function Drills (S31)"), ("Summative", "SA2 – Formula Challenge (S33)")],
        "“Ask the Sheet” – the canteen manager asks five questions; learners race to answer each with one formula.",
        ["Function drills on the Canteen Sales case: sales per item, per day, and per cashier",
         "Lookup tables: prices, categories, and suppliers", "SA2 – Formula Challenge: answer ten management questions with combined formulas"],
        ["Google Sheets", "Function reference card", R], ["ZS"]),
    row("4 Sessions", "(S34 to S37)", "Lesson 8: Tables, Pivot Tables, and Aggregation",
        ["Tables, table slicers, and aggregation (sum, average, count)",
         "Pivot tables with multiple values: percentages, differences, running totals, and rankings",
         "Filtering pivot table data to focus on relevant subsets", "Comparison: groupby in pandas"],
        [("A1.14", True, "filter pivot table data to refine and focus on relevant subsets for further analysis."),
         ("A2.8", True, "organize datasets using tables, table slicers, and aggregation methods (e.g., sum, average, and count) to present data."),
         ("A2.9", True, "use pivot tables and charts to display multiple aggregation values and perform calculations such as percentages, differences, running totals, and rankings."),
         ("L4", False, "Filter, group, and summarize data in pandas with groupby, and compare the result with a pivot table.")],
        [("Formative", "CP – Recitation"), ("Summative", "LW7 – Pivot Lab (S37)")],
        "“Which Item Really Sells?” – one pivot table answers in seconds what took the class a whole session.",
        ["Pivot tables of the Canteen Sales case by item, day, and category", "LW7 – Pivot Lab: build pivots with % of total, running totals, and ranks, then filter them"],
        ["Google Sheets and Colab", R], ["ZS", "CM"]),
    check("1 Session", "(S38)", "Practical Exam 2: Clean, Process, and Summarize",
          ["A1.12–A1.14, A2.3–A2.5, A2.8–A2.9, L3–L4, M5–M6"],
          [("Summative", "PE2 – Practical Exam: clean a dataset (Sheets or Colab), answer questions with conditional and lookup formulas, and summarize with a pivot table")],
          ["PE2 – a hands-on exam scored on execution, accuracy, interpretation, documentation, and communication",
           "Python reference sheet permitted"],
          ["Teacher-prepared PE2 dataset and rubric"]),
    milestone("2 Sessions", "(S39 to S40)", "PM2", "Clean Dataset and Processing Log",
              ["Cleaned project dataset", "Processing log of every change", "Summary tables and pivot tables"],
              [("T2", False, "Prepare a clean, documented project dataset with summaries that answer the first project questions.")],
              ["Group work session with teacher consultation", "PM2 – Clean dataset, processing log, and summaries submitted"],
              ["Teacher-prepared Project Guidelines and Rubric", R]),

    # ------------------------------------------------------------ Unit 4
    {"type": "banner", "title": "UNIT 4 · STATISTICAL DATA ANALYSIS",
     "sub": "CG Part 2 · Descriptive and Inferential Statistics Using Spreadsheet or Statistical Software · S41 to S54 (14 sessions)",
     "question": "What do the numbers really show – and what do they not prove?"},
    row("6 Sessions", "(S41 to S46)", "Lesson 9: Descriptive Statistics",
        ["Mean, median, and mode", "Range, variance, and standard deviation", "Percentiles and quartiles",
         "Choosing appropriate summaries; outliers", "Descriptives in Sheets and in jamovi or JASP"],
        [("A2.1", True, "calculate measures of central tendency (mean, median and mode) and variation (range, variance, standard deviation, percentiles and quartiles) using spreadsheet or statistical software."),
         ("M7", False, "Choose the summary that represents a data set fairly and explain why.")],
        [("Formative", "CP – Recitation"), ("Summative", "LW8 – Describe the Data (S45)")],
        "“Average Allowance?” – one learner’s big allowance changes the mean. What number tells the truth?",
        ["Compute descriptives of the Study Habits Survey case with AVERAGE, MEDIAN, MODE, VAR, STDEV, PERCENTILE, QUARTILE",
         "Demonstration: the same descriptives in jamovi or JASP", "LW8 – Describe the Data"],
        ["Google Sheets", "jamovi or JASP (optional)", "Study Habits Survey case dataset", R], ["ZS"]),
    row("6 Sessions", "(S47 to S52)", "Lesson 10: Inferential Statistics",
        ["Population and sample; hypotheses; p-value and statistical significance",
         "z-test and t-test (Z.TEST, T.TEST; jamovi or JASP)", "Correlation (CORREL; scatter plots)",
         "Simple linear regression (SLOPE, INTERCEPT, RSQ; trendlines)", "Interpreting results and limitations; correlation is not causation"],
        [("A2.2", True, "conduct inferential statistical tests (e.g., t-test, z-test, correlation, and regression) using spreadsheet or statistical software."),
         ("M8", False, "Explain what a result does and does not establish, including its limitations.")],
        [("Formative", "CP – Recitation"), ("Summative", "SA3 – Statistical Investigation (S52)")],
        "“Does Studying Longer Mean Higher Grades?” – learners guess, then test with data.",
        ["t-test: do two sections differ in mean study hours?", "Correlation and regression of study hours and quiz scores",
         "SA3 – Statistical Investigation: select a method for a case, obtain the results with the tool, and explain what the findings do and do not establish"],
        ["Google Sheets", "jamovi or JASP (optional)", R], ["ZS", "SF"]),
    check("1 Session", "(S53)", "Practical Exam 3: Statistical Analysis",
          ["A2.1–A2.2, M7–M8"],
          [("Summative", "PE3 – Practical Exam: compute descriptive statistics, run one inferential test, and interpret the results")],
          ["PE3 – a hands-on exam scored on execution, accuracy, interpretation, documentation, and communication"],
          ["Teacher-prepared PE3 dataset and rubric"]),
    milestone("1 Session", "(S54)", "PM3", "Analysis and Findings",
              ["Descriptive statistics of the project data", "One inferential test, correlation, or regression where appropriate", "Findings and limitations"],
              [("T3", False, "Analyze the project dataset with appropriate statistics and state the findings with their limitations.")],
              ["PM3 – Analysis worksheet and findings statement submitted"],
              ["Teacher-prepared Project Guidelines and Rubric", R]),

    # ------------------------------------------------------------ Unit 5
    {"type": "banner", "title": "UNIT 5 · DATA VISUALIZATION AND STORYTELLING",
     "sub": "CG Part 2 · Data Visualization Using Spreadsheet; Data Visualization Software; Data Storytelling · S55 to S68 (14 sessions)",
     "question": "How do we show the data so others understand and act?"},
    row("5 Sessions", "(S55 to S59)", "Lesson 11: Visualizing Data in Spreadsheets",
        ["Why visualize: the same data as a table and as a chart", "Conditional formatting and sparklines",
         "Column, line, pie, bar, scatter plot, and combo charts – choosing the right one",
         "Report filters, timelines, and slicers on pivot tables and charts", "Avoiding misleading visualizations"],
        [("A2.6", True, "discuss the importance of data visualization."),
         ("A2.7", True, "apply conditional formatting, sparklines, and charts (e.g., column, line, pie, bar, scatter plot and combo charts) to visualize data effectively in spreadsheet."),
         ("A2.10", True, "use report filters, timelines, and slicers to display customized pivot tables and charts."),
         ("M9", False, "Critique a chart for clarity and honesty, and redesign it.")],
        [("Formative", "CP – Recitation"), ("Summative", "LW9 – Chart Makeover (S59)")],
        "“Same Data, Two Stories” – two charts of the same air quality data lead to opposite conclusions. Which is honest?",
        ["Visualize the Metro Manila Air Quality case: conditional formatting, sparklines, and six chart types",
         "Interactive pivot charts with filters and slicers", "LW9 – Chart Makeover: redesign three misleading charts"],
        ["Google Sheets", "Metro Manila Air Quality case dataset (public data)", R], ["ZS", "SF"]),
    row("6 Sessions", "(S60 to S65)", "Lesson 12: Interactive Dashboards in Looker Studio",
        ["Setting up Looker Studio and connecting a Google Sheets data source",
         "Visual elements: scorecards (cards), column charts, tables, and controls (slicers)",
         "Editing properties, sorting, filtering, drill-down, and dimension hierarchies",
         "Selecting visualizations for transformed data; dashboard layout"],
        [("A2.11", True, "discuss how to set up a data visualization software environment, import data, and add visual elements (e.g., cards, columns, slicers, and tables) to create interactive dashboards."),
         ("A2.12", True, "select appropriate visualizations to represent transformed data effectively."),
         ("A2.13", True, "execute data visualization software functions such as editing properties, sorting data, drilldown and filtering, and creating hierarchy"),
         ("M10", False, "Design a dashboard around the questions its audience needs answered.")],
        [("Formative", "CP – Recitation"), ("Summative", "SA4 – Dashboard Challenge (S65)")],
        "“The One-Page Answer” – a principal has five minutes. What should the dashboard show first?",
        ["Build a guided dashboard of the air quality case step by step",
         "SA4 – Dashboard Challenge: turn an analyzed dataset into an interactive Looker Studio dashboard with a short, evidence-based explanation"],
        ["Looker Studio", "Google Sheets data sources", R], ["ZS", "CM"]),
    row("2 Sessions", "(S66 to S67)", "Lesson 13: Data Storytelling",
        ["Context, narrative, and visuals", "Story structure: question, evidence, insight, recommendation",
         "Annotations, emphasis, and knowing the audience"],
        [("A2.14", True, "apply effective data storytelling techniques to communicate data insights."),
         ("M11", False, "Write a recommendation that follows from the evidence and states its limits.")],
        [("Formative", "CP – Recitation"), ("Formative", "CP – Two-minute data story (S67)")],
        "“So What?” – a chart with no story versus the same chart with one sentence of context.",
        ["Storyboard a data story from the dashboard", "Two-minute data stories with peer feedback"],
        ["Storyboard template", R], ["CM"]),
    milestone("1 Session", "(S68)", "PM4", "Dashboard and Data Story",
              ["Interactive project dashboard", "Data story draft"],
              [("T4", False, "Create an interactive dashboard and a data story that communicate the project’s findings.")],
              ["PM4 – Dashboard link and data story draft submitted"],
              ["Teacher-prepared Project Guidelines and Rubric", R]),

    # ------------------------------------------------------------ Unit 6
    {"type": "banner", "title": "UNIT 6 · CULMINATING PROJECT AND PEER VERIFICATION",
     "sub": "CG Part 2 · Data Analytics Project · S69 to S80 (12 sessions)",
     "question": "Would our findings survive an independent check?"},
    row("4 Sessions", "(S69 to S72)", "Lesson 14: Completing the Analytics Project",
        ["Applying the complete analytics workflow", "Final documentation: data dictionary, processing log, methods, and limitations"],
        [("A2.15", True, "present a project involving data analytics using real-world data."),
         ("T5", False, "Complete and document a data analytics project that applies the whole workflow to a real-world question.")],
        [("Formative", "CP – Project consultations")],
        "“Ready for Review?” – a checklist that a stranger could use to rebuild your results.",
        ["Groups finalize their projects using the teacher’s checklist", "Project packages are handed over to the reviewing group"],
        ["Teacher-prepared Project Guidelines and Rubric", "Project checklist", R], ["ZS", "SF"], kind="pt"),
    row("4 Sessions", "(S73 to S76)", "Lesson 15: Independent Peer Verification",
        ["Re-checking another group’s data, calculations, and visualizations",
         "Evaluating data quality, methods, and limitations", "Preparing an evidence-based critique"],
        [("T6", False, "Verify another group’s analytics project by re-checking its data, calculations, and visualizations."),
         ("T7", False, "Prepare an evidence-based critique of strengths, weaknesses, data-quality issues, analytical limitations, and recommended improvements.")],
        [("Formative", "CP – Verification log (S76)")],
        "“Trust, but Verify” – how real analysts and scientists review each other’s work.",
        ["Groups rebuild key results of the project they review and log what matches and what does not",
         "Critique preparation with the peer verification rubric"],
        ["Peer verification rubric and log template", R], ["CM", "SF"], kind="pt"),
    row("3 Sessions", "(S77 to S79)", "Final Project: Critique Presentations and Responses",
        ["Presenting the critique of another group’s project", "Responding to the critique of one’s own project"],
        [("T8", False, "Present a respectful, evidence-based critique of another group’s project and respond constructively to feedback on one’s own.")],
        [("Summative", "FP – Final Project and Peer Verification")],
        None,
        ["Each group presents its critique of another group’s project (the focus of the final presentation)",
         "The reviewed group responds to the critique", "Panel questions"],
        ["Teacher-prepared Project Guidelines and Rubric", "Students’ project and critique uploaded in Ranger 360"], ["CM", "ZS", "SF"], kind="pt"),
    row("1 Session", "(S80)", "Course Synthesis: “Improve, Then Share”",
        ["Improvement plan from the critique", "Reflection on the course"],
        [("T9", False, "Identify improvements to one’s own project from the feedback received and reflect on responsible data practice.")],
        [("Formative", "CP – Improvement plan and reflection")],
        None,
        ["Groups write an improvement plan from the critique they received",
         "Reflection: “How will I use data responsibly after this course?”"],
        [R], ["SF", "ZS"], kind="buffer"),
]

# Every numbered lesson opens with its SimBook sim as the hook and lists the SimBook as a resource.
for _r in ROWS:
    _m = re.match(r"Lesson (\d+):", _r.get("topic", ""))
    if _r.get("type") == "row" and _m and int(_m.group(1)) in SIMS:
        _n = int(_m.group(1))
        _sim = SIMS[_n]
        _at = 1 if _r["acts"] and _r["acts"][0].startswith("^^HOOK") else 0
        _r["acts"].insert(_at, f"^^SIM HOOK:^^ SimBook – {_sim}")
        _r["res"].insert(0, f"{SIMBOOK} – Lesson {_n} (hook sim, lesson slides with notes, and Exercises)")

SIGNATORIES = [
    {"label": "Prepared by:", "names": ["[Name of Teacher]", "[Name of Teacher]"],
     "role": "Fundamentals of Data Analytics Teacher"},
    {"label": "Approved by:", "names": ["[Name of Subject Coordinator]"],
     "role": "Subject Coordinator"},
]
