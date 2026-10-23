/* Grade 8 · Term 1 · Lesson 9 · I. The Cartesian Plane, Distance, and Midpoint – Barangay Map */
(function () {
  "use strict";
  const { h, s, clear, randInt, pick, shuffle, fmt, tabs, segmented, stat, pill, Spring, clamp, rubber } = Sim;

  const fm = (x, d = 2) => fmt(x, d).replace("-", "−");
  const pt = (x, y) => `(${fm(x)}, ${fm(y)})`;
  const N = 7, U = 34, O = 280; // grid −7..7, 34 px per unit, origin at (280, 280)
  const PX = (x) => O + x * U, PY = (y) => O - y * U;
  const M_PER_UNIT = 50;

  const PLACES = [
    { key: "gate", name: "Gate", x: -3, y: -2, color: "var(--shape-b)" },
    { key: "canteen", name: "Canteen", x: 3, y: 6, color: "var(--gold)" },
    { key: "chapel", name: "Chapel", x: -5, y: 4, color: "var(--purple)" },
    { key: "court", name: "Court", x: 4, y: -3, color: "var(--shape-a)" },
    { key: "hall", name: "Barangay Hall", x: 0, y: 0, color: "var(--accent)" },
  ];
  const place = (k) => PLACES.find((p) => p.key === k);

  function where(x, y) {
    if (x === 0 && y === 0) return "the origin";
    if (x === 0) return "on the y-axis";
    if (y === 0) return "on the x-axis";
    return x > 0 ? (y > 0 ? "Quadrant I" : "Quadrant IV") : (y > 0 ? "Quadrant II" : "Quadrant III");
  }

  const whereIn = (x, y) => (x && y ? "in " : "") + where(x, y);

  /** The barangay map with the coordinate plane on top. Returns layers to draw on. */
  function makePlane(label, { places = true } = {}) {
    const svg = s("svg", { viewBox: "0 0 560 560", role: "img", "aria-label": label, style: "max-width:620px;margin:0 auto" });
    const base = s("g"), dyn = s("g"), top = s("g");
    svg.append(base, dyn, top);
    // stylized barangay: a park, a creek, and two streets
    base.append(s("rect", { x: PX(-7), y: PY(7), width: 14 * U, height: 14 * U, fill: "var(--paper)" }),
      s("rect", { x: PX(-7), y: PY(-3.6), width: 3.2 * U, height: 3.4 * U, rx: 10, fill: "var(--accent-soft)" }),
      s("path", { d: `M${PX(1.5)},${PY(7)} C${PX(2.6)},${PY(4)} ${PX(6.2)},${PY(3.5)} ${PX(7)},${PY(2.6)}`, fill: "none", stroke: "var(--shape-a-soft)", "stroke-width": 16, "stroke-linecap": "round" }),
      s("line", { x1: PX(-7), y1: PY(-1.5), x2: PX(7), y2: PY(-1.5), stroke: "var(--gold-soft)", "stroke-width": 18 }),
      s("line", { x1: PX(-1.5), y1: PY(-7), x2: PX(-1.5), y2: PY(7), stroke: "var(--gold-soft)", "stroke-width": 18 }),
      s("text", { x: PX(5.6), y: PY(-1.5) + 5, "text-anchor": "middle", class: "svg-label", "font-size": 13 }, "Rizal St."),
      s("text", { x: PX(-6.1), y: PY(-6.2), class: "svg-label", "font-size": 13 }, "Park"));
    for (let k = -N; k <= N; k++) {
      base.append(s("line", { x1: PX(k), y1: PY(-N), x2: PX(k), y2: PY(N), stroke: "var(--grid)", "stroke-width": 1.2 }),
        s("line", { x1: PX(-N), y1: PY(k), x2: PX(N), y2: PY(k), stroke: "var(--grid)", "stroke-width": 1.2 }));
      if (k !== 0 && k % 1 === 0) {
        base.append(s("text", { x: PX(k), y: O + 18, "text-anchor": "middle", class: "svg-text", "font-size": 14 }, fm(k)),
          s("text", { x: O - 8, y: PY(k) + 5, "text-anchor": "end", class: "svg-text", "font-size": 14 }, fm(k)));
      }
    }
    base.append(s("line", { x1: PX(-N) - 12, y1: O, x2: PX(N) + 12, y2: O, stroke: "var(--ink)", "stroke-width": 2.2 }),
      s("line", { x1: O, y1: PY(-N) + 12, x2: O, y2: PY(N) - 12, stroke: "var(--ink)", "stroke-width": 2.2 }),
      s("path", { d: `M${PX(N) + 14},${O} l-10,-6 v12 z M${PX(-N) - 14},${O} l10,-6 v12 z M${O},${PY(N) - 14} l-6,10 h12 z M${O},${PY(-N) + 14} l-6,-10 h12 z`, fill: "var(--ink)" }),
      s("text", { x: PX(N) + 8, y: O - 10, class: "svg-text", "font-size": 16, "font-style": "italic" }, "x"),
      s("text", { x: O + 10, y: PY(N) - 4, class: "svg-text", "font-size": 16, "font-style": "italic" }, "y"),
      s("text", { x: PX(5.8), y: PY(5.4), "text-anchor": "middle", class: "svg-label", "font-size": 15, fill: "var(--muted)" }, "I"),
      s("text", { x: PX(-5.8), y: PY(5.4), "text-anchor": "middle", class: "svg-label", "font-size": 15, fill: "var(--muted)" }, "II"),
      s("text", { x: PX(-5.8), y: PY(-5.6), "text-anchor": "middle", class: "svg-label", "font-size": 15, fill: "var(--muted)" }, "III"),
      s("text", { x: PX(5.8), y: PY(-5.6), "text-anchor": "middle", class: "svg-label", "font-size": 15, fill: "var(--muted)" }, "IV"),
      s("line", { x1: PX(3.6), y1: PY(-7.55), x2: PX(4.6), y2: PY(-7.55), stroke: "var(--ink)", "stroke-width": 3 }),
      s("text", { x: PX(4.8), y: PY(-7.55) + 5, class: "svg-label", "font-size": 13, fill: "var(--ink)" }, "1 unit = 50 m"));
    if (places) PLACES.forEach((p) => {
      base.append(s("rect", { x: PX(p.x) - 9, y: PY(p.y) - 9, width: 18, height: 18, rx: 4, fill: p.color, opacity: 0.9 }),
        s("text", { x: PX(p.x) + (p.x > 4 ? -13 : 13), y: PY(p.y) - 10, "text-anchor": p.x > 4 ? "end" : "start", class: "svg-label", "font-size": 16, fill: "var(--ink)", "font-weight": 700 }, p.name));
    });
    return { svg, base, dyn, top };
  }

  /**
   * A persistent, draggable point in grid units. While dragging it follows the pointer
   * (rubber-banding past the edges); on release it springs to the nearest multiple of `step`.
   */
  function makePoint(P, { label, color, step = 1, onChange, onDrop }) {
    let x = 0, y = 0, dragging = false;
    const g = s("g", { class: "token" });
    const ring = s("circle", { r: 13, class: "handle", style: `stroke:${color}`, tabindex: 0, "aria-label": `Point ${label}` });
    const dot = s("circle", { r: 4, fill: color, "pointer-events": "none" });
    const tag = s("text", { class: "svg-text", "font-size": 17, "font-weight": 700, "paint-order": "stroke", stroke: "var(--paper)", "stroke-width": 4, fill: color, "pointer-events": "none" }, label);
    g.append(ring, dot, tag);
    P.top.append(g);
    const paint = () => {
      ring.setAttribute("cx", PX(x)); ring.setAttribute("cy", PY(y)); dot.setAttribute("cx", PX(x)); dot.setAttribute("cy", PY(y));
      tag.setAttribute("x", PX(x) + 14); tag.setAttribute("y", PY(y) + 22);
      if (onChange) onChange();
    };
    const sp = new Spring([0, 0], ([a, b]) => { x = a; y = b; paint(); }, { stiffness: 230, damping: 15 });
    const snap = (v) => clamp(Math.round(v / step) * step, -N, N);
    Sim.draggable(P.svg, ring, (p) => {
      dragging = true; sp.stop();
      x = rubber((p.x - O) / U, -N, N, 0.3); y = rubber((O - p.y) / U, -N, N, 0.3);
      sp.value = [x, y]; sp.vel = [0, 0]; paint();
    }, () => {
      dragging = false;
      const t = [snap(x), snap(y)];
      sp.set(t);
      if (onDrop) onDrop(t[0], t[1]);
    });
    ring.addEventListener("keydown", (e) => {
      const d = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, step], ArrowDown: [0, -step] }[e.key];
      if (!d) return;
      e.preventDefault();
      const t = [snap(sp.target[0] + d[0]), snap(sp.target[1] + d[1])];
      sp.set(t); if (onDrop) onDrop(t[0], t[1]);
    });
    return {
      get x() { return x; }, get y() { return y; },
      /** the lattice point it is resting on (or heading to) */
      get at() { return dragging ? [snap(x), snap(y)] : sp.target.slice(); },
      set(a, b) { sp.set([a, b]); }, jump(a, b) { sp.jump([a, b]); },
      show(v) { g.style.display = v ? "" : "none"; },
      stop() { sp.stop(); },
    };
  }

  // ------------------------------------------------------------ plot it

  function plotTab(root) {
    let mode = "explore", target = null, star = null, score = 0, tries = 0;
    const P = makePlane("Coordinate plane over a barangay map with a draggable point");
    const out = h("div", { class: "readout", "aria-live": "polite" });
    const task = h("div", { class: "stage-body", "aria-live": "polite" });
    const scoreEl = stat("Score:", "0 / 0");
    function guides() {
      clear(P.dyn);
      if (mode === "read" && star) {
        P.dyn.append(s("path", { d: starPath(PX(star[0]), PY(star[1]), 19), fill: "var(--shape-b)", stroke: "var(--paper)", "stroke-width": 2 }));
        clear(out);
        return;
      }
      const x = A.x, y = A.y;
      P.dyn.append(s("line", { x1: PX(x), y1: PY(y), x2: PX(x), y2: O, stroke: "var(--shape-a)", "stroke-width": 2, "stroke-dasharray": "6 5" }),
        s("line", { x1: PX(x), y1: PY(y), x2: O, y2: PY(y), stroke: "var(--shape-b)", "stroke-width": 2, "stroke-dasharray": "6 5" }),
        s("circle", { cx: PX(x), cy: O, r: 5, fill: "var(--shape-a)" }), s("circle", { cx: O, cy: PY(y), r: 5, fill: "var(--shape-b)" }));
      if (mode === "plot" && target) P.dyn.append(s("circle", { cx: PX(target[0]), cy: PY(target[1]), r: 18, fill: "none", stroke: "var(--gold)", "stroke-width": 3, "stroke-dasharray": "4 4", opacity: tries ? 0.9 : 0 }));
      const [ax, ay] = A.at;
      clear(out);
      out.append(stat("P =", pt(Math.round(x), Math.round(y))).el, stat("x-coordinate:", fm(ax)).el, stat("y-coordinate:", fm(ay)).el, stat("Location:", where(ax, ay)).el);
    }
    function starPath(cx, cy, r) {
      let d = "";
      for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + (i * Math.PI) / 5, rr = i % 2 ? r * 0.45 : r; d += `${i ? "L" : "M"}${cx + rr * Math.cos(a)},${cy + rr * Math.sin(a)}`; }
      return d + "Z";
    }
    const A = makePoint(P, { label: "P", color: "var(--shape-a)", onChange: () => guides(), onDrop: (x, y) => {
      if (mode !== "plot" || !target) return;
      tries++;
      const ok = x === target[0] && y === target[1];
      if (ok) score++;
      scoreEl.set(`${score} / ${tries}`);
      showTask(ok ? pill(true, `Yes! ${pt(x, y)} is ${whereIn(x, y)}.`, "") : pill(false, "", `That is ${pt(x, y)}. Move ${fm(target[0])} along the x-axis first, then ${fm(target[1])} up or down.`), ok);
    } });
    function newTarget() {
      do target = [randInt(-6, 6), randInt(-6, 6)]; while (target[0] === 0 && target[1] === 0);
      showTask(null, false);
    }
    function showTask(fb, solved) {
      clear(task);
      if (mode === "plot") {
        task.append(h("p", { class: "unit-big" }, `Plot the point ${pt(target[0], target[1])}`), h("p", { class: "note" }, "Drag P and let go. x first (left or right), then y (up or down)."));
        if (fb) task.append(fb);
        if (solved) task.append(h("div", { class: "controls" }, h("button", { class: "btn", type: "button", onclick: newTarget }, "Next point")));
      } else if (mode === "read") {
        const [a, b] = star;
        const opts = shuffle([...new Set([pt(a, b), pt(b, a), pt(-a, b), pt(a, -b), pt(-b, -a)])]).slice(0, 4);
        if (!opts.includes(pt(a, b))) opts[0] = pt(a, b);
        const res = h("div", { "aria-live": "polite" });
        task.append(h("p", { class: "unit-big" }, "What are the coordinates of the star?"),
          h("div", { class: "choices" }, shuffle(opts).map((o) => h("button", { type: "button", onclick: () => {
            tries++; const ok = o === pt(a, b); if (ok) score++; scoreEl.set(`${score} / ${tries}`);
            clear(res); res.append(pill(ok, `Correct – the star is at ${pt(a, b)}, ${whereIn(a, b)}.`, `Not quite. Count ${fm(a)} along x (left/right), then ${fm(b)} along y (up/down).`));
            if (ok) res.append(h("div", { class: "controls" }, h("button", { class: "btn", type: "button", onclick: newStar }, "Next star")));
          } }, o))), res);
      } else {
        task.append(h("p", { class: "note" }, "Drag P anywhere. It snaps to the nearest lattice point. The dashed lines drop to the x-axis and the y-axis: that is how you read (x, y)."),
          h("p", { class: "note" }, "Places: " + PLACES.map((p) => `${p.name} ${pt(p.x, p.y)}`).join(" · ")));
      }
    }
    function newStar() {
      const lm = Math.random() < 0.4 ? pick(PLACES.filter((p) => p.key !== "hall")) : null;
      do star = lm ? [lm.x, lm.y] : [randInt(-6, 6), randInt(-6, 6)]; while (star[0] === 0 || star[1] === 0 ? Math.random() < 0.5 : false);
      guides(); showTask(null, false);
    }
    function setMode(m) {
      mode = m; score = 0; tries = 0; scoreEl.set("0 / 0");
      A.show(m !== "read");
      if (m === "plot") { A.set(0, 0); newTarget(); }
      else if (m === "read") newStar();
      else { star = null; showTask(null, false); }
      guides();
    }
    root.append(h("div", { class: "controls" }, segmented(["explore", "plot", "read"], mode, setMode, (m) => ({ explore: "Explore", plot: "Plot the point", read: "Read the coordinates" })[m]), scoreEl.el),
      P.svg, out, task);
    A.jump(2, 3); setMode("explore");
    return () => A.stop();
  }

  // ------------------------------------------------------------ distance

  function distTab(root) {
    const P = makePlane("Two points with the right triangle between them");
    const out = h("div", { class: "readout", "aria-live": "polite" }), work = h("pre", { class: "workings" });
    let C = [0, 0];
    const cSp = new Spring([0, 0], (v) => { C = v; draw(); }, { stiffness: 120, damping: 9 });
    function draw() {
      clear(P.dyn);
      const ax = A.x, ay = A.y, bx = B.x, by = B.y;
      const [x1, y1] = A.at, [x2, y2] = B.at;
      const dx = Math.abs(x2 - x1), dy = Math.abs(y2 - y1), d = Math.hypot(dx, dy);
      // right triangle: the corner springs to (x₂, y₁)
      if (dx && dy) {
        P.dyn.append(s("path", { d: `M${PX(ax)},${PY(ay)} L${PX(C[0])},${PY(C[1])} L${PX(bx)},${PY(by)} Z`, fill: "var(--gold-soft)", opacity: 0.7 }));
        const sq = 12, sx = Math.sign(ax - C[0]) || 1, sy = Math.sign(by - C[1]) || 1;
        P.dyn.append(s("path", { d: `M${PX(C[0]) + sx * sq},${PY(C[1])} v${-sy * sq} h${-sx * sq}`, fill: "none", stroke: "var(--ink)", "stroke-width": 1.5 }));
      }
      P.dyn.append(s("line", { x1: PX(ax), y1: PY(ay), x2: PX(C[0]), y2: PY(C[1]), stroke: "var(--shape-a)", "stroke-width": 4 }),
        s("line", { x1: PX(C[0]), y1: PY(C[1]), x2: PX(bx), y2: PY(by), stroke: "var(--shape-b)", "stroke-width": 4 }),
        s("line", { x1: PX(ax), y1: PY(ay), x2: PX(bx), y2: PY(by), stroke: "var(--ink)", "stroke-width": 3.5 }));
      if (dx) P.dyn.append(s("text", { x: (PX(ax) + PX(C[0])) / 2, y: PY(C[1]) + (by > ay ? 24 : -12), "text-anchor": "middle", class: "svg-text", "font-size": 17, "font-weight": 700, "paint-order": "stroke", stroke: "var(--paper)", "stroke-width": 4, fill: "var(--shape-a)" }, `Δx = ${fm(dx)}`));
      if (dy) P.dyn.append(s("text", { x: PX(C[0]) + (bx >= ax ? 10 : -10), y: (PY(C[1]) + PY(by)) / 2 + 5, "text-anchor": bx >= ax ? "start" : "end", class: "svg-text", "font-size": 17, "font-weight": 700, "paint-order": "stroke", stroke: "var(--paper)", "stroke-width": 4, fill: "var(--shape-b)" }, `Δy = ${fm(dy)}`));
      P.dyn.append(s("text", { x: (PX(ax) + PX(bx)) / 2 + (dx && dy ? (bx > ax === by > ay ? -22 : 22) : 0), y: (PY(ay) + PY(by)) / 2 - (dx && dy ? 14 : 12), "text-anchor": dx && dy ? (bx > ax === by > ay ? "end" : "start") : "middle", class: "svg-text", "font-size": 17, "font-weight": 700 }, `d ${Number.isInteger(d) ? "=" : "≈"} ${fm(d, 2)}`));
      clear(out);
      out.append(stat("A =", pt(x1, y1)).el, stat("B =", pt(x2, y2)).el, stat("Distance:", `${fm(d, 2)} units`).el, stat("On the map:", `${fm(d * M_PER_UNIT, 1)} m`).el);
      const lines = [`Δx = |x₂ − x₁| = |${fm(x2)} − ${paren(x1)}| = ${fm(dx)}`, `Δy = |y₂ − y₁| = |${fm(y2)} − ${paren(y1)}| = ${fm(dy)}`];
      if (!dy && !dx) lines.push("The points are the same: d = 0.");
      else if (!dy) lines.push(`Horizontal segment (same y): d = |x₂ − x₁| = ${fm(dx)} units`);
      else if (!dx) lines.push(`Vertical segment (same x): d = |y₂ − y₁| = ${fm(dy)} units`);
      else lines.push(`Slanted: d = √(Δx² + Δy²) = √(${fm(dx)}² + ${fm(dy)}²)`, `  = √${fm(dx * dx + dy * dy)} ${Number.isInteger(d) ? "=" : "≈"} ${fm(d, 2)} units`);
      lines.push(`Scale: ${fm(d, 2)} × 50 m ≈ ${fm(d * 50, 1)} m`);
      work.textContent = lines.join("\n");
    }
    const follow = () => { cSp.set([B.x, A.y]); draw(); };
    const A = makePoint(P, { label: "A", color: "var(--shape-a)", onChange: follow });
    const B = makePoint(P, { label: "B", color: "var(--shape-b)", onChange: follow });
    const PRE = { horiz: [[-4, 2], [3, 2]], vert: [[2, -5], [2, 3]], slant: [[-2, -1], [2, 2]], crow: [[-3, -2], [3, 6]] };
    root.append(h("div", { class: "controls" }, segmented(Object.keys(PRE), "crow", (k) => { A.set(...PRE[k][0]); B.set(...PRE[k][1]); }, (k) => ({ horiz: "Horizontal", vert: "Vertical", slant: "Slanted", crow: "Gate → Canteen" })[k])),
      P.svg, out, work,
      h("p", { class: "note" }, "Drag A and B. The legs of the right triangle are the run |x₂ − x₁| and the rise |y₂ − y₁|; the slanted side is the distance. Why √(Δx² + Δy²) works is the Pythagorean Theorem, which you will study formally in Term 2."));
    A.jump(-3, -2); B.jump(3, 6); cSp.jump([3, -2]); draw();
    return () => { A.stop(); B.stop(); cSp.stop(); };
  }

  // ------------------------------------------------------------ midpoint

  const SHEDS = [["gate", "chapel"], ["court", "canteen"], ["chapel", "court"], ["gate", "canteen"]];

  function midTab(root) {
    let mode = "explore", pair = SHEDS[0], checked = false;
    const P = makePlane("Two points and the midpoint between them");
    const out = h("div", { class: "readout", "aria-live": "polite" }), work = h("pre", { class: "workings" }), task = h("div", { class: "stage-body", "aria-live": "polite" });
    let Mp = [0, 0];
    const mSp = new Spring([0, 0], (v) => { Mp = v; draw(); }, { stiffness: 140, damping: 13 });
    function draw() {
      clear(P.dyn);
      const [x1, y1] = A.at, [x2, y2] = B.at, mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
      P.dyn.append(s("line", { x1: PX(A.x), y1: PY(A.y), x2: PX(B.x), y2: PY(B.y), stroke: "var(--ink)", "stroke-width": 3.5 }));
      const showM = mode === "explore" || checked;
      if (showM) {
        P.dyn.append(s("line", { x1: PX(Mp[0]), y1: PY(Mp[1]), x2: PX(Mp[0]), y2: O, stroke: "var(--purple)", "stroke-dasharray": "5 5", "stroke-width": 1.5 }),
          s("line", { x1: PX(Mp[0]), y1: PY(Mp[1]), x2: O, y2: PY(Mp[1]), stroke: "var(--purple)", "stroke-dasharray": "5 5", "stroke-width": 1.5 }),
          s("circle", { cx: PX(Mp[0]), cy: PY(Mp[1]), r: 8, fill: "var(--paper)", stroke: "var(--purple)", "stroke-width": 4 }),
          s("text", { x: PX(Mp[0]) - 12, y: PY(Mp[1]) - 12, "text-anchor": "end", class: "svg-text", "font-size": 17, "font-weight": 700, "paint-order": "stroke", stroke: "var(--paper)", "stroke-width": 4, fill: "var(--purple)" }, `M ${pt(mx, my)}`));
      }
      if (mode === "shed") {
        const [sx, sy] = S.at;
        P.dyn.append(s("path", { d: `M${PX(S.x) - 16},${PY(S.y) - 6} L${PX(S.x)},${PY(S.y) - 22} L${PX(S.x) + 16},${PY(S.y) - 6} Z`, fill: "var(--accent)", "pointer-events": "none" }));
        clear(out);
        out.append(stat("Shed at:", pt(sx, sy)).el, stat(`to ${place(pair[0]).name}:`, `${fm(Math.hypot(sx - x1, sy - y1) * M_PER_UNIT, 1)} m`).el, stat(`to ${place(pair[1]).name}:`, `${fm(Math.hypot(sx - x2, sy - y2) * M_PER_UNIT, 1)} m`).el);
      } else {
        clear(out);
        out.append(stat("A =", pt(x1, y1)).el, stat("B =", pt(x2, y2)).el, stat("Midpoint M =", pt(mx, my)).el);
      }
      work.textContent = `M = ((x₁ + x₂)/2, (y₁ + y₂)/2)\n  = ((${fm(x1)} + ${paren(x2)})/2, (${fm(y1)} + ${paren(y2)})/2)\n  = (${fm(x1 + x2)}/2, ${fm(y1 + y2)}/2) = ${pt(mx, my)}`;
      work.hidden = mode === "shed" && !checked;
    }
    const follow = () => { mSp.set([(A.x + B.x) / 2, (A.y + B.y) / 2]); draw(); };
    const A = makePoint(P, { label: "A", color: "var(--shape-a)", onChange: follow });
    const B = makePoint(P, { label: "B", color: "var(--shape-b)", onChange: follow });
    const S = makePoint(P, { label: "Shed", color: "var(--accent)", step: 0.5, onChange: () => draw(), onDrop: () => { checked = false; showTask(); } });
    function showTask() {
      clear(task);
      if (mode !== "shed") {
        task.append(h("p", { class: "note" }, "Drag A and B. The midpoint M glides to stay exactly halfway: its x is the average of the x's, and its y is the average of the y's."));
        return;
      }
      const a = place(pair[0]), b = place(pair[1]);
      const res = h("div", { "aria-live": "polite" });
      task.append(h("p", {}, `The barangay will build a waiting shed exactly halfway between the ${a.name} ${pt(a.x, a.y)} and the ${b.name} ${pt(b.x, b.y)}. Drag the shed to the spot, then check.`),
        h("div", { class: "controls" }, h("button", { class: "btn", type: "button", onclick: () => {
          checked = true; follow();
          const [sx, sy] = S.at, mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
          const ok = sx === mx && sy === my;
          clear(res); res.append(pill(ok, `Perfect – the shed is at the midpoint ${pt(mx, my)}, ${fm(Math.hypot(a.x - mx, a.y - my) * 50, 1)} m from each place.`, `Not yet. The midpoint is ${pt(mx, my)}; your shed is at ${pt(sx, sy)}.`));
        } }, "Check"), h("button", { class: "btn ghost", type: "button", onclick: () => { pair = SHEDS[(SHEDS.indexOf(pair) + 1) % SHEDS.length]; setMode("shed"); } }, "Another pair")),
        res, h("p", { class: "note" }, "PT1.1: use the same steps to place a new facility in your community-hub plan."));
    }
    function setMode(m) {
      mode = m; checked = false;
      if (m === "shed") {
        const a = place(pair[0]), b = place(pair[1]);
        A.set(a.x, a.y); B.set(b.x, b.y); A.show(false); B.show(false); S.show(true); S.set(0, -5);
      } else { A.show(true); B.show(true); S.show(false); }
      showTask(); draw();
    }
    root.append(h("div", { class: "controls" }, segmented(["explore", "shed"], mode, setMode, (m) => (m === "explore" ? "Explore" : "Waiting shed problem"))), P.svg, out, task, work);
    A.jump(-4, -2); B.jump(4, 4); S.jump(0, -5); mSp.jump([0, 1]); setMode("explore");
    return () => { A.stop(); B.stop(); S.stop(); mSp.stop(); };
  }

  // ------------------------------------------------------------ lesson

  Sim.register({
    id: "g8-lesson9", unit: "8D", num: 9, letter: "I", title: "The Cartesian Plane, Distance, and Midpoint", simName: "Barangay Map",
    comps: ["A14", "A15", "A16", "M9", "T2"], cycles: "C9,M3 – C10,M1", deped: "DepEd Weeks 9–10",
    bigQuestion: "How far is the canteen from the gate – as the crow flies?",
    mission: [
      "Plot It: drag P into each quadrant and onto each axis. What do the signs of x and y tell you?",
      "Play “Plot the point” and “Read the coordinates” until you get 5 in a row.",
      "Distance: try Horizontal and Vertical first. How do you get the distance without the formula?",
      "Press Gate → Canteen. How far apart are they in grid units, and in metres?",
      "Midpoint: solve the waiting shed problem for every pair of places.",
    ],
    discovery: "Every point has an address (x, y): x tells how far left or right of the origin, y how far up or down. The signs tell the quadrant. For a horizontal or vertical segment, the distance is the difference of the changing coordinate. For a slanted segment, the legs |x₂ − x₁| and |y₂ − y₁| form a right triangle, and d = √(Δx² + Δy²). The gate (−3, −2) and the canteen (3, 6) have Δx = 6 and Δy = 8, so d = √100 = 10 units = 500 m. The midpoint is the average of the coordinates.",
    mount(stage) {
      const body = h("div", { class: "stage-body" });
      const views = [plotTab, distTab, midTab];
      let stopper = null;
      const t = tabs(["Plot It", "Distance", "Midpoint"], (i) => { if (stopper) stopper(); clear(body); stopper = views[i](body) || null; });
      stage.append(t.el, body);
      stopper = plotTab(body) || null;
      return () => { if (stopper) stopper(); };
    },
    check() {
      const kind = randInt(0, 5);
      if (kind === 0) {
        let x = randInt(-9, 9), y = randInt(-9, 9);
        if (Math.random() < 0.2) x = 0; else if (Math.random() < 0.2) y = 0;
        if (x === 0 && y === 0) y = 4;
        const ans = where(x, y);
        const opts = ["Quadrant I", "Quadrant II", "Quadrant III", "Quadrant IV", "on the x-axis", "on the y-axis"];
        const choices = shuffle([ans, ...shuffle(opts.filter((o) => o !== ans)).slice(0, 3)]);
        return { q: `Where is the point ${pt(x, y)}?`, choices, answer: ans, explain: x && y ? `x is ${x > 0 ? "positive" : "negative"} and y is ${y > 0 ? "positive" : "negative"}, so it is in ${ans}.` : `A coordinate is 0, so the point is ${ans}.` };
      }
      if (kind === 1) {
        const y = randInt(-6, 6), x1 = randInt(-8, 2), x2 = x1 + randInt(2, 9);
        return { q: `Find the distance between ${pt(x1, y)} and ${pt(x2, y)}.`, answer: x2 - x1, unit: "units", explain: `Same y, so d = |${fm(x2)} − ${paren(x1)}| = ${x2 - x1}.` };
      }
      if (kind === 2) {
        const [a, b, c] = pick([[3, 4, 5], [6, 8, 10], [5, 12, 13], [8, 6, 10], [4, 3, 5]]), x1 = randInt(-5, 3), y1 = randInt(-5, 3);
        const sx = pick([1, -1]), sy = pick([1, -1]), x2 = x1 + sx * a, y2 = y1 + sy * b;
        return { q: `Find the distance between ${pt(x1, y1)} and ${pt(x2, y2)}.`, answer: c, unit: "units", explain: `Δx = ${a}, Δy = ${b}; d = √(${a}² + ${b}²) = √${a * a + b * b} = ${c}.` };
      }
      if (kind === 3) {
        const x1 = randInt(-8, 8), y1 = randInt(-8, 8), x2 = randInt(-8, 8), y2 = randInt(-8, 8);
        const m = pt((x1 + x2) / 2, (y1 + y2) / 2);
        const opts = [...new Set([m, pt((x2 - x1) / 2, (y2 - y1) / 2), pt(x1 + x2, y1 + y2), pt((x1 + y1) / 2, (x2 + y2) / 2)])];
        while (opts.length < 4) opts.push(pt((x1 + x2) / 2 + opts.length, (y1 + y2) / 2));
        return { q: `What is the midpoint of the segment from ${pt(x1, y1)} to ${pt(x2, y2)}?`, choices: shuffle(opts), answer: m, explain: `Average the coordinates: ((${fm(x1)} + ${paren(x2)})/2, (${fm(y1)} + ${paren(y2)})/2) = ${m}.` };
      }
      if (kind === 4) {
        const [a, b, c] = pick([[3, 4, 5], [6, 8, 10], [5, 12, 13]]);
        return { q: `On the barangay map, 1 grid unit = 50 m. Two places are ${a} units apart horizontally and ${b} units apart vertically. How many metres apart are they as the crow flies?`, answer: c * 50, unit: "m", explain: `d = √(${a}² + ${b}²) = ${c} units; ${c} × 50 = ${c * 50} m.` };
      }
      const x = randInt(-7, 7), y = randInt(-7, 7);
      return { q: `What is the y-coordinate of the point ${pt(x, y)}?`, answer: y, explain: `In (x, y), the second number is the y-coordinate: ${fm(y)}.` };
    },
  });

  function paren(v) { return v < 0 ? `(${fm(v)})` : fm(v); }
})();
