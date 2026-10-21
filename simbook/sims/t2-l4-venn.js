/* Term 2 · Lesson 4 · D. Sets, Subsets, Union, and Intersection – Venn Lab */
(function () {
  "use strict";
  const { h, s, clear, randInt, pick, shuffle, fmt, tabs, stat, pill, Spring } = Sim;

  const RULES = {
    even: { label: "even numbers", test: (n) => n % 2 === 0 },
    odd: { label: "odd numbers", test: (n) => n % 2 === 1 },
    m3: { label: "multiples of 3", test: (n) => n % 3 === 0 },
    m4: { label: "multiples of 4", test: (n) => n % 4 === 0 },
    m5: { label: "multiples of 5", test: (n) => n % 5 === 0 },
    prime: { label: "prime numbers", test: (n) => n > 1 && [2, 3, 5, 7, 11, 13, 17, 19].includes(n) },
    f24: { label: "factors of 24", test: (n) => 24 % n === 0 },
    sq: { label: "perfect squares", test: (n) => [1, 4, 9, 16].includes(n) },
    gt10: { label: "numbers greater than 10", test: (n) => n > 10 },
  };
  const U = Array.from({ length: 20 }, (_, i) => i + 1);
  const setText = (arr) => (arr.length ? `{${arr.join(", ")}}` : "{ } (empty set)");

  function lab(root) {
    let ka = "even", kb = "m3";
    const svg = s("svg", { viewBox: "0 0 600 400", role: "img", "aria-label": "Venn diagram with number tokens" });
    const out = h("div", { class: "readout" }), work = h("pre", { class: "workings" });
    const A = { x: 230, y: 165, r: 120 }, B = { x: 370, y: 165, r: 120 };
    const regionOf = (p) => {
      if (p.y > 300) return "tray";
      const inA = Math.hypot(p.x - A.x, p.y - A.y) < A.r, inB = Math.hypot(p.x - B.x, p.y - B.y) < B.r;
      return inA && inB ? "AB" : inA ? "A" : inB ? "B" : "U";
    };
    const truth = (n) => { const a = RULES[ka].test(n), b = RULES[kb].test(n); return a && b ? "AB" : a ? "A" : b ? "B" : "U"; };
    const homes = { A: [], B: [], AB: [], U: [] };
    // Resting places inside each region (checked to stay inside the circles).
    const slot = (reg, i) => {
      if (reg === "U") return { x: 30 + (i % 3) * 36 + (i >= 18 ? 470 : 0), y: 40 + Math.floor((i % 18) / 3) * 40 };
      if (reg === "AB") return { x: 282 + (i % 2) * 36, y: 110 + Math.floor(i / 2) * 36 };
      const x0 = reg === "A" ? 132 : 372;
      return { x: x0 + (i % 4) * 32, y: 105 + Math.floor(i / 4) * 34 };
    };
    let tokens = [];
    const layer = s("g");
    function drawBoard() {
      clear(svg);
      svg.append(s("rect", { x: 4, y: 4, width: 592, height: 292, rx: 12, fill: "none", stroke: "var(--ink)", "stroke-width": 2 }));
      svg.append(s("text", { x: 16, y: 24, class: "svg-label" }, "U = {1, 2, …, 20}"));
      svg.append(s("circle", { cx: A.x, cy: A.y, r: A.r, fill: "var(--shape-a-soft)", stroke: "var(--shape-a)", "stroke-width": 2.5 }));
      svg.append(s("circle", { cx: B.x, cy: B.y, r: B.r, fill: "var(--shape-b-soft)", stroke: "var(--shape-b)", "stroke-width": 2.5, "fill-opacity": 0.7 }));
      svg.append(s("text", { x: A.x - 60, y: 34, class: "svg-text", "font-weight": 700, fill: "var(--shape-a)" }, `A: ${RULES[ka].label}`));
      svg.append(s("text", { x: B.x + 60, y: 34, "text-anchor": "end", class: "svg-text", "font-weight": 700, fill: "var(--shape-b)" }, `B: ${RULES[kb].label}`));
      svg.append(s("rect", { x: 4, y: 306, width: 592, height: 90, rx: 10, fill: "var(--grid)" }));
      svg.append(s("text", { x: 14, y: 324, class: "svg-label" }, "Tray – drag each number to where it belongs"));
      svg.append(layer);
    }
    function makeTokens() {
      clear(layer); Object.keys(homes).forEach((k) => (homes[k] = []));
      tokens = shuffle(U).map((n, i) => {
        const g = s("g", { class: "token", tabindex: 0, "aria-label": `Number ${n}` });
        g.append(s("circle", { r: 15, fill: "var(--paper)", stroke: "var(--ink)", "stroke-width": 1.5 }), s("text", { y: 5, "text-anchor": "middle", class: "svg-text", "font-weight": 700 }, String(n)));
        const t = { n, g, pos: { x: 26 + (i % 18) * 32, y: 345 + Math.floor(i / 18) * 34 }, placed: null };
        t.tray = { ...t.pos };
        t.sp = new Spring([t.pos.x, t.pos.y], ([x, y]) => { t.pos = { x, y }; g.setAttribute("transform", `translate(${x},${y})`); }, { stiffness: 200, damping: 15 });
        t.sp.jump([t.pos.x, t.pos.y]);
        Sim.draggable(svg, g, (p) => { t.sp.stop(); t.sp.jump([p.x, p.y]); }, (p) => drop(t, p));
        layer.append(g);
        return t;
      });
    }
    function drop(t, p) {
      const reg = regionOf(p);
      if (reg === "tray") { t.sp.set([t.tray.x, t.tray.y]); return; }
      if (reg !== truth(t.n)) {
        t.sp.set([t.tray.x, t.tray.y]);
        hint.textContent = `${t.n} does not go there. Is ${t.n} one of the ${RULES[ka].label}? One of the ${RULES[kb].label}?`;
        return;
      }
      hint.textContent = "";
      if (t.placed) homes[t.placed] = homes[t.placed].filter((x) => x !== t);
      t.placed = reg; homes[reg].push(t);
      const target = slot(reg, homes[reg].length - 1);
      t.sp.set([target.x, target.y]);
      t.g.querySelector("circle").setAttribute("fill", reg === "AB" ? "var(--accent-soft)" : "var(--paper)");
      report();
    }
    function autoSort() { tokens.forEach((t) => { if (!t.placed) drop(t, slot(truth(t.n), 0)); }); }
    const hint = h("p", { class: "note", "aria-live": "polite" });
    function report() {
      const a = U.filter((n) => RULES[ka].test(n)), b = U.filter((n) => RULES[kb].test(n));
      const union = U.filter((n) => RULES[ka].test(n) || RULES[kb].test(n)), inter = U.filter((n) => RULES[ka].test(n) && RULES[kb].test(n));
      const done = tokens.filter((t) => t.placed).length;
      clear(out);
      out.append(stat("Placed:", `${done} of 20`).el, a.every((n) => RULES[kb].test(n)) ? pill(true, "A ⊆ B (A is a subset of B)", "") : null, b.every((n) => RULES[ka].test(n)) ? pill(true, "B ⊆ A (B is a subset of A)", "") : null,
        !inter.length ? pill(true, "A and B are disjoint", "") : null);
      work.textContent = done < 20 ? "Place all 20 numbers to see the sets." :
        `A = ${setText(a)}\nB = ${setText(b)}\nA ∪ B (in A or B or both) = ${setText(union)}\nA ∩ B (in both A and B) = ${setText(inter)}\nn(A) = ${a.length}, n(B) = ${b.length}, n(A ∪ B) = ${union.length}, n(A ∩ B) = ${inter.length}`;
    }
    const selA = h("select", { id: "t2l4-a" }, Object.entries(RULES).map(([k, r]) => h("option", { value: k, selected: k === ka }, r.label)));
    const selB = h("select", { id: "t2l4-b" }, Object.entries(RULES).map(([k, r]) => h("option", { value: k, selected: k === kb }, r.label)));
    const reset = () => { ka = selA.value; kb = selB.value; drawBoard(); makeTokens(); report(); };
    selA.addEventListener("change", reset); selB.addEventListener("change", reset);
    root.append(h("div", { class: "controls" }, h("label", { for: "t2l4-a" }, "Set A", selA), h("label", { for: "t2l4-b" }, "Set B", selB),
      h("button", { class: "btn ghost", type: "button", onclick: autoSort }, "Sort the rest for me"), h("button", { class: "btn ghost", type: "button", onclick: reset }, "Start over")),
    svg, hint, out, work);
    reset();
    return () => tokens.forEach((t) => t.sp.stop());
  }

  Sim.register({
    id: "lesson13", unit: "E", num: 4, letter: "D", title: "Sets, Subsets, Union, and Intersection", simName: "Venn Lab",
    comps: ["A8", "A9", "M4"], cycles: "C5,M1 – C5,M5", deped: "DepEd Week 5",
    bigQuestion: "How can one picture show what two groups have in common?",
    mission: [
      "Sort the numbers 1 to 20 for A = even numbers and B = multiples of 3. Which numbers land in the middle?",
      "Write A ∪ B and A ∩ B. How many elements does each have?",
      "Choose A = multiples of 4 and B = even numbers. What do you notice about circle A?",
      "Find two sets that are disjoint (nothing in the middle).",
    ],
    discovery: "A set is a well-defined collection of elements. The union A ∪ B holds every element in A or B or both; the intersection A ∩ B holds only the elements in both. If every element of A is also in B, then A is a subset of B (A ⊆ B), and in a Venn diagram circle A sits inside circle B. Sets with no common element are disjoint.",
    mount(stage) {
      const body = h("div", { class: "stage-body" });
      stage.append(body);
      return lab(body);
    },
    check() {
      const keys = Object.keys(RULES);
      const ka = pick(keys); let kb = pick(keys); while (kb === ka) kb = pick(keys);
      const a = U.filter((n) => RULES[ka].test(n)), b = U.filter((n) => RULES[kb].test(n));
      const kind = randInt(0, 3);
      if (kind === 0) { const inter = a.filter((n) => b.includes(n)); return { q: `In U = {1, …, 20}, let A be the ${RULES[ka].label} and B the ${RULES[kb].label}. How many elements are in A ∩ B?`, answer: inter.length, explain: `A ∩ B = ${setText(inter)}.` }; }
      if (kind === 1) { const uni = U.filter((n) => a.includes(n) || b.includes(n)); return { q: `In U = {1, …, 20}, let A be the ${RULES[ka].label} and B the ${RULES[kb].label}. How many elements are in A ∪ B?`, answer: uni.length, explain: `n(A ∪ B) = n(A) + n(B) − n(A ∩ B) = ${a.length} + ${b.length} − ${a.filter((n) => b.includes(n)).length} = ${uni.length}.` }; }
      if (kind === 2) { const P = [2, 4, 6], Q = pick([[1, 2, 3, 4, 5, 6], [2, 4, 8], [2, 4, 6, 8]]); const sub = P.every((n) => Q.includes(n)); return { q: `Is P = {2, 4, 6} a subset of Q = ${setText(Q)}?`, choices: ["Yes", "No"], answer: sub ? "Yes" : "No", explain: sub ? "Every element of P is in Q." : "6 is in P but not in Q." }; }
      const n = randInt(1, 20); const reg = RULES[ka].test(n) && RULES[kb].test(n) ? "Both A and B" : RULES[ka].test(n) ? "A only" : RULES[kb].test(n) ? "B only" : "Neither";
      return { q: `A is the ${RULES[ka].label} and B the ${RULES[kb].label} (from 1 to 20). Where does ${n} go in the Venn diagram?`, choices: ["A only", "B only", "Both A and B", "Neither"], answer: reg, explain: `${n}: ${RULES[ka].test(n) ? "in" : "not in"} A, ${RULES[kb].test(n) ? "in" : "not in"} B.` };
    },
  });
})();
