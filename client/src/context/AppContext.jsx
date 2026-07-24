import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

// Mock Menu Items using our generated image assets
const mockMenuItems = [
  {
    id: 'm1',
    name: 'Signature Ribeye Steak',
    description: 'Perfected grilled ribeye steak with a sprig of fresh rosemary and premium spice rub.',
    price: 34.99,
    category: 'Mains',
    image: 'steak'
  },
  {
    id: 'm2',
    name: 'Crispy Seared Salmon',
    description: 'Crispy-skin pan-seared salmon fillet over smooth vibrant green pea purée.',
    price: 28.99,
    category: 'Mains',
    image: 'salmon'
  },
  {
    id: 'm3',
    name: 'Premium Garden Salad',
    description: 'Vibrant mix of cherry tomatoes, sliced cucumbers, crisp greens, and cold-pressed olive oil.',
    price: 12.99,
    category: 'Starters',
    image: 'salad'
  },
  {
    id: 'm4',
    name: 'Crispy Rosemary Bites',
    description: 'Gourmet roasted potato bites flavored with garlic, rock salt, and chopped rosemary.',
    price: 9.99,
    category: 'Starters',
    image: 'table'
  },
  {
    id: 'm5',
    name: 'Fine House Red Wine',
    description: 'A smooth glass of house red wine, curated to pair perfectly with our ribeye steak.',
    price: 14.99,
    category: 'Drinks',
    image: 'table'
  }
];

export const ORDER_STATES = [
  'Customer Cart',
  'Place Order',
  'Pending',
  'Accepted',
  'Preparing',
  'Ready',
  'Served',
  'Paid',
  'Session Closed'
];

export function AppProvider({ children }) {
  // Navigation State
  const [currentScreen, setCurrentScreen] = useState('welcome');
  
  // Session & Table State
  const [tableId, setTableId] = useState(null);
  const [guestName, setGuestName] = useState('');
  const [isDineIn, setIsDineIn] = useState(false);
  
  // Cart State
  const [cart, setCart] = useState([]);
  
  // Order State
  const [activeOrder, setActiveOrder] = useState(null);

  // URL Table Detection on startup
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tableParam = params.get('table');
    if (tableParam) {
      setTableId(tableParam);
      // Retrieve existing session if any
      const savedName = localStorage.getItem(`kn_guest_name_t${tableParam}`);
      if (savedName) {
        setGuestName(savedName);
        setIsDineIn(true);
      }
    }
  }, []);

  // Cart Functions
  const addToCart = (item) => {
    setCart((prevCart) => {
      const existing = prevCart.find((ci) => ci.item.id === item.id);
      if (existing) {
        return prevCart.map((ci) => 
          ci.item.id === item.id ? { ...ci, quantity: ci.quantity + 1 } : ci
        );
      }
      return [...prevCart, { item, quantity: 1 }];
    });
  };

  const removeFromCart = (itemId) => {
    setCart((prevCart) => {
      const existing = prevCart.find((ci) => ci.item.id === itemId);
      if (existing && existing.quantity > 1) {
        return prevCart.map((ci) => 
          ci.item.id === itemId ? { ...ci, quantity: ci.quantity - 1 } : ci
        );
      }
      return prevCart.filter((ci) => ci.item.id !== itemId);
    });
  };

  const updateQuantity = (itemId, qty) => {
    if (qty <= 0) {
      setCart((prevCart) => prevCart.filter((ci) => ci.item.id !== itemId));
    } else {
      setCart((prevCart) => 
        prevCart.map((ci) => ci.item.id === itemId ? { ...ci, quantity: qty } : ci)
      );
    }
  };

  const clearCart = () => setCart([]);

  // Session Start Function
  const startSession = (name) => {
    if (name.trim() && tableId) {
      setGuestName(name);
      setIsDineIn(true);
      localStorage.setItem(`kn_guest_name_t${tableId}`, name);
      setCurrentScreen('menu');
    }
  };

  // End Session Function
  const endSession = () => {
    if (tableId) {
      localStorage.removeItem(`kn_guest_name_t${tableId}`);
    }
    setGuestName('');
    setIsDineIn(false);
    setCart([]);
    setActiveOrder(null);
    setCurrentScreen('welcome');
    // Clear URL query parameters
    window.history.pushState({}, document.title, window.location.pathname);
    setTableId(null);
  };

  // Place Order
  const placeOrder = () => {
    if (cart.length === 0) return;
    
    const newOrder = {
      id: `ord-${Math.floor(1000 + Math.random() * 9000)}`,
      items: [...cart],
      status: 'Pending', // Initial status
      tableId,
      guestName,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      total: calculateCartTotals().total
    };
    
    setActiveOrder(newOrder);
    setCart([]); // Clear cart
    setCurrentScreen('order-tracker');
  };

  // Calculate Totals
  const calculateCartTotals = () => {
    const subtotal = cart.reduce((acc, ci) => acc + (ci.item.price * ci.quantity), 0);
    const tax = subtotal * 0.05; // 5% GST
    const total = subtotal + tax;
    return {
      subtotal: parseFloat(subtotal.toFixed(2)),
      tax: parseFloat(tax.toFixed(2)),
      total: parseFloat(total.toFixed(2))
    };
  };

  // Simulation Trigger to cycle through states
  const advanceOrderStatus = () => {
    if (!activeOrder) return;
    
    const statusSequence = ['Pending', 'Accepted', 'Preparing', 'Ready', 'Served', 'Paid', 'Session Closed'];
    const currentIndex = statusSequence.indexOf(activeOrder.status);
    
    if (currentIndex !== -1 && currentIndex < statusSequence.length - 1) {
      const nextStatus = statusSequence[currentIndex + 1];
      setActiveOrder((prev) => {
        const updated = { ...prev, status: nextStatus };
        if (nextStatus === 'Session Closed') {
          // Auto end session on close
          setTimeout(() => {
            endSession();
          }, 1500);
        }
        return updated;
      });
    }
  };

  return (
    <AppContext.Provider value={{
      currentScreen,
      setCurrentScreen,
      tableId,
      guestName,
      isDineIn,
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      startSession,
      endSession,
      placeOrder,
      activeOrder,
      calculateCartTotals,
      advanceOrderStatus,
      menuItems: mockMenuItems
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
