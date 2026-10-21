/* Term 2 · Lesson 7 · G. Organizing and Graphing Data – Graph Studio */
(function () {
  "use strict";
  const { h, s, clear, randInt, pick, fmt, tabs, segmented, stat, pill, Spring, elasticSlider } = Sim;

  const SCORES = [23, 35, 41, 18, 29, 33, 45, 38, 27, 31, 36, 42, 25, 30, 34, 39, 22, 28, 44, 37, 32, 26, 40, 35, 19, 33, 47, 29, 36, 31, 24, 38, 43, 30, 27, 34, 41, 35, 28, 32];
  const SNACKS = [["Banana cue", 12], ["Turon", 9], ["Siomai", 15], ["Fishball", 10], ["Lumpia", 4]];
  const WATER = [["Mon", 1.2], ["Tue", 1.5], ["Wed", 1.1], ["Thu", 1.8], ["Fri", 2.0], ["Sat", 1.6], ["Sun", 1.3]];
  const COLORS = ["var(--shape-a)", "var(--shape-b)", "var(--gold)", "var(--accent)", "var(--muted)"];

  function classes(width) {
    const lo = Math.floor(Math.min(...SCORES) / width) * width, out = [];
    for (let a = lo; a <= Math.max(...SCORES); a += width) out.push({ a, b: a + width - 1, f: SCORES.filter((x) => x >= a && x <= a + width - 1).length });
    return out;
  }

  // ------------------------------------------------------------ frequency table

  function fdt(root) {
    let width = 5;
    const tbody = h("tbody"), svg = s("svg", { viewBox: "0 0 600 240", role: "img", "aria-label": "Frequency bar graph" });
    const out = h("div", { class: "readout" });
    let heights = classes(5).map(() => 0);
    const grow = new Spring(heights, (v) => { heights = v; drawBars(); }, { stiffness: 150, damping: 14 });
    function drawBars() {
      clear(svg);
      const cl = classes(width), n = cl.length, bw = 520 / n, max = Math.max(4, Math.ceil(Math.max(...cl.map((c) => c.f)) / 4) * 4);
      for (let y = 0; y <= max; y += 4) { const py = 210 - (y / max) * 190; svg.append(s("line", { x1: 40, y1: py, x2: 570, y2: py, stroke: "var(--grid)" }), s("text", { x: 34, y: py + 4, "text-anchor": "end", class: "svg-text", "font-size": 11 }, String(y))); }
      cl.forEach((c, i) => {
        const hv = heights[i] || 0, x = 45 + i * bw;
        svg.append(s("rect", { x, y: 210 - (hv / max) * 190, width: bw - 4, height: (hv / max) * 190, fill: "var(--shape-a-soft)", stroke: "var(--shape-a)" }));
        svg.append(s("text", { x: x + bw / 2 - 2, y: 228, "text-anchor": "middle", class: "svg-text", "font-size": n > 8 ? 9 : 11 }, `${c.a}–${c.b}`));
      });
    }
    function update() {
      const cl = classes(width);
      clear(tbody);
      cl.forEach((c) => tbody.append(h("tr", {}, h("td", {}, `${c.a} – ${c.b}`), h("td", { class: "num tally" }, ...Array.from({ length: Math.floor(c.f / 5) }, () => h("span", { class: "tally5" }, "||||")), c.f % 5 ? h("span", {}, "|".repeat(c.f % 5)) : null), h("td", { class: "num" }, String(c.f)))));
      tbody.append(h("tr", {}, h("td", {}, h("strong", {}, "Total")), h("td"), h("td", { class: "num" }, h("strong", {}, String(SCORES.length)))));
      const modal = cl.reduce((m, c) => (c.f > m.f ? c : m));
      clear(out);
      out.append(stat("Classes:", String(cl.length)).el, stat("Class width:", String(width)).el, stat("Modal class:", `${modal.a}–${modal.b}`).el);
      if (grow.value.length !== cl.length) { grow.value = cl.map(() => 0); grow.vel = cl.map(() => 0); }
      grow.set(cl.map((c) => c.f));
    }
    root.append(h("p", {}, "Quiz scores (out of 50) of 40 Grade 7 learners:"), h("p", { class: "workings" }, SCORES.join(", ")),
      h("div", { class: "controls" }, elasticSlider({ id: "t2l7-w", label: "Class width", min: 2, max: 10, value: 5, snaps: [2, 3, 4, 5, 6, 8, 10], format: (v) => fmt(v, 0), onInput: (v) => { const w = Math.round(v); if (w !== width && [2, 3, 4, 5, 6, 8, 10].includes(w)) { width = w; update(); } } }).el),
      h("div", { class: "table-wrap" }, h("table", { class: "data" }, h("thead", {}, h("tr", {}, h("th", {}, "Class"), h("th", {}, "Tally"), h("th", {}, "Frequency"))), tbody)),
      out, svg);
    update();
    return () => grow.stop();
  }

  // ------------------------------------------------------------ bar or pie

  function barPie(root) {
    let mode = "bar", k = 0;
    const total = SNACKS.reduce((a, [, v]) => a + v, 0);
    const svg = s("svg", { viewBox: "0 0 600 300", role: "img", "aria-label": "Favourite snack graph" });
    const work = h("pre", { class: "workings" });
    const grow = new Spring(0, (v) => { k = v; draw(); }, { stiffness: 110, damping: 15 });
    function draw() {
      clear(svg);
      if (mode === "bar") {
        const bw = 90;
        SNACKS.forEach(([name, v], i) => {
          const hh = (v / 16) * 230 * k, x = 50 + i * 105;
          svg.append(s("rect", { x, y: 260 - hh, width: bw, height: hh, fill: COLORS[i], opacity: 0.75 }));
          svg.append(s("text", { x: x + bw / 2, y: 280, "text-anchor": "middle", class: "svg-text", "font-size": 12 }, name));
          if (k > 0.6) svg.append(s("text", { x: x + bw / 2, y: 252 - hh, "text-anchor": "middle", class: "svg-text", "font-weight": 700 }, String(v)));
        });
      } else {
        let a0 = -90;
        SNACKS.forEach(([name, v], i) => {
          const sweep = (v / total) * 360 * k, a1 = a0 + sweep;
          const r = 120, cx = 200, cy = 150, p = (a) => ({ x: cx + r * Math.cos((a * Math.PI) / 180), y: cy + r * Math.sin((a * Math.PI) / 180) });
          if (sweep > 0.1) svg.append(s("path", { d: `M${cx},${cy} L${p(a0).x},${p(a0).y} A${r},${r} 0 ${sweep > 180 ? 1 : 0} 1 ${p(a1).x},${p(a1).y} Z`, fill: COLORS[i], opacity: 0.8, stroke: "var(--paper)", "stroke-width": 2 }));
          svg.append(s("rect", { x: 370, y: 50 + i * 40, width: 18, height: 18, fill: COLORS[i] }), s("text", { x: 396, y: 64 + i * 40, class: "svg-text" }, `${name}: ${fmt((v / total) * 100, 0)}%`));
          a0 = a1;
        });
      }
    }
    function show(m) {
      mode = m; grow.jump(0); grow.set(1);
      work.textContent = m === "bar" ? "Bar graph: compares the counts of categories." :
        SNACKS.map(([n, v]) => `${n.padEnd(11)} ${v}/${total} = ${fmt((v / total) * 100, 0)}%  → ${fmt((v / total) * 360, 1)}° of the circle`).join("\n");
    }
    root.append(h("p", {}, `Favourite snack of ${total} learners:`), h("div", { class: "controls" }, segmented(["bar", "pie"], mode, show, (v) => (v === "bar" ? "Bar graph" : "Pie graph"))), svg, work,
      h("p", { class: "note" }, "A pie graph shows parts of a whole: each sector’s angle = (count ÷ total) × 360°."));
    show("bar");
    return () => grow.stop();
  }

  // ------------------------------------------------------------ line graph

  function line(root) {
    let k = 0;
    const svg = s("svg", { viewBox: "0 0 600 270", role: "img", "aria-label": "Line graph of daily water intake" });
    const out = h("div", { class: "readout" });
    const X = (i) => 60 + i * 80, Y = (v) => 230 - ((v - 0.8) / 1.4) * 200;
    const draw = () => {
      clear(svg);
      [1.0, 1.4, 1.8, 2.2].forEach((v) => svg.append(s("line", { x1: 50, y1: Y(v), x2: 570, y2: Y(v), stroke: "var(--grid)" }), s("text", { x: 44, y: Y(v) + 4, "text-anchor": "end", class: "svg-text", "font-size": 11 }, `${v.toFixed(1)} L`)));
      WATER.forEach(([d], i) => svg.append(s("text", { x: X(i), y: 252, "text-anchor": "middle", class: "svg-text" }, d)));
      const upto = k * (WATER.length - 1), whole = Math.floor(upto), part = upto - whole;
      const pts = WATER.slice(0, whole + 1).map(([, v], i) => ({ x: X(i), y: Y(v) }));
      if (whole < WATER.length - 1) { const a = WATER[whole][1], b = WATER[whole + 1][1]; pts.push({ x: X(whole + part), y: Y(a + (b - a) * part) }); }
      svg.append(s("polyline", { points: pts.map((p) => `${p.x},${p.y}`).join(" "), fill: "none", stroke: "var(--shape-a)", "stroke-width": 3 }));
      WATER.forEach(([, v], i) => { if (i <= upto + 1e-9) svg.append(s("circle", { cx: X(i), cy: Y(v), r: 5, fill: "var(--shape-a)" }), s("text", { x: X(i), y: Y(v) - 10, "text-anchor": "middle", class: "svg-text", "font-size": 11 }, v.toFixed(1))); });
    };
    const sp = new Spring(0, (v) => { k = v; draw(); }, { stiffness: 30, damping: 11 });
    const vals = WATER.map(([, v]) => v);
    root.append(h("p", {}, "Daily water intake of a learner for one week (litres):"), h("div", { class: "controls" }, h("button", { class: "btn", type: "button", onclick: () => { sp.jump(0); sp.set(1); } }, "Draw the line")),
      svg, out, h("p", { class: "note" }, "A line graph shows how a quantity changes over time. Rising segments mean an increase; falling segments mean a decrease."));
    out.append(stat("Highest:", `${fmt(Math.max(...vals), 1)} L (Fri)`).el, stat("Lowest:", `${fmt(Math.min(...vals), 1)} L (Wed)`).el, stat("Total:", `${fmt(vals.reduce((a, b) => a + b, 0), 1)} L`).el);
    sp.jump(0); sp.set(1);
    return () => sp.stop();
  }

  // ------------------------------------------------------------ stem and leaf

  function stemLeaf(root) {
    const sorted = [...SCORES].sort((a, b) => a - b);
    const stems = [...new Set(sorted.map((x) => Math.floor(x / 10)))];
    const svg = s("svg", { viewBox: "0 0 600 250", role: "img", "aria-label": "Stem-and-leaf plot" });
    let k = 0;
    const draw = () => {
      clear(svg);
      svg.append(s("text", { x: 60, y: 24, "text-anchor": "middle", class: "svg-label", "font-weight": 700 }, "Stem"), s("text", { x: 130, y: 24, class: "svg-label", "font-weight": 700 }, "Leaves"));
      svg.append(s("line", { x1: 95, y1: 34, x2: 95, y2: 230, stroke: "var(--ink)", "stroke-width": 2 }));
      let idx = 0;
      stems.forEach((st, r) => {
        const y = 60 + r * 45;
        svg.append(s("text", { x: 60, y, "text-anchor": "middle", class: "svg-text", "font-size": 18, "font-weight": 700 }, String(st)));
        sorted.filter((x) => Math.floor(x / 10) === st).forEach((x, j) => {
          const appear = Math.min(1, Math.max(0, k * sorted.length - idx));
          idx++;
          svg.append(s("text", { x: 115 + j * 30 + (1 - appear) * 300, y, class: "svg-text", "font-size": 18, opacity: appear }, String(x % 10)));
        });
      });
      svg.append(s("text", { x: 590, y: 244, "text-anchor": "end", class: "svg-label" }, "Key: 3 | 5 means 35"));
    };
    const sp = new Spring(0, (v) => { k = v; draw(); }, { stiffness: 20, damping: 9 });
    root.append(h("p", {}, "The same 40 quiz scores as a stem-and-leaf plot:"), h("div", { class: "controls" }, h("button", { class: "btn", type: "button", onclick: () => { sp.jump(0); sp.set(1); } }, "Build the plot")), svg,
      h("p", { class: "note" }, `The tens digits are the stems and the ones digits are the leaves. Lowest score ${sorted[0]}, highest ${sorted[sorted.length - 1]}; the 30s row is the longest.`));
    sp.jump(0); sp.set(1);
    return () => sp.stop();
  }

  Sim.register({
    id: "lesson16", unit: "F", num: 7, letter: "G", title: "Organizing and Graphing Data", simName: "Graph Studio",
    comps: ["A12", "A13", "A14", "M7"], cycles: "C7,M2 – C8,M4", deped: "DepEd Weeks 7–8",
    bigQuestion: "Which graph tells the story of the data best?",
    mission: [
      "Frequency Table: slide the class width from 10 to 5. Which class is the modal class each time?",
      "Bar ↔ Pie: show the snack data both ways. Which graph shows parts of a whole?",
      "Line Graph: on which day did the learner drink the most water? Between which days was the biggest drop?",
      "Stem-and-Leaf: how many learners scored in the 30s?",
    ],
    discovery: "A frequency distribution table groups data into classes and counts them. Bar graphs compare categories, pie graphs show parts of a whole (angle = fraction × 360°), line graphs show change over time, and stem-and-leaf plots keep every value while showing the shape of the data.",
    mount(stage) {
      const body = h("div", { class: "stage-body" });
      const views = [fdt, barPie, line, stemLeaf];
      let stopper = null;
      const t = tabs(["Frequency Table", "Bar ↔ Pie", "Line Graph", "Stem-and-Leaf"], (i) => { if (stopper) stopper(); clear(body); stopper = views[i](body) || null; });
      stage.append(t.el, body);
      stopper = fdt(body);
      return () => { if (stopper) stopper(); };
    },
    check() {
      const kind = randInt(0, 4);
      const total = SNACKS.reduce((a, [, v]) => a + v, 0);
      if (kind === 0) { const c = pick(classes(10)); return { q: `Using the 40 quiz scores and classes of width 10, how many scores are in the class ${c.a}–${c.b}?`, answer: c.f, explain: `Count the scores from ${c.a} to ${c.b}: ${c.f}.` }; }
      if (kind === 1) { const [n, v] = pick(SNACKS); return { q: `${v} of ${total} learners chose ${n}. What is the angle of its sector in a pie graph?`, answer: (v / total) * 360, unit: "°", explain: `${v}/${total} × 360° = ${fmt((v / total) * 360, 1)}°.` }; }
      if (kind === 2) { const [n, v] = pick(SNACKS); return { q: `${v} of ${total} learners chose ${n}. What percent is that?`, answer: (v / total) * 100, unit: "%", explain: `${v} ÷ ${total} × 100% = ${fmt((v / total) * 100, 1)}%.` }; }
      if (kind === 3) return pick([
        { q: "Which graph is best for showing how a quantity changes over a week?", choices: ["Bar graph", "Pie graph", "Line graph", "Stem-and-leaf plot"], answer: "Line graph", explain: "Line graphs show change over time." },
        { q: "Which graph is best for showing parts of a whole?", choices: ["Bar graph", "Pie graph", "Line graph", "Stem-and-leaf plot"], answer: "Pie graph", explain: "A pie graph divides a whole into sectors." },
        { q: "Which display keeps every individual data value?", choices: ["Bar graph", "Pie graph", "Line graph", "Stem-and-leaf plot"], answer: "Stem-and-leaf plot", explain: "Each leaf is one data value." },
      ]);
      const [d1, v1] = pick(WATER); return { q: `In the water-intake line graph, how many litres did the learner drink on ${d1}?`, answer: v1, tol: 0.01, unit: "L", explain: `Read the point above ${d1}: ${v1} L.` };
    },
  });
})();
