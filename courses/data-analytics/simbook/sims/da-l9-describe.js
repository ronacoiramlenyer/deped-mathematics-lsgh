/* Unit 4 · Lesson 9 · I. Descriptive Statistics – Spread Lab */
(function () {
  "use strict";
  const { h, s, clear, randInt, pick, shuffle, fmt, peso, tabs, segmented, stat, pill, Spring, clamp, rubber, elasticSlider, draggable } = Sim;

  if (!document.getElementById("da-l9-style")) {
    document.head.append(h("style", { id: "da-l9-style" }, `
.sl-dot { cursor: grab; }
.sl-dot:active { cursor: grabbing; }
.sl-cells { display: grid; grid-template-columns: repeat(6, minmax(0, 1fr)); gap: 6px; }
@media (max-width: 520px) { .sl-cells { grid-template-columns: repeat(4, minmax(0, 1fr)); } }
.sl-cells label { display: grid; gap: 2px; font-size: .74rem; color: var(--muted); font-family: var(--mono); }
.sl-cells input { width: 100%; padding: 5px 6px; border: 1px solid var(--line); border-radius: 6px; background: var(--bg); font-family: var(--mono); font-size: .9rem; }
.sl-ftab td:nth-child(2) { font-family: var(--mono); font-size: .85rem; }
.sl-ftab td:nth-child(3) { font-family: var(--mono); text-align: right; white-space: nowrap; }
`));
  }

  // ------------------------------------------------------------ statistics (Google Sheets definitions)

  const mean = (a) => a.reduce((x, y) => x + y, 0) / a.length;
  const sorted = (a) => a.slice().sort((x, y) => x - y);
  function median(a) { const b = sorted(a), n = b.length; return n % 2 ? b[(n - 1) / 2] : (b[n / 2 - 1] + b[n / 2]) / 2; }
  /** MODE: the most frequent value (first to occur on ties); null when no value repeats (#N/A). */
  function mode(a) {
    const c = new Map(); a.forEach((x) => c.set(x, (c.get(x) || 0) + 1));
    let best = null, bf = 1; a.forEach((x) => { if (c.get(x) > bf) { bf = c.get(x); best = x; } });
    return best;
  }
  const variance = (a, sample = true) => { const m = mean(a); return a.reduce((t, x) => t + (x - m) ** 2, 0) / (a.length - (sample ? 1 : 0)); };
  const sd = (a, sample = true) => Math.sqrt(variance(a, sample));
  /** PERCENTILE / PERCENTILE.INC and QUARTILE: linear interpolation at rank p(n − 1). */
  function percentile(a, p) { const b = sorted(a), r = p * (b.length - 1), lo = Math.floor(r), hi = Math.ceil(r); return b[lo] + (b[hi] - b[lo]) * (r - lo); }

  // Weekly allowance of 12 Grade 11 learners, in pesos (sample data)
  const START = [300, 350, 400, 400, 450, 500, 500, 500, 550, 600, 650, 700];

  // ------------------------------------------------------------ tab 1 · drag the data

  function dragData(root, shared) {
    const W = 600, X0 = 40, X1 = 580, BASE = 210, VMAX = 2000;
    const X = (v) => X0 + (v / VMAX) * (X1 - X0), V = (x) => ((x - X0) / (X1 - X0)) * VMAX;
    const svg = s("svg", { viewBox: `0 0 ${W} 300`, role: "img", "aria-label": "Dot plot of weekly allowances with mean, median and mode lines. Drag a dot to change a value." });
    const axis = s("g"), lines = s("g"), dotsG = s("g"), bars = s("g");
    svg.append(axis, bars, lines, dotsG);
    for (let v = 0; v <= VMAX; v += 250) {
      axis.append(s("line", { x1: X(v), y1: BASE + 12, x2: X(v), y2: BASE + 18, stroke: "var(--ink)" }), s("text", { x: X(v), y: BASE + 32, "text-anchor": "middle", class: "svg-text", "font-size": 12 }, "₱" + v));
      axis.append(s("line", { x1: X(v), y1: 40, x2: X(v), y2: BASE + 12, stroke: "var(--grid)" }));
    }
    axis.append(s("line", { x1: X0, y1: BASE + 12, x2: X1, y2: BASE + 12, stroke: "var(--ink)", "stroke-width": 1.5 }));
    const out = h("div", { class: "readout" }), note = h("p", { class: "note", "aria-live": "polite" });
    let sample = true, dragging = -1;
    const vals = shared.vals; // persistent values (pesos)
    // each dot: spring on [value, level]
    const dots = vals.map((v, i) => {
      const c = s("circle", { r: 9, class: "sl-dot", fill: "var(--shape-a-soft)", stroke: "var(--shape-a)", "stroke-width": 2.5, tabindex: 0, "aria-label": `Value ${i + 1}` });
      const d = { c, sp: null };
      d.sp = new Spring([v, 0], ([x, lv]) => { c.setAttribute("cx", X(x)); c.setAttribute("cy", BASE - lv * 19); }, { stiffness: 200, damping: 16 });
      dotsG.append(c);
      draggable(svg, c, (p) => {
        dragging = i; d.sp.stop();
        const v2 = rubber(V(p.x), 0, VMAX, 0.3);
        vals[i] = clamp(v2, 0, VMAX); d.sp.value[0] = v2; d.sp.vel[0] = 0;
        c.setAttribute("cx", X(v2)); c.setAttribute("fill", "var(--gold-soft)");
        layout(); stats();
      }, () => {
        dragging = -1; c.setAttribute("fill", "var(--shape-a-soft)");
        vals[i] = clamp(Math.round(vals[i] / 50) * 50, 0, VMAX);
        layout(); stats();
      });
      c.addEventListener("keydown", (e) => { const k = e.key === "ArrowRight" ? 50 : e.key === "ArrowLeft" ? -50 : 0; if (k) { e.preventDefault(); vals[i] = clamp(vals[i] + k, 0, VMAX); layout(); stats(); } });
      return d;
    });
    function layout() {
      const levels = new Map();
      vals.forEach((v, i) => {
        const key = Math.round(v / 50) * 50, lv = levels.get(key) || 0;
        levels.set(key, lv + 1);
        const d = dots[i];
        if (i === dragging) { d.sp.target = [vals[i], lv]; d.sp.value[1] += (lv - d.sp.value[1]) * 0.35; d.c.setAttribute("cy", BASE - d.sp.value[1] * 19); }
        else d.sp.set([v, lv]);
      });
    }
    // lines: [mean, median, mode, sdLo, sdHi, min, max]
    let L = null;
    const lineSp = new Spring(target(), (v) => { L = v; drawLines(); }, { stiffness: 140, damping: 15 });
    function target() { const m = mean(vals), sdv = sd(vals, sample), mo = mode(vals.map((v) => Math.round(v))); return [m, median(vals), mo === null ? -1 : mo, m - sdv, m + sdv, Math.min(...vals), Math.max(...vals)]; }
    function drawLines() {
      clear(lines); clear(bars);
      const [m, md, mo, lo, hi, mn, mx] = L;
      const vline = (v, color, label, y, dash) => {
        lines.append(s("line", { x1: X(v), y1: 46, x2: X(v), y2: BASE + 12, stroke: color, "stroke-width": 3, "stroke-dasharray": dash || null }));
        lines.append(s("text", { x: clamp(X(v), X0 + 30, X1 - 30), y, "text-anchor": "middle", class: "svg-text", "font-size": 12, "font-weight": 700, fill: color }, label));
      };
      // SD bar (top) and range bar (bottom)
      bars.append(s("rect", { x: X(Math.max(0, lo)), y: 52, width: Math.max(0, X(hi) - X(Math.max(0, lo))), height: 8, rx: 4, fill: "var(--shape-b-soft)", stroke: "var(--shape-b)" }));
      bars.append(s("text", { x: clamp(X(hi) + 6, X0, X1 - 100), y: 60, class: "svg-label", "font-size": 12 }, `mean ± 1 SD`));
      bars.append(s("rect", { x: X(mn), y: BASE + 40, width: Math.max(0, X(mx) - X(mn)), height: 8, rx: 4, fill: "var(--gold-soft)", stroke: "var(--gold)" }));
      bars.append(s("text", { x: clamp((X(mn) + X(mx)) / 2, X0 + 60, X1 - 60), y: BASE + 66, "text-anchor": "middle", class: "svg-label", "font-size": 12 }, `range = ${peso(mx - mn).replace(".00", "")}`));
      vline(m, "var(--shape-b)", `mean ${fmt(m, 0)}`, 22);
      vline(md, "var(--shape-a)", `median ${fmt(md, 0)}`, 38);
      if (mo >= 0) vline(mo, "var(--gold)", `mode ${fmt(mo, 0)}`, BASE + 86 > 290 ? 290 : BASE + 86, "5 4");
    }
    function stats() {
      lineSp.set(target());
      const m = mean(vals), md = median(vals), mo = mode(vals.map((v) => Math.round(v)));
      clear(out);
      out.append(stat("Mean:", peso(m)).el, stat("Median:", peso(md)).el, stat("Mode:", mo === null ? "#N/A" : peso(mo)).el,
        stat("Range:", peso(Math.max(...vals) - Math.min(...vals))).el, stat(sample ? "Variance (VAR.S):" : "Variance (VAR.P):", fmt(variance(vals, sample), 1)).el, stat(sample ? "SD (STDEV.S):" : "SD (STDEV.P):", peso(sd(vals, sample))).el);
      const gap = m - md;
      note.textContent = Math.abs(gap) > 60
        ? `The mean is ${peso(Math.abs(gap))} ${gap > 0 ? "above" : "below"} the median. One extreme value pulls the mean toward it, but the median hardly moves – for skewed data the median is the fairer “typical” allowance.`
        : "Mean and median are close: the data are fairly balanced. Drag one dot far to the right and watch which line moves more.";
    }
    root.append(h("p", {}, "Weekly allowance of 12 Grade 11 learners (sample data). Drag any dot left or right. Values snap to the nearest ₱50 when you let go."),
      h("div", { class: "controls" },
        h("button", { class: "btn", type: "button", onclick: () => { vals[vals.indexOf(Math.max(...vals))] = 1800; layout(); stats(); } }, "Add an outlier (₱1,800)"),
        h("button", { class: "btn ghost", type: "button", onclick: () => { START.forEach((v, i) => { vals[i] = v; }); layout(); stats(); } }, "Reset"),
        segmented(["S", "P"], "S", (v) => { sample = v === "S"; stats(); }, (v) => (v === "S" ? "Sample (n − 1)" : "Population (n)"))),
      svg, out, note);
    layout(); lineSp.jump(target()); stats();
    return () => { dots.forEach((d) => d.sp.stop()); lineSp.stop(); };
  }

  // ------------------------------------------------------------ tab 2 · box and quartiles

  function boxTab(root, shared) {
    const vals = shared.vals, VMAX = Math.max(1000, Math.ceil((Math.max(...vals) * 1.1) / 250) * 250), X0 = 40, X1 = 580;
    const X = (v) => X0 + (v / VMAX) * (X1 - X0);
    const svg = s("svg", { viewBox: "0 0 600 260", role: "img", "aria-label": "Box plot with quartiles and a percentile marker" });
    const g = s("g"); svg.append(g);
    let p = 0.5, B = null;
    const out = h("div", { class: "readout" }), work = h("pre", { class: "workings" });
    const five = () => { const q1 = percentile(vals, 0.25), q3 = percentile(vals, 0.75), iqr = q3 - q1; const inside = vals.filter((v) => v >= q1 - 1.5 * iqr && v <= q3 + 1.5 * iqr); return [Math.min(...inside), q1, median(vals), q3, Math.max(...inside), percentile(vals, p)]; };
    const sp = new Spring(five(), (v) => { B = v; draw(); }, { stiffness: 150, damping: 15 });
    function draw() {
      clear(g);
      const [lo, q1, md, q3, hi, pv] = B;
      for (let v = 0; v <= VMAX; v += 250) g.append(s("line", { x1: X(v), y1: 30, x2: X(v), y2: 200, stroke: "var(--grid)" }), s("text", { x: X(v), y: 220, "text-anchor": "middle", class: "svg-text", "font-size": 12 }, "₱" + v));
      g.append(s("line", { x1: X0, y1: 200, x2: X1, y2: 200, stroke: "var(--ink)" }));
      // dots
      const below = vals.filter((v) => v <= pv + 1e-9).length;
      sorted(vals).forEach((v, i) => g.append(s("circle", { cx: X(v), cy: 52 + (i % 2) * 12, r: 6, fill: v <= pv + 1e-9 ? "var(--gold-soft)" : "var(--shape-a-soft)", stroke: v <= pv + 1e-9 ? "var(--gold)" : "var(--shape-a)", "stroke-width": 2 })));
      // box
      const y = 120;
      g.append(s("line", { x1: X(lo), y1: y, x2: X(q1), y2: y, stroke: "var(--ink)", "stroke-width": 2 }), s("line", { x1: X(q3), y1: y, x2: X(hi), y2: y, stroke: "var(--ink)", "stroke-width": 2 }));
      [lo, hi].forEach((v) => g.append(s("line", { x1: X(v), y1: y - 14, x2: X(v), y2: y + 14, stroke: "var(--ink)", "stroke-width": 2 })));
      g.append(s("rect", { x: X(q1), y: y - 26, width: Math.max(1, X(q3) - X(q1)), height: 52, rx: 4, fill: "var(--shape-a-soft)", stroke: "var(--shape-a)", "stroke-width": 2 }));
      g.append(s("line", { x1: X(md), y1: y - 26, x2: X(md), y2: y + 26, stroke: "var(--shape-b)", "stroke-width": 3 }));
      const iqr = q3 - q1;
      vals.filter((v) => v < q1 - 1.5 * iqr || v > q3 + 1.5 * iqr).forEach((v) => g.append(s("circle", { cx: X(v), cy: y, r: 6, fill: "var(--paper)", stroke: "var(--bad)", "stroke-width": 2.5 }), s("text", { x: X(v), y: y - 14, "text-anchor": "middle", class: "svg-label", "font-size": 11, fill: "var(--bad)" }, "outlier")));
      [[q1, "Q1"], [md, "Q2"], [q3, "Q3"]].forEach(([v, t], k) => g.append(s("text", { x: X(v), y: y + 44 + (k === 1 ? 12 : 0), "text-anchor": "middle", class: "svg-text", "font-size": 12, "font-weight": 700 }, t)));
      // percentile marker
      g.append(s("line", { x1: X(pv), y1: 30, x2: X(pv), y2: 200, stroke: "var(--gold)", "stroke-width": 3, "stroke-dasharray": "6 4" }));
      g.append(s("text", { x: clamp(X(pv), X0 + 50, X1 - 50), y: 22, "text-anchor": "middle", class: "svg-text", "font-size": 13, "font-weight": 700, fill: "var(--gold)" }, `P${Math.round(p * 100)} = ${fmt(pv, 1)}`));
      clear(out);
      out.append(stat("Q1:", peso(q1)).el, stat("Median (Q2):", peso(md)).el, stat("Q3:", peso(q3)).el, stat("IQR:", peso(q3 - q1)).el, stat(`Values ≤ P${Math.round(p * 100)}:`, `${below} of ${vals.length}`).el);
      const n = vals.length, r = p * (n - 1);
      work.textContent = `=QUARTILE(B2:B13, 1)  → ${fmt(percentile(vals, 0.25), 2)}     =QUARTILE(B2:B13, 3)  → ${fmt(percentile(vals, 0.75), 2)}\n` +
        `=PERCENTILE(B2:B13, ${fmt(p, 2)})  → ${fmt(percentile(vals, p), 2)}\n` +
        `How: sort the ${n} values; position = ${fmt(p, 2)} × (${n} − 1) = ${fmt(r, 2)} (counting from 0),\n     so go ${fmt(r - Math.floor(r), 2)} of the way from the ${Math.floor(r) + 1}${["st", "nd", "rd"][Math.floor(r)] || "th"} to the next value.`;
    }
    const slider = elasticSlider({ id: "da-l9-pct", label: "Percentile", min: 0, max: 100, value: 50, step: 5, format: (v) => `P${fmt(v, 0)}`, onInput: (v) => { p = v / 100; sp.set(five()); } });
    root.append(h("p", {}, "The same allowances as a box plot. The box runs from Q1 to Q3 (the middle half of the data); the line inside is the median. Slide the percentile marker."),
      h("div", { class: "controls" }, slider.el), svg, out, work,
      h("p", { class: "note" }, "A value beyond 1.5 × IQR from the box is marked as an outlier. Go back to Drag the Data, add an outlier, and return here."));
    sp.jump(five());
    return () => sp.stop();
  }

  // ------------------------------------------------------------ tab 3 · formulas

  function formulas(root, shared) {
    const vals = shared.vals;
    const cells = h("div", { class: "sl-cells" });
    const tbody = h("tbody");
    const ROWS = [
      ["Mean", "=AVERAGE(B2:B13)", (a) => mean(a)],
      ["Median", "=MEDIAN(B2:B13)", (a) => median(a)],
      ["Mode", "=MODE(B2:B13)", (a) => mode(a)],
      ["Range", "=MAX(B2:B13)-MIN(B2:B13)", (a) => Math.max(...a) - Math.min(...a)],
      ["Variance (sample)", "=VAR.S(B2:B13)", (a) => variance(a, true)],
      ["Variance (population)", "=VAR.P(B2:B13)", (a) => variance(a, false)],
      ["SD (sample)", "=STDEV.S(B2:B13)", (a) => sd(a, true)],
      ["SD (population)", "=STDEV.P(B2:B13)", (a) => sd(a, false)],
      ["90th percentile", "=PERCENTILE(B2:B13, 0.9)", (a) => percentile(a, 0.9)],
      ["First quartile", "=QUARTILE(B2:B13, 1)", (a) => percentile(a, 0.25)],
    ];
    const outs = ROWS.map(() => h("td"));
    let shown = ROWS.map(([, , f]) => f(vals) ?? 0);
    const sp = new Spring(shown.slice(), (v) => { shown = v; paint(); }, { stiffness: 120, damping: 16 });
    function paint() { ROWS.forEach(([, , f], i) => { outs[i].textContent = f(vals) === null ? "#N/A" : fmt(shown[i], 2); }); }
    ROWS.forEach(([name, formula], i) => tbody.append(h("tr", {}, h("td", {}, name), h("td", {}, formula), outs[i])));
    const inputs = vals.map((v, i) => {
      const inp = h("input", { type: "text", inputmode: "decimal", value: String(v), "aria-label": `Cell B${i + 2}` });
      inp.addEventListener("input", () => { const x = Number(inp.value.replace(/[₱,\s]/g, "")); if (inp.value.trim() !== "" && Number.isFinite(x)) { vals[i] = x; update(); } });
      cells.append(h("label", {}, `B${i + 2}`, inp));
      return inp;
    });
    function update() { sp.set(ROWS.map(([, , f]) => f(vals) ?? 0)); }
    function newSample() {
      const base = randInt(6, 10) * 50;
      vals.forEach((_, i) => { vals[i] = Math.max(100, base + randInt(-5, 6) * 50); });
      inputs.forEach((inp, i) => { inp.value = String(vals[i]); });
      update();
    }
    root.append(h("p", {}, "Column B holds the 12 allowances (sample data). Type a new value in any cell, or make a new sample. Every formula updates."),
      cells,
      h("div", { class: "controls" }, h("button", { class: "btn", type: "button", onclick: newSample }, "New sample"),
        h("button", { class: "btn ghost", type: "button", onclick: () => { START.forEach((v, i) => { vals[i] = v; inputs[i].value = String(v); }); update(); } }, "Reset")),
      h("div", { class: "table-wrap" }, h("table", { class: "data sl-ftab" }, h("thead", {}, h("tr", {}, h("th", {}, "Measure"), h("th", {}, "Google Sheets"), h("th", {}, "Value"))), tbody)),
      h("p", { class: "note" }, "Sample or population? The 12 learners are a sample of all Grade 11 learners, so use VAR.S and STDEV.S (divide by n − 1). Use VAR.P and STDEV.P only when the data include the whole population. MODE shows #N/A when no value repeats."));
    paint();
    return () => sp.stop();
  }

  // ------------------------------------------------------------ register

  Sim.register({
    id: "lesson9", unit: "4", num: 9, letter: "I", title: "Descriptive Statistics", simName: "Spread Lab",
    comps: ["A2.1", "M7"], sessions: "S41–S46", cg: "CG Part 2 · Content 1 (Descriptive and Inferential Statistics)", deped: "CG Part 2 · Content 1 (Descriptive and Inferential Statistics)",
    bigQuestion: "What do the numbers really show – and what do they not prove?",
    mission: [
      "Drag the Data: “Average allowance?” Add the ₱1,800 outlier. Which moves more, the mean or the median? Which one would you report as the typical allowance?",
      "Drag the dots closer together, then spread them out. What happens to the range and the standard deviation?",
      "Box and Quartiles: find Q1, the median and Q3. Slide to P90 – how many values are at or below it?",
      "Formulas: change one value in column B. Which formulas change? Compare VAR.S with VAR.P.",
    ],
    discovery: "The mean, median and mode describe the centre of the data; the range, variance, standard deviation, percentiles and quartiles describe its spread. One extreme value pulls the mean and the range a lot but barely moves the median or the quartiles, so for skewed data the median and IQR represent the data more fairly. In Sheets: AVERAGE, MEDIAN, MODE, MAX−MIN, VAR.S / VAR.P, STDEV.S / STDEV.P, PERCENTILE and QUARTILE – use .S for a sample and .P for a whole population.",
    mount(stage) {
      const body = h("div", { class: "stage-body" });
      const shared = { vals: START.slice() };
      const views = [dragData, boxTab, formulas];
      let stopper = null;
      const t = tabs(["Drag the Data", "Box and Quartiles", "Formulas"], (i) => { if (stopper) stopper(); clear(body); stopper = views[i](body, shared) || null; });
      stage.append(t.el, body);
      stopper = dragData(body, shared);
      return () => { if (stopper) stopper(); };
    },
    check() {
      const kind = randInt(0, 6);
      const data = (n) => Array.from({ length: n }, () => randInt(2, 20) * 10);
      if (kind === 0) { const a = data(randInt(5, 7)); return { q: `Daily jeepney fare spending (₱, sample data): ${a.join(", ")}. What is the mean?`, answer: mean(a), tol: 0.01, unit: "₱", explain: `Sum ${a.reduce((x, y) => x + y, 0)} ÷ ${a.length} = ${fmt(mean(a), 2)}.` }; }
      if (kind === 1) { const a = data(pick([6, 7, 8])); return { q: `Find the median of: ${a.join(", ")}.`, answer: median(a), tol: 0.01, explain: `Sorted: ${sorted(a).join(", ")}. Median = ${fmt(median(a), 2)}.` }; }
      if (kind === 2) { const a = data(randInt(6, 9)); return { q: `What does =MAX(B2:B${a.length + 1})-MIN(B2:B${a.length + 1}) return for ${a.join(", ")}?`, answer: Math.max(...a) - Math.min(...a), tol: 0, explain: `${Math.max(...a)} − ${Math.min(...a)} = ${Math.max(...a) - Math.min(...a)}.` }; }
      if (kind === 3) { const a = Array.from({ length: 4 }, () => randInt(1, 9) * 2); const pop = Math.random() < 0.5; return { q: `For the values ${a.join(", ")}, find the ${pop ? "population variance (VAR.P)" : "sample variance (VAR.S)"}.`, answer: variance(a, !pop), tol: 0.01, explain: `Mean ${fmt(mean(a), 2)}; squared deviations add to ${fmt(variance(a, false) * a.length, 2)}; divide by ${pop ? a.length : a.length - 1}: ${fmt(variance(a, !pop), 2)}.` }; }
      if (kind === 4) { const a = sorted(data(9)); return { q: `What does =QUARTILE(B2:B10, 1) return for the sorted values ${a.join(", ")}?`, answer: percentile(a, 0.25), tol: 0.01, explain: `Position 0.25 × (9 − 1) = 2 (counting from 0), the 3rd value: ${percentile(a, 0.25)}.` }; }
      if (kind === 5) return pick([
        { q: "Eleven allowances are about ₱500, and one is ₱5,000. Which number best describes a typical allowance?", choices: ["The median", "The mean", "The range", "The maximum"], answer: "The median", explain: "The outlier pulls the mean up; the median is resistant to it." },
        { q: "The 40 learners of one section are the whole group you care about. Which function gives their standard deviation?", choices: ["STDEV.P", "STDEV.S", "VAR.S", "AVERAGE"], answer: "STDEV.P", explain: "The data are the whole population, so divide by n: STDEV.P." },
        { q: "A survey of 50 learners is used to describe all 600 Grade 11 learners. Which function?", choices: ["STDEV.S", "STDEV.P", "MODE", "MEDIAN"], answer: "STDEV.S", explain: "The data are a sample, so divide by n − 1: STDEV.S." },
        { q: "Two classes have the same mean score, but Class A has SD 3 and Class B has SD 12. What does this mean?", choices: ["Class B’s scores are more spread out", "Class B scored higher", "Class A has more learners", "Nothing – SD does not matter"], answer: "Class B’s scores are more spread out", explain: "A larger SD means values lie farther from the mean on average." },
        { q: "Your score is at the 80th percentile. What does that mean?", choices: ["About 80% of scores are at or below yours", "You got 80% of the items right", "You beat 20% of the class", "Your score is 80"], answer: "About 80% of scores are at or below yours", explain: "A percentile tells position in the data, not the percent correct." },
      ]);
      const a = data(5), m = mean(a), b = a.concat([m]);
      return { q: `The mean of ${a.join(", ")} is ${fmt(m, 2)}. If one more value equal to ${fmt(m, 2)} is added, what is the new mean?`, answer: mean(b), tol: 0.01, explain: "Adding a value equal to the mean leaves the mean unchanged." };
    },
  });
})();
