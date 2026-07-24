// Cloud Real-time Synchronization Service for Vercel Deployment

const CLOUD_BIN_ID = 'kn_restaurant_satna_v1';
const CLOUD_API_BASE = 'https://api.jsonbin.io/v3/b';

// Fallback high-speed Public Cloud Sync Endpoint for Vercel persistence
const PUBLIC_KV_URL = `https://kvdb.io/Wk6fCjG9F8D3JpZ9/kn_menu_store_${CLOUD_BIN_ID}`;
const PUBLIC_ORDERS_URL = `https://kvdb.io/Wk6fCjG9F8D3JpZ9/kn_orders_store_${CLOUD_BIN_ID}`;

export const fetchCloudMenu = async () => {
  try {
    const res = await fetch(PUBLIC_KV_URL, { cache: 'no-cache' });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        return data;
      }
    }
  } catch (err) {
    // Graceful fallback if offline
  }
  return null;
};

export const pushCloudMenu = async (menuItems) => {
  try {
    await fetch(PUBLIC_KV_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(menuItems)
    });
  } catch (err) {
    console.error('Cloud menu sync error:', err);
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
  } catch (err) {
    // Graceful fallback if offline
  }
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
    console.error('Cloud orders sync error:', err);
  }
};
