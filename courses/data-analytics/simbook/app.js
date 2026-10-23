/* Data Analytics SimBook – book shell: cover, lesson pages, routing, and self-checks. */
(function () {
  "use strict";
  const { h, s, clear, lessons } = Sim;

  const UNITS = [
    { key: "1", title: "Foundations of Data Analytics", sub: "Data, Privacy and Ethics, Applications", cg: "CG Part 1 · Content 1–3", sessions: "S1–S8" },
    { key: "2", title: "Data Collection and Management", sub: "Sources, Collection Methods, Exploration, Backups", cg: "CG Part 1 · Content 4–5", sessions: "S9–S21" },
    { key: "3", title: "Spreadsheet and Python Processing", sub: "Cleaning, Conditional and Lookup Functions, Pivot Tables", cg: "CG Part 1 · Content 5 · Part 2 · Content 2–3", sessions: "S22–S40" },
    { key: "4", title: "Statistical Data Analysis", sub: "Descriptive and Inferential Statistics", cg: "CG Part 2 · Content 1", sessions: "S41–S54" },
    { key: "5", title: "Data Visualization and Storytelling", sub: "Charts, Dashboards, and Data Stories", cg: "CG Part 2 · Content 3–5", sessions: "S55–S68" },
    { key: "6", title: "Culminating Project and Peer Verification", sub: "The Complete Workflow and Independent Review", cg: "CG Part 2 · Content 6", sessions: "S69–S80" },
  ];

  const STORE_KEY = "da-simbook-mastered";
  function mastered() {
    try { return new Set(JSON.parse(localStorage.getItem(STORE_KEY) || "[]")); } catch (e) { return new Set(); }
  }
  function markMastered(id) {
    try { const m = mastered(); m.add(id); localStorage.setItem(STORE_KEY, JSON.stringify([...m])); } catch (e) { /* storage unavailable */ }
  }

  const main = document.getElementById("main");
  const rail = document.getElementById("rail");
  const jump = document.getElementById("jump");
  let cleanup = null;

  function buildNav(current) {
    const done = mastered();
    clear(rail); clear(jump);
    rail.append(h("a", { href: "#home", class: current === "home" ? "on" : "" }, h("span", { class: "n" }, "◎"), h("span", {}, "Contents")));
    jump.append(h("option", { value: "home" }, "Contents"));
    for (const u of UNITS) {
      if (!lessons.some((x) => x.unit === u.key)) continue;
      const group = h("div", {}, h("h3", {}, `Unit ${u.key} · ${u.title}`));
      const og = h("optgroup", { label: `Unit ${u.key} · ${u.title}` });
      for (const l of lessons.filter((x) => x.unit === u.key)) {
        group.append(h("a", { href: "#" + l.id, class: current === l.id ? "on" : "" },
          h("span", { class: "n" }, String(l.num)),
          h("span", {}, l.title, done.has(l.id) ? h("span", { class: "done", title: "Mastered" }, " ✓") : null)));
        og.append(h("option", { value: l.id, selected: current === l.id }, `${l.num}. ${l.title}`));
      }
      rail.append(group); jump.append(og);
    }
    jump.value = current;
  }
  jump.addEventListener("change", () => { location.hash = jump.value; });

  // Hideable navigation: the top bar and lesson rail fold away so the sim, slides,
  // and exercises get the whole window. The choice is remembered on this device.
  const NAV_KEY = "simbook-nav-hidden";
  const navToggle = document.getElementById("navToggle");
  const navRestore = document.getElementById("navRestore");
  function setNav(hidden, remember = true) {
    document.body.classList.toggle("nav-hidden", hidden);
    navToggle.setAttribute("aria-expanded", String(!hidden));
    navRestore.hidden = !hidden;
    if (remember) { try { localStorage.setItem(NAV_KEY, hidden ? "1" : "0"); } catch (e) { /* storage unavailable */ } }
    window.dispatchEvent(new Event("resize"));
  }
  navToggle.addEventListener("click", () => { setNav(true); navRestore.focus(); });
  navRestore.addEventListener("click", () => { setNav(false); navToggle.focus(); });
  try { if (localStorage.getItem(NAV_KEY) === "1") setNav(true, false); } catch (e) { /* storage unavailable */ }

  // ------------------------------------------------------------ cover

  function coverArt() {
    const svg = s("svg", { viewBox: "0 0 360 240", role: "img", "aria-label": "A bar chart, a scatter plot with a trend line, and a table" });
    [[40, 70], [80, 110], [120, 50], [160, 140]].forEach(([x, hgt], i) =>
      svg.append(s("rect", { x: x - 14, y: 190 - hgt, width: 28, height: hgt, rx: 4, fill: i === 3 ? "var(--shape-b)" : "var(--shape-a-soft)", stroke: "var(--shape-a)", "stroke-width": 2 })));
    svg.append(s("line", { x1: 18, y1: 190, x2: 182, y2: 190, stroke: "var(--ink)", "stroke-width": 2 }));
    [[210, 160], [225, 150], [240, 138], [255, 140], [270, 118], [285, 112], [300, 96], [315, 90], [330, 74]].forEach(([x, y]) =>
      svg.append(s("circle", { cx: x, cy: y, r: 5, fill: "var(--gold-soft)", stroke: "var(--gold)", "stroke-width": 2 })));
    svg.append(s("line", { x1: 204, y1: 168, x2: 340, y2: 70, stroke: "var(--shape-b)", "stroke-width": 3, "stroke-linecap": "round" }));
    svg.append(s("text", { x: 272, y: 190, "text-anchor": "middle", class: "svg-text" }, "r = 0.97"));
    svg.append(s("text", { x: 100, y: 222, "text-anchor": "middle", class: "svg-text" }, "=SUMIFS( )"));
    svg.append(s("text", { x: 272, y: 222, "text-anchor": "middle", class: "svg-text" }, "df.dropna()"));
    return svg;
  }

  function renderCover() {
    const done = mastered();
    const wrap = h("div", { class: "cover" });
    wrap.append(h("section", { class: "cover-hero" },
      h("div", {},
        h("p", { class: "eyebrow" }, "Fundamentals of Data Analytics · Senior High School · SY 2026–2027"),
        h("h1", {}, "Learn data by ", h("em", {}, "working with it.")),
        h("p", {}, "Every lesson in this book has its own simulation. Sort, clean, pivot, test, chart, and verify real-looking data – then check yourself and practice the skills you will use in Google Sheets, Google Colab, and Looker Studio. Aligned with the DepEd Strengthened SHS Curriculum Guide for Fundamentals of Data Analytics."),
        h("p", { class: "note" }, `${done.size} of ${lessons.length} lessons mastered on this device.`)),
      coverArt()));
    for (const u of UNITS) {
      if (!lessons.some((x) => x.unit === u.key)) continue;
      const unit = h("section", { class: "unit" },
        h("div", { class: "unit-head" }, h("h2", {}, `Unit ${u.key} · ${u.title}`), h("span", { class: "tag" }, `${u.sub} · ${u.cg} · ${u.sessions}`)));
      const cards = h("div", { class: "cards" });
      for (const l of lessons.filter((x) => x.unit === u.key)) {
        cards.append(h("a", { class: "card", href: "#" + l.id },
          h("span", { class: "k" }, `Lesson ${l.num} · ${l.letter}${done.has(l.id) ? " · ✓ mastered" : ""}`),
          h("h3", {}, l.title),
          h("p", {}, `Sim: ${l.simName}`),
          h("p", {}, l.bigQuestion)));
      }
      unit.append(cards);
      wrap.append(unit);
    }
    main.append(wrap);
  }

  // ------------------------------------------------------------ lesson

  function renderLesson(l) {
    const unit = UNITS.find((u) => u.key === l.unit);
    const idx = lessons.indexOf(l);
    const content = Sim.content[l.id] || { learn: [], exercises: [] };
    const stage = h("section", { class: "stage", "aria-label": l.simName });
    const side = h("aside", { class: "panel" },
      h("h2", {}, "Your mission"),
      h("ol", {}, l.mission.map((m) => h("li", {}, m))),
      h("details", { class: "discover" }, h("summary", {}, "What did you discover?"), h("p", {}, l.discovery)),
      h("p", { class: "note" }, "Now read the lesson below to see how data analysts describe what you found."));
    const sections = [
      { id: "hook", label: "1 · Hook", title: `Hook · ${l.simName}`, body: h("div", { class: "spread" }, stage, side),
        intro: "Start here. Play with the simulation and look for a pattern before the lesson." },
      { id: "learn", label: "2 · Lesson", title: "Lesson", body: Sim.renderDeck(l, content.learn),
        intro: "Click the slide or press → to reveal each step. The notes on the side have the details. Press Present for full screen." },
      { id: "check", label: "3 · Check Yourself", title: "Check Yourself", body: h("div", { class: "panel check-panel" }, checkPanel(l)),
        intro: "Five quick questions, new every time. Get 4 out of 5 to master the lesson." },
      { id: "exercises", label: "4 · Exercises", title: `Exercises ${l.num}`, body: Sim.renderExercises(l, content.exercises) },
    ];
    const jumpTo = (id) => document.getElementById(`sec-${id}`).scrollIntoView({ behavior: Sim.reducedMotion() ? "auto" : "smooth", block: "start" });
    main.append(h("article", { class: "lesson" },
      h("header", { class: "lesson-head" },
        h("p", { class: "eyebrow" }, `Unit ${unit.key} · ${unit.title} · Lesson ${l.num}`),
        h("h1", {}, `${l.letter}. ${l.title}`),
        h("div", { class: "meta" },
          h("span", { class: "chip" }, `Sim: ${l.simName}`),
          h("span", { class: "chip" }, `Competencies ${l.comps.join(", ")}`),
          h("span", { class: "chip gold" }, `${l.sessions} · ${l.cg}`)),
        h("p", { class: "bigq" }, h("b", {}, "Big question: "), l.bigQuestion),
        h("nav", { class: "section-nav", "aria-label": "Lesson sections" }, sections.map((sec) => h("button", { type: "button", onclick: () => jumpTo(sec.id) }, sec.label)))),
      sections.map((sec) => h("section", { class: "lesson-section", id: `sec-${sec.id}` },
        h("h2", { class: "section-title" }, sec.title), sec.intro ? h("p", { class: "note" }, sec.intro) : null, sec.body)),
      h("nav", { class: "footer-nav" },
        idx > 0 ? h("a", { href: "#" + lessons[idx - 1].id }, `← ${lessons[idx - 1].title}`) : h("span"),
        idx < lessons.length - 1 ? h("a", { href: "#" + lessons[idx + 1].id }, `${lessons[idx + 1].title} →`) : h("a", { href: "#home" }, "Back to contents"))));
    cleanup = l.mount(stage) || null;
  }

  function checkPanel(l) {
    const box = h("div", { class: "check-q" });
    const head = h("div", { class: "check-row" });
    const score = h("span", { class: "score" });
    head.append(score);
    const panel = h("div", { class: "check-q" }, head, box);
    const ROUND = 5;
    let n = 0, right = 0;
    function next() {
      clear(box);
      if (n === ROUND) {
        const ok = right >= 4;
        if (ok) { markMastered(l.id); buildNav(l.id); }
        box.append(h("p", { class: "feedback " + (ok ? "ok" : "bad") },
          ok ? `${right}/${ROUND} – lesson mastered! Try another set to keep sharp.` : `${right}/${ROUND}. Go back to the sim, then try a new set. You need 4 out of 5.`),
          h("button", { class: "btn", type: "button", onclick: () => { n = 0; right = 0; next(); } }, "New set"));
        score.textContent = "";
        return;
      }
      score.textContent = `Question ${n + 1} of ${ROUND} · ${right} correct`;
      const item = l.check();
      const fb = h("p", { class: "feedback", "aria-live": "polite" });
      const nextBtn = h("button", { class: "btn", type: "button", hidden: true, onclick: () => { n++; next(); } }, "Next");
      let answered = false;
      const finish = (ok) => {
        if (answered) return;
        answered = true;
        if (ok) right++;
        fb.className = "feedback " + (ok ? "ok" : "bad");
        fb.textContent = (ok ? "Correct! " : "Not quite. ") + (item.explain || "");
        nextBtn.hidden = false;
        nextBtn.focus();
      };
      box.append(h("p", { class: "q" }, item.q));
      if (item.choices) {
        const row = h("div", { class: "choices" });
        item.choices.forEach((c) => row.append(h("button", { type: "button", onclick: () => finish(c === item.answer) }, c)));
        box.append(row);
      } else {
        const input = h("input", { type: "text", inputmode: "decimal", id: `chk-${l.id}`, "aria-label": "Your answer", autocomplete: "off" });
        const check = () => {
          if (answered) return;
          const ok = item.accept ? item.accept(input.value) : numericMatch(input.value, item.answer, item.tol);
          finish(ok);
        };
        input.addEventListener("keydown", (e) => { if (e.key === "Enter") check(); });
        box.append(h("div", { class: "check-row" }, input, item.unit ? h("span", {}, item.unit) : null,
          h("button", { class: "btn", type: "button", onclick: check }, "Check")));
        if (item.hint) box.append(h("p", { class: "note" }, item.hint));
      }
      box.append(fb, nextBtn);
    }
    next();
    return panel;
  }

  function numericMatch(text, answer, tol = 0.01) {
    const f = Sim.parseNumber(text);
    if (!f) return false;
    const target = answer instanceof Sim.Frac ? answer.value() : answer;
    return Math.abs(f.value() - target) <= tol + 1e-9;
  }

  // ------------------------------------------------------------ router

  function route() {
    if (cleanup) { try { cleanup(); } catch (e) { /* ignore */ } cleanup = null; }
    clear(main);
    const id = location.hash.replace("#", "") || "home";
    const lesson = lessons.find((l) => l.id === id);
    buildNav(lesson ? lesson.id : "home");
    if (lesson) renderLesson(lesson); else renderCover();
    window.scrollTo(0, 0);
  }
  window.addEventListener("hashchange", route);
  route();
})();
