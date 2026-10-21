/* Term 2 · Lesson 5 · E. Subsets of Real Numbers – lesson and exercises */
Sim.addContent("lesson14", {
  learn: [
    { t: "h", text: "The family of real numbers" },
    { t: "defs", items: [
      ["Natural numbers ℕ", "the counting numbers {1, 2, 3, …}"],
      ["Whole numbers W", "the natural numbers and zero {0, 1, 2, 3, …}"],
      ["Integers ℤ", "the whole numbers and their opposites {…, −2, −1, 0, 1, 2, …}"],
      ["Rational numbers ℚ", "numbers that can be written as a/b, b ≠ 0: fractions, terminating and repeating decimals, and all integers"],
      ["Irrational numbers", "real numbers that cannot be written as a fraction; their decimals never end and never repeat (√2, π)"],
      ["Real numbers ℝ", "all rational and irrational numbers together"],
    ] },
    { t: "rule", title: "How the sets fit together", text: ["ℕ ⊆ W ⊆ ℤ ⊆ ℚ ⊆ ℝ", "rational numbers + irrational numbers = real numbers"] },
    { t: "ex", title: "Classifying numbers", problem: "Classify √16, −3, 0.25, and √2.", steps: ["√16 = 4 → natural, whole, integer, rational, real", "−3 → integer, rational, real", "0.25 = 1/4 → rational, real", "√2 = 1.41421… (never ends or repeats) → irrational, real"], answer: "as listed." },
    { t: "table", head: ["Number", "ℕ", "W", "ℤ", "ℚ", "Irrational", "ℝ"], rows: [["7", "✓", "✓", "✓", "✓", "", "✓"], ["0", "", "✓", "✓", "✓", "", "✓"], ["−5", "", "", "✓", "✓", "", "✓"], ["2/3", "", "", "", "✓", "", "✓"], ["π", "", "", "", "", "✓", "✓"]] },
    { t: "remember", items: ["Every natural number is whole, every whole number is an integer, every integer is rational.", "A real number is either rational or irrational – never both.", "Simplify first: √25 = 5 is natural, not irrational."] },
  ],
  exercises: [
    { title: "A. Skills Practice", note: "Choose the SMALLEST set that contains the number.", items: [
      { q: "0", choices: ["Natural", "Whole", "Integer", "Rational", "Irrational"], answer: "Whole", solution: "0 is whole but not natural." },
      { q: "−8", choices: ["Natural", "Whole", "Integer", "Rational", "Irrational"], answer: "Integer", solution: "−8 is the opposite of a whole number." },
      { q: "5/9", choices: ["Natural", "Whole", "Integer", "Rational", "Irrational"], answer: "Rational", solution: "5/9 is a fraction of integers, not an integer." },
      { q: "√7", choices: ["Natural", "Whole", "Integer", "Rational", "Irrational"], answer: "Irrational", solution: "7 is not a perfect square, so √7 is irrational." },
      { q: "√25", choices: ["Natural", "Whole", "Integer", "Rational", "Irrational"], answer: "Natural", solution: "√25 = 5, a counting number." },
      { q: "−2.75", choices: ["Natural", "Whole", "Integer", "Rational", "Irrational"], answer: "Rational", solution: "−2.75 = −11/4, a fraction." },
      { q: "True or false: every whole number is an integer.", choices: ["True", "False"], answer: "True", solution: "The integers include all whole numbers." },
      { q: "True or false: every rational number is an integer.", choices: ["True", "False"], answer: "False", solution: "1/2 is rational but not an integer." },
    ] },
    { title: "B. Problem Solving", items: [
      { q: "How many of these are rational: −2, 0, 3/4, √2, 5, π?", num: 4, solution: "−2, 0, 3/4, and 5 are rational; √2 and π are irrational." },
      { q: "How many of the same numbers are integers?", num: 3, solution: "−2, 0, and 5." },
      { q: "Which number is irrational?", choices: ["0.75", "√36", "√20", "−4"], answer: "√20", solution: "20 is not a perfect square; √36 = 6." },
      { q: "Which number between 1 and 2 is irrational?", choices: ["√2", "1.5", "3/2", "1.25"], answer: "√2", solution: "The others are terminating decimals or fractions." },
    ] },
    { title: "C. Challenge", items: [
      { q: "True or false: 0.333… is irrational because it never ends.", choices: ["True", "False"], answer: "False", solution: "0.333… repeats, and it equals 1/3, so it is rational." },
      { q: "Explain why every integer is also a rational number.", open: true, solution: ["Any integer n can be written as the fraction n/1.", "So it fits the definition of a rational number."] },
    ] },
  ],
});
