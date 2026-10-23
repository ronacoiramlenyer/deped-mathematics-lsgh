# Mathematics – DepEd MATATAG-aligned Curriculum Maps, Learning Guides, and SimBook

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
| `sources/deped/` | DepEd source documents (source of truth) |
| `simbook/` | LSGH Math 7 SimBook – interactive book with one custom simulation per lesson |
| `output/` | Generated documents |

## Building

Run from this folder (`courses/mathematics/`); the builders and LSGH templates are shared at the repository root.

```bash
pip install python-docx
python3 ../../tools/cm_builder.py content/grade7_term1_cm.py \
  output/grade7/Grade7-CM-1st_Trim-SY2026-2027-Mathematics.docx
python3 ../../tools/lg_builder.py content/grade7_term1_lg.py \
  output/grade7/Grade7-LG-1st_Trim-SY2026-2027-Mathematics.docx
python3 ../../tools/cm_builder.py content/grade7_term2_cm.py \
  output/grade7/Grade7-CM-2nd_Trim-SY2026-2027-Mathematics.docx
python3 ../../tools/lg_builder.py content/grade7_term2_lg.py \
  output/grade7/Grade7-LG-2nd_Trim-SY2026-2027-Mathematics.docx
python3 ../../tools/cm_builder.py content/grade7_term3_cm.py \
  output/grade7/Grade7-CM-3rd_Trim-SY2026-2027-Mathematics.docx
python3 ../../tools/lg_builder.py content/grade7_term3_lg.py \
  output/grade7/Grade7-LG-3rd_Trim-SY2026-2027-Mathematics.docx
```

## Math 7 SimBook

`simbook/` is a dependency-free web book (HTML, CSS, vanilla JS, SVG). Every lesson page
(Terms 1–3, 27 lessons) has four parts:

1. **Hook** – the lesson's own simulation, with a mission and a discovery reveal.
2. **Lesson** – the traditional exposition as a 16:9 slide deck with speaker notes on the
   side (`simbook/deck.js`). Slides are generated from `simbook/content/lN.js` / `t2-lN.js` / `t3-lN.js` (`learn`):
   headings start slides; definitions, rules, tables, and lists go on the slide; each
   worked example gets its own slide whose steps reveal one click at a time; explanations,
   full solutions, and teaching prompts go to the notes. Arrow keys or clicks advance;
   Present opens full screen for the projector.
3. **Check Yourself** – 5 auto-generated formative items with instant feedback
   (4/5 marks the lesson as mastered on that device).
4. **Exercises** – 14 fixed, numbered items in Part A Skills Practice, Part B Problem
   Solving, and Part C Challenge, each with answer checking, a worked solution, and an
   answer key (`simbook/content/lN.js`, `exercises`).

| Lesson | Sim | Tabs |
| --- | --- | --- |
| 1 · A. Drawing Polygons | Polygon Studio | Explore, Build It |
| 2 · B. Angle Pairs and Classifying Polygons | Angle Pair Lab | Intersecting Lines, Split an Angle, Classify Polygons |
| 3 · C. Angles of Polygons | Angle Sum Machine | Triangle Split, Turtle Walk, Honeycomb Test |
| 4 · D. Percentages in Real Life | LSGH Mini Mall | Promo Lab, Price Change, Money Tools |
| 5 · E. Creating a Financial Plan | Baon Life Sim | Plan, Live the Week, Savings Goal |
| 6 · F. Rates | Rate Racer | Race, Best Buy |
| 7 · G. Rational Numbers | Number Line Explorer | Converter, Order It, Zoom Between |
| 8 · H. Operations on Rational Numbers | Fraction Kitchen | Fraction Bars, Kakanin Kitchen, Decimal Grid |
| 9 · I. Square Roots, Cube Roots, and Irrational Numbers | Roots Lab | Square Builder, Cube Builder, Root Estimator, Square of Area 2 |
| **Term 2** | | |
| 10 · A. Converting Units of Measure | Unit Ladder | Metric Staircase, Across Systems |
| 11 · B. Volume of a Cylinder | Cylinder Lab | Stack the Circles, Which Holds More? |
| 12 · C. Volume of Pyramids | Pyramid Lab | Pour Three Times, Estimate |
| 13 · D. Sets, Subsets, Union, and Intersection | Venn Lab | – |
| 14 · E. Subsets of Real Numbers | Real Number Map | – |
| 15 · F. Data Collection and Sampling | Sampling Lab | Sampling Lab, Which Method? |
| 16 · G. Organizing and Graphing Data | Graph Studio | Frequency Table, Bar ↔ Pie, Line Graph, Stem-and-Leaf |
| 17 · H. The Set of Integers | Integer Elevator | – |
| 18 · I. Comparing and Ordering Integers | Integer Number Line | Compare, Order |
| **Term 3** | | |
| 19 · A. Adding and Subtracting Integers | Integer Chips | Chip Board, Number Line Hops, Bar Model |
| 20 · B. Multiplying and Dividing Integers; Order of Operations | Sign Machine | Groups of Chips, Sign Patterns, GEMDAS Stepper |
| 21 · C. Absolute Value | Distance Finder | Distance from Zero, Real Distances |
| 22 · D. Variables, Constants, and Algebraic Expressions | Expression Machine | Variable or Constant?, Evaluate, Translate |
| 23 · E. Bar Models and the Properties of Equality | Balance Lab | Bar Model, Balance Scale, Name the Property |
| 24 · F. Formulas: Solving for a Variable | Formula Rearranger | Rearrange, Use It |
| 25 · G. Writing and Solving Equations | Equation Builder | Story to Equation, Solve It, Problem Solving |
| 26 · H. Experiments and Outcomes | Chance Lab | Coin Toss, Die Roll, Spinner Booth |
| 27 · I. Scientific Notation | Powers-of-Ten Zoom | Zoom, Convert, Operate |

**Motion.** Manipulatives never jump. `Sim.Spring` eases every animated value with a
slightly under-damped spring (a small elastic overshoot); `Sim.elasticSlider` follows the
pointer continuously and, on release, springs to the nearest allowed value (`step` or
`snaps`), rubber-banding past either end; `Sim.morphRegular` grows a new vertex out of a
side, so side counts morph instead of switching; `Sim.handleSet` keeps drag handles alive
across redraws and springs dragged points back inside their bounds. Reduced-motion
settings turn the animation off.

Add a lesson by writing `simbook/sims/<file>.js` that calls `Sim.register({...})`
(id, unit, title, competencies, mission, discovery, `mount(stage)`, `check()`) and adding
its `<script>` tag to `simbook/index.html`. The published copy lives at
https://claude.ai/artifact/LrpohtVMd8ifUt7nkd7FFr (lesson pages: `#lesson1` … `#lesson27`; Term 2 starts at `#lesson10`, Term 3 at `#lesson19`).
The LG's SIM HOOK cards and the CM's activities point to these sims.

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
