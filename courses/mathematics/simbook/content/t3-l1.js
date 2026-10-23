/* Term 3 · Lesson 1 · A. Adding and Subtracting Integers – lesson and exercises */
Sim.addContent("lesson19", {
  learn: [
    { t: "h", text: "Integer chips and zero pairs" },
    { t: "p", text: "We can model integers with **integer chips**: a positive chip (+) stands for +1 and a negative chip (−) stands for −1. Owing ₱50 can be shown as 5 negative ₱10 chips; earning ₱80 as 8 positive ₱10 chips." },
    { t: "defs", items: [
      ["Integer chip", "a counter worth +1 (positive chip) or −1 (negative chip)"],
      ["Zero pair", "one positive chip and one negative chip; together they are worth 1 + (−1) = 0"],
      ["Opposites", "two integers with the same distance from 0 on opposite sides, like 6 and −6; their sum is 0"],
    ] },
    { t: "rule", title: "Key idea", text: ["Adding or removing a zero pair does not change the value.", "To read the board, remove all zero pairs. What is left is the answer."] },
    { t: "ex", title: "Adding with chips", problem: "Use chips to find −5 + 8.", steps: ["Put 5 negative chips on the board for −5.", "Add 8 positive chips for +8.", "Match 5 zero pairs and remove them (they are worth 0).", "3 positive chips are left."], answer: "−5 + 8 = 3. Owing ₱50 and earning ₱80 leaves you ₱30." },

    { t: "h", text: "Rules for adding integers" },
    { t: "rule", title: "Adding integers", text: ["**Same signs:** add the absolute values (distances from 0) and keep the common sign.", "**Different signs:** subtract the smaller absolute value from the larger one, and take the sign of the number with the larger absolute value."] },
    { t: "table", head: ["Sum", "Signs", "Work", "Answer"], rows: [["6 + 9", "same (+)", "6 + 9 = 15, keep +", "15"], ["−7 + (−4)", "same (−)", "7 + 4 = 11, keep −", "−11"], ["9 + (−14)", "different", "14 − 9 = 5, sign of −14", "−5"], ["−3 + 10", "different", "10 − 3 = 7, sign of 10", "7"], ["−8 + 8", "opposites", "8 − 8 = 0", "0"]] },
    { t: "ex", title: "Same signs", problem: "Find −7 + (−4).", steps: ["Both numbers are negative: same signs.", "Add the absolute values: 7 + 4 = 11.", "Keep the common sign (−)."], answer: "−11." },
    { t: "ex", title: "Different signs", problem: "Find 9 + (−14).", steps: ["The signs are different.", "Subtract the absolute values: 14 − 9 = 5.", "−14 is farther from 0, so the answer is negative."], answer: "−5." },

    { t: "h", text: "Number lines and bar models" },
    { t: "list", items: [
      "**Number line:** start at the first number. Adding a positive number moves RIGHT; adding a negative number moves LEFT.",
      "**Bar model:** draw a bar for each number. Bars with the same sign join end to end. Bars with different signs line up; the matching part cancels (zero pairs), and the leftover part is the answer.",
    ] },
    { t: "ex", title: "Bar model", problem: "Use a bar model to find 7 + (−3).", steps: ["Draw a positive bar of 7 units and a negative bar of 3 units under it.", "The 3 matching units form 3 zero pairs and cancel.", "4 positive units are left over."], answer: "7 + (−3) = 4." },
    { t: "ex", title: "Number line", problem: "Use a number line to find −2 + (−5).", steps: ["Start at −2.", "Adding −5 means move 5 units to the LEFT.", "You land on −7."], answer: "−7." },

    { t: "h", text: "Subtracting integers" },
    { t: "p", text: "With chips, subtracting means **taking away** chips. If there are not enough chips of the kind you need, add zero pairs first – that adds 0, so the value does not change." },
    { t: "rule", title: "Subtracting integers", text: ["To subtract an integer, add its opposite:", "**a − b = a + (−b)**", "Examples: 3 − (−2) = 3 + 2 = 5 and −4 − 6 = −4 + (−6) = −10."] },
    { t: "ex", title: "Subtracting with chips", problem: "Use chips to find 3 − (−2).", steps: ["Start with 3 positive chips.", "There are no negative chips to take away, so add 2 zero pairs. The value is still 3.", "Take away 2 negative chips.", "5 positive chips are left."], answer: "3 − (−2) = 5, the same as 3 + 2." },
    { t: "ex", title: "Add the opposite", problem: "Find −4 − 6 and 5 − 9.", steps: ["−4 − 6 = −4 + (−6): same signs, 4 + 6 = 10, keep − → −10.", "5 − 9 = 5 + (−9): different signs, 9 − 5 = 4, sign of −9 → −4."], answer: "−10 and −4." },
    { t: "ex", title: "Subtracting a negative", problem: "Find −8 − (−11).", steps: ["Change to adding the opposite: −8 + 11.", "Different signs: 11 − 8 = 3.", "11 is farther from 0, so the answer is positive."], answer: "3." },

    { t: "h", text: "Integers in real life" },
    { t: "ex", title: "Baguio temperature", problem: "At 2:00 p.m. it is 21 °C in Baguio. By 4:00 a.m. the temperature has dropped by 13 °C. What is the temperature at 4:00 a.m.?", steps: ["A drop of 13 °C is −13.", "21 + (−13) = 8."], answer: "8 °C." },
    { t: "ex", title: "Difference in elevation", problem: "A diver is at −12 m (below sea level) and a bird flies at 25 m. How much higher is the bird than the diver?", steps: ["Higher − lower: 25 − (−12).", "Add the opposite: 25 + 12 = 37."], answer: "37 m higher." },
    { t: "remember", items: ["A zero pair (+1 and −1) is worth 0.", "Same signs: add and keep the sign. Different signs: subtract and take the sign of the number farther from 0.", "Subtracting is adding the opposite: a − b = a + (−b).", "Owe ₱50, earn ₱80: −50 + 80 = 30, so you really have ₱30."] },
  ],
  exercises: [
    { title: "A. Skills Practice", note: "Find each sum or difference.", items: [
      { q: "−9 + (−6)", num: -15, solution: ["Same signs: 9 + 6 = 15.", "Keep the negative sign: −15."] },
      { q: "12 + (−20)", num: -8, solution: ["Different signs: 20 − 12 = 8.", "−20 is farther from 0, so the answer is −8."] },
      { q: "−15 + 23", num: 8, solution: ["Different signs: 23 − 15 = 8.", "23 is farther from 0: +8."] },
      { q: "−18 + 18", num: 0, solution: "Opposites add to 0." },
      { q: "7 − 15", num: -8, solution: ["Add the opposite: 7 + (−15).", "15 − 7 = 8, sign of −15 → −8."] },
      { q: "−6 − (−10)", num: 4, solution: ["Add the opposite: −6 + 10.", "10 − 6 = 4."] },
      { q: "−11 − 9", num: -20, solution: ["Add the opposite: −11 + (−9).", "Same signs: 11 + 9 = 20 → −20."] },
      { q: "A chip board has 4 positive chips. How many zero pairs must you add before you can take away 7 positive chips to find 4 − 7?", num: 3, solution: ["You need 7 positive chips but have only 4.", "Add 7 − 4 = 3 zero pairs, then take away 7 positive chips: 3 negative chips are left, so 4 − 7 = −3."] },
    ] },
    { title: "B. Problem Solving", items: [
      { q: "Paolo owes a classmate ₱50, then earns ₱80 helping at the canteen. What integer describes Paolo’s money after paying the debt?", num: 30, unit: "₱", solution: ["Owing ₱50 → −50; earning ₱80 → +80.", "−50 + 80 = 30: Paolo really has ₱30."] },
      { q: "The temperature in Baguio is 18 °C at noon and drops 11 °C by midnight. What is the temperature at midnight?", num: 7, unit: "°C", solution: "18 + (−11) = 7 °C." },
      { q: "A jeepney driver starts the day with ₱500. The driver pays ₱850 for diesel, then collects ₱1 200 in fares. How much money does the driver have now?", num: 850, unit: "₱", solution: ["500 + (−850) = −350", "−350 + 1 200 = 850 → ₱850."] },
      { q: "A submarine at −120 m rises 45 m. What is its new position?", num: -75, unit: "m", solution: ["Rising is positive: −120 + 45.", "120 − 45 = 75, sign of −120 → −75 m."] },
    ] },
    { title: "C. Challenge", items: [
      { q: "Evaluate −14 − (−6) + (−9) − 5.", num: -22, solution: ["Change each subtraction to adding the opposite: −14 + 6 + (−9) + (−5).", "−14 + 6 = −8; −8 + (−9) = −17; −17 + (−5) = −22."] },
      { q: "Use integer chips to explain why 2 − (−3) = 5. Draw or describe the board at each step.", open: true, solution: ["Start with 2 positive chips.", "There are no negative chips to take away, so add 3 zero pairs (+3 and −3). The value is still 2.", "Take away the 3 negative chips. 5 positive chips are left, so 2 − (−3) = 5.", "This is the same as 2 + 3: subtracting −3 is adding its opposite."] },
    ] },
  ],
});
