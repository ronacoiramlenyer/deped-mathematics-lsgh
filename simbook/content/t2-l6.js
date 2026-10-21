/* Term 2 · Lesson 6 · F. Data Collection and Sampling – lesson and exercises */
Sim.addContent("lesson15", {
  learn: [
    { t: "h", text: "Populations and samples" },
    { t: "defs", items: [
      ["Population", "the whole group you want to learn about"],
      ["Census", "collecting data from every member of the population"],
      ["Sample", "a part of the population that is actually studied"],
      ["Bias", "a flaw that makes a sample give results that are not typical of the population"],
    ] },
    { t: "h", text: "Ways to collect data" },
    { t: "defs", items: [
      ["Survey", "asking many people the same questions using a form or poll"],
      ["Interview", "asking one person detailed questions face to face"],
      ["Observation", "watching and recording what happens"],
      ["Experiment", "changing one condition and measuring the result"],
      ["Existing records", "using data already collected, such as PAGASA or school records"],
    ] },
    { t: "h", text: "Sampling techniques" },
    { t: "defs", items: [
      ["Simple random", "every member has the same chance – drawing names from a box"],
      ["Systematic", "choosing every k-th member of a list, where k = N ÷ n"],
      ["Stratified", "dividing the population into groups (strata) and sampling from each group"],
      ["Convenience", "choosing whoever is easy to reach – often biased"],
    ] },
    { t: "ex", title: "Systematic sampling", problem: "Choose 40 learners out of 400 using systematic sampling.", steps: ["k = 400 ÷ 40 = 10", "Pick a random start from 1 to 10, say 7.", "Choose learners 7, 17, 27, 37, … on the list."], answer: "every 10th learner." },
    { t: "ex", title: "Proportional stratified sampling", problem: "A school has 600 learners; 240 are in Grade 7. How many Grade 7 learners belong in a stratified sample of 50?", steps: ["Grade 7 share: 240 ÷ 600 = 0.4", "0.4 × 50 = 20"], answer: "20 Grade 7 learners." },
    { t: "ex", title: "Estimating from a sample", problem: "In a random sample of 50 learners, 18 walk to school. Estimate how many of 800 learners walk.", steps: ["18 ÷ 50 = 0.36 = 36%", "0.36 × 800 = 288"], answer: "about 288 learners." },
    { t: "remember", items: ["Choose the sample fairly so every member could be chosen.", "Bigger random samples give more reliable estimates.", "Convenience samples are easy but often biased."] },
  ],
  exercises: [
    { title: "A. Skills Practice", items: [
      { q: "Asking every Grade 7 learner in the school about their favourite subject is a…", choices: ["Census", "Sample"], answer: "Census", solution: "Every member of the population is asked." },
      { q: "Giving 100 learners the same printed questionnaire is a…", choices: ["Survey", "Interview", "Observation", "Experiment"], answer: "Survey", solution: "Many people answer the same questions." },
      { q: "Counting cars passing the gate for 10 minutes is…", choices: ["Survey", "Interview", "Observation", "Experiment"], answer: "Observation", solution: "Data is collected by watching." },
      { q: "Choosing every 5th name on the class list is…", choices: ["Simple random", "Systematic", "Stratified", "Convenience"], answer: "Systematic", solution: "Every k-th member is chosen." },
      { q: "Drawing 30 names from a box containing all names is…", choices: ["Simple random", "Systematic", "Stratified", "Convenience"], answer: "Simple random", solution: "Everyone has the same chance." },
      { q: "Choosing 5 learners from each of 8 sections is…", choices: ["Simple random", "Systematic", "Stratified", "Convenience"], answer: "Stratified", solution: "The population is split into groups and each group is sampled." },
      { q: "Asking the first 30 learners in the canteen line is…", choices: ["Simple random", "Systematic", "Stratified", "Convenience"], answer: "Convenience", solution: "Only easy-to-reach learners are chosen." },
      { q: "To choose 30 learners out of 600 systematically, you pick every k-th learner. What is k?", num: 20, solution: "k = 600 ÷ 30 = 20." },
    ] },
    { title: "B. Problem Solving", items: [
      { q: "You want to know how Grade 7 learners get to school. Which sample is MOST likely to be biased?", choices: ["30 names drawn from all Grade 7 learners", "Every 10th Grade 7 learner on the list", "The 30 learners who arrive first by school bus", "3 learners from each Grade 7 section"], answer: "The 30 learners who arrive first by school bus", solution: "It only includes bus riders, so it does not represent everyone." },
      { q: "A school has 3 grade levels with 200 learners each. A stratified sample of 60 takes the same number from each level. How many from each level?", num: 20, solution: "60 ÷ 3 = 20." },
      { q: "In a random sample of 50 learners, 18 walk to school. What percent of the sample walks?", num: 36, unit: "%", solution: "18 ÷ 50 = 0.36 = 36%." },
      { q: "Using that sample, estimate how many of 800 learners walk to school.", num: 288, solution: "36% × 800 = 288." },
    ] },
    { title: "C. Challenge", items: [
      { q: "A school has 600 learners; 240 are in Grade 7. How many Grade 7 learners should be in a proportional stratified sample of 50?", num: 20, solution: ["240 ÷ 600 = 0.4", "0.4 × 50 = 20"] },
      { q: "Explain why surveying only the learners near the gate in the morning may give a biased result about how learners get to school.", open: true, solution: ["Learners who walk or are dropped off near the gate are more likely to be there.", "Learners who take the bus or arrive at another entrance are left out, so the sample is not typical of all learners."] },
    ] },
  ],
});
