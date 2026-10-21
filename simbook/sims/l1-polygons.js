/* Lesson 1 · A. Drawing Polygons – Polygon Studio */
(function () {
  "use strict";
  const { h, s, clear, randInt, pick, shuffle, fmt, dist, interiorAngles, isSimple, regularPolygon, draggable, tabs, segmented, stat, pill, animate, toRad } = Sim;

  const NAMES = { 3: "triangle", 4: "quadrilateral", 5: "pentagon", 6: "hexagon", 7: "heptagon", 8: "octagon", 9: "nonagon", 10: "decagon" };
  const CM = 40; // SVG units per centimetre

  function centroid(pts) {
    return { x: pts.reduce((a, p) => a + p.x, 0) / pts.length, y: pts.reduce((a, p) => a + p.y, 0) / pts.length };
  }

  // ------------------------------------------------------------ Explore

  function explore(root) {
    let n = 6;
    let pts = regularPolygon(n, 300, 215, 150);
    const svg = s("svg", { viewBox: "0 0 600 430", role: "img", "aria-label": "Polygon with draggable vertices" });
    const layer = s("g");
    svg.append(layer);
    const chips = h("div", { class: "readout" });
    const name = stat("Polygon:", "");
    const controls = h("div", { class: "controls" },
      h("span", {}, "Sides"),
      segmented([3, 4, 5, 6, 7, 8, 9, 10], n, (v) => { n = v; pts = regularPolygon(n, 300, 215, 150); draw(); }),
      h("button", { class: "btn ghost", type: "button", onclick: () => { pts = regularPolygon(n, 300, 215, 150); draw(); } }, "Make it regular"),
      h("button", { class: "btn ghost", type: "button", onclick: () => { pts = pts.map((p) => ({ x: p.x + randInt(-45, 45), y: p.y + randInt(-45, 45) })); draw(); } }, "Mess it up"));

    function draw() {
      clear(layer); clear(chips);
      const simple = isSimple(pts);
      const sides = pts.map((p, i) => dist(p, pts[(i + 1) % pts.length]) / CM);
      const angles = interiorAngles(pts);
      const c = centroid(pts);
      layer.append(s("polygon", { points: pts.map((p) => `${p.x},${p.y}`).join(" "), fill: simple ? "var(--shape-a-soft)" : "var(--shape-b-soft)", stroke: simple ? "var(--shape-a)" : "var(--shape-b)", "stroke-width": 3, "stroke-linejoin": "round" }));
      pts.forEach((p, i) => {
        const q = pts[(i + 1) % pts.length];
        const mid = { x: (p.x + q.x) / 2, y: (p.y + q.y) / 2 };
        const out = { x: mid.x - c.x, y: mid.y - c.y }; const len = Math.hypot(out.x, out.y) || 1;
        layer.append(s("text", { x: mid.x + (out.x / len) * 20, y: mid.y + (out.y / len) * 20 + 4, "text-anchor": "middle", class: "svg-text" }, `${fmt(sides[i], 1)} cm`));
        const inw = { x: c.x - p.x, y: c.y - p.y }; const l2 = Math.hypot(inw.x, inw.y) || 1;
        if (simple) layer.append(s("text", { x: p.x + (inw.x / l2) * 32, y: p.y + (inw.y / l2) * 32 + 4, "text-anchor": "middle", class: "svg-text", fill: "var(--shape-b)" }, `${fmt(angles[i], 0)}°`));
      });
      pts.forEach((p, i) => {
        const dot = s("circle", { cx: p.x, cy: p.y, r: 11, class: "handle", tabindex: 0, "aria-label": `Vertex ${i + 1}` });
        draggable(svg, dot, (pt) => { pts[i] = { x: Math.min(585, Math.max(15, pt.x)), y: Math.min(415, Math.max(15, pt.y)) }; draw(); });
        layer.append(dot);
      });
      const sidesEqual = Math.max(...sides) - Math.min(...sides) < 0.1;
      const anglesEqual = simple && Math.max(...angles) - Math.min(...angles) < 1.5;
      name.set(NAMES[n]);
      chips.append(name.el, stat("Angle sum:", simple ? `${fmt(angles.reduce((a, b) => a + b, 0), 0)}°` : "—").el);
      if (!simple) { chips.append(pill(false, "", "Sides cross – this is not a polygon")); return; }
      chips.append(pill(sidesEqual, "All sides equal", "Sides not all equal"), pill(anglesEqual, "All angles equal", "Angles not all equal"),
        pill(sidesEqual && anglesEqual, "REGULAR", "IRREGULAR"));
    }
    draw();
    root.append(controls, svg, chips, h("p", { class: "note" }, "Drag any vertex. Side lengths are in centimetres; angles are interior angles."));
  }

  // ------------------------------------------------------------ Build it

  const TARGETS = [
    { n: 3, side: 5, label: "Equilateral triangle, sides of 5 cm" },
    { n: 5, side: 3, label: "Regular pentagon, sides of 3 cm" },
    { n: 6, side: 4, label: "Regular hexagon, sides of 4 cm" },
    { n: 8, side: 2.5, label: "Regular octagon, sides of 2.5 cm" },
    { n: 10, side: 2, label: "Regular decagon, sides of 2 cm" },
  ];

  function build(root) {
    const done = new Set();
    const side = h("input", { type: "number", id: "l1-side", min: 1, max: 6, step: 0.5, value: 3 });
    const angle = h("input", { type: "number", id: "l1-angle", min: 30, max: 175, step: 1, value: 100 });
    const count = h("input", { type: "number", id: "l1-count", min: 3, max: 12, step: 1, value: 5 });
    const svg = s("svg", { viewBox: "0 0 600 430", role: "img", "aria-label": "Turtle drawing of a polygon" });
    const out = h("div", { class: "readout" });
    const list = h("ol", {});
    let stop = () => {};

    function path() {
      const L = Number(side.value) * CM, A = Number(angle.value), k = Math.round(Number(count.value));
      const ext = 180 - A;
      let x = 0, y = 0, th = 0;
      const p = [{ x, y }];
      for (let i = 0; i < k; i++) { x += L * Math.cos(toRad(th)); y -= L * Math.sin(toRad(th)); p.push({ x, y }); th += ext; }
      return { p, ext, k, A, L };
    }

    function run() {
      stop();
      const { p, ext, k, A } = path();
      const xs = p.map((q) => q.x), ys = p.map((q) => q.y);
      const pad = 40;
      const minX = Math.min(...xs) - pad, minY = Math.min(...ys) - pad;
      const w = Math.max(Math.max(...xs) - minX + pad, 300), hgt = Math.max(Math.max(...ys) - minY + pad, 220);
      svg.setAttribute("viewBox", `${minX} ${minY} ${w} ${hgt}`);
      clear(svg);
      const line = s("polyline", { fill: "none", stroke: "var(--shape-a)", "stroke-width": Math.max(2, w / 200), "stroke-linejoin": "round", "stroke-linecap": "round" });
      svg.append(s("circle", { cx: 0, cy: 0, r: w / 90, fill: "var(--accent)" }), line);
      stop = animate(250 * k, (t) => {
        const upto = t * k, whole = Math.floor(upto), part = upto - whole;
        const shown = p.slice(0, whole + 1);
        if (whole < k) { const a = p[whole], b = p[whole + 1]; shown.push({ x: a.x + (b.x - a.x) * part, y: a.y + (b.y - a.y) * part }); }
        line.setAttribute("points", shown.map((q) => `${q.x},${q.y}`).join(" "));
      }, () => report(p, ext, k, A));
    }

    function report(p, ext, k, A) {
      clear(out);
      const gap = dist(p[0], p[p.length - 1]) / CM;
      const closed = gap < 0.05;
      out.append(stat("Turn at each corner:", `${fmt(ext, 1)}°`).el, stat("Gap to start:", `${fmt(gap, 2)} cm`).el,
        pill(closed, "Closed – it is a polygon!", "Not closed – check the angle or the number of sides"));
      if (closed) {
        TARGETS.forEach((t, i) => { if (t.n === k && Math.abs(t.side - Number(side.value)) < 1e-6) done.add(i); });
        renderTargets();
        out.append(h("span", { class: "stat" }, `Interior angle used: `, h("b", {}, `${fmt(A, 1)}°`)));
      }
    }

    function renderTargets() {
      clear(list);
      TARGETS.forEach((t, i) => list.append(h("li", {}, t.label, done.has(i) ? h("span", { class: "pill yes" }, " ✓ built") : null)));
    }

    renderTargets();
    root.append(
      h("div", { class: "controls" },
        h("label", { for: "l1-side" }, "Side (cm)", side),
        h("label", { for: "l1-angle" }, "Interior angle (°)", angle),
        h("label", { for: "l1-count" }, "Number of sides", count),
        h("button", { class: "btn", type: "button", onclick: run }, "Draw it")),
      svg, out,
      h("div", { class: "panel" }, h("h2", {}, "Build challenges"), h("p", { class: "note" }, "Find the interior angle that closes each regular polygon. Record it in your notebook."), list));
    run();
    return () => stop();
  }

  // ------------------------------------------------------------ lesson

  Sim.register({
    id: "lesson1", unit: "A", num: 1, letter: "A", title: "Drawing Polygons", simName: "Polygon Studio",
    comps: ["A1", "A2", "M1", "M2"], cycles: "C1,M2 – C2,M1", deped: "DepEd Week 1",
    bigQuestion: "Why do honeycombs use hexagons and stop signs have eight sides?",
    mission: [
      "Explore: choose 5, 6, 8, and 10 sides. Record the interior angle of each regular polygon.",
      "Press “Mess it up,” then drag vertices. When is a polygon regular? When is it irregular?",
      "Try to make a hexagon whose sides are all equal but whose angles are not.",
      "Build it: find the interior angle that closes each regular polygon in the challenge list.",
    ],
    discovery: "A polygon is regular only when ALL its sides and ALL its angles are equal. Each interior angle of a regular polygon grows as the number of sides grows: pentagon 108°, hexagon 120°, octagon 135°, decagon 144°. Using the right angle at every corner makes the last side close exactly.",
    mount(stage) {
      const body = h("div", { class: "stage-body" });
      let stopper = null;
      const t = tabs(["Explore", "Build it"], (i) => { if (stopper) stopper(); clear(body); stopper = i === 0 ? explore(body) : build(body); });
      stage.append(t.el, body);
      explore(body);
      return () => { if (stopper) stopper(); };
    },
    check() {
      const kind = randInt(0, 4);
      if (kind === 0) {
        const n = pick([5, 6, 8, 10]); const a = { 5: 108, 6: 120, 8: 135, 10: 144 }[n];
        return { q: `To draw a regular ${NAMES[n]} with a ruler and protractor, what interior angle do you mark at each vertex?`, answer: a, unit: "°", explain: `A regular ${NAMES[n]} has interior angles of ${a}°.` };
      }
      if (kind === 1) {
        const n = randInt(3, 10);
        const choices = shuffle([NAMES[n], ...shuffle(Object.values(NAMES).filter((x) => x !== NAMES[n])).slice(0, 3)]);
        return { q: `A polygon has ${n} sides. What is it called?`, choices, answer: NAMES[n], explain: `${n} sides → ${NAMES[n]}.` };
      }
      if (kind === 2) {
        const a = randInt(30, 80), b = randInt(30, 80);
        return { q: `You draw triangle ABC with ∠A = ${a}° and ∠B = ${b}°. When you measure ∠C, what should you get?`, answer: 180 - a - b, unit: "°", explain: `The angles of a triangle add up to 180°: 180 − ${a} − ${b} = ${180 - a - b}.` };
      }
      if (kind === 3) {
        const a = 90, b = 90, c = randInt(95, 140);
        return { q: `A quadrilateral has angles of ${a}°, ${b}°, and ${c}°. What is the fourth angle?`, answer: 360 - a - b - c, unit: "°", explain: `The angles of a quadrilateral add up to 360°: 360 − ${a + b + c} = ${360 - a - b - c}.` };
      }
      const regular = Math.random() < 0.5;
      const desc = regular ? "all sides 4 cm and all angles 120°" : pick(["all sides 3 cm, but angles of 100°, 140°, 120°, 100°, 140°, and 120°", "all angles 90°, but sides of 5 cm, 3 cm, 5 cm, and 3 cm", "all angles 120°, but sides of 3 cm, 5 cm, 3 cm, 5 cm, 3 cm, and 5 cm"]);
      return { q: `A polygon has ${desc}. Is it regular or irregular?`, choices: ["Regular", "Irregular"], answer: regular ? "Regular" : "Irregular", explain: regular ? "Equal sides AND equal angles → regular." : "A regular polygon needs BOTH equal sides and equal angles." };
    },
  });
})();
