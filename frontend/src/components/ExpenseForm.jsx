import React, { useState, useEffect } from 'react';

const presetCategories = [
  'Food', 'Transport', 'Bills', 'Entertainment', 'Health', 'Shopping', 'Education', 'Other'
];

export default function ExpenseForm({ onSubmit, editing }) {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(presetCategories[0]);
  const [date, setDate] = useState(() => new Date().toISOString().slice(0,10));
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (editing) {
      setAmount(editing.amount);
      setCategory(editing.category);
      setDate(editing.date);
      setDescription(editing.description || '');
    }
  }, [editing]);

  function handleSubmit(e) {
    e.preventDefault();
    const amt = parseFloat(amount);
    if (isNaN(amt) || amt < 0) {
      alert('Please enter a valid positive amount.');
      return;
    }
    if (!date) {
      alert('Please select a date.');
      return;
    }
    onSubmit({
      amount: amt,
      category,
      date,
      description: description.trim()
    });
    if (!editing) {
      setAmount('');
      setCategory(presetCategories[0]);
      setDate(new Date().toISOString().slice(0,10));
      setDescription('');
    }
  }

  return (
    <form className="card" onSubmit={handleSubmit}>
      <h3>{editing ? 'Edit Expense' : 'Add Expense'}</h3>
      <div className="grid">
        <div>
          <label>Amount</label><br/>
          <input type="number" step="0.01" value={amount} onChange={e => setAmount(e.target.value)} required />
        </div>
        <div>
          <label>Category</label><br/>
          <select value={category} onChange={e => setCategory(e.target.value)}>
            {presetCategories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label>Date</label><br/>
          <input type="date" value={date} onChange={e => setDate(e.target.value)} required />
        </div>
        <div>
          <label>Description</label><br/>
          <input type="text" value={description} onChange={e => setDescription(e.target.value)} placeholder="Optional note"/>
        </div>
      </div>
      <div style={{ marginTop: '0.75rem', display: 'flex', gap: '0.5rem' }}>
        <button type="submit">{editing ? 'Update' : 'Add'}</button>
        {editing && <button type="button" className="btn-outline" onClick={() => window.dispatchEvent(new CustomEvent('cancel-edit'))}>Cancel</button>}
      </div>
    </form>
  );
}
