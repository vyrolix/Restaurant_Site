import React, { useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Welcome from './Customer/Welcome';
import SessionCreate from './Customer/pages/SessionCreate';
import MenuExplorer from './Customer/pages/MenuExplorer';
import CartPreview from './Customer/pages/CartPreview';
import OrderTracker from './Customer/pages/OrderTracker';

function MainRouter() {
  const { currentScreen, setCurrentScreen, tableId, isDineIn } = useApp();

  // Route protection: If table detected but name not entered, force session creation
  useEffect(() => {
    if (tableId && !isDineIn) {
      setCurrentScreen('session-create');
    }
  }, [tableId, isDineIn]);

  switch (currentScreen) {
    case 'welcome':
      return <Welcome />;
    case 'session-create':
      return <SessionCreate />;
    case 'menu':
      return <MenuExplorer />;
    case 'cart':
      return <CartPreview />;
    case 'order-tracker':
      return <OrderTracker />;
    default:
      return <Welcome />;
  }
}

function App() {
  return (
    <AppProvider>
      <MainRouter />
    </AppProvider>
  );
}

export default App;


