/* Term 3 · Lesson 5 · E. Bar Models and the Properties of Equality – lesson and exercises */
Sim.addContent("lesson23", {
  learn: [
    { t: "h", text: "Equations and bar models" },
    { t: "p", text: "An **equation** is a statement that two expressions are equal, such as x + 4 = 11. A **solution** is a value of the variable that makes the equation true." },
    { t: "defs", items: [
      ["Equation", "a mathematical sentence with an equal sign: x + 4 = 11"],
      ["Bar model", "a drawing of equal-length bars: the whole on top, the parts below"],
      ["Solution", "the value of the unknown that makes both sides equal"],
    ] },
    { t: "ex", title: "Part–whole bar", problem: "A bar of 11 is made of a part x and a part 4. Find x.", steps: ["Equation: x + 4 = 11", "The part x is the whole minus the known part: x = 11 − 4", "x = 7"], answer: "x = 7." },
    { t: "ex", title: "Equal parts", problem: "Three equal parts x make a bar of 18. Find x.", steps: ["Equation: 3x = 18", "Split the whole into 3 equal parts: x = 18 ÷ 3", "x = 6"], answer: "x = 6." },
    { t: "ex", title: "Equal parts and a known part", problem: "Two equal parts x and a part 3 make a bar of 13. Find x.", steps: ["Equation: 2x + 3 = 13", "Take away the known part: 2x = 13 − 3 = 10", "Split into 2 equal parts: x = 10 ÷ 2 = 5"], answer: "x = 5." },
    { t: "h", text: "Properties of equality" },
    { t: "p", text: "These properties are always true for any numbers a, b, and c." },
    { t: "table", head: ["Property", "In symbols", "Example"], rows: [
      ["Reflexive", "a = a", "7 = 7"],
      ["Symmetric", "If a = b, then b = a.", "If x = 5, then 5 = x."],
      ["Transitive", "If a = b and b = c, then a = c.", "If y = 2 + 3 and 2 + 3 = 5, then y = 5."],
      ["Substitution", "If a = b, b may replace a.", "If x = 4 and y = x + 1, then y = 4 + 1."],
    ] },
    { t: "h", text: "The operation properties" },
    { t: "table", head: ["Property", "If a = b, then …", "Example"], rows: [
      ["Addition", "a + c = b + c", "x − 3 = 8 → x − 3 + 3 = 8 + 3"],
      ["Subtraction", "a − c = b − c", "x + 4 = 11 → x + 4 − 4 = 11 − 4"],
      ["Multiplication", "a × c = b × c", "x ÷ 2 = 6 → (x ÷ 2) × 2 = 6 × 2"],
      ["Division", "a ÷ c = b ÷ c (c ≠ 0)", "3x = 18 → 3x ÷ 3 = 18 ÷ 3"],
    ] },
    { t: "rule", title: "The balance rule", text: ["Whatever you do to one side of an equation, do to the other side.", "Never divide by 0."] },
    { t: "h", text: "Justifying each step" },
    { t: "ex", title: "Solve and justify", problem: "Solve 2x + 3 = 9. Name the property used in each step.", steps: ["2x + 3 − 3 = 9 − 3 (Subtraction Property of Equality)", "2x = 6", "2x ÷ 2 = 6 ÷ 2 (Division Property of Equality)", "x = 3", "Check: 2(3) + 3 = 9 ✓"], answer: "x = 3." },
    { t: "ex", title: "Solve and justify", problem: "Solve x ÷ 4 − 2 = 3.", steps: ["x ÷ 4 − 2 + 2 = 3 + 2 (Addition Property of Equality)", "x ÷ 4 = 5", "(x ÷ 4) × 4 = 5 × 4 (Multiplication Property of Equality)", "x = 20", "Check: 20 ÷ 4 − 2 = 5 − 2 = 3 ✓"], answer: "x = 20." },
    { t: "remember", items: ["An equation is a balanced scale: both sides have the same value.", "Add, subtract, multiply, or divide both sides by the same number (not 0) to keep it balanced.", "Name the property you use at every step, then check by substituting."] },
  ],
  exercises: [
    { title: "A. Skills Practice", items: [
      { q: "A bar model shows x + 4 = 11. What is x?", num: 7, solution: "x = 11 − 4 = 7." },
      { q: "A bar of 18 is split into 3 equal parts x. What is x?", num: 6, solution: "3x = 18, so x = 18 ÷ 3 = 6." },
      { q: "A bar model shows 2x + 5 = 17. What is x?", num: 6, solution: ["2x = 17 − 5 = 12", "x = 12 ÷ 2 = 6"] },
      { q: "Which property is shown: 15 = 15?", choices: ["Reflexive", "Symmetric", "Transitive", "Substitution"], answer: "Reflexive", solution: "A quantity equals itself." },
      { q: "Which property is shown: If x = 9, then 9 = x?", choices: ["Reflexive", "Symmetric", "Transitive", "Substitution"], answer: "Symmetric", solution: "The sides of the equation are swapped." },
      { q: "Which property is shown: If a = b and b = 12, then a = 12?", choices: ["Reflexive", "Symmetric", "Transitive", "Substitution"], answer: "Transitive", solution: "a = b and b = 12 lead to a = 12." },
      { q: "Which property is used: If x + 6 = 14, then x + 6 − 6 = 14 − 6?", choices: ["Addition", "Subtraction", "Multiplication", "Division"], answer: "Subtraction", solution: "6 is subtracted from both sides." },
      { q: "Which property is used: If 5x = 35, then 5x ÷ 5 = 35 ÷ 5?", choices: ["Addition", "Subtraction", "Multiplication", "Division"], answer: "Division", solution: "Both sides are divided by 5." },
    ] },
    { title: "B. Problem Solving", items: [
      { q: "Four equal bottles hold 28 glasses of calamansi juice in all. Draw a bar model and find how many glasses one bottle holds.", num: 7, unit: "glasses", solution: ["4x = 28", "x = 28 ÷ 4 = 7"] },
      { q: "Bea had some pandesal and bought 9 more. Bea now has 15. How many pandesal were there at first?", num: 6, solution: ["x + 9 = 15", "x = 15 − 9 = 6 (Subtraction Property of Equality)"] },
      { q: "If x = 4 and y = x + 7, then y = 4 + 7. Which property allows this?", choices: ["Substitution", "Symmetric", "Reflexive", "Addition"], answer: "Substitution", solution: "x is replaced by the equal value 4." },
      { q: "To solve x ÷ 3 = 8, which property do you use first?", choices: ["Addition", "Subtraction", "Multiplication", "Division"], answer: "Multiplication", solution: "Multiply both sides by 3: x = 24." },
    ] },
    { title: "C. Challenge", items: [
      { q: "Solve 3x + 2 = x + 10. (Hint: subtract x from both sides first.)", num: 4, solution: ["3x + 2 − x = x + 10 − x → 2x + 2 = 10 (Subtraction Property)", "2x = 8 (Subtraction Property)", "x = 4 (Division Property)", "Check: 3(4) + 2 = 14 and 4 + 10 = 14 ✓"] },
      { q: "Solve 4x − 5 = 11. Write each step and the property of equality that justifies it.", open: true, solution: ["4x − 5 + 5 = 11 + 5 (Addition Property of Equality) → 4x = 16", "4x ÷ 4 = 16 ÷ 4 (Division Property of Equality) → x = 4", "Check: 4(4) − 5 = 16 − 5 = 11 ✓"] },
    ] },
  ],
});
