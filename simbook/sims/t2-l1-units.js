/* Term 2 · Lesson 1 · A. Converting Units of Measure – Unit Ladder */
(function () {
  "use strict";
  const { h, s, clear, randInt, pick, fmt, tabs, segmented, stat, pill, Spring, elasticSlider } = Sim;

  const PREFIX = [
    { p: "k", name: "kilo", pow: 3 }, { p: "h", name: "hecto", pow: 2 }, { p: "da", name: "deka", pow: 1 },
    { p: "", name: "base", pow: 0 }, { p: "d", name: "deci", pow: -1 }, { p: "c", name: "centi", pow: -2 }, { p: "m", name: "milli", pow: -3 },
  ];
  const BASES = { length: { u: "m", word: "metre" }, mass: { u: "g", word: "gram" }, capacity: { u: "L", word: "litre" } };
  const unitName = (i, base) => `${PREFIX[i].p}${BASES[base].u}`;
  const clean = (x) => Number(x.toPrecision(12));

  // ------------------------------------------------------------ metric staircase

  function staircase(root) {
    let base = "length", value = 2.5, from = 0, pos = 0;
    const svg = s("svg", { viewBox: "0 0 600 330", role: "img", "aria-label": "Metric prefix staircase" });
    const g = s("g"), ball = s("circle", { r: 16, fill: "var(--gold)", stroke: "var(--ink)", "stroke-width": 2, class: "handle-ball" });
    svg.append(g, ball);
    const out = h("div", { class: "readout" }), big = h("p", { class: "unit-big num", "aria-live": "polite" }), work = h("pre", { class: "workings" });
    const stepX = (i) => 40 + i * 78, stepY = (i) => 50 + i * 36;
    const roll = new Spring(0, (v) => { pos = v; paint(); }, { stiffness: 190, damping: 15 });
    function drawSteps() {
      clear(g);
      PREFIX.forEach((pr, i) => {
        g.append(s("rect", { x: stepX(i), y: stepY(i) + 18, width: 78, height: 330 - stepY(i) - 18, fill: i === 3 ? "var(--accent-soft)" : "var(--grid)", stroke: "var(--line)" }));
        g.append(s("text", { x: stepX(i) + 39, y: stepY(i) + 44, "text-anchor": "middle", class: "svg-text", "font-weight": 700 }, unitName(i, base)));
        g.append(s("text", { x: stepX(i) + 39, y: stepY(i) + 62, "text-anchor": "middle", class: "svg-label" }, pr.name));
      });
      g.append(s("text", { x: 590, y: 30, "text-anchor": "end", class: "svg-label" }, "Down a step: × 10 · Up a step: ÷ 10"));
    }
    function paint() {
      const i = Math.round(pos);
      ball.setAttribute("cx", stepX(pos) + 39); ball.setAttribute("cy", stepY(pos) + 2 - Math.abs(Math.sin(Math.PI * (pos - Math.floor(pos)))) * 22);
      const steps = i - from;
      const result = clean(value * 10 ** steps);
      big.textContent = `${fmt(value, 6)} ${unitName(from, base)} = ${fmt(result, 8)} ${unitName(i, base)}`;
      work.textContent = steps === 0 ? "Drag the ball (or tap a step) to a new unit." :
        `${Math.abs(steps)} step${Math.abs(steps) > 1 ? "s" : ""} ${steps > 0 ? "down → multiply" : "up → divide"} by ${10 ** Math.abs(steps)}\n${fmt(value, 6)} ${steps > 0 ? "×" : "÷"} ${10 ** Math.abs(steps)} = ${fmt(result, 8)}   (the decimal point moves ${Math.abs(steps)} place${Math.abs(steps) > 1 ? "s" : ""} to the ${steps > 0 ? "right" : "left"})`;
      clear(out);
      out.append(stat("From:", unitName(from, base)).el, stat("To:", unitName(i, base)).el);
    }
    const nearest = (x) => Math.max(0, Math.min(6, Math.round((x - 40 - 39) / 78)));
    Sim.draggable(svg, ball, (p) => { roll.stop(); pos = Sim.rubber((p.x - 79) / 78, 0, 6, 0.3); roll.value = pos; roll.vel = 0; paint(); }, (p) => roll.set(nearest(p.x)));
    svg.addEventListener("click", (e) => { if (e.target === ball) return; const p = Sim.svgPoint(svg, e); roll.set(nearest(p.x)); });
    const valS = elasticSlider({ id: "t2l1-v", label: "Amount", min: 0.5, max: 50, value, step: 0.5, format: (v) => fmt(v, 1), onInput: (v) => { value = v; paint(); } });
    root.append(h("div", { class: "controls" }, h("span", {}, "Measure"),
      segmented(["length", "mass", "capacity"], base, (v) => { base = v; drawSteps(); paint(); }),
      valS.el,
      h("button", { class: "btn ghost", type: "button", onclick: () => { from = Math.round(pos); paint(); } }, "Start from this unit")),
    svg, big, out, work, h("p", { class: "note" }, "Example: 2.5 km rolls down 3 steps to m: 2.5 × 1 000 = 2 500 m."));
    drawSteps(); paint();
    return () => roll.stop();
  }

  // ------------------------------------------------------------ across systems

  const PAIRS = [
    { a: "in", b: "cm", k: 2.54, max: 12, label: "inches ↔ centimetres" },
    { a: "ft", b: "m", k: 0.3048, max: 10, label: "feet ↔ metres" },
    { a: "mi", b: "km", k: 1.609, max: 10, label: "miles ↔ kilometres" },
    { a: "lb", b: "kg", k: 0.4536, max: 20, label: "pounds ↔ kilograms" },
    { a: "gal", b: "L", k: 3.785, max: 10, label: "gallons ↔ litres" },
  ];

  function across(root) {
    let pair = PAIRS[0], x = 4;
    const svg = s("svg", { viewBox: "0 0 600 170", role: "img", "aria-label": "Two rulers in different units" });
    const out = h("p", { class: "unit-big num", "aria-live": "polite" }), work = h("pre", { class: "workings" });
    const X = (v) => 30 + (v / pair.max) * 540;
    function draw() {
      clear(svg);
      const maxB = pair.max * pair.k;
      svg.append(s("rect", { x: 30, y: 20, width: 540, height: 40, fill: "var(--shape-a-soft)", stroke: "var(--shape-a)" }));
      svg.append(s("rect", { x: 30, y: 100, width: 540, height: 40, fill: "var(--shape-b-soft)", stroke: "var(--shape-b)" }));
      for (let t = 0; t <= pair.max; t++) {
        svg.append(s("line", { x1: X(t), y1: 20, x2: X(t), y2: t % 5 ? 34 : 42, stroke: "var(--ink)" }));
        if (pair.max <= 12 || t % 2 === 0) svg.append(s("text", { x: X(t), y: 56, "text-anchor": "middle", class: "svg-text", "font-size": 11 }, String(t)));
      }
      const stepB = maxB > 40 ? 5 : maxB > 15 ? 2 : 1;
      for (let t = 0; t <= maxB + 1e-9; t += stepB) {
        const px = 30 + (t / maxB) * 540;
        svg.append(s("line", { x1: px, y1: 140, x2: px, y2: 126, stroke: "var(--ink)" }));
        svg.append(s("text", { x: px, y: 120, "text-anchor": "middle", class: "svg-text", "font-size": 11 }, String(t)));
      }
      svg.append(s("text", { x: 575, y: 45, class: "svg-label" }, pair.a), s("text", { x: 575, y: 125, class: "svg-label" }, pair.b));
      svg.append(s("line", { x1: X(x), y1: 10, x2: X(x), y2: 150, stroke: "var(--accent)", "stroke-width": 3 }));
      out.textContent = `${fmt(x, 2)} ${pair.a} = ${fmt(x * pair.k, 3)} ${pair.b}`;
      work.textContent = `1 ${pair.a} = ${pair.k} ${pair.b}\n${pair.a} → ${pair.b}: multiply by ${pair.k}    ${pair.b} → ${pair.a}: divide by ${pair.k}\n${fmt(x, 2)} × ${pair.k} = ${fmt(x * pair.k, 3)} ${pair.b}`;
    }
    let slider = null;
    const box = h("div", { class: "controls" });
    function makeSlider() {
      clear(box);
      slider = elasticSlider({ id: "t2l1-x", label: pair.a, min: 0, max: pair.max, value: Math.min(x, pair.max), step: 0.25, format: (v) => fmt(v, 2), onInput: (v) => { x = v; draw(); } });
      box.append(slider.el);
    }
    const sel = h("select", { id: "t2l1-pair" }, PAIRS.map((p, i) => h("option", { value: i }, p.label)));
    sel.addEventListener("change", () => { pair = PAIRS[Number(sel.value)]; x = Math.min(x, pair.max); makeSlider(); draw(); });
    root.append(h("div", { class: "controls" }, h("label", { for: "t2l1-pair" }, "Units", sel)), box, svg, out, work,
      h("p", { class: "note" }, "Slide the green line along the top ruler and read both rulers at once."));
    makeSlider(); draw();
  }

  // ------------------------------------------------------------ lesson

  Sim.register({
    id: "lesson10", unit: "D", num: 1, letter: "A", title: "Converting Units of Measure", simName: "Unit Ladder",
    comps: ["A1", "M1", "T1"], cycles: "C1,M2 – C2,M5", deped: "DepEd Weeks 1–2",
    bigQuestion: "Is a 5-km fun run longer than 3 miles?",
    mission: [
      "Metric Staircase: start at km with 2.5, then roll the ball to m, cm, and mm. Which way does the decimal point move?",
      "Switch to mass and capacity. Does the same rule work for grams and litres?",
      "Across Systems: find how many centimetres are in 12 inches, and how many kilograms are in 20 pounds.",
      "Answer the Big Question using the miles ↔ kilometres ruler.",
    ],
    discovery: "Each metric prefix is 10 times the next smaller one. Going down the staircase to a smaller unit multiplies by 10 per step (the decimal point moves right); going up divides by 10 per step. Across systems, multiply or divide by a conversion factor such as 1 in = 2.54 cm or 1 mi ≈ 1.609 km – so a 5-km fun run (about 3.1 miles) is a little longer than 3 miles.",
    mount(stage) {
      const body = h("div", { class: "stage-body" });
      const views = [staircase, across];
      let stopper = null;
      const t = tabs(["Metric Staircase", "Across Systems"], (i) => { if (stopper) stopper(); clear(body); stopper = views[i](body) || null; });
      stage.append(t.el, body);
      stopper = staircase(body);
      return () => { if (stopper) stopper(); };
    },
    check() {
      const kind = randInt(0, 4);
      if (kind <= 2) {
        const base = pick(["length", "mass", "capacity"]);
        const pairs = base === "length" ? [[0, 3], [3, 5], [5, 6], [6, 3], [3, 0], [5, 3]] : base === "mass" ? [[0, 3], [3, 6], [6, 3], [3, 0]] : [[3, 6], [6, 3], [0, 3]];
        const [a, b] = pick(pairs), v = pick([2.5, 4, 0.75, 1.2, 350, 45, 8]);
        const ans = clean(v * 10 ** (b - a));
        return { q: `Convert ${fmt(v, 3)} ${unitName(a, base)} to ${unitName(b, base)}.`, answer: ans, tol: Math.max(1e-6, ans * 1e-6), unit: unitName(b, base), explain: `${b > a ? "Multiply" : "Divide"} by ${10 ** Math.abs(b - a)}: ${fmt(ans, 8)} ${unitName(b, base)}.` };
      }
      const p = pick(PAIRS), v = pick([2, 3, 5, 10]);
      const toB = Math.random() < 0.6;
      const ans = toB ? v * p.k : v / p.k;
      return { q: `Convert ${v} ${toB ? p.a : p.b} to ${toB ? p.b : p.a}. (1 ${p.a} = ${p.k} ${p.b}) Round to 2 decimal places.`, answer: Number(ans.toFixed(2)), tol: 0.011, unit: toB ? p.b : p.a, explain: `${v} ${toB ? "×" : "÷"} ${p.k} = ${fmt(ans, 3)}.` };
    },
  });
})();
