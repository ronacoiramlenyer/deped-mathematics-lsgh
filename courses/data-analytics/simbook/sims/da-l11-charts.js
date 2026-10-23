/* Unit 5 · Lesson 11 · K. Visualizing Data in Spreadsheets – Chart Chooser */
(function () {
  "use strict";
  const { h, s, clear, randInt, pick, shuffle, fmt, round, clamp, tabs, segmented, stat, pill, Spring, elasticSlider, rubber } = Sim;

  // ------------------------------------------------------------ sample data (hand-made, NOT official readings)

  const M6 = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
  const M12 = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  // One Quezon City station, January to June (sample data)
  const QC = { pm: [28, 31, 34, 37, 30, 19], wind: [12, 11, 9, 7, 10, 16], rain: [15, 10, 12, 25, 120, 260], bad: [3, 5, 7, 9, 4, 1] };
  const QC12 = [28, 31, 34, 37, 30, 19, 15, 14, 16, 22, 27, 30];
  const CITIES = ["Manila", "Quezon City", "Makati", "Pasig", "Valenzuela", "Taguig"];
  const TABLE = [
    [30, 33, 35, 38, 31, 20], [28, 31, 34, 37, 30, 19], [25, 27, 29, 31, 26, 17],
    [27, 30, 33, 36, 29, 18], [36, 39, 42, 45, 37, 24], [22, 24, 26, 28, 23, 15],
  ];
  const BASE = { Manila: 31, "Quezon City": 30, Makati: 26, Pasig: 29, Valenzuela: 37, Taguig: 23 };
  const SEASON = [0.95, 1.05, 1.12, 1.2, 1.0, 0.65, 0.5, 0.47, 0.55, 0.75, 0.9, 1.0];
  const STATION = { Roadside: 1.15, Residential: 0.85 };
  const reading = (city, m, st) => Math.round(BASE[city] * SEASON[m] * STATION[st]);
  const PIE_COLORS = ["var(--shape-a)", "var(--shape-b)", "var(--gold)", "var(--accent)", "var(--muted)", "color-mix(in srgb, var(--shape-a) 45%, var(--shape-b))"];
  const sum = (a) => a.reduce((x, y) => x + y, 0);

  const CSS = `
  .l11-q { background: var(--gold-soft); border-left: 4px solid var(--gold); border-radius: 0 8px 8px 0; padding: 8px 12px; margin: 0; }
  .l11-tag { font-family: var(--mono); font-size: .75rem; letter-spacing: .06em; text-transform: uppercase; color: var(--gold); display: block; }
  .l11-table td.num { text-align: right; font-family: var(--mono); }
  .l11-table td.cell { text-align: right; font-family: var(--mono); border-radius: 4px; }
  .l11-table td.spark { padding: 2px 6px; }
  .l11-table svg { width: 84px; height: 26px; display: block; }
  .l11-chips { display: flex; gap: 6px; flex-wrap: wrap; }
  .l11-chips button { border: 1px solid var(--line); background: var(--bg); padding: 5px 11px; border-radius: 999px; cursor: pointer; font-size: .88rem; }
  .l11-chips button[aria-pressed="true"] { background: var(--shape-a-soft); border-color: var(--shape-a); font-weight: 700; }
  .l11-mark { transition: fill .45s, stroke .45s; }
  `;

  // ------------------------------------------------------------ morphing marks

  const K = 40;
  function rectPoly(x, y, w, hh) {
    w = Math.max(0.01, w); hh = Math.max(0.01, hh);
    const c = [[x, y], [x + w, y], [x + w, y + hh], [x, y + hh]], n = K / 4, out = [];
    for (let side = 0; side < 4; side++) {
      const [a, b] = [c[side], c[(side + 1) % 4]];
      for (let i = 0; i < n; i++) out.push(a[0] + ((b[0] - a[0]) * i) / n, a[1] + ((b[1] - a[1]) * i) / n);
    }
    return out;
  }
  function circlePoly(cx, cy, r) {
    return Array.from({ length: K }, (_, i) => { const a = -0.75 * Math.PI + (i / K) * 2 * Math.PI; return [cx + r * Math.cos(a), cy + r * Math.sin(a)]; }).flat();
  }
  function wedgePoly(cx, cy, r, a0, a1) {
    const pts = [], nArc = K - 6;
    for (let i = 0; i < 3; i++) pts.push([cx + (i / 3) * r * Math.cos(a0), cy + (i / 3) * r * Math.sin(a0)]);
    for (let i = 0; i < nArc; i++) { const a = a0 + ((a1 - a0) * i) / (nArc - 1); pts.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]); }
    for (let i = 0; i < 3; i++) pts.push([cx + (1 - i / 3) * r * Math.cos(a1), cy + (1 - i / 3) * r * Math.sin(a1)]);
    return pts.flat();
  }
  const pathOf = (arr) => { let d = ""; for (let i = 0; i < arr.length; i += 2) d += (i ? "L" : "M") + arr[i].toFixed(1) + "," + arr[i + 1].toFixed(1); return d + "Z"; };

  const PX0 = 70, PX1 = 560, PY0 = 36, PY1 = 270;
  const yPm = (v) => PY1 - (v / 40) * (PY1 - PY0);
  const band = (i) => PX0 + ((PX1 - PX0) / 6) * (i + 0.5);

  const CHARTS = {
    column: { label: "Column", polys: () => QC.pm.map((v, i) => rectPoly(band(i) - 28, yPm(v), 56, PY1 - yPm(v))), color: () => "var(--shape-a)" },
    bar: { label: "Bar", polys: () => QC.pm.map((v, i) => rectPoly(PX0 + 20, PY0 + i * 39 + 6, (v / 40) * (PX1 - PX0 - 20), 27)), color: () => "var(--shape-a)" },
    line: { label: "Line", polys: () => QC.pm.map((v, i) => circlePoly(band(i), yPm(v), 6)), color: () => "var(--shape-a)" },
    pie: { label: "Pie", polys: () => { const T = sum(QC.bad); let a = -Math.PI / 2; return QC.bad.map((v) => { const a0 = a; a += (v / T) * 2 * Math.PI; return wedgePoly(220, 155, 112, a0, a); }); }, color: (i) => PIE_COLORS[i] },
    scatter: { label: "Scatter", polys: () => QC.pm.map((v, i) => circlePoly(PX0 + ((QC.wind[i] - 5) / 13) * (PX1 - PX0), yPm(v), 8)), color: () => "var(--gold)" },
    combo: { label: "Combo", polys: () => QC.pm.map((v, i) => rectPoly(band(i) - 26, yPm(v), 52, PY1 - yPm(v))), color: () => "var(--shape-a-soft)" },
  };

  const noun = (k) => (k === "scatter" ? "scatter plot" : CHARTS[k].label.toLowerCase() + " chart");
  const QUESTIONS = [
    { q: "Which month had the highest average PM2.5?", kind: "compare", ok: ["column", "bar"], why: "Comparing amounts across categories: columns (or bars) put every month side by side on one baseline." },
    { q: "How did PM2.5 change from January to June?", kind: "trend", ok: ["line"], why: "Change over time is a trend: a line connects the months in order so the rise and fall are easy to see." },
    { q: "What share of the 29 unhealthy-air days fell in each month?", kind: "part-to-whole", ok: ["pie"], why: "Parts that add up to one whole (29 days) fit a pie chart – each slice is a share of the total." },
    { q: "Do windier months have cleaner air?", kind: "relationship", ok: ["scatter"], why: "A relationship between two numeric variables (wind speed and PM2.5) needs a scatter plot." },
    { q: "Did PM2.5 fall when the rains came? Show rainfall and PM2.5 together, month by month.", kind: "two measures", ok: ["combo"], why: "Two measures with different units on one chart: a combo chart (columns + line, two axes)." },
    { q: "Rank the six months from cleanest to dirtiest air, with room for the labels.", kind: "compare", ok: ["bar", "column"], why: "Ranking is a comparison; a bar chart (sorted) is the easiest to read, columns also work." },
  ];

  function chartTypes(root) {
    let type = "column", t = 1, from = CHARTS.column.polys(), to = from, qi = 0, right = 0, tried = 0;
    const svg = s("svg", { viewBox: "0 0 600 320", role: "img", "aria-label": "One data set drawn as different chart types" });
    const axes = s("g"), lineL = s("g"), marks = s("g"), overlay = s("g");
    svg.append(axes, lineL, marks, overlay);
    const paths = QC.pm.map((_, i) => { const p = s("path", { class: "l11-mark", stroke: "var(--paper)", "stroke-width": 1.5 }); marks.append(p); return p; });
    const qBox = h("p", { class: "l11-q" }), fb = h("p", { class: "feedback", "aria-live": "polite" }), score = stat("Score:", "0 / 0");
    const caption = h("p", { class: "note" });

    function lerp(k) { return from.map((poly, i) => poly.map((v, j) => v + (to[i][j] - v) * k)); }
    function paint() {
      const cur = lerp(t);
      paths.forEach((p, i) => { p.setAttribute("d", pathOf(cur[i])); p.setAttribute("fill", CHARTS[type].color(i)); p.setAttribute("stroke", type === "combo" ? "var(--shape-a)" : "var(--paper)"); });
      const k = clamp(t, 0, 1);
      axes.setAttribute("opacity", String(k)); overlay.setAttribute("opacity", String(clamp((t - 0.6) / 0.4, 0, 1)));
      clear(lineL);
      if (type === "line" || type === "combo") {
        const pts = type === "line" ? QC.pm.map((v, i) => [band(i), yPm(v)]) : QC.rain.map((v, i) => [band(i), PY1 - (v / 300) * (PY1 - PY0)]);
        const len = pts.slice(1).reduce((a, p, i) => a + Math.hypot(p[0] - pts[i][0], p[1] - pts[i][1]), 0);
        lineL.append(s("polyline", { points: pts.map((p) => p.join(",")).join(" "), fill: "none", stroke: type === "line" ? "var(--shape-a)" : "var(--shape-b)", "stroke-width": 3, "stroke-linejoin": "round", "stroke-dasharray": len, "stroke-dashoffset": len * (1 - k) }));
        if (type === "combo") pts.forEach((p) => lineL.append(s("circle", { cx: p[0], cy: p[1], r: 5 * k, fill: "var(--shape-b)" })));
      }
    }
    const sp = new Spring(1, (v) => { t = v; paint(); }, { stiffness: 120, damping: 13 });

    function drawAxes() {
      clear(axes); clear(overlay);
      const txt = (x, y, str, o = {}) => s("text", { x, y, class: "svg-text", "font-size": 14, ...o }, str);
      const gridY = (max, unit, right) => {
        for (let v = 0; v <= max; v += max / 4) {
          const y = PY1 - (v / max) * (PY1 - PY0);
          axes.append(s("line", { x1: PX0, y1: y, x2: PX1, y2: y, stroke: "var(--grid)" }));
          axes.append(txt(right ? PX1 + 6 : PX0 - 8, y + 5, fmt(v, 0), { "text-anchor": right ? "start" : "end", fill: right ? "var(--shape-b)" : undefined }));
        }
        axes.append(s("text", { x: right ? 596 : 12, y: PY0 - 12, class: "svg-label", "text-anchor": right ? "end" : "start", fill: right ? "var(--shape-b)" : undefined }, unit));
      };
      if (type === "column" || type === "line" || type === "combo") {
        gridY(40, "PM2.5 (µg/m³)");
        if (type === "combo") gridY(300, "Rainfall (mm)", true);
        M6.forEach((m, i) => axes.append(txt(band(i), PY1 + 22, m, { "text-anchor": "middle" })));
        axes.append(s("line", { x1: PX0, y1: PY1, x2: PX1, y2: PY1, stroke: "var(--ink)", "stroke-width": 1.5 }));
        if (type !== "combo") QC.pm.forEach((v, i) => overlay.append(txt(band(i), yPm(v) - 10, String(v), { "text-anchor": "middle", "font-weight": 700, "font-size": 13 })));
        else overlay.append(s("rect", { x: PX0 + 168, y: 6, width: 14, height: 14, fill: "var(--shape-a-soft)", stroke: "var(--shape-a)" }), s("text", { x: PX0 + 188, y: 18, class: "svg-label" }, "PM2.5"),
          s("line", { x1: PX0 + 250, y1: 13, x2: PX0 + 274, y2: 13, stroke: "var(--shape-b)", "stroke-width": 3 }), s("text", { x: PX0 + 280, y: 18, class: "svg-label" }, "Rainfall"));
      } else if (type === "bar") {
        for (let v = 0; v <= 40; v += 10) { const x = PX0 + 20 + (v / 40) * (PX1 - PX0 - 20); axes.append(s("line", { x1: x, y1: PY0, x2: x, y2: PY0 + 6 * 39, stroke: "var(--grid)" }), txt(x, PY0 + 6 * 39 + 20, String(v), { "text-anchor": "middle" })); }
        M6.forEach((m, i) => axes.append(txt(PX0 + 12, PY0 + i * 39 + 25, m, { "text-anchor": "end" })));
        axes.append(s("line", { x1: PX0 + 20, y1: PY0, x2: PX0 + 20, y2: PY0 + 6 * 39, stroke: "var(--ink)", "stroke-width": 1.5 }));
        axes.append(s("text", { x: PX1, y: 312, class: "svg-label", "text-anchor": "end" }, "PM2.5 (µg/m³)"));
        QC.pm.forEach((v, i) => overlay.append(txt(PX0 + 28 + (v / 40) * (PX1 - PX0 - 20), PY0 + i * 39 + 25, String(v), { "font-weight": 700, "font-size": 13 })));
      } else if (type === "pie") {
        const T = sum(QC.bad);
        M6.forEach((m, i) => overlay.append(s("rect", { x: 380, y: 60 + i * 34, width: 18, height: 18, rx: 3, fill: PIE_COLORS[i] }), txt(406, 75 + i * 34, `${m}: ${QC.bad[i]} ${QC.bad[i] === 1 ? "day" : "days"} (${fmt((QC.bad[i] / T) * 100, 0)}%)`)));
        overlay.append(s("text", { x: 380, y: 40, class: "svg-label" }, `Unhealthy-air days, total ${T}`));
      } else if (type === "scatter") {
        gridY(40, "PM2.5 (µg/m³)");
        for (let w = 5; w <= 18; w += 3) { const x = PX0 + ((w - 5) / 13) * (PX1 - PX0); axes.append(txt(x, PY1 + 22, String(w), { "text-anchor": "middle" })); }
        axes.append(s("line", { x1: PX0, y1: PY1, x2: PX1, y2: PY1, stroke: "var(--ink)", "stroke-width": 1.5 }));
        axes.append(s("text", { x: PX1, y: 314, class: "svg-label", "text-anchor": "end" }, "Average wind speed (km/h)"));
        QC.pm.forEach((v, i) => overlay.append(txt(PX0 + ((QC.wind[i] - 5) / 13) * (PX1 - PX0) + 11, yPm(v) - 8, M6[i], { "font-size": 12, fill: "var(--muted)" })));
      }
    }
    const CAPTIONS = {
      column: "Column chart: PM2.5 for each month. Heights start at zero, so the bars compare fairly.",
      bar: "Bar chart: the same values turned sideways – best for ranking and long category names.",
      line: "Line chart: the months are in time order, so the line shows the trend – up to April, down when the rains begin.",
      pie: "Pie chart: averages of PM2.5 do not add up to a whole, so the pie shows unhealthy-air days (29 in all) – a real part-to-whole.",
      scatter: "Scatter plot: each dot is a month at (wind speed, PM2.5). Windier months sit lower – a negative relationship.",
      combo: "Combo chart: PM2.5 columns on the left axis, rainfall line on the right axis. When rainfall shoots up in May–June, PM2.5 drops.",
    };
    function show(next) {
      const cur = lerp(t);
      from = cur; type = next; to = CHARTS[next].polys();
      drawAxes(); caption.textContent = CAPTIONS[next];
      sp.jump(0); sp.set(1);
    }
    function loadQ() { const Q = QUESTIONS[qi]; clear(qBox); qBox.append(h("span", { class: "l11-tag" }, `Question type: ${Q.kind}`), Q.q); fb.textContent = ""; fb.className = "feedback"; }
    function judge() {
      const Q = QUESTIONS[qi], ok = Q.ok.includes(type);
      tried++; if (ok) right++;
      score.set(`${right} / ${tried}`);
      fb.className = "feedback " + (ok ? "ok" : "bad");
      fb.textContent = (ok ? `Yes – a ${noun(type)} fits. ` : `A ${noun(type)} is not the best fit. `) + Q.why;
    }
    const seg = segmented(Object.keys(CHARTS), type, show, (k) => CHARTS[k].label);
    root.append(qBox,
      h("div", { class: "controls" }, seg),
      svg, caption,
      h("div", { class: "controls" },
        h("button", { class: "btn", type: "button", onclick: judge }, "This chart answers it"),
        h("button", { class: "btn ghost", type: "button", onclick: () => { qi = (qi + 1) % QUESTIONS.length; loadQ(); } }, "Next question"), score.el),
      fb, h("p", { class: "note" }, "Sample data for one Quezon City monitoring station (not official readings)."));
    drawAxes(); caption.textContent = CAPTIONS.column; loadQ();
    sp.jump(0); from = QC.pm.map((v, i) => rectPoly(band(i) - 28, PY1, 56, 0)); sp.set(1);
    return () => sp.stop();
  }

  // ------------------------------------------------------------ conditional formatting + sparklines

  function formatIt(root) {
    const flat = TABLE.flat(), lo = Math.min(...flat), hi = Math.max(...flat);
    const state = { scale: false, rule: false, spark: false };
    let kScale = 0, kRule = 0, kSpark = 0;
    const tbody = h("tbody");
    const sparkTh = h("th", {}, "Trend");
    const cells = [], sparks = [], sparkCells = [];
    TABLE.forEach((row, r) => {
      const tr = h("tr", {}, h("td", {}, CITIES[r]));
      row.forEach((v, c) => { const td = h("td", { class: "cell" }, String(v)); cells.push({ td, v, r, c }); tr.append(td); });
      const sv = s("svg", { viewBox: "0 0 84 26", "aria-label": `Sparkline for ${CITIES[r]}` });
      const pts = row.map((v, i) => [4 + i * 15.2, 22 - ((v - lo) / (hi - lo)) * 18]);
      const len = pts.slice(1).reduce((a, p, i) => a + Math.hypot(p[0] - pts[i][0], p[1] - pts[i][1]), 0);
      const pl = s("polyline", { points: pts.map((p) => p.join(",")).join(" "), fill: "none", stroke: "var(--shape-a)", "stroke-width": 2, "stroke-linejoin": "round", "stroke-dasharray": len, "stroke-dashoffset": len });
      const dot = s("circle", { cx: pts[3][0], cy: pts[3][1], r: 0, fill: "var(--bad)" });
      sv.append(pl, dot); sparks.push({ pl, len, dot });
      const td = h("td", { class: "spark" }, sv); sparkCells.push(td); tr.append(td);
      tbody.append(tr);
    });
    const scaleColor = (v) => { const p = ((v - lo) / (hi - lo)) * 100; return p < 50 ? `color-mix(in srgb, var(--gold) ${p * 2}%, var(--good))` : `color-mix(in srgb, var(--bad) ${(p - 50) * 2}%, var(--gold))`; };
    function paint() {
      cells.forEach(({ td, v, r, c }) => {
        const k = clamp(kScale * 1.7 - (r + c) * 0.07, 0, 1);
        td.style.background = k > 0.001 ? `color-mix(in srgb, ${scaleColor(v)} ${round(k * 62, 1)}%, var(--paper))` : "";
        const ruleOn = v > 35 && kRule > 0.5;
        td.style.fontWeight = ruleOn ? "700" : ""; td.style.color = ruleOn ? "var(--bad)" : "";
        td.style.transform = v > 35 ? `scale(${1 + 0.18 * Math.sin(clamp(kRule, 0, 1) * Math.PI)})` : "";
        td.style.display = "table-cell";
      });
      sparks.forEach(({ pl, len, dot }, r) => { const k = clamp(kSpark * 1.5 - r * 0.08, 0, 1); pl.setAttribute("stroke-dashoffset", String(len * (1 - k))); dot.setAttribute("r", String(3 * clamp((k - 0.6) / 0.4, 0, 1))); });
      const vis = kSpark > 0.02 || state.spark;
      sparkTh.style.display = vis ? "" : "none"; sparkCells.forEach((td) => { td.style.display = vis ? "" : "none"; });
    }
    const spScale = new Spring(0, (v) => { kScale = v; paint(); }, { stiffness: 60, damping: 11 });
    const spRule = new Spring(0, (v) => { kRule = v; paint(); }, { stiffness: 90, damping: 12 });
    const spSpark = new Spring(0, (v) => { kSpark = v; paint(); }, { stiffness: 50, damping: 11 });
    const work = h("pre", { class: "workings" });
    const explain = () => {
      const lines = [];
      if (state.scale) lines.push("Color scale: Format › Conditional formatting › Color scale on B2:G7 (green = low, red = high).");
      if (state.rule) lines.push("Single-color rule: Format › Conditional formatting › Format cells if… Greater than 35 → bold red text.");
      if (state.spark) lines.push("Sparkline in H2:  =SPARKLINE(B2:G2)   then fill down to H7. The red dot marks April.");
      work.textContent = lines.length ? lines.join("\n") : "Turn on a format to see how to make it in Google Sheets.";
    };
    const tog = (key, spring, label) => {
      const b = h("button", { class: "btn ghost", type: "button", "aria-pressed": "false", onclick: () => { state[key] = !state[key]; b.setAttribute("aria-pressed", String(state[key])); b.textContent = (state[key] ? "✓ " : "") + label; spring.set(state[key] ? 1 : 0); explain(); } }, label);
      return b;
    };
    root.append(h("p", {}, "Monthly average PM2.5 (µg/m³) by city, January–June. Sample data. Which city and which month are worst? Try to answer from the plain table first – then turn on the formats."),
      h("div", { class: "controls" }, tog("scale", spScale, "Color scale"), tog("rule", spRule, "Highlight > 35"), tog("spark", spSpark, "Sparklines")),
      h("div", { class: "table-wrap" }, h("table", { class: "data l11-table" }, h("thead", {}, h("tr", {}, h("th", {}, "City"), M6.map((m) => h("th", {}, m)), sparkTh)), tbody)),
      work, h("p", { class: "note" }, "Conditional formatting colors a cell by its own value; a sparkline is a tiny chart inside one cell. Both let the eye find patterns before reading a single number."));
    explain(); paint();
    return () => { spScale.stop(); spRule.stop(); spSpark.stop(); };
  }

  // ------------------------------------------------------------ honest or misleading?

  function honest(root) {
    const body = h("div", { class: "stage-body" });
    let stop = null;
    const views = { "Truncated axis": truncated, "3D pie": pie3d, "Cherry-picked range": cherry };
    root.append(h("div", { class: "controls" }, segmented(Object.keys(views), "Truncated axis", (k) => { if (stop) stop(); clear(body); stop = views[k](body); })), body);
    stop = truncated(body);
    return () => { if (stop) stop(); };
  }
  function judgeRow(isHonest, explainFn) {
    const fb = h("p", { class: "feedback", "aria-live": "polite" });
    const say = (pickHonest) => { const truth = isHonest(); const ok = pickHonest === truth; fb.className = "feedback " + (ok ? "ok" : "bad"); fb.textContent = (ok ? "Right – " : "Look again – ") + (truth ? "this chart is honest. " : "this chart is misleading. ") + explainFn(); };
    return h("div", {}, h("div", { class: "controls" }, h("span", {}, "Your verdict:"), h("button", { class: "btn", type: "button", onclick: () => say(true) }, "Honest"), h("button", { class: "btn ghost", type: "button", onclick: () => say(false) }, "Misleading")), fb);
  }

  function truncated(root) {
    const D = [["Manila", 31], ["Quezon City", 30], ["Pasig", 29], ["Makati", 26]];
    let base = 20;
    const svg = s("svg", { viewBox: "0 0 600 300", role: "img", "aria-label": "Column chart with an adjustable y-axis start" });
    const out = h("div", { class: "readout" });
    const vis = stat("Manila’s bar looks", ""), real = stat("Real ratio", "");
    out.append(vis.el, real.el);
    function draw() {
      clear(svg);
      const top = 32, y = (v) => 260 - ((v - base) / (top - base)) * 220;
      const step = (top - base) > 16 ? 8 : (top - base) > 6 ? 2 : 1;
      for (let v = Math.ceil(base / step) * step; v <= top; v += step) svg.append(s("line", { x1: 70, y1: y(v), x2: 570, y2: y(v), stroke: "var(--grid)" }), s("text", { x: 62, y: y(v) + 5, "text-anchor": "end", class: "svg-text", "font-size": 14 }, fmt(v, 0)));
      svg.append(s("text", { x: 62, y: 265, "text-anchor": "end", class: "svg-text", "font-size": 14, "font-weight": 700, fill: base > 0.5 ? "var(--bad)" : undefined }, fmt(base, 0)));
      D.forEach(([c, v], i) => {
        const x = 100 + i * 120, yy = y(v);
        svg.append(s("rect", { x, y: yy, width: 80, height: 260 - yy, fill: i === 3 ? "var(--shape-b)" : "var(--shape-a)", opacity: 0.85, rx: 3 }),
          s("text", { x: x + 40, y: 284, "text-anchor": "middle", class: "svg-text", "font-size": 14 }, c), s("text", { x: x + 40, y: yy - 8, "text-anchor": "middle", class: "svg-text", "font-size": 14, "font-weight": 700 }, String(v)));
      });
      svg.append(s("line", { x1: 70, y1: 260, x2: 570, y2: 260, stroke: "var(--ink)", "stroke-width": 1.5 }));
      if (base > 0.5) svg.append(s("path", { d: "M62,248 l10,-6 l-10,-6 l10,-6", fill: "none", stroke: "var(--bad)", "stroke-width": 2 }));
      svg.append(s("text", { x: 300, y: 20, "text-anchor": "middle", class: "svg-label", "font-size": 15 }, "Annual average PM2.5 (µg/m³), sample data"));
      vis.set(`${fmt((31 - base) / (26 - base), 2)}× as tall as Makati’s`); real.set(`31 ÷ 26 = ${fmt(31 / 26, 2)}`);
    }
    const sl = elasticSlider({ id: "l11-base", label: "Y-axis starts at", min: 0, max: 25, value: 20, snaps: [0, 5, 10, 15, 20, 25], format: (v) => fmt(v, 0), onInput: (v) => { base = v; draw(); } });
    root.append(h("p", {}, "A news post says: “Makati’s air is FAR cleaner than Manila’s!” Slide where the y-axis starts and watch the gap."), h("div", { class: "controls" }, sl.el), svg, out,
      judgeRow(() => base < 0.5, () => (base < 0.5 ? "Bars start at zero, so their lengths are in the true ratio (Makati is only about 16% lower)." : `Bars measure length from ${fmt(base, 0)}, not from 0, so a ${fmt(31 / 26, 2)}× difference looks like ${fmt((31 - base) / (26 - base), 1)}×. Column and bar charts must start at 0.`)));
    draw();
    return () => {};
  }

  function pie3d(root) {
    const D = [["Vehicles", 30, "var(--shape-a)"], ["Open burning", 20, "var(--gold)"], ["Road dust", 15, "var(--accent)"], ["Others", 15, "var(--muted)"], ["Industry", 20, "var(--shape-b)"]];
    let tilt = 0.42;
    const svg = s("svg", { viewBox: "0 0 600 300", role: "img", "aria-label": "Pie chart that can be tilted into 3D or flattened" });
    const out = h("div", { class: "readout" }), aInd = stat("Industry (20%) covers", ""), aCook = stat("Open burning (20%) covers", "");
    out.append(aInd.el, aCook.el);
    const area = (pts) => Math.abs(pts.reduce((a, p, i) => { const q = pts[(i + 1) % pts.length]; return a + p[0] * q[1] - q[0] * p[1]; }, 0)) / 2;
    function draw() {
      clear(svg);
      const cx = 190, cy = 150, r = 150, ry = r * tilt, depth = (1 - tilt) * 55;
      // Industry centred at the front (90°), Cooking at the back (270°)
      let a = Math.PI / 2 - 1.8 * Math.PI;
      const P = (ang, dy = 0) => [cx + r * Math.cos(ang), cy + ry * Math.sin(ang) + dy];
      const slices = D.map(([n, v, c]) => { const a0 = a; a += (v / 100) * 2 * Math.PI; return { n, v, c, a0, a1: a }; });
      const areas = {}; let total = 0;
      const sides = [], tops = [];
      slices.forEach((sl) => {
        const top = [[cx, cy]]; for (let i = 0; i <= 30; i++) top.push(P(sl.a0 + ((sl.a1 - sl.a0) * i) / 30));
        let ar = area(top);
        if (depth > 0.5) {
          const lo = Math.max(sl.a0, 0), hi2 = Math.min(sl.a1, Math.PI), segs = [[lo, hi2], [Math.max(sl.a0, -2 * Math.PI), Math.min(sl.a1, -Math.PI)]];
          segs.forEach(([u, w]) => { if (w > u) { const side = []; for (let i = 0; i <= 20; i++) side.push(P(u + ((w - u) * i) / 20)); for (let i = 20; i >= 0; i--) side.push(P(u + ((w - u) * i) / 20, depth)); ar += area(side); sides.push({ pts: side, c: sl.c }); } });
        }
        tops.push({ pts: top, c: sl.c }); areas[sl.n] = ar; total += ar;
      });
      sides.forEach(({ pts, c }) => svg.append(s("path", { d: "M" + pts.map((p) => p.map((x) => x.toFixed(1)).join(",")).join("L") + "Z", fill: `color-mix(in srgb, ${c} 70%, #000)`, stroke: "var(--paper)" })));
      tops.forEach(({ pts, c }) => svg.append(s("path", { d: "M" + pts.map((p) => p.map((x) => x.toFixed(1)).join(",")).join("L") + "Z", fill: c, stroke: "var(--paper)", "stroke-width": 1.5 })));
      D.forEach(([n, v, c], i) => svg.append(s("rect", { x: 370, y: 66 + i * 40, width: 20, height: 20, rx: 3, fill: c }), s("text", { x: 398, y: 82 + i * 40, class: "svg-text", "font-size": 16 }, `${n} ${v}%`)));
      svg.append(s("text", { x: 370, y: 46, class: "svg-label" }, "Sources of PM2.5 (sample data)"));
      aInd.set(`${fmt((areas.Industry / total) * 100, 0)}% of the ink`); aCook.set(`${fmt((areas["Open burning"] / total) * 100, 0)}% of the ink`);
    }
    const sp = new Spring(tilt, (v) => { tilt = v; draw(); }, { stiffness: 70, damping: 9 });
    let flat = false;
    const btn = h("button", { class: "btn", type: "button", onclick: () => { flat = !flat; sp.set(flat ? 1 : 0.42); btn.textContent = flat ? "Tilt into 3D" : "Flatten to 2D"; } }, "Flatten to 2D");
    root.append(h("p", {}, "Industry and Open burning are both 20%. In 3D, which slice looks bigger?"), h("div", { class: "controls" }, btn), svg, out,
      judgeRow(() => tilt > 0.97, () => (tilt > 0.97 ? "A flat pie gives equal shares equal areas." : "The tilt squashes the back slices and the thick side adds ink to the front slice, so equal 20% shares look unequal. Avoid 3D charts.")));
    draw();
    return () => sp.stop();
  }

  function cherry(root) {
    let lo = 3, hi = 6;
    const svg = s("svg", { viewBox: "0 0 600 300", role: "img", "aria-label": "Line chart whose visible month range can be widened" });
    function draw() {
      clear(svg);
      const X = (i) => 70 + ((i - lo) / Math.max(0.5, hi - lo)) * 490, Y = (v) => 260 - (v / 40) * 220;
      for (let v = 0; v <= 40; v += 10) svg.append(s("line", { x1: 70, y1: Y(v), x2: 560, y2: Y(v), stroke: "var(--grid)" }), s("text", { x: 62, y: Y(v) + 5, "text-anchor": "end", class: "svg-text", "font-size": 14 }, String(v)));
      const clip = (x) => x >= 69 && x <= 561;
      const pts = QC12.map((v, i) => [X(i), Y(v)]).filter((p) => clip(p[0]));
      svg.append(s("polyline", { points: pts.map((p) => p.map((x) => x.toFixed(1)).join(",")).join(" "), fill: "none", stroke: "var(--shape-a)", "stroke-width": 3, "stroke-linejoin": "round" }));
      QC12.forEach((v, i) => { const x = X(i); if (!clip(x)) return; svg.append(s("circle", { cx: x, cy: Y(v), r: 5, fill: "var(--shape-a)" }), s("text", { x, y: 282, "text-anchor": "middle", class: "svg-text", "font-size": 13 }, M12[i])); });
      svg.append(s("line", { x1: 70, y1: 260, x2: 560, y2: 260, stroke: "var(--ink)", "stroke-width": 1.5 }));
      const full = hi - lo > 10.5;
      svg.append(s("text", { x: 300, y: 22, "text-anchor": "middle", class: "svg-label", "font-size": 15, fill: full ? undefined : "var(--bad)" }, full ? "PM2.5 (µg/m³) through the whole year – it rises again from October" : "“PM2.5 fell 59% since the April smoke-belching drive!”"));
    }
    const sp = new Spring([lo, hi], (v) => { [lo, hi] = v; draw(); }, { stiffness: 80, damping: 11 });
    let full = false;
    const btn = h("button", { class: "btn", type: "button", onclick: () => { full = !full; sp.set(full ? [0, 11] : [3, 6]); btn.textContent = full ? "Show only Apr–Jul" : "Show the full year"; } }, "Show the full year");
    root.append(h("p", {}, "A poster shows only April to July. Widen the range to see the months that were left out."), h("div", { class: "controls" }, btn), svg,
      judgeRow(() => hi - lo > 10.5, () => (hi - lo > 10.5 ? "The full year shows the drop is the rainy season – PM2.5 climbs back by December. No cherry-picking." : "Showing only Apr–Jul hides the seasonal pattern: PM2.5 falls every rainy season and rises again. Choosing a convenient range is cherry-picking.")),
      h("p", { class: "note" }, "Sample data for one station (not official readings)."));
    draw();
    return () => sp.stop();
  }

  // ------------------------------------------------------------ slicers, report filter, timeline

  function slicers(root) {
    const on = new Set(CITIES);
    let station = "All stations", m0 = 0, m1 = 11, v0 = 0, v1 = 11;
    const svg = s("svg", { viewBox: "0 0 600 270", role: "img", "aria-label": "Pivot chart of average PM2.5 by city" });
    const barsG = s("g"), axisG = s("g"); svg.append(axisG, barsG);
    const tl = s("svg", { viewBox: "0 0 600 86", role: "img", "aria-label": "Timeline: drag the two handles to choose months" });
    const tlBase = s("g"), tlHandles = s("g"); tl.append(tlBase, tlHandles);
    const tbody = h("tbody"), sumOut = h("div", { class: "readout" });
    const avg = (city) => {
      const sts = station === "All stations" ? ["Roadside", "Residential"] : [station], vals = [];
      for (let m = m0; m <= m1; m++) sts.forEach((st) => vals.push(reading(city, m, st)));
      return sum(vals) / vals.length;
    };
    const rects = CITIES.map((c) => { const g = s("g"); const r = s("rect", { fill: "var(--shape-a)", opacity: 0.85, rx: 3 }); const lab = s("text", { "text-anchor": "middle", class: "svg-text", "font-size": 13 }, c === "Quezon City" ? "QC" : c); const val = s("text", { "text-anchor": "middle", class: "svg-text", "font-size": 13, "font-weight": 700 }); g.append(r, lab, val); barsG.append(g); return { g, r, lab, val }; });
    let geo = CITIES.flatMap(() => [300, 0, 0]);
    const Y = (v) => 230 - (v / 50) * 200;
    function paintBars() {
      CITIES.forEach((c, i) => {
        const [cx, w, v] = geo.slice(i * 3, i * 3 + 3), { r, lab, val, g } = rects[i];
        r.setAttribute("x", cx - w / 2); r.setAttribute("width", Math.max(0, w)); r.setAttribute("y", Y(v)); r.setAttribute("height", Math.max(0, 230 - Y(v)));
        lab.setAttribute("x", cx); lab.setAttribute("y", 250); val.setAttribute("x", cx); val.setAttribute("y", Y(v) - 7); val.textContent = fmt(v, 1);
        g.setAttribute("opacity", String(clamp(w / 40, 0, 1)));
      });
    }
    const sp = new Spring(geo, (v) => { geo = v; paintBars(); }, { stiffness: 170, damping: 16 });
    clear(axisG);
    for (let v = 0; v <= 50; v += 10) axisG.append(s("line", { x1: 50, y1: Y(v), x2: 580, y2: Y(v), stroke: "var(--grid)" }), s("text", { x: 44, y: Y(v) + 5, "text-anchor": "end", class: "svg-text", "font-size": 13 }, String(v)));
    axisG.append(s("line", { x1: 50, y1: 230, x2: 580, y2: 230, stroke: "var(--ink)", "stroke-width": 1.5 }), s("text", { x: 50, y: 16, class: "svg-label" }, "AVERAGE of PM2.5 (µg/m³) by City"));
    function update() {
      const vis = CITIES.filter((c) => on.has(c)), n = Math.max(1, vis.length), slot = 530 / n;
      const target = [];
      CITIES.forEach((c) => {
        const j = vis.indexOf(c);
        if (j < 0) { const prev = geo[CITIES.indexOf(c) * 3]; target.push(prev, 0, 0); }
        else target.push(50 + slot * (j + 0.5), Math.min(70, slot * 0.6), avg(c));
      });
      sp.set(target);
      clear(tbody);
      vis.forEach((c) => tbody.append(h("tr", {}, h("td", {}, c), h("td", { class: "num" }, fmt(avg(c), 1)))));
      clear(sumOut);
      sumOut.append(stat("Filter:", station).el, stat("Months:", `${M12[m0]}–${M12[m1]}`).el, stat("Cities:", String(vis.length)).el);
    }
    // timeline with two elastic handles
    const TX = (m) => 40 + (m / 11) * 520;
    const tlSp = new Spring([v0, v1], (v) => { [v0, v1] = v; paintTl(); }, { stiffness: 260, damping: 15 });
    const handles = Sim.handleSet(tl, tlHandles, {
      label: "Timeline handle", r: 13,
      onMove: (i, p) => {
        tlSp.stop();
        let m = rubber((p.x - 40) / 520 * 11, 0, 11, 0.3);
        if (i === 0) { v0 = Math.min(m, v1 - 0.6); } else { v1 = Math.max(m, v0 + 0.6); }
        tlSp.value = [v0, v1]; tlSp.vel = [0, 0];
        const a = clamp(Math.round(v0), 0, 11), b = clamp(Math.round(v1), 0, 11);
        if (a !== m0 || b !== m1) { m0 = a; m1 = Math.max(a, b); update(); }
        paintTl();
      },
      onEnd: () => { m0 = clamp(Math.round(v0), 0, 11); m1 = Math.max(m0, clamp(Math.round(v1), 0, 11)); tlSp.set([m0, m1]); update(); },
    });
    function paintTl() {
      clear(tlBase);
      tlBase.append(s("text", { x: 40, y: 18, class: "svg-label", "font-size": 15 }, "Timeline: Month"), s("line", { x1: 40, y1: 46, x2: 560, y2: 46, stroke: "var(--line)", "stroke-width": 10, "stroke-linecap": "round" }),
        s("line", { x1: TX(clamp(v0, -1, 12)), y1: 46, x2: TX(clamp(v1, -1, 12)), y2: 46, stroke: "var(--shape-a)", "stroke-width": 10, "stroke-linecap": "round" }));
      M12.forEach((m, i) => tlBase.append(s("text", { x: TX(i), y: 80, "text-anchor": "middle", class: "svg-text", "font-size": 15, fill: i >= m0 && i <= m1 ? "var(--ink)" : "var(--muted)", "font-weight": i >= m0 && i <= m1 ? 700 : 400 }, m[0] + m.slice(1, 3))));
      handles.sync([{ x: TX(v0), y: 46 }, { x: TX(v1), y: 46 }]);
    }
    const chips = h("div", { class: "l11-chips", role: "group", "aria-label": "Slicer: City" });
    CITIES.forEach((c) => { const b = h("button", { type: "button", "aria-pressed": "true", onclick: () => { if (on.has(c)) { if (on.size > 1) on.delete(c); } else on.add(c); b.setAttribute("aria-pressed", String(on.has(c))); update(); } }, c); chips.append(b); });
    root.append(h("p", {}, "A pivot chart of 12 months of readings from roadside and residential stations (sample data). Use the report filter, the timeline, and the slicer – the bars and the pivot table update together."),
      h("div", { class: "controls" }, h("span", {}, "Report filter · Station:"), segmented(["All stations", "Roadside", "Residential"], station, (v) => { station = v; update(); })),
      tl, h("div", { class: "controls" }, h("span", {}, "Slicer · City:"), chips), svg, sumOut,
      h("div", { class: "table-wrap" }, h("table", { class: "data" }, h("thead", {}, h("tr", {}, h("th", {}, "City (Rows)"), h("th", {}, "AVERAGE of PM2.5"))), tbody)),
      h("p", { class: "note" }, "Report filter = one field filters the whole pivot. Slicer = clickable buttons for one field (Sheets: Data › Add a slicer). Timeline = a slicer for dates (Excel: Insert › Timeline)."));
    paintTl();
    sp.jump(CITIES.flatMap((c, i) => [50 + (530 / 6) * (i + 0.5), 53, 0]));
    update();
    return () => { sp.stop(); tlSp.stop(); };
  }

  Sim.register({
    id: "lesson11", unit: "5", num: 11, letter: "K", title: "Visualizing Data in Spreadsheets", simName: "Chart Chooser",
    comps: ["A2.6", "A2.7", "A2.10", "M9"], sessions: "S55–S59", cg: "CG Part 2 · Content 3 (Data Visualization Using Spreadsheet)",
    deped: "CG Part 2 · Content 3 (Data Visualization Using Spreadsheet)",
    bigQuestion: "How do we show the data so others understand and act?",
    mission: [
      "Chart Types: morph the same air quality data into all six charts. For each question, pick the chart that answers it best.",
      "Format It: find the worst city and month in the plain table, then turn on the color scale and sparklines. Which was faster?",
      "Honest or Misleading?: move the y-axis start, flatten the 3D pie, and widen the cherry-picked range. Give a verdict each time.",
      "Slicers: use the station filter, the timeline, and the city slicer. Which city has the highest average in the dry months (Jan–May)?",
    ],
    discovery: "The chart must fit the question: columns or bars compare, lines show trends, pies show parts of one whole, scatter plots show relationships, and combo charts show two measures. Color scales and sparklines reveal patterns inside a table. A chart can lie through a truncated axis, 3D effects, or a cherry-picked range. Filters, slicers, and timelines let a reader customize one pivot chart instead of making many charts.",
    mount(stage) {
      const body = h("div", { class: "stage-body" });
      const views = [chartTypes, formatIt, honest, slicers];
      let stopper = null;
      const t = tabs(["Chart Types", "Format It", "Honest or Misleading?", "Slicers"], (i) => { if (stopper) stopper(); clear(body); stopper = views[i](body) || null; });
      stage.append(h("style", {}, CSS), t.el, body);
      stopper = chartTypes(body);
      return () => { if (stopper) stopper(); };
    },
    check() {
      const kind = randInt(0, 6);
      const CH = ["Column chart", "Line chart", "Pie chart", "Scatter plot", "Combo chart"];
      if (kind === 0) return pick([
        { q: "Which chart best shows how PM2.5 changed month by month over a year?", choices: shuffle(CH), answer: "Line chart", explain: "Change over time (a trend) → line chart." },
        { q: "Which chart best shows whether windier days have lower PM2.5?", choices: shuffle(CH), answer: "Scatter plot", explain: "A relationship between two numeric variables → scatter plot." },
        { q: "Which chart best shows what share of a barangay's waste is plastic, paper, food, and others?", choices: shuffle(CH), answer: "Pie chart", explain: "Parts of one whole → pie chart (few slices)." },
        { q: "Which chart best compares the average PM2.5 of six cities?", choices: shuffle(CH), answer: "Column chart", explain: "Comparing categories → column (or bar) chart." },
        { q: "Which chart shows monthly rainfall (mm) and PM2.5 (µg/m³) together with two axes?", choices: shuffle(CH), answer: "Combo chart", explain: "Two measures with different units → combo chart." },
      ]);
      if (kind === 1) { const a = randInt(32, 40), b = a - randInt(2, 6), base = pick([18, 20, 22, 24]); return { q: `A column chart shows ${a} and ${b}, but its y-axis starts at ${base}. How many times taller does the ${a} bar look than the ${b} bar? (2 decimal places)`, answer: round((a - base) / (b - base), 2), tol: 0.01, explain: `Visible lengths: ${a} − ${base} = ${a - base} and ${b} − ${base} = ${b - base}; ${a - base} ÷ ${b - base} ≈ ${fmt((a - base) / (b - base), 2)} – but the true ratio is only ${fmt(a / b, 2)}.` }; }
      if (kind === 2) { const v = pick([3, 5, 7, 9, 4]); return { q: `There were 29 unhealthy-air days in all, and ${v} were in one month. What angle does that month's pie slice get? (1 decimal place)`, answer: round((v / 29) * 360, 1), tol: 0.1, unit: "°", explain: `${v}/29 × 360° ≈ ${fmt((v / 29) * 360, 1)}°.` }; }
      if (kind === 3) return pick([
        { q: "Which Google Sheets formula draws a tiny line chart of B2:G2 inside one cell?", choices: ["=SPARKLINE(B2:G2)", "=CHART(B2:G2)", "=LINE(B2:G2)", "=TREND(B2:G2)"], answer: "=SPARKLINE(B2:G2)", explain: "SPARKLINE makes a mini chart in a single cell." },
        { q: "Which formula makes a sparkline drawn as columns?", choices: ['=SPARKLINE(B2:G2, {"charttype","column"})', "=SPARKLINE(B2:G2, column)", "=COLUMN(B2:G2)", '=SPARKLINE("column", B2:G2)'], answer: '=SPARKLINE(B2:G2, {"charttype","column"})', explain: "Options go in curly braces: {\"charttype\",\"column\"}." },
      ]);
      if (kind === 4) return pick([
        { q: "A table of PM2.5 cells is colored from green (low) to red (high). What feature is this?", choices: ["Conditional formatting – color scale", "A slicer", "A sparkline", "A pivot table"], answer: "Conditional formatting – color scale", explain: "A color scale is conditional formatting: each cell is colored by its own value." },
        { q: "What does a slicer do to a pivot table or chart?", choices: ["Filters it with clickable buttons for one field", "Sorts the source data permanently", "Deletes rows from the data", "Adds a trendline"], answer: "Filters it with clickable buttons for one field", explain: "Slicers filter the pivot table/chart; the source data is unchanged." },
        { q: "Which choice makes a column chart misleading?", choices: ["Starting the y-axis at 25 instead of 0", "Labelling both axes", "Using one color for all bars", "Sorting the bars from tallest to shortest"], answer: "Starting the y-axis at 25 instead of 0", explain: "Bar lengths must be measured from zero." },
        { q: "A poster shows only April to July to claim the air is getting cleaner. What is this?", choices: ["Cherry-picking the range", "A truncated axis", "A 3D effect", "An honest trend"], answer: "Cherry-picking the range", explain: "Choosing only the convenient months hides the full pattern." },
      ]);
      if (kind === 5) { const r = randInt(0, 5), row = TABLE[r]; return { q: `Sample data: ${CITIES[r]}'s PM2.5 from Jan to Jun was ${row.join(", ")}. What is the average? (1 decimal place)`, answer: round(sum(row) / 6, 1), tol: 0.06, unit: "µg/m³", explain: `(${row.join(" + ")}) ÷ 6 = ${fmt(sum(row) / 6, 2)}.` }; }
      const c = pick(CITIES), m = randInt(0, 11);
      return { q: `In the Slicers sim, a ${c} roadside reading is ${reading(c, m, "Roadside")} and the residential reading for the same month is ${reading(c, m, "Residential")}. With the report filter on "All stations", what average does the pivot show for that month?`, answer: (reading(c, m, "Roadside") + reading(c, m, "Residential")) / 2, tol: 0.05, explain: `All stations averages both: (${reading(c, m, "Roadside")} + ${reading(c, m, "Residential")}) ÷ 2 = ${fmt((reading(c, m, "Roadside") + reading(c, m, "Residential")) / 2, 1)}.` };
    },
  });
})();
