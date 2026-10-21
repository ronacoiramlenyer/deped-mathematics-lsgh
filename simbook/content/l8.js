/* Lesson 8 · H. Operations on Rational Numbers – lesson and exercises */
Sim.addContent("lesson8", {
  learn: [
    { t: "h", text: "Adding and subtracting fractions" },
    { t: "rule", title: "Rule", text: ["Same denominators: add or subtract the numerators.", "Different denominators: rewrite both with the least common denominator (LCD) first."] },
    { t: "ex", title: "Unlike denominators", problem: "Add 2/3 + 3/4.", steps: ["LCD of 3 and 4 is 12.", "2/3 = 8/12 and 3/4 = 9/12", "8/12 + 9/12 = 17/12 = 1 5/12"], answer: "1 5/12." },
    { t: "ex", title: "Subtraction", problem: "Subtract 5/6 − 1/4.", steps: ["LCD of 6 and 4 is 12.", "10/12 − 3/12 = 7/12"], answer: "7/12." },
    { t: "ex", title: "Mixed numbers", problem: "Subtract 3 1/2 − 1 3/4.", steps: ["Change to improper fractions: 7/2 − 7/4", "7/2 = 14/4", "14/4 − 7/4 = 7/4 = 1 3/4"], answer: "1 3/4." },
    { t: "h", text: "Multiplying and dividing fractions" },
    { t: "rule", title: "Rule", text: ["Multiply: numerator × numerator, denominator × denominator.", "Divide: multiply by the reciprocal of the divisor (“keep, change, flip”)."] },
    { t: "ex", title: "Multiplication", problem: "Multiply 2/5 × 15/8.", steps: ["(2 × 15) / (5 × 8) = 30/40", "Simplify: 3/4"], answer: "3/4." },
    { t: "ex", title: "Division", problem: "Divide 3/4 ÷ 3/8.", steps: ["3/4 × 8/3 = 24/12", "= 2"], answer: "2 – there are two 3/8’s in 3/4." },
    { t: "h", text: "Operations on decimals" },
    { t: "list", items: [
      "**Add or subtract:** line up the decimal points. 4.75 + 12.6 = 17.35; 20 − 7.85 = 12.15",
      "**Multiply:** multiply as whole numbers, then count the decimal places in both factors. 3.2 × 0.15 → 32 × 15 = 480 → 3 places → 0.480 = 0.48",
      "**Divide:** move the decimal point of the divisor to make it a whole number, and move the dividend’s point the same number of places. 7.2 ÷ 0.04 = 720 ÷ 4 = 180",
    ] },
    { t: "h", text: "Multi-step problems" },
    { t: "ex", title: "Spending money", problem: "Ana has ₱1 000. Ana spends 2/5 of it on books and 0.25 of the remainder on snacks. How much is left?", steps: ["books: 2/5 × ₱1 000 = ₱400 → remainder ₱600", "snacks: 0.25 × ₱600 = ₱150", "left: ₱600 − ₱150 = ₱450"], answer: "₱450." },
    { t: "p", text: "Choose the easier form: fractions are convenient when the denominators divide evenly; decimals are convenient for money and measurement." },
    { t: "remember", items: ["Common denominator before adding or subtracting.", "To divide by a fraction, multiply by its reciprocal.", "Dividing by a number less than 1 gives a bigger answer; multiplying by it gives a smaller one."] },
  ],
  exercises: [
    { title: "A. Skills Practice", items: [
      { q: "Add 3/4 + 5/6.", frac: "19/12", hint: "Answer as a fraction or mixed number.", solution: ["LCD = 12", "9/12 + 10/12 = 19/12 = 1 7/12"] },
      { q: "Subtract 7/8 − 1/3.", frac: "13/24", solution: ["LCD = 24", "21/24 − 8/24 = 13/24"] },
      { q: "Add 2 1/2 + 1 2/3.", frac: "25/6", solution: ["5/2 + 5/3 = 15/6 + 10/6 = 25/6", "= 4 1/6"] },
      { q: "Multiply 3/5 × 10/9.", frac: "2/3", solution: ["30/45", "= 2/3"] },
      { q: "Divide 4/9 ÷ 2/3.", frac: "2/3", solution: ["4/9 × 3/2 = 12/18", "= 2/3"] },
      { q: "Add 6.4 + 3.75.", num: 10.15, tol: 1e-6, solution: "6.40 + 3.75 = 10.15." },
      { q: "Multiply 2.5 × 0.4.", num: 1, tol: 1e-6, solution: ["25 × 4 = 100", "2 decimal places → 1.00 = 1"] },
      { q: "Divide 8.1 ÷ 0.9.", num: 9, tol: 1e-6, solution: "8.1 ÷ 0.9 = 81 ÷ 9 = 9." },
    ] },
    { title: "B. Problem Solving", items: [
      { q: "A rope is 7 1/2 m long. Pieces of 2 3/4 m and 1 1/2 m are cut off. How much rope is left?", frac: "13/4", unit: "m", solution: ["used: 2 3/4 + 1 1/2 = 11/4 + 6/4 = 17/4", "left: 30/4 − 17/4 = 13/4 = 3 1/4 m"] },
      { q: "Carlo has ₱1 200. Carlo spends 1/3 on books and 0.4 of the remainder on snacks. How much is left?", num: 480, unit: "₱", solution: ["books: 1/3 × ₱1 200 = ₱400 → remainder ₱800", "snacks: 0.4 × ₱800 = ₱320", "left: ₱800 − ₱320 = ₱480"] },
      { q: "One batch of puto needs 2/3 cup of sugar. How many cups are needed for 4 1/2 batches?", frac: "3", unit: "cups", solution: "2/3 × 9/2 = 18/6 = 3 cups." },
      { q: "6 3/4 kg of rice is packed into bags of 3/4 kg each. How many bags are filled?", num: 9, unit: "bags", solution: "27/4 ÷ 3/4 = 27/4 × 4/3 = 9." },
    ] },
    { title: "C. Challenge", items: [
      { q: "Evaluate (1/2 + 1/3) ÷ 5/6.", frac: "1", solution: ["1/2 + 1/3 = 3/6 + 2/6 = 5/6", "5/6 ÷ 5/6 = 1"] },
      { q: "Evaluate 1.2 × 2/3 + 0.5.", num: 1.3, tol: 1e-6, solution: ["1.2 × 2/3 = 2.4 ÷ 3 = 0.8", "0.8 + 0.5 = 1.3"] },
    ] },
  ],
});
