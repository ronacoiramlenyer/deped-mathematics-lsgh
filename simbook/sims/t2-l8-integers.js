/* Term 2 · Lesson 8 · H. The Set of Integers – Integer Elevator */
(function () {
  "use strict";
  const { h, s, clear, randInt, pick, fmt, segmented, stat, pill, Spring } = Sim;

  const CONTEXTS = {
    elevator: { label: "Elevator", zero: "ground floor", unit: "floor", pos: (n) => `${n} floor${n === 1 ? "" : "s"} above the ground floor`, neg: (n) => `${n} floor${n === 1 ? "" : "s"} below the ground floor (Basement ${n})` },
    thermo: { label: "Thermometer", zero: "0 °C (water freezes)", unit: "°C", pos: (n) => `${n} °C above zero`, neg: (n) => `${n} °C below zero` },
    sea: { label: "Sea level", zero: "sea level", unit: "m", scale: 10, pos: (n) => `${n} m above sea level`, neg: (n) => `${n} m below sea level` },
    money: { label: "Money", zero: "no savings, no debt", unit: "₱", scale: 50, pos: (n) => `₱${n} saved (a deposit)`, neg: (n) => `₱${n} owed (a debt or withdrawal)` },
  };

  function elevator(root) {
    let ctx = "elevator", v = 3, show = true, ghost = -3;
    const svg = s("svg", { viewBox: "0 0 600 460", role: "img", "aria-label": "Vertical number line" });
    const marker = s("g", { class: "token", tabindex: 0, "aria-label": "Drag the marker" });
    const ghostEl = s("g", { opacity: 0.45 });
    const layer = s("g");
    svg.append(layer, ghostEl, marker);
    const out = h("p", { class: "unit-big", "aria-live": "polite" });
    const info = h("div", { class: "readout" });
    const Y = (n) => 230 - n * 21;
    const move = new Spring(3, (x) => { v = x; paint(); }, { stiffness: 220, damping: 15 });
    const gmove = new Spring(-3, (x) => { ghost = x; paint(); }, { stiffness: 160, damping: 13 });
    function base() {
      clear(layer);
      const c = CONTEXTS[ctx], sc = c.scale || 1;
      layer.append(s("line", { x1: 300, y1: Y(10), x2: 300, y2: Y(-10), stroke: "var(--ink)", "stroke-width": 3 }));
      for (let n = -10; n <= 10; n++) {
        layer.append(s("line", { x1: 290, y1: Y(n), x2: 310, y2: Y(n), stroke: "var(--ink)", "stroke-width": n === 0 ? 3 : 1.5 }));
        layer.append(s("text", { x: 280, y: Y(n) + 4, "text-anchor": "end", class: "svg-text", "font-size": 12, fill: n < 0 ? "var(--shape-b)" : n > 0 ? "var(--shape-a)" : "var(--ink)" }, String(n * sc)));
      }
      if (ctx === "elevator") for (let n = -10; n <= 10; n++) layer.append(s("text", { x: 320, y: Y(n) + 4, class: "svg-label", "font-size": 11 }, n === 0 ? "G" : n < 0 ? `B${-n}` : `${n}F`));
      if (ctx === "sea") layer.append(s("rect", { x: 20, y: Y(0), width: 560, height: Y(-10) - Y(0) + 10, fill: "var(--shape-a-soft)", opacity: 0.5 }));
      layer.append(s("text", { x: 340, y: Y(0) - 8, class: "svg-label", "font-weight": 700 }, `0 = ${c.zero}`));
      layer.append(s("text", { x: 300, y: 14, "text-anchor": "middle", class: "svg-label" }, "positive ↑"), s("text", { x: 300, y: 454, "text-anchor": "middle", class: "svg-label" }, "negative ↓"));
      clear(marker); clear(ghostEl);
      marker.append(s("rect", { x: -34, y: -14, width: 68, height: 28, rx: 8, fill: "var(--accent)" }), s("text", { y: 5, "text-anchor": "middle", class: "svg-text", fill: "var(--accent-ink)", "font-weight": 700 }, ""));
      ghostEl.append(s("rect", { x: -34, y: -14, width: 68, height: 28, rx: 8, fill: "none", stroke: "var(--accent)", "stroke-width": 2, "stroke-dasharray": "4 3" }), s("text", { y: 5, "text-anchor": "middle", class: "svg-text", "font-weight": 700 }, ""));
    }
    function paint() {
      const c = CONTEXTS[ctx], sc = c.scale || 1, n = Math.round(v);
      marker.setAttribute("transform", `translate(${380},${Y(v)})`);
      marker.querySelector("text").textContent = String(Math.round(v) * sc);
      ghostEl.setAttribute("transform", `translate(${220},${Y(ghost)})`);
      ghostEl.setAttribute("visibility", show ? "visible" : "hidden");
      ghostEl.querySelector("text").textContent = String(-n * sc);
      const amt = Math.abs(n) * sc;
      out.textContent = n === 0 ? `0 → ${c.zero}` : `${n * sc} → ${n > 0 ? c.pos(amt) : c.neg(amt)}`;
      clear(info);
      info.append(stat("Integer:", String(n * sc)).el, stat("Opposite:", String(-n * sc)).el, pill(n !== 0, n > 0 ? "positive" : "negative", "zero – neither positive nor negative"));
    }
    Sim.draggable(svg, marker, (p) => { move.stop(); v = Sim.rubber((230 - p.y) / 21, -10, 10, 0.3); move.value = v; move.vel = 0; gmove.set(-Math.round(v)); paint(); }, () => { move.set(Math.max(-10, Math.min(10, Math.round(v)))); gmove.set(-Math.max(-10, Math.min(10, Math.round(v)))); });
    root.append(h("div", { class: "controls" }, h("span", {}, "Context"), segmented(Object.keys(CONTEXTS), ctx, (k) => { ctx = k; base(); paint(); }, (k) => CONTEXTS[k].label),
      h("label", {}, h("input", { type: "checkbox", id: "t2l8-opp", checked: true, onchange: (e) => { show = e.target.checked; paint(); } }), "Show the opposite")),
    svg, out, info, h("p", { class: "note" }, "Drag the green marker up or down. The dashed marker shows the opposite – the same distance from 0 on the other side."));
    base(); paint();
    return () => { move.stop(); gmove.stop(); };
  }

  const STATEMENTS = [
    ["a gain of 8 points in a game", 8], ["a loss of 5 kilograms", -5], ["3 floors below the ground floor", -3], ["a deposit of ₱200", 200],
    ["a withdrawal of ₱150", -150], ["12 °C below zero", -12], ["40 m above sea level", 40], ["a temperature drop of 4 degrees", -4], ["2 steps forward", 2], ["a debt of ₱75", -75],
  ];

  Sim.register({
    id: "lesson17", unit: "G", num: 8, letter: "H", title: "The Set of Integers", simName: "Integer Elevator",
    comps: ["A15", "A16", "M8"], cycles: "C9,M1 – C9,M4", deped: "DepEd Week 9",
    bigQuestion: "What number describes a basement floor?",
    mission: [
      "Elevator: ride to Basement 3. What integer is that? What is its opposite?",
      "Switch to Thermometer, Sea level, and Money. Describe −4 in each context.",
      "What does 0 mean in each context?",
      "Find two integers that are opposites and explain why.",
    ],
    discovery: "The integers are the whole numbers and their opposites: {…, −3, −2, −1, 0, 1, 2, 3, …}. Positive integers describe gains, deposits, going up, or above zero; negative integers describe losses, withdrawals, going down, or below zero. Zero is neither positive nor negative. Opposites are the same distance from 0 on opposite sides.",
    mount(stage) { const body = h("div", { class: "stage-body" }); stage.append(body); return elevator(body); },
    check() {
      const kind = randInt(0, 3);
      if (kind <= 1) { const [t, n] = pick(STATEMENTS); return { q: `Write an integer for ${t}.`, answer: n, explain: `${t} → ${n}.` }; }
      if (kind === 2) { const n = pick([-9, -4, 7, 12, -15, 3]); return { q: `What is the opposite of ${n}?`, answer: -n, explain: `The opposite of ${n} is ${-n}.` }; }
      return pick([
        { q: "Is 0 a positive integer, a negative integer, or neither?", choices: ["Positive", "Negative", "Neither"], answer: "Neither", explain: "Zero is neither positive nor negative." },
        { q: "Is −7 an integer?", choices: ["Yes", "No"], answer: "Yes", explain: "−7 is the opposite of the whole number 7." },
        { q: "Is 2.5 an integer?", choices: ["Yes", "No"], answer: "No", explain: "Integers have no fractional part." },
      ]);
    },
  });
})();
