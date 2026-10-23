/* Lesson 1 · A. Drawing Polygons – Polygon Studio */
(function () {
  "use strict";
  const { h, s, clear, randInt, pick, shuffle, fmt, dist, interiorAngles, isSimple, regularPolygon, tabs, stat, pill, animate, toRad, Spring, flat, unflat, morphRegular, elasticSlider, handleSet } = Sim;

  const NAMES = { 3: "triangle", 4: "quadrilateral", 5: "pentagon", 6: "hexagon", 7: "heptagon", 8: "octagon", 9: "nonagon", 10: "decagon" };
  const CM = 40; // SVG units per centimetre
  const BOUNDS = { x0: 15, x1: 585, y0: 15, y1: 415 };

  function centroid(pts) {
    return { x: pts.reduce((a, p) => a + p.x, 0) / pts.length, y: pts.reduce((a, p) => a + p.y, 0) / pts.length };
  }

  // ------------------------------------------------------------ Explore

  function explore(root) {
    let sidesV = 6;
    let pts = regularPolygon(6, 300, 215, 150);
    const svg = s("svg", { viewBox: "0 0 600 430", role: "img", "aria-label": "Polygon with draggable vertices" });
    const shape = s("g"), handleLayer = s("g");
    svg.append(shape, handleLayer);
    const chips = h("div", { class: "readout" });
    const spring = new Spring(flat(pts), (a) => { pts = unflat(a); draw(); });
    const handles = handleSet(svg, handleLayer, {
      bounds: BOUNDS, label: "Vertex",
      onMove: (i, p) => { spring.stop(); pts[i] = p; spring.value = flat(pts); spring.vel = spring.value.map(() => 0); draw(); },
      onEnd: (i, p) => { const target = pts.slice(); target[i] = p; spring.value = flat(pts); spring.set(flat(target)); },
    });
    const n = () => Math.round(sidesV);
    const slider = elasticSlider({
      id: "l1-sides", label: "Sides", min: 3, max: 10, value: 6, step: 1, format: (v) => fmt(v, 1),
      onInput: (v) => { sidesV = v; spring.jump(flat(morphRegular(v, 300, 215, 150))); },
    });
    const controls = h("div", { class: "controls" }, slider.el,
      h("button", { class: "btn ghost", type: "button", onclick: () => spring.set(flat(regularPolygon(n(), 300, 215, 150))) }, "Make it regular"),
      h("button", { class: "btn ghost", type: "button", onclick: () => spring.set(flat(pts.map((p) => ({ x: Sim.clamp(p.x + randInt(-45, 45), 20, 580), y: Sim.clamp(p.y + randInt(-45, 45), 20, 410) })))) }, "Mess it up"));

    function draw() {
      clear(shape); clear(chips);
      const m = pts.length;
      const simple = isSimple(pts);
      const sides = pts.map((p, i) => dist(p, pts[(i + 1) % m]) / CM);
      const angles = interiorAngles(pts);
      const c = centroid(pts);
      shape.append(s("polygon", { points: pts.map((p) => `${p.x},${p.y}`).join(" "), fill: simple ? "var(--shape-a-soft)" : "var(--shape-b-soft)", stroke: simple ? "var(--shape-a)" : "var(--shape-b)", "stroke-width": 3, "stroke-linejoin": "round" }));
      pts.forEach((p, i) => {
        const q = pts[(i + 1) % m];
        if (sides[i] < 0.3) return; // a vertex that is still growing out of a side
        const mid = { x: (p.x + q.x) / 2, y: (p.y + q.y) / 2 };
        const out = { x: mid.x - c.x, y: mid.y - c.y }; const len = Math.hypot(out.x, out.y) || 1;
        shape.append(s("text", { x: mid.x + (out.x / len) * 20, y: mid.y + (out.y / len) * 20 + 4, "text-anchor": "middle", class: "svg-text" }, `${fmt(sides[i], 1)} cm`));
        const inw = { x: c.x - p.x, y: c.y - p.y }; const l2 = Math.hypot(inw.x, inw.y) || 1;
        if (simple) shape.append(s("text", { x: p.x + (inw.x / l2) * 32, y: p.y + (inw.y / l2) * 32 + 4, "text-anchor": "middle", class: "svg-text", fill: "var(--shape-b)" }, `${fmt(angles[i], 0)}°`));
      });
      handles.sync(pts);
      const settled = Math.abs(sidesV - Math.round(sidesV)) < 0.02;
      chips.append(stat("Polygon:", settled ? NAMES[m] : `between ${NAMES[Math.floor(sidesV)]} and ${NAMES[Math.ceil(sidesV)] || ""}`).el,
        stat("Angle sum:", simple ? `${fmt(angles.reduce((a, b) => a + b, 0), 0)}°` : "—").el);
      if (!simple) { chips.append(pill(false, "", "Sides cross – this is not a polygon")); return; }
      if (!settled) return;
      const sidesEqual = Math.max(...sides) - Math.min(...sides) < 0.1;
      const anglesEqual = Math.max(...angles) - Math.min(...angles) < 1.5;
      chips.append(pill(sidesEqual, "All sides equal", "Sides not all equal"), pill(anglesEqual, "All angles equal", "Angles not all equal"),
        pill(sidesEqual && anglesEqual, "REGULAR", "IRREGULAR"));
    }
    draw();
    root.append(controls, svg, chips, h("p", { class: "note" }, "Drag the Sides slider and watch a new vertex grow out of a side. Drag any vertex – pull it off the edge and it springs back."));
    return () => spring.stop();
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
    const vals = { side: 3, angle: 100, count: 5 };
    const svg = s("svg", { viewBox: "0 0 600 430", role: "img", "aria-label": "Pen drawing of a polygon" });
    const out = h("div", { class: "readout" });
    const list = h("ol", {});
    let stopAnim = () => {};
    // The view box eases toward the drawing's size, so the picture never jumps.
    let box = [-60, -300, 520, 360];
    const boxSpring = new Spring(box, (b) => { box = b; svg.setAttribute("viewBox", b.join(" ")); }, { stiffness: 120, damping: 20 });

    function path() {
      const L = vals.side * CM, A = vals.angle, k = Math.round(vals.count);
      const ext = 180 - A;
      let x = 0, y = 0, th = 0;
      const p = [{ x, y }];
      for (let i = 0; i < k; i++) { x += L * Math.cos(toRad(th)); y -= L * Math.sin(toRad(th)); p.push({ x, y }); th += ext; }
      return { p, ext, k, A };
    }

    const line = s("polyline", { fill: "none", stroke: "var(--shape-a)", "stroke-width": 4, "stroke-linejoin": "round", "stroke-linecap": "round" });
    const gapLine = s("line", { stroke: "var(--shape-b)", "stroke-width": 2, "stroke-dasharray": "6 5" });
    const start = s("circle", { cx: 0, cy: 0, r: 6, fill: "var(--accent)" });
    svg.append(gapLine, line, start);

    function render(partial) {
      const { p, ext, k, A } = path();
      const xs = p.map((q) => q.x), ys = p.map((q) => q.y), pad = 50;
      const minX = Math.min(...xs) - pad, minY = Math.min(...ys) - pad;
      boxSpring.set([minX, minY, Math.max(Math.max(...xs) - minX + pad, 320), Math.max(Math.max(...ys) - minY + pad, 240)]);
      const shown = partial ? partial(p) : p;
      line.setAttribute("points", shown.map((q) => `${q.x},${q.y}`).join(" "));
      const end = shown[shown.length - 1];
      gapLine.setAttribute("x1", end.x); gapLine.setAttribute("y1", end.y); gapLine.setAttribute("x2", 0); gapLine.setAttribute("y2", 0);
      if (!partial) report(p, ext, k, A);
    }

    function report(p, ext, k, A) {
      clear(out);
      const gap = dist(p[0], p[p.length - 1]) / CM;
      const closed = gap < 0.05;
      out.append(stat("Turn at each corner:", `${fmt(ext, 1)}°`).el, stat("Gap to start:", `${fmt(gap, 2)} cm`).el,
        pill(closed, "Closed – it is a polygon!", "Not closed – adjust the angle"));
      if (closed) {
        TARGETS.forEach((t, i) => { if (t.n === k && Math.abs(t.side - vals.side) < 0.05) done.add(i); });
        renderTargets();
      }
    }

    function replay() {
      stopAnim();
      const k = Math.round(vals.count);
      stopAnim = animate(260 * k, (t) => render((p) => {
        const upto = t * k, whole = Math.floor(upto), part = upto - whole;
        const shown = p.slice(0, whole + 1);
        if (whole < k) { const a = p[whole], b = p[whole + 1]; shown.push({ x: a.x + (b.x - a.x) * part, y: a.y + (b.y - a.y) * part }); }
        return shown;
      }), () => render());
    }

    function renderTargets() {
      clear(list);
      TARGETS.forEach((t, i) => list.append(h("li", {}, t.label, done.has(i) ? h("span", { class: "pill yes" }, " ✓ built") : null)));
    }

    const live = (key) => (v) => { vals[key] = v; stopAnim(); render(); };
    renderTargets();
    root.append(
      h("div", { class: "controls" },
        elasticSlider({ id: "l1-side", label: "Side (cm)", min: 1, max: 6, value: 3, step: 0.5, format: (v) => fmt(v, 1), onInput: live("side") }).el,
        elasticSlider({ id: "l1-angle", label: "Interior angle", min: 30, max: 175, value: 100, step: 1, format: (v) => `${fmt(v, 1)}°`, onInput: live("angle") }).el,
        elasticSlider({ id: "l1-count", label: "Sides", min: 3, max: 12, value: 5, step: 1, format: (v) => fmt(Math.round(v), 0), onInput: live("count") }).el,
        h("button", { class: "btn", type: "button", onclick: replay }, "Watch it draw")),
      svg, out,
      h("div", { class: "panel" }, h("h2", {}, "Build challenges"), h("p", { class: "note" }, "Slide the interior angle until the dashed gap disappears. Record each angle in your notebook."), list));
    render();
    return () => { stopAnim(); boxSpring.stop(); };
  }

  // ------------------------------------------------------------ lesson

  Sim.register({
    id: "lesson1", unit: "A", num: 1, letter: "A", title: "Drawing Polygons", simName: "Polygon Studio",
    comps: ["A1", "A2", "M1", "M2"], cycles: "C1,M2 – C2,M1", deped: "DepEd Week 1",
    bigQuestion: "Why do honeycombs use hexagons and stop signs have eight sides?",
    mission: [
      "Explore: slide the Sides slider to 5, 6, 8, and 10. Record the interior angle of each regular polygon.",
      "Press “Mess it up,” then drag vertices. When is a polygon regular? When is it irregular?",
      "Try to make a hexagon whose sides are all equal but whose angles are not.",
      "Build it: slide the interior angle until the gap closes for each regular polygon in the challenge list.",
    ],
    discovery: "A polygon is regular only when ALL its sides and ALL its angles are equal. Each interior angle of a regular polygon grows as the number of sides grows: pentagon 108°, hexagon 120°, octagon 135°, decagon 144°. Using the right angle at every corner makes the last side close exactly.",
    mount(stage) {
      const body = h("div", { class: "stage-body" });
      let stopper = null;
      const t = tabs(["Explore", "Build it"], (i) => { if (stopper) stopper(); clear(body); stopper = i === 0 ? explore(body) : build(body); });
      stage.append(t.el, body);
      stopper = explore(body);
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
