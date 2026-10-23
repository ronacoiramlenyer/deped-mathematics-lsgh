/* Unit 4 · Lesson 10 · J. Inferential Statistics – Test Lab */
(function () {
  "use strict";
  const { h, s, clear, randInt, pick, shuffle, fmt, tabs, segmented, stat, pill, Spring, clamp, elasticSlider } = Sim;

  if (!document.getElementById("da-l10-style")) {
    document.head.append(h("style", { id: "da-l10-style" }, `
.tl-hyp { display: grid; gap: 2px; font-size: .92rem; background: var(--bg); border: 1px solid var(--line); border-radius: 8px; padding: 8px 12px; }
.tl-hyp b { font-family: var(--mono); font-weight: 500; }
.tl-call { border-left: 4px solid var(--gold); background: var(--gold-soft); border-radius: 0 8px 8px 0; padding: 8px 12px; font-size: .92rem; }
.tl-two { display: grid; grid-template-columns: minmax(0, 1.3fr) minmax(0, 1fr); gap: 12px; align-items: start; }
@media (max-width: 760px) { .tl-two { grid-template-columns: minmax(0, 1fr); } }
`));
  }

  // ------------------------------------------------------------ distributions (Student t via the regularized incomplete beta)

  function lgamma(x) {
    const c = [0.99999999999980993, 676.5203681218851, -1259.1392167224028, 771.32342877765313, -176.61502916214059, 12.507343278686905, -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7];
    if (x < 0.5) return Math.log(Math.PI / Math.abs(Math.sin(Math.PI * x))) - lgamma(1 - x);
    x -= 1;
    let a = c[0];
    const t = x + 7.5;
    for (let i = 1; i < 9; i++) a += c[i] / (x + i);
    return 0.5 * Math.log(2 * Math.PI) + (x + 0.5) * Math.log(t) - t + Math.log(a);
  }
  /** Continued fraction for the incomplete beta function (modified Lentz). */
  function betacf(a, b, x) {
    const EPS = 1e-14, TINY = 1e-300;
    let qab = a + b, qap = a + 1, qam = a - 1, c = 1, d = 1 - (qab * x) / qap;
    if (Math.abs(d) < TINY) d = TINY;
    d = 1 / d;
    let hh = d;
    for (let m = 1; m <= 300; m++) {
      const m2 = 2 * m;
      let aa = (m * (b - m) * x) / ((qam + m2) * (a + m2));
      d = 1 + aa * d; if (Math.abs(d) < TINY) d = TINY;
      c = 1 + aa / c; if (Math.abs(c) < TINY) c = TINY;
      d = 1 / d; hh *= d * c;
      aa = (-(a + m) * (qab + m) * x) / ((a + m2) * (qap + m2));
      d = 1 + aa * d; if (Math.abs(d) < TINY) d = TINY;
      c = 1 + aa / c; if (Math.abs(c) < TINY) c = TINY;
      d = 1 / d;
      const del = d * c;
      hh *= del;
      if (Math.abs(del - 1) < EPS) break;
    }
    return hh;
  }
  /** Regularized incomplete beta I_x(a, b). */
  function ibeta(x, a, b) {
    if (x <= 0) return 0;
    if (x >= 1) return 1;
    const bt = Math.exp(lgamma(a + b) - lgamma(a) - lgamma(b) + a * Math.log(x) + b * Math.log(1 - x));
    return x < (a + 1) / (a + b + 2) ? (bt * betacf(a, b, x)) / a : 1 - (bt * betacf(b, a, 1 - x)) / b;
  }
  /** Two-tailed p-value of Student’s t: P(|T| ≥ |t|) = I_{df/(df+t²)}(df/2, 1/2). */
  const tTwo = (t, df) => (Number.isFinite(t) ? ibeta(df / (df + t * t), df / 2, 0.5) : 0);
  const tPdf = (x, df) => Math.exp(lgamma((df + 1) / 2) - lgamma(df / 2) - 0.5 * Math.log(df * Math.PI) - ((df + 1) / 2) * Math.log(1 + (x * x) / df));
  /** Standard normal CDF (complementary error function, Numerical Recipes erfcc, |error| < 1.2e-7). */
  function phi(z) {
    const x = Math.abs(z) / Math.SQRT2, t = 1 / (1 + 0.5 * x);
    const r = t * Math.exp(-x * x - 1.26551223 + t * (1.00002368 + t * (0.37409196 + t * (0.09678418 + t * (-0.18628806 + t * (0.27886807 + t * (-1.13520398 + t * (1.48851587 + t * (-0.82215223 + t * 0.17087277)))))))));
    return z >= 0 ? 1 - r / 2 : r / 2;
  }
  const nPdf = (x) => Math.exp(-x * x / 2) / Math.sqrt(2 * Math.PI);
  // Self-check against known values (t = 2.0, df = 10 → p ≈ 0.0734; t = 2.228, df = 10 → p ≈ 0.05; z = 1.96 → p ≈ 0.05).
  const SELF = [[tTwo(2, 10), 0.07339], [tTwo(2.228, 10), 0.05], [2 * (1 - phi(1.96)), 0.05], [tTwo(1, 1), 0.5]];
  if (SELF.some(([got, want]) => Math.abs(got - want) > 5e-4)) console.warn("Test Lab: distribution self-check failed", SELF);

  const mean = (a) => a.reduce((x, y) => x + y, 0) / a.length;
  const sdS = (a) => { const m = mean(a); return Math.sqrt(a.reduce((t, x) => t + (x - m) ** 2, 0) / (a.length - 1)); };
  const pText = (p) => (p < 0.0001 ? "< 0.0001" : fmt(p, 4));
  function gauss() { let u = 0, v = 0; while (!u) u = Math.random(); while (!v) v = Math.random(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); }
  /** First n deviates rescaled to mean 0 and sample SD 1, so the slider values are exactly the sample statistics. */
  function standard(z, n) { const a = z.slice(0, n), m = mean(a), sd = sdS(a) || 1; return a.map((x) => (x - m) / sd); }

  /** Draws a bell curve with shaded tails beyond ±|stat| (or the right tail only). */
  function curve(g, { pdf, stat: st, tails, W, H, x0, y0, xmax = 4.5, label }) {
    clear(g);
    const X = (x) => x0 + ((x + xmax) / (2 * xmax)) * W, top = pdf(0), Y = (y) => y0 - (y / top) * (H - 16);
    const pts = []; for (let k = 0; k <= 160; k++) { const x = -xmax + (2 * xmax * k) / 160; pts.push([X(x), Y(pdf(x))]); }
    const a = Math.abs(st), cut = Math.min(a, xmax);
    const area = (from, to) => { const p = []; for (let k = 0; k <= 50; k++) { const x = from + ((to - from) * k) / 50; p.push(`${X(x)},${Y(pdf(x))}`); } return `M${X(from)},${y0} L${p.join(" L")} L${X(to)},${y0} Z`; };
    if (cut < xmax) {
      g.append(s("path", { d: area(tails === "right" ? Math.min(st, xmax) : cut, xmax), fill: "var(--shape-b-soft)", stroke: "var(--shape-b)" }));
      if (tails !== "right") g.append(s("path", { d: area(-xmax, -cut), fill: "var(--shape-b-soft)", stroke: "var(--shape-b)" }));
    }
    g.append(s("polyline", { points: pts.map((p) => p.join(",")).join(" "), fill: "none", stroke: "var(--ink)", "stroke-width": 2 }));
    g.append(s("line", { x1: x0, y1: y0, x2: x0 + W, y2: y0, stroke: "var(--ink)" }));
    for (let x = -4; x <= 4; x += 2) g.append(s("text", { x: X(x), y: y0 + 16, "text-anchor": "middle", class: "svg-text", "font-size": 11 }, String(x)));
    const sx = X(clamp(st, -xmax, xmax));
    g.append(s("line", { x1: sx, y1: y0, x2: sx, y2: y0 - H + 4, stroke: "var(--shape-b)", "stroke-width": 2.5 }), s("text", { x: clamp(sx, x0 + 40, x0 + W - 40), y: y0 - H, "text-anchor": "middle", class: "svg-text", "font-size": 12, "font-weight": 700, fill: "var(--shape-b)" }, `${label} = ${fmt(st, 2)}`));
  }

  // ------------------------------------------------------------ tab 1 · two groups (t-test)

  function twoGroups(root) {
    const NMAX = 30;
    let zA = Array.from({ length: NMAX }, gauss), zB = Array.from({ length: NMAX }, gauss);
    const jit = Array.from({ length: 2 * NMAX }, () => Math.random());
    const st = { d: 2, sd: 2, n: 12 };
    const X0 = 40, X1 = 580, HMAX = 20, X = (v) => X0 + (clamp(v, 0, HMAX) / HMAX) * (X1 - X0);
    const svg = s("svg", { viewBox: "0 0 600 250", role: "img", "aria-label": "Study hours of two sections as dot clouds" });
    const grid = s("g"), dotsG = s("g"), meanG = s("g");
    svg.append(grid, dotsG, meanG);
    for (let v = 0; v <= HMAX; v += 2) grid.append(s("line", { x1: X(v), y1: 20, x2: X(v), y2: 220, stroke: "var(--grid)" }), s("text", { x: X(v), y: 238, "text-anchor": "middle", class: "svg-text", "font-size": 12 }, String(v)));
    grid.append(s("text", { x: X1, y: 14, "text-anchor": "end", class: "svg-label" }, "study hours per week"), s("text", { x: X0, y: 34, class: "svg-label", fill: "var(--shape-a)" }, "Section A"), s("text", { x: X0, y: 134, class: "svg-label", fill: "var(--shape-b)" }, "Section B"));
    const dots = Array.from({ length: 2 * NMAX }, (_, i) => { const c = s("circle", { r: 6, fill: i < NMAX ? "var(--shape-a-soft)" : "var(--shape-b-soft)", stroke: i < NMAX ? "var(--shape-a)" : "var(--shape-b)", "stroke-width": 2 }); dotsG.append(c); return c; });
    const mA = s("line", { stroke: "var(--shape-a)", "stroke-width": 3 }), mB = s("line", { stroke: "var(--shape-b)", "stroke-width": 3 });
    meanG.append(mA, mB);
    const curveSvg = s("svg", { viewBox: "0 0 360 170", role: "img", "aria-label": "t distribution with the observed t and shaded tails" });
    const cg = s("g"); curveSvg.append(cg);
    const out = h("div", { class: "readout" }), verdict = h("div", { class: "readout", "aria-live": "polite" }), work = h("pre", { class: "workings" });
    const targetVals = () => {
      const a = standard(zA, NMAX), b = standard(zB, NMAX), sa = standard(zA, st.n), sb = standard(zB, st.n);
      const mAv = 10 - st.d / 2, mBv = 10 + st.d / 2;
      // dots beyond n keep their place in the full cloud (they fade out)
      return [...Array.from({ length: NMAX }, (_, i) => mAv + st.sd * (i < st.n ? sa[i] : a[i])), ...Array.from({ length: NMAX }, (_, i) => mBv + st.sd * (i < st.n ? sb[i] : b[i])),
        ...Array.from({ length: 2 * NMAX }, (_, i) => ((i % NMAX) < st.n ? 1 : 0)), mAv, mBv];
    };
    let tShown = 0;
    const sp = new Spring(targetVals(), (v) => {
      dots.forEach((c, i) => { c.setAttribute("cx", X(v[i])); c.setAttribute("cy", (i < NMAX ? 60 : 160) + (jit[i] - 0.5) * 56); c.setAttribute("opacity", String(clamp(v[2 * NMAX + i], 0, 1))); });
      const a = v[4 * NMAX], b = v[4 * NMAX + 1];
      mA.setAttribute("x1", X(a)); mA.setAttribute("x2", X(a)); mA.setAttribute("y1", 24); mA.setAttribute("y2", 100);
      mB.setAttribute("x1", X(b)); mB.setAttribute("x2", X(b)); mB.setAttribute("y1", 124); mB.setAttribute("y2", 200);
    }, { stiffness: 160, damping: 16 });
    const tSp = new Spring(0, (v) => { tShown = v; curve(cg, { pdf: (x) => tPdf(x, 2 * st.n - 2), stat: v, tails: "two", W: 320, H: 130, x0: 20, y0: 145, label: "t" }); }, { stiffness: 140, damping: 15 });
    function compute() {
      const se = st.sd * Math.sqrt(2 / st.n), t = st.d / se, df = 2 * st.n - 2, p = tTwo(t, df);
      sp.set(targetVals()); tSp.set(t);
      clear(out);
      out.append(stat("Mean A:", fmt(10 - st.d / 2, 2) + " h").el, stat("Mean B:", fmt(10 + st.d / 2, 2) + " h").el, stat("SD (each):", fmt(st.sd, 2)).el, stat("n per section:", String(st.n)).el,
        stat("t:", fmt(t, 3)).el, stat("df:", String(df)).el, stat("p-value:", pText(p)).el);
      clear(verdict);
      verdict.append(pill(p < 0.05, "Significant at 0.05 – reject H₀", "Not significant at 0.05 – do not reject H₀"));
      work.textContent = `t = (x̄B − x̄A) ÷ (sₚ × √(2/n)) = ${fmt(st.d, 2)} ÷ (${fmt(st.sd, 2)} × √(2/${st.n})) = ${fmt(t, 3)}\n` +
        `df = 2n − 2 = ${df}\n=T.TEST(A2:A${st.n + 1}, B2:B${st.n + 1}, 2, 2)  →  p = ${pText(p)}\n` +
        (p < 0.05 ? `p < 0.05: a difference this big would be unlikely if the sections really studied the same amount.` : `p ≥ 0.05: a difference this big could easily happen by chance, so the data do not show a real difference.`);
    }
    const sliders = [
      elasticSlider({ id: "da-l10-d", label: "Difference in means", min: 0, max: 5, value: st.d, step: 0.5, format: (v) => fmt(v, 1) + " h", onInput: (v) => { st.d = v; compute(); }, onChange: (v) => { st.d = v; compute(); } }),
      elasticSlider({ id: "da-l10-sd", label: "Spread (SD)", min: 0.5, max: 3, value: st.sd, step: 0.25, format: (v) => fmt(v, 2) + " h", onInput: (v) => { st.sd = v; compute(); }, onChange: (v) => { st.sd = v; compute(); } }),
      elasticSlider({ id: "da-l10-n", label: "Sample size n", min: 5, max: 30, value: st.n, step: 1, format: (v) => fmt(v, 0), onInput: (v) => { st.n = Math.max(5, Math.round(v)); compute(); }, onChange: (v) => { st.n = v; compute(); } }),
    ];
    root.append(h("p", {}, "Do two Grade 11 sections differ in mean study hours per week? (sample data) Change the difference, the spread and the sample size, and watch the t statistic and the p-value."),
      h("div", { class: "tl-hyp" }, h("span", {}, "H₀ (null): ", h("b", {}, "μA = μB"), " – the sections study the same amount on average."), h("span", {}, "H₁ (alternative): ", h("b", {}, "μA ≠ μB"), " – they differ. Significance level α = 0.05.")),
      h("div", { class: "controls" }, ...sliders.map((x) => x.el)),
      svg, out, h("div", { class: "tl-two" }, curveSvg, h("div", { class: "stage-body" }, verdict, work)),
      h("div", { class: "controls" }, h("button", { class: "btn ghost", type: "button", onclick: () => { zA = Array.from({ length: NMAX }, gauss); zB = Array.from({ length: NMAX }, gauss); compute(); } }, "New samples")),
      h("p", { class: "note" }, "The p-value is the chance of getting a difference at least this big IF H₀ were true. A small p-value is evidence against H₀; it does not prove H₁, and it does not say how important the difference is."));
    sp.jump(targetVals());
    compute();
    return () => { sp.stop(); tSp.stop(); };
  }

  // ------------------------------------------------------------ tab 2 · one-sample z-test

  function zTest(root) {
    const st = { xbar: 78, n: 25, sigma: 10, tails: "two" };
    const MU = 75;
    const svg = s("svg", { viewBox: "0 0 600 250", role: "img", "aria-label": "Standard normal curve with shaded tails beyond the z statistic" });
    const g = s("g"); svg.append(g);
    const out = h("div", { class: "readout" }), verdict = h("div", { class: "readout", "aria-live": "polite" }), work = h("pre", { class: "workings" });
    const zOf = () => (st.xbar - MU) / (st.sigma / Math.sqrt(st.n));
    const pOf = (z) => (st.tails === "two" ? 2 * (1 - phi(Math.abs(z))) : 1 - phi(z));
    const sp = new Spring(zOf(), (z) => {
      curve(g, { pdf: nPdf, stat: z, tails: st.tails, W: 540, H: 200, x0: 30, y0: 220, label: "z" });
      const p = pOf(z);
      g.append(s("text", { x: 570, y: 30, "text-anchor": "end", class: "svg-text", "font-size": 13, fill: "var(--shape-b)" }, `shaded area = ${pText(p)}`));
    }, { stiffness: 120, damping: 14 });
    function compute() {
      const z = zOf(), p = pOf(z), zt = 1 - phi(z);
      sp.set(z);
      clear(out);
      out.append(stat("x̄:", fmt(st.xbar, 1)).el, stat("σ/√n:", fmt(st.sigma / Math.sqrt(st.n), 3)).el, stat("z:", fmt(z, 3)).el, stat("p-value:", pText(p)).el);
      clear(verdict);
      verdict.append(pill(p < 0.05, "Significant at 0.05", "Not significant at 0.05"));
      work.textContent = `z = (x̄ − μ₀) ÷ (σ/√n) = (${fmt(st.xbar, 1)} − ${MU}) ÷ (${st.sigma}/√${st.n}) = ${fmt(z, 3)}\n` +
        `=Z.TEST(B2:B${st.n + 1}, ${MU}, ${st.sigma})  →  ${pText(zt)}   (Sheets gives the ONE-tailed, right-side p)\n` +
        (st.tails === "two" ? `two-tailed p = 2 × MIN(Z.TEST(…), 1 − Z.TEST(…)) = ${pText(p)}` : `right-tailed p = Z.TEST(…) = ${pText(p)}`);
    }
    const sliders = [
      elasticSlider({ id: "da-l10-xbar", label: "Sample mean x̄", min: 68, max: 82, value: st.xbar, step: 0.5, format: (v) => fmt(v, 1), onInput: (v) => { st.xbar = v; compute(); }, onChange: (v) => { st.xbar = v; compute(); } }),
      elasticSlider({ id: "da-l10-zn", label: "Sample size n", min: 4, max: 100, value: st.n, step: 1, format: (v) => fmt(v, 0), onInput: (v) => { st.n = Math.max(4, Math.round(v)); compute(); }, onChange: (v) => { st.n = v; compute(); } }),
      elasticSlider({ id: "da-l10-sig", label: "Known σ", min: 5, max: 20, value: st.sigma, step: 1, format: (v) => fmt(v, 0), onInput: (v) => { st.sigma = Math.round(v); compute(); }, onChange: (v) => { st.sigma = v; compute(); } }),
    ];
    root.append(h("p", {}, "A reading test has a population mean of μ₀ = 75 with a known standard deviation σ (sample scenario). A class of n learners who used a reading app has mean x̄. Is the class different from 75?"),
      h("div", { class: "tl-hyp" }, h("span", {}, "H₀: ", h("b", {}, "μ = 75"), "  ·  H₁: ", h("b", {}, st.tails === "two" ? "μ ≠ 75" : "μ > 75")), h("span", { class: "note" }, "Use a z-test when σ is known (or n is large); use a t-test when σ must be estimated from the sample.")),
      h("div", { class: "controls" }, segmented(["two", "right"], st.tails, (v) => { st.tails = v; root.querySelector(".tl-hyp b:nth-of-type(2)").textContent = v === "two" ? "μ ≠ 75" : "μ > 75"; compute(); }, (v) => (v === "two" ? "Two-tailed (≠)" : "Right-tailed (>)"))),
      h("div", { class: "controls" }, ...sliders.map((x) => x.el)),
      svg, out, verdict, work,
      h("p", { class: "note" }, "Same x̄, bigger n: σ/√n shrinks, z grows, and the tails get thinner. With a large sample, even a tiny difference can be “significant” – always ask whether it is big enough to matter."));
    sp.jump(zOf()); compute();
    return () => sp.stop();
  }

  // ------------------------------------------------------------ tab 3 · correlation and regression

  function corrReg(root) {
    const pts = [[1, 62], [2, 65], [3, 70], [3, 66], [4, 74], [5, 78], [6, 80], [7, 79], [8, 88], [10, 90]].map(([x, y]) => ({ x, y }));
    const X0 = 50, X1 = 570, Y0 = 300, Y1 = 20, XM = 12, YLO = 40, YHI = 100;
    const PX = (x) => X0 + (x / XM) * (X1 - X0), PY = (y) => Y0 - ((y - YLO) / (YHI - YLO)) * (Y0 - Y1);
    const VX = (px) => ((px - X0) / (X1 - X0)) * XM, VY = (py) => YLO + ((Y0 - py) / (Y0 - Y1)) * (YHI - YLO);
    const svg = s("svg", { viewBox: "0 0 600 340", role: "img", "aria-label": "Scatter plot of study hours and quiz scores with a regression line. Drag the points." });
    const grid = s("g"), lineG = s("g"), layer = s("g");
    svg.append(grid, lineG, layer);
    for (let x = 0; x <= XM; x += 2) grid.append(s("line", { x1: PX(x), y1: Y1, x2: PX(x), y2: Y0, stroke: "var(--grid)" }), s("text", { x: PX(x), y: Y0 + 18, "text-anchor": "middle", class: "svg-text", "font-size": 12 }, String(x)));
    for (let y = YLO; y <= YHI; y += 10) grid.append(s("line", { x1: X0, y1: PY(y), x2: X1, y2: PY(y), stroke: "var(--grid)" }), s("text", { x: X0 - 8, y: PY(y) + 4, "text-anchor": "end", class: "svg-text", "font-size": 12 }, String(y)));
    grid.append(s("text", { x: X1, y: Y0 + 36, "text-anchor": "end", class: "svg-label" }, "study hours per week (A)"), s("text", { x: X0, y: 12, class: "svg-label" }, "quiz score (B)"));
    const line = s("line", { stroke: "var(--shape-b)", "stroke-width": 3, "stroke-linecap": "round" }), eq = s("text", { class: "svg-text", "font-size": 13, "font-weight": 700, fill: "var(--shape-b)" });
    lineG.append(line, eq);
    const top = s("g", { "pointer-events": "none" }); svg.append(top);
    const dots = pts.map(() => { const c = s("circle", { r: 6, fill: "var(--shape-a)", stroke: "none" }); top.append(c); return c; });
    const out = h("div", { class: "readout" }), work = h("pre", { class: "workings" }), strength = h("div", { class: "readout" });
    const fit = () => {
      const n = pts.length, mx = mean(pts.map((p) => p.x)), my = mean(pts.map((p) => p.y));
      let sxy = 0, sxx = 0, syy = 0;
      pts.forEach((p) => { sxy += (p.x - mx) * (p.y - my); sxx += (p.x - mx) ** 2; syy += (p.y - my) ** 2; });
      const slope = sxx ? sxy / sxx : 0, icpt = my - slope * mx, r = sxx && syy ? sxy / Math.sqrt(sxx * syy) : 0;
      return { n, slope, icpt, r };
    };
    const ls = new Spring((() => { const f = fit(); return [f.icpt, f.icpt + f.slope * XM]; })(), ([a, b]) => {
      const ya = clamp(a, YLO - 30, YHI + 30), yb = clamp(b, YLO - 30, YHI + 30);
      line.setAttribute("x1", PX(0)); line.setAttribute("y1", PY(ya)); line.setAttribute("x2", PX(XM)); line.setAttribute("y2", PY(yb));
      eq.setAttribute("x", PX(0) + 10); eq.setAttribute("y", PY(YHI) + 18); eq.setAttribute("text-anchor", "start");
      const sl = (b - a) / XM; eq.textContent = `ŷ = ${fmt(a, 1)} ${sl < 0 ? "−" : "+"} ${fmt(Math.abs(sl), 2)}x`;
    }, { stiffness: 110, damping: 14 });
    const flatPx = () => pts.flatMap((p) => [PX(p.x), PY(p.y)]);
    const handles = Sim.handleSet(svg, layer, {
      label: "Data point", r: 12, bounds: { x0: PX(0), x1: PX(XM), y0: PY(YHI), y1: PY(YLO) },
      onMove: (i, p) => { disp.stop(); pts[i] = { x: clamp(VX(p.x), 0, XM), y: clamp(VY(p.y), YLO, YHI) }; disp.value[2 * i] = p.x; disp.value[2 * i + 1] = p.y; render(disp.value); stats(); },
      onEnd: (i, p) => { pts[i] = { x: Math.round(VX(p.x) * 2) / 2, y: Math.round(VY(p.y)) }; disp.set(flatPx()); stats(); },
    });
    /** Display positions spring to the data, so a point dragged past the edge or between grid values snaps back elastically. */
    const disp = new Spring(flatPx(), (v) => render(v), { stiffness: 230, damping: 16 });
    function render(v) {
      const P = Sim.unflat(v);
      handles.sync(P);
      P.forEach((p, i) => { dots[i].setAttribute("cx", p.x); dots[i].setAttribute("cy", p.y); });
    }
    function stats() {
      const f = fit();
      ls.set([f.icpt, f.icpt + f.slope * XM]);
      const tr = Math.abs(f.r) >= 1 ? Infinity : f.r * Math.sqrt((f.n - 2) / (1 - f.r * f.r)), p = tTwo(tr, f.n - 2);
      clear(out);
      out.append(stat("r (CORREL):", fmt(f.r, 3)).el, stat("slope (SLOPE):", fmt(f.slope, 3)).el, stat("intercept (INTERCEPT):", fmt(f.icpt, 2)).el, stat("R² (RSQ):", fmt(f.r * f.r, 3)).el, stat("p for r:", pText(p)).el);
      const a = Math.abs(f.r), word = a >= 0.8 ? "strong" : a >= 0.5 ? "moderate" : a >= 0.3 ? "weak" : "very weak or no";
      clear(strength);
      strength.append(pill(a >= 0.5, `${word} ${f.r > 0 ? "positive" : "negative"} linear relationship`, `${word} linear relationship`), pill(p < 0.05, "significant at 0.05", "not significant at 0.05"));
      work.textContent = `=CORREL(A2:A11, B2:B11)     → ${fmt(f.r, 3)}\n=SLOPE(B2:B11, A2:A11)      → ${fmt(f.slope, 3)}    (y-values first!)\n=INTERCEPT(B2:B11, A2:A11)  → ${fmt(f.icpt, 2)}\n=RSQ(B2:B11, A2:A11)        → ${fmt(f.r * f.r, 3)}\n` +
        `Prediction for 9 hours: ${fmt(f.icpt, 2)} ${f.slope < 0 ? "−" : "+"} ${fmt(Math.abs(f.slope), 3)} × 9 ≈ ${fmt(f.icpt + 9 * f.slope, 1)}. R² = ${fmt(f.r * f.r * 100, 0)}% of the variation in scores is explained by the line.`;
    }
    root.append(h("p", {}, "Does studying longer go with higher quiz scores? Ten learners (sample data). Drag any point – r, the slope, the intercept, R² and the regression line follow."),
      svg, out, strength, work,
      h("div", { class: "tl-call" }, h("strong", {}, "Correlation is not causation. "), "A strong r shows that hours and scores move together in this sample. It does not prove that studying longer CAUSES higher scores: interest in the subject, sleep, or a tutor could affect both. Only a controlled experiment can test cause and effect. Also, do not predict far outside the data (for example, 30 hours)."));
    render(disp.value); stats();
    return () => { ls.stop(); disp.stop(); };
  }

  // ------------------------------------------------------------ register

  Sim.register({
    id: "lesson10", unit: "4", num: 10, letter: "J", title: "Inferential Statistics", simName: "Test Lab",
    comps: ["A2.2", "M8"], sessions: "S47–S52", cg: "CG Part 2 · Content 1 (Descriptive and Inferential Statistics)", deped: "CG Part 2 · Content 1 (Descriptive and Inferential Statistics)",
    bigQuestion: "What do the numbers really show – and what do they not prove?",
    mission: [
      "Two Groups: with a 2-hour difference, change only the spread. When does the difference stop being significant? Now change only n.",
      "Set the difference to 0 and press New samples several times. Is p ever below 0.05? What does a p-value mean?",
      "z-test: keep x̄ = 78 and slide n from 4 to 100. Why does the same difference become significant? Compare two-tailed and right-tailed.",
      "Correlation and Regression: “Does studying longer mean higher grades?” Guess r first, then read it. Drag one point to make an outlier – what happens to r and the line? Does r prove that studying causes higher scores?",
    ],
    discovery: "An inferential test asks whether a pattern in a sample is bigger than chance. We state H₀ (no difference) and H₁, compute a test statistic (t or z), and find the p-value: the chance of a result at least this extreme if H₀ were true. If p < 0.05 we reject H₀. Bigger differences, smaller spread and bigger samples give smaller p-values. In Sheets: T.TEST, Z.TEST (one-tailed), CORREL, SLOPE, INTERCEPT and RSQ. A significant result is evidence, not proof; it may be too small to matter, and a correlation never shows cause and effect by itself.",
    mount(stage) {
      const body = h("div", { class: "stage-body" });
      const views = [twoGroups, zTest, corrReg];
      let stopper = null;
      const t = tabs(["Two Groups", "z-test", "Correlation and Regression"], (i) => { if (stopper) stopper(); clear(body); stopper = views[i](body) || null; });
      stage.append(t.el, body);
      stopper = twoGroups(body);
      return () => { if (stopper) stopper(); };
    },
    check() {
      const kind = randInt(0, 6);
      if (kind === 0) {
        const mu = pick([70, 75, 80]), sigma = pick([8, 10, 12]), n = pick([16, 25, 36, 64]), xbar = mu + pick([-4, -3, -2, 2, 3, 4, 5]);
        const z = (xbar - mu) / (sigma / Math.sqrt(n));
        return { q: `A class of n = ${n} has mean ${xbar}. The population mean is ${mu} with known σ = ${sigma}. Compute z = (x̄ − μ) ÷ (σ/√n).`, answer: z, tol: 0.01, explain: `σ/√n = ${sigma}/${Math.sqrt(n)} = ${fmt(sigma / Math.sqrt(n), 3)}; z = ${xbar - mu} ÷ ${fmt(sigma / Math.sqrt(n), 3)} = ${fmt(z, 3)}.` };
      }
      if (kind === 1) {
        const p = pick([0.003, 0.012, 0.031, 0.048, 0.062, 0.18, 0.41]);
        return { q: `A t-test gives p = ${p}. At the 0.05 significance level, what do you conclude?`, choices: ["Reject H₀ – the difference is statistically significant", "Do not reject H₀ – the data do not show a difference"], answer: p < 0.05 ? "Reject H₀ – the difference is statistically significant" : "Do not reject H₀ – the data do not show a difference", explain: `${p} is ${p < 0.05 ? "less" : "not less"} than 0.05.` };
      }
      if (kind === 2) {
        const a = pick([50, 55, 60]), b = pick([2.5, 3, 3.5, 4]), x = randInt(3, 9);
        return { q: `The regression line of quiz score on study hours is ŷ = ${a} + ${b}x. Predict the score for ${x} hours.`, answer: a + b * x, tol: 0.01, explain: `${a} + ${b} × ${x} = ${a + b * x}.` };
      }
      if (kind === 3) {
        const r = pick([0.92, 0.85, 0.7, 0.6, 0.45]);
        return { q: `Study hours and quiz scores have r = ${r}. What is R², as a percent?`, answer: r * r * 100, tol: 0.05, unit: "%", explain: `R² = ${r}² = ${fmt(r * r, 4)} → ${fmt(r * r * 100, 2)}% of the variation in scores is explained by the line.` };
      }
      if (kind === 4) return pick([
        { q: "Ice-cream sales and drowning cases in Metro Manila rise together in summer (r = 0.8). What can we conclude?", choices: ["They are correlated; hot weather may affect both", "Ice cream causes drowning", "Drowning causes ice-cream sales", "The correlation must be a mistake"], answer: "They are correlated; hot weather may affect both", explain: "Correlation is not causation – a third variable (heat) can drive both." },
        { q: "What does a p-value of 0.03 mean?", choices: ["If H₀ were true, a result this extreme would happen about 3% of the time", "There is a 3% chance H₁ is true", "The difference is 3%", "97% of learners agree"], answer: "If H₀ were true, a result this extreme would happen about 3% of the time", explain: "The p-value assumes H₀ and measures how surprising the data are." },
        { q: "Which Sheets formula runs a two-tailed, two-sample t-test with equal variances?", choices: ["=T.TEST(A2:A13, B2:B13, 2, 2)", "=T.TEST(A2:A13, B2:B13, 1, 1)", "=Z.TEST(A2:A13, B2:B13)", "=CORREL(A2:A13, B2:B13)"], answer: "=T.TEST(A2:A13, B2:B13, 2, 2)", explain: "tails = 2 (two-tailed), type = 2 (two-sample, equal variance)." },
        { q: "In =SLOPE(B2:B11, A2:A11), which range holds the x-values (study hours)?", choices: ["A2:A11", "B2:B11", "Both", "Neither"], answer: "A2:A11", explain: "SLOPE(known_y, known_x): the y-values come first." },
      ]);
      if (kind === 5) return pick([
        { q: "Keeping the same difference in means, which change makes a t-test MORE likely to be significant?", choices: ["A larger sample size", "More spread in the data", "A smaller sample size", "Rounding the data"], answer: "A larger sample size", explain: "A larger n shrinks the standard error, so t grows and p shrinks." },
        { q: "A study of 20 000 learners finds a significant difference of 0.1 points in mean score. What should you say?", choices: ["It is statistically significant but probably too small to matter", "It is a huge, important effect", "It proves the cause", "It cannot be significant"], answer: "It is statistically significant but probably too small to matter", explain: "With a huge n, tiny differences become significant; judge practical importance too." },
        { q: "When should you use a z-test instead of a t-test for one mean?", choices: ["When the population σ is known", "When the sample is tiny and σ is unknown", "When comparing two correlations", "Never"], answer: "When the population σ is known", explain: "The z-test uses a known σ; the t-test estimates it from the sample." },
      ]);
      const t = pick([1.2, 1.8, 2.0, 2.4, 3.1]), df = pick([10, 15, 20]);
      const p = tTwo(t, df);
      return { q: `A two-sample t-test gives t = ${t} with df = ${df}, so the two-tailed p-value is ${fmt(p, 4)}. Is the result significant at 0.05?`, choices: ["Yes", "No"], answer: p < 0.05 ? "Yes" : "No", explain: `p = ${fmt(p, 4)} is ${p < 0.05 ? "below" : "not below"} 0.05.` };
    },
  });
})();
