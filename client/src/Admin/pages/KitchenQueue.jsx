import React from 'react';
import { useApp } from '../../context/AppContext';
import { ChefHat, CheckCircle2, Play, Check, Bell } from 'lucide-react';

export default function KitchenQueue() {
  const { ordersQueue, updateOrderStatus } = useApp();

  const getNextStatusLabel = (currentStatus) => {
    switch (currentStatus) {
      case 'Pending': return { label: 'Accept Order', next: 'Accepted', icon: Check, color: 'bg-emerald-700 text-white hover:bg-emerald-800' };
      case 'Accepted': return { label: 'Mark Preparing', next: 'Preparing', icon: Play, color: 'bg-amber-700 text-white hover:bg-amber-800' };
      case 'Preparing': return { label: 'Mark Ready', next: 'Ready', icon: Bell, color: 'bg-blue-700 text-white hover:bg-blue-800' };
      case 'Ready': return { label: 'Mark Served & Close Session', next: 'Served', icon: CheckCircle2, color: 'bg-[#06382B] text-[#D4AF37] hover:bg-[#04291F] border border-[#D4AF37]/40' };
      default: return null;
    }
  };

  return (
    <div className="p-4 space-y-4 font-sans text-xs">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="font-serif font-bold text-[#06382B] text-base">Live Kitchen Orders Queue</h3>
          <span className="text-[10px] text-neutral-500">Real-time Kitchen Display System (KDS)</span>
        </div>
        <span className="bg-[#06382B] text-[#D4AF37] px-3 py-1 rounded-full text-xs font-bold font-mono">
          {ordersQueue.length} Orders Active
        </span>
      </div>

      {ordersQueue.length === 0 ? (
        <div className="bg-white rounded-2xl p-10 text-center border border-neutral-200/80 shadow-2xs space-y-3">
          <ChefHat className="w-12 h-12 mx-auto text-[#D4AF37]" />
          <h4 className="font-serif font-bold text-sm text-[#06382B]">No Active Kitchen Orders</h4>
          <p className="text-neutral-400 text-xs max-w-[240px] mx-auto">
            When customers place orders, they will appear here in real-time.
          </p>
        </div>
      ) : (
        <div className="space-y-3.5">
          {ordersQueue.map((order) => {
            const statusInfo = getNextStatusLabel(order.status);
            return (
              <div 
                key={order.id}
                className="bg-white p-4 rounded-2xl border border-neutral-200/80 shadow-2xs space-y-3 relative overflow-hidden"
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
                    <span className="text-[10px] text-neutral-400 mt-0.5 block">
                      Order #{order.id} • {order.timestamp}
                    </span>
                  </div>

                  <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                    order.status === 'Pending' ? 'bg-amber-100 text-amber-800 border border-amber-300' :
                    order.status === 'Accepted' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' :
                    order.status === 'Preparing' ? 'bg-blue-100 text-blue-800 border border-blue-300' :
                    order.status === 'Ready' ? 'bg-purple-100 text-purple-800 border border-purple-300' :
                    'bg-neutral-100 text-neutral-800'
                  }`}>
                    {order.status}
                  </span>
                </div>

                {/* Items breakdown */}
                <div className="space-y-1 text-xs text-[#06382B]">
                  {order.items.map((ci, idx) => (
                    <div key={idx} className="flex justify-between items-center">
                      <span className="font-medium">
                        {ci.item.name} <span className="text-[#D4AF37] font-bold">x{ci.quantity}</span>
                      </span>
                      <span className="text-neutral-400 text-[11px]">₹{(ci.item.price * ci.quantity).toFixed(0)}</span>
                    </div>
                  ))}
                </div>

                {/* Total & Action Button */}
                <div className="flex justify-between items-center pt-2 border-t border-neutral-100">
                  <div className="font-serif font-bold text-sm text-[#06382B]">
                    Total: ₹{order.total}
                  </div>

                  {statusInfo && (
                    <button 
                      onClick={() => updateOrderStatus(order.id, statusInfo.next)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer flex items-center gap-1.5 shadow-sm active:scale-95 ${statusInfo.color}`}
                    >
                      <statusInfo.icon className="w-3.5 h-3.5" />
                      {statusInfo.label}
                    </button>
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
