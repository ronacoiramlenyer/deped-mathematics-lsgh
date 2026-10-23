# Fundamentals of Data Analytics – Curriculum Guide vs. Course Specification

Source of truth: `sources/deped/SSHS-Fundamentals-of-Data-Analytics-CG.pdf` (DepEd Strengthened SHS,
6 pages; text extract beside it). Learning competencies (LC) are numbered as in the CG, in its two
parts: **P1 Data Analytics** (LC 1–14) and **P2 Data Analysis, Visualization, and Storytelling** (LC 1–15).

## Course profile – what the CG settles

| Item | Course spec | Official CG |
| --- | --- | --- |
| Prerequisite | None | **None** ✓ |
| Classification | Academic Elective | **Elective: Academic** ✓ |
| Time | 80 hours | **80 hours for one term** – the whole course fits in one LSGH trimester |
| Grade level | Provisionally Grade 12 | Not stated – confirm with the school's approved SHS offering |
| Project | Unit 7 at the end | "Throughout the course, learners gradually develop a project … prepared for presentation by the end of the course" |
| Python | Unit 4 (10 h) | **Not in the CG.** The CG names spreadsheets, statistical software, and data visualization software. The nearest hook is P1 LC 9 (collecting data from public datasets, **scripts**, and manual entry). |
| Statistics depth | Correlation, regression, hypothesis testing "where prescribed" | **Prescribed:** P2 LC 1 (mean, median, mode; range, variance, standard deviation, percentiles, quartiles) and P2 LC 2 (t-test, z-test, correlation, regression) |

## Spec units mapped to CG competencies

| Spec unit (hours) | CG competencies covered |
| --- | --- |
| 1 Foundations of Data Analytics (8) | P1 LC 1–3 (data analytics, data types, data life cycle and types of analysis), LC 4–5 (privacy, ethics), LC 6–7 (applications, skills, careers) |
| 2 Data Collection and Management (10) | P1 LC 8–9 (data sources; collection from public datasets, scripts, manual entry), LC 10 (exploratory data analysis), LC 11 (backups and tracking changes) |
| 3 Spreadsheet Processing and Analysis (14) | P1 LC 12–14 (missing values, duplicates, inconsistencies; converting formats and types; filtering pivot tables), P2 LC 3–5 (conditional and lookup functions and formulas combining them), P2 LC 8–9 (tables, slicers, aggregation; pivot tables with percentages, differences, running totals, rankings) |
| 4 Python for Data Preparation (10) | No CG competency of its own – an LSGH enrichment that re-applies P1 LC 9, 12, and 13 (scripted collection, cleaning, and conversion) in Colab/pandas |
| 5 Statistical Data Analysis (14) | P2 LC 1–2 |
| 6 Data Visualization and Storytelling (12) | P2 LC 6–7 (importance of visualization; conditional formatting, sparklines, and charts in spreadsheets), LC 10 (report filters, timelines, slicers), LC 11–13 (visualization software: setup, import, visual elements, interactive dashboards, sorting, drilldown, filtering, hierarchy), LC 14 (storytelling) |
| 7 Culminating Project and Peer Review (12) | P2 LC 15 (present a data analytics project using real-world data); peer verification is an LSGH addition |

All 29 CG competencies are covered. Points to decide:

1. **Python (Unit 4).** It can stay as an LSGH-added unit (marked as not DepEd in the CM, the way the
   Math CMs mark school-made competencies), but its 10 hours come out of the 80 that the CG
   competencies need. Options: keep 10 h; shrink it to about 4–6 h as a demonstration; or fold it into
   Unit 2/3 as the "scripts" method of P1 LC 9.
2. **Project timing.** The CG asks for a project developed throughout the course. Unit 7 can keep its
   12 hours for completion and peer review, with project milestones (scaffolds) placed at the end of
   Units 2, 3, 5, and 6.
3. **Looker Studio** fits P2 LC 11–13 ("data visualization software").
4. **jamovi or JASP** fits P2 LC 1–2 ("statistical software").
