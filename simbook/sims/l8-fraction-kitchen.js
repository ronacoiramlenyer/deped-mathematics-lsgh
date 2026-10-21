/* Lesson 8 · H. Operations on Rational Numbers – Fraction Kitchen */
(function () {
  "use strict";
  const { h, s, clear, randInt, pick, fmt, Frac, parseNumber, lcm, tabs, stat, pill, Spring, elasticSlider, handleSet, clamp } = Sim;

  const show = (f) => (f.d === 1 ? String(f.n) : f.n > f.d ? `${f.mixed()} (= ${f.toString()})` : f.toString());

  /** Bar of length value (in wholes): a continuous fill over a ruler cut into 1/parts. */
  function bar(svg, y, value, parts, color, X, label, wholes) {
    for (let w = 0; w < wholes; w++) svg.append(s("rect", { x: X(w), y, width: X(1) - X(0), height: 30, fill: "none", stroke: "var(--line)", "stroke-width": 1.5 }));
    svg.append(s("rect", { x: X(0), y, width: Math.max(0, X(value) - X(0)), height: 30, fill: color }));
    for (let i = 1; i < wholes * parts; i++) svg.append(s("line", { x1: X(i / parts), y1: y, x2: X(i / parts), y2: y + 30, stroke: "var(--paper)", "stroke-width": 1.5 }));
    svg.append(s("text", { x: 4, y: y + 20, class: "svg-label" }, label));
  }

  // ------------------------------------------------------------ fraction bars

  function bars(root) {
    const A = h("input", { type: "text", id: "l8-a", value: "2/3" }), B = h("input", { type: "text", id: "l8-b", value: "3/4" });
    const opSel = h("select", { id: "l8-op" }, ["+", "−", "×", "÷"].map((o) => h("option", { value: o }, o)));
    const pic = h("div"), work = h("pre", { class: "workings" }), out = h("div", { class: "readout" });
    let meta = null;
    // The pictures glide from the old numbers to the new ones.
    const glide = new Spring([2 / 3, 3 / 4, 17 / 12], (v) => paint(v), { stiffness: 150, damping: 17 });

    function paint([av, bv, rv]) {
      clear(pic);
      if (!meta) return;
      const { op, a, b, L } = meta;
      if (op === "+" || op === "−") {
        const wholes = Math.max(1, Math.ceil(Math.max(meta.av, meta.bv, meta.rv) - 1e-9));
        const svg = s("svg", { viewBox: "0 0 600 150", role: "img", "aria-label": "Fraction bars" });
        const X = (v) => 60 + (v / wholes) * 520;
        bar(svg, 10, av, L, "var(--shape-a-soft)", X, "A", wholes);
        bar(svg, 55, bv, L, "var(--shape-b-soft)", X, "B", wholes);
        bar(svg, 100, Math.max(0, rv), L, "var(--accent-soft)", X, op === "+" ? "A+B" : "A−B", wholes);
        pic.append(svg, h("p", { class: "note" }, `Every bar is cut into ${L}ths so the pieces are the same size.`));
      } else if (op === "×") {
        const cw = Math.max(1, Math.ceil(meta.av - 1e-9)), ch = Math.max(1, Math.ceil(meta.bv - 1e-9));
        const size = Math.min(520 / cw, 260 / ch);
        const svg = s("svg", { viewBox: `0 0 600 ${ch * size + 20}`, role: "img", "aria-label": "Area model" });
        const ox = 40, oy = 10;
        svg.append(s("rect", { x: ox, y: oy, width: Math.max(0, av * size), height: Math.max(0, bv * size), fill: "var(--accent-soft)", stroke: "var(--accent)", "stroke-width": 2 }));
        for (let i = 0; i <= cw * a.d; i++) svg.append(s("line", { x1: ox + (i / a.d) * size, y1: oy, x2: ox + (i / a.d) * size, y2: oy + ch * size, stroke: "var(--line)" }));
        for (let j = 0; j <= ch * b.d; j++) svg.append(s("line", { x1: ox, y1: oy + (j / b.d) * size, x2: ox + cw * size, y2: oy + (j / b.d) * size, stroke: "var(--line)" }));
        for (let i = 0; i < cw; i++) for (let j = 0; j < ch; j++) svg.append(s("rect", { x: ox + i * size, y: oy + j * size, width: size, height: size, fill: "none", stroke: "var(--ink)", "stroke-width": 2 }));
        pic.append(svg, h("p", { class: "note" }, `Each black square is 1 whole, cut into ${a.d * b.d} small cells. The green rectangle (${a.toString()} by ${b.toString()}) covers ${a.n * b.n} cells: ${a.n * b.n}/${a.d * b.d}.`));
      } else {
        const wholes = Math.max(1, Math.ceil(meta.av - 1e-9)), X = (v) => 60 + (v / wholes) * 520;
        const svg = s("svg", { viewBox: "0 0 600 110", role: "img", "aria-label": "Division as measuring" });
        bar(svg, 10, av, lcm(a.d, b.d), "var(--shape-a-soft)", X, "A", wholes);
        const q = bv > 1e-6 ? av / bv : 0, full = Math.floor(q + 1e-9);
        for (let k = 0; k < Math.ceil(q - 1e-9) && k < 60; k++) {
          const start = k * bv, end = Math.min(av, (k + 1) * bv);
          svg.append(s("rect", { x: X(start), y: 55, width: Math.max(0, X(end) - X(start)), height: 30, fill: k < full ? "var(--shape-b-soft)" : "var(--gold-soft)", stroke: "var(--shape-b)" }));
          if (X(end) - X(start) > 18) svg.append(s("text", { x: (X(start) + X(end)) / 2, y: 75, "text-anchor": "middle", class: "svg-text" }, k < full ? String(k + 1) : "part"));
        }
        svg.append(s("text", { x: 4, y: 75, class: "svg-label" }, "B's"));
        const r = meta.r, fullR = Math.floor(r.value() + 1e-9);
        pic.append(svg, h("p", { class: "note" }, `${fullR} whole copies of ${b.toString()} fit${r.value() - fullR > 1e-9 ? `, plus ${r.sub(fullR).toString()} of another` : ""}.`));
      }
    }

    function update() {
      clear(out);
      const op = opSel.value;
      const a = parseNumber(A.value), b = parseNumber(B.value);
      if (!a || !b || a.n < 0 || b.n < 0) { work.textContent = "Type fractions such as 2/3, 1 1/2, or 0.75 (zero or positive)."; return; }
      if (op === "÷" && b.n === 0) { work.textContent = "You cannot divide by zero."; return; }
      if (a.value() > 3 || b.value() > 3) { work.textContent = "Use numbers up to 3 so the picture fits."; return; }
      let r, steps;
      const L = lcm(a.d, b.d);
      if (op === "+" || op === "−") {
        r = op === "+" ? a.add(b) : a.sub(b);
        if (r.n < 0) { work.textContent = "This term we work with results of zero or more. Swap the numbers."; return; }
        steps = `Common denominator: LCD(${a.d}, ${b.d}) = ${L}\n${a.toString()} = ${a.n * (L / a.d)}/${L}    ${b.toString()} = ${b.n * (L / b.d)}/${L}\n${a.n * (L / a.d)}/${L} ${op} ${b.n * (L / b.d)}/${L} = ${a.n * (L / a.d) + (op === "+" ? 1 : -1) * b.n * (L / b.d)}/${L} = ${show(r)}`;
      } else if (op === "×") {
        r = a.mul(b);
        steps = `${a.toString()} × ${b.toString()} = (${a.n} × ${b.n}) / (${a.d} × ${b.d}) = ${a.n * b.n}/${a.d * b.d} = ${show(r)}`;
      } else {
        r = a.div(b);
        steps = `${a.toString()} ÷ ${b.toString()} = ${a.toString()} × ${b.d}/${b.n} = ${show(r)}\nQuestion: how many ${b.toString()}'s fit in ${a.toString()}?`;
      }
      const changedOp = !meta || meta.op !== op;
      meta = { op, a, b, L, r, av: a.value(), bv: b.value(), rv: r.value() };
      work.textContent = steps;
      out.append(stat("Answer:", show(r)).el, stat("Decimal:", fmt(r.value(), 4)).el);
      const target = [a.value(), b.value(), r.value()];
      if (changedOp) { glide.jump(target.map(() => 0)); }
      glide.set(target);
    }
    [A, B, opSel].forEach((el) => el.addEventListener("input", update));
    root.append(h("div", { class: "controls" }, h("label", { for: "l8-a" }, "A", A), h("label", { for: "l8-op" }, "Operation", opSel), h("label", { for: "l8-b" }, "B", B)),
      pic, out, work);
    update();
    return () => glide.stop();
  }

  // ------------------------------------------------------------ kitchen

  const RECIPE = [
    { item: "Flour", amt: new Frac(9, 4), unit: "cups" },
    { item: "Sugar", amt: new Frac(3, 4), unit: "cup" },
    { item: "Evaporated milk", amt: new Frac(3, 2), unit: "cups" },
    { item: "Baking powder", amt: new Frac(1, 1), unit: "tbsp" },
    { item: "Grated cheese", amt: new Frac(1, 3), unit: "cup" },
  ];

  const ORDER_SNAPS = [[1, 4], [1, 3], [1, 2], [2, 3], [3, 4], [1, 1], [5, 4], [3, 2], [2, 1], [5, 2], [3, 1], [4, 1]].map(([n, d]) => new Frac(n, d));

  function kitchen(root) {
    const tbody = h("tbody"), inspect = h("div", { class: "panel" });
    const rows = RECIPE.map((r) => {
      const now = h("td", { class: "num" }), mult = h("td", { class: "num" });
      tbody.append(h("tr", {}, h("td", {}, r.item), h("td", { class: "num" }, `${r.amt.mixed()} ${r.unit}`), mult, now));
      return { r, now, mult };
    });
    // While sliding, amounts update continuously; on release the order size springs
    // to the nearest kitchen-friendly fraction and the table shows exact fractions.
    function paint(v) {
      const snap = ORDER_SNAPS.reduce((b, f) => (Math.abs(f.value() - v) < Math.abs(b.value() - v) ? f : b));
      const exact = Math.abs(snap.value() - v) < 0.004;
      rows.forEach(({ r, now, mult }) => {
        mult.textContent = `× ${exact ? snap.mixed() : fmt(v, 2)}`;
        now.textContent = exact ? `${r.amt.mul(snap).mixed()} ${r.unit}` : `${fmt(r.amt.value() * v, 2)} ${r.unit}`;
      });
    }
    const slider = elasticSlider({ id: "l8-k", label: "Order size", min: 0.25, max: 4, value: 2.5, snaps: ORDER_SNAPS.map((f) => f.value()),
      format: (v) => { const f = ORDER_SNAPS.find((x) => Math.abs(x.value() - v) < 0.004); return f ? `${f.mixed()} ×` : `${fmt(v, 2)} ×`; }, onInput: paint });
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
    root.append(h("p", {}, h("b", {}, "Puto"), " – one batch makes 24 pieces."),
      h("div", { class: "controls" }, slider.el),
      h("div", { class: "table-wrap" }, h("table", { class: "data" }, h("thead", {}, h("tr", {}, h("th", {}, "Ingredient"), h("th", {}, "1 batch"), h("th", {}, "Order"), h("th", {}, "You need"))), tbody)),
      inspect);
    paint(2.5);
    newOrder();
  }

  // ------------------------------------------------------------ decimal grid

  function grid(root) {
    const size = 26, ox = 40, oy = 10;
    let a = 0.6, b = 0.5;
    const svg = s("svg", { viewBox: `0 0 ${10 * size + 80} ${10 * size + 40}`, role: "img", "aria-label": "Hundred grid" });
    const g = s("g"), hl = s("g"); svg.append(g, hl);
    const out = h("div", { class: "readout" }), work = h("pre", { class: "workings" });
    const snapT = new Spring([a, b], ([x, y]) => { a = x; b = y; draw(); }, { stiffness: 230, damping: 15 });
    const handles = handleSet(svg, hl, {
      label: "Drag the corner", r: 13,
      onMove: (_, p) => {
        snapT.stop();
        a = Sim.rubber((p.x - ox) / (10 * size), 0.1, 1, 0.3); b = Sim.rubber((p.y - oy) / (10 * size), 0.1, 1, 0.3);
        snapT.value = [a, b]; snapT.vel = [0, 0]; draw();
      },
      onEnd: () => snapT.set([clamp(Math.round(a * 10) / 10, 0.1, 1), clamp(Math.round(b * 10) / 10, 0.1, 1)]),
    });
    function draw() {
      clear(g); clear(out);
      const A = clamp(a, 0, 1.05), B = clamp(b, 0, 1.05);
      for (let i = 0; i < 10; i++) for (let j = 0; j < 10; j++) g.append(s("rect", { x: ox + i * size, y: oy + j * size, width: size, height: size, fill: "var(--paper)", stroke: "var(--line)" }));
      g.append(s("rect", { x: ox, y: oy, width: A * 10 * size, height: 10 * size, fill: "var(--shape-a-soft)" }));
      g.append(s("rect", { x: ox, y: oy, width: 10 * size, height: B * 10 * size, fill: "var(--shape-b-soft)" }));
      g.append(s("rect", { x: ox, y: oy, width: A * 10 * size, height: B * 10 * size, fill: "var(--accent)", opacity: 0.75 }));
      for (let i = 0; i <= 10; i++) {
        g.append(s("line", { x1: ox + i * size, y1: oy, x2: ox + i * size, y2: oy + 10 * size, stroke: "var(--line)" }));
        g.append(s("line", { x1: ox, y1: oy + i * size, x2: ox + 10 * size, y2: oy + i * size, stroke: "var(--line)" }));
      }
      g.append(s("rect", { x: ox, y: oy, width: 10 * size, height: 10 * size, fill: "none", stroke: "var(--ink)", "stroke-width": 2 }));
      const settled = Math.abs(a * 10 - Math.round(a * 10)) < 0.01 && Math.abs(b * 10 - Math.round(b * 10)) < 0.01;
      const at = settled ? Math.round(a * 10) : null, bt = settled ? Math.round(b * 10) : null;
      g.append(s("text", { x: ox + (A * 10 * size) / 2, y: 10 * size + 30, "text-anchor": "middle", class: "svg-text" }, fmt(a, settled ? 1 : 2)));
      g.append(s("text", { x: ox - 8, y: oy + 5 + (B * 10 * size) / 2, "text-anchor": "end", class: "svg-text" }, fmt(b, settled ? 1 : 2)));
      handles.sync([{ x: ox + a * 10 * size, y: oy + b * 10 * size }]);
      out.append(stat("Product:", settled ? fmt((at * bt) / 100, 2) : `≈ ${fmt(Math.max(0, a) * Math.max(0, b), 3)}`).el);
      if (settled) {
        out.append(stat("Overlap:", `${at * bt} of 100 squares`).el, at < 10 && bt < 10 ? pill(true, "Smaller than both factors", "") : null);
        work.textContent = `${fmt(at / 10, 1)} × ${fmt(bt / 10, 1)}: multiply ${at} × ${bt} = ${at * bt}\nThere are 1 + 1 = 2 decimal places in the factors, so the product is ${fmt((at * bt) / 100, 2)}.`;
      }
    }
    root.append(svg, out, work,
      h("p", { class: "note" }, "Drag the white corner handle. Let go and it springs to the nearest tenths. The whole grid is 1; the dark green overlap is the product."));
    draw();
    return () => snapT.stop();
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
      "Decimal Grid: drag the corner to show 0.6 × 0.5. Why is the product smaller than both factors?",
    ],
    discovery: "To add or subtract fractions, cut them into same-size pieces (a common denominator). To multiply, multiply numerators and denominators – the area model shows why. Dividing asks “how many of these fit?”, so dividing by a number less than 1 gives a bigger answer. Multiplying by a number less than 1 gives a smaller answer. Scaling a recipe means multiplying every amount by the same number.",
    mount(stage) {
      const body = h("div", { class: "stage-body" });
      const views = [bars, kitchen, grid];
      let stopper = null;
      const t = tabs(["Fraction Bars", "Kakanin Kitchen", "Decimal Grid"], (i) => { if (stopper) stopper(); clear(body); stopper = views[i](body) || null; });
      stage.append(t.el, body);
      stopper = bars(body);
      return () => { if (stopper) stopper(); };
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
