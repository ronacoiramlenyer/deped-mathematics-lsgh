/* Math 7 SimBook – lesson discussion as a slide deck with speaker notes. */
(function () {
  "use strict";
  const { h, clear } = Sim;
  const rich = (t) => Sim.rich(t);

  // ------------------------------------------------------------ slide model

  /**
   * Turns lesson blocks into slides. On the slide: headings, definitions, rules,
   * tables, lists, and worked examples (one step per click). In the notes: the
   * explanations, full solutions, and teaching prompts.
   */
  function buildSlides(lesson, blocks) {
    const slides = [];
    slides.push({
      kind: "title", title: `${lesson.letter}. ${lesson.title}`, kicker: `Lesson ${lesson.num} · ${lesson.deped}`,
      body: [{ el: () => h("p", { class: "s-bigq" }, h("span", {}, "Big question"), lesson.bigQuestion) },
        { el: () => h("p", { class: "s-meta" }, `Competencies ${lesson.comps.join(", ")}`) }],
      notes: [
        { label: "Open the lesson", items: [`Ask the Big Question and take two or three answers.`, `Recall the hook (${lesson.simName}): “${lesson.discovery}”`, "Tell the class that today you will name and prove what they noticed in the sim."] },
      ],
    });
    let cur = null, lastHeading = lesson.title, exNo = 0;
    const open = (title) => { cur = { kind: "content", title, body: [], notes: [], paras: [] }; slides.push(cur); return cur; };
    const ensure = () => cur || open(`${lastHeading} (continued)`);

    for (const b of blocks || []) {
      if (b.t === "h") { lastHeading = b.text; open(b.text); continue; }
      if (b.t === "p") { ensure().paras.push(b.text); continue; }
      if (b.t === "defs") {
        ensure().body.push({ el: () => h("dl", { class: "s-defs" }, b.items.flatMap(([t, d]) => [h("dt", {}, t), h("dd", {}, rich(d))])) });
        cur.notes.push({ label: "Definitions", items: b.items.map(([t, d]) => `**${t}** – ${d}`) });
        continue;
      }
      if (b.t === "rule") {
        ensure().body.push({ el: () => h("div", { class: "s-rule" }, b.title ? h("p", { class: "s-rule-title" }, b.title) : null, ...[].concat(b.text).map((x) => h("p", {}, rich(x)))) });
        cur.notes.push({ label: "Board work", items: ["Have the class copy this box into their notebooks.", ...[].concat(b.text)] });
        continue;
      }
      if (b.t === "table") {
        ensure().body.push({ el: () => h("table", { class: "s-table" }, h("thead", {}, h("tr", {}, b.head.map((c) => h("th", {}, c)))), h("tbody", {}, b.rows.map((r) => h("tr", {}, r.map((c) => h("td", {}, rich(c)))))) ) });
        cur.notes.push({ label: "Ask", items: ["What pattern do you see in the table?"] });
        continue;
      }
      if (b.t === "list" || b.t === "steps") {
        const s = ensure();
        if (b.title) s.body.push({ el: () => h("p", { class: "s-sub" }, rich(b.title)) });
        b.items.forEach((x, i) => s.body.push({ build: true, el: () => h("p", { class: b.t === "steps" ? "s-step" : "s-bullet" }, b.t === "steps" ? h("span", { class: "s-num" }, `${i + 1}`) : h("span", { class: "s-dot" }), h("span", {}, rich(x))) }));
        s.notes.push({ label: b.t === "steps" ? "Procedure" : "Points", items: b.items });
        continue;
      }
      if (b.t === "ex") {
        exNo++;
        cur = null;
        const s = { kind: "example", title: `Example ${exNo}`, sub: b.title, body: [], notes: [], paras: [] };
        s.body.push({ el: () => h("p", { class: "s-problem" }, rich(b.problem)) });
        b.steps.forEach((x, i) => s.body.push({ build: true, el: () => h("p", { class: "s-step" }, h("span", { class: "s-num" }, `${i + 1}`), h("span", {}, rich(x))) }));
        if (b.answer) s.body.push({ build: true, el: () => h("p", { class: "s-answer" }, h("strong", {}, "Answer: "), rich(b.answer)) });
        s.notes.push({ label: "Before revealing", items: ["Give the class a minute to try it in their notebooks.", "Call on a volunteer to explain the first step."] },
          { label: "Full solution", items: [...b.steps, b.answer ? `**Answer:** ${b.answer}` : null].filter(Boolean) });
        slides.push(s);
        continue;
      }
      if (b.t === "remember") {
        cur = null;
        slides.push({ kind: "summary", title: "Remember", body: b.items.map((x) => ({ build: true, el: () => h("p", { class: "s-bullet" }, h("span", { class: "s-dot" }), h("span", {}, rich(x))) })),
          notes: [{ label: "Wrap up", items: ["Ask three learners to each restate one point in their own words.", "Connect back to the Big Question."] }], paras: [] });
      }
    }
    slides.push({ kind: "end", title: "Your turn", body: [
      { el: () => h("p", { class: "s-bullet" }, h("span", { class: "s-dot" }), h("span", {}, "Check Yourself – 5 quick questions")) },
      { el: () => h("p", { class: "s-bullet" }, h("span", { class: "s-dot" }), h("span", {}, `Exercises ${lesson.num} – Part A now; Parts B and C at home`)) }],
      notes: [{ label: "Assign", items: [`Seatwork: Exercises ${lesson.num}, Part A (items 1–8).`, "Homework: Parts B and C. Learners check their answers and open the solutions in the SimBook."] }], paras: [] });

    // Explanations go to the notes; a slide with nothing else shows them instead.
    for (const s of slides) {
      if (!s.paras || !s.paras.length) continue;
      if (!s.body.length) {
        s.body = s.paras.map((p) => ({ el: () => h("p", { class: "s-text" }, rich(p)) }));
        s.notes.unshift({ label: "Explain", items: ["Read the slide with the class, then give your own example."] });
      } else s.notes.unshift({ label: "Explain", items: s.paras });
    }
    return slides;
  }

  // ------------------------------------------------------------ viewer

  function renderDeck(lesson, blocks) {
    const slides = buildSlides(lesson, blocks);
    let idx = 0, shown = 0;
    const slideEl = h("div", { class: "slide", "aria-live": "polite" });
    const frame = h("div", { class: "slide-frame", tabindex: 0, "aria-label": "Lesson slides. Use the arrow keys to move." }, slideEl);
    const counter = h("span", { class: "deck-count num" });
    const prevB = h("button", { class: "btn ghost", type: "button", onclick: () => back() }, "◀ Prev");
    const nextB = h("button", { class: "btn", type: "button", onclick: () => forward() }, "Next ▶");
    const strip = h("div", { class: "deck-strip", hidden: true });
    const notesBody = h("div", { class: "notes-body" });
    const notes = h("aside", { class: "notes", "aria-label": "Speaker notes" }, h("p", { class: "notes-label" }, "Notes"), notesBody);
    const deck = h("div", { class: "deck" });
    const main = h("div", { class: "deck-main" }, frame,
      h("div", { class: "deck-bar" }, prevB, counter, nextB,
        h("button", { class: "btn ghost", type: "button", onclick: () => { strip.hidden = !strip.hidden; } }, "All slides"),
        h("button", { class: "btn ghost", type: "button", onclick: () => present() }, "Present")),
      strip);
    deck.append(main, notes);

    const builds = () => slides[idx].body.filter((b) => b.build).length;

    function render(dir) {
      const s = slides[idx];
      clear(slideEl);
      slideEl.className = `slide slide-${s.kind}`;
      slideEl.append(h("div", { class: "s-band" }, h("span", {}, `Lesson ${lesson.num} · ${lesson.title}`), h("span", {}, `${idx + 1} / ${slides.length}`)));
      const inner = h("div", { class: "s-inner" });
      if (s.kicker) inner.append(h("p", { class: "s-kicker" }, s.kicker));
      inner.append(h("h3", { class: "s-title" }, s.title, s.sub ? h("span", { class: "s-titlesub" }, ` · ${s.sub}`) : null));
      let b = 0;
      s.body.forEach((item) => {
        const node = item.el();
        if (item.build) { b++; node.classList.add("build"); if (b > shown) node.classList.add("hidden-build"); else if (b === shown && dir === "build") node.classList.add("just-built"); }
        inner.append(node);
      });
      slideEl.append(inner);
      if (dir === "next" || dir === "prev") animateIn(dir);
      fit(inner);
      counter.textContent = `Slide ${idx + 1} of ${slides.length}`;
      prevB.disabled = idx === 0 && shown === 0;
      nextB.disabled = idx === slides.length - 1 && shown >= builds();
      nextB.textContent = shown < builds() ? "Reveal ▶" : "Next ▶";
      clear(notesBody);
      s.notes.forEach((n) => notesBody.append(h("p", { class: "notes-head" }, n.label), h("ul", {}, n.items.map((x) => h("li", {}, rich(x))))));
      [...strip.children].forEach((c, i) => c.setAttribute("aria-current", i === idx ? "true" : "false"));
    }

    function animateIn(dir) {
      if (Sim.reducedMotion() || !slideEl.animate) return;
      slideEl.animate([{ opacity: 0, transform: `translateX(${dir === "next" ? 40 : -40}px)` }, { opacity: 1, transform: "none" }], { duration: 320, easing: "cubic-bezier(.2,.8,.2,1)" });
    }

    /** Shrinks the slide text until everything fits inside the 16:9 frame. */
    function fit(inner) {
      let scale = 1;
      slideEl.style.setProperty("--fit", "1");
      for (let k = 0; k < 12 && inner.scrollHeight > inner.clientHeight + 1 && scale > 0.55; k++) {
        scale -= 0.05; slideEl.style.setProperty("--fit", String(scale));
      }
    }

    function forward() {
      if (shown < builds()) { shown++; render("build"); return; }
      if (idx < slides.length - 1) { idx++; shown = 0; render("next"); }
    }
    function back() {
      if (shown > 0) { shown--; render("build"); return; }
      if (idx > 0) { idx--; shown = builds(); render("prev"); }
    }
    function go(i) { idx = i; shown = 0; render("next"); frame.focus(); }

    slides.forEach((s, i) => strip.append(h("button", { type: "button", class: "thumb", onclick: () => go(i) }, h("span", { class: "num" }, String(i + 1)), " ", s.title)));

    frame.addEventListener("keydown", (e) => {
      if (["ArrowRight", "PageDown", " ", "Enter"].includes(e.key)) { e.preventDefault(); forward(); }
      else if (["ArrowLeft", "PageUp", "Backspace"].includes(e.key)) { e.preventDefault(); back(); }
      else if (e.key === "Home") { e.preventDefault(); go(0); }
      else if (e.key === "End") { e.preventDefault(); go(slides.length - 1); }
      else if (e.key === "Escape") exitPresent();
    });
    frame.addEventListener("click", (e) => { if (!e.target.closest("button, a")) { forward(); frame.focus(); } });

    // Present: real full screen where allowed, otherwise a full-window overlay.
    function present() {
      deck.classList.add("presenting");
      const req = main.requestFullscreen ? main.requestFullscreen() : null;
      if (req && req.catch) req.catch(() => {});
      frame.focus();
      setTimeout(() => render(), 60);
    }
    function exitPresent() {
      deck.classList.remove("presenting");
      if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
      setTimeout(() => render(), 60);
    }
    document.addEventListener("fullscreenchange", () => { if (!document.fullscreenElement && deck.classList.contains("presenting")) exitPresent(); });
    main.append(h("button", { class: "btn ghost exit-present", type: "button", onclick: exitPresent }, "Exit (Esc)"));
    if (window.ResizeObserver) new ResizeObserver(() => { const inner = slideEl.querySelector(".s-inner"); if (inner) fit(inner); }).observe(frame);

    render();
    return deck;
  }

  Object.assign(Sim, { renderDeck, buildSlides });
})();
