/* Lesson 2 · B. Angle Pairs and Classifying Polygons – Angle Pair Lab */
(function () {
  "use strict";
  const { h, s, clear, randInt, pick, shuffle, fmt, interiorAngles, isSimple, regularPolygon, draggable, tabs, segmented, stat, pill, toRad, toDeg } = Sim;

  const NAMES = { 3: "triangle", 4: "quadrilateral", 5: "pentagon", 6: "hexagon", 7: "heptagon", 8: "octagon", 9: "nonagon", 10: "decagon" };
  const norm = (a) => ((a % 360) + 360) % 360;
  const dirPt = (c, deg, r) => ({ x: c.x + r * Math.cos(toRad(deg)), y: c.y - r * Math.sin(toRad(deg)) });
  // Counter-clockwise (as seen on screen) wedge from angle a to angle b, in degrees.
  function wedge(c, r, a, b) {
    const span = norm(b - a);
    const p = dirPt(c, a, r), q = dirPt(c, a + span, r);
    return `M${c.x},${c.y} L${p.x},${p.y} A${r},${r} 0 ${span > 180 ? 1 : 0} 0 ${q.x},${q.y} Z`;
  }
  const angleOf = (c, p) => norm(toDeg(Math.atan2(-(p.y - c.y), p.x - c.x)));

  // ------------------------------------------------------------ intersecting lines

  function lines(root) {
    const c = { x: 300, y: 205 };
    let t1 = 20, t2 = 75, show = "all";
    const svg = s("svg", { viewBox: "0 0 600 410", role: "img", "aria-label": "Two intersecting lines" });
    const g = s("g"); svg.append(g);
    const out = h("div", { class: "readout" });
    const COLORS = ["var(--shape-a)", "var(--shape-b)", "var(--shape-a)", "var(--shape-b)"];
    const FILLS = ["var(--shape-a-soft)", "var(--shape-b-soft)", "var(--shape-a-soft)", "var(--shape-b-soft)"];

    function draw() {
      clear(g); clear(out);
      const rays = [t1, t2, t1 + 180, t2 + 180].map(norm).sort((a, b) => a - b);
      const meas = rays.map((r, i) => norm(rays[(i + 1) % 4] - r));
      const highlight = (i) => show === "all" || (show === "vertical" && (i === 0 || i === 2)) || (show === "linear" && (i === 0 || i === 1));
      rays.forEach((r, i) => {
        const on = highlight(i);
        g.append(s("path", { d: wedge(c, 62 + (i % 2) * 8, r, rays[(i + 1) % 4]), fill: on ? FILLS[i] : "transparent", stroke: on ? COLORS[i] : "none", "stroke-width": 1.5 }));
        const mid = dirPt(c, r + meas[i] / 2, 100);
        g.append(s("text", { x: mid.x, y: mid.y + 5, "text-anchor": "middle", class: "svg-text", "font-weight": on ? 700 : 400 }, `∠${i + 1} = ${fmt(meas[i], 0)}°`));
      });
      [t1, t2].forEach((t, k) => {
        const a = dirPt(c, t, 230), b = dirPt(c, t + 180, 230);
        g.append(s("line", { x1: a.x, y1: a.y, x2: b.x, y2: b.y, stroke: "var(--ink)", "stroke-width": 3 }));
        const hp = dirPt(c, t, 175);
        const hd = s("circle", { cx: hp.x, cy: hp.y, r: 12, class: "handle", "aria-label": `Rotate line ${k + 1}` });
        draggable(svg, hd, (p) => { if (k === 0) t1 = angleOf(c, p); else t2 = angleOf(c, p); draw(); });
        g.append(hd);
      });
      g.append(s("circle", { cx: c.x, cy: c.y, r: 4, fill: "var(--ink)" }));
      out.append(stat("∠1 + ∠2 =", `${fmt(meas[0] + meas[1], 0)}°`).el, stat("∠1 vs ∠3:", `${fmt(meas[0], 0)}° and ${fmt(meas[2], 0)}°`).el,
        stat("All four:", `${fmt(meas.reduce((a, b) => a + b, 0), 0)}°`).el);
    }
    root.append(h("div", { class: "controls" }, h("span", {}, "Highlight"),
      segmented(["all", "vertical", "linear"], show, (v) => { show = v; draw(); }, (v) => ({ all: "All angles", vertical: "Vertical pair", linear: "Linear pair" })[v])),
    svg, out, h("p", { class: "note" }, "Drag the white handles to rotate each line."));
    draw();
  }

  // ------------------------------------------------------------ complement / supplement

  function split(root) {
    const c = { x: 300, y: 330 };
    let total = 90, phi = 35;
    const svg = s("svg", { viewBox: "0 0 600 360", role: "img", "aria-label": "An angle split by a ray" });
    const g = s("g"); svg.append(g);
    const out = h("div", { class: "readout" });
    function draw() {
      clear(g); clear(out);
      phi = Math.min(total - 1, Math.max(1, phi));
      g.append(s("path", { d: wedge(c, 80, 0, phi), fill: "var(--shape-a-soft)", stroke: "var(--shape-a)" }));
      g.append(s("path", { d: wedge(c, 95, phi, total), fill: "var(--shape-b-soft)", stroke: "var(--shape-b)" }));
      [0, total].forEach((t) => { const p = dirPt(c, t, 260); g.append(s("line", { x1: c.x, y1: c.y, x2: p.x, y2: p.y, stroke: "var(--ink)", "stroke-width": 3 })); });
      const rp = dirPt(c, phi, 260);
      g.append(s("line", { x1: c.x, y1: c.y, x2: rp.x, y2: rp.y, stroke: "var(--accent)", "stroke-width": 3 }));
      const ma = dirPt(c, phi / 2, 125), mb = dirPt(c, (phi + total) / 2, 140);
      g.append(s("text", { x: ma.x, y: ma.y, "text-anchor": "middle", class: "svg-text", fill: "var(--shape-a)" }, `a = ${fmt(phi, 0)}°`));
      g.append(s("text", { x: mb.x, y: mb.y, "text-anchor": "middle", class: "svg-text", fill: "var(--shape-b)" }, `b = ${fmt(total - phi, 0)}°`));
      const hp = dirPt(c, phi, 220);
      const hd = s("circle", { cx: hp.x, cy: hp.y, r: 12, class: "handle", "aria-label": "Move the middle ray" });
      draggable(svg, hd, (p) => { let a = angleOf(c, p); if (a > 270) a = 0; phi = Math.round(a); draw(); });
      g.append(hd);
      out.append(stat("a + b =", `${total}°`).el, h("span", { class: "pill yes" }, total === 90 ? "Complementary" : "Supplementary (a linear pair)"));
    }
    root.append(h("div", { class: "controls" }, h("span", {}, "Whole angle"),
      segmented([90, 180], total, (v) => { total = v; draw(); }, (v) => `${v}°`)), svg, out,
    h("p", { class: "note" }, "Drag the green ray. Watch a and b change – does their sum change?"));
    draw();
  }

  // ------------------------------------------------------------ classify

  function inside(pt, poly) {
    let ins = false;
    for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
      const a = poly[i], b = poly[j];
      if ((a.y > pt.y) !== (b.y > pt.y) && pt.x < ((b.x - a.x) * (pt.y - a.y)) / (b.y - a.y) + a.x) ins = !ins;
    }
    return ins;
  }

  function classify(root) {
    let n = 5, pts = regularPolygon(5, 300, 210, 150), diags = false;
    const svg = s("svg", { viewBox: "0 0 600 420", role: "img", "aria-label": "Polygon to classify" });
    const g = s("g"); svg.append(g);
    const out = h("div", { class: "readout" });
    function draw() {
      clear(g); clear(out);
      const simple = isSimple(pts);
      const ang = interiorAngles(pts);
      g.append(s("polygon", { points: pts.map((p) => `${p.x},${p.y}`).join(" "), fill: "var(--shape-a-soft)", stroke: "var(--shape-a)", "stroke-width": 3, "stroke-linejoin": "round" }));
      let outside = 0;
      if (diags && simple) {
        for (let i = 0; i < n; i++) for (let j = i + 2; j < n; j++) {
          if (i === 0 && j === n - 1) continue;
          const mid = { x: (pts[i].x + pts[j].x) / 2, y: (pts[i].y + pts[j].y) / 2 };
          const ins = inside(mid, pts);
          if (!ins) outside++;
          g.append(s("line", { x1: pts[i].x, y1: pts[i].y, x2: pts[j].x, y2: pts[j].y, stroke: ins ? "var(--muted)" : "var(--shape-b)", "stroke-width": ins ? 1.5 : 2.5, "stroke-dasharray": ins ? "" : "6 5" }));
        }
      }
      pts.forEach((p, i) => {
        if (simple) {
          const reflex = ang[i] > 180;
          g.append(s("text", { x: p.x, y: p.y - 18, "text-anchor": "middle", class: "svg-text", fill: reflex ? "var(--shape-b)" : "var(--ink)", "font-weight": reflex ? 700 : 400 }, `${fmt(ang[i], 0)}°`));
        }
        const d = s("circle", { cx: p.x, cy: p.y, r: 11, class: "handle", "aria-label": `Vertex ${i + 1}` });
        draggable(svg, d, (q) => { pts[i] = { x: Math.min(585, Math.max(15, q.x)), y: Math.min(405, Math.max(25, q.y)) }; draw(); });
        g.append(d);
      });
      if (!simple) { out.append(pill(false, "", "Sides cross – not a polygon")); return; }
      const convex = ang.every((a) => a < 180);
      const sides = pts.map((p, i) => Math.hypot(p.x - pts[(i + 1) % n].x, p.y - pts[(i + 1) % n].y));
      const regular = Math.max(...sides) - Math.min(...sides) < 4 && Math.max(...ang) - Math.min(...ang) < 1.5;
      out.append(stat("Name:", NAMES[n]).el, pill(regular, "Regular", "Irregular"), pill(convex, "Convex", "Non-convex"));
      if (diags) out.append(stat("Diagonals outside:", String(outside)).el);
    }
    root.append(h("div", { class: "controls" }, h("span", {}, "Sides"),
      segmented([3, 4, 5, 6, 7, 8, 9, 10], n, (v) => { n = v; pts = regularPolygon(n, 300, 210, 150); draw(); }),
      h("label", {}, h("input", { type: "checkbox", id: "l2-diag", onchange: (e) => { diags = e.target.checked; draw(); } }), "Show diagonals")),
    svg, out, h("p", { class: "note" }, "Push a vertex toward the centre until an angle turns red (greater than 180°)."));
    draw();
  }

  // ------------------------------------------------------------ lesson

  Sim.register({
    id: "lesson2", unit: "A", num: 2, letter: "B", title: "Angle Pairs and Classifying Polygons", simName: "Angle Pair Lab",
    comps: ["A3", "A4", "M3", "M4"], cycles: "C2,M2 – C3,M1", deped: "DepEd Week 2",
    bigQuestion: "What angle pairs do open scissors and clock hands make?",
    mission: [
      "Intersecting Lines: rotate both lines. Which angles are always equal? Which pairs always add to 180°?",
      "Split: drag the ray inside a 90° angle, then a 180° angle. What stays the same?",
      "Classify: build a pentagon, then push one vertex inward. When does it become non-convex?",
      "Turn on the diagonals. What happens to a diagonal when the polygon is non-convex?",
    ],
    discovery: "Vertical angles are always equal, and the two angles of a linear pair always add up to 180°. Complementary angles add up to 90°; supplementary angles add up to 180°. A polygon is non-convex when one of its interior angles is greater than 180° – then at least one diagonal lies outside the figure.",
    mount(stage) {
      const body = h("div", { class: "stage-body" });
      const views = [lines, split, classify];
      const t = tabs(["Intersecting Lines", "Split an Angle", "Classify Polygons"], (i) => { clear(body); views[i](body); });
      stage.append(t.el, body);
      lines(body);
    },
    check() {
      const kind = randInt(0, 5);
      if (kind === 0) { const a = randInt(8, 82); return { q: `What is the complement of ${a}°?`, answer: 90 - a, unit: "°", explain: `90 − ${a} = ${90 - a}.` }; }
      if (kind === 1) { const a = randInt(15, 165); return { q: `What is the supplement of ${a}°?`, answer: 180 - a, unit: "°", explain: `180 − ${a} = ${180 - a}.` }; }
      if (kind === 2) {
        const a = randInt(25, 155); const ask = pick(["vertical", "adjacent"]);
        return { q: `Two lines intersect. One angle measures ${a}°. What is the measure of the angle ${ask === "vertical" ? "vertical to it" : "next to it (its linear pair)"}?`, answer: ask === "vertical" ? a : 180 - a, unit: "°", explain: ask === "vertical" ? "Vertical angles are equal." : `A linear pair adds to 180°: 180 − ${a} = ${180 - a}.` };
      }
      if (kind === 3) {
        const a = randInt(30, 70), b = randInt(40, 80);
        return { q: `Three angles together form a straight line: ${a}°, ${b}°, and x. Find x.`, answer: 180 - a - b, unit: "°", explain: `180 − ${a} − ${b} = ${180 - a - b}.` };
      }
      if (kind === 4) {
        const a = randInt(80, 130), b = randInt(60, 100), c = randInt(60, 100);
        return { q: `Four angles meet at a point: ${a}°, ${b}°, ${c}°, and x. Find x.`, answer: 360 - a - b - c, unit: "°", explain: `Angles around a point add to 360°: 360 − ${a + b + c} = ${360 - a - b - c}.` };
      }
      const reflex = Math.random() < 0.5;
      const big = reflex ? randInt(190, 230) : randInt(100, 170);
      return { q: `A pentagon has one interior angle of ${big}°, and all its other angles are less than 180°. Is it convex or non-convex?`, choices: ["Convex", "Non-convex"], answer: reflex ? "Non-convex" : "Convex", explain: reflex ? "An angle greater than 180° makes a polygon non-convex." : "All interior angles are less than 180°, so it is convex." };
    },
  });
})();
