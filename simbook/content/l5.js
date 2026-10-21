/* Lesson 5 · E. Creating a Financial Plan – lesson and exercises */
Sim.addContent("lesson5", {
  learn: [
    { t: "h", text: "What is a financial plan?" },
    { t: "p", text: "A **financial plan** is a written plan for how money will be earned, spent, and saved to reach a goal. It answers: What is my goal? How much money do I have? Where will it go?" },
    { t: "defs", items: [
      ["Goal", "what you are saving or planning for, with an amount and a deadline"],
      ["Income", "money that comes in (baon, allowance, earnings, gifts)"],
      ["Expenses", "money that goes out"],
      ["Needs", "expenses you must pay to live and study – fare, lunch, school supplies"],
      ["Wants", "expenses that are nice to have but not necessary – milk tea, games, extra gadgets"],
      ["Savings", "money set aside for a goal or for emergencies"],
    ] },
    { t: "h", text: "The 50-30-20 guide" },
    { t: "rule", title: "A simple budget guide", text: ["needs: 50% of income", "wants: 30% of income", "savings: 20% of income"] },
    { t: "ex", title: "A weekly baon budget", problem: "Use the 50-30-20 guide for a ₱500 weekly baon.", steps: ["needs = 0.50 × ₱500 = ₱250", "wants = 0.30 × ₱500 = ₱150", "savings = 0.20 × ₱500 = ₱100"], answer: "₱250 needs, ₱150 wants, ₱100 savings." },
    { t: "table", head: ["Category", "Item", "Amount", "% of ₱500"], rows: [["Needs", "Fare", "₱150", "30%"], ["Needs", "Lunch", "₱100", "20%"], ["Wants", "Snacks", "₱100", "20%"], ["Wants", "Mobile load", "₱50", "10%"], ["Savings", "Savings jar", "₱100", "20%"], ["", "**Total**", "**₱500**", "**100%**"]] },
    { t: "h", text: "Savings goals" },
    { t: "rule", title: "Two useful formulas", text: ["number of weeks = goal ÷ amount saved per week", "amount to save per week = goal ÷ number of weeks"] },
    { t: "ex", title: "How long will it take?", problem: "You want rubber shoes that cost ₱1 800. You save ₱100 a week. How many weeks will it take?", steps: ["₱1 800 ÷ ₱100 = 18"], answer: "18 weeks." },
    { t: "ex", title: "How much per week?", problem: "You want the ₱1 800 shoes in 12 weeks instead. How much must you save each week? What percent of a ₱500 baon is that?", steps: ["₱1 800 ÷ 12 = ₱150 per week", "₱150 ÷ ₱500 = 0.30 = 30%"], answer: "₱150 a week, or 30% of the baon." },
    { t: "h", text: "Steps in making a financial plan" },
    { t: "steps", items: ["Set a goal with an amount and a deadline.", "List your income.", "List your expenses as needs and wants.", "Decide how much to save; keep a reserve for emergencies.", "Track your spending and adjust the plan when things change."] },
    { t: "remember", items: ["Pay for needs first, then save, then spend on wants.", "Percentages make a budget work for any amount of money.", "A plan should include a reserve for the unexpected."] },
  ],
  exercises: [
    { title: "A. Skills Practice", items: [
      { q: "Using the 50-30-20 guide, how much of a ₱700 weekly baon goes to needs?", num: 350, unit: "₱", solution: "0.50 × ₱700 = ₱350." },
      { q: "How much of a ₱650 weekly baon goes to savings under the 50-30-20 guide?", num: 130, unit: "₱", solution: "0.20 × ₱650 = ₱130." },
      { q: "How much of an ₱800 weekly baon goes to wants under the 50-30-20 guide?", num: 240, unit: "₱", solution: "0.30 × ₱800 = ₱240." },
      { q: "In a student’s budget, is the school bus fare a need or a want?", choices: ["Need", "Want"], answer: "Need", solution: "It is necessary for getting to school." },
      { q: "₱150 of a ₱600 weekly budget is spent on lunch. What percent of the budget is that?", num: 25, unit: "%", solution: "150 ÷ 600 = 0.25 = 25%." },
      { q: "You save ₱80 a week. How many weeks will it take to save ₱1 200?", num: 15, unit: "weeks", solution: "₱1 200 ÷ ₱80 = 15." },
      { q: "You want to save ₱2 000 in 8 weeks. How much must you save each week?", num: 250, unit: "₱", solution: "₱2 000 ÷ 8 = ₱250." },
      { q: "Is a concert ticket a need or a want?", choices: ["Need", "Want"], answer: "Want", solution: "It is enjoyable, but you can live and study without it." },
    ] },
    { title: "B. Problem Solving", items: [
      { q: "Ben gets ₱500 a week. Fare costs ₱150, lunch ₱175, and snacks ₱75. Ben saves the rest. What percent of the baon is saved?", num: 20, unit: "%", solution: ["spent = ₱150 + ₱175 + ₱75 = ₱400", "saved = ₱500 − ₱400 = ₱100", "₱100 ÷ ₱500 = 20%"] },
      { q: "Mia saves 20% of a ₱600 weekly baon for a ₱3 600 bicycle. How many weeks will it take?", num: 30, unit: "weeks", solution: ["weekly savings = 0.20 × ₱600 = ₱120", "₱3 600 ÷ ₱120 = 30 weeks"] },
      { q: "A budget of ₱900 puts 55% in needs and 25% in wants. How many pesos are left for savings?", num: 180, unit: "₱", solution: ["savings = 100% − 55% − 25% = 20%", "0.20 × ₱900 = ₱180"] },
      { q: "A class fund of ₱5 000 keeps a 10% reserve for emergencies. How much is the reserve?", num: 500, unit: "₱", solution: "0.10 × ₱5 000 = ₱500." },
    ] },
    { title: "C. Challenge", items: [
      { q: "Leo saves ₱100 in the first week and ₱20 more each week after that (₱120, ₱140, …). How much has Leo saved after 5 weeks?", num: 700, unit: "₱", solution: ["₱100 + ₱120 + ₱140 + ₱160 + ₱180", "= ₱700"] },
      { q: "Explain why a good financial plan keeps a reserve, using an example from your own week.", open: true, solution: ["Unexpected expenses happen – rain means a tricycle ride, a project needs materials.", "A reserve covers these without using the money meant for needs or for the savings goal."] },
    ] },
  ],
});
