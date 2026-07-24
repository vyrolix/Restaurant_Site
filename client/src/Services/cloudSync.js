// Official Direct Supabase Cloud Synchronization Service with Version Timestamping

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
    const res = await fetch(`${SUPABASE_URL}/rest/v1/kn_store?id=eq.menu&select=data&_t=${Date.now()}`, {
      headers: getHeaders(),
      cache: 'no-store'
    });
    if (res.ok) {
      const rows = await res.json();
      if (rows && rows.length > 0 && rows[0].data) {
        return rows[0].data; // returns { updatedAt, items } or Array
      }
    }
  } catch (err) {}
  return null;
};

export const pushCloudMenu = async (menuItems, updatedAt = Date.now()) => {
  if (!menuItems || !Array.isArray(menuItems) || menuItems.length < 5) return;
  
  const payload = {
    updatedAt,
    items: menuItems
  };

  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/kn_store?on_conflict=id`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify([{ id: 'menu', data: payload }])
    });
    if (!res.ok) {
      console.warn('Cloud menu push returned status:', res.status);
    }
  } catch (err) {
    console.error('Cloud menu push failed:', err);
  }
};

export const fetchCloudOrders = async () => {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/kn_store?id=eq.orders&select=data&_t=${Date.now()}`, {
      headers: getHeaders(),
      cache: 'no-store'
    });
    if (res.ok) {
      const rows = await res.json();
      if (rows && rows.length > 0 && rows[0].data) {
        return rows[0].data; // returns { updatedAt, ordersQueue, tables }
      }
    }
  } catch (err) {}
  return null;
};

export const pushCloudOrders = async (ordersQueue, tables, updatedAt = Date.now()) => {
  const payload = {
    updatedAt,
    ordersQueue,
    tables
  };

  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/kn_store?on_conflict=id`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify([{ id: 'orders', data: payload }])
    });
    if (!res.ok) {
      console.warn('Cloud orders push returned status:', res.status);
    }
  } catch (err) {
    console.error('Cloud orders push failed:', err);
  }
};
