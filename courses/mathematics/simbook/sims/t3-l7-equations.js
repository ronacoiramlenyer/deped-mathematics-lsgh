/* Term 3 · Lesson 7 · G. Writing and Solving Equations – Equation Builder */
(function () {
  "use strict";
  const { h, s, clear, randInt, pick, shuffle, fmt, tabs, segmented, stat, pill, Spring, elasticSlider, clamp } = Sim;

  const fm = (x) => fmt(x, 2).replace("-", "−");

  /** Slides an element from an offset back to where it now sits (a springy FLIP move). */
  function fly(el, dx, dy, springs) {
    const sp = new Spring([dx, dy], ([x, y]) => { el.style.transform = x || y ? `translate(${x}px,${y}px)` : ""; }, { stiffness: 230, damping: 17 });
    sp.jump([dx, dy]); sp.set([0, 0]); springs.push(sp);
  }

  // ------------------------------------------------------------ story to equation

  const STORIES = [
    { text: "Ana saves ₱25 a day. After how many days d will Ana have ₱300?", tiles: ["25d", "=", "300", "+", "25", "d", "275"], accept: ["25d = 300", "300 = 25d"], why: "₱25 each day for d days is 25d pesos, and that must equal ₱300." },
    { text: "A number n increased by 8 is 21.", tiles: ["n", "+", "8", "=", "21", "−", "8n"], accept: ["n + 8 = 21", "8 + n = 21", "21 = n + 8", "21 = 8 + n"], why: "“increased by 8” means + 8; “is” means =." },
    { text: "Kai’s jeepney fare is ₱13 for the first 4 km plus ₱2 for each extra kilometre k. Kai paid ₱25.", tiles: ["13", "+", "2k", "=", "25", "k", "−", "15k"], accept: ["13 + 2k = 25", "2k + 13 = 25", "25 = 13 + 2k", "25 = 2k + 13"], why: "The fixed ₱13 plus ₱2 for each of k kilometres is 13 + 2k, which equals ₱25." },
    { text: "Family Day ring toss: every player gets 10 bonus points, plus 5 points for each ring r that lands on a bottle. Rina scored 45 points.", tiles: ["5r", "+", "10", "=", "45", "15r", "r", "−"], accept: ["5r + 10 = 45", "10 + 5r = 45", "45 = 5r + 10", "45 = 10 + 5r"], why: "The booth’s scoring rule is the expression 5r + 10; Rina’s score makes it the equation 5r + 10 = 45." },
    { text: "Twice a number n, decreased by 4, is 18.", tiles: ["2n", "−", "4", "=", "18", "+", "n", "4n"], accept: ["2n − 4 = 18", "18 = 2n − 4"], why: "Twice a number is 2n; decreased by 4 gives 2n − 4." },
    { text: "Mika bought 3 notebooks at ₱p each and paid ₱105 in all.", tiles: ["3p", "=", "105", "+", "3", "p", "102"], accept: ["3p = 105", "105 = 3p"], why: "3 notebooks at p pesos each cost 3p pesos." },
  ];

  function story(root) {
    let idx = 0;
    const springs = [];
    const area = h("div", { class: "stage-body" });
    const tileStyle = "font-family:var(--mono);font-size:1.15rem;min-width:2.6em";
    function render() {
      clear(area);
      const st = STORIES[idx];
      const line = h("div", { class: "choices", style: "min-height:58px;border:2px dashed var(--line);border-radius:10px;padding:8px;align-items:center", "aria-label": "Your equation" });
      const bank = h("div", { class: "choices", "aria-label": "Tiles" });
      const res = h("div", { "aria-live": "polite" });
      const move = (b, to) => { const a = b.getBoundingClientRect(); to.append(b); const c = b.getBoundingClientRect(); fly(b, a.left - c.left, a.top - c.top, springs); clear(res); };
      shuffle(st.tiles).forEach((t) => {
        const b = h("button", { type: "button", style: tileStyle }, t);
        b.dataset.t = t;
        b.addEventListener("click", () => move(b, b.parentNode === bank ? line : bank));
        bank.append(b);
      });
      const check = () => {
        const built = [...line.children].map((b) => b.dataset.t).join(" ");
        clear(res);
        const ok = st.accept.includes(built);
        res.append(pill(ok, `Yes! ${built}`, built ? "Not yet – read the story again." : "Tap tiles to build the equation first."), h("p", { class: "note" }, ok ? st.why : "Find the unknown, what happens to it, and what it equals. “is”, “paid”, and “scored” usually mean ="));
      };
      area.append(h("p", { class: "workings", style: "font-family:var(--body);font-size:1rem" }, st.text), h("p", { class: "note" }, "Tap tiles to move them into the equation; tap a placed tile to send it back."), line, bank,
        h("div", { class: "controls" }, h("button", { class: "btn", type: "button", onclick: check }, "Check my equation"),
          h("button", { class: "btn ghost", type: "button", onclick: () => { idx = (idx + 1) % STORIES.length; render(); } }, "Next story")), res);
    }
    root.append(area);
    render();
    return () => springs.forEach((sp) => sp.stop());
  }

  // ------------------------------------------------------------ guess and check (shared by Solve It and Problem Solving)

  function solver(root, items, picture) {
    let it = items[0], v = 0, guesses = [];
    const svg = s("svg", { viewBox: "0 0 600 240", role: "img", "aria-label": "Both sides of the equation for the current guess" });
    const intro = h("p", {}), eqEl = h("p", { class: "unit-big" }), sliderBox = h("div", { class: "controls" }), out = h("div", { "aria-live": "polite" }), work = h("pre", { class: "workings" }), table = h("p", { class: "note" });
    function draw() {
      clear(svg);
      const g = Math.round(v), L = Math.max(0, it.f(Math.max(0, v))), R = it.target;
      if (picture) it.draw(svg, Math.max(0, v));
      else {
        const top = Math.max(R, it.f(it.max)) * 1.05, Y = (x) => 200 - (x / top) * 170;
        svg.append(s("line", { x1: 60, y1: 200, x2: 540, y2: 200, stroke: "var(--ink)", "stroke-width": 2 }));
        svg.append(s("rect", { x: 140, y: Y(L), width: 110, height: 200 - Y(L), rx: 4, fill: "var(--shape-a-soft)", stroke: "var(--shape-a)", "stroke-width": 2 }),
          s("rect", { x: 350, y: Y(R), width: 110, height: 200 - Y(R), rx: 4, fill: "var(--shape-b-soft)", stroke: "var(--shape-b)", "stroke-width": 2 }),
          s("line", { x1: 120, y1: Y(R), x2: 480, y2: Y(R), stroke: "var(--shape-b)", "stroke-dasharray": "6 5" }),
          s("text", { x: 195, y: 224, "text-anchor": "middle", class: "svg-text", style: "font-size:16px" }, "left side"),
          s("text", { x: 405, y: 224, "text-anchor": "middle", class: "svg-text", style: "font-size:16px" }, "right side"),
          s("text", { x: 195, y: Y(L) - 8, "text-anchor": "middle", class: "svg-text", style: "font-size:20px", "font-weight": 700 }, fm(it.f(g))),
          s("text", { x: 405, y: Y(R) - 8, "text-anchor": "middle", class: "svg-text", style: "font-size:20px", "font-weight": 700 }, fmt(R, 2)));
      }
      const lv = it.f(g), sign = Math.abs(lv - R) < 1e-9 ? "=" : lv < R ? "<" : ">";
      clear(out);
      out.append(h("p", { class: "unit-big" }, `${it.v} = ${g}:  ${it.show(g)} = ${fm(lv)} ${sign} ${fm(R)}`));
      const solved = sign === "=" && Math.abs(v - g) < 0.05;
      if (solved) {
        out.append(pill(true, `${it.v} = ${g} makes both sides equal – it is the solution.`, ""));
        work.textContent = ["Inverse operations:", `  ${it.text}`, ...it.steps.map((t) => `  ${t}`), "", `Check: ${it.show(g)} = ${fmt(lv, 2)} ✓`].join("\n");
      }
      work.hidden = !solved;
    }
    function settled(x) {
      const g = Math.round(x);
      guesses = [...guesses.filter((q) => q !== g), g].slice(-6);
      table.textContent = "Guesses so far: " + guesses.map((q) => `${it.v} = ${q} → ${fm(it.f(q))}`).join(" · ");
    }
    function setup(x) {
      it = x; guesses = []; v = 0;
      intro.textContent = it.story || "Slide the guess. Watch the two sides get closer until they are equal.";
      eqEl.textContent = it.text;
      clear(sliderBox);
      sliderBox.append(elasticSlider({ id: "t3l7-guess", label: `Guess ${it.v}`, min: 0, max: it.max, value: 0, step: 1, format: (u) => String(Math.round(u)),
        onInput: (u) => { v = u; draw(); }, onChange: settled }).el);
      table.textContent = "";
      draw();
    }
    root.append(h("div", { class: "controls" }, segmented(items, items[0], setup, (x) => x.label || x.text)), intro, eqEl, sliderBox, svg, out, work, table);
    setup(items[0]);
  }

  const EQS = [
    { text: "25d = 300", v: "d", max: 20, f: (x) => 25 * x, target: 300, show: (x) => `25(${x})`, steps: ["25d ÷ 25 = 300 ÷ 25   (Division Property)", "d = 12"] },
    { text: "n + 8 = 21", v: "n", max: 25, f: (x) => x + 8, target: 21, show: (x) => `${x} + 8`, steps: ["n + 8 − 8 = 21 − 8   (Subtraction Property)", "n = 13"] },
    { text: "13 + 2k = 25", v: "k", max: 15, f: (x) => 13 + 2 * x, target: 25, show: (x) => `13 + 2(${x})`, steps: ["13 + 2k − 13 = 25 − 13 → 2k = 12   (Subtraction Property)", "2k ÷ 2 = 12 ÷ 2 → k = 6   (Division Property)"] },
    { text: "5r + 10 = 45", v: "r", max: 15, f: (x) => 5 * x + 10, target: 45, show: (x) => `5(${x}) + 10`, steps: ["5r + 10 − 10 = 45 − 10 → 5r = 35   (Subtraction Property)", "5r ÷ 5 = 35 ÷ 5 → r = 7   (Division Property)"] },
    { text: "2n − 4 = 18", v: "n", max: 20, f: (x) => 2 * x - 4, target: 18, show: (x) => `2(${x}) − 4`, steps: ["2n − 4 + 4 = 18 + 4 → 2n = 22   (Addition Property)", "2n ÷ 2 = 22 ÷ 2 → n = 11   (Division Property)"] },
    { text: "x ÷ 4 = 6", v: "x", max: 40, f: (x) => x / 4, target: 6, show: (x) => `${x} ÷ 4`, steps: ["(x ÷ 4) × 4 = 6 × 4   (Multiplication Property)", "x = 24"] },
  ];

  // ------------------------------------------------------------ problem solving pictures

  function garden(svg, l) {
    const sc = 30, W = l * sc, H = 5 * sc, x = 300 - W / 2;
    svg.append(s("rect", { x, y: 50, width: Math.max(0, W), height: H, fill: "var(--shape-a-soft)", stroke: "var(--shape-a)", "stroke-width": 3 }),
      s("text", { x: 300, y: 40, "text-anchor": "middle", class: "svg-text", style: "font-size:20px" }, `l = ${fmt(l, 1)} m`),
      s("text", { x: x + W + 8, y: 120, class: "svg-text", style: "font-size:20px" }, "5 m"),
      s("text", { x: 300, y: 222, "text-anchor": "middle", class: "svg-text", style: "font-size:22px", "font-weight": 700 }, `P = 2(${fmt(l, 1)}) + 2(5) = ${fmt(2 * l + 10, 1)} m`));
  }
  function tickets(svg, t) {
    const n = Math.round(t);
    for (let i = 0; i < n; i++) svg.append(s("rect", { x: 30 + i * 46, y: 40, width: 40, height: 30, rx: 5, fill: "var(--gold-soft)", stroke: "var(--gold)", "stroke-width": 2 }), s("text", { x: 50 + i * 46, y: 61, "text-anchor": "middle", class: "svg-text", style: "font-size:15px" }, "₱20"));
    svg.append(s("rect", { x: 30 + n * 46, y: 40, width: 60, height: 30, rx: 15, fill: "var(--shape-b-soft)", stroke: "var(--shape-b)", "stroke-width": 2 }), s("text", { x: 60 + n * 46, y: 61, "text-anchor": "middle", class: "svg-text", style: "font-size:15px" }, "₱30"));
    const k = 480 / 220, cost = 20 * t + 30;
    svg.append(s("rect", { x: 60, y: 110, width: 150 * k, height: 34, fill: "none", stroke: "var(--ink)", "stroke-width": 2, "stroke-dasharray": "6 4" }),
      s("rect", { x: 60, y: 114, width: cost * k, height: 26, fill: cost > 150.01 ? "var(--bad)" : "var(--shape-a)", opacity: 0.7 }),
      s("text", { x: 60 + 150 * k, y: 166, "text-anchor": "middle", class: "svg-text", style: "font-size:18px" }, "₱150 budget"),
      s("text", { x: 300, y: 214, "text-anchor": "middle", class: "svg-text", style: "font-size:22px", "font-weight": 700 }, `20(${fmt(t, 1)}) + 30 = ₱${fmt(cost, 1)}`));
  }
  function banner(svg, ht) {
    const b = 8, sc = 15, base = 190, x0 = 300 - (b * sc) / 2;
    svg.append(s("path", { d: `M${x0},${base} L${x0 + b * sc},${base} L${300},${base - ht * sc} Z`, fill: "var(--shape-b-soft)", stroke: "var(--shape-b)", "stroke-width": 3 }),
      s("line", { x1: 300, y1: base, x2: 300, y2: base - ht * sc, stroke: "var(--ink)", "stroke-dasharray": "4 4" }),
      s("text", { x: 306, y: base - (ht * sc) / 2, class: "svg-text", style: "font-size:19px" }, `h = ${fmt(ht, 1)}`),
      s("text", { x: 300, y: base + 22, "text-anchor": "middle", class: "svg-text", style: "font-size:19px" }, "b = 8 dm"),
      s("text", { x: 470, y: 90, "text-anchor": "middle", class: "svg-text", style: "font-size:18px", "font-weight": 700 }, `A = ½(8)(${fmt(ht, 1)})`),
      s("text", { x: 470, y: 118, "text-anchor": "middle", class: "svg-text", style: "font-size:18px", "font-weight": 700 }, `= ${fmt(4 * ht, 1)} dm²`));
  }
  function savings(svg, d) {
    const k = 500 / 225;
    for (let i = 0; i < Math.floor(d); i++) svg.append(s("rect", { x: 50 + i * 15 * k, y: 70, width: 15 * k - 2, height: 50, fill: i % 2 ? "var(--shape-a-soft)" : "var(--gold-soft)", stroke: "var(--ink)" }));
    const part = d - Math.floor(d);
    if (part > 0.01) svg.append(s("rect", { x: 50 + Math.floor(d) * 15 * k, y: 70, width: part * 15 * k, height: 50, fill: "var(--gold-soft)", stroke: "var(--ink)", opacity: 0.6 }));
    svg.append(s("line", { x1: 50 + 120 * k, y1: 50, x2: 50 + 120 * k, y2: 140, stroke: "var(--shape-b)", "stroke-width": 3 }),
      s("text", { x: 50 + 120 * k, y: 40, "text-anchor": "middle", class: "svg-text", style: "font-size:18px" }, "goal ₱120"),
      s("text", { x: 50, y: 160, class: "svg-label", style: "font-size:18px" }, "Each block = ₱15 saved in one day (₱50 − ₱35)"),
      s("text", { x: 300, y: 210, "text-anchor": "middle", class: "svg-text", style: "font-size:22px", "font-weight": 700 }, `savings = 15(${fmt(d, 1)}) = ₱${fmt(15 * d, 1)}`));
  }

  const PROBLEMS = [
    { label: "Perimeter", story: "A rectangular garden has a perimeter of 30 m and a width of 5 m. How long is it? Use P = 2l + 2w.", text: "2l + 2(5) = 30", v: "l", max: 15, f: (x) => 2 * x + 10, target: 30, show: (x) => `2(${x}) + 2(5)`, draw: garden, steps: ["2l + 10 = 30", "2l = 20   (Subtraction Property)", "l = 10   (Division Property)"] },
    { label: "Cost", story: "Family Day: rides cost ₱20 per ticket and a snack costs ₱30. Jo has ₱150. How many tickets t can Jo buy with one snack?", text: "20t + 30 = 150", v: "t", max: 10, f: (x) => 20 * x + 30, target: 150, show: (x) => `20(${x}) + 30`, draw: tickets, steps: ["20t = 120   (Subtraction Property)", "t = 6   (Division Property)"] },
    { label: "Area", story: "A triangular banner has an area of 24 dm² and a base of 8 dm. How tall is it? Use A = ½bh.", text: "½(8)h = 24", v: "h", max: 12, f: (x) => 4 * x, target: 24, show: (x) => `½(8)(${x})`, draw: banner, steps: ["4h = 24", "h = 6   (Division Property)"] },
    { label: "Savings", story: "Leo’s baon is ₱50 a day and Leo spends ₱35, so Leo saves 15d pesos in d days. After how many days will Leo have ₱120?", text: "15d = 120", v: "d", max: 15, f: (x) => 15 * x, target: 120, show: (x) => `15(${x})`, draw: savings, steps: ["15d ÷ 15 = 120 ÷ 15   (Division Property)", "d = 8"] },
  ];

  // ------------------------------------------------------------ lesson

  Sim.register({
    id: "lesson25", unit: "I", num: 7, letter: "G", title: "Writing and Solving Equations", simName: "Equation Builder",
    comps: ["A11", "A12", "A13", "M7", "T1"], cycles: "C7,M2 – C8,M1", deped: "DepEd Weeks 6–7",
    bigQuestion: "How can one letter stand for every possible number?",
    mission: [
      "Story to Equation: build the equation for Ana’s savings and for the Family Day ring-toss booth.",
      "Solve It: slide the guess for 25d = 300. How do the two sides change as d grows?",
      "Solve It: find each solution, then compare it with the inverse-operation steps.",
      "Problem Solving: solve the four problems and check each answer by substituting it back.",
    ],
    discovery: "To write an equation, name the unknown with a letter, translate what happens to it, and set it equal to the given total. The letter can stand for any number, but only ONE number makes both sides equal – the solution. Guess-and-check finds it by watching the two sides get closer; inverse operations find it directly. Substituting the answer back always checks it.",
    mount(stage) {
      const body = h("div", { class: "stage-body" });
      const views = [story, (r) => solver(r, EQS, false), (r) => solver(r, PROBLEMS, true)];
      let stopper = null;
      const t = tabs(["Story to Equation", "Solve It", "Problem Solving"], (i) => { if (stopper) stopper(); clear(body); stopper = views[i](body) || null; });
      stage.append(t.el, body);
      stopper = story(body);
      return () => { if (stopper) stopper(); };
    },
    check() {
      const kind = randInt(0, 4);
      if (kind === 0) {
        const a = randInt(15, 40), d = randInt(4, 12);
        return { q: `Ana saves ₱${a} a day. Which equation finds the number of days d until Ana has ₱${a * d}?`, choices: shuffle([`${a}d = ${a * d}`, `d + ${a} = ${a * d}`, `d ÷ ${a} = ${a * d}`, `${a * d}d = ${a}`]), answer: `${a}d = ${a * d}`, explain: `₱${a} for each of d days is ${a}d pesos.` };
      }
      if (kind === 1) { const n = randInt(3, 20), a = randInt(2, 15); return { q: `Solve n + ${a} = ${n + a}.`, answer: n, explain: `Subtract ${a} from both sides: n = ${n}.` }; }
      if (kind === 2) { const x = randInt(2, 12), a = randInt(2, 6), b = randInt(1, 15); return { q: `Solve ${a}x + ${b} = ${a * x + b}.`, answer: x, explain: `${a}x = ${a * x}, so x = ${x}. Check: ${a}(${x}) + ${b} = ${a * x + b}.` }; }
      if (kind === 3) { const r = randInt(3, 9); return { q: `At the Family Day ring toss, a player scores 5r + 10 points for r rings. Ivy scored ${5 * r + 10}. How many rings landed?`, answer: r, explain: `5r + 10 = ${5 * r + 10} → 5r = ${5 * r} → r = ${r}.` }; }
      const l = randInt(6, 15), w = randInt(2, 6);
      return { q: `A rectangle has perimeter ${2 * l + 2 * w} m and width ${w} m. What is its length?`, answer: l, unit: "m", explain: `2l + ${2 * w} = ${2 * l + 2 * w} → 2l = ${2 * l} → l = ${l} m.` };
    },
  });
})();
