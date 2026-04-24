export const STORAGE_KEY = "expenses.v2";

export const CATEGORIES = [
  "Food",
  "Transport",
  "Bills",
  "Shopping",
  "Health",
  "Entertainment",
  "Other",
];

export function safeParseExpenses(rawValue) {
  if (typeof rawValue !== "string" || rawValue.trim() === "") {
    return { expenses: [], hadError: false };
  }

  try {
    const parsed = JSON.parse(rawValue);

    if (!Array.isArray(parsed)) {
      return { expenses: [], hadError: true };
    }

    const expenses = parsed.map((item) => normalizeExpense(item)).filter((item) => item !== null);

    return {
      expenses,
      hadError: expenses.length !== parsed.length,
    };
  } catch {
    return { expenses: [], hadError: true };
  }
}

export function normalizeExpense(item) {
  if (!item || typeof item !== "object") {
    return null;
  }

  const name = typeof item.name === "string" ? item.name.trim() : "";
  const category = typeof item.category === "string" ? item.category.trim() : "";
  const date = typeof item.date === "string" ? item.date : "";
  const id = Number(item.id);
  const amount = Number(item.amount);

  if (
    !name ||
    !Number.isFinite(amount) ||
    amount <= 0 ||
    !isValidDate(date) ||
    !Number.isFinite(id)
  ) {
    return null;
  }

  return {
    id,
    name,
    amount,
    category: CATEGORIES.includes(category) ? category : "Other",
    date,
  };
}

export function calculateTotal(expenses) {
  return expenses.reduce((sum, expense) => sum + expense.amount, 0);
}

export function filterExpenses(expenses, filters) {
  return expenses.filter((expense) => {
    const categoryMatch = filters.category === "all" || expense.category === filters.category;
    const monthMatch = !filters.month || expense.date.startsWith(filters.month);
    return categoryMatch && monthMatch;
  });
}

export function calculateSummary(expenses, now = new Date()) {
  const total = calculateTotal(expenses);
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const thisMonthTotal = calculateTotal(
    expenses.filter((expense) => expense.date.startsWith(currentMonth)),
  );

  const categoryTotals = expenses.reduce((acc, expense) => {
    acc.set(expense.category, (acc.get(expense.category) || 0) + expense.amount);
    return acc;
  }, new Map());

  let topCategory = "—";
  let topCategoryValue = 0;

  for (const [category, value] of categoryTotals.entries()) {
    if (value > topCategoryValue) {
      topCategory = category;
      topCategoryValue = value;
    }
  }

  return { total, thisMonthTotal, topCategory };
}

export function createExpense(data) {
  return {
    id: Date.now() + Math.floor(Math.random() * 1000),
    name: data.name.trim(),
    amount: Number(data.amount),
    category: data.category,
    date: data.date,
  };
}

export function isValidDate(value) {
  if (typeof value !== "string") {
    return false;
  }

  const date = new Date(value);
  return Number.isFinite(date.getTime()) && /^\d{4}-\d{2}-\d{2}$/.test(value);
}
