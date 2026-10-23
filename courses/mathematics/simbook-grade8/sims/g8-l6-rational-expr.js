/* Grade 8 · Term 1 · Lesson 6 · F. Rational Algebraic Expressions – Fraction Machine */
(function () {
  "use strict";
  const { h, s, clear, randInt, pick, shuffle, fmt, tabs, segmented, stat, pill, Spring, elasticSlider, clamp, rubber } = Sim;

  // ------------------------------------------------------------ algebra text

  const SUP = ["", "", "²", "³", "⁴"];
  const neg = (n) => (n < 0 ? "−" + Math.abs(n) : String(n));
  const dec = (v) => fmt(v, 2).replace("-", "−");
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
  const pval = (cs, x) => cs.reduce((acc, c) => acc * x + c, 0);
  /** A linear factor [m, c] means mx + c; [0, c] is the number c. */
  const ftext = ([m, c]) => (m === 0 ? neg(c) : c === 0 ? poly([m, 0]) : `(${poly([m, c])})`);
  const fval = ([m, c], x) => m * x + c;
  const expand = (fs) => fs.reduce((acc, f) => pmul(acc, f), [1]);
  const prodText = (fs) => (fs.length ? fs.map(ftext).join("") : "1");
  const fracText = (nf, df) => (df.length ? `${prodText(nf)}/${df.length > 1 ? `[${prodText(df)}]` : prodText(df)}` : prodText(nf));
  function choiceSet(answer, others) {
    const out = [answer];
    for (const o of others) if (o && !out.includes(o) && out.length < 4) out.push(o);
    return shuffle(out);
  }
  const xList = (vals) => [...vals].sort((a, b) => a - b).map((v) => `x ≠ ${neg(v)}`).join(", ");

  // ------------------------------------------------------------ chip scene (persistent, spring-animated tokens)

  const FS = 17, CH = FS * 0.6, GAP = 4;
  const chipW = (sp) => (sp.bar ? sp.w : sp.text.length * CH + (sp.box === false ? 6 : 18));
  const TONES = { a: ["var(--shape-a)", "var(--shape-a-soft)"], b: ["var(--shape-b)", "var(--shape-b-soft)"], g: ["var(--accent)", "var(--accent-soft)"], glow: ["var(--gold)", "var(--gold-soft)"] };

  function Scene(layer) {
    const items = new Map(), timers = [];
    function paint(it, [x, y, k, o, w]) {
      it.g.setAttribute("transform", `translate(${x.toFixed(1)},${y.toFixed(1)}) scale(${Math.max(0, k).toFixed(3)})`);
      it.g.setAttribute("opacity", clamp(o, 0, 1).toFixed(3));
      if (it.spec.bar) { it.line.setAttribute("x1", (-w / 2).toFixed(1)); it.line.setAttribute("x2", (w / 2).toFixed(1)); }
      else { it.rect.setAttribute("x", (-w / 2).toFixed(1)); it.rect.setAttribute("width", Math.max(0, w).toFixed(1)); }
    }
    function style(it) {
      const sp = it.spec, tone = TONES[sp.glow ? "glow" : sp.tone || "a"];
      it.text.textContent = sp.bar ? "" : sp.text;
      it.line.setAttribute("display", sp.bar ? "inline" : "none");
      it.rect.setAttribute("display", !sp.bar && sp.box !== false ? "inline" : "none");
      it.rect.setAttribute("stroke", tone[0]); it.rect.setAttribute("fill", tone[1]); it.rect.setAttribute("stroke-width", sp.glow ? 3 : 1.5);
      it.text.setAttribute("fill", sp.color || "var(--ink)");
    }
    function make(id) {
      const g = s("g");
      const rect = s("rect", { y: -16, height: 32, rx: 8 });
      const line = s("line", { y1: 0, y2: 0, stroke: "var(--ink)", "stroke-width": 2.5, "stroke-linecap": "round" });
      const text = s("text", { y: 6, "text-anchor": "middle", class: "svg-text", "font-size": FS, "font-weight": 600 });
      g.append(rect, line, text); layer.append(g);
      const it = { g, rect, line, text, spec: { text: "" }, dead: false };
      it.sp = new Spring([0, 0, 0, 0, 0], (v) => paint(it, v), { stiffness: 190, damping: 15 });
      items.set(id, it);
      return it;
    }
    function pop(it) {
      it.dead = true;
      it.spec = { ...it.spec, glow: true }; style(it);
      const [x, y, , , w] = it.sp.value;
      it.sp.set([x, y - 4, 1.4, 1, w]);
      timers.push(setTimeout(() => it.sp.set([x, y - 10, 0, 0, w]), Sim.reducedMotion() ? 0 : 170));
    }
    return {
      set(specs) {
        const seen = new Set();
        for (const sp of specs) {
          seen.add(sp.id);
          let it = items.get(sp.id);
          if (sp.pop) { if (it && !it.dead) pop(it); continue; }
          const w = chipW(sp);
          const fresh = !it || it.dead;
          if (!it) it = make(sp.id);
          it.spec = sp; it.dead = false; style(it);
          if (fresh) {
            const f = sp.from && items.get(sp.from);
            it.sp.jump(f ? [f.sp.value[0], f.sp.value[1], 1, 1, w] : [sp.x, sp.y + 10, 0.5, 0, w]);
          }
          it.sp.set([sp.x, sp.y, 1, 1, w]);
          if (sp.pulse) { it.sp.value[2] = 1.3; }
        }
        for (const [id, it] of items) if (!seen.has(id) && !it.dead) {
          it.dead = true; const [x, y, , , w] = it.sp.value; it.sp.set([x, y, 0.6, 0, w]);
        }
      },
      reset() { timers.splice(0).forEach(clearTimeout); items.forEach((it) => it.sp.stop()); items.clear(); clear(layer); },
      stop() { timers.splice(0).forEach(clearTimeout); items.forEach((it) => it.sp.stop()); },
    };
  }

  /** Lays out a fraction (or a plain row when there is no denominator) centred at cx. */
  function fracLayout(fr, cx, y) {
    const rowW = (list) => list.reduce((a, c) => a + chipW(c) + GAP, -GAP);
    const place = (list, yy, out) => { let x = cx - rowW(list) / 2; for (const c of list) { const w = chipW(c); out.push({ ...c, x: x + w / 2, y: yy }); x += w + GAP; } };
    const out = [];
    if (!fr.dens || !fr.dens.length) { place(fr.nums, y, out); return { specs: out, w: rowW(fr.nums) }; }
    const bw = Math.max(rowW(fr.nums), rowW(fr.dens), 30) + 14;
    place(fr.nums, y - 24, out); place(fr.dens, y + 26, out);
    out.push({ id: fr.bar, bar: true, w: bw, x: cx, y: y + 1 });
    return { specs: out, w: bw };
  }
  /** A row of fractions and operator tokens, centred at cx. */
  function rowLayout(parts, y, cx) {
    const sized = parts.map((p) => (p.nums ? { p, w: fracLayout(p, 0, 0).w } : { p, w: chipW(p) }));
    const total = sized.reduce((a, q) => a + q.w + 10, -10);
    let x = cx - total / 2;
    const out = [];
    for (const q of sized) {
      if (q.p.nums) out.push(...fracLayout(q.p, x + q.w / 2, y).specs);
      else out.push({ ...q.p, x: x + q.w / 2, y });
      x += q.w + 10;
    }
    return out;
  }
  const C = (id, text, o = {}) => ({ id, text, ...o });
  const OP = (id, text, o = {}) => ({ id, text, box: false, ...o });
  const F = (bar, nums, dens) => ({ bar, nums, dens });

  // ------------------------------------------------------------ simplify

  const BANK = [
    { nf: [[1, -3], [1, 3]], df: [[1, 2], [1, 3]] },
    { nf: [[1, 0], [1, 4]], df: [[1, 4], [1, -4]] },
    { nf: [[0, 2], [1, 3]], df: [[1, 3], [1, -1]] },
    { nf: [[1, -2], [1, -2]], df: [[1, -2], [1, 2]] },
    { nf: [[1, -3], [1, 2]], df: [[1, 0], [1, -3]] },
  ];
  const same = (a, b) => a[0] === b[0] && a[1] === b[1];
  const root = ([m, c]) => -c / m;
  function analyse(ex) {
    const usedD = new Set(), pairs = [];
    ex.nf.forEach((f, i) => { const j = ex.df.findIndex((g, k) => !usedD.has(k) && same(f, g)); if (j >= 0) { usedD.add(j); pairs.push([i, j]); } });
    const restN = ex.nf.filter((_, i) => !pairs.some(([a]) => a === i)), restD = ex.df.filter((_, j) => !usedD.has(j));
    const excl = [...new Set(ex.df.filter((f) => f[0]).map(root))];
    return { pairs, restN, restD, excl, num: poly(expand(ex.nf)), den: poly(expand(ex.df)) };
  }

  function simplify(root_) {
    let idx = 0, step = 0, x = 1;
    const svg = s("svg", { viewBox: "0 0 600 130", role: "img", "aria-label": "A rational expression being factored and simplified" });
    const layer = s("g"); svg.append(layer);
    const scene = Scene(layer);
    const cap = h("p", { class: "note", "aria-live": "polite" });
    const graph = s("svg", { viewBox: "0 0 600 240", role: "img", "aria-label": "Graph of the simplified expression with its excluded values" });
    const glayer = s("g"); graph.append(glayer);
    const vals = h("div", { class: "stage-body", "aria-live": "polite" });
    const btn = h("button", { class: "btn", type: "button", onclick: () => { if (step < 3) { step++; show(); } } }, "Factor ▶");

    function specsFor(st) {
      const ex = BANK[idx], an = analyse(ex);
      const nIds = ex.nf.map((_, i) => `n${i}`), dIds = ex.df.map((_, j) => `d${j}`);
      const cancelN = new Set(an.pairs.map(([i]) => i)), cancelD = new Set(an.pairs.map(([, j]) => j));
      if (st === 0) return rowLayout([F("bar", [C("N", an.num)], [C("D", an.den, { tone: "b" })])], 64, 300);
      const glow = st >= 2;
      if (st <= 2) return rowLayout([F("bar", ex.nf.map((f, i) => C(nIds[i], ftext(f), { glow: glow && cancelN.has(i), from: "N" })), ex.df.map((f, j) => C(dIds[j], ftext(f), { tone: "b", glow: glow && cancelD.has(j), from: "D" })))], 64, 300);
      const keepN = ex.nf.map((f, i) => [f, i]).filter(([, i]) => !cancelN.has(i)), keepD = ex.df.map((f, j) => [f, j]).filter(([, j]) => !cancelD.has(j));
      const nums = keepN.length ? keepN.map(([f, i]) => C(nIds[i], ftext(f))) : [C("one", "1")];
      return [...rowLayout([F("bar", nums, keepD.map(([f, j]) => C(dIds[j], ftext(f), { tone: "b" })))], 64, 300),
        ...[...cancelN].map((i) => ({ id: nIds[i], pop: true })), ...[...cancelD].map((j) => ({ id: dIds[j], pop: true }))];
    }
    function show() {
      const ex = BANK[idx], an = analyse(ex);
      scene.set(specsFor(step));
      btn.textContent = ["Factor ▶", "Find common factors ▶", "Cancel them ▶", "Simplified ✓"][step];
      btn.disabled = step >= 3;
      cap.textContent = [
        "Start with the rational expression. To simplify, first factor the numerator and the denominator.",
        `Factored: ${prodText(ex.nf)} over ${prodText(ex.df)}.`,
        `Common factor${an.pairs.length > 1 ? "s" : ""}: ${an.pairs.map(([i]) => ftext(ex.nf[i])).join(", ")} – a factor divided by itself is 1.`,
        `Simplified: ${fracText(an.restN, an.restD)}, with ${xList(an.excl)}. The excluded values come from the ORIGINAL denominator.`,
      ][step];
      values();
    }
    function values() {
      const ex = BANK[idx], an = analyse(ex);
      const N = expand(ex.nf), D = expand(ex.df), RN = expand(an.restN), RD = expand(an.restD);
      const dv = pval(D, x), rdv = pval(RD, x);
      const origUndef = Math.abs(dv) < 1e-9, simpUndef = Math.abs(rdv) < 1e-9;
      clear(vals);
      const row = (label, expr, num, den, undef) => h("p", { class: "unit-big", style: "font-size:1.05rem" },
        h("span", {}, `${label} `), h("b", {}, expr), "  →  ",
        undef ? h("span", { class: "pill no", style: "font-size:1rem" }, `${dec(num)}/${dec(den)} → undefined`) : `${dec(num)}/${dec(den)} = ${dec(num / den)}`);
      vals.append(row("Original:", `(${an.num})/(${an.den})`, pval(N, x), dv, origUndef), row("Simplified:", fracText(an.restN, an.restD), pval(RN, x), rdv, simpUndef));
      const hit = an.excl.find((e) => Math.abs(e - x) < 1e-9);
      vals.append(h("p", { class: "note" }, hit === undefined
        ? `At x = ${dec(x)} both give the same value. Try an excluded value: ${an.excl.map(neg).join(" or ")}.`
        : origUndef && !simpUndef
          ? `At x = ${neg(hit)} the original denominator is 0, so the original expression is UNDEFINED – even though the simplified form gives ${dec(pval(RN, x) / rdv)}. That is why we write ${xList(an.excl)}.`
          : `At x = ${neg(hit)} both denominators are 0: neither expression has a value.`));
      drawGraph(an, RN, RD);
    }
    function drawGraph(an, RN, RD) {
      clear(glayer);
      const X0 = 40, X1 = 560, Y0 = 220, Y1 = 14;
      const px = (v) => X0 + ((v + 6.5) / 13) * (X1 - X0), py = (v) => Y0 - ((v + 8) / 16) * (Y0 - Y1);
      for (let k = -6; k <= 6; k++) glayer.append(s("line", { x1: px(k), y1: Y1, x2: px(k), y2: Y0, stroke: "var(--grid)" }), s("text", { x: px(k), y: py(0) + 15, "text-anchor": "middle", class: "svg-text", "font-size": 10, fill: "var(--muted)" }, k ? neg(k) : ""));
      glayer.append(s("line", { x1: X0, y1: py(0), x2: X1, y2: py(0), stroke: "var(--ink)", "stroke-width": 1.5 }), s("line", { x1: px(0), y1: Y1, x2: px(0), y2: Y0, stroke: "var(--ink)", "stroke-width": 1.5 }));
      const g = (v) => pval(RN, v) / pval(RD, v);
      let d = "", pen = false;
      for (let v = -6.5; v <= 6.5; v += 0.02) {
        const y = g(v);
        if (!Number.isFinite(y) || Math.abs(y) > 9) { pen = false; continue; }
        d += `${pen ? "L" : "M"}${px(v).toFixed(1)},${py(y).toFixed(1)}`; pen = true;
      }
      glayer.append(s("path", { d, fill: "none", stroke: "var(--shape-a)", "stroke-width": 2.5 }));
      an.excl.forEach((e) => {
        const ge = g(e);
        if (Number.isFinite(ge) && Math.abs(ge) < 9) glayer.append(s("circle", { cx: px(e), cy: py(ge), r: 6, fill: "var(--paper)", stroke: "var(--bad)", "stroke-width": 2.5 }));
        else glayer.append(s("line", { x1: px(e), y1: Y1, x2: px(e), y2: Y0, stroke: "var(--bad)", "stroke-width": 1.5, "stroke-dasharray": "5 4" }));
        glayer.append(s("text", { x: px(e) + 4, y: Y1 + 10, class: "svg-text", "font-size": 11, fill: "var(--bad)" }, `x ≠ ${neg(e)}`));
      });
      const y = g(x), undef = an.excl.some((e) => Math.abs(e - x) < 1e-9);
      if (!undef && Number.isFinite(y) && Math.abs(y) < 9) glayer.append(s("circle", { cx: px(x), cy: py(y), r: 7, fill: "var(--shape-a)", stroke: "var(--paper)", "stroke-width": 2 }));
      if (undef) glayer.append(s("text", { x: clamp(px(x), 70, 530), y: Y0 - 6, "text-anchor": "middle", class: "svg-text", "font-size": 14, "font-weight": 700, fill: "var(--bad)" }, "undefined here"));
    }
    const sel = h("select", { id: "g8l6-ex" }, BANK.map((ex, i) => { const an = analyse(ex); return h("option", { value: i }, `(${an.num})/(${an.den})`); }));
    sel.addEventListener("change", () => { idx = Number(sel.value); step = 0; scene.reset(); show(); });
    root_.append(h("div", { class: "controls" }, h("label", { for: "g8l6-ex" }, "Expression", sel)),
      svg, h("div", { class: "controls" }, btn, h("button", { class: "btn ghost", type: "button", onclick: () => { step = 0; show(); } }, "Start over")), cap,
      h("div", { class: "controls" }, elasticSlider({ id: "g8l6-x", label: "x", min: -6, max: 6, value: x, step: 1, format: (v) => dec(v), onInput: (v) => { x = v; if (Math.abs(x - Math.round(x)) < 1e-6) x = Math.round(x); values(); } }).el),
      vals, graph, h("p", { class: "note" }, "Blue curve: the simplified expression. Red open circle: a hole where the original expression is undefined. Red dashed line: both are undefined there."));
    show();
    return () => scene.stop();
  }

  // ------------------------------------------------------------ operate

  const OPS = {
    "×": { title: "(x² − 9)/(x² + 2x) × (x + 2)/(x − 3)", steps: [
      { cap: "Multiply. Before multiplying, factor everything you can.", rows: [F("b1", [C("a", "x² − 9")], [C("b", "x² + 2x", { tone: "b" })]), OP("op", "×"), F("b2", [C("c", "x + 2")], [C("d", "x − 3", { tone: "b" })])] },
      { cap: "Factor: x² − 9 = (x + 3)(x − 3) and x² + 2x = x(x + 2).", rows: [F("b1", [C("n1", "(x + 3)", { from: "a" }), C("n2", "(x − 3)", { from: "a" })], [C("d1", "x", { tone: "b", from: "b" }), C("d2", "(x + 2)", { tone: "b", from: "b" })]), OP("op", "×"), F("b2", [C("n3", "(x + 2)", { from: "c" })], [C("d3", "(x − 3)", { tone: "b", from: "d" })])] },
      { cap: "Write one fraction: numerators times numerators, denominators times denominators.", rows: [F("b1", [C("n1", "(x + 3)"), C("n2", "(x − 3)"), C("n3", "(x + 2)")], [C("d1", "x", { tone: "b" }), C("d2", "(x + 2)", { tone: "b" }), C("d3", "(x − 3)", { tone: "b" })])] },
      { cap: "Find the common factors of the numerator and the denominator.", rows: [F("b1", [C("n1", "(x + 3)"), C("n2", "(x − 3)", { glow: true }), C("n3", "(x + 2)", { glow: true })], [C("d1", "x", { tone: "b" }), C("d2", "(x + 2)", { tone: "b", glow: true }), C("d3", "(x − 3)", { tone: "b", glow: true })])] },
      { cap: "Cancel them. Answer: (x + 3)/x, with x ≠ 0, −2, 3 (all values that make any denominator 0).", rows: [F("b1", [C("n1", "(x + 3)")], [C("d1", "x", { tone: "b" })])], pops: ["n2", "n3", "d2", "d3"] },
    ] },
    "÷": { title: "(x² − 1)/(x + 3) ÷ (x − 1)/(x² + 6x + 9)", steps: [
      { cap: "Divide. Dividing by a fraction is the same as multiplying by its reciprocal.", rows: [F("b1", [C("a", "x² − 1")], [C("b", "x + 3", { tone: "b" })]), OP("op", "÷"), F("b2", [C("c", "x − 1")], [C("d", "x² + 6x + 9", { tone: "b" })])] },
      { cap: "Keep the first fraction, change ÷ to ×, and FLIP the divisor: its numerator and denominator trade places.", rows: [F("b1", [C("a", "x² − 1")], [C("b", "x + 3", { tone: "b" })]), OP("op", "×", { pulse: true, color: "var(--accent)" }), F("b2", [C("d", "x² + 6x + 9")], [C("c", "x − 1", { tone: "b" })])] },
      { cap: "Factor: x² − 1 = (x + 1)(x − 1) and x² + 6x + 9 = (x + 3)².", rows: [F("b1", [C("n1", "(x + 1)", { from: "a" }), C("n2", "(x − 1)", { from: "a" })], [C("d1", "(x + 3)", { tone: "b", from: "b" })]), OP("op", "×"), F("b2", [C("n3", "(x + 3)", { from: "d" }), C("n4", "(x + 3)", { from: "d" })], [C("d2", "(x − 1)", { tone: "b", from: "c" })])] },
      { cap: "One fraction. Common factors: (x − 1) and one (x + 3).", rows: [F("b1", [C("n1", "(x + 1)"), C("n2", "(x − 1)", { glow: true }), C("n3", "(x + 3)", { glow: true }), C("n4", "(x + 3)")], [C("d1", "(x + 3)", { tone: "b", glow: true }), C("d2", "(x − 1)", { tone: "b", glow: true })])] },
      { cap: "Cancel. Answer: (x + 1)(x + 3) = x² + 4x + 3, with x ≠ −3 and x ≠ 1 (x = 1 would make us divide by 0).", rows: [F("b1", [C("n1", "(x + 1)"), C("n4", "(x + 3)")], [])], pops: ["n2", "n3", "d1", "d2"] },
    ] },
    "+": { title: "3/x + 2/(x + 1)", steps: [
      { cap: "Add. The denominators are different, so we need the least common denominator (LCD).", rows: [F("b1", [C("a", "3")], [C("b", "x", { tone: "b" })]), OP("op", "+"), F("b2", [C("c", "2")], [C("d", "(x + 1)", { tone: "b" })])] },
      { cap: "LCD = the product of all the different factors of the denominators: x(x + 1).", rows: [F("b1", [C("a", "3")], [C("b", "x", { tone: "b" })]), OP("op", "+"), F("b2", [C("c", "2")], [C("d", "(x + 1)", { tone: "b" })])],
        lcd: [OP("lt", "LCD ="), C("l1", "x", { tone: "g" }), C("l2", "(x + 1)", { tone: "g" })] },
      { cap: "Each fraction gets the factor it is missing – on top AND bottom (that is multiplying by 1).", rows: [F("b1", [C("a", "3"), C("m1", "(x + 1)", { tone: "g", from: "l2" })], [C("b", "x", { tone: "b" }), C("m2", "(x + 1)", { tone: "g", from: "l2" })]), OP("op", "+"), F("b2", [C("c", "2"), C("m3", "x", { tone: "g", from: "l1" })], [C("d", "(x + 1)", { tone: "b" }), C("m4", "x", { tone: "g", from: "l1" })])],
        lcd: [OP("lt", "LCD ="), C("l1", "x", { tone: "g" }), C("l2", "(x + 1)", { tone: "g" })] },
      { cap: "Now both fractions have the LCD x(x + 1).", rows: [F("b1", [C("e", "3(x + 1)")], [C("L1", "x(x + 1)", { tone: "b" })]), OP("op", "+"), F("b2", [C("f", "2x")], [C("L2", "x(x + 1)", { tone: "b" })])] },
      { cap: "Add the numerators; keep the common denominator.", rows: [F("b1", [C("e", "3(x + 1)"), OP("op2", "+"), C("f", "2x")], [C("L1", "x(x + 1)", { tone: "b" })])] },
      { cap: "Simplify the numerator: 3x + 3 + 2x = 5x + 3. Answer: (5x + 3)/[x(x + 1)], x ≠ 0, −1.", rows: [F("b1", [C("g", "5x + 3", { pulse: true })], [C("L1", "x(x + 1)", { tone: "b" })])] },
    ] },
    "−": { title: "4/(x − 3) − 2/(x + 1)", steps: [
      { cap: "Subtract. Different denominators again – find the LCD first.", rows: [F("b1", [C("a", "4")], [C("b", "(x − 3)", { tone: "b" })]), OP("op", "−"), F("b2", [C("c", "2")], [C("d", "(x + 1)", { tone: "b" })])] },
      { cap: "LCD = (x − 3)(x + 1).", rows: [F("b1", [C("a", "4")], [C("b", "(x − 3)", { tone: "b" })]), OP("op", "−"), F("b2", [C("c", "2")], [C("d", "(x + 1)", { tone: "b" })])],
        lcd: [OP("lt", "LCD ="), C("l1", "(x − 3)", { tone: "g" }), C("l2", "(x + 1)", { tone: "g" })] },
      { cap: "Give each fraction its missing factor, on top and bottom.", rows: [F("b1", [C("a", "4"), C("m1", "(x + 1)", { tone: "g", from: "l2" })], [C("b", "(x − 3)", { tone: "b" }), C("m2", "(x + 1)", { tone: "g", from: "l2" })]), OP("op", "−"), F("b2", [C("c", "2"), C("m3", "(x − 3)", { tone: "g", from: "l1" })], [C("d", "(x + 1)", { tone: "b" }), C("m4", "(x − 3)", { tone: "g", from: "l1" })])],
        lcd: [OP("lt", "LCD ="), C("l1", "(x − 3)", { tone: "g" }), C("l2", "(x + 1)", { tone: "g" })] },
      { cap: "Subtract the numerators. Keep the parentheses: the minus sign applies to the whole second numerator.", rows: [F("b1", [C("e", "4(x + 1)"), OP("op2", "−"), C("f", "2(x − 3)")], [C("L1", "(x − 3)(x + 1)", { tone: "b" })])] },
      { cap: "4x + 4 − 2x + 6 = 2x + 10 = 2(x + 5). No common factor with the denominator, so we are done.", rows: [F("b1", [C("g", "2(x + 5)", { pulse: true })], [C("L1", "(x − 3)(x + 1)", { tone: "b" })])] },
      { cap: "Answer: 2(x + 5)/[(x − 3)(x + 1)], with x ≠ 3 and x ≠ −1.", rows: [F("b1", [C("g", "2(x + 5)")], [C("L1", "(x − 3)(x + 1)", { tone: "b" })]), OP("eq", "x ≠ 3, −1", { color: "var(--bad)" })] },
    ] },
  };

  function operate(root_) {
    let op = "×", step = 0;
    const svg = s("svg", { viewBox: "0 0 600 190", role: "img", "aria-label": "Operations on rational expressions, step by step" });
    const layer = s("g"); svg.append(layer);
    const scene = Scene(layer);
    const title = h("p", { class: "unit-big" }), cap = h("p", { "aria-live": "polite" }), count = h("span", { class: "note" });
    const next = h("button", { class: "btn", type: "button", onclick: () => { if (step < OPS[op].steps.length - 1) { step++; show(); } } }, "Next step ▶");
    function show() {
      const ex = OPS[op], st = ex.steps[step];
      const specs = rowLayout(st.rows, 70, 300);
      if (st.lcd) specs.push(...rowLayout(st.lcd, 160, 300));
      if (st.pops) specs.push(...st.pops.map((id) => ({ id, pop: true })));
      scene.set(specs);
      title.textContent = ex.title;
      cap.textContent = st.cap;
      count.textContent = `Step ${step + 1} of ${ex.steps.length}`;
      next.disabled = step >= ex.steps.length - 1;
    }
    root_.append(h("div", { class: "controls" }, segmented(Object.keys(OPS), op, (v) => { op = v; step = 0; scene.reset(); show(); }, (v) => ({ "×": "Multiply ×", "÷": "Divide ÷", "+": "Add +", "−": "Subtract −" })[v])),
      title, svg, cap, h("div", { class: "controls" }, next, h("button", { class: "btn ghost", type: "button", onclick: () => { step = 0; scene.reset(); show(); } }, "Start over"), count));
    show();
    return () => scene.stop();
  }

  // ------------------------------------------------------------ restrictions

  function makeRestriction() {
    const kind = pick(["one", "lin", "dots", "tri", "tri", "x"]);
    let roots;
    if (kind === "one") roots = [randInt(-6, 6)];
    else if (kind === "lin") roots = [pick([-5, -4, -3, -2, -1, 1, 2, 3, 4, 5])];
    else if (kind === "dots") { const r = randInt(1, 6); roots = [r, -r]; }
    else if (kind === "x") roots = [0, pick([-5, -4, -3, -2, -1, 1, 2, 3, 4, 5])];
    else { const a = randInt(-6, 6); let b = randInt(-6, 6); while (b === a || b === -a) b = randInt(-6, 6); roots = [a, b]; }
    const m = kind === "lin" ? pick([2, 3]) : 1;
    const den = roots.reduce((acc, r) => pmul(acc, [1, -r]), [m]);
    let p = randInt(-5, 5);
    while (roots.includes(-p)) p = randInt(-5, 5);
    const numCs = pick([[0, randInt(2, 9)], [1, p]]);
    const factored = (m > 1 ? `${m}` : "") + roots.map((r) => ftext([1, -r])).join("");
    return { roots: [...new Set(roots)].sort((a, b) => a - b), den, num: poly(numCs), denText: poly(den), factored, numCs };
  }

  function restrictions(root_) {
    let pr = null, xv = 0;
    const springs = [];
    const X = (n) => 300 + n * 42;
    const svg = s("svg", { viewBox: "0 0 600 250", role: "img", "aria-label": "Rational expression and a number line with a probe" });
    const exLayer = s("g"), line = s("g"), marks = s("g"), probe = s("g", { class: "token", tabindex: 0, "aria-label": "x probe" });
    svg.append(exLayer, line, marks, probe);
    const scene = Scene(exLayer);
    probe.append(s("path", { d: "M0,0 l-13,-24 h26 z", fill: "var(--accent)" }), s("text", { y: -30, "text-anchor": "middle", class: "svg-text", "font-weight": 700 }, "x"));
    line.append(s("line", { x1: 30, y1: 180, x2: 570, y2: 180, stroke: "var(--ink)", "stroke-width": 2 }));
    for (let n = -6; n <= 6; n++) line.append(s("line", { x1: X(n), y1: 172, x2: X(n), y2: 188, stroke: "var(--ink)", "stroke-width": n ? 1.5 : 2.5 }), s("text", { x: X(n), y: 206, "text-anchor": "middle", class: "svg-text", "font-size": 13 }, neg(n)));
    const probeSp = new Spring(0, (v) => { xv = v; paintProbe(); }, { stiffness: 230, damping: 15 });
    springs.push(probeSp);
    const out = h("p", { class: "unit-big", "aria-live": "polite", style: "font-size:1.05rem" });
    Sim.draggable(svg, probe, (p) => { probeSp.stop(); xv = rubber((p.x - 300) / 42, -6, 6, 0.3); probeSp.value = xv; probeSp.vel = 0; paintProbe(); },
      () => probeSp.set(clamp(Math.round(xv), -6, 6)));
    function paintProbe() {
      probe.setAttribute("transform", `translate(${X(xv).toFixed(1)},176)`);
      if (!pr) return;
      const dv = pval(pr.den, xv), nv = pval(pr.numCs, xv);
      clear(out);
      out.append(`x = ${dec(xv)}:  denominator ${pr.denText} = ${dec(dv)}  →  `,
        Math.abs(dv) < 1e-9 ? h("span", { class: "pill no", style: "font-size:1rem" }, "undefined (÷ 0)") : `value ${dec(nv / dv)}`);
    }
    const picked = new Set();
    const pickRow = h("div", { class: "choices" });
    const res = h("div");
    function drawMarks(showTrue) {
      clear(marks);
      for (const v of picked) marks.append(s("circle", { cx: X(v), cy: 180, r: 9, fill: "var(--paper)", stroke: "var(--shape-b)", "stroke-width": 3 }));
      if (showTrue) pr.roots.forEach((r) => marks.append(s("text", { x: X(r), y: 232, "text-anchor": "middle", class: "svg-text", "font-size": 12, "font-weight": 700, fill: "var(--bad)" }, `x ≠ ${neg(r)}`)));
    }
    function deal() {
      pr = makeRestriction(); picked.clear(); clear(res); drawMarks(false);
      scene.reset();
      scene.set(rowLayout([F("bar", [C("n", pr.num)], [C("d", pr.denText, { tone: "b" })])], 64, 300));
      clear(pickRow);
      for (let v = -6; v <= 6; v++) {
        const b = h("button", { type: "button", "aria-pressed": "false", onclick: () => { if (picked.has(v)) picked.delete(v); else picked.add(v); b.setAttribute("aria-pressed", picked.has(v) ? "true" : "false"); drawMarks(false); } }, neg(v));
        pickRow.append(b);
      }
      paintProbe();
    }
    function check() {
      clear(res);
      const ok = pr.roots.length === picked.size && pr.roots.every((r) => picked.has(r));
      drawMarks(true);
      res.append(pill(ok, "Correct – those values make the denominator 0.", "Not quite."),
        h("ol", { class: "steps" },
          h("li", {}, `Set the denominator equal to 0: ${pr.denText} = 0`),
          h("li", {}, `Factor: ${pr.factored} = 0`),
          h("li", {}, `Solve: x = ${pr.roots.map(neg).join(" or x = ")}`),
          h("li", {}, `Excluded values: ${xList(pr.roots)}. (The numerator does not matter: a zero numerator just makes the value 0.)`)));
    }
    root_.append(svg, out, h("p", {}, "Tap every value of x that must be EXCLUDED (drag the green probe to test values first):"), pickRow,
      h("div", { class: "controls" }, h("button", { class: "btn", type: "button", onclick: check }, "Check"), h("button", { class: "btn ghost", type: "button", onclick: deal }, "New expression")), res);
    probeSp.jump(0);
    deal();
    return () => { springs.forEach((sp) => sp.stop()); scene.stop(); };
  }

  // ------------------------------------------------------------ lesson

  Sim.register({
    id: "lesson6", unit: "C", num: 6, letter: "F", title: "Rational Algebraic Expressions", simName: "Fraction Machine",
    comps: ["A10", "A11", "M6"], cycles: "C6,M1 – C7,M2", deped: "DepEd Weeks 6–7",
    bigQuestion: "If 3 friends can paint a wall in 4 hours, how long would it take 5 friends?",
    mission: [
      "Simplify: factor (x² − 9)/(x² + 5x + 6), find the common factor, and cancel it.",
      "Slide x to −3 and to −2. What happens to the original and the simplified expressions?",
      "Operate: step through ×, ÷, +, and −. When do you need an LCD?",
      "Restrictions: find the excluded values of 5 expressions. Which part of the expression do you look at?",
    ],
    discovery: "A rational expression is a fraction of polynomials. To simplify, factor and cancel common factors – they divide to 1. Multiply straight across; to divide, flip the divisor and multiply; to add or subtract, rewrite with the LCD first. Values that make a denominator 0 are excluded, because division by 0 is undefined – even when a simplified form seems to give a value there. Time to paint a wall is a rational expression: 3 friends × 4 hours = 12 friend-hours, so n friends need 12/n hours; 5 friends need 12/5 = 2.4 hours.",
    mount(stage) {
      const body = h("div", { class: "stage-body" });
      const views = [simplify, operate, restrictions];
      let stopper = null;
      const t = tabs(["Simplify", "Operate", "Restrictions"], (i) => { if (stopper) stopper(); clear(body); stopper = views[i](body) || null; });
      stage.append(t.el, body);
      stopper = simplify(body);
      return () => { if (stopper) stopper(); };
    },
    check() {
      const kind = randInt(0, 5);
      if (kind === 0) {
        const pr = makeRestriction();
        const ans = xList(pr.roots);
        const numRoot = pr.numCs[0] ? [-pr.numCs[1]] : [];
        return { q: `What are the excluded values of (${pr.num})/(${pr.denText})?`, choices: choiceSet(ans, [xList(pr.roots.map((r) => -r).filter((r, i, a) => a.indexOf(r) === i)), numRoot.length ? xList(numRoot) : null, pr.roots.length > 1 ? xList([pr.roots[0]]) : xList([pr.roots[0] + 1]), xList([...pr.roots, pr.roots[0] === 0 ? 1 : 0]), "There are none"]), answer: ans, explain: `Set ${pr.denText} = 0: ${pr.factored} = 0, so x = ${pr.roots.map(neg).join(" or ")}.` };
      }
      if (kind === 1) {
        const ex = pick(BANK), an = analyse(ex), ans = fracText(an.restN, an.restD);
        const wrong = [fracText(ex.nf.slice(1), ex.df.slice(1)), fracText(an.restD, an.restN), fracText(an.restN, an.restD.map(([m, c]) => [m, -c])), fracText(an.restN, [...an.restD, [1, 1]])];
        return { q: `Simplify (${an.num})/(${an.den}).`, choices: choiceSet(ans, wrong), answer: ans, explain: `Factor: ${prodText(ex.nf)} over ${prodText(ex.df)}, then cancel the common factor: ${ans}.` };
      }
      if (kind === 2) { const r = pick([-9, -8, -7, -6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6, 7, 8, 9]), k = randInt(2, 9); return { q: `Which value of x must be excluded from ${k}/(${poly([1, -r])})?`, answer: r, explain: `The denominator ${poly([1, -r])} = 0 when x = ${neg(r)}, and division by 0 has no value.` }; }
      if (kind === 3) { const a = randInt(2, 6), xv = pick([1, 2, 4, 5, 7, 8].filter((v) => v !== a)); return { q: `Evaluate (x² − ${a * a})/(x + ${a}) when x = ${xv}.`, answer: xv - a, explain: `(x² − ${a * a})/(x + ${a}) = x − ${a} for x ≠ −${a}, so the value is ${xv} − ${a} = ${neg(xv - a)}.` }; }
      if (kind === 4) {
        const a = randInt(2, 9), b = randInt(2, 9);
        return pick([
          { q: `Add: ${a}/x + ${b}/x`, choices: choiceSet(`${a + b}/x`, [`${a + b}/(2x)`, `${a * b}/x`, `${a + b}/x²`]), answer: `${a + b}/x`, explain: "Same denominator: add the numerators and keep x." },
          { q: `Multiply: ${a}/x × x²/${b}`, choices: choiceSet(a === b ? "x" : `${a}x/${b}`, [`${a}x²/(${b}x)`, `${a * b}x`, `${a}/(${b}x)`]), answer: a === b ? "x" : `${a}x/${b}`, explain: `${a}x²/(${b}x) = ${a}x/${b} after cancelling one x.` },
          { q: `Divide: 1/x ÷ ${a}/x`, choices: choiceSet(`1/${a}`, [`${a}/x²`, `${a}`, `1/(${a}x²)`]), answer: `1/${a}`, explain: `1/x × x/${a} = 1/${a}.` },
        ]);
      }
      const n = pick([2, 4, 6, 8, 12]);
      return { q: `3 friends can paint a wall in 4 hours, so the job takes 12 friend-hours and n friends need 12/n hours. How many hours do ${n} friends need?`, answer: 12 / n, unit: "h", explain: `12 ÷ ${n} = ${fmt(12 / n, 2)} hours.` };
    },
  });
})();
