/* Term 3 · Lesson 3 · C. Absolute Value – Distance Finder */
(function () {
  "use strict";
  const { h, s, clear, randInt, pick, shuffle, fmt, tabs, segmented, stat, pill, Spring, rubber, clamp } = Sim;

  const neg = (x) => (x < 0 ? "−" + Math.abs(x) : String(x));
  const par = (x) => (x < 0 ? `(${neg(x)})` : neg(x));
  const big = (x) => (x < 0 ? "−" : "") + fmt(Math.abs(x), 0).replace(/,/g, " ");
  const bigPar = (x) => (x < 0 ? `(${big(x)})` : big(x));
  const nz = (lo, hi) => { let x = 0; while (x === 0) x = randInt(lo, hi); return x; };
  const sideColor = (n) => (n < 0 ? "var(--shape-b)" : n > 0 ? "var(--shape-a)" : "var(--ink)");

  // ------------------------------------------------------------ tab 1: distance from zero

  function fromZero(root) {
    let a = -4, ghost = 4, arcH = 48, gArcH = 48;
    const X = (n) => 300 + n * 26, Y0 = 140;
    const svg = s("svg", { viewBox: "0 0 600 270", role: "img", "aria-label": "Distance of a point from zero" });
    const base = s("g"), tapZone = s("rect", { x: 0, y: Y0 - 26, width: 600, height: 52, fill: "transparent" }), arcs = s("g"), ghostEl = s("g", { opacity: 0.55 });
    const marker = s("g", { class: "token", tabindex: 0, "aria-label": "Drag the point" });
    svg.append(base, tapZone, arcs, ghostEl, marker);
    base.append(s("line", { x1: 18, y1: Y0, x2: 582, y2: Y0, stroke: "var(--ink)", "stroke-width": 2.5 }),
      s("path", { d: `M582,${Y0} l-10,-6 v12 z`, fill: "var(--ink)" }), s("path", { d: `M18,${Y0} l10,-6 v12 z`, fill: "var(--ink)" }));
    for (let n = -10; n <= 10; n++) {
      base.append(s("line", { x1: X(n), y1: Y0 - 8, x2: X(n), y2: Y0 + 8, stroke: "var(--ink)", "stroke-width": n === 0 ? 3 : 1.4 }));
      base.append(s("text", { x: X(n), y: Y0 + 28, "text-anchor": "middle", class: "svg-text", style: "font-size:11px", fill: sideColor(n) }, neg(n)));
    }
    marker.append(s("rect", { x: -20, y: -20, width: 40, height: 84, fill: "transparent" }), s("circle", { r: 13, fill: "var(--accent)", stroke: "var(--paper)", "stroke-width": 3 }), s("text", { y: 58, "text-anchor": "middle", class: "svg-text", "font-weight": 700 }, ""));
    ghostEl.append(s("circle", { r: 11, fill: "none", stroke: "var(--accent)", "stroke-width": 2.5, "stroke-dasharray": "4 3" }), s("text", { y: 58, "text-anchor": "middle", class: "svg-text" }, ""));
    const out = h("p", { class: "unit-big", "aria-live": "polite" }), info = h("div", { class: "readout" }), why = h("p", { class: "note" });
    const heightFor = (v) => 14 + Math.abs(v) * 8.5;
    function paint() {
      clear(arcs);
      const n = clamp(Math.round(a), -10, 10);
      for (let k = 1; k <= Math.abs(n); k++) {
        const x1 = X(Math.sign(n) * (k - 1)), x2 = X(Math.sign(n) * k);
        arcs.append(s("line", { x1, y1: Y0, x2, y2: Y0, stroke: "var(--gold)", "stroke-width": 6, "stroke-linecap": "round", opacity: 0.75 }));
      }
      if (Math.abs(a) > 0.05) {
        arcs.append(s("path", { d: `M${X(0)},${Y0} Q${(X(0) + X(a)) / 2},${Y0 - 2 * arcH} ${X(a)},${Y0}`, fill: "none", stroke: "var(--accent)", "stroke-width": 3 }),
          s("text", { x: (X(0) + X(a)) / 2, y: Y0 - arcH - 10, "text-anchor": "middle", class: "svg-text", style: "font-size:15px", "font-weight": 700 }, `|${neg(n)}| = ${Math.abs(n)}`));
      }
      if (Math.abs(ghost) > 0.05) {
        arcs.append(s("path", { d: `M${X(0)},${Y0} Q${(X(0) + X(ghost)) / 2},${Y0 + 2 * gArcH} ${X(ghost)},${Y0}`, fill: "none", stroke: "var(--accent)", "stroke-width": 2, "stroke-dasharray": "6 5", opacity: 0.6 }));
      }
      marker.setAttribute("transform", `translate(${X(a).toFixed(1)},${Y0})`);
      marker.querySelector("text").textContent = neg(n);
      ghostEl.setAttribute("transform", `translate(${X(ghost).toFixed(1)},${Y0})`);
      ghostEl.querySelector("text").textContent = n === 0 ? "" : neg(-n);
      out.textContent = n === 0 ? "|0| = 0" : `|${neg(n)}| = ${Math.abs(n)}   and   |${neg(-n)}| = ${Math.abs(n)}`;
      clear(info);
      info.append(stat("Point:", neg(n)).el, stat("Distance from 0:", `${Math.abs(n)} unit${Math.abs(n) === 1 ? "" : "s"}`).el, stat("Opposite:", neg(-n)).el,
        pill(true, "absolute value is never negative", ""));
      why.textContent = n === 0 ? "0 is zero units from itself, so |0| = 0." : `${neg(n)} is ${Math.abs(n)} units from 0${n < 0 ? " (to the left)" : " (to the right)"}. Its opposite, ${neg(-n)}, is the same distance on the other side, so both have absolute value ${Math.abs(n)}.`;
    }
    const mv = new Spring(a, (v) => { a = v; paint(); }, { stiffness: 230, damping: 15 });
    const gv = new Spring(ghost, (v) => { ghost = v; paint(); }, { stiffness: 150, damping: 12 });
    const hv = new Spring(arcH, (v) => { arcH = v; paint(); }, { stiffness: 180, damping: 10 });
    const ghv = new Spring(gArcH, (v) => { gArcH = v; paint(); }, { stiffness: 120, damping: 9 });
    const follow = (target) => { gv.set(-target); hv.set(heightFor(target)); ghv.set(heightFor(target)); };
    const settle = (x) => { const n = clamp(Math.round(x), -10, 10); mv.set(n); follow(n); };
    Sim.draggable(svg, marker, (p) => { mv.stop(); a = rubber((p.x - 300) / 26, -10, 10, 0.3); mv.value = a; mv.vel = 0; follow(a); paint(); }, () => settle(a));
    tapZone.addEventListener("pointerdown", (ev) => settle((Sim.svgPoint(svg, ev).x - 300) / 26));
    marker.addEventListener("keydown", (e) => { if (e.key === "ArrowRight") { e.preventDefault(); settle(Math.round(a) + 1); } if (e.key === "ArrowLeft") { e.preventDefault(); settle(Math.round(a) - 1); } });
    root.append(svg, out, info, why, h("p", { class: "note" }, "Drag the green point (or tap the line). The solid arc is its distance from 0; the dashed point is its opposite."));
    paint();
    return () => { mv.stop(); gv.stop(); hv.stop(); ghv.stop(); };
  }

  // ------------------------------------------------------------ tab 2: real distances

  const PLACES = [["Mt. Apo summit", 2954], ["Mt. Pulag summit", 2926], ["Sea level", 0], ["Manila Bay seabed (average)", -17], ["Philippine Deep (Emden Deep)", -10540]];

  function elevation(root) {
    let ia = 1, ib = 3;
    let view = [PLACES[ia][1], PLACES[ib][1], 0, 0];
    const svg = s("svg", { viewBox: "0 0 600 380", role: "img", "aria-label": "Elevations above and below sea level" });
    const work = h("pre", { class: "workings" });
    const bounds = (va, vb) => { let lo = Math.min(va, vb, 0), hi = Math.max(va, vb, 0); const r = hi - lo || 1; return [lo - r * 0.07, hi + r * 0.07]; };
    view = [view[0], view[1], ...bounds(view[0], view[1])];
    function draw() {
      clear(svg);
      const [va, vb, lo, hi] = view;
      const Y = (v) => 350 - ((v - lo) / (hi - lo)) * 320;
      const y0 = Y(0);
      svg.append(s("rect", { x: 0, y: y0, width: 600, height: Math.max(0, 380 - y0), fill: "var(--shape-a-soft)" }));
      const top = Math.max(va, vb);
      if (top > 1) svg.append(s("path", { d: `M300,${y0} L410,${Y(top)} L440,${Y(top) + 14} L520,${y0} Z`, fill: "var(--accent-soft)", stroke: "var(--accent)", "stroke-width": 1.5 }));
      svg.append(s("line", { x1: 0, y1: y0, x2: 600, y2: y0, stroke: "var(--shape-a)", "stroke-width": 2, "stroke-dasharray": "8 5" }), s("text", { x: 596, y: y0 - 6, "text-anchor": "end", class: "svg-label", style: "font-size:12px" }, "sea level (0 m)"));
      const range = hi - lo, steps = [5, 10, 20, 50, 100, 200, 500, 1000, 2000, 5000], st = steps.find((x) => range / x <= 8) || 5000;
      svg.append(s("line", { x1: 110, y1: Y(hi), x2: 110, y2: Y(lo), stroke: "var(--ink)", "stroke-width": 2 }));
      for (let v = Math.ceil(lo / st) * st; v <= hi; v += st) svg.append(s("line", { x1: 104, y1: Y(v), x2: 116, y2: Y(v), stroke: "var(--ink)" }), s("text", { x: 98, y: Y(v) + 4, "text-anchor": "end", class: "svg-text", style: "font-size:11px" }, big(v)));
      svg.append(s("text", { x: 110, y: 16, "text-anchor": "middle", class: "svg-label", style: "font-size:11px" }, "metres"));
      let ya = Y(va), yb = Y(vb);
      let la = ya, lb = yb;
      if (Math.abs(la - lb) < 20) { const m = (la + lb) / 2, d = la <= lb ? -1 : 1; la = m + d * 10; lb = m - d * 10; }
      const A = PLACES[ia], B = PLACES[ib];
      svg.append(s("circle", { cx: 110, cy: ya, r: 8, fill: "var(--shape-a)", stroke: "var(--paper)", "stroke-width": 2 }), s("circle", { cx: 110, cy: yb, r: 8, fill: "var(--shape-b)", stroke: "var(--paper)", "stroke-width": 2 }));
      svg.append(s("text", { x: 126, y: la + 4, class: "svg-text", style: "font-size:12px", fill: "var(--shape-a)", "font-weight": 700 }, `A: ${A[0]}, ${big(A[1])} m`),
        s("text", { x: 126, y: lb + 4, class: "svg-text", style: "font-size:12px", fill: "var(--shape-b)", "font-weight": 700 }, `B: ${B[0]}, ${big(B[1])} m`));
      // springy distance bracket
      svg.append(s("path", { d: `M540,${ya} h12 M546,${ya} V${yb} M540,${yb} h12`, fill: "none", stroke: "var(--gold)", "stroke-width": 3 }));
      const d = Math.abs(A[1] - B[1]), my = (ya + yb) / 2;
      svg.append(s("text", { x: 574, y: my, "text-anchor": "middle", class: "svg-text", style: "font-size:13px", "font-weight": 700, transform: `rotate(-90 574 ${my})` }, `${big(d)} m`));
    }
    const sp = new Spring(view, (v) => { view = v; draw(); }, { stiffness: 110, damping: 14 });
    function update() {
      const va = PLACES[ia][1], vb = PLACES[ib][1];
      sp.set([va, vb, ...bounds(va, vb)]);
      const d = Math.abs(va - vb), same = va * vb > 0;
      work.textContent = `Distance = |A − B| = |${big(va)} − ${bigPar(vb)}| = |${big(va - vb)}| = ${big(d)} m\n` +
        (va === 0 || vb === 0 ? `One place is at sea level, so the distance is just the other place’s absolute value: ${big(d)} m.`
          : same ? `Both are on the same side of sea level: ${big(Math.max(Math.abs(va), Math.abs(vb)))} − ${big(Math.min(Math.abs(va), Math.abs(vb)))} = ${big(d)} m.`
            : `They are on opposite sides of sea level: |${big(va)}| + |${big(vb)}| = ${big(Math.abs(va))} + ${big(Math.abs(vb))} = ${big(d)} m.`);
    }
    const mk = (id, label, val, set) => {
      const sel = h("select", { id }, PLACES.map((p, i) => h("option", { value: i, selected: i === val }, `${p[0]} (${big(p[1])} m)`)));
      sel.addEventListener("change", () => { set(Number(sel.value)); update(); });
      return h("label", { for: id }, label, sel);
    };
    root.append(h("div", { class: "controls" }, mk("t3l3-pa", "A", ia, (v) => { ia = v; }), mk("t3l3-pb", "B", ib, (v) => { ib = v; })), svg, work,
      h("p", { class: "note" }, "Elevations are approximate. Distance is never negative, so we take the absolute value of the difference."));
    draw(); update();
    return () => sp.stop();
  }

  /** Two draggable markers on a horizontal line; a springy arc shows the distance |a − b|. */
  function lineTool(root, cfg) {
    let a = cfg.a, b = cfg.b, arcH = 40;
    const { lo, hi } = cfg;
    const X = (v) => 40 + ((v - lo) / (hi - lo)) * 520, Y0 = 150;
    const svg = s("svg", { viewBox: "0 0 600 230", role: "img", "aria-label": cfg.aria });
    const base = s("g"), dyn = s("g");
    svg.append(base, dyn);
    base.append(s("line", { x1: 24, y1: Y0, x2: 576, y2: Y0, stroke: "var(--ink)", "stroke-width": 2.5 }));
    for (let n = lo; n <= hi; n++) {
      const lab = n % cfg.every === 0;
      base.append(s("line", { x1: X(n), y1: Y0 - (lab ? 8 : 4), x2: X(n), y2: Y0 + (lab ? 8 : 4), stroke: "var(--ink)", "stroke-width": n === 0 ? 3 : lab ? 1.4 : 0.8 }));
      if (lab) base.append(s("text", { x: X(n), y: Y0 + 22, "text-anchor": "middle", class: "svg-text", style: "font-size:11px", fill: sideColor(n) }, neg(n)));
    }
    const mk = (name, color, up) => {
      const g = s("g", { class: "token", tabindex: 0, "aria-label": `Marker ${name}` });
      g.append(s("rect", { x: -22, y: up ? 0 : -48, width: 44, height: up ? 56 : 48, fill: "transparent" }), s("path", { d: up ? "M0,0 l-13,24 h26 z" : "M0,0 l-13,-24 h26 z", fill: color }), s("text", { y: up ? 22 : -30, "text-anchor": "middle", class: "svg-text", "font-weight": 700 }, ""));
      svg.append(g);
      return g;
    };
    const ga = mk("A", "var(--shape-a)", false), gb = mk("B", "var(--shape-b)", true);
    gb.querySelector("text").setAttribute("y", "50");
    const out = h("p", { class: "unit-big", "aria-live": "polite" }), work = h("pre", { class: "workings" });
    function paint() {
      clear(dyn);
      const A = clamp(Math.round(a), lo, hi), B = clamp(Math.round(b), lo, hi);
      dyn.append(s("line", { x1: X(a), y1: Y0, x2: X(b), y2: Y0, stroke: "var(--gold)", "stroke-width": 7, "stroke-linecap": "round", opacity: 0.6 }));
      if (Math.abs(a - b) > 0.05) {
        const peak = Y0 - 34 - 2 * arcH;
        dyn.append(s("path", { d: `M${X(a)},${Y0 - 30} Q${(X(a) + X(b)) / 2},${peak} ${X(b)},${Y0 - 30}`, fill: "none", stroke: "var(--gold)", "stroke-width": 3 }),
          s("text", { x: clamp((X(a) + X(b)) / 2, 80, 520), y: Y0 - 40 - arcH, "text-anchor": "middle", class: "svg-text", style: "font-size:14px", "font-weight": 700 }, `${Math.abs(A - B)}${cfg.unit ? " " + cfg.unit : ""}`));
      }
      ga.setAttribute("transform", `translate(${X(a).toFixed(1)},${Y0 - 6})`); gb.setAttribute("transform", `translate(${X(b).toFixed(1)},${Y0 + 6})`);
      ga.querySelector("text").textContent = `A ${neg(A)}`; gb.querySelector("text").textContent = `B ${neg(B)}`;
      out.textContent = `|A − B| = |${neg(A)} − ${par(B)}| = ${Math.abs(A - B)}${cfg.unit ? " " + cfg.unit : ""}`;
      work.textContent = cfg.explain(A, B);
    }
    const sa = new Spring(a, (v) => { a = v; paint(); }, { stiffness: 230, damping: 15 });
    const sb = new Spring(b, (v) => { b = v; paint(); }, { stiffness: 230, damping: 15 });
    const sh = new Spring(arcH, (v) => { arcH = v; paint(); }, { stiffness: 170, damping: 10 });
    const hFor = () => clamp(10 + Math.abs(a - b) * (cfg.arcScale || 2), 10, 40);
    const toV = (x) => rubber(lo + ((x - 40) / 520) * (hi - lo), lo, hi, 0.3);
    Sim.draggable(svg, ga, (p) => { sa.stop(); a = toV(p.x); sa.value = a; sa.vel = 0; sh.set(hFor()); paint(); }, () => { sa.set(clamp(Math.round(a), lo, hi)); });
    Sim.draggable(svg, gb, (p) => { sb.stop(); b = toV(p.x); sb.value = b; sb.vel = 0; sh.set(hFor()); paint(); }, () => { sb.set(clamp(Math.round(b), lo, hi)); });
    const presets = (cfg.presets || []).map(([label, x, y]) => h("button", { class: "btn ghost", type: "button", onclick: () => { sa.set(x); sb.set(y); sh.jump(4); sh.set(clamp(10 + Math.abs(x - y) * (cfg.arcScale || 2), 10, 40)); } }, label));
    root.append(presets.length ? h("div", { class: "controls" }, presets) : null, svg, out, work, h("p", { class: "note" }, cfg.note));
    sh.jump(hFor());
    paint();
    return () => { sa.stop(); sb.stop(); sh.stop(); };
  }

  function temperature(root) {
    return lineTool(root, {
      lo: -20, hi: 40, every: 5, a: 10, b: 24, unit: "°C", arcScale: 0.8, aria: "Two temperatures on a number line",
      presets: [["Baguio dawn → noon", 10, 24], ["Freezer → kitchen", -18, 27], ["Seoul winter → Manila", -7, 31], ["Mountain night → day", -3, 15]],
      explain: (A, B) => `Change from A to B: ${neg(B)} − ${par(A)} = ${neg(B - A)} °C (${B > A ? "the temperature rose" : B < A ? "the temperature fell" : "no change"}).\nSize of the change: |${neg(B)} − ${par(A)}| = ${Math.abs(B - A)} °C.`,
      note: "Drag A (the first reading) and B (the second reading). The change can be negative, but the distance between them never is.",
    });
  }
  function twoIntegers(root) {
    return lineTool(root, {
      lo: -10, hi: 10, every: 1, a: -6, b: 3, unit: "", arcScale: 3, aria: "Distance between two integers",
      explain: (A, B) => `|A − B| = |${neg(A)} − ${par(B)}| = |${neg(A - B)}| = ${Math.abs(A - B)}\n|B − A| = |${neg(B)} − ${par(A)}| = |${neg(B - A)}| = ${Math.abs(B - A)}\nSame distance either way. Count the gold units on the line to check.`,
      note: "Drag A and B. The distance between two integers is the absolute value of their difference.",
    });
  }

  function real(root) {
    const sub = h("div", { class: "stage-body" });
    const views = { Elevation: elevation, Temperature: temperature, "Two integers": twoIntegers };
    let stop = null;
    const show = (k) => { if (stop) stop(); clear(sub); stop = views[k](sub) || null; };
    root.append(h("div", { class: "controls" }, h("span", {}, "Situation"), segmented(Object.keys(views), "Elevation", show)), sub);
    show("Elevation");
    return () => { if (stop) stop(); };
  }

  // ------------------------------------------------------------ lesson

  Sim.register({
    id: "lesson21", unit: "H", num: 3, letter: "C", title: "Absolute Value", simName: "Distance Finder",
    comps: ["A4", "M3"], cycles: "C3,M3 – C3,M5", deped: "DepEd Week 3",
    bigQuestion: "If you owe ₱50 and then earn ₱80, how much do you really have?",
    mission: [
      "Distance from Zero: drag the point to −6, then to 6. What is the same? What is different?",
      "Can you find a point whose absolute value is negative? Why not?",
      "Real Distances: find the distance from the top of Mt. Pulag to the Manila Bay seabed.",
      "Two integers: find |A − B| and |B − A| for three pairs. What do you notice?",
    ],
    discovery: "The absolute value of an integer is its distance from 0 on the number line, so it is never negative: |−6| = |6| = 6, and |0| = 0. Opposites have the same absolute value. The distance between two integers a and b is |a − b| (which equals |b − a|): from Mt. Pulag at 2 926 m to the Manila Bay seabed at about −17 m is |2 926 − (−17)| = 2 943 m. A debt of ₱50 is −50, and |−50| = 50 tells you how big the debt is.",
    mount(stage) {
      const body = h("div", { class: "stage-body" });
      const views = [fromZero, real];
      let stopper = null;
      const t = tabs(["Distance from Zero", "Real Distances"], (i) => { if (stopper) stopper(); clear(body); stopper = views[i](body) || null; });
      stage.append(t.el, body);
      stopper = fromZero(body);
      return () => { if (stopper) stopper(); };
    },
    check() {
      const k = randInt(0, 6);
      if (k === 0) { const n = nz(-60, 60); return { q: `What is |${neg(n)}|?`, answer: Math.abs(n), explain: `${neg(n)} is ${Math.abs(n)} units from 0.` }; }
      if (k === 1) { const a = randInt(-15, 15); let b = randInt(-15, 15); while (b === a) b = randInt(-15, 15); return { q: `What is the distance between ${neg(a)} and ${neg(b)} on the number line?`, answer: Math.abs(a - b), explain: `|${neg(a)} − ${par(b)}| = |${neg(a - b)}| = ${Math.abs(a - b)}.` }; }
      if (k === 2) {
        const a = nz(-20, 20), b = nz(-20, 20), form = randInt(0, 2);
        if (form === 0) return { q: `Evaluate |${neg(a)}| + |${neg(b)}|.`, answer: Math.abs(a) + Math.abs(b), explain: `${Math.abs(a)} + ${Math.abs(b)} = ${Math.abs(a) + Math.abs(b)}.` };
        if (form === 1) return { q: `Evaluate |${neg(a)}| − |${neg(b)}|.`, answer: Math.abs(a) - Math.abs(b), explain: `${Math.abs(a)} − ${Math.abs(b)} = ${neg(Math.abs(a) - Math.abs(b))}.` };
        return { q: `Evaluate −|${neg(a)}|.`, answer: -Math.abs(a), explain: `|${neg(a)}| = ${Math.abs(a)}, and its opposite is ${neg(-Math.abs(a))}.` };
      }
      if (k === 3) { const n = randInt(2, 30); const right = `${n} and −${n}`; return { q: `Which integers have an absolute value of ${n}?`, choices: shuffle([right, `${n} only`, `−${n} only`, `0 and ${n}`]), answer: right, explain: `Both ${n} and −${n} are ${n} units from 0.` }; }
      if (k === 4) {
        const [p1, p2] = pick([[1, 3], [0, 3], [1, 4], [0, 1], [2, 4]]), A = PLACES[p1], B = PLACES[p2];
        return { q: `${A[0]} is at ${big(A[1])} m and ${B[0]} is at ${big(B[1])} m (relative to sea level). How far apart are they vertically?`, answer: Math.abs(A[1] - B[1]), unit: "m", explain: `|${big(A[1])} − ${bigPar(B[1])}| = ${big(Math.abs(A[1] - B[1]))} m.` };
      }
      if (k === 5) {
        const a = nz(-15, 15); let b = nz(-15, 15); while (Math.abs(b) === Math.abs(a)) b = nz(-15, 15);
        const A = `|${neg(a)}|`, B = `|${neg(b)}|`;
        return { q: `Which is greater: ${A} or ${B}?`, choices: [A, B, "They are equal"], answer: Math.abs(a) > Math.abs(b) ? A : B, explain: `${A} = ${Math.abs(a)} and ${B} = ${Math.abs(b)}.` };
      }
      const t1 = randInt(-12, 5), t2 = randInt(8, 32);
      return { q: `The temperature changes from ${neg(t1)} °C to ${t2} °C. By how many degrees did it change (the size of the change)?`, answer: t2 - t1, unit: "°C", explain: `|${t2} − ${par(t1)}| = ${t2 - t1} °C.` };
    },
  });
})();
