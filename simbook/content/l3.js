/* Lesson 3 · C. Angles of Polygons – lesson and exercises */
Sim.addContent("lesson3", {
  learn: [
    { t: "h", text: "Interior and exterior angles" },
    { t: "p", text: "An **exterior angle** of a polygon is formed by one side and the extension of the side next to it. The exterior angle and the interior angle beside it form a linear pair." },
    { t: "rule", title: "Exterior angle and adjacent interior angle", text: "exterior angle + adjacent interior angle = 180°" },
    { t: "ex", title: "Finding an exterior angle", problem: "An interior angle of a polygon measures 135°. Find the exterior angle beside it.", steps: ["exterior = 180° − 135° = 45°"], answer: "45°." },
    { t: "h", text: "The sum of the interior angles" },
    { t: "p", text: "Draw every diagonal from one vertex of a polygon with n sides. The diagonals split it into **n − 2 triangles**, and the angles of each triangle add up to 180°." },
    { t: "table", head: ["Polygon", "Sides n", "Triangles", "Sum of interior angles"], rows: [
      ["triangle", "3", "1", "180°"], ["quadrilateral", "4", "2", "360°"], ["pentagon", "5", "3", "540°"], ["hexagon", "6", "4", "720°"], ["octagon", "8", "6", "1 080°"], ["decagon", "10", "8", "1 440°"]] },
    { t: "rule", title: "Interior-angle sum", text: "S = (n − 2) × 180°" },
    { t: "ex", title: "Missing angle of an irregular polygon", problem: "A pentagon has angles of 100°, 110°, 95°, and 120°. Find the fifth angle.", steps: [
      "Sum of the angles of a pentagon: (5 − 2) × 180° = 540°.",
      "Known angles: 100° + 110° + 95° + 120° = 425°.",
      "Fifth angle: 540° − 425° = 115°.",
    ], answer: "115°." },
    { t: "h", text: "The sum of the exterior angles" },
    { t: "p", text: "Walking around a convex polygon, you turn through each exterior angle once and end facing the way you started – one full turn." },
    { t: "rule", title: "Exterior-angle sum", text: "The exterior angles of any convex polygon (one at each vertex) add up to 360°." },
    { t: "h", text: "Regular polygons" },
    { t: "rule", title: "Each angle of a regular polygon with n sides", text: ["each exterior angle = 360° ÷ n", "each interior angle = 180° − exterior angle = (n − 2) × 180° ÷ n", "number of sides n = 360° ÷ exterior angle"] },
    { t: "ex", title: "The STOP sign", problem: "Find each exterior and interior angle of a regular octagon.", steps: ["exterior = 360° ÷ 8 = 45°", "interior = 180° − 45° = 135°"], answer: "45° and 135°." },
    { t: "ex", title: "Finding the number of sides", problem: "Each interior angle of a regular polygon is 140°. How many sides does it have?", steps: ["exterior = 180° − 140° = 40°", "n = 360° ÷ 40° = 9"], answer: "9 sides (a nonagon)." },
    { t: "ex", title: "Why honeycombs use hexagons", problem: "Can regular hexagons fit around a point with no gaps? Can regular pentagons?", steps: [
      "Around a point the angles must add up to 360°.",
      "Hexagons: 3 × 120° = 360° – they fit exactly.",
      "Pentagons: 360° ÷ 108° ≈ 3.33 – not a whole number, so gaps appear.",
    ], answer: "hexagons tile; pentagons do not." },
    { t: "remember", items: [
      "Interior-angle sum: (n − 2) × 180°.",
      "Exterior-angle sum: 360°.",
      "Interior + exterior at the same vertex = 180°.",
    ] },
  ],
  exercises: [
    { title: "A. Skills Practice", items: [
      { q: "Find the sum of the interior angles of a heptagon (7 sides).", num: 900, unit: "°", solution: "(7 − 2) × 180° = 900°." },
      { q: "Find the sum of the interior angles of a decagon.", num: 1440, unit: "°", solution: "(10 − 2) × 180° = 1 440°." },
      { q: "Find each interior angle of a regular octagon.", num: 135, unit: "°", solution: ["exterior = 360° ÷ 8 = 45°", "interior = 180° − 45° = 135°"] },
      { q: "Find each exterior angle of a regular dodecagon (12 sides).", num: 30, unit: "°", solution: "360° ÷ 12 = 30°." },
      { q: "An interior angle of a polygon is 150°. What is the exterior angle beside it?", num: 30, unit: "°", solution: "180° − 150° = 30°." },
      { q: "Each exterior angle of a regular polygon is 40°. How many sides does it have?", num: 9, solution: "360° ÷ 40° = 9." },
      { q: "Each interior angle of a regular polygon is 144°. How many sides does it have?", num: 10, solution: ["exterior = 180° − 144° = 36°", "n = 360° ÷ 36° = 10"] },
      { q: "The interior angles of a polygon add up to 1 260°. How many sides does it have?", num: 9, solution: ["(n − 2) × 180° = 1 260°", "n − 2 = 1 260 ÷ 180 = 7, so n = 9"] },
    ] },
    { title: "B. Problem Solving", items: [
      { q: "A pentagon has angles of 110°, 95°, 100°, 120°, and x. Find x.", num: 115, unit: "°", solution: ["The sum is 540°.", "x = 540° − (110° + 95° + 100° + 120°) = 540° − 425° = 115°."] },
      { q: "Five angles of a hexagon measure 125° each. What is the sixth angle?", num: 95, unit: "°", solution: ["The sum is (6 − 2) × 180° = 720°.", "720° − 5 × 125° = 720° − 625° = 95°."] },
      { q: "A floor is tiled with regular hexagons. How many hexagons meet at each corner point?", num: 3, solution: "360° ÷ 120° = 3." },
      { q: "Can regular octagons alone cover a floor with no gaps?", choices: ["Yes", "No"], answer: "No", solution: ["Each interior angle is 135°.", "Two make 270° (a gap); three make 405° (an overlap). 360° ÷ 135° is not a whole number."] },
    ] },
    { title: "C. Challenge", items: [
      { q: "Each interior angle of a regular polygon is 4 times its exterior angle. How many sides does it have?", num: 10, solution: ["interior + exterior = 180°, and interior = 4 × exterior, so 5 × exterior = 180°.", "exterior = 36°, so n = 360° ÷ 36° = 10."] },
      { q: "Some floors use one square and two regular octagons at every corner point. What is the sum of the three angles that meet at each point?", num: 360, unit: "°", solution: ["square: 90°; each octagon: 135°", "90° + 135° + 135° = 360° – so the pattern fits with no gaps."] },
    ] },
  ],
});
