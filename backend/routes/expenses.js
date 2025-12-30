import { Router } from 'express';
import {
  listExpenses,
  getExpense,
  createExpense,
  updateExpense,
  deleteExpense,
  monthlySummary
} from '../controllers/expenses.js';
import { getDb } from '../db.js';
import { toCsv } from '../utils/csv.js';

const router = Router();

router.get('/', listExpenses);
router.get('/summary', monthlySummary);
router.get('/:id', getExpense);
router.post('/', createExpense);
router.put('/:id', updateExpense);
router.delete('/:id', deleteExpense);

// CSV export
router.get('/export/csv', async (req, res) => {
  try {
    const db = await getDb();
    const rows = await db.all('SELECT * FROM expenses ORDER BY date DESC, id DESC');
    const csv = toCsv(rows);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="expenses.csv"');
    res.send(csv);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to export CSV' });
  }
});

export default router;
