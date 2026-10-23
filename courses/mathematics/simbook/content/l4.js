/* Lesson 4 · D. Percentages in Real Life – lesson and exercises */
Sim.addContent("lesson4", {
  learn: [
    { t: "h", text: "Percent of a number" },
    { t: "p", text: "**Percent** means “per hundred.” To find a percent of a number, change the percent to a decimal and multiply." },
    { t: "ex", title: "Percent of a number", problem: "Find 15% of 240.", steps: ["15% = 0.15", "0.15 × 240 = 36"], answer: "36." },
    { t: "h", text: "Percentage increase and decrease" },
    { t: "rule", title: "Percentage change", text: ["percentage change = (amount of change ÷ ORIGINAL amount) × 100%", "new amount after an increase of r% = original × (1 + r)", "new amount after a decrease of r% = original × (1 − r)"] },
    { t: "ex", title: "Percentage increase", problem: "The price of rice rose from ₱50 to ₱55 per kilo. What is the percentage increase?", steps: ["change = ₱55 − ₱50 = ₱5", "₱5 ÷ ₱50 = 0.10", "0.10 × 100% = 10%"], answer: "a 10% increase." },
    { t: "ex", title: "Percentage decrease", problem: "Shoes went from ₱800 to ₱600. What is the percentage decrease?", steps: ["change = ₱800 − ₱600 = ₱200", "₱200 ÷ ₱800 = 0.25 = 25%"], answer: "a 25% decrease." },
    { t: "p", text: "Always divide by the **original** amount. ₱600 → ₱800 is a 33.3% increase, but ₱800 → ₱600 is only a 25% decrease." },
    { t: "h", text: "Money problems" },
    { t: "defs", items: [
      ["Discount", "the amount taken off the price: discount = rate × original price; sale price = original − discount"],
      ["Sales tax (VAT)", "an amount added to the price; in the Philippines the VAT is 12%"],
      ["Commission", "the pay a salesperson earns as a percent of sales: commission = rate × sales"],
      ["Simple interest", "money earned on savings (or paid on a loan): **I = P × r × t**, where P is the principal, r the yearly rate, and t the time in years"],
    ] },
    { t: "ex", title: "Discount", problem: "A ₱1 200 bag is on sale at 30% off. What is the sale price?", steps: ["discount = 0.30 × ₱1 200 = ₱360", "sale price = ₱1 200 − ₱360 = ₱840"], answer: "₱840." },
    { t: "ex", title: "VAT", problem: "An item costs ₱500 before VAT. What is the total with 12% VAT?", steps: ["VAT = 0.12 × ₱500 = ₱60", "total = ₱500 + ₱60 = ₱560"], answer: "₱560." },
    { t: "ex", title: "Commission", problem: "A salesperson earns a 5% commission. How much is earned on ₱80 000 in sales?", steps: ["0.05 × ₱80 000 = ₱4 000"], answer: "₱4 000." },
    { t: "ex", title: "Simple interest", problem: "₱10 000 is saved at 3% simple interest per year for 2 years. Find the interest and the total amount.", steps: ["I = ₱10 000 × 0.03 × 2 = ₱600", "amount = ₱10 000 + ₱600 = ₱10 600"], answer: "₱600 interest; ₱10 600 in all." },
    { t: "ex", title: "Two discounts in a row", problem: "A ₱1 000 item is 20% off, then another 10% off the sale price. Is that the same as 30% off?", steps: ["After 20% off: ₱1 000 × 0.80 = ₱800", "After another 10% off: ₱800 × 0.90 = ₱720", "₱720 is 72% of ₱1 000, so the total discount is 28%."], answer: "no – it is only 28% off." },
    { t: "remember", items: ["Percentage change uses the ORIGINAL amount.", "Successive percentages are taken of different bases, so they do not simply add.", "I = P × r × t."] },
  ],
  exercises: [
    { title: "A. Skills Practice", items: [
      { q: "Find 25% of 360.", num: 90, solution: "0.25 × 360 = 90." },
      { q: "A price went from ₱80 to ₱92. What is the percentage increase?", num: 15, unit: "%", solution: ["change = ₱12", "12 ÷ 80 = 0.15 = 15%"] },
      { q: "A price dropped from ₱1 500 to ₱1 200. What is the percentage decrease?", num: 20, unit: "%", solution: ["change = ₱300", "300 ÷ 1 500 = 0.20 = 20%"] },
      { q: "A ₱2 500 jacket is 20% off. What is the sale price?", num: 2000, unit: "₱", solution: ["discount = 0.20 × ₱2 500 = ₱500", "sale price = ₱2 000"] },
      { q: "What is the total cost of a ₱1 250 purchase plus 12% VAT?", num: 1400, unit: "₱", solution: ["VAT = 0.12 × ₱1 250 = ₱150", "total = ₱1 400"] },
      { q: "A real-estate agent earns a 6% commission on a ₱45 000 sale. How much is the commission?", num: 2700, unit: "₱", solution: "0.06 × ₱45 000 = ₱2 700." },
      { q: "Find the simple interest on ₱8 000 at 4% per year for 3 years.", num: 960, unit: "₱", solution: "I = ₱8 000 × 0.04 × 3 = ₱960." },
      { q: "Increase ₱450 by 10%.", num: 495, unit: "₱", solution: "₱450 × 1.10 = ₱495." },
    ] },
    { title: "B. Problem Solving", items: [
      { q: "A ₱32 000 laptop is 15% off, and then 12% VAT is added to the sale price. What is the total cost?", num: 30464, unit: "₱", solution: ["sale price = ₱32 000 × 0.85 = ₱27 200", "with VAT = ₱27 200 × 1.12 = ₱30 464"] },
      { q: "You need two shirts that cost ₱900 each. Store A offers 40% off each shirt; Store B offers Buy 1, Take 1. How much do you save by choosing the cheaper store?", num: 180, unit: "₱", solution: ["Store A: 2 × (₱900 × 0.60) = 2 × ₱540 = ₱1 080", "Store B: pay for one shirt = ₱900", "Store B is cheaper by ₱1 080 − ₱900 = ₱180."] },
      { q: "Ana deposits ₱15 000 at 2% simple interest per year. How much will Ana have after 5 years?", num: 16500, unit: "₱", solution: ["I = ₱15 000 × 0.02 × 5 = ₱1 500", "amount = ₱16 500"] },
      { q: "The price of a kilo of rice rose from ₱48 to ₱54. What is the percentage increase?", num: 12.5, unit: "%", solution: ["change = ₱6", "6 ÷ 48 = 0.125 = 12.5%"] },
    ] },
    { title: "C. Challenge", items: [
      { q: "An item is 25% off, then an extra 20% off the sale price. What single discount is this equal to?", num: 40, unit: "%", solution: ["You pay 0.75 × 0.80 = 0.60 of the price.", "That is 60%, so the single discount is 40%."] },
      { q: "A price is increased by 20%, then the new price is decreased by 20%. By what percent is the final price lower than the original?", num: 4, unit: "%", solution: ["1.20 × 0.80 = 0.96", "The final price is 96% of the original – 4% lower."] },
    ] },
  ],
});
