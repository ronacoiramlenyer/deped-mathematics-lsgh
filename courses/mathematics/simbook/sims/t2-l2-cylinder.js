/* Term 2 · Lesson 2 · B. Volume of a Cylinder – Cylinder Lab */
(function () {
  "use strict";
  const { h, s, clear, randInt, pick, fmt, tabs, stat, pill, Spring, elasticSlider } = Sim;
  const PI = 3.14;

  /** Draws a cylinder of radius r and height ht (cm) filled to `fill` (0–1). */
  function cylinder(svg, cx, base, r, ht, scale, fill, color, label) {
    const R = r * scale, H = ht * scale, ry = R * 0.32;
    const top = base - H, level = base - H * fill;
    svg.append(s("path", { d: `M${cx - R},${top} L${cx - R},${base} A${R},${ry} 0 0 0 ${cx + R},${base} L${cx + R},${top}`, fill: "var(--paper)", stroke: "var(--ink)", "stroke-width": 2 }));
    if (fill > 0.001) {
      svg.append(s("path", { d: `M${cx - R},${level} L${cx - R},${base} A${R},${ry} 0 0 0 ${cx + R},${base} L${cx + R},${level} A${R},${ry} 0 0 1 ${cx - R},${level}`, fill: color, opacity: 0.85 }));
      svg.append(s("ellipse", { cx, cy: level, rx: R, ry, fill: color, stroke: "var(--paper)", opacity: 0.95 }));
    }
    svg.append(s("ellipse", { cx, cy: top, rx: R, ry, fill: "none", stroke: "var(--ink)", "stroke-width": 2 }));
    if (label) svg.append(s("text", { x: cx, y: base + ry + 22, "text-anchor": "middle", class: "svg-text" }, label));
  }

  // ------------------------------------------------------------ stack the circles

  function stack(root) {
    let r = 3, ht = 5;
    const svg = s("svg", { viewBox: "0 0 600 360", role: "img", "aria-label": "Circles stacked into a cylinder" });
    const out = h("div", { class: "readout" }), work = h("pre", { class: "workings" });
    function draw() {
      clear(svg);
      const scale = Math.min(26, 150 / Math.max(r, ht / 1.6));
      const cx = 380, base = 320, R = r * scale, ry = R * 0.32;
      // left: the base circle with its area
      const bx = 110, by = 150, br = Math.min(85, r * 20);
      svg.append(s("circle", { cx: bx, cy: by, r: br, fill: "var(--shape-a-soft)", stroke: "var(--shape-a)", "stroke-width": 2 }));
      svg.append(s("line", { x1: bx, y1: by, x2: bx + br, y2: by, stroke: "var(--ink)", "stroke-width": 2 }));
      svg.append(s("text", { x: bx + br / 2, y: by - 6, "text-anchor": "middle", class: "svg-text" }, `r = ${fmt(r, 1)}`));
      svg.append(s("text", { x: bx, y: by + br + 26, "text-anchor": "middle", class: "svg-text" }, `B = πr² ≈ ${fmt(PI * r * r, 2)} cm²`));
      // right: one layer per centimetre of height
      const layers = Math.floor(ht + 1e-9);
      for (let k = 0; k <= layers; k++) {
        const y = base - k * scale;
        svg.append(s("ellipse", { cx, cy: y, rx: R, ry, fill: k === layers ? "var(--shape-a-soft)" : "none", stroke: "var(--shape-a)", "stroke-width": 1.2, opacity: 0.8 }));
      }
      cylinder(svg, cx, base, r, ht, scale, 0, null, null);
      svg.append(s("line", { x1: cx + R + 16, y1: base, x2: cx + R + 16, y2: base - ht * scale, stroke: "var(--ink)", "stroke-width": 2 }));
      svg.append(s("text", { x: cx + R + 24, y: base - (ht * scale) / 2, class: "svg-text" }, `h = ${fmt(ht, 1)}`));
      const V = PI * r * r * ht;
      clear(out);
      out.append(stat("Base area:", `${fmt(PI * r * r, 2)} cm²`).el, stat("Layers (1 cm each):", fmt(ht, 1)).el, stat("Volume:", `${fmt(V, 2)} cm³`).el);
      work.textContent = `V = (area of base) × height = πr² × h\n  = 3.14 × ${fmt(r, 1)}² × ${fmt(ht, 1)} = 3.14 × ${fmt(r * r, 2)} × ${fmt(ht, 1)} = ${fmt(V, 2)} cm³`;
    }
    root.append(h("div", { class: "controls" },
      elasticSlider({ id: "t2l2-r", label: "Radius (cm)", min: 1, max: 6, value: r, step: 0.5, format: (v) => fmt(v, 1), onInput: (v) => { r = v; draw(); } }).el,
      elasticSlider({ id: "t2l2-h", label: "Height (cm)", min: 1, max: 10, value: ht, step: 0.5, format: (v) => fmt(v, 1), onInput: (v) => { ht = v; draw(); } }).el),
    svg, out, work, h("p", { class: "note" }, "A cylinder is a stack of circles. Each 1-cm layer holds the base area; the height counts the layers. (Use π ≈ 3.14.)"));
    draw();
  }

  // ------------------------------------------------------------ which holds more

  const CANS = [
    [{ name: "Tall can", r: 3, h: 12 }, { name: "Wide can", r: 5, h: 5 }],
    [{ name: "Water jug", r: 7, h: 20 }, { name: "Rice tub", r: 10, h: 10 }],
    [{ name: "Glass", r: 3.5, h: 10 }, { name: "Mug", r: 4, h: 8 }],
  ];

  function pour(root) {
    let pairIdx = 0, guess = null;
    const svg = s("svg", { viewBox: "0 0 600 330", role: "img", "aria-label": "Two cylinders being filled" });
    const area = h("div", { class: "stage-body" });
    let levels = [0, 0];
    const fillSp = new Spring([0, 0], (v) => { levels = v; draw(); }, { stiffness: 60, damping: 14 });
    function draw() {
      clear(svg);
      const [a, b] = CANS[pairIdx];
      const scale = Math.min(14, 220 / Math.max(a.h, b.h, a.r * 2.4, b.r * 2.4));
      cylinder(svg, 160, 270, a.r, a.h, scale, levels[0], "var(--shape-a-soft)", `${a.name}: r ${a.r}, h ${a.h}`);
      cylinder(svg, 440, 270, b.r, b.h, scale, levels[1], "var(--shape-b-soft)", `${b.name}: r ${b.r}, h ${b.h}`);
    }
    function render() {
      clear(area);
      const [a, b] = CANS[pairIdx];
      const va = PI * a.r * a.r * a.h, vb = PI * b.r * b.r * b.h;
      area.append(h("p", {}, guess === null ? "Which one holds more? Predict, then pour." : ""),
        h("div", { class: "choices" }, [a, b].map((c, i) => h("button", { type: "button", "aria-pressed": guess === i ? "true" : "false", onclick: () => { guess = i; render(); } }, c.name))));
      if (guess !== null) {
        const big = va >= vb ? 0 : 1;
        area.append(h("pre", { class: "workings" }, `${a.name}: 3.14 × ${a.r}² × ${a.h} = ${fmt(va, 2)} cm³\n${b.name}: 3.14 × ${b.r}² × ${b.h} = ${fmt(vb, 2)} cm³`),
          pill(guess === big, "Your prediction was right!", `The ${[a, b][big].name.toLowerCase()} holds more.`),
          h("p", { class: "note" }, "The radius is squared, so a wider cylinder can hold more even when it is shorter."));
        const water = Math.min(va, vb); // pour the same amount into both
        fillSp.jump([0, 0]); fillSp.set([water / va, water / vb]);
      }
    }
    const sel = h("select", { id: "t2l2-pair" }, CANS.map((p, i) => h("option", { value: i }, `${p[0].name} vs ${p[1].name}`)));
    sel.addEventListener("change", () => { pairIdx = Number(sel.value); guess = null; fillSp.jump([0, 0]); render(); });
    root.append(h("div", { class: "controls" }, h("label", { for: "t2l2-pair" }, "Compare", sel)), svg, area,
      h("p", { class: "note" }, "The containers fill with the same amount of water; the one that is not full holds more."));
    draw(); render();
    return () => fillSp.stop();
  }

  // ------------------------------------------------------------ lesson

  Sim.register({
    id: "lesson11", unit: "D", num: 2, letter: "B", title: "Volume of a Cylinder", simName: "Cylinder Lab",
    comps: ["A2", "A3", "A4", "M2"], cycles: "C3,M1 – C3,M4", deped: "DepEd Week 3",
    bigQuestion: "Which holds more – a tall, thin can or a short, wide one?",
    mission: [
      "Stack the Circles: keep the radius at 3 cm and raise the height from 1 to 5. How does the volume grow?",
      "Now keep the height and double the radius from 2 to 4. What happens to the volume?",
      "Explain the formula V = πr²h using the layers.",
      "Which Holds More: predict before pouring for all three pairs.",
    ],
    discovery: "A cylinder is a stack of circles. The base has area πr², and each centimetre of height adds another layer of that area, so V = πr²h. Doubling the height doubles the volume, but doubling the radius makes it 4 times as big, because the radius is squared.",
    mount(stage) {
      const body = h("div", { class: "stage-body" });
      const views = [stack, pour];
      let stopper = null;
      const t = tabs(["Stack the Circles", "Which Holds More?"], (i) => { if (stopper) stopper(); clear(body); stopper = views[i](body) || null; });
      stage.append(t.el, body);
      stack(body);
      return () => { if (stopper) stopper(); };
    },
    check() {
      const kind = randInt(0, 3);
      const r = pick([1, 2, 3, 4, 5, 10]), ht = pick([2, 3, 4, 5, 6, 10]);
      const V = Number((PI * r * r * ht).toFixed(2));
      if (kind <= 1) return { q: `Find the volume of a cylinder with radius ${r} cm and height ${ht} cm. Use π ≈ 3.14.`, answer: V, tol: 0.01, unit: "cm³", explain: `3.14 × ${r}² × ${ht} = ${fmt(V, 2)} cm³.` };
      if (kind === 2) { const d = 2 * r; return { q: `A cylinder has a diameter of ${d} cm and a height of ${ht} cm. Find its volume (π ≈ 3.14).`, answer: V, tol: 0.01, unit: "cm³", explain: `r = ${d} ÷ 2 = ${r}; V = 3.14 × ${r}² × ${ht} = ${fmt(V, 2)} cm³.` }; }
      const k = pick([2, 3]);
      return { q: `If the radius of a cylinder is multiplied by ${k} and the height stays the same, the volume is multiplied by…`, answer: k * k, explain: `The radius is squared: ${k}² = ${k * k}.` };
    },
  });
})();
