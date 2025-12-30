export function toCsv(rows) {
  if (!rows || rows.length === 0) return 'id,amount,category,date,description\n';
  const header = 'id,amount,category,date,description\n';
  const lines = rows.map(r => {
    const desc = (r.description ?? '').replace(/"/g, '""');
    return `${r.id},${r.amount},"${r.category}","${r.date}","${desc}"`;
  });
  return header + lines.join('\n') + '\n';
}
