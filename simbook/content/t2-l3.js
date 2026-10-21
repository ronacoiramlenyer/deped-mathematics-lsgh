/* Term 2 · Lesson 3 · C. Volume of Square and Rectangular Pyramids – lesson and exercises */
Sim.addContent("lesson12", {
  learn: [
    { t: "h", text: "Pyramids" },
    { t: "p", text: "A **pyramid** has a polygon for its base and triangular faces that meet at one point, the **apex**. A **square pyramid** has a square base; a **rectangular pyramid** has a rectangular base. The **height** is the perpendicular distance from the apex to the base." },
    { t: "h", text: "Pyramids and prisms" },
    { t: "p", text: "Take a rectangular prism and a pyramid with the same base and the same height. Filling the pyramid with sand and pouring it into the prism three times fills the prism exactly." },
    { t: "rule", title: "Volume of a pyramid", text: ["V = ⅓ × B × h", "square pyramid: B = s²  →  V = ⅓ s² h", "rectangular pyramid: B = l × w  →  V = ⅓ l w h"] },
    { t: "ex", title: "Square pyramid", problem: "Find the volume of a square pyramid with base edge 6 cm and height 9 cm.", steps: ["B = 6² = 36 cm²", "V = ⅓ × 36 × 9 = 108"], answer: "108 cm³." },
    { t: "ex", title: "Rectangular pyramid", problem: "Find the volume of a rectangular pyramid with base 8 cm by 5 cm and height 12 cm.", steps: ["B = 8 × 5 = 40 cm²", "V = ⅓ × 40 × 12 = 160"], answer: "160 cm³." },
    { t: "ex", title: "Estimating", problem: "Estimate the volume of a pyramid with base 9 cm by 7 cm and height 10 cm.", steps: ["The box around it: 9 × 7 × 10 = 630 cm³", "The pyramid is one-third of the box: about 630 ÷ 3 = 210"], answer: "about 210 cm³." },
    { t: "ex", title: "The Great Pyramid", problem: "The Great Pyramid of Giza has a square base of about 230 m and a height of about 147 m. Estimate its volume.", steps: ["B = 230² = 52 900 m²", "V = ⅓ × 52 900 × 147 = 2 592 100"], answer: "about 2 592 100 m³." },
    { t: "remember", items: ["V(pyramid) = ⅓ × V(prism with the same base and height).", "Find the base area first, then multiply by the height and divide by 3."] },
  ],
  exercises: [
    { title: "A. Skills Practice", items: [
      { q: "Find the volume of a square pyramid with base edge 4 cm and height 6 cm.", num: 32, unit: "cm³", solution: "⅓ × 4² × 6 = ⅓ × 16 × 6 = 32 cm³." },
      { q: "Find the volume of a square pyramid with base edge 9 cm and height 10 cm.", num: 270, unit: "cm³", solution: "⅓ × 81 × 10 = 270 cm³." },
      { q: "Find the volume of a rectangular pyramid with base 6 cm by 4 cm and height 5 cm.", num: 40, unit: "cm³", solution: "⅓ × 24 × 5 = 40 cm³." },
      { q: "Find the volume of a rectangular pyramid with base 10 cm by 3 cm and height 8 cm.", num: 80, unit: "cm³", solution: "⅓ × 30 × 8 = 80 cm³." },
      { q: "A prism has a volume of 120 cm³. What is the volume of a pyramid with the same base and height?", num: 40, unit: "cm³", solution: "120 ÷ 3 = 40 cm³." },
      { q: "A pyramid has a base area of 45 cm² and a height of 4 cm. Find its volume.", num: 60, unit: "cm³", solution: "⅓ × 45 × 4 = 60 cm³." },
      { q: "Find the volume of a square pyramid with base edge 5 cm and height 12 cm.", num: 100, unit: "cm³", solution: "⅓ × 25 × 12 = 100 cm³." },
      { q: "Find the volume of a rectangular pyramid with base 7 cm by 6 cm and height 9 cm.", num: 126, unit: "cm³", solution: "⅓ × 42 × 9 = 126 cm³." },
    ] },
    { title: "B. Problem Solving", items: [
      { q: "A camping tent is shaped like a square pyramid with base edge 3 m and height 2 m. How much space is inside?", num: 6, unit: "m³", solution: "⅓ × 9 × 2 = 6 m³." },
      { q: "A glass paperweight is a square pyramid with base edge 6 cm and height 5 cm. Find its volume.", num: 60, unit: "cm³", solution: "⅓ × 36 × 5 = 60 cm³." },
      { q: "A square pyramid has a volume of 96 cm³ and a base edge of 6 cm. What is its height?", num: 8, unit: "cm", solution: ["96 = ⅓ × 36 × h = 12h", "h = 96 ÷ 12 = 8 cm"] },
      { q: "How many pyramids filled with sand are needed to fill a box with the same base and height?", num: 3, solution: "V(pyramid) = ⅓ V(box), so 3 pyramids fill the box." },
    ] },
    { title: "C. Challenge", items: [
      { q: "A cube has edges of 6 cm. A square pyramid has base edge 6 cm and height 18 cm. Find the volume of the pyramid.", num: 216, unit: "cm³", solution: ["⅓ × 36 × 18 = 216 cm³", "That equals the cube’s volume, 6³ = 216 cm³ – the pyramid is 3 times as tall."] },
      { q: "Estimate the volume of the Great Pyramid: square base about 230 m and height about 147 m.", num: 2592100, tol: 1, unit: "m³", solution: ["B = 230² = 52 900 m²", "⅓ × 52 900 × 147 = 2 592 100 m³"] },
    ] },
  ],
});
