/* Math SimBook – the textbook side: lesson exposition and exercise sets. */
(function () {
  "use strict";
  const { h, clear, parseNumber, Frac } = Sim;

  const content = {};
  /** content/lN.js files call this with { learn: [...blocks], exercises: [...parts] }. */
  function addContent(id, data) { content[id] = data; }

  /** **bold** and __italic__ inside lesson text. */
  function rich(text) {
    const out = [];
    String(text).split(/(\*\*.+?\*\*|__.+?__)/).forEach((piece) => {
      if (!piece) return;
      if (piece.startsWith("**")) out.push(h("strong", {}, piece.slice(2, -2)));
      else if (piece.startsWith("__")) out.push(h("em", {}, piece.slice(2, -2)));
      else out.push(piece);
    });
    return out;
  }

  // ------------------------------------------------------------ lesson

  function renderLearn(blocks) {
    const art = h("div", { class: "learn" });
    let exNo = 0;
    for (const b of blocks || []) {
      if (b.t === "h") art.append(h("h3", {}, b.text));
      else if (b.t === "p") art.append(h("p", {}, rich(b.text)));
      else if (b.t === "defs") art.append(h("dl", { class: "defs" }, b.items.flatMap(([term, def]) => [h("dt", {}, term), h("dd", {}, rich(def))])));
      else if (b.t === "rule") art.append(h("div", { class: "rule" }, b.title ? h("p", { class: "rule-title" }, b.title) : null, ...[].concat(b.text).map((x) => h("p", {}, rich(x)))));
      else if (b.t === "steps") art.append(h("div", {}, b.title ? h("p", { class: "steps-title" }, rich(b.title)) : null, h("ol", { class: "steps" }, b.items.map((x) => h("li", {}, rich(x))))));
      else if (b.t === "list") art.append(h("ul", { class: "plain" }, b.items.map((x) => h("li", {}, rich(x)))));
      else if (b.t === "table") art.append(h("div", { class: "table-wrap" }, h("table", { class: "data" },
        h("thead", {}, h("tr", {}, b.head.map((c) => h("th", {}, c)))), h("tbody", {}, b.rows.map((r) => h("tr", {}, r.map((c) => h("td", {}, rich(c)))))))));
      else if (b.t === "ex") {
        exNo++;
        art.append(h("div", { class: "example" },
          h("p", { class: "example-title" }, `Example ${exNo}`, b.title ? ` · ${b.title}` : ""),
          h("p", {}, rich(b.problem)),
          h("p", { class: "example-sol" }, "Solution"),
          h("ol", { class: "steps" }, b.steps.map((x) => h("li", {}, rich(x)))),
          b.answer ? h("p", { class: "example-ans" }, h("strong", {}, "Answer: "), rich(b.answer)) : null));
      } else if (b.t === "remember") art.append(h("div", { class: "remember" }, h("p", { class: "rule-title" }, "Remember"), h("ul", {}, b.items.map((x) => h("li", {}, rich(x))))));
    }
    return art;
  }

  // ------------------------------------------------------------ exercises

  function isCorrect(item, text) {
    if (item.choices) return text === item.answer;
    if (item.range) { const f = parseNumber(text); return !!f && f.value() > item.range[0] && f.value() < item.range[1]; }
    const f = parseNumber(text);
    if (!f) return false;
    if (item.frac) return f.eq(parseNumber(item.frac));
    return Math.abs(f.value() - item.num) <= (item.tol ?? 0.005) + 1e-9;
  }

  function answerText(item) {
    if (item.choices) return item.answer;
    if (item.frac) { const f = parseNumber(item.frac); return f.n > f.d && f.d !== 1 ? `${f.mixed()} (or ${f.toString()})` : f.toString(); }
    if (item.range) return item.rangeText;
    if (item.open) return "See the model answer.";
    if (item.unit === "₱") return Sim.peso(item.num);
    return `${Sim.fmt(item.num, 4)}${item.unit ? " " + item.unit : ""}`;
  }

  function renderExercises(lesson, parts) {
    const wrap = h("div", { class: "exercises" });
    const items = [];
    const score = h("p", { class: "score", "aria-live": "polite" });
    const update = () => {
      const graded = items.filter((x) => !x.item.open);
      const right = graded.filter((x) => x.ok).length, tried = graded.filter((x) => x.tried).length;
      score.textContent = `${right} of ${graded.length} correct · ${tried} answered`;
    };
    let no = 0;
    for (const part of parts || []) {
      const ol = h("ol", { class: "ex-list", start: no + 1 });
      wrap.append(h("div", { class: "ex-part" }, h("h3", {}, part.title), part.note ? h("p", { class: "note" }, part.note) : null, ol));
      for (const item of part.items) {
        no++;
        const state = { item, ok: false, tried: false };
        items.push(state);
        const fb = h("p", { class: "feedback", "aria-live": "polite" });
        const sol = h("details", { class: "solution" }, h("summary", {}, item.open ? "Model answer" : "Show solution"),
          h("ol", { class: "steps" }, [].concat(item.solution).map((x) => h("li", {}, rich(x)))),
          item.open ? null : h("p", { class: "example-ans" }, h("strong", {}, "Answer: "), answerText(item)));
        const li = h("li", { class: "ex-item", id: `ex-${lesson.num}-${no}` }, h("p", { class: "q" }, h("span", { class: "ex-no" }, `${no}.`), " ", rich(item.q)));
        const mark = (ok) => {
          state.tried = true; state.ok = ok;
          fb.className = "feedback " + (ok ? "ok" : "bad");
          fb.textContent = ok ? "Correct!" : "Not yet. Check your work, or open the solution.";
          update();
        };
        if (item.open) {
          li.append(h("textarea", { class: "ex-open", rows: 2, id: `ex-${lesson.id}-${no}`, "aria-label": `Your answer to item ${no}` }));
        } else if (item.choices) {
          const row = h("div", { class: "choices" });
          const btns = item.choices.map((c) => h("button", { type: "button", "aria-pressed": "false", onclick: () => { btns.forEach((b) => b.setAttribute("aria-pressed", b.textContent === c ? "true" : "false")); mark(c === item.answer); } }, c));
          row.append(...btns);
          li.append(row);
        } else {
          const input = h("input", { type: "text", inputmode: "decimal", autocomplete: "off", id: `ex-${lesson.id}-${no}`, "aria-label": `Your answer to item ${no}` });
          const check = () => { if (input.value.trim()) mark(isCorrect(item, input.value)); };
          input.addEventListener("keydown", (e) => { if (e.key === "Enter") check(); });
          li.append(h("div", { class: "check-row" }, input, item.unit ? h("span", {}, item.unit) : null, h("button", { class: "btn", type: "button", onclick: check }, "Check")));
          if (item.hint) li.append(h("p", { class: "note" }, item.hint));
        }
        li.append(fb, sol);
        ol.append(li);
      }
    }
    const key = h("details", { class: "answer-key" }, h("summary", {}, "Answer key (for checking after you finish)"),
      h("ol", {}, items.map((x) => h("li", {}, answerText(x.item)))));
    wrap.append(h("div", { class: "ex-footer" }, score, key));
    update();
    return wrap;
  }

  Object.assign(Sim, { content, addContent, renderLearn, renderExercises, rich });
})();
