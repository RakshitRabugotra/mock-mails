import express from 'express';
import { JSONFilePreset } from 'lowdb/node';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

// Logger middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  if (req?.body && Object.keys(req.body).length) console.log('Body:', req.body);
  if (req?.query && Object.keys(req.query).length) console.log('Query:', req.query);
  next();
});

// Setup DB
const db = await JSONFilePreset('./db.json', { mails: [] });
console.log('✅ Database initialized. Total mails:', db.data.mails.length);

// 1. GET /mails/:id
app.get('/mails/:id', (req, res) => {
  const mail = db.data.mails.find(m => m.id === req.params.id);
  if (!mail) {
    console.warn(`❌ Mail with id=${req.params.id} not found.`);
    return res.status(404).json({ error: 'Mail not found' });
  }
  console.log(`✅ Mail with id=${req.params.id} retrieved.`);
  res.json(mail);
});

// 2. PUT /mails/:id
app.put('/mails/:id', async (req, res) => {
  const index = db.data.mails.findIndex(m => m.id === req.params.id);
  if (index === -1) {
    console.warn(`❌ Cannot update: Mail with id=${req.params.id} not found.`);
    return res.status(404).json({ error: 'Mail not found' });
  }

  console.log("old: ", JSON.stringify(db.data.mails[index]))
  console.log("new: ", JSON.stringify(req.body));
  console.log("d: ", req.body);

  db.data.mails[index] = { ...db.data.mails[index], ...req.body };
  await db.write();
  console.log(`✅ Mail with id=${req.params.id} updated.`);
  res.json(db.data.mails[index]);
});

// 3. DELETE /mails/:id
app.delete('/mails/:id', async (req, res) => {
  const index = db.data.mails.findIndex(m => m.id === req.params.id);
  if (index === -1) {
    console.warn(`❌ Cannot delete: Mail with id=${req.params.id} not found.`);
    return res.status(404).json({ error: 'Mail not found' });
  }

  const deleted = db.data.mails.splice(index, 1);
  await db.write();
  console.log(`🗑️ Mail with id=${req.params.id} deleted.`);
  res.json({ deleted: deleted[0] });
});

// 4. GET /mails?_page=1&_perPage=5
app.get('/mails', (req, res) => {
  let page = parseInt(req.query._page) || -1;
  let perPage = parseInt(req.query._perPage) || -1;

  if (page === -1 && perPage === -1) {
    console.log(`📬 Returning all mails. Total: ${db.data.mails.length}`);
    return res.json(db.data.mails);
  }

  page = Math.max(1, page);
  perPage = Math.max(10, perPage);

  const total = db.data.mails.length;
  const start = (page - 1) * perPage;
  const end = start + perPage;

  const paginated = db.data.mails.slice(start, end);
  const hasNext = end < total;
  const hasPrev = start > 0;

  console.log(`📄 Page ${page} with ${perPage} per page. Returned: ${paginated.length}`);

  res.json({
    total,
    current: page,
    next: hasNext,
    prev: hasPrev,
    perPage,
    data: paginated
  });
});

// 5. GET /mails/search?q=someText
app.get('/search', (req, res) => {
  const q = req.query.q?.toLowerCase() || '';
  const filtered = db.data.mails.filter(mail =>
    mail.sender.toLowerCase().includes(q) ||
    mail.subject.toLowerCase().includes(q) ||
    mail.body.toLowerCase().includes(q)
  );

  console.log(`🔍 Search query="${q}", found ${filtered.length} results.`);
  res.json({ total: filtered.length, data: filtered });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
