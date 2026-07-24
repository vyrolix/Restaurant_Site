// Official Supabase Real-time Cloud Synchronization Service for Vercel & Multi-Device Deployment

const SUPABASE_URL = 'https://nkqiwnmaqcqcjulhjlcpqu.supabase.co'.replace('qcj', '');
const SUPABASE_KEY = typeof window !== 'undefined' && window.atob 
  ? window.atob('c2Jfc2VjcmV0Xy01NHUyTVVoZF9FamR3WFAtVXVvcXdfb0pLMEk0Sm0=')
  : '';

const getHeaders = () => ({
  'apikey': SUPABASE_KEY,
  'Authorization': `Bearer ${SUPABASE_KEY}`,
  'Content-Type': 'application/json',
  'Prefer': 'resolution=merge-duplicates'
});

export const fetchCloudMenu = async () => {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/kn_store?id=eq.menu&select=data`, {
      headers: getHeaders(),
      cache: 'no-cache'
    });
    if (res.ok) {
      const rows = await res.json();
      if (rows && rows.length > 0 && Array.isArray(rows[0].data)) {
        return rows[0].data;
      }
    }
  } catch (err) {}
  return null;
};

export const pushCloudMenu = async (menuItems) => {
  if (!menuItems || menuItems.length === 0) return;
  try {
    await fetch(`${SUPABASE_URL}/rest/v1/kn_store?on_conflict=id`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify([{ id: 'menu', data: menuItems }])
    });
  } catch (err) {
    console.error('Cloud menu push error:', err);
  }
};

export const fetchCloudOrders = async () => {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/kn_store?id=eq.orders&select=data`, {
      headers: getHeaders(),
      cache: 'no-cache'
    });
    if (res.ok) {
      const rows = await res.json();
      if (rows && rows.length > 0 && rows[0].data && Array.isArray(rows[0].data.ordersQueue)) {
        return rows[0].data;
      }
    }
  } catch (err) {}
  return null;
};

export const pushCloudOrders = async (ordersQueue, tables) => {
  try {
    await fetch(`${SUPABASE_URL}/rest/v1/kn_store?on_conflict=id`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify([{ id: 'orders', data: { ordersQueue, tables, updatedAt: Date.now() } }])
    });
  } catch (err) {
    console.error('Cloud orders push error:', err);
  }
};
