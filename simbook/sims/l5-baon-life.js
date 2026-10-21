/* Lesson 5 · E. Creating a Financial Plan – Baon Life Sim */
(function () {
  "use strict";
  const { h, s, clear, randInt, pick, shuffle, fmt, peso, tabs, stat, pill, Spring, elasticSlider } = Sim;

  const DECK = [
    { text: "Rain! You take a tricycle home.", amt: -20 },
    { text: "Group project materials are due.", amt: -45 },
    { text: "The canteen raised the price of lunch.", amt: -10 },
    { text: "You forgot your water bottle and buy water.", amt: -25 },
    { text: "You found ₱20 in your bag!", amt: 20 },
    { text: "Lola gives you ₱50 for helping at home.", amt: 50 },
    { text: "A quiet day – no surprises.", amt: 0 },
    { text: "A classmate’s birthday treat. Chip in?", amt: -30, optional: true },
    { text: "Milk tea with friends after class?", amt: -120, optional: true },
    { text: "A game skin is 40% off ₱250. Buy it?", amt: -150, optional: true },
    { text: "Donation drive for typhoon victims. Give?", amt: -20, optional: true },
  ];

  const state = { baon: 500, needs: 50, wants: 30 };
  const savingsPct = () => 100 - state.needs - state.wants;

  function stackBar(parts, total) {
    const W = 560;
    const svg = s("svg", { viewBox: `0 0 ${W + 40} 80`, role: "img", "aria-label": "Budget split" });
    let x = 20;
    parts.forEach((p) => {
      const w = (p.value / total) * W;
      svg.append(s("rect", { x, y: 10, width: Math.max(0, w), height: 42, fill: p.fill, stroke: "var(--paper)", "stroke-width": 2 }));
      if (w > 60) svg.append(s("text", { x: x + w / 2, y: 36, "text-anchor": "middle", class: "svg-text", "font-size": 12 }, `${p.label} ${fmt((p.value / total) * 100, 0)}%`));
      x += w;
    });
    svg.append(s("text", { x: 20, y: 72, class: "svg-label" }, `Total ${peso(total)}`));
    return svg;
  }

  // ------------------------------------------------------------ plan

  function plan(root) {
    const bar = h("div"), out = h("div", { class: "readout" }), work = h("pre", { class: "workings" });
    let needsS, wantsS;
    function update() {
      const sv = savingsPct(), B = state.baon;
      clear(bar); clear(out);
      bar.append(stackBar([
        { label: "Needs", value: (B * state.needs) / 100, fill: "var(--shape-a-soft)" },
        { label: "Wants", value: (B * state.wants) / 100, fill: "var(--shape-b-soft)" },
        { label: "Savings", value: (B * sv) / 100, fill: "var(--gold-soft)" }], B));
      out.append(stat("Needs:", peso((B * state.needs) / 100)).el, stat("Wants:", peso((B * state.wants) / 100)).el, stat("Savings:", peso((B * sv) / 100)).el,
        pill(sv >= 19.5, "Meets the 20% savings guide", "Below the 20% savings guide"));
      work.textContent = `needs   = ${fmt(state.needs, 0)}% × ${peso(B)} = ${peso((B * state.needs) / 100)}\nwants   = ${fmt(state.wants, 0)}% × ${peso(B)} = ${peso((B * state.wants) / 100)}\nsavings = ${fmt(sv, 0)}% × ${peso(B)} = ${peso((B * sv) / 100)}`;
    }
    const pct = (v) => `${fmt(v, 0)}%`;
    // Needs and wants share 100%: pushing one past the limit pushes the other back.
    needsS = elasticSlider({ id: "l5-needs", label: "Needs", min: 0, max: 100, value: state.needs, step: 1, format: pct,
      onInput: (v) => { state.needs = v; if (v + state.wants > 100 && wantsS) wantsS.jump(100 - v); update(); } });
    wantsS = elasticSlider({ id: "l5-wants", label: "Wants", min: 0, max: 100, value: state.wants, step: 1, format: pct,
      onInput: (v) => { state.wants = v; if (v + state.needs > 100 && needsS) needsS.jump(100 - v); update(); } });
    const baonS = elasticSlider({ id: "l5-baon", label: "Weekly baon", min: 100, max: 2000, value: state.baon, step: 50, format: (v) => peso(v), onInput: (v) => { state.baon = v; update(); } });
    root.append(h("div", { class: "controls" }, baonS.el,
      h("button", { class: "btn ghost", type: "button", onclick: () => { needsS.set(50); wantsS.set(30); } }, "Use 50-30-20")),
    h("div", { class: "controls" }, needsS.el, wantsS.el),
    bar, out, work, h("p", { class: "note" }, "Your plan carries over to “Live the Week.”"));
    update();
  }

  // ------------------------------------------------------------ live the week

  function week(root) {
    const B = state.baon, daily = (B * (state.needs + state.wants)) / 100 / 5, target = (B * savingsPct()) / 100;
    let day = 0, wallet = B, deck = shuffle(DECK), log = [];
    const card = h("div", { class: "panel", "aria-live": "polite" });
    const tbody = h("tbody");
    const chart = h("div");
    const out = h("div", { class: "readout" });
    const startBtn = h("button", { class: "btn", type: "button", onclick: nextDay }, "Start Day 1");
    // Bars glide to each day's balance; a new day's bar rises out of the axis.
    const bars = new Spring([B], (v) => drawChart(v), { stiffness: 150, damping: 15 });

    function drawChart(values) {
      clear(chart);
      const W = 560, H = 140, max = B;
      const svg = s("svg", { viewBox: `0 0 ${W + 40} ${H + 40}`, role: "img", "aria-label": "Wallet balance by day" });
      const ty = 10 + H - (target / max) * H;
      svg.append(s("line", { x1: 20, y1: ty, x2: W + 20, y2: ty, stroke: "var(--gold)", "stroke-width": 2, "stroke-dasharray": "6 4" }));
      svg.append(s("text", { x: W + 18, y: ty - 6, "text-anchor": "end", class: "svg-label" }, `savings target ${peso(target)}`));
      values.forEach((w, i) => {
        const bh = Math.max(0, (w / max) * H), x = 30 + i * 90;
        const ok = w >= target;
        svg.append(s("rect", { x, y: 10 + H - bh, width: 60, height: bh, fill: ok ? "var(--shape-a-soft)" : "var(--shape-b-soft)", stroke: ok ? "var(--shape-a)" : "var(--shape-b)" }));
        svg.append(s("text", { x: x + 30, y: H + 30, "text-anchor": "middle", class: "svg-text" }, i === 0 ? "Start" : `Day ${i}`));
      });
      chart.append(svg);
    }

    function render() {
      clear(tbody);
      log.forEach((r) => tbody.append(h("tr", {}, h("td", {}, `Day ${r.day}`), h("td", { class: "num" }, peso(r.planned)), h("td", {}, r.card), h("td", { class: "num" }, (r.extra >= 0 ? "+" : "−") + peso(Math.abs(r.extra))), h("td", { class: "num" }, peso(r.wallet)))));
      const targets = [B, ...log.map((r) => r.wallet)];
      if (bars.value.length < targets.length) { bars.value = [...bars.value, 0]; bars.vel = [...bars.vel, 0]; }
      bars.set(targets);
      clear(out);
      out.append(stat("Wallet:", peso(wallet)).el, stat("Daily plan:", peso(daily)).el, stat("Savings target:", peso(target)).el);
    }

    function finishDay(c, took) {
      const extra = took ? c.amt : 0;
      wallet = wallet - daily + extra;
      log.push({ day, planned: daily, card: c.text + (c.optional ? (took ? " (yes)" : " (no)") : ""), extra, wallet });
      render();
      clear(card);
      if (day === 5) {
        const ok = wallet >= target;
        card.append(h("h2", {}, "Week over!"), h("p", {}, `You ended with ${peso(wallet)} – that is ${fmt((wallet / B) * 100, 1)}% of your baon.`),
          pill(ok, "You reached your savings target!", `You missed your target by ${peso(target - wallet)}.`),
          h("p", { class: "note" }, "Go back to Plan and adjust your budget, then play again. A small reserve helps when Life Cards surprise you."),
          h("button", { class: "btn", type: "button", onclick: () => { bars.stop(); clear(root); week(root); } }, "Play again"));
      } else {
        startBtn.textContent = `Start Day ${day + 1}`; card.append(h("p", {}, `Day ${day} done.`), startBtn);
      }
    }

    function nextDay() {
      day++;
      const c = deck.pop();
      clear(card);
      card.append(h("h2", {}, `Day ${day} · Life Card`), h("p", { class: "bigq" }, c.text), h("p", { class: "note" }, `You spend your planned ${peso(daily)} today.`));
      if (c.optional) {
        card.append(h("div", { class: "controls" },
          h("button", { class: "btn", type: "button", onclick: () => finishDay(c, true) }, `Yes (${peso(-c.amt)})`),
          h("button", { class: "btn ghost", type: "button", onclick: () => finishDay(c, false) }, "No, skip it")));
      } else {
        card.append(h("p", {}, c.amt === 0 ? "Nothing extra today." : c.amt > 0 ? `+${peso(c.amt)}` : `This costs ${peso(-c.amt)}.`),
          h("button", { class: "btn", type: "button", onclick: () => finishDay(c, true) }, "OK"));
      }
    }

    card.append(h("p", {}, `Your plan: ${peso(B)} baon, ${peso(daily)} to spend each day, ${peso(target)} to save. Each day you draw a Life Card.`), startBtn);
    root.append(card, chart, out, h("div", { class: "table-wrap" }, h("table", { class: "data" },
      h("thead", {}, h("tr", {}, h("th", {}, "Day"), h("th", {}, "Planned"), h("th", {}, "Life Card"), h("th", {}, "Extra"), h("th", {}, "Wallet"))), tbody)));
    drawChart([B]);
    render();
    return () => bars.stop();
  }

  // ------------------------------------------------------------ savings goal

  function goal(root) {
    const st = { G: 1800, W: 100, K: 12 };
    const a = h("pre", { class: "workings" }), b = h("pre", { class: "workings" });
    function update() {
      const { G, W } = st, K = Math.max(1, Math.round(st.K));
      a.textContent = `weeks = goal ÷ weekly savings = ${peso(G)} ÷ ${peso(W)} = ${fmt(G / W, 2)}\n→ about ${Math.ceil(G / W - 1e-9)} weeks`;
      const need = G / K;
      b.textContent = `weekly savings = goal ÷ weeks = ${peso(G)} ÷ ${K} = ${peso(need)}\nthat is ${fmt((need / state.baon) * 100, 1)}% of a ${peso(state.baon)} weekly baon`;
    }
    const slide = (id, label, min, max, value, step, key, format) => elasticSlider({ id, label, min, max, value, step, format, onInput: (v) => { st[key] = v; update(); } }).el;
    root.append(h("div", { class: "controls" }, slide("l5-goal", "Goal", 100, 5000, 1800, 50, "G", peso)),
      h("h2", {}, "How long will it take?"), h("div", { class: "controls" }, slide("l5-weekly", "I save per week", 10, 500, 100, 10, "W", peso)), a,
      h("h2", {}, "How much per week?"), h("div", { class: "controls" }, slide("l5-weeks", "I want it in", 1, 52, 12, 1, "K", (v) => `${Math.round(v)} wk`)), b);
    update();
  }

  // ------------------------------------------------------------ lesson

  Sim.register({
    id: "lesson5", unit: "B", num: 5, letter: "E", title: "Creating a Financial Plan", simName: "Baon Life Sim",
    comps: ["A9", "M8", "T2"], cycles: "C5,M2 – C5,M5", deped: "DepEd Week 5",
    bigQuestion: "How can I make ₱500 last a whole week – and still save?",
    mission: [
      "Plan: split your ₱500 baon into needs, wants, and savings. Start with 50-30-20.",
      "Live the Week: play five days of Life Cards. Did you reach your savings target?",
      "Change your plan (for example, 50-25-25) and play again. Compare the results.",
      "Savings Goal: how many weeks to save ₱1 800 at ₱100 a week? How much a week to get it in 12 weeks?",
    ],
    discovery: "A financial plan gives every peso a job before the week starts: needs first, then wants, then savings. Percentages make the plan work for any amount (20% of ₱500 = ₱100). Life brings surprises, so a good plan keeps a reserve, tracks spending every day, and is adjusted when things change.",
    mount(stage) {
      const body = h("div", { class: "stage-body" });
      const views = [plan, week, goal];
      let stopper = null;
      const t = tabs(["Plan", "Live the Week", "Savings Goal"], (i) => { if (stopper) stopper(); clear(body); stopper = views[i](body) || null; });
      stage.append(t.el, body);
      plan(body);
      return () => { if (stopper) stopper(); };
    },
    check() {
      const kind = randInt(0, 4);
      if (kind === 0) { const B = pick([400, 500, 600, 800, 1000]); const part = pick([["needs", 50], ["wants", 30], ["savings", 20]]); return { q: `Using the 50-30-20 guide, how much of a ${peso(B)} weekly baon goes to ${part[0]}?`, answer: (B * part[1]) / 100, unit: "₱", explain: `${part[1]}% × ${peso(B)} = ${peso((B * part[1]) / 100)}.` }; }
      if (kind === 1) { const B = pick([400, 500, 800]); const x = pick([40, 80, 100, 120, 150]); return { q: `You spend ${peso(x)} of your ${peso(B)} weekly baon on fare. What percentage of your budget is that?`, answer: (x / B) * 100, unit: "%", explain: `${fmt(x)} ÷ ${fmt(B)} × 100% = ${fmt((x / B) * 100)}%.` }; }
      if (kind === 2) { const G = pick([600, 900, 1200, 1500, 1800]), W = pick([50, 75, 100, 150]); return { q: `You want to save ${peso(G)} and you save ${peso(W)} every week. How many weeks will it take?`, answer: Math.ceil(G / W), unit: "weeks", explain: `${fmt(G)} ÷ ${fmt(W)} = ${fmt(G / W)} → ${Math.ceil(G / W)} weeks.` }; }
      if (kind === 3) { const G = pick([1200, 1800, 2400]), K = pick([8, 10, 12, 15]); return { q: `To save ${peso(G)} in ${K} weeks, how much must you save each week?`, answer: G / K, unit: "₱", explain: `${peso(G)} ÷ ${K} = ${peso(G / K)}.` }; }
      const item = pick([["transportation fare to school", "Need"], ["lunch", "Need"], ["school project materials", "Need"], ["milk tea", "Want"], ["a new game skin", "Want"], ["a third pair of rubber shoes", "Want"]]);
      return { q: `In a student’s budget, is ${item[0]} usually a need or a want?`, choices: ["Need", "Want"], answer: item[1], explain: item[1] === "Need" ? "It is necessary for going to school and staying healthy." : "It is nice to have, but you can live without it." };
    },
  });
})();
