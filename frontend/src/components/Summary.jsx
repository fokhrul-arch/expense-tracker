import React, { useEffect, useState } from 'react';
import { fetchSummary } from '../api';

export default function Summary() {
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(String(new Date().getMonth() + 1).padStart(2, '0'));
  const [summary, setSummary] = useState([]);

  async function load() {
    const data = await fetchSummary(year, month);
    setSummary(data);
  }

  useEffect(() => { load(); }, [year, month]);

  const total = summary.reduce((acc, s) => acc + Number(s.total), 0);

  return (
    <div className="card">
      <h3>Monthly summary</h3>
      <div className="grid">
        <div>
          <label>Year</label><br/>
          <input type="number" value={year} onChange={e => setYear(e.target.value)} />
        </div>
        <div>
          <label>Month</label><br/>
          <input type="number" min="1" max="12" value={month} onChange={e => setMonth(e.target.value)} />
        </div>
      </div>
      <div style={{ marginTop: '0.75rem' }}>
        <strong>Total:</strong> {total.toFixed(2)}
      </div>
      <div style={{ marginTop: '0.5rem', overflowX: 'auto' }}>
        <table className="table">
          <thead>
            <tr>
              <th>Category</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {summary.length === 0 && (
              <tr>
                <td colSpan="2">No data for selected period.</td>
              </tr>
            )}
            {summary.map((s) => (
              <tr key={s.category}>
                <td>{s.category}</td>
                <td>{Number(s.total).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
