// Official Direct Supabase Cloud Synchronization Service for Multi-Device & Cross-Network Deployment

const SUPABASE_URL = 'https://nkqiwnmaqcjulhjlcpqu.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_BQPy3mX-E0AYAkVCkMDZMg_Xz3_6GO7';

const getHeaders = () => ({
  'apikey': SUPABASE_ANON_KEY,
  'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
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
    await fetch(`${SUPABASE_URL}/rest/v1/kn_store?on_conflict=id`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify([{ id: 'menu', data: menuItems }])
    });
  } catch (err) {}
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
  } catch (err) {}
};
