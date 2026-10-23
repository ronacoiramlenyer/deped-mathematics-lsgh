/* Term 2 · Lesson 8 · H. The Set of Integers – lesson and exercises */
Sim.addContent("lesson17", {
  learn: [
    { t: "h", text: "What are integers?" },
    { t: "p", text: "The **integers** are the whole numbers together with their opposites. They continue forever in both directions on the number line." },
    { t: "rule", title: "The set of integers", text: "ℤ = {…, −3, −2, −1, 0, 1, 2, 3, …}" },
    { t: "defs", items: [
      ["Positive integers", "integers greater than 0: 1, 2, 3, …"],
      ["Negative integers", "integers less than 0: −1, −2, −3, …"],
      ["Zero", "neither positive nor negative"],
      ["Opposites", "two integers the same distance from 0 on opposite sides, such as 4 and −4"],
    ] },
    { t: "h", text: "Integers in real life" },
    { t: "table", head: ["Situation", "Positive (+)", "Negative (−)"], rows: [["Money", "deposit, savings, profit", "withdrawal, debt, loss"], ["Temperature", "above zero", "below zero"], ["Elevation", "above sea level", "below sea level"], ["Games", "points gained", "points lost"], ["Elevator", "floors above ground", "basement floors"]] },
    { t: "ex", title: "Writing integers for situations", problem: "Write an integer for: a deposit of ₱200, 12 °C below zero, and 3 floors below the ground floor.", steps: ["deposit of ₱200 → +200 (or 200)", "12 °C below zero → −12", "3 floors below ground → −3"], answer: "200, −12, and −3." },
    { t: "ex", title: "Opposites", problem: "What is the opposite of −15? Of 0?", steps: ["−15 is 15 units left of 0; its opposite is 15 units right: 15.", "0 is its own opposite."], answer: "15 and 0." },
    { t: "remember", items: ["Words like gain, above, deposit, up → positive.", "Words like loss, below, withdraw, down → negative.", "Zero is the reference point, and it is neither positive nor negative."] },
  ],
  exercises: [
    { title: "A. Skills Practice", note: "Write an integer for each situation.", items: [
      { q: "a gain of 12 points", num: 12, solution: "A gain is positive: 12." },
      { q: "a loss of ₱50", num: -50, solution: "A loss is negative: −50." },
      { q: "8 m below sea level", num: -8, solution: "Below sea level is negative: −8." },
      { q: "What is the opposite of −15?", num: 15, solution: "15 is the same distance from 0 on the other side." },
      { q: "What is the opposite of 0?", num: 0, solution: "0 is its own opposite." },
      { q: "Is 0 positive, negative, or neither?", choices: ["Positive", "Negative", "Neither"], answer: "Neither", solution: "Zero separates the positive and negative integers." },
      { q: "a temperature of 5 degrees below zero", num: -5, solution: "−5." },
      { q: "an elevator going up 7 floors", num: 7, solution: "Up is positive: 7." },
    ] },
    { title: "B. Problem Solving", items: [
      { q: "A submarine is 300 m below sea level. Write its position as an integer.", num: -300, unit: "m", solution: "−300 m." },
      { q: "In the money context, what does −20 describe?", choices: ["a debt of ₱20", "savings of ₱20", "a profit of ₱20", "no money at all"], answer: "a debt of ₱20", solution: "Negative amounts of money mean money owed or taken out." },
      { q: "How many integers are there between −3 and 3, not including −3 and 3?", num: 5, solution: "−2, −1, 0, 1, 2 → 5 integers." },
      { q: "Is −0.5 an integer?", choices: ["Yes", "No"], answer: "No", solution: "Integers have no fractional part." },
    ] },
    { title: "C. Challenge", items: [
      { q: "How many integers are there from −10 to 10, including both?", num: 21, solution: "10 negative integers, zero, and 10 positive integers: 21." },
      { q: "Give two real-life situations described by opposite integers, and write the integers.", open: true, solution: ["A deposit of ₱100 (+100) and a withdrawal of ₱100 (−100).", "Going up 3 floors (+3) and going down 3 floors (−3)."] },
    ] },
  ],
});
