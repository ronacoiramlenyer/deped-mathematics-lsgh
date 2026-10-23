/* Grade 8 · Term 1 · Lesson 5 · E. Factoring Polynomials – Factor Puzzle */
(function () {
  "use strict";
  const { h, s, clear, randInt, pick, shuffle, gcd, fmt, tabs, stat, pill, Spring, elasticSlider, clamp, rubber, svgPoint } = Sim;

  // ------------------------------------------------------------ algebra text

  const SUP = ["", "", "²", "³", "⁴"];
  const neg = (n) => (n < 0 ? "−" + Math.abs(n) : String(n));
  const par = (n) => (n < 0 ? `(${neg(n)})` : neg(n));
  function poly(cs, v = "x") {
    const deg = cs.length - 1;
    let out = "";
    cs.forEach((c, i) => {
      if (!c) return;
      const p = deg - i, a = Math.abs(c);
      const body = p === 0 ? String(a) : (a === 1 ? "" : String(a)) + v + SUP[p];
      out += out ? (c < 0 ? " − " : " + ") + body : (c < 0 ? "−" : "") + body;
    });
    return out || "0";
  }
  const bin = (m, c) => `(${poly([m, c])})`;
  function choiceSet(answer, others) {
    const out = [answer];
    for (const o of others) if (o && !out.includes(o) && out.length < 4) out.push(o);
    return shuffle(out);
  }

  // ------------------------------------------------------------ make a rectangle

  const TILE = { 2: ["var(--shape-a)", "var(--shape-a-soft)"], 1: ["var(--gold)", "var(--gold-soft)"], 0: ["var(--shape-b)", "var(--shape-b-soft)"] };
  const TRIS = [[5, 6], [4, 4], [6, 8], [7, 12], [6, 9], [7, 10], [5, 4], [8, 12], [7, 6], [8, 15]];

  function rectangle(root) {
    const X = 120, u = 24, O = { x: 40, y: 44 }, MAXS = 6;
    let triIdx = 0, tiles = [], solved = false;
    const timers = [];
    // On a phone the tray goes below the mat, so the tiles stay big enough to drag.
    const narrow = root.getBoundingClientRect().width < 560;
    const VB = narrow ? [330, 540] : [600, 330];
    const xHome = (k) => (narrow ? { x: 20 + (k % 2) * 132 + X / 2, y: 342 + Math.floor(k / 2) * 30 + u / 2, w: X, h: u } : { x: 344 + k * 31 + u / 2, y: 50 + X / 2, w: u, h: X });
    const uHome = (k) => (narrow ? { x: 20 + (k % 8) * 30 + u / 2, y: 470 + Math.floor(k / 8) * 30 + u / 2, w: u, h: u } : { x: 344 + (k % 8) * 30 + u / 2, y: 200 + Math.floor(k / 8) * 30 + u / 2, w: u, h: u });
    const svg = s("svg", { viewBox: `0 0 ${VB[0]} ${VB[1]}`, role: "img", "aria-label": "Algebra tiles to arrange into a rectangle" });
    const mat = s("g"), hint = s("rect", { fill: "none", stroke: "var(--accent)", "stroke-width": 2.5, rx: 3, opacity: 0 }), layer = s("g"), labels = s("g");
    svg.append(mat, hint, layer, labels);
    const status = h("div"), work = h("p", { class: "unit-big", "aria-live": "polite" });
    const labelSp = new Spring(0, (v) => { labels.setAttribute("opacity", clamp(v, 0, 1).toFixed(2)); labels.setAttribute("transform", `translate(${O.x},${O.y}) scale(${(0.6 + 0.4 * v).toFixed(3)}) translate(${-O.x},${-O.y})`); }, { stiffness: 200, damping: 12 });

    const slotV = (i) => ({ key: `v${i}`, x: O.x + X + i * u + u / 2, y: O.y + X / 2, w: u, h: X });
    const slotH = (j) => ({ key: `h${j}`, x: O.x + X / 2, y: O.y + X + j * u + u / 2, w: X, h: u });
    const slotU = (i, j) => ({ key: `u${i},${j}`, x: O.x + X + i * u + u / 2, y: O.y + X + j * u + u / 2, w: u, h: u });
    const range = [...Array(MAXS).keys()];
    const xSlots = [...range.map(slotV), ...range.map(slotH)];
    const uSlots = range.flatMap((i) => range.map((j) => slotU(i, j)));
    const taken = (key, except) => tiles.some((t) => t !== except && t.slot === key);
    function nearest(t, cx, cy, reach) {
      const list = (t.kind === 1 ? xSlots : uSlots).filter((sl) => !taken(sl.key, t));
      let best = null, bd = reach;
      for (const sl of list) { const d = Math.hypot(sl.x - cx, sl.y - cy); if (d < bd) { bd = d; best = sl; } }
      return best;
    }

    function drawMat() {
      clear(mat);
      mat.append(s("rect", { x: O.x - 6, y: O.y - 6, width: X + MAXS * u + 12, height: X + MAXS * u + 12, rx: 8, fill: "var(--bg)", stroke: "var(--line)" }));
      for (const sl of [...xSlots, ...uSlots]) mat.append(s("rect", { x: sl.x - sl.w / 2, y: sl.y - sl.h / 2, width: sl.w, height: sl.h, fill: "none", stroke: "var(--grid)", "stroke-width": 1 }));
      mat.append(s("rect", { x: O.x, y: O.y, width: X, height: X, rx: 3, fill: TILE[2][1], stroke: TILE[2][0], "stroke-width": 2 }),
        s("text", { x: O.x + X / 2, y: O.y + X / 2 + 7, "text-anchor": "middle", class: "svg-text", "font-size": 20, "font-weight": 700 }, "x²"),
        s("text", narrow ? { x: 20, y: 330, class: "svg-label" } : { x: 470, y: 26, "text-anchor": "middle", class: "svg-label" }, "Tile tray – drag tiles onto the mat"),
        s("text", { x: O.x + 6, y: 26, class: "svg-label" }, "Mat"));
    }

    function paint(t) {
      const [cx, cy] = t.pos.value, [w, ht] = t.size.value;
      t.g.setAttribute("transform", `translate(${cx.toFixed(1)},${cy.toFixed(1)})`);
      t.rect.setAttribute("x", (-w / 2 + 1).toFixed(1)); t.rect.setAttribute("y", (-ht / 2 + 1).toFixed(1));
      t.rect.setAttribute("width", Math.max(0, w - 2).toFixed(1)); t.rect.setAttribute("height", Math.max(0, ht - 2).toFixed(1));
      t.text.setAttribute("transform", ht > w + 1 ? "rotate(-90)" : "");
    }
    function makeTile(kind, home) {
      const g = s("g", { class: "token", tabindex: 0, "aria-label": kind === 1 ? "x tile" : "unit tile" });
      const rect = s("rect", { rx: 2, fill: TILE[kind][1], stroke: TILE[kind][0], "stroke-width": 2 });
      const text = s("text", { y: 4, "text-anchor": "middle", class: "svg-text", "font-size": 11, "font-weight": 700, fill: TILE[kind][0] }, kind === 1 ? "x" : "1");
      g.append(rect, text);
      const t = { kind, home, slot: null, g, rect, text, grab: { x: 0, y: 0 } };
      const size0 = [home.w, home.h];
      t.pos = new Spring([home.x, home.y], () => paint(t), { stiffness: 200, damping: 15 });
      t.size = new Spring(size0, () => paint(t), { stiffness: 240, damping: 16 });
      g.addEventListener("pointerdown", (ev) => {
        const p = svgPoint(svg, ev);
        t.grab = { x: t.pos.value[0] - p.x, y: t.pos.value[1] - p.y };
        t.slot = null; solved = false;
      });
      Sim.draggable(svg, g, (p) => {
        t.pos.stop();
        const cx = rubber(p.x + t.grab.x, 10, VB[0] - 10), cy = rubber(p.y + t.grab.y, 10, VB[1] - 10);
        t.pos.value = [cx, cy]; t.pos.vel = [0, 0];
        const sl = nearest(t, cx, cy, t.kind === 1 ? 70 : 40);
        if (sl) {
          hint.setAttribute("x", sl.x - sl.w / 2); hint.setAttribute("y", sl.y - sl.h / 2); hint.setAttribute("width", sl.w); hint.setAttribute("height", sl.h); hint.setAttribute("opacity", 1);
          if (t.kind === 1) t.size.set([sl.w, sl.h]);
        } else { hint.setAttribute("opacity", 0); if (t.kind === 1) t.size.set([t.home.w, t.home.h]); }
        paint(t);
      }, () => {
        hint.setAttribute("opacity", 0);
        const sl = nearest(t, t.pos.value[0], t.pos.value[1], t.kind === 1 ? 70 : 40);
        place(t, sl);
        evaluate();
      });
      layer.append(g);
      paint(t);
      return t;
    }
    function place(t, sl) {
      t.slot = sl ? sl.key : null;
      if (sl) { t.pos.set([sl.x, sl.y]); t.size.set([sl.w, sl.h]); }
      else { t.pos.set([t.home.x, t.home.y]); t.size.set([t.home.w, t.home.h]); }
    }

    function deal() {
      timers.splice(0).forEach(clearTimeout);
      tiles.forEach((t) => { t.pos.stop(); t.size.stop(); });
      tiles = []; clear(layer); solved = false;
      const [b, c] = TRIS[triIdx];
      for (let k = 0; k < b; k++) tiles.push(makeTile(1, xHome(k)));
      for (let k = 0; k < c; k++) tiles.push(makeTile(0, uHome(k)));
      evaluate();
    }

    function factorsOf() {
      const [b, c] = TRIS[triIdx];
      for (let m = 1; m <= b; m++) if (m * (b - m) === c) return [m, b - m];
      return null;
    }
    function evaluate() {
      const [b, c] = TRIS[triIdx];
      const V = tiles.filter((t) => t.slot && t.slot[0] === "v").map((t) => +t.slot.slice(1));
      const H = tiles.filter((t) => t.slot && t.slot[0] === "h").map((t) => +t.slot.slice(1));
      const U = tiles.filter((t) => t.slot && t.slot[0] === "u").map((t) => t.slot.slice(1));
      const m = V.length, n = H.length;
      const contiguous = (arr) => arr.every((i) => i < arr.length);
      const allPlaced = tiles.every((t) => t.slot);
      const rect = allPlaced && m > 0 && n > 0 && contiguous(V) && contiguous(H) && m * n === c &&
        U.every((k) => { const [i, j] = k.split(",").map(Number); return i < m && j < n; });
      clear(status); clear(labels);
      if (rect) {
        solved = true;
        labels.append(s("text", { x: O.x + (X + m * u) / 2, y: O.y - 14, "text-anchor": "middle", class: "svg-text", "font-size": 16, "font-weight": 700, fill: "var(--accent)" }, `x + ${m}`),
          s("text", { x: O.x - 12, y: O.y + (X + n * u) / 2, "text-anchor": "middle", class: "svg-text", "font-size": 16, "font-weight": 700, fill: "var(--accent)", transform: `rotate(-90 ${O.x - 12} ${O.y + (X + n * u) / 2})` }, `x + ${n}`),
          s("rect", { x: O.x - 2, y: O.y - 2, width: X + m * u + 4, height: X + n * u + 4, fill: "none", stroke: "var(--accent)", "stroke-width": 3, rx: 4 }));
        labelSp.jump(0); labelSp.set(1);
        work.textContent = `${poly([1, b, c])} = (x + ${m})(x + ${n})`;
        status.append(pill(true, "It is a rectangle! Its sides are the factors.", ""), h("p", { class: "note" }, `Check by multiplying: (x + ${m})(x + ${n}) = x² + ${n}x + ${m}x + ${m * n} = ${poly([1, b, c])}. Notice ${m} × ${n} = ${c} and ${m} + ${n} = ${b}.`));
      } else {
        labelSp.jump(0);
        const placedX = tiles.filter((t) => t.kind === 1 && t.slot).length, placedU = tiles.filter((t) => t.kind === 0 && t.slot).length;
        work.textContent = `${poly([1, b, c])} = (x + ?)(x + ?)`;
        status.append(h("p", { class: "note" }, allPlaced ? "All tiles are on the mat, but they do not form a rectangle yet. Move tiles so there are no gaps and no bumps."
          : `On the mat: ${placedX} of ${b} x-tiles and ${placedU} of ${c} unit tiles. Put x-tiles beside or below the x², then fill the corner with unit tiles.`));
      }
    }

    function showMe() {
      const f = factorsOf(); if (!f) return;
      const [m, n] = f;
      tiles.forEach((t) => { t.slot = null; });
      const xs = tiles.filter((t) => t.kind === 1), us = tiles.filter((t) => t.kind === 0);
      const plan = [];
      xs.forEach((t, k) => plan.push([t, k < m ? slotV(k) : slotH(k - m)]));
      us.forEach((t, k) => plan.push([t, slotU(k % m, Math.floor(k / m))]));
      plan.forEach(([t, sl]) => { t.slot = sl.key; });
      plan.forEach(([t, sl], k) => timers.push(setTimeout(() => { place(t, sl); if (k === plan.length - 1) evaluate(); }, Sim.reducedMotion() ? 0 : k * 70)));
    }

    const sel = h("select", { id: "g8l5-tri" }, TRIS.map(([b, c], i) => h("option", { value: i }, poly([1, b, c]))));
    sel.addEventListener("change", () => { triIdx = Number(sel.value); deal(); });
    root.append(h("div", { class: "controls" }, h("label", { for: "g8l5-tri" }, "Trinomial", sel),
      h("button", { class: "btn ghost", type: "button", onclick: () => { tiles.forEach((t) => place(t, null)); evaluate(); } }, "Reset tiles"),
      h("button", { class: "btn ghost", type: "button", onclick: showMe }, "Show me")),
    svg, work, status, h("p", { class: "note" }, "The x² tile is already on the mat. Drag the x-tiles next to it (they turn to fit) and the unit tiles into the corner."));
    drawMat(); deal();
    return () => { timers.forEach(clearTimeout); tiles.forEach((t) => { t.pos.stop(); t.size.stop(); }); labelSp.stop(); };
  }

  // ------------------------------------------------------------ factor detective

  const TYPES = ["Common monomial factor", "Difference of two squares", "Perfect square trinomial", "General trinomial"];

  function makeFactorProblem(kindIn) {
    const kind = kindIn || pick(["gcf", "gcf2", "dots", "dots", "pst", "pst", "gen", "gen", "ac"]);
    if (kind === "gcf") {
      const g = randInt(2, 6); let p = randInt(1, 5), q = randInt(1, 9) * pick([1, -1]);
      while (gcd(p, q) !== 1) q = randInt(1, 9) * pick([1, -1]);
      const P = poly([g * p, g * q, 0]), ans = `${g}x${bin(p, q)}`;
      return { poly: P, type: TYPES[0], answer: ans,
        choices: choiceSet(ans, [`${g}(${poly([p, q, 0])})`, `x${bin(g * p, g * q)}`, `${g}x${bin(p, -q)}`, `${g}x${bin(g * p, g * q)}`]),
        steps: [`The GCF of ${g * p} and ${Math.abs(g * q)} is ${g}, and every term has x, so the GCF is ${g}x.`,
          `Divide each term by ${g}x: ${poly([g * p, 0, 0])} ÷ ${g}x = ${poly([p, 0])}; ${poly([g * q, 0])} ÷ ${g}x = ${neg(q)}.`,
          `Write the GCF outside the parentheses: ${ans}.`,
          `Check by multiplying: ${g}x · ${poly([p, 0])} + ${g}x · ${par(q)} = ${P} ✓`] };
    }
    if (kind === "gcf2") {
      const g = pick([2, 3, 5]), q = randInt(2, 6);
      const P = poly([g, 0, -g * q * q]), ans = `${g}(x + ${q})(x − ${q})`;
      return { poly: P, type: TYPES[0], answer: ans,
        choices: choiceSet(ans, [`${g}(${poly([1, 0, -q * q])})`, `${g}(x − ${q})²`, `(x + ${q})(x − ${q})`]),
        steps: [`Common monomial factor first: ${P} = ${g}(${poly([1, 0, -q * q])}).`,
          `x² − ${q * q} = x² − ${q}² is a difference of two squares, so keep going.`,
          `${g}(x + ${q})(x − ${q}) – now no factor can be factored further.`,
          `Check: (x + ${q})(x − ${q}) = x² − ${q * q}; times ${g} gives ${P} ✓`] };
    }
    if (kind === "dots") {
      const p = pick([1, 1, 2, 3, 4, 5]); let q = randInt(2, 9);
      while (gcd(p, q) !== 1) q = randInt(2, 9);
      const P = poly([p * p, 0, -q * q]), ans = `${bin(p, q)}${bin(p, -q)}`;
      return { poly: P, type: TYPES[1], answer: ans,
        choices: choiceSet(ans, [`${bin(p, -q)}²`, `${bin(p, q)}²`, `${bin(p, q * q)}${bin(p, -1)}`]),
        steps: [`Both terms are squares: ${poly([p * p, 0, 0])} = (${poly([p, 0])})² and ${q * q} = ${q}².`,
          `Use a² − b² = (a + b)(a − b) with a = ${poly([p, 0])} and b = ${q}.`,
          `${P} = ${ans}`,
          `Check: the outer and inner products ${poly([-p * q, 0])} and ${poly([p * q, 0])} cancel, leaving ${P} ✓`] };
    }
    if (kind === "pst") {
      const p = pick([1, 1, 2, 3]); let q = randInt(1, 7);
      while (gcd(p, q) !== 1) q = randInt(1, 7);
      const sg = pick([1, -1]), P = poly([p * p, 2 * sg * p * q, q * q]), ans = `${bin(p, sg * q)}²`;
      return { poly: P, type: TYPES[2], answer: ans,
        choices: choiceSet(ans, [`${bin(p, -sg * q)}²`, `${bin(p, q)}${bin(p, -q)}`, `${bin(p, 2 * sg * q)}²`]),
        steps: [`First and last terms are squares: ${poly([p * p, 0, 0])} = (${poly([p, 0])})², ${q * q} = ${q}².`,
          `Middle term test: 2 · ${poly([p, 0])} · ${q} = ${poly([2 * p * q, 0])} ✓ – a perfect square trinomial.`,
          `The middle sign is ${sg > 0 ? "+" : "−"}, so ${P} = ${ans}.`,
          `Check: ${ans} = ${poly([p * p, 0, 0])} ${sg > 0 ? "+" : "−"} ${poly([2 * p * q, 0])} + ${q * q} ✓`] };
    }
    if (kind === "ac") {
      let r = pick([-7, -5, -3, -1, 1, 3, 5, 7]), t = randInt(-5, 5);
      while (t === 0 || t === r) t = randInt(-5, 5);
      const P = poly([2, r + 2 * t, r * t]), ans = `${bin(2, r)}${bin(1, t)}`;
      return { poly: P, type: TYPES[3], answer: ans,
        choices: choiceSet(ans, [`${bin(2, t)}${bin(1, r)}`, `${bin(2, -r)}${bin(1, -t)}`, `${bin(2, r)}${bin(1, -t)}`]),
        steps: [`ac method: a · c = 2 · ${par(r * t)} = ${neg(2 * r * t)}. Find two numbers with product ${neg(2 * r * t)} and sum ${neg(r + 2 * t)}: ${neg(r)} and ${neg(2 * t)}.`,
          `Split the middle term: 2x² ${r < 0 ? "−" : "+"} ${Math.abs(r) === 1 ? "" : Math.abs(r)}x ${t < 0 ? "−" : "+"} ${Math.abs(2 * t)}x ${r * t < 0 ? "−" : "+"} ${Math.abs(r * t)}`,
          `Group: x${bin(2, r)} ${t < 0 ? "−" : "+"} ${Math.abs(t)}${bin(2, r)} = ${ans}`,
          `Check by FOIL: ${ans} = ${P} ✓`] };
    }
    let r = randInt(-9, 9), t = randInt(-9, 9);
    while (r === 0 || t === 0 || r === t || r === -t) { r = randInt(-9, 9); t = randInt(-9, 9); }
    const P = poly([1, r + t, r * t]), ans = `${bin(1, r)}${bin(1, t)}`;
    return { poly: P, type: TYPES[3], answer: ans,
      choices: choiceSet(ans, [`${bin(1, -r)}${bin(1, -t)}`, `${bin(1, r)}${bin(1, -t)}`, `${bin(1, -r)}${bin(1, t)}`, r !== 1 && t !== 1 ? `${bin(1, r * t)}${bin(1, 1)}` : null]),
      steps: [`Find two numbers whose product is ${neg(r * t)} and whose sum is ${neg(r + t)}.`,
        `${neg(r)} × ${par(t)} = ${neg(r * t)} and ${neg(r)} + ${par(t)} = ${neg(r + t)}.`,
        `${P} = ${ans}`,
        `Check by FOIL: x² ${t < 0 ? "−" : "+"} ${Math.abs(t)}x ${r < 0 ? "−" : "+"} ${Math.abs(r)}x ${r * t < 0 ? "−" : "+"} ${Math.abs(r * t)} = ${P} ✓`] };
  }

  function detective(root) {
    let right = 0, tried = 0;
    const springs = new Set();
    const score = stat("Solved:", "0 / 0");
    const big = h("p", { class: "unit-big", style: "font-size:1.6rem" });
    const area = h("div", { class: "stage-body" });
    function slideIn(node) {
      const sp = new Spring(0, (v) => { node.style.opacity = clamp(v, 0, 1).toFixed(2); node.style.transform = `translateX(${((1 - v) * 28).toFixed(1)}px)`; }, { stiffness: 190, damping: 13 });
      springs.add(sp); sp.jump(0); sp.set(1);
    }
    function deal() {
      springs.forEach((sp) => sp.stop()); springs.clear();
      const pr = makeFactorProblem();
      clear(area);
      big.textContent = pr.poly; slideIn(big);
      const res1 = h("div"), stepsBox = h("ol", { class: "steps" }), res2 = h("div"), part2 = h("div", { class: "stage-body" });
      let typed = false, shown = 0, done = false;
      const stepBtn = h("button", { class: "btn ghost", type: "button", onclick: () => {
        if (shown >= pr.steps.length) return;
        const li = h("li", {}, pr.steps[shown++]); stepsBox.append(li); slideIn(li);
        if (shown >= pr.steps.length) stepBtn.disabled = true;
      } }, "Reveal the next step");
      const typeRow = h("div", { class: "choices" }, TYPES.map((c) => h("button", { type: "button", "aria-pressed": "false", onclick: (e) => {
        if (typed) return; typed = true;
        e.currentTarget.setAttribute("aria-pressed", "true");
        res1.append(pill(c === pr.type, "Good detective work!", `First step: ${pr.type.toLowerCase()}.`));
        part2.append(h("p", {}, "Step 2 · Factor completely."), h("div", { class: "choices" }, pr.choices.map((ch) => h("button", { type: "button", "aria-pressed": "false", onclick: (ev) => {
          if (done) return; done = true; tried++;
          ev.currentTarget.setAttribute("aria-pressed", "true");
          const ok = ch === pr.answer; if (ok) right++;
          score.set(`${right} / ${tried}`);
          big.textContent = `${pr.poly} = ${pr.answer}`; slideIn(big);
          res2.append(pill(ok, "Factored completely!", `The answer is ${pr.answer}.`), h("div", { class: "controls" }, h("button", { class: "btn", type: "button", onclick: deal }, "Next case")));
        } }, ch))), res2, h("div", { class: "controls" }, stepBtn), stepsBox);
      } }, c)));
      area.append(h("p", {}, "Step 1 · What kind of polynomial is this? What do you do first?"), typeRow, res1, part2);
    }
    root.append(h("div", { class: "readout" }, score.el), big, area);
    deal();
    return () => springs.forEach((sp) => sp.stop());
  }

  // ------------------------------------------------------------ problems

  const PROBLEMS = [
    { name: "Community hub lot (PT1.1)", area: [1, 7, 12], f: [[1, 4], [1, 3]], xmin: 1, sides: ["length", "width"],
      q: "The lot for the community hub has an area of x² + 7x + 12 m². Which expressions give its length and width?",
      answer: "(x + 4) m and (x + 3) m", others: ["(x + 6) m and (x + 2) m", "(x + 12) m and (x + 1) m", "(x + 7) m and (x + 12) m"],
      why: "Two numbers with product 12 and sum 7 are 3 and 4: x² + 7x + 12 = (x + 4)(x + 3)." },
    { name: "Square reading garden", area: [1, 10, 25], f: [[1, 5], [1, 5]], xmin: 1, sides: ["side", "side"],
      q: "A square reading garden has an area of x² + 10x + 25 m². What is the length of one side?",
      answer: "(x + 5) m", others: ["(x + 25) m", "(x + 10) m", "(x + 2) m"],
      why: "x² + 10x + 25 is a perfect square trinomial: (x + 5)². A square’s side is x + 5." },
    { name: "Covered court", area: [1, 2, -15], f: [[1, 5], [1, -3]], xmin: 4, sides: ["length", "width"],
      q: "A covered court has an area of x² + 2x − 15 m². Which expressions give its length and width?",
      answer: "(x + 5) m and (x − 3) m", others: ["(x − 5) m and (x + 3) m", "(x + 15) m and (x − 1) m", "(x + 5) m and (x + 3) m"],
      why: "5 × (−3) = −15 and 5 + (−3) = 2, so x² + 2x − 15 = (x + 5)(x − 3). The width x − 3 must be positive, so x > 3." },
    { name: "Mural wall", area: [2, 6, 0], f: [[1, 3], [2, 0]], xmin: 1, sides: ["width", "height"],
      q: "A mural has an area of 2x² + 6x m² and a height of 2x m. What is its width?",
      answer: "(x + 3) m", others: ["(x + 6) m", "(2x + 3) m", "(x + 12) m"],
      why: "Factor out the GCF 2x: 2x² + 6x = 2x(x + 3). The width is x + 3." },
    { name: "Lot with a corner storeroom", area: [1, 0, -9], f: [[1, 3], [1, -3]], xmin: 4, sides: ["length", "width"],
      q: "A square lot of side x m loses a 3 m by 3 m corner to a storeroom. The rest (x² − 9 m²) is rearranged into a rectangle. What are its sides?",
      answer: "(x + 3) m and (x − 3) m", others: ["(x − 3) m and (x − 3) m", "(x + 9) m and (x − 1) m", "(x + 3) m and (x + 3) m"],
      why: "x² − 9 is a difference of two squares: (x + 3)(x − 3)." },
  ];

  /** 2x² + 6x at x = 5 → "2(5)² + 6(5)" (zero terms are skipped). */
  function subst(cs, xv) {
    return cs.map((c, i) => [c, 2 - i]).filter(([c]) => c).map(([c, p], i) => {
      const a = Math.abs(c), body = p === 2 ? `${a === 1 ? "" : a}(${xv})²` : p === 1 ? `${a}(${xv})` : String(a);
      return i === 0 ? (c < 0 ? "−" : "") + body : (c < 0 ? " − " : " + ") + body;
    }).join("");
  }

  function problems(root) {
    let idx = 0, x = 6;
    const svg = s("svg", { viewBox: "0 0 500 290", role: "img", "aria-label": "A rectangle whose sides are the factors" });
    const layer = s("g"); svg.append(layer);
    const out = h("div", { class: "readout" }), work = h("pre", { class: "workings" }), qa = h("div", { class: "stage-body" });
    let dims = [0, 0];
    const lin = ([m, c], v) => m * v + c;
    const sp = new Spring([0, 0], (v) => { dims = v; draw(); }, { stiffness: 170, damping: 14 });
    function scale() { const pr = PROBLEMS[idx]; return Math.min(340 / Math.max(lin(pr.f[0], 12), 1), 220 / Math.max(lin(pr.f[1], 12), 1)); }
    function draw() {
      clear(layer);
      const pr = PROBLEMS[idx], k = scale(), W = Math.max(0, dims[0] * k), H = Math.max(0, dims[1] * k), ox = 130, oy = 44;
      layer.append(s("rect", { x: ox, y: oy, width: W, height: H, fill: "var(--accent-soft)", stroke: "var(--accent)", "stroke-width": 2.5, rx: 3 }));
      for (let i = 1; i < dims[0]; i++) layer.append(s("line", { x1: ox + i * k, y1: oy, x2: ox + i * k, y2: oy + H, stroke: "var(--accent)", opacity: 0.15 }));
      for (let j = 1; j < dims[1]; j++) layer.append(s("line", { x1: ox, y1: oy + j * k, x2: ox + W, y2: oy + j * k, stroke: "var(--accent)", opacity: 0.15 }));
      const xi = Math.round(x);
      layer.append(s("text", { x: ox + W / 2, y: oy - 14, "text-anchor": "middle", class: "svg-text", "font-size": 19, "font-weight": 700 }, `${poly(pr.f[0])} = ${lin(pr.f[0], xi)} m`),
        s("text", { x: ox - 10, y: oy + H / 2 + 2, "text-anchor": "end", class: "svg-text", "font-size": 19, "font-weight": 700 }, `${poly(pr.f[1])}`),
        s("text", { x: ox - 10, y: oy + H / 2 + 24, "text-anchor": "end", class: "svg-text", "font-size": 16 }, `= ${lin(pr.f[1], xi)} m`),
        s("text", { x: ox + W / 2, y: oy + H / 2 + 6, "text-anchor": "middle", class: "svg-text", "font-size": 17 }, H > 30 && W > 170 ? `${poly(pr.area)} m²` : ""));
    }
    function update() {
      const pr = PROBLEMS[idx], xi = Math.round(x);
      sp.set([lin(pr.f[0], x), lin(pr.f[1], x)]);
      const a = lin(pr.f[0], xi), b = lin(pr.f[1], xi), A = pr.area[0] * xi * xi + pr.area[1] * xi + pr.area[2];
      clear(out);
      out.append(stat("x =", String(xi)).el, stat(`${pr.sides[0]}:`, `${a} m`).el, stat(`${pr.sides[1]}:`, `${b} m`).el, stat("Area:", `${a * b} m²`).el);
      work.textContent = `Check by multiplying the factors:\n${a} × ${b} = ${a * b} m²\n${poly(pr.area)} at x = ${xi}: ${subst(pr.area, xi)} = ${A} m²  ${A === a * b ? "✓ same area" : ""}`;
    }
    function ask() {
      const pr = PROBLEMS[idx];
      clear(qa);
      const res = h("div");
      let done = false;
      qa.append(h("p", {}, pr.q), h("div", { class: "choices" }, shuffle([pr.answer, ...pr.others]).map((c) => h("button", { type: "button", "aria-pressed": "false", onclick: (e) => {
        if (done) return; done = true; e.currentTarget.setAttribute("aria-pressed", "true");
        res.append(pill(c === pr.answer, "Correct!", `Answer: ${pr.answer}.`), h("p", { class: "note" }, pr.why));
      } }, c))), res);
    }
    const slider = elasticSlider({ id: "g8l5-x", label: "x (m)", min: 1, max: 12, value: x, step: 1, format: (v) => String(Math.round(v)), onInput: (v) => { x = Math.max(v, PROBLEMS[idx].xmin); update(); } });
    const sel = h("select", { id: "g8l5-prob" }, PROBLEMS.map((p, i) => h("option", { value: i }, p.name)));
    sel.addEventListener("change", () => { idx = Number(sel.value); if (x < PROBLEMS[idx].xmin) slider.set(PROBLEMS[idx].xmin); update(); ask(); });
    root.append(h("div", { class: "controls" }, h("label", { for: "g8l5-prob" }, "Problem", sel)), qa, h("div", { class: "controls" }, slider.el), svg, out, work,
      h("p", { class: "note" }, "Slide x: the factors are the side lengths for every value of x, and multiplying them always gives the area."));
    update(); ask();
    return () => sp.stop();
  }

  // ------------------------------------------------------------ lesson

  Sim.register({
    id: "g8-lesson5", unit: "8B", num: 5, letter: "E", title: "Factoring Polynomials", simName: "Factor Puzzle",
    comps: ["A8", "A9", "M5", "T1"], cycles: "C4,M4 – C5,M4", deped: "DepEd Weeks 4–6",
    bigQuestion: "How can one expression describe every size of garden?",
    mission: [
      "Make a Rectangle: arrange the tiles of x² + 5x + 6 into a rectangle. What are its side lengths?",
      "Try x² + 7x + 12. How are the two numbers in the factors related to 7 and 12?",
      "Try x² + 6x + 9. What is special about the rectangle?",
      "Factor Detective: solve 5 cases. What do you check first?",
      "Problems: find the dimensions of the community hub lot, then slide x and check by multiplying.",
    ],
    discovery: "Factoring undoes multiplying: the tiles of a trinomial form a rectangle, and its side lengths are the factors. For x² + bx + c, look for two numbers whose product is c and whose sum is b. Always take out a common monomial factor first, then look for a difference of two squares or a perfect square trinomial (which forms a square). Multiply the factors to check: they give back the area for every value of x.",
    mount(stage) {
      const body = h("div", { class: "stage-body" });
      const views = [rectangle, detective, problems];
      let stopper = null;
      const t = tabs(["Make a Rectangle", "Factor Detective", "Problems"], (i) => { if (stopper) stopper(); clear(body); stopper = views[i](body) || null; });
      stage.append(t.el, body);
      stopper = rectangle(body);
      return () => { if (stopper) stopper(); };
    },
    check() {
      const kind = randInt(0, 5);
      if (kind <= 2) { const pr = makeFactorProblem(); return { q: `Factor completely: ${pr.poly}`, choices: pr.choices, answer: pr.answer, explain: pr.steps.slice(0, 3).join(" ") }; }
      if (kind === 3) { const pr = makeFactorProblem(); return { q: `What kind of polynomial is ${pr.poly}? What should you factor first?`, choices: TYPES, answer: pr.type, explain: pr.steps[0] }; }
      if (kind === 4) {
        let r = randInt(1, 8), t = randInt(1, 8);
        while (r === t) t = randInt(1, 8);
        const sg = pick([1, -1]), big = Math.max(r, t), small = Math.min(r, t);
        return { q: `Two numbers have a product of ${neg(sg * r * t)} and a sum of ${neg(sg > 0 ? r + t : big - small)}. What is the larger number?`, answer: big, explain: sg > 0 ? `${r} × ${t} = ${r * t} and ${r} + ${t} = ${r + t}.` : `${big} × (−${small}) = ${neg(-r * t)} and ${big} + (−${small}) = ${big - small}.` };
      }
      const xv = randInt(3, 10);
      return { q: `The community hub lot has an area of x² + 7x + 12 m², so its sides are (x + 4) m and (x + 3) m. If x = ${xv}, how long is the longer side?`, answer: xv + 4, unit: "m", explain: `x + 4 = ${xv} + 4 = ${xv + 4} m. Check: ${xv + 4} × ${xv + 3} = ${(xv + 4) * (xv + 3)} = ${xv}² + 7(${xv}) + 12.` };
    },
  });
})();
