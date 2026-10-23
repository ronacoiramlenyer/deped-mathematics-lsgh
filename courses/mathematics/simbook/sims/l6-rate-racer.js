/* Lesson 6 · F. Rates – Rate Racer */
(function () {
  "use strict";
  const { h, s, clear, randInt, pick, fmt, peso, tabs, stat, pill, animate, Spring, elasticSlider } = Sim;

  // ------------------------------------------------------------ race

  const RACERS = [
    { name: "Jeepney", color: "var(--shape-a)", d: 12, t: 45 },
    { name: "Train", color: "var(--shape-b)", d: 12, t: 30 },
  ];

  function race(root) {
    let stop = () => {};
    const vals = RACERS.map((r) => ({ d: r.d, t: r.t }));
    let ready = false;
    const onSlide = (i, key) => (v) => { vals[i][key] = v; if (ready) { stop(); setup(); } };
    const sliders = RACERS.map((r, i) => ({
      d: elasticSlider({ id: `l6-d${i}`, label: "Distance", min: 1, max: 40, value: r.d, step: 0.5, format: (v) => `${fmt(v, 1)} km`, onInput: onSlide(i, "d") }),
      t: elasticSlider({ id: `l6-t${i}`, label: "Time", min: 5, max: 120, value: r.t, step: 1, format: (v) => `${fmt(v, 0)} min`, onInput: onSlide(i, "t") }),
    }));
    const svg = s("svg", { viewBox: "0 0 600 250", role: "img", "aria-label": "Race track" });
    const clock = stat("Time:", "0 min");
    const out = h("div", { class: "readout" });
    const lines = h("div");

    function setup() {
      clear(svg); clear(out); clear(lines);
      const maxD = Math.max(...vals.map((v) => v.d));
      const X = (km) => 40 + (km / maxD) * 520;
      const dots = vals.map((v, i) => {
        const y = 60 + i * 110;
        svg.append(s("line", { x1: X(0), y1: y, x2: X(maxD), y2: y, stroke: "var(--grid)", "stroke-width": 14, "stroke-linecap": "round" }));
        svg.append(s("line", { x1: X(v.d), y1: y - 18, x2: X(v.d), y2: y + 18, stroke: "var(--ink)", "stroke-width": 3 }));
        svg.append(s("text", { x: X(0), y: y - 22, class: "svg-label" }, `${RACERS[i].name}: ${fmt(v.d)} km in ${fmt(v.t)} min`));
        const dot = s("circle", { cx: X(0), cy: y, r: 13, fill: RACERS[i].color });
        svg.append(dot);
        return { dot, v, y };
      });
      vals.forEach((v, i) => {
        const kmh = v.d / (v.t / 60);
        out.append(stat(`${RACERS[i].name}:`, `${fmt(kmh, 1)} km/h`).el);
        lines.append(numberLine(RACERS[i].name, kmh, RACERS[i].color));
      });
      const speeds = vals.map((v) => v.d / v.t);
      out.append(pill(true, Math.abs(speeds[0] - speeds[1]) < 1e-9 ? "Same speed – same unit rate!" : `${RACERS[speeds[0] > speeds[1] ? 0 : 1].name} has the greater speed`, ""));
      return { dots, vals, X };
    }

    function run() {
      stop();
      const { dots, vals, X } = setup();
      const T = Math.max(...vals.map((v) => v.t));
      stop = animate(Math.min(6000, 1500 + T * 30), (k) => {
        const now = k * T;
        clock.set(`${fmt(now, 0)} min`);
        dots.forEach(({ dot, v }) => dot.setAttribute("cx", X(Math.min(v.d, (v.d / v.t) * now))));
      });
    }

    root.append(
      ...RACERS.map((r, i) => h("div", { class: "controls" }, h("b", {}, r.name), sliders[i].d.el, sliders[i].t.el)),
      h("div", { class: "controls" }, h("button", { class: "btn", type: "button", onclick: run }, "Race!"), clock.el),
      svg, out, lines, h("p", { class: "note" }, "speed = distance ÷ time. To get km/h, divide the km by the time in hours (minutes ÷ 60)."));
    ready = true;
    setup();
    return () => stop();
  }

  function numberLine(name, kmh, color) {
    const svg = s("svg", { viewBox: "0 0 600 90", role: "img", "aria-label": `Double number line for ${name}` });
    const hours = [0, 0.5, 1, 1.5, 2];
    const X = (t) => 40 + (t / 2) * 520;
    svg.append(s("text", { x: 4, y: 26, class: "svg-label" }, "km"), s("text", { x: 4, y: 72, class: "svg-label" }, "h"));
    svg.append(s("line", { x1: X(0), y1: 30, x2: X(2), y2: 30, stroke: color, "stroke-width": 2 }), s("line", { x1: X(0), y1: 60, x2: X(2), y2: 60, stroke: "var(--ink)", "stroke-width": 2 }));
    hours.forEach((t) => {
      svg.append(s("line", { x1: X(t), y1: 24, x2: X(t), y2: 66, stroke: "var(--muted)", "stroke-dasharray": "3 3" }));
      svg.append(s("text", { x: X(t), y: 18, "text-anchor": "middle", class: "svg-text", "font-weight": t === 1 ? 700 : 400 }, fmt(kmh * t, 1)));
      svg.append(s("text", { x: X(t), y: 82, "text-anchor": "middle", class: "svg-text" }, fmt(t, 1)));
    });
    return h("div", {}, h("p", { class: "note" }, `${name}: in 1 hour → ${fmt(kmh, 1)} km (the unit rate)`), svg);
  }

  // ------------------------------------------------------------ best buy

  const SETS = [
    { item: "Shampoo", unit: "mL", packs: [{ label: "Sachet", size: 12, price: 8 }, { label: "Bottle", size: 180, price: 95 }, { label: "Refill", size: 1000, price: 420 }] },
    { item: "Rice", unit: "kg", packs: [{ label: "5-kg bag", size: 5, price: 275 }, { label: "10-kg bag", size: 10, price: 540 }, { label: "25-kg sack", size: 25, price: 1300 }] },
    { item: "Eggs", unit: "egg", packs: [{ label: "Half dozen", size: 6, price: 54 }, { label: "Dozen", size: 12, price: 102 }, { label: "Tray of 30", size: 30, price: 240 }] },
    { item: "Bottled water", unit: "L", packs: [{ label: "500 mL", size: 0.5, price: 15 }, { label: "1 L", size: 1, price: 25 }, { label: "6 L", size: 6, price: 95 }] },
  ];

  function bestBuy(root) {
    let set = 0, guessed = null, grow = null;
    const pickSet = h("select", { id: "l6-set" }, SETS.map((st, i) => h("option", { value: i }, st.item)));
    const area = h("div", { class: "stage" });
    function draw() {
      clear(area);
      const st = SETS[set];
      const rates = st.packs.map((p) => p.price / p.size);
      const best = rates.indexOf(Math.min(...rates));
      const row = h("div", { class: "choices" });
      st.packs.forEach((p, i) => row.append(h("button", { type: "button", "aria-pressed": guessed === i ? "true" : "false", onclick: () => { guessed = i; draw(); } }, `${p.label}: ${fmt(p.size)} ${st.unit} for ${peso(p.price)}`)));
      area.append(h("p", {}, guessed === null ? "Predict: which pack has the lowest price per unit? Tap one." : "Here are the unit prices:"), row);
      if (guessed === null) return;
      const max = Math.max(...rates), W = 520;
      const svg = s("svg", { viewBox: "0 0 600 " + (st.packs.length * 50 + 20), role: "img", "aria-label": "Unit price bars" });
      const rows = st.packs.map((p, i) => {
        const y = 10 + i * 50;
        svg.append(s("text", { x: 0, y: y + 22, class: "svg-label" }, p.label));
        const rect = s("rect", { x: 110, y, width: 0, height: 32, fill: i === best ? "var(--accent-soft)" : "var(--grid)", stroke: i === best ? "var(--accent)" : "none" });
        const label = s("text", { x: 118, y: y + 22, class: "svg-text" }, `${peso(rates[i])} per ${st.unit}`);
        svg.append(rect, label);
        return { rect, label, w: (rates[i] / max) * (W - 160) };
      });
      // Bars grow out from zero and settle with a small bounce.
      if (grow) grow.stop();
      grow = new Spring(0, (k) => rows.forEach((r) => { const w = Math.max(0, r.w * k); r.rect.setAttribute("width", w); r.label.setAttribute("x", 118 + w); }), { stiffness: 150, damping: 12 });
      grow.set(1);
      area.append(svg, pill(guessed === best, "Your prediction was right!", `The lowest unit price is the ${st.packs[best].label.toLowerCase()}.`),
        h("pre", { class: "workings" }, st.packs.map((p, i) => `${p.label.padEnd(12)} ${peso(p.price)} ÷ ${fmt(p.size)} ${st.unit} = ${peso(rates[i])} per ${st.unit}`).join("\n")),
        h("p", { class: "note" }, "The lowest unit price is not always the best choice. Think about your budget today, storage, and whether you will use it all."));
    }
    pickSet.addEventListener("change", () => { set = Number(pickSet.value); guessed = null; draw(); });
    root.append(h("div", { class: "controls" }, h("label", { for: "l6-set" }, "Product", pickSet)), area);
    draw();
    return () => { if (grow) grow.stop(); };
  }

  // ------------------------------------------------------------ lesson

  Sim.register({
    id: "lesson6", unit: "B", num: 6, letter: "F", title: "Rates", simName: "Rate Racer",
    comps: ["A10", "A11", "M9", "T3"], cycles: "C6,M1 – C6,M4", deped: "DepEd Week 6",
    bigQuestion: "Which is cheaper – shampoo in sachets or in a bottle?",
    mission: [
      "Race: the jeepney travels 12 km in 45 min and the train 12 km in 30 min. Predict the faster one, then race.",
      "Slide the train’s distance and time until the two have the SAME speed. What do you notice about their double number lines?",
      "Best Buy: predict the cheapest pack for each product before revealing the unit prices.",
      "Find a product where the cheapest pack per unit might NOT be the best choice for a student. Explain why.",
    ],
    discovery: "A rate compares two quantities with different units. A unit rate tells the amount for ONE unit – km per hour, pesos per kilogram. Speed = distance ÷ time; distance = speed × time; time = distance ÷ speed. Comparing unit prices shows the best value, but a wise buyer also thinks about what is really needed.",
    mount(stage) {
      const body = h("div", { class: "stage-body" });
      let stopper = null;
      const views = [race, bestBuy];
      const t = tabs(["Race", "Best Buy"], (i) => { if (stopper) stopper(); clear(body); stopper = views[i](body) || null; });
      stage.append(t.el, body);
      stopper = race(body);
      return () => { if (stopper) stopper(); };
    },
    check() {
      const kind = randInt(0, 4);
      if (kind === 0) { const sp = pick([40, 45, 50, 60, 80]), t = pick([2, 3, 4]); return { q: `A bus travels ${sp * t} km in ${t} hours. What is its speed?`, answer: sp, unit: "km/h", explain: `${sp * t} ÷ ${t} = ${sp} km/h.` }; }
      if (kind === 1) { const sp = pick([12, 15, 18, 20]), t = pick([1.5, 2, 2.5, 3]); return { q: `A cyclist rides at ${sp} km/h for ${t} hours. How far does the cyclist go?`, answer: sp * t, unit: "km", explain: `${sp} × ${t} = ${fmt(sp * t)} km.` }; }
      if (kind === 2) { const sp = pick([40, 50, 60, 80]), d = sp * pick([1.5, 2, 3]); return { q: `How many hours does a ${d}-km trip take at ${sp} km/h?`, answer: d / sp, unit: "hours", explain: `${d} ÷ ${sp} = ${fmt(d / sp)} hours.` }; }
      if (kind === 3) { const L = pick([24, 36, 45, 60]), m = pick([3, 4, 5]); return { q: `A faucet fills ${L} liters in ${m} minutes. What is the rate of flow in liters per minute?`, answer: L / m, unit: "L/min", explain: `${L} ÷ ${m} = ${fmt(L / m)} L/min.` }; }
      const st = pick(SETS); const rates = st.packs.map((p) => p.price / p.size); const best = rates.indexOf(Math.min(...rates));
      return { q: `${st.item}: ${st.packs.map((p) => `${p.label} (${fmt(p.size)} ${st.unit}, ${peso(p.price)})`).join("; ")}. Which has the lowest price per ${st.unit}?`, choices: st.packs.map((p) => p.label), answer: st.packs[best].label, explain: st.packs.map((p, i) => `${p.label}: ${peso(rates[i])}`).join(" · ") };
    },
  });
})();
