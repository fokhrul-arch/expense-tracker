import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import fs from 'fs';
import path from 'path';
import url from 'url';

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_PATH = path.join(__dirname, 'expenses.db');
const SCHEMA_PATH = path.join(__dirname, 'schema.sql');

export async function getDb() {
  const db = await open({
    filename: DB_PATH,
    driver: sqlite3.Database
  });
  return db;
}

export async function initDb() {
  const db = await getDb();
  const schema = fs.readFileSync(SCHEMA_PATH, 'utf-8');
  await db.exec(schema);
  console.log('Database initialized.');
}
