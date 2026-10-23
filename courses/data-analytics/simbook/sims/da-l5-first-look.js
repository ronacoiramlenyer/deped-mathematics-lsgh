/* Data Analytics · Unit 2 · Lesson 5 · E. Exploring and Securing Data – First Look */
(function () {
  "use strict";
  const { h, s, clear, randInt, pick, shuffle, fmt, clamp, tabs, segmented, stat, pill, Spring, elasticSlider } = Sim;

  // Sample data: three days of LSGH Attendance Watch for two sections (learner IDs are codes).
  const RAW = `2026-10-19,11-A,S01,Present,0,36.5
2026-10-19,11-A,S02,Late,12,36.7
2026-10-19,11-A,S03,Present,0,36.4
2026-10-19,11-A,S04,Absent,,
2026-10-19,11-B,S05,Late,25,36.9
2026-10-19,11-B,S06,Present,0,36.6
2026-10-19,11-B,S07,Late,8,
2026-10-19,11-B,S08,Present,0,36.5
2026-10-20,11-A,S01,Present,0,36.6
2026-10-20,11-A,S02,Present,0,36.5
2026-10-20,11-A,S03,late,5,36.8
2026-10-20,11-A,S04,Present,0,36.4
2026-10-20,11-B,S05,Late,15,36.7
2026-10-20,11-B,S06,Absent,,
2026-10-20,11-B,S07,Present,0,36.5
2026-10-20,11-B,S08,Present,0,37.9
2026-10-21,11-A,S01,Late,3,36.6
2026-10-21,11-A,S02,Present,0,36.5
2026-10-21,11-A,S03,Present,0,36.7
2026-10-21,11-A,S04,Present,0,36.6
2026-10-21,11-B,S05,Late,40,36.8
2026-10-21,11-B,S06,Present,0,36.5
2026-10-21,11-B,S07,Present,0,
2026-10-21,11-B,S08,Absent,,`;
  const COLS = ["date", "section", "student", "status", "minutes_late", "temp_c"];
  const NUMERIC = { minutes_late: true, temp_c: true };
  const DATA = RAW.split("\n").map((line) => {
    const v = line.split(",");
    const r = {};
    COLS.forEach((c, i) => { r[c] = v[i] === "" ? null : NUMERIC[c] ? Number(v[i]) : v[i]; });
    return r;
  });

  function quantile(sorted, q) { const pos = (sorted.length - 1) * q, lo = Math.floor(pos), hi = Math.ceil(pos); return sorted[lo] + (sorted[hi] - sorted[lo]) * (pos - lo); }
  function profile(col, data = DATA) {
    const vals = data.map((r) => r[col]), present = vals.filter((v) => v !== null);
    const counts = {};
    present.forEach((v) => { counts[v] = (counts[v] || 0) + 1; });
    const p = { col, n: vals.length, count: present.length, missing: vals.length - present.length, unique: Object.keys(counts).length, counts, numeric: !!NUMERIC[col] };
    if (p.numeric) {
      const sv = present.slice().sort((a, b) => a - b), mean = sv.reduce((a, b) => a + b, 0) / sv.length;
      Object.assign(p, { min: sv[0], max: sv[sv.length - 1], mean, std: Math.sqrt(sv.reduce((a, b) => a + (b - mean) ** 2, 0) / (sv.length - 1)), q1: quantile(sv, 0.25), med: quantile(sv, 0.5), q3: quantile(sv, 0.75), sorted: sv });
    } else {
      const ks = Object.keys(counts).sort();
      Object.assign(p, { min: ks[0], max: ks[ks.length - 1] });
    }
    return p;
  }
  /** Six bars: numeric → six equal-width bins; text → the six most common values. */
  function bars(p, short = false) {
    if (p.numeric) {
      const lo = p.min, w = (p.max - p.min) / 6 || 1;
      const cnt = [0, 0, 0, 0, 0, 0];
      p.sorted.forEach((v) => { cnt[Math.min(5, Math.floor((v - lo) / w + 1e-9))]++; });
      const d = p.col === "temp_c" ? 2 : 0;
      return { labels: cnt.map((_, i) => (short ? `${fmt(lo + i * w, d)}+` : `${fmt(lo + i * w, d)}–${fmt(lo + (i + 1) * w, d)}`)), values: cnt };
    }
    const top = Object.entries(p.counts).sort((a, b) => b[1] - a[1] || (a[0] < b[0] ? -1 : 1)).slice(0, 6);
    while (top.length < 6) top.push(["", 0]);
    return { labels: top.map((t) => t[0]), values: top.map((t) => t[1]) };
  }
  const NOTES = {
    date: "3 different dates (Mon to Wed). Each learner should appear once per day – a check for duplicates.",
    section: "2 sections with 12 rows each. Is the dataset balanced? Yes.",
    student: "8 learners, each appearing 3 times – once per day. IDs are codes, not names.",
    status: "4 unique values, but there should be only 3: “late” (small l) must be cleaned to “Late” before counting.",
    minutes_late: "3 values are missing – the absent learners. The longest delay is 40 minutes; most values are 0.",
    temp_c: "5 values are missing: 3 absences and 2 readings that were skipped. 37.9 °C stands out – check it before analyzing.",
  };
  const pad = (t, n) => String(t).padEnd(n);
  const lpad = (t, n) => String(t).padStart(n);
  function infoText(sel) {
    const lines = ["RangeIndex: 24 entries, 0 to 23", "Data columns (total 6 columns):", " #  Column        Non-Null  Dtype"];
    COLS.forEach((c, i) => { const p = profile(c); lines.push(`${sel === c ? "▶" : " "}${i}  ${pad(c, 13)} ${lpad(p.count, 2)} non-null ${p.numeric ? "float64" : "object"}`); });
    return lines.join("\n");
  }
  function detailText(p) {
    if (p.numeric) {
      const d = p.col === "temp_c" ? 2 : 6;
      return [`df['${p.col}'].describe()`, `count    ${fmt(p.count, 0)}`, `mean     ${p.mean.toFixed(d === 2 ? 3 : 3)}`, `std      ${p.std.toFixed(3)}`, `min      ${p.min.toFixed(1)}`,
        `25%      ${p.q1.toFixed(2)}`, `50%      ${p.med.toFixed(2)}`, `75%      ${p.q3.toFixed(2)}`, `max      ${p.max.toFixed(1)}`].join("\n");
    }
    const vc = Object.entries(p.counts).sort((a, b) => b[1] - a[1] || (a[0] < b[0] ? -1 : 1));
    return [`df['${p.col}'].value_counts()`, ...vc.slice(0, 8).map(([k, v]) => `${pad(k, 12)} ${lpad(v, 2)}`), vc.length > 8 ? `… (${vc.length} values)` : ""].filter(Boolean).join("\n");
  }

  function explore(root) {
    const narrow = root.clientWidth < 540, W = narrow ? 360 : 600, H = 190;
    let sel = "status";
    const heads = {};
    const thead = h("tr", {}, h("th", {}, ""), COLS.map((c) => { const b = h("button", { type: "button", class: "btn ghost", style: "padding:3px 8px;font-size:.78rem", onclick: () => select(c) }, c); heads[c] = b; return h("th", {}, b); }));
    const tbody = h("tbody", {}, DATA.map((r, i) => h("tr", {}, h("td", { class: "num", style: "color:var(--muted)" }, String(i)),
      COLS.map((c) => h("td", { class: NUMERIC[c] ? "num" : "", "data-col": c, style: r[c] === null ? "background:color-mix(in srgb, var(--bad) 14%, transparent)" : "" }, r[c] === null ? "NaN" : String(r[c]))))));
    const table = h("div", { class: "table-wrap", style: "max-height:300px;overflow:auto;border:1px solid var(--line);border-radius:8px" }, h("table", { class: "data", style: "white-space:nowrap" }, h("thead", {}, thead), tbody));
    const readout = h("div", { class: "readout" });
    const svg = s("svg", { viewBox: `0 0 ${W} ${H}`, role: "img", "aria-label": "Mini histogram of the selected column" });
    const x0 = 30, y0 = H - 34, ch = H - 60, bw = (W - x0 - 8) / 6;
    const grid = s("g"); svg.append(grid);
    const bs = Array.from({ length: 6 }, (_, i) => {
      const r = s("rect", { x: x0 + i * bw + bw * 0.1, width: bw * 0.8, rx: 3, fill: "var(--shape-a-soft)", stroke: "var(--shape-a)", "stroke-width": 2 });
      const lab = s("text", { x: x0 + i * bw + bw / 2, y: y0 + 16, "text-anchor": "middle", class: "svg-text", "font-size": narrow ? 9.5 : 11 });
      const val = s("text", { x: x0 + i * bw + bw / 2, "text-anchor": "middle", class: "svg-text", "font-size": 12, "font-weight": 700 });
      svg.append(r, lab, val);
      return { r, lab, val };
    });
    const capt = s("text", { x: W - 8, y: 14, "text-anchor": "end", class: "svg-label", "font-size": 12 });
    svg.append(capt);
    let hv = [0, 0, 0, 0, 0, 0, 5];
    const paint = () => {
      const max = Math.max(1, hv[6]);
      clear(grid);
      for (let k = 0; k <= 4; k++) { const y = y0 - (k / 4) * ch; grid.append(s("line", { x1: x0, y1: y, x2: W - 8, y2: y, stroke: "var(--grid)" }), s("text", { x: x0 - 4, y: y + 4, "text-anchor": "end", class: "svg-text", "font-size": 10 }, fmt((max * k) / 4, 0))); }
      grid.append(s("line", { x1: x0, y1: y0, x2: W - 8, y2: y0, stroke: "var(--ink)", "stroke-width": 1.5 }));
      bs.forEach((b, i) => {
        const v = Math.max(0, hv[i]), bh = Math.min(ch + 12, (v / max) * ch);
        b.r.setAttribute("y", y0 - bh); b.r.setAttribute("height", bh);
        b.val.setAttribute("y", y0 - bh - 4); b.val.textContent = Math.round(v) > 0 ? String(Math.round(v)) : "";
      });
    };
    const grow = new Spring(hv, (v) => { hv = v; paint(); }, { stiffness: 170, damping: 12 });
    const info = h("pre", { class: "workings", style: "font-size:.78rem" }), detail = h("pre", { class: "workings", style: "font-size:.78rem" });
    const note = h("p", { class: "bigq" });
    function select(c) {
      sel = c;
      const p = profile(c), b = bars(p, narrow);
      Object.entries(heads).forEach(([k, btn]) => { btn.style.background = k === c ? "var(--accent)" : ""; btn.style.color = k === c ? "var(--accent-ink)" : ""; });
      tbody.querySelectorAll("td[data-col]").forEach((td) => { td.style.outline = td.dataset.col === c ? "2px solid var(--gold)" : ""; td.style.outlineOffset = "-2px"; });
      clear(readout);
      readout.append(stat("Type:", p.numeric ? "number (float64)" : "text (object)").el, stat("Count:", String(p.count)).el, stat("Missing:", String(p.missing)).el,
        stat("Unique:", String(p.unique)).el, stat("Min:", p.numeric ? fmt(p.min, 2) : p.min).el, stat("Max:", p.numeric ? fmt(p.max, 2) : p.max).el);
      if (p.numeric) readout.append(stat("Mean:", fmt(p.mean, 2)).el);
      bs.forEach((bb, i) => {
        bb.lab.textContent = b.labels[i];
        const isOdd = c === "status" && b.labels[i] === "late";
        bb.r.setAttribute("fill", isOdd ? "var(--gold-soft)" : "var(--shape-a-soft)"); bb.r.setAttribute("stroke", isOdd ? "var(--gold)" : "var(--shape-a)");
      });
      capt.textContent = p.numeric ? `${c}: values in 6 equal ranges${narrow ? " (bin starts)" : ""}` : `${c}: count of each value`;
      grow.set([...b.values, Math.max(4, Math.ceil(Math.max(...b.values) / 4) * 4)]);
      info.textContent = infoText(c); detail.textContent = detailText(p);
      note.textContent = NOTES[c];
    }
    root.append(h("p", {}, "A dataset arrived with no description. Click a column name to profile it."),
      h("div", { class: "readout" }, stat("df.shape:", "(24, 6)").el, stat("Rows:", "24").el, stat("Columns:", "6").el),
      table, readout, svg, note,
      h("div", { style: "display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:10px" },
        h("div", { style: "min-width:0" }, h("p", { class: "note" }, "pandas: df.info()"), info), h("div", { style: "min-width:0" }, h("p", { class: "note" }, "pandas: the selected column"), detail)),
      h("p", { class: "note" }, "Sample data. NaN (“not a number”) is how pandas shows a missing value. Columns with missing numbers become float64."));
    paint(); select(sel);
    return () => grow.stop();
  }

  // ------------------------------------------------------------ version history

  const START = [["11-A", 36, 3, 1], ["11-B", 34, 5, 1], ["11-C", 38, 1, 0], ["12-A", 35, 2, 2], ["12-B", 33, 6, 1], ["12-C", 37, 2, 1]]
    .map(([section, present, late, absent], i) => ({ id: i, section, present, late, absent }));
  const FIELDS = ["present", "late", "absent"];

  function versions(root) {
    const RH = 34;
    let history = true, vers = [], view = 0, lost = 0, slider = null;
    const date = "2026-10-21";
    const fname = (i) => `attendance_${date}_v${i + 1}.csv`;
    const push = (rows, note) => {
      if (history) vers.push({ rows: rows.map((r) => ({ ...r })), note });
      else { if (vers.length) lost++; vers = [{ rows: rows.map((r) => ({ ...r })), note }]; }
      view = vers.length - 1;
      rebuildSlider(); render();
    };
    const head = h("div", { style: `display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:6px;padding:0 10px;height:${RH - 6}px;align-items:center;font-size:.75rem;letter-spacing:.05em;text-transform:uppercase;color:var(--muted);border-bottom:2px solid var(--line)` },
      ["Section", "Present", "Late", "Absent"].map((t) => h("span", {}, t)));
    const body = h("div", { style: `position:relative;height:${START.length * RH}px;transition:height .35s ease` });
    const els = START.map((r) => {
      const cells = [0, 1, 2, 3].map((j) => h("span", { class: j ? "num" : "", style: "padding:2px 4px;border-radius:4px" }));
      const el = h("div", { style: `position:absolute;left:0;right:0;top:0;height:${RH - 4}px;display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:6px;padding:0 10px;align-items:center;border-radius:6px;background:var(--bg);will-change:transform,opacity` }, cells);
      body.append(el);
      const o = { el, cells, y: r.id * RH, a: 1 };
      o.sp = new Spring([o.y, 1], ([y, a]) => { el.style.transform = `translateY(${y}px) scaleY(${0.6 + 0.4 * clamp(a, 0, 1)})`; el.style.opacity = String(clamp(a, 0, 1)); }, { stiffness: 170, damping: 15 });
      o.sp.jump([o.y, 1]);
      return o;
    });
    const sheetBox = h("div", { style: "border:1px solid var(--line);border-radius:8px;padding:6px;background:var(--paper)" },
      h("div", { style: "background:var(--accent);color:var(--accent-ink);padding:4px 8px;font-size:.85rem;font-weight:700;border-radius:6px;margin-bottom:4px" }, "Attendance summary – Wednesday"), head, body);
    const status = h("div", { "aria-live": "polite" });
    const sliderBox = h("div", { class: "controls" });
    const list = h("div", { style: "display:grid;gap:4px" });
    const restoreBtn = h("button", { class: "btn", type: "button", onclick: () => restore() }, "Restore this version");

    function render() {
      const v = vers[view], prev = view > 0 ? vers[view - 1] : null;
      const present = new Set(v.rows.map((r) => r.id));
      v.rows.forEach((r, idx) => {
        const o = els[r.id];
        o.sp.set([idx * RH, 1]); o.y = idx * RH;
        o.cells[0].textContent = r.section;
        FIELDS.forEach((f, j) => {
          o.cells[j + 1].textContent = String(r[f]);
          const old = prev && prev.rows.find((x) => x.id === r.id);
          o.cells[j + 1].style.background = old && old[f] !== r[f] ? "var(--gold-soft)" : "";
        });
        o.el.style.pointerEvents = "";
      });
      els.forEach((o, id) => { if (!present.has(id)) { o.sp.set([o.y, 0]); o.el.style.pointerEvents = "none"; } });
      body.style.height = `${v.rows.length * RH}px`;
      clear(status);
      const latest = view === vers.length - 1;
      status.append(h("p", { style: "margin:0" }, h("b", {}, history ? fname(view) : "attendance.csv"), ` – ${v.note}`),
        !history ? pill(false, "", lost ? `No backup: ${lost} earlier version${lost === 1 ? " is" : "s are"} gone for good` : "No backup: any change replaces the only copy")
          : latest ? pill(true, "You are viewing the latest version", "") : pill(false, "", `Viewing an older version (v${view + 1} of ${vers.length})`));
      restoreBtn.disabled = !history || latest;
      clear(list);
      if (history) vers.forEach((x, i) => list.append(h("button", { type: "button", class: "btn ghost", style: `text-align:left;font-family:var(--mono);font-size:.8rem;padding:4px 8px;${i === view ? "background:var(--accent-soft)" : ""}`, onclick: () => { if (slider) slider.set(i); preview(i); } }, `${fname(i)}  ·  ${x.note}`)));
      else list.append(h("p", { class: "note" }, "Only one file exists. Nothing to go back to."));
    }
    function preview(i) { const k = clamp(Math.round(i), 0, vers.length - 1); if (k !== view) { view = k; render(); } }
    function rebuildSlider() {
      clear(sliderBox);
      const n = vers.length;
      slider = elasticSlider({ id: "da-l5-time", label: "Timeline", min: 0, max: Math.max(1, n - 1), value: n - 1, snaps: vers.map((_, i) => i), format: (v) => `v${Math.round(clamp(v, 0, n - 1)) + 1}`, onInput: (v) => { if (vers.length === n) preview(v); } });
      sliderBox.append(slider.el, restoreBtn);
      sliderBox.style.opacity = history ? "1" : "0.45";
      sliderBox.style.pointerEvents = history ? "" : "none";
    }
    const cur = () => vers[vers.length - 1].rows.map((r) => ({ ...r }));
    function act(kind) {
      if (view !== vers.length - 1) { view = vers.length - 1; if (slider) slider.jump(view); }
      const rows = cur();
      if (kind === "delete") {
        if (rows.length <= 1) return;
        const i = randInt(0, rows.length - 1), gone = rows.splice(i, 1)[0];
        push(rows, `deleted row ${gone.section}`);
      } else if (kind === "overwrite") {
        const r = pick(rows), f = pick(FIELDS), old = r[f];
        r[f] = pick([0, old * 10 + 1, old + 20]);
        push(rows, `overwrote ${r.section} ${f}: ${old} → ${r[f]}`);
      } else if (kind === "sort") {
        rows.sort((a, b) => b.late - a.late || a.id - b.id);
        push(rows, "sorted by late (largest first)");
      }
    }
    function restore() {
      if (!history || view === vers.length - 1) return;
      const k = view;
      vers.push({ rows: vers[k].rows.map((r) => ({ ...r })), note: `restored from v${k + 1}` });
      view = vers.length - 1;
      rebuildSlider(); render();
    }
    function reset() { vers = []; lost = 0; push(START, "original import"); }
    root.append(h("div", { class: "controls" }, h("span", {}, "Backup mode"), segmented(["on", "off"], "on", (v) => { history = v === "on"; reset(); }, (v) => (v === "on" ? "Version history ON" : "No backup"))),
      h("div", { class: "controls" },
        h("button", { class: "btn ghost", type: "button", onclick: () => act("delete") }, "Delete a row"),
        h("button", { class: "btn ghost", type: "button", onclick: () => act("overwrite") }, "Overwrite a value"),
        h("button", { class: "btn ghost", type: "button", onclick: () => act("sort") }, "Sort by late"),
        h("button", { class: "btn ghost", type: "button", onclick: reset }, "Start over")),
      sheetBox, status, sliderBox, h("p", { class: "note" }, "Drag the timeline: it snaps to each saved version. Changed cells glow gold."), list);
    reset();
    return () => { els.forEach((o) => o.sp.stop()); };
  }

  // ------------------------------------------------------------ lesson

  Sim.register({
    id: "lesson5", unit: "2", num: 5, title: "Exploring and Securing Data", simName: "First Look",
    comps: ["A1.10", "A1.11", "L2", "M4"], sessions: "S14–S18", cg: "CG Part 1 · Content 5 (Data Processing)", deped: "Sessions S14–S18",
    bigQuestion: "Where does good data come from, and how do we keep it safe?",
    mission: [
      "Explore: profile every column. Which columns have missing values, and why might they be missing?",
      "Profile status. Why are there 4 unique values instead of 3?",
      "Profile temp_c. Which value would you check before analyzing, and what can this dataset not tell you?",
      "Version History: delete a row and overwrite a value, then drag the timeline back and restore v1. Now switch to “No backup” and try again.",
    ],
    discovery: "Exploratory data analysis (EDA) comes first: before any chart or formula, check the shape, the columns and their types, missing values, unique values, and ranges. EDA found that status has a stray “late”, that minutes_late and temp_c have missing values (NaN), and that one temperature stands out – and it shows what the data can answer (lateness by section and day) and cannot (why learners are late). In pandas, df.info(), df.describe(), and df['col'].value_counts() do this quickly. With version history, every change can be undone; without a backup, a deleted row is gone for good – so keep backups, name versions clearly, and log changes.",
    mount(stage) {
      const body = h("div", { class: "stage-body" });
      const views = [explore, versions];
      let stopper = null;
      const t = tabs(["Explore", "Version History"], (i) => { if (stopper) stopper(); clear(body); stopper = views[i](body) || null; });
      stage.append(t.el, body);
      stopper = explore(body);
      return () => { if (stopper) stopper(); };
    },
    check() {
      const kind = randInt(0, 4);
      if (kind === 0) {
        const vals = Array.from({ length: 8 }, () => (Math.random() < 0.25 ? null : randInt(0, 30)));
        const miss = vals.filter((v) => v === null).length;
        return { q: `A column minutes_late has the values ${vals.map((v) => (v === null ? "(blank)" : v)).join(", ")}. How many values are missing?`, answer: miss, tol: 0, explain: `Each blank cell is a missing value: ${miss} of them.` };
      }
      if (kind === 1) {
        const pool = shuffle(["Present", "Late", "Absent", "late", "Present ", "LATE"]).slice(0, randInt(3, 5));
        const vals = shuffle([...pool, ...Array.from({ length: 4 }, () => pick(pool))]);
        const u = new Set(vals).size;
        return { q: `How many unique values does a spreadsheet see in: ${vals.map((v) => `“${v}”`).join(", ")}? (Spaces and capital letters count.)`, answer: u, tol: 0, explain: `Different spellings count as different values: ${[...new Set(vals)].map((v) => `“${v}”`).join(", ")}.` };
      }
      if (kind === 2) {
        const c = pick(["minutes_late", "temp_c", "status", "section"]), p = profile(c);
        return { q: `In the sample attendance data (24 rows), df.info() shows ${c} with ${p.count} non-null values. How many values are missing?`, answer: p.missing, tol: 0, explain: `24 − ${p.count} = ${p.missing}.` };
      }
      if (kind === 3) return pick([
        { q: "Which pandas command lists each column with its non-null count and type?", choices: ["df.info()", "df.describe()", "df.head()", "df.value_counts()"], answer: "df.info()", explain: "info() shows columns, non-null counts, and dtypes." },
        { q: "Which pandas command gives the count, mean, min, quartiles, and max of numeric columns?", choices: ["df.describe()", "df.info()", "df.shape", "df.tail()"], answer: "df.describe()", explain: "describe() summarizes numeric columns." },
        { q: "Which command counts how often each value appears in the status column?", choices: ["df['status'].value_counts()", "df['status'].describe()", "df.info()", "df.shape"], answer: "df['status'].value_counts()", explain: "value_counts() counts each distinct value." },
        { q: "Which file name is the best version name?", choices: ["attendance_2026-10-21_v3.csv", "attendance FINAL final.csv", "new.csv", "attendance(3).csv"], answer: "attendance_2026-10-21_v3.csv", explain: "Topic, date as YYYY-MM-DD, and version number – no spaces." },
        { q: "You deleted a row in a Google Sheet by mistake yesterday. What can bring it back?", choices: ["File → Version history", "Sorting the sheet", "Deleting another row", "Changing the file name"], answer: "File → Version history", explain: "Version history keeps earlier versions you can restore." },
      ]);
      const v = randInt(3, 9), back = randInt(1, v - 1);
      return { q: `A sheet has saved versions v1 to v${v}. You restore v${back}. Google Sheets saves the restored copy as a new version. What is its version number?`, answer: v + 1, tol: 0, explain: `Restoring creates a new latest version: v${v + 1} (a copy of v${back}). Nothing is erased.` };
    },
  });
})();
