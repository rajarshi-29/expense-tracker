import test from "node:test";
import assert from "node:assert/strict";

import {
  calculateSummary,
  calculateTotal,
  filterExpenses,
  safeParseExpenses,
} from "../src/expense-utils.js";

test("calculateTotal sums all expense amounts", () => {
  const total = calculateTotal([{ amount: 10.25 }, { amount: 20 }, { amount: 3.75 }]);

  assert.equal(total, 34);
});

test("filterExpenses supports category and month filtering", () => {
  const expenses = [
    { category: "Food", date: "2026-04-01", amount: 10 },
    { category: "Bills", date: "2026-04-20", amount: 20 },
    { category: "Food", date: "2026-03-05", amount: 30 },
  ];

  const filtered = filterExpenses(expenses, {
    category: "Food",
    month: "2026-04",
  });

  assert.deepEqual(filtered, [{ category: "Food", date: "2026-04-01", amount: 10 }]);
});

test("safeParseExpenses handles invalid JSON and skips malformed records", () => {
  const invalidJson = safeParseExpenses("{not-json}");
  assert.deepEqual(invalidJson, { expenses: [], hadError: true });

  const partialData = safeParseExpenses(
    JSON.stringify([
      { id: 1, name: "Lunch", amount: 12, category: "Food", date: "2026-04-01" },
      { id: 2, name: "", amount: -1, category: "Food", date: "wrong-date" },
    ]),
  );

  assert.equal(partialData.expenses.length, 1);
  assert.equal(partialData.hadError, true);
});

test("calculateSummary returns total, month total, and top category", () => {
  const expenses = [
    { category: "Food", date: "2026-04-01", amount: 20 },
    { category: "Bills", date: "2026-04-12", amount: 70 },
    { category: "Food", date: "2026-03-01", amount: 50 },
  ];

  const summary = calculateSummary(expenses, new Date("2026-04-20T00:00:00.000Z"));

  assert.equal(summary.total, 140);
  assert.equal(summary.thisMonthTotal, 90);
  assert.equal(summary.topCategory, "Food");
});
