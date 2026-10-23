/* Unit 6 · Lesson 15 · O. Independent Peer Verification – Verify It */
(function () {
  "use strict";
  const { h, s, clear, randInt, pick, shuffle, fmt, round, clamp, tabs, segmented, stat, pill, Spring } = Sim;

  // ------------------------------------------------------------ another group's mini project (sample data, fictional people)

  const DATA = [
    ["Mon", "Ana Reyes", "Juice", 60], ["Mon", "Ben Cruz", "Water", 75], ["Tue", "Carla Santos", "Iced tea", 50],
    ["Tue", "Carla Santos", "Iced tea", 50], ["Tue", "Dino Lim", "Juice", 80], ["Wed", "Ella Tan", "Water", 90],
    ["Wed", "Felix Go", "Juice", 40], ["Thu", "Gia Uy", "Juice", 100], ["Thu", "Hiro Sy", "Iced tea", 75],
  ];
  const sumif = (drink, lastRow, dedupe) => DATA.filter((r, i) => i + 2 <= lastRow && r[2] === drink && !(dedupe && i === 3)).reduce((a, r) => a + r[3], 0);
  const WRONG = { Juice: sumif("Juice", 8), Water: sumif("Water", 10), "Iced tea": sumif("Iced tea", 10) };
  const RIGHT = { Juice: sumif("Juice", 10, true), Water: sumif("Water", 10, true), "Iced tea": sumif("Iced tea", 10, true) };
  const DRINKS = ["Juice", "Water", "Iced tea"];

  const ISSUES = {
    dup: { title: "Duplicated record", evidence: "Rows 4 and 5 are identical (Tue, Carla Santos, Iced tea, ₱50).", fix: "Remove the duplicate (Data › Data cleanup › Remove duplicates) and log it.", kind: "Data quality" },
    sumif: { title: "SUMIF uses the wrong range", evidence: "=SUMIF(C2:C8,\"Juice\",D2:D8) stops at row 8, so it misses row 9 (Juice ₱100).", fix: "Use C2:C10 and D2:D10 (or whole columns C:C, D:D).", kind: "Calculation" },
    axis: { title: "Truncated y-axis", evidence: "The chart's y-axis starts at ₱150, so a ₱15 gap looks like a huge difference.", fix: "Start the axis at 0 (Customize › Vertical axis › Min = 0).", kind: "Visualization" },
    causal: { title: "Causal claim from a correlation", evidence: "“…so the poster caused more learners to buy iced tea” – sales and the poster only happened at the same time.", fix: "Say “sales were higher while the poster was up”; a cause needs a fair comparison.", kind: "Analysis" },
    privacy: { title: "Privacy leak", evidence: "Column B lists buyers' full names.", fix: "Remove the names or replace them with codes (B001, B002, …) before sharing.", kind: "Ethics" },
    source: { title: "Missing source", evidence: "“Source: —” – the reader cannot tell who collected the sales or how.", fix: "State the source: “Canteen sales log kept by our group, 3–6 June, with the canteen's permission.”", kind: "Documentation" },
  };
  const ORDER = Object.keys(ISSUES);

  const CSS = `
  .l15-proj { display: grid; min-width: 0; gap: 10px; grid-template-columns: minmax(0, 1.5fr) minmax(0, 1fr); align-items: start; }
  @media (max-width: 760px) { .l15-proj { grid-template-columns: minmax(0, 1fr); } }
  .l15-col { display: grid; gap: 10px; min-width: 0; grid-template-columns: minmax(0, 1fr); }
  .l15-box { border: 1px solid var(--line); border-radius: 8px; background: var(--paper); padding: 8px; min-width: 0; }
  .l15-box h4 { margin: 0 0 6px; font-size: .78rem; letter-spacing: .06em; text-transform: uppercase; color: var(--muted); font-family: var(--body); }
  .l15-box .table-wrap { contain: inline-size; }
  .l15-sheet { border-collapse: collapse; width: 100%; font-size: .8rem; }
  .l15-sheet th, .l15-sheet td { border: 1px solid var(--line); padding: 3px 6px; text-align: left; white-space: nowrap; }
  .l15-sheet th { background: var(--bg); color: var(--muted); font-weight: 700; font-size: .72rem; }
  .l15-sheet td.n { text-align: right; font-family: var(--mono); }
  .l15-sheet .rn { background: var(--bg); color: var(--muted); font-family: var(--mono); font-size: .7rem; text-align: center; }
  .l15-hit { cursor: pointer; transition: background .25s, box-shadow .25s; }
  .l15-hit:hover { background: var(--gold-soft); }
  .l15-hit.flagged { background: color-mix(in srgb, var(--bad) 14%, var(--paper)) !important; box-shadow: inset 0 0 0 2px var(--bad); }
  .l15-hit.cleared { background: color-mix(in srgb, var(--good) 10%, var(--paper)); }
  .l15-f { font-family: var(--mono); font-size: .74rem; color: var(--shape-a); }
  .l15-concl p { margin: 0 0 4px; font-size: .9rem; line-height: 1.45; }
  .l15-concl span.l15-hit { border-radius: 4px; padding: 0 2px; }
  .l15-panel { border: 2px solid var(--accent); border-radius: 10px; padding: 10px; display: grid; gap: 6px; background: var(--accent-soft); }
  .l15-slot { border: 1px dashed var(--line); border-radius: 8px; padding: 6px 8px; min-height: 36px; font-size: .84rem; background: var(--paper); }
  .l15-slot b { color: var(--bad); }
  .l15-slot small { display: block; color: var(--muted); }
  .l15-ghost { position: fixed; left: 0; top: 0; z-index: 50; pointer-events: none; background: var(--bad); color: #fff; font-weight: 700; font-size: .8rem; padding: 4px 10px; border-radius: 999px; box-shadow: 0 6px 18px rgba(0,0,0,.25); white-space: nowrap; }
  .l15-toast { min-height: 1.4em; }
  .l15-opts { display: grid; gap: 6px; }
  .l15-opts button { text-align: left; border: 1px solid var(--line); background: var(--bg); border-radius: 8px; padding: 8px 12px; cursor: pointer; line-height: 1.4; }
  .l15-opts button[aria-pressed="true"] { border-color: var(--accent); background: var(--accent-soft); }
  .l15-para { border-left: 4px solid var(--accent); background: var(--bg); padding: 8px 12px; border-radius: 0 8px 8px 0; display: grid; gap: 4px; }
  .l15-para p { margin: 0; }
  .l15-meter { display: grid; grid-template-columns: 8.5em minmax(0, 1fr); gap: 8px; align-items: center; font-size: .88rem; }
  .l15-meter > div { height: 12px; border-radius: 6px; background: var(--line); overflow: hidden; position: relative; }
  .l15-meter > div > i { position: absolute; left: 0; top: 0; bottom: 0; border-radius: 6px; }
  .l15-thread { display: grid; gap: 8px; }
  .l15-msg { border: 1px solid var(--line); border-radius: 12px; padding: 8px 12px; max-width: 92%; }
  .l15-msg.them { background: var(--bg); }
  .l15-msg.us { background: var(--accent-soft); border-color: var(--accent); justify-self: end; }
  `;

  // ------------------------------------------------------------ Find the Issues

  function findIssues(root) {
    const found = new Set(), ghosts = [], timers = [];
    const toast = h("p", { class: "feedback l15-toast", "aria-live": "polite" });
    const count = stat("Issues found:", `0 / ${ORDER.length}`);
    const slots = ORDER.map((_, i) => h("div", { class: "l15-slot" }, h("small", {}, `Issue ${i + 1} – not found yet`)));
    const panel = h("div", { class: "l15-panel" }, h("h4", { style: "margin:0" }, "Critique panel"), ...slots);
    const hits = {};
    const mark = (el, id) => { el.classList.add("l15-hit"); el.setAttribute("tabindex", "0"); el.setAttribute("role", "button"); const go = (e) => { e.stopPropagation(); flag(el, id); }; el.addEventListener("click", go); el.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); go(e); } }); if (id in ISSUES) (hits[id] = hits[id] || []).push(el); return el; };
    // dataset
    const tbody = h("tbody");
    const buyerTh = mark(h("th", {}, "B · Buyer"), "privacy");
    DATA.forEach((r, i) => {
      const tr = h("tr", {}, h("td", { class: "rn" }, String(i + 2)), h("td", {}, r[0]), h("td", {}, r[1]), h("td", {}, r[2]), h("td", { class: "n" }, `₱${r[3]}`));
      tbody.append(mark(tr, i === 3 || i === 2 ? "dup" : "ok-row"));
    });
    const sheet = h("div", { class: "table-wrap" }, h("table", { class: "l15-sheet" }, h("thead", {}, h("tr", {}, h("th", {}, ""), h("th", {}, "A · Day"), buyerTh, h("th", {}, "C · Drink"), h("th", {}, "D · Amount"))), tbody));
    // summary sheet
    const sumVals = {};
    const sumBody = h("tbody");
    DRINKS.forEach((d) => {
      const val = h("td", { class: "n" }, `₱${WRONG[d]}`); sumVals[d] = val;
      const f = d === "Juice" ? `=SUMIF(C2:C8,"Juice",D2:D8)` : `=SUMIF(C2:C10,"${d}",D2:D10)`;
      sumBody.append(mark(h("tr", {}, h("td", {}, d), h("td", {}, h("span", { class: "l15-f" }, f)), val), d === "Juice" ? "sumif" : "ok-sum"));
    });
    const summary = h("div", { class: "table-wrap" }, h("table", { class: "l15-sheet" }, h("thead", {}, h("tr", {}, h("th", {}, "Drink"), h("th", {}, "Formula"), h("th", {}, "Total"))), sumBody));
    // chart
    let vals = DRINKS.map((d) => WRONG[d]), base = 150;
    const svg = s("svg", { viewBox: "0 0 360 230", role: "img", "aria-label": "The group's column chart of drink sales" });
    const axisHit = s("rect", { x: 0, y: 20, width: 52, height: 190, fill: "transparent" });
    const chartG = s("g");
    svg.append(chartG, axisHit);
    function drawChart() {
      clear(chartG);
      const top = 300, Y = (v) => 190 - ((v - base) / (top - base)) * 160;
      chartG.append(s("text", { x: 180, y: 16, "text-anchor": "middle", class: "svg-label", "font-size": 13, "font-weight": 700, fill: "var(--ink)" }, "Drink sales this week (₱)"));
      const step = top - base > 200 ? 100 : 50;
      for (let v = Math.ceil(base / step) * step; v <= top; v += step) chartG.append(s("line", { x1: 50, y1: Y(v), x2: 350, y2: Y(v), stroke: "var(--grid)" }), s("text", { x: 46, y: Y(v) + 4, "text-anchor": "end", class: "svg-text", "font-size": 12 }, String(v)));
      chartG.append(s("text", { x: 46, y: 194, "text-anchor": "end", class: "svg-text", "font-size": 12, "font-weight": 700, fill: base > 1 ? "var(--bad)" : undefined }, String(Math.round(base))));
      vals.forEach((v, i) => { const x = 80 + i * 95, y = Math.min(190, Y(v)); chartG.append(s("rect", { x, y, width: 60, height: 190 - y, rx: 3, fill: ["var(--shape-a)", "var(--accent)", "var(--gold)"][i] }), s("text", { x: x + 30, y: 208, "text-anchor": "middle", class: "svg-text", "font-size": 12 }, DRINKS[i]), s("text", { x: x + 30, y: y - 5, "text-anchor": "middle", class: "svg-text", "font-size": 12, "font-weight": 700 }, `₱${Math.round(v)}`)); });
      chartG.append(s("line", { x1: 50, y1: 190, x2: 350, y2: 190, stroke: "var(--ink)", "stroke-width": 1.5 }));
    }
    const sp = new Spring([...vals, base], (a) => { vals = a.slice(0, 3); base = a[3]; drawChart(); }, { stiffness: 110, damping: 12 });
    mark(axisHit, "axis");
    chartG.addEventListener("click", () => say(false, "The bars match the summary sheet. Look at where the axis starts."));
    // conclusion
    const concl = h("div", { class: "l15-concl" },
      h("p", {}, mark(h("span", {}, "We recorded every canteen drink sale from Monday to Thursday."), "ok-text"), " ",
        mark(h("span", {}, "Juice and iced tea sold about the same."), "ok-juice"), " ",
        mark(h("span", {}, "Iced tea sales rose on the days the new poster was up, so the poster caused more learners to buy iced tea."), "causal")),
      h("p", { class: "note" }, mark(h("span", {}, "Source: —"), "source")));
    const DECOY = {
      "ok-row": "This row looks fine. Compare rows carefully – is any row repeated?",
      "ok-sum": "This formula covers rows 2 to 10 – the full data. Check the other formulas.",
      "ok-text": "That describes the data collection – fine, but where does it say who kept the log?",
      "ok-juice": "This sentence comes from the summary numbers. If a formula is wrong, this sentence is wrong too – find the formula.",
    };
    function say(ok, msg) { toast.className = "feedback l15-toast " + (ok ? "ok" : ""); toast.textContent = msg; }
    function flag(el, id) {
      if (!(id in ISSUES)) { say(false, DECOY[id] || "No issue here."); el.classList.add("cleared"); timers.push(setTimeout(() => el.classList.remove("cleared"), 700)); return; }
      if (found.has(id)) { say(false, `Already flagged: ${ISSUES[id].title}.`); return; }
      found.add(id);
      (hits[id] || [el]).forEach((x) => x.classList.add("flagged"));
      const I = ISSUES[id], slot = slots[found.size - 1];
      say(true, `Flagged: ${I.title} (${I.kind}).`);
      count.set(`${found.size} / ${ORDER.length}`);
      const fill = () => { clear(slot); slot.append(h("b", {}, `${found.size > 0 ? "" : ""}${I.title}`), " · ", h("span", {}, I.kind), h("small", {}, `Evidence: ${I.evidence}`), h("small", {}, `Fix: ${I.fix}`)); if (!Sim.reducedMotion() && slot.animate) slot.animate([{ transform: "scale(.96)", background: "var(--gold-soft)" }, { transform: "scale(1)" }], { duration: 400 }); recBtn.disabled = !(found.has("dup") && found.has("sumif")); };
      const a = (el.getBoundingClientRect ? el.getBoundingClientRect() : null), b = slot.getBoundingClientRect();
      if (!a || Sim.reducedMotion()) { fill(); return; }
      const ghost = h("div", { class: "l15-ghost" }, I.title); document.body.append(ghost);
      const g = { ghost, sp: null }; ghosts.push(g);
      g.sp = new Spring([a.left + a.width / 2 - 60, a.top + a.height / 2 - 12, 1.25], (v) => { ghost.style.transform = `translate(${v[0]}px, ${v[1]}px) scale(${v[2]})`; }, { stiffness: 90, damping: 13 });
      g.sp.set([b.left + 8, b.top + 6, 0.85]);
      timers.push(setTimeout(() => { g.sp.stop(); ghost.remove(); fill(); }, 650));
    }
    const recOut = h("div", { class: "readout" });
    const recBtn = h("button", { class: "btn", type: "button", disabled: true, onclick: () => {
      const spNum = (el, from, to) => { const n = new Spring(from, (v) => { el.textContent = `₱${Math.round(v)}`; }, { stiffness: 80, damping: 12 }); n.set(to); ghosts.push({ sp: n, ghost: null }); };
      DRINKS.forEach((d) => { if (WRONG[d] !== RIGHT[d]) { spNum(sumVals[d], WRONG[d], RIGHT[d]); sumVals[d].style.color = "var(--good)"; sumVals[d].style.fontWeight = "700"; } });
      sp.set([...DRINKS.map((d) => RIGHT[d]), found.has("axis") ? 0 : 150]);
      clear(recOut);
      recOut.append(stat("Juice:", `₱${WRONG.Juice} → ₱${RIGHT.Juice}`).el, stat("Iced tea:", `₱${WRONG["Iced tea"]} → ₱${RIGHT["Iced tea"]}`).el, stat("Water:", `₱${RIGHT.Water} (unchanged)`).el,
        h("p", { class: "note", style: "flex-basis:100%" }, `Re-computed: Juice is now clearly the top seller (₱${RIGHT.Juice}), more than twice iced tea (₱${RIGHT["Iced tea"]}). The group's sentence “Juice and iced tea sold about the same” does not survive the check.${found.has("axis") ? "" : " Flag the axis too, then re-compute to fix the chart."}`));
    } }, "Re-compute with fixes");
    root.append(h("p", {}, "Group 4 handed over their mini project on canteen drink sales (sample data, fictional names). Verify it: click anything that is wrong. Six issues are planted – flagged issues fly into your critique panel."), toast,
      h("div", { class: "l15-proj" },
        h("div", { class: "l15-col" },
          h("div", { class: "l15-box" }, h("h4", {}, "Sheet1 · Sales log"), sheet),
          h("div", { class: "l15-box" }, h("h4", {}, "Summary sheet"), summary),
          h("div", { class: "l15-box" }, h("h4", {}, "Chart"), svg),
          h("div", { class: "l15-box" }, h("h4", {}, "Conclusion"), concl)),
        h("div", { class: "l15-col" }, h("div", { class: "controls" }, count.el), panel, h("div", { class: "controls" }, recBtn), recOut)));
    drawChart();
    return () => { sp.stop(); timers.forEach(clearTimeout); ghosts.forEach((g) => { if (g.sp) g.sp.stop(); if (g.ghost) g.ghost.remove(); }); };
  }

  // ------------------------------------------------------------ Write the Critique

  const PARTS = [
    { name: "Strength", opts: [
      { t: "Your sales log is complete for all four days, and your summary sheet clearly shows the formula behind each total.", tone: 1, ev: 1, why: "Specific and true – it names what the group did well, with evidence." },
      { t: "Nice work, guys!", tone: 1, ev: 0, why: "Friendly, but it does not say what was good." },
      { t: "At least you collected some data.", tone: 0, ev: 0, why: "Sounds dismissive – a strength should be sincere and specific." },
    ] },
    { name: "Issue + evidence", opts: [
      { t: "Your numbers are wrong.", tone: 0, ev: 0, why: "Harsh and vague – which numbers, and how do you know?" },
      { t: `The Juice total uses =SUMIF(C2:C8,"Juice",D2:D8), which stops at row 8 and misses row 9 (₱100).`, tone: 1, ev: 1, why: "Names the exact cell and shows the evidence the group can check." },
      { t: "Something seems off in the summary sheet.", tone: 1, ev: 0, why: "Polite but vague – the group cannot act on it." },
    ] },
    { name: "Impact", opts: [
      { t: "This ruins your whole project.", tone: 0, ev: 0, why: "Exaggerated and discouraging." },
      { t: "It probably doesn't matter much.", tone: 1, ev: 0, why: "Understates the problem without checking." },
      { t: `With the full range, Juice is ₱${RIGHT.Juice}, not ₱${WRONG.Juice}, so the conclusion that juice and iced tea sold about the same no longer holds.`, tone: 1, ev: 1, why: "Shows how the error changes the finding, with the re-computed number." },
    ] },
    { name: "Recommendation", opts: [
      { t: "Change the ranges to C2:C10 and D2:D10, remove the duplicate row, and re-check the chart and conclusion.", tone: 1, ev: 1, why: "Specific, doable steps that fix the problem." },
      { t: "Do it again properly next time.", tone: 0, ev: 0, why: "Harsh and gives no direction." },
      { t: "Maybe look at it again.", tone: 1, ev: 0, why: "Too vague to act on." },
    ] },
  ];

  function critique(root) {
    const chosen = PARTS.map(() => null);
    const para = h("div", { class: "l15-para", "aria-live": "polite" });
    const toneBar = h("i"), evBar = h("i");
    let tv = 0, ev = 0;
    const sp = new Spring([0, 0], (v) => { [tv, ev] = v; toneBar.style.width = `${clamp(v[0], 0, 1.05) * 100}%`; evBar.style.width = `${clamp(v[1], 0, 1.05) * 100}%`; toneBar.style.background = v[0] < 0.75 ? "var(--bad)" : "var(--good)"; evBar.style.background = v[1] < 0.75 ? "var(--gold)" : "var(--good)"; }, { stiffness: 120, damping: 11 });
    const fb = h("p", { class: "feedback", "aria-live": "polite" });
    const box = h("div", { class: "stage-body" });
    let part = 0;
    function render() {
      clear(para);
      PARTS.forEach((p, i) => { const c = chosen[i]; if (c) { const el = h("p", {}, h("strong", {}, `${p.name}: `), c.t); para.append(el); if (i === part - 1 && !Sim.reducedMotion() && el.animate) el.animate([{ opacity: 0, transform: "translateX(-24px)" }, { opacity: 1, transform: "none" }], { duration: 380, easing: "cubic-bezier(.2,1.4,.4,1)" }); } });
      if (!para.children.length) para.append(h("p", { class: "note" }, "Your critique builds here, one sentence at a time."));
      const n = chosen.filter(Boolean).length || 1;
      sp.set([chosen.filter(Boolean).reduce((a, c) => a + c.tone, 0) / n, chosen.filter(Boolean).reduce((a, c) => a + c.ev, 0) / PARTS.length]);
      clear(box);
      if (part >= PARTS.length) {
        const good = chosen.every((c) => c.tone && c.ev);
        box.append(h("p", { class: "feedback " + (good ? "ok" : "bad") }, good ? "Respectful and evidence-based: every sentence is specific, checkable, and kind. This is a critique the group can act on." : "Some sentences are harsh or vague. Rebuild the critique so every sentence is respectful AND backed by evidence."),
          h("button", { class: "btn ghost", type: "button", onclick: () => { chosen.fill(null); part = 0; fb.textContent = ""; render(); } }, "Start again"));
        return;
      }
      const P = PARTS[part];
      const opts = h("div", { class: "l15-opts" });
      P.opts.forEach((o) => opts.append(h("button", { type: "button", onclick: () => { chosen[part] = o; fb.className = "feedback " + (o.tone && o.ev ? "ok" : "bad"); fb.textContent = `${o.tone ? "Respectful" : "Harsh"} · ${o.ev ? "evidence-based" : "no evidence"} – ${o.why}`; part++; render(); } }, o.t)));
      box.append(h("p", { class: "steps-title" }, `Step ${part + 1} of 4 · Choose the ${P.name.toLowerCase()} sentence`), opts);
    }
    root.append(h("p", {}, "Build an evidence-based critique of Group 4's project from sentence starters: a strength, an issue with evidence, its impact, and a recommendation. Watch the tone check."),
      box, fb, para,
      h("div", { class: "l15-meter" }, h("span", {}, "Tone: respectful"), h("div", { role: "img", "aria-label": "Respectful tone meter" }, toneBar)),
      h("div", { class: "l15-meter" }, h("span", {}, "Evidence"), h("div", { role: "img", "aria-label": "Evidence meter" }, evBar)));
    render();
    return () => sp.stop();
  }

  // ------------------------------------------------------------ Respond

  const RECEIVED = [
    { c: `Your Juice SUMIF uses C2:C8 and misses row 9, so Juice should be ₱${RIGHT.Juice}, not ₱${WRONG.Juice}.`, best: "Accept", reply: "Thank you – you are right. We changed the ranges to C2:C10 and D2:D10, updated the chart and conclusion, and logged the fix.", why: "The reviewer is correct and gave evidence: accept, fix, and thank them." },
    { c: "Your Amount column has no unit. Is it pesos or number of drinks?", best: "Clarify", reply: "Amount is in pesos (₱). We added the unit to the column header and to our data dictionary.", why: "It is a question about meaning: clarify, then improve the documentation." },
    { c: "You deleted 14 rows from your survey. That could bias your results.", best: "Justify with evidence", reply: "Our processing log, steps 1–2, shows the 14 rows were 7 exact duplicates and 7 blank responses, removed by the rule in our methods. The other 236 responses are unchanged.", why: "The group's choice was sound and documented: justify it by pointing to the evidence (the log)." },
    { c: "You only have one week of sales, so it may not represent the whole school year.", best: "Accept", reply: "That is a fair limitation. We added it to our limitations section and suggest collecting sales for a full quarter next.", why: "A real limitation the group had not stated: accept it and add it." },
  ];

  function respond(root) {
    const thread = h("div", { class: "l15-thread" });
    const fb = h("p", { class: "feedback", "aria-live": "polite" });
    const score = stat("Best responses:", "0 / 4");
    let i = 0, right = 0;
    const btns = h("div", { class: "controls" });
    function show() {
      clear(btns); fb.textContent = ""; fb.className = "feedback";
      if (i >= RECEIVED.length) { btns.append(h("p", { class: "feedback ok" }, "Done. Responding well means: accept real errors, clarify misunderstandings, and justify sound choices with evidence – never get defensive."), h("button", { class: "btn ghost", type: "button", onclick: () => { i = 0; right = 0; score.set("0 / 4"); clear(thread); show(); } }, "Start again")); return; }
      const R = RECEIVED[i];
      const msg = h("div", { class: "l15-msg them" }, h("p", { class: "note" }, `Reviewer, point ${i + 1}`), h("p", { style: "margin:0" }, R.c));
      thread.append(msg); pop(msg, -1);
      ["Accept", "Clarify", "Justify with evidence"].forEach((k) => btns.append(h("button", { class: "btn" + (k === "Accept" ? "" : " ghost"), type: "button", onclick: () => answer(k) }, k)));
    }
    function pop(el, dir) { if (!Sim.reducedMotion() && el.animate) el.animate([{ opacity: 0, transform: `translateX(${dir * 30}px) scale(.95)` }, { opacity: 1, transform: "translateX(0) scale(1.02)", offset: 0.7 }, { opacity: 1, transform: "none" }], { duration: 420, easing: "ease-out" }); }
    function answer(k) {
      const R = RECEIVED[i], ok = k === R.best;
      if (ok) right++;
      score.set(`${right} / 4`);
      fb.className = "feedback " + (ok ? "ok" : "bad");
      fb.textContent = (ok ? "Good choice. " : `Better: ${R.best}. `) + R.why;
      const reply = h("div", { class: "l15-msg us" }, h("p", { class: "note" }, `Our group · ${R.best}`), h("p", { style: "margin:0" }, R.reply));
      thread.append(reply); pop(reply, 1);
      i++;
      clear(btns); btns.append(h("button", { class: "btn", type: "button", onclick: show }, i < RECEIVED.length ? "Next point" : "Finish"));
    }
    root.append(h("p", {}, "Now your project is the one being reviewed. For each point, choose how to respond: accept, clarify, or justify with evidence."), thread, btns, fb, h("div", { class: "controls" }, score.el));
    show();
    return () => {};
  }

  Sim.register({
    id: "lesson15", unit: "6", num: 15, letter: "O", title: "Independent Peer Verification", simName: "Verify It",
    comps: ["T6", "T7", "T8"], sessions: "S73–S79", cg: "CG Part 2 · Content 6 (Data Analytics Project)",
    deped: "CG Part 2 · Content 6 (Data Analytics Project) · LSGH transfer goals",
    bigQuestion: "Would our findings survive an independent check?",
    mission: [
      "Find the Issues: flag all six planted issues in Group 4's project, then re-compute. Which sentence of their conclusion no longer holds?",
      "Write the Critique: build a four-part critique that is both respectful and evidence-based (both meters full).",
      "Respond: answer four review points. When should a group accept, clarify, or justify with evidence?",
    ],
    discovery: "Verification means rebuilding another group's results: re-checking the data (duplicates, privacy), the calculations (formula ranges), the visuals (axes), and the claims (causation, sources). A good critique names a strength, points to the exact evidence of each issue, explains its impact, and recommends a fix – respectfully. A good response accepts real errors, clarifies misunderstandings, and justifies sound choices with evidence.",
    mount(stage) {
      const body = h("div", { class: "stage-body" });
      const views = [findIssues, critique, respond];
      let stopper = null;
      const t = tabs(["Find the Issues", "Write the Critique", "Respond"], (i) => { if (stopper) stopper(); clear(body); stopper = views[i](body) || null; });
      stage.append(h("style", {}, CSS), t.el, body);
      stopper = findIssues(body);
      return () => { if (stopper) stopper(); };
    },
    check() {
      const kind = randInt(0, 5);
      if (kind === 0) { const id = pick(ORDER), I = ISSUES[id]; return { q: `What kind of issue is this? ${I.evidence}`, choices: ["Data quality", "Calculation", "Visualization", "Analysis", "Ethics", "Documentation"], answer: I.kind, explain: `${I.title}. Fix: ${I.fix}` }; }
      if (kind === 1) { const a = randInt(40, 120), b = randInt(40, 120), c = randInt(40, 120), d = randInt(60, 140); return { q: `Juice sales (sample) are in rows 2–5: ₱${a}, ₱${b}, ₱${c}, ₱${d}. A group wrote =SUM(D2:D4). What is the correct total once the range is fixed to D2:D5?`, answer: a + b + c + d, tol: 0, unit: "₱", explain: `D2:D4 gives ₱${a + b + c}; the full range D2:D5 gives ${a} + ${b} + ${c} + ${d} = ₱${a + b + c + d}.` }; }
      if (kind === 2) { const v = pick([50, 60, 75, 80]), tot = v * 2 + randInt(2, 6) * 25; return { q: `Iced tea sales total ₱${tot}, but one ₱${v} row is an exact duplicate. What is the corrected total?`, answer: tot - v, tol: 0, unit: "₱", explain: `Remove the duplicate once: ₱${tot} − ₱${v} = ₱${tot - v}.` }; }
      if (kind === 3) return pick([
        { q: "Which critique sentence is respectful and evidence-based?", choices: ["“Cell B7 uses =AVERAGE(C2:C20) but the data ends at row 25, so 5 responses are left out.”", "“Your averages are totally wrong.”", "“Something seems off.”", "“Did you even check your work?”"], answer: "“Cell B7 uses =AVERAGE(C2:C20) but the data ends at row 25, so 5 responses are left out.”", explain: "It points to the exact cell and the evidence, without attacking anyone." },
        { q: "What should come first in a peer critique?", choices: ["A specific strength", "The biggest mistake", "A grade", "A recommendation"], answer: "A specific strength", explain: "Strength → issue + evidence → impact → recommendation." },
        { q: "“The poster caused iced tea sales to rise” is based only on sales being higher while the poster was up. What is the problem?", choices: ["It claims causation from a correlation", "It uses the wrong chart type", "It has a privacy leak", "It has a duplicated record"], answer: "It claims causation from a correlation", explain: "Things happening together do not prove that one caused the other." },
      ]);
      if (kind === 4) { const R = pick(RECEIVED); return { q: `A reviewer says: “${R.c}” What is the best response?`, choices: ["Accept", "Clarify", "Justify with evidence"], answer: R.best, explain: R.why }; }
      const rows = randInt(4, 9), last = rows + 1 - randInt(1, 2);
      return { q: `The data is in rows 2 to ${rows + 1}. A formula uses C2:C${last}. How many data rows does it leave out?`, answer: rows + 1 - last, tol: 0, explain: `Rows ${last + 1} to ${rows + 1} are missing: ${rows + 1 - last} row(s).` };
    },
  });
})();
