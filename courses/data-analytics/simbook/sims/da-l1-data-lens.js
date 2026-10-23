/* Data Analytics · Unit 1 · Lesson 1 · A. What Is Data Analytics? – Data Lens */
(function () {
  "use strict";
  const { h, s, clear, randInt, pick, shuffle, fmt, clamp, tabs, segmented, stat, pill, Spring } = Sim;

  const COLORS = {
    a: ["var(--shape-a-soft)", "var(--shape-a)"], b: ["var(--shape-b-soft)", "var(--shape-b)"],
    g: ["var(--accent-soft)", "var(--accent)"], y: ["var(--gold-soft)", "var(--gold)"],
  };
  const fitSize = (text, maxW, base) => Math.min(base, maxW / (String(text).length * 0.56));

  // ------------------------------------------------------------ drag-to-bin sorter

  /**
   * Cards live in a tray and are dragged into bins. Every card is a persistent SVG node
   * moved by its own spring: it follows the pointer, springs into its slot when right,
   * and rubber-bands back to the tray (with a reason) when wrong.
   */
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
    const svg = s("svg", { viewBox: `0 0 ${W} ${H}`, role: "img", "aria-label": "Drag each data card into the bin where it belongs" });
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
      // Bring the card to the front BEFORE Sim.draggable captures the pointer.
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
        fb.className = "feedback bad";
        fb.textContent = `Not ${b.label}. ${st.c.why}`;
        st.rect.setAttribute("stroke", "var(--bad)"); st.rect.setAttribute("stroke-width", 2.5);
        setTimeout(() => { st.rect.setAttribute("stroke", "var(--line)"); st.rect.setAttribute("stroke-width", 1.5); }, 900);
        // fling a little further into the bin, then rubber-band home
        st.sp.vel = [(st.pos[0] - (p.x - st.off.x)) * 4, -260];
        layout();
        return;
      }
      st.bin = b.key;
      const [soft, strong] = COLORS[b.color];
      st.rect.setAttribute("fill", soft); st.rect.setAttribute("stroke", strong);
      st.g.setAttribute("class", "");
      fb.className = "feedback ok";
      fb.textContent = `Yes – ${b.label}. ${st.c.why}`;
      const n = state.filter((x) => x.bin).length;
      placed.set(`${n} / ${cards.length}`);
      layout();
      if (n === cards.length && onDone) onDone(nWrong);
    }
    root.append(svg, h("div", { class: "readout" }, placed.el, wrong.el), fb);
    layout(true);
    return () => state.forEach((st) => st.sp.stop());
  }

  // ------------------------------------------------------------ data cards

  const TYPE_BINS = [
    { key: "nom", group: "Qualitative", label: "Nominal", color: "a" },
    { key: "ord", group: "Qualitative", label: "Ordinal", color: "a" },
    { key: "dis", group: "Quantitative", label: "Discrete", color: "b" },
    { key: "con", group: "Quantitative", label: "Continuous", color: "b" },
  ];
  const TYPE_CARDS = [
    { t: "Blue", sub: "favourite colour", a: "nom", why: "Colours are names with no order – qualitative, nominal." },
    { t: "Grade 11", sub: "grade level", a: "ord", why: "Grade levels are categories with a natural order – qualitative, ordinal." },
    { t: "Satisfied", sub: "canteen survey answer", a: "ord", why: "Very dissatisfied … very satisfied has an order, but the gaps are not measured – ordinal." },
    { t: "₱45.50", sub: "spent at the canteen", a: "con", why: "Money is measured and takes decimal values; analysts treat it as continuous." },
    { t: "3 siblings", sub: "number of siblings", a: "dis", why: "Siblings are counted in whole numbers – quantitative, discrete." },
    { t: "36.8 °C", sub: "body temperature", a: "con", why: "Temperature is measured and can be any value in a range – continuous." },
    { t: "San Antonio", sub: "barangay", a: "nom", why: "A barangay name is a category with no order – nominal." },
    { t: "12 absences", sub: "days absent this term", a: "dis", why: "Absences are counted – discrete." },
    { t: "1.62 m", sub: "height", a: "con", why: "Height is measured, not counted – continuous." },
    { t: "Gold medal", sub: "bronze, silver, gold", a: "ord", why: "Medals are ranked categories – ordinal." },
    { t: "Jeepney", sub: "way to get to school", a: "nom", why: "Ways of getting to school are categories with no order – nominal." },
    { t: "28 present", sub: "learners in 11-A today", a: "dis", why: "A number of learners is a count – discrete." },
  ];
  const STRUCT_BINS = [
    { key: "st", group: "fits in rows and columns", label: "Structured", color: "g" },
    { key: "un", group: "no fixed format", label: "Unstructured", color: "y" },
  ];
  const STRUCT_CARDS = [
    { t: "Attendance sheet", sub: "date, section, status", a: "st", why: "Every row has the same columns – structured." },
    { t: "Form responses", sub: "one row per learner", a: "st", why: "Google Form answers land in a table – structured." },
    { t: "Canteen POS log", sub: "time, item, price", a: "st", why: "A sales log is a table with fixed fields – structured." },
    { t: "Rainfall table", sub: "month, millimetres", a: "st", why: "Two fixed columns – structured." },
    { t: "Sensor readings", sub: "time, PM2.5 every 5 min", a: "st", why: "Each reading has the same fields – structured." },
    { t: "A tweet", sub: "“Ang init sa EDSA!”", a: "un", why: "Free text has no fixed fields – unstructured (we must extract data from it)." },
    { t: "A photo", sub: "of the flooded gate", a: "un", why: "An image is pixels, not rows and columns – unstructured." },
    { t: "Voice message", sub: "from a parent", a: "un", why: "Audio has no table form – unstructured." },
    { t: "CCTV video", sub: "of the canteen line", a: "un", why: "Video is unstructured until we count or tag things in it." },
    { t: "Reflection essay", sub: "one page of text", a: "un", why: "Paragraphs of text are unstructured." },
  ];

  function sortTab(root) {
    let mode = "type", stop = null;
    const area = h("div", { class: "stage-body" });
    function build() {
      if (stop) stop();
      clear(area);
      const cfg = mode === "type" ? { bins: TYPE_BINS, cards: TYPE_CARDS } : { bins: STRUCT_BINS, cards: STRUCT_CARDS };
      stop = sorter(area, { ...cfg, onDone: (nw) => area.append(h("div", { class: "controls" },
        pill(nw <= 2, `All sorted with ${nw} wrong drop${nw === 1 ? "" : "s"}!`, `All sorted – ${nw} wrong drops. Try again for fewer.`),
        h("button", { class: "btn", type: "button", onclick: build }, "Shuffle and sort again"))) });
    }
    root.append(h("div", { class: "controls" }, h("span", {}, "Sort by"),
      segmented(["type", "struct"], mode, (v) => { mode = v; build(); }, (v) => (v === "type" ? "Type of data" : "Structured or not")),
      h("button", { class: "btn ghost", type: "button", onclick: () => build() }, "Restart")), area);
    build();
    return () => { if (stop) stop(); };
  }

  // ------------------------------------------------------------ life cycle wheel

  const STAGES = [
    { name: "Plan", what: "Ask a clear question. Decide what data you need, where it will come from, and how it will be protected.",
      lsgh: "The Grade 11 team asks: “Which sections have the most late arrivals, and on which days?”",
      art: "Question: Which sections and days have\n          the most late arrivals in Q1?\nData:     date, section, learner ID, status,\n          minutes late" },
    { name: "Collect", what: "Gather the data – forms, sensors, records, public datasets, or scripts.",
      lsgh: "Each adviser fills in a Google Form every morning. Each submission is one row.",
      art: "2026-08-17, 11-A, S07, Late, 12\n2026-08-17, 11-A, S08, Present, 0\n2026-08-17, 11-B, S31, Absent," },
    { name: "Store", what: "Keep data organized and secure: one home folder, clear file names, access rights, and backups.",
      lsgh: "Responses go to one Sheet in a restricted Drive folder. Only the advisers and the analyst can open it.",
      art: "AttendanceWatch/\n  raw/attendance_2026-08_v1.csv\n  backup/ (weekly copy)\nShared with: advisers only" },
    { name: "Process", what: "Clean and prepare: fix missing, duplicate, and inconsistent entries; convert formats.",
      lsgh: "“late”, “Late ” and “LATE” all become Late. Two duplicate submissions are removed.",
      art: "before: 'late ', 'LATE', 'Late'\nafter:  'Late', 'Late', 'Late'\nduplicates removed: 2" },
    { name: "Analyze", what: "Summarize the data and look for patterns that answer the question.",
      lsgh: "Counting late arrivals per weekday shows that Mondays have the most.",
      art: "=COUNTIFS(C:C,\"Mon\",D:D,\"Late\")\nMon 42 · Tue 21 · Wed 18\nThu 19 · Fri 25" },
    { name: "Share", what: "Communicate the findings to the right audience with charts, dashboards, and a short story.",
      lsgh: "A one-page dashboard for the assistant principal – by section and day only, no learner names.",
      art: "Mon ██████████ 42\nTue █████ 21\nWed ████ 18\nThu ████ 19\nFri ██████ 25" },
    { name: "Archive", what: "Archive what policy says to keep; securely delete what is no longer needed.",
      lsgh: "At year end the summary is archived. Copies with learner IDs are deleted when no longer needed.",
      art: "summary_SY2026-27.pdf → archive/\nraw copies with IDs  → deleted\n(log the date and who did it)" },
  ];

  function lifeCycle(root) {
    const n = STAGES.length, cx = 180, cy = 150, R = 112;
    let idx = 0, steps = 0;
    const svg = s("svg", { viewBox: "0 0 360 300", role: "img", "aria-label": "The data life cycle as a wheel" });
    const ang = (k) => -Math.PI / 2 + (2 * Math.PI * k) / n;
    svg.append(s("circle", { cx, cy, r: R, fill: "none", stroke: "var(--line)", "stroke-width": 10 }));
    const arc = s("path", { fill: "none", stroke: "var(--accent)", "stroke-width": 10, "stroke-linecap": "round", opacity: 0.85 });
    svg.append(arc);
    for (let k = 0; k < n; k++) {
      const a = ang(k + 0.5), x = cx + R * Math.cos(a), y = cy + R * Math.sin(a);
      svg.append(s("path", { d: "M-5,-6 L5,0 L-5,6", transform: `translate(${x},${y}) rotate(${(a * 180) / Math.PI + 90})`, fill: "none", stroke: "var(--muted)", "stroke-width": 2 }));
    }
    const packet = s("circle", { r: 9, fill: "var(--gold)", stroke: "var(--paper)", "stroke-width": 2 });
    svg.append(packet);
    const nodes = STAGES.map((st, k) => {
      const a = ang(k), x = cx + R * Math.cos(a), y = cy + R * Math.sin(a);
      const g = s("g", { tabindex: 0, role: "button", "aria-label": `Stage ${k + 1}: ${st.name}`, style: "cursor:pointer" });
      const c = s("circle", { r: 24, fill: "var(--paper)", stroke: "var(--accent)", "stroke-width": 2.5 });
      g.append(c, s("text", { y: -2, "text-anchor": "middle", class: "svg-text", "font-size": 13, "font-weight": 700 }, String(k + 1)),
        s("text", { y: 12, "text-anchor": "middle", class: "svg-label", "font-size": 9.5, fill: "var(--ink)" }, st.name));
      g.addEventListener("click", () => go(k));
      g.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); go(k); } });
      svg.append(g);
      return { g, c, x, y };
    });
    const centre = s("text", { x: cx, y: cy - 6, "text-anchor": "middle", class: "svg-text", "font-size": 15, "font-weight": 700, fill: "var(--accent)" });
    const centreSub = s("text", { x: cx, y: cy + 14, "text-anchor": "middle", class: "svg-label", "font-size": 11 }, "LSGH Attendance Watch");
    svg.append(centre, centreSub);
    let pos = 0, sizes = STAGES.map((_, k) => (k === 0 ? 1 : 0));
    const paint = () => {
      const a = -Math.PI / 2 + (2 * Math.PI * pos) / n, px = cx + R * Math.cos(a), py = cy + R * Math.sin(a);
      packet.setAttribute("cx", px); packet.setAttribute("cy", py);
      const f = ((pos % n) + n) % n, sweep = (2 * Math.PI * f) / n;
      const ex = cx + R * Math.cos(-Math.PI / 2 + sweep), ey = cy + R * Math.sin(-Math.PI / 2 + sweep);
      arc.setAttribute("d", f < 0.01 ? "" : `M${cx},${cy - R} A${R},${R} 0 ${sweep > Math.PI ? 1 : 0} 1 ${ex},${ey}`);
      nodes.forEach((nd, k) => {
        const z = 1 + 0.32 * sizes[k];
        nd.g.setAttribute("transform", `translate(${nd.x},${nd.y}) scale(${z})`);
        nd.c.setAttribute("fill", sizes[k] > 0.5 ? "var(--accent-soft)" : "var(--paper)");
      });
    };
    const move = new Spring(0, (v) => { pos = v; paint(); }, { stiffness: 90, damping: 13 });
    const grow = new Spring(sizes, (v) => { sizes = v; paint(); }, { stiffness: 220, damping: 14 });

    const title = h("h3", {}), what = h("p", {}), lsgh = h("p", {}), art = h("pre", { class: "workings" });
    const panel = h("div", { class: "panel", style: "flex:1 1 260px" }, title, what, h("p", { class: "note" }, "In the LSGH Attendance Watch case:"), lsgh, art);
    const prev = h("button", { class: "btn ghost", type: "button", onclick: () => go(idx - 1, -1) }, "◀ Previous stage");
    const next = h("button", { class: "btn", type: "button", onclick: () => go(idx + 1, 1) }, "Next stage ▶");

    function go(k, dir) {
      const target = ((k % n) + n) % n;
      // Next/Previous move one step; clicking a stage travels forward around the cycle.
      steps += dir !== undefined ? dir : (target - idx + n) % n;
      idx = target;
      move.set(steps);
      grow.set(STAGES.map((_, j) => (j === idx ? 1 : 0)));
      const st = STAGES[idx];
      title.textContent = `Stage ${idx + 1} · ${st.name}`; what.textContent = st.what; lsgh.textContent = st.lsgh; art.textContent = st.art;
      centre.textContent = st.name;
    }
    root.append(h("div", { class: "controls" }, prev, next),
      h("div", { style: "display:flex;flex-wrap:wrap;gap:12px;align-items:flex-start" }, h("div", { style: "flex:1 1 300px;max-width:440px;min-width:0" }, svg), panel),
      h("p", { class: "note" }, "After stage 7 the cycle starts again: what we learn leads to new questions."));
    go(0); paint();
    return () => { move.stop(); grow.stop(); };
  }

  // ------------------------------------------------------------ which analysis?

  const KINDS = ["Descriptive", "Diagnostic", "Predictive", "Prescriptive"];
  const ASKS = { Descriptive: "What happened?", Diagnostic: "Why did it happen?", Predictive: "What is likely to happen?", Prescriptive: "What should we do?" };
  const QUESTIONS = [
    { q: "How many learners were late each day last week?", a: "Descriptive" },
    { q: "What was the average canteen sale per day in August?", a: "Descriptive" },
    { q: "Which section had the most absences in the first quarter?", a: "Descriptive" },
    { q: "Why did late arrivals jump on Mondays?", a: "Diagnostic" },
    { q: "Why did canteen sales drop in the second week of September?", a: "Diagnostic" },
    { q: "Was the drop in attendance linked to the heavy rains that week?", a: "Diagnostic" },
    { q: "How many learners are likely to be absent if a storm signal is raised tomorrow?", a: "Predictive" },
    { q: "About how many siopao will the canteen sell next Friday?", a: "Predictive" },
    { q: "Which learners are at risk of reaching 10 absences by December?", a: "Predictive" },
    { q: "What time should the gate open to cut late arrivals the most?", a: "Prescriptive" },
    { q: "How many siopao should the canteen order so it rarely runs out but wastes little?", a: "Prescriptive" },
    { q: "Which day should make-up classes be held to reach the most learners?", a: "Prescriptive" },
  ];

  function whichAnalysis(root) {
    let deck = shuffle(QUESTIONS), k = 0, right = 0, tries = 0, glow = [0, 0, 0, 0];
    const ladder = h("div", { style: "display:flex;gap:6px;align-items:flex-end;min-height:120px", role: "img", "aria-label": "Four types of analysis as rising steps" });
    const steps = KINDS.map((kind, i) => {
      const r = h("div", { style: `flex:1 1 0;min-width:0;height:${58 + i * 20}px;border:2px solid var(--shape-a);background:var(--shape-a-soft);border-radius:8px;padding:6px;display:grid;align-content:start;gap:2px;text-align:center` },
        h("b", { style: "font-size:.85rem;overflow-wrap:anywhere" }, kind), h("span", { class: "note", style: "font-size:.75rem" }, ASKS[kind]));
      ladder.append(r);
      return { r };
    });
    const paint = () => steps.forEach((st, i) => {
      st.r.style.transform = `translateY(${-10 * glow[i]}px)`;
      st.r.style.background = glow[i] > 0.4 ? "var(--gold-soft)" : "var(--shape-a-soft)";
      st.r.style.borderColor = glow[i] > 0.4 ? "var(--gold)" : "var(--shape-a)";
    });
    const lift = new Spring(glow, (v) => { glow = v; paint(); }, { stiffness: 200, damping: 12 });
    const card = h("p", { class: "bigq", style: "font-size:1.1rem" });
    const slide = new Spring(0, (v) => { card.style.transform = `translateX(${v}px)`; card.style.opacity = String(clamp(1 - Math.abs(v) / 140, 0, 1)); }, { stiffness: 170, damping: 15 });
    const row = h("div", { class: "choices" }), fb = h("div", { "aria-live": "polite" }), score = stat("Score:", "0 / 0");
    function next() {
      if (k === deck.length) { deck = shuffle(QUESTIONS); k = 0; }
      const item = deck[k];
      card.textContent = item.q; clear(fb); clear(row);
      slide.jump(130); slide.set(0); lift.set([0, 0, 0, 0]);
      let done = false;
      KINDS.forEach((kind) => row.append(h("button", { type: "button", onclick: (e) => {
        if (done) return;
        done = true; tries++;
        const ok = kind === item.a; if (ok) right++;
        score.set(`${right} / ${tries}`);
        e.currentTarget.style.borderColor = ok ? "var(--good)" : "var(--bad)";
        lift.set(KINDS.map((x) => (x === item.a ? 1 : 0)));
        fb.append(pill(ok, "Correct!", `It is ${item.a.toLowerCase()}.`), h("p", { class: "note" }, `This question asks “${ASKS[item.a]}” – ${item.a.toLowerCase()} analytics.`),
          h("div", { class: "controls" }, h("button", { class: "btn", type: "button", onclick: () => { k++; next(); } }, "Next question")));
      } }, kind)));
    }
    root.append(ladder, h("p", {}, "Which type of analysis answers this question?"), card, row, fb, h("div", { class: "readout" }, score.el));
    next();
    return () => { lift.stop(); slide.stop(); };
  }

  // ------------------------------------------------------------ lesson

  Sim.register({
    id: "lesson1", unit: "1", num: 1, letter: "A", title: "What Is Data Analytics?", simName: "Data Lens",
    comps: ["A1.1", "A1.2", "A1.3", "M1"], sessions: "S2–S4", cg: "CG Part 1 · Content 1 (Data)", deped: "Sessions S2–S4",
    bigQuestion: "What can data tell us – and what should it never be used for?",
    mission: [
      "Sort the Data: drag all 12 cards into the right bins. Which cards fooled you, and why?",
      "Switch to “Structured or not”. What makes a tweet or a photo hard to analyze?",
      "Life Cycle: step through all 7 stages of the LSGH Attendance Watch case. At which stages could privacy go wrong?",
      "Which Analysis?: get 8 questions right. What words in a question give away its type?",
    ],
    discovery: "Data are recorded facts. Qualitative data are categories – nominal (no order) or ordinal (ordered); quantitative data are numbers – discrete (counted) or continuous (measured). Structured data fit rows and columns; unstructured data (text, photos, video) do not. Every data project moves through a life cycle – plan, collect, store, process, analyze, share, archive or destroy. The question decides the analysis: descriptive (what happened), diagnostic (why), predictive (what will happen), prescriptive (what should we do).",
    mount(stage) {
      const body = h("div", { class: "stage-body" });
      const views = [sortTab, lifeCycle, whichAnalysis];
      let stopper = null;
      const t = tabs(["Sort the Data", "Life Cycle", "Which Analysis?"], (i) => { if (stopper) stopper(); clear(body); stopper = views[i](body) || null; });
      stage.append(t.el, body);
      stopper = sortTab(body);
      return () => { if (stopper) stopper(); };
    },
    check() {
      const kind = randInt(0, 4);
      const NAMES = { nom: "Qualitative – nominal", ord: "Qualitative – ordinal", dis: "Quantitative – discrete", con: "Quantitative – continuous" };
      if (kind === 0) {
        const c = pick(TYPE_CARDS);
        return { q: `“${c.t}” (${c.sub}). What type of data is this?`, choices: Object.values(NAMES), answer: NAMES[c.a], explain: c.why };
      }
      if (kind === 1) {
        const it = pick(QUESTIONS);
        return { q: `“${it.q}” Which type of analysis answers this?`, choices: KINDS, answer: it.a, explain: `It asks “${ASKS[it.a]}”.` };
      }
      if (kind === 2) {
        const i = randInt(0, STAGES.length - 2);
        return { q: `In the data life cycle, which stage comes right after “${STAGES[i].name}”?`, choices: shuffle([...shuffle(STAGES.map((x) => x.name).filter((x) => x !== STAGES[i + 1].name && x !== STAGES[i].name)).slice(0, 3), STAGES[i + 1].name]), answer: STAGES[i + 1].name, explain: `The order is ${STAGES.map((x) => x.name).join(" → ")}.` };
      }
      if (kind === 3) {
        const c = pick(STRUCT_CARDS);
        return { q: `Is “${c.t}” (${c.sub}) structured or unstructured data?`, choices: ["Structured", "Unstructured"], answer: c.a === "st" ? "Structured" : "Unstructured", explain: c.why };
      }
      const set = shuffle(TYPE_CARDS).slice(0, 5), nq = set.filter((c) => c.a === "dis" || c.a === "con").length;
      return { q: `How many of these are quantitative data? ${set.map((c) => `${c.t} (${c.sub})`).join("; ")}.`, answer: nq, tol: 0, explain: `Quantitative (counted or measured): ${set.filter((c) => c.a === "dis" || c.a === "con").map((c) => c.t).join(", ") || "none"}.` };
    },
  });
})();
