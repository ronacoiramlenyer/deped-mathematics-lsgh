/* Term 3 · Lesson 6 · F. Formulas: Solving for a Variable – Formula Rearranger */
(function () {
  "use strict";
  const { h, s, clear, randInt, pick, shuffle, fmt, tabs, segmented, stat, pill, Spring, elasticSlider, clamp } = Sim;

  const approx = (v, d = 2) => (Math.abs(v - Sim.round(v, d)) > 1e-9 ? "≈" : "=");
  const DIV = "Division Property of Equality", SUB = "Subtraction Property of Equality", MUL = "Multiplication Property of Equality", SYM = "Symmetric Property of Equality";

  /**
   * An equation is written as tokens separated by spaces; "|" joins tokens with no space,
   * and "text#key" gives a token its own identity, so the same term can be followed
   * as it moves from one side of the equal sign to the other.
   */
  function parse(str) {
    const toks = [], count = {};
    str.split(" ").forEach((grp) => grp.split("|").forEach((raw, j) => {
      let [t, k] = raw.split("#");
      if (k) k = "#" + k; else { count[t] = (count[t] || 0) + 1; k = t + "@" + count[t]; }
      toks.push({ t, k, tight: j > 0 });
    }));
    return toks;
  }

  /** S = product of factors: each variable factor can be made the subject in two steps. */
  function product(S, factors, what) {
    const targets = {};
    factors.forEach((f) => {
      if (!/^[A-Za-z]$/.test(f)) return;
      const others = factors.filter((g) => g !== f), by = others.join("");
      const div = others.length > 1 ? `(|${others.join("|")}|)` : others[0];
      targets[f] = [
        [`${S} ÷ ${div} = ${f}`, `Divide both sides by ${by}. On the right, ${factors.join("")} ÷ ${by} leaves ${f}.`, DIV],
        [`${f} = ${S} ÷ ${div}`, `Swap the sides so ${f} is on the left.`, SYM],
      ];
    });
    return { name: `${S} = ${factors.join("")}`, what, start: `${S} = ${factors.join("|")}`, targets };
  }

  const FORMULAS = [
    { name: "P = 2l + 2w", what: "perimeter of a rectangle", start: "P = 2#a|l + 2#b|w", targets: {
      l: [["P − 2#b|w = 2#a|l", "Subtract 2w from both sides. The +2w leaves the right side and appears on the left as −2w.", SUB],
        ["(|P − 2#b|w|) ÷ 2#a = l", "Divide both sides by 2.", DIV],
        ["l = (|P − 2#b|w|) ÷ 2#a", "Swap the sides so l is on the left.", SYM]],
      w: [["P − 2#a|l = 2#b|w", "Subtract 2l from both sides.", SUB],
        ["(|P − 2#a|l|) ÷ 2#b = w", "Divide both sides by 2.", DIV],
        ["w = (|P − 2#a|l|) ÷ 2#b", "Swap the sides so w is on the left.", SYM]] } },
    product("A", ["l", "w"], "area of a rectangle"),
    product("d", ["r", "t"], "distance = rate × time"),
    product("V", ["l", "w", "h"], "volume of a rectangular prism"),
    product("I", ["P", "r", "t"], "simple interest"),
    product("C", ["2", "π", "r"], "circumference of a circle"),
    { name: "F = (9/5)C + 32", what: "°C to °F", start: "F = (9/5)|C + 32", targets: {
      C: [["F − 32 = (9/5)|C", "Subtract 32 from both sides.", SUB],
        ["(5/9)|(|F − 32|) = C", "Multiply both sides by 5/9, the reciprocal of 9/5. On the right, (5/9)(9/5)C = C.", MUL],
        ["C = (5/9)|(|F − 32|)", "Swap the sides so C is on the left.", SYM]] } },
  ];

  // ------------------------------------------------------------ rearrange

  function rearrange(root) {
    let f = FORMULAS[0], target = "l", at = 0;
    const FS = 34, Y = 112;
    const svg = s("svg", { viewBox: "0 0 600 180", role: "img", "aria-label": "Formula being rearranged step by step" });
    const layer = s("g"); svg.append(layer);
    const nodes = new Map();
    let eqX = 300;
    const steps = () => [[f.start, `Start with the formula for the ${f.what}. Goal: get ${target} alone.`, null], ...f.targets[target]];
    const sp = new Spring(1, frame, { stiffness: 110, damping: 11 });
    function node(tok) {
      let n = nodes.get(tok.k);
      if (!n) { n = { el: s("text", { y: Y, class: "svg-text", style: `font-size:${FS}px` }), x: 300, o: 0, from: 300, to: 300, o0: 0, o1: 0 }; layer.append(n.el); nodes.set(tok.k, n); }
      n.el.textContent = tok.t;
      n.el.style.fontStyle = /^[A-Za-z]$/.test(tok.t) ? "italic" : "";
      return n;
    }
    function frame(k) {
      const kk = clamp(k, 0, 1);
      nodes.forEach((n) => {
        n.x = n.from + (n.to - n.from) * k;
        n.o = n.o0 + (n.o1 - n.o0) * kk;
        const y = Y - (n.cross ? 52 * Math.sin(Math.PI * kk) : 0) - (n.drop ? 34 * (1 - kk) : 0);
        n.el.setAttribute("x", n.x); n.el.setAttribute("y", y); n.el.setAttribute("opacity", n.o);
      });
    }
    const caption = h("div", { "aria-live": "polite" }), work = h("pre", { class: "workings" }), counter = stat("Step", "");
    const back = h("button", { class: "btn ghost", type: "button", onclick: () => go(at - 1) }, "◀ Back");
    const next = h("button", { class: "btn", type: "button", onclick: () => go(at + 1) }, "Next step ▶");
    function go(i, instant) {
      const list = steps();
      at = clamp(i, 0, list.length - 1);
      const toks = parse(list[at][0]);
      const used = toks.map(node);
      const ws = used.map((n, j) => { const w = n.el.getComputedTextLength ? n.el.getComputedTextLength() : 0; return w > 0 ? w : toks[j].t.length * FS * 0.6; });
      const gap = (j) => (j === 0 ? 0 : toks[j].tight ? 1 : FS * 0.36);
      const W = ws.reduce((a, w, j) => a + w + gap(j), 0);
      let x = 300 - W / 2;
      const pos = ws.map((w, j) => { x += gap(j); const p = x; x += w; return p; });
      const newEq = pos[toks.findIndex((t) => t.t === "=")] ?? 300;
      nodes.forEach((n) => { n.from = n.x; n.o0 = n.o; n.o1 = 0; n.to = n.x; n.cross = false; n.drop = false; n.el.style.fill = ""; n.el.style.fontWeight = ""; });
      used.forEach((n, j) => {
        const visible = n.o0 > 0.5;
        n.to = pos[j]; n.o1 = 1;
        if (!visible) { n.from = pos[j]; n.drop = !instant; }
        n.cross = visible && !instant && toks[j].t !== "=" && ((n.from < eqX) !== (pos[j] < newEq));
        if (n.cross) n.el.style.fill = "var(--shape-b)";
        else if (n.drop && toks[j].t !== "(" && toks[j].t !== ")") n.el.style.fill = "var(--shape-a)";
        if (toks[j].t === target) { n.el.style.fill = "var(--accent)"; n.el.style.fontWeight = "700"; }
      });
      eqX = newEq;
      if (instant) sp.jump(1); else { sp.jump(0); sp.set(1); }
      const [, say, prop] = list[at];
      clear(caption);
      caption.append(h("p", {}, say), prop ? pill(true, prop, "") : null);
      counter.set(`${at} of ${list.length - 1}`);
      work.textContent = list.slice(0, at + 1).map(([e], j) => `${j ? "→ " : "  "}${e.replace(/\|/g, "").replace(/#[a-z]/g, "")}`).join("\n") + (at === list.length - 1 ? `\n\n${target} is alone: the formula is solved for ${target}.` : "");
      back.disabled = at === 0; next.disabled = at === list.length - 1;
    }
    const targetBox = h("span", { class: "controls" });
    function choose(ff) {
      f = ff; clear(layer); nodes.clear(); eqX = 300;
      const ts = Object.keys(f.targets); target = ts[0];
      clear(targetBox);
      targetBox.append(h("span", {}, "Solve for:"), segmented(ts, target, (t) => { target = t; go(0, true); }));
      go(0, true);
    }
    root.append(h("div", { class: "controls" }, segmented(FORMULAS, FORMULAS[0], choose, (x) => x.name)), targetBox, svg, caption,
      h("div", { class: "controls" }, back, next, h("button", { class: "btn ghost", type: "button", onclick: () => go(0, true) }, "Reset"), counter.el), work,
      h("p", { class: "note" }, "Undo the operations around the variable in reverse order, doing the same thing to both sides. A term that “moves across” the equal sign really was added or subtracted on both sides."));
    choose(FORMULAS[0]);
    return () => sp.stop();
  }

  // ------------------------------------------------------------ use it

  const USES = [
    { name: "Trip time", formula: "d = rt  →  t = d ÷ r", vars: [["d", "Distance (km)", 30, 300, 10, 150], ["r", "Speed (km/h)", 20, 100, 5, 60]],
      out: (o) => o.d / o.r, sub: (o, t) => `t = d ÷ r = ${o.d} ÷ ${o.r} ${approx(t)} ${fmt(t, 2)} h`, check: (o, t) => `Check in d = rt: ${o.r} × ${fmt(t, 2)} ${approx(t)} ${fmt(o.r * t, 1)} = d ✓`,
      story: "A bus from Manila to Baguio travels at a steady speed. How long does the trip take?", draw: trip },
    { name: "Garden width", formula: "A = lw  →  w = A ÷ l", vars: [["A", "Area (m²)", 12, 48, 4, 24], ["l", "Length (m)", 2, 12, 1, 6]],
      out: (o) => o.A / o.l, sub: (o, w) => `w = A ÷ l = ${o.A} ÷ ${o.l} ${approx(w)} ${fmt(w, 2)} m`, check: (o, w) => `Check in A = lw: ${o.l} × ${fmt(w, 2)} ${approx(w)} ${fmt(o.l * w, 1)} = A ✓`,
      story: "A school vegetable garden must have a given area. How wide is it for each length?", draw: (svg, v) => rect(svg, v[2], v[0], "l", "w") },
    { name: "Fence length", formula: "P = 2l + 2w  →  l = (P − 2w) ÷ 2", vars: [["P", "Perimeter (m)", 20, 60, 2, 30], ["w", "Width (m)", 2, 9, 1, 5]],
      out: (o) => (o.P - 2 * o.w) / 2, sub: (o, l) => `l = (P − 2w) ÷ 2 = (${o.P} − ${2 * o.w}) ÷ 2 = ${fmt(l, 2)} m`, check: (o, l) => `Check in P = 2l + 2w: 2(${fmt(l, 2)}) + 2(${o.w}) = ${fmt(2 * l + 2 * o.w, 1)} = P ✓`,
      story: "A rectangular pen is fenced with a fixed length of fencing. How long is it for each width?", draw: (svg, v) => rect(svg, v[0], v[2], "l", "w") },
    { name: "Baguio temperature", formula: "F = (9/5)C + 32  →  C = (5/9)(F − 32)", vars: [["F", "Temperature (°F)", 50, 95, 1, 59]],
      out: (o) => (5 / 9) * (o.F - 32), sub: (o, c) => `C = (5/9)(F − 32) = (5/9)(${o.F} − 32) ${approx(c, 1)} ${fmt(c, 1)} °C`, check: (o, c) => `Check in F = (9/5)C + 32: (9/5)(${fmt(c, 2)}) + 32 ${approx(c)} ${fmt((9 / 5) * c + 32, 1)} = F ✓`,
      story: "A weather app shows Baguio’s temperature in °F. What is it in °C?", draw: thermo },
  ];

  function trip(svg, [t, d, r]) {
    const k = 520 / 300, L = d * k;
    svg.append(s("text", { x: 40, y: 44, class: "svg-label", style: "font-size:17px" }, `Each block = ${fmt(r, 0)} km = 1 hour of travel`));
    const full = Math.floor(t + 1e-9);
    for (let i = 0; i < Math.ceil(t - 1e-9); i++) {
      const w = Math.min(1, t - i) * r * k;
      svg.append(s("rect", { x: 40 + i * r * k, y: 70, width: w, height: 60, fill: i % 2 ? "var(--shape-a-soft)" : "var(--gold-soft)", stroke: "var(--ink)", "stroke-width": 1.5 }));
      if (w > 34) svg.append(s("text", { x: 40 + i * r * k + w / 2, y: 106, "text-anchor": "middle", class: "svg-text", style: "font-size:18px" }, i < full ? "1 h" : `${fmt(t - i, 2)} h`));
    }
    svg.append(s("line", { x1: 40, y1: 150, x2: 40 + L, y2: 150, stroke: "var(--ink)", "stroke-width": 3 }),
      s("text", { x: 40, y: 178, class: "svg-text", style: "font-size:17px" }, "0 km"), s("text", { x: 40 + L, y: 178, "text-anchor": "end", class: "svg-text", style: "font-size:17px" }, `${fmt(d, 0)} km`),
      s("text", { x: 300, y: 214, "text-anchor": "middle", class: "svg-text", style: "font-size:20px", "font-weight": 700 }, `t ≈ ${fmt(t, 2)} hours`));
  }
  function rect(svg, l, w, ln, wn) {
    const sc = Math.min(440 / Math.max(l, 0.1), 170 / Math.max(w, 0.1), 40), W = l * sc, H = w * sc, x = 300 - W / 2, y = 112 - H / 2;
    svg.append(s("rect", { x, y, width: W, height: H, fill: "var(--shape-a-soft)", stroke: "var(--shape-a)", "stroke-width": 3 }));
    svg.append(s("text", { x: 300, y: y - 8, "text-anchor": "middle", class: "svg-text", style: "font-size:18px" }, `${ln} = ${fmt(l, 2)} m`),
      s("text", { x: x + W + 8, y: 117, class: "svg-text", style: "font-size:18px" }, `${wn} = ${fmt(w, 2)} m`));
  }
  function thermo(svg, [c, F]) {
    const Yf = (v) => 200 - ((v - 50) / 50) * 170; // 50–100 °F
    const Yc = (v) => Yf((9 / 5) * v + 32);
    svg.append(s("rect", { x: 285, y: 22, width: 30, height: 184, rx: 15, fill: "var(--paper)", stroke: "var(--ink)", "stroke-width": 2 }),
      s("rect", { x: 291, y: Yf(F), width: 18, height: 204 - Yf(F), rx: 9, fill: "var(--shape-b)" }),
      s("circle", { cx: 300, cy: 212, r: 18, fill: "var(--shape-b)", stroke: "var(--ink)", "stroke-width": 2 }));
    for (let v = 50; v <= 100; v += 10) svg.append(s("line", { x1: 268, y1: Yf(v), x2: 285, y2: Yf(v), stroke: "var(--ink)" }), s("text", { x: 262, y: Yf(v) + 5, "text-anchor": "end", class: "svg-text", style: "font-size:14px" }, `${v} °F`));
    for (let v = 10; v <= 35; v += 5) svg.append(s("line", { x1: 315, y1: Yc(v), x2: 332, y2: Yc(v), stroke: "var(--ink)" }), s("text", { x: 338, y: Yc(v) + 5, class: "svg-text", style: "font-size:14px" }, `${v} °C`));
    svg.append(s("text", { x: 120, y: Yf(F) + 6, "text-anchor": "middle", class: "svg-text", style: "font-size:20px", "font-weight": 700 }, `${fmt(F, 0)} °F`),
      s("text", { x: 480, y: Yf(F) + 6, "text-anchor": "middle", class: "svg-text", style: "font-size:20px", "font-weight": 700 }, `${fmt(c, 1)} °C`));
  }

  function useIt(root) {
    let u = USES[0], vals = {};
    const svg = s("svg", { viewBox: "0 0 600 235", role: "img", "aria-label": "Picture of the formula in use" });
    const story = h("p", {}), formula = h("p", { class: "unit-big" }), sliders = h("div", { class: "controls" }), work = h("pre", { class: "workings" }), ok = h("div");
    let shown = [0];
    const sp = new Spring([0], (v) => { shown = v; clear(svg); u.draw(svg, shown); }, { stiffness: 160, damping: 15 });
    function setup(uu) {
      u = uu; vals = {};
      u.vars.forEach(([n, , , , , v]) => { vals[n] = v; });
      story.textContent = u.story; formula.textContent = u.formula;
      clear(sliders);
      u.vars.forEach(([n, label, a, b, step, v]) => sliders.append(elasticSlider({ id: `t3l6-${n}`, label, min: a, max: b, value: v, step, format: (x) => fmt(Math.round(x / step) * step, 0),
        onInput: (x) => { const r = clamp(Math.round(x / step) * step, a, b); if (r !== vals[n]) { vals[n] = r; update(); } } }).el));
      sp.jump(target());
      update();
    }
    const target = () => [u.out(vals), ...u.vars.map(([n]) => vals[n])];
    function update() {
      const res = u.out(vals);
      work.textContent = `${u.sub(vals, res)}\n${u.check(vals, res)}`;
      clear(ok); ok.append(pill(true, "Substituting back gives the original value – the rearranged formula works.", ""));
      sp.set(target());
    }
    root.append(h("div", { class: "controls" }, segmented(USES, USES[0], setup, (x) => x.name)), story, formula, sliders, svg, work, ok,
      h("p", { class: "note" }, "Solve the formula for the unknown first, then substitute. To check, put the answer back into the ORIGINAL formula."));
    setup(USES[0]);
    return () => sp.stop();
  }

  // ------------------------------------------------------------ lesson

  Sim.register({
    id: "lesson24", unit: "I", num: 6, letter: "F", title: "Formulas: Solving for a Variable", simName: "Formula Rearranger",
    comps: ["A10", "M6"], cycles: "C6,M2 – C6,M5", deped: "DepEd Week 6",
    bigQuestion: "How can one letter stand for every possible number?",
    mission: [
      "Rearrange: solve d = rt for t. Which property does each step use?",
      "Rearrange: solve P = 2l + 2w for l. Watch the 2w cross the equal sign: what happens to its sign?",
      "Rearrange: solve F = (9/5)C + 32 for C. Why do you multiply by 5/9?",
      "Use It: how long is a 150-km trip at 60 km/h? Check your answer in d = rt.",
    ],
    discovery: "A formula is an equation with two or more variables. To solve it for one variable, undo the operations around that variable in reverse order, doing the same thing to both sides (the properties of equality). Each letter in the new formula still stands for every possible value, so one rearranged formula answers a whole family of problems – and substituting the answer back into the original formula checks it.",
    mount(stage) {
      const body = h("div", { class: "stage-body" });
      const views = [rearrange, useIt];
      let stopper = null;
      const t = tabs(["Rearrange", "Use It"], (i) => { if (stopper) stopper(); clear(body); stopper = views[i](body) || null; });
      stage.append(t.el, body);
      stopper = rearrange(body);
      return () => { if (stopper) stopper(); };
    },
    check() {
      const kind = randInt(0, 4);
      if (kind === 0) return pick([
        { q: "Solve d = rt for t.", choices: ["t = d ÷ r", "t = r ÷ d", "t = dr", "t = d − r"], answer: "t = d ÷ r", explain: "Divide both sides by r." },
        { q: "Solve A = lw for w.", choices: ["w = A ÷ l", "w = l ÷ A", "w = Al", "w = A − l"], answer: "w = A ÷ l", explain: "Divide both sides by l." },
        { q: "Solve P = 2l + 2w for l.", choices: ["l = (P − 2w) ÷ 2", "l = P − 2w", "l = (P + 2w) ÷ 2", "l = P ÷ 2 − 2w"], answer: "l = (P − 2w) ÷ 2", explain: "Subtract 2w from both sides, then divide both sides by 2." },
        { q: "Solve C = 2πr for r.", choices: ["r = C ÷ (2π)", "r = 2πC", "r = C − 2π", "r = 2π ÷ C"], answer: "r = C ÷ (2π)", explain: "Divide both sides by 2π." },
        { q: "Solve I = Prt for P.", choices: ["P = I ÷ (rt)", "P = Irt", "P = I − rt", "P = rt ÷ I"], answer: "P = I ÷ (rt)", explain: "Divide both sides by rt." },
        { q: "Solve V = lwh for h.", choices: ["h = V ÷ (lw)", "h = Vlw", "h = V − lw", "h = lw ÷ V"], answer: "h = V ÷ (lw)", explain: "Divide both sides by lw." },
      ]);
      if (kind === 1) { const r = pick([40, 50, 60, 80]), t = pick([1.5, 2, 2.5, 3, 4]); return { q: `A trip of ${r * t} km at ${r} km/h takes how many hours? (t = d ÷ r)`, answer: t, unit: "h", explain: `t = ${r * t} ÷ ${r} = ${fmt(t, 1)} h.` }; }
      if (kind === 2) { const l = randInt(3, 12), w = randInt(2, 9); return { q: `A rectangle has area ${l * w} m² and length ${l} m. What is its width? (w = A ÷ l)`, answer: w, unit: "m", explain: `w = ${l * w} ÷ ${l} = ${w} m.` }; }
      if (kind === 3) { const l = randInt(5, 15), w = randInt(2, 8); return { q: `A rectangle has perimeter ${2 * l + 2 * w} m and width ${w} m. What is its length? (l = (P − 2w) ÷ 2)`, answer: l, unit: "m", explain: `l = (${2 * l + 2 * w} − ${2 * w}) ÷ 2 = ${l} m.` }; }
      const c = pick([10, 15, 20, 25, 30, 35]); const F = (9 / 5) * c + 32;
      return { q: `Baguio reads ${F} °F. What is that in °C? (C = (5/9)(F − 32))`, answer: c, unit: "°C", explain: `(5/9)(${F} − 32) = (5/9)(${F - 32}) = ${c} °C.` };
    },
  });
})();
