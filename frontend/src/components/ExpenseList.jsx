import React from 'react';

export default function ExpenseList({ expenses, onEdit, onDelete }) {
  return (
    <div className="card">
      <h3>Expenses</h3>
      <div style={{ overflowX: 'auto' }}>
        <table className="table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Category</th>
              <th>Amount</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {expenses.length === 0 && (
              <tr>
                <td colSpan="5">No expenses yet. Add your first one!</td>
              </tr>
            )}
            {expenses.map((e) => (
              <tr key={e.id}>
                <td>{e.date}</td>
                <td><span className="badge">{e.category}</span></td>
                <td>{Number(e.amount).toFixed(2)}</td>
                <td>{e.description || '-'}</td>
                <td className="row-actions">
                  <button className="btn-outline" onClick={() => onEdit(e)}>Edit</button>
                  <button className="btn-danger" onClick={() => onDelete(e.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
