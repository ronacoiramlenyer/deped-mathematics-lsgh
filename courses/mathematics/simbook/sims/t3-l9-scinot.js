/* Term 3 · Lesson 9 · I. Scientific Notation – Powers-of-Ten Zoom */
(function () {
  "use strict";
  const { h, s, clear, randInt, pick, shuffle, fmt, tabs, segmented, stat, pill, Spring, elasticSlider, clamp } = Sim;

  const SUPD = { "-": "⁻", "0": "⁰", "1": "¹", "2": "²", "3": "³", "4": "⁴", "5": "⁵", "6": "⁶", "7": "⁷", "8": "⁸", "9": "⁹" };
  const sup = (n) => String(n).split("").map((c) => SUPD[c] || c).join("");
  const p10 = (n) => "10" + sup(n);
  const minus = (t) => String(t).replace(/-/g, "−");
  const group = (int) => (int.length < 4 ? int : int.replace(/\B(?=(\d{3})+(?!\d))/g, " "));
  /** Coefficient (as a string such as "4.2") times 10^n, written in standard form. */
  function standard(coef, n) {
    const neg = String(coef).startsWith("-");
    const [w, f = ""] = String(coef).replace("-", "").split(".");
    let digits = w + f, pos = w.length + n;
    if (pos <= 0) { digits = "0".repeat(1 - pos) + digits; pos = 1; }
    if (pos > digits.length) digits += "0".repeat(pos - digits.length);
    const int = digits.slice(0, pos).replace(/^0+(?=\d)/, ""), frac = digits.slice(pos).replace(/0+$/, "");
    return (neg ? "−" : "") + group(int) + (frac ? "." + frac : "");
  }
  /** A tidy coefficient string (no floating-point noise). */
  const cs = (x, d = 4) => minus(String(parseFloat(Number(x).toFixed(d))));
  const sci = (c, n) => `${c} × ${p10(n)}`;
  const WORDS = { "-9": "one billionth", "-8": "one hundred-millionth", "-7": "one ten-millionth", "-6": "one millionth", "-5": "one hundred-thousandth", "-4": "one ten-thousandth", "-3": "one thousandth", "-2": "one hundredth", "-1": "one tenth", 0: "one", 1: "ten", 2: "one hundred", 3: "one thousand", 4: "ten thousand", 5: "one hundred thousand", 6: "one million", 7: "ten million", 8: "one hundred million", 9: "one billion", 10: "ten billion", 11: "one hundred billion", 12: "one trillion" };

  // ------------------------------------------------------------ zoom

  const OBJ = [
    { name: "Width of a DNA strand", c: "2", n: -9, kind: "dna" },
    { name: "A virus", c: "1", n: -7, kind: "virus" },
    { name: "A red blood cell", c: "8", n: -6, kind: "cell" },
    { name: "A grain of sand", c: "5", n: -4, kind: "sand" },
    { name: "An ant", c: "5", n: -3, kind: "ant" },
    { name: "A Grade 7 learner (height)", c: "1.5", n: 0, kind: "person" },
    { name: "The LSGH campus (across, about)", c: "3", n: 2, kind: "campus" },
    { name: "Height of Mt. Apo", c: "2.954", n: 3, kind: "mountain" },
    { name: "Length of the Philippines (north to south)", c: "1.85", n: 6, kind: "islands" },
    { name: "Earth’s diameter", c: "1.2742", n: 7, kind: "earth" },
    { name: "Earth–Moon distance", c: "3.844", n: 8, kind: "moon" },
    { name: "Earth–Sun distance", c: "1.496", n: 11, kind: "sun" },
  ];
  const U = 40; // pixels for 10^e metres at zoom e

  function glyph(kind, d, cx, cy) {
    const g = s("g");
    const A = (tag, at) => g.append(s(tag, at));
    const ink = "var(--ink)";
    if (kind === "dna") {
      const ht = d * 3, pts1 = [], pts2 = [];
      for (let i = 0; i <= 24; i++) { const y = cy - ht / 2 + (ht * i) / 24, x = Math.sin((i / 24) * Math.PI * 4) * (d / 2); pts1.push(`${cx + x},${y}`); pts2.push(`${cx - x},${y}`); if (i % 2 === 0) A("line", { x1: cx + x, y1: y, x2: cx - x, y2: y, stroke: "var(--muted)", "stroke-width": 1 }); }
      A("polyline", { points: pts1.join(" "), fill: "none", stroke: "var(--shape-a)", "stroke-width": 3 }); A("polyline", { points: pts2.join(" "), fill: "none", stroke: "var(--shape-b)", "stroke-width": 3 });
    } else if (kind === "virus") {
      for (let i = 0; i < 12; i++) { const a = (i * Math.PI) / 6; A("line", { x1: cx + Math.cos(a) * d * 0.4, y1: cy + Math.sin(a) * d * 0.4, x2: cx + Math.cos(a) * d * 0.62, y2: cy + Math.sin(a) * d * 0.62, stroke: "var(--good)", "stroke-width": Math.max(1, d / 30) }); }
      A("circle", { cx, cy, r: d * 0.42, fill: "color-mix(in srgb, var(--good) 25%, transparent)", stroke: "var(--good)", "stroke-width": 2 });
    } else if (kind === "cell") {
      A("circle", { cx, cy, r: d / 2, fill: "var(--shape-b-soft)", stroke: "var(--shape-b)", "stroke-width": 3 });
      A("circle", { cx, cy, r: d / 4, fill: "none", stroke: "var(--shape-b)", "stroke-width": 1.5, "stroke-dasharray": "4 4" });
    } else if (kind === "sand") {
      const pts = [0, 1, 2, 3, 4, 5, 6, 7].map((i) => { const a = (i * Math.PI) / 4, r = (d / 2) * [1, 0.85, 0.95, 0.8, 1, 0.9, 0.78, 0.92][i]; return `${cx + Math.cos(a) * r},${cy + Math.sin(a) * r * 0.85}`; });
      A("polygon", { points: pts.join(" "), fill: "var(--gold-soft)", stroke: "var(--gold)", "stroke-width": 2 });
    } else if (kind === "ant") {
      [[-0.36, 0.13], [-0.08, 0.1], [0.27, 0.2]].forEach(([dx, r]) => A("ellipse", { cx: cx + dx * d, cy, rx: r * d, ry: r * d * 0.7, fill: ink }));
      const sw = Math.max(1, d / 60), tx = cx - 0.08 * d;
      for (const i of [-1, 0, 1]) for (const sg of [-1, 1]) A("polyline", { points: `${tx + i * 0.04 * d},${cy} ${tx + i * 0.14 * d},${cy + sg * 0.2 * d} ${tx + i * 0.26 * d},${cy + sg * 0.3 * d}`, fill: "none", stroke: ink, "stroke-width": sw });
      for (const sg of [-1, 1]) A("polyline", { points: `${cx + 0.5 * d},${cy} ${cx + 0.62 * d},${cy + sg * 0.14 * d} ${cx + 0.7 * d},${cy + sg * 0.1 * d}`, fill: "none", stroke: ink, "stroke-width": sw });
    } else if (kind === "person") {
      const top = cy - d / 2, sw = Math.max(1.5, d / 25);
      A("circle", { cx, cy: top + d * 0.09, r: d * 0.09, fill: "none", stroke: ink, "stroke-width": sw });
      A("path", { d: `M${cx},${top + d * 0.18} V${top + d * 0.6} M${cx - d * 0.16},${top + d * 0.3} H${cx + d * 0.16} M${cx},${top + d * 0.6} L${cx - d * 0.12},${top + d} M${cx},${top + d * 0.6} L${cx + d * 0.12},${top + d}`, fill: "none", stroke: ink, "stroke-width": sw, "stroke-linecap": "round" });
    } else if (kind === "campus") {
      A("rect", { x: cx - d / 2, y: cy - d * 0.3, width: d, height: d * 0.6, fill: "var(--accent-soft)", stroke: "var(--accent)", "stroke-width": 2 });
      [[-0.4, -0.2, 0.3, 0.18], [0.05, -0.2, 0.32, 0.14], [-0.35, 0.05, 0.22, 0.18], [0.1, 0.06, 0.12, 0.12]].forEach(([x, y, w, hh]) => A("rect", { x: cx + x * d, y: cy + y * d, width: w * d, height: hh * d, fill: "var(--paper)", stroke: "var(--accent)" }));
    } else if (kind === "mountain") {
      A("path", { d: `M${cx - d * 1.3},${cy + d / 2} L${cx},${cy - d / 2} L${cx + d * 1.3},${cy + d / 2} Z`, fill: "var(--accent-soft)", stroke: "var(--accent)", "stroke-width": 2 });
      A("path", { d: `M${cx - d * 0.25},${cy - d * 0.3} L${cx},${cy - d / 2} L${cx + d * 0.25},${cy - d * 0.3}`, fill: "none", stroke: ink, "stroke-width": 2 });
    } else if (kind === "islands") {
      const t = cy - d / 2;
      [[0, 0.02, 0.1, 0.22], [0.02, 0.33, 0.07, 0.08], [0.06, 0.55, 0.12, 0.07], [-0.12, 0.6, 0.04, 0.1], [0.12, 0.84, 0.13, 0.12]].forEach(([dx, y, rx, ry]) => A("ellipse", { cx: cx + dx * d, cy: t + (y + ry / 2) * d + ry * d * 0.3, rx: rx * d, ry: ry * d * 0.6, fill: "var(--accent-soft)", stroke: "var(--accent)", "stroke-width": 2 }));
    } else if (kind === "earth") {
      A("circle", { cx, cy, r: d / 2, fill: "var(--shape-a-soft)", stroke: "var(--shape-a)", "stroke-width": 3 });
      A("ellipse", { cx: cx - d * 0.12, cy: cy - d * 0.1, rx: d * 0.16, ry: d * 0.1, fill: "var(--accent-soft)", stroke: "var(--accent)" });
      A("ellipse", { cx: cx + d * 0.16, cy: cy + d * 0.14, rx: d * 0.1, ry: d * 0.16, fill: "var(--accent-soft)", stroke: "var(--accent)" });
    } else if (kind === "moon" || kind === "sun") {
      const x0 = cx - d / 2, x1 = cx + d / 2;
      A("line", { x1: x0, y1: cy, x2: x1, y2: cy, stroke: "var(--muted)", "stroke-width": 2, "stroke-dasharray": "6 5" });
      if (kind === "moon") { A("circle", { cx: x0, cy, r: 9, fill: "var(--shape-a)" }); A("circle", { cx: x1, cy, r: 5, fill: "var(--muted)" }); }
      else { A("circle", { cx: x0, cy, r: 16, fill: "var(--gold)" }); A("circle", { cx: x1, cy, r: 5, fill: "var(--shape-a)" }); }
    }
    return g;
  }

  function zoom(root) {
    let e = 0;
    const svg = s("svg", { viewBox: "0 0 600 320", role: "img", "aria-label": "Objects shown at the chosen power of ten" });
    const card = h("div", { class: "stage-body", "aria-live": "polite" });
    function draw() {
      clear(svg);
      const ne = Math.round(e);
      svg.append(s("rect", { x: 0, y: 0, width: 600, height: 320, fill: "var(--bg)" }));
      let focus = null;
      OBJ.forEach((o) => {
        const L = Math.log10(parseFloat(o.c)) + o.n, d = U * 10 ** (L - e);
        if (d < 1.5 || d > 1600) return;
        const isF = o.n === ne;
        if (isF) focus = o;
        const g = glyph(o.kind, d, 300, 150);
        g.setAttribute("opacity", isF ? "1" : "0.28");
        svg.append(g);
      });
      if (focus) svg.append(s("text", { x: 300, y: 22, "text-anchor": "middle", class: "svg-text", "font-weight": 700 }, focus.name));
      const bar = U * 10 ** (ne - e);
      svg.append(s("rect", { x: 20, y: 286, width: bar, height: 8, fill: "var(--ink)" }), s("text", { x: 24 + bar + 6, y: 295, class: "svg-text", "font-weight": 700 }, `= ${p10(ne)} m`));
      svg.append(s("text", { x: 580, y: 295, "text-anchor": "end", class: "svg-label" }, `each step of the slider: × 10`));
      clear(card);
      card.append(h("div", { class: "readout" }, stat("Scale:", `${p10(ne)} m`).el, stat("Standard form:", `${standard("1", ne)} m`).el, stat("In words:", ne < 0 ? `${WORDS[ne]} of a metre` : `${WORDS[ne]} metre${ne === 0 ? "" : "s"}`).el));
      if (focus) card.append(h("p", { class: "unit-big" }, `${focus.name}: ≈ ${sci(focus.c, focus.n)} m`), h("p", { class: "workings" }, `= ${standard(focus.c, focus.n)} m`));
      else card.append(h("p", { class: "note" }, "No object from our list at exactly this power of ten – keep zooming."));
      if (ne === 9) card.append(h("p", { class: "note" }, "A billion is 1 000 000 000 = 10⁹. One billion metres is about 2.6 times the Earth–Moon distance!"));
    }
    const zs = elasticSlider({ id: "t3l9-zoom", label: "Zoom", min: -9, max: 12, value: 0, step: 1, format: (v) => p10(Math.round(v)) + " m", onInput: (v) => { e = v; draw(); } });
    const chips = h("div", { class: "choices" }, OBJ.map((o) => h("button", { type: "button", onclick: () => zs.set(o.n) }, o.name.replace(/ \(.*\)/, ""))));
    root.append(h("div", { class: "controls" }, zs.el), svg, card, h("p", { class: "note" }, "Jump to an object (the zoom glides there):"), chips,
      h("p", { class: "note" }, "Each step right makes the scale 10 times bigger; each step left makes it 10 times smaller. Positive exponents: big numbers. Negative exponents: numbers between 0 and 1."));
    draw();
  }

  // ------------------------------------------------------------ convert

  const NUMS = [
    { name: "Philippine population", str: "112000000", unit: "people" },
    { name: "Height of Mt. Apo", str: "2954", unit: "m" },
    { name: "Speed of light", str: "300000000", unit: "m/s" },
    { name: "Grain of sand", str: "0.0005", unit: "m" },
    { name: "Red blood cell", str: "0.000008", unit: "m" },
    { name: "A virus", str: "0.0000001", unit: "m" },
  ];

  function convert(root) {
    let which = 0, mode = "std", pos = 1;
    let N = parse(NUMS[0].str);
    function parse(str) { const digits = str.replace(".", ""); return { digits, orig: str.includes(".") ? str.indexOf(".") : str.length, sciPos: digits.search(/[1-9]/) + 1, len: digits.length }; }
    const svg = s("svg", { viewBox: "0 0 600 200", role: "img", "aria-label": "Digits with a draggable decimal point" });
    const digitsG = s("g"), arcs = s("g"), point = s("g", { class: "token", tabindex: 0, "aria-label": "Decimal point. Drag it left or right." });
    point.append(s("rect", { x: -20, y: -70, width: 40, height: 100, fill: "transparent" }), s("circle", { r: 8, fill: "var(--shape-b)" }), s("path", { d: "M-9,22 l9,-10 l9,10 z", fill: "var(--shape-b)", opacity: 0.6 }));
    svg.append(digitsG, arcs, point);
    const out = h("p", { class: "unit-big", "aria-live": "polite" }), status = h("div"), work = h("pre", { class: "workings" });
    const cw = () => Math.min(46, 540 / N.len), x0 = () => 300 - (N.len * cw()) / 2, gx = (p) => x0() + p * cw();
    const sp = new Spring(pos, (v) => { pos = v; paint(); }, { stiffness: 240, damping: 16 });
    Sim.draggable(svg, point, (p) => { sp.stop(); pos = Sim.rubber((p.x - x0()) / cw(), 1, N.len, 0.3); sp.value = pos; sp.vel = 0; paint(); }, () => sp.set(clamp(Math.round(pos), 1, N.len)));

    function coefAt(p) {
      const left = N.digits.slice(0, p).replace(/^0+(?=\d)/, ""), right = N.digits.slice(p).replace(/0+$/, "");
      return left + (right ? "." + right : "");
    }
    function drawDigits() {
      clear(digitsG);
      for (let i = 0; i < N.len; i++) digitsG.append(s("text", { x: x0() + (i + 0.5) * cw(), y: 128, "text-anchor": "middle", class: "svg-text", style: `font-size:${Math.min(34, cw() * 0.85)}px`, "font-weight": 700 }, N.digits[i]));
      digitsG.append(s("circle", { cx: gx(N.orig), cy: 160, r: 4, fill: "var(--muted)" }), s("text", { x: gx(N.orig), y: 182, "text-anchor": "middle", class: "svg-label", style: "font-size:12px" }, "start"));
    }
    function paint() {
      point.setAttribute("transform", `translate(${gx(pos)},136)`);
      const rp = clamp(Math.round(pos), 1, N.len), n = N.orig - rp;
      clear(arcs);
      const lo = Math.min(N.orig, rp), hi = Math.max(N.orig, rp), col = n > 0 ? "var(--shape-b)" : "var(--shape-a)";
      for (let j = lo; j < hi; j++) {
        const a = gx(j), b = gx(j + 1), tip = n > 0 ? a : b;
        arcs.append(s("path", { d: `M${n > 0 ? b : a},84 Q${(a + b) / 2},${84 - Math.min(30, cw() * 0.7)} ${tip},84`, fill: "none", stroke: col, "stroke-width": 2 }), s("circle", { cx: tip, cy: 84, r: 3, fill: col }));
      }
      if (n) arcs.append(s("text", { x: (gx(lo) + gx(hi)) / 2, y: 40, "text-anchor": "middle", class: "svg-text", "font-weight": 700, style: `fill:${col}` }, `${Math.abs(n)} hop${Math.abs(n) === 1 ? "" : "s"} ${n > 0 ? "left" : "right"}`));
      const c = coefAt(rp), isSci = rp === N.sciPos;
      out.textContent = `${c} × ${p10(n)}  =  ${standard(N.digits.slice(0, N.orig) + "." + N.digits.slice(N.orig), 0)} ${NUMS[which].unit}`;
      clear(status);
      if (mode === "std") status.append(isSci ? pill(true, `Scientific notation! 1 ≤ ${c} < 10`, "") : pill(false, "", "Not yet: the coefficient must be at least 1 and less than 10"));
      else status.append(n === 0 ? pill(true, "Standard form! The exponent is 0, and 10⁰ = 1.", "") : pill(false, "", `Exponent ${minus(n)}: keep hopping until it is 0`));
      work.textContent = `Decimal point moved ${Math.abs(n)} place${Math.abs(n) === 1 ? "" : "s"} ${n > 0 ? "to the LEFT  → exponent +" + n + " (a big number)" : n < 0 ? "to the RIGHT → exponent " + minus(n) + " (a number between 0 and 1)" : "(not yet)"}` +
        `\nThe value never changes: every hop left divides the coefficient by 10 and multiplies by 10 once more.`;
    }
    function load() {
      N = parse(NUMS[which].str); drawDigits();
      sp.jump(mode === "std" ? N.orig : N.sciPos);
    }
    const hop = (d) => { const t = clamp(Math.round(sp.target) + d, 1, N.len); sp.set(t); };
    root.append(
      h("div", { class: "controls" }, segmented(NUMS.map((_, i) => i), 0, (i) => { which = i; load(); }, (i) => NUMS[i].name)),
      h("div", { class: "controls" }, segmented(["std", "sci"], mode, (m) => { mode = m; load(); }, (m) => (m === "std" ? "Standard → Scientific" : "Scientific → Standard")),
        h("button", { class: "btn ghost", type: "button", onclick: () => hop(-1) }, "◀ Hop"),
        h("button", { class: "btn ghost", type: "button", onclick: () => hop(1) }, "Hop ▶"),
        h("button", { class: "btn", type: "button", onclick: () => sp.set(mode === "std" ? N.sciPos : N.orig) }, mode === "std" ? "Show me" : "Show me")),
      svg, out, status, work,
      h("p", { class: "note" }, "Drag the orange decimal point. It slides between the digits and snaps into the nearest gap. The exponent counts the hops: left hops make it positive, right hops make it negative."));
    load();
    return () => sp.stop();
  }

  // ------------------------------------------------------------ operate

  const OPS = [
    { name: "Rice for the nation (×)", op: "×", a: 1.12, m: 8, b: 1.2, k: 2, unit: "kg", text: "Philippine population ≈ 1.12 × 10⁸ people. Each person eats about 1.2 × 10² kg of rice a year. About how much rice is that in one year?" },
    { name: "Sunlight’s trip (÷)", op: "÷", a: 1.5, m: 11, b: 3, k: 8, unit: "s", text: "Sunlight travels about 1.5 × 10¹¹ m to Earth at 3 × 10⁸ m/s. How many seconds does the trip take?" },
    { name: "Manila Bay clean-up (+)", op: "+", a: 3.2, m: 5, b: 4.5, k: 5, unit: "kg", text: "Volunteers collected 3.2 × 10⁵ kg of trash from Manila Bay one month and 4.5 × 10⁵ kg the next. What is the total?" },
    { name: "Phone storage (−)", op: "−", a: 6, m: 7, b: 4, k: 6, unit: "kB", text: "A phone has 6 × 10⁷ kB of free space. A video uses 4 × 10⁶ kB. How much space is left?" },
  ];

  function normalize(c, n) {
    if (Math.abs(c) < 1e-12) return { c: 0, n: 0, moves: 0 };
    let moves = 0;
    while (Math.abs(c) >= 10) { c /= 10; n++; moves++; }
    while (Math.abs(c) < 1) { c *= 10; n--; moves--; }
    c = parseFloat(c.toPrecision(8));
    if (Math.abs(c) >= 10) { c /= 10; n++; moves++; }
    return { c, n, moves };
  }
  function compute(op, a, m, b, k) {
    const steps = [], E = (x, y, sign) => `10^(${minus(x)} ${sign} ${y < 0 ? "(" + minus(y) + ")" : y})`;
    let raw, rn;
    steps.push(`(${sci(cs(a), m)}) ${op} (${sci(cs(b), k)})`);
    if (op === "×" || op === "÷") {
      raw = op === "×" ? a * b : a / b; rn = op === "×" ? m + k : m - k;
      steps.push(`= (${cs(a)} ${op} ${cs(b)}) × ${E(m, k, op === "×" ? "+" : "−")}     ${op === "×" ? "multiply the coefficients, ADD the exponents" : "divide the coefficients, SUBTRACT the exponents"}`);
    } else {
      const hi = Math.max(m, k);
      const a2 = parseFloat((a * 10 ** (m - hi)).toPrecision(10)), b2 = parseFloat((b * 10 ** (k - hi)).toPrecision(10));
      if (m !== k) steps.push(`= (${sci(cs(a2, 8), hi)}) ${op} (${sci(cs(b2, 8), hi)})     rewrite with the same power, ${p10(hi)}`);
      raw = op === "+" ? a2 + b2 : a2 - b2; rn = hi;
      steps.push(`= (${cs(a2, 8)} ${op} ${cs(b2, 8)}) × ${p10(hi)}     ${op === "+" ? "add" : "subtract"} the coefficients, keep the power`);
    }
    steps.push(`= ${sci(cs(raw, 6), rn)}`);
    const r = normalize(raw, rn);
    if (r.moves) steps.push(`= ${sci(cs(r.c, 6), r.n)}     ${cs(Math.abs(raw), 6)} is not from 1 to less than 10: move the point ${Math.abs(r.moves)} place${Math.abs(r.moves) === 1 ? "" : "s"}, exponent ${r.moves > 0 ? "+" : "−"} ${Math.abs(r.moves)}`);
    return { ...r, steps };
  }

  function operate(root) {
    let op = "×", a = 1.12, m = 8, b = 1.2, k = 2, preset = 0;
    const X = (n) => 30 + (n + 22) * (540 / 47);
    const line = s("svg", { viewBox: "0 0 600 150", role: "img", "aria-label": "Exponents on a number line" });
    const base = s("g"), marks = s("g"); line.append(base, marks);
    base.append(s("line", { x1: X(-22), y1: 80, x2: X(25), y2: 80, stroke: "var(--ink)", "stroke-width": 2 }), s("text", { x: 300, y: 16, "text-anchor": "middle", class: "svg-label" }, "the exponents on a number line"));
    for (let n = -22; n <= 25; n++) base.append(s("line", { x1: X(n), y1: 75, x2: X(n), y2: 85, stroke: "var(--ink)", "stroke-width": n % 5 === 0 ? 2 : 1 }));
    for (let n = -20; n <= 25; n += 5) base.append(s("text", { x: X(n), y: 102, "text-anchor": "middle", class: "svg-text", style: "font-size:11px" }, minus(n)));
    const ctx = h("p", { class: "bigq" }), out = h("p", { class: "unit-big", "aria-live": "polite" }), std = h("p", { class: "note" }), work = h("pre", { class: "workings" });
    let mk = [m, k, m + k];
    const msp = new Spring(mk, (v) => { mk = v; drawMarks(); }, { stiffness: 170, damping: 14 });
    function drawMarks() {
      clear(marks);
      const [pm, pk, pr] = mk;
      marks.append(s("path", { d: `M${X(pm)},72 l-8,-14 h16 z`, fill: "var(--shape-a)" }), s("text", { x: X(pm), y: 50, "text-anchor": "middle", class: "svg-text", style: "fill:var(--shape-a)", "font-weight": 700 }, `first ${minus(Math.round(pm))}`));
      marks.append(s("path", { d: `M${X(pk)},72 l-8,-14 h16 z`, fill: "var(--shape-b)" }), s("text", { x: X(pk), y: 34, "text-anchor": "middle", class: "svg-text", style: "fill:var(--shape-b)", "font-weight": 700 }, `second ${minus(Math.round(pk))}`));
      marks.append(s("path", { d: `M${X(pr)},88 l-9,16 h18 z`, fill: "var(--gold)" }), s("text", { x: X(pr), y: 130, "text-anchor": "middle", class: "svg-text", style: "fill:var(--gold)", "font-weight": 700 }, `answer ${minus(Math.round(pr))}`));
    }
    function update() {
      const A = Math.round(a * 100) / 100, B = Math.round(b * 100) / 100, M = Math.round(m), K = Math.round(k);
      const r = compute(op, A, M, B, K), P = preset >= 0 ? OPS[preset] : null;
      const unit = P ? " " + P.unit : "";
      ctx.textContent = P ? P.text : "Your own numbers: change the coefficients and exponents.";
      out.textContent = r.c === 0 ? "= 0" : `= ${sci(cs(r.c, 6), r.n)}${unit}`;
      std.textContent = r.c !== 0 && r.n >= -9 && r.n <= 12 ? `Standard form: ${standard(String(parseFloat(r.c.toFixed(6))), r.n)}${unit}` : "";
      work.textContent = r.steps.join("\n");
      msp.set([m, k, r.c === 0 ? 0 : r.n]);
    }
    const sl = (id, label, min, max, value, step, set, f) => elasticSlider({ id, label, min, max, value, step, format: f, onInput: (v) => { set(v); update(); }, onChange: () => { preset = -1; update(); } });
    const fC = (v) => fmt(v, 2), fE = (v) => minus(Math.round(v));
    const sa = sl("t3l9-a", "1st coefficient", 1, 9.99, a, 0.01, (v) => { a = v; }, fC), sm = sl("t3l9-m", "1st exponent", -9, 12, m, 1, (v) => { m = v; }, fE);
    const sb = sl("t3l9-b", "2nd coefficient", 1, 9.99, b, 0.01, (v) => { b = v; }, fC), sk = sl("t3l9-k", "2nd exponent", -9, 12, k, 1, (v) => { k = v; }, fE);
    const opSeg = h("div", { class: "controls" });
    const mkOpSeg = () => { clear(opSeg); opSeg.append(segmented(["×", "÷", "+", "−"], op, (v) => { op = v; preset = -1; update(); }, (v) => `  ${v}  `)); };
    function load(i) {
      const P = OPS[i]; op = P.op; mkOpSeg();
      sa.set(P.a); sm.set(P.m); sb.set(P.b); sk.set(P.k);
      preset = i; update();
    }
    const presetRow = h("div", { class: "choices" }, OPS.map((P, i) => h("button", { type: "button", onclick: () => load(i) }, P.name)));
    root.append(presetRow, ctx, opSeg, h("div", { class: "controls" }, sa.el, sm.el), h("div", { class: "controls" }, sb.el, sk.el), out, std, work, line,
      h("p", { class: "note" }, "× : multiply the coefficients and ADD the exponents. ÷ : divide the coefficients and SUBTRACT the exponents. + and − : first write both numbers with the same power of 10. Always finish with a coefficient from 1 to less than 10."));
    mkOpSeg(); preset = 0; update(); msp.jump([m, k, compute(op, a, m, b, k).n]);
    return () => msp.stop();
  }

  // ------------------------------------------------------------ register

  Sim.register({
    id: "lesson27", unit: "J", num: 9, letter: "I", title: "Scientific Notation", simName: "Powers-of-Ten Zoom",
    comps: ["A17", "A18", "M9"], cycles: "C9,M2 – C10,M1", deped: "DepEd Weeks 9–10",
    bigQuestion: "How many heads will you get in 100 tosses – and how big is a billion?",
    mission: [
      "Zoom: glide from a virus to the Earth–Sun distance. How many steps of × 10 is that?",
      "Zoom to 10⁹ m. Write one billion in standard form. How many zeros does it have?",
      "Convert: drag the decimal point of the Philippine population until you get scientific notation. What is the exponent? Now try a virus – why is its exponent negative?",
      "Operate: use the rice preset. Why do we ADD the exponents when we multiply?",
    ],
    discovery: "Scientific notation writes a number as a × 10ⁿ with 1 ≤ a < 10 and n an integer. The exponent counts how many places the decimal point moves: positive for large numbers, negative for numbers between 0 and 1, and each step up in the exponent makes a number 10 times bigger. A billion is 10⁹ = 1 000 000 000. To multiply, multiply the coefficients and add the exponents; to divide, divide and subtract; to add or subtract, use the same power of 10 first.",
    mount(stage) {
      const body = h("div", { class: "stage-body" });
      const views = [zoom, convert, operate];
      let stopper = null;
      const t = tabs(["Zoom", "Convert", "Operate"], (i) => { if (stopper) stopper(); clear(body); stopper = views[i](body) || null; });
      stage.append(t.el, body);
      stopper = zoom(body);
      return () => { if (stopper) stopper(); };
    },
    check() {
      const kind = randInt(0, 5);
      const cStr = String(randInt(11, 99) / 10); // e.g. "3.5" or "4"
      if (kind === 0 || kind === 1) {
        const n = kind === 0 ? randInt(3, 9) : -randInt(2, 7);
        const wrongBig = sci(cs(parseFloat(cStr) * 10), n - 1);
        const opts = shuffle([sci(cStr, n), sci(cStr, n + 1), sci(cStr, -n), wrongBig]);
        return { q: `Write ${standard(cStr, n)} in scientific notation.`, choices: [...new Set(opts)], answer: sci(cStr, n), explain: `Move the decimal point ${Math.abs(n)} places to the ${n > 0 ? "left" : "right"} to get ${cStr}: ${sci(cStr, n)}.` };
      }
      if (kind === 2) {
        const n = pick([randInt(3, 9), -randInt(2, 7)]);
        return { q: `When ${standard(cStr, n)} is written in scientific notation, what is the exponent of 10?`, answer: n, tol: 0, explain: `${standard(cStr, n)} = ${sci(cStr, n)}.` };
      }
      if (kind === 3) {
        const n = pick([randInt(2, 6), -randInt(2, 5)]);
        const val = parseFloat(`${cStr}e${n}`);
        return { q: `Write ${sci(cStr, n)} in standard form.`, answer: val, tol: Math.abs(val) * 1e-9, hint: "Type the number without spaces.", explain: `Move the decimal point ${Math.abs(n)} places to the ${n > 0 ? "right" : "left"}: ${standard(cStr, n)}.` };
      }
      if (kind === 4) {
        const p = pick([[2, 3], [2, 4], [3, 3], [1.5, 4], [2.5, 2], [4, 2], [1.2, 3], [3, 2]]), m = randInt(-4, 8), k = randInt(-4, 8);
        const prod = cs(p[0] * p[1]), n = m + k;
        const opts = shuffle([sci(prod, n), sci(prod, m * k), sci(cs(p[0] + p[1]), n), sci(prod, n + 1)]);
        return { q: `Multiply: (${sci(cs(p[0]), m)}) × (${sci(cs(p[1]), k)})`, choices: [...new Set(opts)], answer: sci(prod, n), explain: `${cs(p[0])} × ${cs(p[1])} = ${prod}; ${minus(m)} + ${k < 0 ? "(" + minus(k) + ")" : k} = ${minus(n)}.` };
      }
      return pick([
        { q: "Which number is in scientific notation?", choices: ["3.6 × 10⁻²", "36 × 10³", "0.36 × 10²", "3.6 × 100"], answer: "3.6 × 10⁻²", explain: "The coefficient must be at least 1 and less than 10, times a power of 10." },
        { q: "Which is greater: 9.9 × 10⁴ or 1.1 × 10⁵?", choices: ["9.9 × 10⁴", "1.1 × 10⁵"], answer: "1.1 × 10⁵", explain: "Compare the exponents first: 10⁵ is 10 times 10⁴, so 1.1 × 10⁵ = 110 000 > 99 000." },
        { q: "A number in scientific notation has a negative exponent. What do you know about it?", choices: ["It is between 0 and 1", "It is negative", "It is greater than 10", "It is a whole number"], answer: "It is between 0 and 1", explain: "A negative exponent means the decimal point moved to the right: a small positive number." },
        { q: "How many zeros does one billion (10⁹) have in standard form?", choices: ["6", "9", "10", "12"], answer: "9", explain: "10⁹ = 1 000 000 000: a 1 followed by 9 zeros." },
      ]);
    },
  });
})();
