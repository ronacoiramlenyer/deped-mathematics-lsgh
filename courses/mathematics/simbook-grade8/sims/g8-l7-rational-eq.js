/* Grade 8 · Term 1 · Lesson 7 · G. Rational Algebraic Equations – Work-Rate Lab */
(function () {
  "use strict";
  const { h, s, clear, randInt, pick, shuffle, fmt, tabs, segmented, stat, pill, Spring, elasticSlider, Frac } = Sim;

  const fm = (x, d = 2) => fmt(x, d).replace("-", "−");
  /** "x + 3", "x − 2", or "x" */
  const lin = (b) => (b === 0 ? "x" : b > 0 ? `x + ${b}` : `x − ${-b}`);
  const paren = (t) => (/[+−]/.test(t) ? `(${t})` : t);
  const frs = (f) => (f.d === 1 ? fm(f.n) : `${fm(f.n)}/${f.d}`);
  const hm = (t) => { const H = Math.floor(t + 1e-9), M = Math.round((t - H) * 60); return M === 60 ? `${H + 1} h` : M ? `${H} h ${M} min` : `${H} h`; };

  // ------------------------------------------------------------ equation generators

  /** Each equation: four tokens, left/right sides as functions of x, and the solving steps. */
  function makeEq(kind) {
    if (kind === "prop") {
      // a/(x + b) = c/d
      for (;;) {
        const c = randInt(1, 6), d = randInt(2, 7), k = randInt(1, 9), b = pick([-5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6]);
        if ((c * k) % d || c === d) continue;
        const a = (c * k) / d, x0 = k - b;
        if (a === c) continue;
        return {
          kind, tok: [String(a), lin(b), String(c), String(d)], x0, bad: -b, valid: true,
          L: (x) => (x + b === 0 ? null : a / (x + b)), R: () => c / d,
          linear: `${a} × ${d} = ${c}${paren(lin(b))}`,
          steps: [`${a * d} = ${c}x ${c * b < 0 ? "−" : "+"} ${Math.abs(c * b)}`, `${c}x = ${a * d} ${c * b < 0 ? "+" : "−"} ${Math.abs(c * b)} = ${fm(c * x0)}`, `x = ${fm(c * x0)} ÷ ${c} = ${fm(x0)}`],
          check: `Left: ${a}/(${fm(x0)} ${b < 0 ? "−" : "+"} ${Math.abs(b)}) = ${a}/${k} = ${frs(new Frac(a, k))}.  Right: ${c}/${d} = ${frs(new Frac(c, d))} ✓`,
          exclude: `x = ${fm(-b)} is not allowed: it makes x ${b < 0 ? "−" : "+"} ${Math.abs(b)} = 0.`,
        };
      }
    }
    if (kind === "two") {
      // a/(x + b) = c/(x + e)
      for (;;) {
        const a = randInt(1, 6), c = randInt(1, 6), t = randInt(1, 2), x0 = randInt(-3, 6);
        if (a === c) continue;
        const b = a * t - x0, e = c * t - x0;
        if (Math.abs(b) > 12 || Math.abs(e) > 12) continue;
        const A = a - c, B = c * b - a * e;
        return {
          kind, tok: [String(a), lin(b), String(c), lin(e)], x0, bad: [-b, -e], valid: true,
          L: (x) => (x + b === 0 ? null : a / (x + b)), R: (x) => (x + e === 0 ? null : c / (x + e)),
          linear: `${a}${paren(lin(e))} = ${c}${paren(lin(b))}`,
          steps: [`${a}x ${a * e < 0 ? "−" : "+"} ${Math.abs(a * e)} = ${c}x ${c * b < 0 ? "−" : "+"} ${Math.abs(c * b)}`, `${a}x − ${c}x = ${fm(c * b)} − ${paren(fm(a * e))}`, `${fm(A)}x = ${fm(B)}`, `x = ${fm(B)} ÷ ${paren(fm(A))} = ${fm(x0)}`],
          check: `Left: ${a}/${a * t} = ${frs(new Frac(1, t))}.  Right: ${c}/${c * t} = ${frs(new Frac(1, t))} ✓`,
          exclude: `x = ${fm(-b)} and x = ${fm(-e)} are not allowed (each makes a denominator 0).`,
        };
      }
    }
    // (x + p)/(x − q) = r/(x − q): cross-multiplying always produces x = q, which must be rejected.
    const q = randInt(1, 6), p = randInt(1, 6), none = Math.random() < 0.5;
    let x0 = q;
    if (!none) { do x0 = randInt(-3, 8); while (x0 === q || x0 + p <= 0); }
    const r = p + x0, sP = p - r;
    return {
      kind, tok: [lin(p), lin(-q), String(r), lin(-q)], x0, bad: q, valid: !none,
      L: (x) => (x === q ? null : (x + p) / (x - q)), R: (x) => (x === q ? null : r / (x - q)),
      linear: `${paren(lin(p))}${paren(lin(-q))} = ${r}${paren(lin(-q))}`,
      steps: [`${paren(lin(p))}${paren(lin(-q))} − ${r}${paren(lin(-q))} = 0`, `${paren(lin(-q))}${paren(lin(sP))} = 0   (common factor)`, `x = ${q}  or  x = ${fm(x0)}`, none ? `Both give x = ${q}.` : `Two candidates: ${q} and ${fm(x0)}.`],
      check: none ? `x = ${q} makes x − ${q} = 0, so it is REJECTED (extraneous). The equation has no solution.` : `x = ${q} makes x − ${q} = 0 → REJECTED (extraneous).  x = ${fm(x0)}: (${fm(x0)} + ${p})/(${fm(x0)} − ${q}) = ${frs(new Frac(r, x0 - q))} = ${r}/(${fm(x0 - q)}) ✓`,
      exclude: `x = ${q} is not allowed: it makes x − ${q} = 0.`,
    };
  }

  // ------------------------------------------------------------ cross-multiply

  function crossTab(root) {
    let kind = "prop", eq = makeEq(kind), stage = 0, k = 0, tryX = 0;
    const svg = s("svg", { viewBox: "0 0 600 230", role: "img", "aria-label": "A rational equation whose cross products swing across" });
    const work = h("pre", { class: "workings", "aria-live": "polite" });
    const res = h("div", { class: "readout", "aria-live": "polite" });
    const tryOut = h("div", { class: "readout" });
    const btnBox = h("div", { class: "controls" });
    const swing = new Spring(0, (v) => { k = v; draw(); }, { stiffness: 70, damping: 11 });
    const CW = 16.8; // monospace character width at 28px
    const W = (t) => t.length * CW;

    function finalLayout() {
      // a × d = c × (x + b): positions of the four tokens in the bottom row
      const [nL, dL, nR, dR] = eq.tok;
      const pL = /[+−]/.test(dR) ? 2 * CW : 0, pR = /[+−]/.test(dL) ? 2 * CW : 0;
      const gap = 30, eqW = 40;
      const left = W(nL) + gap + W(dR) + pL, right = W(nR) + gap + W(dL) + pR;
      let x = 300 - (left + eqW + right) / 2;
      const pos = {};
      pos.nL = x + W(nL) / 2; x += W(nL) + gap; pos.dR = x + (W(dR) + pL) / 2; x += W(dR) + pL; pos.eq = x + eqW / 2; x += eqW;
      pos.nR = x + W(nR) / 2; x += W(nR) + gap; pos.dL = x + (W(dL) + pR) / 2;
      pos.dot1 = pos.nL + W(nL) / 2 + gap / 2; pos.dot2 = pos.nR + W(nR) / 2 + gap / 2;
      return pos;
    }

    function draw() {
      clear(svg);
      const [nL, dL, nR, dR] = eq.tok;
      const LX = 170, RX = 430, NY = 62, DY = 116, FY = 196;
      const lw = Math.max(W(nL), W(dL)) + 24, rw = Math.max(W(nR), W(dR)) + 24;
      const fade = Math.max(0, 1 - k * 1.6);
      svg.append(s("line", { x1: LX - lw / 2, y1: 88, x2: LX + lw / 2, y2: 88, stroke: "var(--ink)", "stroke-width": 2.5, opacity: 0.25 + 0.75 * fade }),
        s("line", { x1: RX - rw / 2, y1: 88, x2: RX + rw / 2, y2: 88, stroke: "var(--ink)", "stroke-width": 2.5, opacity: 0.25 + 0.75 * fade }),
        s("text", { x: 300, y: 98, "text-anchor": "middle", class: "svg-text", "font-size": 30 }, "="));
      // the X of cross products
      const xo = Math.min(1, Math.sin(Math.PI * Math.min(k, 1)) * 1.2 + (stage === 0 ? 0.35 : 0));
      if (xo > 0.02) {
        svg.append(s("line", { x1: LX + 30, y1: NY - 6, x2: RX - 30, y2: DY - 8, stroke: "var(--shape-a)", "stroke-width": 3, "stroke-dasharray": "8 6", opacity: xo }),
          s("line", { x1: RX - 30, y1: NY - 6, x2: LX + 30, y2: DY - 8, stroke: "var(--shape-b)", "stroke-width": 3, "stroke-dasharray": "8 6", opacity: xo }));
      }
      const P = finalLayout();
      // path of a token: from (x0,y0) to (x1,y1) with an arc that bulges sideways
      const fly = (t, x0, y0, x1, y1, bulge, color, ghost) => {
        if (ghost) svg.append(s("text", { x: x0, y: y0, "text-anchor": "middle", class: "svg-text", "font-size": 28, opacity: 0.18 * Math.min(1, k * 3) }, t));
        const kk = Math.max(0, k);
        const x = x0 + (x1 - x0) * kk + bulge * Math.sin(Math.PI * Math.min(kk, 1)), y = y0 + (y1 - y0) * kk;
        svg.append(s("text", { x, y, "text-anchor": "middle", class: "svg-text", "font-size": 28, "font-weight": 700, fill: color }, t));
      };
      fly(nL, LX, NY + 10, P.nL, FY, -40, "var(--shape-a)", true);
      fly(dR, RX, DY + 10, P.dR, FY, -60, "var(--shape-a)", true);
      fly(nR, RX, NY + 10, P.nR, FY, 40, "var(--shape-b)", true);
      fly(dL, LX, DY + 10, P.dL, FY, 60, "var(--shape-b)", true);
      if (k > 0.85) {
        const o = Math.min(1, (k - 0.85) / 0.15);
        const add = (x, t) => svg.append(s("text", { x, y: FY, "text-anchor": "middle", class: "svg-text", "font-size": 28, opacity: o }, t));
        add(P.dot1, "·"); add(P.dot2, "·"); add(P.eq, "=");
        if (/[+−]/.test(dR)) { add(P.dR - W(dR) / 2 - CW / 2, "("); add(P.dR + W(dR) / 2 + CW / 2, ")"); }
        if (/[+−]/.test(dL)) { add(P.dL - W(dL) / 2 - CW / 2, "("); add(P.dL + W(dL) / 2 + CW / 2, ")"); }
      }
    }

    function showWork() {
      const lines = [`Equation:        ${eq.tok[0].includes("x") ? paren(eq.tok[0]) : eq.tok[0]}/${paren(eq.tok[1])} = ${eq.tok[2]}/${paren(eq.tok[3])}`,
        `Restriction:     ${eq.exclude}`];
      if (stage >= 1) lines.push(`Cross-multiply:  ${eq.linear}`);
      if (stage >= 2) eq.steps.forEach((t) => lines.push(`                 ${t}`));
      if (stage >= 3) lines.push(`Check:           ${eq.check}`);
      work.textContent = lines.join("\n");
      clear(res);
      if (stage >= 3) res.append(pill(eq.valid, `Solution: x = ${fm(eq.x0)}`, "No solution – the only candidate was rejected."));
    }

    function buttons() {
      clear(btnBox);
      const labels = ["Cross-multiply ▶", "Solve ▶", "Check ▶"];
      if (stage < 3) btnBox.append(h("button", { class: "btn", type: "button", onclick: () => { stage++; if (stage === 1) { swing.jump(0); swing.set(1); } showWork(); buttons(); } }, labels[stage]));
      btnBox.append(h("button", { class: "btn ghost", type: "button", onclick: () => fresh() }, "New equation"));
    }

    function tryPaint() {
      const xr = Math.round(tryX), L = eq.L(xr), R = eq.R(xr);
      clear(tryOut);
      const show = (v) => (v === null ? "undefined (÷ 0)" : fm(v, 3));
      tryOut.append(stat("Left side:", show(L)).el, stat("Right side:", show(R)).el);
      if (L === null || R === null) tryOut.append(pill(false, "", `x = ${fm(xr)} makes a denominator 0 – not allowed.`));
      else if (Math.abs(L - R) < 1e-9 && Math.abs(tryX - xr) < 0.05) tryOut.append(pill(true, `x = ${fm(xr)} balances the equation!`, ""));
    }

    function fresh() {
      eq = makeEq(kind); stage = 0; swing.jump(0); showWork(); buttons(); tryPaint();
    }

    const slider = elasticSlider({ id: "g8l7-try", label: "Try x =", min: -10, max: 12, value: 0, step: 1, format: (v) => fm(Math.round(v), 0), onInput: (v) => { tryX = v; tryPaint(); } });
    root.append(
      h("div", { class: "controls" }, segmented(["prop", "two", "same"], kind, (v) => { kind = v; fresh(); }, (v) => ({ prop: "a/(x + b) = c/d", two: "x on both sides", same: "same denominators" })[v])),
      svg, btnBox, work, res,
      h("p", { class: "note" }, "Guess-and-check first: slide x and watch the two sides. A value that makes a denominator 0 can never be a solution."),
      h("div", { class: "controls" }, slider.el), tryOut);
    fresh();
    return () => swing.stop();
  }

  // ------------------------------------------------------------ work together

  const CREWS = {
    pipes: { a: "Pipe A", b: "Pipe B", job: "fill the tank", what: "tank filled", unit: "Tank" },
    clean: { a: "Bea", b: "Migs", job: "clean the classroom", what: "room cleaned", unit: "Room" },
  };

  function workTab(root) {
    let crew = "pipes", a = 3, b = 6, guess = 2.5, t = 0, run = null, done = false;
    const svg = s("svg", { viewBox: "0 0 600 300", role: "img", "aria-label": "Two workers filling one job together" });
    const out = h("div", { class: "readout", "aria-live": "polite" });
    const work = h("pre", { class: "workings" });
    const verdict = h("div", { "aria-live": "polite" });
    const T = () => (a * b) / (a + b);

    function bar(x, w, label, parts, cap) {
      const top = 40, H = 200;
      svg.append(s("rect", { x, y: top, width: w, height: H, rx: 8, fill: "var(--paper)", stroke: "var(--ink)", "stroke-width": 2 }));
      let acc = 0;
      parts.forEach(([f, color]) => {
        const hh = Math.max(0, Math.min(1 - acc, f)) * H;
        if (hh > 0.2) svg.append(s("rect", { x: x + 3, y: top + H - acc * H - hh, width: w - 6, height: hh, fill: color, opacity: 0.85 }));
        acc += Math.max(0, Math.min(1 - acc, f));
      });
      for (let q = 1; q < 4; q++) svg.append(s("line", { x1: x, y1: top + (H * q) / 4, x2: x + 10, y2: top + (H * q) / 4, stroke: "var(--muted)" }));
      svg.append(s("text", { x: x + w / 2, y: 264, "text-anchor": "middle", class: "svg-label", "font-size": 15, fill: "var(--ink)" }, label),
        s("text", { x: x + w / 2, y: 286, "text-anchor": "middle", class: "svg-text", "font-size": 14 }, cap));
    }

    function draw() {
      clear(svg);
      const C = CREWS[crew];
      const fa = t / a, fb = t / b;
      bar(40, 110, `${C.a} alone`, [[fa, "var(--shape-a)"]], `${fm(Math.min(fa, 1) * 100, 0)}%`);
      bar(450, 110, `${C.b} alone`, [[fb, "var(--gold)"]], `${fm(Math.min(fb, 1) * 100, 0)}%`);
      bar(225, 150, "Together", [[fa, "var(--shape-a)"], [fb, "var(--gold)"]], `${fm(Math.min(fa + fb, 1) * 100, 0)}%`);
      svg.append(s("text", { x: 300, y: 24, "text-anchor": "middle", class: "svg-text", "font-size": 18, "font-weight": 700 }, `t = ${hm(t)}`));
      if (done) svg.append(s("text", { x: 300, y: 150, "text-anchor": "middle", class: "svg-text", "font-size": 22, "font-weight": 700, fill: "var(--paper)" }, "DONE!"));
    }

    function equations() {
      const C = CREWS[crew], tt = T();
      work.textContent = [
        `${C.a} does 1/${fm(a)} of the job per hour; ${C.b} does 1/${fm(b)} per hour.`,
        `Together, in t hours:   t/${fm(a)} + t/${fm(b)} = 1   or   1/${fm(a)} + 1/${fm(b)} = 1/t`,
        `Multiply by the LCD ${fm(a)}·${fm(b)}·t:   ${fm(b)}t + ${fm(a)}t = ${fm(a * b)}`,
        `${fm(a + b)}t = ${fm(a * b)}   →   t = ${fm(a * b)} ÷ ${fm(a + b)} = ${fm(tt, 2)} h  (about ${hm(tt)})`,
        `Check: ${fm(tt, 2)}/${fm(a)} + ${fm(tt, 2)}/${fm(b)} = ${fm(tt / a, 3)} + ${fm(tt / b, 3)} = ${fm(tt / a + tt / b, 3)} ✓`,
      ].join("\n");
      clear(out);
      out.append(stat(`${C.a}:`, `${fm(a)} h alone`).el, stat(`${C.b}:`, `${fm(b)} h alone`).el, stat("Together:", done ? `${fm(tt, 2)} h` : "?").el);
    }

    function stopRun() { if (run) run(); run = null; }
    function reset() { stopRun(); t = 0; done = false; clear(verdict); work.hidden = true; draw(); equations(); }
    function start() {
      stopRun(); done = false; clear(verdict); work.hidden = true;
      const tt = T(), ms = Math.max(1500, Math.min(5000, tt * 1000));
      run = Sim.animate(ms, (q) => { t = tt * q; draw(); }, () => {
        run = null; t = tt; done = true; draw(); equations(); work.hidden = false;
        const off = Math.abs(guess - tt);
        verdict.append(pill(off <= 0.25, `Great prediction! You said ${fm(guess)} h.`, `You predicted ${fm(guess)} h; the job took ${fm(tt, 2)} h.`),
          h("p", { class: "note" }, `Together is faster than ${CREWS[crew].a} alone (${fm(a)} h) and faster than ${CREWS[crew].b} alone (${fm(b)} h).`));
      });
    }

    const sa = elasticSlider({ id: "g8l7-a", label: "Worker A (h)", min: 1, max: 12, value: a, step: 0.5, format: (v) => fm(v, 1), onInput: (v) => { a = v; reset(); } });
    const sb = elasticSlider({ id: "g8l7-b", label: "Worker B (h)", min: 1, max: 12, value: b, step: 0.5, format: (v) => fm(v, 1), onInput: (v) => { b = v; reset(); } });
    const sg = elasticSlider({ id: "g8l7-g", label: "Your prediction (h)", min: 0.5, max: 12, value: guess, step: 0.25, format: (v) => fm(v, 2), onInput: (v) => { guess = v; } });
    const intro = h("p", {});
    const setIntro = () => { const C = CREWS[crew]; intro.textContent = `${C.a} can ${C.job} alone in a hours. ${C.b} can do it alone in b hours. How long if they work together? Predict, then press Start.`; };
    root.append(h("div", { class: "controls" }, segmented(["pipes", "clean"], crew, (v) => { crew = v; setIntro(); reset(); }, (v) => (v === "pipes" ? "Two pipes, one tank" : "Two learners, one room"))),
      intro, h("div", { class: "controls" }, sa.el, sb.el), h("div", { class: "controls" }, sg.el,
        h("button", { class: "btn", type: "button", onclick: start }, "Start ▶"), h("button", { class: "btn ghost", type: "button", onclick: reset }, "Reset")),
      svg, out, verdict, work, h("p", { class: "note" }, "Rates add, times do not: add the parts of the job done per hour."));
    setIntro(); reset();
    return () => stopRun();
  }

  // ------------------------------------------------------------ proportion problems

  const PROBS = [
    { label: "Jeepney vs bike", story: "A jeepney travels 60 km in the same time a bicycle travels 20 km. The jeepney is 20 km/h faster. Find the bicycle’s speed x (km/h).", eq: "60/(x + 20) = 20/x", min: 0, max: 30, step: 1, ans: 10, unit: "km/h",
      L: (x) => (x + 20 === 0 ? null : 60 / (x + 20)), R: (x) => (x === 0 ? null : 20 / x), lt: (x) => `60/(${fm(x)} + 20)`, rt: (x) => `20/${fm(x)}`,
      steps: ["Cross-multiply: 60x = 20(x + 20)", "60x = 20x + 400", "40x = 400  →  x = 10", "Check: 60/30 = 2 h and 20/10 = 2 h ✓"] },
    { label: "Barangay map", story: "On a barangay map, 3 cm stands for 150 m. How many metres x does 8 cm stand for?", eq: "3/150 = 8/x", min: 100, max: 800, step: 10, ans: 400, unit: "m",
      L: () => 3 / 150, R: (x) => (x === 0 ? null : 8 / x), lt: () => "3/150", rt: (x) => `8/${fm(x)}`,
      steps: ["Cross-multiply: 3x = 150 × 8", "3x = 1 200", "x = 400", "Check: 8/400 = 0.02 = 3/150 ✓"] },
    { label: "Pancit recipe", story: "A pancit recipe uses 250 g of noodles for 4 servings. How many servings x can 1 000 g of noodles make?", eq: "250/4 = 1000/x", min: 4, max: 30, step: 1, ans: 16, unit: "servings",
      L: () => 250 / 4, R: (x) => (x === 0 ? null : 1000 / x), lt: () => "250/4", rt: (x) => `1000/${fm(x)}`,
      steps: ["Cross-multiply: 250x = 4 × 1 000", "250x = 4 000", "x = 16", "Check: 1 000/16 = 62.5 = 250/4 ✓"] },
    { label: "Painting crew", story: "3 friends can paint a wall in 4 hours, so the wall is 12 friend-hours of work and each friend paints 1/12 of it per hour. How long x (hours) would 5 friends take?", eq: "5/12 = 1/x", min: 1, max: 6, step: 0.1, ans: 2.4, unit: "h",
      L: () => 5 / 12, R: (x) => (x === 0 ? null : 1 / x), lt: () => "5/12", rt: (x) => `1/${fm(x, 1)}`,
      steps: ["Cross-multiply: 5x = 12 × 1", "x = 12/5", "x = 2.4 h = 2 h 24 min", "Check: 5 friends × 2.4 h = 12 friend-hours ✓"] },
    { label: "Banca on a river", story: "A banca goes 12 km downstream in the same time it goes 8 km upstream. The current is 2 km/h. Find the banca’s speed x in still water (km/h).", eq: "12/(x + 2) = 8/(x − 2)", min: 0, max: 20, step: 1, ans: 10, unit: "km/h",
      L: (x) => (x + 2 === 0 ? null : 12 / (x + 2)), R: (x) => (x === 2 ? null : 8 / (x - 2)), lt: (x) => `12/(${fm(x)} + 2)`, rt: (x) => `8/(${fm(x)} − 2)`,
      steps: ["Restriction: x ≠ 2 and x ≠ −2", "Cross-multiply: 12(x − 2) = 8(x + 2)", "12x − 24 = 8x + 16  →  4x = 40", "x = 10.  Check: 12/12 = 1 h and 8/8 = 1 h ✓"] },
  ];

  function propTab(root) {
    let pr = PROBS[0], x = 0;
    const story = h("p", {}), eqEl = h("p", { class: "unit-big" }), sliderBox = h("div", { class: "controls" });
    const svg = s("svg", { viewBox: "0 0 600 170", role: "img", "aria-label": "The values of both sides of the equation" });
    const out = h("div", { "aria-live": "polite" }), work = h("pre", { class: "workings" });
    const showBtn = h("button", { class: "btn ghost", type: "button", onclick: () => { work.hidden = false; } }, "Show the solution");
    function draw() {
      clear(svg);
      const L = pr.L(x), R = pr.R(x);
      const top = Math.max(L || 0, R || 0) || 1;
      const row = (y, label, v, color) => {
        svg.append(s("text", { x: 20, y: y + 24, class: "svg-label", "font-size": 15, fill: "var(--ink)" }, label));
        if (v === null) { svg.append(s("text", { x: 160, y: y + 24, class: "svg-text", "font-size": 16, fill: "var(--bad)" }, "undefined – denominator is 0")); return; }
        const w = Math.max(2, (v / top) * 400);
        svg.append(s("rect", { x: 160, y, width: w, height: 34, rx: 6, fill: color, opacity: 0.8 }),
          s("text", { x: Math.min(160 + w + 8, 520), y: y + 24, class: "svg-text", "font-size": 15 }, fm(v, 3)));
      };
      row(25, pr.lt(x), L, "var(--shape-a)");
      row(95, pr.rt(x), R, "var(--shape-b)");
      clear(out);
      const near = Math.abs(x - pr.ans) < pr.step / 4;
      if (L !== null && R !== null && Math.abs(L - R) < 1e-9 && near) out.append(pill(true, `Both sides are equal: x = ${fm(pr.ans, 2)} ${pr.unit}.`, ""));
      else if (L === null || R === null) out.append(pill(false, "", "This x makes a denominator 0, so it can never be the answer."));
      else out.append(h("p", { class: "note" }, L > R ? "The left side is bigger. Keep sliding." : "The right side is bigger. Keep sliding."));
    }
    function setup(p) {
      pr = p; x = p.min;
      story.textContent = p.story; eqEl.textContent = p.eq;
      work.textContent = p.steps.join("\n"); work.hidden = true;
      clear(sliderBox);
      sliderBox.append(elasticSlider({ id: "g8l7-x", label: "x =", min: p.min, max: p.max, value: p.min, step: p.step, format: (v) => fm(v, p.step < 1 ? 1 : 0), onInput: (v) => { x = v; draw(); } }).el, showBtn);
      draw();
    }
    root.append(h("div", { class: "controls" }, segmented(PROBS, PROBS[0], setup, (p) => p.label)), story, eqEl, sliderBox, svg, out, work,
      h("p", { class: "note" }, "Each story becomes two equal ratios. Slide x until the two bars match, then solve it exactly by cross-multiplying."));
    setup(PROBS[0]);
  }

  // ------------------------------------------------------------ lesson

  const WORK = [[2, 3], [3, 6], [4, 12], [6, 12], [2, 6], [4, 4], [10, 15], [12, 24], [6, 3], [5, 20]];

  Sim.register({
    id: "lesson7", unit: "C", num: 7, letter: "G", title: "Rational Algebraic Equations", simName: "Work-Rate Lab",
    comps: ["A12", "M7"], cycles: "C7,M3 – C8,M2", deped: "DepEd Weeks 7–8",
    bigQuestion: "If 3 friends can paint a wall in 4 hours, how long would it take 5 friends?",
    mission: [
      "Cross-Multiply: press Cross-multiply and watch the products swing across. Then Solve and Check.",
      "Switch to “same denominators”. Which candidate gets rejected, and why?",
      "Work Together: predict how long Pipe A (3 h) and Pipe B (6 h) take together, then press Start.",
      "Make both workers take 4 h. Is together 2 h? Why is it not 8 h?",
      "Proportion Problems: solve the Painting crew problem – it answers the Big Question.",
    ],
    discovery: "Cross-multiplying turns a rational equation into an equation with no fractions: a/b = c/d becomes ad = bc. In work problems the RATES add: 1/a + 1/b = 1/t. Every answer must be checked, because a value that makes a denominator 0 is not allowed and must be rejected. Five friends paint the wall in 12/5 = 2.4 hours.",
    mount(stage) {
      const body = h("div", { class: "stage-body" });
      const views = [crossTab, workTab, propTab];
      let stopper = null;
      const t = tabs(["Cross-Multiply", "Work Together", "Proportion Problems"], (i) => { if (stopper) stopper(); clear(body); stopper = views[i](body) || null; });
      stage.append(t.el, body);
      stopper = crossTab(body) || null;
      return () => { if (stopper) stopper(); };
    },
    check() {
      const kind = randInt(0, 4);
      if (kind === 0) {
        const e = makeEq("prop");
        return { q: `Solve: ${e.tok[0]}/(${e.tok[1]}) = ${e.tok[2]}/${e.tok[3]}`, answer: e.x0, explain: `Cross-multiply: ${e.linear}, so x = ${fm(e.x0)}.` };
      }
      if (kind === 1) {
        const [a, b] = pick(WORK), t = (a * b) / (a + b);
        return { q: `Pipe A fills a tank in ${a} hours and Pipe B in ${b} hours. How many hours do they take together?`, answer: t, tol: 0.01, unit: "h", explain: `1/${a} + 1/${b} = 1/t → t = ${a * b}/${a + b} = ${fm(t, 2)} h.` };
      }
      if (kind === 2) {
        const q = randInt(1, 9), c = randInt(2, 7);
        return { q: `Which value of x must be rejected in ${c}/(x − ${q}) = 2/5?`, choices: shuffle([String(q), fm(-q), "0", String(c)]), answer: String(q), explain: `x = ${q} makes the denominator x − ${q} equal to 0.` };
      }
      if (kind === 3) {
        const q = randInt(1, 6), p = randInt(1, 5), r = p + q;
        return { q: `Solve (x + ${p})/(x − ${q}) = ${r}/(x − ${q}).`, choices: shuffle([`x = ${q}`, "No solution", `x = ${fm(-q)}`, `x = ${r}`]), answer: "No solution", explain: `x + ${p} = ${r} gives x = ${q}, but x = ${q} makes the denominator 0. It is extraneous, so there is no solution.` };
      }
      const [n, hrs, m] = pick([[3, 4, 5], [2, 6, 3], [4, 3, 6], [3, 8, 4], [5, 6, 10], [6, 5, 3]]);
      return { q: `${n} friends can paint a wall in ${hrs} hours. Working at the same rate, how many hours would ${m} friends take?`, answer: (n * hrs) / m, tol: 0.01, unit: "h", explain: `The wall is ${n} × ${hrs} = ${n * hrs} friend-hours; ${n * hrs} ÷ ${m} = ${fm((n * hrs) / m, 2)} h.` };
    },
  });
})();
