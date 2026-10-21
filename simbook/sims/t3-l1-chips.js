/* Term 3 · Lesson 1 · A. Adding and Subtracting Integers – Integer Chips */
(function () {
  "use strict";
  const { h, s, clear, randInt, pick, shuffle, tabs, segmented, stat, pill, Spring, elasticSlider, rubber, clamp } = Sim;

  const neg = (x) => (x < 0 ? "−" + Math.abs(x) : String(x));
  const par = (x) => (x < 0 ? `(${neg(x)})` : neg(x));
  const plural = (n, w) => `${n} ${w}${n === 1 ? "" : "s"}`;
  const kind = (sign) => (sign > 0 ? "positive" : "negative");

  // ------------------------------------------------------------ chip board (persistent chips)

  /** A board of + and − chips. Every chip is one persistent SVG node moved by its own spring. */
  function chipBoard(svg, layer, fx, onChange) {
    const chips = [], springs = new Set();
    const slot = (sign, i) => ({ x: 46 + (i % 12) * 46, y: (sign > 0 ? 64 : 214) + Math.floor(i / 12) * 44 });
    const live = (sign) => chips.filter((c) => !c.gone && c.sign === sign);
    const value = () => live(1).length - live(-1).length;

    function paint(c, [x, y, k]) {
      c.g.setAttribute("transform", `translate(${x.toFixed(1)},${y.toFixed(1)}) scale(${Math.max(0, k).toFixed(3)})`);
      if (c.gone && !c.sp.raf) { c.g.remove(); springs.delete(c.sp); const i = chips.indexOf(c); if (i >= 0) chips.splice(i, 1); }
    }
    function make(sign, from) {
      const g = s("g", { class: "token", tabindex: 0, "aria-label": `${kind(sign)} chip` });
      g.append(s("circle", { r: 18, fill: sign > 0 ? "var(--shape-a)" : "var(--shape-b)", stroke: "var(--paper)", "stroke-width": 2 }),
        s("text", { y: 7, "text-anchor": "middle", style: "font-size:22px", "font-weight": 700, fill: "var(--paper)", "font-family": "var(--mono)" }, sign > 0 ? "+" : "−"));
      const c = { sign, g, gone: false };
      c.sp = new Spring([from.x, from.y, 0], (v) => paint(c, v), { stiffness: 230, damping: 15 });
      springs.add(c.sp);
      Sim.draggable(svg, g, (p) => {
        if (c.gone) return;
        c.sp.stop();
        const v = [rubber(p.x, 22, 578), rubber(p.y, 22, 318), 1.15];
        c.sp.value = v; c.sp.vel = [0, 0, 0]; paint(c, v);
      }, () => {
        if (c.gone) return;
        const [x, y] = c.sp.value;
        const near = live(-c.sign).map((o) => ({ o, d: Math.hypot(o.sp.value[0] - x, o.sp.value[1] - y) })).sort((p, q) => p.d - q.d)[0];
        if (near && near.d < 40) annihilate(c, near.o); else layout();
        onChange();
      });
      layer.append(g);
      chips.push(c);
      return c;
    }
    function layout() {
      [1, -1].forEach((sign) => live(sign).forEach((c, i) => { const p = slot(sign, i); c.sp.set([p.x, p.y, 1]); }));
    }
    function add(sign, n, from) {
      for (let i = 0; i < n; i++) { if (live(sign).length >= 24) break; const p = slot(sign, live(sign).length); make(sign, from || p); }
      layout(); onChange();
    }
    /** A zero pair meets in the middle, overshoots, and pops into a ring that fades. */
    function annihilate(a, b) {
      const mx = (a.sp.value[0] + b.sp.value[0]) / 2, my = (a.sp.value[1] + b.sp.value[1]) / 2;
      a.gone = b.gone = true;
      a.sp.set([mx, my, 0]); b.sp.set([mx, my, 0]);
      const ring = s("circle", { cx: mx, cy: my, r: 1, fill: "none", stroke: "var(--gold)", "stroke-width": 3 });
      const zero = s("text", { x: mx, y: my + 7, "text-anchor": "middle", class: "svg-text", style: "font-size:20px", "font-weight": 700 }, "0");
      fx.append(ring, zero);
      const rs = new Spring(0, (v) => {
        ring.setAttribute("r", String(4 + v * 34)); ring.setAttribute("opacity", String(clamp(1 - v, 0, 1)));
        zero.setAttribute("opacity", String(clamp(1.2 - v, 0, 1)));
        if (!rs.raf) { ring.remove(); zero.remove(); springs.delete(rs); }
      }, { stiffness: 50, damping: 11 });
      springs.add(rs); rs.set(1);
      layout();
    }
    function pairOff() {
      const P = live(1), N = live(-1), m = Math.min(P.length, N.length);
      for (let i = 0; i < m; i++) annihilate(P[i], N[i]);
      onChange();
      return m;
    }
    function takeAway(sign, n) {
      const L = live(sign).slice(-n);
      L.forEach((c, i) => { c.gone = true; c.sp.set([660 + i * 12, c.sp.value[1] - 40, 0.4]); });
      layout(); onChange();
    }
    function reset() {
      chips.forEach((c) => { if (!c.gone) { c.gone = true; c.sp.set([c.sp.value[0], c.sp.value[1], 0]); } });
      onChange();
    }
    return { add, pairOff, takeAway, reset, value, live, stop: () => springs.forEach((sp) => sp.stop()) };
  }

  // ------------------------------------------------------------ tab 1: chip board

  function plan(a, b, op) {
    const steps = [];
    const sa = Math.sign(a), sb = Math.sign(b);
    steps.push({ text: a === 0 ? "Start with 0: an empty board." : `Start with ${neg(a)}: put ${plural(Math.abs(a), kind(sa) + " chip")} on the board.`, act: (B) => { B.reset(); if (a) B.add(sa, Math.abs(a)); } });
    if (op === "+") {
      if (b !== 0) steps.push({ text: `Add ${par(b)}: put ${plural(Math.abs(b), kind(sb) + " chip")} on the board.`, act: (B) => B.add(sb, Math.abs(b), { x: 300, y: 160 }) });
      if (a && b && sa !== sb) steps.push({ text: `Match each + chip with a − chip. Each zero pair is worth 0, so remove ${plural(Math.min(Math.abs(a), Math.abs(b)), "zero pair")}.`, act: (B) => B.pairOff() });
    } else if (b !== 0) {
      const have = a && sa === sb ? Math.abs(a) : 0, need = Math.abs(b) - have;
      if (need > 0) steps.push({ text: `You must take away ${plural(Math.abs(b), kind(sb) + " chip")}, but there ${have === 1 ? "is" : "are"} only ${have}. Add ${plural(need, "zero pair")} – that adds 0, so the board still shows ${neg(a)}.`, act: (B) => { B.add(1, need, { x: 300, y: 160 }); B.add(-1, need, { x: 300, y: 160 }); } });
      steps.push({ text: `Now take away ${plural(Math.abs(b), kind(sb) + " chip")}.`, act: (B) => B.takeAway(sb, Math.abs(b)) });
    }
    const r = op === "+" ? a + b : a - b;
    steps.push({ text: op === "+" ? `What is left is the sum: ${neg(a)} + ${par(b)} = ${neg(r)}.` : `What is left is the difference: ${neg(a)} − ${par(b)} = ${neg(r)}. Check: ${neg(a)} + ${par(-b)} = ${neg(r)} too – subtracting is adding the opposite.`, act: () => {}, done: true });
    return steps;
  }

  function board(root) {
    let a = 5, b = -3, op = "+", steps = [], at = 0;
    const svg = s("svg", { viewBox: "0 0 600 330", role: "img", "aria-label": "Integer chip board" });
    const bg = s("g"), layer = s("g"), fx = s("g");
    svg.append(bg, layer, fx);
    bg.append(s("rect", { x: 6, y: 6, width: 588, height: 318, rx: 14, fill: "var(--bg)", stroke: "var(--line)" }),
      s("line", { x1: 20, y1: 165, x2: 580, y2: 165, stroke: "var(--line)", "stroke-dasharray": "6 5" }),
      s("text", { x: 18, y: 30, class: "svg-label" }, "positive chips (+1 each)"), s("text", { x: 18, y: 318, class: "svg-label" }, "negative chips (−1 each)"));
    const eq = h("p", { class: "unit-big", "aria-live": "polite" });
    const say = h("p", { "aria-live": "polite" });
    const info = h("div", { class: "readout" });
    const B = chipBoard(svg, layer, fx, () => paintInfo());
    const nextB = h("button", { class: "btn", type: "button", onclick: () => advance() }, "Next step ▶");
    function paintInfo() {
      const P = B.live(1).length, N = B.live(-1).length;
      clear(info);
      info.append(stat("+ chips:", String(P)).el, stat("− chips:", String(N)).el, stat("Board value:", neg(P - N)).el, pill(Math.min(P, N) === 0, "no zero pairs left", `${plural(Math.min(P, N), "zero pair")} on the board`));
    }
    function setup() {
      steps = plan(a, b, op); at = 0;
      eq.textContent = `${neg(a)} ${op} ${par(b)} = ?`;
      steps[0].act(B); say.textContent = steps[0].text;
      nextB.disabled = false; nextB.textContent = "Next step ▶";
    }
    function advance() {
      if (at >= steps.length - 1) { setup(); return; }
      at++; steps[at].act(B); say.textContent = steps[at].text;
      if (steps[at].done) { eq.textContent = `${neg(a)} ${op} ${par(b)} = ${neg(op === "+" ? a + b : a - b)}`; nextB.textContent = "Replay ↺"; }
    }
    const slider = (id, label, v, set) => elasticSlider({ id, label, min: -6, max: 6, value: v, step: 1, format: (x) => neg(Math.round(x)), onChange: (x) => { set(Math.round(x)); setup(); } }).el;
    root.append(
      h("div", { class: "controls" }, slider("t3l1-a", "First number", a, (x) => { a = x; }), slider("t3l1-b", "Second number", b, (x) => { b = x; }),
        h("span", {}, "Operation"), segmented(["+", "−"], op, (v) => { op = v; setup(); })),
      eq, svg, say,
      h("div", { class: "controls" }, nextB,
        h("button", { class: "btn ghost", type: "button", onclick: () => B.add(1, 1, { x: 300, y: 60 }) }, "+ chip"),
        h("button", { class: "btn ghost", type: "button", onclick: () => B.add(-1, 1, { x: 300, y: 270 }) }, "− chip"),
        h("button", { class: "btn ghost", type: "button", onclick: () => { B.add(1, 1, { x: 300, y: 165 }); B.add(-1, 1, { x: 300, y: 165 }); } }, "+ zero pair"),
        h("button", { class: "btn ghost", type: "button", onclick: () => B.pairOff() }, "Remove zero pairs")),
      info,
      h("p", { class: "note" }, "Drag a + chip onto a − chip: a zero pair is worth 0, so they cancel. Adding or removing zero pairs never changes the value of the board."));
    setup();
    return () => B.stop();
  }

  // ------------------------------------------------------------ tab 2: number line hops

  function hops(root) {
    let a = -2, b = 5, op = "+", prog = 1;
    const X = (n) => 300 + n * 22, Y0 = 112;
    const svg = s("svg", { viewBox: "0 0 600 210", role: "img", "aria-label": "Hops on a number line" });
    const base = s("g"), dyn = s("g");
    svg.append(base, dyn);
    base.append(s("line", { x1: 22, y1: Y0, x2: 578, y2: Y0, stroke: "var(--ink)", "stroke-width": 2.5 }),
      s("path", { d: `M578,${Y0} l-10,-6 v12 z`, fill: "var(--ink)" }), s("path", { d: `M22,${Y0} l10,-6 v12 z`, fill: "var(--ink)" }));
    for (let n = -12; n <= 12; n++) {
      base.append(s("line", { x1: X(n), y1: Y0 - 7, x2: X(n), y2: Y0 + 7, stroke: "var(--ink)", "stroke-width": n === 0 ? 3 : 1.3 }));
      if (n % 2 === 0 || n === -1 || n === 1) base.append(s("text", { x: X(n), y: Y0 + 28, "text-anchor": "middle", class: "svg-text", style: "font-size:14px", fill: n < 0 ? "var(--shape-b)" : n > 0 ? "var(--shape-a)" : "var(--ink)" }, neg(n)));
    }
    const eq = h("p", { class: "unit-big", "aria-live": "polite" }), why = h("p", { class: "note" });
    const arc = (x1, x2, up, ht) => `M${x1},${Y0} Q${(x1 + x2) / 2},${Y0 + (up ? -1 : 1) * ht} ${x2},${Y0}`;
    function draw() {
      clear(dyn);
      const eff = op === "+" ? b : -b, d = eff * prog, dir = Math.sign(eff) || 1, up = dir > 0;
      const color = up ? "var(--shape-a)" : "var(--shape-b)";
      if (op === "−" && Math.abs(b) > 0.05) {
        dyn.append(s("path", { d: arc(X(a), X(a + b), b > 0, 20 + Math.abs(b) * 9), fill: "none", stroke: "var(--muted)", "stroke-width": 1.5, "stroke-dasharray": "5 5", opacity: 0.7 }),
          s("text", { x: (X(a) + X(a + b)) / 2, y: Y0 + (b > 0 ? -1 : 1) * (26 + Math.abs(b) * 4.5) + (b > 0 ? -2 : 12), "text-anchor": "middle", class: "svg-label", style: "font-size:13px" }, `+${par(Math.round(b))} would go this way`));
      }
      const whole = Math.floor(Math.abs(d) + 1e-9);
      let x = a;
      for (let k = 0; k <= whole; k++) {
        const len = Math.min(1, Math.abs(d) - k);
        if (len <= 0.01) break;
        const nx = x + dir * len;
        dyn.append(s("path", { d: arc(X(x), X(nx), up, 12 + len * 34), fill: "none", stroke: color, "stroke-width": 3, "stroke-linecap": "round" }));
        x = nx;
      }
      if (Math.abs(d) > 0.05) dyn.append(s("path", { d: `M${X(x)},${Y0} l${-dir * 11},${up ? -9 : 9} l${dir * 2},${up ? 7 : -7} z`, fill: color, stroke: color, "stroke-width": 2 }));
      dyn.append(s("circle", { cx: X(a), cy: Y0, r: 8, fill: "var(--ink)" }), s("text", { x: X(a), y: Y0 + (b * (op === "+" ? 1 : -1) < 0 ? -30 : 50), "text-anchor": "middle", class: "svg-label", style: "font-size:14px" }, "start"),
        s("circle", { cx: X(a + d), cy: Y0, r: 9, fill: "var(--accent)", stroke: "var(--paper)", "stroke-width": 2 }));
      const A = Math.round(a), Bv = Math.round(b), r = op === "+" ? A + Bv : A - Bv;
      eq.textContent = op === "+" ? `${neg(A)} + ${par(Bv)} = ${neg(r)}` : `${neg(A)} − ${par(Bv)} = ${neg(A)} + ${par(-Bv)} = ${neg(r)}`;
      why.textContent = op === "+"
        ? `Start at ${neg(A)}. Adding ${Bv >= 0 ? "a positive number hops RIGHT" : "a negative number hops LEFT"} ${plural(Math.abs(Bv), "unit")}.`
        : `Subtracting ${par(Bv)} is the same as adding its opposite, ${par(-Bv)}: the arrow flips and hops ${-Bv >= 0 ? "RIGHT" : "LEFT"} ${plural(Math.abs(Bv), "unit")}.`;
    }
    const sp = new Spring(1, (v) => { prog = v; draw(); }, { stiffness: 34, damping: 8 });
    const replay = () => { sp.jump(0); sp.set(1); };
    const slider = (id, label, v, set) => elasticSlider({ id, label, min: -6, max: 6, value: v, step: 1, format: (x) => neg(Math.round(x)), onInput: (x) => { set(x); sp.jump(1); }, onChange: () => replay() }).el;
    root.append(h("div", { class: "controls" }, slider("t3l1-ha", "Start", a, (x) => { a = x; }), slider("t3l1-hb", "Number", b, (x) => { b = x; }),
      h("span", {}, "Operation"), segmented(["+", "−"], op, (v) => { op = v; replay(); }),
      h("button", { class: "btn", type: "button", onclick: replay }, "Hop! ▶")),
    svg, eq, why);
    draw(); replay();
    return () => sp.stop();
  }

  // ------------------------------------------------------------ tab 3: bar model

  function bars(root) {
    let a = 7, b = -3, op = "+";
    const U = 29, X0 = 58, RH = 40;
    const svg = s("svg", { viewBox: "0 0 600 300", role: "img", "aria-label": "Bar model of an integer sum" });
    const out = h("p", { class: "unit-big", "aria-live": "polite" }), work = h("pre", { class: "workings" });
    let res = [X0, 0, 1];
    const resSp = new Spring(res, (v) => { res = v; draw(); }, { stiffness: 160, damping: 13 });
    function row(x, len, sign, y, dim, label) {
      const g = s("g");
      const L = Math.abs(len);
      if (L > 0.02) {
        g.append(s("rect", { x, y, width: L * U, height: RH, rx: 6, fill: sign > 0 ? "var(--shape-a-soft)" : "var(--shape-b-soft)", stroke: sign > 0 ? "var(--shape-a)" : "var(--shape-b)", "stroke-width": 2, opacity: dim ? 0.45 : 1 }));
        for (let k = 1; k < L; k++) g.append(s("line", { x1: x + k * U, y1: y, x2: x + k * U, y2: y + RH, stroke: sign > 0 ? "var(--shape-a)" : "var(--shape-b)", "stroke-width": 1, opacity: dim ? 0.3 : 0.6 }));
        for (let k = 0; k + 1 <= L + 1e-6; k++) g.append(s("text", { x: x + k * U + U / 2, y: y + 27, "text-anchor": "middle", class: "svg-text", style: "font-size:17px", "font-weight": 700, fill: sign > 0 ? "var(--shape-a)" : "var(--shape-b)", opacity: dim ? 0.45 : 1 }, sign > 0 ? "+" : "−"));
      }
      g.append(s("text", { x: 6, y: y + 26, class: "svg-text", style: "font-size:16px", "font-weight": 700 }, label));
      return g;
    }
    function draw() {
      clear(svg);
      const eff = op === "+" ? b : -b;
      const A = Math.abs(a), E = Math.abs(eff), sa = Math.sign(a) || 1, se = Math.sign(eff) || 1;
      const same = sa === se || A < 0.02 || E < 0.02;
      const bx = same ? X0 + A * U : X0;
      const m = same ? 0 : Math.min(A, E);
      if (m > 0.02) {
        svg.append(s("rect", { x: X0 - 4, y: 26, width: m * U + 8, height: 128, rx: 8, fill: "var(--gold-soft)", stroke: "var(--gold)", "stroke-width": 2, "stroke-dasharray": "6 4", opacity: 0.85 }));
        for (let k = 0; k + 1 <= m + 1e-6; k++) svg.append(s("line", { x1: X0 + k * U + U / 2, y1: 70, x2: X0 + k * U + U / 2, y2: 110, stroke: "var(--gold)", "stroke-width": 2 }));
        svg.append(s("text", { x: X0 + (m * U) / 2, y: 176, "text-anchor": "middle", class: "svg-text", style: "font-size:15px" }, `${plural(Math.round(m), "zero pair")} = 0`));
      }
      svg.append(s("text", { x: X0, y: 20, class: "svg-label", style: "font-size:15px" }, "first number"));
      svg.append(row(X0, a, sa, 30, false, neg(Math.round(a))));
      svg.append(s("text", { x: bx, y: 102, class: "svg-label", style: "font-size:15px" }, op === "+" ? "second number" : `opposite of ${par(Math.round(b))}`));
      svg.append(row(bx, eff, se, 110, false, neg(Math.round(eff))));
      const [rx, rlen, rs] = res;
      svg.append(s("text", { x: rx, y: 214, class: "svg-label", style: "font-size:15px" }, "what is left"));
      svg.append(row(rx, rlen, rs >= 0 ? 1 : -1, 222, false, `= ${neg(Math.round(a + eff))}`));
      svg.append(s("line", { x1: X0, y1: 192, x2: 590, y2: 192, stroke: "var(--line)" }));
      const Ar = Math.round(a), Br = Math.round(b), Er = op === "+" ? Br : -Br, R = Ar + Er;
      out.textContent = op === "+" ? `${neg(Ar)} + ${par(Br)} = ${neg(R)}` : `${neg(Ar)} − ${par(Br)} = ${neg(Ar)} + ${par(Er)} = ${neg(R)}`;
      work.textContent = Ar === 0 || Er === 0 ? `Adding 0 changes nothing: the answer is ${neg(R)}.`
        : Math.sign(Ar) === Math.sign(Er) ? `Same signs: join the bars. ${Math.abs(Ar)} + ${Math.abs(Er)} = ${Math.abs(R)}, and keep the sign → ${neg(R)}.`
          : `Different signs: ${Math.min(Math.abs(Ar), Math.abs(Er))} zero pairs cancel. ${Math.max(Math.abs(Ar), Math.abs(Er))} − ${Math.min(Math.abs(Ar), Math.abs(Er))} = ${Math.abs(R)} are left, with the sign of the longer bar → ${neg(R)}.`;
    }
    function target() {
      const eff = op === "+" ? b : -b, A = Math.abs(a), E = Math.abs(eff);
      const sa = Math.sign(a) || 1, se = Math.sign(eff) || 1, same = sa === se || A < 0.02 || E < 0.02;
      const sum = a + eff;
      if (same) return [X0, A + E, sum >= 0 ? 1 : -1];
      return [X0 + Math.min(A, E) * U, Math.abs(A - E), sum >= 0 ? 1 : -1];
    }
    const update = () => { resSp.set(target()); draw(); };
    const slider = (id, label, v, set) => elasticSlider({ id, label, min: -9, max: 9, value: v, step: 1, format: (x) => neg(Math.round(x)), onInput: (x) => { set(x); update(); } }).el;
    root.append(h("div", { class: "controls" }, slider("t3l1-ba", "First number", a, (x) => { a = x; }), slider("t3l1-bb", "Second number", b, (x) => { b = x; }),
      h("span", {}, "Operation"), segmented(["+", "−"], op, (v) => { op = v; update(); })),
    svg, out, work, h("p", { class: "note" }, "Each cell is one unit. A + cell and a − cell make a zero pair. For subtraction, the second bar is flipped to its opposite first."));
    resSp.jump(target());
    return () => resSp.stop();
  }

  // ------------------------------------------------------------ lesson

  Sim.register({
    id: "lesson19", unit: "H", num: 1, letter: "A", title: "Adding and Subtracting Integers", simName: "Integer Chips",
    comps: ["A1", "M1"], cycles: "C1,M2 – C2,M1", deped: "DepEd Week 1",
    bigQuestion: "If you owe ₱50 and then earn ₱80, how much do you really have?",
    mission: [
      "Chip Board: model −5 + 8 (owe ₱50, earn ₱80, in ₱10 chips). How many zero pairs cancel? What is left?",
      "Model 3 − (−2). Why do you need to add zero pairs before you can take away?",
      "Number Line Hops: compare 4 − 6 with 4 + (−6). What do you notice?",
      "Bar Model: show 7 + (−3). Which bar is longer, and how does that decide the sign?",
    ],
    discovery: "A positive chip and a negative chip make a zero pair worth 0. To add integers with the same sign, add their absolute values and keep the sign; with different signs, subtract the absolute values and take the sign of the one farther from 0. Subtracting an integer is the same as adding its opposite: a − b = a + (−b). So owing ₱50 and earning ₱80 leaves −50 + 80 = ₱30.",
    mount(stage) {
      const body = h("div", { class: "stage-body" });
      const views = [board, hops, bars];
      let stopper = null;
      const t = tabs(["Chip Board", "Number Line Hops", "Bar Model"], (i) => { if (stopper) stopper(); clear(body); stopper = views[i](body) || null; });
      stage.append(t.el, body);
      stopper = board(body);
      return () => { if (stopper) stopper(); };
    },
    check() {
      const k = randInt(0, 5);
      const nz = (lo, hi) => { let x = 0; while (x === 0) x = randInt(lo, hi); return x; };
      if (k === 0) { const a = nz(-15, 15), b = nz(-15, 15); return { q: `Add: ${neg(a)} + ${par(b)}`, answer: a + b, explain: `${neg(a)} + ${par(b)} = ${neg(a + b)}.` }; }
      if (k === 1) { const a = nz(-12, 12), b = nz(-12, 12); return { q: `Subtract: ${neg(a)} − ${par(b)}`, answer: a - b, explain: `Add the opposite: ${neg(a)} + ${par(-b)} = ${neg(a - b)}.` }; }
      if (k === 2) {
        const a = nz(-9, 9), b = nz(-9, 9);
        const right = `${neg(a)} + ${par(-b)}`;
        const opts = [...new Set([right, `${neg(a)} + ${par(b)}`, `${neg(-a)} + ${par(b)}`, `${neg(-a)} + ${par(-b)}`])];
        return { q: `Which addition gives the same answer as ${neg(a)} − ${par(b)}?`, choices: shuffle(opts), answer: right, explain: `Subtracting ${par(b)} is adding its opposite, ${par(-b)}.` };
      }
      if (k === 3) { const P = randInt(0, 9), N = randInt(0, 9); return { q: `A chip board has ${plural(P, "positive chip")} and ${plural(N, "negative chip")}. What integer does it show?`, answer: P - N, explain: `${Math.min(P, N)} zero pairs cancel, leaving ${neg(P - N)}.` }; }
      if (k === 4) { const owe = pick([30, 50, 60, 80, 120]), earn = pick([20, 40, 70, 80, 100, 150]); return { q: `Bea owes ₱${owe}, then earns ₱${earn}. What integer describes Bea’s money now?`, answer: earn - owe, unit: "₱", explain: `−${owe} + ${earn} = ${neg(earn - owe)}.` }; }
      return pick([
        { q: "What is the sum of a zero pair (one + chip and one − chip)?", choices: ["0", "1", "−1", "2"], answer: "0", explain: "+1 + (−1) = 0." },
        { q: "To model 2 − 5 with chips, you start with 2 positive chips. What must you do before taking away 5 positive chips?", choices: ["Add 3 zero pairs", "Add 3 negative chips", "Remove 2 chips", "Nothing"], answer: "Add 3 zero pairs", explain: "Zero pairs add 0, so the value stays 2 while giving you enough + chips." },
        { q: "The sum of two negative integers is always…", choices: ["negative", "positive", "zero", "it depends"], answer: "negative", explain: "Same signs: add the absolute values and keep the negative sign." },
      ]);
    },
  });
})();
