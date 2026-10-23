/* Term 3 · Lesson 4 · D. Variables, Constants, and Algebraic Expressions – Expression Machine */
(function () {
  "use strict";
  const { h, s, clear, randInt, pick, shuffle, fmt, tabs, segmented, stat, pill, Spring, elasticSlider } = Sim;

  const N = (n) => (n < 0 ? "−" + -n : String(n));            // Unicode minus
  const P = (n) => (n < 0 ? `(−${-n})` : String(n));           // parenthesised when negative

  /** A short elastic "pop" (scale) or "shake" (x offset) on an element; returns the spring. */
  function kick(apply, kind) {
    const sp = new Spring(0, apply, { stiffness: 320, damping: 11 });
    sp.vel = kind === "pop" ? 3.2 : 260; sp.set(0);
    return sp;
  }

  // ------------------------------------------------------------ variable or constant

  const EXPRS = [
    { parts: [["3", "c"], ["x", "v"], ["+"], ["5", "c"]], info: "Terms: 3x and 5. The numerical coefficient of x is 3; the constant term is 5." },
    { parts: [["2", "c"], ["π", "c"], ["r", "v"]], info: "One term: 2πr (the distance around a circle). 2 and π are constants – π ≈ 3.14 never changes. The numerical coefficient of r is 2π." },
    { parts: [["4", "c"], ["a", "v"], ["b", "v"], ["−"], ["7", "c"]], info: "Terms: 4ab and −7. The coefficient of ab is 4; the constant term is −7." },
    { parts: [["5", "c"], ["y", "v"], ["−"], ["2", "c"], ["x", "v"], ["+"], ["8", "c"]], info: "Terms: 5y, −2x, and 8. The coefficients are 5 and −2; the constant term is 8." },
    { parts: [["12", "c"], ["−"], ["m", "v"]], info: "Terms: 12 and −m. The coefficient of m is −1, because −m means −1 · m." },
    { parts: [["½", "c"], ["b", "v"], ["h", "v"]], info: "One term: ½bh (the area of a triangle). The coefficient of bh is ½." },
  ];

  function classify(root) {
    let idx = 0, brush = "v";
    const springs = [];
    const svg = s("svg", { viewBox: "0 0 600 200", role: "img", "aria-label": "An algebraic expression with tappable parts" });
    const msg = h("p", { class: "note", "aria-live": "polite" }), out = h("div", { class: "readout" }), info = h("div");
    function deal() {
      clear(svg); clear(info); springs.forEach((sp) => sp.stop()); springs.length = 0;
      const ex = EXPRS[idx];
      const toks = ex.parts.map(([t, k]) => ({ t, k, w: k ? 26 * t.length + 34 : 40, done: false }));
      const W = toks.reduce((a, t) => a + t.w + 6, -6);
      let x = 300 - W / 2;
      const found = stat("Classified:", "");
      const total = toks.filter((t) => t.k).length;
      const refresh = () => {
        const n = toks.filter((t) => t.done).length;
        found.set(`${n} of ${total}`);
        clear(info);
        if (n === total) info.append(pill(true, "All parts classified!", ""), h("p", { class: "workings" }, ex.info));
      };
      toks.forEach((tok) => {
        const cx = x + tok.w / 2; x += tok.w + 6;
        if (!tok.k) { svg.append(s("text", { x: cx, y: 112, "text-anchor": "middle", class: "svg-text", style: "font-size:36px" }, tok.t)); return; }
        const g = s("g", { class: "token", tabindex: 0, role: "button", "aria-label": `Part ${tok.t}` });
        const box = s("rect", { x: -tok.w / 2, y: -36, width: tok.w, height: 68, rx: 12, fill: "var(--paper)", stroke: "var(--line)", "stroke-width": 2 });
        const label = s("text", { y: 58, "text-anchor": "middle", class: "svg-label", style: "font-size:15px" }, "");
        g.append(box, s("text", { y: 12, "text-anchor": "middle", class: "svg-text", style: "font-size:36px", "font-style": /[a-z]/.test(tok.t) ? "italic" : "normal" }, tok.t), label);
        svg.append(g);
        let sc = 1, dx = 0;
        const place = () => g.setAttribute("transform", `translate(${cx + dx},100) scale(${sc})`);
        place();
        const tap = () => {
          if (tok.done || tok.k === brush) {
            if (!tok.done) {
              tok.done = true;
              box.setAttribute("fill", tok.k === "v" ? "var(--shape-a-soft)" : "var(--shape-b-soft)");
              box.setAttribute("stroke", tok.k === "v" ? "var(--shape-a)" : "var(--shape-b)");
              label.textContent = tok.k === "v" ? "variable" : "constant";
              msg.textContent = tok.k === "v" ? `${tok.t} is a letter that can stand for many numbers – a variable.` : tok.t === "π" ? "π is a letter, but it names ONE fixed number (≈ 3.14159…) – a constant." : `${tok.t} always has the same value – a constant.`;
              refresh();
            }
            springs.push(kick((v) => { sc = 1 + v * 0.5; place(); }, "pop"));
          } else {
            msg.textContent = tok.k === "v" ? `Not quite: ${tok.t} can take many values, so it is a variable.` : tok.t === "π" ? "Careful: π looks like a letter, but its value never changes (≈ 3.14) – a constant." : `Not quite: ${tok.t} never changes – it is a constant.`;
            springs.push(kick((v) => { dx = v * 0.55; place(); }, "shake"));
          }
        };
        g.addEventListener("click", tap);
        g.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); tap(); } });
      });
      clear(out); out.append(found.el); refresh();
      msg.textContent = "Choose Variable or Constant, then tap the parts of the expression.";
    }
    root.append(
      h("div", { class: "controls" }, h("span", {}, "I am marking:"), segmented(["v", "c"], brush, (v) => { brush = v; }, (v) => (v === "v" ? "Variable" : "Constant")),
        h("button", { class: "btn ghost", type: "button", onclick: () => { idx = (idx + 1) % EXPRS.length; deal(); } }, "Next expression")),
      svg, msg, out, info,
      h("p", { class: "note" }, "A term is a number, a variable, or a product of them, separated from other terms by + or −. The number in front of the variables is the numerical coefficient."));
    deal();
    return () => springs.forEach((sp) => sp.stop());
  }

  // ------------------------------------------------------------ evaluate

  const MACHINES = [
    { label: "3x + 5", vars: [["x", -10, 10, 3]], f: ({ x }) => 3 * x + 5, sub: ({ x }) => `3(${N(x)}) + 5`, mid: ({ x }) => `${N(3 * x)} + 5` },
    { label: "2x − y", vars: [["x", -10, 10, 3], ["y", -10, 10, -4]], f: ({ x, y }) => 2 * x - y, sub: ({ x, y }) => `2(${N(x)}) − ${P(y)}`, mid: ({ x, y }) => `${N(2 * x)} − ${P(y)}` },
    { label: "x² + 2y", vars: [["x", -10, 10, -3], ["y", -10, 10, 2]], f: ({ x, y }) => x * x + 2 * y, sub: ({ x, y }) => `(${N(x)})² + 2(${N(y)})`, mid: ({ x, y }) => `${x * x} + ${P(2 * y)}` },
    { label: "4xy − 7", vars: [["x", -10, 10, 2], ["y", -10, 10, 1]], f: ({ x, y }) => 4 * x * y - 7, sub: ({ x, y }) => `4(${N(x)})(${N(y)}) − 7`, mid: ({ x, y }) => `${N(4 * x * y)} − 7` },
    { label: "13 + 2k", jeep: true, vars: [["k", 0, 10, 3]], f: ({ k }) => 13 + 2 * k, sub: ({ k }) => `13 + 2(${k})`, mid: ({ k }) => `13 + ${2 * k}` },
  ];

  function evaluate(root) {
    let m = MACHINES[0], vals = {};
    const svg = s("svg", { viewBox: "0 0 600 250", role: "img", "aria-label": "Expression machine: inputs, expression, output" });
    const inputs = s("g"), exprT = s("text", { x: 300, y: 112, "text-anchor": "middle", class: "svg-text", style: "font-size:30px", "font-weight": 700 });
    const outT = s("text", { x: 508, y: 114, "text-anchor": "middle", class: "svg-text", style: "font-size:30px", "font-weight": 700 });
    const gauge = s("g"), marker = s("g");
    marker.append(s("path", { d: "M0,0 l-9,-16 h18 z", fill: "var(--shape-b)" }));
    svg.append(
      s("rect", { x: 190, y: 50, width: 220, height: 100, rx: 16, fill: "var(--shape-a-soft)", stroke: "var(--shape-a)", "stroke-width": 2.5 }),
      s("text", { x: 300, y: 74, "text-anchor": "middle", class: "svg-label" }, "Expression Machine"),
      s("path", { d: "M150,100 h32 m-8,-6 l8,6 l-8,6", fill: "none", stroke: "var(--ink)", "stroke-width": 2.5 }),
      s("path", { d: "M412,100 h26 m-8,-6 l8,6 l-8,6", fill: "none", stroke: "var(--ink)", "stroke-width": 2.5 }),
      s("rect", { x: 446, y: 66, width: 124, height: 70, rx: 12, fill: "var(--paper)", stroke: "var(--shape-b)", "stroke-width": 2.5 }),
      s("text", { x: 508, y: 58, "text-anchor": "middle", class: "svg-label" }, "Output"),
      inputs, exprT, outT, gauge, marker);
    const work = h("pre", { class: "workings", "aria-live": "polite" }), sliders = h("div", { class: "controls" }), note = h("p", { class: "note" });
    let lo = 0, hi = 1;
    const GX = (v) => 40 + ((v - lo) / (hi - lo)) * 520;
    const outSp = new Spring(0, (v) => {
      outT.textContent = (m.jeep ? "₱" : "") + N(Math.round(v));
      marker.setAttribute("transform", `translate(${GX(v)},206)`);
    }, { stiffness: 140, damping: 13 });
    function setup(mm) {
      m = mm; vals = {};
      m.vars.forEach(([n, , , v]) => { vals[n] = v; });
      // the range of all possible outputs, for the gauge
      const grid = (i, o) => (i === m.vars.length ? [m.f(o)] : Array.from({ length: m.vars[i][2] - m.vars[i][1] + 1 }, (_, j) => grid(i + 1, { ...o, [m.vars[i][0]]: m.vars[i][1] + j })).flat());
      const all = grid(0, {}); lo = Math.min(...all); hi = Math.max(...all);
      clear(gauge);
      gauge.append(s("line", { x1: 40, y1: 210, x2: 560, y2: 210, stroke: "var(--ink)", "stroke-width": 2 }));
      [lo, 0, hi].filter((v, i, a) => v >= lo && v <= hi && a.indexOf(v) === i).forEach((v) => gauge.append(
        s("line", { x1: GX(v), y1: 204, x2: GX(v), y2: 216, stroke: "var(--ink)", "stroke-width": 2 }),
        s("text", { x: GX(v), y: 236, "text-anchor": "middle", class: "svg-text", style: "font-size:13px" }, N(v))));
      exprT.textContent = m.label;
      clear(sliders);
      m.vars.forEach(([n, a, b, v]) => sliders.append(elasticSlider({ id: `t3l4-${n}`, label: n, min: a, max: b, value: v, step: 1, format: (u) => N(Math.round(u)),
        onInput: (u) => { const r = Math.round(u); if (r !== vals[n]) { vals[n] = r; update(); } } }).el));
      note.textContent = m.jeep ? "Jeepney fare (sample rates): ₱13 for the first 4 km plus ₱2 for each extra kilometre k. The 13 never changes – a constant; k changes from ride to ride – a variable." : "Drag the sliders. The letters change, the numbers in the expression stay fixed.";
      update();
    }
    function update() {
      clear(inputs);
      m.vars.forEach(([n], i) => {
        const y = m.vars.length === 1 ? 100 : 72 + i * 56;
        inputs.append(s("rect", { x: 22, y: y - 22, width: 122, height: 44, rx: 22, fill: "var(--gold-soft)", stroke: "var(--gold)", "stroke-width": 2 }),
          s("text", { x: 83, y: y + 8, "text-anchor": "middle", class: "svg-text", style: "font-size:22px" }, `${n} = ${N(vals[n])}`));
      });
      const val = m.f(vals), sub = m.sub(vals), mid = m.mid(vals);
      const lines = [`${m.label}`, `= ${sub}      ← substitute`];
      if (mid !== N(val) && mid !== sub) lines.push(`= ${mid}`);
      lines.push(`= ${m.jeep ? "₱" : ""}${N(val)}`);
      work.textContent = lines.join("\n");
      outSp.set(val);
    }
    root.append(h("div", { class: "controls" }, segmented(MACHINES, MACHINES[0], setup, (x) => x.label)), sliders, svg, work, note);
    setup(MACHINES[0]); outSp.jump(m.f(vals));
    return () => outSp.stop();
  }

  // ------------------------------------------------------------ translate

  const PHRASES = [
    ["5 more than a number", "n + 5"], ["twice a number decreased by 3", "2n − 3"], ["the quotient of n and 4", "n ÷ 4"],
    ["3 less than a number", "n − 3"], ["the product of 6 and a number", "6n"], ["a number squared, plus 1", "n² + 1"],
    ["twice the sum of a number and 3", "2(n + 3)"], ["4 subtracted from a number", "n − 4"], ["half of a number", "n ÷ 2"],
    ["3 times a number, increased by 8", "3n + 8"], ["the sum of a number and 7", "n + 7"], ["7 decreased by a number", "7 − n"],
  ];

  function translate(root) {
    const area = h("div", { class: "stage-body" });
    const springs = [];
    const colStyle = "flex-direction:column;align-items:stretch";
    function deal() {
      clear(area);
      const pairs = shuffle(PHRASES).slice(0, 5);
      let sel = null, done = 0;
      const mk = (text, i, side) => {
        const b = h("button", { type: "button", style: `text-align:left;${side === "e" ? "font-family:var(--mono);font-size:1.05rem" : ""}` }, text);
        b.dataset.i = i; b.dataset.side = side;
        b.addEventListener("click", () => choose(b));
        return b;
      };
      const left = h("div", { class: "choices", style: colStyle }, pairs.map(([p], i) => mk(p, i, "p")));
      const right = h("div", { class: "choices", style: colStyle }, shuffle(pairs.map(([, e], i) => [e, i])).map(([e, i]) => mk(e, i, "e")));
      const res = h("p", { class: "note", "aria-live": "polite" }, "Tap a phrase, then tap the expression that matches it.");
      const highlight = (b, on) => { b.style.borderColor = on ? "var(--accent)" : ""; b.style.background = on ? "var(--accent-soft)" : ""; };
      function choose(b) {
        if (b.disabled) return;
        if (!sel || sel.dataset.side === b.dataset.side) { if (sel) highlight(sel, false); sel = b; highlight(b, true); return; }
        const a = sel; sel = null; highlight(a, false);
        if (a.dataset.i === b.dataset.i) {
          done++;
          [a, b].forEach((x) => { x.disabled = true; x.style.background = "var(--shape-a-soft)"; x.style.borderColor = "var(--shape-a)"; x.prepend(h("b", {}, `${done}. `)); springs.push(kick((v) => { x.style.transform = `scale(${1 + v * 0.35})`; }, "pop")); });
          res.textContent = done === pairs.length ? "All five matched! Key words: more than / increased by → +, less than / decreased by → −, product / times / twice → ×, quotient / half → ÷." : `“${pairs[+a.dataset.i][0]}” → ${pairs[+a.dataset.i][1]}`;
          if (done === pairs.length) area.append(h("div", { class: "controls" }, h("button", { class: "btn", type: "button", onclick: deal }, "New set")));
        } else {
          res.textContent = "Not a match. Read the phrase again: which operation do the key words name, and in what order?";
          [a, b].forEach((x) => springs.push(kick((v) => { x.style.transform = `translateX(${v * 0.45}px)`; }, "shake")));
        }
      }
      area.append(h("div", { style: "display:grid;grid-template-columns:minmax(0,1.4fr) minmax(0,1fr);gap:10px" }, left, right), res);
    }
    root.append(area, h("p", { class: "note" }, "Careful with order: “3 less than a number” is n − 3, not 3 − n."));
    deal();
    return () => springs.forEach((sp) => sp.stop());
  }

  // ------------------------------------------------------------ lesson

  Sim.register({
    id: "lesson22", unit: "I", num: 4, letter: "D", title: "Variables, Constants, and Algebraic Expressions", simName: "Expression Machine",
    comps: ["A5", "A6", "A7", "M4"], cycles: "C4,M2 – C5,M1", deped: "DepEd Weeks 4–5",
    bigQuestion: "How can one letter stand for every possible number?",
    mission: [
      "Variable or Constant?: classify every part of 3x + 5, 2πr, and 4ab − 7. Is π a variable?",
      "Evaluate: feed x = 3 into 3x + 5. Then slide x from −10 to 10. Which part of the expression never changes?",
      "Evaluate: in the jeepney fare 13 + 2k, how much is the fare for k = 6 extra kilometres?",
      "Translate: match five phrases to their expressions, twice.",
    ],
    discovery: "A variable is a letter that can stand for many numbers; a constant is a quantity whose value never changes (like 5 or π). An algebraic expression combines them with operations. To evaluate it, substitute a number for each variable and simplify. One expression like 3x + 5 gives a different output for every input x – that is how one letter stands for every possible number.",
    mount(stage) {
      const body = h("div", { class: "stage-body" });
      const views = [classify, evaluate, translate];
      let stopper = null;
      const t = tabs(["Variable or Constant?", "Evaluate", "Translate"], (i) => { if (stopper) stopper(); clear(body); stopper = views[i](body) || null; });
      stage.append(t.el, body);
      stopper = classify(body);
      return () => { if (stopper) stopper(); };
    },
    check() {
      const kind = randInt(0, 5);
      if (kind === 0) {
        const [c, v, k] = [randInt(2, 9), pick(["m", "p", "t", "y"]), randInt(1, 12)];
        return pick([
          { q: `In ${c}${v} + ${k}, which is the variable?`, choices: shuffle([v, String(c), String(k), "+"]), answer: v, explain: `${v} is the letter that can take many values.` },
          { q: `In ${c}${v} + ${k}, what is the constant term?`, choices: shuffle([String(k), String(c), v, `${c}${v}`]), answer: String(k), explain: `${k} stands alone and never changes.` },
          { q: `What is the numerical coefficient of ${v} in ${c}${v} + ${k}?`, answer: c, explain: `The number multiplied by ${v} is ${c}.` },
        ]);
      }
      if (kind === 1) { const x = randInt(-6, 8), a = randInt(2, 6), b = randInt(1, 9); return { q: `Evaluate ${a}x + ${b} when x = ${N(x)}.`, answer: a * x + b, explain: `${a}(${N(x)}) + ${b} = ${N(a * x)} + ${b} = ${N(a * x + b)}.` }; }
      if (kind === 2) { const a = randInt(-5, 6), b = randInt(-5, 6); return { q: `Evaluate 2a − b when a = ${N(a)} and b = ${N(b)}.`, answer: 2 * a - b, explain: `2(${N(a)}) − ${P(b)} = ${N(2 * a)} − ${P(b)} = ${N(2 * a - b)}.` }; }
      if (kind === 3) { const [p, e] = pick(PHRASES); const others = shuffle(PHRASES.filter((x) => x[1] !== e)).slice(0, 3).map((x) => x[1]); return { q: `Which expression means “${p}”?`, choices: shuffle([e, ...others]), answer: e, explain: `“${p}” → ${e}.` }; }
      if (kind === 4) { const k = randInt(2, 10); return { q: `A jeepney fare is 13 + 2k pesos, where k is the number of extra kilometres. What is the fare when k = ${k}?`, answer: 13 + 2 * k, unit: "₱", explain: `13 + 2(${k}) = 13 + ${2 * k} = ₱${13 + 2 * k}.` }; }
      return pick([
        { q: "In the expression 2πr, which part is a variable?", choices: ["r", "π", "2", "2π"], answer: "r", explain: "π ≈ 3.14 is a fixed number; only r can change." },
        { q: "Which statement is true?", choices: ["A variable can take many values; a constant stays fixed.", "A constant can take many values; a variable stays fixed.", "Every letter is a variable.", "Numbers can be variables."], answer: "A variable can take many values; a constant stays fixed.", explain: "That is the difference between a variable and a constant." },
        { q: "How many terms does 5y − 2x + 8 have?", choices: ["1", "2", "3", "4"], answer: "3", explain: "The terms are 5y, −2x, and 8." },
      ]);
    },
  });
})();
