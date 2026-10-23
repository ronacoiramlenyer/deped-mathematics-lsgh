/* Term 2 · Lesson 7 · G. Organizing and Graphing Data – lesson and exercises */
Sim.addContent("lesson16", {
  learn: [
    { t: "h", text: "Frequency distribution tables" },
    { t: "p", text: "A **frequency distribution table (FDT)** organizes data into classes and shows how many values fall in each class." },
    { t: "defs", items: [
      ["Class", "a group of values, such as 20–29"],
      ["Class limits", "the smallest and largest values of a class (20 and 29)"],
      ["Class width", "the number of values in each class (29 − 20 + 1 = 10)"],
      ["Tally", "marks grouped in fives: |||| with a slash for the fifth"],
      ["Frequency f", "the number of values in a class"],
      ["Modal class", "the class with the greatest frequency"],
    ] },
    { t: "ex", title: "Building an FDT", problem: "Organize 40 quiz scores into classes of width 10.", steps: ["Find the lowest (18) and highest (47) scores.", "Start the first class at 10: 10–19, 20–29, 30–39, 40–49.", "Tally each score, then count: 2, 11, 19, 8.", "Check the total: 2 + 11 + 19 + 8 = 40."], answer: "the modal class is 30–39." },
    { t: "h", text: "Choosing the right graph" },
    { t: "table", head: ["Graph", "Best for"], rows: [["Bar graph", "comparing counts of categories"], ["Pie graph", "showing parts of a whole"], ["Line graph", "showing change over time"], ["Stem-and-leaf plot", "showing the shape of numerical data while keeping every value"]] },
    { t: "rule", title: "Pie graph", text: ["angle of a sector = (part ÷ whole) × 360°", "percent of a sector = (part ÷ whole) × 100%"] },
    { t: "ex", title: "A pie graph sector", problem: "15 of 50 learners chose siomai as their favourite snack. Find the angle of its sector.", steps: ["15 ÷ 50 = 0.3", "0.3 × 360° = 108°"], answer: "108° (30% of the circle)." },
    { t: "ex", title: "Reading a stem-and-leaf plot", problem: "The row 3 | 0 0 1 2 means what values? (Key: 3 | 5 = 35)", steps: ["The stem is the tens digit; each leaf is a ones digit.", "3 | 0 0 1 2 → 30, 30, 31, 32"], answer: "30, 30, 31, and 32." },
    { t: "h", text: "Interpreting graphs" },
    { t: "list", items: ["Read the title, labels, and scale first.", "Look for the highest and lowest values, and for trends (rising or falling).", "Compare parts, then draw a conclusion that the data supports."] },
    { t: "remember", items: ["Classes must not overlap, and their frequencies must add up to the total.", "Pie angles add up to 360°.", "Pick the graph that fits the question you want to answer."] },
  ],
  exercises: [
    { title: "A. Skills Practice", items: [
      { q: "What is the class width of the class 20–24?", num: 5, solution: "24 − 20 + 1 = 5." },
      { q: "A tally shows |||| || (one group of five and two more). What is the frequency?", num: 7, solution: "5 + 2 = 7." },
      { q: "60 of 150 learners chose bananas. What is the angle of this sector in a pie graph?", num: 144, unit: "°", solution: "60 ÷ 150 × 360° = 0.4 × 360° = 144°." },
      { q: "Which graph best shows how a learner’s weight changes each month?", choices: ["Bar graph", "Pie graph", "Line graph", "Stem-and-leaf plot"], answer: "Line graph", solution: "Line graphs show change over time." },
      { q: "Which graph best shows how a family’s budget is divided?", choices: ["Bar graph", "Pie graph", "Line graph", "Stem-and-leaf plot"], answer: "Pie graph", solution: "A pie graph shows parts of a whole." },
      { q: "In a stem-and-leaf plot, the row 4 | 2 5 8 has key 4 | 2 = 42. What is the largest value in the row?", num: 48, solution: "4 | 8 = 48." },
      { q: "An FDT has frequencies 3, 7, 12, and 8. How many values are there in all?", num: 30, solution: "3 + 7 + 12 + 8 = 30." },
      { q: "What is the percent for a sector of 90° in a pie graph?", num: 25, unit: "%", solution: "90 ÷ 360 = 0.25 = 25%." },
    ] },
    { title: "B. Problem Solving", note: "Quiz scores: 10–19: 4 · 20–29: 9 · 30–39: 15 · 40–49: 12", items: [
      { q: "Which is the modal class?", choices: ["10–19", "20–29", "30–39", "40–49"], answer: "30–39", solution: "15 is the greatest frequency." },
      { q: "How many learners scored 30 or above?", num: 27, solution: "15 + 12 = 27." },
      { q: "What percent of the 40 learners scored in the class 20–29?", num: 22.5, tol: 1e-6, unit: "%", solution: "9 ÷ 40 = 0.225 = 22.5%." },
      { q: "A line graph shows canteen sales of 20 sandwiches on Monday and 35 on Tuesday. By how many sandwiches did sales increase?", num: 15, solution: "35 − 20 = 15." },
    ] },
    { title: "C. Challenge", items: [
      { q: "A pie graph of 200 learners has a sector of 72°. How many learners does that sector represent?", num: 40, solution: ["72 ÷ 360 = 0.2", "0.2 × 200 = 40 learners"] },
      { q: "A stem-and-leaf plot shows 1 | 5 8, 2 | 0 3 3 7, 3 | 1 4 (key 2 | 3 = 23). How many values are 23 or more?", num: 5, solution: ["The values are 15, 18, 20, 23, 23, 27, 31, 34.", "23, 23, 27, 31, 34 → 5 values"] },
    ] },
  ],
});
