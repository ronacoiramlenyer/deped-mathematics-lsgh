/* Term 3 · Lesson 7 · G. Writing and Solving Equations – lesson and exercises */
Sim.addContent("lesson25", {
  learn: [
    { t: "h", text: "Writing equations" },
    { t: "p", text: "An expression is a phrase (3n + 5); an **equation** is a sentence that says two expressions are equal (3n + 5 = 20)." },
    { t: "steps", title: "From a word problem to an equation", items: [
      "Name the unknown with a letter: let d = the number of days.",
      "Translate what happens to the unknown into an expression: 25d.",
      "Find the word for “equals” (is, will be, paid, scored, in all) and write the equation: 25d = 300.",
    ] },
    { t: "table", head: ["Sentence", "Equation"], rows: [
      ["A number increased by 8 is 21.", "n + 8 = 21"],
      ["Twice a number, decreased by 4, is 18.", "2n − 4 = 18"],
      ["The quotient of a number and 4 is 6.", "x ÷ 4 = 6"],
      ["Ana saves ₱25 a day and will have ₱300 after d days.", "25d = 300"],
    ] },
    { t: "h", text: "A scoring rule as an expression" },
    { t: "ex", title: "Family Day booth", problem: "At the LSGH Family Day ring-toss booth, every player gets 10 bonus points plus 5 points for each ring that lands. Write the scoring rule, then an equation for a score of 45.", steps: ["Let r = the number of rings that land.", "Scoring rule (expression): 5r + 10", "Rina scored 45, so the equation is 5r + 10 = 45."], answer: "5r + 10 and 5r + 10 = 45." },
    { t: "h", text: "Solving equations" },
    { t: "p", text: "A **solution** is the value of the unknown that makes the equation true. In this lesson the unknowns are never negative: counts, lengths, days, and pesos." },
    { t: "list", items: [
      "**Guess and check:** try a value, compare the two sides, adjust, and try again.",
      "**Inverse operations:** undo + with −, − with +, × with ÷, and ÷ with ×, on both sides.",
    ] },
    { t: "ex", title: "Guess and check", problem: "Solve 25d = 300 by guess and check.", steps: ["d = 10: 25(10) = 250 < 300, too small", "d = 13: 25(13) = 325 > 300, too big", "d = 12: 25(12) = 300 ✓"], answer: "d = 12." },
    { t: "ex", title: "Inverse operations", problem: "Solve 5r + 10 = 45.", steps: ["Subtract 10 from both sides: 5r = 35", "Divide both sides by 5: r = 7", "Check: 5(7) + 10 = 35 + 10 = 45 ✓"], answer: "r = 7 rings." },
    { t: "rule", title: "Always check", text: ["Substitute the answer into the ORIGINAL equation.", "If both sides are equal, the answer is correct."] },
    { t: "h", text: "Problems with expressions and formulas" },
    { t: "ex", title: "Perimeter", problem: "A rectangular garden has a perimeter of 30 m and a width of 5 m. Find its length.", steps: ["P = 2l + 2w → 30 = 2l + 2(5)", "30 = 2l + 10, so 20 = 2l", "l = 10", "Check: 2(10) + 2(5) = 30 ✓"], answer: "10 m." },
    { t: "ex", title: "Cost", problem: "Ride tickets cost ₱20 each and a snack costs ₱30. Jo has ₱150. How many tickets can Jo buy with one snack?", steps: ["Let t = the number of tickets: 20t + 30 = 150", "20t = 120", "t = 6", "Check: 20(6) + 30 = 150 ✓"], answer: "6 tickets." },
    { t: "ex", title: "Area", problem: "A triangular banner has an area of 24 dm² and a base of 8 dm. Find its height.", steps: ["A = ½bh → 24 = ½(8)h", "24 = 4h", "h = 6", "Check: ½(8)(6) = 24 ✓"], answer: "6 dm." },
    { t: "remember", items: ["Let a letter stand for the unknown, then translate the story into an equation.", "Solve by guess and check or by inverse operations on both sides.", "Check every solution by substituting it into the original equation."] },
  ],
  exercises: [
    { title: "A. Skills Practice", items: [
      { q: "Which equation means “a number increased by 8 is 21”?", choices: ["n + 8 = 21", "8n = 21", "n − 8 = 21", "n + 21 = 8"], answer: "n + 8 = 21", solution: "“increased by 8” → + 8; “is” → =." },
      { q: "Which equation means “twice a number, decreased by 4, is 18”?", choices: ["2n − 4 = 18", "2(n − 4) = 18", "4 − 2n = 18", "2n + 4 = 18"], answer: "2n − 4 = 18", solution: "Twice a number is 2n; decreased by 4 gives 2n − 4." },
      { q: "Ana saves ₱25 a day. Which equation finds the number of days d until Ana has ₱300?", choices: ["25d = 300", "d + 25 = 300", "300d = 25", "d − 25 = 300"], answer: "25d = 300", solution: "₱25 for each of d days is 25d pesos." },
      { q: "Solve n + 8 = 21.", num: 13, solution: ["n = 21 − 8 = 13", "Check: 13 + 8 = 21 ✓"] },
      { q: "Solve 25d = 300.", num: 12, solution: ["d = 300 ÷ 25 = 12", "Check: 25(12) = 300 ✓"] },
      { q: "Solve 2n − 4 = 18.", num: 11, solution: ["2n = 22", "n = 11", "Check: 2(11) − 4 = 18 ✓"] },
      { q: "Solve x ÷ 4 = 6.", num: 24, solution: ["x = 6 × 4 = 24", "Check: 24 ÷ 4 = 6 ✓"] },
      { q: "Is x = 5 a solution of 3x + 2 = 17?", choices: ["Yes", "No"], answer: "Yes", solution: "3(5) + 2 = 15 + 2 = 17 ✓" },
    ] },
    { title: "B. Problem Solving", items: [
      { q: "Family Day booth: each ring that lands is worth 5 points, and every player gets 10 bonus points. Write the scoring rule as an expression, then find how many rings landed for a score of 45.", num: 7, unit: "rings", solution: ["Scoring rule: 5r + 10", "5r + 10 = 45 → 5r = 35 → r = 7", "Check: 5(7) + 10 = 45 ✓"] },
      { q: "A rectangular garden has a perimeter of 30 m and a width of 5 m. Find its length.", num: 10, unit: "m", solution: ["2l + 2(5) = 30", "2l = 20, so l = 10 m", "Check: 2(10) + 10 = 30 ✓"] },
      { q: "Ride tickets cost ₱20 each and a snack costs ₱30. Jo has ₱150. How many tickets can Jo buy with one snack?", num: 6, unit: "tickets", solution: ["20t + 30 = 150", "20t = 120, so t = 6", "Check: 20(6) + 30 = 150 ✓"] },
      { q: "A triangular banner has an area of 24 dm² and a base of 8 dm. Find its height.", num: 6, unit: "dm", solution: ["24 = ½(8)h = 4h", "h = 6 dm", "Check: ½(8)(6) = 24 ✓"] },
    ] },
    { title: "C. Challenge", items: [
      { q: "Kai’s jeepney fare is ₱13 for the first 4 km plus ₱2 for each extra kilometre. Kai paid ₱25. How many kilometres long was the whole ride?", num: 10, unit: "km", solution: ["13 + 2k = 25 → 2k = 12 → k = 6 extra kilometres", "Whole ride: 4 + 6 = 10 km", "Check: 13 + 2(6) = 25 ✓"] },
      { q: "Design your own Family Day game booth. Write its scoring rule as an expression, then write and solve an equation for one player’s score. Check your solution.", open: true, solution: ["Example: 3 points for each basket b plus 5 bonus points → 3b + 5.", "Mara scored 26: 3b + 5 = 26 → 3b = 21 → b = 7.", "Check: 3(7) + 5 = 21 + 5 = 26 ✓"] },
    ] },
  ],
});
