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
