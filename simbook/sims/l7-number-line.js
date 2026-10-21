/* Lesson 7 · G. Rational Numbers – Number Line Explorer */
(function () {
  "use strict";
  const { h, s, clear, randInt, pick, shuffle, fmt, Frac, parseNumber, longDivision, primeFactors, tabs, stat, pill, Spring } = Sim;

  function decimalText(fr) {
    const { whole, digits, repeatStart } = longDivision(fr.n, fr.d);
    if (!digits.length) return { text: String(whole), repeats: false };
    if (repeatStart < 0) return { text: `${whole}.${digits.join("")}`, repeats: false };
    const fixed = digits.slice(0, repeatStart).join(""), rep = digits.slice(repeatStart).join("");
    const shown = (fixed + rep.repeat(Math.max(1, Math.ceil(6 / rep.length)))).slice(0, Math.max(6, fixed.length + rep.length * 2));
    return { text: `${whole}.${shown}…`, bar: `${whole}.${fixed}(${rep})`, repeats: true, rep };
  }

  function numberLine(marks, lo = 0, hi = 2, ticks = 4) {
    const W = 600, X = (v) => 30 + ((v - lo) / (hi - lo)) * (W - 60);
    const svg = s("svg", { viewBox: `0 0 ${W} 120`, role: "img", "aria-label": "Number line" });
    svg.append(s("line", { x1: X(lo), y1: 60, x2: X(hi), y2: 60, stroke: "var(--ink)", "stroke-width": 2 }));
    for (let i = 0; i <= ticks; i++) {
      const v = lo + ((hi - lo) * i) / ticks;
      svg.append(s("line", { x1: X(v), y1: 52, x2: X(v), y2: 68, stroke: "var(--ink)", "stroke-width": 2 }));
      const digits = Math.min(6, Math.max(0, Math.ceil(-Math.log10((hi - lo) / ticks) - 1e-9)));
      svg.append(s("text", { x: X(v), y: 88, "text-anchor": "middle", class: "svg-text" }, fmt(v, digits)));
    }
    marks.forEach((m, i) => {
      const x = X(m.v);
      svg.append(s("circle", { cx: x, cy: 60, r: 7, fill: m.color || "var(--shape-b)" }));
      svg.append(s("text", { x, y: i % 2 ? 108 : 36, "text-anchor": "middle", class: "svg-text", "font-weight": 700, fill: m.color || "var(--shape-b)" }, m.label));
    });
    return svg;
  }

  // ------------------------------------------------------------ converter

  function converter(root) {
    const input = h("input", { type: "text", id: "l7-in", value: "5/12", autocomplete: "off" });
    const out = h("div", { class: "readout" }), work = h("pre", { class: "workings" }), why = h("p"), line = h("div");
    let label = "";
    // The point and the scale both glide to the new number.
    const glide = new Spring([5 / 12, 2], ([v, hi]) => { clear(line); line.append(numberLine([{ v, label }], 0, hi, Math.round(hi) * 2)); }, { stiffness: 170, damping: 16 });
    function update() {
      clear(out);
      const fr = parseNumber(input.value);
      if (!fr || fr.n < 0) { work.textContent = "Type a fraction (3/8), a mixed number (1 1/4), a decimal (0.45), or a percentage (125%). Use zero or a positive number."; why.textContent = ""; return; }
      const dec = decimalText(fr);
      const pct = fr.mul(100);
      out.append(stat("Fraction:", fr.toString()).el, fr.d !== 1 && fr.n > fr.d ? stat("Mixed:", fr.mixed()).el : null,
        stat("Decimal:", dec.text).el, stat("Percentage:", (dec.repeats ? "≈ " : "") + fmt(pct.value(), 2) + "%").el);
      const f = primeFactors(fr.d);
      work.textContent = `${fr.n} ÷ ${fr.d} = ${dec.text}${dec.repeats ? `   (the digits "${dec.rep}" repeat: ${dec.bar})` : "   (the division ends)"}\n${fr.toString()} × 100% = ${fmt(pct.value(), 4)}%`;
      why.textContent = fr.d === 1 ? "A whole number is a rational number too." :
        `In lowest terms the denominator is ${fr.d} = ${f.join(" × ")}. ` + (f.every((p) => p === 2 || p === 5) ? "Its only prime factors are 2 and 5, so the decimal terminates." : "It has a prime factor other than 2 and 5, so the decimal repeats.");
      const hi = Math.max(2, Math.ceil(fr.value()));
      label = input.value.trim();
      glide.set([fr.value(), hi]);
    }
    input.addEventListener("input", update);
    root.append(h("div", { class: "controls" }, h("label", { for: "l7-in" }, "Number", input),
      ...["3/8", "0.45", "2/3", "125%", "7/20", "1 1/4"].map((v) => h("button", { class: "btn ghost", type: "button", onclick: () => { input.value = v; update(); } }, v))),
    out, line, work, why);
    update();
    return () => glide.stop();
  }

  // ------------------------------------------------------------ order it

  function makeCard(used) {
    for (let tries = 0; tries < 50; tries++) {
      const d = pick([2, 3, 4, 5, 8, 10, 20, 25]), n = randInt(1, 2 * d - 1);
      const fr = new Frac(n, d), v = fr.value();
      if (used.some((u) => Math.abs(u - v) < 0.02)) continue;
      const term = primeFactors(fr.d).every((p) => p === 2 || p === 5);
      const form = term ? pick(["frac", "dec", "pct"]) : "frac";
      const label = form === "frac" ? (fr.n > fr.d && Math.random() < 0.5 ? fr.mixed() : fr.toString()) : form === "dec" ? fmt(v, 4) : `${fmt(v * 100, 2)}%`;
      used.push(v);
      return { v, label };
    }
    return null;
  }

  function orderIt(root) {
    const area = h("div", { class: "stage" });
    function deal() {
      clear(area);
      const used = [];
      const cards = Array.from({ length: 6 }, () => makeCard(used)).filter(Boolean);
      const chosen = [];
      const row = h("div", { class: "choices" });
      const slots = h("p", { class: "workings" }, "Your order: ");
      const result = h("div");
      cards.forEach((c) => {
        const b = h("button", { type: "button", onclick: () => {
          if (b.disabled) return;
          b.disabled = true; chosen.push(c);
          slots.textContent = "Your order: " + chosen.map((x) => x.label).join("  <  ");
          if (chosen.length === cards.length) finish();
        } }, c.label);
        row.append(b);
      });
      function finish() {
        const sorted = cards.slice().sort((a, b) => a.v - b.v);
        const ok = chosen.every((c, i) => c === sorted[i]);
        const lineBox = h("div");
        // Each card slides from where you placed it in your order to its true position.
        const fly = new Spring(0, (k) => {
          clear(lineBox);
          lineBox.append(numberLine(sorted.map((c, i) => {
            const start = (chosen.indexOf(c) + 0.5) * (2 / sorted.length);
            return { v: start + (c.v - start) * k, label: c.label, color: i % 2 ? "var(--shape-a)" : "var(--shape-b)" };
          }), 0, 2, 8));
        }, { stiffness: 120, damping: 14 });
        fly.jump(0); fly.set(1);
        result.append(pill(ok, "Perfect order!", "Not quite – watch the cards move to their true places."), lineBox,
          h("p", { class: "workings" }, "Correct order: " + sorted.map((c) => `${c.label} (${fmt(c.v, 3)})`).join("  <  ")),
          h("button", { class: "btn", type: "button", onclick: deal }, "Deal new cards"));
      }
      area.append(h("p", {}, "Tap the cards from LEAST to GREATEST."), row, slots, result);
    }
    root.append(area);
    deal();
  }

  // ------------------------------------------------------------ zoom between

  function between(root) {
    const a = h("input", { type: "text", id: "l7-a", value: "0.7" }), b = h("input", { type: "text", id: "l7-b", value: "0.72" });
    const area = h("div");
    let level = 0, lo = 0, hi = 1, view = [0, 1], marks = [];
    const lineBox = h("div");
    // Zooming eases the window of the number line instead of cutting to it.
    const zoom = new Spring(view, (v) => { view = v; clear(lineBox); lineBox.append(numberLine(marks.filter((m) => m.v >= v[0] - 1e-12 && m.v <= v[1] + 1e-12), v[0], v[1], 10)); }, { stiffness: 110, damping: 19 });
    function reset() { level = 0; draw(); }
    function draw() {
      clear(area);
      const fa = parseNumber(a.value), fb = parseNumber(b.value);
      if (!fa || !fb || fa.eq(fb)) { area.append(h("p", { class: "note" }, "Enter two different numbers.")); return; }
      const x = Math.min(fa.value(), fb.value()), y = Math.max(fa.value(), fb.value());
      if (level === 0) { lo = Math.floor(x); hi = Math.max(lo + 1, Math.ceil(y)); } else { lo = x; hi = y; }
      const mid = fa.add(fb).div(2);
      marks = [{ v: x, label: fmt(x, 6), color: "var(--shape-a)" }, { v: y, label: fmt(y, 6), color: "var(--shape-a)" }];
      if (level > 0) marks.push({ v: mid.value(), label: `${fmt(mid.value(), 6)}`, color: "var(--shape-b)" });
      const pad = (hi - lo) * (level > 0 ? 0.15 : 0);
      zoom.set([lo - pad, hi + pad]);
      area.append(lineBox,
        h("div", { class: "readout" }, stat("Halfway:", `(${a.value} + ${b.value}) ÷ 2 = ${fmt(mid.value(), 6)}`).el),
        h("div", { class: "controls" }, h("button", { class: "btn", type: "button", onclick: () => { level = 1; draw(); } }, "Zoom in"),
          h("button", { class: "btn ghost", type: "button", onclick: () => { a.value = fmt(mid.value(), 8); draw(); } }, "Zoom again (use the halfway number)"),
          h("button", { class: "btn ghost", type: "button", onclick: reset }, "Reset")));
    }
    [a, b].forEach((el) => el.addEventListener("input", reset));
    root.append(h("div", { class: "controls" }, h("label", { for: "l7-a" }, "First", a), h("label", { for: "l7-b" }, "Second", b)), area,
      h("p", { class: "note" }, "Keep zooming. Will you ever run out of numbers in between?"));
    draw();
    return () => zoom.stop();
  }

  // ------------------------------------------------------------ lesson

  Sim.register({
    id: "lesson7", unit: "C", num: 7, letter: "G", title: "Rational Numbers", simName: "Number Line Explorer",
    comps: ["A12", "A13", "M10"], cycles: "C7,M1 – C7,M4", deped: "DepEd Week 7",
    bigQuestion: "Are ½, 0.5, and 50% the same number?",
    mission: [
      "Converter: try 3/8, 2/3, 7/20, and 5/12. Which decimals end and which repeat? Read the reason below each one.",
      "Find a fraction whose decimal repeats two digits (hint: try denominators 11 or 33).",
      "Order It: deal three sets of cards and order them correctly. Which strategy worked best?",
      "Zoom Between: find three numbers between 0.7 and 0.72.",
    ],
    discovery: "A rational number can be written as a fraction a/b (b ≠ 0), and as a decimal or a percentage – the same point on the number line in different forms. A fraction in lowest terms terminates when its denominator has only 2s and 5s as prime factors; otherwise its decimal repeats. To order mixed forms, change them all to decimals. Between any two rational numbers there is always another one.",
    mount(stage) {
      const body = h("div", { class: "stage-body" });
      const views = [converter, orderIt, between];
      let stopper = null;
      const t = tabs(["Converter", "Order It", "Zoom Between"], (i) => { if (stopper) stopper(); clear(body); stopper = views[i](body) || null; });
      stage.append(t.el, body);
      stopper = converter(body);
      return () => { if (stopper) stopper(); };
    },
    check() {
      const kind = randInt(0, 5);
      if (kind === 0) { const fr = pick([[3, 8], [7, 20], [9, 25], [5, 4], [11, 40], [3, 5]]); const f = new Frac(...fr); return { q: `Write ${f.toString()} as a decimal.`, answer: f.value(), tol: 1e-6, explain: `${f.n} ÷ ${f.d} = ${fmt(f.value(), 4)}.` }; }
      if (kind === 1) { const v = pick(["0.45", "0.6", "0.125", "0.75", "1.25", "0.04"]); const f = parseNumber(v); return { q: `Write ${v} as a fraction in lowest terms.`, answer: f.value(), tol: 1e-9, hint: "Type it like 9/20.", accept: (t) => { const g = parseNumber(t); return !!g && t.includes("/") && g.eq(f) && /^\s*\d+\s*\/\s*\d+\s*$/.test(t) && g.n === Number(t.split("/")[0]); }, explain: `${v} = ${f.toString()}.` }; }
      if (kind === 2) { const f = new Frac(...pick([[3, 4], [2, 5], [7, 8], [5, 4], [1, 20]])); return { q: `Write ${f.toString()} as a percentage.`, answer: f.value() * 100, unit: "%", explain: `${f.toString()} × 100% = ${fmt(f.value() * 100)}%.` }; }
      if (kind === 3) { const f = new Frac(...pick([[1, 3], [2, 3], [5, 12], [7, 20], [3, 8], [4, 11], [9, 40], [1, 6]])); const term = primeFactors(f.d).every((p) => p === 2 || p === 5); return { q: `Does ${f.toString()} give a terminating or a repeating decimal?`, choices: ["Terminating", "Repeating"], answer: term ? "Terminating" : "Repeating", explain: `${f.d} = ${primeFactors(f.d).join(" × ")}; ${f.toString()} = ${decimalText(f).text}` }; }
      if (kind === 4) { const pairs = [["5/8", "0.6"], ["33%", "1/3"], ["0.09", "0.1"], ["3/4", "72%"], ["2/3", "0.7"], ["1 1/4", "1.2"]]; const [x, y] = pick(pairs); const vx = parseNumber(x).value(), vy = parseNumber(y).value(); return { q: `Which is greater: ${x} or ${y}?`, choices: [x, y], answer: vx > vy ? x : y, explain: `${x} = ${fmt(vx, 4)} and ${y} = ${fmt(vy, 4)}.` }; }
      const a = pick([0.7, 0.4, 1.2, 0.25]), b = a + pick([0.02, 0.05, 0.1]);
      return { q: `Give any number between ${fmt(a)} and ${fmt(b)}.`, answer: (a + b) / 2, accept: (t) => { const g = parseNumber(t); return !!g && g.value() > a + 1e-12 && g.value() < b - 1e-12; }, explain: `For example, the halfway number ${fmt((a + b) / 2, 3)}.` };
    },
  });
})();
