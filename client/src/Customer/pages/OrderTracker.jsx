import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import MobileContainer from '../../components/MobileContainer';
import { Check, Clock, ChefHat, CheckSquare, Bell, XCircle, Sparkles, Receipt, Printer, LogOut, HeartHandshake } from 'lucide-react';

export default function OrderTracker() {
  const { activeOrder, cancelOrder, tableId, guestName, endSession } = useApp();
  const [showCancelModal, setShowCancelModal] = useState(false);

  const statusList = ['Pending', 'Accepted', 'Preparing', 'Ready', 'Served'];

  const getStatusIndex = (currentStatus) => {
    return statusList.indexOf(currentStatus);
  };

  const getStatusIcon = (status, isActive, isCompleted) => {
    const color = isCompleted 
      ? 'bg-[#06382B] text-white' 
      : isActive 
      ? 'bg-[#06382B] text-[#D4AF37] ring-2 ring-[#D4AF37]' 
      : 'bg-neutral-200 text-neutral-400';
      
    switch (status) {
      case 'Pending':
        return <div className={`w-8 h-8 rounded-full flex items-center justify-center ${color}`}><Clock className="w-4 h-4" /></div>;
      case 'Accepted':
        return <div className={`w-8 h-8 rounded-full flex items-center justify-center ${color}`}><Check className="w-4 h-4" /></div>;
      case 'Preparing':
        return <div className={`w-8 h-8 rounded-full flex items-center justify-center ${color}`}><ChefHat className="w-4 h-4" /></div>;
      case 'Ready':
        return <div className={`w-8 h-8 rounded-full flex items-center justify-center ${color}`}><Bell className="w-4 h-4" /></div>;
      case 'Served':
        return <div className={`w-8 h-8 rounded-full flex items-center justify-center ${color}`}><CheckSquare className="w-4 h-4" /></div>;
      default:
        return null;
    }
  };

  if (!activeOrder) {
    return (
      <MobileContainer>
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-4 bg-[#F7FAF7]">
          <Clock className="w-16 h-16 text-[#D4AF37]" />
          <h2 className="font-serif font-bold text-xl text-[#06382B]">No Active Order Session</h2>
          <p className="text-neutral-500 text-xs max-w-[280px]">
            Your session starts automatically when you place an order from the menu and ends when the manager completes your order.
          </p>
        </div>
      </MobileContainer>
    );
  }

  const activeIndex = getStatusIndex(activeOrder.status);
  const isPending = activeOrder.status === 'Pending';
  const isServed = activeOrder.status === 'Served';

  const handleConfirmCancel = () => {
    cancelOrder(activeOrder.id);
    setShowCancelModal(false);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <MobileContainer>
      {/* Top Header with Emerald & Gold Gradient */}
      <div className="bg-gradient-to-r from-[#04291F] via-[#06382B] to-[#0B4A3A] p-4 text-[#FAF7F2] flex justify-between items-center shrink-0 border-b border-[#D4AF37]/30 shadow-md">
        <div>
          <h2 className="font-serif font-bold text-lg leading-tight text-[#D4AF37]">Live Order Status</h2>
          <span className="text-[10px] text-white/80 uppercase tracking-wider font-semibold">
            Table {tableId || 1} • Order #{activeOrder.id}
          </span>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-bold font-mono shadow-xs ${
          isServed ? 'bg-[#D4AF37] text-[#06382B] animate-bounce' : 'bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/40'
        }`}>
          {activeOrder.status}
        </span>
      </div>

      {/* Main Container */}
      <div className="flex-grow overflow-y-auto p-4 space-y-5 scrollbar-thin pb-24 bg-[#F7FAF7] relative">

        {/* CELEBRATION CONFETTI OVERLAY WHEN ORDER IS SERVED */}
        {isServed && (
          <div className="pointer-events-none absolute inset-0 overflow-hidden z-20">
            {Array.from({ length: 24 }).map((_, i) => (
              <div 
                key={i}
                className="absolute w-2.5 h-2.5 rounded-full animate-fade-up"
                style={{
                  left: `${(i * 4.3) % 100}%`,
                  top: `-${(i * 15) % 80}px`,
                  backgroundColor: ['#D4AF37', '#06382B', '#E8F2EC', '#FFD700', '#10B981'][i % 5],
                  animation: `confettiRain ${2 + (i % 3)}s linear infinite`,
                  animationDelay: `${(i * 0.15).toFixed(2)}s`
                }}
              />
            ))}
          </div>
        )}

        {/* CELEBRATORY BANNER WHEN SERVED */}
        {isServed ? (
          <div className="bg-gradient-to-r from-[#06382B] via-[#0B4A3A] to-[#04291F] text-white p-5 rounded-2xl border-2 border-[#D4AF37] shadow-xl text-center space-y-2 relative overflow-hidden animate-celebrate-pop">
            <div className="flex justify-center items-center gap-2">
              <Sparkles className="w-6 h-6 text-[#D4AF37] animate-pulse" />
              <h3 className="font-serif font-bold text-lg text-[#D4AF37]">Bon Appétit, {guestName}!</h3>
              <Sparkles className="w-6 h-6 text-[#D4AF37] animate-pulse" />
            </div>
            <p className="text-white/90 text-xs leading-relaxed max-w-[300px] mx-auto font-sans">
              Your gourmet dishes have been freshly served to your table. Enjoy your feast!
            </p>
            <div className="pt-1 flex justify-center">
              <span className="bg-[#D4AF37] text-[#06382B] text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider inline-flex items-center gap-1 shadow-sm">
                <HeartHandshake className="w-3.5 h-3.5" /> Thank You For Dining With Us
              </span>
            </div>
          </div>
        ) : (
          /* Standard Greeting Box */
          <div className="bg-white p-4 rounded-2xl border border-neutral-200/80 text-center space-y-2 shadow-2xs">
            <h3 className="font-serif text-[#06382B] font-bold text-base">Enjoy Dining, {guestName}!</h3>
            <p className="text-neutral-500 text-[11px]">
              {isPending
                ? 'Order submitted to kitchen workstation. You can cancel before kitchen accepts.'
                : 'Kitchen approved your order and master chefs are preparing your meal.'}
            </p>

            {isPending && (
              <button 
                onClick={() => setShowCancelModal(true)}
                className="mt-1 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer inline-flex items-center gap-1.5 active:scale-95 shadow-2xs"
              >
                <XCircle className="w-4 h-4 text-red-600" />
                Cancel Order
              </button>
            )}
          </div>
        )}

        {/* ORDER PROGRESS STEPPER */}
        <div className="bg-white p-5 rounded-2xl border border-neutral-200/80 shadow-2xs space-y-4">
          <h4 className="font-serif font-bold text-xs uppercase tracking-wider text-[#06382B] border-b border-neutral-100 pb-2">
            Preparation Timeline
          </h4>
          
          <div className="space-y-4">
            {statusList.map((st, idx) => {
              const isCompleted = idx < activeIndex;
              const isActive = idx === activeIndex;

              return (
                <div key={st} className="flex items-start gap-3 relative">
                  {/* Connecting Vertical Line */}
                  {idx < statusList.length - 1 && (
                    <div 
                      className={`absolute left-4 top-8 w-0.5 h-7 -ml-[1px] transition-colors duration-300 ${
                        idx < activeIndex ? 'bg-[#06382B]' : 'bg-neutral-200'
                      }`} 
                    />
                  )}

                  {getStatusIcon(st, isActive, isCompleted)}

                  <div className="flex-1 pt-0.5">
                    <div className="flex justify-between items-center">
                      <h5 className={`font-semibold text-xs ${
                        isActive ? 'text-[#06382B] font-bold' : isCompleted ? 'text-neutral-800' : 'text-neutral-400'
                      }`}>
                        {st}
                      </h5>
                      {isActive && (
                        <span className="text-[10px] font-bold text-[#D4AF37] bg-[#06382B] px-2 py-0.5 rounded-full">
                          Live
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-neutral-400 mt-0.5">
                      {st === 'Pending' && 'Order received at kitchen workstation.'}
                      {st === 'Accepted' && 'Chef approved. Preparing fresh ingredients.'}
                      {st === 'Preparing' && 'Master chefs cooking your meal.'}
                      {st === 'Ready' && 'Food cooked. Being served to table.'}
                      {st === 'Served' && 'Delivered to your table. Enjoy your hot meal!'}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ULTRA-PREMIUM BILL & TAX INVOICE CARD */}
        <div className={`bg-white rounded-2xl border border-neutral-300 overflow-hidden shadow-md ${
          isServed ? 'ring-2 ring-[#D4AF37]/80' : ''
        }`}>
          {/* Bill Card Top Header */}
          <div className="bg-[#06382B] text-white p-4 border-b border-[#D4AF37]/30 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Receipt className="w-5 h-5 text-[#D4AF37]" />
              <div>
                <h3 className="font-serif font-bold text-sm text-[#D4AF37] leading-none">K/N RESTAURANT</h3>
                <span className="text-[9px] text-white/70 tracking-widest uppercase">Tax Invoice • Satna MP</span>
              </div>
            </div>
            <span className="text-[10px] bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/40 px-2 py-0.5 rounded font-mono font-bold">
              {isServed ? 'PAID' : 'DINE-IN'}
            </span>
          </div>

          {/* Bill Meta Details */}
          <div className="p-4 bg-[#FBFDFB] border-b border-neutral-200 text-[11px] grid grid-cols-2 gap-2 text-neutral-600 font-sans">
            <div>
              <span className="block text-[9px] uppercase tracking-wider text-neutral-400">Order Reference</span>
              <strong className="text-[#06382B] font-mono text-xs">#{activeOrder.id}</strong>
            </div>
            <div>
              <span className="block text-[9px] uppercase tracking-wider text-neutral-400">Table & Guest</span>
              <strong className="text-[#06382B]">Table {tableId || 1} • {guestName}</strong>
            </div>
            <div>
              <span className="block text-[9px] uppercase tracking-wider text-neutral-400">Order Time</span>
              <span>{activeOrder.timestamp || 'Just Now'}</span>
            </div>
            <div>
              <span className="block text-[9px] uppercase tracking-wider text-neutral-400">Payment Mode</span>
              <span className="text-emerald-700 font-semibold">Pay At Counter</span>
            </div>
          </div>

          {/* Itemized Order Table */}
          <div className="p-4 space-y-3">
            <h5 className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 border-b border-neutral-100 pb-1">
              Ordered Items
            </h5>
            
            <div className="space-y-2 text-xs">
              {activeOrder.items && activeOrder.items.map((ci, idx) => (
                <div key={idx} className="flex justify-between items-center text-neutral-700">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#06382B]/10 text-[#06382B] font-bold text-[10px] flex items-center justify-center shrink-0">
                      {ci.quantity}x
                    </span>
                    <span className="font-medium text-neutral-800">{ci.item.name}</span>
                  </div>
                  <span className="font-mono font-semibold text-neutral-900">
                    ₹{(ci.item.price * ci.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            {/* Financial Breakdown */}
            <div className="border-t border-dashed border-neutral-300 pt-3 space-y-1.5 text-xs text-neutral-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-mono">₹{(activeOrder.subtotal || activeOrder.total * 0.9).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-[11px]">
                <span>Packaging / Service Charge</span>
                <span className="font-mono">₹{(activeOrder.packagingCharge || 15).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-[11px]">
                <span>GST (5%)</span>
                <span className="font-mono">₹{(activeOrder.tax || activeOrder.total * 0.05).toFixed(2)}</span>
              </div>

              <div className="bg-[#06382B] text-white p-3 rounded-xl flex justify-between items-center mt-2 shadow-sm">
                <div>
                  <span className="block text-[9px] uppercase tracking-wider text-[#D4AF37]">Grand Total</span>
                  <span className="text-xs text-white/80">Inclusive of all taxes</span>
                </div>
                <span className="font-serif font-bold text-xl text-[#D4AF37]">
                  ₹{Number(activeOrder.total).toFixed(2)}
                </span>
              </div>
            </div>

            {/* Bill Actions */}
            <div className="pt-2 flex gap-2">
              <button
                onClick={handlePrint}
                className="flex-1 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-95 border border-neutral-300"
              >
                <Printer className="w-3.5 h-3.5 text-[#06382B]" />
                Print Receipt
              </button>

              {isServed && (
                <button
                  onClick={endSession}
                  className="flex-1 bg-[#06382B] hover:bg-[#04291F] text-[#D4AF37] border border-[#D4AF37] py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-95 shadow-xs"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Finish Dining
                </button>
              )}
            </div>
          </div>
        </div>

      </div>

      {/* CANCEL MODAL */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-5 max-w-xs w-full text-center space-y-4 shadow-xl border border-neutral-200">
            <h3 className="font-serif font-bold text-base text-[#06382B]">Cancel This Order?</h3>
            <p className="text-xs text-neutral-500">
              Are you sure you want to cancel Order #{activeOrder.id}? Kitchen has not started preparing yet.
            </p>
            <div className="flex gap-2">
              <button 
                onClick={() => setShowCancelModal(false)}
                className="flex-1 bg-neutral-100 text-neutral-700 py-2 rounded-xl text-xs font-bold active:scale-95"
              >
                Go Back
              </button>
              <button 
                onClick={handleConfirmCancel}
                className="flex-1 bg-red-600 text-white py-2 rounded-xl text-xs font-bold active:scale-95"
              >
                Confirm Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </MobileContainer>
  );
}
