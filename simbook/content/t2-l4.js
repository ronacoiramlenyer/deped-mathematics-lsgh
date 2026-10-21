/* Term 2 · Lesson 4 · D. Sets, Subsets, Union, and Intersection – lesson and exercises */
Sim.addContent("lesson13", {
  learn: [
    { t: "h", text: "Sets and elements" },
    { t: "p", text: "A **set** is a well-defined collection of objects called **elements**. We name sets with capital letters and list elements inside braces: A = {2, 4, 6, 8}. The symbol ∈ means “is an element of”: 4 ∈ A, but 5 ∉ A." },
    { t: "defs", items: [
      ["Roster method", "listing the elements: B = {a, e, i, o, u}"],
      ["Rule method", "describing the elements: B = {x | x is a vowel}"],
      ["Empty set", "a set with no elements, written { } or ∅"],
      ["Universal set U", "the set of all elements being considered"],
      ["n(A)", "the number of elements of set A"],
    ] },
    { t: "h", text: "Subsets" },
    { t: "rule", title: "Subset", text: ["A ⊆ B means every element of A is also an element of B.", "The empty set is a subset of every set; every set is a subset of itself."] },
    { t: "ex", title: "Is it a subset?", problem: "Let P = {2, 4} and Q = {1, 2, 3, 4}. Is P ⊆ Q? Is Q ⊆ P?", steps: ["2 and 4 are both in Q, so P ⊆ Q.", "1 is in Q but not in P, so Q is not a subset of P."], answer: "P ⊆ Q, but Q ⊄ P." },
    { t: "h", text: "Union, intersection, and complement" },
    { t: "defs", items: [
      ["Union A ∪ B", "all elements that are in A, or in B, or in both"],
      ["Intersection A ∩ B", "only the elements that are in both A and B"],
      ["Complement A′", "the elements of U that are not in A"],
      ["Disjoint sets", "sets with no common elements: A ∩ B = ∅"],
    ] },
    { t: "ex", title: "Finding union and intersection", problem: "U = {1, 2, …, 10}, A = {2, 4, 6, 8, 10}, B = {1, 2, 3, 4, 5}. Find A ∪ B, A ∩ B, and A′.", steps: ["A ∪ B = {1, 2, 3, 4, 5, 6, 8, 10}", "A ∩ B = {2, 4}", "A′ = {1, 3, 5, 7, 9}"], answer: "as shown; n(A ∪ B) = 8, n(A ∩ B) = 2." },
    { t: "rule", title: "Counting the union", text: "n(A ∪ B) = n(A) + n(B) − n(A ∩ B)" },
    { t: "ex", title: "A survey with a Venn diagram", problem: "Of 40 learners, 25 like basketball, 20 like volleyball, and 10 like both. How many like only basketball, only volleyball, either sport, and neither?", steps: ["Both: 10 (the overlap).", "Only basketball: 25 − 10 = 15. Only volleyball: 20 − 10 = 10.", "Either sport: 15 + 10 + 10 = 35. Neither: 40 − 35 = 5."], answer: "15, 10, 35, and 5." },
    { t: "remember", items: ["∪ = or (everything); ∩ = and (only the overlap).", "A ⊆ B when all of A is inside B.", "Fill the overlap of a Venn diagram first."] },
  ],
  exercises: [
    { title: "A. Skills Practice", items: [
      { q: "A = {1, 3, 5, 7} and B = {3, 4, 5, 6}. How many elements are in A ∩ B?", num: 2, solution: "A ∩ B = {3, 5}, so 2 elements." },
      { q: "For the same sets, how many elements are in A ∪ B?", num: 6, solution: "A ∪ B = {1, 3, 4, 5, 6, 7}, so 6 elements." },
      { q: "Is {2, 4} a subset of {1, 2, 3, 4}?", choices: ["Yes", "No"], answer: "Yes", solution: "Both 2 and 4 are in {1, 2, 3, 4}." },
      { q: "Is the empty set a subset of every set?", choices: ["Yes", "No"], answer: "Yes", solution: "The empty set has no element that could be missing from another set." },
      { q: "U = {1, 2, …, 10} and A = {1, 2, 3, 4}. How many elements are in A′?", num: 6, solution: "A′ = {5, 6, 7, 8, 9, 10}, so 6 elements." },
      { q: "Is 7 an element of the set of multiples of 3?", choices: ["Yes", "No"], answer: "No", solution: "7 is not divisible by 3." },
      { q: "How many elements does {x | x is a vowel in the English alphabet} have?", num: 5, solution: "{a, e, i, o, u} has 5 elements." },
      { q: "How many subsets does {a, b} have?", num: 4, solution: "∅, {a}, {b}, and {a, b} – 4 subsets." },
    ] },
    { title: "B. Problem Solving", items: [
      { q: "Of 40 learners, 25 like basketball, 20 like volleyball, and 10 like both. How many like only basketball?", num: 15, solution: "25 − 10 = 15." },
      { q: "In the same survey, how many like neither sport?", num: 5, solution: ["Either sport: 15 + 10 + 10 = 35", "Neither: 40 − 35 = 5"] },
      { q: "n(A) = 12, n(B) = 9, and n(A ∩ B) = 4. Find n(A ∪ B).", num: 17, solution: "12 + 9 − 4 = 17." },
      { q: "From 1 to 20, are the even numbers and the odd numbers disjoint sets?", choices: ["Yes", "No"], answer: "Yes", solution: "No number is both even and odd, so their intersection is empty." },
    ] },
    { title: "C. Challenge", items: [
      { q: "How many subsets does {1, 2, 3} have?", num: 8, solution: ["∅; {1}, {2}, {3}; {1, 2}, {1, 3}, {2, 3}; {1, 2, 3}", "8 subsets (= 2³)"] },
      { q: "n(A ∪ B) = 30, n(A) = 18, and n(B) = 20. Find n(A ∩ B).", num: 8, solution: ["30 = 18 + 20 − n(A ∩ B)", "n(A ∩ B) = 38 − 30 = 8"] },
    ] },
  ],
});
