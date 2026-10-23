/* Term 2 · Lesson 9 · I. Comparing and Ordering Integers – lesson and exercises */
Sim.addContent("lesson18", {
  learn: [
    { t: "h", text: "Locating integers on the number line" },
    { t: "p", text: "On a horizontal number line, 0 is in the middle, positive integers are to the right, and negative integers are to the left. The marks are equally spaced." },
    { t: "rule", title: "Comparing integers", text: ["The number farther to the RIGHT is greater.", "Every positive integer > 0 > every negative integer.", "For two negative integers, the one closer to 0 is greater."] },
    { t: "ex", title: "Comparing", problem: "Compare −7 and −4. Compare 0 and −9.", steps: ["−4 is to the right of −7 (closer to 0), so −7 < −4.", "0 is to the right of −9, so 0 > −9."], answer: "−7 < −4 and 0 > −9." },
    { t: "ex", title: "Ordering", problem: "Arrange from least to greatest: −4, 7, −1, 0, 3.", steps: ["Negative integers first, farthest from 0 first: −4, −1", "Then 0", "Then the positive integers: 3, 7"], answer: "−4, −1, 0, 3, 7." },
    { t: "ex", title: "Temperatures", problem: "Moscow is −8 °C, Seoul −2 °C, and Tokyo 6 °C. Which city is coldest?", steps: ["−8 is the least of the three numbers."], answer: "Moscow." },
    { t: "remember", items: ["Right is greater; left is less.", "−1 is the greatest negative integer.", "Use < and > with the open side facing the greater number."] },
  ],
  exercises: [
    { title: "A. Skills Practice", note: "Choose the symbol that makes each statement true.", items: [
      { q: "−3 ___ 2", choices: ["<", ">", "="], answer: "<", solution: "2 is to the right of −3." },
      { q: "−7 ___ −4", choices: ["<", ">", "="], answer: "<", solution: "−4 is closer to 0." },
      { q: "0 ___ −9", choices: ["<", ">", "="], answer: ">", solution: "0 is to the right of −9." },
      { q: "5 ___ −5", choices: ["<", ">", "="], answer: ">", solution: "Every positive integer is greater than every negative integer." },
      { q: "Which is the least: −2, −8, 3, 0?", choices: ["−2", "−8", "3", "0"], answer: "−8", solution: "−8 is farthest to the left." },
      { q: "Which is the greatest: −12, −5, −9, −20?", choices: ["−12", "−5", "−9", "−20"], answer: "−5", solution: "−5 is closest to 0." },
      { q: "Which temperature is colder: −15 °C or −10 °C?", choices: ["−15 °C", "−10 °C"], answer: "−15 °C", solution: "−15 < −10." },
      { q: "What integer is 3 units to the left of 1 on the number line?", num: -2, solution: "Count 3 units left from 1: 0, −1, −2." },
    ] },
    { title: "B. Problem Solving", items: [
      { q: "Which list is in order from least to greatest?", choices: ["−4, −1, 0, 3, 7", "−1, −4, 0, 3, 7", "0, −1, −4, 3, 7", "7, 3, 0, −1, −4"], answer: "−4, −1, 0, 3, 7", solution: "Negative integers farthest from 0 come first." },
      { q: "Seoul is −2 °C, Moscow −8 °C, and Tokyo 6 °C. Which city is coldest?", choices: ["Seoul", "Moscow", "Tokyo"], answer: "Moscow", solution: "−8 is the least." },
      { q: "The shore of the Dead Sea is about −430 m and Death Valley is about −86 m relative to sea level. Which is lower?", choices: ["Dead Sea", "Death Valley"], answer: "Dead Sea", solution: "−430 < −86." },
      { q: "How many integers are greater than −5 and less than 4?", num: 8, solution: "−4, −3, −2, −1, 0, 1, 2, 3 → 8 integers." },
    ] },
    { title: "C. Challenge", items: [
      { q: "x is an integer with −3 < x < 2. How many possible values does x have?", num: 4, solution: "x can be −2, −1, 0, or 1." },
      { q: "Explain why −1 is greater than −100.", open: true, solution: ["On the number line, −1 is to the right of −100.", "−1 is only 1 unit below zero, while −100 is 100 units below zero."] },
    ] },
  ],
});
