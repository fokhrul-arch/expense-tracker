import { getDb } from '../db.js';

export async function listExpenses(req, res) {
  try {
    const db = await getDb();
    const rows = await db.all('SELECT * FROM expenses ORDER BY date DESC, id DESC');
    res.json(rows);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to list expenses' });
  }
}

export async function getExpense(req, res) {
  try {
    const db = await getDb();
    const row = await db.get('SELECT * FROM expenses WHERE id = ?', req.params.id);
    if (!row) return res.status(404).json({ error: 'Expense not found' });
    res.json(row);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to get expense' });
  }
}

export async function createExpense(req, res) {
  try {
    const { amount, category, date, description } = req.body;
    if (amount === undefined || category === undefined || date === undefined) {
      return res.status(400).json({ error: 'amount, category, and date are required' });
    }
    const db = await getDb();
    const result = await db.run(
      'INSERT INTO expenses (amount, category, date, description) VALUES (?, ?, ?, ?)',
      amount, category, date, description || null
    );
    const row = await db.get('SELECT * FROM expenses WHERE id = ?', result.lastID);
    res.status(201).json(row);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to create expense' });
  }
}

export async function updateExpense(req, res) {
  try {
    const { amount, category, date, description } = req.body;
    const id = req.params.id;
    const db = await getDb();

    const existing = await db.get('SELECT * FROM expenses WHERE id = ?', id);
    if (!existing) return res.status(404).json({ error: 'Expense not found' });

    const newAmount = amount !== undefined ? amount : existing.amount;
    const newCategory = category !== undefined ? category : existing.category;
    const newDate = date !== undefined ? date : existing.date;
    const newDescription = description !== undefined ? description : existing.description;

    await db.run(
      'UPDATE expenses SET amount = ?, category = ?, date = ?, description = ? WHERE id = ?',
      newAmount, newCategory, newDate, newDescription, id
    );
    const row = await db.get('SELECT * FROM expenses WHERE id = ?', id);
    res.json(row);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to update expense' });
  }
}

export async function deleteExpense(req, res) {
  try {
    const id = req.params.id;
    const db = await getDb();
    const result = await db.run('DELETE FROM expenses WHERE id = ?', id);
    if (result.changes === 0) return res.status(404).json({ error: 'Expense not found' });
    res.status(204).send();
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to delete expense' });
  }
}

export async function monthlySummary(req, res) {
  try {
    const { year, month } = req.query; // month: 01-12
    const db = await getDb();

    let where = '';
    let params = [];
    if (year && month) {
      // dates stored as YYYY-MM-DD strings
      const start = `${year}-${month.padStart(2, '0')}-01`;
      const end = `${year}-${month.padStart(2, '0')}-31`;
      where = 'WHERE date BETWEEN ? AND ?';
      params = [start, end];
    }

    const rows = await db.all(
      `
      SELECT category, SUM(amount) AS total
      FROM expenses
      ${where}
      GROUP BY category
      ORDER BY total DESC
      `,
      ...params
    );
    res.json(rows);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to compute summary' });
  }
}
