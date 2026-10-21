/* Term 3 · Lesson 2 · B. Multiplying and Dividing Integers; Order of Operations – Sign Machine */
(function () {
  "use strict";
  const { h, s, clear, randInt, pick, shuffle, tabs, segmented, stat, pill, Spring, elasticSlider, clamp } = Sim;

  const neg = (x) => (x < 0 ? "−" + Math.abs(x) : String(x));
  const par = (x) => (x < 0 ? `(${neg(x)})` : neg(x));
  const plural = (n, w) => `${n} ${w}${n === 1 ? "" : "s"}`;
  const nz = (lo, hi) => { let x = 0; while (x === 0) x = randInt(lo, hi); return x; };
  const backOut = (t) => { const c = 1.70158, u = t - 1; return t <= 0 ? 0 : t >= 1 ? 1 : 1 + (c + 1) * u * u * u + c * u * u; };

  function chip(x, y, sign, k = 1, op = 1) {
    const g = s("g", { transform: `translate(${x.toFixed(1)},${y.toFixed(1)}) scale(${Math.max(0, k).toFixed(3)})`, opacity: clamp(op, 0, 1) });
    g.append(s("circle", { r: 15, fill: sign > 0 ? "var(--shape-a)" : "var(--shape-b)", stroke: "var(--paper)", "stroke-width": 2 }),
      s("text", { y: 6, "text-anchor": "middle", style: "font-size:19px", "font-weight": 700, fill: "var(--paper)", "font-family": "var(--mono)" }, sign > 0 ? "+" : "−"));
    return g;
  }

  // ------------------------------------------------------------ tab 1: groups of chips

  function groups(root) {
    let a = 3, b = -2, p = 0;
    const svg = s("svg", { viewBox: "0 0 600 340", role: "img", "aria-label": "Groups of integer chips" });
    const eq = h("p", { class: "unit-big", "aria-live": "polite" }), say = h("p", {});
    const A = () => Math.round(a), Bv = () => Math.round(b);
    const total = () => (A() > 0 ? A() : A() < 0 ? 1 + Math.abs(A()) : 0);
    const sp = new Spring(0, (v) => { p = v; draw(); }, { stiffness: 16, damping: 8 });
    function draw() {
      clear(svg);
      const G = Math.abs(A()), n = Math.abs(Bv()), sb = Math.sign(Bv()) || 1, T = total();
      svg.append(s("rect", { x: 4, y: 4, width: 592, height: 332, rx: 14, fill: "var(--bg)", stroke: "var(--line)" }));
      const gx = (g) => 300 - (G * 136) / 2 + g * 136 + 8;
      const cpos = (g, j, top) => ({ x: gx(g) + 35 + (j % 2) * 50, y: top + 26 + Math.floor(j / 2) * 38 });
      if (A() > 0) {
        for (let g = 0; g < G; g++) {
          const tg = clamp(p - g, 0, 1);
          svg.append(s("rect", { x: gx(g), y: 36, width: 120, height: 132, rx: 12, fill: "var(--paper)", stroke: "var(--accent)", "stroke-width": 2, opacity: tg }),
            s("text", { x: gx(g) + 60, y: 28, "text-anchor": "middle", class: "svg-label", opacity: tg }, `group ${g + 1}`));
          for (let j = 0; j < n; j++) { const c = cpos(g, j, 36); svg.append(chip(c.x, c.y, sb, backOut(clamp(tg * 1.6 - j * 0.12, 0, 1)))); }
        }
        if (n === 0) svg.append(s("text", { x: 300, y: 250, "text-anchor": "middle", class: "svg-label" }, "Each group is empty: groups of 0 chips."));
        svg.append(s("text", { x: 300, y: 230, "text-anchor": "middle", class: "svg-text", style: "font-size:15px", opacity: clamp(p - T + 0.6, 0, 1) }, `${plural(G * n, (sb > 0 ? "positive" : "negative") + " chip")} in all → ${neg(A() * Bv())}`));
      } else if (A() < 0) {
        const t1 = clamp(p, 0, 1);
        svg.append(s("text", { x: 20, y: 188, class: "svg-label", opacity: t1 }, "partners (stay on the board)"));
        for (let g = 0; g < G; g++) {
          const tg = clamp(p - 1 - g, 0, 1), lift = tg * 190, fade = 1 - tg;
          svg.append(s("rect", { x: gx(g), y: 36 - lift, width: 120, height: 132, rx: 12, fill: "none", stroke: "var(--gold)", "stroke-width": 2, "stroke-dasharray": "6 4", opacity: Math.min(t1, fade) }),
            s("text", { x: gx(g) + 60, y: 28 - lift, "text-anchor": "middle", class: "svg-label", opacity: Math.min(t1, fade) }, `group of ${par(Bv())}`));
          for (let j = 0; j < n; j++) {
            const k = backOut(clamp(t1 * 1.7 - (g * n + j) * 0.03, 0, 1));
            const c = cpos(g, j, 36), d = cpos(g, j, 196);
            svg.append(chip(c.x, c.y - lift, sb, k, fade), chip(d.x, d.y, -sb, k));
          }
        }
        if (n === 0) svg.append(s("text", { x: 300, y: 180, "text-anchor": "middle", class: "svg-label" }, "Removing groups of 0 chips leaves 0."));
      } else {
        svg.append(s("text", { x: 300, y: 175, "text-anchor": "middle", class: "svg-label" }, "0 groups: the board stays empty, so the product is 0."));
      }
      const done = p > T - 0.15;
      eq.textContent = `${par(A())} × ${par(Bv())} = ${done ? neg(A() * Bv()) : "?"}`;
      if (A() > 0) say.textContent = `${A()} × ${par(Bv())} means ${plural(A(), "group")} of ${par(Bv())}: ${Array(A()).fill(par(Bv())).join(" + ")} = ${neg(A() * Bv())}.`;
      else if (A() < 0) say.textContent = `A negative multiplier means the OPPOSITE: start with ${plural(G * n, "zero pair")} (worth 0), then REMOVE ${plural(G, "group")} of ${par(Bv())}. What stays is ${neg(A() * Bv())}.`;
      else say.textContent = "Zero times any integer is 0.";
    }
    const play = () => { sp.jump(0); sp.set(total()); };
    const slider = (id, label, min, max, v, set) => elasticSlider({ id, label, min, max, value: v, step: 1, format: (x) => neg(Math.round(x)),
      onInput: (x) => { const old = [A(), Bv()]; set(x); if (old[0] !== A() || old[1] !== Bv()) sp.jump(total()); else draw(); }, onChange: () => play() }).el;
    root.append(h("div", { class: "controls" }, slider("t3l2-a", "Number of groups", -4, 4, a, (x) => { a = x; }), slider("t3l2-b", "Chips per group", -5, 5, b, (x) => { b = x; }),
      h("button", { class: "btn", type: "button", onclick: play }, "Play ▶")),
    eq, svg, say, h("p", { class: "note" }, "Try 3 × (−2), then −3 × 2, then −3 × (−2). Which ones come out negative?"));
    play();
    return () => sp.stop();
  }

  // ------------------------------------------------------------ tab 2: sign patterns

  function patterns(root) {
    let m = -2, v = 3;
    const ROWS = [3, 2, 1, 0, -1, -2, -3];
    const svg = s("svg", { viewBox: "0 0 600 330", role: "img", "aria-label": "Table of products and a number line" });
    const info = h("div", { class: "readout" }), note = h("p", {}), div = h("p", { class: "workings" });
    const Y = (val) => 165 - val * 15;
    function draw() {
      clear(svg);
      // number line of products
      svg.append(s("line", { x1: 470, y1: Y(10), x2: 470, y2: Y(-10), stroke: "var(--ink)", "stroke-width": 2 }));
      for (let k = -9; k <= 9; k++) {
        svg.append(s("line", { x1: 464, y1: Y(k), x2: 476, y2: Y(k), stroke: "var(--ink)", "stroke-width": k === 0 ? 2.5 : 1 }));
        if (k % 3 === 0) svg.append(s("text", { x: 458, y: Y(k) + 4, "text-anchor": "end", class: "svg-text", style: "font-size:11px", fill: k < 0 ? "var(--shape-b)" : k > 0 ? "var(--shape-a)" : "var(--ink)" }, neg(k)));
      }
      svg.append(s("text", { x: 470, y: 326, "text-anchor": "middle", class: "svg-label", style: "font-size:11px" }, "products"));
      ROWS.forEach((a, i) => {
        const t = clamp(v - i, 0, 1);
        if (t <= 0) return;
        const y = 36 + i * 40, prod = a * m, hl = a < 0 && m < 0;
        const g = s("g", { transform: `translate(${((1 - t) * 40).toFixed(1)},0)`, opacity: t });
        if (hl) g.append(s("rect", { x: 14, y: y - 22, width: 330, height: 32, rx: 8, fill: "var(--gold-soft)" }));
        g.append(s("text", { x: 30, y, class: "svg-text", style: "font-size:19px" }, `${par(a)} × ${par(m)} =`),
          s("text", { x: 250, y, class: "svg-text", style: "font-size:21px", "font-weight": 700, fill: prod < 0 ? "var(--shape-b)" : prod > 0 ? "var(--shape-a)" : "var(--ink)" }, neg(prod)));
        svg.append(g);
        // the product drops onto the number line, sliding from the previous product
        const prev = i > 0 ? ROWS[i - 1] * m : prod, yy = Y(prev + (prod - prev) * t);
        if (i > 0 && t > 0.05) {
          svg.append(s("path", { d: `M486,${Y(prev)} Q${510 + t * 10},${(Y(prev) + yy) / 2} 486,${yy}`, fill: "none", stroke: "var(--gold)", "stroke-width": 2 }),
            s("text", { x: 524, y: (Y(prev) + yy) / 2 + 4, class: "svg-text", style: "font-size:11px", opacity: t }, -m > 0 ? `+${-m}` : neg(-m)));
        }
        svg.append(s("circle", { cx: 470, cy: yy, r: 7, fill: prod < 0 ? "var(--shape-b)" : prod > 0 ? "var(--shape-a)" : "var(--ink)", stroke: "var(--paper)", "stroke-width": 2 }));
      });
      const shown = ROWS.slice(0, Math.max(1, Math.round(v)));
      const last = shown[shown.length - 1], lp = last * m;
      clear(info);
      info.append(stat("Rows:", String(shown.length)).el,
        last === 0 ? pill(true, "0 × any integer = 0", "") : last < 0 ? pill(m < 0, "negative × negative = positive", "negative × positive = negative") : pill(m > 0, "positive × positive = positive", "positive × negative = negative"));
      note.textContent = `Each time the first factor goes down by 1, the product changes by ${-m > 0 ? "+" + -m : neg(-m)}. Keep the pattern going past 0 and the signs of the products ${m < 0 ? "turn positive" : "turn negative"}.`;
      div.textContent = last === 0 ? `0 × ${par(m)} = 0. (Division by 0 is not defined.)`
        : `${par(last)} × ${par(m)} = ${neg(lp)}, so  ${neg(lp)} ÷ ${par(m)} = ${neg(last)}  and  ${neg(lp)} ÷ ${par(last)} = ${neg(m)}.\nDivision uses the same sign rules as multiplication.`;
    }
    root.append(h("div", { class: "controls" }, h("span", {}, "Second factor"), segmented([-3, -2, -1, 2, 3], m, (x) => { m = x; draw(); }, (x) => par(x)),
      elasticSlider({ id: "t3l2-rows", label: "Continue the pattern", min: 1, max: 7, value: v, step: 1, format: (x) => String(Math.round(x)), onInput: (x) => { v = x; draw(); } }).el),
    svg, info, note, div);
    draw();
  }

  // ------------------------------------------------------------ expression engine

  function tokenize(str) {
    const src = str.replace(/−/g, "-").replace(/\*/g, "×").replace(/\//g, "÷");
    const out = [];
    let i = 0;
    const opening = (t) => !t || t.t === "op" || t.t === "(";
    while (i < src.length) {
      const c = src[i];
      if (c === " ") { i++; continue; }
      if (/\d/.test(c) || (c === "-" && opening(out[out.length - 1]) && /\d/.test(src[i + 1]))) {
        let j = i + 1;
        while (j < src.length && /\d/.test(src[j])) j++;
        out.push({ t: "num", v: Number(src.slice(i, j)) }); i = j; continue;
      }
      if (c === "(" || c === ")") {
        out.push({ t: c }); i++;
        const n = out.length;
        if (c === ")" && n >= 3 && out[n - 2].t === "num" && out[n - 3].t === "(") out.splice(n - 3, 3, out[n - 2]);
        continue;
      }
      if ("+-×÷^".includes(c)) { out.push({ t: "op", v: c === "-" ? "−" : c }); i++; continue; }
      throw new Error("bad expression " + str);
    }
    return out;
  }

  /** The next operation by GEMDAS: innermost grouping, then exponents, then × ÷, then + − (left to right). */
  function nextOp(toks) {
    let lo = 0, hi = toks.length, inGroup = false;
    const close = toks.findIndex((t) => t.t === ")");
    if (close >= 0) { let open = close; while (toks[open].t !== "(") open--; lo = open + 1; hi = close; inGroup = true; }
    const find = (ops) => { for (let i = lo; i < hi; i++) if (toks[i].t === "op" && ops.includes(toks[i].v)) return i; return -1; };
    let i = find(["^"]), kind = "E";
    if (i < 0) { i = find(["×", "÷"]); kind = "MD"; }
    if (i < 0) { i = find(["+", "−"]); kind = "AS"; }
    return { i, kind, inGroup };
  }

  function apply(toks, i) {
    const a = toks[i - 1].v, op = toks[i].v, b = toks[i + 1].v;
    const r = op === "^" ? a ** b : op === "×" ? a * b : op === "÷" ? a / b : op === "+" ? a + b : a - b;
    let lo = i - 1, hi = i + 1;
    if (toks[lo - 1] && toks[lo - 1].t === "(" && toks[hi + 1] && toks[hi + 1].t === ")") { lo--; hi++; }
    const out = toks.slice(0, lo).concat([{ t: "num", v: r }], toks.slice(hi + 1));
    return { toks: out, lo, hi, r, a, b, op };
  }

  const SUP = { 2: "²", 3: "³", 4: "⁴" };
  function tokText(toks, i) {
    const t = toks[i];
    if (t.t !== "num") return t.t === "op" ? (t.v === "^" ? "" : t.v) : t.t;
    const prev = toks[i - 1], next = toks[i + 1];
    if (prev && prev.t === "op" && prev.v === "^") return SUP[t.v] || "^" + t.v;
    const needPar = t.v < 0 && ((prev && prev.t === "op") || (next && next.t === "op" && next.v === "^"));
    return needPar ? `(${neg(t.v)})` : neg(t.v);
  }
  function exprText(toks) {
    let out = "";
    toks.forEach((t, i) => {
      const txt = tokText(toks, i);
      if (t.t === "op" && t.v === "^") return;
      const prev = toks[i - 1];
      const tight = !prev || prev.t === "(" || t.t === ")" || (prev.t === "op" && prev.v === "^");
      out += (tight ? "" : " ") + txt;
    });
    return out;
  }

  /** Simplifies fully; returns null if any division is not exact or values get too large. */
  function evaluate(str) {
    let toks = tokenize(str), guard = 0;
    while (toks.length > 1 && guard++ < 40) {
      const nx = nextOp(toks);
      if (nx.i < 0) return null;
      const st = apply(toks, nx.i);
      if (!Number.isInteger(st.r) || Math.abs(st.r) > 200 || !Number.isFinite(st.r)) return null;
      toks = st.toks;
    }
    return toks.length === 1 && toks[0].t === "num" ? toks[0].v : null;
  }

  const L = (x) => (x < 0 ? `(-${-x})` : String(x));
  const F = (x) => (x < 0 ? `-${-x}` : String(x));
  const TEMPLATES = [
    () => `${F(nz(-9, 9))} + ${L(nz(-6, 6))} * ${L(nz(-6, 6))}`,
    () => `(${F(nz(-9, 9))} - ${L(nz(-9, 9))}) * ${L(nz(-5, 5))}`,
    () => { const d = nz(-6, 6), c = nz(-6, 6) * d; return `${F(nz(-5, 5))} * ${L(nz(-6, 6))} - ${L(c)} / ${L(d)}`; },
    () => `(${F(nz(-5, 5))} + ${L(nz(-5, 5))})^2 - ${L(nz(-9, 9))}`,
    () => `${F(nz(-9, 9))} - ${L(nz(-5, 5))} * (${F(nz(-6, 6))} + ${L(nz(-6, 6))})`,
    () => { const q = nz(-4, 4), p = q * nz(-6, 6); return `${F(p)} / ${L(q)} * ${L(nz(-4, 4))}`; },
    () => `${L(nz(-4, 4))}^2 + ${L(nz(-6, 6))} * ${L(nz(-5, 5))}`,
  ];
  function randomExpr() {
    for (let k = 0; k < 50; k++) { const e = pick(TEMPLATES)(); if (evaluate(e) !== null) return e; }
    return "6 + 4 * (-3)";
  }
  const PRESETS = ["6 + 4 * (-3)", "(-8 + 2) * 3 - 5", "20 / (-4) + 3 * (-2)", "(-2)^3 + 18 / (-3)^2", "-5 - 3 * (4 - 9)", "48 / (-6) / 2 * (-3)"];
  const REASON = {
    G: "Grouping first: work inside the parentheses.",
    E: "Exponents come before ×, ÷, +, and −.",
    MD: "Multiply or divide, from left to right, before adding or subtracting.",
    AS: "Add or subtract, from left to right.",
  };
  const why = (nx) => (nx.inGroup ? REASON.G + " " : "") + REASON[nx.kind];

  // ------------------------------------------------------------ tab 3: GEMDAS stepper

  function stepper(root) {
    let toks = [], busy = false, hide = false, tries = 0, right = 0;
    const springs = new Set();
    const style = h("style", {}, `
      .gm-expr{display:flex;flex-wrap:wrap;gap:6px 0;align-items:baseline;justify-content:center;font-family:var(--mono);font-size:clamp(1.15rem,4.6vw,1.7rem);padding:16px 8px;min-height:3.4em;background:var(--bg);border:1px solid var(--line);border-radius:10px}
      .gm-tok{display:inline-block;padding:2px 5px;border-radius:7px;transform-origin:50% 60%;white-space:nowrap}
      .gm-op{cursor:pointer;border:0;background:none;font:inherit;color:inherit;padding:2px 9px;border-radius:7px}
      .gm-op:hover{background:var(--accent-soft)}
      .gm-next{background:var(--gold-soft);box-shadow:inset 0 0 0 2px var(--gold)}
      .gm-sup{font-size:.62em;align-self:flex-start;padding-left:0;cursor:pointer}
      .gm-letters{display:flex;gap:6px;justify-content:center;flex-wrap:wrap}
      .gm-letter{min-width:4.4em;padding:4px 6px;display:grid;place-items:center;text-align:center;line-height:1.1;border-radius:8px;border:1px solid var(--line);font-family:var(--display);font-weight:800;background:var(--paper);transition:background .2s}
      .gm-letter.on{background:var(--accent);color:var(--accent-ink);border-color:var(--accent)}
      .gm-letter small{display:block;font-size:.55em;font-weight:500}`);
    const row = h("div", { class: "gm-expr", "aria-live": "polite" });
    const LET = [["G", "groups"], ["E", "exponents"], ["M", "multiply"], ["D", "divide"], ["A", "add"], ["S", "subtract"]];
    const letters = LET.map(([L1, w]) => h("span", { class: "gm-letter" }, h("span", {}, L1, h("small", {}, w))));
    const fb = h("p", { class: "feedback", "aria-live": "polite" });
    const hist = h("pre", { class: "workings" });
    const score = stat("Predictions:", "0 of 0");
    const stepB = h("button", { class: "btn", type: "button", onclick: () => step() }, "Step ▶");
    let spans = [];

    function spring(v, fn, opt) { const sp = new Spring(v, (x) => { fn(x, sp); }, opt); springs.add(sp); return sp; }

    function build() {
      clear(row);
      spans = toks.map((t, i) => {
        const txt = tokText(toks, i);
        let el;
        if (t.t === "op" && t.v !== "^") el = h("button", { type: "button", class: "gm-tok gm-op", "aria-label": `operation ${t.v}`, onclick: () => predict(i) }, txt);
        else el = h("span", { class: "gm-tok" }, txt);
        if (t.t === "op" && t.v === "^") el.style.display = "none";
        const prev = toks[i - 1];
        if (t.t === "num" && prev && prev.t === "op" && prev.v === "^") { el.classList.add("gm-sup"); el.addEventListener("click", () => predict(i - 1)); }
        row.append(el);
        return el;
      });
      mark();
    }
    function mark() {
      spans.forEach((sp) => sp.classList.remove("gm-next"));
      const nx = toks.length > 1 ? nextOp(toks) : null;
      letters.forEach((l, k) => l.classList.toggle("on", !!nx && ((k === 0 && nx.inGroup) || (k === 1 && nx.kind === "E" && !nx.inGroup) ||
        (nx.kind === "MD" && !nx.inGroup && ((k === 2 && toks[nx.i].v === "×") || (k === 3 && toks[nx.i].v === "÷"))) ||
        (nx.kind === "AS" && !nx.inGroup && ((k === 4 && toks[nx.i].v === "+") || (k === 5 && toks[nx.i].v === "−"))))));
      if (nx && !hide) [nx.i - 1, nx.i, nx.i + 1].forEach((k) => spans[k] && spans[k].classList.add("gm-next"));
      stepB.disabled = !nx;
      if (!nx && toks.length === 1) { fb.className = "feedback ok"; fb.textContent = `Fully simplified: the value is ${neg(toks[0].v)}.`; }
    }
    function load(str) {
      springs.forEach((sp) => sp.stop()); springs.clear();
      busy = false;
      toks = tokenize(str);
      hist.textContent = "  " + exprText(toks);
      fb.className = "feedback"; fb.textContent = hide ? "Predict: tap the operation that comes next." : "Press Step, or tap the operation you think comes next.";
      build();
    }
    function step() {
      if (busy || toks.length < 2) return;
      const nx = nextOp(toks);
      if (nx.i < 0) return;
      busy = true;
      const st = apply(toks, nx.i);
      const group = [];
      for (let k = st.lo; k <= st.hi; k++) group.push(spans[k]);
      group.forEach((el) => el.classList.add("gm-next"));
      const squash = spring(0, (v, sp) => {
        group.forEach((el) => { el.style.transform = `scale(${(1 - 0.55 * v).toFixed(3)})`; el.style.opacity = String(clamp(1 - v, 0, 1)); });
        if (!sp.raf && v >= 0.999) { springs.delete(sp); finish(st, nx); }
      }, { stiffness: 260, damping: 32 });
      squash.set(1);
    }
    function finish(st, nx) {
      const before = spans.map((el) => el.getBoundingClientRect());
      const oldIdx = (j) => (j < st.lo ? j : j + (st.hi - st.lo));
      toks = st.toks;
      build();
      const ri = st.lo;
      const moves = spans.map((el, j) => {
        if (j === ri) return null;
        const b0 = before[oldIdx(j)], b1 = el.getBoundingClientRect();
        return b0 ? { el, dx: b0.left - b1.left, dy: b0.top - b1.top } : null;
      }).filter(Boolean);
      const resEl = spans[ri];
      const paintPop = (v) => {
        resEl.style.transform = `scale(${Math.max(0, v).toFixed(3)})`;
        moves.forEach((m) => { m.el.style.transform = `translate(${(m.dx * (1 - v)).toFixed(1)}px,${(m.dy * (1 - v)).toFixed(1)}px)`; });
      };
      paintPop(0);
      const pop = spring(0, (v, sp) => { paintPop(v); if (!sp.raf) { springs.delete(sp); busy = false; } }, { stiffness: 230, damping: 15 });
      pop.set(1);
      const opText = st.op === "^" ? `${par(st.a)}${SUP[st.b] || "^" + st.b}` : `${par(st.a)} ${st.op} ${par(st.b)}`;
      hist.textContent += `\n= ${exprText(toks)}`.padEnd(28) + `  ← ${nx.inGroup ? "G" : nx.kind === "E" ? "E" : nx.kind}: ${opText} = ${neg(st.r)}`;
      if (toks.length > 1) { fb.className = "feedback"; fb.textContent = hide ? "Predict again: which operation is next?" : "Next one is highlighted."; }
    }
    function predict(i) {
      if (busy || toks.length < 2) return;
      const nx = nextOp(toks);
      tries++;
      if (i === nx.i) { right++; fb.className = "feedback ok"; fb.textContent = "Yes! " + why(nx); score.set(`${right} of ${tries}`); step(); return; }
      score.set(`${right} of ${tries}`);
      fb.className = "feedback bad"; fb.textContent = "Not yet. " + why(nx) + " (The next operation is now highlighted.)";
      [nx.i - 1, nx.i, nx.i + 1].forEach((k) => spans[k] && spans[k].classList.add("gm-next"));
      const el = spans[i];
      const shake = spring(0, (v, sp) => { el.style.transform = `translateX(${v.toFixed(1)}px)`; if (!sp.raf) springs.delete(sp); }, { stiffness: 500, damping: 9 });
      shake.vel = 320; shake.set(0);
    }
    const sel = h("select", { id: "t3l2-expr" }, PRESETS.map((p, i) => h("option", { value: i }, exprText(tokenize(p)))));
    sel.addEventListener("change", () => load(PRESETS[Number(sel.value)]));
    const hideBox = h("input", { type: "checkbox", id: "t3l2-hide", onchange: (e) => { hide = e.target.checked; mark(); fb.className = "feedback"; fb.textContent = hide ? "Predict: tap the operation that comes next." : ""; } });
    root.append(style,
      h("div", { class: "controls" }, h("label", { for: "t3l2-expr" }, "Expression", sel),
        h("button", { class: "btn ghost", type: "button", onclick: () => load(randomExpr()) }, "New expression"),
        h("label", {}, hideBox, "Hide the hint (predict first)")),
      h("div", { class: "gm-letters", "aria-hidden": "true" }, letters), row,
      h("div", { class: "controls" }, stepB, h("button", { class: "btn ghost", type: "button", onclick: () => load(PRESETS[Number(sel.value)]) }, "Restart ↺"), score.el),
      fb, hist,
      h("p", { class: "note" }, "GEMDAS: Groupings, Exponents, Multiplication and Division (left to right), Addition and Subtraction (left to right)."));
    load(PRESETS[0]);
    return () => { springs.forEach((sp) => sp.stop()); springs.clear(); };
  }

  // ------------------------------------------------------------ lesson

  const PROPS = [
    ["−3 × 5 = 5 × (−3)", "Commutative"], ["(−2 + 4) + 6 = −2 + (4 + 6)", "Associative"], ["−4 × (3 + 5) = −4 × 3 + (−4) × 5", "Distributive"],
    ["−9 × 1 = −9", "Identity"], ["−7 + 7 = 0", "Inverse"], ["−12 + 0 = −12", "Identity"], ["(2 × (−3)) × 5 = 2 × ((−3) × 5)", "Associative"], ["8 + (−6) = −6 + 8", "Commutative"],
  ];

  Sim.register({
    id: "lesson20", unit: "H", num: 2, letter: "B", title: "Multiplying and Dividing Integers; Order of Operations", simName: "Sign Machine",
    comps: ["A2", "A3", "M2"], cycles: "C2,M2 – C3,M2", deped: "DepEd Week 2",
    bigQuestion: "If you owe ₱50 and then earn ₱80, how much do you really have?",
    mission: [
      "Groups of Chips: build 3 × (−2), then −3 × 2, then −3 × (−2). Which products are negative?",
      "Sign Patterns: start with 3 × (−2) and continue the pattern down to −3 × (−2). What happens to the products?",
      "Use the pattern to explain why a negative times a negative is positive.",
      "GEMDAS Stepper: hide the hint and predict every step of three expressions.",
    ],
    discovery: "Multiplication is repeated addition: 3 × (−2) is 3 groups of −2, or −6. A negative multiplier means the opposite – removing groups – so −3 × (−2) = 6. The pattern 3 × (−2) = −6, 2 × (−2) = −4, 1 × (−2) = −2, 0 × (−2) = 0 goes up by 2 each time, so it must continue −1 × (−2) = 2. Same signs give a positive product or quotient; different signs give a negative one. To simplify, follow GEMDAS: groupings, exponents, multiplication and division from left to right, then addition and subtraction from left to right.",
    mount(stage) {
      const body = h("div", { class: "stage-body" });
      const views = [groups, patterns, stepper];
      let stopper = null;
      const t = tabs(["Groups of Chips", "Sign Patterns", "GEMDAS Stepper"], (i) => { if (stopper) stopper(); clear(body); stopper = views[i](body) || null; });
      stage.append(t.el, body);
      stopper = groups(body);
      return () => { if (stopper) stopper(); };
    },
    check() {
      const k = randInt(0, 6);
      if (k === 0) { const a = nz(-12, 12), b = nz(-9, 9); return { q: `Multiply: ${par(a)} × ${par(b)}`, answer: a * b, explain: `${a * b < 0 ? "Different signs → negative" : "Same signs → positive"}: ${neg(a * b)}.` }; }
      if (k === 1) { const b = nz(-9, 9), q = nz(-12, 12), a = b * q; return { q: `Divide: ${neg(a)} ÷ ${par(b)}`, answer: q, explain: `${par(b)} × ${par(q)} = ${neg(a)}, so the quotient is ${neg(q)}.` }; }
      if (k === 2) { const e = randomExpr(), v = evaluate(e); return { q: `Simplify using GEMDAS: ${exprText(tokenize(e))}`, answer: v, explain: `The value is ${neg(v)}.` }; }
      if (k === 3) { const [e, p] = pick(PROPS); return { q: `Which property is shown? ${e}`, choices: ["Commutative", "Associative", "Distributive", "Identity", "Inverse"], answer: p, explain: `${e} shows the ${p.toLowerCase()} property.` }; }
      if (k === 4) { const m = nz(-5, -2); return { q: `Continue the pattern: 2 × ${par(m)} = ${neg(2 * m)}, 1 × ${par(m)} = ${neg(m)}, 0 × ${par(m)} = 0, (−1) × ${par(m)} = ?`, answer: -m, explain: `Each step the product goes up by ${-m}: 0 + ${-m} = ${-m}.` }; }
      if (k === 5) { const n = randInt(2, 4), base = nz(-3, -2); return { q: `Evaluate ${par(base)}${SUP[n]}.`, answer: base ** n, explain: `${Array(n).fill(par(base)).join(" × ")} = ${neg(base ** n)}.` }; }
      return pick([
        { q: "The product of two negative integers is…", choices: ["positive", "negative", "zero", "it depends"], answer: "positive", explain: "Same signs give a positive product." },
        { q: "The quotient of a positive and a negative integer is…", choices: ["positive", "negative", "zero", "it depends"], answer: "negative", explain: "Different signs give a negative quotient." },
        { q: "In 12 − 6 ÷ (−3), which operation is done first?", choices: ["subtraction", "division"], answer: "division", explain: "Division comes before subtraction: 12 − (−2) = 14." },
        { q: "The product (−1) × (−1) × (−1) is…", choices: ["1", "−1", "3", "−3"], answer: "−1", explain: "An odd number of negative factors gives a negative product." },
      ]);
    },
  });
})();
