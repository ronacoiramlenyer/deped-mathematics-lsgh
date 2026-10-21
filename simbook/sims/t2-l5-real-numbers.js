/* Term 2 · Lesson 5 · E. Subsets of Real Numbers – Real Number Map */
(function () {
  "use strict";
  const { h, s, clear, randInt, pick, shuffle, fmt, stat, pill, Spring } = Sim;

  // Regions, from the innermost out. Each card belongs to the innermost one that holds it.
  const REGIONS = [
    { key: "N", name: "Natural numbers", short: "ℕ", box: { x: 160, y: 120, w: 110, h: 80 }, color: "var(--accent-soft)" },
    { key: "W", name: "Whole numbers", short: "W", box: { x: 140, y: 90, w: 150, h: 135 }, color: "var(--shape-a-soft)" },
    { key: "Z", name: "Integers", short: "ℤ", box: { x: 120, y: 60, w: 190, h: 190 }, color: "var(--gold-soft)" },
    { key: "Q", name: "Rational numbers", short: "ℚ", box: { x: 30, y: 30, w: 360, h: 250 }, color: "var(--grid)" },
    { key: "I", name: "Irrational numbers", short: "𝕀", box: { x: 410, y: 30, w: 170, h: 250 }, color: "var(--shape-b-soft)" },
  ];
  const CARDS = [
    { t: "7", k: "N" }, { t: "1", k: "N" }, { t: "25", k: "N" }, { t: "√16", k: "N", why: "√16 = 4" },
    { t: "0", k: "W" }, { t: "−3", k: "Z" }, { t: "−10", k: "Z" }, { t: "−√9", k: "Z", why: "−√9 = −3" },
    { t: "2/3", k: "Q" }, { t: "0.25", k: "Q" }, { t: "−1.5", k: "Q" }, { t: "0.333…", k: "Q", why: "0.333… = 1/3" }, { t: "3 1/2", k: "Q" },
    { t: "√2", k: "I" }, { t: "π", k: "I" }, { t: "√10", k: "I" }, { t: "∛5", k: "I" },
  ];
  const ORDER = ["N", "W", "Z", "Q"];
  const memberships = (k) => (k === "I" ? ["Irrational", "Real"] : ORDER.slice(ORDER.indexOf(k)).map((x) => REGIONS.find((r) => r.key === x).name.replace(" numbers", "")).concat("Real"));

  function map(root) {
    const svg = s("svg", { viewBox: "0 0 600 420", role: "img", "aria-label": "Nested sets of real numbers" });
    const layer = s("g");
    const out = h("div", { class: "readout" }), info = h("p", { class: "note", "aria-live": "polite" });
    let tokens = [], placed = 0;
    function draw() {
      clear(svg);
      svg.append(s("rect", { x: 10, y: 6, width: 580, height: 290, rx: 14, fill: "none", stroke: "var(--ink)", "stroke-width": 2 }));
      svg.append(s("text", { x: 22, y: 24, class: "svg-text", "font-weight": 700 }, "Real numbers ℝ"));
      [...REGIONS].reverse().forEach((r) => {
        svg.append(s("rect", { x: r.box.x, y: r.box.y, width: r.box.w, height: r.box.h, rx: 12, fill: r.color, stroke: "var(--ink)", "stroke-width": 1.5 }));
        svg.append(s("text", { x: r.box.x + 8, y: r.box.y + 16, class: "svg-label", "font-weight": 700 }, `${r.name} ${r.short}`));
      });
      svg.append(s("rect", { x: 10, y: 306, width: 580, height: 108, rx: 10, fill: "var(--grid)" }));
      svg.append(layer);
    }
    const inBox = (p, b) => p.x > b.x && p.x < b.x + b.w && p.y > b.y && p.y < b.y + b.h;
    const regionAt = (p) => { for (const r of REGIONS) if (inBox(p, r.box)) return r.key; return null; };
    // Resting slots inside each region's own part (not inside a smaller set).
    const SLOTS = {
      N: [[190, 145], [245, 145], [190, 180], [245, 180]],
      W: [[215, 212], [175, 212], [255, 212]],
      Z: [[165, 238], [215, 238], [265, 238]],
      Q: [[75, 80], [75, 130], [75, 180], [75, 230], [350, 100], [350, 160], [350, 220]],
      I: [[455, 90], [535, 90], [455, 150], [535, 150], [455, 210], [535, 210]],
    };
    const counts = {};
    const restFor = (k) => { const i = (counts[k] = (counts[k] || 0) + 1) - 1; const [x, y] = SLOTS[k][i % SLOTS[k].length]; return { x, y }; };
    function reset() {
      draw(); clear(layer); Object.keys(counts).forEach((k) => delete counts[k]); placed = 0; info.textContent = "";
      tokens = shuffle(CARDS).map((c, i) => {
        const g = s("g", { class: "token", tabindex: 0, "aria-label": c.t });
        const w = Math.max(44, c.t.length * 11 + 18);
        g.append(s("rect", { x: -w / 2, y: -15, width: w, height: 30, rx: 8, fill: "var(--paper)", stroke: "var(--ink)", "stroke-width": 1.5 }), s("text", { y: 5, "text-anchor": "middle", class: "svg-text", "font-weight": 700 }, c.t));
        const tray = { x: 50 + (i % 9) * 62, y: 335 + Math.floor(i / 9) * 44 };
        const t = { c, g, tray, sp: new Spring([tray.x, tray.y], ([x, y]) => g.setAttribute("transform", `translate(${x},${y})`), { stiffness: 200, damping: 15 }), done: false };
        t.sp.jump([tray.x, tray.y]);
        Sim.draggable(svg, g, (p) => { t.sp.stop(); t.sp.jump([p.x, p.y]); }, (p) => drop(t, p));
        layer.append(g);
        return t;
      });
      report();
    }
    function drop(t, p) {
      const k = regionAt(p);
      if (!k) { t.sp.set([t.tray.x, t.tray.y]); return; }
      if (k !== t.c.k) {
        t.sp.set([t.done ? t.home.x : t.tray.x, t.done ? t.home.y : t.tray.y]);
        const wrongOuter = ORDER.includes(k) && ORDER.includes(t.c.k) && ORDER.indexOf(k) > ORDER.indexOf(t.c.k);
        info.textContent = wrongOuter ? `${t.c.t} is a ${REGIONS.find((r) => r.key === k).name.toLowerCase().replace(" numbers", " number")}, but it also fits a smaller set inside. Go deeper!` : `${t.c.t} does not belong to the ${REGIONS.find((r) => r.key === k).name.toLowerCase()}.`;
        return;
      }
      if (!t.done) { t.done = true; placed++; t.home = restFor(k); }
      t.sp.set([t.home.x, t.home.y]);
      info.textContent = `${t.c.t}${t.c.why ? ` (${t.c.why})` : ""} belongs to: ${memberships(t.c.k).join(" ⊂ ")}… numbers.`;
      t.g.querySelector("rect").setAttribute("fill", "var(--accent-soft)");
      report();
    }
    function report() { clear(out); out.append(stat("Placed:", `${placed} of ${CARDS.length}`).el, placed === CARDS.length ? pill(true, "Every card is in its smallest set!", "") : null); }
    root.append(h("div", { class: "controls" }, h("button", { class: "btn ghost", type: "button", onclick: reset }, "Start over")), svg, info, out,
      h("p", { class: "note" }, "Drag each card into the SMALLEST set it belongs to. Every set inside is also part of the sets around it."));
    reset();
    return () => tokens.forEach((t) => t.sp.stop());
  }

  Sim.register({
    id: "lesson14", unit: "E", num: 5, letter: "E", title: "Subsets of Real Numbers", simName: "Real Number Map",
    comps: ["A10", "M5"], cycles: "C6,M1 – C6,M2", deped: "DepEd Week 6",
    bigQuestion: "Is every whole number also a rational number?",
    mission: [
      "Drag every card into the smallest set it belongs to.",
      "Where did √16 and −√9 go? Why are they not irrational?",
      "Name one number that is rational but not an integer, and one that is real but not rational.",
      "Explain why the natural numbers sit inside the whole numbers.",
    ],
    discovery: "The real numbers are made of the rational and the irrational numbers. Inside the rational numbers are the integers; inside the integers are the whole numbers (0, 1, 2, …); inside those are the natural numbers (1, 2, 3, …). So every natural number is also whole, an integer, rational, and real. Irrational numbers like √2 and π are real but not rational.",
    mount(stage) { const body = h("div", { class: "stage-body" }); stage.append(body); return map(body); },
    check() {
      const c = pick(CARDS);
      const kind = randInt(0, 2);
      if (kind === 0) {
        const name = { N: "Natural", W: "Whole", Z: "Integer", Q: "Rational", I: "Irrational" }[c.k];
        return { q: `What is the smallest set that contains ${c.t}?`, choices: ["Natural", "Whole", "Integer", "Rational", "Irrational"], answer: name, explain: `${c.t}${c.why ? ` (${c.why})` : ""} belongs to: ${memberships(c.k).join(", ")}.` };
      }
      if (kind === 1) {
        const [setName, inSet] = pick([["an integer", ["N", "W", "Z"]], ["a rational number", ["N", "W", "Z", "Q"]], ["a whole number", ["N", "W"]], ["a natural number", ["N"]]]);
        return { q: `Is ${c.t} ${setName}?`, choices: ["Yes", "No"], answer: inSet.includes(c.k) ? "Yes" : "No", explain: `${c.t}${c.why ? ` (${c.why})` : ""} belongs to: ${memberships(c.k).join(", ")}.` };
      }
      return pick([
        { q: "True or false: every integer is a rational number.", choices: ["True", "False"], answer: "True", explain: "Any integer n can be written as n/1." },
        { q: "True or false: every rational number is an integer.", choices: ["True", "False"], answer: "False", explain: "1/2 is rational but not an integer." },
        { q: "True or false: 0 is a natural number.", choices: ["True", "False"], answer: "False", explain: "The natural numbers start at 1; 0 is a whole number." },
        { q: "True or false: π is a real number.", choices: ["True", "False"], answer: "True", explain: "π is irrational, and every irrational number is real." },
      ]);
    },
  });
})();
