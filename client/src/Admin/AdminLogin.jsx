import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import MobileContainer from '../components/MobileContainer';
import { Shield, Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react';

export default function AdminLogin() {
  const { adminLogin, setCurrentScreen } = useApp();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const success = await adminLogin(password);
      if (!success) {
        setError('Incorrect passcode. Access Denied.');
      }
    } catch (err) {
      setError('Authentication failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <MobileContainer>
      <div className="flex-1 flex flex-col justify-between p-6 pb-20 bg-palette-light-gradient relative overflow-y-auto">
        <button 
          onClick={() => setCurrentScreen('welcome')}
          className="absolute top-6 left-6 text-[#06382B] hover:text-[#04291F] flex items-center gap-1.5 text-xs font-semibold cursor-pointer z-10"
        >
          <ArrowLeft className="w-4 h-4" /> Exit Manager
        </button>

        <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4 pt-10">
          <div className="w-20 h-20 bg-[#06382B] text-[#D4AF37] rounded-3xl flex items-center justify-center shadow-xl border border-[#D4AF37]/40">
            <Shield className="w-10 h-10" />
          </div>
          
          <div className="space-y-1.5">
            <h1 className="font-serif text-[#06382B] text-2xl font-bold">
              Manager Portal
            </h1>
            <p className="text-[#06382B]/80 text-xs max-w-[260px] mx-auto leading-relaxed">
              Enter secure passcode to access Live KDS, Table Manager, and Menu controls.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="w-full space-y-4 pb-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-xs p-3 rounded-xl text-center font-semibold animate-shake">
              {error}
            </div>
          )}

          <div className="space-y-1 relative">
            <label className="text-xs uppercase tracking-wider text-[#06382B] font-semibold pl-1">
              Passcode
            </label>
            <div className="relative">
              <input 
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter passcode..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white border border-[#06382B]/30 rounded-2xl py-4 pl-11 pr-12 text-[#06382B] placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] text-sm"
                required
              />
              <Lock className="w-4 h-4 text-[#D4AF37] absolute left-4 top-4" />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-4 text-[#06382B]/60 hover:text-[#06382B] cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-[#06382B] hover:bg-[#04291F] text-[#D4AF37] py-4 rounded-2xl font-bold shadow-lg transition-all duration-300 transform active:scale-95 cursor-pointer text-sm border border-[#D4AF37]/40 flex items-center justify-center gap-2"
          >
            {loading ? 'Verifying...' : 'Authenticate & Access Dashboard'}
          </button>
        </form>
      </div>
    </MobileContainer>
  );
}
