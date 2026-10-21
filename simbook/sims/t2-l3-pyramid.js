/* Term 2 · Lesson 3 · C. Volume of Square and Rectangular Pyramids – Pyramid Lab */
(function () {
  "use strict";
  const { h, s, clear, randInt, pick, fmt, tabs, stat, pill, Spring, elasticSlider } = Sim;

  // Simple oblique projection of a box/pyramid with base l × w and height ht.
  const proj = (x, y, z, o, k) => ({ x: o.x + (x + y * 0.5) * k, y: o.y - (z + y * 0.35) * k });
  const P = (pts) => pts.map((p) => `${p.x},${p.y}`).join(" ");

  function prism(svg, o, l, w, ht, k, fill) {
    const c = (x, y, z) => proj(x, y, z, o, k);
    if (fill > 0.001) {
      const f = ht * fill;
      svg.append(s("polygon", { points: P([c(0, 0, 0), c(l, 0, 0), c(l, 0, f), c(0, 0, f)]), fill: "var(--shape-a-soft)" }));
      svg.append(s("polygon", { points: P([c(l, 0, 0), c(l, w, 0), c(l, w, f), c(l, 0, f)]), fill: "var(--shape-a-soft)" }));
      svg.append(s("polygon", { points: P([c(0, 0, f), c(l, 0, f), c(l, w, f), c(0, w, f)]), fill: "var(--shape-a)", opacity: 0.45 }));
    }
    const edges = [[c(0, 0, 0), c(l, 0, 0)], [c(l, 0, 0), c(l, w, 0)], [c(0, 0, ht), c(l, 0, ht)], [c(l, 0, ht), c(l, w, ht)], [c(l, w, ht), c(0, w, ht)], [c(0, w, ht), c(0, 0, ht)],
      [c(0, 0, 0), c(0, 0, ht)], [c(l, 0, 0), c(l, 0, ht)], [c(l, w, 0), c(l, w, ht)]];
    edges.forEach(([a, b]) => svg.append(s("line", { x1: a.x, y1: a.y, x2: b.x, y2: b.y, stroke: "var(--ink)", "stroke-width": 2 })));
    [[c(0, 0, 0), c(0, w, 0)], [c(0, w, 0), c(l, w, 0)], [c(0, w, 0), c(0, w, ht)]].forEach(([a, b]) => svg.append(s("line", { x1: a.x, y1: a.y, x2: b.x, y2: b.y, stroke: "var(--muted)", "stroke-width": 1.5, "stroke-dasharray": "5 4" })));
  }

  function pyramid(svg, o, l, w, ht, k, tilt = 0) {
    const c = (x, y, z) => proj(x, y, z, o, k);
    const apex0 = c(l / 2, w / 2, ht);
    const rot = (p) => { const a = (tilt * Math.PI) / 180, dx = p.x - apex0.x, dy = p.y - apex0.y; return { x: apex0.x + dx * Math.cos(a) - dy * Math.sin(a), y: apex0.y + dx * Math.sin(a) + dy * Math.cos(a) }; };
    const A = [c(0, 0, 0), c(l, 0, 0), c(l, w, 0), c(0, w, 0)].map(rot), T = apex0;
    svg.append(s("polygon", { points: P([A[0], A[1], T]), fill: "var(--shape-b-soft)", stroke: "var(--ink)", "stroke-width": 2 }));
    svg.append(s("polygon", { points: P([A[1], A[2], T]), fill: "var(--shape-b-soft)", stroke: "var(--ink)", "stroke-width": 2, opacity: 0.85 }));
    [[A[2], A[3]], [A[3], A[0]], [A[3], T]].forEach(([a, b]) => svg.append(s("line", { x1: a.x, y1: a.y, x2: b.x, y2: b.y, stroke: "var(--muted)", "stroke-width": 1.5, "stroke-dasharray": "5 4" })));
  }

  // ------------------------------------------------------------ pour three times

  function pourLab(root) {
    let l = 6, w = 4, ht = 6, pours = 0, fill = 0, tilt = 0;
    const svg = s("svg", { viewBox: "0 0 600 330", role: "img", "aria-label": "A pyramid poured into a prism" });
    const out = h("div", { class: "readout" }), work = h("pre", { class: "workings" });
    const fillSp = new Spring(0, (v) => { fill = v; draw(); }, { stiffness: 90, damping: 11 });
    const tiltSp = new Spring(0, (v) => { tilt = v; draw(); }, { stiffness: 120, damping: 14 });
    function draw() {
      clear(svg);
      const k = Math.min(26, 230 / Math.max(l + w * 0.5, ht + w * 0.35));
      pyramid(svg, { x: 40, y: 290 }, l, w, ht, k, tilt);
      prism(svg, { x: 330, y: 290 }, l, w, ht, k, Math.min(1, fill));
      svg.append(s("text", { x: 120, y: 318, "text-anchor": "middle", class: "svg-label" }, "pyramid"), s("text", { x: 410, y: 318, "text-anchor": "middle", class: "svg-label" }, "prism (same base, same height)"));
      const B = l * w, Vp = B * ht;
      clear(out);
      out.append(stat("Pours:", `${pours} of 3`).el, stat("Prism filled:", `${fmt(Math.min(1, fill) * 100, 0)}%`).el, pours === 3 ? pill(true, "3 pyramids fill 1 prism!", "") : null);
      work.textContent = `Base area B = l × w = ${fmt(l)} × ${fmt(w)} = ${fmt(B)} cm²\nPrism:   V = B × h = ${fmt(B)} × ${fmt(ht)} = ${fmt(Vp)} cm³\nPyramid: V = ⅓ × B × h = ⅓ × ${fmt(B)} × ${fmt(ht)} = ${fmt(Vp / 3, 2)} cm³`;
    }
    function pourOnce() {
      if (pours >= 3) return;
      pours++;
      tiltSp.set(60); setTimeout(() => tiltSp.set(0), 500);
      fillSp.set(pours / 3);
    }
    const reset = () => { pours = 0; fillSp.jump(0); draw(); };
    const live = (key) => (v) => { if (key === "l") l = v; else if (key === "w") w = v; else ht = v; reset(); };
    root.append(h("div", { class: "controls" },
      elasticSlider({ id: "t2l3-l", label: "Length", min: 2, max: 8, value: l, step: 1, format: (v) => fmt(v, 1), onInput: live("l") }).el,
      elasticSlider({ id: "t2l3-w", label: "Width", min: 2, max: 8, value: w, step: 1, format: (v) => fmt(v, 1), onInput: live("w") }).el,
      elasticSlider({ id: "t2l3-h", label: "Height", min: 2, max: 9, value: ht, step: 1, format: (v) => fmt(v, 1), onInput: live("h") }).el),
    h("div", { class: "controls" }, h("button", { class: "btn", type: "button", onclick: pourOnce }, "Pour the pyramid"), h("button", { class: "btn ghost", type: "button", onclick: reset }, "Empty")),
    svg, out, work);
    draw();
    return () => { fillSp.stop(); tiltSp.stop(); };
  }

  // ------------------------------------------------------------ estimate

  function estimate(root) {
    const area = h("div", { class: "stage-body" });
    function deal() {
      clear(area);
      const l = randInt(3, 9), w = pick([l, randInt(3, 9)]), ht = randInt(3, 12);
      const V = (l * w * ht) / 3;
      let guess = Math.round(V * (0.5 + Math.random()));
      const svg = s("svg", { viewBox: "0 0 600 260", role: "img", "aria-label": "Pyramid to estimate" });
      const k = Math.min(22, 210 / Math.max(l + w * 0.5, ht + w * 0.35));
      pyramid(svg, { x: 200, y: 240 }, l, w, ht, k);
      const res = h("div");
      const slider = elasticSlider({ id: "t2l3-g", label: "My estimate (cm³)", min: 1, max: Math.ceil(V * 2), value: guess, step: 1, format: (v) => fmt(v, 0), onInput: (v) => { guess = v; } });
      area.append(h("p", {}, `${l === w ? "Square" : "Rectangular"} pyramid: base ${l} cm × ${w} cm, height ${ht} cm. Estimate its volume.`), svg, slider.el,
        h("div", { class: "controls" }, h("button", { class: "btn", type: "button", onclick: () => {
          clear(res);
          const err = Math.abs(guess - V) / V;
          res.append(pill(err <= 0.15, `Great estimate! Within ${fmt(err * 100, 0)}%`, `Off by ${fmt(err * 100, 0)}%`),
            h("pre", { class: "workings" }, `Box around it: ${l} × ${w} × ${ht} = ${l * w * ht} cm³\nPyramid = ⅓ of the box = ${fmt(V, 2)} cm³`));
        } }, "Reveal"), h("button", { class: "btn ghost", type: "button", onclick: deal }, "New pyramid")), res);
    }
    root.append(area, h("p", { class: "note" }, "Tip: picture the box that fits around the pyramid, then take one-third."));
    deal();
  }

  Sim.register({
    id: "lesson12", unit: "D", num: 3, letter: "C", title: "Volume of Pyramids", simName: "Pyramid Lab",
    comps: ["A5", "A6", "A7", "M3"], cycles: "C3,M5 – C4,M4", deped: "DepEd Week 4",
    bigQuestion: "How many pyramids of sand fill a box with the same base and height?",
    mission: [
      "Pour the pyramid into the prism until the prism is full. How many pours did it take?",
      "Change the length, width, and height. Is it still the same number of pours?",
      "Write a formula for the volume of a pyramid using the base area B and the height h.",
      "Estimate: get within 15% on three different pyramids.",
    ],
    discovery: "Three pyramids fill a prism with the same base and the same height, for any size. So the volume of a pyramid is one-third of the prism: V = ⅓Bh, where B is the area of the base (l × w for a rectangle, s² for a square).",
    mount(stage) {
      const body = h("div", { class: "stage-body" });
      const views = [pourLab, estimate];
      let stopper = null;
      const t = tabs(["Pour Three Times", "Estimate"], (i) => { if (stopper) stopper(); clear(body); stopper = views[i](body) || null; });
      stage.append(t.el, body);
      stopper = pourLab(body);
      return () => { if (stopper) stopper(); };
    },
    check() {
      const kind = randInt(0, 3);
      if (kind <= 1) { const sd = pick([3, 4, 5, 6, 9]), ht = pick([3, 6, 9, 12]); const V = (sd * sd * ht) / 3; return { q: `Find the volume of a square pyramid with base edge ${sd} cm and height ${ht} cm.`, answer: V, unit: "cm³", explain: `⅓ × ${sd}² × ${ht} = ⅓ × ${sd * sd} × ${ht} = ${fmt(V, 2)} cm³.` }; }
      if (kind === 2) { const l = pick([4, 5, 6, 8]), w = pick([3, 6]), ht = pick([5, 9, 10]); const V = (l * w * ht) / 3; return { q: `Find the volume of a rectangular pyramid with base ${l} cm by ${w} cm and height ${ht} cm.`, answer: V, tol: 0.01, unit: "cm³", explain: `⅓ × ${l} × ${w} × ${ht} = ${fmt(V, 2)} cm³.` }; }
      const Vp = pick([60, 90, 120, 150]);
      return { q: `A prism has a volume of ${Vp} cm³. What is the volume of a pyramid with the same base and height?`, answer: Vp / 3, unit: "cm³", explain: `${Vp} ÷ 3 = ${Vp / 3} cm³.` };
    },
  });
})();
