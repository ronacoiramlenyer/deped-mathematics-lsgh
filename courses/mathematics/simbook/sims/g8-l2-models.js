/* Math 8 · Lesson 2 · B. Algebraic Expressions as Models – Expression Modeler */
(function () {
  "use strict";
  const { h, s, clear, randInt, pick, shuffle, fmt, tabs, segmented, stat, pill, Spring, elasticSlider, clamp } = Sim;

  // ------------------------------------------------------------ a tiny expression reader

  /** Reads a token string such as "2 (x+3)" or "99 + 5 d" into a function of one variable (null if invalid). */
  function compile(src, v) {
    const lex = [];
    const re = /\s*(\d+(?:\.\d+)?|[a-z]|[-+*/()^])/gy;
    let m, i = 0;
    src = src.trim();
    while (i < src.length) {
      re.lastIndex = i; m = re.exec(src);
      if (!m) return null;
      lex.push(m[1]); i = re.lastIndex;
      while (src[i] === " ") i++;
    }
    let p = 0;
    const peek = () => lex[p], isNum = (t) => /^\d/.test(t || ""), isVar = (t) => /^[a-z]$/.test(t || "");
    function expr() {
      let f = term(); if (!f) return null;
      while (peek() === "+" || peek() === "-") {
        const op = lex[p++], g = term(); if (!g) return null;
        const a = f; f = op === "+" ? (x) => a(x) + g(x) : (x) => a(x) - g(x);
      }
      return f;
    }
    function term() {
      let f = unary(); if (!f) return null;
      for (;;) {
        const t = peek();
        if (t === "*" || t === "/") {
          p++; const g = unary(); if (!g) return null;
          const a = f; f = t === "*" ? (x) => a(x) * g(x) : (x) => a(x) / g(x);
        } else if (isVar(t) || t === "(") {
          const g = power(); if (!g) return null;
          const a = f; f = (x) => a(x) * g(x);
        } else return f;
      }
    }
    function unary() { if (peek() === "-") { p++; const g = unary(); return g ? (x) => -g(x) : null; } return power(); }
    function power() {
      const a = atom(); if (!a) return null;
      if (peek() === "^") { p++; const e = lex[p++]; if (!isNum(e)) return null; return (x) => a(x) ** Number(e); }
      return a;
    }
    function atom() {
      const t = lex[p++];
      if (isNum(t)) { const n = Number(t); if (isNum(peek())) return null; return () => n; }
      if (isVar(t)) return t === v ? (x) => x : null;
      if (t === "(") { const f = expr(); if (!f || lex[p++] !== ")") return null; return f; }
      return null;
    }
    const f = expr();
    return f && p === lex.length ? f : null;
  }
  const same = (f, g) => [0.5, 1, 2, 3.7, 6].every((x) => Math.abs(f(x) - g(x)) < 1e-6 * (1 + Math.abs(g(x))));

  /** Smoothly moves a node from an old screen rectangle to where it is now (FLIP). */
  function flyFrom(node, from, springs, done) {
    const to = node.getBoundingClientRect();
    const sp = new Spring([from.left - to.left, from.top - to.top], ([x, y]) => { node.style.transform = `translate(${x}px,${y}px)`; if (done && Math.abs(x) + Math.abs(y) < 0.01) done(); }, { stiffness: 190, damping: 16 });
    sp.jump(sp.value); sp.set([0, 0]); springs.push(sp);
    return sp;
  }
  /** Runs mutate(), then springs every child of box from its old place to its new one. */
  function reflow(box, mutate, springs) {
    const before = new Map([...box.children].map((c) => [c, c.getBoundingClientRect()]));
    mutate();
    [...box.children].forEach((c) => { const r = before.get(c); if (r) flyFrom(c, r, springs); });
  }
  function shake(node, springs) {
    const sp = new Spring(0, (x) => { node.style.transform = `translateX(${x}px)`; }, { stiffness: 600, damping: 12 });
    sp.jump(0); sp.vel = 520; sp.set(0); springs.push(sp);
  }

  // ------------------------------------------------------------ models

  const MODELS = [
    { key: "per", name: "Garden perimeter", v: "x", unit: "m", min: 1, max: 8, step: 0.5, start: 4,
      text: "A rectangular garden for the LSGH Family Day booth is x m wide and 3 m longer than it is wide. Build an expression for the length of fence around it (its PERIMETER).",
      target: (x) => 4 * x + 6, model: "2x + 2(x + 3), or 4x + 6",
      tokens: [["x", "x"], ["2", "2"], ["3", "3"], ["4", "4"], ["6", "6"], ["+", "+"], ["×", "*"], ["(", "("], [")", ")"], ["x²", "x^2"]],
      parts: [["x", "the width of the garden, in metres (the variable)"], ["x + 3", "the length: 3 m longer than the width"], ["2x + 2(x + 3)", "two widths plus two lengths – once around the garden"], ["4x + 6", "the same perimeter, simplified: 4 is the coefficient of x and 6 is a constant"]] },
    { key: "area", name: "Garden area", v: "x", unit: "m²", min: 1, max: 8, step: 0.5, start: 4,
      text: "The same garden is x m wide and (x + 3) m long. Build an expression for the space it covers (its AREA).",
      target: (x) => x * (x + 3), model: "x(x + 3), or x² + 3x",
      tokens: [["x", "x"], ["x²", "x^2"], ["2", "2"], ["3", "3"], ["3x", "3x"], ["+", "+"], ["×", "*"], ["(", "("], [")", ")"]],
      parts: [["x", "the width, in metres"], ["(x + 3)", "the length, in metres"], ["x(x + 3)", "width × length, the area in square metres"], ["x² + 3x", "the same area as an x-by-x square plus a 3-by-x strip"]] },
    { key: "fare", name: "Jeepney fare", v: "k", unit: "₱", min: 0, max: 12, step: 1, start: 3,
      text: "A sample jeepney fare is ₱13 for the first 4 km, plus ₱1.80 for each additional kilometre. Let k be the number of additional kilometres. Build the fare.",
      target: (k) => 13 + 1.8 * k, model: "13 + 1.80k",
      tokens: [["13", "13"], ["1.80", "1.80"], ["4", "4"], ["k", "k"], ["+", "+"], ["−", "-"], ["×", "*"]],
      parts: [["13", "the minimum fare for the first 4 km – a constant"], ["k", "the number of kilometres after the first 4 – the variable"], ["1.80k", "₱1.80 for each of those k kilometres (1.80 is the coefficient)"], ["13 + 1.80k", "the total fare in pesos"]] },
    { key: "load", name: "Load plan", v: "d", unit: "₱", min: 0, max: 30, step: 1, start: 7,
      text: "A prepaid load plan costs ₱99 to register, plus ₱5 for each day of unlimited data. Build the total cost for d days.",
      target: (d) => 99 + 5 * d, model: "99 + 5d",
      tokens: [["99", "99"], ["5", "5"], ["d", "d"], ["+", "+"], ["−", "-"], ["×", "*"], ["104", "104"]],
      parts: [["99", "the one-time registration fee – a constant"], ["d", "the number of days – the variable"], ["5d", "₱5 for each of the d days"], ["99 + 5d", "the total cost in pesos"]] },
  ];

  const showVal = (M, y) => (M.unit === "₱" ? `₱${fmt(y, 2)}` : `${fmt(y, 2)} ${M.unit}`);
  const joinLabels = (labels) => labels.reduce((acc, t, i) => {
    if (!i) return t;
    const prev = labels[i - 1];
    if (["+", "−", "×"].includes(t) || ["+", "−", "×"].includes(prev)) return `${acc} ${t}`;
    return acc + t;
  }, "");

  // ------------------------------------------------------------ build the model

  function build(root) {
    let M = MODELS[0], val = M.start, built = [], sliderGen = 0;
    const springs = [];
    const area = h("div", { class: "stage-body" });
    const svg = s("svg", { viewBox: "0 0 640 270", role: "img", "aria-label": "A picture of the situation that resizes with the variable" });
    const tray = h("div", { class: "choices", style: "min-height:46px;padding:6px;border:2px dashed var(--line);border-radius:10px;align-items:center" });
    const bank = h("div", { class: "choices" });
    const status = h("div"), compare = h("div", { class: "readout" }), meaning = h("div");
    const sliderBox = h("div", { class: "controls" });
    let shown = M.start;
    const picSp = new Spring(shown, (v) => { shown = v; draw(); }, { stiffness: 200, damping: 16 });

    function draw() {
      clear(svg);
      const v = shown;
      if (M.key === "per" || M.key === "area") {
        const S = 24, w = v * S, L = (v + 3) * S, x0 = 320 - L / 2, y0 = 130 - w / 2;
        if (M.key === "area") {
          for (let i = 1; i < v + 3; i++) svg.append(s("line", { x1: x0 + i * S, y1: y0, x2: x0 + i * S, y2: y0 + w, stroke: "var(--shape-a)", "stroke-opacity": 0.25 }));
          for (let j = 1; j < v; j++) svg.append(s("line", { x1: x0, y1: y0 + j * S, x2: x0 + L, y2: y0 + j * S, stroke: "var(--shape-a)", "stroke-opacity": 0.25 }));
        }
        svg.append(s("rect", { x: x0, y: y0, width: L, height: w, fill: M.key === "area" ? "var(--shape-a-soft)" : "var(--good)", "fill-opacity": M.key === "area" ? 1 : 0.12, stroke: M.key === "per" ? "var(--accent)" : "var(--shape-a)", "stroke-width": M.key === "per" ? 5 : 2 }));
        svg.append(s("text", { x: 320, y: y0 - 12, "text-anchor": "middle", class: "svg-text", "font-size": 20 }, `x + 3 = ${fmt(v + 3, 1)} m`));
        svg.append(s("text", { x: x0 - 10, y: 140, "text-anchor": "end", class: "svg-text", "font-size": 20 }, `x = ${fmt(v, 1)} m`));
        svg.append(s("text", { x: 320, y: y0 + w + 28, "text-anchor": "middle", class: "svg-label", "font-size": 19 }, M.key === "per" ? `fence: ${fmt(4 * v + 6, 1)} m` : `area: ${fmt(v * (v + 3), 2)} m²`));
      } else if (M.key === "fare") {
        const K = (km) => 30 + km * 35;
        svg.append(s("rect", { x: K(0), y: 150, width: K(4) - K(0), height: 14, fill: "var(--shape-b-soft)" }), s("rect", { x: K(4), y: 150, width: Math.max(0, K(4 + v) - K(4)), height: 14, fill: "var(--gold-soft)", stroke: "var(--gold)" }));
        svg.append(s("line", { x1: K(0), y1: 164, x2: K(16), y2: 164, stroke: "var(--ink)", "stroke-width": 2 }));
        for (let km = 0; km <= 16; km++) svg.append(s("line", { x1: K(km), y1: 160, x2: K(km), y2: 170, stroke: "var(--ink)" }), km % 2 ? null : s("text", { x: K(km), y: 194, "text-anchor": "middle", class: "svg-text", "font-size": 19 }, String(km)));
        svg.append(s("text", { x: K(2), y: 222, "text-anchor": "middle", class: "svg-label", "font-size": 19 }, "first 4 km: ₱13"));
        if (v > 0.3) svg.append(s("text", { x: Math.max(K(4) + 120, (K(4) + K(4 + v)) / 2), y: 252, "text-anchor": "middle", class: "svg-label", "font-size": 19 }, `k = ${fmt(v, 1)} km × ₱1.80`));
        const jx = K(4 + v);
        const jeep = s("g", { transform: `translate(${jx - 72},80) scale(1.2)` });
        jeep.append(s("rect", { x: 0, y: 8, width: 64, height: 38, rx: 6, fill: "var(--shape-a)" }), s("rect", { x: 6, y: 14, width: 40, height: 14, rx: 2, fill: "var(--paper)" }), s("rect", { x: 50, y: 14, width: 10, height: 14, rx: 2, fill: "var(--paper)" }),
          s("rect", { x: -2, y: 2, width: 68, height: 8, rx: 3, fill: "var(--gold)" }), s("circle", { cx: 14, cy: 48, r: 8, fill: "var(--ink)" }), s("circle", { cx: 50, cy: 48, r: 8, fill: "var(--ink)" }));
        svg.append(jeep, s("text", { x: 320, y: 44, "text-anchor": "middle", class: "svg-text", "font-size": 22, "font-weight": 700 }, `fare = ₱${fmt(13 + 1.8 * v, 2)}`));
      } else {
        const P = 2.2, base = 99 * P, add = 5 * v * P;
        svg.append(s("rect", { x: 30, y: 100, width: base, height: 70, fill: "var(--shape-b)", opacity: 0.8 }), s("text", { x: 30 + base / 2, y: 142, "text-anchor": "middle", class: "svg-text", "font-size": 20, fill: "var(--paper)" }, "₱99"));
        for (let i = 0; i < Math.ceil(v - 1e-9); i++) svg.append(s("rect", { x: 30 + base + i * 5 * P, y: 100, width: Math.max(0, Math.min(1, v - i)) * 5 * P - 1, height: 70, fill: "var(--gold)", opacity: 0.85 }));
        svg.append(s("text", { x: Math.max(30 + base + 80, 30 + base + add / 2), y: 200, "text-anchor": "middle", class: "svg-label", "font-size": 19 }, v > 0.5 ? `${fmt(v, 1)} days × ₱5` : ""));
        svg.append(s("text", { x: 320, y: 70, "text-anchor": "middle", class: "svg-text", "font-size": 22, "font-weight": 700 }, `total = ₱${fmt(99 + 5 * v, 2)}`));
      }
    }

    function evaluate() {
      clear(status); clear(compare); clear(meaning);
      const labels = built.map((b) => b.label), src = built.map((b) => b.src).join(" ");
      const f = built.length ? compile(src, M.v) : null;
      const x = Math.round(val / M.step) * M.step, truth = M.target(x);
      compare.append(stat(`At ${M.v} = ${fmt(x, 1)}, the situation gives`, showVal(M, truth)).el);
      if (!built.length) { status.append(h("p", { class: "note" }, "Tap the tokens to build your expression. Tap a token in the tray to take it back.")); return; }
      if (!f) { status.append(pill(false, "", `“${joinLabels(labels)}” is not a complete expression yet.`)); return; }
      const y = f(x);
      compare.append(stat("your expression gives", Number.isFinite(y) ? showVal(M, y) : "undefined").el);
      const ok = same(f, M.target);
      status.append(pill(ok, `Your model works for every ${M.v}!`, `Not yet – your expression does not match the situation for every ${M.v}.`));
      if (ok) meaning.append(h("p", { class: "note" }, `A model: ${M.model}. What each part means:`),
        h("div", { class: "table-wrap" }, h("table", { class: "data" }, h("tbody", {}, M.parts.map(([a, b]) => h("tr", {}, h("td", { style: "white-space:nowrap;font-family:var(--mono)" }, a), h("td", {}, b)))))));
    }
    function addToken(lab, src, btn) {
      const from = btn.getBoundingClientRect();
      const chip = h("button", { type: "button", class: "num", "aria-label": `Remove ${lab}` }, lab);
      const item = { label: lab, src, chip };
      chip.addEventListener("click", () => {
        reflow(tray, () => { chip.remove(); built = built.filter((b) => b !== item); }, springs);
        evaluate();
      });
      built.push(item); tray.append(chip);
      flyFrom(chip, from, springs);
      evaluate();
    }
    function load(key) {
      M = MODELS.find((m) => m.key === key); val = M.start; built = [];
      clear(area); clear(tray); clear(bank); clear(sliderBox);
      M.tokens.forEach(([lab, src]) => { const b = h("button", { type: "button", class: "num" }, lab); b.addEventListener("click", () => addToken(lab, src, b)); bank.append(b); });
      const gen = ++sliderGen;
      sliderBox.append(elasticSlider({ id: "g8l2-var", label: `${M.v} =`, min: M.min, max: M.max, value: val, step: M.step, format: (v) => fmt(v, 1),
        onInput: (v) => { if (gen !== sliderGen) return; val = v; picSp.stop(); shown = v; picSp.value = v; draw(); }, onChange: (v) => { if (gen !== sliderGen) return; val = v; picSp.set(v); evaluate(); } }).el);
      area.append(h("p", {}, M.text), h("p", { class: "note" }, "Token bank"), bank, h("p", { class: "note" }, "Your expression"), tray,
        h("div", { class: "controls" }, h("button", { class: "btn ghost", type: "button", onclick: () => { reflow(tray, () => clear(tray), springs); built = []; evaluate(); } }, "Clear")),
        status, sliderBox, svg, compare, meaning);
      picSp.set(val);
      evaluate();
    }
    root.append(h("div", { class: "controls" }, segmented(MODELS.map((m) => m.key), "per", load, (k) => MODELS.find((m) => m.key === k).name)), area);
    load("per");
    return () => { picSp.stop(); springs.forEach((x) => x.stop()); };
  }

  // ------------------------------------------------------------ match it

  const PAIRS = [
    ["five more than twice a number n", "2n + 5"],
    ["the cost of n packs of pancit at ₱45 each", "45n"],
    ["₱500 shared equally among n friends", "500 ÷ n"],
    ["three less than a number n", "n − 3"],
    ["a number n subtracted from 3", "3 − n"],
    ["the perimeter of a square with side n cm", "4n"],
    ["the area of a square with side n cm", "n²"],
    ["twice the sum of a number n and 4", "2(n + 4)"],
    ["Bea’s age 5 years from now, if Bea is n years old now", "n + 5"],
    ["a jeepney fare of ₱13 plus ₱2 for each of n additional km", "13 + 2n"],
  ];

  function match(root) {
    const springs = [];
    const area = h("div", { class: "stage-body" });
    function deal() {
      clear(area);
      const set = shuffle(PAIRS).slice(0, 5);
      let active = 0, matched = 0, misses = 0;
      const rows = set.map(([phrase, expr], i) => {
        const slot = h("span", { class: "num", style: "display:inline-block;min-width:6.5em;min-height:1.6em;padding:4px 10px;border:2px dashed var(--line);border-radius:8px" });
        const row = h("button", { type: "button", style: "display:flex;justify-content:space-between;align-items:center;gap:10px;width:100%;text-align:left;padding:8px 10px;border:1px solid var(--line);border-radius:10px;background:var(--bg);cursor:pointer;color:var(--ink)" }, h("span", {}, phrase), slot);
        row.addEventListener("click", () => { if (!row.dataset.done) { active = i; mark(); } });
        return { row, slot, expr, phrase };
      });
      const bank = h("div", { class: "choices" });
      const msg = h("p", { class: "note", "aria-live": "polite" }, "Tap a phrase, then tap the expression that models it.");
      const mark = () => rows.forEach((r, i) => { r.row.style.borderColor = r.row.dataset.done ? "var(--good)" : i === active ? "var(--accent)" : "var(--line)"; r.row.style.borderWidth = i === active && !r.row.dataset.done ? "2px" : "1px"; });
      shuffle(set.map(([, e]) => e)).forEach((e) => {
        const b = h("button", { type: "button", class: "num" }, e);
        b.addEventListener("click", () => {
          const r = rows[active];
          if (!r || r.row.dataset.done) return;
          if (r.expr !== e) {
            misses++; shake(b, springs);
            msg.textContent = `“${e}” does not model “${r.phrase}”. Read the phrase again: which operation comes first?`;
            return;
          }
          const from = b.getBoundingClientRect();
          reflow(bank, () => b.remove(), springs);
          r.slot.textContent = e; r.slot.style.borderStyle = "solid"; r.slot.style.borderColor = "var(--good)";
          flyFrom(r.slot, from, springs);
          r.row.dataset.done = "1"; matched++;
          msg.textContent = `Yes: ${r.phrase} → ${e}.`;
          const next = rows.findIndex((x) => !x.row.dataset.done);
          active = next; mark();
          if (matched === rows.length) area.append(pill(misses === 0, "All matched on the first try!", `All matched (${misses} miss${misses === 1 ? "" : "es"}).`),
            h("div", { class: "controls" }, h("button", { class: "btn", type: "button", onclick: deal }, "New set")));
        });
        bank.append(b);
      });
      area.append(h("div", { style: "display:grid;gap:8px" }, rows.map((r) => r.row)), h("p", { class: "note" }, "Expressions"), bank, msg);
      mark();
    }
    root.append(area, h("p", { class: "note" }, "Watch the order of words: “three less than n” is n − 3, but “n subtracted from 3” is 3 − n."));
    deal();
    return () => springs.forEach((x) => x.stop());
  }

  // ------------------------------------------------------------ lesson

  Sim.register({
    id: "g8-lesson2", unit: "8B", num: 2, letter: "B", title: "Algebraic Expressions as Models", simName: "Expression Modeler",
    comps: ["A3", "M2"], cycles: "C2,M1 – C2,M2", deped: "DepEd Week 1",
    bigQuestion: "How can one expression describe every size of garden?",
    mission: [
      "Build the Model: build an expression for the garden’s perimeter. Slide x – does your expression still match the fence?",
      "Build two different expressions for the same perimeter. Why do both work?",
      "Build the jeepney fare and the load plan. Which number is the constant, and which is the coefficient?",
      "Match It: match all five phrases without a miss.",
    ],
    discovery: "An algebraic expression is a model: the variable stands for the quantity that can change (the width x, the kilometres k, the days d), constants are the fixed amounts, and coefficients are the rates. Because the variable can take any value, one expression such as 4x + 6 describes the fence of every size of garden.",
    mount(stage) {
      const body = h("div", { class: "stage-body" });
      const views = [build, match];
      let stopper = null;
      const t = tabs(["Build the Model", "Match It"], (i) => { if (stopper) stopper(); clear(body); stopper = views[i](body) || null; });
      stage.append(t.el, body);
      stopper = build(body);
      return () => { if (stopper) stopper(); };
    },
    check() {
      const kind = randInt(0, 4);
      if (kind === 0) {
        const [ph, ex] = pick(PAIRS), others = shuffle(PAIRS.filter((p) => p[1] !== ex)).slice(0, 3).map((p) => p[1]);
        return { q: `Which expression models “${ph}”?`, choices: shuffle([ex, ...others]), answer: ex, explain: `${ph} → ${ex}.` };
      }
      if (kind === 1) { const d = randInt(3, 30); return { q: `A load plan costs ₱99 plus ₱5 per day: 99 + 5d. What is the total cost for ${d} days?`, answer: 99 + 5 * d, unit: "₱", explain: `99 + 5(${d}) = 99 + ${5 * d} = ₱${99 + 5 * d}.` }; }
      if (kind === 2) { const x = randInt(2, 9); return { q: `A garden is x m wide and (x + 3) m long. Its perimeter is 4x + 6. Find the perimeter when x = ${x}.`, answer: 4 * x + 6, unit: "m", explain: `4(${x}) + 6 = ${4 * x + 6} m.` }; }
      if (kind === 3) return pick([
        { q: "In the fare model 13 + 1.80k, what does 13 represent?", choices: ["the minimum fare for the first 4 km", "the cost of each additional km", "the number of km travelled", "the total fare"], answer: "the minimum fare for the first 4 km", explain: "13 is the constant – the fixed part of the fare." },
        { q: "In 99 + 5d, what does 5 represent?", choices: ["the cost per day", "the number of days", "the registration fee", "the total cost"], answer: "the cost per day", explain: "5 is the coefficient of d: ₱5 for each day." },
        { q: "In the garden area x(x + 3), what does (x + 3) represent?", choices: ["the length", "the width", "the perimeter", "the area"], answer: "the length", explain: "The length is 3 m more than the width x." },
      ]);
      const k = randInt(1, 10);
      return { q: `Using the sample fare 13 + 1.80k, how much is the fare for ${k} additional km?`, answer: Math.round((13 + 1.8 * k) * 100) / 100, unit: "₱", explain: `13 + 1.80(${k}) = 13 + ${fmt(1.8 * k, 2)} = ₱${fmt(13 + 1.8 * k, 2)}.` };
    },
  });
})();
