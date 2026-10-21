# LSGH Mathematics – DepEd MATATAG-aligned Curriculum Maps and Learning Guides

Curriculum documents for the La Salle Green Hills Mathematics Department, aligned with
the DepEd MATATAG curriculum and adapted to the LSGH trimester calendar.

## Source of truth

- `sources/deped/MATATAG-Mathematics-CG-Grades1-4-and-7.pdf` – DepEd MATATAG
  Mathematics Curriculum Guide (Grades 1, 4, and 7): content standards, performance
  standards, and learning competencies per quarter.
- `sources/deped/MATATAG-Grade7-Mathematics-Three-Term-BOW-SY2026-2027.pdf` – DepEd
  Grade 7 Mathematics Three-Term Budget of Work (updated April 17, 2026), which
  redistributes the four quarters into three 10-week terms. Term 1 = CG Quarter 1
  (competencies 1–14) + Quarter 2 competencies 1–2.

Text extracts sit beside each PDF for searching and checking. Content standards,
performance standards, and competencies marked ★ in the CMs are quoted verbatim.

## Calendar assumptions

- 5 math meetings per 6-day cycle
- 11 cycles per trimester; 10 usable cycles = 50 meetings (C1,M1 to C10,M5)
- Cycle 11 is a buffer (make-ups, remediation and enrichment, suspensions)
- DepEd Week *n* ≈ LSGH Cycle *n*

## Layout

| Path | Contents |
| --- | --- |
| `content/` | CM and LG content as Python data (one file per grade/term) |
| `tools/cm_builder.py` | Generates the LSGH-format Curriculum Map `.docx` (landscape) |
| `tools/lg_builder.py` | Generates the LSGH-format Learning Guide `.docx` (portrait) |
| `templates/lsgh_template.docx` | LSGH header (logo, page numbers), landscape letter page |
| `templates/lsgh_template_portrait.docx` | LSGH header, portrait letter page (for LGs) |
| `output/` | Generated documents |

## Building

```bash
pip install python-docx
python3 tools/cm_builder.py content/grade7_term1_cm.py \
  output/grade7/Grade7-CM-1st_Trim-SY2026-2027-Mathematics.docx
python3 tools/lg_builder.py content/grade7_term1_lg.py \
  output/grade7/Grade7-LG-1st_Trim-SY2026-2027-Mathematics.docx
```

## Learning Guide conventions

- Lesson development follows DRAW (Acquisition), TUNE (Make-Meaning), and RELEASE
  (Transfer), as in the LSGH sample LG.
- ID# tags mirror the sample's usage: ID#1 objectives, ID#2 recall/hook, ID#3 presenting
  the concept, ID#4 discussion, ID#5 guided practice, ID#6 hands-on performance,
  ID#7 sharing/feedback, ID#8 valuing, ID#9 assessment and reflection.

## Codes used

- Competencies (UbD): **A** Acquisition · **M** Meaning-making · **T** Transfer
- Assessments: **CP** class participation · **LW** guided hands-on activity ·
  **SA** challenge activity · **QZ** quiz · **PT** performance task · **TE** term exam
