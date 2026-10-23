/* Unit 6 · Lesson 14 · N. Completing the Analytics Project – Project Pipeline */
(function () {
  "use strict";
  const { h, s, clear, randInt, pick, shuffle, fmt, round, clamp, tabs, segmented, stat, pill, Spring, rubber } = Sim;

  const STAGES = [
    { id: "ask", label: "1 · Ask" }, { id: "collect", label: "2 · Collect" }, { id: "process", label: "3 · Process" },
    { id: "analyze", label: "4 · Analyze" }, { id: "share", label: "5 · Share" },
  ];
  const ART = [
    { id: "question", label: "Research question", tag: "?", ok: ["ask"], home: "ask", why: "The question comes first – it decides what data to collect." },
    { id: "raw", label: "Raw data", tag: "CSV", ok: ["collect"], home: "collect", why: "Raw data is what you collected, saved unchanged." },
    { id: "dict", label: "Data dictionary", tag: "DD", ok: ["collect", "process"], home: "collect", why: "The data dictionary describes every column; start it when you collect and update it while you process." },
    { id: "log", label: "Processing log", tag: "LOG", ok: ["process"], home: "process", why: "The processing log records each cleaning step in order." },
    { id: "clean", label: "Cleaned data", tag: "✓", ok: ["process"], home: "process", why: "Cleaned data is the output of processing." },
    { id: "analysis", label: "Analysis sheet", tag: "Σ", ok: ["analyze"], home: "analyze", why: "Formulas, pivot tables, and statistics live in the analysis sheet." },
    { id: "limits", label: "Limitations", tag: "!", ok: ["analyze", "share"], home: "analyze", why: "Limitations come from the analysis and must be shared with the findings." },
    { id: "dash", label: "Dashboard link", tag: "URL", ok: ["share"], home: "share", why: "The dashboard shares the findings interactively." },
    { id: "story", label: "Data story", tag: "¶", ok: ["share"], home: "share", why: "The data story communicates the insight and the recommendation." },
  ];
  const REQUIRED = { ask: ["question"], collect: ["raw", "dict"], process: ["log", "clean"], analyze: ["analysis", "limits"], share: ["dash", "story"] };
  const PACKAGES = { "Our package": ART.map((a) => a.id), "Group 2's package": ["question", "raw", "clean", "analysis", "dash", "story"] };

  const CSS = `
  .l14-board { position: relative; touch-action: pan-y; transition: height .35s; user-select: none; -webkit-user-select: none; }
  .l14-lane { position: absolute; left: 0; top: 0; border: 2px solid var(--line); border-radius: 10px; background: var(--bg); transition: border-color .3s, background .3s; }
  .l14-lane.hot { border-color: var(--gold); background: var(--gold-soft); }
  .l14-lane .hd { font-weight: 800; font-size: .82rem; padding: 4px 8px; color: var(--accent); font-family: var(--display); }
  .l14-lane .miss { position: absolute; left: 6px; right: 6px; bottom: 4px; font-size: .72rem; color: var(--bad); font-weight: 700; line-height: 1.2; }
  .l14-lane.flag { border-color: var(--bad); animation: l14pulse 1s ease-in-out 2; }
  .l14-lane.done { border-color: var(--good); }
  @keyframes l14pulse { 50% { box-shadow: 0 0 0 6px color-mix(in srgb, var(--bad) 25%, transparent); } }
  .l14-card { position: absolute; left: 0; top: 0; height: 44px; display: flex; gap: 6px; align-items: center; background: var(--paper); border: 1px solid var(--line); border-radius: 8px; padding: 4px 8px; font-size: .82rem; line-height: 1.15; box-shadow: 0 2px 5px rgba(0,0,0,.08); cursor: grab; touch-action: none; user-select: none; }
  .l14-card b { font-family: var(--mono); font-size: .7rem; background: var(--shape-a-soft); color: var(--shape-a); border-radius: 5px; padding: 2px 4px; flex: none; }
  .l14-card.drag { cursor: grabbing; box-shadow: 0 12px 26px rgba(0,0,0,.22); z-index: 5; }
  .l14-card.ok { border-color: var(--good); }
  .l14-tray { position: absolute; left: 0; top: 0; border: 1px dashed var(--gold); border-radius: 10px; background: color-mix(in srgb, var(--gold-soft) 55%, transparent); }
  .l14-tray span { position: absolute; left: 8px; top: 3px; font-size: .72rem; font-weight: 700; letter-spacing: .06em; text-transform: uppercase; color: var(--gold); }
  .l14-check { display: grid; gap: 6px; }
  .l14-check label { display: grid; grid-template-columns: auto minmax(0, 1fr); gap: 8px; align-items: start; padding: 6px 8px; border: 1px solid var(--line); border-radius: 8px; background: var(--bg); cursor: pointer; }
  .l14-check label.on { border-color: var(--good); background: color-mix(in srgb, var(--good) 9%, var(--paper)); }
  .l14-check input { width: 18px; height: 18px; accent-color: var(--accent); margin-top: 2px; }
  .l14-check small { display: block; color: var(--muted); }
  .l14-rep { display: grid; grid-template-columns: minmax(180px, 240px) minmax(0, 1fr); gap: 16px; align-items: start; }
  @media (max-width: 640px) { .l14-rep { grid-template-columns: minmax(0, 1fr); } }
  .l14-steps { display: grid; gap: 4px; margin: 0; padding: 0; list-style: none; }
  .l14-steps li { padding: 5px 8px; border-radius: 6px; border: 1px solid var(--line); font-size: .88rem; transition: background .3s, border-color .3s; }
  .l14-steps li.pass { background: color-mix(in srgb, var(--good) 14%, var(--paper)); border-color: var(--good); }
  .l14-steps li.fail { background: color-mix(in srgb, var(--bad) 12%, var(--paper)); border-color: var(--bad); }
  `;

  // ------------------------------------------------------------ Workflow board

  function workflow(root) {
    const board = h("div", { class: "l14-board" });
    const tray = h("div", { class: "l14-tray" }, h("span", {}, "Project package"));
    const fb = h("div", { "aria-live": "polite" });
    board.append(tray);
    const lanes = STAGES.map((st) => { const miss = h("div", { class: "miss" }); const el = h("div", { class: "l14-lane" }, h("div", { class: "hd" }, st.label), miss); board.append(el); return { ...st, el, miss, cards: [], x: 0, y: 0, w: 0, h: 0 }; });
    let cards = [], L = null, pkg = "Our package";
    function load(name) {
      pkg = name;
      cards.forEach((c) => { c.sp.stop(); c.el.remove(); });
      lanes.forEach((l) => { l.cards = []; l.el.classList.remove("flag", "done"); l.miss.textContent = ""; });
      cards = shuffle(ART.filter((a) => PACKAGES[name].includes(a.id))).map((a) => {
        const el = h("div", { class: "l14-card", tabindex: 0, role: "button", "aria-label": a.label }, h("b", {}, a.tag), h("span", {}, a.label));
        board.append(el);
        const c = { ...a, el, lane: null, pos: [0, 0] };
        c.sp = new Spring([0, 0], (v) => { c.pos = v; el.style.transform = `translate(${v[0]}px, ${v[1]}px)`; }, { stiffness: 230, damping: 18 });
        bind(c);
        return c;
      });
      clear(fb);
      layout(true);
    }
    function layout(jump) {
      const W = board.clientWidth || 640, wide = W >= 620, G = 8;
      let cw, y0;
      if (wide) {
        const lw = (W - G * 4) / 5, lh = 34 + 3 * 50 + 30;
        lanes.forEach((l, i) => Object.assign(l, { x: i * (lw + G), y: 0, w: lw, h: lh }));
        cw = lw - 12; y0 = lh + 12;
      } else {
        cw = Math.floor((W - 12 - 2 * 6) / 3);
        lanes.forEach((l, i) => Object.assign(l, { x: 0, y: i * (96 + G), w: W, h: 96 }));
        y0 = 5 * (96 + G) + 4;
      }
      lanes.forEach((l) => { l.el.style.width = l.w + "px"; l.el.style.height = l.h + "px"; l.el.style.transform = `translate(${l.x}px, ${l.y}px)`; });
      cards.forEach((c) => { c.el.style.width = cw + "px"; });
      const loose = cards.filter((c) => !c.lane), per = Math.max(1, Math.floor((W - 12) / (cw + 8)));
      const th = 26 + Math.max(1, Math.ceil(Math.max(loose.length, 1) / per)) * 52;
      tray.style.width = W + "px"; tray.style.height = th + "px"; tray.style.transform = `translate(0px, ${y0}px)`;
      board.style.height = y0 + th + "px";
      L = { wide, cw };
      loose.forEach((c, k) => go(c, [6 + (k % per) * (cw + 8), y0 + 24 + Math.floor(k / per) * 52], jump));
      lanes.forEach((l) => l.cards.forEach((c, k) => go(c, wide ? [l.x + 6, l.y + 34 + k * 50] : [l.x + 6 + k * (cw + 6), l.y + 30], jump)));
    }
    function go(c, t, jump) { if (jump) c.sp.jump(t); else c.sp.set(t); }
    function laneAt(c) { const cx = c.pos[0] + L.cw / 2, cy = c.pos[1] + 22; return lanes.find((l) => cx >= l.x && cx <= l.x + l.w && cy >= l.y && cy <= l.y + l.h) || null; }
    function bind(c) {
      c.el.addEventListener("pointerdown", (ev) => {
        ev.preventDefault(); c.el.setPointerCapture(ev.pointerId);
        c.sp.stop(); c.el.classList.add("drag"); c.el.classList.remove("ok");
        const sx = ev.clientX, sy = ev.clientY, [ox, oy] = c.pos, W = board.clientWidth, H = board.clientHeight;
        const move = (e) => {
          const x = rubber(ox + e.clientX - sx, 0, W - L.cw, 0.3), y = rubber(oy + e.clientY - sy, 0, H - 44, 0.3);
          c.sp.value = [x, y]; c.sp.vel = [0, 0]; c.pos = [x, y];
          c.el.style.transform = `translate(${x}px, ${y}px) rotate(${clamp((e.clientX - sx) * 0.03, -4, 4)}deg)`;
          const t = laneAt(c); lanes.forEach((l) => l.el.classList.toggle("hot", l === t));
        };
        const up = () => {
          c.el.removeEventListener("pointermove", move); c.el.removeEventListener("pointerup", up); c.el.removeEventListener("pointercancel", up);
          c.el.classList.remove("drag"); lanes.forEach((l) => l.el.classList.remove("hot"));
          put(c, laneAt(c));
        };
        c.el.addEventListener("pointermove", move); c.el.addEventListener("pointerup", up); c.el.addEventListener("pointercancel", up);
      });
      c.el.addEventListener("keydown", (e) => {
        if (e.key !== "Enter" && e.key !== " ") return;
        e.preventDefault();
        const i = c.lane ? lanes.indexOf(c.lane) + 1 : 0;
        put(c, i < lanes.length ? lanes[i] : null);
      });
    }
    function put(c, lane) {
      if (c.lane) c.lane.cards = c.lane.cards.filter((x) => x !== c);
      c.lane = null;
      if (lane && lane.cards.length < 3) { lane.cards.push(c); c.lane = lane; }
      lanes.forEach((l) => l.el.classList.remove("flag", "done"));
      layout(false);
    }
    function check() {
      clear(fb);
      const msgs = [];
      cards.forEach((c) => {
        if (!c.lane) return;
        if (c.ok.includes(c.lane.id)) c.el.classList.add("ok");
        else { msgs.push(`${c.label} is not part of “${c.lane.label.slice(4)}”. ${c.why}`); if (!Sim.reducedMotion() && c.el.animate) c.el.animate([{ translate: "0 0" }, { translate: "-7px 0" }, { translate: "7px 0" }, { translate: "0 0" }], { duration: 280 }); c.lane.cards = c.lane.cards.filter((x) => x !== c); c.lane = null; }
      });
      let complete = 0;
      lanes.forEach((l) => {
        // a flexible item (data dictionary, limitations) counts wherever it is correctly placed
        const need = REQUIRED[l.id].filter((id) => { const card = cards.find((c) => c.id === id); return !(card && card.lane && card.ok.includes(card.lane.id)); });
        const missingFromPkg = need.filter((id) => !PACKAGES[pkg].includes(id));
        const unplaced = need.filter((id) => PACKAGES[pkg].includes(id));
        l.miss.textContent = missingFromPkg.length ? "Missing: " + missingFromPkg.map((id) => ART.find((a) => a.id === id).label).join(", ") : unplaced.length ? "Not placed yet: " + unplaced.map((id) => ART.find((a) => a.id === id).label).join(", ") : "";
        l.el.classList.toggle("flag", missingFromPkg.length > 0);
        l.el.classList.toggle("done", !need.length);
        if (!need.length) complete++;
      });
      setTimeout(() => layout(false), 300);
      msgs.forEach((m) => fb.append(h("p", { class: "feedback bad" }, m)));
      const missing = ART.filter((a) => !PACKAGES[pkg].includes(a.id));
      if (missing.length) fb.append(h("p", { class: "feedback bad" }, `This package is missing ${missing.map((a) => a.label.toLowerCase()).join(", ")}. A reviewer could not check how the data was cleaned or what its limits are – ask the group for them before verification.`));
      else if (complete === 5 && !msgs.length) fb.append(h("p", { class: "feedback ok" }, "Complete package: every stage of the workflow has its artifacts. A reviewing group can now follow your work from question to story."));
      else if (!msgs.length) fb.append(h("p", { class: "feedback" }, `${complete} of 5 stages complete. Place the remaining cards.`));
    }
    const lanesNote = h("p", { class: "note" }, "Each stage holds up to 3 cards. Data dictionary and Limitations may go in either of two stages. Keyboard: focus a card and press Enter to move it to the next stage.");
    root.append(h("p", {}, "Before a project goes to the reviewing group, every artifact must sit in the right stage of the workflow. Drag the cards onto the stages, then check the package."),
      h("div", { class: "controls" }, segmented(Object.keys(PACKAGES), pkg, load)),
      board, h("div", { class: "controls" }, h("button", { class: "btn", type: "button", onclick: check }, "Check package"), h("button", { class: "btn ghost", type: "button", onclick: () => load(pkg) }, "Reset")), fb, lanesNote);
    load(pkg);
    requestAnimationFrame(() => layout(true));
    const ro = window.ResizeObserver ? new ResizeObserver(() => layout(true)) : null;
    if (ro) ro.observe(board);
    return () => { if (ro) ro.disconnect(); cards.forEach((c) => c.sp.stop()); };
  }

  // ------------------------------------------------------------ Reproducibility Check

  const CHECKS = [
    { id: "raw", short: "the unchanged raw data", t: "The raw data is saved unchanged, separate from the cleaned copy.", d: "So anyone can start again from the original." },
    { id: "src", short: "sources and permissions", t: "Every data source is cited, with permissions or consent noted.", d: "Who collected it, when, where, and with whose permission." },
    { id: "dict", short: "a data dictionary", t: "A data dictionary names and describes every column, with units and allowed values.", d: "Column · meaning · type · unit · allowed values · example." },
    { id: "log", short: "a processing log", t: "A processing (change) log lists every cleaning step in order.", d: "Date · step · reason · rows affected · tool (Sheets formula or pandas line)." },
    { id: "priv", short: "privacy protection", t: "Names and personal details are removed or replaced with codes.", d: "Data privacy comes before sharing with the reviewers." },
    { id: "meth", short: "written methods", t: "Methods are written down: formulas, pivot settings, tests, and code.", d: "Enough detail to repeat each result exactly." },
    { id: "match", short: "matching numbers", t: "Every number in the data story matches the analysis sheet.", d: "Cross-check each figure before you hand over." },
    { id: "lim", short: "stated limitations", t: "Limitations are stated: sample, time period, missing data, possible bias.", d: "What the results cannot tell us." },
    { id: "files", short: "clear file versions", t: "Files have clear names and versions; the final files are marked.", d: "e.g. canteen_clean_v3_FINAL.csv" },
    { id: "links", short: "working links", t: "Sheets, notebook, and dashboard are shared as working Viewer links.", d: "Test the links in a private window." },
  ];
  const STRANGER = [
    { t: "Find the original data and its source", need: ["raw", "src", "links"] },
    { t: "Understand what every column means", need: ["dict"] },
    { t: "Repeat the cleaning step by step", need: ["log", "files"] },
    { t: "Recompute the results", need: ["meth"] },
    { t: "Check that the claims match the evidence", need: ["match", "lim"] },
    { t: "Share the review without exposing anyone", need: ["priv"] },
  ];

  function repro(root) {
    const on = new Set();
    let k = 0, timers = [];
    const R = 70, C = 2 * Math.PI * R;
    const ring = s("circle", { cx: 90, cy: 90, r: R, fill: "none", stroke: "var(--accent)", "stroke-width": 16, "stroke-linecap": "round", transform: "rotate(-90 90 90)", "stroke-dasharray": C, "stroke-dashoffset": C });
    const big = s("text", { x: 90, y: 92, "text-anchor": "middle", class: "svg-text", "font-size": 30, "font-weight": 700 }, "0/10");
    const small = s("text", { x: 90, y: 116, "text-anchor": "middle", class: "svg-label", "font-size": 13 }, "rebuildable");
    const svg = s("svg", { viewBox: "0 0 180 180", role: "img", "aria-label": "Reproducibility meter", style: "max-width:220px;margin:0 auto" },
      s("circle", { cx: 90, cy: 90, r: R, fill: "none", stroke: "var(--line)", "stroke-width": 16 }), ring, big, small);
    const verdict = h("p", { class: "feedback", "aria-live": "polite" });
    const sp = new Spring(0, (v) => {
      k = v; ring.setAttribute("stroke-dashoffset", String(C * (1 - clamp(v, 0, 1.04))));
      const frac = clamp(v, 0, 1);
      ring.setAttribute("stroke", frac < 0.5 ? "var(--bad)" : frac < 0.9 ? "var(--gold)" : "var(--good)");
      ring.setAttribute("stroke-width", String(16 + 4 * Math.max(0, v - frac) * 40));
    }, { stiffness: 140, damping: 10 });
    const list = h("div", { class: "l14-check" });
    const steps = h("ol", { class: "l14-steps" });
    function update() {
      sp.set(on.size / CHECKS.length);
      big.textContent = `${on.size}/10`;
      const pct = Math.round((on.size / CHECKS.length) * 100);
      verdict.className = "feedback " + (pct === 100 ? "ok" : pct >= 50 ? "" : "bad");
      verdict.textContent = pct === 100 ? "A stranger could rebuild every result from your package. Ready for review!" : pct >= 50 ? `${pct}% ready. A stranger would still get stuck – run the stranger test to see where.` : `${pct}% ready. A stranger could not rebuild your results yet.`;
      clear(steps); STRANGER.forEach((st) => steps.append(h("li", {}, st.t)));
    }
    CHECKS.forEach((c) => {
      const box = h("input", { type: "checkbox", "aria-label": c.t });
      const lab = h("label", {}, box, h("span", {}, c.t, h("small", {}, c.d)));
      box.addEventListener("change", () => { if (box.checked) on.add(c.id); else on.delete(c.id); lab.classList.toggle("on", box.checked); update(); });
      list.append(lab);
    });
    function stranger() {
      timers.forEach(clearTimeout); timers = [];
      const lis = [...steps.children];
      lis.forEach((li) => li.classList.remove("pass", "fail"));
      let stuck = false;
      STRANGER.forEach((st, i) => {
        timers.push(setTimeout(() => {
          const miss = st.need.filter((id) => !on.has(id));
          const li = lis[i]; if (!li) return;
          if (stuck) { li.classList.add("fail"); li.textContent = `${st.t} – not reached`; return; }
          if (miss.length) { stuck = true; li.classList.add("fail"); li.textContent = `${st.t} – STUCK: needs ${miss.map((id) => CHECKS.find((c) => c.id === id).short).join(" and ")}`; }
          else { li.classList.add("pass"); li.textContent = `${st.t} ✓`; }
        }, Sim.reducedMotion() ? 0 : 380 * i));
      });
    }
    root.append(h("p", {}, "“Ready for Review?” – Could a stranger rebuild your results using only your project package? Tick what your package already has."),
      h("div", { class: "l14-rep" }, h("div", {}, svg, verdict, h("div", { class: "controls" }, h("button", { class: "btn", type: "button", onclick: stranger }, "Run the stranger test")), steps), list));
    update();
    return () => { sp.stop(); timers.forEach(clearTimeout); };
  }

  Sim.register({
    id: "lesson14", unit: "6", num: 14, title: "Completing the Analytics Project", simName: "Project Pipeline",
    comps: ["A2.15", "T5"], sessions: "S69–S72", deped: "Sessions S69–S72", cg: "CG Part 2 · Content 6 (Data Analytics Project)",
    bigQuestion: "Would our findings survive an independent check?",
    mission: [
      "Workflow: drag all nine artifacts onto the five stages and check the package. Then load Group 2's package – what is missing, and why does it matter to a reviewer?",
      "Reproducibility Check: tick what a typical package has, then run the stranger test. Which missing item stops the stranger first?",
    ],
    discovery: "A finished project follows the whole workflow – ask, collect, process, analyze, share – and keeps an artifact for each stage. Documentation (data dictionary, processing log, methods, limitations, sources and permissions) is what lets someone else rebuild your results. Without it, even correct findings cannot survive an independent check.",
    mount(stage) {
      const body = h("div", { class: "stage-body" });
      const views = [workflow, repro];
      let stopper = null;
      const t = tabs(["Workflow", "Reproducibility Check"], (i) => { if (stopper) stopper(); clear(body); stopper = views[i](body) || null; });
      stage.append(h("style", {}, CSS), t.el, body);
      stopper = workflow(body);
      return () => { if (stopper) stopper(); };
    },
    check() {
      const kind = randInt(0, 4);
      if (kind === 0) { const a = pick(ART.filter((x) => x.ok.length === 1)); return { q: `In which stage of the workflow does the “${a.label}” belong?`, choices: ["Ask", "Collect", "Process", "Analyze", "Share"], answer: STAGES.find((st) => st.id === a.ok[0]).label.slice(4), explain: a.why }; }
      if (kind === 1) { const n = randInt(3, 9); return { q: `A group's package passes ${n} of the 10 reproducibility checks. What percent ready is it?`, answer: n * 10, tol: 0, unit: "%", explain: `${n} ÷ 10 × 100% = ${n * 10}%.` }; }
      if (kind === 2) { const raw = randInt(180, 260), dup = randInt(3, 12), miss = randInt(2, 9); return { q: `Processing log (sample): raw data had ${raw} rows; step 1 removed ${dup} duplicate rows; step 2 removed ${miss} rows with a blank answer. How many rows should the cleaned data have?`, answer: raw - dup - miss, tol: 0, explain: `${raw} − ${dup} − ${miss} = ${raw - dup - miss}. The log lets a reviewer check this.` }; }
      if (kind === 3) return pick([
        { q: "Which belongs in a data dictionary?", choices: ["Column name, meaning, type, unit, and allowed values", "The final recommendation", "Every learner's full name", "The dashboard colors"], answer: "Column name, meaning, type, unit, and allowed values", explain: "A data dictionary describes each column so others can read the data correctly." },
        { q: "Which is a good processing-log entry?", choices: ["Step 3: removed 7 duplicate rows with Data › Data cleanup › Remove duplicates (232 → 225 rows)", "Cleaned the data", "Fixed stuff in the sheet", "Made it better"], answer: "Step 3: removed 7 duplicate rows with Data › Data cleanup › Remove duplicates (232 → 225 rows)", explain: "A good entry says what, how, and how many rows changed." },
        { q: "Which is a limitation statement?", choices: ["Our survey covered only Grade 11 learners for one week, so results may not apply to other grades.", "Our dashboard has three charts.", "We used Google Sheets.", "The data was interesting."], answer: "Our survey covered only Grade 11 learners for one week, so results may not apply to other grades.", explain: "A limitation says what the data cannot tell us." },
      ]);
      return pick([
        { q: "Why must the raw data be kept unchanged?", choices: ["So anyone can repeat the cleaning from the original", "Because raw data is always correct", "To make the file larger", "So the dashboard loads faster"], answer: "So anyone can repeat the cleaning from the original", explain: "Reproducibility starts from the original data." },
        { q: "What is the test of a reproducible project?", choices: ["A stranger can rebuild the results using only the project package", "The dashboard looks professional", "The group agrees with its own results", "The teacher likes the topic"], answer: "A stranger can rebuild the results using only the project package", explain: "If someone else can rebuild it, the findings can survive an independent check." },
      ]);
    },
  });
})();
