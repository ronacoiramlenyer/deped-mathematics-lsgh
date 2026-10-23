/* Unit 3 · Lesson 7 · G. Conditional and Lookup Functions – Formula Lab */
(function () {
  "use strict";
  const { h, clear, randInt, pick, shuffle, fmt, peso, tabs, segmented, stat, pill, Spring, clamp, elasticSlider } = Sim;

  if (!document.getElementById("da-l7-style")) {
    document.head.append(h("style", { id: "da-l7-style" }, `
.fl-bar { display: flex; align-items: stretch; border: 1px solid var(--line); border-radius: 8px; overflow: hidden; font-family: var(--mono); font-size: .9rem; background: var(--paper); }
.fl-bar .fx { background: var(--bg); color: var(--muted); padding: 6px 10px; font-style: italic; border-right: 1px solid var(--line); }
.fl-bar .src { padding: 6px 10px; overflow-x: auto; white-space: nowrap; flex: 1; min-width: 0; }
.fl-grid { font-size: .86rem; position: relative; }
.fl-row { display: grid; height: 30px; border-bottom: 1px solid var(--line); }
.fl-row > div { display: flex; align-items: center; padding: 0 8px; border-right: 1px solid var(--grid); font-family: var(--mono); white-space: nowrap; overflow: hidden; }
.fl-row > div.r { justify-content: flex-end; }
.fl-row > div.rn { justify-content: center; color: var(--muted); background: var(--bg); font-size: .76rem; }
.fl-head > div { font-family: var(--body); font-weight: 700; color: var(--muted); font-size: .76rem; background: var(--bg); }
.fl-row > div.crit { box-shadow: inset 0 -3px 0 var(--shape-b); }
.fl-row > div.val { box-shadow: inset 0 -3px 0 var(--shape-a); }
.fl-pick { display: flex; flex-wrap: wrap; gap: 8px 12px; align-items: center; }
.fl-pick label { display: flex; gap: 6px; align-items: center; font-size: .9rem; }
.fl-pick select { border: 1px solid var(--line); border-radius: 6px; padding: 4px 6px; background: var(--bg); }
.fl-result { font-family: var(--mono); font-size: 1.5rem; font-weight: 500; }
.fl-ptr { position: absolute; top: 0; left: 0; height: 30px; border: 3px solid var(--shape-b); border-radius: 4px; pointer-events: none; box-sizing: border-box; }
.fl-ptr.ok { border-color: var(--good); }
.fl-ptr.err { border-color: var(--bad); }
.fl-tokens { min-width: 0; display: flex; flex-wrap: wrap; gap: 6px; min-height: 44px; padding: 6px; border: 1px dashed var(--line); border-radius: 8px; align-content: flex-start; }
.fl-tokens.line { border-style: solid; border-color: var(--accent); background: var(--accent-soft); }
.fl-tok { font-family: var(--mono); font-size: .86rem; border: 1px solid var(--shape-a); background: var(--paper); color: var(--ink); border-radius: 6px; padding: 5px 8px; cursor: pointer; will-change: transform; position: relative; white-space: normal; overflow-wrap: anywhere; max-width: 100%; text-align: left; }
.fl-tok:hover { background: var(--shape-a-soft); }
.fl-two { display: flex; flex-wrap: wrap; gap: 12px; align-items: flex-start; min-width: 0; }
.fl-two > div { flex: 0 1 auto; min-width: 0; max-width: 100%; }
.fl-res { align-items: center; }
.fl-cap { font-size: .8rem; color: var(--muted); margin: 0 0 4px; font-weight: 700; letter-spacing: .04em; }
`));
  }

  // ------------------------------------------------------------ data (sample data)

  const PRICE = { Siomai: 45, Turon: 20, Lumpia: 15, "Banana Cue": 25 };
  // Sheet "Sales": A Day, B Item, C Cashier, D Qty, E Sales (rows 2–11)
  const SALES = [["Mon", "Siomai", "Bea", 12], ["Mon", "Turon", "Carlo", 8], ["Mon", "Lumpia", "Bea", 10], ["Tue", "Siomai", "Carlo", 9], ["Tue", "Banana Cue", "Dana", 7],
    ["Tue", "Turon", "Bea", 11], ["Wed", "Siomai", "Dana", 14], ["Wed", "Lumpia", "Carlo", 6], ["Wed", "Banana Cue", "Bea", 5], ["Thu", "Turon", "Dana", 9]]
    .map(([d, it, c, q]) => [d, it, c, q, q * PRICE[it]]);
  const SCOLS = ["Day", "Item", "Cashier", "Qty", "Sales"], SLET = ["A", "B", "C", "D", "E"];
  // Sheet "Prices": A Code, B Item, C Category, D Price (rows 2–7); Supplier can be inserted before Price
  const PRICES = [["P01", "Siomai", "Snack", "Aling Nena", 45], ["P02", "Turon", "Snack", "Mang Ben", 20], ["P03", "Lumpia", "Snack", "Aling Nena", 15],
    ["P04", "Banana Cue", "Snack", "Mang Ben", 25], ["P05", "Iced Tea", "Drink", "Ka Lito", 18], ["P06", "Pancit Canton", "Meal", "Ka Lito", 50]];

  const VALUES = { 0: ["Mon", "Tue", "Wed", "Thu"], 1: ["Siomai", "Turon", "Lumpia", "Banana Cue"], 2: ["Bea", "Carlo", "Dana"], 3: [">=10", "<10", ">8", "<=8"] };
  function meets(v, crit) {
    const m = String(crit).match(/^(>=|<=|<>|>|<|=)?(.*)$/), op = m[1] || "=", t = m[2];
    const n = Number(t), num = t !== "" && !Number.isNaN(n) && typeof v === "number";
    const a = num ? v : String(v).toLowerCase(), b = num ? n : t.toLowerCase();
    return { "=": a === b, "<>": a !== b, ">": a > b, "<": a < b, ">=": a >= b, "<=": a <= b }[op];
  }
  const rng = (c) => `${SLET[c]}2:${SLET[c]}11`;
  const q = (x) => `"${x}"`;

  // ------------------------------------------------------------ small sheet with springy row highlights

  function grid(cols, widths, rows, { cls } = {}) {
    const tmpl = widths.map((w) => w + "px").join(" ");
    const el = h("div", { class: "fl-grid", style: `min-width:${widths.reduce((a, b) => a + b, 0)}px` });
    el.append(h("div", { class: "fl-row fl-head", style: `grid-template-columns:${tmpl}` }, cols.map((c, i) => h("div", { class: i === 0 ? "rn" : "" }, c))));
    const rowEls = rows.map((r, i) => {
      const cells = [h("div", { class: "rn" }, String(i + 2)), ...r.map((v) => h("div", { class: typeof v === "number" ? "r" : "" }, typeof v === "number" ? fmt(v, 2) : v))];
      const rowEl = h("div", { class: "fl-row", style: `grid-template-columns:${tmpl}` }, cells);
      const sp = new Spring(0, (k) => { rowEl.style.background = k > 0.01 ? `color-mix(in srgb, var(--gold) ${Math.round(clamp(k, 0, 1.2) * 32)}%, var(--paper))` : ""; rowEl.style.transform = `translateX(${(k - (sp.target || 0)) * 6}px)`; }, { stiffness: 230, damping: 15 });
      el.append(rowEl);
      return { el: rowEl, cells, sp };
    });
    const timers = [];
    return {
      el, rows: rowEls,
      light(flags, stagger = 45) {
        timers.forEach(clearTimeout); timers.length = 0;
        let k = 0;
        rowEls.forEach((r, i) => { const on = flags[i] ? 1 : 0; if (on) timers.push(setTimeout(() => r.sp.set(1), k++ * stagger)); else r.sp.set(0); });
      },
      mark(colIdx, className, flags) { rowEls.forEach((r, i) => colIdx.forEach((c) => r.cells[c + 1] && r.cells[c + 1].classList.toggle(className, !!(flags ? flags[i] : true)))); },
      unmark(className) { rowEls.forEach((r) => r.cells.forEach((c) => c.classList.remove(className))); },
      stop() { timers.forEach(clearTimeout); rowEls.forEach((r) => r.sp.stop()); },
    };
  }
  const fbar = (text) => { const src = h("div", { class: "src" }, text); return { el: h("div", { class: "fl-bar" }, h("div", { class: "fx" }, "fx"), src), set: (t) => { src.textContent = t; } }; };
  function sel(label, options, value, onChange) {
    const s = h("select", { "aria-label": label, onchange: () => onChange(s.value) }, options.map(([v, t]) => h("option", { value: v, selected: v === value }, t)));
    return h("label", {}, label, s);
  }

  // ------------------------------------------------------------ tab 1 · conditional

  const FUNCS = ["COUNTIF", "COUNTIFS", "SUMIF", "SUMIFS", "AVERAGEIF", "AVERAGEIFS"];
  function conditional(root) {
    const st = { fn: "SUMIF", c1: 1, v1: "Siomai", c2: 0, v2: "Wed", val: 4, label: false, thr: 200 };
    const bar = fbar("");
    const picks = h("div", { class: "fl-pick" });
    const resEl = h("span", { class: "fl-result" }), explain = h("p", { class: "note" });
    let shown = 0, isAvg = false, isErr = false;
    const count = new Spring(0, (v) => { shown = v; resEl.textContent = isErr ? "#DIV/0!" : fmt(Math.max(0, v), isAvg ? 2 : 0); }, { stiffness: 90, damping: 15 });
    const g = grid(["", ...SCOLS.map((c, i) => `${SLET[i]} · ${c}`), "F · Label"], [36, 64, 108, 80, 56, 70, 80], SALES.map((r) => [...r, ""]));
    const labelCells = g.rows.map((r) => r.cells[6]);
    const thrSlider = elasticSlider({ id: "da-l7-thr", label: "IF threshold ₱", min: 50, max: 600, value: st.thr, step: 50, format: (v) => peso(v).replace(".00", ""),
      onInput: (v) => { st.thr = Math.round(v / 10) * 10; paintLabels(); }, onChange: (v) => { st.thr = v; paintLabels(); bar.set(formula()); } });
    const labelRow = h("div", { class: "controls" }, thrSlider.el);
    function paintLabels() {
      labelCells.forEach((c, i) => {
        if (!st.label) { c.textContent = ""; c.style.color = ""; return; }
        const hi = SALES[i][4] >= st.thr;
        c.textContent = hi ? "High" : "Low"; c.style.color = hi ? "var(--good)" : "var(--muted)"; c.style.fontWeight = hi ? "700" : "400";
      });
    }
    const multi = () => st.fn.endsWith("S");
    const needVal = () => !st.fn.startsWith("COUNT");
    function formula() {
      if (st.label && st._mode === "if") return `F2: =IF(E2>=${st.thr}, "High", "Low")`;
      const r1 = rng(st.c1), r2 = rng(st.c2), vr = rng(st.val);
      switch (st.fn) {
        case "COUNTIF": return `=COUNTIF(${r1}, ${q(st.v1)})`;
        case "COUNTIFS": return `=COUNTIFS(${r1}, ${q(st.v1)}, ${r2}, ${q(st.v2)})`;
        case "SUMIF": return `=SUMIF(${r1}, ${q(st.v1)}, ${vr})`;
        case "SUMIFS": return `=SUMIFS(${vr}, ${r1}, ${q(st.v1)}, ${r2}, ${q(st.v2)})`;
        case "AVERAGEIF": return `=AVERAGEIF(${r1}, ${q(st.v1)}, ${vr})`;
        default: return `=AVERAGEIFS(${vr}, ${r1}, ${q(st.v1)}, ${r2}, ${q(st.v2)})`;
      }
    }
    function drawPicks() {
      clear(picks);
      const colOpts = [0, 1, 2, 3].map((c) => [String(c), `${SLET[c]} (${SCOLS[c]})`]);
      picks.append(sel("Function", FUNCS.map((f) => [f, f]), st.fn, (v) => { st.fn = v; if (multi() && st.c2 === st.c1) st.c2 = (st.c1 + 1) % 4, st.v2 = VALUES[st.c2][0]; update(); }));
      picks.append(sel("Range", colOpts, String(st.c1), (v) => { st.c1 = +v; st.v1 = VALUES[st.c1][0]; update(); }),
        sel("Criterion", VALUES[st.c1].map((x) => [x, x]), st.v1, (v) => { st.v1 = v; update(); }));
      if (multi()) picks.append(sel("Range 2", colOpts, String(st.c2), (v) => { st.c2 = +v; st.v2 = VALUES[st.c2][0]; update(); }),
        sel("Criterion 2", VALUES[st.c2].map((x) => [x, x]), st.v2, (v) => { st.v2 = v; update(); }));
      if (needVal()) picks.append(sel(st.fn.startsWith("SUM") ? "Sum range" : "Average range", [["3", "D (Qty)"], ["4", "E (Sales)"]], String(st.val), (v) => { st.val = +v; update(); }));
    }
    function update() {
      st._mode = "fn";
      drawPicks();
      const flags = SALES.map((r) => meets(r[st.c1], st.v1) && (!multi() || meets(r[st.c2], st.v2)));
      const hits = SALES.filter((_, i) => flags[i]);
      const n = hits.length, sum = hits.reduce((a, r) => a + r[st.val], 0);
      isAvg = st.fn.startsWith("AVERAGE"); isErr = isAvg && n === 0;
      const value = st.fn.startsWith("COUNT") ? n : st.fn.startsWith("SUM") ? sum : n ? sum / n : 0;
      g.light(flags);
      g.unmark("crit"); g.unmark("val");
      g.mark(multi() ? [st.c1, st.c2] : [st.c1], "crit", flags);
      if (needVal()) g.mark([st.val], "val", flags);
      bar.set(formula());
      count.set(value);
      if (isErr) resEl.textContent = "#DIV/0!";
      const crit = multi() ? `${SCOLS[st.c1]} is ${st.v1} AND ${SCOLS[st.c2]} is ${st.v2}` : `${SCOLS[st.c1]} is ${st.v1}`;
      explain.textContent = st.fn.startsWith("COUNT") ? `${n} row${n === 1 ? "" : "s"} where ${crit}.`
        : st.fn.startsWith("SUM") ? `Add ${SCOLS[st.val]} in the ${n} matching row${n === 1 ? "" : "s"}: ${hits.map((r) => r[st.val]).join(" + ") || "0"} = ${fmt(sum, 2)}.`
          : n ? `Average ${SCOLS[st.val]} of the ${n} matching rows: ${fmt(sum, 2)} ÷ ${n} = ${fmt(sum / n, 2)}.` : "No row matches, so the average divides by zero: #DIV/0!";
    }
    root.append(h("p", {}, "Ask the Sheet: build a conditional formula from the menus. Matching rows light up; orange marks the criteria cells and blue marks the cells being added."),
      picks, bar.el, h("div", { class: "readout" }, h("span", { class: "stat" }, "Result ", resEl)), explain,
      h("div", { class: "table-wrap" }, g.el),
      h("div", { class: "controls" }, h("button", { class: "btn ghost", type: "button", onclick: (e) => { st.label = !st.label; e.target.textContent = st.label ? "Hide IF labels" : "Label rows with IF"; paintLabels(); st._mode = st.label ? "if" : "fn"; bar.set(formula()); } }, "Label rows with IF")),
      labelRow,
      h("p", { class: "note" }, "Order of arguments: SUMIF(range, criterion, sum_range) but SUMIFS(sum_range, range1, criterion1, …). Criteria such as \">=10\" go inside quotes."));
    update(); paintLabels();
    return () => { g.stop(); count.stop(); };
  }

  // ------------------------------------------------------------ tab 2 · lookup

  function lookup(root) {
    const st = { method: "VLOOKUP", key: "Turon", start: "B", supplier: false };
    const ROWH = 30;
    const bar = fbar("");
    const result = h("div", { class: "readout fl-res" }), why = h("p", { class: "note" });
    const holder = h("div", { class: "table-wrap" });
    const timers = [];
    let ptr = null, ptrSpring = null, gridEl = null, colX = [], colW = [];
    function layout() {
      const cols = st.supplier ? ["Code", "Item", "Category", "Supplier", "Price"] : ["Code", "Item", "Category", "Price"];
      const widths = st.supplier ? [36, 60, 120, 90, 100, 64] : [36, 60, 120, 90, 64];
      const rows = PRICES.map((p) => (st.supplier ? p : [p[0], p[1], p[2], p[4]]));
      clear(holder);
      gridEl = grid(["", ...cols.map((c, i) => `${"ABCDE"[i]} · ${c}`)], widths, rows);
      ptr = h("div", { class: "fl-ptr", style: "opacity:0" });
      gridEl.el.append(ptr);
      holder.append(gridEl.el);
      colX = []; let x = 0; widths.forEach((w) => { colX.push(x); x += w; }); colW = widths;
      ptrSpring = new Spring([colX[2], ROWH, colW[2], 0], ([px, py, pw, op]) => { ptr.style.transform = `translate(${px}px, ${py}px)`; ptr.style.width = `${pw}px`; ptr.style.opacity = String(clamp(op, 0, 1)); }, { stiffness: 200, damping: 19 });
      return cols;
    }
    function plan() {
      const cols = st.supplier ? 5 : 4, priceCol = cols; // 1-based column letter index of Price (D or E)
      const L = "ABCDE";
      if (st.method === "VLOOKUP") {
        const first = st.start === "A" ? 1 : 2, idx = 3; // the formula was written when Price was column 3 of B:D
        const rangeEnd = L[cols - 1];
        const ret = first + idx - 1;
        return { formula: `=VLOOKUP("${st.key}", Prices!${st.start}2:${rangeEnd}7, ${idx}, FALSE)`, searchCol: first, retCol: ret, priceCol };
      }
      if (st.method === "XLOOKUP") return { formula: `=XLOOKUP("${st.key}", Prices!B2:B7, Prices!${L[priceCol - 1]}2:${L[priceCol - 1]}7, "Not sold")`, searchCol: 2, retCol: priceCol, priceCol, notFound: "Not sold" };
      return { formula: `=INDEX(Prices!${L[priceCol - 1]}2:${L[priceCol - 1]}7, MATCH("${st.key}", Prices!B2:B7, 0))`, searchCol: 2, retCol: priceCol, priceCol };
    }
    function go() {
      timers.forEach(clearTimeout); timers.length = 0;
      layout();
      const p = plan(), rows = PRICES.map((r) => (st.supplier ? r : [r[0], r[1], r[2], r[4]]));
      bar.set(p.formula);
      clear(result); why.textContent = "";
      const found = rows.findIndex((r) => r[p.searchCol - 1] === st.key);
      const sc = p.searchCol; // grid column index (0 is the row-number column)
      ptr.className = "fl-ptr";
      ptrSpring.jump([colX[sc], ROWH, colW[sc], 0]);
      ptrSpring.set([colX[sc], ROWH, colW[sc], 1]);
      const last = found >= 0 ? found : rows.length - 1;
      const stepT = Sim.reducedMotion() ? 0 : 230;
      for (let i = 0; i <= last; i++) timers.push(setTimeout(() => ptrSpring.set([colX[sc], ROWH * (i + 1), colW[sc], 1]), stepT * (i + 1)));
      const tEnd = stepT * (last + 2);
      timers.push(setTimeout(() => {
        if (found < 0) {
          ptr.className = "fl-ptr err";
          ptrSpring.set([colX[sc], ROWH * (last + 1), colW[sc], 1]);
          const v = p.notFound || "#N/A";
          result.append(stat("Result:", v).el, pill(!!p.notFound, "if_not_found used", "#N/A – not found"));
          why.textContent = st.method === "VLOOKUP" && st.start === "A" && PRICES.some((r) => r[1] === st.key)
            ? `VLOOKUP searches only the FIRST column of its range. Prices!A2:… starts at Code, so it looks for “${st.key}” among P01…P06 and fails. The key must be in the first column.`
            : `“${st.key}” is not in the price list. ${st.method === "XLOOKUP" ? "XLOOKUP’s fourth argument gives a friendly message instead of #N/A." : "Wrap the formula in IFERROR( … , \"Not sold\") or use XLOOKUP’s if_not_found."}`;
          return;
        }
        ptr.className = "fl-ptr ok";
        const rc = p.retCol;
        ptrSpring.set([colX[rc], ROWH * (found + 1), colW[rc], 1]);
        timers.push(setTimeout(() => {
          const v = rows[found][rc - 1], right = rc === p.priceCol;
          if (!right) ptr.className = "fl-ptr err";
          result.append(stat("Result:", typeof v === "number" ? peso(v) : `“${v}”`).el, pill(right, "Correct price", "Wrong column!"));
          why.textContent = right
            ? (st.method === "VLOOKUP" ? `Found “${st.key}” in row ${found + 2}, then moved ${p.retCol - p.searchCol} columns right to column 3 of the range. FALSE means exact match.` : `Found “${st.key}” in row ${found + 2} of the Item column and returned the same row of the Price column.${st.supplier ? " The inserted column did not break it: the reference moved to column E by itself." : ""}`)
            : `A Supplier column was inserted, so column 3 of the range is now Supplier, not Price. VLOOKUP’s column number does not update – it silently returns the wrong value. XLOOKUP and INDEX/MATCH point at the Price column itself, so they keep working.`;
        }, stepT ? 380 : 0));
      }, tEnd));
    }
    const startSeg = h("span", {});
    function drawStart() {
      clear(startSeg);
      if (st.method === "VLOOKUP") startSeg.append(h("span", { class: "note" }, "Range starts at "), segmented(["A", "B"], st.start, (v) => { st.start = v; go(); }, (v) => (v === "A" ? "A (Code)" : "B (Item)")));
    }
    root.append(h("p", {}, "Look up an item’s price in the Prices sheet. Watch the pointer search down the lookup column, then move across to the return column."),
      h("div", { class: "controls" }, segmented(["VLOOKUP", "XLOOKUP", "INDEX/MATCH"], st.method, (v) => { st.method = v; drawStart(); go(); })),
      h("div", { class: "controls fl-pick" }, sel("Look up", [...PRICES.map((r) => [r[1], r[1]]), ["Kwek-kwek", "Kwek-kwek"]], st.key, (v) => { st.key = v; go(); }), startSeg,
        h("button", { class: "btn ghost", type: "button", onclick: (e) => { st.supplier = !st.supplier; e.target.textContent = st.supplier ? "Remove Supplier column" : "Insert Supplier column"; go(); } }, "Insert Supplier column"),
        h("button", { class: "btn", type: "button", onclick: go }, "Look up")),
      bar.el, holder, result, why);
    drawStart(); go();
    return () => { timers.forEach(clearTimeout); if (ptrSpring) ptrSpring.stop(); if (gridEl) gridEl.stop(); };
  }

  // ------------------------------------------------------------ tab 3 · combine

  const salesOf = (it) => SALES.filter((r) => r[1] === it);
  const TASKS = [
    { ask: "The manager only knows the product code P01. What were the total sales of that item?",
      tokens: ["=SUMIFS(", "Sales!E2:E11,", "Sales!B2:B11,", "XLOOKUP(\"P01\",", "Prices!A2:A7,", "Prices!B2:B7))"], extra: ["Prices!D2:D7))", "Sales!D2:D11,"],
      value: () => peso(salesOf("Siomai").reduce((a, r) => a + r[4], 0)), rows: (r) => r[1] === "Siomai",
      how: "XLOOKUP turns P01 into “Siomai”; SUMIFS then adds the Sales of every Siomai row: 540 + 405 + 630." },
    { ask: "Was Iced Tea sold at all this week? Answer “Sold” or “Not sold”.",
      tokens: ["=IF(", "COUNTIF(Sales!B2:B11, \"Iced Tea\")", ">0,", "\"Sold\",", "\"Not sold\")"], extra: ["=0,", "COUNTIF(Sales!C2:C11, \"Iced Tea\")"],
      value: () => "Not sold", rows: () => false,
      how: "COUNTIF counts the Iced Tea rows: 0. Since 0 > 0 is FALSE, IF returns its third argument, “Not sold”." },
    { ask: "Total Lumpia quantity × the Lumpia price from the price list. How much money is that?",
      tokens: ["=SUMIF(Sales!B2:B11, \"Lumpia\", Sales!D2:D11)", "*", "XLOOKUP(\"Lumpia\",", "Prices!B2:B7,", "Prices!D2:D7)"], extra: ["Prices!C2:C7)", "+"],
      value: () => peso(salesOf("Lumpia").reduce((a, r) => a + r[3], 0) * 15), rows: (r) => r[1] === "Lumpia",
      how: "SUMIF adds the Lumpia quantities: 10 + 6 = 16. XLOOKUP finds the price ₱15. 16 × 15 = ₱240 – the same as adding the Sales column, a good check." },
    { ask: "Did Bea reach the ₱500 target on Monday? Answer “Target met” or “Below target”.",
      tokens: ["=IF(", "SUMIFS(Sales!E2:E11,", "Sales!C2:C11, \"Bea\",", "Sales!A2:A11, \"Mon\")", ">=500,", "\"Target met\", \"Below target\")"], extra: ["<500,", "Sales!B2:B11, \"Bea\","],
      value: () => "Target met", rows: (r) => r[2] === "Bea" && r[0] === "Mon",
      how: "SUMIFS adds Bea’s Monday sales: 540 + 150 = ₱690. 690 >= 500 is TRUE, so IF returns “Target met”." },
  ];

  function combine(root) {
    let task = 0;
    const springs = new Map();
    const pool = h("div", { class: "fl-tokens", "aria-label": "Formula pieces" });
    const line = h("div", { class: "fl-tokens line", "aria-label": "Your formula" });
    const ask = h("p", { class: "steps-title" }), fb = h("div", { class: "readout fl-res", "aria-live": "polite" }), how = h("p", { class: "note" });
    const resEl = h("span", { class: "fl-result" });
    const sales = grid(["", "A · Day", "B · Item", "C · Cashier", "D · Qty", "E · Sales"], [32, 52, 104, 74, 50, 64], SALES);
    const prices = grid(["", "A · Code", "B · Item", "C · Cat.", "D · Price"], [32, 54, 112, 64, 60], PRICES.map((p) => [p[0], p[1], p[2], p[4]]));
    const springOf = (el) => {
      if (!springs.has(el)) springs.set(el, new Spring([0, 0], ([x, y]) => { el.style.transform = `translate(${x}px, ${y}px)`; }, { stiffness: 260, damping: 21 }));
      return springs.get(el);
    };
    /** FLIP: remember where every token is, change the DOM, then spring each token from its old place. */
    function flip(mutate) {
      const toks = [...pool.children, ...line.children];
      const before = new Map(toks.map((t) => [t, t.getBoundingClientRect()]));
      mutate();
      toks.forEach((t) => {
        const a = before.get(t), b = t.getBoundingClientRect(), sp = springOf(t);
        if (!a || !b.width) return;
        const dx = a.left - b.left + sp.value[0], dy = a.top - b.top + sp.value[1];
        if (Math.abs(dx) < 0.5 && Math.abs(dy) < 0.5) return;
        sp.jump([dx, dy]); sp.set([0, 0]);
      });
    }
    function tokenEl(text) {
      const b = h("button", { type: "button", class: "fl-tok" }, text);
      b.addEventListener("click", () => { flip(() => { (b.parentNode === pool ? line : pool).append(b); }); clear(fb); how.textContent = ""; resEl.textContent = ""; });
      return b;
    }
    function load(i) {
      task = i;
      springs.forEach((sp) => sp.stop()); springs.clear();
      clear(pool); clear(line); clear(fb); how.textContent = ""; resEl.textContent = "";
      const T = TASKS[i];
      ask.textContent = T.ask;
      shuffle([...T.tokens, ...T.extra]).forEach((t) => pool.append(tokenEl(t)));
      sales.light(SALES.map(() => false));
    }
    function evaluate() {
      const T = TASKS[task], got = [...line.children].map((b) => b.textContent);
      clear(fb);
      if (!got.length) { fb.append(h("span", { class: "note" }, "Click the pieces in order to build the formula.")); return; }
      const bad = T.tokens.findIndex((t, k) => got[k] !== t);
      if (bad === -1 && got.length === T.tokens.length) {
        fb.append(pill(true, "The sheet evaluates it!", ""), stat("Result:", "").el);
        fb.lastChild.querySelector("b").append(resEl);
        resEl.textContent = T.value();
        how.textContent = T.how;
        sales.light(SALES.map(T.rows));
        if (resEl.animate && !Sim.reducedMotion()) resEl.animate([{ transform: "scale(.6)", opacity: 0 }, { transform: "scale(1.12)", opacity: 1, offset: 0.7 }, { transform: "scale(1)" }], { duration: 420 });
      } else {
        const k = bad === -1 ? T.tokens.length : bad;
        fb.append(pill(false, "", k < got.length ? "Formula parse error" : "Not finished"),
          h("span", { class: "note" }, k < got.length ? ` Piece ${k + 1} (“${got[k]}”) is not right here. Click it to send it back.` : ` The first ${k} pieces are right – keep going.`));
        const wrong = line.children[k];
        if (wrong && wrong.animate && !Sim.reducedMotion()) wrong.animate([{ transform: "translateX(0)" }, { transform: "translateX(-6px)" }, { transform: "translateX(6px)" }, { transform: "translateX(0)" }], { duration: 280 });
      }
    }
    root.append(h("div", { class: "controls" }, segmented([0, 1, 2, 3], 0, (v) => load(v), (v) => `Q${v + 1}`)),
      ask, h("p", { class: "fl-cap" }, "Pieces (click to add, click again to remove)"), pool, h("p", { class: "fl-cap" }, "Your formula"), line,
      h("div", { class: "controls" }, h("button", { class: "btn", type: "button", onclick: evaluate }, "Evaluate"),
        h("button", { class: "btn ghost", type: "button", onclick: () => load(task) }, "Start over")),
      fb, how,
      h("div", { class: "fl-two" }, h("div", {}, h("p", { class: "fl-cap" }, "Sheet “Sales”"), h("div", { class: "table-wrap" }, sales.el)), h("div", {}, h("p", { class: "fl-cap" }, "Sheet “Prices”"), h("div", { class: "table-wrap" }, prices.el))));
    load(0);
    return () => { springs.forEach((sp) => sp.stop()); sales.stop(); prices.stop(); };
  }

  // ------------------------------------------------------------ register

  Sim.register({
    id: "lesson7", unit: "3", num: 7, title: "Conditional and Lookup Functions", simName: "Formula Lab",
    comps: ["A2.3", "A2.4", "A2.5", "M6"], sessions: "S28–S33", cg: "CG Part 2 · Content 2 (Conditional and Lookup Functions)", deped: "CG Part 2 · Content 2 (Conditional and Lookup Functions)",
    bigQuestion: "How do we turn messy data into a dataset we can trust?",
    mission: [
      "Conditional: find the total Sales of Siomai with SUMIF, then only on Wednesday with SUMIFS. Which rows light up each time?",
      "Count the rows with Qty >= 10 using COUNTIF. Then label every row with IF: slide the threshold and watch the labels change.",
      "Lookup: look up Turon with VLOOKUP. Now insert the Supplier column. What goes wrong? Try XLOOKUP and INDEX/MATCH.",
      "Combine: answer the four manager questions by putting the formula pieces in order. Check Question 3 by another method.",
    ],
    discovery: "Conditional functions answer questions about a part of the data: COUNTIF/COUNTIFS count, SUMIF/SUMIFS add, and AVERAGEIF/AVERAGEIFS average only the rows that meet the criteria; IF labels each row. Lookup functions fetch a value from a table: VLOOKUP searches only the first column of its range and uses a fixed column number, so it breaks when columns move, while XLOOKUP and INDEX/MATCH point at the return column itself. Combining them – a lookup inside SUMIFS, or COUNTIF inside IF – answers harder questions in one formula, and a second method checks the answer.",
    mount(stage) {
      const body = h("div", { class: "stage-body" });
      const views = [conditional, lookup, combine];
      let stopper = null;
      const t = tabs(["Conditional", "Lookup", "Combine"], (i) => { if (stopper) stopper(); clear(body); stopper = views[i](body) || null; });
      stage.append(t.el, body);
      stopper = conditional(body);
      return () => { if (stopper) stopper(); };
    },
    check() {
      const kind = randInt(0, 6);
      if (kind === 0) {
        const it = pick(Object.keys(PRICE)), hits = salesOf(it);
        return { q: `In the Sales sheet (sample data), Siomai rows have Sales 540, 405, 630; Turon 160, 220, 180; Lumpia 150, 90; Banana Cue 175, 125. What does =SUMIF(B2:B11, "${it}", E2:E11) return?`, answer: hits.reduce((a, r) => a + r[4], 0), tol: 0, unit: "₱", explain: `Add the ${it} rows: ${hits.map((r) => r[4]).join(" + ")} = ${hits.reduce((a, r) => a + r[4], 0)}.` };
      }
      if (kind === 1) {
        const qs = Array.from({ length: randInt(6, 9) }, () => randInt(3, 15)), t = pick([8, 10, 12]);
        const n = qs.filter((x) => x >= t).length;
        return { q: `D2:D${qs.length + 1} holds the quantities ${qs.join(", ")}. What does =COUNTIF(D2:D${qs.length + 1}, ">=${t}") return?`, answer: n, tol: 0, explain: `Values ${t} or more: ${qs.filter((x) => x >= t).join(", ") || "none"} → ${n}.` };
      }
      if (kind === 2) {
        const vals = Array.from({ length: randInt(2, 4) }, () => pick([90, 120, 150, 175, 200, 225]));
        const avg = vals.reduce((a, b) => a + b, 0) / vals.length;
        return { q: `AVERAGEIF finds ${vals.length} matching rows with Sales ${vals.join(", ")}. What value does it return?`, answer: avg, tol: 0.01, unit: "₱", explain: `(${vals.join(" + ")}) ÷ ${vals.length} = ${fmt(avg, 2)}.` };
      }
      if (kind === 3) return pick([
        { q: "Which formula adds the Sales (E) of Siomai rows on Wednesday?", choices: ['=SUMIFS(E2:E11, B2:B11, "Siomai", A2:A11, "Wed")', '=SUMIF(E2:E11, "Siomai", "Wed")', '=SUMIFS(B2:B11, "Siomai", E2:E11)', '=COUNTIFS(B2:B11, "Siomai", A2:A11, "Wed")'], answer: '=SUMIFS(E2:E11, B2:B11, "Siomai", A2:A11, "Wed")', explain: "SUMIFS puts the sum range first, then range–criterion pairs." },
        { q: "Which function counts rows that meet TWO conditions?", choices: ["COUNTIFS", "COUNTIF", "SUMIF", "VLOOKUP"], answer: "COUNTIFS", explain: "The -IFS versions take several range–criterion pairs." },
        { q: 'What does =IF(E2>=200, "High", "Low") return when E2 is 175?', choices: ["Low", "High", "175", "FALSE"], answer: "Low", explain: "175 >= 200 is FALSE, so IF returns the third argument." },
      ]);
      if (kind === 4) return pick([
        { q: 'Prices sheet: A Code, B Item, C Category, D Price. Why does =VLOOKUP("Turon", A2:D7, 4, FALSE) return #N/A?', choices: ["VLOOKUP searches only the first column (Code)", "Turon is spelled wrong", "4 is too big", "FALSE means approximate"], answer: "VLOOKUP searches only the first column (Code)", explain: "The key must be in the first column of the range. Start the range at B, or use XLOOKUP." },
        { q: "A column is inserted inside a VLOOKUP range. What can happen?", choices: ["It returns a value from the wrong column", "It updates the column number by itself", "It always shows #REF!", "Nothing ever changes"], answer: "It returns a value from the wrong column", explain: "The column number in VLOOKUP is a fixed number; XLOOKUP and INDEX/MATCH avoid this." },
        { q: 'Which formula returns the Price (D) of "Lumpia", where items are in B2:B7?', choices: ['=XLOOKUP("Lumpia", B2:B7, D2:D7)', '=XLOOKUP(B2:B7, "Lumpia", D2:D7)', '=MATCH("Lumpia", D2:D7, 0)', '=INDEX(B2:B7, 3)'], answer: '=XLOOKUP("Lumpia", B2:B7, D2:D7)', explain: "XLOOKUP(search_key, lookup_range, result_range)." },
        { q: 'Items in B2:B7 are Siomai, Turon, Lumpia, Banana Cue, Iced Tea, Pancit Canton. What does =MATCH("Lumpia", B2:B7, 0) return?', choices: ["3", "4", "15", "#N/A"], answer: "3", explain: "MATCH gives the position: Lumpia is 3rd in the range." },
      ]);
      if (kind === 5) {
        const qty = randInt(5, 20), it = pick(Object.keys(PRICE));
        return { q: `=SUMIF(…) gives a total quantity of ${qty} for ${it}, and =XLOOKUP("${it}", Prices!B2:B7, Prices!D2:D7) gives ₱${PRICE[it]}. What does the product of the two formulas return?`, answer: qty * PRICE[it], tol: 0, unit: "₱", explain: `${qty} × ${PRICE[it]} = ${qty * PRICE[it]}.` };
      }
      return pick([
        { q: 'What does =IF(COUNTIF(B2:B11, "Iced Tea")>0, "Sold", "Not sold") return if no row says Iced Tea?', choices: ["Not sold", "Sold", "0", "#N/A"], answer: "Not sold", explain: "COUNTIF returns 0, and 0 > 0 is FALSE." },
        { q: "You found the Lumpia sales with SUMIF. What is a good way to check the answer?", choices: ["Compute it another way, e.g. quantity × price", "Run the same formula again", "Round it", "Trust it"], answer: "Compute it another way, e.g. quantity × price", explain: "A second method that agrees gives confidence in the result." },
      ]);
    },
  });
})();
