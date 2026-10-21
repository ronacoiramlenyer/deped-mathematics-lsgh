/* Term 2 · Lesson 9 · I. Comparing and Ordering Integers – Integer Number Line */
(function () {
  "use strict";
  const { h, s, clear, randInt, pick, shuffle, fmt, tabs, stat, pill, Spring } = Sim;
  const X = (n) => 300 + n * 26;

  function numberLine(svg, lo = -10, hi = 10) {
    svg.append(s("line", { x1: X(lo) - 14, y1: 120, x2: X(hi) + 14, y2: 120, stroke: "var(--ink)", "stroke-width": 2.5 }));
    svg.append(s("path", { d: `M${X(hi) + 14},120 l-10,-6 v12 z`, fill: "var(--ink)" }), s("path", { d: `M${X(lo) - 14},120 l10,-6 v12 z`, fill: "var(--ink)" }));
    for (let n = lo; n <= hi; n++) {
      svg.append(s("line", { x1: X(n), y1: 112, x2: X(n), y2: 128, stroke: "var(--ink)", "stroke-width": n === 0 ? 3 : 1.5 }));
      svg.append(s("text", { x: X(n), y: 148, "text-anchor": "middle", class: "svg-text", "font-size": 12, fill: n < 0 ? "var(--shape-b)" : n > 0 ? "var(--shape-a)" : "var(--ink)" }, String(n)));
    }
  }

  // ------------------------------------------------------------ compare

  function compare(root) {
    let a = -4, b = 3;
    const svg = s("svg", { viewBox: "0 0 600 200", role: "img", "aria-label": "Two integers on a number line" });
    const base = s("g"), marks = s("g"); svg.append(base, marks);
    numberLine(base);
    const out = h("p", { class: "unit-big", "aria-live": "polite" }), why = h("p", { class: "note" });
    const mk = (label, color) => { const g = s("g", { class: "token", tabindex: 0, "aria-label": `Marker ${label}` }); g.append(s("path", { d: "M0,0 l-14,-26 h28 z", fill: color }), s("text", { y: -34, "text-anchor": "middle", class: "svg-text", "font-weight": 700 }, label)); marks.append(g); return g; };
    const ga = mk("a", "var(--shape-b)"), gb = mk("b", "var(--shape-a)");
    const sa = new Spring(a, (v) => { a = v; paint(); }, { stiffness: 230, damping: 15 }), sb = new Spring(b, (v) => { b = v; paint(); }, { stiffness: 230, damping: 15 });
    const fromX = (x) => Sim.rubber((x - 300) / 26, -10, 10, 0.3);
    Sim.draggable(svg, ga, (p) => { sa.stop(); a = fromX(p.x); sa.value = a; sa.vel = 0; paint(); }, () => sa.set(Math.max(-10, Math.min(10, Math.round(a)))));
    Sim.draggable(svg, gb, (p) => { sb.stop(); b = fromX(p.x); sb.value = b; sb.vel = 0; paint(); }, () => sb.set(Math.max(-10, Math.min(10, Math.round(b)))));
    function paint() {
      ga.setAttribute("transform", `translate(${X(a)},110)`); gb.setAttribute("transform", `translate(${X(b)},110)`);
      const A = Math.round(a), B = Math.round(b);
      const sign = A < B ? "<" : A > B ? ">" : "=";
      out.textContent = `${A}  ${sign}  ${B}`;
      why.textContent = A === B ? "They are the same point." : `${Math.max(A, B)} is farther to the right, so it is greater. ${A < 0 && B < 0 ? `Both are negative: ${Math.max(A, B)} is closer to 0, so it is greater.` : ""}`;
    }
    root.append(svg, out, why, h("p", { class: "note" }, "Drag the markers. On a number line, the number farther to the right is always greater."));
    paint();
    return () => { sa.stop(); sb.stop(); };
  }

  // ------------------------------------------------------------ order

  const CITIES = [["Moscow", -8], ["Toronto", -5], ["Seoul", -2], ["Beijing", 0], ["Baguio", 15], ["Manila", 27], ["Oslo", -4], ["Tokyo", 6]];

  function order(root) {
    const area = h("div", { class: "stage-body" });
    function deal(useCities) {
      clear(area);
      const cards = useCities ? shuffle(CITIES).slice(0, 6).map(([c, t]) => ({ label: `${c} ${t} °C`, v: t })) :
        shuffle(Array.from({ length: 21 }, (_, i) => i - 10)).slice(0, 6).map((v) => ({ label: String(v), v }));
      const chosen = [];
      const row = h("div", { class: "choices" });
      const svg = s("svg", { viewBox: "0 0 600 200", role: "img", "aria-label": "Cards placed on a number line" });
      const base = s("g"), layer = s("g"); svg.append(base, layer);
      const lo = Math.min(-10, ...cards.map((c) => c.v)), hi = Math.max(10, ...cards.map((c) => c.v));
      const scale = 540 / (hi - lo), px = (v) => 30 + (v - lo) * scale;
      base.append(s("line", { x1: 30, y1: 120, x2: 570, y2: 120, stroke: "var(--ink)", "stroke-width": 2.5 }));
      for (let n = lo; n <= hi; n++) if (n % (hi - lo > 24 ? 5 : 1) === 0) base.append(s("line", { x1: px(n), y1: 114, x2: px(n), y2: 126, stroke: "var(--ink)" }), s("text", { x: px(n), y: 146, "text-anchor": "middle", class: "svg-text", "font-size": 11 }, String(n)));
      const res = h("div");
      cards.forEach((c) => {
        const btn = h("button", { type: "button", onclick: () => {
          if (btn.disabled) return; btn.disabled = true; chosen.push(c);
          // the tapped card drops onto the line at its true place
          const g = s("g"); g.append(s("circle", { r: 7, fill: "var(--shape-b)" }), s("text", { y: chosen.length % 2 ? -14 : -32, "text-anchor": "middle", class: "svg-text", "font-size": 11, "font-weight": 700 }, c.label));
          layer.append(g);
          const sp = new Spring([300, 10], ([x, y]) => g.setAttribute("transform", `translate(${x},${y})`), { stiffness: 150, damping: 12 });
          sp.jump([300, 10]); sp.set([px(c.v), 120]);
          if (chosen.length === cards.length) {
            const sorted = [...cards].sort((x, y) => x.v - y.v);
            const ok = chosen.every((x, i) => x.v === sorted[i].v);
            res.append(pill(ok, "Perfect – least to greatest!", "Not quite – look at the number line."), h("p", { class: "workings" }, sorted.map((x) => x.label).join("  <  ")),
              h("div", { class: "controls" }, h("button", { class: "btn", type: "button", onclick: () => deal(false) }, "New integers"), h("button", { class: "btn ghost", type: "button", onclick: () => deal(true) }, "City temperatures (sample winter readings)")));
          }
        } }, c.label);
        row.append(btn);
      });
      area.append(h("p", {}, "Tap the cards from LEAST to GREATEST. Each one drops onto the number line."), row, svg, res);
    }
    root.append(area); deal(false);
  }

  Sim.register({
    id: "lesson18", unit: "G", num: 9, letter: "I", title: "Comparing and Ordering Integers", simName: "Integer Number Line",
    comps: ["A17", "A18", "M9"], cycles: "C9,M5 – C10,M2", deped: "DepEd Week 10",
    bigQuestion: "Which is colder: −8 °C or −5 °C?",
    mission: [
      "Compare: place a at −4 and b at 3. Which is greater? Why?",
      "Place both markers on negative numbers. Which one is greater now?",
      "Order: order three sets of integers from least to greatest.",
      "City temperatures (sample winter readings): order the cities from coldest to warmest.",
    ],
    discovery: "On a number line, numbers increase from left to right, so the number farther to the right is greater. Every positive integer is greater than every negative integer. For two negative integers, the one closer to 0 is greater: −5 > −8, so −8 °C is colder.",
    mount(stage) {
      const body = h("div", { class: "stage-body" });
      const views = [compare, order];
      let stopper = null;
      const t = tabs(["Compare", "Order"], (i) => { if (stopper) stopper(); clear(body); stopper = views[i](body) || null; });
      stage.append(t.el, body);
      stopper = compare(body);
      return () => { if (stopper) stopper(); };
    },
    check() {
      const kind = randInt(0, 2);
      if (kind === 0) { let a = randInt(-15, 15), b = randInt(-15, 15); while (a === b) b = randInt(-15, 15); return { q: `Which symbol makes this true: ${a} ___ ${b}?`, choices: ["<", ">"], answer: a < b ? "<" : ">", explain: `${Math.max(a, b)} is farther right on the number line.` }; }
      if (kind === 1) { const xs = shuffle([-12, -7, -3, 0, 4, 9, -1, 6]).slice(0, 4); const least = Math.min(...xs); return { q: `Which is the least: ${xs.join(", ")}?`, choices: xs.map(String), answer: String(least), explain: `${least} is farthest to the left.` }; }
      const [c1, t1] = pick(CITIES); let [c2, t2] = pick(CITIES); while (c2 === c1) [c2, t2] = pick(CITIES);
      return { q: `${c1} is ${t1} °C and ${c2} is ${t2} °C. Which city is colder?`, choices: [c1, c2], answer: t1 < t2 ? c1 : c2, explain: `${Math.min(t1, t2)} < ${Math.max(t1, t2)}.` };
    },
  });
})();
