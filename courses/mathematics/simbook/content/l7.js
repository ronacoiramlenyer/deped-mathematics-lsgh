/* Lesson 7 · G. Rational Numbers – lesson and exercises */
Sim.addContent("lesson7", {
  learn: [
    { t: "h", text: "What is a rational number?" },
    { t: "p", text: "A **rational number** is a number that can be written as a fraction a/b, where a and b are integers and b ≠ 0. Fractions, terminating decimals, repeating decimals, and percentages all name rational numbers. (This term we work with zero and positive rational numbers; negative numbers come with integers in Term 2.)" },
    { t: "h", text: "Changing from one form to another" },
    { t: "rule", title: "Conversions", text: ["fraction → decimal: divide the numerator by the denominator", "decimal → percent: multiply by 100 (move the point two places right)", "percent → fraction: write over 100, then simplify", "decimal → fraction: write over 10, 100, 1 000, … then simplify"] },
    { t: "ex", title: "Fraction to decimal and percent", problem: "Write 3/8 as a decimal and as a percent.", steps: ["3 ÷ 8 = 0.375", "0.375 × 100% = 37.5%"], answer: "0.375 = 37.5%." },
    { t: "ex", title: "Decimal to fraction", problem: "Write 0.45 as a fraction in lowest terms.", steps: ["0.45 = 45/100", "Divide both by 5: 9/20"], answer: "9/20." },
    { t: "ex", title: "Percent to fraction", problem: "Write 125% as a fraction and as a mixed number.", steps: ["125% = 125/100", "Divide both by 25: 5/4", "5/4 = 1 1/4"], answer: "5/4 = 1 1/4." },
    { t: "h", text: "Terminating and repeating decimals" },
    { t: "p", text: "Dividing gives either a decimal that **ends** (terminating) or one whose digits **repeat** forever. 2/3 = 0.666… is written 0.6 with a bar over the 6." },
    { t: "rule", title: "How to tell", text: "A fraction in lowest terms terminates only when its denominator has no prime factors other than 2 and 5. Otherwise the decimal repeats." },
    { t: "ex", title: "Terminating or repeating?", problem: "Will 7/20 and 5/12 give terminating or repeating decimals?", steps: ["20 = 2 × 2 × 5 → only 2s and 5s → 7/20 = 0.35 terminates.", "12 = 2 × 2 × 3 → has a 3 → 5/12 = 0.41666… repeats."], answer: "7/20 terminates; 5/12 repeats." },
    { t: "h", text: "Ordering rational numbers" },
    { t: "steps", title: "To order numbers written in different forms:", items: ["Change every number to a decimal.", "Compare the decimals place by place.", "Write the numbers in order, using their original forms."] },
    { t: "ex", title: "Ordering", problem: "Arrange from least to greatest: 3/4, 0.7, 72%, 2/3.", steps: ["3/4 = 0.75; 0.7 = 0.70; 72% = 0.72; 2/3 ≈ 0.667", "0.667 < 0.70 < 0.72 < 0.75"], answer: "2/3, 0.7, 72%, 3/4." },
    { t: "p", text: "Between any two rational numbers there is always another one – for example, their average." },
    { t: "remember", items: ["Fraction, decimal, and percent are three ways to write the same number.", "Only 2s and 5s in the denominator → the decimal ends.", "Change to decimals to compare."] },
  ],
  exercises: [
    { title: "A. Skills Practice", items: [
      { q: "Write 3/5 as a decimal.", num: 0.6, tol: 1e-6, solution: "3 ÷ 5 = 0.6." },
      { q: "Write 7/8 as a decimal.", num: 0.875, tol: 1e-6, solution: "7 ÷ 8 = 0.875." },
      { q: "Write 0.35 as a fraction in lowest terms.", frac: "7/20", hint: "Type a fraction, e.g. 7/20.", solution: ["0.35 = 35/100", "Divide both by 5: 7/20"] },
      { q: "Write 45% as a fraction in lowest terms.", frac: "9/20", hint: "Type a fraction.", solution: ["45% = 45/100", "Divide both by 5: 9/20"] },
      { q: "Write 3/20 as a percent.", num: 15, unit: "%", solution: ["3/20 = 15/100", "= 15%"] },
      { q: "Does 2/9 give a terminating or a repeating decimal?", choices: ["Terminating", "Repeating"], answer: "Repeating", solution: "9 = 3 × 3 has prime factors other than 2 and 5; 2/9 = 0.222…" },
      { q: "Which is greater: 4/5 or 0.79?", choices: ["4/5", "0.79"], answer: "4/5", solution: "4/5 = 0.80, and 0.80 > 0.79." },
      { q: "Write 1.75 as a mixed number.", frac: "7/4", hint: "Type a mixed number like 1 3/4.", solution: ["1.75 = 1 + 75/100", "75/100 = 3/4, so 1.75 = 1 3/4"] },
    ] },
    { title: "B. Problem Solving", items: [
      { q: "Which is the least: 0.62, 5/8, 61%, or 3/5?", choices: ["0.62", "5/8", "61%", "3/5"], answer: "3/5", solution: ["0.62; 5/8 = 0.625; 61% = 0.61; 3/5 = 0.60", "The least is 0.60 = 3/5."] },
      { q: "18 of 24 students passed a quiz. What percent of the students passed?", num: 75, unit: "%", solution: ["18/24 = 3/4", "3/4 = 75%"] },
      { q: "A recipe calls for 0.125 kg of butter. Write this as a fraction of a kilogram.", frac: "1/8", hint: "Type a fraction.", solution: ["0.125 = 125/1 000", "= 1/8"] },
      { q: "Give a number between 1/3 and 1/2.", range: [1 / 3, 1 / 2], rangeText: "any number between 0.333… and 0.5, e.g. 5/12 or 0.4", solution: ["1/3 ≈ 0.333 and 1/2 = 0.5", "For example, 0.4, or the average (1/3 + 1/2) ÷ 2 = 5/12."] },
    ] },
    { title: "C. Challenge", items: [
      { q: "Write the repeating decimal 0.363636… as a fraction in lowest terms.", frac: "4/11", hint: "Hint: a two-digit block that repeats is that block over 99.", solution: ["0.363636… = 36/99", "Divide both by 9: 4/11"] },
      { q: "Of the fractions 1/2, 1/3, 1/4, 1/5, 1/6, 1/7, 1/8, 1/9, and 1/10, how many give terminating decimals?", num: 5, solution: ["Denominators with only 2s and 5s: 2, 4, 5, 8, 10.", "That is 5 fractions."] },
    ] },
  ],
});
