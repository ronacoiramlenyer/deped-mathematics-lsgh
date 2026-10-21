# LSGH Mathematics – DepEd MATATAG-aligned Curriculum Maps and Learning Guides

Curriculum documents for the La Salle Green Hills Mathematics Department, aligned with
the DepEd MATATAG curriculum and adapted to the LSGH trimester calendar.

## Source of truth

`sources/deped/MATATAG-Grade7-Mathematics-Three-Term-BOW-SY2026-2027.pdf` – DepEd
MATATAG Grade 7 Mathematics Three-Term Budget of Work for Learning Competencies
(last updated April 17, 2026). DepEd's three-term BOW already redistributes the four
MATATAG quarters into three terms of 10 weeks each. A text extract sits beside it for
searching and checking.

Content standards, performance standards, and competencies marked ★ in the CMs are
quoted verbatim from this document.

## Calendar assumptions

- 5 math meetings per 6-day cycle
- 11 cycles per trimester; 10 usable cycles = 50 meetings (C1,M1 to C10,M5)
- Cycle 11 is a buffer (make-ups, remediation and enrichment, suspensions)
- DepEd Week *n* ≈ LSGH Cycle *n*

## Layout

| Path | Contents |
| --- | --- |
| `content/` | CM content as Python data (one file per grade/term) |
| `tools/cm_builder.py` | Generates the LSGH-format CM `.docx` from a content file |
| `templates/lsgh_template.docx` | LSGH header (logo, page numbers), landscape letter page |
| `output/` | Generated documents |

## Building

```bash
pip install python-docx
python3 tools/cm_builder.py content/grade7_term1_cm.py \
  output/grade7/Grade7-CM-1st_Trim-SY2026-2027-Mathematics.docx
```

## Codes used

- Competencies (UbD): **A** Acquisition · **M** Meaning-making · **T** Transfer
- Assessments: **CP** class participation · **LW** guided hands-on activity ·
  **SA** challenge activity · **QZ** quiz · **PT** performance task · **TE** term exam
