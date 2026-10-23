/* Lesson 1 · A. Drawing Polygons – lesson and exercises */
Sim.addContent("lesson1", {
  learn: [
    { t: "h", text: "What is a polygon?" },
    { t: "p", text: "A **polygon** is a closed plane figure made of three or more line segments. The segments are its **sides**; they meet only at their endpoints, which are its **vertices**." },
    { t: "defs", items: [
      ["Side", "a line segment that forms part of the polygon"],
      ["Vertex", "a point where two sides meet (plural: vertices)"],
      ["Interior angle", "the angle inside the polygon formed by two sides that meet at a vertex"],
      ["Diagonal", "a segment joining two vertices that are not next to each other"],
    ] },
    { t: "p", text: "A circle is **not** a polygon (it is curved), and an open figure is **not** a polygon (it is not closed)." },
    { t: "h", text: "Naming polygons" },
    { t: "table", head: ["Sides", "Name", "Sides", "Name"], rows: [["3", "triangle", "7", "heptagon"], ["4", "quadrilateral", "8", "octagon"], ["5", "pentagon", "9", "nonagon"], ["6", "hexagon", "10", "decagon"]] },
    { t: "h", text: "Regular and irregular polygons" },
    { t: "rule", title: "Definition", text: "A regular polygon has ALL sides equal AND ALL angles equal." },
    { t: "p", text: "If even one side or one angle is different, the polygon is **irregular**. A rhombus has equal sides but unequal angles, so it is irregular. A rectangle has equal angles but unequal sides, so it is also irregular. A square is a regular quadrilateral." },
    { t: "h", text: "Measuring an angle with a protractor" },
    { t: "steps", items: [
      "Place the centre mark of the protractor on the vertex of the angle.",
      "Line up the baseline (0° line) with one side of the angle.",
      "Read the scale that starts at 0° on that side, where the other side crosses it.",
      "Check your reading: is the angle smaller than a right angle (acute) or bigger (obtuse)?",
    ] },
    { t: "h", text: "Drawing a regular polygon" },
    { t: "p", text: "To draw a regular polygon, you need its side length and the measure of each interior angle:" },
    { t: "table", head: ["Regular polygon", "Pentagon", "Hexagon", "Octagon", "Decagon"], rows: [["Each interior angle", "108°", "120°", "135°", "144°"]] },
    { t: "ex", title: "Drawing a regular hexagon", problem: "Draw a regular hexagon with sides of 4 cm.", steps: [
      "Draw side AB = 4 cm with a ruler.",
      "At B, use the protractor to mark an angle of 120°. Draw BC = 4 cm along that mark.",
      "Repeat at C, D, and E: mark 120°, then draw 4 cm.",
      "The sixth side should end exactly at A. If it does not, re-check your angles.",
    ], answer: "a closed figure with six 4-cm sides and six 120° angles." },
    { t: "ex", title: "A triangle from two angles", problem: "Draw triangle ABC with AB = 6 cm, ∠A = 50°, and ∠B = 60°. What will ∠C measure?", steps: [
      "Draw AB = 6 cm. Mark 50° at A and 60° at B, and draw the two rays.",
      "The rays meet at C.",
      "The angles of a triangle add up to 180°, so ∠C = 180° − 50° − 60° = 70°.",
    ], answer: "∠C = 70°." },
    { t: "ex", title: "Regular or irregular?", problem: "A hexagon has all sides equal to 3 cm, but its angles are 100°, 140°, 120°, 100°, 140°, and 120°. Is it regular?", steps: [
      "Check the sides: all equal. ✓",
      "Check the angles: not all equal. ✗",
      "A regular polygon needs both.",
    ], answer: "irregular." },
    { t: "remember", items: [
      "A polygon is closed and made of straight sides.",
      "Regular means equal sides AND equal angles.",
      "The angles of a triangle add up to 180°; the angles of a quadrilateral add up to 360°.",
    ] },
  ],
  exercises: [
    { title: "A. Skills Practice", items: [
      { q: "What do you call a polygon with 8 sides?", choices: ["hexagon", "heptagon", "octagon", "decagon"], answer: "octagon", solution: "8 sides → octagon." },
      { q: "How many sides does a decagon have?", num: 10, solution: "“Deca” means ten." },
      { q: "Is a circle a polygon?", choices: ["Yes", "No"], answer: "No", solution: "A polygon is made of straight line segments; a circle is curved." },
      { q: "A quadrilateral has all sides 5 cm and angles of 60°, 120°, 60°, and 120°. Is it regular or irregular?", choices: ["Regular", "Irregular"], answer: "Irregular", solution: ["The sides are equal, but the angles are not.", "It is a rhombus – an irregular quadrilateral."] },
      { q: "What interior angle do you mark at each vertex to draw a regular hexagon?", num: 120, unit: "°", solution: "Each interior angle of a regular hexagon is 120°." },
      { q: "What interior angle do you mark at each vertex to draw a regular pentagon?", num: 108, unit: "°", solution: "Each interior angle of a regular pentagon is 108°." },
      { q: "Two angles of a triangle measure 45° and 65°. What is the third angle?", num: 70, unit: "°", solution: "180° − 45° − 65° = 70°." },
      { q: "Three angles of a quadrilateral measure 90°, 85°, and 100°. What is the fourth angle?", num: 85, unit: "°", solution: "360° − 90° − 85° − 100° = 85°." },
    ] },
    { title: "B. Problem Solving", items: [
      { q: "A regular octagon has a perimeter of 40 cm. How long is each side?", num: 5, unit: "cm", solution: ["An octagon has 8 equal sides.", "40 ÷ 8 = 5 cm."] },
      { q: "A STOP sign is a regular octagon with sides of 25 cm. What is its perimeter?", num: 200, unit: "cm", solution: "8 × 25 = 200 cm." },
      { q: "A carpenter cuts a regular decagon-shaped table top with sides of 6 dm. How much edge trim is needed to go all the way around?", num: 60, unit: "dm", solution: "10 × 6 = 60 dm." },
      { q: "Ana draws a pentagon with five 3-cm sides. Four angles measure 108°, but the fifth measures 110°. Is the pentagon regular?", choices: ["Regular", "Irregular"], answer: "Irregular", solution: "All sides are equal, but not all angles are equal, so it is irregular." },
    ] },
    { title: "C. Challenge", items: [
      { q: "A regular hexagon is made of 6 identical triangles that meet at its centre. What angle does each triangle make at the centre?", num: 60, unit: "°", solution: ["The 6 angles at the centre fill a full turn of 360°.", "360° ÷ 6 = 60°."] },
      { q: "Explain why the angles of a regular polygon must be drawn accurately for the last side to close.", open: true, solution: ["Each angle sets the direction of the next side.", "A small error at one corner changes the direction of every side after it, so the last side misses the starting point."] },
    ] },
  ],
});
