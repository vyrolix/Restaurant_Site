// High-Speed Clean PostgREST Supabase Cloud Synchronization Service

const SUPABASE_URL = 'https://nkqiwnmaqcjulhjlcpqu.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_BQPy3mX-E0AYAkVCkMDZMg_Xz3_6GO7';

const getHeaders = () => ({
  'apikey': SUPABASE_ANON_KEY,
  'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
  'Content-Type': 'application/json',
  'Prefer': 'resolution=merge-duplicates',
  'Cache-Control': 'no-cache, no-store, must-revalidate'
});

// 1. MENU SYNC
export const fetchCloudMenu = async () => {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/kn_store?id=eq.menu&select=data`, {
      headers: getHeaders(),
      cache: 'no-store'
    });
    if (res.ok) {
      const rows = await res.json();
      if (rows && rows.length > 0 && rows[0].data) {
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

// 2. STOCK OVERRIDES SYNC
export const fetchCloudStock = async () => {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/kn_store?id=eq.stock_overrides&select=data`, {
      headers: getHeaders(),
      cache: 'no-store'
    });
    if (res.ok) {
      const rows = await res.json();
      if (rows && rows.length > 0 && rows[0].data) {
        return rows[0].data;
      }
    }
  } catch (err) {}
  return {};
};

export const pushCloudStock = async (stockMap) => {
  try {
    await fetch(`${SUPABASE_URL}/rest/v1/kn_store?on_conflict=id`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify([{ id: 'stock_overrides', data: stockMap }])
    });
  } catch (err) {}
};

// 3. CUSTOM IMAGES SYNC
export const fetchCloudImages = async () => {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/kn_store?id=eq.custom_images&select=data`, {
      headers: getHeaders(),
      cache: 'no-store'
    });
    if (res.ok) {
      const rows = await res.json();
      if (rows && rows.length > 0 && rows[0].data) {
        return rows[0].data;
      }
    }
  } catch (err) {}
  return {};
};

export const pushCloudImages = async (imagesMap) => {
  try {
    await fetch(`${SUPABASE_URL}/rest/v1/kn_store?on_conflict=id`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify([{ id: 'custom_images', data: imagesMap }])
    });
  } catch (err) {}
};

// 4. ORDERS SYNC
export const fetchCloudOrders = async () => {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/kn_store?id=eq.orders&select=data`, {
      headers: getHeaders(),
      cache: 'no-store'
    });
    if (res.ok) {
      const rows = await res.json();
      if (rows && rows.length > 0 && rows[0].data) {
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
