import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import MobileContainer from '../../components/MobileContainer';
import { ChefHat, Grid, Utensils, LogOut, TrendingUp, Bell, X, ArrowRight, Calendar } from 'lucide-react';
import KitchenQueue from './KitchenQueue';
import TableManager from './TableManager';
import MenuManager from './MenuManager';

export default function AdminDashboard() {
  const { adminLogout, ordersQueue } = useApp();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [timePeriod, setTimePeriod] = useState('today'); // Default is 'today'
  const [newOrderPopup, setNewOrderPopup] = useState(null);
  const prevOrdersCountRef = useRef(ordersQueue.length);

  // LISTEN FOR LIVE NEW ORDERS TO SHOW POPUP TOAST
  useEffect(() => {
    if (ordersQueue.length > prevOrdersCountRef.current) {
      const latestOrder = ordersQueue[0];
      if (latestOrder && latestOrder.status === 'Pending') {
        setNewOrderPopup(latestOrder);
      }
    }
    prevOrdersCountRef.current = ordersQueue.length;
  }, [ordersQueue]);

  // DATE FILTERING FOR TODAY, MONTH, YEAR
  const now = new Date();
  const todayDateString = now.toDateString();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const filteredOrders = ordersQueue.filter((ord) => {
    const ordDate = ord.createdTimestamp ? new Date(ord.createdTimestamp) : new Date();
    if (timePeriod === 'today') {
      return ordDate.toDateString() === todayDateString;
    }
    if (timePeriod === 'month') {
      return ordDate.getMonth() === currentMonth && ordDate.getFullYear() === currentYear;
    }
    if (timePeriod === 'year') {
      return ordDate.getFullYear() === currentYear;
    }
    return true;
  });

  // Compute Genuine Live Data directly from filtered customer orders
  const totalRevenue = filteredOrders.reduce((sum, ord) => sum + (ord.total || 0), 0);
  const totalOrdersCount = filteredOrders.length;
  const pendingCount = filteredOrders.filter((o) => o.status === 'Pending').length;
  const completedCount = filteredOrders.filter((o) => o.status === 'Served' || o.status === 'Paid' || o.status === 'Session Closed').length;

  return (
    <MobileContainer>
      {/* Top Header Bar */}
      <div className="bg-[#06382B] p-4 text-white flex justify-between items-center shrink-0 border-b border-[#D4AF37]/30 shadow-md">
        <div>
          <h2 className="font-serif font-bold text-lg leading-tight text-[#D4AF37]">Dashboard</h2>
          <span className="text-[10px] text-white/80 uppercase tracking-wider font-semibold">
            Manager Portal • Live KDS Sync
          </span>
        </div>
        <button 
          onClick={adminLogout}
          className="bg-white/10 hover:bg-red-900/50 text-[#D4AF37] hover:text-red-300 p-2 rounded-xl border border-white/20 transition-colors cursor-pointer flex items-center gap-1 text-xs font-semibold"
        >
          <LogOut className="w-4 h-4" /> Exit
        </button>
      </div>

      {/* Admin Navigation Sub-Tabs */}
      <div className="flex bg-[#06382B]/10 px-2 py-1.5 gap-1 border-b border-[#06382B]/15 shrink-0 overflow-x-auto scrollbar-none">
        {[
          { id: 'dashboard', label: 'Dashboard', icon: TrendingUp },
          { id: 'kds', label: `Orders (${ordersQueue.filter((o) => o.status === 'Pending').length} Pending)`, icon: ChefHat },
          { id: 'tables', label: 'Tables & QR', icon: Grid },
          { id: 'menu', label: 'Menu Mgmt', icon: Utensils }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-1.5 px-3 rounded-xl text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-[#06382B] text-[#D4AF37] shadow-xs'
                  : 'text-[#06382B] hover:bg-white/60'
              }`}
            >
              <Icon className="w-3.5 h-3.5" /> {tab.label}
            </button>
          );
        })}
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto pb-24 bg-[#F7FAF7] relative">
        
        {/* LIVE NEW ORDER POPUP BANNER TOAST */}
        {newOrderPopup && (
          <div className="sticky top-3 inset-x-3 z-50 animate-bounce transition-all">
            <div className="bg-[#04291F] text-[#FAF7F2] p-4 rounded-2xl shadow-2xl border-2 border-[#D4AF37] space-y-2.5">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-[#D4AF37] text-[#06382B] rounded-full animate-pulse">
                    <Bell className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold tracking-widest text-[#D4AF37] uppercase block">
                      🔔 Live Order Placed!
                    </span>
                    <h4 className="font-serif font-bold text-white text-base">
                      {newOrderPopup.id} • Table {newOrderPopup.tableId || 1}
                    </h4>
                  </div>
                </div>
                <button 
                  onClick={() => setNewOrderPopup(null)}
                  className="text-white/60 hover:text-white p-1 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="bg-white/10 p-2.5 rounded-xl text-xs flex justify-between items-center text-white/90">
                <div>
                  <span className="font-semibold">{newOrderPopup.guestName}</span>
                  <p className="text-[10px] text-white/70">{newOrderPopup.items.length} items • {newOrderPopup.timestamp}</p>
                </div>
                <span className="font-serif font-bold text-[#D4AF37] text-sm">₹{newOrderPopup.total}</span>
              </div>

              <div className="flex gap-2 pt-0.5">
                <button 
                  onClick={() => {
                    setActiveTab('kds');
                    setNewOrderPopup(null);
                  }}
                  className="flex-1 bg-[#D4AF37] hover:bg-[#b8982e] text-[#06382B] py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1 cursor-pointer transition-colors shadow-md"
                >
                  View Kitchen Queue <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button 
                  onClick={() => setNewOrderPopup(null)}
                  className="bg-white/10 hover:bg-white/20 text-white px-3 py-2 rounded-xl text-xs font-semibold cursor-pointer"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'dashboard' && (
          <div className="p-4 space-y-4 font-sans">
            
            {/* TIME PERIOD SELECTOR PANEL (Today, Month, Year - Default: Today) */}
            <div className="bg-white p-3 rounded-2xl border border-neutral-200/80 shadow-2xs space-y-2.5">
              <div className="flex justify-between items-center text-xs font-bold text-[#06382B]">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-[#D4AF37]" /> Sales Period Overview
                </span>
                <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 uppercase">
                  {timePeriod}
                </span>
              </div>

              {/* Selector Pills: Today, Month, Year */}
              <div className="flex bg-[#06382B]/10 p-1 rounded-xl gap-1">
                {[
                  { id: 'today', label: 'Today' },
                  { id: 'month', label: 'Month' },
                  { id: 'year', label: 'Year' }
                ].map((period) => (
                  <button
                    key={period.id}
                    onClick={() => setTimePeriod(period.id)}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      timePeriod === period.id
                        ? 'bg-[#06382B] text-[#D4AF37] shadow-xs'
                        : 'text-[#06382B]/70 hover:text-[#06382B]'
                    }`}
                  >
                    {period.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Status Summary Cards: Show Pending & Completed ONLY in Today Panel */}
            {timePeriod === 'today' ? (
              <div className="grid grid-cols-3 gap-3 text-center text-xs">
                <div className="bg-white p-3 rounded-2xl border border-neutral-200/80 shadow-2xs">
                  <span className="font-bold text-[#06382B] text-lg block">{totalOrdersCount}</span>
                  <span className="text-[9px] text-neutral-500 uppercase font-semibold">Total Orders</span>
                </div>
                
                <div className="bg-amber-50 p-3 rounded-2xl border border-amber-200 text-amber-800 shadow-2xs">
                  <span className="font-bold text-amber-700 text-lg block">{pendingCount}</span>
                  <span className="text-[9px] uppercase font-semibold">Pending</span>
                </div>

                <div className="bg-emerald-50 p-3 rounded-2xl border border-emerald-200 text-emerald-800 shadow-2xs">
                  <span className="font-bold text-emerald-700 text-lg block">{completedCount}</span>
                  <span className="text-[9px] uppercase font-semibold">Completed</span>
                </div>
              </div>
            ) : (
              <div className="bg-emerald-50 p-3.5 rounded-2xl border border-emerald-200 text-emerald-900 shadow-2xs text-center">
                <span className="font-bold text-emerald-700 text-2xl block font-serif">{completedCount}</span>
                <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-800">
                  Total Orders Completed ({timePeriod.toUpperCase()})
                </span>
              </div>
            )}

            {/* Genuine Sales Overview Card */}
            <div className="bg-white p-4 rounded-2xl border border-neutral-200/80 shadow-2xs space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-[#06382B]">
                  Genuine {timePeriod.toUpperCase()} Sales Overview
                </span>
                <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  Live Sync Active
                </span>
              </div>

              <div className="font-serif font-bold text-2xl text-[#06382B]">
                ₹ {totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>

              <p className="text-[10px] text-neutral-400">
                Calculated directly from real customer orders placed in real-time.
              </p>
            </div>

            {/* Live Customer Orders Feed */}
            <div className="bg-white p-4 rounded-2xl border border-neutral-200/80 shadow-2xs space-y-3">
              <div className="flex justify-between items-center border-b border-neutral-100 pb-2">
                <span className="text-xs font-bold text-[#06382B]">Recent User Orders</span>
                <button onClick={() => setActiveTab('kds')} className="text-[11px] text-[#06382B] font-semibold cursor-pointer">View Kitchen KDS &rarr;</button>
              </div>

              <div className="space-y-2.5">
                {filteredOrders.slice(0, 4).map((ord) => (
                  <div key={ord.id} className="flex justify-between items-center text-xs p-2 bg-[#F7FAF7] rounded-xl border border-neutral-100">
                    <div>
                      <h5 className="font-bold text-[#06382B]">{ord.id} • Table {ord.tableId || 1}</h5>
                      <span className="text-[10px] text-neutral-500">{ord.guestName} • {ord.timestamp}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-serif font-bold text-[#06382B] block">₹{ord.total}</span>
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full inline-block ${
                        ord.status === 'Pending' ? 'bg-amber-100 text-amber-800' :
                        ord.status === 'Preparing' ? 'bg-blue-100 text-blue-800' :
                        'bg-emerald-100 text-emerald-800'
                      }`}>
                        {ord.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {activeTab === 'kds' && <KitchenQueue />}
        {activeTab === 'tables' && <TableManager />}
        {activeTab === 'menu' && <MenuManager />}
      </div>
    </MobileContainer>
  );
}
