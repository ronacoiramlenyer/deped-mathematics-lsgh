/* Term 2 · Lesson 1 · A. Converting Units of Measure – lesson and exercises */
Sim.addContent("lesson10", {
  learn: [
    { t: "h", text: "The metric system (SI)" },
    { t: "p", text: "The International System of Units (SI) uses one base unit for each kind of measure – the **metre** (length), the **gram** (mass), and the **litre** (capacity) – and prefixes that each stand for a power of 10." },
    { t: "table", head: ["kilo (k)", "hecto (h)", "deka (da)", "base", "deci (d)", "centi (c)", "milli (m)"], rows: [["1 000", "100", "10", "1", "0.1", "0.01", "0.001"], ["km", "hm", "dam", "m", "dm", "cm", "mm"]] },
    { t: "rule", title: "Converting within the metric system", text: ["larger unit → smaller unit: MULTIPLY by 10 for each step down", "smaller unit → larger unit: DIVIDE by 10 for each step up", "moving one step = moving the decimal point one place"] },
    { t: "ex", title: "Kilometres to metres", problem: "Convert 2.5 km to metres.", steps: ["km → m is 3 steps down.", "2.5 × 1 000 = 2 500"], answer: "2 500 m." },
    { t: "ex", title: "Centimetres to metres", problem: "Convert 350 cm to metres.", steps: ["cm → m is 2 steps up.", "350 ÷ 100 = 3.5"], answer: "3.5 m." },
    { t: "ex", title: "Mass and capacity", problem: "Convert 4.2 kg to grams and 750 mL to litres.", steps: ["kg → g: 4.2 × 1 000 = 4 200 g", "mL → L: 750 ÷ 1 000 = 0.75 L"], answer: "4 200 g and 0.75 L." },
    { t: "h", text: "Converting between systems" },
    { t: "p", text: "The English (customary) system uses inches, feet, miles, pounds, and gallons. To change between systems, multiply or divide by a **conversion factor**." },
    { t: "table", head: ["English unit", "Metric equivalent"], rows: [["1 inch (in)", "2.54 cm"], ["1 foot (ft) = 12 in", "30.48 cm = 0.3048 m"], ["1 mile (mi)", "≈ 1.609 km"], ["1 pound (lb)", "≈ 0.4536 kg (1 kg ≈ 2.2 lb)"], ["1 gallon (gal)", "≈ 3.785 L"]] },
    { t: "ex", title: "Inches to centimetres", problem: "A ruler is 12 inches long. How long is it in centimetres?", steps: ["12 × 2.54 = 30.48"], answer: "30.48 cm." },
    { t: "ex", title: "Is 5 km more than 3 miles?", problem: "Compare a 5-km fun run with a 3-mile run.", steps: ["3 mi × 1.609 = 4.827 km", "5 km > 4.827 km"], answer: "the 5-km run is longer." },
    { t: "remember", items: ["Down the metric staircase: multiply by 10 per step; up: divide by 10 per step.", "Across systems: multiply or divide by the conversion factor.", "Check your answer: a smaller unit needs a bigger number."] },
  ],
  exercises: [
    { title: "A. Skills Practice", items: [
      { q: "Convert 3.5 km to metres.", num: 3500, unit: "m", solution: "3.5 × 1 000 = 3 500 m." },
      { q: "Convert 250 cm to metres.", num: 2.5, tol: 1e-6, unit: "m", solution: "250 ÷ 100 = 2.5 m." },
      { q: "Convert 4.8 kg to grams.", num: 4800, unit: "g", solution: "4.8 × 1 000 = 4 800 g." },
      { q: "Convert 1 250 mL to litres.", num: 1.25, tol: 1e-6, unit: "L", solution: "1 250 ÷ 1 000 = 1.25 L." },
      { q: "Convert 6 m to millimetres.", num: 6000, unit: "mm", solution: "6 × 1 000 = 6 000 mm." },
      { q: "Convert 72 mm to centimetres.", num: 7.2, tol: 1e-6, unit: "cm", solution: "72 ÷ 10 = 7.2 cm." },
      { q: "Convert 10 inches to centimetres (1 in = 2.54 cm).", num: 25.4, tol: 1e-6, unit: "cm", solution: "10 × 2.54 = 25.4 cm." },
      { q: "Convert 2 gallons to litres (1 gal ≈ 3.785 L).", num: 7.57, tol: 0.001, unit: "L", solution: "2 × 3.785 = 7.57 L." },
    ] },
    { title: "B. Problem Solving", items: [
      { q: "A learner is 5 ft 2 in tall. What is the height in centimetres? (1 ft = 12 in, 1 in = 2.54 cm)", num: 157.48, tol: 0.001, unit: "cm", solution: ["5 ft 2 in = 5 × 12 + 2 = 62 in", "62 × 2.54 = 157.48 cm"] },
      { q: "Which is longer: a 5-km fun run or a 3-mile run? (1 mi ≈ 1.609 km)", choices: ["5-km run", "3-mile run", "They are equal"], answer: "5-km run", solution: ["3 × 1.609 = 4.827 km", "5 km > 4.827 km"] },
      { q: "A sack of rice has a mass of 25 kg. About how many pounds is that? (1 kg ≈ 2.2 lb)", num: 55, tol: 0.01, unit: "lb", solution: "25 × 2.2 = 55 lb." },
      { q: "How many 250-mL glasses can be filled from a 1.5-L bottle?", num: 6, unit: "glasses", solution: ["1.5 L = 1 500 mL", "1 500 ÷ 250 = 6"] },
    ] },
    { title: "C. Challenge", items: [
      { q: "How many centimetres are in 1 kilometre?", num: 100000, unit: "cm", solution: ["1 km = 1 000 m", "1 000 m × 100 = 100 000 cm"] },
      { q: "A car travels at 90 km per hour. How many metres does it travel per minute?", num: 1500, unit: "m/min", solution: ["90 km = 90 000 m", "90 000 m ÷ 60 min = 1 500 m per minute"] },
    ] },
  ],
});
