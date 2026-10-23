/* Unit 3 · Lesson 6 · F. Cleaning and Converting Data – Data Cleaner */
(function () {
  "use strict";
  const { h, s, clear, randInt, pick, shuffle, fmt, peso, tabs, segmented, stat, pill, Spring, clamp } = Sim;

  // ------------------------------------------------------------ styles (prefixed, injected once)

  if (!document.getElementById("da-l6-style")) {
    document.head.append(h("style", { id: "da-l6-style" }, `
.dc-sheet { position: relative; font-size: .86rem; }
.dc-row { display: grid; align-items: stretch; height: 32px; border-bottom: 1px solid var(--line); background: var(--paper); }
.dc-body { position: relative; overflow: hidden; }
.dc-body .dc-row { position: absolute; left: 0; right: 0; top: 0; will-change: transform; }
.dc-head { background: var(--bg); font-weight: 700; color: var(--muted); font-size: .76rem; letter-spacing: .04em; border-bottom: 2px solid var(--line); }
.dc-cell { padding: 0 8px; white-space: pre; overflow: hidden; text-overflow: ellipsis; display: flex; align-items: center; border-right: 1px solid var(--grid); font-family: var(--mono); transition: background .35s ease, box-shadow .35s ease; }
.dc-head .dc-cell { font-family: var(--body); }
.dc-cell.r { justify-content: flex-end; }
.dc-rn { justify-content: center; color: var(--muted); background: var(--bg); font-size: .76rem; }
.dc-sp { color: var(--shape-b); font-weight: 700; }
.dc-blank { background: repeating-linear-gradient(135deg, transparent 0 6px, var(--grid) 6px 8px); }
.dc-click .dc-body .dc-cell:not(.dc-rn) { cursor: pointer; }
.dc-click .dc-body .dc-cell:not(.dc-rn):hover { box-shadow: inset 0 0 0 2px var(--line); }
.dc-cell.flag { background: var(--gold-soft); box-shadow: inset 0 0 0 2px var(--gold); }
.dc-cell.mark { background: color-mix(in srgb, var(--shape-b) 20%, transparent); box-shadow: inset 0 0 0 2px var(--shape-b); }
.dc-ops { display: flex; flex-wrap: wrap; gap: 6px; }
.dc-ops button { border: 1px solid var(--line); background: var(--bg); border-radius: 8px; padding: 6px 10px; cursor: pointer; font-size: .88rem; }
.dc-ops button[aria-pressed="true"] { background: var(--accent-soft); border-color: var(--accent); color: var(--accent); }
.dc-ops button:disabled { opacity: .55; cursor: default; }
.dc-code { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 8px; }
.dc-code > div { border: 1px solid var(--line); border-left: 4px solid var(--shape-a); border-radius: 8px; padding: 6px 10px; background: var(--bg); min-width: 0; }
.dc-code b { display: block; font-size: .72rem; letter-spacing: .08em; text-transform: uppercase; color: var(--shape-a); }
.dc-code code { font-family: var(--mono); font-size: .86rem; white-space: pre-wrap; overflow-wrap: anywhere; }
.dc-log { margin: 0; padding-left: 1.4em; display: grid; gap: 4px; font-size: .9rem; }
.dc-log li { line-height: 1.35; }
.dc-bars { position: relative; }
.dc-bar { position: absolute; left: 0; right: 0; top: 0; height: 30px; display: grid; grid-template-columns: 130px minmax(0, 1fr) 76px; gap: 8px; align-items: center; font-size: .86rem; }
.dc-bar .lab { font-family: var(--mono); white-space: pre; overflow: hidden; text-overflow: ellipsis; text-align: right; }
.dc-bar .trk { height: 18px; position: relative; }
.dc-bar .fil { position: absolute; left: 0; top: 0; bottom: 0; border-radius: 4px; background: var(--shape-a-soft); border: 2px solid var(--shape-a); }
.dc-bar .val { font-family: var(--mono); text-align: right; }
.dc-big { display: flex; gap: 10px; flex-wrap: wrap; }
.dc-big > div { flex: 1 1 140px; border: 1px solid var(--line); border-radius: 8px; padding: 8px 12px; background: var(--bg); }
.dc-big span { display: block; font-size: .78rem; color: var(--muted); }
.dc-big b { font-family: var(--mono); font-size: 1.3rem; font-weight: 500; }
@media (max-width: 520px) { .dc-bar { grid-template-columns: 96px minmax(0, 1fr) 64px; } }
`));
  }

  // ------------------------------------------------------------ the dirty dozen (sample data)

  // Columns: Date (A), Item (B), Qty (C), Price (D), Cashier (E). Sheet rows 2 to 13.
  const RAW = [
    ["2026-08-03", "Siomai", 3, 45, "Bea"],
    ["2026-08-03", " siomai ", 2, 45, "Bea"],
    ["08/03/2026", "SIOMAI", 4, 45, "Carlo"],
    ["2026-08-03", "Turon", 5, 20, "Carlo"],
    ["2026-08-03", "Turon", 5, 20, "Carlo"],
    ["2026-08-04", "Banana Cue", "", 25, "Bea"],
    ["2026-08-04", "Banana Cue", 6, "₱25", "Dana"],
    ["Aug 4, 2026", "Pancit Canton", 2, 50, ""],
    ["2026-08-05", "turon", 3, "₱20", "Dana"],
    ["", "Siomai", 2, 45, "Bea"],
    ["2026-08-04", "Banana Cue ", 6, 25, "Dana"],
    ["2026-08-05", "Pancit Canton", 4, 50, "Carlo"],
  ];
  const COLS = ["", "A · Date", "B · Item", "C · Qty", "D · Price", "E · Cashier"];
  const WIDTHS = [40, 118, 140, 64, 76, 92];
  // The twelve problems: [data row index, column index (0–4), or -1 for the whole row, reason]
  const ISSUES = [
    [1, 1, "Extra spaces and small letters: “ siomai ”."],
    [2, 0, "Different date format (MM/DD/YYYY)."],
    [2, 1, "All capitals: “SIOMAI”."],
    [4, -1, "Exact duplicate of row 5."],
    [5, 2, "Missing quantity (blank cell)."],
    [6, 3, "Price stored as text: “₱25”."],
    [7, 0, "Date written in words: “Aug 4, 2026”."],
    [7, 4, "Missing cashier (blank cell)."],
    [8, 1, "Small letters: “turon”."],
    [8, 3, "Price stored as text: “₱20”."],
    [9, 0, "Missing date (blank cell)."],
    [10, 1, "Trailing space: “Banana Cue ” – a hidden duplicate of row 8."],
  ];

  const MONTHS = { Jan: 1, Feb: 2, Mar: 3, Apr: 4, May: 5, Jun: 6, Jul: 7, Aug: 8, Sep: 9, Oct: 10, Nov: 11, Dec: 12 };
  const pad = (n) => String(n).padStart(2, "0");
  function toDate(v) {
    if (typeof v === "object" && v) return v;
    const t = String(v).trim();
    let m;
    if ((m = t.match(/^(\d{4})-(\d{2})-(\d{2})$/))) return { d: t };
    if ((m = t.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/))) return { d: `${m[3]}-${pad(m[1])}-${pad(m[2])}` };
    if ((m = t.match(/^([A-Za-z]{3})\w* (\d{1,2}), (\d{4})$/))) return { d: `${m[3]}-${pad(MONTHS[m[1]])}-${pad(m[2])}` };
    return v;
  }
  const isBlank = (v) => v === "" || v === null || v === undefined;
  const isNum = (v) => typeof v === "number";
  const proper = (t) => t.toLowerCase().replace(/(^|[^a-z])([a-z])/g, (_, a, b) => a + b.toUpperCase());

  /** Cleaning operations. apply(rows) returns { rows, changed: [[id, col]...], removed: [[id, intoId|null]...] }. */
  const OPS = [
    { key: "trim", label: "TRIM spaces", sheets: "=TRIM(B2)", py: "df['item'] = df['item'].str.strip()",
      why: "Extra spaces make “Banana Cue ” and “Banana Cue” look like two different items.",
      apply(rows) { const changed = []; rows.forEach((r) => [1, 4].forEach((c) => { if (typeof r.v[c] === "string" && r.v[c] !== r.v[c].trim()) { r.v[c] = r.v[c].trim().replace(/\s+/g, " "); changed.push([r.id, c]); } })); return { changed }; } },
    { key: "proper", label: "PROPER case", sheets: "=PROPER(TRIM(B2))", py: "df['item'] = df['item'].str.strip().str.title()",
      why: "SIOMAI, siomai and Siomai are the same item; one spelling lets us group them.",
      apply(rows) { const changed = []; rows.forEach((r) => { const t = r.v[1]; if (typeof t === "string" && t && proper(t) !== t) { r.v[1] = proper(t); changed.push([r.id, 1]); } }); return { changed }; } },
    { key: "value", label: "Prices to numbers", sheets: "=VALUE(SUBSTITUTE(D2,\"₱\",\"\"))", py: "df['price'] = pd.to_numeric(df['price'].str.replace('₱', ''))",
      why: "“₱25” is text, so SUM and SUMPRODUCT skip it. A number can be added and multiplied.",
      apply(rows) { const changed = []; rows.forEach((r) => { const t = r.v[3]; if (typeof t === "string" && t) { r.v[3] = Number(t.replace(/[₱,\s]/g, "")); changed.push([r.id, 3]); } }); return { changed }; } },
    { key: "date", label: "One date format", sheets: "=DATEVALUE(A2)  then Format ▸ yyyy-mm-dd", py: "df['date'] = pd.to_datetime(df['date'], format='mixed')",
      why: "Three date styles cannot be sorted or grouped by day. Real dates in one format can.",
      apply(rows) { const changed = []; rows.forEach((r) => { if (!isBlank(r.v[0]) && typeof r.v[0] === "string") { const before = r.v[0]; r.v[0] = toDate(r.v[0]); if (before !== r.v[0].d) changed.push([r.id, 0]); } }); return { changed }; } },
    { key: "dups", label: "Remove duplicates", sheets: "Data ▸ Data cleanup ▸ Remove duplicates", py: "df = df.drop_duplicates()",
      why: "A sale recorded twice adds money that was never received.",
      apply(rows) { const seen = new Map(), removed = []; const keep = rows.filter((r) => { const k = JSON.stringify(r.v); if (seen.has(k)) { removed.push([r.id, seen.get(k)]); return false; } seen.set(k, r.id); return true; }); return { rows: keep, removed }; } },
    { key: "fill", label: "Fill blank cashier", sheets: "=IF(E2=\"\", \"Unknown\", E2)", py: "df['cashier'] = df['cashier'].fillna('Unknown')",
      why: "The sale is real; only the cashier is unknown, so keep the row and label the gap.",
      apply(rows) { const changed = []; rows.forEach((r) => { if (isBlank(r.v[4])) { r.v[4] = "Unknown"; changed.push([r.id, 4]); } }); return { changed }; } },
    { key: "drop", label: "Drop incomplete rows", sheets: "=FILTER(A2:E13, A2:A13<>\"\", C2:C13<>\"\")", py: "df = df.dropna(subset=['date', 'qty'])",
      why: "Without a quantity we cannot compute the sale; without a date we cannot count it in a day. Log the rows you drop.",
      apply(rows) { const removed = []; const keep = rows.filter((r) => { const bad = isBlank(r.v[0]) || isBlank(r.v[2]); if (bad) removed.push([r.id, null]); return !bad; }); return { rows: keep, removed }; } },
  ];
  const FULL = ["trim", "proper", "value", "date", "dups", "fill", "drop"];

  function freshRows() { return RAW.map((v, i) => ({ id: i, v: v.slice() })); }
  function run(seq) {
    let rows = freshRows();
    const log = [];
    for (const key of seq) {
      const op = OPS.find((o) => o.key === key), res = op.apply(rows);
      if (res.rows) rows = res.rows;
      log.push({ op, changed: res.changed || [], removed: res.removed || [] });
    }
    return { rows, log };
  }
  const sales = (r) => (isNum(r.v[2]) && isNum(r.v[3]) ? r.v[2] * r.v[3] : 0);
  function summary(rows) {
    const groups = new Map();
    rows.forEach((r) => { const k = typeof r.v[1] === "string" ? r.v[1] : String(r.v[1]); groups.set(k, (groups.get(k) || 0) + sales(r)); });
    const blanks = rows.reduce((a, r) => a + r.v.filter(isBlank).length, 0);
    return { n: rows.length, total: rows.reduce((a, r) => a + sales(r), 0), groups, blanks };
  }

  // ------------------------------------------------------------ cell display

  function cellNode(v, c, extra = "") {
    if (isBlank(v)) return h("div", { class: "dc-cell dc-blank " + extra });
    if (isNum(v)) return h("div", { class: "dc-cell r " + extra }, fmt(v, 2));
    if (typeof v === "object") return h("div", { class: "dc-cell r " + extra }, v.d);
    const m = String(v).match(/^(\s*)(.*?)(\s*)$/);
    return h("div", { class: "dc-cell " + extra, title: c === 1 ? `“${v}”` : null },
      m[1] ? h("span", { class: "dc-sp" }, "·".repeat(m[1].length)) : null, m[2], m[3] ? h("span", { class: "dc-sp" }, "·".repeat(m[3].length)) : null);
  }
  const showText = (v) => (isBlank(v) ? "(blank)" : isNum(v) ? fmt(v, 2) : typeof v === "object" ? v.d : `“${v}”`);

  // ------------------------------------------------------------ animated sheet

  /** A sheet whose rows are persistent nodes; their position, opacity, slide and highlight follow springs. */
  function makeSheet({ cols, widths, rowH = 32, onCell }) {
    const tmpl = widths.map((w) => w + "px").join(" ");
    const head = h("div", { class: "dc-row dc-head", style: `grid-template-columns:${tmpl}` }, cols.map((c, i) => h("div", { class: "dc-cell" + (i === 0 ? " dc-rn" : "") }, c)));
    const body = h("div", { class: "dc-body", style: "height:0px" });
    const sheet = h("div", { class: "dc-sheet" + (onCell ? " dc-click" : ""), style: `min-width:${widths.reduce((a, b) => a + b, 0)}px` }, head, body);
    const wrap = h("div", { class: "table-wrap" }, sheet);
    const rows = new Map(), timers = [];
    const hs = new Spring(0, (v) => { body.style.height = Math.max(0, v) + "px"; }, { stiffness: 170, damping: 20 });
    function paint(r, [y, op, x, fl]) {
      r.el.style.transform = `translate(${x}px, ${y}px)`;
      r.el.style.opacity = String(clamp(op, 0, 1));
      const f = clamp(fl, 0, 1);
      r.flash.forEach((c) => { const cell = r.cells[c + 1]; if (cell) cell.style.background = f > 0.01 ? `color-mix(in srgb, var(--gold) ${Math.round(f * 55)}%, transparent)` : ""; });
    }
    function row(key) {
      if (rows.has(key)) return rows.get(key);
      const el = h("div", { class: "dc-row", style: `grid-template-columns:${tmpl}` });
      const r = { key, el, cells: [], flash: [] };
      r.spring = new Spring([0, 0, -24, 0], (v) => paint(r, v), { stiffness: 190, damping: 18 });
      body.append(el); rows.set(key, r);
      return r;
    }
    /** list: [{ key, label, values, gone, into, flash: [cols], cls: [per-column class] }] */
    function set(list, { stagger = 0 } = {}) {
      let k = 0;
      const pos = new Map();
      list.forEach((it) => { if (!it.gone) pos.set(it.key, k++); });
      list.forEach((it, i) => {
        const r = row(it.key), fresh = !r.cells.length;
        clear(r.el);
        r.cells = [h("div", { class: "dc-cell dc-rn" }, it.label), ...it.values.map((v, c) => cellNode(v, c, (it.cls && it.cls[c]) || ""))];
        r.el.append(...r.cells);
        if (onCell) r.cells.forEach((cell, c) => { if (c > 0) cell.addEventListener("click", () => onCell(it.key, c - 1, cell)); });
        r.el.style.pointerEvents = it.gone ? "none" : "";
        const y = it.gone ? (it.into !== undefined && it.into !== null && pos.has(it.into) ? pos.get(it.into) * rowH : (r.spring.target[0] || 0)) : pos.get(it.key) * rowH;
        if (fresh) r.spring.jump([y, 0, -24, 0]);
        r.flash = it.flash || [];
        const target = [y, it.gone ? 0 : 1, it.gone ? (it.into !== undefined && it.into !== null ? 0 : 60) : 0, 0];
        if (r.flash.length) { r.spring.value[3] = 1; }
        const go = () => r.spring.set(target);
        if (stagger && !fresh) timers.push(setTimeout(go, i * stagger)); else go();
      });
      hs.set(k * rowH);
    }
    function stop() { timers.forEach(clearTimeout); rows.forEach((r) => r.spring.stop()); hs.stop(); }
    return { el: wrap, set, rows, stop };
  }

  // ------------------------------------------------------------ tab 1 · spot the problems

  function spot(root) {
    const found = new Set();
    let view = "flags";
    const msg = h("p", { class: "note", "aria-live": "polite" }, "Click a cell that looks wrong. A real problem turns gold.");
    const score = h("div", { class: "readout" });
    const extra = h("div", { class: "stage-body" });
    const sheet = makeSheet({ cols: [...COLS, "F · Dup?"], widths: [...WIDTHS, 80], onCell });
    const issueAt = (row, col) => ISSUES.findIndex(([r, c]) => r === row && (c === col || c === -1));
    function onCell(key, col, cell) {
      if (view !== "flags" || col > 4) return;
      const k = issueAt(key, col);
      if (k >= 0) { found.add(k); msg.textContent = `Row ${key + 2}: ${ISSUES[k][2]}`; }
      else {
        msg.textContent = `Row ${key + 2}, ${COLS[col + 1].slice(4)}: ${showText(RAW[key][col])} looks fine. Keep looking.`;
        if (cell.animate && !Sim.reducedMotion()) cell.animate([{ transform: "translateX(0)" }, { transform: "translateX(-5px)" }, { transform: "translateX(5px)" }, { transform: "translateX(0)" }], { duration: 260 });
      }
      draw();
    }
    const dupKey = (v) => v.map((x) => String(x).toLowerCase()).join("|"); // COUNTIF ignores letter case
    const dupCount = (i) => RAW.filter((v) => dupKey(v) === dupKey(RAW[i])).length;
    function draw() {
      const list = RAW.map((v, i) => {
        const cls = v.map((x, c) => {
          if (view === "flags") return found.has(issueAt(i, c)) && issueAt(i, c) >= 0 ? "flag" : "";
          if (view === "blank") return isBlank(x) ? "mark" : "";
          if (view === "dup") return dupCount(i) > 1 ? "mark" : "";
          if (view === "unique") return c === 1 && proper(String(x).trim()) !== x ? "mark" : "";
          return "";
        });
        const dup = view === "dup" ? (dupCount(i) > 1 ? "TRUE" : "FALSE") : "";
        cls.push(view === "dup" && dupCount(i) > 1 ? "mark" : "");
        return { key: i, label: String(i + 2), values: [...v, dup], cls };
      });
      sheet.set(list);
      clear(score);
      score.append(stat("Problems found:", `${found.size} of 12`).el, found.size === 12 ? pill(true, "All twelve found – the Dirty Dozen!", "") : null);
      clear(extra);
      if (view === "blank") {
        extra.append(h("pre", { class: "workings" }, ["A", "B", "C", "D", "E"].map((L, c) => `=COUNTBLANK(${L}2:${L}13)   →  ${RAW.filter((v) => isBlank(v[c])).length}`).join("\n") +
          `\n\nThree blank cells: a date (row 11), a quantity (row 7), and a cashier (row 9).`));
      } else if (view === "dup") {
        extra.append(h("pre", { class: "workings" }, `G2: =A2&B2&C2&D2&E2          (join the row into one key)\nF2: =COUNTIF($G$2:$G$13, G2)>1\n\nTRUE for rows 5 and 6 – an exact duplicate.\nRows 8 and 12 are NOT caught: “Banana Cue ” has a trailing space\nand “₱25” is text. They become duplicates only after cleaning.`));
      } else if (view === "unique") {
        const u = [...new Set(RAW.map((v) => v[1]))];
        extra.append(h("pre", { class: "workings" }, `=UNIQUE(B2:B13)   →  ${u.length} different spellings\n` + u.map((x) => `   “${x}”`).join("\n") + `\n\n…but the canteen sells only 4 items: Siomai, Turon, Banana Cue, Pancit Canton.`));
      } else extra.append(h("p", { class: "note" }, "Tip: text sits on the left of a cell and numbers on the right. Orange dots (·) are hidden spaces."));
    }
    root.append(h("p", {}, "The Dirty Dozen: twelve things went wrong in this canteen sales sheet (sample data). How many can you spot?"),
      h("div", { class: "controls" }, segmented(["flags", "blank", "dup", "unique"], view, (v) => { view = v; msg.textContent = v === "flags" ? "Click a cell that looks wrong. A real problem turns gold." : "A formula view: the sheet finds some problems for you."; draw(); },
        (v) => ({ flags: "My flags", blank: "COUNTBLANK", dup: "COUNTIF(…)>1", unique: "UNIQUE" })[v]),
        h("button", { class: "btn ghost", type: "button", onclick: () => { found.clear(); msg.textContent = "Flags cleared."; draw(); } }, "Clear flags")),
      sheet.el, score, msg, extra);
    draw();
    return () => sheet.stop();
  }

  // ------------------------------------------------------------ tab 2 · clean it

  function cleanIt(root, state) {
    const sheet = makeSheet({ cols: COLS, widths: WIDTHS });
    const opsBox = h("div", { class: "dc-ops" });
    const code = h("div", { class: "dc-code" });
    const log = h("ol", { class: "dc-log" });
    const out = h("div", { class: "readout" });
    function draw(last) {
      const { rows, log: entries } = run(state.seq);
      const alive = new Set(rows.map((r) => r.id));
      const allIds = RAW.map((_, i) => i);
      const removed = new Map();
      entries.forEach((e) => e.removed.forEach(([id, into]) => removed.set(id, into)));
      const flash = new Map();
      if (last) last.changed.forEach(([id, c]) => { if (!flash.has(id)) flash.set(id, []); flash.get(id).push(c); });
      const byId = new Map(rows.map((r) => [r.id, r]));
      const ghost = run([]).rows;
      const list = allIds.map((id) => {
        const r = byId.get(id);
        if (r) return { key: id, label: String(id + 2), values: r.v, flash: flash.get(id) || [] };
        // a removed row keeps showing its last values while it leaves
        let v = ghost[id].v;
        for (let k = 1; k <= state.seq.length; k++) { const st = run(state.seq.slice(0, k)); const rr = st.rows.find((x) => x.id === id); if (rr) v = rr.v; else break; }
        return { key: id, label: String(id + 2), values: v, gone: true, into: removed.get(id) };
      });
      sheet.set(list, { stagger: last ? 35 : 0 });
      clear(opsBox);
      OPS.forEach((op) => {
        const done = state.seq.includes(op.key);
        opsBox.append(h("button", { type: "button", "aria-pressed": done ? "true" : "false", disabled: done, onclick: () => apply(op.key) }, (done ? "✓ " : "") + op.label));
      });
      opsBox.append(h("button", { class: "btn ghost", type: "button", disabled: !state.seq.length, onclick: () => { state.seq.pop(); draw(); } }, "Undo"),
        h("button", { class: "btn ghost", type: "button", disabled: !state.seq.length, onclick: () => { state.seq.length = 0; draw(); } }, "Reset"));
      const shown = last ? last.op : OPS.find((o) => !state.seq.includes(o.key)) || OPS[OPS.length - 1];
      clear(code);
      code.append(h("div", {}, h("b", {}, `Google Sheets · ${shown.label}`), h("code", {}, shown.sheets)), h("div", {}, h("b", {}, "Python (pandas)"), h("code", {}, shown.py)));
      clear(log);
      if (!entries.length) log.append(h("li", { class: "note" }, "The processing log is empty. Every change you make is recorded here."));
      entries.forEach((e) => {
        const what = e.removed.length ? `${e.removed.length} row${e.removed.length === 1 ? "" : "s"} removed (${e.removed.map(([id]) => id + 2).join(", ")})` : `${e.changed.length} cell${e.changed.length === 1 ? "" : "s"} changed`;
        log.append(h("li", {}, h("strong", {}, e.op.label), ` – ${what}. `, h("span", { class: "note" }, e.op.why)));
      });
      const sm = summary(rows);
      clear(out);
      out.append(stat("Rows:", String(sm.n)).el, stat("Blank cells:", String(sm.blanks)).el, stat("Item spellings:", String(sm.groups.size)).el, stat("Total sales:", peso(sm.total)).el);
      if (state.seq.length === OPS.length) out.append(pill(true, "Clean! Compare in Before / After.", ""));
      else if (state.seq.includes("dups") && state.seq.indexOf("dups") < Math.max(state.seq.indexOf("trim"), state.seq.indexOf("value"))) out.append(pill(false, "", "Order matters: rows 8 and 12 were not duplicates yet"));
    }
    function apply(key) {
      state.seq.push(key);
      const { log: entries } = run(state.seq);
      draw(entries[entries.length - 1]);
    }
    root.append(h("p", {}, "Choose a cleaning operation. Watch the cells change, duplicate rows merge into the row they copy, and incomplete rows leave."),
      opsBox, sheet.el, out, code, h("p", { class: "steps-title" }, "Processing log"), log);
    draw();
    return () => sheet.stop();
  }

  // ------------------------------------------------------------ tab 3 · before / after

  function beforeAfter(root, state) {
    let which = "raw";
    const ROWH = 34;
    const big = h("div", { class: "dc-big" });
    const bars = h("div", { class: "dc-bars" });
    const note = h("p", { class: "note" });
    const nodes = new Map(), timers = [];
    let totals = [0, 0, 0];
    const tot = new Spring([0, 0, 0], (v) => { totals = v; paintBig(); }, { stiffness: 120, damping: 16 });
    const hs = new Spring(0, (v) => { bars.style.height = Math.max(0, v) + "px"; });
    const bigEls = [0, 1, 2].map(() => h("b"));
    big.append(h("div", {}, h("span", {}, "Total sales (SUMPRODUCT of Qty × Price)"), bigEls[0]), h("div", {}, h("span", {}, "Rows"), bigEls[1]), h("div", {}, h("span", {}, "Item names (groups)"), bigEls[2]));
    function paintBig() { bigEls[0].textContent = peso(Math.max(0, totals[0])); bigEls[1].textContent = fmt(Math.max(0, totals[1]), 0); bigEls[2].textContent = fmt(Math.max(0, totals[2]), 0); }
    const states = () => ({ raw: run([]).rows, mine: run(state.seq).rows, full: run(FULL).rows });
    function barNode(label) {
      if (nodes.has(label)) return nodes.get(label);
      const fil = h("div", { class: "fil" }), val = h("span", { class: "val" });
      const lab = h("span", { class: "lab", title: `“${label}”` }, label.replace(/^ +| +$/g, (m) => "·".repeat(m.length)));
      const el = h("div", { class: "dc-bar" }, lab, h("div", { class: "trk" }, fil), val);
      const n = { el, fil, val, max: 1 };
      n.spring = new Spring([0, 0, 0], ([y, w, op]) => { el.style.transform = `translateY(${y}px)`; el.style.opacity = String(clamp(op, 0, 1)); fil.style.width = `${clamp(w, 0, 1.05) * 100}%`; fil.style.display = w > 0.004 ? "" : "none"; }, { stiffness: 170, damping: 17 });
      bars.append(el); nodes.set(label, n);
      return n;
    }
    function draw() {
      const st = states(), sm = summary(st[which]);
      const labels = [...sm.groups.keys()].sort((a, b) => sm.groups.get(b) - sm.groups.get(a) || a.localeCompare(b));
      const max = Math.max(...[...summary(st.raw).groups.values(), ...summary(st.full).groups.values(), ...summary(st.mine).groups.values()], 1);
      const all = new Set([...nodes.keys(), ...labels]);
      [...all].forEach((lab) => {
        const n = barNode(lab), i = labels.indexOf(lab), fresh = n.spring.value[2] === 0 && n.spring.target[2] === 0;
        if (i >= 0) {
          if (fresh) n.spring.jump([i * ROWH, 0, 0]);
          n.val.textContent = peso(sm.groups.get(lab));
          timers.push(setTimeout(() => n.spring.set([i * ROWH, sm.groups.get(lab) / max, 1]), i * 40));
        } else n.spring.set([n.spring.target[0], 0, 0]);
      });
      hs.set(labels.length * ROWH);
      tot.set([sm.total, sm.n, sm.groups.size]);
      const raw = summary(st.raw), full = summary(st.full);
      note.textContent = which === "raw"
        ? `Raw: ${raw.groups.size} “items”, because spaces and capitals split Siomai and Turon. Text prices (₱25, ₱20) count as 0, the blank quantity counts as 0, and the duplicate rows are counted twice.`
        : which === "full"
          ? `Fully cleaned: 4 items and ${full.n} rows. The total changed by ${peso(Math.abs(raw.total - full.total))} (${peso(raw.total)} → ${peso(full.total)}). Dirty data gave a wrong answer.`
          : state.seq.length ? `Your sheet after ${state.seq.length} operation${state.seq.length === 1 ? "" : "s"}: ${state.seq.map((k) => OPS.find((o) => o.key === k).label).join(" → ")}.` : "You have not cleaned anything yet – go to Clean It, or compare Raw with Fully cleaned.";
    }
    root.append(h("p", {}, "Does cleaning change the answer? Compare the canteen’s total sales and sales per item before and after cleaning."),
      h("div", { class: "controls" }, segmented(["raw", "mine", "full"], which, (v) => { which = v; draw(); }, (v) => ({ raw: "Raw (dirty)", mine: "Your Clean It sheet", full: "Fully cleaned" })[v])),
      big, h("p", { class: "steps-title" }, "Sales per item name  ·  df.groupby('item')['sales'].sum()"), bars, note,
      h("pre", { class: "workings" }, "Total:  =SUMPRODUCT(C2:C13, D2:D13)      text and blanks count as 0\nItem:   =SUMIF(B2:B13, \"Siomai\", F2:F13)    F = Qty × Price\npandas: df['sales'] = df['qty'] * df['price']"));
    draw();
    return () => { timers.forEach(clearTimeout); nodes.forEach((n) => n.spring.stop()); tot.stop(); hs.stop(); };
  }

  // ------------------------------------------------------------ register

  Sim.register({
    id: "lesson6", unit: "3", num: 6, title: "Cleaning and Converting Data", simName: "Data Cleaner",
    comps: ["A1.12", "A1.13", "L3", "M5"], sessions: "S22–S27", cg: "CG Part 1 · Content 5 (Data Processing)", deped: "CG Part 1 · Content 5 (Data Processing)",
    bigQuestion: "How do we turn messy data into a dataset we can trust?",
    mission: [
      "Spot the Problems: find all twelve problems in the canteen sheet (the Dirty Dozen). Then switch on COUNTBLANK, COUNTIF(…)>1 and UNIQUE. Which problems does each formula catch?",
      "Clean It: apply the operations one at a time. Read the Sheets formula and the pandas line for each one, and the reason in the processing log.",
      "Try Remove duplicates FIRST, then reset and try it LAST. Why does row 12 disappear only one way?",
      "Before / After: how much did the total sales change after cleaning? Which answer would you give the canteen manager?",
    ],
    discovery: "Messy data hides problems: extra spaces, mixed capitals, duplicates, blanks, numbers stored as text, and mixed date formats. Functions like COUNTBLANK, COUNTIF and UNIQUE find them; TRIM, PROPER, VALUE and DATEVALUE fix them (in pandas: str.strip, str.title, pd.to_numeric, pd.to_datetime, drop_duplicates, dropna). The order of the steps matters, every change goes into a processing log with a reason, and the cleaned total is different from the dirty one – dirty data gives wrong answers.",
    mount(stage) {
      const body = h("div", { class: "stage-body" });
      const state = { seq: [] };
      const views = [spot, cleanIt, beforeAfter];
      let stopper = null;
      const t = tabs(["Spot the Problems", "Clean It", "Before / After"], (i) => { if (stopper) stopper(); clear(body); stopper = views[i](body, state) || null; });
      stage.append(t.el, body);
      stopper = spot(body, state);
      return () => { if (stopper) stopper(); };
    },
    check() {
      const kind = randInt(0, 6);
      if (kind === 0) return pick([
        { q: "Which Google Sheets function removes extra spaces before, after, and between words?", choices: ["TRIM", "PROPER", "VALUE", "CLEAN"], answer: "TRIM", explain: "TRIM(\" siomai \") gives \"siomai\"." },
        { q: "Which function changes \"SIOMAI\" into \"Siomai\"?", choices: ["PROPER", "UPPER", "TRIM", "VALUE"], answer: "PROPER", explain: "PROPER capitalizes the first letter of each word and makes the rest lowercase." },
        { q: "A price cell shows \"₱45\" on the left side of the cell. What is the problem?", choices: ["It is text, not a number", "It is a duplicate", "It is blank", "It is a date"], answer: "It is text, not a number", explain: "Text sits on the left; SUM skips it. Use VALUE(SUBSTITUTE(D2,\"₱\",\"\"))." },
        { q: "Which function turns the text \"Aug 4, 2026\" into a real date?", choices: ["DATEVALUE", "VALUE", "TEXT", "TRIM"], answer: "DATEVALUE", explain: "DATEVALUE converts date text into a date serial number you can format." },
      ]);
      if (kind === 1) return pick([
        { q: "Which pandas line removes repeated rows?", choices: ["df.drop_duplicates()", "df.dropna()", "df.isna()", "df.duplicated"], answer: "df.drop_duplicates()", explain: "drop_duplicates() keeps the first copy of each row." },
        { q: "Which pandas line removes rows that have missing values?", choices: ["df.dropna()", "df.fillna(0)", "df.drop_duplicates()", "df.str.strip()"], answer: "df.dropna()", explain: "dropna() drops rows that have missing (blank) cells." },
        { q: "Which pandas code does the same job as TRIM then PROPER on the item column?", choices: ["df['item'].str.strip().str.title()", "df['item'].dropna()", "pd.to_numeric(df['item'])", "df['item'].str.upper()"], answer: "df['item'].str.strip().str.title()", explain: "str.strip() removes spaces and str.title() capitalizes each word." },
        { q: "Which pandas function converts a column of text like \"45\" into numbers?", choices: ["pd.to_numeric", "pd.to_datetime", "df.dropna", "df.to_csv"], answer: "pd.to_numeric", explain: "pd.to_numeric turns numeric text into numbers." },
      ]);
      if (kind === 2) {
        const n = randInt(8, 14), blanks = randInt(1, 4);
        const cells = shuffle([...Array(n - blanks).fill(0).map(() => String(randInt(1, 9))), ...Array(blanks).fill("(blank)")]);
        return { q: `Column C (C2:C${n + 1}) holds: ${cells.join(", ")}. What does =COUNTBLANK(C2:C${n + 1}) return?`, answer: blanks, tol: 0, explain: `Count the empty cells: ${blanks}.` };
      }
      if (kind === 3) {
        const base = shuffle(["Siomai", "Turon", "Banana Cue", "Lumpia", "Pancit Canton"]).slice(0, randInt(2, 4));
        const variants = (w) => [w, w.toUpperCase(), w.toLowerCase(), ` ${w}`, `${w} `];
        const list = shuffle(base.flatMap((w) => shuffle(variants(w)).slice(0, randInt(1, 3))));
        return { q: `An item column has these entries: ${list.map((x) => `“${x}”`).join(", ")}. After TRIM and PROPER, how many different items are there?`, answer: base.length, tol: 0, explain: `They clean to: ${base.join(", ")} – ${base.length} items.` };
      }
      if (kind === 4) {
        const nums = Array.from({ length: randInt(3, 5) }, () => pick([15, 20, 25, 45, 50]));
        const texts = Array.from({ length: randInt(1, 2) }, () => pick([20, 25, 45]));
        const shown = shuffle([...nums.map(String), ...texts.map((x) => `“₱${x}” (text)`)]);
        const sum = nums.reduce((a, b) => a + b, 0);
        return { q: `A price column holds: ${shown.join(", ")}. What does =SUM of the column return?`, answer: sum, tol: 0, unit: "₱", explain: `SUM skips text, so only ${nums.join(" + ")} = ${sum} is added. The true total is ${sum + texts.reduce((a, b) => a + b, 0)}.` };
      }
      if (kind === 5) {
        const qty = randInt(3, 8), price = pick([20, 25, 45]), copies = randInt(2, 3);
        return { q: `A sale of ${qty} items at ₱${price} each was recorded ${copies} times by mistake. By how many pesos is the total sales overstated?`, answer: qty * price * (copies - 1), tol: 0, unit: "₱", explain: `Only one copy is real: ${copies - 1} extra × ${qty} × ₱${price} = ₱${qty * price * (copies - 1)}.` };
      }
      return pick([
        { q: "Why should a processing log record every cleaning step?", choices: ["So others can check and repeat the cleaning", "To make the file bigger", "Because Sheets requires it", "To hide the raw data"], answer: "So others can check and repeat the cleaning", explain: "A log shows what changed and why, so the work can be verified and reproduced." },
        { q: "Rows 8 and 12 differ only by a trailing space in the item name. When will Remove duplicates catch them?", choices: ["Only after TRIM", "Before TRIM", "Never", "Only after PROPER"], answer: "Only after TRIM", explain: "Duplicates must match exactly, so clean the text first, then remove duplicates." },
        { q: "A sales row has a blank quantity. What is the best choice?", choices: ["Drop the row and record it in the log", "Type a guess", "Leave it and report the total", "Delete the whole column"], answer: "Drop the row and record it in the log", explain: "We cannot compute the sale without a quantity; dropping it is honest if the log records it." },
      ]);
    },
  });
})();
