import express from 'express';
import cors from 'cors';
import expensesRouter from './routes/expenses.js';
import { initDb } from './db.js';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors({ origin: '*' }));
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ ok: true, service: 'expense-tracker-api' });
});

app.use('/api/expenses', expensesRouter);

const args = process.argv.slice(2);
if (args.includes('--init')) {
  (async () => {
    await initDb();
    process.exit(0);
  })();
} else {
  (async () => {
    await initDb(); // ensure tables exist at startup
    app.listen(PORT, () => {
      console.log(`API listening on http://localhost:${PORT}`);
    });
  })();
}
