"""Builds the SimBook web app: every course's SimBook in one static site.

Usage:
    python3 tools/build_site.py            # writes dist/
    python3 tools/build_site.py --zip PATH # also writes a zip of dist/ (for Netlify Drop)

Layout of dist/:
    index.html            SimBook home: one card per book
    math/                 courses/mathematics/simbook
    data-analytics/       courses/data-analytics/simbook

Each book's index.html is authored as a page fragment (it is also published as a claude.ai
artifact, which supplies the document skeleton). Here it is wrapped in a full HTML document,
and an "All SimBooks" link is added to its top bar. Netlify runs this script on every deploy
(see netlify.toml).
"""

import argparse
import html
import re
import shutil
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DIST = ROOT / "dist"

BOOKS = [
    {
        "slug": "math",
        "source": ROOT / "courses" / "mathematics" / "simbook",
        "title": "Math SimBook",
        "kicker": "Mathematics · DepEd MATATAG",
        "blurb": "Polygons, percentages, integers, algebra, data, and the coordinate plane – one simulation for every lesson, "
                 "with slides, quick checks, and exercises.",
        "tone": "var(--accent)",
    },
    {
        "slug": "data-analytics",
        "source": ROOT / "courses" / "data-analytics" / "simbook",
        "title": "Data Analytics SimBook",
        "kicker": "Senior High School · Academic Elective",
        "blurb": "Fundamentals of Data Analytics: clean, pivot, test, chart, and verify realistic data, practicing the "
                 "skills used in Google Sheets, Google Colab, and Looker Studio.",
        "tone": "var(--shape-a)",
    },
]

HUB_LINK_CSS = (".hub-link { color: inherit; text-decoration: none; font-size: .85rem; font-weight: 700; "
                "border: 1px solid currentColor; border-radius: 8px; padding: 5px 10px; opacity: .9; }\n"
                ".hub-link:hover, .hub-link:focus-visible { opacity: 1; background: rgba(255, 255, 255, .12); }\n"
                "@media (max-width: 520px) { .hub-link { display: none; } }\n")


def book_summary(src):
    """Lesson count and the grade/term coverage, read from the book's own files."""
    regs = [m.groups() for f in sorted((src / "sims").glob("*.js")) for m in re.finditer(r'id: "([^"]+)", unit: "([^"]+)"', f.read_text())]
    app = (src / "app.js").read_text()
    units = {m.group(3): (int(m.group(1)), int(m.group(2)))
             for m in re.finditer(r'grade: (\d+), term: (\d+), key: "([^"]+)"', app)}
    coverage = {}
    for _id, unit in regs:
        if unit in units:
            g, t = units[unit]
            coverage.setdefault(g, set()).add(t)
    parts = []
    for g in sorted(coverage):
        ts = sorted(coverage[g])
        terms = f"Term {ts[0]}" if len(ts) == 1 else f"Terms {ts[0]}–{ts[-1]}"
        parts.append(f"Grade {g} · {terms}")
    return len(regs), " · ".join(parts)


def wrap_page(fragment, title):
    """Turn a SimBook page fragment into a full HTML document with a link back to the hub."""
    fragment = re.sub(r'<meta name="claude:[^>]*>\n?', "", fragment)
    head, sep, body = fragment.partition("<header")
    if not sep:
        raise ValueError("SimBook page has no <header> top bar")
    head = head.replace("</style>", HUB_LINK_CSS + "</style>", 1)
    body = "<header" + body
    body = body.replace('<div class="spacer"></div>',
                        '<div class="spacer"></div>\n  <a class="hub-link" href="../">All SimBooks</a>', 1)
    return ("<!doctype html>\n<html lang=\"en\">\n<head>\n<meta charset=\"utf-8\">\n"
            "<meta name=\"viewport\" content=\"width=device-width, initial-scale=1, viewport-fit=cover\">\n"
            f"<meta name=\"description\" content=\"{html.escape(title)} – La Salle Green Hills\">\n"
            f"{head}</head>\n<body>\n{body}</body>\n</html>\n")


def hub_page(cards, style):
    items = "\n".join(
        f'''    <a class="book" href="{c["slug"]}/" style="--tone: {c["tone"]}">
      <span class="k">{html.escape(c["kicker"])}</span>
      <h2>{html.escape(c["title"])}</h2>
      <p>{html.escape(c["blurb"])}</p>
      <p class="meta"><b>{c["count"]} lessons</b>{(" · " + html.escape(c["coverage"])) if c["coverage"] else ""}</p>
      <span class="go">Open the book →</span>
    </a>''' for c in cards)
    return f'''<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>SimBook</title>
<meta name="description" content="SimBook – La Salle Green Hills interactive simulation books">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,600;12..96,800&family=Atkinson+Hyperlegible:ital,wght@0,400;0,700;1,400&family=IBM+Plex+Mono:wght@500&display=swap">
<style>
{style}
body {{ margin: 0; background: var(--bg); color: var(--ink); font-family: var(--body); }}
.hub-top {{ background: var(--accent); color: var(--accent-ink); padding: 14px max(16px, env(safe-area-inset-left, 0px)); }}
.hub-top b {{ font-family: var(--display); font-weight: 800; font-size: 1.4rem; }}
.hub-top span {{ margin-left: 10px; font-size: .8rem; letter-spacing: .06em; text-transform: uppercase; opacity: .85; }}
.hub {{ max-width: 1100px; margin: 0 auto; padding: 32px 16px 48px; display: grid; gap: 28px; }}
.hero h1 {{ font-family: var(--display); font-weight: 800; font-size: clamp(2.2rem, 6vw, 3.6rem); letter-spacing: -.02em; margin: 0; }}
.hero h1 em {{ font-style: normal; color: var(--accent); }}
.hero p {{ color: var(--muted); max-width: 62ch; font-size: 1.05rem; margin: 10px 0 0; }}
.books {{ display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 320px), 1fr)); gap: 18px; }}
.book {{ display: grid; gap: 8px; align-content: start; text-decoration: none; color: var(--ink); background: color-mix(in srgb, var(--tone) 8%, var(--paper));
  border: 1px solid color-mix(in srgb, var(--tone) 35%, var(--line)); border-top: 6px solid var(--tone); border-radius: 16px; padding: 22px; transition: transform .2s, box-shadow .2s; }}
.book:hover, .book:focus-visible {{ transform: translateY(-3px); box-shadow: 0 10px 28px rgba(10, 40, 25, .15); }}
.book .k {{ font-family: var(--mono); font-size: .75rem; letter-spacing: .08em; text-transform: uppercase; color: color-mix(in srgb, var(--tone) 85%, var(--ink)); }}
.book h2 {{ font-family: var(--display); font-weight: 800; font-size: 1.7rem; margin: 0; }}
.book p {{ margin: 0; color: var(--muted); }}
.book .meta {{ color: var(--ink); }}
.book .go {{ margin-top: 6px; font-weight: 700; color: color-mix(in srgb, var(--tone) 85%, var(--ink)); }}
.foot {{ color: var(--muted); font-size: .85rem; }}
@media (prefers-reduced-motion: reduce) {{ .book {{ transition: none; }} }}
</style>
</head>
<body>
<header class="hub-top"><b>SimBook</b><span>La Salle Green Hills</span></header>
<main class="hub">
  <section class="hero">
    <h1>Learn by <em>playing with it.</em></h1>
    <p>Interactive simulation books for La Salle Green Hills. Every lesson opens with its own simulation, then teaches the
    lesson on slides with speaker notes, checks understanding, and gives practice exercises.</p>
  </section>
  <section class="books" aria-label="SimBooks">
{items}
  </section>
  <p class="foot">Aligned with the DepEd MATATAG curriculum and the DepEd Strengthened Senior High School curriculum.
  Progress is saved on each device.</p>
</main>
</body>
</html>
'''


def build():
    if DIST.exists():
        shutil.rmtree(DIST)
    DIST.mkdir()
    cards, style = [], None
    for b in BOOKS:
        out = DIST / b["slug"]
        shutil.copytree(b["source"], out)
        page = (b["source"] / "index.html").read_text()
        (out / "index.html").write_text(wrap_page(page, b["title"]))
        if style is None:
            # The hub reuses the books' color and font tokens (light and dark).
            css = page.split("<style>", 1)[1]
            style = css[:css.index("/* ---------- top bar")].strip()
        count, coverage = book_summary(b["source"])
        cards.append({**b, "count": count, "coverage": coverage})
    (DIST / "index.html").write_text(hub_page(cards, style))
    (DIST / "404.html").write_text(hub_page(cards, style).replace("<title>SimBook</title>", "<title>SimBook – page not found</title>"))
    return cards


if __name__ == "__main__":
    ap = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    ap.add_argument("--zip", help="also write a zip of dist/ to this path (without .zip)")
    args = ap.parse_args()
    for c in build():
        print(f"{c['slug']}/: {c['title']} – {c['count']} lessons {c['coverage']}".rstrip())
    if args.zip:
        print(shutil.make_archive(args.zip, "zip", DIST))
    print(f"Built {DIST}")
