/* Term 3 · Lesson 2 · B. Multiplying and Dividing Integers; Order of Operations – lesson and exercises */
Sim.addContent("lesson20", {
  learn: [
    { t: "h", text: "Multiplying integers" },
    { t: "p", text: "Multiplication is repeated addition. 3 × (−2) means 3 groups of −2: (−2) + (−2) + (−2) = −6. A negative multiplier means the **opposite**: −3 × (−2) means “remove 3 groups of −2”, which leaves +6." },
    { t: "table", head: ["Product", "Change", "Pattern"], rows: [["3 × (−2) = −6", "", "start"], ["2 × (−2) = −4", "+2", "first factor down by 1"], ["1 × (−2) = −2", "+2", "product up by 2"], ["0 × (−2) = 0", "+2", "zero"], ["−1 × (−2) = 2", "+2", "now positive!"], ["−2 × (−2) = 4", "+2", "negative × negative"]] },
    { t: "rule", title: "Signs in multiplication", text: ["**Same signs** → the product is **positive**: (+)(+) = +, (−)(−) = +", "**Different signs** → the product is **negative**: (+)(−) = −, (−)(+) = −", "Any integer times 0 is 0."] },
    { t: "ex", title: "Groups of chips", problem: "Find 4 × (−3) and −4 × (−3).", steps: ["4 × (−3): 4 groups of 3 negative chips → 12 negative chips → −12.", "−4 × (−3): start with 12 zero pairs, then remove 4 groups of 3 negative chips.", "12 positive chips are left → +12."], answer: "4 × (−3) = −12 and −4 × (−3) = 12." },
    { t: "ex", title: "Using the rule", problem: "Find (−7)(8) and (−9)(−6).", steps: ["Different signs: 7 × 8 = 56 → −56.", "Same signs: 9 × 6 = 54 → +54."], answer: "−56 and 54." },

    { t: "h", text: "Dividing integers" },
    { t: "p", text: "Division undoes multiplication. Since (−4) × 3 = −12, we know −12 ÷ 3 = −4 and −12 ÷ (−4) = 3. So division follows the same sign rules." },
    { t: "rule", title: "Signs in division", text: ["**Same signs** → the quotient is **positive**.", "**Different signs** → the quotient is **negative**.", "0 ÷ (nonzero integer) = 0. Division by 0 is **not defined**."] },
    { t: "ex", title: "Quotients", problem: "Find −72 ÷ 9 and −45 ÷ (−5).", steps: ["Different signs: 72 ÷ 9 = 8 → −8.", "Same signs: 45 ÷ 5 = 9 → +9.", "Check: 9 × (−8) = −72 and (−5) × 9 = −45."], answer: "−8 and 9." },
    { t: "ex", title: "More than two factors", problem: "Find (−2) × (−3) × (−5) and (−2)⁴.", steps: ["(−2) × (−3) = 6; 6 × (−5) = −30.", "(−2)⁴ = (−2)(−2)(−2)(−2) = 4 × 4 = 16.", "An odd number of negative factors gives a negative product; an even number gives a positive product."], answer: "−30 and 16." },

    { t: "h", text: "Number properties" },
    { t: "defs", items: [
      ["Commutative", "order does not matter: a + b = b + a and a × b = b × a. Example: −3 × 5 = 5 × (−3)"],
      ["Associative", "grouping does not matter: (a + b) + c = a + (b + c) and (ab)c = a(bc)"],
      ["Distributive", "a × (b + c) = a × b + a × c. Example: −4 × (3 + 5) = −12 + (−20) = −32"],
    ] },
    { t: "h", text: "Identity and inverse properties" },
    { t: "defs", items: [
      ["Identity", "a + 0 = a and a × 1 = a. Example: −9 + 0 = −9, −9 × 1 = −9"],
      ["Additive inverse", "a + (−a) = 0. Example: −7 + 7 = 0"],
      ["Multiplicative inverse", "a × (1/a) = 1 for a ≠ 0. Example: −5 × (−1/5) = 1"],
    ] },
    { t: "ex", title: "Using properties for mental math", problem: "Find −6 × 98 and 25 × (−7) × 4.", steps: ["Distributive: −6 × (100 − 2) = −600 + 12 = −588.", "Commutative and associative: (25 × 4) × (−7) = 100 × (−7) = −700."], answer: "−588 and −700." },

    { t: "h", text: "Order of operations (GEMDAS)" },
    { t: "steps", title: "Simplify an expression in this order:", items: [
      "**G**roupings – work inside parentheses and other grouping symbols first.",
      "**E**xponents.",
      "**M**ultiplication and **D**ivision, from left to right.",
      "**A**ddition and **S**ubtraction, from left to right.",
    ] },
    { t: "ex", title: "Multiply before adding", problem: "Simplify 6 + 4 × (−3).", steps: ["Multiply first: 4 × (−3) = −12.", "Then add: 6 + (−12) = −6."], answer: "−6 (not 30, which comes from adding first)." },
    { t: "ex", title: "Groupings first", problem: "Simplify (−8 + 2) × 3 − 5.", steps: ["Groupings: −8 + 2 = −6.", "Multiply: −6 × 3 = −18.", "Subtract: −18 − 5 = −23."], answer: "−23." },
    { t: "ex", title: "Exponents", problem: "Simplify (−2)³ + 18 ÷ (−3)².", steps: ["Exponents: (−2)³ = −8 and (−3)² = 9.", "Divide: 18 ÷ 9 = 2.", "Add: −8 + 2 = −6."], answer: "−6." },
    { t: "ex", title: "Left to right", problem: "Simplify 48 ÷ (−6) ÷ 2 × (−3).", steps: ["Divide and multiply from left to right.", "48 ÷ (−6) = −8; −8 ÷ 2 = −4.", "−4 × (−3) = 12."], answer: "12." },
    { t: "remember", items: ["Same signs → positive; different signs → negative (for × and ÷).", "The pattern 3 × (−2), 2 × (−2), 1 × (−2), … rises by 2 each step, so (−1) × (−2) = 2.", "Division by 0 is not defined.", "GEMDAS: groupings, exponents, × and ÷ left to right, + and − left to right."] },
  ],
  exercises: [
    { title: "A. Skills Practice", note: "Simplify.", items: [
      { q: "(−7) × 6", num: -42, solution: "Different signs: 7 × 6 = 42 → −42." },
      { q: "(−8) × (−9)", num: 72, solution: "Same signs: 8 × 9 = 72 → +72." },
      { q: "−56 ÷ 7", num: -8, solution: "Different signs: 56 ÷ 7 = 8 → −8." },
      { q: "−81 ÷ (−9)", num: 9, solution: "Same signs: 81 ÷ 9 = 9 → +9." },
      { q: "(−2) × (−3) × (−5)", num: -30, solution: ["(−2) × (−3) = 6", "6 × (−5) = −30 (three negative factors → negative)"] },
      { q: "10 − 4 × (−3)", num: 22, solution: ["Multiply first: 4 × (−3) = −12.", "10 − (−12) = 10 + 12 = 22."] },
      { q: "(−3)² − 12 ÷ (−4)", num: 12, solution: ["Exponent: (−3)² = 9.", "Divide: 12 ÷ (−4) = −3.", "9 − (−3) = 12."] },
      { q: "Which property is shown? −5 × (2 + 8) = −5 × 2 + (−5) × 8", choices: ["Commutative", "Associative", "Distributive", "Identity", "Inverse"], answer: "Distributive", solution: "The factor −5 is distributed to each addend." },
    ] },
    { title: "B. Problem Solving", items: [
      { q: "During a cold night in Baguio, the temperature drops 2 °C every hour for 6 hours. What integer describes the total change in temperature?", num: -12, unit: "°C", solution: "6 × (−2) = −12 °C." },
      { q: "A class owes ₱1 200 for Family Day supplies. The debt is shared equally by 8 officers. What integer describes each officer’s share of the debt?", num: -150, unit: "₱", solution: "−1 200 ÷ 8 = −150: each officer owes ₱150." },
      { q: "In a quiz bee, a correct answer earns 3 points and a wrong answer costs 1 point. Mika has 12 correct and 5 wrong answers. What is Mika’s score?", num: 31, solution: ["12 × 3 + 5 × (−1)", "= 36 + (−5) = 31"] },
      { q: "Use the distributive property to find −7 × 102.", num: -714, solution: ["−7 × (100 + 2) = −7 × 100 + (−7) × 2", "= −700 + (−14) = −714"] },
    ] },
    { title: "C. Challenge", items: [
      { q: "Simplify (−4 × 3 − (−20)) ÷ (−2)².", num: 2, solution: ["Inside the parentheses, multiply first: −4 × 3 = −12; then −12 − (−20) = 8.", "Exponent: (−2)² = 4.", "8 ÷ 4 = 2."] },
      { q: "Use a pattern to explain why (−2) × (−5) = 10.", open: true, solution: ["2 × (−5) = −10, 1 × (−5) = −5, 0 × (−5) = 0.", "Each time the first factor goes down by 1, the product goes up by 5.", "So (−1) × (−5) = 5 and (−2) × (−5) = 10."] },
    ] },
  ],
});
