/* Lesson 3 · C. Angles of Polygons – Angle Sum Machine */
(function () {
  "use strict";
  const { h, s, clear, randInt, pick, fmt, interiorAngles, regularPolygon, tabs, segmented, stat, pill, animate, toRad } = Sim;

  const NAMES = { 3: "triangle", 4: "quadrilateral", 5: "pentagon", 6: "hexagon", 7: "heptagon", 8: "octagon", 9: "nonagon", 10: "decagon", 11: "hendecagon", 12: "dodecagon" };
  const ptsStr = (p) => p.map((q) => `${q.x},${q.y}`).join(" ");

  // ------------------------------------------------------------ triangle split

  function triSplit(root) {
    let n = 5, jitter = false;
    const seen = new Map();
    const svg = s("svg", { viewBox: "0 0 600 400", role: "img", "aria-label": "Polygon split into triangles" });
    const out = h("div", { class: "readout" });
    const tbody = h("tbody");
    const table = h("div", { class: "table-wrap" }, h("table", { class: "data" },
      h("thead", {}, h("tr", {}, h("th", {}, "Polygon"), h("th", {}, "Sides n"), h("th", {}, "Triangles"), h("th", {}, "Sum of interior angles"))), tbody));
    let pts;
    function shape() {
      pts = regularPolygon(n, 300, 205, 170).map((p, i) => {
        if (!jitter || i === 0) return p;
        const k = 0.82 + Math.random() * 0.18;
        return { x: 300 + (p.x - 300) * k, y: 205 + (p.y - 205) * k };
      });
    }
    function draw() {
      clear(svg); clear(out);
      for (let i = 1; i < n - 1; i++) {
        svg.append(s("polygon", { points: ptsStr([pts[0], pts[i], pts[i + 1]]), fill: i % 2 ? "var(--shape-a-soft)" : "var(--shape-b-soft)", stroke: "none" }));
      }
      svg.append(s("polygon", { points: ptsStr(pts), fill: "none", stroke: "var(--ink)", "stroke-width": 3, "stroke-linejoin": "round" }));
      for (let i = 2; i < n - 1; i++) svg.append(s("line", { x1: pts[0].x, y1: pts[0].y, x2: pts[i].x, y2: pts[i].y, stroke: "var(--accent)", "stroke-width": 2, "stroke-dasharray": "7 5" }));
      for (let i = 1; i < n - 1; i++) {
        const c = { x: (pts[0].x + pts[i].x + pts[i + 1].x) / 3, y: (pts[0].y + pts[i].y + pts[i + 1].y) / 3 };
        svg.append(s("text", { x: c.x, y: c.y + 5, "text-anchor": "middle", class: "svg-text" }, String(i)));
      }
      svg.append(s("circle", { cx: pts[0].x, cy: pts[0].y, r: 7, fill: "var(--accent)" }));
      const measured = interiorAngles(pts).reduce((a, b) => a + b, 0);
      out.append(stat("Triangles:", String(n - 2)).el, stat("Sum:", `${n - 2} × 180° = ${(n - 2) * 180}°`).el,
        stat("Measured:", `${fmt(measured, 0)}°`).el, !jitter ? stat("Each angle (regular):", `${fmt(((n - 2) * 180) / n, 1)}°`).el : null);
      seen.set(n, true);
      clear(tbody);
      [...seen.keys()].sort((a, b) => a - b).forEach((k) => tbody.append(h("tr", {}, h("td", {}, NAMES[k]), h("td", { class: "num" }, String(k)), h("td", { class: "num" }, String(k - 2)), h("td", { class: "num" }, `${(k - 2) * 180}°`))));
    }
    root.append(h("div", { class: "controls" }, h("span", {}, "Sides"),
      segmented([3, 4, 5, 6, 7, 8, 9, 10, 11, 12], n, (v) => { n = v; shape(); draw(); }),
      h("label", {}, h("input", { type: "checkbox", id: "l3-jit", onchange: (e) => { jitter = e.target.checked; shape(); draw(); } }), "Irregular")),
    svg, out, h("p", { class: "note" }, "All diagonals start from the green vertex. Visit at least five polygons to fill the data table."), table);
    shape(); draw();
  }

  // ------------------------------------------------------------ turtle walk

  function walk(root) {
    let n = 6, stop = () => {};
    const svg = s("svg", { viewBox: "0 0 600 420", role: "img", "aria-label": "Turtle walking around a polygon" });
    const out = h("div", { class: "readout" });
    const total = stat("Total turned:", "0°");
    function base() {
      clear(svg);
      const pts = regularPolygon(n, 300, 215, 160, 90 + 180 / n);
      svg.append(s("polygon", { points: ptsStr(pts), fill: "var(--shape-a-soft)", stroke: "var(--shape-a)", "stroke-width": 3 }));
      return pts;
    }
    function play() {
      stop();
      const pts = base();
      const ext = 360 / n, inner = 180 - ext;
      clear(out); out.append(total.el, stat("Exterior angle:", `${fmt(ext, 1)}°`).el, stat("Interior angle:", `${fmt(inner, 1)}°`).el, stat("Interior + exterior:", "180°").el);
      const arcs = s("g"); svg.append(arcs);
      const turtle = s("polygon", { points: "-12,-9 14,0 -12,9", fill: "var(--accent)" });
      svg.append(turtle);
      const legs = n;
      stop = animate(900 * legs, (t) => {
        const u = t * legs, i = Math.min(legs - 1, Math.floor(u)), f = u - i;
        const a = pts[i], b = pts[(i + 1) % n];
        const head = Math.atan2(b.y - a.y, b.x - a.x);
        const moveF = Math.min(1, f / 0.7);
        const x = a.x + (b.x - a.x) * moveF, y = a.y + (b.y - a.y) * moveF;
        let deg = (head * 180) / Math.PI;
        if (f > 0.7) deg += ((f - 0.7) / 0.3) * ext; // clockwise on screen
        turtle.setAttribute("transform", `translate(${x},${y}) rotate(${deg})`);
        const turnsDone = i + (f > 0.7 ? (f - 0.7) / 0.3 : 0);
        total.set(`${fmt(turnsDone * ext, 0)}°`);
        clear(arcs);
        for (let k = 0; k < Math.floor(turnsDone + 1e-9); k++) {
          const v = pts[(k + 1) % n], prev = pts[k];
          const dir = Math.atan2(v.y - prev.y, v.x - prev.x);
          const ex = { x: v.x + 70 * Math.cos(dir), y: v.y + 70 * Math.sin(dir) };
          arcs.append(s("line", { x1: v.x, y1: v.y, x2: ex.x, y2: ex.y, stroke: "var(--shape-b)", "stroke-width": 2, "stroke-dasharray": "5 4" }));
          const r = 26, a1 = dir, a2 = dir + toRad(ext);
          arcs.append(s("path", { d: `M${v.x},${v.y} L${v.x + r * Math.cos(a1)},${v.y + r * Math.sin(a1)} A${r},${r} 0 0 1 ${v.x + r * Math.cos(a2)},${v.y + r * Math.sin(a2)} Z`, fill: "var(--shape-b-soft)", stroke: "var(--shape-b)" }));
        }
      }, () => total.set("360° – one full turn!"));
    }
    root.append(h("div", { class: "controls" }, h("span", {}, "Sides"),
      segmented([3, 4, 5, 6, 8, 10, 12], n, (v) => { n = v; stop(); base(); clear(out); }),
      h("button", { class: "btn", type: "button", onclick: play }, "Walk the polygon")),
    svg, out, h("p", { class: "note" }, "The turtle turns through the exterior angle at every corner (orange). Count the total turn."));
    base();
    return () => stop();
  }

  // ------------------------------------------------------------ honeycomb

  function honeycomb(root) {
    let n = 6, k = 3;
    const svg = s("svg", { viewBox: "0 0 600 420", role: "img", "aria-label": "Regular polygons around a point" });
    const out = h("div", { class: "readout" });
    const P = { x: 300, y: 210 }, L = 120;
    function copy(alpha) {
      const ext = 360 / n; let th = alpha; let x = P.x, y = P.y; const pts = [{ x, y }];
      for (let i = 0; i < n - 1; i++) { x += L * Math.cos(toRad(th)); y -= L * Math.sin(toRad(th)); pts.push({ x, y }); th += ext; }
      return pts;
    }
    function draw() {
      clear(svg); clear(out);
      const inner = 180 - 360 / n;
      for (let i = 0; i < k; i++) {
        const over = (i + 1) * inner > 360 + 1e-9;
        svg.append(s("polygon", { points: ptsStr(copy(i * inner)), fill: over ? "var(--shape-b-soft)" : (i % 2 ? "var(--shape-a-soft)" : "var(--accent-soft)"), stroke: over ? "var(--shape-b)" : "var(--shape-a)", "stroke-width": 2.5, "stroke-linejoin": "round" }));
      }
      svg.append(s("circle", { cx: P.x, cy: P.y, r: 6, fill: "var(--ink)" }));
      const used = k * inner, gap = 360 - used;
      out.append(stat("Interior angle:", `${fmt(inner, 1)}°`).el, stat("Copies:", String(k)).el, stat("Angle used:", `${fmt(used, 1)}°`).el,
        gap > 1e-9 ? stat("Gap left:", `${fmt(gap, 1)}°`).el : null);
      if (Math.abs(gap) < 1e-9) out.append(pill(true, "Fits exactly – no gaps!", ""));
      else if (gap < 0) out.append(pill(false, "", "Overlap – it does not fit"));
    }
    root.append(h("div", { class: "controls" }, h("span", {}, "Polygon"),
      segmented([3, 4, 5, 6, 8, 10], n, (v) => { n = v; k = 0; draw(); }, (v) => NAMES[v]),
      h("button", { class: "btn", type: "button", onclick: () => { if (k < 7) { k++; draw(); } } }, "Add a copy"),
      h("button", { class: "btn ghost", type: "button", onclick: () => { k = 0; draw(); } }, "Clear")),
    svg, out, h("p", { class: "note" }, "Keep adding copies around the black point. Which polygons close the circle exactly?"));
    draw();
  }

  // ------------------------------------------------------------ lesson

  Sim.register({
    id: "lesson3", unit: "A", num: 3, letter: "C", title: "Angles of Polygons", simName: "Angle Sum Machine",
    comps: ["A5", "A6", "M5", "T1"], cycles: "C3,M2 – C3,M5", deped: "DepEd Week 3",
    bigQuestion: "Why do honeycombs use hexagons?",
    mission: [
      "Triangle Split: visit at least five polygons and complete the data table. What pattern links n and the sum?",
      "Tick “Irregular.” Does the sum change when the polygon is not regular?",
      "Turtle Walk: walk three different polygons. What is the total turn every time?",
      "Honeycomb Test: which regular polygons fit around a point with no gaps? Explain using their interior angles.",
    ],
    discovery: "A polygon with n sides splits into n − 2 triangles, so its interior angles add up to (n − 2) × 180°. At each corner, the exterior angle and the interior angle form a linear pair (180°). Walking around any convex polygon, you turn exactly once: the exterior angles add up to 360°, so each exterior angle of a regular polygon is 360° ÷ n. Hexagons tile because 3 × 120° = 360°; pentagons cannot because 108° does not divide 360° evenly.",
    mount(stage) {
      const body = h("div", { class: "stage-body" });
      let stopper = null;
      const views = [triSplit, walk, honeycomb];
      const t = tabs(["Triangle Split", "Turtle Walk", "Honeycomb Test"], (i) => { if (stopper) stopper(); clear(body); stopper = views[i](body) || null; });
      stage.append(t.el, body);
      triSplit(body);
      return () => { if (stopper) stopper(); };
    },
    check() {
      const kind = randInt(0, 5);
      const regs = [3, 4, 5, 6, 8, 9, 10, 12];
      if (kind === 0) { const n = randInt(5, 12); return { q: `What is the sum of the interior angles of a ${n}-sided polygon?`, answer: (n - 2) * 180, unit: "°", explain: `(${n} − 2) × 180° = ${(n - 2) * 180}°.` }; }
      if (kind === 1) { const n = pick(regs); return { q: `What is the measure of each interior angle of a regular ${NAMES[n]}?`, answer: 180 - 360 / n, unit: "°", explain: `Exterior = 360° ÷ ${n} = ${fmt(360 / n, 1)}°, so interior = 180° − ${fmt(360 / n, 1)}° = ${fmt(180 - 360 / n, 1)}°.` }; }
      if (kind === 2) { const n = pick([5, 6, 8, 9, 10, 12, 15, 18, 20, 24]); return { q: `Each exterior angle of a regular polygon is ${fmt(360 / n, 1)}°. How many sides does it have?`, answer: n, explain: `360° ÷ ${fmt(360 / n, 1)}° = ${n}.` }; }
      if (kind === 3) { const n = pick([5, 6, 8, 9, 10, 12]); const inner = 180 - 360 / n; return { q: `Each interior angle of a regular polygon is ${fmt(inner, 0)}°. How many sides does it have?`, answer: n, explain: `Exterior = 180° − ${fmt(inner, 0)}° = ${fmt(360 / n, 0)}°; 360° ÷ ${fmt(360 / n, 0)}° = ${n}.` }; }
      if (kind === 4) {
        const n = pick([5, 6]); const sum = (n - 2) * 180;
        const known = Array.from({ length: n - 1 }, () => randInt(95, 135));
        const miss = sum - known.reduce((a, b) => a + b, 0);
        if (miss <= 40 || miss >= 175) return this.check();
        return { q: `A ${NAMES[n]} has angles ${known.map((a) => a + "°").join(", ")}, and x. Find x.`, answer: miss, unit: "°", explain: `The sum is ${sum}°, so x = ${sum} − ${sum - miss} = ${miss}.` };
      }
      const yes = Math.random() < 0.5;
      const inner = yes ? pick([60, 90, 108, 120, 135, 140, 144, 150, 156]) : pick([100, 110, 130, 125, 145]);
      return { q: `Can a regular polygon have interior angles of ${inner}° each?`, choices: ["Yes", "No"], answer: yes ? "Yes" : "No", explain: `Exterior = ${180 - inner}°, and 360 ÷ ${180 - inner} = ${fmt(360 / (180 - inner), 2)}${yes ? " – a whole number of sides." : " – not a whole number, so no."}` };
    },
  });
})();
