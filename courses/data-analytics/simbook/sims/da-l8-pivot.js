/* Unit 3 · Lesson 8 · H. Tables, Pivot Tables, and Aggregation – Pivot Builder */
(function () {
  "use strict";
  const { h, clear, randInt, pick, shuffle, fmt, peso, segmented, stat, pill, Spring, clamp } = Sim;

  if (!document.getElementById("da-l8-style")) {
    document.head.append(h("style", { id: "da-l8-style" }, `
.pv-zone { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 8px; }
@media (max-width: 760px) { .pv-zone { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
.pv-well { border: 2px dashed var(--line); border-radius: 10px; padding: 6px; min-height: 74px; display: flex; flex-wrap: wrap; gap: 6px; align-content: flex-start; transition: border-color .2s, background .2s; min-width: 0; }
.pv-well.over { border-color: var(--accent); background: var(--accent-soft); }
.pv-well.no { border-color: var(--bad); }
.pv-well > .pv-cap { flex-basis: 100%; font-size: .72rem; letter-spacing: .08em; text-transform: uppercase; color: var(--muted); font-weight: 700; margin: 0; }
.pv-pool { border: 1px solid var(--line); border-radius: 10px; padding: 8px; display: flex; flex-wrap: wrap; gap: 6px; min-height: 50px; background: var(--bg); align-items: center; }
.pv-chip { touch-action: none; user-select: none; cursor: grab; border-radius: 999px; padding: 6px 12px; font-size: .88rem; font-weight: 700; border: 2px solid var(--shape-a); background: var(--paper); color: var(--ink); position: relative; will-change: transform; }
.pv-chip.m { border-color: var(--gold); }
.pv-chip.drag { cursor: grabbing; z-index: 20; box-shadow: 0 8px 20px rgba(0, 0, 0, .22); }
.pv-table { position: relative; font-size: .86rem; }
.pv-row { display: grid; height: 30px; border-bottom: 1px solid var(--line); background: var(--paper); }
.pv-body { position: relative; overflow: hidden; }
.pv-body .pv-row { position: absolute; left: 0; right: 0; top: 0; will-change: transform; }
.pv-row > div { display: flex; align-items: center; justify-content: flex-end; padding: 0 8px; font-family: var(--mono); border-right: 1px solid var(--grid); white-space: nowrap; overflow: hidden; }
.pv-row > div:first-child { justify-content: flex-start; font-family: var(--body); font-weight: 700; }
.pv-head > div { font-family: var(--body); font-size: .74rem; color: var(--muted); font-weight: 700; background: var(--bg); justify-content: flex-end; white-space: normal; line-height: 1.1; }
.pv-head { height: auto; min-height: 34px; }
.pv-row.tot { font-weight: 700; background: var(--accent-soft); border-top: 2px solid var(--accent); }
.pv-row.tot > div { font-weight: 700; }
.pv-slicer { display: flex; flex-wrap: wrap; gap: 6px; align-items: center; }
.pv-slicer button { border: 1px solid var(--line); background: var(--bg); border-radius: 999px; padding: 4px 11px; cursor: pointer; font-size: .86rem; }
.pv-slicer button[aria-pressed="true"] { background: var(--accent); color: var(--accent-ink); border-color: var(--accent); }
.pv-code { font-family: var(--mono); font-size: .86rem; white-space: pre-wrap; overflow-wrap: anywhere; margin: 0; background: var(--bg); border: 1px solid var(--line); border-left: 4px solid var(--shape-a); border-radius: 8px; padding: 8px 10px; }
.pv-msg { min-height: 1.4em; }
`));
  }

  // ------------------------------------------------------------ data (sample data)

  const PRICE = { Siomai: 45, Turon: 20, "Banana Cue": 25, "Iced Tea": 18, "Pancit Canton": 50 };
  const CAT = { Siomai: "Snack", Turon: "Snack", "Banana Cue": "Snack", "Iced Tea": "Drink", "Pancit Canton": "Meal" };
  const RAW = {
    Mon: [["Siomai", "Bea", 12], ["Turon", "Carlo", 8], ["Iced Tea", "Bea", 15], ["Pancit Canton", "Dana", 6], ["Banana Cue", "Carlo", 5]],
    Tue: [["Siomai", "Carlo", 9], ["Turon", "Bea", 11], ["Iced Tea", "Dana", 10], ["Pancit Canton", "Carlo", 7], ["Banana Cue", "Dana", 7]],
    Wed: [["Siomai", "Dana", 14], ["Turon", "Dana", 6], ["Iced Tea", "Carlo", 18], ["Pancit Canton", "Bea", 9], ["Banana Cue", "Bea", 4]],
    Thu: [["Siomai", "Bea", 10], ["Turon", "Carlo", 9], ["Iced Tea", "Bea", 12], ["Pancit Canton", "Dana", 5], ["Banana Cue", "Carlo", 8]],
    Fri: [["Siomai", "Carlo", 16], ["Turon", "Bea", 12], ["Iced Tea", "Dana", 20], ["Pancit Canton", "Carlo", 10], ["Banana Cue", "Dana", 6]],
  };
  const DATA = Object.entries(RAW).flatMap(([Day, rows]) => rows.map(([Item, Cashier, Qty]) => ({ Item, Category: CAT[Item], Day, Cashier, Qty, Sales: Qty * PRICE[Item] })));
  const FIELDS = ["Item", "Category", "Day", "Cashier", "Qty", "Sales"];
  const MEASURE = new Set(["Qty", "Sales"]);
  const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri"];
  const order = (f, vals) => (f === "Day" ? DAYS.filter((d) => vals.includes(d)) : vals.slice().sort());
  const distinct = (rows, f) => order(f, [...new Set(rows.map((r) => r[f]))]);
  const col = (f) => ({ Item: "item", Category: "category", Day: "day", Cashier: "cashier", Qty: "qty", Sales: "sales" })[f];

  function aggregate(rows, field, how) {
    if (!rows.length) return null; // an empty combination is left blank, as in Sheets
    if (!MEASURE.has(field) || how === "COUNT") return rows.length;
    const sum = rows.reduce((a, r) => a + r[field], 0);
    return how === "AVERAGE" ? (rows.length ? sum / rows.length : null) : sum;
  }

  /** Builds the pivot as plain numbers: { rowKeys, colKeys, cells[r][c], totalRow[c], heads[c] }. */
  function pivot(st) {
    const sel = st.filter && st.pick ? DATA.filter((r) => st.pick.has(r[st.filter])) : DATA;
    const rf = st.rows, cf = st.cols, vals = st.values;
    let rowKeys = rf ? distinct(sel, rf) : [];
    const colKeys = cf ? [...distinct(sel, cf), null] : [null]; // null = grand total column
    const cols = [];
    colKeys.forEach((ck) => vals.forEach((v) => cols.push({ ck, v })));
    const cellOf = (rk, c) => aggregate(sel.filter((r) => (rk === null || r[rf] === rk) && (c.ck === null || r[cf] === c.ck)), c.v, st.how);
    let cells = rowKeys.map((rk) => cols.map((c) => cellOf(rk, c)));
    const totalRow = cols.map((c) => cellOf(null, c));
    if (st.sort === "desc" && rowKeys.length) {
      const idx = rowKeys.map((_, i) => i).sort((a, b) => (cells[b][cols.length - 1] ?? -1) - (cells[a][cols.length - 1] ?? -1));
      rowKeys = idx.map((i) => rowKeys[i]); cells = idx.map((i) => cells[i]);
    }
    // "Show values as"
    let shown = cells.map((r) => r.slice()), shownTot = totalRow.slice();
    if (st.as !== "none") {
      cols.forEach((c, j) => {
        const colVals = cells.map((r) => r[j]);
        if (st.as === "pct") {
          const grand = cellOf(null, { ck: null, v: c.v });
          shown.forEach((r, i) => { r[j] = grand && colVals[i] !== null ? (colVals[i] / grand) * 100 : null; });
          shownTot[j] = grand ? (totalRow[j] / grand) * 100 : null;
        } else if (st.as === "diff") {
          shown.forEach((r, i) => { r[j] = i === 0 || colVals[i] === null || colVals[i - 1] === null ? null : colVals[i] - colVals[i - 1]; });
          shownTot[j] = null;
        } else if (st.as === "run") {
          let acc = 0; shown.forEach((r, i) => { acc += colVals[i] || 0; r[j] = acc; });
          shownTot[j] = null;
        } else if (st.as === "rank") {
          shown.forEach((r, i) => { r[j] = colVals[i] === null ? null : 1 + colVals.filter((x) => x !== null && x > colVals[i]).length; });
          shownTot[j] = null;
        }
      });
    }
    const heads = cols.map((c) => {
      const vname = `${MEASURE.has(c.v) && st.how !== "COUNT" ? st.how : "COUNT"} of ${c.v}`;
      if (!cf) return vname;
      const base = c.ck === null ? "Grand total" : c.ck;
      return vals.length > 1 ? `${base} · ${vname}` : base;
    });
    return { rowKeys, cols, cells, shown, totalRow, shownTot, heads, n: sel.length };
  }

  function show(v, st, field) {
    if (v === null || v === undefined) return "–";
    if (st.as === "pct") return fmt(v, 1) + "%";
    if (st.as === "rank") return String(v);
    const money = field === "Sales" && st.how !== "COUNT";
    const s = money ? peso(Math.abs(v)).replace(".00", "") : fmt(Math.abs(v), 2);
    return (v < 0 ? "−" : st.as === "diff" && v > 0 ? "+" : "") + s;
  }

  function pandas(st) {
    const lines = [];
    let src = "df";
    if (st.filter && st.pick && st.pick.size < distinct(DATA, st.filter).length) {
      lines.push(`sub = df[df['${col(st.filter)}'].isin([${[...st.pick].map((x) => `'${x}'`).join(", ")}])]`);
      src = "sub";
    }
    if (!st.values.length) return [...lines, "# drag a field into Values"].join("\n");
    const fn = { SUM: "sum", AVERAGE: "mean", COUNT: "count" }[st.how];
    const vs = st.values.map((v) => `'${col(v)}'`);
    if (!st.rows) { lines.push(`${src}[[${vs.join(", ")}]].${fn}()`); return lines.join("\n"); }
    if (st.cols) {
      lines.push(`t = ${src}.pivot_table(index='${col(st.rows)}', columns='${col(st.cols)}',`, `      values=${vs.length > 1 ? `[${vs.join(", ")}]` : vs[0]}, aggfunc='${fn}', margins=True)`);
    } else lines.push(`t = ${src}.groupby('${col(st.rows)}')[${vs.length > 1 ? `[${vs.join(", ")}]` : vs[0]}].${fn}()`);
    if (st.sort === "desc") lines.push(st.cols || st.values.length > 1 ? "t = t.sort_values(by=t.columns[-1], ascending=False)" : "t = t.sort_values(ascending=False)");
    if (st.as === "pct") lines.push("t = t / t.sum() * 100");
    if (st.as === "diff") lines.push("t = t.diff()");
    if (st.as === "run") lines.push("t = t.cumsum()");
    if (st.as === "rank") lines.push("t = t.rank(ascending=False)");
    return lines.join("\n");
  }

  // ------------------------------------------------------------ the builder

  function builder(root) {
    const st = { rows: "Item", cols: null, values: ["Sales"], filter: null, pick: null, how: "SUM", as: "none", sort: "az" };
    const ROWH = 30;
    const msg = h("p", { class: "note pv-msg", "aria-live": "polite" }, "Drag a field chip into a box. Click a chip to add or remove it quickly.");
    const pool = h("div", { class: "pv-pool", "aria-label": "Fields" });
    const wells = {};
    const zone = h("div", { class: "pv-zone" });
    [["rows", "Rows"], ["cols", "Columns"], ["values", "Values"], ["filter", "Filter"]].forEach(([k, label]) => {
      wells[k] = h("div", { class: "pv-well", "data-well": k, "aria-label": label }, h("p", { class: "pv-cap" }, label));
      zone.append(wells[k]);
    });
    const slicer = h("div", { class: "pv-slicer" });
    const head = h("div", { class: "pv-row pv-head" });
    const body = h("div", { class: "pv-body", style: "height:0px" });
    const table = h("div", { class: "pv-table" }, head, body);
    const code = h("pre", { class: "pv-code" });
    const sheetsNote = h("p", { class: "note" });
    const out = h("div", { class: "readout" });
    const rowNodes = new Map(), timers = [];
    const hs = new Spring(0, (v) => { body.style.height = Math.max(0, v) + "px"; }, { stiffness: 170, damping: 20 });

    // ---- chips with springs (persistent nodes)
    const chips = {};
    const springs = new Map();
    const springOf = (el) => {
      if (!springs.has(el)) springs.set(el, new Spring([0, 0], ([x, y]) => { el.style.transform = `translate(${x}px, ${y}px)`; }, { stiffness: 230, damping: 17 }));
      return springs.get(el);
    };
    function flip(mutate) {
      const all = Object.values(chips), before = new Map(all.map((c) => [c, c.getBoundingClientRect()]));
      mutate();
      all.forEach((c) => {
        const a = before.get(c), b = c.getBoundingClientRect(), sp = springOf(c);
        const dx = a.left - b.left + sp.value[0], dy = a.top - b.top + sp.value[1];
        if (Math.abs(dx) < 0.5 && Math.abs(dy) < 0.5) return;
        sp.jump([dx, dy]); sp.set([0, 0]);
      });
    }
    const where = (f) => (st.rows === f ? "rows" : st.cols === f ? "cols" : st.values.includes(f) ? "values" : st.filter === f ? "filter" : null);
    function place(f, well) {
      const from = where(f);
      if (from === "rows") st.rows = null; if (from === "cols") st.cols = null; if (from === "filter") { st.filter = null; st.pick = null; }
      if (from === "values") st.values = st.values.filter((x) => x !== f);
      if (well === "rows") st.rows = f;
      if (well === "cols") st.cols = f;
      if (well === "filter") { st.filter = f; st.pick = new Set(distinct(DATA, f)); }
      if (well === "values") { st.values.push(f); if (st.values.length > 2) st.values.shift(); }
      if (st.rows && st.rows === st.cols) st.cols = null;
    }
    function layoutChips() {
      FIELDS.forEach((f) => { const w = where(f); (w ? wells[w] : pool).append(chips[f]); });
    }
    function accepts(well, f) { return !((well === "rows" || well === "cols") && MEASURE.has(f)); }
    FIELDS.forEach((f) => {
      const c = h("div", { class: "pv-chip" + (MEASURE.has(f) ? " m" : ""), tabindex: 0, role: "button", "aria-label": `${f} field` }, f);
      chips[f] = c;
      let start = null, base = null, moved = false, over = null;
      const wellAt = (x, y) => Object.entries(wells).find(([, el]) => { const r = el.getBoundingClientRect(); return x >= r.left && x <= r.right && y >= r.top && y <= r.bottom; });
      c.addEventListener("pointerdown", (e) => {
        e.preventDefault(); c.setPointerCapture(e.pointerId);
        const sp = springOf(c); sp.stop();
        start = { x: e.clientX, y: e.clientY }; base = sp.value.slice(); moved = false;
      });
      c.addEventListener("pointermove", (e) => {
        if (!start) return;
        const dx = e.clientX - start.x, dy = e.clientY - start.y;
        if (!moved && Math.hypot(dx, dy) < 5) return;
        moved = true; c.classList.add("drag");
        const sp = springOf(c); sp.value = [base[0] + dx, base[1] + dy]; sp.vel = [0, 0]; c.style.transform = `translate(${sp.value[0]}px, ${sp.value[1]}px)`;
        const w = wellAt(e.clientX, e.clientY);
        Object.values(wells).forEach((el) => el.classList.remove("over", "no"));
        over = w ? w[0] : null;
        if (w) w[1].classList.add(accepts(w[0], f) ? "over" : "no");
      });
      const end = (e) => {
        if (!start) return;
        start = null; c.classList.remove("drag");
        Object.values(wells).forEach((el) => el.classList.remove("over", "no"));
        if (!moved) { quick(f); return; }
        const w = wellAt(e.clientX, e.clientY);
        if (w && accepts(w[0], f)) {
          flip(() => { place(f, w[0]); layoutChips(); });
          msg.textContent = w[0] === "values" && !MEASURE.has(f) ? `${f} is text, so Values counts it: COUNTA of ${f}.` : `${f} → ${w[1].getAttribute("aria-label")}.`;
          update();
        } else {
          springOf(c).set([0, 0]); // rubber band back to where it came from
          msg.textContent = w ? `${f} is a number. Numbers go in Values (to add or average), not in ${w[1].getAttribute("aria-label")}.` : "Dropped outside the boxes – the chip snaps back.";
        }
      };
      c.addEventListener("pointerup", end);
      c.addEventListener("pointercancel", end);
      c.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); quick(f); } });
    });
    function quick(f) {
      const w = where(f);
      flip(() => { if (w) place(f, null); else place(f, MEASURE.has(f) ? "values" : st.rows ? (st.cols ? "filter" : "cols") : "rows"); layoutChips(); });
      msg.textContent = w ? `${f} removed.` : `${f} → ${where(f) === "rows" ? "Rows" : where(f) === "cols" ? "Columns" : where(f) === "values" ? "Values" : "Filter"}.`;
      update();
    }

    // ---- the pivot table with springy rows
    function rowNode(key) {
      if (rowNodes.has(key)) return rowNodes.get(key);
      const el = h("div", { class: "pv-row" + (key === "__total" ? " tot" : "") });
      const n = { el, spring: null };
      n.spring = new Spring([0, 0, 0], ([y, op, x]) => { el.style.transform = `translate(${x}px, ${y}px)`; el.style.opacity = String(clamp(op, 0, 1)); }, { stiffness: 200, damping: 19 });
      body.append(el); rowNodes.set(key, n);
      return n;
    }
    function update() {
      timers.forEach(clearTimeout); timers.length = 0;
      const P = pivot(st);
      const widths = [128, ...P.cols.map((c) => (P.cols.length > 6 ? 84 : 104))];
      const tmpl = widths.map((w) => w + "px").join(" ");
      table.style.minWidth = widths.reduce((a, b) => a + b, 0) + "px";
      clear(head); head.style.gridTemplateColumns = tmpl;
      head.append(h("div", {}, st.rows || ""), ...P.heads.map((t) => h("div", {}, t)));
      const list = st.values.length ? [...P.rowKeys.map((k, i) => ({ key: "r:" + k, label: k, vals: P.shown[i] })), { key: "__total", label: "Grand total", vals: P.shownTot }] : [];
      const live = new Set(list.map((x) => x.key));
      list.forEach((it, i) => {
        const n = rowNode(it.key), fresh = n.spring.target[1] === 0;
        clear(n.el); n.el.style.gridTemplateColumns = tmpl;
        n.el.append(h("div", {}, it.label), ...it.vals.map((v, j) => h("div", {}, show(v, st, P.cols[j].v))));
        if (fresh) n.spring.jump([i * ROWH, 0, -30]);
        timers.push(setTimeout(() => n.spring.set([i * ROWH, 1, 0]), fresh ? i * 35 : 0));
      });
      rowNodes.forEach((n, k) => { if (!live.has(k)) n.spring.set([n.spring.target[0], 0, 50]); });
      hs.set(list.length * ROWH);
      // slicer for the filter field
      clear(slicer);
      if (st.filter) {
        slicer.append(h("span", { class: "note" }, `Slicer · ${st.filter}:`));
        distinct(DATA, st.filter).forEach((v) => slicer.append(h("button", { type: "button", "aria-pressed": st.pick.has(v) ? "true" : "false", onclick: () => { if (st.pick.has(v)) { if (st.pick.size > 1) st.pick.delete(v); } else st.pick.add(v); update(); } }, v)));
        slicer.append(h("button", { type: "button", onclick: () => { st.pick = new Set(distinct(DATA, st.filter)); update(); } }, "All"));
      } else slicer.append(h("span", { class: "note" }, "Drag a field (try Day or Cashier) into Filter to get a slicer."));
      code.textContent = pandas(st);
      const asText = { none: "", pct: " · Show as: % of grand total", diff: " · Show as: difference from previous row", run: " · Show as: running total", rank: " · Show as: rank (largest = 1)" }[st.as];
      sheetsNote.textContent = st.values.length
        ? `Google Sheets: Insert ▸ Pivot table. Rows: ${st.rows || "–"} · Columns: ${st.cols || "–"} · Values: ${st.values.map((v) => `${MEASURE.has(v) && st.how !== "COUNT" ? st.how : "COUNTA"} of ${v}`).join(", ")}${asText}${st.filter ? ` · Filter: ${st.filter}` : ""}.`
        : "Drag Qty or Sales into Values to summarize them.";
      clear(out);
      out.append(stat("Records used:", `${P.n} of ${DATA.length}`).el);
      if (st.values.length && st.rows && st.as === "none" && st.how === "SUM") {
        const top = P.rowKeys[P.cells.map((r) => r[r.length - 1]).reduce((bi, v, i, a) => (v > a[bi] ? i : bi), 0)];
        out.append(stat("Largest:", top || "–").el);
      }
    }

    root.append(h("p", {}, "Which item really sells? Build a pivot table of 25 canteen sales records (sample data, Monday to Friday)."),
      h("p", { class: "steps-title" }, "Fields"), pool, zone,
      h("div", { class: "controls" }, h("span", { class: "note" }, "Summarize by"), segmented(["SUM", "AVERAGE", "COUNT"], st.how, (v) => { st.how = v; update(); })),
      h("div", { class: "controls" }, h("span", { class: "note" }, "Show values as"), segmented(["none", "pct", "diff", "run", "rank"], st.as, (v) => { st.as = v; update(); },
        (v) => ({ none: "Default", pct: "% of total", diff: "Difference", run: "Running total", rank: "Rank" })[v])),
      h("div", { class: "controls" }, h("span", { class: "note" }, "Sort rows"), segmented(["az", "desc"], st.sort, (v) => { st.sort = v; update(); }, (v) => (v === "az" ? "A–Z / day order" : "Largest first"))),
      msg, slicer, h("div", { class: "table-wrap" }, table), out, sheetsNote, h("p", { class: "steps-title" }, "The same summary in pandas"), code);
    layoutChips();
    update();
    return () => { timers.forEach(clearTimeout); springs.forEach((sp) => sp.stop()); rowNodes.forEach((n) => n.spring.stop()); hs.stop(); };
  }

  // ------------------------------------------------------------ register

  const totalBy = (f, v, field = "Sales") => DATA.filter((r) => r[f] === v).reduce((a, r) => a + r[field], 0);
  const GRAND = DATA.reduce((a, r) => a + r.Sales, 0);

  Sim.register({
    id: "lesson8", unit: "3", num: 8, letter: "H", title: "Tables, Pivot Tables, and Aggregation", simName: "Pivot Builder",
    comps: ["A1.14", "A2.8", "A2.9", "L4"], sessions: "S34–S37", cg: "CG Part 1 · Content 5 · Part 2 · Content 3", deped: "CG Part 1 · Content 5 · Part 2 · Content 3",
    bigQuestion: "How do we turn messy data into a dataset we can trust?",
    mission: [
      "Which item really sells? With Item in Rows and Sales in Values, sort largest first. Is the item sold most often also the one that earns the most? (Put Qty in Values too.)",
      "Show values as % of total, then Running total, then Rank. What does each one tell the manager?",
      "Drag Day into Columns. Then move Day to Filter and use the slicer to keep only Monday and Friday. Watch rows and totals change.",
      "Drop Qty into Rows. What happens, and why? Compare each pivot with the pandas code under it.",
    ],
    discovery: "A pivot table groups records by the field in Rows (and Columns) and aggregates the field in Values with SUM, AVERAGE or COUNT – in seconds. “Show values as” turns the same totals into percentages of the grand total, differences, running totals or ranks. A filter or slicer keeps only the subset you care about, and every number is recomputed. In pandas, df.groupby('item')['sales'].sum() or pivot_table gives the same answer, which is a good check.",
    mount(stage) {
      const body = h("div", { class: "stage-body" });
      stage.append(body);
      return builder(body);
    },
    check() {
      const kind = randInt(0, 6);
      if (kind === 0) {
        const it = pick(Object.keys(PRICE));
        return { q: `In the canteen data (sample data), what is SUM of Sales for ${it}? (${it} sells at ₱${PRICE[it]}; total quantity ${totalBy("Item", it, "Qty")}.)`, answer: totalBy("Item", it), tol: 0, unit: "₱", explain: `${totalBy("Item", it, "Qty")} × ${PRICE[it]} = ${totalBy("Item", it)}.` };
      }
      if (kind === 1) {
        const vals = Array.from({ length: 4 }, () => randInt(2, 12) * 50), k = randInt(0, 3), tot = vals.reduce((a, b) => a + b, 0);
        return { q: `A pivot table shows Sales of ₱${vals.join(", ₱")} for four items. Show values as % of grand total: what percent is item ${k + 1}?`, answer: (vals[k] / tot) * 100, tol: 0.05, unit: "%", explain: `${vals[k]} ÷ ${tot} × 100 = ${fmt((vals[k] / tot) * 100, 1)}%.` };
      }
      if (kind === 2) {
        const vals = Array.from({ length: 5 }, () => randInt(4, 20) * 10), k = randInt(1, 4);
        const run = vals.slice(0, k + 1).reduce((a, b) => a + b, 0);
        return { q: `Daily sales Mon–Fri are ₱${vals.join(", ₱")}. In a running total, what value appears for ${DAYS[k]}?`, answer: run, tol: 0, unit: "₱", explain: `Add Monday to ${DAYS[k]}: ${vals.slice(0, k + 1).join(" + ")} = ${run}.` };
      }
      if (kind === 3) {
        const vals = shuffle([120, 340, 90, 260, 410]).slice(0, 5), k = randInt(0, 4);
        const rank = 1 + vals.filter((x) => x > vals[k]).length;
        return { q: `Five cashiers’ sales: ₱${vals.join(", ₱")}. Ranked largest = 1, what rank does ₱${vals[k]} get?`, answer: rank, tol: 0, explain: `${rank - 1} value(s) are larger, so the rank is ${rank}.` };
      }
      if (kind === 4) return pick([
        { q: "Which pandas line gives total sales for each item?", choices: ["df.groupby('item')['sales'].sum()", "df['sales'].sum()", "df.sort_values('item')", "df.groupby('sales')['item'].count()"], answer: "df.groupby('item')['sales'].sum()", explain: "Group by the category column, pick the number column, aggregate with sum()." },
        { q: "Which pandas line turns the item totals t into percentages of the grand total?", choices: ["t / t.sum() * 100", "t.cumsum()", "t.rank()", "t.diff()"], answer: "t / t.sum() * 100", explain: "Divide each total by the grand total and multiply by 100." },
        { q: "Which pandas method gives a running total?", choices: ["cumsum()", "sum()", "rank()", "diff()"], answer: "cumsum()", explain: "cumsum() adds the values cumulatively, row by row." },
      ]);
      if (kind === 5) return pick([
        { q: "You want total Sales for each Day. Where do Day and Sales go in the pivot table?", choices: ["Day in Rows, Sales in Values", "Sales in Rows, Day in Values", "Both in Filter", "Day in Values, Sales in Columns"], answer: "Day in Rows, Sales in Values", explain: "Group by the category (Rows); aggregate the number (Values)." },
        { q: "What does a slicer or filter on Cashier = Bea do to the pivot table?", choices: ["Recomputes every value using only Bea’s records", "Deletes the other cashiers’ data", "Sorts by cashier", "Adds a Bea column"], answer: "Recomputes every value using only Bea’s records", explain: "Filters hide records from the summary; the source data is unchanged." },
        { q: "Item is a text field. If you put Item in Values, what does the pivot table compute?", choices: ["COUNTA – how many records", "SUM of the item names", "The average item", "An error"], answer: "COUNTA – how many records", explain: "Text cannot be added, so the pivot counts the records." },
      ]);
      const it = pick(["Siomai", "Iced Tea", "Pancit Canton"]);
      return { q: `The canteen’s total sales for the week are ₱${GRAND}. ${it} earned ₱${totalBy("Item", it)}. What percent of the grand total is that?`, answer: (totalBy("Item", it) / GRAND) * 100, tol: 0.05, unit: "%", explain: `${totalBy("Item", it)} ÷ ${GRAND} × 100 = ${fmt((totalBy("Item", it) / GRAND) * 100, 1)}%.` };
    },
  });
})();
