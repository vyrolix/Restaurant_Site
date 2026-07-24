// Universal Zero-CORS Cloud Synchronization Service for Vercel & Multi-Device Deployment

const getApiEndpoint = () => {
  if (typeof window !== 'undefined') {
    return `${window.location.origin}/api/sync`;
  }
  return '/api/sync';
};

const SUPABASE_URL = 'https://nkqiwnmaqcjulhjlcpqu.supabase.co';
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
    const res = await fetch(`${getApiEndpoint()}?type=menu`, { cache: 'no-cache' });
    if (res.ok) {
      const data = await res.json();
      if (data && Array.isArray(data) && data.length >= 5) {
        return data;
      }
    }
  } catch (err) {}

  // Direct Supabase Fallback
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/kn_store?id=eq.menu&select=data`, {
      headers: getHeaders(),
      cache: 'no-cache'
    });
    if (res.ok) {
      const rows = await res.json();
      if (rows && rows.length > 0 && Array.isArray(rows[0].data) && rows[0].data.length >= 5) {
        return rows[0].data;
      }
    }
  } catch (err) {}

  return null;
};

export const pushCloudMenu = async (menuItems) => {
  if (!menuItems || !Array.isArray(menuItems) || menuItems.length < 5) return;
  
  try {
    await fetch(getApiEndpoint(), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'menu', data: menuItems })
    });
  } catch (err) {}

  // Direct Supabase Fallback
  try {
    await fetch(`${SUPABASE_URL}/rest/v1/kn_store?on_conflict=id`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify([{ id: 'menu', data: menuItems }])
    });
  } catch (err) {}
};

export const fetchCloudOrders = async () => {
  try {
    const res = await fetch(`${getApiEndpoint()}?type=orders`, { cache: 'no-cache' });
    if (res.ok) {
      const data = await res.json();
      if (data && Array.isArray(data.ordersQueue)) {
        return data;
      }
    }
  } catch (err) {}

  // Direct Supabase Fallback
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
    await fetch(getApiEndpoint(), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'orders', data: { ordersQueue, tables, updatedAt: Date.now() } })
    });
  } catch (err) {}

  // Direct Supabase Fallback
  try {
    await fetch(`${SUPABASE_URL}/rest/v1/kn_store?on_conflict=id`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify([{ id: 'orders', data: { ordersQueue, tables, updatedAt: Date.now() } }])
    });
  } catch (err) {}
};
