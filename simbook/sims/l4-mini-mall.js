/* Lesson 4 · D. Percentages in Real Life – LSGH Mini Mall */
(function () {
  "use strict";
  const { h, s, clear, randInt, pick, round, fmt, peso, tabs, stat, pill } = Sim;

  const SHELF = [
    { name: "Rubber shoes", price: 2400 },
    { name: "Backpack", price: 1200 },
    { name: "School shirt", price: 600 },
    { name: "Headphones", price: 1850 },
    { name: "Notebook pack", price: 350 },
  ];

  function num(id, value, attrs = {}) { return h("input", { type: "number", id, value, ...attrs }); }

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

  // ------------------------------------------------------------ promo lab

  function promo(root) {
    const item = h("select", { id: "l4-item" }, SHELF.map((it, i) => h("option", { value: i }, `${it.name} – ${peso(it.price)}`)));
    const qty = num("l4-qty", 2, { min: 1, max: 6 });
    const off = h("input", { type: "range", id: "l4-off", min: 0, max: 70, step: 5, value: 30 });
    const extra = h("input", { type: "range", id: "l4-extra", min: 0, max: 50, step: 5, value: 20 });
    const b1t1 = h("input", { type: "checkbox", id: "l4-b1t1" });
    const vat = h("input", { type: "checkbox", id: "l4-vat", checked: true });
    const offL = h("b", { class: "num" }), extraL = h("b", { class: "num" });
    const receipt = h("pre", { class: "workings", "aria-live": "polite" });
    const barBox = h("div");
    const summary = h("div", { class: "readout" });

    function update() {
      const it = SHELF[Number(item.value)], q = Math.max(1, Math.round(Number(qty.value) || 1));
      const d1 = Number(off.value) / 100, d2 = Number(extra.value) / 100;
      offL.textContent = `${off.value}%`; extraL.textContent = `${extra.value}%`;
      const paidUnits = b1t1.checked ? Math.ceil(q / 2) : q;
      const original = it.price * q;
      let lines = [`${q} × ${it.name} @ ${peso(it.price)}      ${peso(original)}`];
      let price = it.price * paidUnits;
      if (b1t1.checked) lines.push(`Buy 1, Take 1: pay for ${paidUnits}        −${peso(original - price)}`);
      const a1 = round(price * d1); if (d1) { lines.push(`${off.value}% off ${peso(price)}             −${peso(a1)}`); price = round(price - a1); }
      const a2 = round(price * d2); if (d2) { lines.push(`Extra ${extra.value}% off ${peso(price)}       −${peso(a2)}`); price = round(price - a2); }
      lines.push(`Sale price                     ${peso(price)}`);
      let total = price;
      if (vat.checked) { const t = round(price * 0.12); lines.push(`12% VAT on ${peso(price)}         +${peso(t)}`); total = round(price + t); }
      lines.push("─".repeat(38), `TOTAL                          ${peso(total)}`);
      receipt.textContent = lines.join("\n");
      const salePct = (price / original) * 100, totalPct = (total / original) * 100;
      clear(barBox);
      barBox.append(percentBar([
        { start: 0, end: salePct, fill: "var(--shape-a-soft)", label: `pay ${fmt(salePct, 1)}%` },
        { start: salePct, end: 100, fill: "var(--grid)", label: 100 - salePct > 8 ? `saved ${fmt(100 - salePct, 1)}%` : "" },
        vat.checked ? { start: salePct, end: totalPct, fill: "var(--gold-soft)", stroke: "var(--gold)", dash: "4 3" } : null,
      ].filter(Boolean)));
      clear(summary);
      summary.append(stat("Original:", peso(original)).el, stat("You pay:", peso(total)).el,
        stat("Real discount:", `${fmt(100 - salePct, 1)}%`).el,
        d1 && d2 ? pill(false, "", `${off.value}% + ${extra.value}% is NOT ${Number(off.value) + Number(extra.value)}% off`) : null);
    }
    [item, qty, off, extra, b1t1, vat].forEach((el) => el.addEventListener("input", update));
    root.append(
      h("div", { class: "controls" }, h("label", { for: "l4-item" }, "Item", item), h("label", { for: "l4-qty" }, "Quantity", qty)),
      h("div", { class: "controls" },
        h("label", { for: "l4-off" }, "Discount", off, offL), h("label", { for: "l4-extra" }, "Extra discount", extra, extraL),
        h("label", { for: "l4-b1t1" }, b1t1, "Buy 1, Take 1"), h("label", { for: "l4-vat" }, vat, "Add 12% VAT")),
      barBox, summary, receipt);
    update();
  }

  // ------------------------------------------------------------ price change

  function change(root) {
    const oldP = num("l4-old", 50, { min: 1 }), newP = num("l4-new", 55, { min: 1 });
    const out = h("div", { class: "readout" }), work = h("pre", { class: "workings" }), barBox = h("div");
    function update() {
      const a = Number(oldP.value), b = Number(newP.value);
      clear(out); clear(barBox);
      if (!(a > 0) || !(b >= 0)) { work.textContent = "Enter prices greater than 0."; return; }
      const diff = b - a, pct = (diff / a) * 100;
      work.textContent = `change = new − original = ${fmt(b)} − ${fmt(a)} = ${fmt(diff)}\npercentage change = change ÷ ORIGINAL × 100%\n                  = ${fmt(diff)} ÷ ${fmt(a)} × 100% = ${fmt(pct, 2)}%`;
      out.append(pill(diff >= 0, `${fmt(Math.abs(pct), 2)}% increase`, `${fmt(Math.abs(pct), 2)}% decrease`),
        stat("Reverse change:", `${fmt((-diff / b) * 100, 2)}%`).el);
      barBox.append(percentBar([{ start: 0, end: (b / a) * 100, fill: diff >= 0 ? "var(--shape-b-soft)" : "var(--shape-a-soft)", label: `new = ${fmt((b / a) * 100, 1)}% of original` }]));
    }
    [oldP, newP].forEach((el) => el.addEventListener("input", update));
    root.append(h("div", { class: "controls" }, h("label", { for: "l4-old" }, "Original ₱", oldP), h("label", { for: "l4-new" }, "New ₱", newP)),
      barBox, out, work, h("p", { class: "note" }, "Try ₱600 → ₱800, then ₱800 → ₱600. Why are the percentages different?"));
    update();
  }

  // ------------------------------------------------------------ money tools

  function money(root) {
    const sales = num("l4-sales", 80000, { min: 0, step: 1000 }), rate = num("l4-rate", 5, { min: 0, step: 0.5 });
    const P = num("l4-P", 10000, { min: 0, step: 500 }), r = num("l4-r", 3, { min: 0, step: 0.5 }), t = num("l4-t", 2, { min: 1, max: 10 });
    const comm = h("pre", { class: "workings" }), si = h("pre", { class: "workings" });
    const chart = h("div");
    function update() {
      const sv = Number(sales.value), rv = Number(rate.value);
      comm.textContent = `commission = rate × sales\n           = ${fmt(rv)}% × ${peso(sv)} = ${peso(sv * rv / 100)}`;
      const p = Number(P.value), rr = Number(r.value) / 100, tt = Math.max(1, Math.min(10, Math.round(Number(t.value))));
      const I = p * rr * tt;
      si.textContent = `I = P × r × t = ${peso(p)} × ${fmt(rr * 100)}% × ${tt} = ${peso(I)}\namount = P + I = ${peso(p + I)}`;
      clear(chart);
      const W = 560, H = 160, max = p + I || 1;
      const svg = s("svg", { viewBox: `0 0 ${W + 40} ${H + 40}`, role: "img", "aria-label": "Savings growth by year" });
      const bw = Math.min(60, (W - 20) / (tt + 1) - 10);
      for (let y = 0; y <= tt; y++) {
        const amt = p + p * rr * y, x = 30 + y * (bw + 10);
        const hp = (p / max) * H, hi = ((amt - p) / max) * H;
        svg.append(s("rect", { x, y: 10 + H - hp, width: bw, height: hp, fill: "var(--shape-a-soft)", stroke: "var(--shape-a)" }));
        if (hi > 0) svg.append(s("rect", { x, y: 10 + H - hp - hi, width: bw, height: hi, fill: "var(--gold-soft)", stroke: "var(--gold)" }));
        svg.append(s("text", { x: x + bw / 2, y: H + 30, "text-anchor": "middle", class: "svg-text" }, `Yr ${y}`));
      }
      chart.append(svg);
    }
    [sales, rate, P, r, t].forEach((el) => el.addEventListener("input", update));
    root.append(
      h("h2", {}, "Commission"),
      h("div", { class: "controls" }, h("label", { for: "l4-sales" }, "Sales ₱", sales), h("label", { for: "l4-rate" }, "Rate %", rate)), comm,
      h("h2", {}, "Simple interest – Bangko Lasalyano"),
      h("div", { class: "controls" }, h("label", { for: "l4-P" }, "Principal ₱", P), h("label", { for: "l4-r" }, "Rate % per year", r), h("label", { for: "l4-t" }, "Years", t)),
      chart, si, h("p", { class: "note" }, "Blue = principal; gold = interest earned. Simple interest grows by the same amount every year."));
    update();
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
      const t = tabs(["Promo Lab", "Price Change", "Money Tools"], (i) => { clear(body); views[i](body); });
      stage.append(t.el, body);
      promo(body);
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
