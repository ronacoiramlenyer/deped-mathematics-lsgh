# LSGH Curriculum Development – DepEd-aligned Course Documents

Curriculum maps (CM), learning guides (LG), and learning resources for La Salle Green Hills,
aligned with the official DepEd curriculum guides and adapted to the LSGH trimester calendar.
Each course keeps its own DepEd sources, content modules, outputs, and resources; the
document builders and LSGH templates are shared.

## Courses

| Course | Folder | Curriculum | Status |
| --- | --- | --- | --- |
| Mathematics (Grades 1–12) | [`courses/mathematics/`](courses/mathematics/README.md) | DepEd MATATAG | Grade 7 Terms 1–3 and Grade 8 Term 1: CM and LG; the Math SimBook for all grade levels |
| Fundamentals of Data Analytics | [`courses/data-analytics/`](courses/data-analytics/README.md) | DepEd Strengthened SHS Curriculum (Academic Elective) | Curriculum Map and Learning Guide (80 one-hour sessions, 6 units, 29 CG competencies) and the Data Analytics SimBook (15 lessons) |

## Layout

| Path | Contents |
| --- | --- |
| `courses/<course>/sources/` | Official DepEd documents – the source of truth for that course |
| `courses/<course>/content/` | CM and LG content as Python data (one module per document) |
| `courses/<course>/output/` | Generated `.docx` documents |
| `courses/<course>/simbook/` | SimBook – one custom simulation, slide deck, and exercise set per lesson (Math SimBook for all grades; Data Analytics SimBook) |
| `tools/cm_builder.py` | Builds the LSGH-format Curriculum Map `.docx` (landscape) from a content module |
| `tools/lg_builder.py` | Builds the LSGH-format Learning Guide `.docx` (portrait) from a content module |
| `tools/build_site.py` | Builds the SimBook web app (all SimBooks in one site) into `dist/` for Netlify |
| `netlify.toml` | Netlify build settings for the SimBook web app |
| `templates/` | LSGH document templates (header logo, page numbers; landscape and portrait) |

## Building

```bash
pip install python-docx
python3 tools/cm_builder.py courses/<course>/content/<module>.py courses/<course>/output/<name>.docx
python3 tools/lg_builder.py courses/<course>/content/<module>.py courses/<course>/output/<name>.docx
```

See each course's README for its calendar assumptions, codes, and conventions.

## SimBook web app (Netlify)

All SimBooks are served together as one static site, **SimBook**: a home page with one card per book,
the Math SimBook at `/math/`, and the Data Analytics SimBook at `/data-analytics/`.

```bash
python3 tools/build_site.py                      # builds dist/ (not committed)
python3 tools/build_site.py --zip SimBook-site   # also makes SimBook-site.zip for Netlify Drop
```

`netlify.toml` tells Netlify to run the build and publish `dist/`. To deploy:

1. In Netlify, choose **Add new site → Import an existing project → GitHub**, pick this repository and the
   branch to publish, and keep the build settings from `netlify.toml`.
2. Under **Site configuration → Change site name**, set the name to `simbook` (the address becomes
   `simbook.netlify.app` if that name is free; otherwise choose a variant such as `lsgh-simbook`).

Every push to the chosen branch then rebuilds the site. Alternatively, drag the zip (or the `dist/` folder) onto
https://app.netlify.com/drop for a one-off upload. To add a book, add an entry to `BOOKS` in `tools/build_site.py`.

## Adding a course

1. Create `courses/<course>/` with `sources/`, `content/`, and `output/`.
2. Put the official DepEd curriculum guide (PDF plus a text extract) in `sources/`.
3. Write the CM and LG content modules, quoting DepEd standards and competencies verbatim.
4. Add the course to the table above.
