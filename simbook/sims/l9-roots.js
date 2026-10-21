/* Lesson 9 · I. Square Roots, Cube Roots, and Irrational Numbers – Roots Lab */
(function () {
  "use strict";
  const { h, s, clear, randInt, pick, shuffle, fmt, parseNumber, tabs, stat, pill } = Sim;

  const isSquare = (n) => Number.isInteger(Math.sqrt(n));
  const isCube = (n) => Number.isInteger(Math.round(Math.cbrt(n))) && Math.round(Math.cbrt(n)) ** 3 === n;
  const SQRT2 = "1.4142135623730950488016887242096980785696718753769480731766797379";

  // ------------------------------------------------------------ square builder

  function squares(root) {
    const N = h("input", { type: "range", id: "l9-n", min: 1, max: 100, value: 20 });
    const NL = h("b", { class: "num" });
    const pic = h("div"), out = h("div", { class: "readout" });
    const found = new Set();
    const foundBox = h("p", { class: "workings" });
    function update() {
      const n = Number(N.value); NL.textContent = String(n);
      const k = Math.floor(Math.sqrt(n)), left = n - k * k;
      const cell = Math.min(26, 300 / (k + 2));
      const cols = Math.max(k, Math.min(left, 12));
      const rowsLeft = Math.ceil(left / Math.max(1, cols));
      const svg = s("svg", { viewBox: `0 0 ${Math.max(cols, k) * cell + 20} ${(k + rowsLeft) * cell + 30}`, role: "img", "aria-label": `${n} square tiles` });
      for (let i = 0; i < k; i++) for (let j = 0; j < k; j++) svg.append(s("rect", { x: 10 + i * cell, y: 10 + j * cell, width: cell - 2, height: cell - 2, rx: 3, fill: "var(--shape-a-soft)", stroke: "var(--shape-a)" }));
      for (let t = 0; t < left; t++) svg.append(s("rect", { x: 10 + (t % cols) * cell, y: 20 + (k + Math.floor(t / cols)) * cell, width: cell - 2, height: cell - 2, rx: 3, fill: "var(--shape-b-soft)", stroke: "var(--shape-b)" }));
      clear(pic); pic.append(svg);
      clear(out);
      if (left === 0) { found.add(n); out.append(pill(true, `${n} is a perfect square: ${k} × ${k} = ${n}, so √${n} = ${k}`, "")); }
      else out.append(stat("Biggest square:", `${k} × ${k} = ${k * k}`).el, stat("Leftover tiles:", String(left)).el, pill(false, "", `${n} is not a perfect square; √${n} is between ${k} and ${k + 1}`));
      foundBox.textContent = "Perfect squares you found: " + ([...found].sort((a, b) => a - b).join(", ") || "none yet");
    }
    N.addEventListener("input", update);
    root.append(h("div", { class: "controls" }, h("label", { for: "l9-n" }, "Number of tiles", N, NL)), pic, out, foundBox,
      h("p", { class: "note" }, "Slide through 1 to 100. Which numbers of tiles make a complete square?"));
    update();
  }

  // ------------------------------------------------------------ cube builder

  function cubes(root) {
    let n = 3;
    const pic = h("div"), out = h("div", { class: "readout" });
    function iso(x, y, z, u) { return { x: 200 + (x - y) * u * 0.866, y: 230 - z * u + (x + y) * u * 0.5 }; }
    function draw() {
      clear(pic); clear(out);
      const u = 150 / n;
      const svg = s("svg", { viewBox: "0 0 400 300", role: "img", "aria-label": `${n} by ${n} by ${n} cube` });
      const face = (pts, fill) => svg.append(s("polygon", { points: pts.map((p) => `${p.x},${p.y}`).join(" "), fill, stroke: "var(--ink)", "stroke-width": 1 }));
      for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
        face([iso(i, j, n, u), iso(i + 1, j, n, u), iso(i + 1, j + 1, n, u), iso(i, j + 1, n, u)], "var(--gold-soft)");
        face([iso(n, i, j, u), iso(n, i + 1, j, u), iso(n, i + 1, j + 1, u), iso(n, i, j + 1, u)], "var(--shape-a-soft)");
        face([iso(i, n, j, u), iso(i + 1, n, j, u), iso(i + 1, n, j + 1, u), iso(i, n, j + 1, u)], "var(--shape-b-soft)");
      }
      pic.append(svg);
      out.append(stat("Edge:", String(n)).el, stat("Unit cubes:", `${n} × ${n} × ${n} = ${n ** 3}`).el, pill(true, `∛${n ** 3} = ${n}`, ""));
    }
    root.append(h("div", { class: "controls" }, h("span", {}, "Edge length"), Sim.segmented([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], n, (v) => { n = v; draw(); })), pic, out,
      h("p", { class: "note" }, "Perfect cubes: 1, 8, 27, 64, 125, 216, 343, 512, 729, 1 000."));
    draw();
  }

  // ------------------------------------------------------------ estimator

  function estimator(root) {
    let N = 10, kind = 2, lo, hi, tries = [];
    const nIn = h("input", { type: "number", id: "l9-est", min: 2, max: 999, value: 10 });
    const guess = h("input", { type: "text", id: "l9-guess", autocomplete: "off", "aria-label": "Your guess" });
    const area = h("div"), log = h("pre", { class: "workings" });
    const pow = (x) => (kind === 2 ? x * x : x * x * x);
    const sym = () => (kind === 2 ? "√" : "∛");
    function reset() {
      N = Math.max(2, Math.round(Number(nIn.value) || 10));
      const r = kind === 2 ? Math.sqrt(N) : Math.cbrt(N);
      lo = Math.floor(r + 1e-12); hi = lo + 1; tries = [];
      if (pow(lo) === N) hi = lo;
      draw();
    }
    function draw() {
      clear(area);
      const exact = lo === hi;
      const W = 600, X = (v) => 30 + ((v - lo) / ((hi - lo) || 1)) * (W - 60);
      const svg = s("svg", { viewBox: `0 0 ${W} 100`, role: "img", "aria-label": "Zooming number line" });
      svg.append(s("line", { x1: 30, y1: 50, x2: W - 30, y2: 50, stroke: "var(--ink)", "stroke-width": 2 }));
      [lo, hi].forEach((v) => { svg.append(s("line", { x1: X(v), y1: 40, x2: X(v), y2: 60, stroke: "var(--ink)", "stroke-width": 2 }), s("text", { x: X(v), y: 82, "text-anchor": "middle", class: "svg-text" }, fmt(v, 4))); });
      tries.forEach((t) => { if (t.g >= lo && t.g <= hi) svg.append(s("circle", { cx: X(t.g), cy: 50, r: 5, fill: t.high ? "var(--shape-b)" : "var(--shape-a)" })); });
      area.append(exact ? pill(true, `${N} is a perfect ${kind === 2 ? "square" : "cube"}: ${sym()}${N} = ${lo}`, "") :
        h("p", {}, `${sym()}${N} is between ${fmt(lo, 4)} and ${fmt(hi, 4)}. Type a guess in between.`), svg);
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
    }
    guess.addEventListener("keydown", (e) => { if (e.key === "Enter") tryGuess(); });
    nIn.addEventListener("input", reset);
    root.append(h("div", { class: "controls" }, h("label", { for: "l9-est" }, "Number", nIn),
      Sim.segmented(["√", "∛"], "√", (v) => { kind = v === "√" ? 2 : 3; reset(); }),
      guess, h("button", { class: "btn", type: "button", onclick: tryGuess }, "Try"),
      h("button", { class: "btn ghost", type: "button", onclick: () => { const r = kind === 2 ? Math.sqrt(N) : Math.cbrt(N); log.textContent += `\nCalculator: ${sym()}${N} ≈ ${r.toFixed(6)}`; } }, "Reveal")),
    area, log, h("p", { class: "note" }, "Each guess squeezes the interval. How many guesses do you need to get 2 decimal places right?"));
    reset();
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
      const t = tabs(["Square Builder", "Cube Builder", "Root Estimator", "Square of Area 2"], (i) => { clear(body); views[i](body); });
      stage.append(t.el, body);
      squares(body);
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
