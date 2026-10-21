/* Lesson 6 · F. Rates – lesson and exercises */
Sim.addContent("lesson6", {
  learn: [
    { t: "h", text: "Rates and unit rates" },
    { t: "p", text: "A **rate** compares two quantities measured in different units, such as 150 kilometres in 3 hours or ₱180 for 4 kilograms. A **unit rate** is a rate for ONE unit of the second quantity." },
    { t: "ex", title: "Finding a unit rate", problem: "A bus travels 150 km in 3 hours. What is its unit rate?", steps: ["150 km ÷ 3 h = 50 km per hour"], answer: "50 km/h." },
    { t: "p", text: "Rates are everywhere: speed (km/h), price per unit (₱/kg), pay (₱/hour), water flow (L/min), typing speed (words/min), heart rate (beats/min)." },
    { t: "h", text: "Speed, distance, and time" },
    { t: "rule", title: "Speed formulas", text: ["speed = distance ÷ time", "distance = speed × time", "time = distance ÷ speed"] },
    { t: "ex", title: "Distance", problem: "A cyclist rides at 18 km/h for 2.5 hours. How far does the cyclist go?", steps: ["distance = 18 × 2.5 = 45 km"], answer: "45 km." },
    { t: "ex", title: "Time", problem: "How long does a 120-km trip take at 60 km/h?", steps: ["time = 120 ÷ 60 = 2 hours"], answer: "2 hours." },
    { t: "ex", title: "Minutes to hours", problem: "A jeepney travels 12 km in 45 minutes. What is its speed in km/h?", steps: ["45 minutes = 45 ÷ 60 = 0.75 hour", "speed = 12 ÷ 0.75 = 16 km/h"], answer: "16 km/h." },
    { t: "h", text: "Unit price: finding the best buy" },
    { t: "rule", title: "Unit price", text: "unit price = price ÷ quantity" },
    { t: "ex", title: "Comparing packs", problem: "Shampoo: a 12-mL sachet costs ₱8 and a 180-mL bottle costs ₱95. Which is cheaper per millilitre?", steps: ["sachet: ₱8 ÷ 12 mL ≈ ₱0.67 per mL", "bottle: ₱95 ÷ 180 mL ≈ ₱0.53 per mL"], answer: "the bottle has the lower unit price." },
    { t: "p", text: "The lowest unit price is not always the best choice. A wise buyer also considers the budget for today, storage, and whether all of it will be used." },
    { t: "remember", items: ["A unit rate is “per one.”", "Change minutes to hours (÷ 60) before finding km/h.", "Compare prices using unit prices."] },
  ],
  exercises: [
    { title: "A. Skills Practice", items: [
      { q: "A car travels 240 km in 4 hours. What is its speed?", num: 60, unit: "km/h", solution: "240 ÷ 4 = 60 km/h." },
      { q: "A train runs at 72 km/h for 2.5 hours. How far does it travel?", num: 180, unit: "km", solution: "72 × 2.5 = 180 km." },
      { q: "How many hours does a 150-km trip take at 50 km/h?", num: 3, unit: "hours", solution: "150 ÷ 50 = 3 hours." },
      { q: "4 kg of mangoes cost ₱180. What is the price per kilogram?", num: 45, unit: "₱/kg", solution: "₱180 ÷ 4 = ₱45 per kg." },
      { q: "A faucet fills 24 liters in 6 minutes. What is the rate of flow?", num: 4, unit: "L/min", solution: "24 ÷ 6 = 4 L/min." },
      { q: "A student types 360 words in 8 minutes. What is the typing speed?", num: 45, unit: "words/min", solution: "360 ÷ 8 = 45 words per minute." },
      { q: "Change 2 m/s to km/h.", num: 7.2, unit: "km/h", solution: ["2 m/s = 2 × 3 600 = 7 200 m per hour", "7 200 m = 7.2 km, so 7.2 km/h"] },
      { q: "Which is cheaper per egg: 12 eggs for ₱96 or 30 eggs for ₱255?", choices: ["12 eggs for ₱96", "30 eggs for ₱255"], answer: "12 eggs for ₱96", solution: ["₱96 ÷ 12 = ₱8.00 per egg", "₱255 ÷ 30 = ₱8.50 per egg"] },
    ] },
    { title: "B. Problem Solving", items: [
      { q: "A jeepney travels 18 km in 45 minutes. What is its speed in km/h?", num: 24, unit: "km/h", solution: ["45 min = 0.75 h", "18 ÷ 0.75 = 24 km/h"] },
      { q: "Car A travels 180 km in 3 hours. Car B travels 250 km in 4 hours. Which car is faster?", choices: ["Car A", "Car B"], answer: "Car B", solution: ["Car A: 180 ÷ 3 = 60 km/h", "Car B: 250 ÷ 4 = 62.5 km/h"] },
      { q: "A worker earns ₱640 for 8 hours of work. What is the hourly rate?", num: 80, unit: "₱/hour", solution: "₱640 ÷ 8 = ₱80 per hour." },
      { q: "Which is the better buy: 200 mL of shampoo for ₱110 or 340 mL for ₱180?", choices: ["200 mL for ₱110", "340 mL for ₱180"], answer: "340 mL for ₱180", solution: ["₱110 ÷ 200 = ₱0.55 per mL", "₱180 ÷ 340 ≈ ₱0.53 per mL"] },
    ] },
    { title: "C. Challenge", items: [
      { q: "Two friends are 12 km apart and walk toward each other, one at 4 km/h and the other at 5 km/h. After how many MINUTES do they meet?", num: 80, unit: "minutes", solution: ["Together they close the gap at 4 + 5 = 9 km/h.", "time = 12 ÷ 9 = 4/3 hours = 80 minutes"] },
      { q: "An empty 135-L water tank is filled at 9 L/min. How many minutes will it take to fill?", num: 15, unit: "minutes", solution: "135 ÷ 9 = 15 minutes." },
    ] },
  ],
});
