/* Term 3 · Lesson 4 · D. Variables, Constants, and Algebraic Expressions – lesson and exercises */
Sim.addContent("lesson22", {
  learn: [
    { t: "h", text: "Variables and constants" },
    { t: "p", text: "In algebra we use letters to stand for numbers. A letter can stand for a number we do not know yet, or for any number at all." },
    { t: "defs", items: [
      ["Variable", "a letter or symbol that can stand for many values, such as x, n, or k"],
      ["Constant", "a quantity whose value never changes, such as 5, −7, or π"],
      ["Algebraic expression", "numbers and variables joined by operations, such as 3x + 5 or 4ab − 7"],
    ] },
    { t: "rule", title: "Variable or constant?", text: ["A variable can take many values; a constant stays fixed.", "π is a letter, but it names one fixed number (≈ 3.14), so π is a constant."] },
    { t: "h", text: "Terms and coefficients" },
    { t: "defs", items: [
      ["Term", "a number, a variable, or a product of them; terms are separated by + or −"],
      ["Numerical coefficient", "the number multiplied by the variable(s) in a term: 3 in 3x, −2 in −2y"],
      ["Constant term", "a term with no variable: 5 in 3x + 5"],
    ] },
    { t: "table", head: ["Expression", "Terms", "Coefficient(s)", "Constant term"], rows: [
      ["3x + 5", "3x, 5", "3", "5"],
      ["4ab − 7", "4ab, −7", "4", "−7"],
      ["5y − 2x + 8", "5y, −2x, 8", "5, −2", "8"],
      ["12 − m", "12, −m", "−1", "12"],
      ["2πr", "2πr", "2π", "none"],
    ] },
    { t: "h", text: "Evaluating algebraic expressions" },
    { t: "steps", title: "To evaluate an expression", items: ["Replace each variable with its given value, in parentheses.", "Simplify using the order of operations (powers, then × and ÷, then + and −)."] },
    { t: "ex", title: "One variable", problem: "Evaluate 3x + 5 when x = −4.", steps: ["Substitute: 3(−4) + 5", "Multiply: −12 + 5", "Add: −7"], answer: "−7." },
    { t: "ex", title: "Two variables", problem: "Evaluate x² + 2y when x = −3 and y = 2.", steps: ["Substitute: (−3)² + 2(2)", "Power first: 9 + 2(2)", "Multiply, then add: 9 + 4 = 13"], answer: "13." },
    { t: "ex", title: "Jeepney fare", problem: "A jeepney fare is 13 + 2k pesos (sample rates), where k is the number of kilometres beyond the first 4 km. Find the fare for a 10-km ride.", steps: ["Extra kilometres: k = 10 − 4 = 6", "Substitute: 13 + 2(6)", "Simplify: 13 + 12 = 25"], answer: "₱25." },
    { t: "h", text: "Translating verbal phrases" },
    { t: "table", head: ["Operation", "Key words", "Example"], rows: [
      ["+", "sum, more than, increased by, added to", "5 more than a number → n + 5"],
      ["−", "difference, less than, decreased by, subtracted from", "3 less than a number → n − 3"],
      ["×", "product, times, twice, multiplied by", "twice a number → 2n"],
      ["÷", "quotient, divided by, half of", "the quotient of n and 4 → n ÷ 4"],
    ] },
    { t: "rule", title: "Watch the order", text: ["“3 less than a number” is n − 3, not 3 − n.", "“4 subtracted from a number” is n − 4."] },
    { t: "ex", title: "Two operations", problem: "Translate: twice a number decreased by 3; twice the sum of a number and 3.", steps: ["“twice a number” is 2n; then decrease by 3: 2n − 3", "“the sum of a number and 3” is n + 3; then double it: 2(n + 3)"], answer: "2n − 3 and 2(n + 3)." },
    { t: "remember", items: ["A variable can take many values; a constant stays fixed.", "To evaluate, substitute in parentheses, then follow the order of operations.", "Key words name the operation; “less than” and “subtracted from” reverse the order."] },
  ],
  exercises: [
    { title: "A. Skills Practice", items: [
      { q: "In 7m + 2, which part is the variable?", choices: ["7", "m", "2", "7m"], answer: "m", solution: "m is the letter that can take many values." },
      { q: "In 2πr, which part is a constant other than 2?", choices: ["r", "π", "2πr", "none"], answer: "π", solution: "π ≈ 3.14 is a fixed number, so it is a constant." },
      { q: "What is the numerical coefficient of y in 5y − 2x + 8?", num: 5, solution: "The number multiplied by y is 5." },
      { q: "What is the constant term of 4ab − 7?", num: -7, solution: "The term with no variable is −7." },
      { q: "Evaluate 3x + 5 when x = 4.", num: 17, solution: ["3(4) + 5", "= 12 + 5 = 17"] },
      { q: "Evaluate 2a − b when a = −3 and b = 5.", num: -11, solution: ["2(−3) − 5", "= −6 − 5 = −11"] },
      { q: "Evaluate x² − 3x when x = −2.", num: 10, solution: ["(−2)² − 3(−2)", "= 4 + 6 = 10"] },
      { q: "Which expression means “5 more than a number”?", choices: ["5n", "n + 5", "n − 5", "5 − n"], answer: "n + 5", solution: "“more than” means add: n + 5." },
    ] },
    { title: "B. Problem Solving", items: [
      { q: "A jeepney fare is 13 + 2k pesos, where k is the number of kilometres beyond the first 4 km. How much is the fare for a 9-km ride?", num: 23, unit: "₱", solution: ["k = 9 − 4 = 5", "13 + 2(5) = 13 + 10 = ₱23"] },
      { q: "Which expression means “twice a number decreased by 3”?", choices: ["2(n − 3)", "2n − 3", "3 − 2n", "2 + n − 3"], answer: "2n − 3", solution: "Twice a number is 2n; decreased by 3 gives 2n − 3." },
      { q: "A canteen sells siomai at ₱8 each. The expression 8s + 15 gives the cost of s siomai and a ₱15 drink. Find the cost when s = 6.", num: 63, unit: "₱", solution: ["8(6) + 15", "= 48 + 15 = ₱63"] },
      { q: "Which expression means “the quotient of n and 4”?", choices: ["4 ÷ n", "n ÷ 4", "4n", "n − 4"], answer: "n ÷ 4", solution: "“The quotient of n and 4” is n divided by 4." },
    ] },
    { title: "C. Challenge", items: [
      { q: "Evaluate 4xy − 7 when x = −2 and y = 3.", num: -31, solution: ["4(−2)(3) − 7", "= −24 − 7 = −31"] },
      { q: "Explain why x is called a variable in 3x + 5 but 5 is called a constant. Use two different values of x in your answer.", open: true, solution: ["x can take many values: when x = 1, 3x + 5 = 8; when x = 2, 3x + 5 = 11.", "The 5 is added every time and never changes, so it is a constant."] },
    ] },
  ],
});
