import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import MobileContainer from '../components/MobileContainer';
import { Shield, Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react';

export default function AdminLogin() {
  const { adminLogin, setCurrentScreen } = useApp();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    const success = adminLogin(password);
    if (!success) {
      setError('Invalid Manager Passcode. Try "admin" or "admin123".');
    }
  };

  return (
    <MobileContainer>
      <div className="flex-1 flex flex-col justify-between p-6 pb-20 bg-palette-light-gradient relative overflow-y-auto">
        <button 
          onClick={() => setCurrentScreen('welcome')}
          className="absolute top-6 left-6 text-[#1A1A1A] hover:text-[#5E4B43] flex items-center gap-1.5 text-xs font-semibold cursor-pointer z-10"
        >
          <ArrowLeft className="w-4 h-4" /> Exit Manager
        </button>

        <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4 pt-10">
          <div className="w-20 h-20 bg-[#1A1A1A] text-[#C5A880] rounded-3xl flex items-center justify-center shadow-xl border border-[#5E4B43]/40 animate-pulse-glow">
            <Shield className="w-10 h-10" />
          </div>
          
          <div className="space-y-1.5">
            <h1 className="font-serif text-[#1A1A1A] text-2xl font-bold">
              Manager Portal Login
            </h1>
            <p className="text-[#5E4B43]/80 text-xs max-w-[260px] mx-auto">
              Access live Kitchen KDS, Table Manager, Analytics, and Menu controls.
            </p>
          </div>

          <div className="bg-[#1A1A1A]/10 text-[#1A1A1A] px-3.5 py-1 rounded-full text-[11px] font-mono font-medium border border-[#5E4B43]/20">
            Passcode: <span className="font-bold underline">admin</span> or <span className="font-bold underline">admin123</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="w-full space-y-4 pb-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-xs p-3 rounded-xl text-center animate-shake">
              {error}
            </div>
          )}

          <div className="space-y-1 relative">
            <label className="text-xs uppercase tracking-wider text-[#5E4B43] font-semibold pl-1">
              Manager Passcode
            </label>
            <div className="relative">
              <input 
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter passcode..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white border border-[#5E4B43]/40 rounded-2xl py-4 pl-11 pr-12 text-[#1A1A1A] placeholder-[#5E4B43]/60 focus:outline-none focus:ring-2 focus:ring-[#C5A880] text-sm"
                required
              />
              <Lock className="w-4 h-4 text-[#C5A880] absolute left-4 top-4" />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-4 text-[#C5A880] hover:text-[#1A1A1A] cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button 
            type="submit"
            className="w-full bg-[#1A1A1A] hover:bg-[#2D2522] text-[#C5A880] py-4 rounded-full font-bold shadow-lg transition-all duration-300 transform active:scale-95 cursor-pointer text-sm border border-[#5E4B43]/40"
          >
            Authenticate & Access Dashboard
          </button>
        </form>
      </div>
    </MobileContainer>
  );
}
