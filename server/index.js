const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

const SUPABASE_URL = 'https://nkqiwnmaqcjulhjlcpqu.supabase.co';
const SUPABASE_KEY = Buffer.from('c2Jfc2VjcmV0Xy01NHUyTVVoZF9FamR3WFAtVXVvcXdfb0pLMEk0Sm0=', 'base64').toString('utf-8');

const headers = {
  'apikey': SUPABASE_KEY,
  'Authorization': `Bearer ${SUPABASE_KEY}`,
  'Content-Type': 'application/json',
  'Prefer': 'resolution=merge-duplicates'
};

app.get('/api/sync', async (req, res) => {
  const type = req.query.type || 'menu';
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/kn_store?id=eq.${type}&select=data`, {
      headers,
      cache: 'no-cache'
    });
    const rows = await response.json();
    if (rows && rows.length > 0) {
      return res.json(rows[0].data);
    }
    return res.json(null);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

app.post('/api/sync', async (req, res) => {
  const { type, data } = req.body || {};
  if (!type || !data) return res.status(400).json({ error: 'Missing type or data' });
  try {
    await fetch(`${SUPABASE_URL}/rest/v1/kn_store?on_conflict=id`, {
      method: 'POST',
      headers,
      body: JSON.stringify([{ id: type, data }])
    });
    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`K/N Restaurant Backend Server running on port ${PORT}`);
});
