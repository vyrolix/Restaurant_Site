// REST API Gateway & Request Handlers (Matching PDF Section 6)

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Auth & Session Endpoints
 */
export async function loginAdmin(credentials) {
  // Simulates POST /api/auth/login
  return { success: credentials.password === 'admin' || credentials.password === 'admin123' };
}

export async function createDineInSession(tableId, guestName) {
  // Simulates POST /api/session/create
  return {
    success: true,
    sessionId: `sess-${Date.now()}`,
    tableId,
    guestName
  };
}

/**
 * Menu & Category Endpoints
 */
export async function fetchMenu() {
  // Simulates GET /api/menu
  return { success: true };
}

/**
 * Orders Endpoints
 */
export async function placeCustomerOrder(orderData) {
  // Simulates POST /api/orders
  return {
    success: true,
    orderId: `ord-${Math.floor(1000 + Math.random() * 9000)}`,
    status: 'Pending'
  };
}

export async function fetchOrderStatus(orderId) {
  // Simulates GET /api/orders/:id/status
  return { success: true, orderId };
}

/**
 * Admin Management Endpoints
 */
export async function fetchAdminAnalytics() {
  // Simulates GET /api/admin/dashboard
  return { success: true };
}

export async function updateOrderStatusAPI(orderId, status) {
  // Simulates PATCH /api/admin/orders/:id
  return { success: true, orderId, status };
}

export async function fetchTableStatuses() {
  // Simulates GET /api/admin/tables
  return { success: true };
}
