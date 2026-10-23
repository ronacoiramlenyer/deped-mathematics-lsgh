/* Term 3 · Lesson 8 · H. Experiments and Outcomes – Chance Lab */
(function () {
  "use strict";
  const { h, s, clear, randInt, pick, shuffle, fmt, tabs, stat, pill, Spring, elasticSlider } = Sim;

  const niceMax = (m) => { if (m <= 5) return 5; const p = 10 ** Math.floor(Math.log10(m)); for (const k of [1, 2, 2.5, 5, 10]) if (k * p >= m) return k * p; return 10 * p; };
  const relText = (a, n) => (n ? `${a}/${n} = ${fmt(a / n, 3)} = ${fmt((a / n) * 100, 1)}%` : "–");
  const SOFT = { a: ["var(--shape-a-soft)", "var(--shape-a)"], b: ["var(--shape-b-soft)", "var(--shape-b)"], g: ["var(--gold-soft)", "var(--gold)"] };

  function tallyCell(f) {
    if (f > 30) return h("td", { class: "note" }, "(too many to tally)");
    return h("td", { class: "num tally" }, ...Array.from({ length: Math.floor(f / 5) }, () => h("span", { class: "tally5" }, "||||")), f % 5 ? h("span", {}, "|".repeat(f % 5)) : null);
  }

  /** Bar graph into group g. vals are the (springing) bar heights; the last entry of vals is the springing axis maximum. */
  function barChart(g, { x, y, w, ht, labels, vals, counts, colors }) {
    clear(g);
    const n = labels.length, bw = w / n, max = Math.max(1, vals[n]);
    for (let k = 0; k <= 4; k++) {
      const py = y - (k / 4) * ht;
      g.append(s("line", { x1: x, y1: py, x2: x + w, y2: py, stroke: "var(--grid)" }), s("text", { x: x - 6, y: py + 4, "text-anchor": "end", class: "svg-text", style: "font-size:13px" }, fmt((max * k) / 4, 0)));
    }
    labels.forEach((lab, i) => {
      const v = Math.max(0, vals[i] || 0), bh = Math.min(ht + 12, (v / max) * ht), bx = x + i * bw + bw * 0.16, cx = x + i * bw + bw / 2;
      const [fill, stroke] = SOFT[colors[i]];
      g.append(s("rect", { x: bx, y: y - bh, width: bw * 0.68, height: bh, fill, stroke, "stroke-width": 2, rx: 3 }));
      g.append(s("text", { x: cx, y: y + 18, "text-anchor": "middle", class: "svg-text", style: "font-size:15px" }, lab));
      g.append(s("text", { x: cx, y: y - bh - 6, "text-anchor": "middle", class: "svg-text", style: "font-size:15px", "font-weight": 700 }, String(counts[i])));
    });
    g.append(s("line", { x1: x, y1: y, x2: x + w, y2: y, stroke: "var(--ink)", "stroke-width": 1.5 }));
  }

  /** Runs `total` trials in quick batches (fast mode); returns a stop function. */
  function fastRun(total, trial, after, done) {
    let left = total, raf = 0;
    const per = Math.max(1, Math.ceil(total / 45));
    if (Sim.reducedMotion()) { while (left-- > 0) trial(); after(); done(); return () => {}; }
    const tick = () => {
      for (let k = 0; k < per && left > 0; k++, left--) trial();
      after();
      if (left > 0) raf = requestAnimationFrame(tick); else { raf = 0; done(); }
    };
    raf = requestAnimationFrame(tick);
    return () => { if (raf) cancelAnimationFrame(raf); raf = 0; };
  }

  // ------------------------------------------------------------ coin toss

  function coin(root) {
    let nH = 0, nT = 0, hist = [], angle = 0, target = 0, start = 0, pending = null, stopFast = null;
    const svg = s("svg", { viewBox: "0 0 600 250", role: "img", "aria-label": "A tossed coin and a bar graph of heads and tails" });
    const shadow = s("ellipse", { cx: 110, cy: 228, rx: 50, ry: 7, fill: "var(--line)" });
    const coinG = s("g"), inner = s("g"), barsG = s("g");
    const disc = s("circle", { r: 58, fill: "var(--gold-soft)", stroke: "var(--gold)", "stroke-width": 5 });
    const letter = s("text", { y: 14, "text-anchor": "middle", class: "svg-text", style: "font-size:40px", "font-weight": 700 }, "H");
    inner.append(disc, s("circle", { r: 45, fill: "none", stroke: "var(--gold)", "stroke-width": 1.5, "stroke-dasharray": "3 4" }), letter);
    coinG.append(inner);
    const faceLabel = s("text", { x: 110, y: 22, "text-anchor": "middle", class: "svg-label" }, "Heads");
    svg.append(shadow, coinG, faceLabel, barsG);
    const plot = s("svg", { viewBox: "0 0 600 210", role: "img", "aria-label": "Fraction of heads as the number of tosses grows" });
    const tbody = h("tbody"), out = h("div", { class: "readout" });

    function paintCoin() {
      const c = Math.cos(angle), heads = c >= 0;
      const q = start === target ? 1 : (angle - start) / (target - start);
      const lift = Math.max(-6, 380 * q * (1 - q));
      coinG.setAttribute("transform", `translate(110,${160 - lift})`);
      inner.setAttribute("transform", `scale(1,${Math.max(0.06, Math.abs(c))})`);
      letter.textContent = heads ? "H" : "T";
      disc.setAttribute("fill", heads ? "var(--gold-soft)" : "var(--shape-a-soft)");
      shadow.setAttribute("rx", String(Math.max(20, 50 - lift * 0.25)));
      faceLabel.textContent = heads ? "Heads" : "Tails";
    }
    const flip = new Spring(0, (v) => { angle = v; paintCoin(); if (pending && Math.abs(v - target) < 0.12) { const o = pending; pending = null; record(o); update(); } }, { stiffness: 32, damping: 9.5 });
    let bars = [0, 0, 5];
    const grow = new Spring([0, 0, 5], (v) => { bars = v; drawBars(); }, { stiffness: 160, damping: 15 });
    const drawBars = () => barChart(barsG, { x: 290, y: 200, w: 280, ht: 160, labels: ["Heads", "Tails"], vals: bars, counts: [nH, nT], colors: ["g", "a"] });

    function record(o) { if (o === "H") nH++; else nT++; hist.push(nH / (nH + nT)); }
    function update() {
      const n = nH + nT;
      grow.set([nH, nT, niceMax(Math.max(nH, nT, 1))]);
      clear(tbody);
      [["Heads (H)", nH], ["Tails (T)", nT]].forEach(([name, f]) => tbody.append(h("tr", {}, h("td", {}, name), tallyCell(f), h("td", { class: "num" }, String(f)), h("td", { class: "num" }, relText(f, n)))));
      tbody.append(h("tr", {}, h("td", {}, h("strong", {}, "Total")), h("td"), h("td", { class: "num" }, h("strong", {}, String(n))), h("td", { class: "num" }, n ? "1 = 100%" : "–")));
      clear(out);
      out.append(stat("Tosses:", String(n)).el, stat("Heads:", String(nH)).el, stat("Fraction of heads:", n ? fmt(nH / n, 3) : "–").el);
      drawPlot();
    }
    function drawPlot() {
      clear(plot);
      const n = hist.length, N = Math.max(10, n), X = (i) => 50 + (i / N) * 520, Y = (f) => 180 - f * 160;
      [[0, "0"], [0.5, "1/2"], [1, "1"]].forEach(([f, t]) => plot.append(s("line", { x1: 50, y1: Y(f), x2: 570, y2: Y(f), stroke: f === 0.5 ? "var(--accent)" : "var(--grid)", "stroke-dasharray": f === 0.5 ? "6 5" : null, "stroke-width": f === 0.5 ? 2 : 1 }), s("text", { x: 42, y: Y(f) + 4, "text-anchor": "end", class: "svg-text", style: "font-size:12px" }, t)));
      plot.append(s("text", { x: 570, y: 202, "text-anchor": "end", class: "svg-label" }, `number of tosses (0 to ${N})`), s("text", { x: 50, y: 14, class: "svg-label" }, "fraction of the tosses that were heads"));
      if (!n) return;
      const step = Math.max(1, Math.ceil(n / 500)), pts = [];
      for (let i = 0; i < n; i += step) pts.push(`${X(i + 1)},${Y(hist[i])}`);
      pts.push(`${X(n)},${Y(hist[n - 1])}`);
      plot.append(s("polyline", { points: pts.join(" "), fill: "none", stroke: "var(--shape-b)", "stroke-width": 2.5, "stroke-linejoin": "round" }));
      plot.append(s("circle", { cx: X(n), cy: Y(hist[n - 1]), r: 5, fill: "var(--shape-b)" }), s("text", { x: Math.min(560, X(n)), y: Y(hist[n - 1]) - 10, "text-anchor": "end", class: "svg-text", "font-weight": 700 }, fmt(hist[n - 1], 3)));
    }

    function tossOne() {
      if (stopFast) return;
      if (pending) { const o = pending; pending = null; record(o); update(); }
      const o = Math.random() < 0.5 ? "H" : "T";
      let k = Math.round(angle / Math.PI) + 6;
      if ((k % 2 === 0) !== (o === "H")) k++;
      start = angle; target = k * Math.PI; pending = o;
      flip.set(target);
    }
    function tossMany(N) {
      if (stopFast) return;
      if (pending) { const o = pending; pending = null; record(o); }
      flip.stop();
      let last = "H";
      stopFast = fastRun(N, () => { last = Math.random() < 0.5 ? "H" : "T"; record(last); },
        () => { angle = last === "H" ? 0 : Math.PI; start = target = angle; paintCoin(); inner.setAttribute("transform", `scale(1,${0.35 + 0.65 * Math.random()})`); update(); },
        () => { stopFast = null; paintCoin(); });
    }
    function reset() { if (stopFast) { stopFast(); stopFast = null; } flip.stop(); pending = null; nH = nT = 0; hist = []; angle = start = target = 0; paintCoin(); update(); }

    root.append(h("div", { class: "controls" },
      h("button", { class: "btn", type: "button", onclick: tossOne }, "Toss 1"),
      h("button", { class: "btn", type: "button", onclick: () => tossMany(10) }, "Toss 10"),
      h("button", { class: "btn", type: "button", onclick: () => tossMany(100) }, "Toss 100"),
      h("button", { class: "btn ghost", type: "button", onclick: reset }, "Reset")),
      svg, out,
      h("div", { class: "table-wrap" }, h("table", { class: "data" }, h("thead", {}, h("tr", {}, h("th", {}, "Outcome"), h("th", {}, "Tally"), h("th", {}, "Frequency"), h("th", {}, "Relative frequency"))), tbody)),
      plot,
      h("p", { class: "note" }, "Each toss is random, so a short run can be far from half heads. Keep tossing: the fraction of heads wobbles less and less and settles near 1/2."));
    paintCoin(); update();
    return () => { if (stopFast) stopFast(); flip.stop(); grow.stop(); };
  }

  // ------------------------------------------------------------ die roll

  const EVENTS = {
    prime: { label: "a prime number", set: [2, 3, 5] },
    even: { label: "an even number", set: [2, 4, 6] },
    gt4: { label: "a number greater than 4", set: [5, 6] },
  };
  const PIPS = { 1: [[0, 0]], 2: [[-1, -1], [1, 1]], 3: [[-1, -1], [0, 0], [1, 1]], 4: [[-1, -1], [1, -1], [-1, 1], [1, 1]], 5: [[-1, -1], [1, -1], [0, 0], [-1, 1], [1, 1]], 6: [[-1, -1], [1, -1], [-1, 0], [1, 0], [-1, 1], [1, 1]] };

  function die(root) {
    const counts = [0, 0, 0, 0, 0, 0, 0];
    let ev = "prime", recent = [], prog = 1, face = 1, seq = [1], pending = null, stopFast = null;
    const svg = s("svg", { viewBox: "0 0 600 250", role: "img", "aria-label": "A rolled die and a bar graph of the outcomes" });
    const dieG = s("g"), pipG = s("g"), barsG = s("g");
    dieG.append(s("rect", { x: -50, y: -50, width: 100, height: 100, rx: 16, fill: "var(--paper)", stroke: "var(--ink)", "stroke-width": 3 }), pipG);
    const dieLabel = s("text", { x: 110, y: 228, "text-anchor": "middle", class: "svg-text", style: "font-size:16px", "font-weight": 700 });
    svg.append(dieG, dieLabel, barsG);
    const work = h("pre", { class: "workings", "aria-live": "polite" }), tbl = h("div", { class: "table-wrap" }), out = h("div", { class: "readout" });

    function paintDie() {
      const shown = prog < 0.93 ? seq[Math.min(seq.length - 1, Math.floor(prog * seq.length))] : face;
      const inE = EVENTS[ev].set.includes(shown);
      dieG.setAttribute("transform", `translate(110,${115 - Math.max(-5, 260 * prog * (1 - prog))}) rotate(${(1 - prog) * 560})`);
      clear(pipG);
      PIPS[shown].forEach(([px, py]) => pipG.append(s("circle", { cx: px * 25, cy: py * 25, r: 9, fill: inE ? "var(--shape-b)" : "var(--ink)" })));
      dieLabel.textContent = counts.slice(1).some(Boolean) || pending ? `${shown}${inE ? " – in E" : ""}` : "Roll the die";
    }
    const roll = new Spring(1, (v) => { prog = v; paintDie(); if (pending && v > 0.97) { const o = pending; pending = null; record(o); update(); } }, { stiffness: 30, damping: 8.5 });
    let bars = [0, 0, 0, 0, 0, 0, 5];
    const grow = new Spring(bars, (v) => { bars = v; drawBars(); }, { stiffness: 160, damping: 15 });
    const drawBars = () => barChart(barsG, { x: 255, y: 205, w: 320, ht: 165, labels: ["1", "2", "3", "4", "5", "6"], vals: bars, counts: counts.slice(1), colors: [1, 2, 3, 4, 5, 6].map((f) => (EVENTS[ev].set.includes(f) ? "b" : "a")) });

    function record(o) { counts[o]++; recent.push(o); if (recent.length > 15) recent.shift(); }
    function update() {
      const n = counts.slice(1).reduce((a, b) => a + b, 0), E = EVENTS[ev], hits = E.set.reduce((a, f) => a + counts[f], 0);
      grow.set([...counts.slice(1), niceMax(Math.max(1, ...counts.slice(1)))]);
      clear(tbl);
      tbl.append(h("table", { class: "data" },
        h("thead", {}, h("tr", {}, h("th", {}, "Outcome"), [1, 2, 3, 4, 5, 6].map((f) => h("th", {}, String(f))), h("th", {}, "Total"))),
        h("tbody", {}, h("tr", {}, h("td", {}, "Frequency"), [1, 2, 3, 4, 5, 6].map((f) => h("td", { class: "num" }, E.set.includes(f) ? h("strong", {}, String(counts[f])) : String(counts[f]))), h("td", { class: "num" }, String(n))))));
      work.textContent = `Sample space: S = {1, 2, 3, 4, 5, 6}\nEvent E: rolling ${E.label}\n         E = {${E.set.join(", ")}}\n` +
        `Outcomes so far: ${recent.length ? recent.join(", ") + (n > recent.length ? ", …" : "") : "–"}\n` +
        (n ? `E happened ${E.set.map((f) => counts[f]).join(" + ")} = ${hits} times in ${n} rolls.\nRelative frequency of E = ${relText(hits, n)}` : "Roll the die to collect data.");
      clear(out);
      out.append(stat("Rolls:", String(n)).el, stat("Times E happened:", String(hits)).el);
      paintDie(); drawBars();
    }
    function rollOne() {
      if (stopFast) return;
      if (pending) { const o = pending; pending = null; record(o); update(); }
      face = randInt(1, 6); seq = Array.from({ length: 9 }, () => randInt(1, 6)); pending = face;
      roll.jump(0); pending = face; roll.set(1);
    }
    function rollMany(N) {
      if (stopFast) return;
      if (pending) { const o = pending; pending = null; record(o); }
      roll.stop(); prog = 1;
      stopFast = fastRun(N, () => { face = randInt(1, 6); record(face); }, update, () => { stopFast = null; update(); });
    }
    function reset() { if (stopFast) { stopFast(); stopFast = null; } roll.stop(); pending = null; counts.fill(0); recent = []; prog = 1; face = 1; update(); }
    const evSeg = Sim.segmented(Object.keys(EVENTS), ev, (v) => { ev = v; update(); }, (v) => `E: ${EVENTS[v].label}`);

    root.append(h("div", { class: "controls" }, evSeg),
      h("div", { class: "controls" },
        h("button", { class: "btn", type: "button", onclick: rollOne }, "Roll 1"),
        h("button", { class: "btn", type: "button", onclick: () => rollMany(10) }, "Roll 10"),
        h("button", { class: "btn", type: "button", onclick: () => rollMany(60) }, "Roll 60"),
        h("button", { class: "btn ghost", type: "button", onclick: reset }, "Reset")),
      svg, out, tbl, work,
      h("p", { class: "note" }, "Outcomes in the event E are shown in orange. Write outcomes in words (“rolling a prime number”) or in symbols (E = {2, 3, 5})."));
    update();
    return () => { if (stopFast) stopFast(); roll.stop(); grow.stop(); };
  }

  // ------------------------------------------------------------ spinner booth

  const PRIZES = [["Keychain", "g"], ["Candy", "b"], ["Try again", "a"]];

  function booth(root) {
    let key = 45, candy = 90, rot = 0, spinTarget = 0, pending = false, stopFast = null;
    const counts = [0, 0, 0];
    const CX = 150, CY = 150, R = 115;
    const svg = s("svg", { viewBox: "0 0 600 290", role: "img", "aria-label": "Family Day spinner and a bar graph of results" });
    const wheel = s("g"), barsG = s("g");
    svg.append(wheel, s("path", { d: `M${CX},${CY - R + 14} l-14,-30 h28 z`, fill: "var(--ink)" }), s("circle", { cx: CX, cy: CY, r: 9, fill: "var(--ink)" }), barsG);
    const out = h("div", { class: "readout" }), verdict = h("div", { class: "stage-body", "aria-live": "polite" }), tbody = h("tbody");
    const pt = (a, r = R) => [CX + r * Math.sin((a * Math.PI) / 180), CY - r * Math.cos((a * Math.PI) / 180)];
    const sizes = () => [key, candy, Math.max(0, 360 - key - candy)];
    const outcomeAt = (r) => { const a = (((-r) % 360) + 360) % 360; return a < key ? 0 : a < key + candy ? 1 : 2; };

    function paintWheel() {
      clear(wheel);
      wheel.setAttribute("transform", `rotate(${rot % 360} ${CX} ${CY})`);
      let a0 = 0;
      sizes().forEach((sw, i) => {
        const a1 = a0 + sw, [fill, stroke] = SOFT[PRIZES[i][1]];
        if (sw >= 359.9) wheel.append(s("circle", { cx: CX, cy: CY, r: R, fill, stroke, "stroke-width": 2 }));
        else if (sw > 0.2) {
          const [x0, y0] = pt(a0), [x1, y1] = pt(a1);
          wheel.append(s("path", { d: `M${CX},${CY} L${x0},${y0} A${R},${R} 0 ${sw > 180 ? 1 : 0} 1 ${x1},${y1} Z`, fill, stroke, "stroke-width": 2 }));
        }
        if (sw > 22) { const [lx, ly] = pt(a0 + sw / 2, R * 0.62); wheel.append(s("text", { x: lx, y: ly + 4, "text-anchor": "middle", class: "svg-text", style: "font-size:12px", "font-weight": 700 }, PRIZES[i][0])); }
        a0 = a1;
      });
      wheel.append(s("circle", { cx: CX, cy: CY, r: R, fill: "none", stroke: "var(--ink)", "stroke-width": 2.5 }));
    }
    const spin = new Spring(0, (v) => { rot = v; paintWheel(); if (pending && Math.abs(v - spinTarget) < 0.5) { pending = false; counts[outcomeAt(spinTarget)]++; update(); } }, { stiffness: 14, damping: 6.5 });
    let bars = [0, 0, 0, 5];
    const grow = new Spring(bars, (v) => { bars = v; drawBars(); }, { stiffness: 160, damping: 15 });
    const drawBars = () => barChart(barsG, { x: 330, y: 240, w: 255, ht: 190, labels: PRIZES.map(([n]) => n), vals: bars, counts, colors: PRIZES.map(([, c]) => c) });

    function update() {
      const n = counts[0] + counts[1] + counts[2], win = counts[0] + counts[1];
      grow.set([...counts, niceMax(Math.max(1, ...counts))]);
      clear(tbody);
      PRIZES.forEach(([name], i) => tbody.append(h("tr", {}, h("td", {}, name), h("td", { class: "num" }, `${fmt(sizes()[i], 0)}°`), h("td", { class: "num" }, String(counts[i])), h("td", { class: "num" }, relText(counts[i], n)))));
      tbody.append(h("tr", {}, h("td", {}, h("strong", {}, "Win (any prize)")), h("td", { class: "num" }, `${fmt(key + candy, 0)}°`), h("td", { class: "num" }, h("strong", {}, String(win))), h("td", { class: "num" }, relText(win, n))));
      clear(out);
      out.append(stat("Spins:", String(n)).el, stat("Wins:", String(win)).el, stat("Losses:", String(counts[2])).el);
      clear(verdict);
      if (n < 30) { verdict.append(h("p", { class: "note" }, `Spin at least 30 times before you decide if the booth is fair. (${n} so far)`)); return; }
      const wp = (win / n) * 100, fair = Math.abs(wp - 50) <= 7;
      verdict.append(h("p", {}, pill(fair, "Looks fair", "Not fair"), " ",
        fair ? `Players won ${fmt(wp, 1)}% of the spins – close to half, so winning and losing happened about equally often.`
          : `Players won ${fmt(wp, 1)}% of the spins – far from half, so the game favours ${wp < 50 ? "the booth" : "the players"}.`),
        h("pre", { class: "workings" }, `Prediction for 200 players (from your ${n} spins):\n` +
          `  winners   ≈ ${win}/${n} × 200 ≈ ${Math.round((win / n) * 200)}\n  keychains ≈ ${counts[0]}/${n} × 200 ≈ ${Math.round((counts[0] / n) * 200)}\n  candies   ≈ ${counts[1]}/${n} × 200 ≈ ${Math.round((counts[1] / n) * 200)}`));
    }
    function spinOne() {
      if (stopFast) return;
      if (pending) { pending = false; counts[outcomeAt(spinTarget)]++; }
      const u = Math.random() * 360;
      spinTarget = rot + 1440 + ((((-u - rot) % 360) + 360) % 360);
      pending = true; spin.set(spinTarget); update();
    }
    function spinMany(N) {
      if (stopFast) return;
      if (pending) { pending = false; counts[outcomeAt(spinTarget)]++; }
      spin.stop();
      stopFast = fastRun(N, () => { counts[outcomeAt(-Math.random() * 360)]++; }, () => { rot += 47; paintWheel(); update(); }, () => { stopFast = null; update(); });
    }
    function reset() { if (stopFast) { stopFast(); stopFast = null; } spin.stop(); pending = false; counts.fill(0); update(); }
    const onSize = () => { if (counts.some(Boolean) && !stopFast) { counts.fill(0); pending = false; } paintWheel(); update(); };

    const kS = elasticSlider({ id: "t3l8-key", label: "Keychain sector", min: 0, max: 180, value: key, step: 15, format: (v) => `${fmt(v, 0)}°`, onInput: (v) => { key = v; paintWheel(); }, onChange: onSize });
    const cS = elasticSlider({ id: "t3l8-candy", label: "Candy sector", min: 0, max: 180, value: candy, step: 15, format: (v) => `${fmt(v, 0)}°`, onInput: (v) => { candy = v; paintWheel(); }, onChange: onSize });
    root.append(h("p", {}, "Family Day Chance Booth: a player spins once and wins the prize the pointer lands on. Set the sector sizes, then run the experiment."),
      h("div", { class: "controls" }, kS.el, cS.el),
      h("div", { class: "controls" },
        h("button", { class: "btn", type: "button", onclick: spinOne }, "Spin 1"),
        h("button", { class: "btn", type: "button", onclick: () => spinMany(20) }, "Spin 20"),
        h("button", { class: "btn", type: "button", onclick: () => spinMany(200) }, "Spin 200"),
        h("button", { class: "btn ghost", type: "button", onclick: reset }, "Reset")),
      svg, out,
      h("div", { class: "table-wrap" }, h("table", { class: "data" }, h("thead", {}, h("tr", {}, h("th", {}, "Outcome"), h("th", {}, "Sector"), h("th", {}, "Frequency"), h("th", {}, "Relative frequency"))), tbody)),
      verdict,
      h("p", { class: "note" }, "Changing a sector size starts a new experiment. Bigger sectors come up more often – use your results to decide how many prizes to prepare."));
    paintWheel(); update();
    return () => { if (stopFast) stopFast(); spin.stop(); grow.stop(); };
  }

  // ------------------------------------------------------------ register

  Sim.register({
    id: "lesson26", unit: "J", num: 8, letter: "H", title: "Experiments and Outcomes", simName: "Chance Lab",
    comps: ["A14", "A15", "A16", "M8", "T2"], cycles: "C8,M2 – C9,M1", deped: "DepEd Weeks 8–9",
    bigQuestion: "How many heads will you get in 100 tosses – and how big is a billion?",
    mission: [
      "Coin Toss: predict how many heads you will get in 10 tosses, then toss 10. Were you right? Toss 10 again – same result?",
      "Toss 100 several times. Watch the graph of the fraction of heads. Where does it settle?",
      "Die Roll: choose the event “a prime number”. Write S and E in set notation, roll 60 times, and find the relative frequency of E.",
      "Spinner Booth: set the sectors, spin 200 times, and decide if the Family Day game is fair. How many prizes should the booth prepare for 200 players?",
    ],
    discovery: "An experiment gives outcomes you cannot know ahead of time. We record them in a tally or frequency table and a bar graph, and we write them in words or in set notation (S = {1, 2, 3, 4, 5, 6}, E = {2, 3, 5}). The relative frequency (times the event happened ÷ number of trials) can be a fraction, decimal, or percent. Short experiments vary a lot, but with many trials the relative frequency settles – about 1/2 of coin tosses are heads, so about 50 heads in 100 tosses (rarely exactly 50).",
    mount(stage) {
      const body = h("div", { class: "stage-body" });
      const views = [coin, die, booth];
      let stopper = null;
      const t = tabs(["Coin Toss", "Die Roll", "Spinner Booth"], (i) => { if (stopper) stopper(); clear(body); stopper = views[i](body) || null; });
      stage.append(t.el, body);
      stopper = coin(body);
      return () => { if (stopper) stopper(); };
    },
    check() {
      const kind = randInt(0, 5);
      if (kind === 0) {
        const n = pick([20, 40, 50, 80, 100, 200]), hd = randInt(Math.round(n * 0.35), Math.round(n * 0.65));
        return { q: `A coin was tossed ${n} times and landed heads ${hd} times. What percent of the tosses were heads?`, answer: (hd / n) * 100, tol: 0.05, unit: "%", explain: `${hd}/${n} = ${fmt(hd / n, 3)} = ${fmt((hd / n) * 100, 1)}%.` };
      }
      if (kind === 1) {
        const k = pick(Object.keys(EVENTS)), E = EVENTS[k];
        const opts = shuffle(["{2, 3, 5}", "{2, 4, 6}", "{5, 6}", "{1, 3, 5}"]);
        return { q: `A die is rolled. Which set shows the event “rolling ${E.label}”?`, choices: opts, answer: `{${E.set.join(", ")}}`, explain: `Only ${E.set.join(", ")} fit “${E.label}”, so E = {${E.set.join(", ")}}.` };
      }
      if (kind === 2) {
        const n = pick([40, 50, 100]), w = randInt(Math.round(n * 0.2), Math.round(n * 0.6)), players = pick([200, 400, 500]);
        const ans = (w / n) * players;
        return { q: `At a Family Day booth, a spinner was spun ${n} times and “Win” came up ${w} times. Based on these results, about how many of ${players} players would win?`, answer: ans, tol: 0.5, explain: `${w}/${n} × ${players} = ${fmt(ans, 1)}.` };
      }
      if (kind === 3) {
        const c = [0, 0, 0, 0, 0, 0, 0];
        for (let i = 0; i < 20; i++) c[randInt(1, 6)]++;
        const ans = c[2] + c[3] + c[5];
        return { q: `A die was rolled 20 times. Frequencies – 1: ${c[1]}, 2: ${c[2]}, 3: ${c[3]}, 4: ${c[4]}, 5: ${c[5]}, 6: ${c[6]}. How many times was a prime number rolled?`, answer: ans, tol: 0, explain: `Primes are 2, 3, 5: ${c[2]} + ${c[3]} + ${c[5]} = ${ans}.` };
      }
      if (kind === 4) return pick([
        { q: "Which experiment is most likely to give a fraction of heads closest to 1/2?", choices: ["10 tosses", "50 tosses", "1000 tosses"], answer: "1000 tosses", explain: "With more trials, the relative frequency settles closer to 1/2." },
        { q: "Two groups each toss a coin 20 times. Group A gets 12 heads; Group B gets 8. What does this show?", choices: ["Results of a random experiment vary", "Group B made a mistake", "The coin changed", "Group A cheated"], answer: "Results of a random experiment vary", explain: "Each toss is random, so short experiments give different results." },
        { q: "What is the sample space for tossing one coin?", choices: ["S = {H, T}", "S = {H}", "S = {1, 2, 3, 4, 5, 6}", "S = {HH, TT}"], answer: "S = {H, T}", explain: "One toss has two possible outcomes: heads or tails." },
      ]);
      const n = pick([25, 50]), lose = randInt(Math.round(n * 0.2), Math.round(n * 0.8)), win = n - lose, fair = Math.abs(win / n - 0.5) <= 0.07;
      return { q: `In ${n} spins of a booth game, players won ${win} times and lost ${lose} times. Is winning and losing happening about equally often?`, choices: ["Yes – about half wins", "No – far from half wins"], answer: fair ? "Yes – about half wins" : "No – far from half wins", explain: `${win}/${n} = ${fmt((win / n) * 100, 0)}% wins${fair ? ", close to 50%." : ", which is far from 50%."}` };
    },
  });
})();
