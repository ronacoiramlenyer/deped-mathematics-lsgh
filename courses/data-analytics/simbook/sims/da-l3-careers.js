/* Data Analytics · Unit 1 · Lesson 3 · C. Applications and Careers in Data Analytics – Analytics Everywhere */
(function () {
  "use strict";
  const { h, s, clear, randInt, pick, shuffle, fmt, clamp, tabs, segmented, stat, pill, Spring, elasticSlider } = Sim;

  const niceMax = (m) => { const p = 10 ** Math.floor(Math.log10(Math.max(1, m))); for (const k of [1, 2, 2.5, 5, 10]) if (k * p >= m) return k * p; return 10 * p; };

  // Sample data for illustration only – not official statistics.
  const SECTORS = {
    retail: { name: "Retail", q: "Which snacks sell best at the school canteen?", data: "Point-of-sale log: time, item, price, quantity", kind: "Descriptive",
      analysis: "Total units sold per item in one week (a SUMIF or a pivot table)", decision: "Order more of the top sellers; drop items that rarely sell.",
      chart: { title: "Units sold in one week", unit: "units", labels: ["Siopao", "Turon", "Pancit", "Rice meal", "Banana cue", "Juice"], values: [420, 310, 260, 380, 190, 450] } },
    health: { name: "Health", q: "When do dengue cases rise in our barangay?", data: "Barangay health center weekly case log and rainfall", kind: "Predictive",
      analysis: "Cases per month compared with rainfall to anticipate the peak", decision: "Start clean-up drives before the peak months, not after.",
      chart: { title: "Dengue cases per month", unit: "cases", labels: ["Jun", "Jul", "Aug", "Sep", "Oct", "Nov"], values: [12, 28, 46, 51, 33, 15] } },
    sports: { name: "Sports", q: "From where does our varsity team score best?", data: "Shot chart from game videos: zone, made or missed", kind: "Descriptive",
      analysis: "Field-goal percentage for each court zone", decision: "Practise plays that create shots from the best zones.",
      chart: { title: "Field-goal % by zone", unit: "%", labels: ["Paint", "Mid L", "Mid R", "Corner 3", "Wing 3", "Top 3"], values: [58, 41, 39, 44, 33, 31] } },
    government: { name: "Government", q: "Where should the city place a new flood pump?", data: "Flood reports per zone, rainfall, and an elevation map", kind: "Prescriptive",
      analysis: "Which zones flood most and why, then which site protects the most households", decision: "Install the pump where it protects the most households.",
      chart: { title: "Flood reports in one rainy season", unit: "reports", labels: ["Zone 1", "Zone 2", "Zone 3", "Zone 4", "Zone 5", "Zone 6"], values: [34, 21, 47, 18, 12, 9] } },
    education: { name: "Education", q: "Which sections need attendance support?", data: "Daily attendance sheet (LSGH Attendance Watch)", kind: "Diagnostic",
      analysis: "Late arrivals per section, then why the top sections are late (rain, transport, schedule)", decision: "Meet the advisers of the top sections; adjust the gate schedule.",
      chart: { title: "Late arrivals in August", unit: "late", labels: ["11-A", "11-B", "11-C", "12-A", "12-B", "12-C"], values: [18, 32, 14, 25, 40, 21] } },
    transport: { name: "Transport", q: "When are jeepney queues longest at the terminal?", data: "Passenger counts every hour (manual count or a GPS feed)", kind: "Predictive",
      analysis: "Average passengers waiting per hour to forecast the rush", decision: "Dispatch more jeepneys just before the peak hours.",
      chart: { title: "Passengers waiting per hour", unit: "people", labels: ["6 AM", "7 AM", "8 AM", "12 NN", "5 PM", "7 PM"], values: [120, 260, 180, 90, 300, 150] } },
    agriculture: { name: "Agriculture", q: "When should rice farmers plant?", data: "Monthly rainfall records and past harvests", kind: "Prescriptive",
      analysis: "Rainfall pattern and past yields for each planting month", decision: "Plant early in the rainy season so the harvest avoids peak typhoon months.",
      chart: { title: "Average rainfall per month", unit: "mm", labels: ["Apr", "May", "Jun", "Jul", "Aug", "Sep"], values: [20, 140, 260, 410, 450, 380] } },
  };

  function industryMap(root) {
    const narrow = root.clientWidth < 540, W = narrow ? 360 : 600, H = 230;
    let key = "retail", vals = [...SECTORS.retail.chart.values, niceMax(Math.max(...SECTORS.retail.chart.values))], timers = [];
    const flow = h("div", { style: "display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:10px" });
    const STEPS = [["Question", "q", "var(--gold)"], ["Data", "data", "var(--shape-a)"], ["Analysis", "analysis", "var(--shape-b)"], ["Decision", "decision", "var(--accent)"]];
    const cards = STEPS.map(([label, , color], i) => {
      const body = h("p", { style: "margin:0" });
      const tag = h("span", { class: "eyebrow", style: `color:${color}` }, `${i + 1} · ${label}`);
      const el = h("div", { class: "panel", style: `border-top:4px solid ${color};gap:6px;align-content:start;will-change:transform` }, tag, body);
      flow.append(el);
      const c = { el, body, tag, label };
      c.sp = new Spring(1, (v) => { el.style.transform = `translateY(${(1 - v) * 26}px)`; el.style.opacity = String(clamp(v, 0, 1)); }, { stiffness: 200, damping: 14 });
      return c;
    });
    const svg = s("svg", { viewBox: `0 0 ${W} ${H}`, role: "img", "aria-label": "Small bar chart of sample data for the sector" });
    const title = h("p", { style: "margin:0;font-weight:700" }), kindTag = h("span", { class: "chip" });
    const x0 = 46, y0 = H - 34, cw = W - x0 - 10, ch = H - 64;
    const grid = s("g"), barsG = s("g");
    svg.append(grid, barsG);
    const bars = Array.from({ length: 6 }, (_, i) => {
      const bw = cw / 6;
      const r = s("rect", { x: x0 + i * bw + bw * 0.15, width: bw * 0.7, rx: 3, fill: "var(--shape-a-soft)", stroke: "var(--shape-a)", "stroke-width": 2 });
      const lab = s("text", { x: x0 + i * bw + bw / 2, y: y0 + 18, "text-anchor": "middle", class: "svg-label", "font-size": narrow ? 11 : 13, fill: "var(--ink)" });
      const val = s("text", { x: x0 + i * bw + bw / 2, "text-anchor": "middle", class: "svg-text", "font-size": narrow ? 11 : 13, "font-weight": 700 });
      barsG.append(r, lab, val);
      return { r, lab, val };
    });
    function paint() {
      const max = Math.max(1, vals[6]), top = Math.max(...SECTORS[key].chart.values);
      clear(grid);
      for (let k = 0; k <= 4; k++) {
        const y = y0 - (k / 4) * ch;
        grid.append(s("line", { x1: x0, y1: y, x2: W - 10, y2: y, stroke: "var(--grid)" }),
          s("text", { x: x0 - 6, y: y + 4, "text-anchor": "end", class: "svg-text", "font-size": 11 }, fmt((max * k) / 4, 0)));
      }
      grid.append(s("line", { x1: x0, y1: y0, x2: W - 10, y2: y0, stroke: "var(--ink)", "stroke-width": 1.5 }));
      bars.forEach((b, i) => {
        const v = Math.max(0, vals[i]), bh = Math.min(ch + 10, (v / max) * ch), isTop = SECTORS[key].chart.values[i] === top;
        b.r.setAttribute("y", y0 - bh); b.r.setAttribute("height", bh);
        b.r.setAttribute("fill", isTop ? "var(--gold-soft)" : "var(--shape-a-soft)"); b.r.setAttribute("stroke", isTop ? "var(--gold)" : "var(--shape-a)");
        b.val.setAttribute("y", y0 - bh - 5); b.val.textContent = fmt(v, 0);
      });
    }
    const grow = new Spring(vals, (v) => { vals = v; paint(); }, { stiffness: 140, damping: 13 });
    function show(k) {
      key = k;
      const sc = SECTORS[k];
      timers.forEach(clearTimeout); timers = [];
      cards.forEach((c, i) => {
        c.sp.jump(0);
        c.body.textContent = sc[STEPS[i][1]];
        timers.push(setTimeout(() => c.sp.set(1), 90 * i));
      });
      title.textContent = `${sc.chart.title} (${sc.chart.unit}) – sample data`;
      kindTag.textContent = `Mostly ${sc.kind.toLowerCase()} analytics`;
      bars.forEach((b, i) => { b.lab.textContent = sc.chart.labels[i]; });
      grow.set([...sc.chart.values, niceMax(Math.max(...sc.chart.values))]);
    }
    root.append(h("div", { class: "controls" }, h("span", {}, "Sector"), segmented(Object.keys(SECTORS), key, show, (v) => SECTORS[v].name)),
      flow, h("div", { class: "controls" }, title, kindTag), svg,
      h("p", { class: "note" }, "Every application follows the same path: a question, the data that can answer it, an analysis, and a decision someone makes. The highlighted bar is the one the decision acts on."));
    paint(); show(key);
    return () => { timers.forEach(clearTimeout); grow.stop(); cards.forEach((c) => c.sp.stop()); };
  }

  // ------------------------------------------------------------ skill builder

  const SKILLS = ["Statistics", "Spreadsheets", "Programming", "Visualization", "Communication", "Domain knowledge", "Ethics"];
  const ROLES = [
    { name: "Data analyst", p: [7, 9, 5, 8, 8, 6, 7], does: "cleans and summarizes data and reports what happened and why" },
    { name: "BI analyst", p: [5, 8, 4, 10, 8, 7, 6], does: "builds dashboards and reports that managers check every day" },
    { name: "Data engineer", p: [4, 5, 10, 4, 5, 5, 7], does: "builds the pipelines and databases that collect and store data" },
    { name: "Data scientist", p: [10, 5, 9, 6, 6, 6, 7], does: "builds statistical and machine-learning models to predict" },
    { name: "Research analyst", p: [9, 6, 4, 6, 9, 9, 8], does: "designs studies and surveys and writes up findings" },
  ];
  const matchOf = (p, v) => { const rms = Math.sqrt(p.reduce((a, x, i) => a + (x - v[i]) ** 2, 0) / p.length); return clamp(100 * (1 - rms / 6), 0, 100); };

  function skillBuilder(root) {
    const vals = [5, 5, 5, 5, 5, 5, 5];
    const cx = 180, cy = 165, R = 112, n = SKILLS.length;
    const pt = (i, v) => { const a = -Math.PI / 2 + (2 * Math.PI * i) / n; return [cx + (R * v * Math.cos(a)) / 10, cy + (R * v * Math.sin(a)) / 10]; };
    const svg = s("svg", { viewBox: "-62 0 484 330", role: "img", "aria-label": "Radar chart of your skill profile" });
    for (const lv of [2, 4, 6, 8, 10]) svg.append(s("polygon", { points: SKILLS.map((_, i) => pt(i, lv).join(",")).join(" "), fill: "none", stroke: "var(--grid)", "stroke-width": lv === 10 ? 2 : 1 }));
    SKILLS.forEach((sk, i) => {
      const [x, y] = pt(i, 10), [lx, ly] = pt(i, 12.3);
      svg.append(s("line", { x1: cx, y1: cy, x2: x, y2: y, stroke: "var(--grid)" }),
        s("text", { x: lx, y: ly + 4, "text-anchor": Math.abs(lx - cx) < 8 ? "middle" : lx > cx ? "start" : "end", class: "svg-label", "font-size": 12, fill: "var(--ink)" }, sk));
    });
    const ghost = s("polygon", { fill: "none", stroke: "var(--gold)", "stroke-width": 2.5, "stroke-dasharray": "6 4" });
    const mine = s("polygon", { fill: "var(--shape-a-soft)", stroke: "var(--shape-a)", "stroke-width": 2.5, "stroke-linejoin": "round" });
    const dots = SKILLS.map(() => s("circle", { r: 4, fill: "var(--shape-a)" }));
    const legend = s("text", { x: -50, y: 322, class: "svg-label", "font-size": 12 });
    svg.append(ghost, mine, ...dots, legend);
    let ghostVals = ROLES[0].p.slice();
    const ghostSp = new Spring(ghostVals, (v) => { ghostVals = v; ghost.setAttribute("points", v.map((x, i) => pt(i, x).join(",")).join(" ")); }, { stiffness: 120, damping: 12 });
    ghostSp.jump(ghostVals);

    const RH = 46;
    const list = h("div", { style: `position:relative;height:${ROLES.length * RH}px` });
    const rows = ROLES.map((r, i) => {
      const fill = h("div", { style: "height:8px;width:0;background:var(--accent);border-radius:4px" });
      const pct = h("b", { class: "num" });
      const el = h("div", { style: `position:absolute;left:0;right:0;top:0;height:${RH - 6}px;display:grid;grid-template-columns:minmax(0,1fr) 3.6em;gap:2px 8px;align-items:center;will-change:transform` },
        h("span", { style: "font-weight:700;font-size:.92rem" }, r.name), pct,
        h("div", { style: "grid-column:1 / -1;height:8px;background:var(--grid);border-radius:4px;overflow:hidden" }, fill));
      list.append(el);
      const row = { r, el, fill, pct, w: 0 };
      row.ySp = new Spring(i * RH, (y) => { el.style.transform = `translateY(${y}px)`; }, { stiffness: 170, damping: 16 });
      row.ySp.jump(i * RH);
      row.wSp = new Spring(0, (w) => { fill.style.width = `${clamp(w, 0, 100)}%`; pct.textContent = `${Math.round(clamp(w, 0, 100))}%`; }, { stiffness: 160, damping: 14 });
      return row;
    });
    const best = h("p", { class: "bigq" });
    let bestName = "";
    function update() {
      mine.setAttribute("points", vals.map((v, i) => pt(i, v).join(",")).join(" "));
      dots.forEach((d, i) => { const [x, y] = pt(i, vals[i]); d.setAttribute("cx", x); d.setAttribute("cy", y); });
      const scored = rows.map((row) => ({ row, m: matchOf(row.r.p, vals) })).sort((a, b) => b.m - a.m);
      scored.forEach(({ row, m }, pos) => { row.ySp.set(pos * RH); row.wSp.set(m); row.fill.style.background = pos === 0 ? "var(--gold)" : "var(--accent)"; });
      const top = scored[0].row.r;
      if (top.name !== bestName) { bestName = top.name; ghostSp.set(top.p); }
      legend.textContent = `blue = you · dashed gold = typical ${top.name.toLowerCase()}`;
      best.textContent = `Closest match: ${top.name} – ${top.does}.`;
    }
    const sliders = SKILLS.map((sk, i) => elasticSlider({ id: `da-l3-sk${i}`, label: sk, min: 0, max: 10, value: vals[i], step: 1, format: (v) => fmt(v, 0),
      onInput: (v) => { vals[i] = v; if (rows.length) update(); } }));
    sliders.forEach((sl) => { sl.el.querySelector(".eslider-label").style.minWidth = "9.2em"; });
    const presets = h("div", { class: "controls" }, h("span", {}, "Load a profile:"),
      ...ROLES.map((r) => h("button", { class: "btn ghost", type: "button", onclick: () => sliders.forEach((sl, i) => sl.set(r.p[i])) }, r.name)),
      h("button", { class: "btn ghost", type: "button", onclick: () => sliders.forEach((sl) => sl.set(5)) }, "Reset"));
    root.append(h("p", {}, "Rate yourself from 0 to 10 on each skill. Watch your profile – and the closest career role – change."),
      h("div", { style: "display:grid;gap:4px" }, sliders.map((sl) => sl.el)), presets,
      h("div", { style: "display:flex;flex-wrap:wrap;gap:16px;align-items:flex-start" },
        h("div", { style: "flex:1 1 280px;max-width:420px;min-width:0" }, svg),
        h("div", { style: "flex:1 1 240px;min-width:0;display:grid;gap:8px" }, h("b", {}, "Match with career roles"), list, best)),
      h("p", { class: "note" }, "The role profiles are rough guides for discussion, not a test. Real teams mix people with different strengths."));
    update();
    return () => { ghostSp.stop(); rows.forEach((r) => { r.ySp.stop(); r.wSp.stop(); }); };
  }

  // ------------------------------------------------------------ lesson

  Sim.register({
    id: "lesson3", unit: "1", num: 3, title: "Applications and Careers in Data Analytics", simName: "Analytics Everywhere",
    comps: ["A1.6", "A1.7"], sessions: "S7", cg: "CG Part 1 · Content 3 (Applications of Data Analytics)", deped: "Session S7",
    bigQuestion: "What can data tell us – and what should it never be used for?",
    mission: [
      "Industry Map: visit all seven sectors. What four steps does every application share?",
      "Find a sector that uses predictive analytics and one that uses prescriptive analytics. How are their decisions different?",
      "Skill Builder: rate yourself honestly. Which role is your closest match, and which skill would you grow first?",
      "Load the Data engineer profile, then the BI analyst profile. Which skills make them so different?",
    ],
    discovery: "Data analytics is used in every sector – retail, health, sports, government, education, transport, and agriculture – and always follows the same path: a question, data that can answer it, an analysis, and a decision. Analysts need a mix of skills: statistics, spreadsheets, programming, visualization, communication, knowledge of the field, and ethics. Different careers weigh these differently: a data engineer leans on programming, a BI analyst on dashboards, a data scientist on statistics and models, a research analyst on study design and writing.",
    mount(stage) {
      const body = h("div", { class: "stage-body" });
      const views = [industryMap, skillBuilder];
      let stopper = null;
      const t = tabs(["Industry Map", "Skill Builder"], (i) => { if (stopper) stopper(); clear(body); stopper = views[i](body) || null; });
      stage.append(t.el, body);
      stopper = industryMap(body);
      return () => { if (stopper) stopper(); };
    },
    check() {
      const kind = randInt(0, 3);
      if (kind === 0) {
        const r = pick(ROLES);
        return { q: `Which career role ${r.does}?`, choices: ROLES.map((x) => x.name), answer: r.name, explain: `A ${r.name.toLowerCase()} ${r.does}.` };
      }
      if (kind === 1) {
        const sc = SECTORS[pick(Object.keys(SECTORS))];
        return { q: `${sc.name}: “${sc.q}” The decision is: “${sc.decision}” What is the data source?`, choices: shuffle([sc.data, ...shuffle(Object.values(SECTORS).filter((x) => x !== sc).map((x) => x.data)).slice(0, 2)]), answer: sc.data, explain: `The data that can answer this question: ${sc.data.toLowerCase()}.` };
      }
      if (kind === 2) {
        const sc = SECTORS[pick(Object.keys(SECTORS))], i = randInt(0, 4), j = randInt(i + 1, 5);
        const a = sc.chart.values[i], b = sc.chart.values[j];
        return { q: `${sc.chart.title} (sample data): ${sc.chart.labels.map((l, k) => `${l} ${sc.chart.values[k]}`).join(", ")}. What is the difference between ${sc.chart.labels[i]} and ${sc.chart.labels[j]}?`, answer: Math.abs(a - b), tol: 0, explain: `|${a} − ${b}| = ${Math.abs(a - b)}.` };
      }
      return pick([
        { q: "Which skill helps an analyst explain findings clearly to the principal?", choices: ["Communication", "Programming", "Typing speed", "Hardware repair"], answer: "Communication", explain: "Findings help only when decision makers understand them." },
        { q: "Knowing how a canteen or a hospital works is called…", choices: ["Domain knowledge", "Statistics", "Programming", "Visualization"], answer: "Domain knowledge", explain: "Domain knowledge is understanding the field where the data come from." },
        { q: "Which skill matters most for deciding whether a dataset may be shared?", choices: ["Ethics", "Visualization", "Spreadsheets", "Programming"], answer: "Ethics", explain: "Sharing decisions depend on privacy and ethical principles." },
        { q: "A hospital uses past admissions to estimate how many beds it will need next month. Which type of analysis is this?", choices: ["Predictive", "Descriptive", "Diagnostic", "Prescriptive"], answer: "Predictive", explain: "Estimating a future value is predictive." },
      ]);
    },
  });
})();
