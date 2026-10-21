/* Math 7 SimBook – book shell: cover, lesson pages, routing, and self-checks. */
(function () {
  "use strict";
  const { h, s, clear, lessons } = Sim;

  const UNITS = [
    { key: "A", title: "Shape Up!", sub: "Polygons and Angles", domain: "Measurement and Geometry",
      weeks: "DepEd Weeks 1–3" },
    { key: "B", title: "Money Smart!", sub: "Percentages, Financial Planning, and Rates",
      domain: "Number and Algebra", weeks: "DepEd Weeks 4–6" },
    { key: "C", title: "Number Line Adventures!", sub: "Rational Numbers, Roots, and Irrational Numbers",
      domain: "Number and Algebra", weeks: "DepEd Weeks 7–10" },
  ];

  const STORE_KEY = "math7-simbook-mastered";
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

  // ------------------------------------------------------------ cover

  function coverArt() {
    const svg = s("svg", { viewBox: "0 0 360 240", role: "img", "aria-label": "Polygons, a peso coin, and a number line" });
    const hex = Sim.regularPolygon(6, 95, 95, 62, 0);
    svg.append(s("polygon", { points: hex.map((p) => `${p.x},${p.y}`).join(" "), fill: "var(--shape-a-soft)", stroke: "var(--shape-a)", "stroke-width": 3 }));
    svg.append(s("text", { x: 95, y: 100, "text-anchor": "middle", class: "svg-text" }, "120°"));
    svg.append(s("circle", { cx: 255, cy: 85, r: 50, fill: "var(--gold-soft)", stroke: "var(--gold)", "stroke-width": 3 }));
    svg.append(s("text", { x: 255, y: 80, "text-anchor": "middle", class: "svg-text", "font-size": 22 }, "₱"));
    svg.append(s("text", { x: 255, y: 104, "text-anchor": "middle", class: "svg-text" }, "−20%"));
    svg.append(s("line", { x1: 20, y1: 200, x2: 354, y2: 200, stroke: "var(--ink)", "stroke-width": 2 }));
    [["0", 30], ["½", 110], ["1", 190], ["√2", 30 + 160 * 1.4142], ["2", 350]].forEach(([t, x]) => {
      svg.append(s("line", { x1: x, y1: 193, x2: x, y2: 207, stroke: "var(--ink)", "stroke-width": 2 }));
      svg.append(s("text", { x, y: 226, "text-anchor": "middle", class: "svg-text" }, t));
    });
    svg.append(s("circle", { cx: 30 + 160 * 1.4142, cy: 200, r: 6, fill: "var(--shape-b)" }));
    return svg;
  }

  function renderCover() {
    const done = mastered();
    const wrap = h("div", { class: "cover" });
    wrap.append(h("section", { class: "cover-hero" },
      h("div", {},
        h("p", { class: "eyebrow" }, "Grade 7 Mathematics · 1st Trimester · SY 2026–2027"),
        h("h1", {}, "Learn math by ", h("em", {}, "playing with it.")),
        h("p", {}, "Every lesson in this book has its own simulation. Drag, build, shop, race, and cook your way to each rule – then check yourself. Aligned with the DepEd MATATAG Grade 7 competencies for Term 1."),
        h("p", { class: "note" }, `${done.size} of ${lessons.length} lessons mastered on this device.`)),
      coverArt()));
    for (const u of UNITS) {
      const unit = h("section", { class: "unit" },
        h("div", { class: "unit-head" }, h("h2", {}, `Unit ${u.key} · ${u.title}`), h("span", { class: "tag" }, `${u.sub} · ${u.domain} · ${u.weeks}`)));
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
    const stage = h("section", { class: "stage", "aria-label": l.simName });
    const side = h("aside", { class: "panel" },
      h("h2", {}, "Your mission"),
      h("ol", {}, l.mission.map((m) => h("li", {}, m))),
      h("details", { class: "discover" }, h("summary", {}, "What did you discover?"), h("p", {}, l.discovery)),
      checkPanel(l));
    main.append(h("article", { class: "lesson" },
      h("header", { class: "lesson-head" },
        h("p", { class: "eyebrow" }, `Unit ${unit.key} · ${unit.title} · Lesson ${l.num}`),
        h("h1", {}, `${l.letter}. ${l.title}`),
        h("div", { class: "meta" },
          h("span", { class: "chip" }, `Sim: ${l.simName}`),
          h("span", { class: "chip" }, `Competencies ${l.comps.join(", ")}`),
          h("span", { class: "chip gold" }, `${l.cycles} · ${l.deped}`)),
        h("p", { class: "bigq" }, h("b", {}, "Big question: "), l.bigQuestion)),
      h("div", { class: "spread" }, stage, side),
      h("nav", { class: "footer-nav" },
        idx > 0 ? h("a", { href: "#" + lessons[idx - 1].id }, `← ${lessons[idx - 1].title}`) : h("span"),
        idx < lessons.length - 1 ? h("a", { href: "#" + lessons[idx + 1].id }, `${lessons[idx + 1].title} →`) : h("a", { href: "#home" }, "Back to contents"))));
    cleanup = l.mount(stage) || null;
  }

  function checkPanel(l) {
    const box = h("div", { class: "check-q" });
    const head = h("div", { class: "check-row" }, h("h2", {}, "Check yourself"));
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
