import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

let globalOrders = [];
let globalTables = Array.from({ length: 10 }, (_, i) => ({
  id: i + 1,
  capacity: i % 2 === 0 ? 4 : 2,
  status: 'Available',
  activeGuest: null
}));
let globalMenuItems = null;
let sseClients = [];

function broadcastSse(data) {
  const message = `data: ${JSON.stringify(data)}\n\n`;
  sseClients.forEach((client) => {
    try {
      client.write(message);
    } catch (err) {}
  });
}

function realtimeApiPlugin() {
  return {
    name: 'realtime-api-plugin',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = req.url || '';

        // SSE Real-Time Stream Endpoint for All Connected Devices
        if (url.startsWith('/api/stream')) {
          res.writeHead(200, {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
            'Access-Control-Allow-Origin': '*'
          });

          sseClients.push(res);

          // Send initial state immediately
          res.write(`data: ${JSON.stringify({ type: 'INIT', ordersQueue: globalOrders, tables: globalTables, menuItems: globalMenuItems })}\n\n`);

          req.on('close', () => {
            sseClients = sseClients.filter((c) => c !== res);
          });
          return;
        }

        // GET /api/orders
        if (req.method === 'GET' && url.startsWith('/api/orders')) {
          res.writeHead(200, { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          });
          res.end(JSON.stringify({ ordersQueue: globalOrders, tables: globalTables, menuItems: globalMenuItems }));
          return;
        }

        // POST /api/menu/stock (Admin toggles dish in-stock / out-of-stock)
        if (req.method === 'POST' && url.startsWith('/api/menu/stock')) {
          let body = '';
          req.on('data', (chunk) => body += chunk);
          req.on('end', () => {
            try {
              const { itemId, inStock, updatedList } = JSON.parse(body);
              if (updatedList) {
                globalMenuItems = updatedList;
              }
              broadcastSse({ type: 'MENU_UPDATE', itemId, inStock, menuItems: globalMenuItems });
              res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
              res.end(JSON.stringify({ success: true, menuItems: globalMenuItems }));
            } catch (err) {
              res.writeHead(400);
              res.end(JSON.stringify({ error: err.message }));
            }
          });
          return;
        }

        // POST /api/orders/place (Customer Places Order)
        if (req.method === 'POST' && url.startsWith('/api/orders/place')) {
          let body = '';
          req.on('data', (chunk) => body += chunk);
          req.on('end', () => {
            try {
              const data = JSON.parse(body);
              if (data.newOrder) {
                globalOrders = [data.newOrder, ...globalOrders];
                globalTables = globalTables.map((t) => 
                  Number(t.id) === Number(data.newOrder.tableId || 1) 
                    ? { ...t, status: 'Occupied', activeGuest: data.newOrder.guestName } 
                    : t
                );
                
                broadcastSse({ type: 'UPDATE', ordersQueue: globalOrders, tables: globalTables });
              }
              res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
              res.end(JSON.stringify({ success: true, ordersQueue: globalOrders, tables: globalTables }));
            } catch (err) {
              res.writeHead(400);
              res.end(JSON.stringify({ error: err.message }));
            }
          });
          return;
        }

        // POST /api/orders/status (Admin Updates Status / Customer Cancels)
        if (req.method === 'POST' && url.startsWith('/api/orders/status')) {
          let body = '';
          req.on('data', (chunk) => body += chunk);
          req.on('end', () => {
            try {
              const { orderId, nextStatus } = JSON.parse(body);
              const targetOrder = globalOrders.find((o) => o.id === orderId);
              
              if (nextStatus === 'Cancelled') {
                globalOrders = globalOrders.map((o) => o.id === orderId ? { ...o, status: 'Cancelled' } : o);
                if (targetOrder) {
                  globalTables = globalTables.map((t) => Number(t.id) === Number(targetOrder.tableId) ? { ...t, status: 'Available', activeGuest: null } : t);
                }
              } else {
                globalOrders = globalOrders.map((o) => o.id === orderId ? { ...o, status: nextStatus } : o);
                if (nextStatus === 'Served' || nextStatus === 'Session Closed') {
                  if (targetOrder) {
                    globalTables = globalTables.map((t) => Number(t.id) === Number(targetOrder.tableId) ? { ...t, status: 'Available', activeGuest: null } : t);
                  }
                }
              }

              broadcastSse({ type: 'UPDATE', ordersQueue: globalOrders, tables: globalTables });
              res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
              res.end(JSON.stringify({ success: true, ordersQueue: globalOrders, tables: globalTables }));
            } catch (err) {
              res.writeHead(400);
              res.end(JSON.stringify({ error: err.message }));
            }
          });
          return;
        }

        next();
      });
    }
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    realtimeApiPlugin(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['apple-touch-icon.png'],
      manifest: {
        name: 'K/N Restaurant',
        short_name: 'K/N Resto',
        description: 'Authentic tastes and unforgettable dining experiences.',
        theme_color: '#062F21',
        background_color: '#F7F6F3',
        display: 'standalone',
        start_url: '/',
        orientation: 'portrait',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ],
  server: {
    host: true,
  },
})
