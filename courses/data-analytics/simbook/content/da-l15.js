/* Unit 6 · Lesson 15 · O. Independent Peer Verification – lesson and exercises */
Sim.addContent("lesson15", {
  learn: [
    { t: "h", text: "Why verify? “Trust, but verify”" },
    { t: "p", text: "Scientists, auditors, and data journalists do not just accept each other's findings – they **re-check** them. In **independent peer verification**, your group rebuilds the key results of another group's project and reports what holds and what does not. (These goals, T6–T8, were added by LSGH to the DepEd project competency.)" },
    { t: "defs", items: [
      ["Verify", "rebuild a result from the original data and methods, and compare it with the reported result"],
      ["Verification log", "a record of each result checked: what was reported, what you got, match or not, and the evidence"],
      ["Critique", "an evidence-based judgment of strengths, weaknesses, data-quality issues, limitations, and improvements"],
      ["Response", "the reviewed group's answer to each critique point: accept, clarify, or justify with evidence"],
    ] },
    { t: "h", text: "What to re-check (T6)" },
    { t: "table", head: ["Check", "Look for", "How"], rows: [
      ["Data", "duplicates, blanks, wrong types, privacy leaks", "COUNTIF for repeats; scan for names"],
      ["Calculations", "wrong ranges, wrong function, rounding", "Retype each formula; compare totals"],
      ["Visualizations", "truncated axis, 3D, cherry-picked range", "Read the axis min and the date range"],
      ["Claims", "causation from correlation, overgeneralizing", "Does the evidence support each sentence?"],
      ["Documentation", "missing source, log, dictionary, limits", "Use the stranger test"],
    ] },
    { t: "code", lang: "Google Sheets", lines: ["=COUNTIFS(A2:A10,A2, B2:B10,B2, C2:C10,C2, D2:D10,D2)", "=SUMIF(C2:C10,\"Juice\",D2:D10)", "=SUMIF(C:C,\"Juice\",D:D)"], note: "A COUNTIFS result above 1 means the row is repeated. Whole-column ranges (C:C) never miss new rows." },
    { t: "ex", title: "Re-compute a SUMIF", problem: "Group 4's summary uses =SUMIF(C2:C8,\"Juice\",D2:D8) and reports ₱180. Their Juice sales are in rows 2, 6, 8, and 9: ₱60, ₱80, ₱40, ₱100. Verify the total.", steps: [
      "The range C2:C8 stops at row 8, so row 9 is left out.",
      "Reported: 60 + 80 + 40 = ₱180.",
      "Correct range C2:C10: 60 + 80 + 40 + 100 = ₱280.",
      "Log it: reported ₱180, re-computed ₱280 – does not match; evidence: the range misses row 9.",
    ], answer: "The correct Juice total is ₱280, not ₱180." },
    { t: "ex", title: "Effect of a duplicate", problem: "Iced tea rows are ₱50 (row 4), ₱50 (row 5), and ₱75 (row 10). Rows 4 and 5 are identical in every column. What is the verified Iced tea total?", steps: [
      "COUNTIFS on row 4 returns 2 – the record appears twice.",
      "Reported total: 50 + 50 + 75 = ₱175.",
      "Remove one copy: 50 + 75 = ₱125.",
    ], answer: "₱125. The duplicate inflated the total by ₱50." },
    { t: "h", text: "Evaluating quality, methods, and limitations" },
    { t: "list", items: [
      "**Data quality:** Is the data complete, consistent, and free of duplicates? Are names and personal details protected?",
      "**Methods:** Was each tool used correctly (ranges, pivot settings, tests)? Could you repeat it from the documentation?",
      "**Claims:** Does each sentence follow from the evidence? Correlation does not prove causation.",
      "**Limitations:** Are the sample, time period, and missing data stated? Are any limits missing?",
    ] },
    { t: "h", text: "Preparing an evidence-based critique (T7)" },
    { t: "steps", title: "Four parts for each point", items: [
      "**Strength** – a specific, sincere strength: “Your log covers all four days, and every total shows its formula.”",
      "**Issue + evidence** – point to the exact place: “The Juice SUMIF stops at row 8 and misses row 9 (₱100).”",
      "**Impact** – how it changes the finding: “Juice is ₱280, so ‘juice and iced tea sold about the same’ no longer holds.”",
      "**Recommendation** – a doable fix: “Use C2:C10 and D2:D10, remove the duplicate, and re-check the chart.”",
    ] },
    { t: "table", head: ["Harsh or vague", "Respectful and evidence-based"], rows: [
      ["“Your numbers are wrong.”", "“Cell B2 misses row 9, so Juice is ₱100 too low.”"],
      ["“Your chart is misleading.”", "“The y-axis starts at ₱150, so a ₱15 gap looks large; start it at 0.”"],
      ["“You didn't think about privacy.”", "“Column B shows full names; replace them with codes before sharing.”"],
    ] },
    { t: "rule", title: "Critique the work, not the people", text: ["Use “the formula”, “the chart”, “the data” – not “you are careless”.", "Every criticism needs evidence the group can check, and a fix."] },
    { t: "h", text: "Presenting and responding (T8)" },
    { t: "defs", items: [
      ["Accept", "the reviewer found a real error or a missing limitation: thank them, fix it, and log the fix"],
      ["Clarify", "the reviewer misunderstood or something was unclear: explain, then improve the documentation"],
      ["Justify with evidence", "your choice was sound: point to the evidence – the log, the methods, the data"],
    ] },
    { t: "ex", title: "Choose the response", problem: "A reviewer says: “You deleted 14 survey rows; that could bias your results.” Your processing log shows the 14 rows were 7 exact duplicates and 7 blank responses. How should your group respond?", steps: [
      "The reviewer's concern is reasonable, but the deletion followed a stated rule.",
      "The evidence exists: processing log steps 1–2 with row counts 250 → 243 → 236.",
      "Respond: justify with evidence – “Log steps 1–2 show these were 7 duplicates and 7 blanks; the other 236 responses are unchanged.”",
    ], answer: "Justify with evidence, citing the processing log." },
    { t: "remember", items: [
      "Verify by rebuilding: data, calculations, visualizations, claims, documentation.",
      "Log every check: reported value, re-computed value, match or not, evidence.",
      "Critique = strength → issue + evidence → impact → recommendation, about the work and never the people.",
      "Respond by accepting real errors, clarifying misunderstandings, or justifying sound choices with evidence.",
    ] },
  ],
  exercises: [
    { title: "A. Skills Practice", items: [
      { q: "A summary uses =SUMIF(C2:C8,\"Juice\",D2:D8) but the data runs to row 10. What is the problem?", choices: ["The range misses rows 9 and 10", "SUMIF cannot add pesos", "The criterion should be a number", "Nothing – SUMIF reads the whole column"], answer: "The range misses rows 9 and 10", solution: "C2:C8 and D2:D8 stop at row 8; use C2:C10 and D2:D10 (or C:C and D:D)." },
      { q: "Juice sales are ₱60, ₱80, ₱40 (rows 2–8) and ₱100 (row 9). What is the verified Juice total?", num: 280, tol: 0, unit: "₱", solution: "60 + 80 + 40 + 100 = ₱280" },
      { q: "Iced tea rows are ₱50, ₱50 (an exact duplicate), and ₱75. What is the corrected total?", num: 125, tol: 0, unit: "₱", solution: ["Remove one copy of the duplicate.", "50 + 75 = ₱125"] },
      { q: "A chart of totals ₱180, ₱165, ₱175 has a y-axis starting at ₱150. What kind of issue is this?", choices: ["Truncated axis (visualization)", "Duplicate record (data quality)", "Missing source (documentation)", "Privacy leak (ethics)"], answer: "Truncated axis (visualization)", solution: "Starting at 150 exaggerates the ₱15 gaps; column charts must start at 0." },
      { q: "A data set shared with reviewers lists every buyer's full name. What should the group do?", choices: ["Replace the names with codes before sharing", "Keep the names so reviewers can check", "Delete the whole column of amounts", "Make the sheet public"], answer: "Replace the names with codes before sharing", solution: "Data privacy: names are not needed to verify the sales." },
      { q: "Which formula returns 2 for a row that appears twice in A2:D10 (checking all four columns)?", choices: ["=COUNTIFS(A2:A10,A2,B2:B10,B2,C2:C10,C2,D2:D10,D2)", "=COUNT(A2:D10)", "=SUMIF(A2:A10,A2,D2:D10)", "=UNIQUE(A2:D10)"], answer: "=COUNTIFS(A2:A10,A2,B2:B10,B2,C2:C10,C2,D2:D10,D2)", solution: "COUNTIFS counts rows matching all four values; a result above 1 means a duplicate." },
      { q: "Which is the best first sentence of a peer critique?", choices: ["“Your sales log covers all four days, and every total shows its formula.”", "“There are many mistakes.”", "“Nice.”", "“We found six issues.”"], answer: "“Your sales log covers all four days, and every total shows its formula.”", solution: "Start with a specific, sincere strength." },
      { q: "A verification log has 8 checked results; 5 match the group's report. What percent matched?", num: 62.5, tol: 0.05, unit: "%", solution: "5 ÷ 8 × 100% = 62.5%" },
    ] },
    { title: "B. Problem Solving", items: [
      { q: "A conclusion says: “Iced tea sales rose on days the poster was up, so the poster caused the increase.” Which rewrite is evidence-based?", choices: ["“Iced tea sales were higher on days the poster was up; a fair comparison is needed to know if the poster caused it.”", "“The poster definitely worked.”", "“Posters always increase sales.”", "“Iced tea is the best drink.”"], answer: "“Iced tea sales were higher on days the poster was up; a fair comparison is needed to know if the poster caused it.”", solution: "Report the association, and state what would be needed to claim a cause." },
      { q: "After fixing the SUMIF and the duplicate, Juice is ₱280 and Iced tea is ₱125. How many times as large as Iced tea is Juice? (2 decimal places)", num: 2.24, tol: 0.01, solution: ["280 ÷ 125 = 2.24", "So “Juice and iced tea sold about the same” does not survive the check."] },
      { q: "A reviewer asks, “Is Amount in pesos or number of drinks?” What is the best response?", choices: ["Clarify: it is pesos, and add the unit to the data dictionary", "Accept: delete the Amount column", "Justify: the reviewer should have known", "Ignore the question"], answer: "Clarify: it is pesos, and add the unit to the data dictionary", solution: "A question about meaning calls for a clarification and better documentation." },
      { q: "A group's dataset is in rows 2–41 (40 records). Its formula is =AVERAGE(C2:C36). How many records does the average leave out?", num: 5, tol: 0, solution: ["C2:C36 covers rows 2 to 36.", "Rows 37 to 41 are missing: 41 − 36 = 5 records."] },
    ] },
    { title: "C. Challenge", items: [
      { q: "Group 4 reported Juice ₱180, Water ₱165, Iced tea ₱175 (total ₱520). The verified totals are ₱280, ₱165, ₱125. By how many pesos was the overall total misreported? (Give the size of the difference.)", num: 50, tol: 0, unit: "₱", solution: ["Verified total = 280 + 165 + 125 = ₱570.", "Reported total = ₱520.", "Difference = 570 − 520 = ₱50 (₱100 missed by the range, ₱50 added by the duplicate)."] },
      { q: "Write a four-part critique (strength, issue + evidence, impact, recommendation) of one issue you found in Group 4's project – or in the project you are reviewing – and write how the reviewed group should respond to it.", open: true, solution: ["Strength: “Your sales log is complete for Monday to Thursday, and each total shows its formula.”", "Issue + evidence: “The Juice total uses =SUMIF(C2:C8,…), which misses row 9 (₱100).”", "Impact: “Juice is really ₱280, so the claim that juice and iced tea sold about the same does not hold.”", "Recommendation: “Use C2:C10 and D2:D10 (or whole columns), then update the chart and the conclusion.”", "Response: accept – “Thank you; we fixed the range, updated the chart and conclusion, and logged the change.”"] },
    ] },
  ],
});
