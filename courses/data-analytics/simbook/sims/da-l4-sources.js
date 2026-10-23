/* Data Analytics · Unit 2 · Lesson 4 · D. Data Sources and Collection Methods – Collect It Three Ways */
(function () {
  "use strict";
  const { h, s, clear, randInt, pick, shuffle, fmt, clamp, tabs, segmented, stat, pill, Spring, elasticSlider } = Sim;

  const COLORS = {
    a: ["var(--shape-a-soft)", "var(--shape-a)"], b: ["var(--shape-b-soft)", "var(--shape-b)"],
    g: ["var(--accent-soft)", "var(--accent)"], y: ["var(--gold-soft)", "var(--gold)"],
  };
  const fitSize = (text, maxW, base) => Math.min(base, maxW / (String(text).length * 0.64));

  // ------------------------------------------------------------ drag-to-bin sorter (springs + rubber-band)

  function sorter(root, { bins, cards, onDone }) {
    const narrow = root.clientWidth < 540;
    const W = narrow ? 360 : 600, pad = 8, gap = 10;
    const cols = narrow ? 2 : bins.length;
    const binW = (W - 2 * pad - (cols - 1) * gap) / cols;
    const trayCols = narrow ? 2 : 4, cellW = (W - 2 * pad) / trayCols;
    const cardW = Math.min(binW - 12, cellW - 10), cardH = 42;
    const per = {};
    cards.forEach((c) => { per[c.a] = (per[c.a] || 0) + 1; });
    const maxPer = Math.max(...Object.values(per));
    const binH = 40 + maxPer * (cardH + 5) + 4;
    const binRows = Math.ceil(bins.length / cols);
    const top = 4, trayTop = top + binRows * (binH + gap) + 2;
    const trayRows = Math.ceil(cards.length / trayCols);
    const H = trayTop + 28 + trayRows * (cardH + 8) + 6;
    const svg = s("svg", { viewBox: `0 0 ${W} ${H}`, role: "img", "aria-label": "Drag each data source into the bin where it belongs" });
    const binLayer = s("g"), cardLayer = s("g");
    const fb = h("p", { class: "feedback", "aria-live": "polite" }, "Drag a card into a bin.");
    const placed = stat("Placed:", `0 / ${cards.length}`), wrong = stat("Wrong drops:", "0");
    let nWrong = 0;
    const binBox = (i) => ({ x: pad + (i % cols) * (binW + gap), y: top + Math.floor(i / cols) * (binH + gap), w: binW, h: binH });
    const binRects = bins.map((b, i) => {
      const r = binBox(i), [soft, strong] = COLORS[b.color];
      const rect = s("rect", { x: r.x, y: r.y, width: r.w, height: r.h, rx: 10, fill: soft, stroke: strong, "stroke-width": 2, "fill-opacity": 0.55 });
      binLayer.append(rect,
        s("text", { x: r.x + r.w / 2, y: r.y + 15, "text-anchor": "middle", class: "svg-label", "font-size": 11 }, b.group || ""),
        s("text", { x: r.x + r.w / 2, y: r.y + 32, "text-anchor": "middle", class: "svg-text", "font-size": 15, "font-weight": 700, fill: strong }, b.label));
      return rect;
    });
    binLayer.append(s("rect", { x: pad, y: trayTop, width: W - 2 * pad, height: H - trayTop - 4, rx: 10, fill: "var(--grid)" }),
      s("text", { x: pad + 10, y: trayTop + 18, class: "svg-label" }, "Tray – drag each card up into a bin"));
    svg.append(binLayer, cardLayer);
    const state = shuffle(cards).map((c) => {
      const g = s("g", { class: "token", tabindex: 0, "aria-label": `${c.t}, ${c.sub}` });
      const rect = s("rect", { width: cardW, height: cardH, rx: 8, fill: "var(--paper)", stroke: "var(--line)", "stroke-width": 1.5 });
      g.append(rect,
        s("text", { x: 9, y: 18, class: "svg-text", "font-size": fitSize(c.t, cardW - 16, 14), "font-weight": 700 }, c.t),
        s("text", { x: 9, y: 34, class: "svg-label", "font-size": fitSize(c.sub, cardW - 14, 11.5) }, c.sub));
      const st = { c, g, rect, bin: null, pos: [0, 0], off: { x: 0, y: 0 } };
      st.sp = new Spring([0, 0], (v) => { st.pos = v; g.setAttribute("transform", `translate(${v[0]},${v[1]})`); }, { stiffness: 190, damping: 14 });
      g.addEventListener("pointerdown", (ev) => {
        if (st.bin) return;
        cardLayer.append(g);
        const p = Sim.svgPoint(svg, ev);
        st.off = { x: p.x - st.pos[0], y: p.y - st.pos[1] };
        rect.setAttribute("stroke", "var(--accent)"); rect.setAttribute("stroke-width", 2.5);
      });
      Sim.draggable(svg, g, (p) => {
        if (st.bin) return;
        st.sp.stop(); st.sp.jump([Sim.rubber(p.x - st.off.x, -20, W - cardW + 20), Sim.rubber(p.y - st.off.y, -20, H - cardH + 20)]);
        const k = binAt(p);
        binRects.forEach((r, i) => r.setAttribute("fill-opacity", i === k ? 0.95 : 0.55));
      }, (p) => drop(st, p));
      cardLayer.append(g);
      return st;
    });
    function binAt(p) {
      for (let i = 0; i < bins.length; i++) { const r = binBox(i); if (p.x >= r.x && p.x <= r.x + r.w && p.y >= r.y && p.y <= r.y + r.h) return i; }
      return -1;
    }
    function layout(first) {
      state.filter((st) => !st.bin).forEach((st, k) => {
        const x = pad + (k % trayCols) * cellW + (cellW - cardW) / 2, y = trayTop + 28 + Math.floor(k / trayCols) * (cardH + 8);
        if (first) st.sp.jump([x, y]); else st.sp.set([x, y]);
      });
      bins.forEach((b, i) => {
        const r = binBox(i);
        state.filter((st) => st.bin === b.key).forEach((st, j) => st.sp.set([r.x + (r.w - cardW) / 2, r.y + 40 + j * (cardH + 5)]));
      });
    }
    function drop(st, p) {
      binRects.forEach((r) => r.setAttribute("fill-opacity", 0.55));
      st.rect.setAttribute("stroke", "var(--line)"); st.rect.setAttribute("stroke-width", 1.5);
      if (st.bin) return;
      const k = binAt(p);
      if (k < 0) { layout(); return; }
      const b = bins[k];
      if (b.key !== st.c.a) {
        nWrong++; wrong.set(String(nWrong));
        fb.className = "feedback bad"; fb.textContent = `Not ${b.label}. ${st.c.why}`;
        st.rect.setAttribute("stroke", "var(--bad)"); st.rect.setAttribute("stroke-width", 2.5);
        setTimeout(() => { st.rect.setAttribute("stroke", "var(--line)"); st.rect.setAttribute("stroke-width", 1.5); }, 900);
        st.sp.vel = [0, -260];
        layout();
        return;
      }
      st.bin = b.key;
      const [soft, strong] = COLORS[b.color];
      st.rect.setAttribute("fill", soft); st.rect.setAttribute("stroke", strong);
      st.g.setAttribute("class", "");
      fb.className = "feedback ok"; fb.textContent = `Yes – ${b.label}. ${st.c.why}`;
      const n = state.filter((x) => x.bin).length;
      placed.set(`${n} / ${cards.length}`);
      layout();
      if (n === cards.length && onDone) onDone(nWrong);
    }
    root.append(svg, h("div", { class: "readout" }, placed.el, wrong.el), fb);
    layout(true);
    return () => state.forEach((st) => st.sp.stop());
  }

  const SRC_BINS = [
    { key: "int", group: "your own organization", label: "Internal", color: "a" },
    { key: "ext", group: "published by others", label: "External", color: "b" },
    { key: "itv", group: "asking people directly", label: "Interview", color: "y" },
    { key: "rt", group: "streams in as it happens", label: "Real-time", color: "g" },
  ];
  const SRC_CARDS = [
    { t: "Canteen POS log", sub: "the school’s own sales", a: "int", why: "The school collects it in its own operations – internal." },
    { t: "Attendance sheet", sub: "kept by the advisers", a: "int", why: "Recorded by the school itself – internal." },
    { t: "Clinic visit log", sub: "kept by the school nurse", a: "int", why: "The school’s own records – internal (and sensitive)." },
    { t: "PSA OpenSTAT table", sub: "published by government", a: "ext", why: "Produced and published by another organization – external." },
    { t: "Rainfall records", sub: "downloaded from an agency", a: "ext", why: "Collected by a weather agency, not by us – external." },
    { t: "data.gov.ph dataset", sub: "open government data", a: "ext", why: "An open dataset published by government – external." },
    { t: "Canteen manager talk", sub: "questions face to face", a: "itv", why: "Asking a person questions directly – interview data." },
    { t: "Focus group", sub: "six Grade 11 learners", a: "itv", why: "A guided group discussion – interview data." },
    { t: "Phone interview", sub: "with a barangay official", a: "itv", why: "Questions asked one-on-one – interview data." },
    { t: "Air-quality sensor", sub: "new reading every 5 min", a: "rt", why: "Readings arrive continuously as they are measured – real-time." },
    { t: "Jeepney GPS tracker", sub: "live location feed", a: "rt", why: "A live feed that updates every few seconds – real-time." },
    { t: "Live traffic feed", sub: "updates every minute", a: "rt", why: "Data that stream in as events happen – real-time." },
  ];

  function sourceSorter(root) {
    let stop = null;
    const area = h("div", { class: "stage-body" });
    function build() {
      if (stop) stop();
      clear(area);
      stop = sorter(area, { bins: SRC_BINS, cards: SRC_CARDS, onDone: (nw) => area.append(h("div", { class: "controls" },
        pill(nw <= 2, `All sorted with ${nw} wrong drop${nw === 1 ? "" : "s"}!`, `All sorted – ${nw} wrong drops. Try again for fewer.`),
        h("button", { class: "btn", type: "button", onclick: build }, "Shuffle and sort again"))) });
    }
    root.append(h("div", { class: "controls" }, h("span", {}, "Where does each dataset come from?"), h("button", { class: "btn ghost", type: "button", onclick: build }, "Restart")), area);
    build();
    return () => { if (stop) stop(); };
  }

  // ------------------------------------------------------------ three ways

  // Sample data in the style of a PSA OpenSTAT table – not official statistics.
  const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const PRICES = [48.2, 48.5, 48.1, 47.8, 47.6, 47.9, 48.4, 48.9, 49.3, 49.1, 48.7, 48.6];
  const p2 = (x) => x.toFixed(2);

  /** A small spreadsheet whose rows spring in. */
  function sheet(cols, { title, pandas = false } = {}) {
    const grid = "2.4em minmax(0,1fr) minmax(0,1.3fr)";
    const body = h("div", { style: "display:grid;gap:2px" });
    const el = h("div", { style: "border:1px solid var(--line);border-radius:8px;overflow:hidden;background:var(--paper);min-width:0" },
      title ? h("div", { style: "background:var(--accent);color:var(--accent-ink);padding:4px 8px;font-size:.85rem;font-weight:700" }, title) : null,
      h("div", { class: "num", style: `display:grid;grid-template-columns:${grid};gap:6px;padding:3px 8px;font-size:.78rem;color:var(--muted);background:var(--bg)` }, h("span", {}, pandas ? "" : "1"), ...cols.map((c) => h("span", {}, c))),
      body);
    const springs = [];
    let n = 0;
    return {
      el,
      add(cells, { bad = false, from = -40, delay = 0 } = {}) {
        n++;
        const row = h("div", { class: "num", style: `display:grid;grid-template-columns:${grid};gap:6px;padding:3px 8px;font-size:.86rem;opacity:0;${bad ? "background:color-mix(in srgb, var(--bad) 14%, transparent);" : ""}` },
          h("span", { style: "color:var(--muted)" }, String(pandas ? n - 1 : n + 1)), ...cells.map((c) => h("span", {}, c)));
        if (bad) row.title = "This value does not match the source";
        body.append(row);
        const sp = new Spring(0, (v) => { row.style.transform = `translateY(${(1 - v) * from}px)`; row.style.opacity = String(clamp(v, 0, 1)); }, { stiffness: 180, damping: 15 });
        springs.push(sp);
        if (delay) springs.push({ stop: ((t) => () => clearTimeout(t))(setTimeout(() => sp.set(1), delay)) }); else sp.set(1);
        return row;
      },
      reset() { springs.forEach((x) => x.stop()); springs.length = 0; clear(body); n = 0; },
      stop() { springs.forEach((x) => x.stop()); },
      get rows() { return n; },
    };
  }

  function typo(str) {
    const r = randInt(0, 2);
    if (r === 0) return str.replace(".", "");                       // dropped decimal point
    if (r === 1) { const d = str.split(""); const i = randInt(0, 1); [d[i], d[i + 1]] = [d[i + 1], d[i]]; return d.join(""); } // swapped digits
    return str.slice(0, -1) + String((+str.slice(-1) + 1) % 10);     // wrong last digit
  }

  function threeWays(root) {
    const results = {};
    let mode = "manual", stopMode = null;
    const area = h("div", { class: "stage-body" });
    const cmpBody = h("tbody");
    const timeBars = {};
    const METHODS = { manual: "Manual entry", dataset: "Public dataset", script: "Script (Colab)" };
    Object.keys(METHODS).forEach((k) => {
      const fill = h("div", { style: "height:10px;width:0;background:var(--shape-a);border-radius:5px" });
      timeBars[k] = { fill, sp: new Spring(0, (v) => { fill.style.width = `${clamp(v, 0, 100)}%`; }, { stiffness: 140, damping: 13 }) };
    });
    function drawCompare() {
      clear(cmpBody);
      const maxT = Math.max(60, ...Object.values(results).map((r) => r.time));
      Object.keys(METHODS).forEach((k) => {
        const r = results[k];
        cmpBody.append(h("tr", {}, h("td", {}, METHODS[k]),
          h("td", { class: "num" }, r ? `${fmt(r.time, 0)} s` : "–", h("div", { style: "background:var(--grid);border-radius:5px;margin-top:3px;min-width:60px" }, timeBars[k].fill)),
          h("td", { class: "num" }, r ? String(r.errors) : "–"), h("td", {}, r ? r.effort : "not tried yet")));
        timeBars[k].sp.set(r ? (r.time / maxT) * 100 : 0);
      });
    }

    function manual(box) {
      const sh = sheet(["month", "price (₱/kg)"], { title: "Untitled spreadsheet – typed by hand" });
      const src = h("div", { class: "workings", style: "line-height:1.45" },
        "Printed report (sample data)\nAverage retail price of rice, ₱/kg\n\n" + MONTHS.map((m, i) => `${m}  ${p2(PRICES[i])}`).join("\n"));
      const input = h("input", { type: "text", inputmode: "decimal", autocomplete: "off", "aria-label": "Price to type", style: "width:7em;padding:6px 8px;border:1px solid var(--line);border-radius:6px;background:var(--bg)" });
      const prompt = h("span", {});
      const clock = stat("Time:", "0 s"), errs = stat("Mistyped rows:", "0"), keys = stat("Keystrokes:", "0");
      let k = 0, errors = 0, strokes = 0, t0 = 0, simTime = 0, timers = [], busy = false;
      const elapsed = () => simTime + (t0 ? (performance.now() - t0) / 1000 : 0);
      const tick = setInterval(() => clock.set(`${fmt(elapsed(), 0)} s`), 250);
      const setPrompt = () => { prompt.textContent = k < 12 ? `Type the price for ${MONTHS[k]}, then press Enter:` : "All 12 rows typed."; input.disabled = k >= 12; };
      function commit(text) {
        const ok = Math.abs(parseFloat(text) - PRICES[k]) < 0.001 && /^\d+(\.\d+)?$/.test(text.trim());
        if (!ok) { errors++; errs.set(String(errors)); }
        sh.add([MONTHS[k], text.trim() || "(blank)"], { bad: !ok, from: 20 });
        k++; setPrompt();
        if (k === 12) finish();
      }
      function finish() {
        const time = elapsed();
        if (t0) { simTime = time; t0 = 0; }
        results.manual = { time, errors, effort: `${strokes} keystrokes, 12 rows` };
        drawCompare();
      }
      input.addEventListener("keydown", (e) => {
        if (busy || k >= 12) return;
        if (!t0) t0 = performance.now();
        if (e.key === "Enter") { e.preventDefault(); if (input.value.trim()) { commit(input.value); input.value = ""; } return; }
        if (e.key.length === 1) { strokes++; keys.set(String(strokes)); }
      });
      function autoType() {
        if (busy || k >= 12) return;
        busy = true; input.disabled = true;
        if (t0) { simTime = elapsed(); t0 = 0; }
        const step = () => {
          if (k >= 12) { busy = false; return; }
          const correct = p2(PRICES[k]), typed = Math.random() < 0.2 ? typo(correct) : correct;
          let c = 0;
          const type = () => {
            input.value = typed.slice(0, ++c); strokes++; keys.set(String(strokes));
            simTime += 0.9; clock.set(`${fmt(simTime, 0)} s`);
            if (c < typed.length) timers.push(setTimeout(type, Sim.reducedMotion() ? 0 : 45));
            else timers.push(setTimeout(() => { strokes++; simTime += 1.5; input.value = ""; commit(typed); timers.push(setTimeout(step, Sim.reducedMotion() ? 0 : 90)); }, Sim.reducedMotion() ? 0 : 80));
          };
          type();
        };
        step();
      }
      function reset() { timers.forEach(clearTimeout); timers = []; busy = false; sh.reset(); k = 0; errors = 0; strokes = 0; t0 = 0; simTime = 0; errs.set("0"); keys.set("0"); clock.set("0 s"); input.value = ""; setPrompt(); }
      box.append(h("p", {}, "Race the clock: copy the printed report into the sheet. Mistyped rows turn red."),
        h("div", { style: "display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:12px;align-items:start" }, src,
          h("div", { style: "display:grid;gap:8px;min-width:0" }, h("div", { class: "controls" }, prompt, input), sh.el)),
        h("div", { class: "controls" }, h("button", { class: "btn", type: "button", onclick: autoType }, "Auto-type the rest (a hurried typist)"), h("button", { class: "btn ghost", type: "button", onclick: reset }, "Start over")),
        h("div", { class: "readout" }, clock.el, errs.el, keys.el));
      setPrompt();
      return () => { clearInterval(tick); timers.forEach(clearTimeout); sh.stop(); };
    }

    function dataset(box) {
      const sh = sheet(["month", "price_php_per_kg"], { title: "rice_prices – imported" });
      const csv = h("pre", { class: "workings", style: "max-height:16em;overflow:auto" },
        "rice_prices_SAMPLE.csv\n(sample data in the style of a PSA OpenSTAT download)\n\nmonth,price_php_per_kg\n" + MONTHS.map((m, i) => `${m},${p2(PRICES[i])}`).join("\n"));
      const STEPS = ["Download the CSV", "File → Import", "Upload the file", "Insert new sheet"];
      const chips = STEPS.map((t) => h("span", { class: "chip", style: "transition:background .2s" }, t));
      let timers = [], done = false;
      function run() {
        if (done) return;
        done = true;
        chips.forEach((c, i) => timers.push(setTimeout(() => { c.style.background = "var(--accent)"; c.style.color = "var(--accent-ink)"; }, Sim.reducedMotion() ? 0 : 260 * i)));
        timers.push(setTimeout(() => {
          MONTHS.forEach((m, i) => sh.add([m, p2(PRICES[i])], { from: -60, delay: Sim.reducedMotion() ? 0 : 1 + i * 70 }));
          results.dataset = { time: 30, errors: 0, effort: "about 6 clicks – but check the source’s notes and units" };
          drawCompare();
        }, Sim.reducedMotion() ? 0 : 260 * STEPS.length));
      }
      function reset() { timers.forEach(clearTimeout); timers = []; done = false; sh.reset(); chips.forEach((c) => { c.style.background = ""; c.style.color = ""; }); }
      box.append(h("p", {}, "Download the agency’s CSV file and import it into Google Sheets. Watch the rows flow in."),
        h("div", { class: "controls" }, ...chips),
        h("div", { style: "display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:12px;align-items:start" }, csv, sh.el),
        h("div", { class: "controls" }, h("button", { class: "btn", type: "button", onclick: run }, "Import into Sheets"), h("button", { class: "btn ghost", type: "button", onclick: reset }, "Start over")),
        h("p", { class: "note" }, "Always read the dataset’s notes: units (₱ per kilogram), the period covered, and what each column means."));
      return () => { timers.forEach(clearTimeout); sh.stop(); };
    }

    function script(box) {
      const LINES = ["import pandas as pd", "url = \"https://example.org/rice_prices_SAMPLE.csv\"", "df = pd.read_csv(url)", "df.head()"];
      const bracket = h("span", { class: "num", style: "color:var(--muted);min-width:2.4em" }, "[ ]");
      const code = h("pre", { style: "margin:0;font-family:var(--mono);font-size:.88rem;white-space:pre-wrap;overflow-wrap:anywhere;flex:1;min-width:0" }, LINES.join("\n"));
      const cell = h("div", { style: "display:flex;gap:8px;align-items:flex-start;border:1px solid var(--line);border-left:4px solid var(--shape-a);border-radius:8px;padding:8px 10px;background:var(--bg)" }, bracket, code);
      const out = h("div", { style: "display:grid;gap:6px;min-width:0" });
      let timers = [], sh = null, done = false;
      function run() {
        if (done) return;
        done = true;
        bracket.textContent = "[*]";
        timers.push(setTimeout(() => {
          bracket.textContent = "[1]";
          sh = sheet(["month", "price_php_per_kg"], { title: "df.head() – the first 5 rows", pandas: true });
          out.append(sh.el);
          for (let i = 0; i < 5; i++) sh.add([MONTHS[i], p2(PRICES[i])], { from: -30, delay: Sim.reducedMotion() ? 0 : 1 + i * 80 });
          timers.push(setTimeout(() => out.append(h("pre", { class: "workings" }, "df.shape\n(12, 2)    ← 12 rows, 2 columns: all loaded")), Sim.reducedMotion() ? 0 : 520));
          results.script = { time: 2, errors: 0, effort: "4 lines once; re-run anytime for new data" };
          drawCompare();
        }, Sim.reducedMotion() ? 0 : 800));
      }
      function reset() { timers.forEach(clearTimeout); timers = []; done = false; if (sh) sh.stop(); sh = null; clear(out); bracket.textContent = "[ ]"; }
      box.append(h("p", {}, "A Google Colab cell reads the same CSV straight from its web address."), cell,
        h("div", { class: "controls" }, h("button", { class: "btn", type: "button", onclick: run }, "▶ Run cell"), h("button", { class: "btn ghost", type: "button", onclick: reset }, "Start over")), out,
        h("p", { class: "note" }, "The address is a placeholder for the lesson. Writing the code takes a few minutes the first time; after that, every new month is one click."));
      return () => { timers.forEach(clearTimeout); if (sh) sh.stop(); };
    }

    const views = { manual, dataset, script };
    const holder = h("div", { class: "stage-body" });
    function show(m) { mode = m; if (stopMode) stopMode(); clear(holder); stopMode = views[m](holder); }
    area.append(h("div", { class: "bigq" }, h("b", {}, "Question: "), "What was the average retail price of rice in each month of the year? (sample data)"),
      h("div", { class: "controls" }, segmented(Object.keys(METHODS), mode, show, (v) => `${Object.keys(METHODS).indexOf(v) + 1} · ${METHODS[v]}`)), holder,
      h("h3", {}, "Compare the three methods"),
      h("div", { class: "table-wrap" }, h("table", { class: "data" }, h("thead", {}, h("tr", {}, h("th", {}, "Method"), h("th", {}, "Time"), h("th", {}, "Errors"), h("th", {}, "Effort"))), cmpBody)));
    root.append(area);
    show(mode); drawCompare();
    return () => { if (stopMode) stopMode(); Object.values(timeBars).forEach((b) => b.sp.stop()); };
  }

  // ------------------------------------------------------------ is it reliable?

  const CRITERIA = ["Relevance", "Reliability", "Timeliness", "Privacy"];
  const CRIT_ASK = ["Does it answer our question?", "Is the source trustworthy and the method clear?", "Is it recent enough?", "Is personal data handled safely?"];
  const SOURCES = [
    { name: "Government station", full: "Government air-quality station data – official site, updated hourly; the station is 3 km from school", r: [4, 5, 5, 5],
      note: "Strong: official, current, and no personal data. Its one limit is distance – the station is 3 km away." },
    { name: "Viral post", full: "A viral post: “Manila air is the worst in Asia!” – no source given", r: [3, 1, 2, 4],
      note: "No method, date, or source. It may be old or exaggerated – trace it to the original before using it." },
    { name: "Class sensor", full: "Our class’s low-cost sensor readings at the school gate for one week", r: [5, 3, 4, 5],
      note: "Very relevant and current, but low-cost sensors drift; compare them with an official station, and one week is short." },
    { name: "2015 article", full: "A 2015 news article on Metro Manila air pollution from a major newspaper", r: [3, 4, 1, 5],
      note: "A reputable outlet, but more than ten years old – out of date for this school year." },
    { name: "“Feels bad” survey", full: "A survey asking learners for their name, address, and whether the air “feels bad”", r: [2, 2, 4, 1],
      note: "Feelings are not measurements, and names and addresses are not needed – a privacy risk with little value." },
  ];
  const verdict = (avg) => (avg >= 4 ? "Use it" : avg >= 3 ? "Use with care" : "Do not rely on it");

  function reliable(root) {
    const narrow = root.clientWidth < 540, W = narrow ? 360 : 600, H = 220;
    const mine = SOURCES.map(() => [3, 3, 3, 3]);
    let cur = 0, revealed = SOURCES.map(() => false);
    const full = h("p", { class: "bigq" });
    const svg = s("svg", { viewBox: `0 0 ${W} ${H}`, role: "img", "aria-label": "Your ratings compared with an analyst’s ratings" });
    const x0 = 34, y0 = H - 36, ch = H - 60, gw = (W - x0 - 8) / 4;
    for (let k = 1; k <= 5; k++) svg.append(s("line", { x1: x0, y1: y0 - (k / 5) * ch, x2: W - 8, y2: y0 - (k / 5) * ch, stroke: "var(--grid)" }), s("text", { x: x0 - 6, y: y0 - (k / 5) * ch + 4, "text-anchor": "end", class: "svg-text", "font-size": 11 }, String(k)));
    svg.append(s("line", { x1: x0, y1: y0, x2: W - 8, y2: y0, stroke: "var(--ink)", "stroke-width": 1.5 }));
    const bars = CRITERIA.map((c, i) => {
      const bx = x0 + i * gw;
      const you = s("rect", { x: bx + gw * 0.12, width: gw * 0.36, rx: 3, fill: "var(--shape-a-soft)", stroke: "var(--shape-a)", "stroke-width": 2 });
      const pro = s("rect", { x: bx + gw * 0.52, width: gw * 0.36, rx: 3, fill: "var(--gold-soft)", stroke: "var(--gold)", "stroke-width": 2 });
      svg.append(you, pro, s("text", { x: bx + gw / 2, y: y0 + 18, "text-anchor": "middle", class: "svg-label", "font-size": narrow ? 11 : 13, fill: "var(--ink)" }, c));
      return { you, pro };
    });
    svg.append(s("text", { x: W - 8, y: 14, "text-anchor": "end", class: "svg-label", "font-size": 12 }, "blue = you · gold = analyst"));
    let shown = [3, 3, 3, 3, 0, 0, 0, 0];
    const paint = () => bars.forEach((b, i) => {
      const hy = (Math.max(0, shown[i]) / 5) * ch, hp = (Math.max(0, shown[i + 4]) / 5) * ch;
      b.you.setAttribute("y", y0 - hy); b.you.setAttribute("height", hy);
      b.pro.setAttribute("y", y0 - hp); b.pro.setAttribute("height", hp);
    });
    const grow = new Spring(shown, (v) => { shown = v; paint(); }, { stiffness: 170, damping: 13 });
    const result = h("div", { "aria-live": "polite", style: "display:grid;gap:6px" });
    let syncing = false;
    const sliders = CRITERIA.map((c, i) => elasticSlider({ id: `da-l4-cr${i}`, label: c, min: 1, max: 5, value: 3, step: 1, format: (v) => fmt(v, 0),
      onInput: (v) => { if (syncing) return; mine[cur][i] = v; shown[i] = v; paint(); },
      onChange: (v) => { mine[cur][i] = v; showResult(); } }));
    sliders.forEach((sl) => { sl.el.querySelector(".eslider-label").style.minWidth = "6.5em"; });
    const avg = (a) => a.reduce((x, y) => x + y, 0) / a.length;
    function showResult() {
      clear(result);
      const a = avg(mine[cur].map(Math.round));
      result.append(h("div", { class: "readout" }, stat("Your average:", fmt(a, 2)).el, pill(a >= 3, `Your verdict: ${verdict(a)}`, `Your verdict: ${verdict(a)}`)));
      if (revealed[cur]) {
        const sc = SOURCES[cur], pa = avg(sc.r);
        result.append(h("div", { class: "readout" }, stat("Analyst average:", fmt(pa, 2)).el, pill(pa >= 3, `Analyst: ${verdict(pa)}`, `Analyst: ${verdict(pa)}`)), h("p", { class: "note" }, sc.note));
      }
    }
    function pick_(i) {
      cur = i; full.textContent = SOURCES[i].full;
      syncing = true; sliders.forEach((sl, j) => sl.jump(mine[i][j])); syncing = false;
      grow.set([...mine[i], ...(revealed[i] ? SOURCES[i].r : [0, 0, 0, 0])]);
      showResult();
    }
    root.append(h("div", { class: "bigq" }, h("b", {}, "Question: "), "Is the air near our school getting worse this school year?"),
      h("div", { class: "controls" }, h("span", {}, "Source"), segmented(SOURCES.map((_, i) => i), 0, pick_, (i) => SOURCES[i].name)), full,
      h("div", { style: "display:grid;gap:2px" }, sliders.map((sl, i) => h("div", {}, sl.el, h("p", { class: "note", style: "margin:-6px 0 4px" }, CRIT_ASK[i])))),
      h("div", { class: "controls" }, h("button", { class: "btn", type: "button", onclick: () => { revealed[cur] = true; grow.set([...mine[cur], ...SOURCES[cur].r]); showResult(); } }, "Compare with an analyst")),
      svg, result);
    pick_(0);
    return () => grow.stop();
  }

  // ------------------------------------------------------------ lesson

  Sim.register({
    id: "lesson4", unit: "2", num: 4, title: "Data Sources and Collection Methods", simName: "Collect It Three Ways",
    comps: ["A1.8", "A1.9", "L1", "M3"], sessions: "S9–S13", cg: "CG Part 1 · Content 4 (Data Sources and Collection Methods)", deped: "Sessions S9–S13",
    bigQuestion: "Where does good data come from, and how do we keep it safe?",
    mission: [
      "Source Sorter: sort all 12 sources into internal, external, interview, and real-time.",
      "Three Ways: type a few prices by hand, then let the hurried typist finish. How many rows went wrong?",
      "Import the same data as a public dataset, then load it with the Colab script. Compare time, errors, and effort.",
      "Is It Reliable?: rate all five sources, then compare with the analyst. Which source would you trust for the question?",
    ],
    discovery: "Data come from internal sources (an organization’s own records), external sources (published by others, such as government open data), interviews (asking people directly), and real-time streams (sensors and live feeds). The same data can be collected by manual entry, by importing a public dataset, or by a script: typing is slow and error-prone, importing is fast but needs checking of notes and units, and a script such as pd.read_csv(url) is fastest and repeatable once written. A good source is relevant, reliable, timely, and handles personal data safely.",
    mount(stage) {
      const body = h("div", { class: "stage-body" });
      const views = [sourceSorter, threeWays, reliable];
      let stopper = null;
      const t = tabs(["Source Sorter", "Three Ways", "Is It Reliable?"], (i) => { if (stopper) stopper(); clear(body); stopper = views[i](body) || null; });
      stage.append(t.el, body);
      stopper = sourceSorter(body);
      return () => { if (stopper) stopper(); };
    },
    check() {
      const kind = randInt(0, 4);
      const NAMES = { int: "Internal", ext: "External", itv: "Interview", rt: "Real-time" };
      if (kind === 0) { const c = pick(SRC_CARDS); return { q: `${c.t} (${c.sub}). What type of data source is this?`, choices: Object.values(NAMES), answer: NAMES[c.a], explain: c.why }; }
      if (kind === 1) {
        const rows = pick([12, 20, 30, 40]), sec = pick([4, 5, 6, 8]);
        return { q: `Typing one row by hand takes about ${sec} seconds. About how many minutes does it take to type ${rows * 3} rows?`, answer: (rows * 3 * sec) / 60, tol: 0.05, unit: "min", explain: `${rows * 3} × ${sec} s = ${rows * 3 * sec} s = ${fmt((rows * 3 * sec) / 60, 2)} min.` };
      }
      if (kind === 2) return pick([
        { q: "In Google Colab, which line loads a CSV file from a web address into a DataFrame?", choices: ["df = pd.read_csv(url)", "df.head()", "import pandas as pd", "df.to_csv(url)"], answer: "df = pd.read_csv(url)", explain: "pd.read_csv() reads a CSV file into a DataFrame." },
        { q: "What does df.head() show?", choices: ["The first 5 rows", "The column names only", "The last row", "The number of rows"], answer: "The first 5 rows", explain: "head() shows the first 5 rows by default." },
        { q: "df.shape returns (12, 2). What does this mean?", choices: ["12 rows and 2 columns", "2 rows and 12 columns", "12 errors", "the file is 12 KB"], answer: "12 rows and 2 columns", explain: "shape is (rows, columns)." },
        { q: "Which collection method is most likely to produce typing errors?", choices: ["Manual data entry", "Importing a public dataset", "A script that reads a CSV", "A sensor feed"], answer: "Manual data entry", explain: "People mistype – dropped decimals, swapped digits." },
      ]);
      if (kind === 3) {
        const sc = pick(SOURCES), a = sc.r.reduce((x, y) => x + y, 0) / 4;
        return { q: `An analyst rated “${sc.full}” as relevance ${sc.r[0]}, reliability ${sc.r[1]}, timeliness ${sc.r[2]}, privacy ${sc.r[3]} (out of 5). What is the average rating?`, answer: a, tol: 0.01, explain: `(${sc.r.join(" + ")}) ÷ 4 = ${fmt(a, 2)} → ${verdict(a)}.` };
      }
      const n = pick([12, 20, 25, 40]), bad = randInt(1, Math.round(n / 4));
      return { q: `A learner typed ${n} rows by hand and ${bad} of them did not match the source. What percent of the rows had errors?`, answer: (bad / n) * 100, tol: 0.05, unit: "%", explain: `${bad} ÷ ${n} = ${fmt(bad / n, 4)} = ${fmt((bad / n) * 100, 2)}%.` };
    },
  });
})();
