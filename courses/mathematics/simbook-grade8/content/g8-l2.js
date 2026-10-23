/* Math 8 · Lesson 2 · B. Algebraic Expressions as Models – lesson and exercises */
Sim.addContent("lesson2", {
  learn: [
    { t: "h", text: "Expressions as models" },
    { t: "p", text: "A **mathematical model** describes a real situation with mathematics. An **algebraic expression** is a model when its variable stands for a quantity in the situation that can change. One expression then works for every value of that quantity." },
    { t: "defs", items: [
      ["Variable", "a letter that stands for a quantity that can change, such as x, k, or d"],
      ["Constant", "a fixed number, such as the ₱99 registration fee"],
      ["Coefficient", "the number multiplied by a variable, such as 5 in 5d (often a rate: ₱5 per day)"],
      ["Term", "a part of an expression separated by + or −; 99 + 5d has two terms"],
    ] },
    { t: "h", text: "From words to symbols" },
    { t: "table", head: ["Words", "Operation", "Example"], rows: [["sum, more than, increased by, plus", "+", "n increased by 7 → n + 7"], ["difference, less than, decreased by", "−", "4 less than n → n − 4"], ["product, times, twice, of, per (each)", "×", "twice n → 2n"], ["quotient, divided by, shared equally", "÷", "n shared by 3 → n ÷ 3"], ["squared, the square of", "power", "the square of n → n²"]] },
    { t: "p", text: "Be careful with order: “4 less than n” means start with n and take away 4, so it is n − 4, not 4 − n. “Twice the sum of n and 4” is 2(n + 4): the parentheses keep the sum together." },
    { t: "steps", title: "Writing a model", items: ["Name the quantity that changes with a letter (say what it stands for, with units).", "Find the fixed amounts (constants) and the rates (coefficients).", "Join them with the operations the situation describes.", "Test the model with one value you can check by hand."] },
    { t: "h", text: "Modelling a garden" },
    { t: "ex", title: "Perimeter", problem: "A rectangular garden is x m wide and 3 m longer than it is wide. Write an expression for its perimeter.", steps: ["Width = x; length = x + 3", "Perimeter = 2 × width + 2 × length", "= 2x + 2(x + 3)", "= 2x + 2x + 6 = 4x + 6", "Test x = 4: 4(4) + 6 = 22, and 4 + 7 + 4 + 7 = 22 ✓"], answer: "4x + 6 metres." },
    { t: "ex", title: "Area", problem: "Write an expression for the area of the same garden. Find the area when x = 5.", steps: ["Area = width × length = x(x + 3)", "= x² + 3x", "When x = 5: 5² + 3(5) = 25 + 15 = 40"], answer: "x(x + 3) = x² + 3x square metres; 40 m² when x = 5." },
    { t: "h", text: "Modelling costs" },
    { t: "ex", title: "Load plan", problem: "A prepaid plan costs ₱99 to register plus ₱5 per day. Write the total cost for d days, and explain each part.", steps: ["d = the number of days (the variable)", "₱5 for each day → 5d (5 is the coefficient)", "₱99 is paid once → the constant 99", "Total cost: 99 + 5d"], answer: "99 + 5d pesos; for 30 days, 99 + 5(30) = ₱249." },
    { t: "ex", title: "Jeepney fare", problem: "A sample fare is ₱13 for the first 4 km plus ₱1.80 for each additional km. Model the fare for a trip of k additional km.", steps: ["k = additional kilometres after the first 4", "Each additional km costs ₱1.80 → 1.80k", "Add the minimum fare: 13 + 1.80k", "Check k = 5 (a 9-km trip): 13 + 9 = ₱22"], answer: "13 + 1.80k pesos." },
    { t: "h", text: "What does each part mean?" },
    { t: "p", text: "To explain a model, say what every number and letter means in the situation, with units. In 99 + 5d: d is the number of days, 5 is the cost per day in pesos, 5d is the total daily charges, and 99 is the one-time fee." },
    { t: "p", text: "Two different-looking expressions can model the same situation: 2x + 2(x + 3) and 4x + 6 give the same perimeter for every x. They are **equivalent expressions**." },
    { t: "remember", items: ["Always say what the variable stands for, with units.", "Constants are fixed amounts; coefficients are rates (“per”, “each”).", "Watch the order of words with “less than” and “subtracted from”.", "Test a model with a value you can check by hand."] },
  ],
  exercises: [
    { title: "A. Skills Practice", note: "Choose the expression that models each phrase.", items: [
      { q: "seven more than a number n", choices: ["7n", "n + 7", "n − 7", "7 − n"], answer: "n + 7", solution: "“More than” means add: n + 7." },
      { q: "four less than a number n", choices: ["4 − n", "n − 4", "4n", "n ÷ 4"], answer: "n − 4", solution: "Start with n and take away 4." },
      { q: "the product of 6 and a number n", choices: ["6 + n", "n − 6", "6n", "n ÷ 6"], answer: "6n", solution: "Product means multiply." },
      { q: "twice the sum of a number n and 3", choices: ["2n + 3", "2(n + 3)", "2 + n + 3", "n² + 3"], answer: "2(n + 3)", solution: "Find the sum first (parentheses), then double it." },
      { q: "₱1 200 shared equally among n friends", choices: ["1 200n", "n ÷ 1 200", "1 200 ÷ n", "1 200 − n"], answer: "1 200 ÷ n", solution: "Shared equally means divide the total by the number of friends." },
      { q: "the cost of n kilograms of rice at ₱52 per kilogram", choices: ["52 + n", "52n", "n ÷ 52", "52 − n"], answer: "52n", solution: "₱52 for each kilogram: 52 × n." },
      { q: "Evaluate 99 + 5d when d = 12.", num: 159, solution: ["99 + 5(12) = 99 + 60", "= 159"] },
      { q: "Evaluate the garden perimeter 4x + 6 when x = 7.5.", num: 36, unit: "m", solution: "4(7.5) + 6 = 30 + 6 = 36 m." },
    ] },
    { title: "B. Problem Solving", items: [
      { q: "A Grab ride costs ₱45 plus ₱15 per kilometre. Which expression gives the cost of a ride of k km?", choices: ["45k + 15", "45 + 15k", "60k", "15 + k"], answer: "45 + 15k", solution: "₱45 is the fixed amount (constant); ₱15 per km is the coefficient of k." },
      { q: "In the model 250 + 35h for renting a videoke machine for h hours, what does 35 mean?", choices: ["the cost for each hour", "the number of hours", "the fixed rental fee", "the total cost"], answer: "the cost for each hour", solution: "35 multiplies h, so it is the rate in pesos per hour; 250 is the fixed fee." },
      { q: "Mika saves ₱20 each day and already has ₱150. Using the model 150 + 20d, how much will Mika have after 3 weeks?", num: 570, unit: "₱", solution: ["3 weeks = 21 days", "150 + 20(21) = 150 + 420 = ₱570"] },
      { q: "A square garden has side (s + 2) m. Which expression is its perimeter?", choices: ["4s + 2", "4(s + 2)", "s + 8", "(s + 2)²"], answer: "4(s + 2)", solution: "A square has 4 equal sides: 4(s + 2) = 4s + 8. (s + 2)² is the area." },
    ] },
    { title: "C. Challenge", items: [
      { q: "A rectangle’s length is twice its width w, minus 1 cm. Which expression is its area?", choices: ["w(2w − 1)", "2w − 1", "2(w + 2w − 1)", "w + 2w − 1"], answer: "w(2w − 1)", solution: ["Length = 2w − 1", "Area = width × length = w(2w − 1) = 2w² − w"] },
      { q: "Write your own situation (in pesos) that the expression 60 + 25n models. Explain what 60, 25, and n mean.", open: true, solution: ["Example: a tricycle ride costs ₱60 for the first kilometre plus ₱25 for each additional kilometre.", "n = the number of additional kilometres (the variable).", "25 = the cost per additional km (the coefficient); 60 = the fixed starting fare (the constant)."] },
    ] },
  ],
});
