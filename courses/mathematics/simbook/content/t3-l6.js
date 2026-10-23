/* Term 3 · Lesson 6 · F. Formulas: Solving for a Variable – lesson and exercises */
Sim.addContent("lesson24", {
  learn: [
    { t: "h", text: "What is a formula?" },
    { t: "p", text: "A **formula** is an equation that shows how two or more variables are related. Each letter stands for a quantity that can take many values." },
    { t: "table", head: ["Formula", "Meaning"], rows: [
      ["P = 2l + 2w", "perimeter of a rectangle"],
      ["A = lw", "area of a rectangle"],
      ["d = rt", "distance = rate × time"],
      ["V = lwh", "volume of a rectangular prism"],
      ["I = Prt", "simple interest = principal × rate × time"],
      ["C = 2πr", "circumference of a circle"],
    ] },
    { t: "p", text: "The variable alone on one side is the **subject** of the formula. In d = rt, the subject is d." },
    { t: "h", text: "Solving a formula for a variable" },
    { t: "steps", title: "To make another variable the subject", items: [
      "Circle the variable you want alone.",
      "Undo the operations around it in reverse order: first + and −, then × and ÷.",
      "Do the same thing to both sides each time, and name the property of equality.",
      "Check by substituting numbers.",
    ] },
    { t: "ex", title: "One step", problem: "Solve d = rt for t.", steps: ["t is multiplied by r.", "Divide both sides by r: d ÷ r = rt ÷ r (Division Property of Equality)", "d ÷ r = t", "t = d ÷ r (Symmetric Property of Equality)"], answer: "t = d ÷ r." },
    { t: "ex", title: "Two steps", problem: "Solve P = 2l + 2w for l.", steps: ["Subtract 2w from both sides: P − 2w = 2l (Subtraction Property)", "Divide both sides by 2: (P − 2w) ÷ 2 = l (Division Property)", "l = (P − 2w) ÷ 2 (Symmetric Property)"], answer: "l = (P − 2w) ÷ 2." },
    { t: "ex", title: "Temperature", problem: "Solve F = (9/5)C + 32 for C.", steps: ["Subtract 32 from both sides: F − 32 = (9/5)C", "Multiply both sides by 5/9, the reciprocal of 9/5: (5/9)(F − 32) = C", "C = (5/9)(F − 32)"], answer: "C = (5/9)(F − 32)." },
    { t: "h", text: "Checking a rearranged formula" },
    { t: "rule", title: "Check by substituting", text: ["Choose numbers that fit the original formula.", "Substitute them into the new formula. It must give back the same value."] },
    { t: "ex", title: "Check t = d ÷ r", problem: "A bus travels 150 km at 60 km/h. Find the time and check it.", steps: ["t = d ÷ r = 150 ÷ 60 = 2.5", "Check in the original formula d = rt: 60 × 2.5 = 150 ✓"], answer: "2.5 hours." },
    { t: "ex", title: "Check l = (P − 2w) ÷ 2", problem: "A rectangle has perimeter 30 m and width 5 m. Find the length and check it.", steps: ["l = (30 − 2 × 5) ÷ 2 = 20 ÷ 2 = 10", "Check: 2(10) + 2(5) = 20 + 10 = 30 ✓"], answer: "10 m." },
    { t: "remember", items: ["To solve a formula for a variable, undo the operations around it in reverse order.", "Do the same thing to both sides each time.", "Check: substitute numbers into the original formula and the new one."] },
  ],
  exercises: [
    { title: "A. Skills Practice", note: "Choose the formula solved for the given variable.", items: [
      { q: "Solve A = lw for l.", choices: ["l = A ÷ w", "l = Aw", "l = w ÷ A", "l = A − w"], answer: "l = A ÷ w", solution: "Divide both sides by w." },
      { q: "Solve d = rt for r.", choices: ["r = dt", "r = d ÷ t", "r = t ÷ d", "r = d − t"], answer: "r = d ÷ t", solution: "Divide both sides by t." },
      { q: "Solve V = lwh for h.", choices: ["h = V ÷ (lw)", "h = Vlw", "h = V − lw", "h = lw ÷ V"], answer: "h = V ÷ (lw)", solution: "Divide both sides by lw." },
      { q: "Solve I = Prt for t.", choices: ["t = I ÷ (Pr)", "t = IPr", "t = Pr ÷ I", "t = I − Pr"], answer: "t = I ÷ (Pr)", solution: "Divide both sides by Pr." },
      { q: "Solve C = 2πr for r.", choices: ["r = C ÷ (2π)", "r = 2πC", "r = C − 2π", "r = 2π ÷ C"], answer: "r = C ÷ (2π)", solution: "Divide both sides by 2π." },
      { q: "Solve P = 2l + 2w for w.", choices: ["w = (P − 2l) ÷ 2", "w = P − 2l", "w = (P + 2l) ÷ 2", "w = P ÷ 2 − 2l"], answer: "w = (P − 2l) ÷ 2", solution: ["Subtract 2l from both sides: P − 2l = 2w", "Divide both sides by 2: w = (P − 2l) ÷ 2"] },
      { q: "Solve y = x + 7 for x.", choices: ["x = y + 7", "x = y − 7", "x = 7 − y", "x = 7y"], answer: "x = y − 7", solution: "Subtract 7 from both sides." },
      { q: "Solve F = (9/5)C + 32 for C.", choices: ["C = (5/9)(F − 32)", "C = (9/5)(F − 32)", "C = (5/9)F − 32", "C = F − 32 ÷ (9/5)"], answer: "C = (5/9)(F − 32)", solution: ["Subtract 32: F − 32 = (9/5)C", "Multiply by 5/9: C = (5/9)(F − 32)"] },
    ] },
    { title: "B. Problem Solving", items: [
      { q: "How long does a 150-km trip take at 60 km/h?", num: 2.5, unit: "h", solution: ["t = d ÷ r", "t = 150 ÷ 60 = 2.5 h", "Check: 60 × 2.5 = 150 ✓"] },
      { q: "A rectangular garden has an area of 48 m² and a length of 8 m. Find its width.", num: 6, unit: "m", solution: ["w = A ÷ l = 48 ÷ 8 = 6 m", "Check: 8 × 6 = 48 ✓"] },
      { q: "A rectangle has a perimeter of 36 cm and a width of 7 cm. Find its length.", num: 11, unit: "cm", solution: ["l = (P − 2w) ÷ 2 = (36 − 14) ÷ 2 = 11 cm", "Check: 2(11) + 2(7) = 36 ✓"] },
      { q: "One morning Baguio is 59 °F. What is the temperature in °C?", num: 15, unit: "°C", solution: ["C = (5/9)(F − 32) = (5/9)(27)", "= 15 °C"] },
    ] },
    { title: "C. Challenge", items: [
      { q: "Ana deposits ₱5 000 at a simple interest rate of 4% per year (r = 0.04) and earns ₱600 interest. For how many years was the money deposited? Use t = I ÷ (Pr).", num: 3, unit: "years", solution: ["t = 600 ÷ (5 000 × 0.04)", "= 600 ÷ 200 = 3 years", "Check: 5 000 × 0.04 × 3 = 600 ✓"] },
      { q: "Kai solved A = lw for w and wrote w = A − l. Show, by substituting numbers, that this is wrong, and give the correct formula.", open: true, solution: ["Take l = 4 and w = 3, so A = 12.", "Kai’s formula gives w = 12 − 4 = 8, not 3, so it is wrong.", "The correct formula is w = A ÷ l: 12 ÷ 4 = 3 ✓"] },
    ] },
  ],
});
