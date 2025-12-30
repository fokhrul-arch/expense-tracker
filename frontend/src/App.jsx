import React, { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';
import Summary from './components/Summary';
import ExportButton from './components/ExportButton';
import { fetchExpenses, createExpense, updateExpense, deleteExpense } from './api';
import './styles.css';

export default function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');
  const [expenses, setExpenses] = useState([]);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const data = await fetchExpenses();
      setExpenses(data);
      setLoading(false);
    })();
    // global cancel-edit handler
    const handler = () => setEditing(null);
    window.addEventListener('cancel-edit', handler);
    return () => window.removeEventListener('cancel-edit', handler);
  }, []);

  async function handleSubmit(payload) {
    try {
      if (editing) {
        const updated = await updateExpense(editing.id, payload);
        setExpenses(prev => prev.map(e => e.id === editing.id ? updated : e));
        setEditing(null);
      } else {
        const created = await createExpense(payload);
        setExpenses(prev => [created, ...prev]);
      }
    } catch (e) {
      alert(e.message);
    }
  }

  async function handleDelete(id) {
    if (!confirm('Delete this expense?')) return;
    try {
      await deleteExpense(id);
      setExpenses(prev => prev.filter(e => e.id !== id));
    } catch (e) {
      alert(e.message);
    }
  }

  function onEdit(expense) {
    setEditing(expense);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <>
      <Navbar
        theme={theme}
        onToggleTheme={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      />

      <div className="container grid-2">
        <div>
          <ExpenseForm onSubmit={handleSubmit} editing={editing} />
          <div className="card" style={{ marginTop: '1rem' }}>
            <h3>Tools</h3>
            <ExportButton />
          </div>
        </div>
        <div>
          {loading ? (
            <div className="card">Loading...</div>
          ) : (
            <ExpenseList expenses={expenses} onEdit={onEdit} onDelete={handleDelete} />
          )}
          <div style={{ marginTop: '1rem' }}>
            <Summary />
          </div>
        </div>
      </div>
    </>
  );
}
