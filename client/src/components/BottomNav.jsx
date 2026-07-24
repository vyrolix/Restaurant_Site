import React from 'react';
import { useApp } from '../context/AppContext';
import { Home, Utensils, ShoppingBag, Clock } from 'lucide-react';

export default function BottomNav() {
  const { currentScreen, setCurrentScreen, cart, activeOrder } = useApp();

  // Hide on Welcome page, Guest Name page, and Admin screens
  if (
    currentScreen === 'welcome' || 
    currentScreen === 'session-create' ||
    currentScreen === 'admin-login' || 
    currentScreen === 'admin-dashboard'
  ) {
    return null;
  }

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'menu', label: 'Menu', icon: Utensils },
    { id: 'cart', label: 'Cart', icon: ShoppingBag, badge: cartCount },
    { id: 'order-tracker', label: 'Orders', icon: Clock, activePulse: !!activeOrder }
  ];

  return (
    <div className="absolute bottom-5 inset-x-4 z-40 flex justify-center pointer-events-none">
      <div className="bg-[#06382B] text-white backdrop-blur-md rounded-full px-4 py-2.5 shadow-2xl border border-[#D4AF37]/40 flex items-center justify-around w-full max-w-[340px] pointer-events-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentScreen === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setCurrentScreen(item.id)}
              className={`transition-all duration-300 cursor-pointer flex items-center justify-center relative ${
                isActive 
                  ? 'bg-[#D4AF37] text-[#06382B] px-4 py-2 rounded-full font-bold text-xs shadow-md gap-1.5' 
                  : 'p-2.5 text-white/70 hover:text-white hover:bg-white/10 rounded-full'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />

              {isActive && (
                <span className="text-[11px] font-bold tracking-wide">
                  {item.label}
                </span>
              )}

              {item.badge > 0 && !isActive && (
                <span className="absolute -top-1 -right-1 bg-[#D4AF37] text-[#06382B] text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                  {item.badge}
                </span>
              )}

              {item.activePulse && !item.badge && !isActive && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-emerald-400 rounded-full animate-ping" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
