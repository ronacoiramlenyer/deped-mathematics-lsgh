/* Term 2 · Lesson 2 · B. Volume of a Cylinder – lesson and exercises */
Sim.addContent("lesson11", {
  learn: [
    { t: "h", text: "What is a cylinder?" },
    { t: "p", text: "A **cylinder** is a solid with two parallel, equal circular bases joined by a curved surface. Its size is described by the **radius r** of its base and its **height h** (the distance between the bases)." },
    { t: "defs", items: [["Radius r", "the distance from the centre of the base to its edge"], ["Diameter d", "twice the radius: d = 2r"], ["Height h", "the perpendicular distance between the two bases"], ["Volume", "the amount of space inside a solid, measured in cubic units (cm³, m³)"]] },
    { t: "h", text: "From the area of a circle to the volume of a cylinder" },
    { t: "p", text: "Think of a cylinder as a stack of identical circles, like a stack of coins. The area of each circle is πr². Stacking circles up to a height h fills a volume of (area of base) × (height)." },
    { t: "rule", title: "Volume of a cylinder", text: ["V = B × h = πr²h", "Use π ≈ 3.14 unless told otherwise."] },
    { t: "ex", title: "Using the radius", problem: "Find the volume of a cylinder with radius 3 cm and height 5 cm.", steps: ["V = πr²h = 3.14 × 3² × 5", "= 3.14 × 9 × 5 = 141.3"], answer: "141.3 cm³." },
    { t: "ex", title: "Using the diameter", problem: "A can has a diameter of 10 cm and a height of 8 cm. Find its volume.", steps: ["r = 10 ÷ 2 = 5 cm", "V = 3.14 × 5² × 8 = 3.14 × 25 × 8 = 628"], answer: "628 cm³." },
    { t: "ex", title: "A water tank", problem: "A cylindrical tank has a radius of 1 m and a height of 2 m. How many litres can it hold? (1 m³ = 1 000 L)", steps: ["V = 3.14 × 1² × 2 = 6.28 m³", "6.28 × 1 000 = 6 280 L"], answer: "6 280 L." },
    { t: "p", text: "Because the radius is **squared**, doubling the radius makes the volume 4 times as large, while doubling the height only doubles it." },
    { t: "remember", items: ["V = πr²h.", "Halve the diameter to get the radius.", "1 cm³ = 1 mL and 1 m³ = 1 000 L."] },
  ],
  exercises: [
    { title: "A. Skills Practice", note: "Use π ≈ 3.14.", items: [
      { q: "Find the volume of a cylinder with radius 2 cm and height 5 cm.", num: 62.8, tol: 0.001, unit: "cm³", solution: "3.14 × 2² × 5 = 3.14 × 4 × 5 = 62.8 cm³." },
      { q: "Find the volume of a cylinder with radius 4 cm and height 10 cm.", num: 502.4, tol: 0.001, unit: "cm³", solution: "3.14 × 16 × 10 = 502.4 cm³." },
      { q: "Find the volume of a cylinder with radius 1 cm and height 7 cm.", num: 21.98, tol: 0.001, unit: "cm³", solution: "3.14 × 1 × 7 = 21.98 cm³." },
      { q: "A cylinder has a diameter of 6 cm and a height of 4 cm. Find its volume.", num: 113.04, tol: 0.001, unit: "cm³", solution: ["r = 3 cm", "3.14 × 9 × 4 = 113.04 cm³"] },
      { q: "A cylinder has a diameter of 10 cm and a height of 3 cm. Find its volume.", num: 235.5, tol: 0.001, unit: "cm³", solution: ["r = 5 cm", "3.14 × 25 × 3 = 235.5 cm³"] },
      { q: "Find the area of the base of a cylinder with radius 5 cm.", num: 78.5, tol: 0.001, unit: "cm²", solution: "3.14 × 5² = 78.5 cm²." },
      { q: "A cylinder has a base area of 50 cm² and a height of 6 cm. Find its volume.", num: 300, unit: "cm³", solution: "V = B × h = 50 × 6 = 300 cm³." },
      { q: "Find the volume of a cylinder with radius 10 cm and height 1 cm.", num: 314, unit: "cm³", solution: "3.14 × 100 × 1 = 314 cm³." },
    ] },
    { title: "B. Problem Solving", items: [
      { q: "A can of sardines has a radius of 3.5 cm and a height of 10 cm. Find its volume.", num: 384.65, tol: 0.001, unit: "cm³", solution: "3.14 × 3.5² × 10 = 3.14 × 12.25 × 10 = 384.65 cm³." },
      { q: "A water tank has a radius of 2 m and a height of 3 m. How many litres can it hold? (1 m³ = 1 000 L)", num: 37680, unit: "L", solution: ["V = 3.14 × 2² × 3 = 37.68 m³", "37.68 × 1 000 = 37 680 L"] },
      { q: "A glass has a radius of 3 cm and a height of 10 cm. How many millilitres of juice can it hold? (1 cm³ = 1 mL)", num: 282.6, tol: 0.001, unit: "mL", solution: "3.14 × 9 × 10 = 282.6 cm³ = 282.6 mL." },
      { q: "Which holds more: Cylinder P (r = 4 cm, h = 9 cm) or Cylinder Q (r = 6 cm, h = 4 cm)?", choices: ["Cylinder P", "Cylinder Q", "They hold the same"], answer: "They hold the same", solution: ["P: 3.14 × 16 × 9 = 452.16 cm³", "Q: 3.14 × 36 × 4 = 452.16 cm³"] },
    ] },
    { title: "C. Challenge", items: [
      { q: "The radius of a cylinder is tripled while its height stays the same. The new volume is how many times the old volume?", num: 9, solution: "The radius is squared: 3² = 9." },
      { q: "A cylinder has a volume of 314 cm³ and a radius of 5 cm. What is its height?", num: 4, unit: "cm", solution: ["314 = 3.14 × 25 × h = 78.5 × h", "h = 314 ÷ 78.5 = 4 cm"] },
    ] },
  ],
});
