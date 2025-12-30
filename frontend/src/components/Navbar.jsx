import React from 'react';

export default function Navbar({ onToggleTheme, theme }) {
  return (
    <div className="nav container">
      <h1>Expense Tracker</h1>
      <div className="nav-actions">
        <button className="btn-outline" onClick={onToggleTheme}>
          Toggle {theme === 'dark' ? 'Light' : 'Dark'} Mode
        </button>
      </div>
    </div>
  );
}
