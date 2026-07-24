import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ChefHat, CheckCircle2, Play, Check, Bell, Clock, Trash2 } from 'lucide-react';

export default function KitchenQueue() {
  const { ordersQueue, updateOrderStatus } = useApp();
  const [filterTab, setFilterTab] = useState('All Active');

  const getNextStatusLabel = (currentStatus) => {
    switch (currentStatus) {
      case 'Pending': return { label: 'Accept Order', next: 'Accepted', icon: Check, color: 'bg-[#06382B] text-white hover:bg-[#04291F]' };
      case 'Accepted': return { label: 'Mark Preparing', next: 'Preparing', icon: Play, color: 'bg-amber-600 text-white hover:bg-amber-700' };
      case 'Preparing': return { label: 'Mark Ready', next: 'Ready', icon: Bell, color: 'bg-blue-600 text-white hover:bg-blue-700' };
      case 'Ready': return { label: 'Mark Served & Close Session', next: 'Served', icon: CheckCircle2, color: 'bg-emerald-700 text-white hover:bg-emerald-800' };
      default: return null;
    }
  };

  // Filter Active vs Completed/Cancelled orders
  const activeOrders = ordersQueue.filter((o) => o.status !== 'Served' && o.status !== 'Cancelled' && o.status !== 'Session Closed');
  const historyOrders = ordersQueue.filter((o) => o.status === 'Served' || o.status === 'Cancelled' || o.status === 'Session Closed');

  const displayedOrders = filterTab === 'All Active' 
    ? activeOrders
    : filterTab === 'History'
    ? historyOrders
    : ordersQueue.filter((o) => o.status === filterTab);

  return (
    <div className="p-4 space-y-4 font-sans text-xs">
      {/* Header Bar */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="font-serif font-bold text-[#06382B] text-base">Live Kitchen Workstation</h3>
          <span className="text-[10px] text-neutral-500">Real-time KDS Order Execution</span>
        </div>
        <span className="bg-[#06382B] text-[#D4AF37] px-3 py-1 rounded-full text-xs font-bold font-mono shadow-xs">
          {activeOrders.length} Orders Active
        </span>
      </div>

      {/* Status Filter Pills */}
      <div className="flex gap-1.5 overflow-x-auto scrollbar-none pb-1">
        {['All Active', 'Pending', 'Accepted', 'Preparing', 'Ready', 'History'].map((st) => {
          const count = st === 'All Active' 
            ? activeOrders.length 
            : st === 'History' 
            ? historyOrders.length 
            : ordersQueue.filter((o) => o.status === st).length;

          return (
            <button
              key={st}
              onClick={() => setFilterTab(st)}
              className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer border ${
                filterTab === st
                  ? 'bg-[#06382B] text-[#D4AF37] border-[#06382B] shadow-xs'
                  : 'bg-white text-neutral-600 border-neutral-200 hover:bg-neutral-50'
              }`}
            >
              {st} ({count})
            </button>
          );
        })}
      </div>

      {/* Orders List */}
      {displayedOrders.length === 0 ? (
        <div className="bg-white rounded-2xl p-10 text-center border border-neutral-200/80 shadow-2xs space-y-3">
          <ChefHat className="w-12 h-12 mx-auto text-[#D4AF37]" />
          <h4 className="font-serif font-bold text-sm text-[#06382B]">No Orders in "{filterTab}"</h4>
          <p className="text-neutral-400 text-xs max-w-[240px] mx-auto">
            When customer orders match this status, they will appear here live.
          </p>
        </div>
      ) : (
        <div className="space-y-3.5">
          {displayedOrders.map((order) => {
            const statusInfo = getNextStatusLabel(order.status);
            return (
              <div 
                key={order.id}
                className={`bg-white p-4 rounded-2xl border shadow-2xs space-y-3 relative overflow-hidden transition-all ${
                  order.status === 'Pending' 
                    ? 'border-amber-300 ring-2 ring-amber-400/30' 
                    : 'border-neutral-200/80'
                }`}
              >
                {/* Header info */}
                <div className="flex justify-between items-start border-b border-neutral-100 pb-2.5">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="bg-[#06382B] text-[#D4AF37] px-2.5 py-0.5 rounded-full text-xs font-bold font-mono">
                        Table {order.tableId}
                      </span>
                      <span className="font-bold text-[#06382B] text-sm">{order.guestName}</span>
                    </div>
                    <span className="text-[10px] text-neutral-400 mt-0.5 block font-mono">
                      Order #{order.id} • {order.timestamp || 'Just Now'}
                    </span>
                  </div>

                  <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                    order.status === 'Pending' ? 'bg-amber-100 text-amber-800 border border-amber-300 animate-pulse' :
                    order.status === 'Accepted' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' :
                    order.status === 'Preparing' ? 'bg-blue-100 text-blue-800 border border-blue-300' :
                    order.status === 'Ready' ? 'bg-purple-100 text-purple-800 border border-purple-300' :
                    order.status === 'Served' ? 'bg-emerald-700 text-white font-bold' :
                    'bg-neutral-100 text-neutral-800'
                  }`}>
                    {order.status}
                  </span>
                </div>

                {/* Items breakdown */}
                <div className="space-y-1.5 text-xs text-[#06382B]">
                  {order.items && order.items.map((ci, idx) => (
                    <div key={idx} className="flex justify-between items-center bg-neutral-50 px-2.5 py-1.5 rounded-lg border border-neutral-100">
                      <span className="font-medium text-neutral-800">
                        {ci.item.name} <span className="text-[#06382B] font-bold">x{ci.quantity}</span>
                      </span>
                      <span className="text-neutral-500 font-mono text-[11px]">₹{(ci.item.price * ci.quantity).toFixed(0)}</span>
                    </div>
                  ))}
                </div>

                {/* Total & Action Button */}
                <div className="flex justify-between items-center pt-2 border-t border-neutral-100">
                  <div className="font-serif font-bold text-sm text-[#06382B]">
                    Total: ₹{order.total}
                  </div>

                  {statusInfo ? (
                    <button 
                      onClick={() => updateOrderStatus(order.id, statusInfo.next)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer flex items-center gap-1.5 shadow-sm active:scale-95 ${statusInfo.color}`}
                    >
                      <statusInfo.icon className="w-3.5 h-3.5" />
                      {statusInfo.label}
                    </button>
                  ) : (
                    <span className="text-emerald-700 font-bold text-xs inline-flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Completed
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
