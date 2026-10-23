/* Unit 5 · Lesson 13 · M. Data Storytelling – Story Builder */
(function () {
  "use strict";
  const { h, s, clear, randInt, pick, shuffle, fmt, round, clamp, tabs, segmented, stat, pill, Spring, rubber } = Sim;

  // ------------------------------------------------------------ sample data (made up for this lesson)

  const SLOTS = ["11:30", "11:35", "11:40", "11:45", "11:50", "11:55", "12:00", "12:05"];
  const SALES = [220, 240, 230, 150, 115, 90, 70, 55];
  const TOTAL = SALES.reduce((a, b) => a + b, 0);
  const FIRST3 = SALES[0] + SALES[1] + SALES[2];
  const PCT = Math.round((FIRST3 / TOTAL) * 100);

  const ROLES = [
    { id: "q", label: "Question & context" },
    { id: "e", label: "Evidence" },
    { id: "i", label: "Insight" },
    { id: "r", label: "Recommendation" },
    { id: "a", label: "Call to action" },
  ];
  const CARDS = [
    { role: "q", text: "Why is the canteen line so long at lunch? Grade 11 learners say they wait more than 15 minutes for food." },
    { role: "e", text: `We logged ${fmt(TOTAL, 0)} canteen sales over two weeks (sample data): ${PCT}% happened in the first 15 minutes of the 40-minute break.` },
    { role: "i", text: "The cashiers are not slow – the line forms because everyone arrives at once: all grade levels share one lunch break." },
    { role: "r", text: "Stagger lunch: Grades 7–9 at 11:30, Grades 10–12 at 11:50. Limit: we observed only two weeks in June." },
    { role: "a", text: "Please approve a two-week trial starting Monday. We will log the line again and report back in three weeks." },
  ];

  const CSS = `
  .l13-board { position: relative; touch-action: pan-y; user-select: none; -webkit-user-select: none; }
  .l13-slot { position: absolute; left: 0; top: 0; border: 2px dashed var(--line); border-radius: 10px; background: var(--bg); transition: border-color .3s, background .3s; }
  .l13-slot.ok { border-color: var(--good); border-style: solid; background: color-mix(in srgb, var(--good) 10%, var(--paper)); }
  .l13-slot.hot { border-color: var(--gold); background: var(--gold-soft); }
  .l13-slot span { position: absolute; left: 10px; top: 2px; font-size: .72rem; font-weight: 700; letter-spacing: .06em; text-transform: uppercase; color: var(--muted); }
  .l13-card { position: absolute; left: 0; top: 0; background: var(--paper); border: 1px solid var(--line); border-left: 5px solid var(--shape-a); border-radius: 8px; padding: 7px 10px; font-size: .88rem; line-height: 1.35; box-shadow: 0 2px 6px rgba(0,0,0,.08); cursor: grab; touch-action: none; user-select: none; }
  .l13-card.drag { cursor: grabbing; box-shadow: 0 12px 26px rgba(0,0,0,.22); z-index: 5; }
  .l13-card.ok { border-left-color: var(--good); }
  .l13-card.bad { border-left-color: var(--bad); }
  .l13-tray { position: absolute; left: 0; top: 0; border-radius: 10px; background: color-mix(in srgb, var(--gold-soft) 60%, transparent); }
  .l13-tray span { position: absolute; left: 10px; top: 4px; font-size: .72rem; font-weight: 700; letter-spacing: .06em; text-transform: uppercase; color: var(--gold); }
  .l13-arc { position: absolute; left: 0; top: 0; pointer-events: none; overflow: visible; }
  .l13-opts { display: grid; gap: 6px; }
  .l13-opts button { text-align: left; border: 1px solid var(--line); background: var(--bg); border-radius: 8px; padding: 8px 12px; cursor: pointer; line-height: 1.4; }
  .l13-opts button[aria-pressed="true"] { border-color: var(--accent); background: var(--accent-soft); }
  .l13-bubble { border: 2px solid var(--accent); border-radius: 14px; padding: 10px 14px; background: var(--accent-soft); position: relative; }
  .l13-meter { height: 12px; border-radius: 6px; background: var(--line); overflow: hidden; flex: 1 1 160px; min-width: 120px; }
  .l13-meter div { height: 100%; background: var(--accent); border-radius: 6px; }
  `;

  // ------------------------------------------------------------ Story Arc: drag cards into the arc

  function storyArc(root) {
    const board = h("div", { class: "l13-board" });
    const arcSvg = s("svg", { class: "l13-arc", "aria-hidden": "true" });
    const tray = h("div", { class: "l13-tray" }, h("span", {}, "Story cards"));
    const fb = h("p", { class: "feedback", "aria-live": "polite" });
    board.append(tray, arcSvg);
    const slots = ROLES.map((r, i) => { const el = h("div", { class: "l13-slot" }, h("span", {}, `${i + 1} · ${r.label}`)); board.append(el); return { ...r, el, card: null, x: 0, y: 0 }; });
    const cards = shuffle(CARDS).map((c) => {
      const el = h("div", { class: "l13-card", tabindex: 0, role: "button", "aria-label": `Story card: ${c.text}` }, c.text);
      board.append(el);
      const card = { ...c, el, slot: null, pos: [0, 0] };
      card.sp = new Spring([0, 0], (v) => { card.pos = v; el.style.transform = `translate(${v[0]}px, ${v[1]}px)`; }, { stiffness: 220, damping: 18 });
      return card;
    });
    let L = null;
    function layout(jump) {
      const W = board.clientWidth || 600, wide = W >= 600, GAP = 10, rise = wide ? Math.min(36, W * 0.05) : 0;
      const cw = wide ? Math.floor((W - 44 - rise) / 2) : W - 24;
      cards.forEach((c) => { c.el.style.width = cw + "px"; c.el.style.minHeight = ""; });
      const ch = Math.max(...cards.map((c) => c.el.offsetHeight)) + 2;
      cards.forEach((c) => { c.el.style.minHeight = ch + "px"; });
      const sh = ch + 22;
      slots.forEach((sl, i) => { sl.x = (wide ? 0 : 0) + Math.sin((Math.PI * i) / 4) * rise; sl.y = i * (sh + GAP); sl.el.style.width = cw + 16 + "px"; sl.el.style.height = sh + "px"; sl.el.style.transform = `translate(${sl.x}px, ${sl.y}px)`; });
      const slotsH = 5 * (sh + GAP);
      const tx = wide ? cw + 16 + rise + 12 : 0, ty = wide ? 0 : slotsH + 6, tw = wide ? W - tx : W, th = wide ? slotsH - GAP : 26 + 5 * (ch + 8) + 6;
      tray.style.width = tw + "px"; tray.style.height = th + "px"; tray.style.transform = `translate(${tx}px, ${ty}px)`;
      board.style.height = (wide ? slotsH : ty + th) + "px";
      // the arc: a curve through the slot labels, rising to the insight
      arcSvg.setAttribute("width", W); arcSvg.setAttribute("height", slotsH);
      clear(arcSvg);
      if (wide) {
        const pts = slots.map((sl) => [sl.x - 4, sl.y + sh / 2]);
        arcSvg.append(s("polyline", { points: pts.map((p) => p.join(",")).join(" "), fill: "none", stroke: "var(--gold)", "stroke-width": 3, "stroke-dasharray": "2 6", "stroke-linecap": "round" }));
      }
      L = { wide, cw, ch, sh, tx, ty, tw, GAP };
      // tray slots for loose cards
      const loose = cards.filter((c) => !c.slot);
      loose.forEach((c, k) => go(c, [tx + 8 + (wide ? 0 : 4), ty + 24 + k * (ch + 8)], jump));
      cards.filter((c) => c.slot).forEach((c) => go(c, [c.slot.x + 8, c.slot.y + 20], jump));
    }
    function go(c, t, jump) { if (jump) c.sp.jump(t); else c.sp.set(t); }
    function hit(c) {
      const cx = c.pos[0] + L.cw / 2, cy = c.pos[1] + L.ch / 2;
      let best = null, bd = Infinity;
      slots.forEach((sl) => { const d = Math.hypot(cx - (sl.x + L.cw / 2), cy - (sl.y + L.sh / 2)); if (d < bd) { bd = d; best = sl; } });
      return bd < L.sh * 0.9 ? best : null;
    }
    cards.forEach((c) => {
      c.el.addEventListener("pointerdown", (ev) => {
        ev.preventDefault(); c.el.setPointerCapture(ev.pointerId);
        c.sp.stop(); c.el.classList.add("drag"); c.el.classList.remove("ok", "bad");
        const sx = ev.clientX, sy = ev.clientY, [ox, oy] = c.pos;
        const W = board.clientWidth, H = board.clientHeight;
        const move = (e) => {
          const x = rubber(ox + e.clientX - sx, 0, W - L.cw, 0.3), y = rubber(oy + e.clientY - sy, 0, H - L.ch, 0.3);
          c.sp.value = [x, y]; c.sp.vel = [0, 0]; c.pos = [x, y];
          c.el.style.transform = `translate(${x}px, ${y}px) rotate(${clamp((e.clientX - sx) * 0.03, -3, 3)}deg)`;
          const t = hit(c); slots.forEach((sl) => sl.el.classList.toggle("hot", sl === t));
        };
        const up = () => {
          c.el.removeEventListener("pointermove", move); c.el.removeEventListener("pointerup", up); c.el.removeEventListener("pointercancel", up);
          c.el.classList.remove("drag"); slots.forEach((sl) => sl.el.classList.remove("hot"));
          drop(c, hit(c));
        };
        c.el.addEventListener("pointermove", move); c.el.addEventListener("pointerup", up); c.el.addEventListener("pointercancel", up);
      });
      c.el.addEventListener("keydown", (e) => {
        if (e.key !== "Enter" && e.key !== " ") return;
        e.preventDefault();
        const next = slots.find((sl) => !sl.card) || null;
        drop(c, c.slot ? null : next);
      });
    });
    function drop(c, sl) {
      const prev = c.slot;
      if (prev) prev.card = null;
      if (sl) {
        if (sl.card && sl.card !== c) { const other = sl.card; other.slot = prev; if (prev) prev.card = other; }
        sl.card = c; c.slot = sl;
      } else c.slot = null;
      slots.forEach((x) => x.el.classList.remove("ok"));
      fb.textContent = ""; fb.className = "feedback";
      layout(false);
    }
    function check() {
      let right = 0;
      const placed = slots.filter((sl) => sl.card).length;
      slots.forEach((sl) => {
        const c = sl.card; if (!c) return;
        const ok = c.role === sl.id;
        c.el.classList.toggle("ok", ok); c.el.classList.toggle("bad", !ok); sl.el.classList.toggle("ok", ok);
        if (ok) right++;
        else { c.slot = null; sl.card = null; if (!Sim.reducedMotion() && c.el.animate) c.el.animate([{ translate: "0 0" }, { translate: "-8px 0" }, { translate: "8px 0" }, { translate: "0 0" }], { duration: 300 }); }
      });
      setTimeout(() => layout(false), 320);
      fb.className = "feedback " + (right === 5 ? "ok" : "bad");
      fb.textContent = right === 5 ? "The story flows: question → evidence → insight → recommendation → call to action. Each step answers “so what?” about the one before."
        : `${right} of 5 cards are in the right place. Cards in the wrong place went back to the tray${placed < 5 ? "; some slots are still empty" : ""}. Hint: the insight explains the evidence; the call to action asks a specific person to do something.`;
    }
    function reset() { slots.forEach((sl) => { sl.card = null; sl.el.classList.remove("ok"); }); cards.forEach((c) => { c.slot = null; c.el.classList.remove("ok", "bad"); }); fb.textContent = ""; layout(false); }
    root.append(h("p", {}, "A Grade 11 group studied the canteen line. Drag their five story cards into the arc in the order a listener needs them."),
      board, h("div", { class: "controls" }, h("button", { class: "btn", type: "button", onclick: check }, "Check order"), h("button", { class: "btn ghost", type: "button", onclick: reset }, "Reset")), fb,
      h("p", { class: "note" }, "Keyboard: focus a card and press Enter to put it in the next empty slot (or back in the tray)."));
    requestAnimationFrame(() => layout(true));
    layout(true);
    const ro = window.ResizeObserver ? new ResizeObserver(() => layout(true)) : null;
    if (ro) ro.observe(board);
    return () => { if (ro) ro.disconnect(); cards.forEach((c) => c.sp.stop()); };
  }

  // ------------------------------------------------------------ Emphasis: declutter, highlight, annotate, headline

  const HEADLINES = [
    { t: "Canteen Transactions by Time Slot", kind: "boring", why: "A label, not a message – the reader still has to find the point." },
    { t: `${PCT}% of lunch sales happen in the first 15 minutes`, kind: "insight", why: "An insight headline states what the chart proves, so the reader gets the point in one second." },
    { t: "Learners hate waiting in line", kind: "unsupported", why: "The chart counts sales; it says nothing about feelings. A headline must follow from the evidence." },
  ];

  function emphasis(root) {
    const st = { grid: false, legend: false, flat: false, hl: "None", note: false, head: -1 };
    let v = { grid: 1, legend: 1, depth: 1, note: 0 }, hk = SALES.map(() => 0);
    const svg = s("svg", { viewBox: "0 0 600 325", role: "img", "aria-label": "Column chart of canteen sales every five minutes" });
    const meterFill = h("div", { style: "width:0%" }), meterTxt = h("b", { class: "num" }, "0 / 5");
    const fb = h("p", { class: "feedback", "aria-live": "polite" });
    const X0 = 60, X1 = 470, Y0 = 296, YT = 96, bw = (X1 - X0) / SALES.length;
    const Y = (val) => Y0 - (val / 250) * (Y0 - YT);
    function draw() {
      clear(svg);
      const head = st.head >= 0 ? HEADLINES[st.head].t : "Chart 1";
      svg.append(s("text", { x: 20, y: 30, class: "svg-label", "font-size": st.head === 1 ? 22 : 20, "font-weight": 700, fill: st.head === 1 ? "var(--ink)" : "var(--muted)" }, head));
      svg.append(s("text", { x: 20, y: 56, class: "svg-label", "font-size": 15 }, "Sales per 5-minute slot, two weeks in June (sample data)"));
      if (v.grid > 0.01) for (let k = 0; k <= 250; k += 50) svg.append(s("line", { x1: X0, y1: Y(k), x2: X1, y2: Y(k), stroke: "var(--muted)", "stroke-width": 1, opacity: 0.45 * v.grid, "stroke-dasharray": "3 3" }));
      for (let k = 0; k <= 250; k += 50) svg.append(s("text", { x: X0 - 6, y: Y(k) + 4, "text-anchor": "end", class: "svg-text", "font-size": 14, fill: "var(--muted)" }, String(k)));
      const d = 12 * v.depth;
      SALES.forEach((val, i) => {
        const x = X0 + i * bw + 7, w = bw - 14, y = Y(val);
        const base = `color-mix(in srgb, var(--accent) ${round(clamp(hk[i], 0, 1) * 100, 0)}%, ${st.hl === "None" ? "var(--shape-a)" : "color-mix(in srgb, var(--muted) 55%, var(--paper))"})`;
        if (d > 0.3) {
          svg.append(s("path", { d: `M${x + w},${y} l${d},${-d} v${Y0 - y} l${-d},${d} Z`, fill: base, opacity: 0.55 }));
          svg.append(s("path", { d: `M${x},${y} l${d},${-d} h${w} l${-d},${d} Z`, fill: base, opacity: 0.75 }));
        }
        svg.append(s("rect", { x, y, width: w, height: Y0 - y, fill: base }));
        svg.append(s("text", { x: x + w / 2, y: Y0 + 20, "text-anchor": "middle", class: "svg-text", "font-size": 13 }, SLOTS[i]));
      });
      svg.append(s("line", { x1: X0, y1: Y0, x2: X1 + 10, y2: Y0, stroke: "var(--ink)", "stroke-width": 1.5 }));
      // legend slides out
      if (v.legend > 0.01) {
        const lx = 480 + (1 - v.legend) * 120;
        svg.append(s("g", { opacity: v.legend }, s("rect", { x: lx, y: 90, width: 16, height: 16, fill: "var(--shape-a)" }), s("text", { x: lx + 22, y: 103, class: "svg-label", "font-size": 13 }, "Sales"),
          s("rect", { x: lx, y: 116, width: 16, height: 16, fill: "var(--shape-a)", opacity: 0.6 }), s("text", { x: lx + 22, y: 129, class: "svg-label", "font-size": 13 }, "Series 1")));
      }
      if (v.note > 0.01) {
        const k = v.note, xa = X0 + 7, xb = X0 + 3 * bw - 7, yb = Y(250) - 4;
        svg.append(s("g", { opacity: clamp(k, 0, 1), transform: `translate(${(xa + xb) / 2},${yb}) scale(${0.6 + 0.4 * k}) translate(${-(xa + xb) / 2},${-yb})` },
          s("path", { d: `M${xa},${yb + 8} v-8 H${xb} v8`, fill: "none", stroke: "var(--accent)", "stroke-width": 2.5 }),
          s("text", { x: xb + 12, y: yb - 2, class: "svg-label", "font-size": 18, "font-weight": 700, fill: "var(--accent)" }, `${PCT}% of all sales`),
          s("text", { x: xb + 12, y: yb + 18, class: "svg-label", "font-size": 15, fill: "var(--ink)" }, "in the first 15 minutes")));
      }
      const pts = [st.grid, st.legend, st.flat, st.hl === "First 15 min", st.head === 1 && st.note].filter(Boolean).length;
      meterFill.style.width = `${(pts / 5) * 100}%`; meterTxt.textContent = `${pts} / 5`;
    }
    const sp = new Spring([1, 1, 1, 0], (a) => { [v.grid, v.legend, v.depth, v.note] = a; draw(); }, { stiffness: 110, damping: 12 });
    const hsp = new Spring(hk, (a) => { hk = a; draw(); }, { stiffness: 120, damping: 14 });
    const push = () => sp.set([st.grid ? 0 : 1, st.legend ? 0 : 1, st.flat ? 0 : 1, st.note ? 1 : 0]);
    const tog = (key, label) => { const b = h("button", { class: "btn ghost", type: "button", "aria-pressed": "false", onclick: () => { st[key] = !st[key]; b.setAttribute("aria-pressed", String(st[key])); b.textContent = (st[key] ? "✓ " : "") + label; push(); } }, label); return b; };
    const hlSeg = segmented(["None", "First 15 min", "12:05 only"], "None", (x) => { st.hl = x; hsp.set(SALES.map((_, i) => (x === "First 15 min" ? (i < 3 ? 1 : 0) : x === "12:05 only" ? (i === 7 ? 1 : 0) : 0))); draw();
      fb.className = "feedback " + (x === "First 15 min" ? "ok" : x === "None" ? "" : "bad");
      fb.textContent = x === "First 15 min" ? "Good: color only the bars that carry the message; grey the rest." : x === "12:05 only" ? "Highlighting 12:05 points the eye at the least important bar – emphasis must match the message." : ""; });
    const heads = h("div", { class: "l13-opts", role: "group", "aria-label": "Headline choices" });
    const hb = HEADLINES.map((hd, i) => { const b = h("button", { type: "button", "aria-pressed": "false", onclick: () => { st.head = i; hb.forEach((x, j) => x.setAttribute("aria-pressed", String(j === i))); fb.className = "feedback " + (hd.kind === "insight" ? "ok" : "bad"); fb.textContent = `${hd.kind === "insight" ? "Insight headline" : hd.kind === "boring" ? "Boring title" : "Unsupported claim"}: ${hd.why}`; draw(); } }, hd.t); heads.append(b); return b; });
    root.append(h("p", {}, "“So what?” – the same chart, with and without a story. Declutter it, emphasize the message, add one annotation, and choose a headline."),
      h("div", { class: "controls" }, tog("grid", "Remove gridlines"), tog("legend", "Remove legend"), tog("flat", "Remove 3D"), tog("note", "Add annotation")),
      h("div", { class: "controls" }, h("span", {}, "Highlight:"), hlSeg),
      svg,
      h("p", { class: "steps-title" }, "Headline"), heads, fb,
      h("div", { class: "controls" }, h("span", {}, "Clarity"), h("div", { class: "l13-meter", role: "img", "aria-label": "Clarity meter" }, meterFill), meterTxt));
    meterFill.style.transition = "width .5s cubic-bezier(.3,1.5,.5,1)";
    draw();
    return () => { sp.stop(); hsp.stop(); };
  }

  // ------------------------------------------------------------ Know Your Audience

  const AUDIENCE = {
    Principal: { need: "decides; has 2 minutes; wants the action, the cost, and the evidence", opts: [
      { t: `Please approve a two-week trial of staggered lunch (Grades 7–9 at 11:30, Grades 10–12 at 11:50). Now ${PCT}% of sales happen in the first 15 minutes; the trial costs nothing, and we will report results in three weeks.`, ok: true, why: "Leads with the decision, gives one key number, the cost, and when results come back." },
      { t: "We imported 1,170 POS rows, parsed timestamps with TIMEVALUE, bucketed them with FLOOR(…, \"0:05\"), and ran COUNTIFS for each slot. The distribution is right-skewed.", ok: false, why: "Too technical: methods belong in the appendix, not the opening for a decision-maker." },
      { t: "Lunch is total chaos and everybody is angry! Something must change NOW.", ok: false, why: "Emotional and vague – no evidence and no specific request." },
    ] },
    Parents: { need: "want to know how it affects their child and why", opts: [
      { t: "We found that 56.8% of point-of-sale transactions cluster in slots 1–3 (n = 1,170).", ok: false, why: "Jargon (point-of-sale, slots, n) – parents need the effect on their child." },
      { t: "For two weeks next month, your child will eat lunch at either 11:30 or 11:50, so that learners wait less in line and have more time to eat. We will share what we learn.", ok: true, why: "Plain words, what changes for their child, why, and what happens next." },
      { t: "The canteen is badly run and the school should fix it.", ok: false, why: "Blames without evidence and gives parents nothing to understand or do." },
    ] },
    Classmates: { need: "want it short, relatable, and to know what they can do", opts: [
      { t: "MEMORANDUM. Subject: Proposed Rescheduling of the Midday Recess. Effective upon approval…", ok: false, why: "Formal memo tone does not fit classmates." },
      { t: "[A chart with no title or words]", ok: false, why: "A chart without context makes the audience guess the point." },
      { t: `Tired of the 15-minute line? ${PCT}% of us buy food in the same 15 minutes. If the trial passes, Grades 10–12 eat at 11:50 – shorter lines for everyone. Tell us how it goes in the survey!`, ok: true, why: "Relatable hook, one number, what changes, and something they can do." },
    ] },
  };

  function audience(root) {
    const box = h("div", { class: "stage-body" });
    const done = new Set(), out = stat("Audiences matched:", "0 / 3");
    function show(who) {
      clear(box);
      const A = AUDIENCE[who], fb = h("p", { class: "feedback", "aria-live": "polite" }), bubble = h("div");
      const opts = h("div", { class: "l13-opts" });
      const btns = A.opts.map((o) => { const b = h("button", { type: "button", "aria-pressed": "false", onclick: () => {
        btns.forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
        fb.className = "feedback " + (o.ok ? "ok" : "bad"); fb.textContent = (o.ok ? "Best fit. " : "Not the best fit. ") + o.why;
        if (o.ok) { done.add(who); out.set(`${done.size} / 3`); }
        clear(bubble); const el = h("div", { class: "l13-bubble" }, h("p", { class: "note" }, `Told to: ${who}`), h("p", { style: "margin:0" }, o.t)); bubble.append(el);
        if (!Sim.reducedMotion() && el.animate) el.animate([{ transform: "translateY(18px) scale(.94)", opacity: 0 }, { transform: "translateY(-3px) scale(1.01)", opacity: 1, offset: 0.7 }, { transform: "none", opacity: 1 }], { duration: 450, easing: "ease-out" });
      } }, o.t); opts.append(b); return b; });
      box.append(h("p", {}, h("strong", {}, `${who}: `), A.need + "."), opts, fb, bubble);
    }
    root.append(h("p", {}, "The finding is the same: the canteen rush comes from one shared lunch break, and a staggered-lunch trial is recommended. Which version fits each audience?"),
      h("div", { class: "controls" }, segmented(Object.keys(AUDIENCE), "Principal", show), out.el), box);
    show("Principal");
    return () => {};
  }

  Sim.register({
    id: "lesson13", unit: "5", num: 13, title: "Data Storytelling", simName: "Story Builder",
    comps: ["A2.14", "M11"], sessions: "S66–S67", deped: "Sessions S66–S67", cg: "CG Part 2 · Content 5 (Data Storytelling)",
    bigQuestion: "How do we show the data so others understand and act?",
    mission: [
      "Story Arc: drag the five story cards into the arc and check the order. Which card answers “so what?” about the evidence?",
      "Emphasis: remove the gridlines, legend, and 3D; highlight the first 15 minutes; add the annotation; pick a headline. Can you reach 5 / 5 clarity?",
      "Know Your Audience: tell the same finding to the principal, parents, and classmates. What changes from one version to the next?",
    ],
    discovery: "A data story joins three things: context (why it matters), visuals (the evidence), and narrative (what it means). It moves from question to evidence to insight to recommendation to a specific call to action. Decluttering, one highlight color, an annotation, and an insight headline point the eye at the message. The words, detail, and request change with the audience – but the evidence and its limits stay the same.",
    mount(stage) {
      const body = h("div", { class: "stage-body" });
      const views = [storyArc, emphasis, audience];
      let stopper = null;
      const t = tabs(["Story Arc", "Emphasis", "Know Your Audience"], (i) => { if (stopper) stopper(); clear(body); stopper = views[i](body) || null; });
      stage.append(h("style", {}, CSS), t.el, body);
      stopper = storyArc(body);
      return () => { if (stopper) stopper(); };
    },
    check() {
      const kind = randInt(0, 5);
      if (kind === 0) { const c = pick(CARDS); return { q: `Which part of a data story is this? “${c.text}”`, choices: ROLES.map((r) => r.label), answer: ROLES.find((r) => r.id === c.role).label, explain: `It is the ${ROLES.find((r) => r.id === c.role).label.toLowerCase()} step.` }; }
      if (kind === 1) return { q: "Which is the best order for a data story?", choices: shuffle(["Question → evidence → insight → recommendation → call to action", "Evidence → call to action → question → insight → recommendation", "Recommendation → question → evidence → call to action → insight", "Insight → evidence → question → call to action → recommendation"]), answer: "Question → evidence → insight → recommendation → call to action", explain: "Start with why it matters, show the evidence, explain it, recommend, then ask for a specific action." };
      if (kind === 2) { const hd = pick(HEADLINES); return { q: `Is this chart headline a boring title, an insight headline, or an unsupported claim? “${hd.t}”`, choices: ["Boring title", "Insight headline", "Unsupported claim"], answer: hd.kind === "boring" ? "Boring title" : hd.kind === "insight" ? "Insight headline" : "Unsupported claim", explain: hd.why }; }
      if (kind === 3) { const a = randInt(150, 260), b = randInt(150, 260), c = randInt(150, 260), rest = randInt(300, 520), T = a + b + c + rest; return { q: `Sample data: in the first three 5-minute slots the canteen made ${a}, ${b}, and ${c} sales; the rest of the break had ${rest} sales. What percent of all sales happened in the first 15 minutes? (nearest whole percent)`, answer: Math.round(((a + b + c) / T) * 100), tol: 0.5, unit: "%", explain: `${a + b + c} ÷ ${T} × 100% ≈ ${fmt(((a + b + c) / T) * 100, 1)}%.` }; }
      if (kind === 4) return pick([
        { q: "You want the reader to notice the first three bars. What is the best emphasis?", choices: ["Color those three bars and grey the rest", "Make every bar a different color", "Add 3D to all bars", "Add more gridlines"], answer: "Color those three bars and grey the rest", explain: "One highlight color on the bars that carry the message." },
        { q: "Which change declutters a chart without losing information?", choices: ["Removing a legend that only says “Series 1”", "Removing the axis labels", "Removing the data source", "Removing the title"], answer: "Removing a legend that only says “Series 1”", explain: "A one-series legend adds ink but no information." },
        { q: "Which recommendation follows from the evidence and states its limits (M11)?", choices: ["Try staggered lunch for two weeks; we observed only two weeks in June, so we will measure again.", "Staggered lunch will definitely end all lines forever.", "Close the canteen.", "Lines are long because learners are impatient."], answer: "Try staggered lunch for two weeks; we observed only two weeks in June, so we will measure again.", explain: "It follows from the data, is specific, and names its limitation." },
      ]);
      return pick([
        { q: "Which version of the finding fits the principal best?", choices: ["One request, one key number, the cost, and when results come back", "A full list of formulas used", "An emotional complaint", "A chart with no words"], answer: "One request, one key number, the cost, and when results come back", explain: "Decision-makers need the action and the key evidence first." },
        { q: "What should stay the SAME when you retell a data story for a different audience?", choices: ["The evidence and its limits", "The vocabulary", "The level of detail", "The length"], answer: "The evidence and its limits", explain: "Words and detail change with the audience; the facts do not." },
      ]);
    },
  });
})();
