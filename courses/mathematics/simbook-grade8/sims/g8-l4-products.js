/* Grade 8 · Term 1 · Lesson 4 · D. Multiplying Polynomials and Special Products – Area Builder */
(function () {
  "use strict";
  const { h, s, clear, randInt, pick, shuffle, tabs, segmented, stat, pill, Spring, elasticSlider, clamp } = Sim;

  // ------------------------------------------------------------ algebra text

  const SUP = ["", "", "²", "³", "⁴"];
  const neg = (n) => (n < 0 ? "−" + Math.abs(n) : String(n));
  const par = (n) => (n < 0 ? `(${neg(n)})` : neg(n));
  /** Polynomial in x from coefficients, highest power first: [1, 5, 6] → "x² + 5x + 6". */
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
  const pmul = (a, b) => { const r = Array(a.length + b.length - 1).fill(0); a.forEach((x, i) => b.forEach((y, j) => { r[i + j] += x * y; })); return r; };
  const bin = (m, c) => `(${poly([m, c])})`;
  const fac = (a) => (a ? bin(1, a) : "x");
  /** Terms [coefficient, power] written in order without combining: x² + 3x + 3x + 9. */
  const joinTerms = (ts) => ts.filter(([c]) => c).map(([c, p], i) => { const t = poly([Math.abs(c), ...Array(p).fill(0)]); return i === 0 ? (c < 0 ? "−" : "") + t : (c < 0 ? " − " : " + ") + t; }).join("");
  /** Up to four distinct answer choices that always include the answer. */
  function choiceSet(answer, others) {
    const out = [answer];
    for (const o of others) if (o && !out.includes(o) && out.length < 4) out.push(o);
    return shuffle(out);
  }

  // ------------------------------------------------------------ algebra tiles

  const TILE = { 2: ["var(--shape-a)", "var(--shape-a-soft)"], 1: ["var(--gold)", "var(--gold-soft)"], 0: ["var(--shape-b)", "var(--shape-b-soft)"] };
  let uidN = 0;
  /** Hatch patterns for negative tiles (one per tile colour), local to one svg. */
  function tileDefs(svg) {
    const uid = `g8l4h${++uidN}`;
    const defs = s("defs");
    [2, 1, 0].forEach((k) => {
      const p = s("pattern", { id: `${uid}-${k}`, patternUnits: "userSpaceOnUse", width: 8, height: 8, patternTransform: "rotate(45)" });
      p.append(s("rect", { width: 8, height: 8, fill: "var(--paper)" }), s("line", { x1: 2, y1: 0, x2: 2, y2: 8, stroke: TILE[k][0], "stroke-width": 2.5, opacity: 0.55 }));
      defs.append(p);
    });
    svg.append(defs);
    return (k, negative) => negative
      ? { fill: `url(#${uid}-${k})`, stroke: TILE[k][0], "stroke-width": 2, "stroke-dasharray": "5 3" }
      : { fill: TILE[k][1], stroke: TILE[k][0], "stroke-width": 2 };
  }

  // ------------------------------------------------------------ area model

  function areaModel(root) {
    const body = h("div", { class: "stage-body" });
    let stop = null;
    const show = (m) => { if (stop) stop(); clear(body); stop = (m === "bb" ? binomials : monoTri)(body) || null; };
    root.append(h("div", { class: "controls" }, segmented(["bb", "mt"], "bb", show, (v) => (v === "bb" ? "Binomial × binomial" : "Monomial × trinomial"))), body);
    show("bb");
    return () => { if (stop) stop(); };
  }

  function binomials(root) {
    let a = 3, b = 2;
    const X = 140, u = 26, O = { x: 64, y: 44 };
    const svg = s("svg", { viewBox: "0 0 600 340", role: "img", "aria-label": "Algebra tiles forming the rectangle (x + a)(x + b)" });
    const look = tileDefs(svg);
    const layer = s("g"), grid = s("g");
    svg.append(layer, grid);
    const prod = h("p", { class: "unit-big", "aria-live": "polite" }), work = h("pre", { class: "workings" }), note = h("p", { class: "note" });
    const sign = (v) => (v < 0 ? -1 : 1);
    /** Tile k of a row of |v| tiles is partly grown while the slider is between values. */
    const grow = (v, k) => clamp(Math.abs(v) - k, 0, 1);

    function draw() {
      clear(layer); clear(grid);
      const na = Math.ceil(Math.abs(a) - 1e-6), nb = Math.ceil(Math.abs(b) - 1e-6);
      layer.append(s("rect", { x: O.x, y: O.y, width: X, height: X, rx: 3, ...look(2, false) }),
        s("text", { x: O.x + X / 2, y: O.y + X / 2 + 6, "text-anchor": "middle", class: "svg-text", "font-size": 18, "font-weight": 700 }, "x²"));
      for (let k = 0; k < na; k++) {
        const f = grow(a, k), x = O.x + X + k * u;
        layer.append(s("rect", { x: x + 1, y: O.y, width: Math.max(0, f * u - 2), height: X, rx: 2, opacity: f, ...look(1, a < 0) }));
        if (f > 0.5) layer.append(s("text", { x: x + u / 2, y: O.y - 8, "text-anchor": "middle", class: "svg-text", "font-size": 12, fill: "var(--gold)" }, a < 0 ? "−1" : "+1"));
      }
      for (let j = 0; j < nb; j++) {
        const f = grow(b, j), y = O.y + X + j * u;
        layer.append(s("rect", { x: O.x, y: y + 1, width: X, height: Math.max(0, f * u - 2), rx: 2, opacity: f, ...look(1, b < 0) }));
        if (f > 0.5) layer.append(s("text", { x: O.x - 8, y: y + u / 2 + 4, "text-anchor": "end", class: "svg-text", "font-size": 12, fill: "var(--gold)" }, b < 0 ? "−1" : "+1"));
        for (let k = 0; k < na; k++) {
          const g = grow(a, k) * f, x = O.x + X + k * u;
          if (g > 0) layer.append(s("rect", { x: x + 1, y: y + 1, width: Math.max(0, grow(a, k) * u - 2), height: Math.max(0, f * u - 2), rx: 2, opacity: g, ...look(0, sign(a) * sign(b) < 0) }));
        }
      }
      layer.append(s("text", { x: O.x + X / 2, y: O.y - 8, "text-anchor": "middle", class: "svg-text", "font-weight": 700 }, "x"),
        s("text", { x: O.x - 8, y: O.y + X / 2 + 4, "text-anchor": "end", class: "svg-text", "font-weight": 700 }, "x"));

      // the box (generic rectangle) method, with the same four parts
      const A = Math.round(a), B = Math.round(b);
      const gx = 400, gy = 70, cw = [80, 80], ch = [80, 80];
      const cells = [["x²", 2, false], [poly([A, 0]), 1, A < 0], [poly([B, 0]), 1, B < 0], [neg(A * B), 0, A * B < 0]];
      grid.append(s("text", { x: gx + 80, y: 36, "text-anchor": "middle", class: "svg-label" }, "Box method"),
        s("text", { x: gx + 40, y: gy - 10, "text-anchor": "middle", class: "svg-text", "font-weight": 700 }, "x"),
        s("text", { x: gx + 120, y: gy - 10, "text-anchor": "middle", class: "svg-text", "font-weight": 700 }, neg(A)),
        s("text", { x: gx - 10, y: gy + 45, "text-anchor": "end", class: "svg-text", "font-weight": 700 }, "x"),
        s("text", { x: gx - 10, y: gy + 125, "text-anchor": "end", class: "svg-text", "font-weight": 700 }, neg(B)));
      cells.forEach(([t, k, n], i) => {
        const x = gx + (i % 2) * cw[0], y = gy + Math.floor(i / 2) * ch[0];
        grid.append(s("rect", { x, y, width: cw[0], height: ch[0], ...look(k, n) }),
          s("text", { x: x + 40, y: y + 46, "text-anchor": "middle", class: "svg-text", "font-size": 16, "font-weight": 700 }, t));
      });
      const P = pmul([1, A], [1, B]);
      grid.append(s("text", { x: gx + 80, y: gy + 190, "text-anchor": "middle", class: "svg-text", "font-size": 13 }, `${neg(A)}x + ${par(B)}x = ${poly([A + B, 0])}`));
      prod.textContent = `${fac(A)}${fac(B)} = ${poly(P)}`;
      work.textContent = [
        `${fac(A)}${fac(B)}`,
        `F  x · x = x²`,
        `O  x · ${par(B)} = ${poly([B, 0])}`,
        `I  ${par(A)} · x = ${poly([A, 0])}`,
        `L  ${par(A)} · ${par(B)} = ${neg(A * B)}`,
        `Combine like terms: ${joinTerms([[1, 2], [B, 1], [A, 1], [A * B, 0]])} = ${poly(P)}`,
      ].join("\n");
      note.textContent = A * B < 0 ? `The x-tiles have opposite signs: ${Math.abs(A)} and ${Math.abs(B)} cancel in zero pairs, leaving ${poly([A + B, 0])}. The ${Math.abs(A * B)} unit tiles are negative, so the last term is ${neg(A * B)}.`
        : A === 0 || B === 0 ? "When one constant is 0, the product has only two terms." : `Like terms combine: ${poly([A, 0])} + ${poly([B, 0])} = ${poly([A + B, 0])}. Dashed, striped tiles are negative.`;
    }
    root.append(h("div", { class: "controls" },
      elasticSlider({ id: "g8l4-a", label: "a in (x + a)", min: -5, max: 5, value: a, step: 1, format: (v) => neg(Math.round(v)), onInput: (v) => { a = v; draw(); } }).el,
      elasticSlider({ id: "g8l4-b", label: "b in (x + b)", min: -5, max: 5, value: b, step: 1, format: (v) => neg(Math.round(v)), onInput: (v) => { b = v; draw(); } }).el),
    svg, prod, work, note);
    draw();
  }

  function monoTri(root) {
    let m = 3, p = 2, q = -4;
    const svg = s("svg", { viewBox: "0 0 500 200", role: "img", "aria-label": "Grid for a monomial times a trinomial" });
    const look = tileDefs(svg);
    const layer = s("g");
    svg.append(layer);
    const pulse = [1, 1, 1];
    const springs = [0, 1, 2].map((i) => new Spring(1, (v) => { pulse[i] = v; draw(); }, { stiffness: 260, damping: 12 }));
    const prod = h("p", { class: "unit-big", "aria-live": "polite" }), work = h("pre", { class: "workings" });
    let last = [];
    const nz = (v, prev) => { const r = Math.round(v); return r === 0 ? (v < 0 ? -1 : 1) || prev : r; };
    function draw() {
      clear(layer);
      const M = m, P = p, Q = q;
      const heads = ["x²", poly([P, 0]), neg(Q)], kinds = [2, 1, 0];
      const cells = [poly([M, 0, 0, 0]), poly([M * P, 0, 0]), poly([M * Q, 0])];
      const cellKinds = [[2, M < 0], [1, M * P < 0], [0, M * Q < 0]];
      const gx = 84, gy = 50, w = 136, ht = 100;
      layer.append(s("text", { x: gx - 16, y: gy + ht / 2 + 6, "text-anchor": "end", class: "svg-text", "font-size": 22, "font-weight": 700 }, poly([M, 0])));
      heads.forEach((t, i) => {
        layer.append(s("text", { x: gx + i * w + w / 2, y: gy - 14, "text-anchor": "middle", class: "svg-text", "font-size": 20, "font-weight": 700, fill: TILE[kinds[i]][0] }, t));
        const cx = gx + i * w + w / 2, cy = gy + ht / 2, k = pulse[i];
        const g = s("g", { transform: `translate(${cx},${cy}) scale(${k.toFixed(3)})` });
        g.append(s("rect", { x: -w / 2 + 3, y: -ht / 2 + 3, width: w - 6, height: ht - 6, rx: 6, ...look(cellKinds[i][0] === 2 ? 2 : cellKinds[i][0], cellKinds[i][1]) }),
          s("text", { y: 8, "text-anchor": "middle", class: "svg-text", "font-size": 24, "font-weight": 700 }, cells[i]));
        layer.append(g);
      });
      layer.append(s("text", { x: 288, y: 186, "text-anchor": "middle", class: "svg-label", "font-size": 14 }, "Multiply the monomial by every term."));
      prod.textContent = `${poly([M, 0])}(${poly([1, P, Q])}) = ${poly(pmul([M, 0], [1, P, Q]))}`;
      work.textContent = `${poly([M, 0])} · x² = ${cells[0]}\n${poly([M, 0])} · ${par(P)}x = ${cells[1]}\n${poly([M, 0])} · ${par(Q)} = ${cells[2]}\nSum: ${poly(pmul([M, 0], [1, P, Q]))}   (add the exponents: x · x² = x³)`;
      const now = [M, P, Q];
      if (last.length) {
        if (now[0] !== last[0]) [0, 1, 2].forEach((i) => kick(i));
        if (now[1] !== last[1]) kick(1);
        if (now[2] !== last[2]) kick(2);
      }
      last = now;
    }
    function kick(i) { const sp = springs[i]; sp.value = 1.18; sp.vel = 0; sp.set(1); }
    const snaps = [-5, -4, -3, -2, -1, 1, 2, 3, 4, 5];
    root.append(h("div", { class: "controls" },
      elasticSlider({ id: "g8l4-m", label: "Monomial: _x", min: -5, max: 5, value: m, snaps, format: (v) => neg(nz(v, 1)), onInput: (v) => { m = nz(v, m); draw(); } }).el,
      elasticSlider({ id: "g8l4-p", label: "x² + _x", min: -5, max: 5, value: p, snaps, format: (v) => neg(nz(v, 1)), onInput: (v) => { p = nz(v, p); draw(); } }).el,
      elasticSlider({ id: "g8l4-q", label: "constant", min: -5, max: 5, value: q, snaps, format: (v) => neg(nz(v, 1)), onInput: (v) => { q = nz(v, q); draw(); } }).el),
    svg, prod, work);
    draw();
    return () => springs.forEach((sp) => sp.stop());
  }

  // ------------------------------------------------------------ special products

  function special(root) {
    const body = h("div", { class: "stage-body" });
    let stop = null;
    const show = (m) => { if (stop) stop(); clear(body); stop = (m === "sq" ? squareBin : m === "sd" ? sumDiff : squareTri)(body) || null; };
    root.append(h("div", { class: "controls" }, segmented(["sq", "sd", "tri"], "sq", show, (v) => ({ sq: "(a + b)²", sd: "(a + b)(a − b)", tri: "(a + b + c)²" })[v])), body);
    show("sq");
    return () => { if (stop) stop(); };
  }

  function piece(g, x, y, w, ht, kind, label, sub) {
    g.append(s("rect", { x, y, width: Math.max(0, w), height: Math.max(0, ht), rx: 3, fill: TILE[kind][1], stroke: TILE[kind][0], "stroke-width": 2 }));
    if (w > 22 && ht > 18) {
      const fs = Math.min(17, w / 3, ht / 1.8);
      g.append(s("text", { x: x + w / 2, y: y + ht / 2 + (sub && ht > 44 ? -2 : fs / 3), "text-anchor": "middle", class: "svg-text", "font-size": fs.toFixed(1), "font-weight": 700 }, label));
      if (sub && ht > 44 && w > 34) g.append(s("text", { x: x + w / 2, y: y + ht / 2 + 15, "text-anchor": "middle", class: "svg-text", "font-size": Math.min(12, w / 4).toFixed(1), fill: "var(--muted)" }, sub));
    }
  }

  function squareBin(root) {
    let a = 5, b = 2, k = 0;
    const u = 25, O = { x: 60, y: 44 }, g0 = 24;
    const svg = s("svg", { viewBox: "0 0 400 350", role: "img", "aria-label": "A square of side a + b split into a², 2ab, and b²" });
    const layer = s("g"); svg.append(layer);
    const eq = h("p", { class: "unit-big", "aria-live": "polite" }), work = h("pre", { class: "workings" });
    const sp = new Spring(0, (v) => { k = v; draw(); }, { stiffness: 120, damping: 11 });
    function draw() {
      clear(layer);
      const A = a * u, B = b * u, g = g0 * k, ai = Math.round(a), bi = Math.round(b);
      piece(layer, O.x - g, O.y - g, A, A, 2, "a²", `${ai}² = ${ai * ai}`);
      piece(layer, O.x + A + g, O.y - g, B, A, 1, "ab", `${ai * bi}`);
      piece(layer, O.x - g, O.y + A + g, A, B, 1, "ab", `${ai * bi}`);
      piece(layer, O.x + A + g, O.y + A + g, B, B, 0, "b²", `${bi * bi}`);
      layer.append(s("text", { x: O.x + A / 2 - g, y: O.y - 10 - g, "text-anchor": "middle", class: "svg-text", "font-weight": 700 }, `a = ${ai}`),
        s("text", { x: O.x + A + B / 2 + g, y: O.y - 10 - g, "text-anchor": "middle", class: "svg-text", "font-weight": 700 }, `b = ${bi}`),
        s("text", { x: O.x - 10 - g, y: O.y + A / 2 - g, "text-anchor": "end", class: "svg-text", "font-weight": 700 }, "a"),
        s("text", { x: O.x - 10 - g, y: O.y + A + B / 2 + g, "text-anchor": "end", class: "svg-text", "font-weight": 700 }, "b"));
      eq.textContent = k > 0.5 ? `Pieces: a² + 2ab + b² = ${ai * ai} + ${2 * ai * bi} + ${bi * bi} = ${(ai + bi) ** 2}` : `One square: (a + b)² = (${ai} + ${bi})² = ${(ai + bi) ** 2}`;
      work.textContent = `(a + b)² = a² + 2ab + b²\n(${ai} + ${bi})² = ${ai}² + 2(${ai})(${bi}) + ${bi}² = ${ai * ai} + ${2 * ai * bi} + ${bi * bi} = ${(ai + bi) ** 2}\nWith a = x: (x + ${bi})² = ${poly([1, 2 * bi, bi * bi])}   (NOT x² + ${bi * bi} – the two ab pieces are missing!)`;
    }
    const toggle = h("button", { class: "btn", type: "button", onclick: () => { const t = sp.target > 0.5 ? 0 : 1; sp.set(t); toggle.textContent = t ? "Put it back together" : "Pull the square apart"; } }, "Pull the square apart");
    root.append(h("div", { class: "controls" },
      elasticSlider({ id: "g8l4-sa", label: "a", min: 2, max: 7, value: a, step: 1, format: (v) => String(Math.round(v)), onInput: (v) => { a = v; draw(); } }).el,
      elasticSlider({ id: "g8l4-sb", label: "b", min: 1, max: 4, value: b, step: 1, format: (v) => String(Math.round(v)), onInput: (v) => { b = v; draw(); } }).el,
      toggle), svg, eq, work);
    draw();
    return () => sp.stop();
  }

  function sumDiff(root) {
    let a = 6, b = 2, k = 0;
    const u = 30, O = { x: 64, y: 44 };
    const svg = s("svg", { viewBox: "0 0 430 320", role: "img", "aria-label": "A square a² with the corner b² removed, rearranged into (a + b)(a − b)" });
    const layer = s("g"); svg.append(layer);
    const eq = h("p", { class: "unit-big", "aria-live": "polite" }), work = h("pre", { class: "workings" });
    const sp = new Spring(0, (v) => { k = v; draw(); }, { stiffness: 90, damping: 12 });
    function draw() {
      clear(layer);
      const A = a * u, B = b * u, D = A - B, ai = Math.round(a), bi = Math.round(b);
      const k1 = clamp(k, 0, 1), k2 = clamp(k - 1, 0, 1);
      // top strip: a by (a − b)
      piece(layer, O.x, O.y, A, D, 2, "a(a − b)", `${ai} × ${ai - bi}`);
      // bottom-left strip: (a − b) by b – it turns and slides to the right side
      const c0 = { x: O.x + D / 2, y: O.y + D + B / 2 }, c1 = { x: O.x + A + B / 2, y: O.y + D / 2 };
      const cx = c0.x + (c1.x - c0.x) * k2, cy = c0.y + (c1.y - c0.y) * k2 - Math.sin(Math.PI * k2) * 30;
      const strip = s("g", { transform: `translate(${cx.toFixed(1)},${cy.toFixed(1)}) rotate(${(90 * k2).toFixed(1)})` });
      piece(strip, -D / 2, -B / 2, D, B, 1, "b(a − b)", `${bi} × ${ai - bi}`);
      // the corner b² slides away and leaves a dashed hole
      layer.append(s("rect", { x: O.x + D, y: O.y + D, width: B, height: B, fill: "none", stroke: "var(--muted)", "stroke-width": 1.5, "stroke-dasharray": "5 4", opacity: k1 }));
      const cg = s("g", { transform: `translate(${(k1 * 50).toFixed(1)},${(k1 * 60).toFixed(1)})`, opacity: (1 - 0.75 * k1).toFixed(2) });
      piece(cg, O.x + D, O.y + D, B, B, 0, "b²", `${bi * bi}`);
      layer.append(cg, strip);
      layer.append(s("text", { x: O.x + A / 2, y: O.y - 12, "text-anchor": "middle", class: "svg-text", "font-weight": 700 }, k2 > 0.5 ? "" : `a = ${ai}`));
      if (k2 > 0.95) {
        layer.append(s("text", { x: O.x + (A + B) / 2, y: O.y - 12, "text-anchor": "middle", class: "svg-text", "font-weight": 700 }, `a + b = ${ai + bi}`),
          s("text", { x: O.x - 8, y: O.y + D / 2 + 4, "text-anchor": "end", class: "svg-text", "font-weight": 700 }, `a − b`),
          s("text", { x: O.x - 8, y: O.y + D / 2 + 20, "text-anchor": "end", class: "svg-text", "font-size": 12 }, `= ${ai - bi}`));
      } else layer.append(s("text", { x: O.x - 8, y: O.y + A / 2 + 4, "text-anchor": "end", class: "svg-text", "font-weight": 700 }, "a"));
      const msg = k < 0.5 ? ["Start with a square:", "a²", `${ai}² = ${ai * ai}`] : k < 1.5 ? ["Take away the corner:", "a² − b²", `${ai * ai} − ${bi * bi} = ${ai * ai - bi * bi}`] : ["Rearranged:", "(a + b)(a − b)", `${ai + bi} × ${ai - bi} = ${(ai + bi) * (ai - bi)}`];
      eq.textContent = `${msg[0]} ${msg[1]} = ${msg[2]}`;
      work.textContent = `(a + b)(a − b) = a² − b²\n(${ai} + ${bi})(${ai} − ${bi}) = ${ai + bi} × ${ai - bi} = ${(ai + bi) * (ai - bi)}   and   ${ai}² − ${bi}² = ${ai * ai} − ${bi * bi} = ${ai * ai - bi * bi}\nWith a = x: (x + ${bi})(x − ${bi}) = ${poly([1, 0, -bi * bi])}   – the middle terms +${bi}x and −${bi}x cancel.`;
    }
    root.append(h("div", { class: "controls" },
      elasticSlider({ id: "g8l4-da", label: "a", min: 4, max: 7, value: a, step: 1, format: (v) => String(Math.round(v)), onInput: (v) => { a = v; draw(); } }).el,
      elasticSlider({ id: "g8l4-db", label: "b", min: 1, max: 3, value: b, step: 1, format: (v) => String(Math.round(v)), onInput: (v) => { b = v; draw(); } }).el),
    h("div", { class: "controls" },
      h("button", { class: "btn", type: "button", onclick: () => sp.set(1) }, "1 · Remove b²"),
      h("button", { class: "btn", type: "button", onclick: () => sp.set(2) }, "2 · Move the strip"),
      h("button", { class: "btn ghost", type: "button", onclick: () => sp.set(0) }, "Reset")),
    svg, eq, work);
    draw();
    return () => sp.stop();
  }

  function squareTri(root) {
    const v = [4, 2, 1];
    let k = 0;
    const u = 22, O = { x: 50, y: 44 }, g0 = 16, names = ["a", "b", "c"];
    const svg = s("svg", { viewBox: "0 0 380 360", role: "img", "aria-label": "A square of side a + b + c split into nine pieces" });
    const layer = s("g"); svg.append(layer);
    const eq = h("p", { class: "unit-big" }), work = h("pre", { class: "workings" });
    const sp = new Spring(0, (x) => { k = x; draw(); }, { stiffness: 120, damping: 11 });
    function draw() {
      clear(layer);
      const L = v.map((x) => x * u), n = v.map((x) => Math.round(x));
      let y = O.y;
      for (let j = 0; j < 3; j++) {
        let x = O.x;
        for (let i = 0; i < 3; i++) {
          const kind = i === j ? 2 : 1;
          const lab = i === j ? `${names[i]}²` : [names[Math.min(i, j)], names[Math.max(i, j)]].join("");
          piece(layer, x + (i - 1) * g0 * k, y + (j - 1) * g0 * k, L[i], L[j], kind, lab, String(n[i] * n[j]));
          x += L[i];
        }
        layer.append(s("text", { x: O.x - 10 - g0 * k, y: y + L[j] / 2 + (j - 1) * g0 * k + 4, "text-anchor": "end", class: "svg-text", "font-weight": 700 }, names[j]));
        y += L[j];
      }
      let x = O.x;
      for (let i = 0; i < 3; i++) { layer.append(s("text", { x: x + L[i] / 2 + (i - 1) * g0 * k, y: O.y - 10 - g0 * k, "text-anchor": "middle", class: "svg-text", "font-weight": 700 }, `${names[i]}=${n[i]}`)); x += L[i]; }
      const [A, B, C] = n;
      eq.textContent = `(${A} + ${B} + ${C})² = ${(A + B + C) ** 2}`;
      work.textContent = `(a + b + c)² = a² + b² + c² + 2ab + 2ac + 2bc\n${A * A} + ${B * B} + ${C * C} + ${2 * A * B} + ${2 * A * C} + ${2 * B * C} = ${A * A + B * B + C * C + 2 * A * B + 2 * A * C + 2 * B * C}\nThree squares on the diagonal, and each rectangle (ab, ac, bc) appears twice.`;
    }
    const toggle = h("button", { class: "btn", type: "button", onclick: () => { const t = sp.target > 0.5 ? 0 : 1; sp.set(t); toggle.textContent = t ? "Put it back together" : "Pull the square apart"; } }, "Pull the square apart");
    root.append(h("div", { class: "controls" },
      ...[[0, 2, 6], [1, 1, 4], [2, 1, 3]].map(([i, lo, hi]) => elasticSlider({ id: `g8l4-t${i}`, label: names[i], min: lo, max: hi, value: v[i], step: 1, format: (x) => String(Math.round(x)), onInput: (x) => { v[i] = x; draw(); } }).el),
      toggle), svg, eq, work, h("p", { class: "note" }, "Optional extension: the square of a trinomial."));
    draw();
    return () => sp.stop();
  }

  // ------------------------------------------------------------ pattern match

  const PATTERNS = ["Square of a binomial", "Sum and difference of two terms", "Neither – use FOIL"];

  function makeProblem() {
    const kind = pick(["sq", "sq", "sd", "sd", "foil"]);
    const p = pick([1, 1, 1, 2, 3]), q = randInt(1, 9);
    if (kind === "sq") {
      const sg = pick([1, -1]), c = sg * q;
      const ans = poly([p * p, 2 * p * c, q * q]);
      return { text: `${bin(p, c)}²`, pattern: PATTERNS[0], answer: ans,
        choices: choiceSet(ans, [poly([p * p, 0, q * q]), poly([p * p, p * c, q * q]), poly([p * p, 2 * p * c, -q * q]), poly([p * p, -2 * p * c, q * q])]),
        why: `Square the first term (${poly([p, 0])})² = ${poly([p * p, 0, 0])}, twice the product 2(${poly([p, 0])})(${neg(c)}) = ${poly([2 * p * c, 0])}, square the last term ${neg(c)}² = ${q * q}.` };
    }
    if (kind === "sd") {
      const ans = poly([p * p, 0, -q * q]);
      const pair = shuffle([bin(p, q), bin(p, -q)]);
      return { text: pair.join(""), pattern: PATTERNS[1], answer: ans,
        choices: choiceSet(ans, [poly([p * p, 0, q * q]), poly([p * p, -2 * p * q, -q * q]), poly([p * p, 2 * p * q, q * q]), poly([p * p, -2 * q])]),
        why: `Square of the first minus square of the last: ${poly([p * p, 0, 0])} − ${q * q}. The middle terms cancel.` };
    }
    let r = randInt(-7, 7), t = randInt(-7, 7);
    while (r === 0 || t === 0 || r === t || r === -t) { r = randInt(-7, 7); t = randInt(-7, 7); }
    const ans = poly([1, r + t, r * t]);
    return { text: `${bin(1, r)}${bin(1, t)}`, pattern: PATTERNS[2], answer: ans,
      choices: choiceSet(ans, [poly([1, r * t, r + t]), poly([1, -(r + t), r * t]), poly([1, r + t, -r * t]), poly([1, 0, r * t])]),
      why: `The constants ${neg(r)} and ${neg(t)} are different numbers, so no special pattern fits. FOIL: x² + (${neg(r)} + ${par(t)})x + (${neg(r)})(${neg(t)}).` };
  }

  function patternMatch(root) {
    let right = 0, tried = 0;
    const area = h("div", { class: "stage-body" });
    const score = stat("Score:", "0 / 0");
    const big = h("p", { class: "unit-big", style: "font-size:1.6rem" });
    const sp = new Spring(1, (v) => { big.style.transform = `scale(${v.toFixed(3)})`; big.style.transformOrigin = "left center"; }, { stiffness: 260, damping: 12 });
    function deal() {
      const pr = makeProblem();
      clear(area);
      big.textContent = pr.text; sp.value = 0.7; sp.vel = 0; sp.set(1);
      const step2 = h("div", { class: "stage-body" });
      const res1 = h("div");
      let picked = false;
      const row1 = h("div", { class: "choices" }, PATTERNS.map((c) => h("button", { type: "button", "aria-pressed": "false", onclick: (e) => {
        if (picked) return; picked = true;
        e.currentTarget.setAttribute("aria-pressed", "true");
        res1.append(pill(c === pr.pattern, "Yes – that is the pattern.", `It is: ${pr.pattern}.`));
        showProducts();
      } }, c)));
      function showProducts() {
        let done = false;
        const res2 = h("div");
        step2.append(h("p", {}, "Step 2 · Choose the product."), h("div", { class: "choices" }, pr.choices.map((c) => h("button", { type: "button", "aria-pressed": "false", onclick: (e) => {
          if (done) return; done = true; tried++;
          e.currentTarget.setAttribute("aria-pressed", "true");
          const ok = c === pr.answer; if (ok) right++;
          score.set(`${right} / ${tried}`);
          big.textContent = `${pr.text} = ${pr.answer}`; sp.value = 1.15; sp.vel = 0; sp.set(1);
          res2.append(pill(ok, "Correct product!", `The product is ${pr.answer}.`), h("p", { class: "note" }, pr.why),
            h("div", { class: "controls" }, h("button", { class: "btn", type: "button", onclick: deal }, "Next problem")));
        } }, c))), res2);
      }
      area.append(h("p", {}, "Step 1 · Which pattern does this product follow?"), row1, res1, step2);
    }
    root.append(h("div", { class: "readout" }, score.el), big, area);
    deal();
    return () => sp.stop();
  }

  // ------------------------------------------------------------ lesson

  Sim.register({
    id: "lesson4", unit: "B", num: 4, letter: "D", title: "Multiplying Polynomials and Special Products", simName: "Area Builder",
    comps: ["A6", "A7", "M4"], cycles: "C3,M2 – C4,M3", deped: "DepEd Weeks 3–4",
    bigQuestion: "How can one expression describe every size of garden?",
    mission: [
      "Area Model: build (x + 3)(x + 2). Which tiles make the middle term 5x?",
      "Make a = 3 and b = −3. What happens to the x-tiles? Why does the product have only two terms?",
      "Special Products: pull apart (a + b)². Why is (x + 2)² not x² + 4?",
      "Remove the corner b² and move the strip. Explain why (a + b)(a − b) = a² − b².",
      "Pattern Match: get 5 correct in a row.",
    ],
    discovery: "Multiplying polynomials is finding the area of a rectangle: every term of one factor multiplies every term of the other (distributive property, FOIL for two binomials). Some products follow patterns: (a + b)² = a² + 2ab + b² – the square has two ab rectangles, not just a² and b². And (a + b)(a − b) = a² − b², because the two middle terms cancel. One expression, like (x + 2)², gives the area of every square garden whose side is 2 m longer than x.",
    mount(stage) {
      const body = h("div", { class: "stage-body" });
      const views = [areaModel, special, patternMatch];
      let stopper = null;
      const t = tabs(["Area Model", "Special Products", "Pattern Match"], (i) => { if (stopper) stopper(); clear(body); stopper = views[i](body) || null; });
      stage.append(t.el, body);
      stopper = areaModel(body);
      return () => { if (stopper) stopper(); };
    },
    check() {
      const kind = randInt(0, 4);
      if (kind <= 1) { const pr = makeProblem(); return { q: `Multiply: ${pr.text}`, choices: pr.choices, answer: pr.answer, explain: pr.why }; }
      if (kind === 2) {
        let r = randInt(-6, 6), t = randInt(-6, 6);
        while (r === 0 || t === 0 || r === -t) { r = randInt(-6, 6); t = randInt(-6, 6); }
        return { q: `In the product ${bin(1, r)}${bin(1, t)}, what is the coefficient of x?`, answer: r + t, explain: `Outer + inner: ${neg(t)}x + ${par(r)}x = ${poly([r + t, 0])}.` };
      }
      if (kind === 3) {
        const m = pick([2, 3, 4, -2, -3]), p = randInt(1, 5), q = pick([-4, -3, -2, 2, 3, 5]);
        const ans = poly(pmul([m, 0], [1, p, q]));
        return { q: `Multiply: ${poly([m, 0])}(${poly([1, p, q])})`, choices: choiceSet(ans, [poly([m, m * p, m * q]), poly([m, 0, m * p, m * q]), poly([m, m * p, q, 0]), poly([m, p, q, 0])]), answer: ans, explain: `Multiply ${poly([m, 0])} by each term: ${ans}.` };
      }
      const a = randInt(2, 9), b = randInt(1, 5);
      return pick([
        { q: `Use (a + b)² = a² + 2ab + b² to find ${a * 10 + b}² mentally. What is it?`, answer: (a * 10 + b) ** 2, explain: `(${a * 10} + ${b})² = ${a * a * 100} + ${2 * a * 10 * b} + ${b * b} = ${(a * 10 + b) ** 2}.` },
        { q: `Use (a + b)(a − b) = a² − b² to find ${a * 10 + b} × ${a * 10 - b} mentally. What is it?`, answer: (a * 10) ** 2 - b * b, explain: `${a * 10}² − ${b}² = ${a * a * 100} − ${b * b} = ${(a * 10) ** 2 - b * b}.` },
        { q: `A square garden has side (x + ${b}) m. Which expression gives its area?`, choices: shuffle([poly([1, 2 * b, b * b]), poly([1, 0, b * b]), poly([1, b, b * b]), poly([2, 2 * b])]), answer: poly([1, 2 * b, b * b]), explain: `(x + ${b})² = x² + 2(${b})x + ${b * b}.` },
      ]);
    },
  });
})();
