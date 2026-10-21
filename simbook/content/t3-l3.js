/* Term 3 · Lesson 3 · C. Absolute Value – lesson and exercises */
Sim.addContent("lesson21", {
  learn: [
    { t: "h", text: "What is absolute value?" },
    { t: "p", text: "The **absolute value** of a number is its **distance from 0** on the number line. We write the absolute value of a as |a|. A distance is never negative, so an absolute value is never negative." },
    { t: "rule", title: "Absolute value", text: ["|a| = the distance of a from 0", "|6| = 6 and |−6| = 6, because both are 6 units from 0.", "|0| = 0"] },
    { t: "defs", items: [
      ["|a|", "read “the absolute value of a”"],
      ["Opposites", "have the same absolute value: |−9| = |9| = 9"],
      ["−|a|", "the opposite of an absolute value, so −|5| = −5 (the bars are worked first)"],
    ] },
    { t: "ex", title: "Reading absolute values", problem: "Find |−14|, |23|, and |0|.", steps: ["−14 is 14 units to the left of 0 → 14.", "23 is 23 units to the right of 0 → 23.", "0 is 0 units from itself → 0."], answer: "14, 23, and 0." },
    { t: "ex", title: "Which integers?", problem: "Which integers have an absolute value of 8?", steps: ["Go 8 units right of 0: 8.", "Go 8 units left of 0: −8."], answer: "8 and −8." },

    { t: "h", text: "Working with absolute value" },
    { t: "p", text: "Treat absolute value bars like a grouping symbol: simplify inside the bars first, then take the absolute value." },
    { t: "table", head: ["Expression", "Work", "Value"], rows: [["|−12| + |5|", "12 + 5", "17"], ["|−12| − |5|", "12 − 5", "7"], ["|5 − 12|", "|−7|", "7"], ["−|−3|", "−(3)", "−3"], ["|−4| × |−2|", "4 × 2", "8"]] },
    { t: "ex", title: "Comparing", problem: "Which is greater: |−9| or |5|? Compare −9 and 5 too.", steps: ["|−9| = 9 and |5| = 5, so |−9| > |5|.", "But on the number line, −9 < 5.", "Absolute value compares distance from 0, not position."], answer: "|−9| > |5|, while −9 < 5." },

    { t: "h", text: "Distance between two integers" },
    { t: "rule", title: "Distance on a number line", text: ["The distance between a and b is **|a − b|** (or |b − a|; they are equal).", "Opposite sides of 0: add their absolute values. Same side: subtract them."] },
    { t: "ex", title: "Two integers", problem: "Find the distance between −6 and 3.", steps: ["|−6 − 3| = |−9| = 9.", "Check: |3 − (−6)| = |9| = 9.", "Check by counting: 6 units from −6 to 0, then 3 units to 3: 6 + 3 = 9."], answer: "9 units." },
    { t: "ex", title: "Mountain to seabed", problem: "The summit of Mt. Pulag is about 2 926 m above sea level. The seabed of Manila Bay is about 17 m below sea level (−17 m). How far apart are they vertically?", steps: ["Distance = |2 926 − (−17)|", "= |2 926 + 17| = |2 943|", "= 2 943 m. (Opposite sides of sea level: 2 926 + 17.)"], answer: "About 2 943 m." },
    { t: "ex", title: "Temperature change", problem: "A freezer is at −18 °C and the kitchen is at 27 °C. What is the difference in temperature?", steps: ["|27 − (−18)| = |27 + 18|", "= |45| = 45."], answer: "45 °C." },

    { t: "h", text: "Absolute value in real life" },
    { t: "list", items: [
      "**Money:** a balance of −₱50 means you owe ₱50. |−50| = 50 tells how big the debt is; the sign tells that it is a debt.",
      "**Elevation:** −17 m means 17 m below sea level; |−17| = 17 is the depth.",
      "**Change:** a temperature change of −9 °C is a drop of |−9| = 9 degrees.",
    ] },
    { t: "ex", title: "Owe and earn", problem: "You owe ₱50 and then earn ₱80. How big was the debt, and how much do you really have now?", steps: ["The debt is −50; its size is |−50| = ₱50.", "−50 + 80 = 30."], answer: "The debt was ₱50; you really have ₱30." },
    { t: "remember", items: ["|a| is the distance of a from 0, so it is never negative.", "Opposites have the same absolute value; |0| = 0.", "Distance between a and b = |a − b| = |b − a|.", "Simplify inside the bars first; the minus sign outside, as in −|a|, stays."] },
  ],
  exercises: [
    { title: "A. Skills Practice", note: "Evaluate.", items: [
      { q: "|−27|", num: 27, solution: "−27 is 27 units from 0." },
      { q: "|15|", num: 15, solution: "15 is 15 units from 0." },
      { q: "|−8| + |3|", num: 11, solution: "8 + 3 = 11." },
      { q: "|−20| − |−6|", num: 14, solution: "20 − 6 = 14." },
      { q: "−|−9|", num: -9, solution: ["|−9| = 9", "The opposite of 9 is −9."] },
      { q: "|4 − 11|", num: 7, solution: ["Inside first: 4 − 11 = −7.", "|−7| = 7."] },
      { q: "Find the distance between −7 and 5 on the number line.", num: 12, solution: ["|−7 − 5| = |−12| = 12", "Check: 7 units to 0, then 5 more: 12."] },
      { q: "Which integers have an absolute value of 13?", choices: ["13 only", "−13 only", "13 and −13", "0 and 13"], answer: "13 and −13", solution: "Both 13 and −13 are 13 units from 0." },
    ] },
    { title: "B. Problem Solving", items: [
      { q: "Mt. Apo’s summit is about 2 954 m above sea level and Mt. Pulag’s is about 2 926 m. What is the difference in their heights?", num: 28, unit: "m", solution: "|2 954 − 2 926| = 28 m." },
      { q: "A diver is at −35 m and a seagull is flying at 20 m. What is the vertical distance between them?", num: 55, unit: "m", solution: ["|20 − (−35)| = |55| = 55 m", "Opposite sides of sea level: 20 + 35 = 55."] },
      { q: "The temperature at dawn on a mountain was −4 °C. By noon it was 13 °C. By how many degrees did the temperature rise?", num: 17, unit: "°C", solution: "|13 − (−4)| = |17| = 17 °C." },
      { q: "Joaquin’s balance in the class savings book is −₱120 (an amount owed). How much does Joaquin need to deposit to bring the balance to ₱0?", num: 120, unit: "₱", solution: ["The size of the debt is |−120| = 120.", "−120 + 120 = 0, so Joaquin deposits ₱120."] },
    ] },
    { title: "C. Challenge", items: [
      { q: "x is an integer and |x| < 4. How many possible values does x have?", num: 7, solution: ["x must be less than 4 units from 0.", "x = −3, −2, −1, 0, 1, 2, 3 → 7 values."] },
      { q: "Is it always true that |a + b| = |a| + |b|? Test with a = 5 and b = −3, and explain.", open: true, solution: ["|5 + (−3)| = |2| = 2, but |5| + |−3| = 5 + 3 = 8.", "So it is not always true. It works only when a and b have the same sign (or one of them is 0).", "When the signs are different, part of the distance cancels, like zero pairs."] },
    ] },
  ],
});
