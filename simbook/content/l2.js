/* Lesson 2 · B. Angle Pairs and Classifying Polygons – lesson and exercises */
Sim.addContent("lesson2", {
  learn: [
    { t: "h", text: "Angle pairs" },
    { t: "p", text: "Some pairs of angles have special relationships based on their measures or their positions." },
    { t: "defs", items: [
      ["Complementary angles", "two angles whose measures add up to **90°**"],
      ["Supplementary angles", "two angles whose measures add up to **180°**"],
      ["Adjacent angles", "two angles with a common vertex and a common side, and no common interior points"],
      ["Linear pair", "two adjacent angles whose outer sides form a straight line; they are always **supplementary**"],
      ["Vertical angles", "the opposite angles formed when two lines intersect; they are always **equal**"],
    ] },
    { t: "rule", title: "Key facts", text: ["complement of x = 90° − x", "supplement of x = 180° − x", "angles on a straight line add to 180°", "angles around a point add to 360°"] },
    { t: "ex", title: "Complement and supplement", problem: "Find the complement and the supplement of 35°.", steps: [
      "Complement: 90° − 35° = 55°.",
      "Supplement: 180° − 35° = 145°.",
    ], answer: "55° and 145°." },
    { t: "ex", title: "Intersecting lines", problem: "Two lines intersect. One of the angles formed measures 40°. Find the other three angles.", steps: [
      "The angle vertical to 40° is also 40°.",
      "Each angle next to it forms a linear pair with it: 180° − 40° = 140°.",
    ], answer: "40°, 140°, and 140°." },
    { t: "ex", title: "Angles on a straight line", problem: "Three angles together form a straight line: 48°, 75°, and x. Find x.", steps: [
      "Angles on a straight line add up to 180°.",
      "x = 180° − 48° − 75° = 57°.",
    ], answer: "x = 57°." },
    { t: "h", text: "Classifying polygons" },
    { t: "p", text: "A polygon can be described in three ways at once:" },
    { t: "list", items: [
      "by its **number of sides** – triangle, quadrilateral, pentagon, hexagon, …",
      "as **regular** (all sides and all angles equal) or **irregular**",
      "as **convex** or **non-convex**",
    ] },
    { t: "defs", items: [
      ["Convex polygon", "every interior angle is less than 180°; every diagonal lies inside the polygon"],
      ["Non-convex polygon", "at least one interior angle is greater than 180°; at least one diagonal lies outside (also called concave)"],
    ] },
    { t: "ex", title: "Classify the polygon", problem: "The outline of a five-pointed star has 10 sides. Five of its angles point inward and measure 252° each. Classify it.", steps: [
      "10 sides → decagon.",
      "It has angles greater than 180° → non-convex.",
      "Its angles are not all equal → irregular.",
    ], answer: "an irregular, non-convex decagon." },
    { t: "remember", items: [
      "Complementary → 90°. Supplementary → 180°.",
      "Vertical angles are equal; a linear pair adds to 180°.",
      "One angle greater than 180° makes a polygon non-convex.",
    ] },
  ],
  exercises: [
    { title: "A. Skills Practice", items: [
      { q: "Find the complement of 37°.", num: 53, unit: "°", solution: "90° − 37° = 53°." },
      { q: "Find the supplement of 112°.", num: 68, unit: "°", solution: "180° − 112° = 68°." },
      { q: "Two lines intersect. One angle is 48°. What is the angle vertical to it?", num: 48, unit: "°", solution: "Vertical angles are equal." },
      { q: "One angle of a linear pair measures 133°. What is the other angle?", num: 47, unit: "°", solution: "180° − 133° = 47°." },
      { q: "Two complementary angles are equal. What is the measure of each?", num: 45, unit: "°", solution: "90° ÷ 2 = 45°." },
      { q: "Two angles are supplementary, and one is 4 times the other. What is the smaller angle?", num: 36, unit: "°", solution: ["Together they make 1 + 4 = 5 equal parts of 180°.", "180° ÷ 5 = 36°, so the angles are 36° and 144°."] },
      { q: "A hexagon has one interior angle of 200°. Is it convex or non-convex?", choices: ["Convex", "Non-convex"], answer: "Non-convex", solution: "An interior angle greater than 180° makes a polygon non-convex." },
      { q: "What do you call a polygon with 9 sides?", choices: ["heptagon", "octagon", "nonagon", "decagon"], answer: "nonagon", solution: "9 sides → nonagon." },
    ] },
    { title: "B. Problem Solving", items: [
      { q: "Four angles meet at a point: 90°, 110°, 75°, and x. Find x.", num: 85, unit: "°", solution: "360° − 90° − 110° − 75° = 85°." },
      { q: "Three angles form a straight line, and their measures are in the ratio 2 : 3 : 4. What is the largest angle?", num: 80, unit: "°", solution: ["2 + 3 + 4 = 9 parts make 180°, so each part is 20°.", "The angles are 40°, 60°, and 80°."] },
      { q: "A pair of open scissors forms an angle of 35° between its blades. What is the angle between one blade and the handle of the other blade (the angle next to it)?", num: 145, unit: "°", solution: ["The blades and handles form two intersecting lines.", "The angle next to 35° forms a linear pair with it: 180° − 35° = 145°."] },
      { q: "A pentagon has all sides equal and all angles equal to 108°. How is it classified?", choices: ["Regular and convex", "Regular and non-convex", "Irregular and convex", "Irregular and non-convex"], answer: "Regular and convex", solution: "Equal sides and equal angles → regular; every angle is less than 180° → convex." },
    ] },
    { title: "C. Challenge", items: [
      { q: "Two angles form a linear pair. One angle is 30° more than the other. What is the larger angle?", num: 105, unit: "°", solution: ["Remove the extra 30°: 180° − 30° = 150°.", "Split it equally: 150° ÷ 2 = 75° for the smaller angle.", "The larger angle is 75° + 30° = 105°."] },
      { q: "Can a triangle be non-convex? Explain.", open: true, solution: ["No. The angles of a triangle add up to 180°, so no single angle can be greater than 180°.", "Without a reflex angle, a triangle is always convex."] },
    ] },
  ],
});
