/* Term 2 · Lesson 6 · F. Data Collection and Sampling – Sampling Lab */
(function () {
  "use strict";
  const { h, s, clear, randInt, pick, shuffle, fmt, tabs, segmented, stat, pill, Spring, elasticSlider } = Sim;

  // 400 students in 10 sections (rows of 40). Sections near the gate (rows 0–2) walk to
  // school far more often – so a sample taken only there is biased.
  function makePopulation() {
    const pop = [];
    for (let r = 0; r < 10; r++) for (let c = 0; c < 40; c++) {
      const p = r < 3 ? 0.7 : 0.2;
      pop.push({ r, c, walks: Math.random() < p });
    }
    return pop;
  }

  const METHODS = {
    random: { label: "Simple random", how: "every student has the same chance" },
    systematic: { label: "Systematic", how: "every k-th student on the list" },
    stratified: { label: "Stratified", how: "the same number from each section" },
    convenience: { label: "Convenience", how: "whoever is near the gate" },
  };

  function pickSample(pop, method, n) {
    if (method === "random") return shuffle(pop.map((_, i) => i)).slice(0, n);
    if (method === "systematic") { const k = Math.floor(pop.length / n), start = randInt(0, k - 1); return Array.from({ length: n }, (_, i) => start + i * k); }
    if (method === "stratified") { const per = Math.max(1, Math.round(n / 10)); return Array.from({ length: 10 }, (_, r) => shuffle(Array.from({ length: 40 }, (_, c) => r * 40 + c)).slice(0, per)).flat(); }
    return Array.from({ length: n }, (_, i) => i); // first rows only
  }

  function lab(root) {
    let pop = makePopulation(), method = "random", n = 40, chosen = [], history = [], glow = 0;
    const truth = pop.filter((p) => p.walks).length / pop.length;
    const svg = s("svg", { viewBox: "0 0 600 300", role: "img", "aria-label": "Population of 400 students" });
    const plot = s("svg", { viewBox: "0 0 600 110", role: "img", "aria-label": "Dot plot of sample estimates" });
    const out = h("div", { class: "readout" });
    const pulse = new Spring(0, (v) => { glow = v; drawPop(); }, { stiffness: 120, damping: 10 });
    function drawPop() {
      clear(svg);
      svg.append(s("text", { x: 4, y: 12, class: "svg-label" }, "gate →"));
      const set = new Set(chosen);
      pop.forEach((p, i) => {
        const x = 30 + p.c * 14, y = 26 + p.r * 27, on = set.has(i);
        svg.append(s("circle", { cx: x, cy: y, r: on ? 4.5 + glow * 2 : 4, fill: p.walks ? "var(--shape-b)" : "var(--shape-a)", opacity: on ? 1 : 0.28, stroke: on ? "var(--ink)" : "none", "stroke-width": 1 }));
      });
      svg.append(s("text", { x: 596, y: 294, "text-anchor": "end", class: "svg-label" }, "orange = walks to school · blue = does not"));
    }
    function drawPlot() {
      clear(plot);
      const X = (v) => 30 + v * 540;
      plot.append(s("line", { x1: 30, y1: 70, x2: 570, y2: 70, stroke: "var(--ink)", "stroke-width": 1.5 }));
      [0, 0.25, 0.5, 0.75, 1].forEach((t) => { plot.append(s("line", { x1: X(t), y1: 66, x2: X(t), y2: 74, stroke: "var(--ink)" }), s("text", { x: X(t), y: 92, "text-anchor": "middle", class: "svg-text", "font-size": 11 }, `${t * 100}%`)); });
      plot.append(s("line", { x1: X(truth), y1: 8, x2: X(truth), y2: 74, stroke: "var(--accent)", "stroke-width": 2, "stroke-dasharray": "5 4" }));
      plot.append(s("text", { x: X(truth) + 4, y: 14, class: "svg-label" }, `true value ${fmt(truth * 100, 1)}%`));
      const stacks = {};
      history.forEach((hh) => {
        const b = Math.round(hh.est * 100 / 2); const k = (stacks[b] = (stacks[b] || 0) + 1);
        plot.append(s("circle", { cx: X(b * 2 / 100), cy: 64 - (k - 1) * 8, r: 3.6, fill: hh.method === "convenience" ? "var(--shape-b)" : "var(--shape-a)" }));
      });
    }
    function take() {
      chosen = pickSample(pop, method, n);
      const est = chosen.filter((i) => pop[i].walks).length / chosen.length;
      history.push({ est, method });
      pulse.jump(1); pulse.set(0);
      drawPlot();
      clear(out);
      out.append(stat("Sample size:", String(chosen.length)).el, stat("Sample estimate:", `${fmt(est * 100, 1)}%`).el, stat("True percent:", `${fmt(truth * 100, 1)}%`).el,
        pill(Math.abs(est - truth) <= 0.08, "Close to the true value", "Far from the true value"));
    }
    root.append(h("div", { class: "controls" }, h("span", {}, "Method"),
      segmented(Object.keys(METHODS), method, (v) => { method = v; }, (v) => METHODS[v].label)),
    h("div", { class: "controls" },
      elasticSlider({ id: "t2l6-n", label: "Sample size", min: 10, max: 100, value: n, step: 10, format: (v) => fmt(v, 0), onInput: (v) => { n = Math.round(v / 10) * 10 || 10; } }).el,
      h("button", { class: "btn", type: "button", onclick: take }, "Take a sample"),
      h("button", { class: "btn ghost", type: "button", onclick: () => { for (let k = 0; k < 10; k++) take(); } }, "Take 10 samples"),
      h("button", { class: "btn ghost", type: "button", onclick: () => { history = []; chosen = []; drawPop(); drawPlot(); clear(out); } }, "Clear")),
    svg, out, h("p", { class: "note" }, "Each dot below is one sample’s estimate (orange dots came from convenience samples)."), plot);
    drawPop(); drawPlot();
    return () => pulse.stop();
  }

  const SCENARIOS = [
    { t: "Finding out the favourite snack of every Grade 7 learner by handing out a form", a: "Survey" },
    { t: "Asking the canteen manager detailed questions about weekly sales", a: "Interview" },
    { t: "Counting how many learners use the stairs vs. the elevator during break", a: "Observation" },
    { t: "Testing whether seeds grow faster with music by growing two groups", a: "Experiment" },
    { t: "Looking up PAGASA rainfall records for the past 10 years", a: "Existing records" },
    { t: "Asking 30 learners to answer an online poll about study habits", a: "Survey" },
    { t: "Watching and recording the number of jeepneys passing the gate in 10 minutes", a: "Observation" },
  ];

  function methods(root) {
    const area = h("div", { class: "stage-body" });
    let deck = shuffle(SCENARIOS), score = 0, k = 0;
    function next() {
      clear(area);
      if (k === deck.length) { area.append(pill(true, `Done! ${score} of ${deck.length} correct`, ""), h("button", { class: "btn", type: "button", onclick: () => { deck = shuffle(SCENARIOS); score = 0; k = 0; next(); } }, "Play again")); return; }
      const sc = deck[k];
      let answered = false;
      const fb = h("p", { class: "feedback", "aria-live": "polite" });
      area.append(h("p", { class: "bigq" }, sc.t), h("p", {}, "Which data collection method is this?"),
        h("div", { class: "choices" }, ["Survey", "Interview", "Observation", "Experiment", "Existing records"].map((c) => h("button", { type: "button", onclick: () => {
          if (answered) return;
          answered = true;
          const ok = c === sc.a; if (ok) score++;
          fb.className = "feedback " + (ok ? "ok" : "bad"); fb.textContent = ok ? "Correct!" : `This is ${sc.a.toLowerCase()}.`;
          k++; setTimeout(next, 900);
        } }, c))), fb);
    }
    root.append(area); next();
  }

  Sim.register({
    id: "lesson15", unit: "F", num: 6, letter: "F", title: "Data Collection and Sampling", simName: "Sampling Lab",
    comps: ["A11", "M6"], cycles: "C6,M3 – C6,M5", deped: "DepEd Week 6",
    bigQuestion: "Can asking only 40 students tell us about all 400?",
    mission: [
      "Take 10 random samples of 40. How close are the estimates to the true percent?",
      "Now take 10 convenience samples. What goes wrong?",
      "Try systematic and stratified samples. Which methods give fair results?",
      "Increase the sample size to 100. What happens to the spread of the dots?",
    ],
    discovery: "A sample can describe a whole population if it is chosen fairly. Random, systematic, and stratified samples give estimates close to the true value; a convenience sample (only the learners near the gate) is biased. Larger samples give estimates that cluster more tightly around the truth.",
    mount(stage) {
      const body = h("div", { class: "stage-body" });
      const views = [lab, methods];
      let stopper = null;
      const t = tabs(["Sampling Lab", "Which Method?"], (i) => { if (stopper) stopper(); clear(body); stopper = views[i](body) || null; });
      stage.append(t.el, body);
      stopper = lab(body);
      return () => { if (stopper) stopper(); };
    },
    check() {
      const kind = randInt(0, 2);
      if (kind === 0) { const sc = pick(SCENARIOS); return { q: `${sc.t}. Which data collection method is this?`, choices: ["Survey", "Interview", "Observation", "Experiment", "Existing records"], answer: sc.a, explain: `This is ${sc.a.toLowerCase()}.` }; }
      if (kind === 1) {
        const items = [
          ["Numbering all 400 learners and drawing 40 numbers from a box", "Simple random"],
          ["Choosing every 10th learner on the class list", "Systematic"],
          ["Choosing 4 learners from each of the 10 sections", "Stratified"],
          ["Asking the first 40 learners who arrive at the gate", "Convenience"],
        ];
        const [t, a] = pick(items);
        return { q: `${t}. Which sampling technique is this?`, choices: ["Simple random", "Systematic", "Stratified", "Convenience"], answer: a, explain: `This is ${a.toLowerCase()} sampling.` };
      }
      const N = pick([400, 500, 600, 800]), n = pick([20, 50, 100]);
      return { q: `In systematic sampling, how often do you pick a learner (every k-th) to get ${n} out of ${N}?`, answer: N / n, explain: `k = ${N} ÷ ${n} = ${N / n}.` };
    },
  });
})();
