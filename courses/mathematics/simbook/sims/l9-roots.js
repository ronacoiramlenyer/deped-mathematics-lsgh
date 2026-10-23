/* Lesson 9 · I. Square Roots, Cube Roots, and Irrational Numbers – Roots Lab */
(function () {
  "use strict";
  const { h, s, clear, randInt, pick, shuffle, fmt, parseNumber, tabs, stat, pill, Spring } = Sim;

  const isSquare = (n) => Number.isInteger(Math.sqrt(n));
  const isCube = (n) => Number.isInteger(Math.round(Math.cbrt(n))) && Math.round(Math.cbrt(n)) ** 3 === n;
  const SQRT2 = "1.4142135623730950488016887242096980785696718753769480731766797379";

  // ------------------------------------------------------------ square builder

  function squares(root) {
    let N = 20;
    const pic = s("svg", { viewBox: "0 0 330 360", role: "img", "aria-label": "Square tiles" });
    const out = h("div", { class: "readout" });
    const found = new Set();
    const foundBox = h("p", { class: "workings" });
    const MAX = 100;
    // Every tile has a home; when the count changes, tiles fly to their new places.
    const rects = Array.from({ length: MAX }, () => { const r = s("rect", { rx: 3, width: 0, height: 0 }); pic.append(r); return r; });
    function layout(n) {
      const k = Math.floor(Math.sqrt(n)), left = n - k * k;
      const cell = Math.min(30, 300 / (k + 2));
      const cols = Math.max(k, 1);
      return Array.from({ length: MAX }, (_, t) => {
        if (t < k * k) return [10 + (t % k) * cell, 10 + Math.floor(t / k) * cell, cell - 2, 0];
        if (t < n) { const u = t - k * k; return [10 + (u % cols) * cell, 22 + (k + Math.floor(u / cols)) * cell, cell - 2, 1]; }
        return [320, 340, 0, 1];
      }).flat();
    }
    const fly = new Spring(layout(N), (v) => {
      for (let t = 0; t < MAX; t++) {
        const [x, y, w, kind] = v.slice(t * 4, t * 4 + 4);
        const r = rects[t];
        r.setAttribute("x", x); r.setAttribute("y", y); r.setAttribute("width", Math.max(0, w)); r.setAttribute("height", Math.max(0, w));
        const leftover = kind > 0.5;
        r.setAttribute("fill", leftover ? "var(--shape-b-soft)" : "var(--shape-a-soft)");
        r.setAttribute("stroke", leftover ? "var(--shape-b)" : "var(--shape-a)");
      }
    }, { stiffness: 160, damping: 15 });
    fly.jump(layout(N));
    function report(n) {
      const k = Math.floor(Math.sqrt(n)), left = n - k * k;
      clear(out);
      if (left === 0) { found.add(n); out.append(pill(true, `${n} is a perfect square: ${k} × ${k} = ${n}, so √${n} = ${k}`, "")); }
      else out.append(stat("Biggest square:", `${k} × ${k} = ${k * k}`).el, stat("Leftover tiles:", String(left)).el, pill(false, "", `${n} is not a perfect square; √${n} is between ${k} and ${k + 1}`));
      foundBox.textContent = "Perfect squares you found: " + ([...found].sort((a, b) => a - b).join(", ") || "none yet");
    }
    const slider = Sim.elasticSlider({ id: "l9-n", label: "Tiles", min: 1, max: MAX, value: N, step: 1, format: (v) => String(Math.round(v)),
      onInput: (v) => { const n = Math.round(v); if (n !== N) { N = n; fly.set(layout(N)); report(N); } } });
    root.append(h("div", { class: "controls" }, slider.el), pic, out, foundBox,
      h("p", { class: "note" }, "Slide through 1 to 100 and watch the tiles rearrange. Which numbers of tiles make a complete square?"));
    report(N);
    return () => fly.stop();
  }

  // ------------------------------------------------------------ cube builder

  function cubes(root) {
    let v = 3;
    const pic = h("div"), out = h("div", { class: "readout" });
    function iso(x, y, z, u) { return { x: 200 + (x - y) * u * 0.866, y: 235 - z * u + (x + y) * u * 0.5 }; }
    function draw() {
      clear(pic); clear(out);
      const u = 150 / Math.max(v, 1);
      const svg = s("svg", { viewBox: "0 0 400 300", role: "img", "aria-label": "A growing cube" });
      const poly = (pts, fill) => svg.append(s("polygon", { points: pts.map((p) => `${p.x},${p.y}`).join(" "), fill, stroke: "var(--ink)", "stroke-width": 1.5 }));
      const ln = (p, q) => svg.append(s("line", { x1: p.x, y1: p.y, x2: q.x, y2: q.y, stroke: "var(--ink)", "stroke-width": 0.8 }));
      poly([iso(0, 0, v, u), iso(v, 0, v, u), iso(v, v, v, u), iso(0, v, v, u)], "var(--gold-soft)");
      poly([iso(v, 0, 0, u), iso(v, v, 0, u), iso(v, v, v, u), iso(v, 0, v, u)], "var(--shape-a-soft)");
      poly([iso(0, v, 0, u), iso(v, v, 0, u), iso(v, v, v, u), iso(0, v, v, u)], "var(--shape-b-soft)");
      for (let k = 1; k < v - 1e-6; k++) {
        ln(iso(k, 0, v, u), iso(k, v, v, u)); ln(iso(0, k, v, u), iso(v, k, v, u));
        ln(iso(v, k, 0, u), iso(v, k, v, u)); ln(iso(v, 0, k, u), iso(v, v, k, u));
        ln(iso(k, v, 0, u), iso(k, v, v, u)); ln(iso(0, v, k, u), iso(v, v, k, u));
      }
      pic.append(svg);
      const n = Math.round(v), settled = Math.abs(v - n) < 0.01;
      out.append(stat("Edge:", settled ? String(n) : fmt(v, 2)).el, stat("Volume:", settled ? `${n} × ${n} × ${n} = ${n ** 3}` : `≈ ${fmt(v ** 3, 1)}`).el,
        settled ? pill(true, `∛${n ** 3} = ${n}`, "") : null);
    }
    root.append(h("div", { class: "controls" }, Sim.elasticSlider({ id: "l9-edge", label: "Edge", min: 1, max: 10, value: 3, step: 1, format: (x) => fmt(x, 1), onInput: (x) => { v = x; draw(); } }).el), pic, out,
      h("p", { class: "note" }, "Perfect cubes: 1, 8, 27, 64, 125, 216, 343, 512, 729, 1 000."));
    draw();
  }

  // ------------------------------------------------------------ estimator

  function estimator(root) {
    let N = 10, kind = 2, lo, hi, tries = [], view = [3, 4];
    const zoom = new Sim.Spring([3, 4], (v) => { view = v; paintLine(); }, { stiffness: 120, damping: 18 });
    const guess = h("input", { type: "text", id: "l9-guess", autocomplete: "off", "aria-label": "Your guess" });
    const area = h("div"), log = h("pre", { class: "workings" });
    const pow = (x) => (kind === 2 ? x * x : x * x * x);
    const sym = () => (kind === 2 ? "√" : "∛");
    function reset() {
      const r = kind === 2 ? Math.sqrt(N) : Math.cbrt(N);
      lo = Math.floor(r + 1e-12); hi = lo + 1; tries = [];
      if (pow(lo) === N) hi = lo;
      zoom.jump(lo === hi ? [lo - 1, lo + 1] : [lo, hi]);
      draw();
    }
    const lineBox = h("div");
    function paintLine() {
      clear(lineBox);
      const [a, b] = view;
      const W = 600, X = (v) => 30 + ((v - a) / ((b - a) || 1)) * (W - 60);
      const svg = s("svg", { viewBox: `0 0 ${W} 100`, role: "img", "aria-label": "Zooming number line" });
      svg.append(s("line", { x1: 30, y1: 50, x2: W - 30, y2: 50, stroke: "var(--ink)", "stroke-width": 2 }));
      if (lo !== hi) svg.append(s("rect", { x: X(lo), y: 40, width: Math.max(0, X(hi) - X(lo)), height: 20, fill: "var(--accent-soft)" }));
      [lo, hi].forEach((v) => { svg.append(s("line", { x1: X(v), y1: 40, x2: X(v), y2: 60, stroke: "var(--ink)", "stroke-width": 2 }), s("text", { x: X(v), y: 82, "text-anchor": "middle", class: "svg-text" }, fmt(v, 4))); });
      tries.forEach((t) => { const x = X(t.g); if (x >= 20 && x <= W - 20) svg.append(s("circle", { cx: x, cy: 50, r: 5, fill: t.high ? "var(--shape-b)" : "var(--shape-a)" })); });
      lineBox.append(svg);
    }
    function draw() {
      clear(area);
      const exact = lo === hi;
      area.append(exact ? pill(true, `${N} is a perfect ${kind === 2 ? "square" : "cube"}: ${sym()}${N} = ${lo}`, "") :
        h("p", {}, `${sym()}${N} is between ${fmt(lo, 4)} and ${fmt(hi, 4)}. Type a guess in between.`), lineBox);
      paintLine();
      log.textContent = tries.map((t) => `${fmt(t.g, 4)}${kind === 2 ? "²" : "³"} = ${fmt(pow(t.g), 4)}  → ${t.high ? "too high" : "too low"}`).join("\n") || "Your guesses will appear here.";
    }
    function tryGuess() {
      const g = parseNumber(guess.value);
      if (!g || lo === hi) return;
      const v = g.value();
      const high = pow(v) > N;
      tries.push({ g: v, high });
      if (v > lo && v < hi) { if (high) hi = v; else lo = v; }
      guess.value = ""; draw();
      const pad = (hi - lo) * 0.25;
      zoom.set([lo - pad, hi + pad]);
    }
    guess.addEventListener("keydown", (e) => { if (e.key === "Enter") tryGuess(); });
    const nS = Sim.elasticSlider({ id: "l9-est", label: "Number", min: 2, max: 200, value: 10, step: 1, format: (v) => String(Math.round(v)),
      onInput: (v) => { const n = Math.round(v); if (n !== N) { N = n; reset(); } } });
    root.append(h("div", { class: "controls" }, nS.el),
      h("div", { class: "controls" },
      Sim.segmented(["√", "∛"], "√", (v) => { kind = v === "√" ? 2 : 3; reset(); }),
      guess, h("button", { class: "btn", type: "button", onclick: tryGuess }, "Try"),
      h("button", { class: "btn ghost", type: "button", onclick: () => { const r = kind === 2 ? Math.sqrt(N) : Math.cbrt(N); log.textContent += `\nCalculator: ${sym()}${N} ≈ ${r.toFixed(6)}`; } }, "Reveal")),
    area, log, h("p", { class: "note" }, "Each guess squeezes the interval and the number line zooms in. How many guesses do you need to get 2 decimal places right?"));
    reset();
    return () => zoom.stop();
  }

  // ------------------------------------------------------------ area 2

  function areaTwo(root) {
    let digits = 4;
    const svg = s("svg", { viewBox: "0 0 320 320", style: "max-width:340px;margin-inline:auto", role: "img", "aria-label": "A tilted square of area 2 inside a 2 by 2 square" });
    const u = 120, o = 40;
    for (let i = 0; i <= 2; i++) {
      svg.append(s("line", { x1: o, y1: o + i * u, x2: o + 2 * u, y2: o + i * u, stroke: "var(--line)", "stroke-width": 2 }));
      svg.append(s("line", { x1: o + i * u, y1: o, x2: o + i * u, y2: o + 2 * u, stroke: "var(--line)", "stroke-width": 2 }));
    }
    const tilt = [[o + u, o], [o + 2 * u, o + u], [o + u, o + 2 * u], [o, o + u]];
    svg.append(s("polygon", { points: tilt.map((p) => p.join(",")).join(" "), fill: "var(--accent-soft)", stroke: "var(--accent)", "stroke-width": 3 }));
    [[o, o], [o + 2 * u, o], [o + 2 * u, o + 2 * u], [o, o + 2 * u]].forEach((c, i) => {
      const a = tilt[i], b = tilt[(i + 3) % 4];
      svg.append(s("polygon", { points: [c, a, b].map((p) => p.join(",")).join(" "), fill: "var(--shape-b-soft)", stroke: "none" }));
    });
    svg.append(s("text", { x: o + u, y: o + u + 5, "text-anchor": "middle", class: "svg-text", "font-weight": 700 }, "area = 2"));
    const dec = h("p", { class: "workings" });
    const show = () => { dec.textContent = `side = √2 ≈ ${SQRT2.slice(0, 2 + digits)}…`; };
    root.append(svg,
      h("pre", { class: "workings" }, "Big square: 2 × 2 = 4\nFour orange corner triangles: 4 × ½ = 2\nTilted square: 4 − 2 = 2  →  side = √2"),
      h("div", { class: "controls" }, h("button", { class: "btn", type: "button", onclick: () => { digits = Math.min(60, digits + 8); show(); } }, "Show more digits")), dec,
      h("p", { class: "note" }, "The digits of √2 never end and never repeat, so √2 cannot be written as a fraction. It is irrational – but it is a real point on the number line."));
    show();
  }

  // ------------------------------------------------------------ lesson

  Sim.register({
    id: "lesson9", unit: "C", num: 9, letter: "I", title: "Square Roots, Cube Roots, and Irrational Numbers", simName: "Roots Lab",
    comps: ["A15", "A16", "M12"], cycles: "C9,M2 – C9,M5", deped: "DepEd Week 10",
    bigQuestion: "Can a square tile have an area of exactly 2 square units?",
    mission: [
      "Square Builder: find every perfect square from 1 to 100.",
      "Cube Builder: build cubes with edges 1 to 5. List the perfect cubes.",
      "Root Estimator: estimate √10 and ∛20 to two decimal places using as few guesses as you can.",
      "Square of Area 2: explain why the tilted square has an area of 2, then answer the Big Question.",
    ],
    discovery: "A perfect square is a whole number times itself (√49 = 7); a perfect cube is a whole number used three times (∛64 = 4). Other numbers have roots between two whole numbers – √10 is between 3 and 4. Roots like √2, √10, and ∛20 are irrational: their decimals never end and never repeat, yet each has an exact place on the number line. A square with an area of 2 has sides of exactly √2.",
    mount(stage) {
      const body = h("div", { class: "stage-body" });
      const views = [squares, cubes, estimator, areaTwo];
      let stopper = null;
      const t = tabs(["Square Builder", "Cube Builder", "Root Estimator", "Square of Area 2"], (i) => { if (stopper) stopper(); clear(body); stopper = views[i](body) || null; });
      stage.append(t.el, body);
      stopper = squares(body);
      return () => { if (stopper) stopper(); };
    },
    check() {
      const kind = randInt(0, 5);
      if (kind === 0) { const k = randInt(4, 20); return { q: `What is √${k * k}?`, answer: k, explain: `${k} × ${k} = ${k * k}.` }; }
      if (kind === 1) { const k = randInt(2, 10); return { q: `What is ∛${k ** 3}?`, answer: k, explain: `${k} × ${k} × ${k} = ${k ** 3}.` }; }
      if (kind === 2) {
        let n; do { n = randInt(5, 150); } while (isSquare(n));
        const k = Math.floor(Math.sqrt(n));
        return { q: `√${n} is between which two consecutive whole numbers? Type the smaller one.`, answer: k, explain: `${k}² = ${k * k} and ${k + 1}² = ${(k + 1) ** 2}, so √${n} is between ${k} and ${k + 1}.` };
      }
      if (kind === 3) {
        const items = shuffle([["√16", true], ["√15", false], ["∛27", true], ["∛9", false], ["0.333…", true], ["1.414", true], ["√(1/4)", true], ["√50", false], ["π", false], ["√36", true]]);
        const [x, rational] = items[0];
        return { q: `Is ${x} rational or irrational?`, choices: ["Rational", "Irrational"], answer: rational ? "Rational" : "Irrational", explain: rational ? `${x} can be written as a fraction.` : `${x} has a decimal that never ends and never repeats.` };
      }
      if (kind === 4) { const k = randInt(3, 15); return { q: `A square garden has an area of ${k * k} m². How long is each side?`, answer: k, unit: "m", explain: `√${k * k} = ${k} m.` }; }
      const k = randInt(2, 9);
      return { q: `A cube-shaped box has a volume of ${k ** 3} cm³. How long is each edge?`, answer: k, unit: "cm", explain: `∛${k ** 3} = ${k} cm.` };
    },
  });
})();
