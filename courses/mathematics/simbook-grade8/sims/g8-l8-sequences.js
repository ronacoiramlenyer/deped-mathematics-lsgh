/* Grade 8 · Term 1 · Lesson 8 · H. Sequences and Patterns – Pattern Builder */
(function () {
  "use strict";
  const { h, s, clear, randInt, pick, shuffle, fmt, tabs, segmented, stat, pill, Spring, elasticSlider, clamp, parseNumber } = Sim;

  const fm = (x, d = 2) => fmt(x, d).replace("-", "−");
  /** "4n + 1", "3n − 2", "5n" */
  const linRule = (d, c) => `${d === 1 ? "" : d === -1 ? "−" : fm(d)}n${c === 0 ? "" : c > 0 ? ` + ${c}` : ` − ${-c}`}`;
  const ease = (g) => clamp(g, 0, 1.15);

  /** A small numeric answer box: returns { el } and calls judge(value) on Check / Enter. */
  function answerBox(id, label, judge) {
    const input = h("input", { type: "text", inputmode: "decimal", id, autocomplete: "off", "aria-label": label, style: "width:6em" });
    const go = () => { const f = parseNumber(input.value); if (f) judge(f.value()); };
    input.addEventListener("keydown", (e) => { if (e.key === "Enter") go(); });
    return { el: h("label", { for: id }, label, input, h("button", { class: "btn", type: "button", onclick: go }, "Check")), input };
  }

  // ------------------------------------------------------------ growing patterns

  const PATTERNS = {
    sticks: {
      name: "Matchstick squares", unit: "matchsticks", count: (n) => 3 * n + 1, words: "Start with 4 matchsticks; each new square adds 3.", rule: "3n + 1",
      elems() {
        const out = [], side = 46, x0 = 300 - 4 * side, y0 = 100;
        const stick = (b, x1, y1, x2, y2) => out.push({ b, draw: (svg, g) => {
          const cx = (x1 + x2) / 2, cy = (y1 + y2) / 2, k = ease(g);
          svg.append(s("line", { x1: cx + (x1 - cx) * k, y1: cy + (y1 - cy) * k, x2: cx + (x2 - cx) * k, y2: cy + (y2 - cy) * k, stroke: "var(--gold)", "stroke-width": 7, "stroke-linecap": "round", opacity: clamp(g * 1.5, 0, 1) }),
            s("circle", { cx: cx + (x2 - cx) * k, cy: cy + (y2 - cy) * k, r: 5 * clamp(g, 0, 1.1), fill: "var(--shape-b)" }));
        } });
        stick(1, x0, y0 + side, x0, y0);
        for (let i = 1; i <= 8; i++) {
          const x = x0 + (i - 1) * side;
          stick(i, x, y0, x + side, y0); stick(i, x, y0 + side, x + side, y0 + side); stick(i, x + side, y0 + side, x + side, y0);
        }
        return out;
      },
    },
    ltiles: {
      name: "L-shaped tiles", unit: "tiles", count: (n) => 2 * n + 1, words: "Start with 3 tiles; each step adds 2 (one on each arm).", rule: "2n + 1",
      elems() {
        const out = [], t = 26, cx0 = 210, cy0 = 250;
        const tile = (b, x, y, color) => out.push({ b, draw: (svg, g) => {
          const k = ease(g), w = t * k;
          svg.append(s("rect", { x: x + (t - w) / 2, y: y + (t - w) / 2, width: w, height: w, rx: 3, fill: color, stroke: "var(--ink)", "stroke-width": 1, opacity: clamp(g * 1.5, 0, 1) }));
        } });
        tile(1, cx0, cy0, "var(--shape-b)");
        for (let i = 1; i <= 8; i++) { tile(i, cx0, cy0 - i * t, "var(--shape-a)"); tile(i, cx0 + i * t, cy0, "var(--gold)"); }
        return out;
      },
    },
    dots: {
      name: "Triangle dots", unit: "dots", count: (n) => (n * (n + 1)) / 2, words: "Step n adds a new row of n dots: add 2, then 3, then 4, …", rule: "n(n + 1)/2 (not linear)",
      elems() {
        const out = [];
        for (let r = 1; r <= 8; r++) for (let j = 0; j < r; j++) {
          const x = 300 + (j - (r - 1) / 2) * 30, y = 30 + (r - 1) * 31;
          out.push({ b: r, draw: (svg, g) => svg.append(s("circle", { cx: x, cy: y, r: 10 * ease(g), fill: r % 2 ? "var(--shape-a)" : "var(--purple)", opacity: clamp(g * 1.5, 0, 1) })) });
        }
        return out;
      },
    },
  };

  function growTab(root) {
    let key = "sticks", P = PATTERNS[key], els = P.elems(), v = 1, rec = {};
    const svg = s("svg", { viewBox: "0 0 600 290", role: "img", "aria-label": "A growing pattern of tiles" });
    const out = h("div", { class: "readout", "aria-live": "polite" });
    const tableBox = h("div", { class: "table-wrap" });
    const fb = h("div", { "aria-live": "polite" }), ruleBox = h("pre", { class: "workings" });
    function draw() {
      clear(svg);
      const n = Math.floor(v + 1e-9), f = v - n;
      els.forEach((e) => { if (e.b <= n) e.draw(svg, 1); else if (e.b === n + 1 && f > 0.01) e.draw(svg, f); });
      const sn = clamp(Math.round(v), 1, 8);
      clear(out);
      out.append(stat("Step:", String(sn)).el, stat(`Number of ${P.unit}:`, String(P.count(sn))).el);
    }
    function table() {
      clear(tableBox);
      const ns = [1, 2, 3, 4, 5, 6, 7, 8];
      tableBox.append(h("table", { class: "data" },
        h("tbody", {}, h("tr", {}, h("th", {}, "Step n"), ns.map((n) => h("td", { class: "num" }, String(n)))),
          h("tr", {}, h("th", {}, P.unit), ns.map((n) => h("td", { class: "num" }, rec[n] !== undefined ? h("b", {}, String(rec[n])) : "·"))))));
    }
    function record() {
      const n = clamp(Math.round(v), 1, 8); rec[n] = P.count(n); table();
      const got = Object.keys(rec).length;
      clear(fb);
      if (got >= 3) fb.append(h("p", { class: "note" }, "Look at the row of numbers: what do you add (or do) to get from one term to the next?"));
    }
    function setup(k) {
      key = k; P = PATTERNS[k]; els = P.elems(); rec = {}; slider.jump(1); v = 1; ruleBox.hidden = true; clear(fb); pred.input.value = ""; draw(); table();
      ruleBox.textContent = `In words: ${P.words}\nAs a rule: number of ${P.unit} at step n = ${P.rule}\nTest: step 4 → ${P.count(4)}, step 5 → ${P.count(5)}, step 10 → ${P.count(10)}`;
    }
    const slider = elasticSlider({ id: "g8l8-step", label: "Step", min: 1, max: 8, value: 1, step: 1, format: (x) => String(clamp(Math.round(x), 1, 8)), onInput: (x) => { v = x; draw(); } });
    const pred = answerBox("g8l8-pred", "Predict step 10:", (x) => { clear(fb); fb.append(pill(x === P.count(10), `Yes! Step 10 has ${P.count(10)} ${P.unit}.`, "Not yet – use the pattern in your table.")); });
    root.append(h("div", { class: "controls" }, segmented(Object.keys(PATTERNS), key, setup, (k) => PATTERNS[k].name)),
      h("div", { class: "controls" }, slider.el, h("button", { class: "btn", type: "button", onclick: record }, "Record this step")),
      svg, out, tableBox, h("div", { class: "controls" }, pred.el, h("button", { class: "btn ghost", type: "button", onclick: () => { ruleBox.hidden = false; } }, "Show the rule")), fb, ruleBox,
      h("p", { class: "note" }, "Drag the step slider slowly: watch exactly which pieces are new at each step."));
    setup(key);
  }

  // ------------------------------------------------------------ find the rule

  function makeSeq(type) {
    if (type === "add") {
      const d = pick([2, 3, 4, 5, 6, 7, -2, -3, -4, -5]), a = randInt(-3, 12);
      const terms = Array.from({ length: 6 }, (_, i) => a + i * d);
      return { type, terms, words: `Add ${fm(d)} each time${d < 0 ? ` (that is, subtract ${-d})` : ""}.`, d, c: a - d, diffs: [terms.slice(1).map((x, i) => x - terms[i])] };
    }
    if (type === "mul") {
      const r = pick([2, 3, 2]), a = randInt(1, r === 3 ? 3 : 5);
      const terms = Array.from({ length: 6 }, (_, i) => a * r ** i);
      return { type, terms, words: `Multiply by ${r} each time.`, ratios: terms.slice(1).map(() => r), diffs: [terms.slice(1).map((x, i) => x - terms[i])] };
    }
    if (type === "inc") {
      const a = randInt(1, 8), d0 = randInt(1, 3), terms = [a];
      for (let i = 0; i < 5; i++) terms.push(terms[i] + d0 + i);
      const d1 = terms.slice(1).map((x, i) => x - terms[i]);
      return { type, terms, words: `Add ${d0}, then ${d0 + 1}, then ${d0 + 2}, … (add 1 more each time).`, diffs: [d1, d1.slice(1).map((x, i) => x - d1[i])] };
    }
    const p = randInt(3, 7), q = randInt(1, p - 1), a = randInt(1, 9), terms = [a];
    for (let i = 0; i < 5; i++) terms.push(terms[i] + (i % 2 ? -q : p));
    return { type, terms, words: `Add ${p}, then subtract ${q}, and repeat.`, diffs: [terms.slice(1).map((x, i) => x - terms[i])] };
  }

  function ruleTab(root) {
    let type = "add", seq = makeSeq(type), shown = false, solved = false, pop = 0, reveal = 0;
    const svg = s("svg", { viewBox: "0 0 600 250", role: "img", "aria-label": "A sequence with its difference row" });
    const fb = h("div", { "aria-live": "polite" }), ruleArea = h("div", { class: "stage-body" });
    const popSp = new Spring(0, (x) => { pop = x; draw(); }, { stiffness: 90, damping: 12 });
    const revSp = new Spring(0, (x) => { reveal = x; draw(); }, { stiffness: 160, damping: 14 });
    const CX = (i) => 55 + i * 98;
    function draw() {
      clear(svg);
      seq.terms.forEach((t, i) => {
        const last = i === 5, open = !last || solved;
        const sc = last && solved ? ease(reveal) : 1;
        svg.append(s("rect", { x: CX(i) - 38, y: 22, width: 76, height: 56, rx: 10, fill: last ? "var(--gold-soft)" : "var(--shape-a-soft)", stroke: last ? "var(--gold)" : "var(--shape-a)", "stroke-width": 2 }));
        svg.append(s("text", { x: CX(i), y: 60, "text-anchor": "middle", class: "svg-text", "font-size": 24 * (open ? sc : 1), "font-weight": 700 }, open ? fm(t) : "?"));
        svg.append(s("text", { x: CX(i), y: 14, "text-anchor": "middle", class: "svg-label", "font-size": 13 }, `term ${i + 1}`));
      });
      const rows = seq.type === "mul" ? [seq.ratios.map((r) => `×${r}`), ...seq.diffs.slice(0, 1).map((r) => r.map((x) => (x >= 0 ? `+${x}` : fm(x))))] : seq.diffs.map((r) => r.map((x) => (x >= 0 ? `+${x}` : fm(x))));
      rows.forEach((row, ri) => {
        const y = 120 + ri * 62;
        row.forEach((lab, i) => {
          const visible = solved ? row.length : 4 - ri;
          if (i >= visible) return;
          const g = clamp(pop * (row.length + 1) - i - ri * 0.5, 0, 1.15);
          if (g <= 0) return;
          const off = (ri * 49);
          const x1 = CX(i) + off + 8, x2 = CX(i + 1) + off - 8, mid = (x1 + x2) / 2, yy = y - 18 * g;
          svg.append(s("path", { d: `M${x1},${y - 30} Q${mid},${y - 2} ${x2},${y - 30}`, fill: "none", stroke: ri === 0 ? "var(--shape-b)" : "var(--purple)", "stroke-width": 2, opacity: Math.min(1, g) }));
          svg.append(s("text", { x: mid, y: yy + 30, "text-anchor": "middle", class: "svg-text", "font-size": 19 * Math.min(1.1, g), "font-weight": 700, fill: ri === 0 ? "var(--shape-b)" : "var(--purple)" }, lab));
        });
      });
    }
    function ruleChoices() {
      clear(ruleArea);
      if (!solved || !shown) return;
      if (seq.type !== "add") {
        ruleArea.append(h("p", { class: "workings" }, `Rule in words: ${seq.words}\n${seq.type === "inc" ? "The first differences grow by 1 – the SECOND differences are constant." : seq.type === "mul" ? "The differences are not constant, but the RATIO is: each term is the one before times " + seq.ratios[0] + "." : "The differences alternate, so there is no single common difference."}\nThis rule is not of the form an + b (not linear).`));
        return;
      }
      const right = linRule(seq.d, seq.c);
      const opts = shuffle([...new Set([right, linRule(1, seq.d), linRule(seq.d, 0), linRule(seq.d, seq.terms[0]), linRule(seq.terms[0], seq.d)])]).slice(0, 4);
      if (!opts.includes(right)) opts[0] = right;
      const res = h("div", { "aria-live": "polite" });
      ruleArea.append(h("p", {}, `The difference is always ${fm(seq.d)}, so the rule has the form ${fm(seq.d)}n + c. Which rule gives the nth term?`),
        h("div", { class: "choices" }, shuffle(opts).map((o) => h("button", { type: "button", onclick: () => {
          clear(res);
          const ok = o === right;
          res.append(pill(ok, `Yes: aₙ = ${right}`, `Test it: n = 1 gives ${fm(evalRule(o, 1))}, but term 1 is ${fm(seq.terms[0])}.`));
          if (ok) res.append(h("pre", { class: "workings" }, [1, 2, 3, 6, 10].map((n) => `n = ${n}:  ${fm(seq.d)}(${n}) ${seq.c < 0 ? "−" : "+"} ${Math.abs(seq.c)} = ${fm(seq.d * n + seq.c)}${n <= 6 ? (seq.d * n + seq.c === seq.terms[n - 1] ? " ✓" : "") : "   ← the 10th term"}`).join("\n")));
        } }, o))), res);
    }
    function evalRule(str, n) {
      const m = str.replace(/−/g, "-").replace(/\s/g, "").match(/^(-?\d*)n([+-]\d+)?$/);
      if (!m) return NaN;
      const a = m[1] === "" ? 1 : m[1] === "-" ? -1 : +m[1];
      return a * n + (m[2] ? +m[2] : 0);
    }
    function fresh() {
      seq = makeSeq(type); shown = false; solved = false; popSp.jump(0); revSp.jump(0); clear(fb); pred.input.value = ""; ruleChoices(); draw();
    }
    const pred = answerBox("g8l8-next", "Term 6 =", (x) => {
      clear(fb);
      const ok = Math.abs(x - seq.terms[5]) < 1e-9;
      fb.append(pill(ok, "Correct! The pattern continues.", "Not yet – look at how each term changes, or show the differences."));
      if (ok) { solved = true; revSp.jump(0.2); revSp.set(1); if (!shown) showDiffs(); else ruleChoices(); }
    });
    function showDiffs() { shown = true; popSp.jump(0); popSp.set(1); ruleChoices(); }
    root.append(h("div", { class: "controls" }, segmented(["add", "mul", "inc", "alt"], type, (t) => { type = t; fresh(); }, (t) => ({ add: "Add a constant", mul: "Multiply", inc: "Growing steps", alt: "Alternating" })[t])),
      h("p", {}, "Find the pattern. Predict term 6, then look at the difference row."),
      svg, h("div", { class: "controls" }, pred.el, h("button", { class: "btn ghost", type: "button", onclick: showDiffs }, "Show the differences"),
        h("button", { class: "btn ghost", type: "button", onclick: () => { solved = true; revSp.jump(0.2); revSp.set(1); clear(fb); fb.append(h("p", { class: "note" }, `Term 6 is ${fm(seq.terms[5])}. ${seq.words}`)); showDiffs(); } }, "Reveal"),
        h("button", { class: "btn ghost", type: "button", onclick: fresh }, "New sequence")),
      fb, ruleArea);
    fresh();
    return () => { popSp.stop(); revSp.stop(); };
  }

  // ------------------------------------------------------------ real patterns

  const REAL = {
    seats: { name: "Auditorium seats", label: "Row", min: 1, max: 10, start: 1, value: (n) => 2 * n + 18, unit: "seats",
      text: "Row 1 of the school auditorium has 20 seats. Each row behind it has 2 more seats than the row in front.",
      words: "Start at 20 and add 2 for each new row.", rule: "seats in row n = 2n + 18",
      q: "Which row has 50 seats?", a: 16, qsol: "2n + 18 = 50 → 2n = 32 → n = 16." },
    savings: { name: "Weekly savings", label: "Week", min: 1, max: 10, start: 1, value: (n) => 20 * n + 30, unit: "pesos",
      text: "Jo puts ₱50 in a coin bank in week 1, then adds ₱20 from baon every week after that.",
      words: "Start at ₱50 and add ₱20 every week.", rule: "savings after week n = 20n + 30",
      q: "How much will Jo have after week 20?", a: 430, qsol: "20(20) + 30 = 400 + 30 = ₱430." },
    bacteria: { name: "Bacteria doubling", label: "Hour", min: 0, max: 8, start: 0, value: (n) => 50 * 2 ** n, unit: "bacteria",
      text: "A culture starts with 50 bacteria. The number doubles every hour.",
      words: "Multiply by 2 every hour (not an add-the-same-amount pattern).", rule: "after n hours: 50 × 2ⁿ",
      q: "How many bacteria are there after 10 hours?", a: 51200, qsol: "50 × 2¹⁰ = 50 × 1 024 = 51 200." },
  };

  function realTab(root) {
    let key = "seats", R = REAL[key], v = 1;
    const svg = s("svg", { viewBox: "0 0 600 300", role: "img", "aria-label": "A real-life pattern growing" });
    const text = h("p", {}), out = h("div", { class: "readout", "aria-live": "polite" }), sliderBox = h("div", { class: "controls" });
    const work = h("pre", { class: "workings" }), qLine = h("p", { class: "q" }), fb = h("div", { "aria-live": "polite" });
    function draw() {
      clear(svg);
      const n = Math.floor(v + 1e-9), f = v - n;
      if (key === "seats") {
        svg.append(s("rect", { x: 220, y: 8, width: 160, height: 26, rx: 6, fill: "var(--accent)" }), s("text", { x: 300, y: 27, "text-anchor": "middle", class: "svg-label", "font-size": 15, fill: "var(--accent-ink)" }, "STAGE"));
        for (let r = 1; r <= Math.min(10, n + 1); r++) {
          const g = r <= n ? 1 : f; if (g <= 0.01) continue;
          const seats = 2 * r + 18, rad = 40 + r * 24, half = 0.42 + r * 0.035;
          for (let j = 0; j < seats; j++) {
            const ang = Math.PI / 2 + half * (1 - (2 * j) / (seats - 1));
            svg.append(s("circle", { cx: 300 + rad * Math.cos(ang) * 1.9, cy: 20 + rad * Math.sin(ang), r: 4.2 * ease(g), fill: r % 2 ? "var(--shape-a)" : "var(--gold)" }));
          }
        }
      } else if (key === "savings") {
        const bw = 44;
        for (let w = 1; w <= Math.min(10, n + 1); w++) {
          const g = w <= n ? 1 : f; if (g <= 0.01) continue;
          const val = 20 * w + 30, hh = (val / 230) * 240 * ease(g), x = 40 + (w - 1) * 54;
          svg.append(s("rect", { x, y: 270 - hh, width: bw, height: hh, rx: 4, fill: "var(--accent)", opacity: 0.8 }));
          svg.append(s("text", { x: x + bw / 2, y: 290, "text-anchor": "middle", class: "svg-text", "font-size": 13 }, `W${w}`));
          if (g > 0.6) svg.append(s("text", { x: x + bw / 2, y: 262 - hh, "text-anchor": "middle", class: "svg-text", "font-size": 13 }, `₱${val}`));
        }
      } else {
        const show = (k) => 2 ** k;
        const full = show(n), next = n < 8 ? show(n + 1) : full;
        for (let i = 0; i < next; i++) {
          const g = i < full ? 1 : f; if (g <= 0.01) continue;
          const cx = 180 + (i % 16) * 15, cy = 30 + Math.floor(i / 16) * 15;
          svg.append(s("circle", { cx, cy, r: 6 * ease(g), fill: "var(--purple)", opacity: 0.85 }));
        }
        svg.append(s("text", { x: 300, y: 292, "text-anchor": "middle", class: "svg-label", "font-size": 14 }, "each dot = 50 bacteria"));
      }
      const sn = clamp(Math.round(v), R.min, R.max);
      clear(out);
      out.append(stat(`${R.label}:`, String(sn)).el, stat("Term:", `${key === "savings" ? "₱" : ""}${fm(R.value(sn), 0)} ${key === "savings" ? "" : R.unit}`).el);
      const lines = [];
      for (let k = R.min; k <= Math.min(R.max, sn + 1); k++) lines.push(`${R.label} ${k}: ${fm(R.value(k), 0)}${k > R.min ? `   (${key === "bacteria" ? "×2" : `+${R.value(k) - R.value(k - 1)}`})` : ""}`);
      work.textContent = lines.slice(-6).join("\n") + `\n\nIn words: ${R.words}\nRule: ${R.rule}`;
    }
    function setup(k) {
      key = k; R = REAL[k]; v = R.start;
      text.textContent = R.text; qLine.textContent = R.q; clear(fb); ans.input.value = "";
      clear(sliderBox);
      sliderBox.append(elasticSlider({ id: "g8l8-real", label: R.label, min: R.min, max: R.max, value: R.start, step: 1, format: (x) => String(clamp(Math.round(x), R.min, R.max)), onInput: (x) => { v = x; draw(); } }).el);
      draw();
    }
    const ans = answerBox("g8l8-realq", "Answer:", (x) => { clear(fb); fb.append(pill(Math.abs(x - R.a) < 1e-9, `Correct! ${R.qsol}`, "Not yet – use the rule.")); });
    root.append(h("div", { class: "controls" }, segmented(Object.keys(REAL), key, setup, (k) => REAL[k].name)), text, sliderBox, svg, out, work, qLine, h("div", { class: "controls" }, ans.el), fb,
      h("p", { class: "note" }, "Adding the same amount each time gives a linear rule (an + b). Multiplying each time grows much faster."));
    setup(key);
  }

  // ------------------------------------------------------------ lesson

  Sim.register({
    id: "lesson8", unit: "D", num: 8, letter: "H", title: "Sequences and Patterns", simName: "Pattern Builder",
    comps: ["A13", "M8"], cycles: "C8,M4 – C9,M2", deped: "DepEd Week 9",
    bigQuestion: "How many matchsticks do you need for 50 squares in a row – without building them all?",
    mission: [
      "Growing Patterns: build Matchstick squares from step 1 to step 5. Record each step in the table.",
      "How many new matchsticks appear at each step? Predict step 10, then show the rule.",
      "Find the Rule: predict term 6 for each kind of sequence, then show the differences.",
      "For an “Add a constant” sequence, choose the rule for the nth term and test it.",
      "Real Patterns: which pattern grows fastest – seats, savings, or bacteria? Why?",
    ],
    discovery: "When the same amount d is added each time, the terms follow a linear rule aₙ = dn + c: the common difference is the number in front of n. Matchstick squares add 3 each step, so step n needs 3n + 1 sticks, and 50 squares need 151. When the differences change, or each term is multiplied, the rule is not linear – look at the second differences or the ratio.",
    mount(stage) {
      const body = h("div", { class: "stage-body" });
      const views = [growTab, ruleTab, realTab];
      let stopper = null;
      const t = tabs(["Growing Patterns", "Find the Rule", "Real Patterns"], (i) => { if (stopper) stopper(); clear(body); stopper = views[i](body) || null; });
      stage.append(t.el, body);
      stopper = growTab(body) || null;
      return () => { if (stopper) stopper(); };
    },
    check() {
      const kind = randInt(0, 5);
      if (kind === 0) {
        const sq = makeSeq("add"), t = sq.terms;
        return { q: `What is the next term? ${t.slice(0, 5).map((x) => fm(x)).join(", ")}, …`, answer: t[5], explain: `${sq.words} ${fm(t[4])} ${sq.d < 0 ? "−" : "+"} ${Math.abs(sq.d)} = ${fm(t[5])}.` };
      }
      if (kind === 1) {
        const d = randInt(2, 6), c = randInt(-4, 6), n = pick([10, 12, 15, 20, 25]);
        return { q: `The rule of a sequence is aₙ = ${linRule(d, c)}. Find the ${n}th term.`, answer: d * n + c, explain: `${d}(${n}) ${c < 0 ? "−" : "+"} ${Math.abs(c)} = ${fm(d * n + c)}.` };
      }
      if (kind === 2) {
        const d = randInt(2, 6), c = randInt(-3, 5), terms = [1, 2, 3, 4].map((n) => d * n + c);
        const right = linRule(d, c);
        const opts = [...new Set([right, linRule(1, d), linRule(d, 0) === right ? linRule(d, c + 1) : linRule(d, 0), linRule(d, terms[0])])];
        while (opts.length < 4) opts.push(linRule(d + opts.length, c));
        return { q: `Which rule gives the nth term of ${terms.map((x) => fm(x)).join(", ")}, …?`, choices: shuffle(opts), answer: right, explain: `The common difference is ${d}, so ${d}n; then ${d}(1) ${c < 0 ? "−" : "+"} ${Math.abs(c)} = ${fm(terms[0])}. Rule: ${right}.` };
      }
      if (kind === 3) {
        const r = pick([2, 3]), a = randInt(1, 4), t = [0, 1, 2, 3, 4].map((i) => a * r ** i);
        return { q: `What is the next term? ${t.slice(0, 4).join(", ")}, …`, answer: t[4], explain: `Multiply by ${r}: ${t[3]} × ${r} = ${t[4]}.` };
      }
      if (kind === 4) {
        const n = randInt(6, 30);
        return { q: `Matchstick squares in a row: 1 square uses 4 sticks, 2 squares use 7, 3 squares use 10. How many sticks for ${n} squares?`, answer: 3 * n + 1, explain: `Rule: 3n + 1 → 3(${n}) + 1 = ${3 * n + 1}.` };
      }
      const a = randInt(1, 6), d0 = randInt(1, 3), t = [a];
      for (let i = 0; i < 5; i++) t.push(t[i] + d0 + i);
      return { q: `What is the next term? ${t.slice(0, 5).join(", ")}, …`, answer: t[5], explain: `The differences are ${d0}, ${d0 + 1}, ${d0 + 2}, ${d0 + 3}; next add ${d0 + 4}: ${t[4]} + ${d0 + 4} = ${t[5]}.` };
    },
  });
})();
