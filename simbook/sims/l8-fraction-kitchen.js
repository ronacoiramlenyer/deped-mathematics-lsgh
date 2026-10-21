/* Lesson 8 · H. Operations on Rational Numbers – Fraction Kitchen */
(function () {
  "use strict";
  const { h, s, clear, randInt, pick, fmt, Frac, parseNumber, lcm, tabs, stat, pill } = Sim;

  const show = (f) => (f.d === 1 ? String(f.n) : f.n > f.d ? `${f.mixed()} (= ${f.toString()})` : f.toString());

  /** Bar of length value (in wholes), cut into pieces of 1/parts. */
  function bar(svg, y, value, parts, color, X, label) {
    const wholes = Math.ceil(value - 1e-9) || 1;
    for (let w = 0; w < wholes; w++) svg.append(s("rect", { x: X(w), y, width: X(1) - X(0), height: 30, fill: "none", stroke: "var(--line)", "stroke-width": 1.5 }));
    const pieces = Math.round(value * parts);
    for (let i = 0; i < pieces; i++) svg.append(s("rect", { x: X(i / parts), y, width: X(1 / parts) - X(0), height: 30, fill: color, stroke: "var(--paper)", "stroke-width": 1.5 }));
    svg.append(s("text", { x: 4, y: y + 20, class: "svg-label" }, label));
  }

  // ------------------------------------------------------------ fraction bars

  function bars(root) {
    const A = h("input", { type: "text", id: "l8-a", value: "2/3" }), B = h("input", { type: "text", id: "l8-b", value: "3/4" });
    let op = "+";
    const opSel = h("select", { id: "l8-op" }, ["+", "−", "×", "÷"].map((o) => h("option", { value: o }, o)));
    const pic = h("div"), work = h("pre", { class: "workings" }), out = h("div", { class: "readout" });
    function update() {
      clear(pic); clear(out);
      op = opSel.value;
      const a = parseNumber(A.value), b = parseNumber(B.value);
      if (!a || !b || a.n < 0 || b.n < 0) { work.textContent = "Type fractions such as 2/3, 1 1/2, or 0.75 (zero or positive)."; return; }
      if (op === "÷" && b.n === 0) { work.textContent = "You cannot divide by zero."; return; }
      if (a.value() > 3 || b.value() > 3) { work.textContent = "Use numbers up to 3 so the picture fits."; return; }
      let r, steps;
      if (op === "+" || op === "−") {
        const L = lcm(a.d, b.d);
        r = op === "+" ? a.add(b) : a.sub(b);
        if (r.n < 0) { work.textContent = "This term we work with results of zero or more. Swap the numbers."; return; }
        steps = `Common denominator: LCD(${a.d}, ${b.d}) = ${L}\n${a.toString()} = ${a.n * (L / a.d)}/${L}    ${b.toString()} = ${b.n * (L / b.d)}/${L}\n${a.n * (L / a.d)}/${L} ${op} ${b.n * (L / b.d)}/${L} = ${a.n * (L / a.d) + (op === "+" ? 1 : -1) * b.n * (L / b.d)}/${L} = ${show(r)}`;
        const maxV = Math.max(a.value(), b.value(), r.value(), 1);
        const svg = s("svg", { viewBox: `0 0 600 150`, role: "img", "aria-label": "Fraction bars" });
        const X = (v) => 60 + (v / Math.ceil(maxV)) * 520;
        bar(svg, 10, a.value(), L, "var(--shape-a-soft)", X, "A");
        bar(svg, 55, b.value(), L, "var(--shape-b-soft)", X, "B");
        bar(svg, 100, r.value(), L, "var(--accent-soft)", X, op === "+" ? "A+B" : "A−B");
        pic.append(svg, h("p", { class: "note" }, `Every bar is cut into ${L}ths so the pieces are the same size.`));
      } else if (op === "×") {
        r = a.mul(b);
        steps = `${a.toString()} × ${b.toString()} = (${a.n} × ${b.n}) / (${a.d} × ${b.d}) = ${a.n * b.n}/${a.d * b.d} = ${show(r)}`;
        const cw = Math.ceil(a.value()) || 1, ch = Math.ceil(b.value()) || 1;
        const size = Math.min(520 / cw, 260 / ch);
        const svg = s("svg", { viewBox: `0 0 600 ${ch * size + 20}`, role: "img", "aria-label": "Area model" });
        const ox = 40, oy = 10;
        svg.append(s("rect", { x: ox, y: oy, width: a.value() * size, height: b.value() * size, fill: "var(--accent-soft)", stroke: "var(--accent)", "stroke-width": 2 }));
        for (let i = 0; i <= cw * a.d; i++) svg.append(s("line", { x1: ox + (i / a.d) * size, y1: oy, x2: ox + (i / a.d) * size, y2: oy + ch * size, stroke: "var(--line)" }));
        for (let j = 0; j <= ch * b.d; j++) svg.append(s("line", { x1: ox, y1: oy + (j / b.d) * size, x2: ox + cw * size, y2: oy + (j / b.d) * size, stroke: "var(--line)" }));
        for (let i = 0; i < cw; i++) for (let j = 0; j < ch; j++) svg.append(s("rect", { x: ox + i * size, y: oy + j * size, width: size, height: size, fill: "none", stroke: "var(--ink)", "stroke-width": 2 }));
        pic.append(svg, h("p", { class: "note" }, `Each black square is 1 whole, cut into ${a.d * b.d} small cells. The green rectangle (${a.toString()} by ${b.toString()}) covers ${a.n * b.n} cells: ${a.n * b.n}/${a.d * b.d}.`));
      } else {
        r = a.div(b);
        steps = `${a.toString()} ÷ ${b.toString()} = ${a.toString()} × ${b.d}/${b.n} = ${show(r)}\nQuestion: how many ${b.toString()}'s fit in ${a.toString()}?`;
        const maxV = Math.max(a.value(), 1), X = (v) => 60 + (v / Math.ceil(maxV)) * 520;
        const svg = s("svg", { viewBox: "0 0 600 110", role: "img", "aria-label": "Division as measuring" });
        bar(svg, 10, a.value(), lcm(a.d, b.d), "var(--shape-a-soft)", X, "A");
        const full = Math.floor(r.value() + 1e-9);
        for (let k = 0; k < Math.ceil(r.value() - 1e-9); k++) {
          const start = k * b.value(), end = Math.min(a.value(), (k + 1) * b.value());
          svg.append(s("rect", { x: X(start), y: 55, width: X(end) - X(start), height: 30, fill: k < full ? "var(--shape-b-soft)" : "var(--gold-soft)", stroke: "var(--shape-b)" }));
          svg.append(s("text", { x: (X(start) + X(end)) / 2, y: 75, "text-anchor": "middle", class: "svg-text" }, k < full ? String(k + 1) : "part"));
        }
        svg.append(s("text", { x: 4, y: 75, class: "svg-label" }, "B's"));
        pic.append(svg, h("p", { class: "note" }, `${full} whole copies of ${b.toString()} fit${r.value() - full > 1e-9 ? `, plus ${r.sub(full).toString()} of another` : ""}.`));
      }
      work.textContent = steps;
      out.append(stat("Answer:", show(r)).el, stat("Decimal:", fmt(r.value(), 4)).el);
    }
    [A, B, opSel].forEach((el) => el.addEventListener("input", update));
    root.append(h("div", { class: "controls" }, h("label", { for: "l8-a" }, "A", A), h("label", { for: "l8-op" }, "Operation", opSel), h("label", { for: "l8-b" }, "B", B)),
      pic, out, work);
    update();
  }

  // ------------------------------------------------------------ kitchen

  const RECIPE = [
    { item: "Flour", amt: new Frac(9, 4), unit: "cups" },
    { item: "Sugar", amt: new Frac(3, 4), unit: "cup" },
    { item: "Evaporated milk", amt: new Frac(3, 2), unit: "cups" },
    { item: "Baking powder", amt: new Frac(1, 1), unit: "tbsp" },
    { item: "Grated cheese", amt: new Frac(1, 3), unit: "cup" },
  ];

  function kitchen(root) {
    let k = new Frac(5, 2);
    const custom = h("input", { type: "text", id: "l8-k", value: "2 1/2" });
    const tbody = h("tbody"), inspect = h("div", { class: "panel" });
    function update() {
      const f = parseNumber(custom.value);
      if (!f || f.n <= 0) return;
      k = f;
      clear(tbody);
      RECIPE.forEach((r) => {
        const v = r.amt.mul(k);
        tbody.append(h("tr", {}, h("td", {}, r.item), h("td", { class: "num" }, `${r.amt.mixed()} ${r.unit}`), h("td", { class: "num" }, `× ${k.mixed()}`), h("td", { class: "num" }, `${v.mixed()} ${r.unit}`)));
      });
      newOrder();
    }
    function newOrder() {
      clear(inspect);
      const r = pick(RECIPE), mult = pick([new Frac(1, 2), new Frac(2, 3), new Frac(3, 2), new Frac(5, 2), new Frac(3, 1), new Frac(4, 3)]);
      const ans = r.amt.mul(mult);
      const inp = h("input", { type: "text", id: "l8-insp", autocomplete: "off", "aria-label": "Your amount" });
      const fb = h("p", { class: "feedback", "aria-live": "polite" });
      const check = () => { const g = parseNumber(inp.value); const ok = !!g && g.eq(ans); fb.className = "feedback " + (ok ? "ok" : "bad"); fb.textContent = ok ? `Order served! ${r.amt.mixed()} × ${mult.mixed()} = ${ans.mixed()} ${r.unit}.` : "The inspector sends it back. Multiply the recipe amount by the order size."; };
      inp.addEventListener("keydown", (e) => { if (e.key === "Enter") check(); });
      inspect.append(h("h2", {}, "Kitchen inspector"), h("p", {}, `A customer orders ${mult.mixed()} batch${mult.value() === 1 ? "" : "es"}. How much ${r.item.toLowerCase()} (${r.unit}) do you need?`),
        h("div", { class: "check-row" }, inp, h("button", { class: "btn", type: "button", onclick: check }, "Serve"), h("button", { class: "btn ghost", type: "button", onclick: newOrder }, "Next order")), fb);
    }
    custom.addEventListener("input", update);
    root.append(h("p", {}, h("b", {}, "Puto"), " – one batch makes 24 pieces."),
      h("div", { class: "controls" }, h("label", { for: "l8-k" }, "Order size (batches)", custom),
        ...["1/2", "2/3", "1 1/2", "2 1/2", "3"].map((v) => h("button", { class: "btn ghost", type: "button", onclick: () => { custom.value = v; update(); } }, v))),
      h("div", { class: "table-wrap" }, h("table", { class: "data" }, h("thead", {}, h("tr", {}, h("th", {}, "Ingredient"), h("th", {}, "1 batch"), h("th", {}, "Order"), h("th", {}, "You need"))), tbody)),
      inspect);
    update();
  }

  // ------------------------------------------------------------ decimal grid

  function grid(root) {
    const A = h("input", { type: "number", id: "l8-da", min: 0.1, max: 1, step: 0.1, value: 0.6 });
    const B = h("input", { type: "number", id: "l8-db", min: 0.1, max: 1, step: 0.1, value: 0.5 });
    const pic = h("div"), out = h("div", { class: "readout" }), work = h("pre", { class: "workings" });
    function update() {
      clear(pic); clear(out);
      const a = Math.round(Math.min(1, Math.max(0, Number(A.value))) * 10), b = Math.round(Math.min(1, Math.max(0, Number(B.value))) * 10);
      const size = 26, svg = s("svg", { viewBox: `0 0 ${10 * size + 80} ${10 * size + 40}`, role: "img", "aria-label": "Hundred grid" });
      for (let i = 0; i < 10; i++) for (let j = 0; j < 10; j++) {
        const inA = i < a, inB = j < b;
        svg.append(s("rect", { x: 40 + i * size, y: 10 + j * size, width: size, height: size, fill: inA && inB ? "var(--accent)" : inA ? "var(--shape-a-soft)" : inB ? "var(--shape-b-soft)" : "var(--paper)", stroke: "var(--line)" }));
      }
      svg.append(s("text", { x: 40 + (a * size) / 2, y: 10 * size + 30, "text-anchor": "middle", class: "svg-text" }, fmt(a / 10, 1)));
      svg.append(s("text", { x: 30, y: 15 + (b * size) / 2, "text-anchor": "end", class: "svg-text" }, fmt(b / 10, 1)));
      pic.append(svg);
      out.append(stat("Overlap:", `${a * b} of 100 squares`).el, stat("Product:", fmt((a * b) / 100, 2)).el,
        a < 10 && b < 10 ? pill(true, "Smaller than both factors", "") : null);
      work.textContent = `${fmt(a / 10, 1)} × ${fmt(b / 10, 1)}: multiply ${a} × ${b} = ${a * b}\nThere are 1 + 1 = 2 decimal places in the factors, so the product is ${fmt((a * b) / 100, 2)}.`;
    }
    [A, B].forEach((el) => el.addEventListener("input", update));
    root.append(h("div", { class: "controls" }, h("label", { for: "l8-da" }, "First (tenths)", A), h("label", { for: "l8-db" }, "Second (tenths)", B)), pic, out, work,
      h("p", { class: "note" }, "The whole grid is 1. The dark green overlap is the product."));
    update();
  }

  // ------------------------------------------------------------ lesson

  function randFrac() { for (;;) { const d = pick([2, 3, 4, 5, 6, 8]); const f = new Frac(randInt(1, 2 * d - 1), d); if (f.d !== 1) return f; } }

  Sim.register({
    id: "lesson8", unit: "C", num: 8, letter: "H", title: "Operations on Rational Numbers", simName: "Fraction Kitchen",
    comps: ["A14", "M11", "T4"], cycles: "C7,M5 – C9,M1", deped: "DepEd Weeks 8–9",
    bigQuestion: "How much sugar do you need for 2½ batches of puto?",
    mission: [
      "Fraction Bars: show 2/3 + 3/4. Why must both bars be cut into twelfths?",
      "Switch to ÷ and show 3/4 ÷ 3/8. Why is the answer bigger than 3/4?",
      "Kakanin Kitchen: serve five orders for the inspector without a mistake.",
      "Decimal Grid: show 0.6 × 0.5. Why is the product smaller than both factors?",
    ],
    discovery: "To add or subtract fractions, cut them into same-size pieces (a common denominator). To multiply, multiply numerators and denominators – the area model shows why. Dividing asks “how many of these fit?”, so dividing by a number less than 1 gives a bigger answer. Multiplying by a number less than 1 gives a smaller answer. Scaling a recipe means multiplying every amount by the same number.",
    mount(stage) {
      const body = h("div", { class: "stage-body" });
      const views = [bars, kitchen, grid];
      const t = tabs(["Fraction Bars", "Kakanin Kitchen", "Decimal Grid"], (i) => { clear(body); views[i](body); });
      stage.append(t.el, body);
      bars(body);
    },
    check() {
      const kind = randInt(0, 4);
      const fracAccept = (ans) => (t) => { const g = parseNumber(t); return !!g && g.eq(ans); };
      if (kind <= 1) {
        const a = randFrac(), b = randFrac();
        const op = pick(kind === 0 ? ["+", "−"] : ["×", "÷"]);
        let x = a, y = b;
        if (op === "−" && x.value() < y.value()) [x, y] = [y, x];
        const r = op === "+" ? x.add(y) : op === "−" ? x.sub(y) : op === "×" ? x.mul(y) : x.div(y);
        return { q: `Compute ${x.mixed()} ${op} ${y.mixed()}.`, answer: r.value(), accept: fracAccept(r), hint: "Answer as a fraction or mixed number, e.g. 1 5/12.", explain: `= ${r.mixed()}${r.d !== 1 && r.n > r.d ? ` (${r.toString()})` : ""}.` };
      }
      if (kind === 2) {
        const [x, y, op] = pick([[4.75, 12.6, "+"], [20, 7.85, "−"], [3.2, 0.15, "×"], [7.2, 0.04, "÷"], [12.5, 0.08, "×"], [9.6, 0.3, "÷"], [150.75, 89.5, "+"]]);
        const r = op === "+" ? x + y : op === "−" ? x - y : op === "×" ? x * y : x / y;
        return { q: `Compute ${x} ${op} ${y}.`, answer: r, tol: 1e-6, explain: `= ${fmt(r, 4)}.` };
      }
      if (kind === 3) {
        const L = pick([new Frac(11, 2), new Frac(9, 2), new Frac(15, 4)]), p = pick([new Frac(3, 4), new Frac(1, 2), new Frac(3, 8)]);
        const pieces = Math.floor(L.div(p).value() + 1e-9);
        return { q: `A ribbon ${L.mixed()} m long is cut into pieces ${p.toString()} m long. How many whole pieces can be cut?`, answer: pieces, explain: `${L.mixed()} ÷ ${p.toString()} = ${L.div(p).mixed()}, so ${pieces} whole pieces.` };
      }
      const r = pick(RECIPE), m = pick([new Frac(1, 2), new Frac(5, 2), new Frac(3, 1), new Frac(2, 3)]);
      const ans = r.amt.mul(m);
      return { q: `One batch of puto needs ${r.amt.mixed()} ${r.unit} of ${r.item.toLowerCase()}. How much is needed for ${m.mixed()} batches?`, answer: ans.value(), accept: fracAccept(ans), unit: r.unit, explain: `${r.amt.mixed()} × ${m.mixed()} = ${ans.mixed()}.` };
    },
  });
})();
