/* Math 8 · Lesson 1 · A. Measures of Central Tendency – Center Finder */
(function () {
  "use strict";
  const { h, s, clear, randInt, pick, shuffle, fmt, tabs, segmented, stat, pill, Spring, elasticSlider, rubber, clamp } = Sim;

  // ------------------------------------------------------------ statistics

  const sum = (a) => a.reduce((x, y) => x + y, 0);
  const mean = (a) => sum(a) / a.length;
  const median = (a) => { const b = [...a].sort((x, y) => x - y), n = b.length; return n % 2 ? b[(n - 1) / 2] : (b[n / 2 - 1] + b[n / 2]) / 2; };
  /** Every value that occurs most often; [] when no value repeats. */
  function modes(a) {
    const c = new Map();
    a.forEach((v) => c.set(v, (c.get(v) || 0) + 1));
    const top = Math.max(...c.values());
    if (top === 1) return [];
    return [...c].filter(([, f]) => f === top).map(([v]) => v).sort((x, y) => x - y);
  }
  const modeText = (a, f = (v) => fmt(v, 2)) => { const m = modes(a); return m.length ? m.map(f).join(" and ") : "none"; };
  const minus = (t) => String(t).replace(/-/g, "−");

  // ------------------------------------------------------------ balance point

  function balance(root) {
    const X0 = 50, U = 54, BY = 160, PY = 168, AXY = 262;
    const X = (v) => X0 + v * U;
    let F = 5, ang = 0, dragging = -1;
    const svg = s("svg", { viewBox: "0 0 640 334", role: "img", "aria-label": "Quiz scores as dots on a seesaw beam over a movable fulcrum" });
    const beamG = s("g"), dotG = s("g"), fulG = s("g", { class: "token", tabindex: 0, "aria-label": "Fulcrum – drag left or right" }), markG = s("g");
    svg.append(s("line", { x1: 20, y1: 214, x2: 620, y2: 214, stroke: "var(--line)", "stroke-width": 3 }));
    beamG.append(s("rect", { x: X(0) - 18, y: BY, width: 10 * U + 36, height: 8, rx: 3, fill: "var(--muted)" }));
    for (let v = 0; v <= 10; v++) beamG.append(s("line", { x1: X(v), y1: BY, x2: X(v), y2: BY + 8, stroke: "var(--paper)", "stroke-width": 1.5 }));
    beamG.append(dotG);
    fulG.append(s("path", { d: "M0,0 L-24,46 L24,46 Z", fill: "var(--accent)", stroke: "var(--ink)", "stroke-width": 1.5 }), s("circle", { r: 3.5, fill: "var(--paper)" }));
    svg.append(fulG, beamG);
    // fixed number line with the glide markers
    svg.append(s("line", { x1: X(0) - 10, y1: AXY, x2: X(10) + 10, y2: AXY, stroke: "var(--ink)", "stroke-width": 2 }));
    for (let v = 0; v <= 10; v++) svg.append(s("line", { x1: X(v), y1: AXY - 5, x2: X(v), y2: AXY + 5, stroke: "var(--ink)" }), s("text", { x: X(v), y: AXY + 22, "text-anchor": "middle", class: "svg-text", "font-size": 15 }, String(v)));
    svg.append(markG);
    const mkMarker = (label, color, y) => {
      const g = s("g", { opacity: 0 });
      g.append(s("path", { d: `M0,${AXY + 3} l-7,10 h14 z`, fill: color }), s("line", { x1: 0, y1: AXY + 13, x2: 0, y2: y - 13, stroke: color, "stroke-width": 2 }), s("text", { x: 0, y, "text-anchor": "middle", class: "svg-label", "font-size": 14, "font-weight": 700, fill: color }, label));
      markG.append(g); return g;
    };
    const meanM = mkMarker("mean", "var(--accent)", 306), medM = mkMarker("median", "var(--shape-a)", 326);
    const modeMs = Array.from({ length: 5 }, () => { const g = s("g", { opacity: 0 }); g.append(s("rect", { x: -7, y: AXY - 26, width: 14, height: 14, rx: 2, fill: "var(--shape-b)" }), s("text", { y: AXY - 32, "text-anchor": "middle", class: "svg-label", "font-size": 13, "font-weight": 700, fill: "var(--shape-b)" }, "mode")); markG.append(g); return g; });

    const dots = [];
    const out = h("div", { class: "readout" }), status = h("p", { class: "unit-big", "aria-live": "polite" });
    const st = { n: stat("n =", ""), sum: stat("Sum:", ""), mean: stat("Mean:", ""), med: stat("Median:", ""), mode: stat("Mode:", "") };
    out.append(...Object.values(st).map((x) => x.el));

    const toBeam = (p) => { const a = (-ang * Math.PI) / 180, cx = X(F), dx = p.x - cx, dy = p.y - PY; return { x: cx + dx * Math.cos(a) - dy * Math.sin(a), y: PY + dx * Math.sin(a) + dy * Math.cos(a) }; };
    const values = () => dots.map((d) => d.v);
    const snapped = () => dots.map((d) => Math.round(d.v));

    function paintBeam() {
      beamG.setAttribute("transform", `rotate(${ang},${X(F)},${PY})`);
      fulG.setAttribute("transform", `translate(${X(F)},${PY})`);
    }
    const angSp = new Spring(0, (a) => { ang = a; paintBeam(); }, { stiffness: 80, damping: 7 });
    const fSp = new Spring(F, (v) => { F = v; paintBeam(); retilt(); }, { stiffness: 170, damping: 15 });
    function retilt() {
      const torque = sum(values().map((v) => v - F));
      angSp.set(clamp(torque * 1.5, -13, 13));
      const m = mean(snapped());
      const ok = Math.abs(F - m) < 0.06;
      status.textContent = ok ? "Balanced! The fulcrum is at the mean." : torque > 0 ? "The beam tips RIGHT – move the fulcrum right." : "The beam tips LEFT – move the fulcrum left.";
    }
    const meanSp = new Spring(5, (v) => meanM.setAttribute("transform", `translate(${X(v)},0)`));
    const medSp = new Spring(5, (v) => medM.setAttribute("transform", `translate(${X(v)},0)`));
    const modeSps = modeMs.map((g) => new Spring([5, 0], ([x, o]) => { g.setAttribute("transform", `translate(${X(x)},0)`); g.setAttribute("opacity", clamp(o, 0, 1)); }));

    function relevel() {
      const seen = new Map();
      dots.forEach((d, i) => {
        const k = Math.round(d.v), lvl = seen.get(k) || 0; seen.set(k, lvl + 1);
        d.lvl = lvl;
        if (i !== dragging) d.sp.set([clamp(Math.round(d.v), 0, 10), lvl]);
      });
    }
    function stats() {
      const a = snapped(), m = mean(a), md = median(a), mo = modes(a);
      st.n.set(String(a.length)); st.sum.set(String(sum(a))); st.mean.set(`${sum(a)} ÷ ${a.length} = ${fmt(m, 2)}`);
      st.med.set(fmt(md, 2)); st.mode.set(modeText(a));
      meanM.setAttribute("opacity", 1); medM.setAttribute("opacity", 1);
      meanSp.set(m); medSp.set(md);
      modeSps.forEach((sp, i) => sp.set(i < mo.length ? [mo[i], 1] : [sp.value[0], 0]));
      retilt();
    }
    function addDot(v, fromTop) {
      const node = s("g", { class: "token", tabindex: 0, "aria-label": "Score dot – drag along the beam" });
      node.append(s("circle", { r: 11, fill: "var(--shape-a)", stroke: "var(--paper)", "stroke-width": 2 }));
      dotG.append(node);
      const d = { v, lvl: 0, node };
      const paintDot = ([x, l]) => { d.v = x; node.setAttribute("transform", `translate(${X(x)},${BY - 12 - l * 23})`); };
      d.sp = new Spring([v, fromTop ? 7 : 0], paintDot, { stiffness: 190, damping: 14 });
      paintDot(d.sp.value);
      Sim.draggable(svg, node, (p) => {
        dragging = dots.indexOf(d);
        const b = toBeam(p), x = rubber((b.x - X0) / U, 0, 10, 0.3);
        d.sp.stop(); d.sp.value = [x, d.lvl]; d.sp.vel = [0, 0]; paintDot(d.sp.value);
        relevel(); stats();
      }, () => { dragging = -1; relevel(); stats(); });
      dots.push(d);
      return d;
    }
    Sim.draggable(svg, fulG, (p) => { fSp.stop(); F = rubber((p.x - X0) / U, 0, 10, 0.3); fSp.value = F; fSp.vel = 0; paintBeam(); retilt(); },
      () => { const m = mean(snapped()); fSp.set(Math.abs(F - m) < 0.35 ? m : clamp(Math.round(F * 2) / 2, 0, 10)); });

    [2, 5, 6, 6, 7, 8, 8].forEach((v) => addDot(v, false));
    relevel(); stats(); paintBeam();

    const add = () => { if (dots.length >= 10) return; addDot(randInt(1, 9), true); relevel(); stats(); };
    const remove = () => { if (dots.length <= 3) return; const d = dots.pop(); d.sp.stop(); d.node.remove(); relevel(); stats(); };
    const fresh = () => {
      const n = randInt(5, 8);
      while (dots.length < n) addDot(5, true);
      while (dots.length > n) { const d = dots.pop(); d.sp.stop(); d.node.remove(); }
      dots.forEach((d) => { d.v = randInt(1, 9); });
      relevel(); stats();
    };
    root.append(h("p", {}, "Scores of some Grade 8 learners on a 10-point quiz. Drag the dots along the beam, and drag the green triangle (the fulcrum) until the beam balances."),
      h("div", { class: "controls" },
        h("button", { class: "btn", type: "button", onclick: () => fSp.set(mean(snapped())) }, "Balance it"),
        h("button", { class: "btn ghost", type: "button", onclick: add }, "Add a score"),
        h("button", { class: "btn ghost", type: "button", onclick: remove }, "Remove a score"),
        h("button", { class: "btn ghost", type: "button", onclick: fresh }, "New scores")),
      svg, status, out,
      h("p", { class: "note" }, "The beam balances only when the fulcrum is at the mean: the distances of the dots on the left exactly cancel the distances on the right. The median splits the dots into two equal halves; the mode is the tallest stack."));
    return () => { angSp.stop(); fSp.stop(); meanSp.stop(); medSp.stop(); modeSps.forEach((x) => x.stop()); dots.forEach((d) => d.sp.stop()); };
  }

  // ------------------------------------------------------------ outlier effect

  const CONTEXTS = {
    baon: { label: "Daily baon of 7 learners", unit: "₱", data: [50, 60, 60, 65, 70, 75, 80], out: 500, min: 100, max: 1000, step: 50, who: "Add one learner whose daily baon is" },
    travel: { label: "Travel time to school of 7 learners", unit: "min", data: [15, 20, 20, 25, 30, 35, 40], out: 120, min: 50, max: 180, step: 5, who: "Add one learner who travels for" },
  };
  const show = (c, v) => (c.unit === "₱" ? `₱${fmt(v, 2)}` : `${fmt(v, 2)} min`);

  function outlier(root) {
    let ctx = CONTEXTS.baon, on = false, outV = ctx.out, M = 100, pres = 0;
    const svg = s("svg", { viewBox: "0 0 640 230", role: "img", "aria-label": "Dot plot with an outlier" });
    const tickG = s("g"), dotG = s("g"), markG = s("g");
    svg.append(tickG, dotG, markG);
    const AXY = 110, X = (v) => 40 + (v / M) * 560;
    const table = h("tbody"), sliderBox = h("div", { class: "controls" }), toggle = h("button", { class: "btn", type: "button" });
    const meanM = s("g"), medM = s("g"), modeM = s("g");
    meanM.append(s("path", { d: `M0,${AXY + 30} l-7,12 h14 z`, fill: "var(--accent)" }), s("text", { y: AXY + 60, "text-anchor": "middle", class: "svg-label", "font-size": 15, "font-weight": 700, fill: "var(--accent)" }, "mean"));
    medM.append(s("path", { d: `M0,${AXY + 30} l-7,12 h14 z`, fill: "var(--shape-a)" }), s("text", { y: AXY + 78, "text-anchor": "middle", class: "svg-label", "font-size": 15, "font-weight": 700, fill: "var(--shape-a)" }, "median"));
    modeM.append(s("path", { d: `M0,${AXY + 30} l-7,12 h14 z`, fill: "var(--shape-b)" }), s("text", { y: AXY + 96, "text-anchor": "middle", class: "svg-label", "font-size": 15, "font-weight": 700, fill: "var(--shape-b)" }, "mode"));
    markG.append(modeM, medM, meanM);
    let dotNodes = [], outNode = null, marks = [0, 0, 0], sliderGen = 0;

    function ticks() {
      clear(tickG);
      tickG.append(s("line", { x1: 30, y1: AXY, x2: 610, y2: AXY, stroke: "var(--ink)", "stroke-width": 2 }));
      const step = [5, 10, 20, 25, 50, 100, 200].find((k) => M / k <= 10);
      for (let v = 0; v <= M + 1e-9; v += step) tickG.append(s("line", { x1: X(v), y1: AXY - 4, x2: X(v), y2: AXY + 4, stroke: "var(--ink)" }), s("text", { x: X(v), y: AXY + 22, "text-anchor": "middle", class: "svg-text", "font-size": 14 }, String(v)));
    }
    function paint() {
      ticks();
      const seen = new Map();
      ctx.data.forEach((v, i) => { const l = seen.get(v) || 0; seen.set(v, l + 1); dotNodes[i].setAttribute("transform", `translate(${X(v)},${AXY - 14 - l * 22})`); });
      outNode.setAttribute("transform", `translate(${X(outV)},${AXY - 14 - (1 - pres) * 70}) scale(${clamp(pres, 0, 1.2)})`);
      outNode.setAttribute("opacity", clamp(pres, 0, 1));
      [meanM, medM, modeM].forEach((g, i) => g.setAttribute("transform", `translate(${X(marks[i])},0)`));
    }
    const presSp = new Spring(0, (v) => { pres = v; paint(); }, { stiffness: 150, damping: 12 });
    const scaleSp = new Spring(100, (v) => { M = v; paint(); }, { stiffness: 120, damping: 16 });
    const markSp = new Spring([0, 0, 0], (v) => { marks = v; paint(); }, { stiffness: 140, damping: 12 });

    function build() {
      clear(dotG);
      dotNodes = ctx.data.map(() => { const c = s("circle", { r: 10, fill: "var(--shape-a)", stroke: "var(--paper)", "stroke-width": 2 }); dotG.append(c); return c; });
      outNode = s("g"); outNode.append(s("circle", { r: 10, fill: "var(--shape-b)", stroke: "var(--ink)", "stroke-width": 1.5 }), s("text", { y: -16, "text-anchor": "middle", class: "svg-label", "font-size": 14, "font-weight": 700, fill: "var(--shape-b)" }, "outlier"));
      dotG.append(outNode);
      clear(sliderBox);
      const gen = ++sliderGen;
      sliderBox.append(h("span", {}, ctx.who), elasticSlider({ id: "g8l1-out", label: "Outlier", min: ctx.min, max: ctx.max, value: outV, step: ctx.step, format: (v) => show(ctx, v), onInput: (v) => { if (gen !== sliderGen) return; outV = v; update(); } }).el);
    }
    function update() {
      const base = ctx.data, withO = [...base, Math.round(outV / ctx.step) * ctx.step];
      const now = on ? withO : base, mo = modes(now);
      markSp.set([mean(now), median(now), mo.length ? mo[0] : median(now)]);
      modeM.setAttribute("opacity", mo.length ? 1 : 0);
      const top = on ? Math.max(outV, ...base) : Math.max(...base);
      scaleSp.set(Math.max(50, Math.ceil((top * 1.12) / 50) * 50));
      presSp.set(on ? 1 : 0);
      toggle.textContent = on ? "Remove the outlier" : "Add the outlier";
      clear(table);
      const rows = [["Mean", mean(base), mean(withO)], ["Median", median(base), median(withO)], ["Mode", modes(base)[0], modes(withO)[0]]];
      rows.forEach(([n, a, b]) => table.append(h("tr", {}, h("td", {}, n), h("td", { class: "num" }, show(ctx, a)), h("td", { class: "num" }, show(ctx, b)), h("td", { class: "num" }, Math.abs(b - a) < 1e-9 ? "no change" : minus((b - a > 0 ? "+" : "") + fmt(b - a, 2))))));
    }
    toggle.addEventListener("click", () => { on = !on; update(); });
    const pickCtx = (k) => { ctx = CONTEXTS[k]; outV = ctx.out; on = false; build(); presSp.jump(0); update(); };
    root.append(h("div", { class: "controls" }, segmented(["baon", "travel"], "baon", pickCtx, (k) => (k === "baon" ? "Daily baon" : "Travel time")), toggle),
      sliderBox, svg,
      h("div", { class: "table-wrap" }, h("table", { class: "data" }, h("thead", {}, h("tr", {}, h("th", {}, "Measure"), h("th", {}, "Without outlier"), h("th", {}, "With outlier"), h("th", {}, "Change"))), table)),
      h("p", { class: "note" }, "An outlier is a value far from the rest. Watch the markers: the mean is pulled toward the outlier, the median barely moves, and the mode does not move at all."));
    build(); update();
    return () => { presSp.stop(); scaleSp.stop(); markSp.stop(); };
  }

  // ------------------------------------------------------------ which measure

  const SCEN = [
    { title: "Shoe sizes sold", text: "A shoe store in Cubao sold these sizes last Saturday. The owner wants to know which size to order the most of.", data: [6, 7, 7, 7, 8, 8, 9, 10], answer: "Mode",
      reasons: ["The owner needs the size that is bought most often.", "The mean uses every size sold.", "The middle size is always the safest to order."] },
    { title: "House prices", text: "Six houses in a Batangas subdivision sold for these prices (millions of pesos). A family wants to know the typical price.", data: [2.1, 2.3, 2.4, 2.5, 2.6, 25], answer: "Median",
      reasons: ["One very expensive house is an outlier, and the median is not pulled by it.", "The mean uses every price, so it is always best.", "The mode shows the most common price."] },
    { title: "Quiz scores", text: "Jo’s five quiz scores (out of 20) this term. The teacher wants one number in which every quiz counts.", data: [15, 17, 14, 18, 16], answer: "Mean",
      reasons: ["There are no outliers, and the mean uses every score.", "No score repeats, so the median is the only choice.", "The highest score shows what Jo can do."] },
    { title: "Bakery salaries", text: "Monthly salaries (thousands of pesos) of the 7 people at a small bakery, including the owner. A job applicant wants the typical salary.", data: [15, 16, 16, 18, 18, 20, 120], answer: "Median",
      reasons: ["The owner’s salary is an outlier; the median shows what most workers earn.", "The mean is higher, so it is more accurate.", "Two salaries repeat, so the mode is best."] },
    { title: "Baguio lows", text: "Daily low temperatures (°C) in Baguio for one week in January. A report needs the average low for the week.", data: [12, 13, 11, 14, 13, 12, 16], answer: "Mean",
      reasons: ["The values are close together, and the mean uses every day.", "Two modes means the data are useless.", "The median ignores cold days."] },
    { title: "T-shirt sizes", text: "Sizes chosen by Grade 8 learners for the Family Day shirt (S = 1, M = 2, L = 3, XL = 4). The organizer orders extra of one size.", data: [1, 2, 2, 2, 2, 3, 3, 4], answer: "Mode",
      reasons: ["The organizer needs the most popular size.", "The mean, 2.4, is between M and L, so order size 2.4.", "The median is always the best for sizes."] },
  ];

  function which(root) {
    let idx = 0, chosen = null, reason = null;
    const area = h("div", { class: "stage-body" });
    const svg = s("svg", { viewBox: "0 0 640 156", role: "img", "aria-label": "The data with mean, median, and mode markers" });
    let springs = [];
    function plot(sc, reveal) {
      clear(svg); springs.forEach((x) => x.stop()); springs = [];
      const lo = Math.min(...sc.data), hi = Math.max(...sc.data), pad = (hi - lo) * 0.08 || 1;
      const X = (v) => 30 + ((v - lo + pad) / (hi - lo + 2 * pad)) * 580;
      svg.append(s("line", { x1: 20, y1: 80, x2: 620, y2: 80, stroke: "var(--ink)", "stroke-width": 2 }));
      const seen = new Map();
      svg.setAttribute("viewBox", "0 -10 640 166");
      sc.data.forEach((v) => { const l = seen.get(v) || 0; seen.set(v, l + 1); svg.append(s("circle", { cx: X(v), cy: 68 - l * 21, r: 10, fill: "var(--shape-a)" })); if (!l) svg.append(s("text", { x: X(v), y: 98, "text-anchor": "middle", class: "svg-text", "font-size": 14 }, fmt(v, 2))); });
      if (!reveal) return;
      const mo = modes(sc.data);
      [["mean", mean(sc.data), "var(--accent)", 120], ["median", median(sc.data), "var(--shape-a)", 137], ["mode", mo.length ? mo[0] : null, "var(--shape-b)", 154]].forEach(([n, v, c, y]) => {
        if (v === null) return;
        const g = s("g"); g.append(s("line", { x1: 0, y1: 82, x2: 0, y2: y - 11, stroke: c, "stroke-width": 2 }), s("text", { y, "text-anchor": "middle", class: "svg-label", "font-size": 14, "font-weight": 700, fill: c }, n)); svg.append(g);
        const sp = new Spring(lo, (x) => g.setAttribute("transform", `translate(${X(x)},0)`), { stiffness: 120, damping: 11 });
        sp.jump(lo); sp.set(v); springs.push(sp);
      });
    }
    function render() {
      clear(area);
      const sc = SCEN[idx], done = chosen !== null && reason !== null;
      area.append(h("p", {}, h("strong", {}, `Scenario ${idx + 1} of ${SCEN.length} · ${sc.title}. `), sc.text), svg);
      plot(sc, done);
      area.append(h("p", { class: "note" }, "1. Which measure should be used?"),
        h("div", { class: "choices" }, ["Mean", "Median", "Mode"].map((m) => h("button", { type: "button", "aria-pressed": chosen === m ? "true" : "false", onclick: () => { chosen = m; render(); } }, m))));
      if (chosen !== null) {
        if (!sc.order) sc.order = shuffle([0, 1, 2]);
        area.append(h("p", { class: "note" }, "2. Justify: pick the best reason."),
          h("div", { class: "choices" }, sc.order.map((k) => h("button", { type: "button", "aria-pressed": reason === k ? "true" : "false", onclick: () => { reason = k; render(); } }, sc.reasons[k]))));
      }
      if (done) {
        const a = sc.data;
        area.append(h("div", { class: "readout" }, stat("Mean:", fmt(mean(a), 2)).el, stat("Median:", fmt(median(a), 2)).el, stat("Mode:", modeText(a)).el),
          pill(chosen === sc.answer && reason === 0, `Yes – the ${sc.answer.toLowerCase()}. ${sc.reasons[0]}`, `Best choice: the ${sc.answer.toLowerCase()}. ${sc.reasons[0]}`),
          h("div", { class: "controls" }, h("button", { class: "btn", type: "button", onclick: () => { idx = (idx + 1) % SCEN.length; chosen = null; reason = null; render(); } }, "Next scenario")));
      }
    }
    root.append(area, h("p", { class: "note" }, "Mean: no outliers and every value should count. Median: there is an outlier (skewed data). Mode: the most common or most popular value, even for sizes and categories."));
    render();
    return () => springs.forEach((x) => x.stop());
  }

  // ------------------------------------------------------------ lesson

  Sim.register({
    id: "g8-lesson1", unit: "8A", num: 1, letter: "A", title: "Measures of Central Tendency", simName: "Center Finder",
    comps: ["A1", "A2", "M1"], cycles: "C1,M2 – C1,M5", deped: "DepEd Week 1",
    bigQuestion: "Which “average” tells the truth about our class?",
    mission: [
      "Balance Point: drag the fulcrum until the beam balances. Where is it compared with the mean?",
      "Drag one dot far to the right. Which marker moves the most – mean, median, or mode?",
      "Outlier Effect: add the ₱500 baon. How much does each measure change?",
      "Which Measure?: choose and justify a measure for all six scenarios.",
    ],
    discovery: "The mean is the balance point of the data: the distances below it cancel the distances above it. The median is the middle value and the mode is the most frequent value. An outlier pulls the mean toward it but barely moves the median, so the median describes skewed data better, while the mode suits the most popular value.",
    mount(stage) {
      const body = h("div", { class: "stage-body" });
      const views = [balance, outlier, which];
      let stopper = null;
      const t = tabs(["Balance Point", "Outlier Effect", "Which Measure?"], (i) => { if (stopper) stopper(); clear(body); stopper = views[i](body) || null; });
      stage.append(t.el, body);
      stopper = balance(body);
      return () => { if (stopper) stopper(); };
    },
    check() {
      const kind = randInt(0, 5);
      if (kind === 0) {
        const n = pick([4, 5, 6]), a = Array.from({ length: n }, () => randInt(2, 20)), m = mean(a);
        return { q: `Find the mean of ${a.join(", ")}.`, answer: Math.round(m * 100) / 100, tol: 0.011, explain: `(${a.join(" + ")}) ÷ ${n} = ${sum(a)} ÷ ${n} = ${fmt(m, 2)}.` };
      }
      if (kind === 1) {
        const n = pick([5, 6, 7]), a = shuffle(Array.from({ length: n }, () => randInt(1, 30))), b = [...a].sort((x, y) => x - y), md = median(a);
        return { q: `Find the median of ${a.join(", ")}.`, answer: md, explain: `In order: ${b.join(", ")}. ${n % 2 ? `The middle (${(n + 1) / 2}th) value is ${md}.` : `The two middle values are ${b[n / 2 - 1]} and ${b[n / 2]}; their mean is ${fmt(md, 2)}.`}` };
      }
      if (kind === 2) {
        const [a, opts] = pick([[[4, 7, 7, 9, 2, 7], ["7", "4", "9", "none"]], [[3, 5, 8, 10, 12], ["none", "8", "3", "12"]], [[6, 2, 6, 9, 2, 1], ["2 and 6", "6", "2", "none"]],
          [[15, 12, 15, 18, 20], ["15", "12", "16", "none"]], [[1, 3, 5, 7, 9, 11], ["none", "6", "1", "11"]]]);
        const mo = modeText(a);
        return { q: `What is the mode of ${a.join(", ")}?`, choices: shuffle(opts), answer: mo, explain: mo === "none" ? "No value repeats, so there is no mode." : `${mo} occur${mo.includes("and") ? "" : "s"} most often.` };
      }
      if (kind === 3) {
        const sc = pick(SCEN);
        return { q: `${sc.text} Which measure should be used?`, choices: ["Mean", "Median", "Mode"], answer: sc.answer, explain: sc.reasons[0] };
      }
      if (kind === 4) return pick([
        { q: "A very large value is added to a data set. Which measure changes the most?", choices: ["Mean", "Median", "Mode"], answer: "Mean", explain: "The mean uses the size of every value, so an outlier pulls it strongly." },
        { q: "Which measure is the balance point of a dot plot?", choices: ["Mean", "Median", "Mode"], answer: "Mean", explain: "Distances below the mean cancel distances above it." },
        { q: "Which measure can be used for data like favourite colours?", choices: ["Mean", "Median", "Mode"], answer: "Mode", explain: "Categories cannot be added or ordered, but they can be counted." },
      ]);
      const m = randInt(10, 20), a = [m - randInt(1, 4), m + randInt(0, 3), m - randInt(0, 2)], x = 4 * m - sum(a);
      return { q: `The mean of four numbers is ${m}. Three of them are ${a.join(", ")}. What is the fourth number?`, answer: x, explain: `The sum must be 4 × ${m} = ${4 * m}; ${4 * m} − ${sum(a)} = ${minus(x)}.` };
    },
  });
})();
