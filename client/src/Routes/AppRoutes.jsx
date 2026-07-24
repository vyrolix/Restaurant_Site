import React, { useEffect } from 'react';
import { useApp } from '../context/AppContext';
import Welcome from '../Customer/Welcome';
import CustomerHome from '../Customer/pages/CustomerHome';
import SessionCreate from '../Customer/pages/SessionCreate';
import MenuExplorer from '../Customer/pages/MenuExplorer';
import CartPreview from '../Customer/pages/CartPreview';
import OrderTracker from '../Customer/pages/OrderTracker';
import AdminLogin from '../Admin/AdminLogin';
import AdminDashboard from '../Admin/pages/AdminDashboard';

export default function AppRoutes() {
  const { currentScreen, setCurrentScreen } = useApp();

  // Automatic QR Code Scan Detection & Routing
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const scannedTable = params.get('table');
      if (scannedTable) {
        setCurrentScreen('session-create');
      }
    }
  }, []);

  switch (currentScreen) {
    case 'welcome':
      return <Welcome />;
    case 'home':
      return <CustomerHome />;
    case 'session-create':
      return <SessionCreate />;
    case 'menu':
      return <MenuExplorer />;
    case 'cart':
      return <CartPreview />;
    case 'order-tracker':
      return <OrderTracker />;
    case 'admin-login':
      return <AdminLogin />;
    case 'admin-dashboard':
      return <AdminDashboard />;
    default:
      return <Welcome />;
  }
}
