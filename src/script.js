import {
  CATEGORIES,
  STORAGE_KEY,
  calculateSummary,
  createExpense,
  filterExpenses,
  safeParseExpenses,
  isValidDate,
} from "./expense-utils.js";

const expenseForm = document.getElementById("expense-form");
const expenseList = document.getElementById("expense-list");
const statusMessage = document.getElementById("status-message");
const clearAllBtn = document.getElementById("clear-all");

const nameInput = document.getElementById("expense-name");
const amountInput = document.getElementById("expense-amount");
const categoryInput = document.getElementById("expense-category");
const dateInput = document.getElementById("expense-date");

const filterCategoryInput = document.getElementById("filter-category");
const filterMonthInput = document.getElementById("filter-month");

const summaryTotal = document.getElementById("summary-total");
const summaryMonth = document.getElementById("summary-month");
const summaryCategory = document.getElementById("summary-category");

const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const state = {
  expenses: [],
  filters: {
    category: "all",
    month: "",
  },
};

initialize();

function initialize() {
  statusMessage.textContent = "Loading expenses...";
  populateCategorySelects();
  setDateLimits();

  const { expenses, hadError } = safeParseExpenses(localStorage.getItem(STORAGE_KEY));
  state.expenses = expenses;

  if (hadError) {
    setStatus("Some saved records were invalid and were skipped.", "warn");
  } else if (expenses.length > 0) {
    setStatus("Expenses loaded successfully.", "success");
  } else {
    setStatus("Start by adding your first expense.", "info");
  }

  render();
  bindEvents();
}

function bindEvents() {
  expenseForm.addEventListener("submit", onAddExpense);

  expenseList.addEventListener("click", (event) => {
    const deleteButton = event.target.closest("button[data-id]");
    if (!deleteButton) {
      return;
    }

    const id = Number(deleteButton.dataset.id);
    state.expenses = state.expenses.filter((expense) => expense.id !== id);
    saveExpenses();
    render();
    setStatus("Expense deleted.", "success");
  });

  filterCategoryInput.addEventListener("change", () => {
    state.filters.category = filterCategoryInput.value;
    renderList();
  });

  filterMonthInput.addEventListener("change", () => {
    state.filters.month = filterMonthInput.value;
    renderList();
  });

  clearAllBtn.addEventListener("click", () => {
    if (state.expenses.length === 0) {
      setStatus("There are no expenses to clear.", "info");
      return;
    }

    const shouldClear = window.confirm("Clear all saved expenses? This cannot be undone.");
    if (!shouldClear) {
      return;
    }

    state.expenses = [];
    saveExpenses();
    render();
    setStatus("All expenses cleared.", "success");
  });
}

function onAddExpense(event) {
  event.preventDefault();

  const payload = {
    name: nameInput.value,
    amount: amountInput.value,
    category: categoryInput.value,
    date: dateInput.value,
  };

  const validationError = validateExpense(payload);
  if (validationError) {
    setStatus(validationError, "error");
    return;
  }

  state.expenses.unshift(createExpense(payload));
  saveExpenses();
  render();

  expenseForm.reset();
  categoryInput.value = CATEGORIES[0];
  dateInput.value = todayDate();
  setStatus("Expense added.", "success");
}

function validateExpense(payload) {
  if (!payload.name.trim()) {
    return "Please add an expense name.";
  }

  if (payload.name.trim().length > 80) {
    return "Expense name should be 80 characters or less.";
  }

  const amount = Number(payload.amount);
  if (!Number.isFinite(amount) || amount <= 0) {
    return "Amount must be greater than 0.";
  }

  if (!CATEGORIES.includes(payload.category)) {
    return "Please choose a valid category.";
  }

  if (!isValidDate(payload.date)) {
    return "Please choose a valid date.";
  }

  if (payload.date > todayDate()) {
    return "Date cannot be in the future.";
  }

  return "";
}

function populateCategorySelects() {
  categoryInput.innerHTML = CATEGORIES.map(
    (category) => `<option value="${category}">${category}</option>`,
  ).join("");

  filterCategoryInput.innerHTML = ["all", ...CATEGORIES]
    .map((category) => {
      const label = category === "all" ? "All categories" : category;
      return `<option value="${category}">${label}</option>`;
    })
    .join("");

  categoryInput.value = CATEGORIES[0];
}

function setDateLimits() {
  const today = todayDate();
  dateInput.max = today;
  dateInput.value = today;
}

function saveExpenses() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.expenses));
}

function render() {
  renderList();
  renderSummary();
  clearAllBtn.disabled = state.expenses.length === 0;
  clearAllBtn.setAttribute("aria-disabled", String(state.expenses.length === 0));
}

function renderList() {
  const filtered = filterExpenses(state.expenses, state.filters);
  expenseList.innerHTML = "";

  if (state.expenses.length === 0) {
    expenseList.innerHTML = `<li class="empty-state">No expenses yet. Add one above to get started.</li>`;
    return;
  }

  if (filtered.length === 0) {
    expenseList.innerHTML = `<li class="empty-state">No expenses match the current filter.</li>`;
    return;
  }

  const fragment = document.createDocumentFragment();

  filtered.forEach((expense) => {
    const listItem = document.createElement("li");
    listItem.className = "expense-item";

    const left = document.createElement("div");

    const title = document.createElement("p");
    title.className = "font-semibold";
    title.textContent = expense.name;

    const meta = document.createElement("p");
    meta.className = "expense-meta";
    meta.textContent = `${expense.category} • ${expense.date}`;

    left.append(title, meta);

    const right = document.createElement("div");
    right.className = "flex items-center gap-3";

    const amount = document.createElement("span");
    amount.className = "text-emerald-300 font-semibold";
    amount.textContent = formatter.format(expense.amount);

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.dataset.id = expense.id;
    deleteButton.className = "btn-delete";
    deleteButton.textContent = "Delete";
    deleteButton.ariaLabel = `Delete expense: ${expense.name}`;

    right.append(amount, deleteButton);
    listItem.append(left, right);
    fragment.appendChild(listItem);
  });

  expenseList.appendChild(fragment);
}

function renderSummary() {
  const { total, thisMonthTotal, topCategory } = calculateSummary(state.expenses);
  summaryTotal.textContent = formatter.format(total);
  summaryMonth.textContent = formatter.format(thisMonthTotal);
  summaryCategory.textContent = topCategory;
}

function setStatus(message, type) {
  statusMessage.className = `status-message status-${type}`;
  statusMessage.textContent = message;
}

function todayDate() {
  return new Date().toISOString().slice(0, 10);
}
