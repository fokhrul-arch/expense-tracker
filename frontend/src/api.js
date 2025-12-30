const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000/api';

export async function fetchExpenses() {
  const res = await fetch(`${API_BASE}/expenses`);
  return res.json();
}

export async function createExpense(payload) {
  const res = await fetch(`${API_BASE}/expenses`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error('Failed to create expense');
  return res.json();
}

export async function updateExpense(id, payload) {
  const res = await fetch(`${API_BASE}/expenses/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error('Failed to update expense');
  return res.json();
}

export async function deleteExpense(id) {
  const res = await fetch(`${API_BASE}/expenses/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete expense');
  return true;
}

export async function fetchSummary(year, month) {
  const params = new URLSearchParams();
  if (year && month) {
    params.set('year', String(year));
    params.set('month', String(month).padStart(2, '0'));
  }
  const res = await fetch(`${API_BASE}/expenses/summary?${params.toString()}`);
  return res.json();
}

export function downloadCsv() {
  const url = `${API_BASE}/expenses/export/csv`;
  window.open(url, '_blank');
}
