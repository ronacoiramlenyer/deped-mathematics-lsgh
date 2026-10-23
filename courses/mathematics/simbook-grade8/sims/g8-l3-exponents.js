/* Math 8 · Lesson 3 · C. Operations on Monomials and the Laws of Exponents – Exponent Lab */
(function () {
  "use strict";
  const { h, s, clear, randInt, pick, shuffle, fmt, tabs, segmented, stat, pill, Spring, elasticSlider, rubber, clamp } = Sim;

  const SUP = { 0: "⁰", 1: "¹", 2: "²", 3: "³", 4: "⁴", 5: "⁵", 6: "⁶", 7: "⁷", 8: "⁸", 9: "⁹", "-": "⁻" };
  const sup = (n) => String(n).split("").map((c) => SUP[c]).join("");
  const pw = (b, e) => (e === 1 ? b : b + sup(e));
  const xs = (k) => Array.from({ length: k }, () => "x").join("·");

  /** a x² + b x + c written the usual way ("0" when every coefficient is 0). */
  function poly(a, b, c) {
    const parts = [];
    [[a, "x²"], [b, "x"], [c, ""]].forEach(([k, v]) => {
      if (!k) return;
      const mag = Math.abs(k) === 1 && v ? "" : String(Math.abs(k));
      parts.push({ neg: k < 0, t: mag + v });
    });
    if (!parts.length) return "0";
    return parts.map((p, i) => (i === 0 ? (p.neg ? "−" : "") + p.t : (p.neg ? " − " : " + ") + p.t)).join("");
  }

  // ------------------------------------------------------------ like terms

  const KINDS = {
    x2: { w: 56, h: 56, color: "var(--shape-a)", soft: "var(--shape-a-soft)", lab: "x²", row: 50, cap: 4, gap: 62 },
    x: { w: 20, h: 56, color: "var(--gold)", soft: "var(--gold-soft)", lab: "x", row: 134, cap: 10, gap: 26 },
    one: { w: 20, h: 20, color: "var(--shape-b)", soft: "var(--shape-b-soft)", lab: "1", row: 206, cap: 10, gap: 26 },
  };
  const ORDER = ["x2", "x", "one"];

  const PRESETS = {
    "3x + 2x": [["x", 3], ["x", 2]],
    "x² + x": [["x2", 1], ["x", 1]],
    "4x − 2x": [["x", 4], ["x", -2]],
    "2x² − x + 3 − x² + 2x − 1": [["x2", 2], ["x", -1], ["one", 3], ["x2", -1], ["x", 2], ["one", -1]],
  };

  function likeTerms(root) {
    let terms = [], tiles = [], grouped = false;
    const timers = [];
    const svg = s("svg", { viewBox: "0 0 640 250", role: "img", "aria-label": "Algebra tiles on a mat" });
    const deco = s("g", { opacity: 0 }), layer = s("g");
    svg.append(s("rect", { x: 2, y: 2, width: 636, height: 246, rx: 12, fill: "var(--bg)", stroke: "var(--line)" }), deco, layer);
    deco.append(s("line", { x1: 340, y1: 12, x2: 340, y2: 236, stroke: "var(--line)", "stroke-width": 2, "stroke-dasharray": "6 5" }),
      s("text", { x: 190, y: 242, "text-anchor": "middle", class: "svg-label", "font-size": 13 }, "positive tiles"), s("text", { x: 490, y: 242, "text-anchor": "middle", class: "svg-label", "font-size": 13 }, "negative tiles"));
    ORDER.forEach((k) => deco.append(s("text", { x: 26, y: KINDS[k].row + 6, "text-anchor": "middle", class: "svg-text", "font-size": 17, "font-weight": 700, fill: KINDS[k].color }, KINDS[k].lab)));
    const decoSp = new Spring(0, (v) => deco.setAttribute("opacity", clamp(v, 0, 1)), { stiffness: 120, damping: 16 });
    const written = h("p", { class: "unit-big" }), simple = h("p", { class: "unit-big" }), msg = h("p", { class: "note", "aria-live": "polite" });
    const groupBtn = h("button", { class: "btn", type: "button" }), zeroBtn = h("button", { class: "btn ghost", type: "button" }, "Remove zero pairs");

    function makeTile(k, sg, from) {
      const K = KINDS[k], node = s("g", { class: "token", tabindex: 0, "aria-label": `${sg < 0 ? "negative" : "positive"} ${K.lab} tile` });
      node.append(s("rect", { x: -K.w / 2, y: -K.h / 2, width: K.w, height: K.h, rx: 3, fill: sg > 0 ? K.color : K.soft, stroke: K.color, "stroke-width": 2, "stroke-dasharray": sg > 0 ? null : "4 3" }),
        s("text", { y: k === "one" ? 4 : 5, transform: k === "x" && sg < 0 ? "rotate(-90)" : null, "text-anchor": "middle", class: "svg-text", "font-size": k === "one" ? (sg < 0 ? 11 : 13) : 17, "font-weight": 700, fill: sg > 0 ? "#fff" : K.color }, (sg < 0 ? "−" : "") + K.lab));
      layer.append(node);
      const t = { k, sg, node, alive: true };
      t.sp = new Spring([from.x, from.y, 0], ([x, y, sc]) => node.setAttribute("transform", `translate(${x},${y}) scale(${Math.max(0, sc)})`), { stiffness: 190, damping: 15 });
      t.sp.jump([from.x, from.y, 0]);
      Sim.draggable(svg, node, (p) => {
        if (!t.alive) return;
        t.sp.stop(); t.sp.value = [rubber(p.x, 10, 630), rubber(p.y, 10, 240), 1.1]; t.sp.vel = [0, 0, 0]; t.sp.onUpdate(t.sp.value);
      }, (p) => drop(t, p));
      tiles.push(t);
      return t;
    }
    function drop(t, p) {
      if (!t.alive) return;
      const mate = tiles.filter((o) => o.alive && o.k === t.k && o.sg === -t.sg).sort((a, b) => Math.hypot(a.sp.value[0] - p.x, a.sp.value[1] - p.y) - Math.hypot(b.sp.value[0] - p.x, b.sp.value[1] - p.y))[0];
      if (mate && Math.hypot(mate.sp.value[0] - p.x, mate.sp.value[1] - p.y) < 40) { cancel(t, mate); msg.textContent = `+${KINDS[t.k].lab} and −${KINDS[t.k].lab} make a zero pair: together they are 0.`; return; }
      const other = ORDER.find((k) => k !== t.k && Math.abs(p.y - KINDS[k].row) < 30);
      if (grouped && other) msg.textContent = `${KINDS[t.k].lab} and ${KINDS[other].lab} are unlike terms – their variable parts differ, so they cannot be combined. The tile springs back.`;
      layout();
    }
    function cancel(a, b) {
      a.alive = false; b.alive = false;
      const mx = (a.sp.value[0] + b.sp.value[0]) / 2, my = (a.sp.value[1] + b.sp.value[1]) / 2;
      a.sp.set([mx - 3, my, 1]); b.sp.set([mx + 3, my, 1]);
      timers.push(setTimeout(() => { a.sp.set([mx, my, 0]); b.sp.set([mx, my, 0]); }, 320));
      timers.push(setTimeout(() => { [a, b].forEach((x) => { x.sp.stop(); x.node.remove(); }); tiles = tiles.filter((x) => x !== a && x !== b); }, 1100));
      layout();
    }
    function layout() {
      const live = tiles.filter((t) => t.alive);
      if (grouped) {
        ORDER.forEach((k) => {
          const K = KINDS[k];
          live.filter((t) => t.k === k && t.sg > 0).forEach((t, i) => t.sp.set([68 + i * K.gap, K.row, 1]));
          live.filter((t) => t.k === k && t.sg < 0).forEach((t, i) => t.sp.set([370 + i * K.gap, K.row, 1]));
        });
      } else {
        let x = 20, row = 0, lastTerm = -1;
        live.forEach((t) => {
          const K = KINDS[t.k];
          if (lastTerm !== -1 && t.term !== lastTerm) x += 22;
          if (x + K.w > 620) { x = 20; row++; }
          t.sp.set([x + K.w / 2, 90 + row * 80, 1]);
          x += K.w + 6; lastTerm = t.term;
        });
      }
      decoSp.set(grouped ? 1 : 0);
      groupBtn.textContent = grouped ? "Back to as written" : "Group like terms";
      const cnt = (k) => live.filter((t) => t.k === k).reduce((a, t) => a + t.sg, 0);
      written.textContent = "As written: " + (terms.length ? terms.map((tm, i) => { const v = poly(tm[0] === "x2" ? tm[1] : 0, tm[0] === "x" ? tm[1] : 0, tm[0] === "one" ? tm[1] : 0); return i === 0 ? v : v.startsWith("−") ? " − " + v.slice(1) : " + " + v; }).join("") : "–");
      const pairs = ORDER.some((k) => live.some((t) => t.k === k && t.sg > 0) && live.some((t) => t.k === k && t.sg < 0));
      simple.textContent = "Simplified: " + (grouped ? poly(cnt("x2"), cnt("x"), cnt("one")) : "? (group the like terms)");
      zeroBtn.disabled = !pairs;
    }
    function load(name) {
      tiles.forEach((t) => { t.sp.stop(); t.node.remove(); }); tiles = []; grouped = false;
      terms = PRESETS[name].map(([k, c]) => [k, c]);
      terms.forEach(([k, c], i) => { for (let j = 0; j < Math.abs(c); j++) makeTile(k, Math.sign(c), { x: 320, y: -30 }).term = i; });
      msg.textContent = "Tap “Group like terms”. Then drag a negative tile onto a positive tile of the same kind.";
      layout();
    }
    function addTile(k, sg) {
      const live = tiles.filter((t) => t.alive && t.k === k && t.sg === sg);
      if (live.length >= KINDS[k].cap) { msg.textContent = "That row is full."; return; }
      const last = terms[terms.length - 1];
      if (last && last[0] === k && Math.sign(last[1]) === sg) last[1] += sg; else terms.push([k, sg]);
      makeTile(k, sg, { x: 320, y: 250 }).term = terms.length - 1;
      layout();
    }
    function removeZeros() {
      if (!grouped) { grouped = true; layout(); }
      timers.push(setTimeout(() => {
        ORDER.forEach((k) => {
          const pos = tiles.filter((t) => t.alive && t.k === k && t.sg > 0), neg = tiles.filter((t) => t.alive && t.k === k && t.sg < 0);
          for (let i = 0; i < Math.min(pos.length, neg.length); i++) cancel(pos[pos.length - 1 - i], neg[i]);
        });
        msg.textContent = "Each zero pair (+ and −) adds to 0, so it is removed. What is left is the simplified expression.";
      }, grouped ? 50 : 500));
    }
    groupBtn.addEventListener("click", () => { grouped = !grouped; layout(); msg.textContent = grouped ? "Like terms slid into the same row and merged. x², x, and 1 stay in different rows – they are unlike terms." : ""; });
    zeroBtn.addEventListener("click", removeZeros);
    const adders = [["x2", 1], ["x2", -1], ["x", 1], ["x", -1], ["one", 1], ["one", -1]].map(([k, sg]) => h("button", { type: "button", class: "num", onclick: () => addTile(k, sg) }, (sg > 0 ? "+" : "−") + KINDS[k].lab));
    root.append(h("div", { class: "controls" }, segmented(Object.keys(PRESETS), "3x + 2x", load)),
      h("div", { class: "controls" }, groupBtn, zeroBtn, h("button", { class: "btn ghost", type: "button", onclick: () => load(Object.keys(PRESETS)[0]) }, "Reset")),
      svg, h("div", { class: "choices" }, h("span", { class: "note" }, "Add a tile:"), adders), written, simple, msg,
      h("p", { class: "note" }, "Blue x² tiles, gold x tiles, and orange 1 tiles; dashed tiles are negative. Only like terms – the same variable with the same exponent – combine: add their coefficients."));
    load("3x + 2x");
    return () => { decoSp.stop(); tiles.forEach((t) => t.sp.stop()); timers.forEach(clearTimeout); };
  }

  // ------------------------------------------------------------ expand the powers

  const MODES = { prod: "x³ · x²", quot: "x⁵ ÷ x²", pow: "(x²)³", zero: "x³ ÷ x³" };
  const DEFAULTS = { prod: [3, 2], quot: [5, 2], pow: [2, 3], zero: [3, 3] };

  function powers(root) {
    let mode = "prod", m = 3, n = 2, phase = 0, ph = 0, sliderGen = 0;
    const svg = s("svg", { viewBox: "0 20 640 210", role: "img", "aria-label": "Factors of x shown as chips" });
    const deco = s("g"), layer = s("g");
    svg.append(deco, layer);
    const chips = new Map();
    const eq = h("p", { class: "unit-big", "aria-live": "polite" }), expl = h("p", { class: "note" });
    const act = h("button", { class: "btn", type: "button" }), sliders = h("div", { class: "controls" });
    let geo = { S: 40, r: 15, marks: [] };

    function chip(id, color) {
      let c = chips.get(id);
      if (c && !c.dead) return c;
      if (c) { c.sp.stop(); c.node.remove(); }
      const node = s("g");
      const label = s("text", { y: 34, "text-anchor": "middle", class: "svg-text", "font-size": 13, fill: "var(--muted)", style: "transition:opacity .35s" });
      const circ = s("circle", { r: 16, fill: color, stroke: "var(--paper)", "stroke-width": 2 });
      node.append(circ, s("text", { y: 6, "text-anchor": "middle", class: "svg-text", "font-size": 17, "font-weight": 700, fill: "#fff", style: "font-style:italic" }, "x"), label);
      layer.append(node);
      c = { node, label, circ, dead: false };
      c.sp = new Spring([320, 120, 0], ([x, y, o]) => {
        node.setAttribute("transform", `translate(${x},${y}) scale(${(0.5 + 0.5 * clamp(o, 0, 1.2)) * geo.r / 16})`);
        node.setAttribute("opacity", clamp(o, 0, 1));
        if (c.dead && o < 0.02 && chips.get(id) === c) { c.sp.stop(); node.remove(); chips.delete(id); }
      }, { stiffness: 170, damping: 15 });
      chips.set(id, c);
      return c;
    }
    function row(count, y, x0, S) { return Array.from({ length: count }, (_, i) => ({ x: x0 + i * S, y })); }
    function layout() {
      const want = [];
      const nn = mode === "quot" ? Math.min(n, m) : mode === "zero" ? m : n;
      if (mode === "prod") {
        const N = m + n, S = Math.min(62, 580 / (N + 1)), G = 44 * (1 - phase);
        const w = (N - 1) * S + G, x0 = 320 - w / 2;
        geo.S = S; geo.r = Math.min(23, S * 0.44);
        row(m, 110, x0, S).forEach((p, i) => want.push({ id: "a" + i, color: "var(--shape-a)", ...p, o: 1, count: phase ? String(i + 1) : "" }));
        row(n, 110, x0 + m * S + G, S).forEach((p, i) => want.push({ id: "b" + i, color: "var(--gold)", ...p, o: 1, count: phase ? String(m + i + 1) : "" }));
        geo.marks = [{ t: "·", x: x0 + (m - 1) * S + (S + G) / 2, y: 118 }];
      } else if (mode === "quot" || mode === "zero") {
        const N = Math.max(m, nn), S = Math.min(62, 580 / (N + 1)), x0 = 320 - ((N - 1) * S) / 2;
        geo.S = S; geo.r = Math.min(23, S * 0.44);
        row(m, 62, x0, S).forEach((p, i) => { const gone = phase && i < nn; want.push({ id: "t" + i, color: "var(--shape-a)", x: p.x, y: gone ? 100 : 62, o: gone ? 0 : 1, count: "" }); });
        row(nn, 178, x0, S).forEach((p, i) => want.push({ id: "d" + i, color: "var(--gold)", x: p.x, y: phase ? 140 : 178, o: phase ? 0 : 1, count: "" }));
        geo.marks = [{ bar: true, x1: x0 - S / 2, x2: x0 + (N - 1) * S + S / 2, y: 120 }];
        if (phase && m === nn) geo.marks.push({ t: "1", x: 320, y: 78, big: true });
      } else {
        const N = m * n, G = 40 * (1 - phase), S = Math.min(62, (580 - G * (n - 1)) / (N + 1)), w = (N - 1) * S + G * (n - 1), x0 = 320 - w / 2;
        geo.S = S; geo.r = Math.min(23, S * 0.44);
        geo.marks = [];
        for (let j = 0; j < n; j++) {
          const gx = x0 + j * (m * S + G);
          row(m, 110, gx, S).forEach((p, i) => want.push({ id: `g${j}_${i}`, color: j % 2 ? "var(--gold)" : "var(--shape-a)", ...p, o: 1, count: phase ? String(j * m + i + 1) : "" }));
          geo.marks.push({ t: "(", x: gx - S / 2 - 2, y: 120 }, { t: ")", x: gx + (m - 1) * S + S / 2 + 2, y: 120 });
        }
      }
      const ids = new Set(want.map((w) => w.id));
      chips.forEach((c, id) => { if (!ids.has(id) && !c.dead) { c.dead = true; c.sp.set([c.sp.value[0], c.sp.value[1] + 30, 0]); } });
      want.forEach((w) => {
        const fresh = !chips.has(w.id) || chips.get(w.id).dead;
        const c = chip(w.id, w.color);
        if (fresh) c.sp.jump([w.x, w.y - 40, 0]);
        c.circ.setAttribute("fill", w.color);
        c.label.textContent = w.count || c.label.textContent; c.label.setAttribute("opacity", w.count ? 1 : 0);
        c.sp.set([w.x, w.y, w.o]);
      });
      texts(nn);
      drawDeco();
    }
    function drawDeco() {
      clear(deco);
      geo.marks.forEach((mk) => {
        if (mk.bar) deco.append(s("line", { x1: mk.x1, y1: mk.y, x2: mk.x2, y2: mk.y, stroke: "var(--ink)", "stroke-width": 3 }));
        else if (mk.big) deco.append(s("text", { x: mk.x, y: mk.y, "text-anchor": "middle", class: "svg-text", "font-size": 40, "font-weight": 700, opacity: ph, fill: "var(--accent)" }, mk.t));
        else deco.append(s("text", { x: mk.x, y: mk.y, "text-anchor": "middle", class: "svg-text", "font-size": (mk.t === "·" ? 34 : 44) * geo.r / 16, opacity: 1 - ph }, mk.t));
      });
    }
    const phSp = new Spring(0, (v) => { ph = v; drawDeco(); }, { stiffness: 150, damping: 16 });
    function texts(nn) {
      if (mode === "prod") {
        eq.textContent = phase ? `${pw("x", m)} · ${pw("x", n)} = ${xs(m + n)} = ${pw("x", m + n)}` : `${pw("x", m)} · ${pw("x", n)} = (${xs(m)}) · (${xs(n)})`;
        expl.textContent = phase ? `${m} factors + ${n} factors = ${m + n} factors of x. Same base: ADD the exponents.` : "Each exponent counts how many factors of x there are.";
        act.textContent = phase ? "Separate" : "Slide into one row";
      } else if (mode === "quot" || mode === "zero") {
        const r = m - nn;
        eq.textContent = phase ? `${pw("x", m)} ÷ ${pw("x", nn)} = ${r ? `${xs(r)} = ${pw("x", r)}` : `1 = x${sup(0)}`}` : `${pw("x", m)} ÷ ${pw("x", nn)} = (${xs(m)}) ÷ (${xs(nn)})`;
        expl.textContent = mode === "zero" ? (phase ? `Every factor cancels, so the answer is 1. The quotient law gives x${sup(m)}${sup("-")}${sup(m)} = x${sup(0)}. So x${sup(0)} = 1 (x ≠ 0).` : "Divide a power by itself. What is left after every pair cancels?") :
          phase ? `Each x on top cancels one x below (x ÷ x = 1). ${m} − ${nn} = ${r} factors are left. Same base: SUBTRACT the exponents.` : (n > m ? `Here n is kept at most ${m}, so the top has at least as many factors.` : "Pair each x below with an x on top.");
        act.textContent = phase ? "Undo" : "Cancel the pairs";
      } else {
        eq.textContent = phase ? `(${pw("x", m)})${sup(n)} = ${xs(m * n)} = ${pw("x", m * n)}` : `(${pw("x", m)})${sup(n)} = ${Array.from({ length: n }, () => `(${xs(m)})`).join("")}`;
        expl.textContent = phase ? `${n} groups of ${m} factors = ${m} × ${n} = ${m * n} factors. Power of a power: MULTIPLY the exponents.` : `The outer exponent ${n} means ${n} copies of ${pw("x", m)}.`;
        act.textContent = phase ? "Regroup" : "Remove the brackets";
      }
    }
    function sliderRow() {
      clear(sliders);
      const gen = ++sliderGen, cap = mode === "pow" ? 4 : 6;
      const mk = (label, get, set, min) => elasticSlider({ id: `g8l3-${label}`, label, min, max: cap, value: get(), step: 1, format: (v) => fmt(v, 0),
        onInput: (v) => { if (gen !== sliderGen) return; const k = Math.round(v); if (k !== get()) { set(k); layout(); } } }).el;
      if (mode === "zero") sliders.append(mk("m", () => m, (k) => { m = k; n = k; }, 1));
      else sliders.append(mk("m (first exponent)", () => m, (k) => { m = k; }, 1), mk(mode === "pow" ? "n (outer exponent)" : "n (second exponent)", () => n, (k) => { n = k; }, 1));
    }
    act.addEventListener("click", () => { phase = phase ? 0 : 1; phSp.set(phase); layout(); });
    const pickMode = (k) => { mode = k; [m, n] = DEFAULTS[k]; phase = 0; phSp.jump(0); sliderRow(); layout(); drawDeco(); };
    root.append(h("div", { class: "controls" }, segmented(Object.keys(MODES), "prod", pickMode, (k) => MODES[k])), sliders, h("div", { class: "controls" }, act), svg, eq, expl);
    pickMode("prod");
    return () => { phSp.stop(); chips.forEach((c) => c.sp.stop()); };
  }

  // ------------------------------------------------------------ laws table

  function lawsTable(root) {
    const springs = [];
    const area = h("div", { class: "stage-body" });
    function deal() {
      clear(area);
      let a = randInt(2, 6), b = randInt(2, 5);
      while (a + b === a * b) b = randInt(2, 5);
      const qa = randInt(5, 9), qb = randInt(2, 4);
      let pa = randInt(2, 4), pb = randInt(2, 4);
      while (pa ** pb === pa * pb || pa + pb === pa * pb) { pa = randInt(2, 4); pb = 3; }
      const k = pick([3, 5]), e = pick([2, 3]), z = randInt(2, 9);
      const LAWS = [
        { name: "Product of powers", ex: `${pw("x", a)} · ${pw("x", b)}`, right: pw("x", a + b), wrong: [pw("x", a * b), `${a + b}x`],
          why: `${xs(a)} · ${xs(b)} has ${a} + ${b} = ${a + b} factors.`, law: "aᵐ · aⁿ = aᵐ⁺ⁿ" },
        { name: "Quotient of powers", ex: `${pw("x", qa)} ÷ ${pw("x", qb)}`, right: pw("x", qa - qb), wrong: [pw("x", qa + qb), pw("x", qa * qb)],
          why: `${qb} factors on the bottom cancel ${qb} on the top; ${qa} − ${qb} = ${qa - qb} are left.`, law: "aᵐ ÷ aⁿ = aᵐ⁻ⁿ (a ≠ 0)" },
        { name: "Power of a power", ex: `(${pw("x", pa)})${sup(pb)}`, right: pw("x", pa * pb), wrong: [pw("x", pa + pb), pw("x", pa ** pb)],
          why: `${pb} groups of ${pa} factors: ${pa} × ${pb} = ${pa * pb} factors.`, law: "(aᵐ)ⁿ = aᵐⁿ" },
        { name: "Power of a product", ex: `(${k}x)${sup(e)}`, right: `${k ** e}${pw("x", e)}`, wrong: [`${k}${pw("x", e)}`, `${k * e}${pw("x", e)}`],
          why: `(${k}x)${sup(e)} = ${Array.from({ length: e }, () => `${k}x`).join(" · ")}: multiply the ${e} copies of ${k} to get ${k ** e}, and the ${e} copies of x to get ${pw("x", e)}.`, law: "(ab)ᵐ = aᵐbᵐ" },
        { name: "Zero exponent", ex: `${z}x${sup(0)} (x ≠ 0)`, right: String(z), wrong: ["0", `${z}x`],
          why: `x${sup(0)} = x³ ÷ x³ = 1, so ${z}x${sup(0)} = ${z} · 1 = ${z}. Only x has the exponent 0, not ${z}.`, law: "a⁰ = 1 (a ≠ 0)" },
      ];
      let done = 0;
      const cards = h("div", { style: "display:grid;gap:10px;grid-template-columns:repeat(auto-fill,minmax(250px,1fr))" });
      LAWS.forEach((L) => {
        const reveal = h("div", { style: "opacity:0;transform:translateY(-8px)" });
        const opts = shuffle([L.right, ...L.wrong]);
        const btns = opts.map((o) => h("button", { type: "button", class: "num" }, o));
        const cell = h("div", { style: "display:grid;gap:6px" }, h("div", { class: "choices" }, btns), reveal);
        btns.forEach((b, i) => b.addEventListener("click", () => {
          if (reveal.dataset.on) return;
          reveal.dataset.on = "1"; btns.forEach((x) => { x.disabled = true; }); b.setAttribute("aria-pressed", "true");
          reveal.append(pill(opts[i] === L.right, `Correct: ${L.right}`, `It is ${L.right}`), h("p", { class: "note" }, L.why), h("p", { class: "rule-title", style: "font-family:var(--mono);margin:0" }, L.law));
          const sp = new Spring([0, -8], ([o, y]) => { reveal.style.opacity = clamp(o, 0, 1); reveal.style.transform = `translateY(${y}px)`; }, { stiffness: 160, damping: 14 });
          sp.jump([0, -8]); sp.set([1, 0]); springs.push(sp);
          if (++done === LAWS.length) area.append(h("div", { class: "controls" }, h("button", { class: "btn", type: "button", onclick: deal }, "New examples")));
        }));
        cards.append(h("div", { style: "border:1px solid var(--line);border-radius:10px;padding:10px 12px;background:var(--bg);display:grid;gap:6px;align-content:start" },
          h("strong", {}, L.name), h("p", { class: "unit-big" }, `${L.ex} = ?`), cell));
      });
      area.append(h("p", {}, "Predict each answer first. Then the law is revealed."),
        cards);
    }
    root.append(area);
    deal();
    return () => springs.forEach((x) => x.stop());
  }

  // ------------------------------------------------------------ lesson

  Sim.register({
    id: "lesson3", unit: "B", num: 3, letter: "C", title: "Operations on Monomials and the Laws of Exponents", simName: "Exponent Lab",
    comps: ["A4", "A5", "M3"], cycles: "C2,M3 – C3,M1", deped: "DepEd Week 2",
    bigQuestion: "How can one expression describe every size of garden?",
    mission: [
      "Like Terms: group 3x + 2x. Then try x² + x – why do those tiles stay apart?",
      "Load 4x − 2x and remove the zero pairs. What is left?",
      "Expand the Powers: slide x³ · x² into one row, cancel x⁵ ÷ x², and remove the brackets of (x²)³. What happens to the exponents each time?",
      "Use x³ ÷ x³ to explain why x⁰ = 1. Then predict all five laws in the Laws Table.",
    ],
    discovery: "Only like terms (same variable, same exponent) combine, by adding their coefficients; a + and − tile of the same kind make a zero pair. An exponent counts repeated factors: x³ · x² has 3 + 2 = 5 factors (add the exponents), x⁵ ÷ x² leaves 5 − 2 = 3 (subtract), (x²)³ is 3 groups of 2 = 6 (multiply), and x³ ÷ x³ = 1 shows that x⁰ = 1.",
    mount(stage) {
      const body = h("div", { class: "stage-body" });
      const views = [likeTerms, powers, lawsTable];
      let stopper = null;
      const t = tabs(["Like Terms", "Expand the Powers", "Laws Table"], (i) => { if (stopper) stopper(); clear(body); stopper = views[i](body) || null; });
      stage.append(t.el, body);
      stopper = likeTerms(body);
      return () => { if (stopper) stopper(); };
    },
    check() {
      const kind = randInt(0, 5);
      if (kind === 0) { const a = randInt(2, 9), b = randInt(2, 9); return { q: `${pw("x", a)} · ${pw("x", b)} = xⁿ. What is n?`, answer: a + b, explain: `Same base: add the exponents, ${a} + ${b} = ${a + b}.` }; }
      if (kind === 1) { const b = randInt(2, 6), a = b + randInt(1, 6); return { q: `${pw("y", a)} ÷ ${pw("y", b)} = yⁿ. What is n?`, answer: a - b, explain: `Same base: subtract the exponents, ${a} − ${b} = ${a - b}.` }; }
      if (kind === 2) { const a = randInt(2, 5), b = randInt(2, 4); return { q: `(${pw("a", a)})${sup(b)} = aⁿ. What is n?`, answer: a * b, explain: `Power of a power: multiply, ${a} × ${b} = ${a * b}.` }; }
      if (kind === 3) {
        const p = randInt(4, 9), q = randInt(1, 3), r = randInt(1, 3), res = p + q - r;
        return { q: `Simplify ${p}x + ${q}x − ${r}x.`, choices: shuffle([`${res}x`, `${res}x³`, `${p + q + r}x`, `${res}`]), answer: `${res}x`, explain: `Like terms: add the coefficients, ${p} + ${q} − ${r} = ${res}; the variable part x stays.` };
      }
      if (kind === 4) {
        const a = randInt(2, 5), b = randInt(3, 5), m = randInt(1, 4), n = randInt(3, 4);
        return { q: `Multiply (${a}${pw("x", m)})(${b}${pw("x", n)}).`, choices: shuffle([`${a * b}${pw("x", m + n)}`, `${a + b}${pw("x", m + n)}`, `${a * b}${pw("x", m * n)}`, `${a + b}${pw("x", m * n)}`]), answer: `${a * b}${pw("x", m + n)}`, explain: `Multiply the coefficients (${a} × ${b} = ${a * b}) and add the exponents (${m} + ${n} = ${m + n}).` };
      }
      return pick([
        { q: "Which pair are like terms?", choices: ["3x² and −5x²", "3x² and 3x", "4x and 4", "x³ and 3x"], answer: "3x² and −5x²", explain: "Like terms have the same variable with the same exponent." },
        { q: "What is 2026⁰?", answer: 1, explain: "Any nonzero number to the power 0 is 1." },
        { q: "Simplify 7x² − 7x².", choices: ["0", "x²", "14x²", "7"], answer: "0", explain: "7x² and −7x² form zero pairs: 7 − 7 = 0." },
        { q: "Simplify (2x)³.", choices: ["8x³", "2x³", "6x³", "8x"], answer: "8x³", explain: "(2x)³ = 2³ · x³ = 8x³." },
      ]);
    },
  });
})();
