/* Lesson 4 · D. Percentages in Real Life – LSGH Mini Mall */
(function () {
  "use strict";
  const { h, s, clear, randInt, pick, round, fmt, peso, tabs, stat, pill, Spring, elasticSlider } = Sim;

  const SHELF = [
    { name: "Rubber shoes", price: 2400 },
    { name: "Backpack", price: 1200 },
    { name: "School shirt", price: 600 },
    { name: "Headphones", price: 1850 },
    { name: "Notebook pack", price: 350 },
  ];

  /** Horizontal bar: 100% = original; shows discount removed and tax added. */
  function percentBar(parts) {
    const W = 560, H = 70, max = Math.max(100, ...parts.map((p) => p.end));
    const x = (v) => 20 + (v / max) * W;
    const svg = s("svg", { viewBox: `0 0 ${W + 40} ${H + 30}`, role: "img", "aria-label": "Percent bar model" });
    parts.forEach((p) => svg.append(s("rect", { x: x(p.start), y: 10, width: Math.max(0, x(p.end) - x(p.start)), height: 40, fill: p.fill, stroke: p.stroke || "none", "stroke-dasharray": p.dash || "" })));
    svg.append(s("rect", { x: x(0), y: 10, width: x(100) - x(0), height: 40, fill: "none", stroke: "var(--ink)", "stroke-width": 2 }));
    [0, 25, 50, 75, 100].forEach((t) => {
      svg.append(s("line", { x1: x(t), y1: 50, x2: x(t), y2: 58, stroke: "var(--ink)" }));
      svg.append(s("text", { x: x(t), y: 74, "text-anchor": "middle", class: "svg-text" }, `${t}%`));
    });
    parts.filter((p) => p.label).forEach((p) => svg.append(s("text", { x: (x(p.start) + x(p.end)) / 2, y: 35, "text-anchor": "middle", class: "svg-text", "font-size": 12 }, p.label)));
    return svg;
  }

  /** A box whose picture eases toward new values instead of jumping. */
  function smoothBox(initial, render) {
    const box = h("div");
    const sp = new Spring(initial, (v) => { clear(box); box.append(render(v)); }, { stiffness: 170, damping: 17 });
    sp.jump(initial);
    return { el: box, set: (v) => sp.set(v), stop: () => sp.stop() };
  }

  // ------------------------------------------------------------ promo lab

  function promo(root) {
    const st = { item: 0, q: 2, d1: 30, d2: 20, b1t1: false, vat: true };
    const item = h("select", { id: "l4-item" }, SHELF.map((it, i) => h("option", { value: i }, `${it.name} – ${peso(it.price)}`)));
    const b1t1 = h("input", { type: "checkbox", id: "l4-b1t1" });
    const vat = h("input", { type: "checkbox", id: "l4-vat", checked: true });
    const receipt = h("pre", { class: "workings", "aria-live": "polite" });
    const summary = h("div", { class: "readout" });
    const bar = smoothBox([70 * 0.8, 70 * 0.8 * 1.12], ([sale, total]) => percentBar([
      { start: 0, end: sale, fill: "var(--shape-a-soft)", label: `pay ${fmt(sale, 1)}%` },
      { start: sale, end: 100, fill: "var(--grid)", label: 100 - sale > 8 ? `saved ${fmt(100 - sale, 1)}%` : "" },
      st.vat ? { start: sale, end: total, fill: "var(--gold-soft)", stroke: "var(--gold)", dash: "4 3" } : null,
    ].filter(Boolean)));

    function update() {
      const it = SHELF[st.item], q = Math.max(1, Math.round(st.q));
      const d1 = st.d1 / 100, d2 = st.d2 / 100;
      const paidUnits = st.b1t1 ? Math.ceil(q / 2) : q;
      const original = it.price * q;
      const lines = [`${q} × ${it.name} @ ${peso(it.price)}      ${peso(original)}`];
      let price = it.price * paidUnits;
      if (st.b1t1) lines.push(`Buy 1, Take 1: pay for ${paidUnits}        −${peso(original - price)}`);
      const a1 = round(price * d1); if (d1) { lines.push(`${fmt(st.d1, 0)}% off ${peso(price)}             −${peso(a1)}`); price = round(price - a1); }
      const a2 = round(price * d2); if (d2) { lines.push(`Extra ${fmt(st.d2, 0)}% off ${peso(price)}       −${peso(a2)}`); price = round(price - a2); }
      lines.push(`Sale price                     ${peso(price)}`);
      let total = price;
      if (st.vat) { const t = round(price * 0.12); lines.push(`12% VAT on ${peso(price)}         +${peso(t)}`); total = round(price + t); }
      lines.push("─".repeat(38), `TOTAL                          ${peso(total)}`);
      receipt.textContent = lines.join("\n");
      const salePct = (price / original) * 100, totalPct = (total / original) * 100;
      bar.set([salePct, totalPct]);
      clear(summary);
      summary.append(stat("Original:", peso(original)).el, stat("You pay:", peso(total)).el,
        stat("Real discount:", `${fmt(100 - salePct, 1)}%`).el,
        d1 && d2 ? pill(false, "", `${fmt(st.d1, 0)}% + ${fmt(st.d2, 0)}% is NOT ${fmt(st.d1 + st.d2, 0)}% off`) : null);
    }
    item.addEventListener("input", () => { st.item = Number(item.value); update(); });
    b1t1.addEventListener("input", () => { st.b1t1 = b1t1.checked; update(); });
    vat.addEventListener("input", () => { st.vat = vat.checked; update(); });
    const pct = (v) => `${fmt(v, 0)}%`;
    root.append(
      h("div", { class: "controls" }, h("label", { for: "l4-item" }, "Item", item),
        elasticSlider({ id: "l4-qty", label: "Quantity", min: 1, max: 6, value: 2, step: 1, format: (v) => fmt(Math.round(v), 0), onInput: (v) => { st.q = v; update(); } }).el),
      h("div", { class: "controls" },
        elasticSlider({ id: "l4-off", label: "Discount", min: 0, max: 70, value: 30, step: 1, format: pct, onInput: (v) => { st.d1 = v; update(); } }).el,
        elasticSlider({ id: "l4-extra", label: "Extra discount", min: 0, max: 50, value: 20, step: 1, format: pct, onInput: (v) => { st.d2 = v; update(); } }).el),
      h("div", { class: "controls" }, h("label", { for: "l4-b1t1" }, b1t1, "Buy 1, Take 1"), h("label", { for: "l4-vat" }, vat, "Add 12% VAT")),
      bar.el, summary, receipt);
    update();
    return () => bar.stop();
  }

  // ------------------------------------------------------------ price change

  function change(root) {
    const st = { a: 50, b: 55 };
    const out = h("div", { class: "readout" }), work = h("pre", { class: "workings" });
    const bar = smoothBox([110], ([r]) => percentBar([{ start: 0, end: r, fill: r >= 100 ? "var(--shape-b-soft)" : "var(--shape-a-soft)", label: `new = ${fmt(r, 1)}% of original` }]));
    function update() {
      const a = st.a, b = st.b;
      clear(out);
      const diff = b - a, pct = (diff / a) * 100;
      work.textContent = `change = new − original = ${fmt(b)} − ${fmt(a)} = ${fmt(diff)}\npercentage change = change ÷ ORIGINAL × 100%\n                  = ${fmt(diff)} ÷ ${fmt(a)} × 100% = ${fmt(pct, 2)}%`;
      out.append(pill(diff >= 0, `${fmt(Math.abs(pct), 2)}% increase`, `${fmt(Math.abs(pct), 2)}% decrease`),
        stat("Reverse change:", `${fmt((-diff / b) * 100, 2)}%`).el);
      bar.set([(b / a) * 100]);
    }
    const sA = elasticSlider({ id: "l4-old", label: "Original ₱", min: 10, max: 1500, value: 50, step: 5, format: (v) => peso(v), onInput: (v) => { st.a = v; update(); } });
    const sB = elasticSlider({ id: "l4-new", label: "New ₱", min: 10, max: 1500, value: 55, step: 5, format: (v) => peso(v), onInput: (v) => { st.b = v; update(); } });
    const preset = (a, b) => h("button", { class: "btn ghost", type: "button", onclick: () => { sA.set(a); sB.set(b); } }, `${peso(a)} → ${peso(b)}`);
    root.append(h("div", { class: "controls" }, sA.el, sB.el), h("div", { class: "controls" }, preset(50, 55), preset(600, 800), preset(800, 600), preset(1200, 900)),
      bar.el, out, work, h("p", { class: "note" }, "Try ₱600 → ₱800, then ₱800 → ₱600. Why are the percentages different?"));
    update();
    return () => bar.stop();
  }

  // ------------------------------------------------------------ money tools

  function money(root) {
    const st = { sales: 80000, rate: 5, P: 10000, r: 3, t: 2 };
    const comm = h("pre", { class: "workings" }), si = h("pre", { class: "workings" });
    const W = 560, H = 160;
    const chart = smoothBox([10000, 2, 3], ([p, tt, rr]) => {
      const svg = s("svg", { viewBox: `0 0 ${W + 40} ${H + 40}`, role: "img", "aria-label": "Savings growth by year" });
      const max = p * (1 + (rr / 100) * 10) * 1.05; // room for a 10-year horizon
      const years = Math.max(1, tt), bw = Math.min(60, (W - 20) / 11 - 10);
      for (let y = 0; y <= Math.ceil(years - 1e-9); y++) {
        const grow = Math.min(1, years - y + 1); // the newest bar rises as the slider moves
        const amt = p + (p * rr / 100) * y, x = 30 + y * (bw + 10);
        const hp = (p / max) * H * Math.min(1, grow), hi = ((amt - p) / max) * H * Math.min(1, grow);
        svg.append(s("rect", { x, y: 10 + H - hp, width: bw, height: Math.max(0, hp), fill: "var(--shape-a-soft)", stroke: "var(--shape-a)" }));
        if (hi > 0) svg.append(s("rect", { x, y: 10 + H - hp - hi, width: bw, height: hi, fill: "var(--gold-soft)", stroke: "var(--gold)" }));
        svg.append(s("text", { x: x + bw / 2, y: H + 30, "text-anchor": "middle", class: "svg-text" }, `Yr ${y}`));
      }
      return svg;
    });
    function update() {
      comm.textContent = `commission = rate × sales\n           = ${fmt(st.rate)}% × ${peso(st.sales)} = ${peso(st.sales * st.rate / 100)}`;
      const tt = Math.round(st.t), I = st.P * (st.r / 100) * tt;
      si.textContent = `I = P × r × t = ${peso(st.P)} × ${fmt(st.r)}% × ${tt} = ${peso(I)}\namount = P + I = ${peso(st.P + I)}`;
      chart.set([st.P, st.t, st.r]);
    }
    const slide = (id, label, min, max, value, step, key, format) => elasticSlider({ id, label, min, max, value, step, format, onInput: (v) => { st[key] = v; update(); } }).el;
    root.append(
      h("h2", {}, "Commission"),
      h("div", { class: "controls" }, slide("l4-sales", "Sales", 0, 200000, 80000, 1000, "sales", peso), slide("l4-rate", "Rate", 0, 15, 5, 0.5, "rate", (v) => `${fmt(v, 1)}%`)), comm,
      h("h2", {}, "Simple interest – Bangko Lasalyano"),
      h("div", { class: "controls" }, slide("l4-P", "Principal", 1000, 50000, 10000, 500, "P", peso), slide("l4-r", "Rate per year", 0.5, 10, 3, 0.5, "r", (v) => `${fmt(v, 1)}%`),
        slide("l4-t", "Years", 1, 10, 2, 1, "t", (v) => fmt(Math.round(v), 0))),
      chart.el, si, h("p", { class: "note" }, "Blue = principal; gold = interest earned. Drag Years and watch each new year’s bar rise."));
    update();
    return () => chart.stop();
  }

  // ------------------------------------------------------------ lesson

  Sim.register({
    id: "lesson4", unit: "B", num: 4, letter: "D", title: "Percentages in Real Life", simName: "LSGH Mini Mall",
    comps: ["A7", "A8", "M6", "M7"], cycles: "C4,M2 – C5,M1", deped: "DepEd Week 4",
    bigQuestion: "Is “Buy 1, Take 1” really the same as 50% off?",
    mission: [
      "Promo Lab: buy 2 school shirts with 50% off, then with Buy 1 Take 1. Which costs less?",
      "Set 30% off plus an extra 20% off. What is the REAL discount? Is it 50%?",
      "Price Change: compare ₱600 → ₱800 with ₱800 → ₱600. Explain why the percentages differ.",
      "Money Tools: how much interest does ₱10 000 earn at 3% for 2 years? What if you keep it for 5 years?",
    ],
    discovery: "Every percentage is taken of a base. Two discounts in a row are taken of different bases, so 30% + 20% off is only 44% off. Percentage change is always computed from the ORIGINAL amount. Buy 1 Take 1 equals 50% off only when you need an even number of items. Commission, VAT, and simple interest (I = P × r × t) are all a rate times a base.",
    mount(stage) {
      const body = h("div", { class: "stage-body" });
      const views = [promo, change, money];
      let stopper = null;
      const t = tabs(["Promo Lab", "Price Change", "Money Tools"], (i) => { if (stopper) stopper(); clear(body); stopper = views[i](body) || null; });
      stage.append(t.el, body);
      stopper = promo(body);
      return () => { if (stopper) stopper(); };
    },
    check() {
      const kind = randInt(0, 6);
      if (kind === 0) { const a = pick([40, 50, 80, 120, 250, 400]), p = pick([5, 10, 15, 20, 25]); const b = a * (1 + p / 100); return { q: `A price went from ${peso(a)} to ${peso(b)}. What is the percentage increase?`, answer: p, unit: "%", explain: `${fmt(b - a)} ÷ ${fmt(a)} × 100% = ${p}%.` }; }
      if (kind === 1) { const a = pick([200, 500, 800, 1000, 1500]), p = pick([10, 20, 25, 40]); const b = a * (1 - p / 100); return { q: `A price dropped from ${peso(a)} to ${peso(b)}. What is the percentage decrease?`, answer: p, unit: "%", explain: `${fmt(a - b)} ÷ ${fmt(a)} × 100% = ${p}%.` }; }
      if (kind === 2) { const a = pick([600, 1200, 2400, 1850, 950]), p = pick([10, 15, 20, 25, 30]); return { q: `A ${peso(a)} item is ${p}% off. What is the sale price (in pesos)?`, answer: a * (1 - p / 100), unit: "₱", explain: `${peso(a)} × ${100 - p}% = ${peso(a * (1 - p / 100))}.` }; }
      if (kind === 3) { const a = pick([250, 500, 750, 850, 1200]); return { q: `What is the total cost of a ${peso(a)} purchase plus 12% VAT?`, answer: a * 1.12, unit: "₱", explain: `${peso(a)} × 1.12 = ${peso(a * 1.12)}.` }; }
      if (kind === 4) { const sv = pick([20000, 50000, 80000, 150000]), r = pick([2, 3, 4, 5]); return { q: `A sales agent earns a ${r}% commission. How much does the agent earn on ${peso(sv)} in sales?`, answer: (sv * r) / 100, unit: "₱", explain: `${r}% × ${peso(sv)} = ${peso((sv * r) / 100)}.` }; }
      if (kind === 5) { const P = pick([5000, 8000, 10000, 20000]), r = pick([2, 2.5, 3, 4]), t = randInt(2, 5); return { q: `Find the simple interest on ${peso(P)} at ${r}% per year for ${t} years.`, answer: P * r / 100 * t, unit: "₱", explain: `I = ${peso(P)} × ${r}% × ${t} = ${peso(P * r / 100 * t)}.` }; }
      const d1 = pick([20, 30, 40]), d2 = pick([10, 20, 25]);
      const real = round(100 - (100 - d1) * (100 - d2) / 100, 2);
      return { q: `An item is ${d1}% off, then an extra ${d2}% off the sale price. What single discount (in %) is this equal to?`, answer: real, unit: "%", explain: `You pay ${100 - d1}% × ${100 - d2}% = ${fmt(100 - real)}%, so the discount is ${fmt(real)}% – not ${d1 + d2}%.` };
    },
  });
})();
