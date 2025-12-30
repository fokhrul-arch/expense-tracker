PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS expenses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  amount REAL NOT NULL CHECK (amount >= 0),
  category TEXT NOT NULL,
  date TEXT NOT NULL, -- ISO date string YYYY-MM-DD
  description TEXT
);

-- Helpful indexes
CREATE INDEX IF NOT EXISTS idx_expenses_date ON expenses(date);
CREATE INDEX IF NOT EXISTS idx_expenses_category ON expenses(category);
