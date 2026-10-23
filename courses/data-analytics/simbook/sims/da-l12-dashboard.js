/* Unit 5 · Lesson 12 · L. Interactive Dashboards in Looker Studio – Dashboard Builder */
(function () {
  "use strict";
  const { h, s, clear, randInt, pick, shuffle, fmt, round, clamp, tabs, segmented, stat, pill, Spring, rubber } = Sim;

  // ------------------------------------------------------------ sample data (made-up schools, NOT official DepEd figures)

  const RAW = [
    ["NCR", "Quezon City", "QC School A", 1240, 40], ["NCR", "Quezon City", "QC School B", 980, 33],
    ["NCR", "Pasig", "Pasig School A", 860, 29], ["NCR", "Pasig", "Pasig School B", 720, 25],
    ["NCR", "Mandaluyong", "Mandaluyong School A", 690, 24],
    ["CALABARZON", "Antipolo", "Antipolo School A", 1120, 35], ["CALABARZON", "Antipolo", "Antipolo School B", 640, 21],
    ["CALABARZON", "Calamba", "Calamba School A", 930, 30], ["CALABARZON", "Calamba", "Calamba School B", 580, 20],
    ["Central Luzon", "San Fernando", "San Fernando School A", 870, 27],
    ["Central Luzon", "Malolos", "Malolos School A", 760, 24], ["Central Luzon", "Malolos", "Malolos School B", 540, 17],
  ];
  const ROWS = RAW.map(([region, city, school, enr, teach]) => ({ region, city, school, enr, teach }));
  const REGIONS = ["NCR", "CALABARZON", "Central Luzon"];
  const DIMS = { region: "Region", city: "City", school: "School" };
  const METRICS = {
    enr: { label: "Enrollment", agg: "SUM", val: (g) => g.enr, f: (v) => fmt(v, 0) },
    teach: { label: "Teachers", agg: "SUM", val: (g) => g.teach, f: (v) => fmt(v, 0) },
    lpt: { label: "Learners per teacher", agg: "calculated", val: (g) => (g.teach ? g.enr / g.teach : 0), f: (v) => fmt(v, 1) },
  };
  const TREND = [["21–22", 9120], ["22–23", 9340], ["23–24", 9580], ["24–25", 9710], ["25–26", 9930]];
  const sumBy = (rows) => rows.reduce((a, r) => ({ enr: a.enr + r.enr, teach: a.teach + r.teach }), { enr: 0, teach: 0 });

  function group(rows, dim, metric, sort) {
    const map = new Map();
    rows.forEach((r) => { const k = r[dim]; if (!map.has(k)) map.set(k, []); map.get(k).push(r); });
    const out = [...map].map(([k, rs]) => ({ key: k, label: k, value: METRICS[metric].val(sumBy(rs)) }));
    if (sort === "desc") out.sort((a, b) => b.value - a.value);
    else if (sort === "asc") out.sort((a, b) => a.value - b.value);
    else out.sort((a, b) => a.label.localeCompare(b.label));
    return out;
  }
  const niceMax = (m) => { if (m <= 0) return 1; const p = 10 ** Math.floor(Math.log10(m)); for (const k of [1, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10]) if (k * p >= m) return k * p; return 10 * p; };
  const short = (t, n) => (t.length > n ? t.slice(0, n - 1) + "…" : t);

  const CSS = `
  .l12-canvas { position: relative; background-color: var(--bg); background-image: linear-gradient(var(--line) 1px, transparent 1px), linear-gradient(90deg, var(--line) 1px, transparent 1px); border: 1px solid var(--line); border-radius: 8px; transition: height .35s; overflow: hidden; touch-action: pan-y; user-select: none; -webkit-user-select: none; }
  .l12-w { position: absolute; left: 0; top: 0; background: var(--paper); border: 1px solid var(--line); border-radius: 8px; box-shadow: 0 2px 6px rgba(0,0,0,.08); display: grid; grid-template-rows: auto minmax(0,1fr); overflow: hidden; cursor: grab; touch-action: none; user-select: none; }
  .l12-w.sel { outline: 3px solid var(--gold); outline-offset: -1px; }
  .l12-w.drag { cursor: grabbing; box-shadow: 0 10px 24px rgba(0,0,0,.22); z-index: 5; }
  .l12-wh { font-size: .78rem; font-weight: 700; padding: 4px 8px; color: var(--muted); border-bottom: 1px solid var(--line); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .l12-wb { min-height: 0; position: relative; overflow: hidden; }
  .l12-score { display: grid; place-content: center; text-align: center; height: 100%; }
  .l12-score b { font-family: var(--mono); font-size: 1.55rem; color: var(--accent); }
  .l12-score span { font-size: .75rem; color: var(--muted); }
  .l12-svg { display: block; width: 100%; height: 100%; }
  .l12-svg text { font-family: var(--mono); }
  .l12-table { position: relative; font-size: .8rem; }
  .l12-tr { position: absolute; left: 0; right: 0; display: grid; grid-template-columns: minmax(0, 1.6fr) minmax(0, 1fr); gap: 6px; padding: 3px 8px; border-bottom: 1px solid var(--line); align-items: center; }
  .l12-tr.head { position: relative; font-weight: 700; color: var(--muted); font-size: .72rem; text-transform: uppercase; letter-spacing: .04em; background: var(--bg); }
  .l12-tr.head button { all: unset; cursor: pointer; }
  .l12-tr .n { text-align: right; font-family: var(--mono); }
  .l12-tr .cut { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .l12-ctrl { padding: 8px; display: grid; gap: 4px; font-size: .8rem; }
  .l12-ctrl select, .l12-props select, .l12-props input { font: inherit; padding: 4px 6px; border: 1px solid var(--line); border-radius: 6px; background: var(--paper); max-width: 100%; }
  .l12-props { border: 1px solid var(--line); border-radius: 8px; padding: 10px 12px; display: grid; gap: 8px; background: var(--bg); }
  .l12-props label { display: grid; grid-template-columns: 7.5em minmax(0, 1fr); gap: 8px; align-items: center; font-size: .9rem; }
  .l12-pal { display: flex; gap: 6px; flex-wrap: wrap; }
  .l12-grid { display: grid; gap: 10px; grid-template-columns: repeat(3, minmax(0, 1fr)); }
  .l12-card { background: var(--paper); border: 1px solid var(--line); border-radius: 8px; min-width: 0; overflow: hidden; }
  .l12-wide { grid-column: 1 / -1; }
  .l12-two { display: grid; gap: 10px; grid-template-columns: minmax(0, 1.2fr) minmax(0, 1fr); }
  @media (max-width: 640px) { .l12-two { grid-template-columns: minmax(0, 1fr); } .l12-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); } .l12-score b { font-size: 1.1rem; } }
  .l12-crumb { display: flex; gap: 6px; align-items: center; flex-wrap: wrap; font-size: .85rem; padding: 6px 8px; }
  .l12-crumb b { color: var(--accent); }
  .l12-tiles { display: grid; grid-template-columns: repeat(auto-fill, minmax(118px, 1fr)); gap: 8px; }
  .l12-tiles button { border: 1px solid var(--line); background: var(--bg); border-radius: 8px; padding: 8px; cursor: pointer; display: grid; gap: 4px; justify-items: center; font-size: .85rem; }
  .l12-tiles button[aria-pressed="true"] { border-color: var(--accent); background: var(--accent-soft); font-weight: 700; }
  .l12-tiles svg { width: 54px; height: 36px; }
  .l12-prev { border: 1px dashed var(--line); border-radius: 8px; min-height: 190px; padding: 8px; transform-origin: 50% 0; }
  `;

  // ------------------------------------------------------------ live visual elements

  /** Column chart with persistent bars that spring when the data, the sort, or the filter changes. */
  function columnChart({ onBar, fmtVal = (v) => fmt(v, 0) } = {}) {
    const svg = s("svg", { class: "l12-svg", role: "img", "aria-label": "Column chart" });
    const axis = s("g"), layer = s("g"); svg.append(axis, layer);
    let W = 300, H = 180, max = 1, f = fmtVal;
    const bars = new Map();
    const PAD = { l: 38, r: 8, t: 18, b: 34 };
    const y0 = () => H - PAD.b;
    function paintAxis() {
      clear(axis);
      for (let k = 0; k <= 4; k++) {
        const v = (max * k) / 4, y = y0() - (k / 4) * (y0() - PAD.t);
        axis.append(s("line", { x1: PAD.l, y1: y, x2: W - PAD.r, y2: y, stroke: "var(--grid)" }), s("text", { x: PAD.l - 4, y: y + 4, "text-anchor": "end", "font-size": 10, fill: "var(--muted)" }, max >= 1000 ? (v ? fmt(v / 1000, 1) + "k" : "0") : fmt(v, v < 10 && v % 1 ? 1 : 0)));
      }
      axis.append(s("line", { x1: PAD.l, y1: y0(), x2: W - PAD.r, y2: y0(), stroke: "var(--ink)" }));
    }
    function paintBar(b) {
      const [x, w, v] = b.v, hh = Math.max(0, (v / max) * (y0() - PAD.t));
      b.r.setAttribute("x", x - w / 2); b.r.setAttribute("width", Math.max(0, w)); b.r.setAttribute("y", y0() - hh); b.r.setAttribute("height", hh);
      b.lab.setAttribute("x", x); b.lab.setAttribute("y", y0() + 14);
      b.val.setAttribute("x", x); b.val.setAttribute("y", y0() - hh - 4); b.val.textContent = w > 6 ? f(v) : "";
      b.g.setAttribute("opacity", String(clamp(w / 14, 0, 1)));
      if (b.gone && w < 0.6) { b.sp.stop(); b.g.remove(); bars.delete(b.key); }
    }
    const maxSp = new Spring(1, (v) => { max = Math.max(0.001, v); paintAxis(); bars.forEach(paintBar); }, { stiffness: 140, damping: 16 });
    let items = [];
    function layout() {
      const n = Math.max(1, items.length), slot = (W - PAD.l - PAD.r) / n;
      items.forEach((it, i) => {
        let b = bars.get(it.key);
        const x = PAD.l + slot * (i + 0.5);
        if (!b) {
          const g = s("g", { style: onBar ? "cursor:pointer" : "" }), r = s("rect", { rx: 3, fill: "var(--shape-a)", opacity: 0.88 });
          const lab = s("text", { "text-anchor": "middle", "font-size": 10, fill: "var(--ink)" }), val = s("text", { "text-anchor": "middle", "font-size": 10, "font-weight": 700, fill: "var(--ink)" });
          g.append(r, lab, val); layer.append(g);
          b = { key: it.key, g, r, lab, val, v: [x, 0, 0] };
          b.sp = new Spring(b.v, (v) => { b.v = v; paintBar(b); }, { stiffness: 170, damping: 16 });
          if (onBar) g.addEventListener("click", () => onBar(b.key));
          bars.set(it.key, b);
        }
        b.gone = false;
        b.r.setAttribute("fill", it.color || "var(--shape-a)");
        const maxChars = Math.max(3, Math.floor(slot / 6.4));
        b.lab.textContent = short(it.label, maxChars);
        b.sp.set([x, Math.min(54, slot * 0.64), it.value]);
      });
      bars.forEach((b, k) => { if (!items.some((it) => it.key === k)) { b.gone = true; b.sp.set([b.v[0], 0, 0]); } });
    }
    return {
      el: svg,
      size(w, hh) { W = Math.max(120, w); H = Math.max(90, hh); svg.setAttribute("viewBox", `0 0 ${W} ${H}`); paintAxis(); layout(); bars.forEach(paintBar); },
      update(list, fv) { if (fv) f = fv; items = list; maxSp.set(niceMax(Math.max(0, ...list.map((x) => x.value)) * 1.08)); layout(); },
      stop() { maxSp.stop(); bars.forEach((b) => b.sp.stop()); },
    };
  }

  /** Table with persistent rows that spring into their new order when sorted or filtered. */
  function tableView({ cols, onSort }) {
    const RH = 25;
    const wrap = h("div", { class: "l12-table" });
    const head = h("div", { class: "l12-tr head" });
    const bodyEl = h("div", { style: "position:relative" });
    wrap.append(head, bodyEl);
    const rows = new Map();
    let sortKey = null, sortDir = -1;
    function headCells() {
      clear(head);
      head.style.gridTemplateColumns = cols.map((c) => c.w || "1fr").join(" ");
      cols.forEach((c) => {
        const mark = sortKey === c.key ? (sortDir < 0 ? " ▼" : " ▲") : "";
        head.append(h("span", { class: c.num ? "n" : "" }, onSort ? h("button", { type: "button", onclick: () => { if (sortKey === c.key) sortDir = -sortDir; else { sortKey = c.key; sortDir = c.num ? -1 : 1; } headCells(); onSort(); } }, c.label + mark) : c.label + mark));
      });
    }
    headCells();
    return {
      el: wrap,
      get sort() { return { key: sortKey, dir: sortDir }; },
      setSort(k, d) { sortKey = k; sortDir = d; headCells(); },
      update(list) {
        let data = list.slice();
        if (sortKey) { const c = cols.find((x) => x.key === sortKey); data.sort((a, b) => (c.num ? (a[sortKey] - b[sortKey]) : String(a[sortKey]).localeCompare(String(b[sortKey]))) * sortDir); }
        bodyEl.style.height = `${data.length * RH}px`;
        data.forEach((d, i) => {
          let r = rows.get(d.key);
          if (!r) {
            const el = h("div", { class: "l12-tr" }); el.style.gridTemplateColumns = cols.map((c) => c.w || "1fr").join(" "); el.style.height = RH + "px";
            bodyEl.append(el);
            r = { el, v: [i * RH + 30, 0] };
            r.sp = new Spring(r.v, (v) => { r.v = v; el.style.transform = `translateY(${v[0]}px)`; el.style.opacity = String(clamp(v[1], 0, 1)); if (r.gone && v[1] < 0.02) { r.sp.stop(); el.remove(); rows.delete(d.key); } }, { stiffness: 190, damping: 19 });
            rows.set(d.key, r);
          }
          r.gone = false;
          clear(r.el);
          cols.forEach((c) => r.el.append(h("span", { class: c.num ? "n" : "cut" }, c.f ? c.f(d[c.key]) : String(d[c.key]))));
          r.sp.set([i * RH, 1]);
        });
        rows.forEach((r, k) => { if (!data.some((d) => d.key === k)) { r.gone = true; r.sp.set([r.v[0] + 12, 0]); } });
      },
      stop() { rows.forEach((r) => r.sp.stop()); },
    };
  }

  function scorecard(label, f) {
    const b = h("b", {}, "0"), sub = h("span", {}, label);
    const sp = new Spring(0, (v) => { b.textContent = f(v); }, { stiffness: 120, damping: 17 });
    return { el: h("div", { class: "l12-score" }, b, sub), set(v, lab) { sp.set(v); if (lab) sub.textContent = lab; }, stop: () => sp.stop() };
  }

  // ------------------------------------------------------------ Build: drag widgets onto a snapping grid

  const KINDS = {
    score: { label: "Scorecard", w: 1, h: 1, props: { title: "Total enrollment", metric: "enr" } },
    column: { label: "Column chart", w: 2, h: 2, props: { title: "Enrollment by region", metric: "enr", dim: "region", sort: "desc" } },
    table: { label: "Table", w: 2, h: 2, props: { title: "Schools", metric: "enr", dim: "school", sort: "desc" } },
    control: { label: "Drop-down control", w: 1, h: 1, props: { title: "Region control", field: "region" } },
  };

  function build(root) {
    const canvas = h("div", { class: "l12-canvas", "aria-label": "Dashboard canvas" });
    const props = h("div", { class: "l12-props" });
    const goals = h("div", { class: "readout" });
    const widgets = [];
    let cols = 4, cw = 100, RH = 96, GAP = 8, sel = null, filter = "All", uid = 0;
    const cellX = (c) => GAP + c * (cw + GAP), cellY = (r) => GAP + r * (RH + GAP);
    function measure() {
      const W = canvas.clientWidth || 600;
      cols = W < 520 ? 2 : 4; cw = (W - GAP * (cols + 1)) / cols;
      canvas.style.backgroundSize = `${cw + GAP}px ${RH + GAP}px`;
      canvas.style.backgroundPosition = `${GAP / 2}px ${GAP / 2}px`;
    }
    const occupied = (c, r, w, hh, except) => widgets.some((o) => o !== except && c < o.c + o.w && o.c < c + w && r < o.r + o.h && o.r < r + hh);
    function freeSpot(w, hh, prefC = 0, prefR = 0, except = null) {
      let best = null, bd = Infinity;
      for (let r = 0; r < 14; r++) for (let c = 0; c + w <= cols; c++) {
        if (occupied(c, r, w, hh, except)) continue;
        const d = Math.hypot(c - prefC, (r - prefR) * 1.1);
        if (d < bd) { bd = d; best = { c, r }; }
      }
      return best || { c: 0, r: 0 };
    }
    function fitHeight() { const rows = Math.max(3, ...widgets.map((o) => o.r + o.h)) + 1; canvas.style.height = `${cellY(rows)}px`; }
    function sizeWidget(o) {
      o.w = Math.min(KINDS[o.kind].w, cols);
      const pw = o.w * cw + (o.w - 1) * GAP, ph = o.h * RH + (o.h - 1) * GAP;
      o.el.style.width = pw + "px"; o.el.style.height = ph + "px";
      o.pw = pw; o.ph = ph;
    }
    function filtered() { return filter === "All" ? ROWS : ROWS.filter((r) => r.region === filter); }
    function render(o) {
      const P = o.p;
      o.head.textContent = P.title || KINDS[o.kind].label;
      if (o.kind === "score") {
        if (!o.view || o.view.metric !== P.metric) { if (o.view) o.view.stop(); o.view = scorecard("", METRICS[P.metric].f); o.view.metric = P.metric; clear(o.body); o.body.append(o.view.el); }
        const m = METRICS[P.metric]; o.view.set(m.val(sumBy(filtered())), `${m.agg === "SUM" ? "SUM of " : ""}${m.label}`);
      } else if (o.kind === "column") {
        if (!o.view) { o.view = columnChart({}); clear(o.body); o.body.append(o.view.el); }
        o.view.size(o.pw, o.ph - 26);
        o.view.update(group(filtered(), P.dim, P.metric, P.sort), METRICS[P.metric].f);
      } else if (o.kind === "table") {
        const cols2 = [{ key: "label", label: DIMS[P.dim], w: "minmax(0,1.6fr)" }, { key: "value", label: METRICS[P.metric].label, num: true, f: METRICS[P.metric].f, w: "minmax(0,1fr)" }];
        if (!o.view || o.view.dimKey !== P.dim + P.metric) { if (o.view) o.view.stop(); o.view = tableView({ cols: cols2 }); o.view.dimKey = P.dim + P.metric; clear(o.body); o.body.style.overflowY = "auto"; o.body.append(o.view.el); }
        o.view.setSort("value", P.sort === "asc" ? 1 : -1);
        if (P.sort === "name") o.view.setSort("label", 1);
        o.view.update(group(filtered(), P.dim, P.metric, P.sort).map((g) => ({ ...g })));
      } else if (o.kind === "control") {
        if (!o.view) {
          const sel2 = h("select", { "aria-label": "Region control", onchange: () => { filter = sel2.value; renderAll(); } }, h("option", { value: "All" }, "All regions"), REGIONS.map((r) => h("option", { value: r }, r)));
          sel2.addEventListener("pointerdown", (e) => e.stopPropagation());
          o.view = { el: h("div", { class: "l12-ctrl" }, h("span", {}, "Region"), sel2), stop() {} };
          clear(o.body); o.body.append(o.view.el);
        }
      }
    }
    function renderAll() { widgets.forEach(render); checkGoals(); }
    function place(o, spring = true) { const t = [cellX(o.c), cellY(o.r)]; if (spring) o.sp.set(t); else o.sp.jump(t); }
    function select(o) {
      sel = o; widgets.forEach((x) => x.el.classList.toggle("sel", x === o));
      clear(props);
      if (!o) { props.append(h("p", { class: "note" }, "Select a widget on the canvas to edit its properties (Looker Studio: the Setup and Style panels on the right).")); return; }
      const P = o.p;
      const field = (label, node) => h("label", {}, h("span", {}, label), node);
      const opt = (obj, cur) => Object.entries(obj).map(([k, v]) => h("option", { value: k, selected: k === cur }, typeof v === "string" ? v : v.label));
      const title = h("input", { type: "text", value: P.title, "aria-label": "Title", oninput: () => { P.title = title.value; render(o); checkGoals(); } });
      props.append(h("p", { class: "steps-title" }, `${KINDS[o.kind].label} · properties`), field("Title", title));
      if (o.kind !== "control") props.append(field("Metric", h("select", { "aria-label": "Metric", onchange: (e) => { P.metric = e.target.value; render(o); checkGoals(); } }, opt(METRICS, P.metric))));
      if (o.kind === "column" || o.kind === "table") {
        props.append(field("Dimension", h("select", { "aria-label": "Dimension", onchange: (e) => { P.dim = e.target.value; render(o); checkGoals(); } }, opt(DIMS, P.dim))));
        props.append(field("Sort", h("select", { "aria-label": "Sort", onchange: (e) => { P.sort = e.target.value; render(o); checkGoals(); } }, opt({ desc: "Metric · descending", asc: "Metric · ascending", name: "Dimension · A to Z" }, P.sort))));
      }
      if (o.kind === "control") props.append(h("p", { class: "note" }, "Control field: Region. Every chart on this page that uses the same data source is filtered by it."));
      props.append(h("div", { class: "controls" }, h("button", { class: "btn ghost", type: "button", onclick: () => remove(o) }, "Remove widget")));
    }
    function remove(o) {
      const i = widgets.indexOf(o); if (i < 0) return;
      if (o.kind === "control") filter = "All";
      widgets.splice(i, 1);
      o.el.style.transition = "opacity .25s, scale .25s"; o.el.style.opacity = "0"; o.el.style.scale = "0.8";
      setTimeout(() => { if (o.view) o.view.stop(); o.sp.stop(); o.el.remove(); }, 260);
      select(null); fitHeight(); renderAll();
    }
    function add(kind) {
      measure();
      const k = KINDS[kind], o = { id: ++uid, kind, w: Math.min(k.w, cols), h: k.h, p: { ...k.props } };
      const spot = freeSpot(o.w, o.h, 0, 0); o.c = spot.c; o.r = spot.r;
      o.head = h("div", { class: "l12-wh" }); o.body = h("div", { class: "l12-wb" });
      o.el = h("div", { class: "l12-w", tabindex: 0, "aria-label": k.label }, o.head, o.body);
      o.sp = new Spring([cellX(o.c), -RH], (v) => { o.el.style.transform = `translate(${v[0]}px, ${v[1]}px)`; o.pos = v; }, { stiffness: 230, damping: 17 });
      canvas.append(o.el); widgets.push(o);
      sizeWidget(o); fitHeight(); place(o); render(o); checkGoals();
      drag(o); select(o);
    }
    function drag(o) {
      o.el.addEventListener("pointerdown", (ev) => {
        if (ev.target.closest("select, input, button")) return;
        ev.preventDefault(); o.el.setPointerCapture(ev.pointerId); select(o);
        o.sp.stop(); o.el.classList.add("drag");
        const sx = ev.clientX, sy = ev.clientY, [ox, oy] = o.pos, maxX = canvas.clientWidth - o.pw - GAP;
        const move = (e) => {
          const x = rubber(ox + e.clientX - sx, GAP, maxX, 0.3), y = rubber(oy + e.clientY - sy, GAP, 2000, 0.3);
          o.sp.value = [x, y]; o.sp.vel = [0, 0]; o.el.style.transform = `translate(${x}px, ${y}px) rotate(${clamp((e.clientX - sx) * 0.02, -2, 2)}deg)`; o.pos = [x, y];
        };
        const up = () => {
          o.el.removeEventListener("pointermove", move); o.el.removeEventListener("pointerup", up); o.el.removeEventListener("pointercancel", up);
          o.el.classList.remove("drag");
          const pc = clamp(Math.round((o.pos[0] - GAP) / (cw + GAP)), 0, cols - o.w), pr = Math.max(0, Math.round((o.pos[1] - GAP) / (RH + GAP)));
          const spot = occupied(pc, pr, o.w, o.h, o) ? freeSpot(o.w, o.h, pc, pr, o) : { c: pc, r: pr };
          o.c = spot.c; o.r = spot.r; place(o); fitHeight();
        };
        o.el.addEventListener("pointermove", move); o.el.addEventListener("pointerup", up); o.el.addEventListener("pointercancel", up);
      });
      o.el.addEventListener("keydown", (e) => {
        const d = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] }[e.key];
        if (!d || e.target !== o.el) return;
        e.preventDefault();
        const c = clamp(o.c + d[0], 0, cols - o.w), r = Math.max(0, o.r + d[1]);
        if (!occupied(c, r, o.w, o.h, o)) { o.c = c; o.r = r; place(o); fitHeight(); }
      });
    }
    function checkGoals() {
      clear(goals);
      const col = widgets.find((o) => o.kind === "column" && o.p.metric === "lpt" && o.p.dim === "region");
      const g = [
        ["A scorecard of total enrollment", widgets.some((o) => o.kind === "score" && o.p.metric === "enr")],
        ["A column chart: Learners per teacher by Region", !!col],
        ["…sorted descending", !!col && col.p.sort === "desc"],
        ["A table of schools", widgets.some((o) => o.kind === "table" && o.p.dim === "school")],
        ["A Region drop-down control", widgets.some((o) => o.kind === "control")],
      ];
      g.forEach(([t, ok]) => goals.append(pill(ok, "✓ " + t, "○ " + t)));
      if (g.every(([, ok]) => ok)) goals.append(h("p", { class: "feedback ok" }, "Your dashboard answers the principal's questions. Try the Region control – every widget updates."));
    }
    const ro = window.ResizeObserver ? new ResizeObserver(() => { const old = cols; measure(); widgets.forEach((o) => { sizeWidget(o); if (o.c + o.w > cols || old !== cols) { const sp = freeSpot(o.w, o.h, Math.min(o.c, cols - o.w), o.r, o); o.c = sp.c; o.r = sp.r; } place(o, false); render(o); }); fitHeight(); }) : null;
    root.append(
      h("p", {}, "The principal asks: “Which region has the most learners per teacher, and how many learners do we have in all?” Build a one-page dashboard. Add widgets, drag them on the grid, and edit their properties."),
      h("div", { class: "l12-pal" }, Object.entries(KINDS).map(([k, v]) => h("button", { class: "btn", type: "button", onclick: () => add(k) }, "+ " + v.label))),
      canvas, props, h("p", { class: "steps-title" }, "Dashboard goals (M10)"), goals,
      h("p", { class: "note" }, "Sample data: 12 made-up schools in three regions (not official DepEd figures). Data source: a Google Sheet with columns Region, City, School, Enrollment, Teachers."));
    measure(); fitHeight(); select(null); checkGoals();
    if (ro) ro.observe(canvas);
    return () => { if (ro) ro.disconnect(); widgets.forEach((o) => { o.sp.stop(); if (o.view) o.view.stop(); }); };
  }

  // ------------------------------------------------------------ Explore: cross-filter, drill down, sort

  function explore(root) {
    let region = "All", path = [];
    const LEVELS = ["region", "city", "school"];
    const sEnr = scorecard("SUM of Enrollment", (v) => fmt(v, 0)), sTeach = scorecard("SUM of Teachers", (v) => fmt(v, 0)), sLpt = scorecard("Learners per teacher", (v) => fmt(v, 1));
    const chart = columnChart({ onBar: (k) => drill(k), fmtVal: (v) => fmt(v, 0) });
    const crumb = h("div", { class: "l12-crumb" });
    const upBtn = h("button", { class: "btn ghost", type: "button", onclick: () => { path.pop(); update(); } }, "▲ Drill up");
    const table = tableView({ cols: [{ key: "school", label: "School", w: "minmax(0,1.7fr)" }, { key: "enr", label: "Enr.", num: true, w: "minmax(0,.8fr)", f: (v) => fmt(v, 0) }, { key: "lpt", label: "L/T", num: true, w: "minmax(0,.6fr)", f: (v) => fmt(v, 1) }], onSort: () => update() });
    table.setSort("enr", -1);
    const select = h("select", { "aria-label": "Region control", onchange: () => { region = select.value; path = region === "All" ? [] : [region]; update(); } }, h("option", { value: "All" }, "All regions"), REGIONS.map((r) => h("option", { value: r }, r)));
    const chartBox = h("div", { style: "height:230px" }, chart.el);
    const log = h("p", { class: "note", "aria-live": "polite" });
    function rowsNow() {
      let r = ROWS;
      if (region !== "All") r = r.filter((x) => x.region === region);
      path.forEach((v, i) => { r = r.filter((x) => x[LEVELS[i]] === v); });
      return r;
    }
    function drill(k) {
      if (path.length >= 2) { log.textContent = `School is the lowest level of the hierarchy – drill up to go back.`; return; }
      path.push(k); update();
    }
    function update() {
      const rs = rowsNow(), T = sumBy(rs);
      sEnr.set(T.enr); sTeach.set(T.teach); sLpt.set(T.teach ? T.enr / T.teach : 0);
      const level = LEVELS[Math.min(path.length, 2)];
      chart.size(chartBox.clientWidth || 360, 230);
      chart.update(group(rs, level, "enr", "desc").map((g, i) => ({ ...g, color: i === 0 ? "var(--accent)" : "var(--shape-a)" })));
      clear(crumb);
      crumb.append(h("span", {}, "Hierarchy:"), ...["Region", "City", "School"].map((n, i) => h("span", {}, i ? "› " : "", i === path.length ? h("b", {}, n) : n, path[i] ? ` (${path[i]})` : "")));
      upBtn.disabled = path.length === 0 || (path.length === 1 && region !== "All");
      table.update(rs.map((x) => ({ key: x.school, school: x.school, enr: x.enr, lpt: x.enr / x.teach })));
      const srt = table.sort;
      log.textContent = `Filter: Region = ${region}. Chart dimension: ${DIMS[level]}${path.length ? ` (drilled into ${path.join(" › ")})` : ""}. Table sorted by ${srt.key === "school" ? "School" : srt.key === "enr" ? "Enrollment" : "Learners per teacher"} ${srt.dir < 0 ? "descending" : "ascending"}.`;
      select.value = region;
    }
    const card = (title, ...kids) => h("div", { class: "l12-card" }, h("div", { class: "l12-wh" }, title), ...kids);
    root.append(
      h("p", {}, "A finished dashboard. Choose a region in the control – every chart filters. Click a column to drill down Region › City › School; drill up to go back. Click a table heading to sort."),
      h("div", { class: "controls" }, h("label", {}, "Region control ", select)),
      h("div", { class: "l12-grid" }, card("Enrollment", h("div", { style: "height:74px" }, sEnr.el)), card("Teachers", h("div", { style: "height:74px" }, sTeach.el)), card("Learners / teacher", h("div", { style: "height:74px" }, sLpt.el))),
      h("div", { class: "l12-two" }, card("Enrollment by level (click a column to drill down)", crumb, chartBox, h("div", { class: "controls", style: "padding:0 8px 8px" }, upBtn)), card("Schools (click a heading to sort)", table.el)),
      log, h("p", { class: "note" }, "Sample data – 12 made-up schools (not official DepEd figures)."));
    const ro = window.ResizeObserver ? new ResizeObserver(() => update()) : null;
    update(); if (ro) ro.observe(chartBox);
    return () => { if (ro) ro.disconnect(); [sEnr, sTeach, sLpt, chart, table].forEach((x) => x.stop()); };
  }

  // ------------------------------------------------------------ Choose the Visual

  const VIS = {
    score: { label: "Scorecard", icon: () => [s("rect", { x: 6, y: 6, width: 42, height: 24, rx: 4, fill: "none", stroke: "currentColor" }), s("text", { x: 27, y: 23, "text-anchor": "middle", "font-size": 12, fill: "currentColor" }, "123")] },
    column: { label: "Column chart", icon: () => [10, 22, 34].map((x, i) => s("rect", { x, y: 30 - [14, 24, 18][i], width: 9, height: [14, 24, 18][i], fill: "currentColor" })) },
    table: { label: "Table", icon: () => [0, 1, 2, 3].map((i) => s("line", { x1: 6, y1: 8 + i * 7, x2: 48, y2: 8 + i * 7, stroke: "currentColor", "stroke-width": i ? 1 : 3 })) },
    control: { label: "Drop-down control", icon: () => [s("rect", { x: 6, y: 10, width: 42, height: 16, rx: 3, fill: "none", stroke: "currentColor" }), s("path", { d: "M38,16 l4,4 l4,-4", fill: "none", stroke: "currentColor", "stroke-width": 2 })] },
    line: { label: "Time series", icon: () => [s("polyline", { points: "6,28 16,22 26,24 36,14 48,8", fill: "none", stroke: "currentColor", "stroke-width": 2.5 })] },
    pie: { label: "Pie chart", icon: () => [s("circle", { cx: 27, cy: 18, r: 14, fill: "none", stroke: "currentColor", "stroke-width": 2 }), s("path", { d: "M27,18 L27,4 A14,14 0 0 1 40,23 Z", fill: "currentColor" })] },
  };
  const CHOOSE = [
    { q: "The principal wants one big number: total enrollment of all 12 schools this school year.", ok: "score", why: "A single aggregated number (SUM of Enrollment) belongs in a scorecard." },
    { q: "Compare the total enrollment of the three regions.", ok: "column", why: "Comparing a metric across categories of a dimension → column chart." },
    { q: "Let the division office show one region at a time on every chart.", ok: "control", why: "A drop-down control filters every chart on the page by Region." },
    { q: "Look up each school's enrollment, teachers, and learners per teacher.", ok: "table", why: "Looking up exact values for many rows and several metrics → table." },
    { q: "How did total enrollment change from SY 2021–22 to SY 2025–26?", ok: "line", why: "A metric over time (school years in order) → time series / line chart." },
    { q: "What share of the 9,930 learners are in Junior High vs Senior High?", ok: "pie", why: "Two parts of one whole → pie (or donut) chart." },
    { q: "Which city has the highest learners-per-teacher ratio? (calculated field, sorted)", ok: "column", why: "Compare a calculated metric across cities, sorted descending → column (or bar) chart." },
  ];

  function preview(kind, box) {
    clear(box);
    const W = 360, H = 170;
    const svg = s("svg", { viewBox: `0 0 ${W} ${H}`, class: "l12-svg", style: "height:auto;max-width:440px;margin:0 auto", role: "img", "aria-label": `${VIS[kind].label} preview` });
    const txt = (x, y, t, o = {}) => s("text", { x, y, "font-size": 12, fill: "var(--ink)", ...o }, t);
    const T = sumBy(ROWS);
    if (kind === "score") svg.append(txt(W / 2, 80, fmt(T.enr, 0), { "text-anchor": "middle", "font-size": 40, fill: "var(--accent)", "font-weight": 700 }), txt(W / 2, 110, "SUM of Enrollment", { "text-anchor": "middle", fill: "var(--muted)" }));
    if (kind === "column") group(ROWS, "region", "enr", "desc").forEach((g, i) => { const hh = (g.value / 5000) * 120; svg.append(s("rect", { x: 50 + i * 100, y: 140 - hh, width: 60, height: hh, fill: "var(--shape-a)", rx: 3 }), txt(80 + i * 100, 158, short(g.label, 13), { "text-anchor": "middle" }), txt(80 + i * 100, 134 - hh, fmt(g.value, 0), { "text-anchor": "middle", "font-weight": 700 })); });
    if (kind === "table") ROWS.slice(0, 6).forEach((r, i) => svg.append(txt(10, 22 + i * 24, r.school), txt(240, 22 + i * 24, fmt(r.enr, 0), { "text-anchor": "end" }), txt(330, 22 + i * 24, fmt(r.enr / r.teach, 1), { "text-anchor": "end" }), s("line", { x1: 6, y1: 28 + i * 24, x2: 350, y2: 28 + i * 24, stroke: "var(--line)" })));
    if (kind === "control") svg.append(s("rect", { x: 80, y: 50, width: 200, height: 34, rx: 6, fill: "var(--paper)", stroke: "var(--line)" }), txt(94, 72, "Region: All regions ▾"), txt(94, 110, "NCR · CALABARZON · Central Luzon", { fill: "var(--muted)" }));
    if (kind === "line") { const pts = TREND.map(([, v], i) => [40 + i * 70, 140 - ((v - 9000) / 1000) * 120]); svg.append(s("polyline", { points: pts.map((p) => p.join(",")).join(" "), fill: "none", stroke: "var(--shape-a)", "stroke-width": 3 })); TREND.forEach(([y, v], i) => svg.append(s("circle", { cx: pts[i][0], cy: pts[i][1], r: 4, fill: "var(--shape-a)" }), txt(pts[i][0], 160, y, { "text-anchor": "middle" }), txt(pts[i][0], pts[i][1] - 8, fmt(v, 0), { "text-anchor": "middle", "font-size": 10 }))); }
    if (kind === "pie") { const jhs = 0.62; const a = jhs * 2 * Math.PI - Math.PI / 2; svg.append(s("circle", { cx: 120, cy: 85, r: 70, fill: "var(--gold)" }), s("path", { d: `M120,85 L120,15 A70,70 0 1 1 ${120 + 70 * Math.cos(a)},${85 + 70 * Math.sin(a)} Z`, fill: "var(--shape-a)" }), txt(220, 70, "Junior High 62%"), txt(220, 100, "Senior High 38%")); }
    box.append(svg);
    if (!Sim.reducedMotion() && box.animate) box.animate([{ transform: "scale(.86)", opacity: 0 }, { transform: "scale(1.03)", opacity: 1, offset: 0.7 }, { transform: "scale(1)", opacity: 1 }], { duration: 420, easing: "ease-out" });
  }

  function choose(root) {
    let qi = 0, right = 0, tried = 0;
    const qEl = h("p", { class: "bigq" }), fb = h("p", { class: "feedback", "aria-live": "polite" }), box = h("div", { class: "l12-prev" }), score = stat("Score:", "0 / 0");
    const tiles = h("div", { class: "l12-tiles", role: "group", "aria-label": "Visual elements" });
    const btns = Object.entries(VIS).map(([k, v]) => {
      const b = h("button", { type: "button", "aria-pressed": "false", onclick: () => pickVis(k, b) }, s("svg", { viewBox: "0 0 54 36", "aria-hidden": "true" }, ...v.icon()), v.label);
      tiles.append(b); return b;
    });
    function pickVis(k, b) {
      btns.forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
      const Q = CHOOSE[qi], ok = k === Q.ok;
      tried++; if (ok) right++; score.set(`${right} / ${tried}`);
      fb.className = "feedback " + (ok ? "ok" : "bad");
      fb.textContent = ok ? `Yes. ${Q.why}` : `${VIS[k].label} is not the best choice here. ${Q.why.includes("→") ? "Hint: " + Q.why.split("→")[0].trim() + " → ?" : "Hint: think about what the reader must do with the result."}`;
      preview(k, box);
    }
    function load() { qEl.textContent = CHOOSE[qi].q; fb.textContent = ""; fb.className = "feedback"; btns.forEach((x) => x.setAttribute("aria-pressed", "false")); clear(box); box.append(h("p", { class: "note" }, "Pick a visual element – a preview appears here.")); }
    root.append(h("p", {}, "The data has already been transformed (grouped, summed, or calculated). Pick the visual element that answers each question best."), qEl, tiles, fb, box,
      h("div", { class: "controls" }, h("button", { class: "btn ghost", type: "button", onclick: () => { qi = (qi + 1) % CHOOSE.length; load(); } }, "Next question"), score.el));
    load();
    return () => {};
  }

  Sim.register({
    id: "lesson12", unit: "5", num: 12, letter: "L", title: "Interactive Dashboards in Looker Studio", simName: "Dashboard Builder",
    comps: ["A2.11", "A2.12", "A2.13", "M10"], sessions: "S60–S65", cg: "CG Part 2 · Content 4 (Data Visualization Software)",
    deped: "CG Part 2 · Content 4 (Data Visualization Software)",
    bigQuestion: "How do we show the data so others understand and act?",
    mission: [
      "Build: add a scorecard, a column chart, a table, and a drop-down control. Drag them on the grid and edit their properties until all five dashboard goals are checked.",
      "Explore: choose CALABARZON in the control. What happens to every widget? Drill into a region, then a city. Sort the table by L/T.",
      "Choose the Visual: for each question about transformed data, pick the visual element that answers it best.",
    ],
    discovery: "A dashboard is built from visual elements on one page: scorecards show one key number, column charts compare a metric across a dimension, tables let readers look up exact values, and controls (drop-downs) filter every chart at once. Editing properties – metric, dimension, sort, title – changes what each element shows. Drill-down follows a hierarchy (Region › City › School). The best dashboard starts from the questions its audience needs answered.",
    mount(stage) {
      const body = h("div", { class: "stage-body" });
      const views = [build, explore, choose];
      let stopper = null;
      const t = tabs(["Build", "Explore", "Choose the Visual"], (i) => { if (stopper) stopper(); clear(body); stopper = views[i](body) || null; });
      stage.append(h("style", {}, CSS), t.el, body);
      stopper = build(body);
      return () => { if (stopper) stopper(); };
    },
    check() {
      const kind = randInt(0, 5);
      if (kind === 0) { const Q = pick(CHOOSE); return { q: `Which visual element is best? ${Q.q}`, choices: shuffle(Object.values(VIS).map((v) => v.label)), answer: VIS[Q.ok].label, explain: Q.why }; }
      if (kind === 1) { const r = pick(REGIONS), rs = ROWS.filter((x) => x.region === r), T = sumBy(rs); return { q: `Sample data: the ${r} schools have ${fmt(T.enr, 0)} learners and ${T.teach} teachers. What does a "Learners per teacher" scorecard show? (1 decimal place)`, answer: round(T.enr / T.teach, 1), tol: 0.06, explain: `${fmt(T.enr, 0)} ÷ ${T.teach} ≈ ${fmt(T.enr / T.teach, 2)}.` }; }
      if (kind === 2) { const c = pick(["Quezon City", "Pasig", "Antipolo", "Calamba", "Malolos"]), rs = ROWS.filter((x) => x.city === c); return { q: `You drill down from Region to City. The ${c} schools have enrollments ${rs.map((x) => fmt(x.enr, 0)).join(" and ")}. What value does the ${c} column show for SUM of Enrollment?`, answer: rs.reduce((a, x) => a + x.enr, 0), tol: 0, explain: `${rs.map((x) => x.enr).join(" + ")} = ${fmt(rs.reduce((a, x) => a + x.enr, 0), 0)}.` }; }
      if (kind === 3) return pick([
        { q: "In Looker Studio, how do you connect a Google Sheet as data?", choices: ["Add data › Google Sheets connector › choose the spreadsheet and worksheet", "Insert › Chart › From Sheets", "File › Import › CSV only", "Copy the cells and paste them on the canvas"], answer: "Add data › Google Sheets connector › choose the spreadsheet and worksheet", explain: "Reports get data through connectors; Google Sheets is one of them." },
        { q: "Which Looker Studio panel do you use to change a chart's dimension, metric, and sort?", choices: ["Setup", "Style", "Theme and layout", "File"], answer: "Setup", explain: "Setup = data (dimension, metric, sort, filters); Style = colors, fonts, labels." },
        { q: "Which Looker Studio panel changes a chart's colors, fonts, and data labels?", choices: ["Style", "Setup", "Data source", "Share"], answer: "Style", explain: "The Style tab controls appearance." },
        { q: "What must a column chart have to allow drill-down from Region to City to School?", choices: ["Drill down turned on, with dimensions Region, City, School in order", "Three separate charts", "A pie chart", "A date range control"], answer: "Drill down turned on, with dimensions Region, City, School in order", explain: "Drill-down follows a dimension hierarchy listed from general to specific." },
      ]);
      if (kind === 4) return pick([
        { q: "A drop-down control set to Region = NCR does what to the other charts on the page?", choices: ["Filters them to show only NCR rows", "Deletes the other regions from the Google Sheet", "Sorts them by NCR first", "Changes their colors"], answer: "Filters them to show only NCR rows", explain: "Controls filter the charts; the data source is unchanged." },
        { q: "Which hierarchy is ordered correctly for drilling down?", choices: ["Region › City › School", "School › City › Region", "City › Region › School", "Region › School › City"], answer: "Region › City › School", explain: "Drill down goes from the most general level to the most specific." },
        { q: "A principal has five minutes. What should the top of the dashboard show (M10)?", choices: ["Scorecards with the key numbers that answer the principal's question", "Every column of the raw data", "A long paragraph of methods", "Decorative images"], answer: "Scorecards with the key numbers that answer the principal's question", explain: "Design around the audience's questions: key numbers first, detail below." },
      ]);
      const T = sumBy(ROWS); return { q: `Sample data: 12 schools have ${fmt(T.enr, 0)} learners in all. A drop-down filters to CALABARZON (${fmt(sumBy(ROWS.filter((x) => x.region === "CALABARZON")).enr, 0)} learners). What percent of all learners does the scorecard now represent? (1 decimal place)`, answer: round((sumBy(ROWS.filter((x) => x.region === "CALABARZON")).enr / T.enr) * 100, 1), tol: 0.06, unit: "%", explain: `${fmt(sumBy(ROWS.filter((x) => x.region === "CALABARZON")).enr, 0)} ÷ ${fmt(T.enr, 0)} × 100% ≈ ${fmt((sumBy(ROWS.filter((x) => x.region === "CALABARZON")).enr / T.enr) * 100, 1)}%.` };
    },
  });
})();
