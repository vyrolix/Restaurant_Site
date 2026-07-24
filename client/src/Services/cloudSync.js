// Ultra-Reliable Cloud Real-time Synchronization Service for Vercel & Multi-Device Deployment

const SYNC_API_ENDPOINT = 'https://api.jsonbin.io/v3/b/6690f055e41b4d34e402a4b8';
const SYNC_KEY = '$2a$10$7vM7j.Z9T.680KqO9n60O./y824x/FwJ8v2dD3B6C9A2b3c4d5e6f';

// Secondary Failover Cloud Sync Endpoint
const PUBLIC_KV_URL = 'https://kvdb.io/Wk6fCjG9F8D3JpZ9/kn_menu_store_satna_v2';
const PUBLIC_ORDERS_URL = 'https://kvdb.io/Wk6fCjG9F8D3JpZ9/kn_orders_store_satna_v2';

export const fetchCloudMenu = async () => {
  try {
    const res = await fetch(PUBLIC_KV_URL, { cache: 'no-cache' });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        return data;
      }
    }
  } catch (err) {}
  return null;
};

export const pushCloudMenu = async (menuItems) => {
  if (!menuItems || menuItems.length === 0) return;
  try {
    await fetch(PUBLIC_KV_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(menuItems)
    });
  } catch (err) {
    console.error('Cloud menu push error:', err);
  }
};

export const fetchCloudOrders = async () => {
  try {
    const res = await fetch(PUBLIC_ORDERS_URL, { cache: 'no-cache' });
    if (res.ok) {
      const data = await res.json();
      if (data && Array.isArray(data.ordersQueue)) {
        return data;
      }
    }
  } catch (err) {}
  return null;
};

export const pushCloudOrders = async (ordersQueue, tables) => {
  try {
    await fetch(PUBLIC_ORDERS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ordersQueue, tables, updatedAt: Date.now() })
    });
  } catch (err) {
    console.error('Cloud orders push error:', err);
  }
};
