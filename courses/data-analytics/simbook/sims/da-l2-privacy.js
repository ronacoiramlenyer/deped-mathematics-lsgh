/* Data Analytics · Unit 1 · Lesson 2 · B. Data Privacy and Ethics – Privacy Shield */
(function () {
  "use strict";
  const { h, clear, randInt, pick, shuffle, fmt, clamp, tabs, segmented, stat, pill, Spring, elasticSlider } = Sim;

  // Sample data – every name and LRN here is made up.
  const STUDENTS = [
    ["Andrea Santos", "2010-03-14", "Wack-Wack", "Mandaluyong", "11-Faith", 91],
    ["Miguel Reyes", "2009-05-02", "Greenhills", "San Juan", "11-Faith", 85],
    ["Bea Dela Cruz", "2010-12-21", "Addition Hills", "Mandaluyong", "11-Faith", 88],
    ["Paolo Garcia", "2009-01-30", "Greenhills", "San Juan", "11-Hope", 79],
    ["Kyla Mendoza", "2009-03-09", "Plainview", "Mandaluyong", "11-Hope", 94],
    ["Juan Carlo Lim", "2010-05-17", "West Crame", "San Juan", "11-Faith", 82],
    ["Sofia Tan", "2010-11-03", "Valencia", "Quezon City", "11-Hope", 90],
    ["Rafael Bautista", "2010-02-25", "Wack-Wack", "Mandaluyong", "11-Hope", 87],
    ["Nicole Aquino", "2009-08-28", "Valencia", "Quezon City", "11-Hope", 93],
    ["Gabriel Villanueva", "2010-06-11", "Greenhills", "San Juan", "11-Hope", 84],
    ["Trisha Ramos", "2010-04-08", "Addition Hills", "Mandaluyong", "11-Faith", 89],
    ["Enzo Cruz", "2009-09-19", "Valencia", "Quezon City", "11-Hope", 80],
  ].map(([name, bday, brgy, city, section, grade], i) => ({
    i, name, bday, brgy, city, section, grade, lrn: `13651209${String(1000 + i * 437).slice(-4)}`,
    code: `L${String(((i * 7) % 12) + 1).padStart(2, "0")}`,
  }));
  const ageOn = (bday, ref = "2026-10-23") => {
    const [y, m, d] = bday.split("-").map(Number), [ry, rm, rd] = ref.split("-").map(Number);
    return ry - y - (rm < m || (rm === m && rd < d) ? 1 : 0);
  };
  STUDENTS.forEach((st) => { st.age = ageOn(st.bday); });

  /** k = size of the smallest group of rows that look identical (ignoring the grade we study). */
  function kAnon(keys) {
    const groups = {};
    keys.forEach((k) => { groups[k] = (groups[k] || 0) + 1; });
    const sizes = Object.values(groups);
    return { k: Math.min(...sizes), unique: sizes.filter((x) => x === 1).length, groups };
  }

  function anonymize(root) {
    const opt = { name: "keep", lrn: "keep", bday: 0, brgy: "keep", section: "keep" };
    const show = {
      name: (st) => ({ keep: st.name, initials: st.name.split(" ").filter((w) => /^[A-Z]/.test(w)).map((w) => w[0] + ".").join(" "), code: st.code, remove: "" }[opt.name]),
      lrn: (st) => ({ keep: st.lrn, mask: st.lrn.slice(0, 4) + "••••" + st.lrn.slice(-4), remove: "" }[opt.lrn]),
      bday: (st) => {
        const w = Math.round(opt.bday);
        if (w === 0) return st.bday;
        if (w === 1) return `age ${st.age}`;
        const lo = Math.floor((st.age - 15) / w) * w + 15;
        return `age ${lo}–${lo + w - 1}`;
      },
      brgy: (st) => ({ keep: `${st.brgy}, ${st.city}`, city: st.city, remove: "" }[opt.brgy]),
      section: (st) => (opt.section === "keep" ? st.section : ""),
    };
    const COLS = [["name", "Name"], ["lrn", "LRN"], ["bday", "Birthday"], ["brgy", "Barangay"], ["section", "Section"], ["grade", "Grade"]];
    const RH = 30, TEMPLATE = "1.5fr 1.25fr 1fr 1.45fr .8fr .55fr";
    const head = h("div", { style: `display:grid;grid-template-columns:${TEMPLATE};gap:6px;padding:0 8px;height:${RH}px;align-items:center;font-size:.75rem;letter-spacing:.05em;text-transform:uppercase;color:var(--muted);border-bottom:2px solid var(--line)` },
      COLS.map(([k, label]) => h("span", { "data-col": k }, label)));
    const body = h("div", { style: `position:relative;height:${STUDENTS.length * RH}px` });
    const rows = STUDENTS.map((st) => {
      const cells = COLS.map(([k]) => h("span", { class: k === "grade" || k === "lrn" ? "num" : "", style: "white-space:nowrap;overflow:hidden;text-overflow:ellipsis" }));
      const el = h("div", { style: `position:absolute;left:0;right:0;top:0;height:${RH - 2}px;display:grid;grid-template-columns:${TEMPLATE};gap:6px;padding:0 8px;align-items:center;font-size:.86rem;border-radius:6px;will-change:transform` }, cells);
      body.append(el);
      const r = { st, el, cells };
      r.sp = new Spring(st.i * RH, (y) => { el.style.transform = `translateY(${y}px)`; }, { stiffness: 170, damping: 16 });
      r.sp.jump(st.i * RH);
      return r;
    });
    const table = h("div", { class: "table-wrap" }, h("div", { style: "min-width:600px" }, head, body));

    const kBig = h("b", { class: "num", style: "font-size:2rem;line-height:1" }, "1");
    const kNote = h("span", { class: "note" });
    const bar = (color) => { const fill = h("div", { style: `height:100%;width:0;background:${color};border-radius:6px` }); return { fill, el: h("div", { style: "height:14px;background:var(--grid);border-radius:6px;overflow:hidden" }, fill) }; };
    const privBar = bar("var(--accent)"), useBar = bar("var(--gold)");
    const privText = h("span", { class: "num" }), useText = h("span", { class: "num" });
    const meters = h("div", { style: "display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:14px" },
      h("div", { style: "display:grid;gap:4px" }, h("span", {}, "Re-identification shield (k)"), privBar.el, h("div", { style: "display:flex;gap:10px;align-items:baseline" }, kBig, kNote)),
      h("div", { style: "display:grid;gap:4px" }, h("span", {}, "Usefulness for analysis"), useBar.el, useText));
    let shown = [1, 100];
    const meterSpring = new Spring(shown, (v) => {
      shown = v;
      privBar.fill.style.width = `${clamp((v[0] - 1) / 5, 0, 1) * 100}%`;
      kBig.textContent = String(Math.max(1, Math.round(v[0])));
      useBar.fill.style.width = `${clamp(v[1], 0, 100)}%`;
      useText.textContent = `${Math.round(clamp(v[1], 0, 100))}% of the detail kept`;
    }, { stiffness: 150, damping: 11 });

    const DETAIL = {
      name: { keep: 1, initials: 0.6, code: 0.5, remove: 0, w: 0.5 }, lrn: { keep: 1, mask: 0.5, remove: 0, w: 1 },
      brgy: { keep: 1, city: 0.5, remove: 0, w: 2 }, section: { keep: 1, remove: 0, w: 2 },
    };
    const BDAY = [1, 0.8, 0.6, 0.45, 0.35, 0.25];
    function usefulness() {
      let sum = 3, tot = 3 + 2; // grade (always kept, weight 3) + birthday (weight 2)
      sum += 2 * BDAY[Math.round(opt.bday)];
      for (const k of ["name", "lrn", "brgy", "section"]) { sum += DETAIL[k].w * DETAIL[k][opt[k]]; tot += DETAIL[k].w; }
      return (sum / tot) * 100;
    }
    function update() {
      const keys = rows.map((r) => ["name", "lrn", "bday", "brgy", "section"].map((k) => show[k](r.st)).join("|"));
      const { k, unique, groups } = kAnon(keys);
      // cluster identical-looking rows; rows spring to their new places
      const order = rows.map((r, j) => ({ r, key: keys[j] })).sort((a, b) => groups[a.key] - groups[b.key] || a.key.localeCompare(b.key) || a.r.st.i - b.r.st.i);
      let band = 0, prev = null;
      order.forEach(({ r, key }, pos) => {
        if (key !== prev) { band++; prev = key; }
        r.sp.set(pos * RH);
        COLS.forEach(([c], j) => {
          const txt = c === "grade" ? String(r.st.grade) : show[c](r.st);
          r.cells[j].textContent = txt || "—";
          r.cells[j].style.color = txt ? "" : "var(--muted)";
        });
        r.el.style.background = groups[key] === 1 ? "color-mix(in srgb, var(--bad) 12%, transparent)" : band % 2 ? "var(--accent-soft)" : "var(--gold-soft)";
      });
      head.querySelectorAll("[data-col]").forEach((sp) => {
        const c = sp.dataset.col, gone = (opt[c] === "remove") || (c === "section" && opt.section === "remove");
        sp.style.textDecoration = gone ? "line-through" : "none";
      });
      kNote.textContent = unique ? `${unique} of 12 rows are unique – those learners can be picked out.` : `Every row looks like at least ${k} rows (k = ${k}).`;
      meterSpring.set([k, usefulness()]);
    }
    const seg = (key, values, labels) => segmented(values, opt[key], (v) => { opt[key] = v; update(); }, (v) => labels[values.indexOf(v)]);
    const BLAB = ["date", "age", "2-yr", "3-yr", "4-yr", "5-yr"];
    const slider = elasticSlider({ id: "da-l2-band", label: "Detail", min: 0, max: 5, value: 0, step: 1, format: (v) => BLAB[Math.round(v)],
      onInput: (v) => { if (Math.round(v) !== Math.round(opt.bday)) { opt.bday = v; update(); } else opt.bday = v; } });
    const ctl = (label, el) => h("div", { class: "controls" }, h("span", { style: "min-width:6.5em;font-weight:700" }, label), el);
    root.append(
      ctl("Name", seg("name", ["keep", "initials", "code", "remove"], ["Keep", "Initials", "Code", "Remove"])),
      ctl("LRN", seg("lrn", ["keep", "mask", "remove"], ["Keep", "Mask", "Remove"])),
      ctl("Birthday", slider.el),
      ctl("Barangay", seg("brgy", ["keep", "city", "remove"], ["Keep", "City only", "Remove"])),
      ctl("Section", seg("section", ["keep", "remove"], ["Keep", "Remove"])),
      meters, table,
      h("div", { class: "controls" },
        h("button", { class: "btn ghost", type: "button", onclick: () => { Object.assign(opt, { name: "remove", lrn: "remove", brgy: "city", section: "keep" }); slider.set(3); opt.bday = 3; rebuildSegs(); update(); } }, "Try: a safe research version"),
        h("button", { class: "btn ghost", type: "button", onclick: () => { Object.assign(opt, { name: "keep", lrn: "keep", brgy: "keep", section: "keep" }); slider.set(0); opt.bday = 0; rebuildSegs(); update(); } }, "Reset")),
      h("p", { class: "note" }, "Sample data – the names and LRNs are made up. Grade is the value we want to study, so it is always kept. k counts how many rows share the same visible details."));
    function rebuildSegs() {
      const ctrls = root.querySelectorAll(".controls .seg");
      const keys = ["name", "lrn", "brgy", "section"];
      ctrls.forEach((sg, j) => {
        const k = keys[j];
        const vals = { name: ["keep", "initials", "code", "remove"], lrn: ["keep", "mask", "remove"], brgy: ["keep", "city", "remove"], section: ["keep", "remove"] }[k];
        [...sg.children].forEach((b, bi) => b.setAttribute("aria-pressed", vals[bi] === opt[k] ? "true" : "false"));
      });
    }
    update();
    return () => { meterSpring.stop(); rows.forEach((r) => r.sp.stop()); };
  }

  // ------------------------------------------------------------ ethics calls

  const CALLS = [
    { t: "An adviser posts the full class list – names, LRNs, birthdays, and home addresses – in a big group chat to remind everyone about ID pickup.", a: "Not okay", p: "Proportionality",
      why: "Only names were needed for an ID reminder. Sharing LRNs, birthdays, and addresses is excessive and exposes learners to misuse." },
    { t: "The student council’s canteen-menu survey asks for each learner’s name, phone number, home address, and family income.", a: "Okay if…", p: "Proportionality",
      why: "A menu survey is a legitimate purpose, but it is okay only if it drops the fields it does not need. Collect only what the purpose requires." },
    { t: "The school uses attendance records to spot learners who are often absent so that guidance counselors can offer support. The handbook explains this.", a: "Okay", p: "Legitimate purpose",
      why: "The purpose is lawful and helpful, learners and parents were told (transparency), and only school staff who need the data use it." },
    { t: "The same attendance records are given to a tutoring company so it can advertise to families of learners with low attendance.", a: "Not okay", p: "Legitimate purpose",
      why: "The data were collected for school purposes. Using them for a different purpose that people were not told about and did not agree to breaks purpose limitation." },
    { t: "A scholarship ranking gives extra points to learners from certain barangays, so applicants from other barangays always rank lower even with the same grades.", a: "Not okay", p: "Fairness and bias",
      why: "Where a learner lives is not a fair measure of merit. The ranking builds in bias against a group, so its results are unfair even if the math is correct." },
    { t: "The research club publishes the average grade per section, with no names, and only for groups of at least 10 learners.", a: "Okay", p: "Proportionality",
      why: "Aggregated results with large groups cannot be traced to a person. This shares useful findings while protecting individuals." },
    { t: "For a class project, a learner wants to post photos of classmates on a public page.", a: "Okay if…", p: "Transparency and consent",
      why: "Okay if the classmates are told how the photos will be used and agree first – and anyone who says no is left out." },
    { t: "A learner’s clinic record is read aloud in class to explain why they were absent for a week.", a: "Not okay", p: "Sensitive personal information",
      why: "Health information is sensitive personal information. It must be kept confidential and shared only with those who need it." },
    { t: "A jeepney-route app asks for your location, explains that it is used only to show nearby routes, and lets you turn it off.", a: "Okay", p: "Transparency",
      why: "The app says why it needs the data, uses it only for that, and gives you control – transparent and proportional." },
  ];
  const VERDICTS = ["Not okay", "Okay if…", "Okay"];

  function ethics(root) {
    let deck = shuffle(CALLS), k = 0, right = 0, tries = 0, decided = false, dragX = 0;
    const left = h("span", { class: "pill no", style: "opacity:0" }, "← Not okay"), rightTag = h("span", { class: "pill yes", style: "opacity:0" }, "Okay →");
    const text = h("p", { style: "margin:0;font-size:1.05rem" });
    const card = h("div", { class: "panel", style: "cursor:grab;touch-action:pan-y;user-select:none;box-shadow:0 4px 14px rgba(0,0,0,.12);min-height:130px;align-content:center;will-change:transform" },
      h("div", { style: "display:flex;justify-content:space-between" }, left, rightTag), text);
    const paint = (x) => {
      dragX = x;
      card.style.transform = `translateX(${x}px) rotate(${x / 22}deg)`;
      card.style.opacity = String(clamp(1 - Math.max(0, Math.abs(x) - 160) / 260, 0, 1));
      left.style.opacity = String(clamp(-x / 110, 0, 1)); rightTag.style.opacity = String(clamp(x / 110, 0, 1));
    };
    const fling = new Spring(0, paint, { stiffness: 170, damping: 15 });
    const row = h("div", { class: "choices" }), fb = h("div", { "aria-live": "polite" }), score = stat("Score:", "0 / 0"), scen = stat("Scenario:", "");
    let startX = 0;
    card.addEventListener("pointerdown", (e) => {
      if (decided) return;
      card.setPointerCapture(e.pointerId); startX = e.clientX - dragX; fling.stop(); card.style.cursor = "grabbing";
      const move = (ev) => { const x = ev.clientX - startX; paint(Sim.rubber(x, -200, 200, 0.5)); fling.value = dragX; fling.vel = 0; };
      const up = () => {
        card.removeEventListener("pointermove", move); card.removeEventListener("pointerup", up); card.removeEventListener("pointercancel", up);
        card.style.cursor = "grab";
        if (dragX > 110) choose("Okay"); else if (dragX < -110) choose("Not okay"); else fling.set(0);
      };
      card.addEventListener("pointermove", move); card.addEventListener("pointerup", up); card.addEventListener("pointercancel", up);
    });
    function choose(v) {
      if (decided) return;
      decided = true; tries++;
      const item = deck[k], ok = v === item.a;
      if (ok) right++;
      score.set(`${right} / ${tries}`);
      // the card settles, tilted, on the side you chose – still readable
      fling.set(v === "Okay" ? 18 : v === "Not okay" ? -18 : 0);
      if (v === "Okay if…") card.style.outline = "3px solid var(--gold)";
      [...row.children].forEach((b) => { if (b.textContent === item.a) b.style.borderColor = "var(--good)"; else if (b.textContent === v) b.style.borderColor = "var(--bad)"; });
      fb.append(pill(ok, "Good call!", `The better call: ${item.a}`), h("p", {}, h("b", {}, `${item.p}: `), item.why),
        h("div", { class: "controls" }, h("button", { class: "btn", type: "button", onclick: () => { k++; next(); } }, "Next scenario")));
    }
    function next() {
      if (k === deck.length) {
        clear(fb); clear(row); text.textContent = `Done! ${right} of ${tries} calls matched.`; fling.jump(0);
        fb.append(h("button", { class: "btn", type: "button", onclick: () => { deck = shuffle(CALLS); k = 0; right = 0; tries = 0; score.set("0 / 0"); next(); } }, "Play again"));
        decided = true; return;
      }
      decided = false; clear(fb); clear(row); card.style.outline = "none";
      scen.set(`${k + 1} of ${deck.length}`);
      text.textContent = deck[k].t;
      fling.jump(-420); fling.set(0);
      VERDICTS.forEach((v) => row.append(h("button", { type: "button", onclick: () => choose(v) }, v)));
    }
    root.append(h("p", {}, "Swipe the card right for Okay, left for Not okay – or tap a button (use “Okay if…” when it depends on a condition)."),
      h("div", { style: "overflow:hidden;padding:8px 24px;margin:0 -10px" }, card), row, fb, h("div", { class: "readout" }, score.el, scen.el),
      h("p", { class: "note" }, "Principles from the Data Privacy Act of 2012 (RA 10173): transparency, legitimate purpose, and proportionality."));
    next();
    return () => fling.stop();
  }

  // ------------------------------------------------------------ lesson

  Sim.register({
    id: "lesson2", unit: "1", num: 2, title: "Data Privacy and Ethics", simName: "Privacy Shield",
    comps: ["A1.4", "A1.5", "M2"], sessions: "S5–S6", cg: "CG Part 1 · Content 2 (Data Privacy and Ethics)", deped: "Sessions S5–S6",
    bigQuestion: "What can data tell us – and what should it never be used for?",
    mission: [
      "Anonymize: look at k with every column kept. Why is k = 1?",
      "Remove names and LRNs only. Is the table anonymous now? Which rows can still be picked out?",
      "Drag the birthday slider and generalize the barangay until k is at least 2. What did the table lose?",
      "Ethics Calls: judge all 9 scenarios. Which principle settles each one?",
    ],
    discovery: "Removing names is not enough: a birthday, a barangay, and a section together can still point to one learner. Generalizing (age bands, city instead of barangay) makes rows look alike – k rises – but each step removes detail an analyst might need, so privacy and usefulness must be balanced. Good data practice follows the Data Privacy Act principles: be transparent, use data only for a legitimate purpose that people were told about, and collect and share only what the purpose needs. Fairness matters too: a correct formula can still be biased.",
    mount(stage) {
      const body = h("div", { class: "stage-body" });
      const views = [anonymize, ethics];
      let stopper = null;
      const t = tabs(["Anonymize", "Ethics Calls"], (i) => { if (stopper) stopper(); clear(body); stopper = views[i](body) || null; });
      stage.append(t.el, body);
      stopper = anonymize(body);
      return () => { if (stopper) stopper(); };
    },
    check() {
      const kind = randInt(0, 4);
      if (kind === 0) {
        const c = pick(CALLS);
        return { q: `${c.t} Okay, not okay, or okay if…?`, choices: VERDICTS, answer: c.a, explain: c.why };
      }
      if (kind === 1) {
        const sizes = Array.from({ length: 4 }, () => randInt(2, 6));
        if (Math.random() < 0.4) sizes[randInt(0, 3)] = 1;
        const k = Math.min(...sizes);
        return { q: `After removing names and LRNs, the rows fall into groups that look identical, of sizes ${sizes.join(", ")}. What is k (the size of the smallest group)?`, answer: k, tol: 0, explain: `k is the smallest group size: ${k}.${k === 1 ? " A group of 1 means someone can be re-identified." : ""}` };
      }
      if (kind === 2) return pick([
        { q: "Collecting only the data that the purpose really needs follows which principle?", choices: ["Proportionality", "Transparency", "Legitimate purpose", "Accuracy"], answer: "Proportionality", explain: "Proportionality: data collected must be adequate and not excessive for the purpose." },
        { q: "Telling people what data you collect, why, and how it will be used follows which principle?", choices: ["Transparency", "Proportionality", "Legitimate purpose", "Retention"], answer: "Transparency", explain: "Transparency: people should know how their data are processed." },
        { q: "Using attendance data only for the school purpose it was collected for follows which principle?", choices: ["Legitimate purpose", "Transparency", "Proportionality", "Availability"], answer: "Legitimate purpose", explain: "Legitimate purpose: process data only for declared, lawful purposes." },
      ]);
      if (kind === 3) return pick([
        { q: "Which of these is sensitive personal information under the Data Privacy Act?", choices: ["A learner’s health record", "The school’s address", "The canteen menu", "Average grade of a section"], answer: "A learner’s health record", explain: "Health information is among the kinds of sensitive personal information listed in RA 10173." },
        { q: "Which law protects personal information in the Philippines?", choices: ["Data Privacy Act of 2012 (RA 10173)", "Cybercrime Prevention Act only", "Civil Service Law", "Philippine Statistical Act only"], answer: "Data Privacy Act of 2012 (RA 10173)", explain: "RA 10173, the Data Privacy Act of 2012, protects personal information." },
        { q: "Replacing every name with a code such as L07 makes a dataset…", choices: ["pseudonymized – each row can still be unique", "fully anonymous", "unusable", "public"], answer: "pseudonymized – each row can still be unique", explain: "A code still singles out one row, so the data are only pseudonymized." },
      ]);
      const st = pick(STUDENTS), w = pick([2, 3]);
      const lo = Math.floor((st.age - 15) / w) * w + 15;
      return { q: `A learner is ${st.age} years old. With ${w}-year age bands that start at 15 (15–${15 + w - 1}, ${15 + w}–${15 + 2 * w - 1}, …), what is the lowest age in the learner’s band?`, answer: lo, tol: 0, explain: `${st.age} falls in the band ${lo}–${lo + w - 1}.` };
    },
  });
})();
