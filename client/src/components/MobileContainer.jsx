import React, { useEffect } from 'react';
import BottomNav from './BottomNav';
import { useApp } from '../context/AppContext';

export default function MobileContainer({ children }) {
  const { currentScreen } = useApp();
  const isAdminScreen = currentScreen === 'admin-dashboard' || currentScreen === 'admin-login';

  // BLOCK F5 & CTRL+R REFRESH KEYBOARD SHORTCUTS ON ADMIN PAGES ONLY
  useEffect(() => {
    if (!isAdminScreen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'F5' || (e.ctrlKey && e.key === 'r') || (e.metaKey && e.key === 'r')) {
        e.preventDefault();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAdminScreen]);

  return (
    <div className={`min-h-[100dvh] w-full bg-palette-gradient flex items-center justify-center p-0 sm:p-4 font-sans ${isAdminScreen ? 'overscroll-y-contain touch-none' : 'overscroll-y-auto'}`}>
      <div className="w-full max-w-md bg-[#F7FAF7] shadow-2xl h-[100dvh] sm:h-[850px] sm:rounded-[36px] overflow-hidden flex flex-col justify-between relative border border-[#D4AF37]/30 animate-fade-up">
        <div className={`flex-1 flex flex-col overflow-hidden relative ${isAdminScreen ? 'overscroll-y-contain' : 'overscroll-y-auto'}`}>
          {children}
        </div>
        <BottomNav />
      </div>
    </div>
  );
}
