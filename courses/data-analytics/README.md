# Fundamentals of Data Analytics

Senior High School Academic Elective (DepEd Strengthened Senior High School Curriculum),
provisionally planned for Grade 12 · 80 hours for one term · no prerequisite.

**Tool stack:** Google Sheets → Google Colab (Python/pandas) → Looker Studio (jamovi or JASP optional).

- [`course-spec.md`](course-spec.md) – the department's course outline and instructional design specifications (as received).
- `sources/deped/SSHS-Fundamentals-of-Data-Analytics-CG.pdf` – the official DepEd Curriculum Guide
  (text extract beside it). It is the source of truth: content standards, performance standards, and learning competencies are
  quoted verbatim, and the unit hours and statistical depth in the spec are checked against it.
- [`cg-alignment.md`](cg-alignment.md) – how the spec's seven units map onto the CG's 29 competencies, and what to decide.
- `content/data_analytics_cm.py` – Curriculum Map content (80 one-hour sessions, S1–S80).
- `output/DataAnalytics-CM-SY2026-2027.docx` – the generated Curriculum Map.

Build from the repository root:

```bash
python3 tools/cm_builder.py courses/data-analytics/content/data_analytics_cm.py \
  courses/data-analytics/output/DataAnalytics-CM-SY2026-2027.docx
```

## Data Analytics SimBook

`simbook/` – an interactive book with one custom simulation per lesson (15 lessons), built on the same
engine as the Math 7 SimBook. Each lesson page has a hook sim, the lesson as a slide deck with speaker notes
(including Google Sheets formulas and pandas code blocks), five Check Yourself items, and 14 exercises.
Published copy: https://claude.ai/artifact/9cN5TM7ne3kwXFBk2yMYJW (lesson pages `#lesson1` … `#lesson15`).
All datasets are hand-made sample data with Filipino and LSGH contexts, not official statistics.

| Lesson | Sim | Tabs |
| --- | --- | --- |
| 1 · What Is Data Analytics? | Data Lens | Sort the Data, Life Cycle, Which Analysis? |
| 2 · Data Privacy and Ethics | Privacy Shield | Anonymize, Ethics Calls |
| 3 · Applications and Careers | Analytics Everywhere | Industry Map, Skill Builder |
| 4 · Data Sources and Collection Methods | Collect It Three Ways | Source Sorter, Three Ways, Is It Reliable? |
| 5 · Exploring and Securing Data | First Look | Explore, Version History |
| 6 · Cleaning and Converting Data | Data Cleaner | Spot the Problems, Clean It, Before / After |
| 7 · Conditional and Lookup Functions | Formula Lab | Conditional, Lookup, Combine |
| 8 · Tables, Pivot Tables, and Aggregation | Pivot Builder | – |
| 9 · Descriptive Statistics | Spread Lab | Drag the Data, Box and Quartiles, Formulas |
| 10 · Inferential Statistics | Test Lab | Two Groups, z-test, Correlation and Regression |
| 11 · Visualizing Data in Spreadsheets | Chart Chooser | Chart Types, Format It, Honest or Misleading?, Slicers |
| 12 · Interactive Dashboards in Looker Studio | Dashboard Builder | Build, Explore, Choose the Visual |
| 13 · Data Storytelling | Story Builder | Story Arc, Emphasis, Know Your Audience |
| 14 · Completing the Analytics Project | Project Pipeline | Workflow, Reproducibility Check |
| 15 · Independent Peer Verification | Verify It | Find the Issues, Write the Critique, Respond |

## Course design decisions

- One term of 80 one-hour sessions (S1–S80); no trimester split.
- Six units: the spec's Python unit is folded into Units 2–3 (Colab/pandas as the "scripts" method
  of CG competency A1.9 and as a second cleaning tool), so Unit 2 has 13 sessions, Unit 3 has 19, and
  Unit 5 has 14.
- The project grows through milestones PM1–PM4 (end of Units 2–5) and ends in Unit 6 with
  independent peer verification and critique presentations.
- Codes: A1.n / A2.n = CG Part 1 / Part 2 competencies (★, verbatim); M = meaning-making;
  T = transfer; L = LSGH-added Python skills. Assessments: CP participation, QZ quiz, LW lab work,
  SA challenge activity, PE practical exam, PM project milestone, FP final project.

## Open items

- [x] Official DepEd Curriculum Guide in `sources/deped/`.
- [ ] The rest of the course specification (the text received stops at the CM matrix columns).
- [x] Calendar: 80 one-hour sessions in one term.
- [x] Prerequisite: the official CG says None.
- [x] Python: folded into Units 2–3.
- [ ] Grade level: confirm against the school's approved SHS offering.
