# Expense Tracker

[![CI](https://img.shields.io/github/actions/workflow/status/rajarshi-29/expense-tracker/ci.yml?label=CI)](https://github.com/rajarshi-29/expense-tracker/actions)
[![Last Commit](https://img.shields.io/github/last-commit/rajarshi-29/expense-tracker)](https://github.com/rajarshi-29/expense-tracker/commits)
[![License](https://img.shields.io/github/license/rajarshi-29/expense-tracker)](./LICENSE)

A polished frontend expense tracking app built with vanilla JavaScript. It supports categorized expenses, date-based tracking, filtering, persistent local storage, and quick financial summaries.

🔗 **Live Demo:** https://expense-tracker-eta-blush.vercel.app/

---

## ✨ Highlights

- Add expenses with **name, amount, category, and date**
- Filter by **category** and **month**
- See summary cards for:
  - Total spend
  - Current month spend
  - Top spending category
- Persistent storage with safe parsing and recovery from corrupted local data
- Accessible, keyboard-friendly UI with live status messages
- One-click **Clear all expenses** with confirmation

---

## 📸 Screenshots / Demo

- Live demo: https://expense-tracker-eta-blush.vercel.app/
- Suggested recording: add 2–3 expenses, apply filters, clear all, and show summary changes.

---

## 🧱 Architecture / Design Decisions

- `index.html` contains semantic UI structure and form/layout markup.
- `src/script.js` handles app state, DOM rendering, and interactions.
- `src/expense-utils.js` contains reusable logic for:
  - storage parsing
  - data normalization
  - filtering
  - totals and summaries
- `assets/styles.css` holds reusable component-style classes.
- `test/expense-utils.test.js` validates core business logic.

This split keeps logic testable and the UI code easy to reason about.

---

## 🛠️ Tech Stack

- HTML5
- Tailwind CSS (CDN)
- JavaScript (ES Modules)
- Node.js test runner (`node --test`)
- ESLint + Prettier
- GitHub Actions CI
- Deployment: Vercel

---

## 🚀 Local Setup

```bash
git clone https://github.com/rajarshi-29/expense-tracker.git
cd expense-tracker
npm install
```

Open `index.html` in your browser (or use a static server).

### Scripts

```bash
npm run lint        # lint code
npm run format      # check formatting
npm run format:write
npm test            # run unit tests
```

---

## ✅ Validation and Data Safety

- Input validation for required fields and valid values
- Future dates are blocked
- Corrupted local storage data is handled gracefully
- Invalid stored records are ignored instead of crashing the app

---

## ⚖️ Challenges and Trade-offs

- Kept this project frontend-only to stay beginner-friendly
- Avoided frameworks to emphasize JS fundamentals and DOM/state control
- Used localStorage (no backend) to keep setup simple and fast

---

## 🔭 Future Improvements

- Edit existing expenses
- CSV export/import
- Charts for monthly/category trends
- Optional backend sync and authentication

---

## 📘 What I Learned

- Designing a clean state-driven UI in vanilla JavaScript
- Structuring frontend code for testability without frameworks
- Improving quality with linting, formatting, and CI from day one
- Balancing feature depth with readability for portfolio projects

---

## 👤 Author

**Rajarshi Mukherjee**

- GitHub: https://github.com/rajarshi-29
- LinkedIn: https://linkedin.com/in/rm2904
