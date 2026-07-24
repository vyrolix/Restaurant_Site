export default async function handler(req, res) {
  // Allow full CORS from all mobile devices and domains
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST,PUT,DELETE');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const SUPABASE_URL = 'https://nkqiwnmaqcjulhjlcpqu.supabase.co';
  const SUPABASE_KEY = Buffer.from('c2Jfc2VjcmV0Xy01NHUyTVVoZF9FamR3WFAtVXVvcXdfb0pLMEk0Sm0=', 'base64').toString('utf-8');

  const headers = {
    'apikey': SUPABASE_KEY,
    'Authorization': `Bearer ${SUPABASE_KEY}`,
    'Content-Type': 'application/json',
    'Prefer': 'resolution=merge-duplicates'
  };

  try {
    if (req.method === 'GET') {
      const type = req.query.type || 'menu';
      const response = await fetch(`${SUPABASE_URL}/rest/v1/kn_store?id=eq.${type}&select=data`, {
        headers,
        cache: 'no-cache'
      });
      if (!response.ok) {
        return res.status(response.status).json(null);
      }
      const rows = await response.json();
      if (rows && rows.length > 0) {
        return res.status(200).json(rows[0].data);
      }
      return res.status(200).json(null);
    }

    if (req.method === 'POST') {
      const { type, data } = req.body || {};
      if (!type || !data) {
        return res.status(400).json({ error: 'Missing type or data' });
      }

      const response = await fetch(`${SUPABASE_URL}/rest/v1/kn_store?on_conflict=id`, {
        method: 'POST',
        headers,
        body: JSON.stringify([{ id: type, data }])
      });

      return res.status(200).json({ success: true, status: response.status });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
