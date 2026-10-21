/* Term 3 · Lesson 5 · E. Bar Models and the Properties of Equality – Balance Lab */
(function () {
  "use strict";
  const { h, s, clear, randInt, pick, shuffle, fmt, tabs, stat, pill, Spring, clamp, rubber } = Sim;

  // ------------------------------------------------------------ bar model

  const BARS = [
    { n: 1, a: 4, T: 11, story: "Bea had some pandesal and bought 4 more. Now Bea has 11 pandesal. How many were there at first?" },
    { n: 3, a: 0, T: 18, story: "Three friends share ₱18 equally. How much does each friend get?" },
    { n: 2, a: 3, T: 13, story: "Two equal packs of crayons and 3 loose crayons make 13 crayons. How many crayons are in a pack?" },
    { n: 1, a: 9, T: 15, story: "After riding 9 km, Migo still has some kilometres to go. The whole trip is 15 km. How far is left?" },
    { n: 4, a: 0, T: 28, story: "Four equal bottles hold 28 glasses of calamansi juice. How many glasses does each bottle hold?" },
    { n: 2, a: 5, T: 17, story: "Two equal bags of rice and a 5-kg sack weigh 17 kg. How heavy is each bag?" },
  ];
  const eqOf = (b) => `${b.n === 1 ? "" : b.n}x${b.a ? ` + ${b.a}` : ""} = ${b.T}`;

  function barModel(root) {
    let idx = 0, xv = 1;
    const X0 = 40, LEN = 520;
    const svg = s("svg", { viewBox: "0 0 600 250", role: "img", "aria-label": "Bar model: the bottom bar must match the top bar" });
    const base = s("g"), layer = s("g"); svg.append(base, layer);
    const story = h("p", {}), eq = h("p", { class: "unit-big" }), res = h("div"), work = h("pre", { class: "workings" });
    const sp = new Spring(xv, (v) => { xv = v; draw(); }, { stiffness: 200, damping: 14 });
    const b = () => BARS[idx];
    const U = () => LEN / b().T;
    const handles = Sim.handleSet(svg, layer, {
      label: "Size of x", r: 14,
      onMove: (i, p) => { sp.stop(); xv = rubber((p.x - X0) / (b().n * U()), 0, b().T / b().n, 0.3); sp.value = xv; sp.vel = 0; draw(); },
      onEnd: () => sp.set(clamp(Math.round(xv), 0, Math.floor(b().T / b().n))),
    });
    function draw() {
      const { n, a, T } = b(), u = U();
      clear(base);
      base.append(s("text", { x: X0, y: 30, class: "svg-label" }, "Whole"), s("text", { x: X0, y: 126, class: "svg-label" }, "Parts"));
      const ok = Math.abs(n * xv + a - T) < 0.02;
      base.append(s("rect", { x: X0, y: 38, width: LEN, height: 50, rx: 6, fill: ok ? "var(--shape-a-soft)" : "var(--gold-soft)", stroke: "var(--ink)", "stroke-width": 2 }),
        s("text", { x: X0 + LEN / 2, y: 72, "text-anchor": "middle", class: "svg-text", style: "font-size:24px", "font-weight": 700 }, String(T)));
      base.append(s("line", { x1: X0 + LEN, y1: 30, x2: X0 + LEN, y2: 210, stroke: "var(--muted)", "stroke-dasharray": "5 5" }));
      const w = Math.max(0, xv) * u;
      for (let k = 0; k < n; k++) {
        const x = X0 + k * w;
        base.append(s("rect", { x, y: 134, width: w, height: 50, fill: "var(--shape-a-soft)", stroke: "var(--shape-a)", "stroke-width": 2 }));
        if (w > 26) base.append(s("text", { x: x + w / 2, y: 166, "text-anchor": "middle", class: "svg-text", style: "font-size:22px", "font-style": "italic" }, "x"));
      }
      if (a) {
        const x = X0 + n * w;
        base.append(s("rect", { x, y: 134, width: a * u, height: 50, fill: "var(--shape-b-soft)", stroke: "var(--shape-b)", "stroke-width": 2 }),
          s("text", { x: x + (a * u) / 2, y: 166, "text-anchor": "middle", class: "svg-text", style: "font-size:22px" }, String(a)));
      }
      const shown = Math.max(0, xv);
      base.append(s("text", { x: X0 + n * w, y: 228, "text-anchor": "middle", class: "svg-text", style: "font-size:16px" }, `x ≈ ${fmt(shown, 1)}`));
      handles.sync([{ x: X0 + n * w, y: 159 }]);
      clear(res);
      const total = n * shown + a;
      res.append(stat("x:", fmt(shown, 1)).el, " ", stat("Parts total:", fmt(total, 1)).el, " ",
        ok ? pill(true, `The bars match: x = ${Math.round(shown)}`, "") : pill(false, "", total < T ? "Too short – stretch x" : "Too long – shrink x"));
      if (ok) {
        const lines = [eqOf(b())];
        if (a) lines.push(`${n === 1 ? "" : n}x = ${T} − ${a} = ${T - a}      (take ${a} away from both bars)`);
        if (n > 1) lines.push(`x = ${T - a} ÷ ${n} = ${(T - a) / n}      (split into ${n} equal parts)`);
        if (n === 1 && !a) lines.push(`x = ${T}`);
        work.textContent = lines.join("\n");
        work.hidden = false;
      } else work.hidden = true;
    }
    function load(i) {
      idx = i; story.textContent = b().story; eq.textContent = eqOf(b());
      sp.jump(1);
    }
    root.append(story, eq, svg, res, work,
      h("div", { class: "controls" }, h("button", { class: "btn", type: "button", onclick: () => load((idx + 1) % BARS.length) }, "Next bar model")),
      h("p", { class: "note" }, "Drag the round handle to stretch or shrink the x part(s) until the parts bar is exactly as long as the whole bar."));
    load(0);
    return () => sp.stop();
  }

  // ------------------------------------------------------------ balance scale

  const PUZZLES = [
    { L: { x: 2, c: 3 }, R: { x: 0, c: 9 }, X: 3 },
    { L: { x: 3, c: 1 }, R: { x: 0, c: 13 }, X: 4 },
    { L: { x: 1, c: 5 }, R: { x: 0, c: 12 }, X: 7 },
    { L: { x: 4, c: 0 }, R: { x: 0, c: 12 }, X: 3 },
    { L: { x: 3, c: 2 }, R: { x: 1, c: 8 }, X: 3 },
    { L: { x: 2, c: 6 }, R: { x: 4, c: 2 }, X: 2 },
  ];
  const side = ({ x, c }) => (x ? `${x === 1 ? "" : x}x` : "") + (x && c ? " + " : "") + (c || !x ? String(c) : "");
  const eqText = (L, R) => `${side(L)} = ${side(R)}`;

  function balance(root) {
    let pi = 0, L, R, X, start, odd = false, theta = 0, log = [];
    const svg = s("svg", { viewBox: "0 0 600 330", role: "img", "aria-label": "Pan balance with x-boxes and unit weights" });
    const beam = s("g"), panL = s("g"), panR = s("g"), itemsL = s("g"), itemsR = s("g");
    svg.append(s("path", { d: "M300,96 L262,300 H338 Z", fill: "var(--line)", stroke: "var(--ink)", "stroke-width": 2 }), s("rect", { x: 220, y: 300, width: 160, height: 12, rx: 4, fill: "var(--ink)" }));
    beam.append(s("rect", { x: 96, y: 84, width: 408, height: 12, rx: 6, fill: "var(--ink)" }), s("circle", { cx: 300, cy: 90, r: 9, fill: "var(--gold)" }));
    const pan = (g, items) => { g.append(s("path", { d: "M0,0 L-86,104 M0,0 L86,104", stroke: "var(--muted)", "stroke-width": 2, fill: "none" }), s("path", { d: "M-96,104 Q0,132 96,104 Z", fill: "var(--gold-soft)", stroke: "var(--ink)", "stroke-width": 2 }), items); };
    pan(panL, itemsL); pan(panR, itemsR);
    svg.append(beam, panL, panR);
    const tilt = new Spring(0, (v) => { theta = v; paint(); }, { stiffness: 70, damping: 7 });
    function paint() {
      beam.setAttribute("transform", `rotate(${theta},300,90)`);
      const r = (theta * Math.PI) / 180, dx = 200 * Math.cos(r), dy = 200 * Math.sin(r);
      panL.setAttribute("transform", `translate(${300 - dx},${90 - dy})`);
      panR.setAttribute("transform", `translate(${300 + dx},${90 + dy})`);
    }
    function fill(g, { x, c }) {
      clear(g);
      const list = [...Array(x).fill("x"), ...Array(c).fill("1")];
      list.forEach((k, i) => {
        const row = Math.floor(i / 5), col = i % 5, inRow = Math.min(5, list.length - row * 5);
        const cx = (col - (inRow - 1) / 2) * 37, cy = 84 - row * 36;
        if (k === "x") g.append(s("rect", { x: cx - 17, y: cy - 17, width: 34, height: 34, rx: 4, fill: "var(--shape-a-soft)", stroke: "var(--shape-a)", "stroke-width": 2 }),
          s("text", { x: cx, y: cy + 6, "text-anchor": "middle", class: "svg-text", style: "font-size:21px", "font-style": "italic", "font-weight": 700 }, "x"));
        else g.append(s("circle", { cx, cy, r: 15, fill: "var(--paper)", stroke: "var(--shape-b)", "stroke-width": 2 }),
          s("text", { x: cx, y: cy + 6, "text-anchor": "middle", class: "svg-text", style: "font-size:17px" }, "1"));
      });
    }
    const eqEl = h("p", { class: "unit-big", "aria-live": "polite" }), ops = h("div", { class: "controls" }), msg = h("div"), work = h("pre", { class: "workings" });
    const OPS = [
      { label: "− 1 from both sides", prop: "Subtraction Property of Equality", can: () => L.c >= 1 && R.c >= 1, run: () => { L.c--; R.c--; } },
      { label: "− x from both sides", prop: "Subtraction Property of Equality", can: () => L.x >= 1 && R.x >= 1, run: () => { L.x--; R.x--; } },
      { label: "+ 1 to both sides", prop: "Addition Property of Equality", can: () => L.x + L.c < 20 && R.x + R.c < 20, run: () => { L.c++; R.c++; } },
      { label: "× 2 both sides", prop: "Multiplication Property of Equality", can: () => 2 * (L.x + L.c) <= 20 && 2 * (R.x + R.c) <= 20, run: () => { [L, R].forEach((q) => { q.x *= 2; q.c *= 2; }); } },
      { label: "÷ 2 both sides", prop: "Division Property of Equality", can: () => [L.x, L.c, R.x, R.c].every((v) => v % 2 === 0), run: () => { [L, R].forEach((q) => { q.x /= 2; q.c /= 2; }); } },
      { label: "÷ 3 both sides", prop: "Division Property of Equality", can: () => [L.x, L.c, R.x, R.c].every((v) => v % 3 === 0), run: () => { [L, R].forEach((q) => { q.x /= 3; q.c /= 3; }); } },
    ];
    const weight = (q) => q.x * X + q.c;
    function update() {
      fill(itemsL, L); fill(itemsR, R);
      tilt.set(clamp((weight(R) - weight(L)) * 3, -16, 16));
      eqEl.textContent = odd ? `${side(L)} ≠ ${side(R)}` : eqText(L, R);
      clear(ops); clear(msg);
      if (odd) {
        msg.append(pill(false, "", "The scale tips!"), h("p", { class: "note" }, "You changed only one side, so the two sides are no longer equal. Do the same thing to the other side to keep the equation true."));
        ops.append(h("button", { class: "btn", type: "button", onclick: () => { R.c--; odd = false; log.push(`${eqText(L, R)}   ← also −1 on the right: balanced again`); update(); } }, "Take 1 off the right too"));
      } else {
        OPS.forEach((op) => ops.append(h("button", { class: "btn ghost", type: "button", disabled: !op.can(), title: op.prop, onclick: () => {
          const before = eqText(L, R); op.run(); log.push(`${before}  →  ${eqText(L, R)}   (${op.label}: ${op.prop})`); update();
        } }, op.label)));
        ops.append(h("button", { class: "btn ghost", type: "button", disabled: !(L.c >= 1 && R.c >= 1), onclick: () => { L.c--; odd = true; log.push(`${eqText(L, R)}?  only the left side changed`); update(); } }, "Take 1 off the LEFT only"));
        const solved = (L.x === 1 && L.c === 0 && R.x === 0) || (R.x === 1 && R.c === 0 && L.x === 0);
        if (solved) {
          const v = L.x ? R.c : L.c;
          msg.append(pill(true, `Solved: x = ${v}`, ""), h("p", { class: "note" }, `${L.x ? "" : `${v} = x, so x = ${v} (Symmetric Property). `}Check in the first equation: ${side({ x: start.L.x, c: 0 }).replace("x", `(${v})`)}${start.L.c ? ` + ${start.L.c}` : ""} = ${start.L.x * v + start.L.c} and ${start.R.x ? `${start.R.x === 1 ? "" : start.R.x}(${v})${start.R.c ? ` + ${start.R.c}` : ""}` : start.R.c} = ${start.R.x * v + start.R.c} ✓`));
        }
      }
      work.textContent = log.length ? log.slice(-6).join("\n") : "Get x alone on one side. Every button does the same thing to BOTH sides and names the property it uses.";
    }
    function load(i) {
      pi = i; const p = PUZZLES[pi];
      L = { ...p.L }; R = { ...p.R }; X = p.X; start = { L: { ...p.L }, R: { ...p.R } }; odd = false; log = [];
      update();
    }
    root.append(eqEl, svg, msg, ops, work,
      h("div", { class: "controls" }, h("button", { class: "btn", type: "button", onclick: () => load((pi + 1) % PUZZLES.length) }, "New equation"), h("button", { class: "btn ghost", type: "button", onclick: () => load(pi) }, "Start over")));
    load(0); tilt.jump(0);
    return () => tilt.stop();
  }

  // ------------------------------------------------------------ name the property

  const PROPS = ["Reflexive", "Symmetric", "Transitive", "Substitution", "Addition", "Subtraction", "Multiplication", "Division"];
  function propItem() {
    const p = pick(PROPS), a = randInt(2, 9), b = randInt(10, 30);
    const q = {
      Reflexive: pick([`${a + b} = ${a + b}`, `x + ${a} = x + ${a}`]),
      Symmetric: pick([`If x = ${b}, then ${b} = x.`, `If ${a} + ${b} = y, then y = ${a} + ${b}.`]),
      Transitive: `If y = ${a} + ${b} and ${a} + ${b} = ${a + b}, then y = ${a + b}.`,
      Substitution: `If x = ${a} and y = x + ${b}, then y = ${a} + ${b}.`,
      Addition: `If x − ${a} = ${b}, then x − ${a} + ${a} = ${b} + ${a}.`,
      Subtraction: `If x + ${a} = ${b}, then x + ${a} − ${a} = ${b} − ${a}.`,
      Multiplication: `If x ÷ ${a} = ${b}, then (x ÷ ${a}) × ${a} = ${b} × ${a}.`,
      Division: `If ${a}x = ${a * b}, then ${a}x ÷ ${a} = ${a * b} ÷ ${a}.`,
    }[p];
    const why = {
      Reflexive: "Any quantity is equal to itself.", Symmetric: "The two sides of an equation can be swapped.",
      Transitive: "If a = b and b = c, then a = c.", Substitution: "A quantity can be replaced by an equal quantity.",
      Addition: "The same number was added to both sides.", Subtraction: "The same number was subtracted from both sides.",
      Multiplication: "Both sides were multiplied by the same number.", Division: "Both sides were divided by the same nonzero number.",
    }[p];
    return { q, p, why };
  }

  function nameIt(root) {
    let right = 0, tries = 0, item;
    const card = h("div", { class: "workings", style: "font-size:1.1rem" }), fb = h("div", { "aria-live": "polite" }), row = h("div", { class: "choices" }), score = stat("Score:", "0 / 0");
    const slide = new Spring(0, (v) => { card.style.transform = `translateX(${v}px)`; card.style.opacity = String(clamp(1 - Math.abs(v) / 120, 0, 1)); }, { stiffness: 170, damping: 15 });
    function next() {
      item = propItem(); card.textContent = item.q; clear(fb);
      slide.jump(110); slide.set(0);
      clear(row);
      PROPS.forEach((p) => row.append(h("button", { type: "button", onclick: (e) => {
        if (row.dataset.done) return;
        row.dataset.done = "1"; tries++;
        const ok = p === item.p; if (ok) right++;
        score.set(`${right} / ${tries}`);
        e.currentTarget.style.borderColor = ok ? "var(--good)" : "var(--bad)";
        fb.append(pill(ok, "Correct!", `It is the ${item.p} Property.`), h("p", { class: "note" }, item.why),
          h("div", { class: "controls" }, h("button", { class: "btn", type: "button", onclick: next }, "Next statement")));
      } }, p)));
      delete row.dataset.done;
    }
    root.append(h("p", {}, "Which property of equality does each statement show?"), card, row, fb, h("div", { class: "readout" }, score.el));
    next();
    return () => slide.stop();
  }

  // ------------------------------------------------------------ lesson

  Sim.register({
    id: "lesson23", unit: "I", num: 5, letter: "E", title: "Bar Models and the Properties of Equality", simName: "Balance Lab",
    comps: ["A8", "A9", "M5"], cycles: "C5,M2 – C6,M1", deped: "DepEd Weeks 3 and 5",
    bigQuestion: "How can one letter stand for every possible number?",
    mission: [
      "Bar Model: stretch the x part until the bars match. What is x in x + 4 = 11? In 3x = 18?",
      "Balance Scale: press “Take 1 off the LEFT only”. What happens to the scale? How do you fix it?",
      "Balance Scale: solve 2x + 3 = 9 and write the property used at each step.",
      "Name the Property: get 6 statements right in a row.",
    ],
    discovery: "An equation is like a balanced scale: both sides have the same value. If you add, subtract, multiply, or divide BOTH sides by the same number (not dividing by 0), the scale stays balanced – these are the properties of equality. Doing something to one side only tips the scale. Using these properties step by step gets the variable alone and finds the one number that makes the equation true.",
    mount(stage) {
      const body = h("div", { class: "stage-body" });
      const views = [barModel, balance, nameIt];
      let stopper = null;
      const t = tabs(["Bar Model", "Balance Scale", "Name the Property"], (i) => { if (stopper) stopper(); clear(body); stopper = views[i](body) || null; });
      stage.append(t.el, body);
      stopper = barModel(body);
      return () => { if (stopper) stopper(); };
    },
    check() {
      const kind = randInt(0, 4);
      if (kind === 0) { const it = propItem(); return { q: `Which property of equality is shown? ${it.q}`, choices: PROPS.map((p) => p), answer: it.p, explain: it.why }; }
      if (kind === 1) { const x = randInt(2, 15), a = randInt(2, 12); return { q: `A bar model shows x + ${a} = ${x + a}. What is x?`, answer: x, explain: `x = ${x + a} − ${a} = ${x}.` }; }
      if (kind === 2) { const n = randInt(2, 6), x = randInt(2, 12); return { q: `A bar of ${n * x} is split into ${n} equal parts x. What is x?`, answer: x, explain: `${n}x = ${n * x}, so x = ${n * x} ÷ ${n} = ${x}.` }; }
      if (kind === 3) {
        const a = randInt(2, 9), b = randInt(10, 30);
        return pick([
          { q: `To solve x + ${a} = ${b}, you subtract ${a} from both sides. Which property is that?`, choices: ["Addition Property", "Subtraction Property", "Multiplication Property", "Division Property"], answer: "Subtraction Property", explain: `The same number, ${a}, is subtracted from both sides.` },
          { q: `To solve x − ${a} = ${b}, you add ${a} to both sides. Which property is that?`, choices: ["Addition Property", "Subtraction Property", "Multiplication Property", "Division Property"], answer: "Addition Property", explain: `The same number, ${a}, is added to both sides.` },
          { q: `To solve ${a}x = ${a * b}, you divide both sides by ${a}. Which property is that?`, choices: ["Addition Property", "Subtraction Property", "Multiplication Property", "Division Property"], answer: "Division Property", explain: `Both sides are divided by ${a}.` },
          { q: `To solve x ÷ ${a} = ${b}, you multiply both sides by ${a}. Which property is that?`, choices: ["Addition Property", "Subtraction Property", "Multiplication Property", "Division Property"], answer: "Multiplication Property", explain: `Both sides are multiplied by ${a}.` },
        ]);
      }
      const x = randInt(2, 9), n = randInt(2, 4), c = randInt(1, 9);
      return { q: `A balanced scale shows ${n}x + ${c} = ${n * x + c}. What is x?`, answer: x, explain: `Subtract ${c}: ${n}x = ${n * x}. Divide by ${n}: x = ${x}.` };
    },
  });
})();
