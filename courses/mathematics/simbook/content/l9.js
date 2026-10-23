/* Lesson 9 · I. Square Roots, Cube Roots, and Irrational Numbers – lesson and exercises */
Sim.addContent("lesson9", {
  learn: [
    { t: "h", text: "Perfect squares and square roots" },
    { t: "p", text: "A **perfect square** is the product of a whole number and itself: 1, 4, 9, 16, 25, … The **square root** of a number is the number that, multiplied by itself, gives that number." },
    { t: "rule", title: "Square root", text: ["√49 = 7 because 7 × 7 = 49", "If a square has area A, its side is √A."] },
    { t: "table", head: ["n", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15"], rows: [["n²", "1", "4", "9", "16", "25", "36", "49", "64", "81", "100", "121", "144", "169", "196", "225"]] },
    { t: "h", text: "Perfect cubes and cube roots" },
    { t: "p", text: "A **perfect cube** is a whole number used as a factor three times: 1, 8, 27, 64, 125, … The **cube root** ∛ undoes cubing." },
    { t: "rule", title: "Cube root", text: ["∛64 = 4 because 4 × 4 × 4 = 64", "If a cube has volume V, its edge is ∛V."] },
    { t: "table", head: ["n", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10"], rows: [["n³", "1", "8", "27", "64", "125", "216", "343", "512", "729", "1 000"]] },
    { t: "ex", title: "Roots of fractions and decimals", problem: "Find √(9/25), √0.36, and ∛(8/27).", steps: ["√(9/25) = 3/5 because (3/5)² = 9/25", "√0.36 = 0.6 because 0.6 × 0.6 = 0.36", "∛(8/27) = 2/3 because (2/3)³ = 8/27"], answer: "3/5, 0.6, and 2/3." },
    { t: "ex", title: "Using roots", problem: "A square garden has an area of 81 m². A cube-shaped box has a volume of 216 cm³. Find the side of the garden and the edge of the box.", steps: ["side = √81 = 9 m", "edge = ∛216 = 6 cm"], answer: "9 m and 6 cm." },
    { t: "h", text: "Irrational numbers" },
    { t: "p", text: "Most numbers are not perfect squares or cubes. Their roots are **irrational numbers**: they cannot be written as a fraction, and their decimals never end and never repeat. Examples: √2 = 1.41421356…, √10, ∛20, and π." },
    { t: "h", text: "Estimating roots and locating them on the number line" },
    { t: "steps", items: ["Find the two perfect squares (or cubes) on either side of the number.", "The root lies between their roots.", "Decide which one it is closer to, then refine by squaring (or cubing) a guess."] },
    { t: "ex", title: "Estimating √10", problem: "Between which two whole numbers is √10? Estimate it to one decimal place.", steps: ["9 < 10 < 16, so 3 < √10 < 4.", "10 is much closer to 9, so √10 is a little more than 3.", "3.1² = 9.61 and 3.2² = 10.24, so √10 ≈ 3.2 (more exactly 3.16)."], answer: "between 3 and 4; about 3.2." },
    { t: "ex", title: "The square of area 2", problem: "Can a square have an area of exactly 2 square units?", steps: ["Inside a 2 × 2 square, join the midpoints of the four sides.", "The tilted square uses 4 − 4 × ½ = 2 square units.", "Its side is √2 ≈ 1.414, an irrational number."], answer: "yes – its side is exactly √2." },
    { t: "remember", items: ["√ undoes squaring; ∛ undoes cubing.", "Roots of numbers that are not perfect squares or cubes are irrational.", "Estimate a root using the perfect squares or cubes around it."] },
  ],
  exercises: [
    { title: "A. Skills Practice", items: [
      { q: "Find √121.", num: 11, solution: "11 × 11 = 121." },
      { q: "Find √196.", num: 14, solution: "14 × 14 = 196." },
      { q: "Find ∛125.", num: 5, solution: "5 × 5 × 5 = 125." },
      { q: "Find ∛512.", num: 8, solution: "8 × 8 × 8 = 512." },
      { q: "Find √(16/49).", frac: "4/7", hint: "Type a fraction.", solution: "(4/7)² = 16/49." },
      { q: "Find √0.81.", num: 0.9, tol: 1e-6, solution: "0.9 × 0.9 = 0.81." },
      { q: "√40 is between which two consecutive whole numbers? Type the smaller one.", num: 6, solution: "36 < 40 < 49, so 6 < √40 < 7." },
      { q: "∛70 is between which two consecutive whole numbers? Type the smaller one.", num: 4, solution: "64 < 70 < 125, so 4 < ∛70 < 5." },
    ] },
    { title: "B. Problem Solving", items: [
      { q: "A square lot has an area of 225 m². How long is each side?", num: 15, unit: "m", solution: "√225 = 15 m." },
      { q: "A cube-shaped box has a volume of 343 cm³. How long is each edge?", num: 7, unit: "cm", solution: "∛343 = 7 cm." },
      { q: "A square tile has an area of 2.25 m². How long is each side?", num: 1.5, tol: 1e-6, unit: "m", solution: "1.5 × 1.5 = 2.25, so the side is 1.5 m." },
      { q: "Is √45 rational or irrational?", choices: ["Rational", "Irrational"], answer: "Irrational", solution: "45 is not a perfect square (36 < 45 < 49), so √45 is irrational." },
    ] },
    { title: "C. Challenge", items: [
      { q: "Estimate √30 to the nearest tenth.", num: 5.5, tol: 1e-6, solution: ["25 < 30 < 36, so √30 is between 5 and 6.", "5.4² = 29.16 and 5.5² = 30.25; 30 is closer to 30.25.", "√30 ≈ 5.5 (more exactly 5.477)."] },
      { q: "A square has an area of 50 cm². Find its side length to the nearest tenth of a centimetre.", num: 7.1, tol: 1e-6, unit: "cm", solution: ["49 < 50 < 64, so the side is a little more than 7.", "7.0² = 49 and 7.1² = 50.41; 50 is closer to 50.41.", "side ≈ 7.1 cm (more exactly 7.07)."] },
    ] },
  ],
});
