import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import MobileContainer from '../../components/MobileContainer';
import { Check, Clock, ChefHat, CheckSquare, Bell, XCircle } from 'lucide-react';

export default function OrderTracker() {
  const { activeOrder, cancelOrder, tableId, guestName } = useApp();
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

  const handleConfirmCancel = () => {
    cancelOrder(activeOrder.id);
    setShowCancelModal(false);
  };

  return (
    <MobileContainer>
      {/* Top Header with Emerald Gradient */}
      <div className="bg-gradient-to-r from-[#04291F] via-[#06382B] to-[#0B4A3A] p-4 text-[#FAF7F2] flex justify-between items-center shrink-0 border-b border-[#D4AF37]/30 shadow-md">
        <div>
          <h2 className="font-serif font-bold text-lg leading-tight text-[#D4AF37]">Live Order Status</h2>
          <span className="text-[10px] text-white/80 uppercase tracking-wider font-semibold">
            Table {tableId || 1} • Order #{activeOrder.id}
          </span>
        </div>
        <span className="bg-[#D4AF37] text-[#06382B] px-3 py-1 rounded-full text-xs font-bold font-mono shadow-xs">
          {activeOrder.status}
        </span>
      </div>

      {/* Order Details and Progress */}
      <div className="flex-grow overflow-y-auto p-4 space-y-5 scrollbar-thin pb-24 bg-[#F7FAF7]">
        
        {/* Guest Greeting & Cancel Option */}
        <div className="bg-white p-4 rounded-2xl border border-neutral-200/80 text-center space-y-2 shadow-2xs">
          <h3 className="font-serif text-[#06382B] font-bold text-base">Enjoy Dining, {guestName}!</h3>
          <p className="text-neutral-500 text-[11px]">
            {activeOrder.status === 'Served' 
              ? 'Order served by staff! Manager will close your session shortly.' 
              : isPending
              ? 'Order submitted to kitchen workstation. You can cancel before kitchen accepts.'
              : 'Kitchen approved your order and master chefs are preparing your meal.'}
          </p>

          {/* Cancel Button (ONLY visible while status is Pending) */}
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

        {/* Steps Timeline */}
        <div className="bg-white p-5 rounded-2xl border border-neutral-200/80 space-y-6 shadow-2xs">
          <h4 className="font-serif text-[#06382B] font-bold text-sm tracking-wide border-b border-neutral-100 pb-2">
            Kitchen Preparation Progress
          </h4>
          
          <div className="relative pl-10 space-y-5">
            <div className="absolute left-4 top-4 bottom-4 w-[2px] bg-neutral-200" />
            
            {statusList.map((status, index) => {
              const isActive = activeOrder.status === status;
              const isCompleted = index < activeIndex || activeOrder.status === 'Served' || activeOrder.status === 'Session Closed';
              return (
                <div key={status} className="relative flex items-center gap-4">
                  <div className="absolute -left-10 z-10">
                    {getStatusIcon(status, isActive, isCompleted)}
                  </div>
                  <div>
                    <h5 className={`text-sm font-semibold ${isActive ? 'text-[#06382B] font-bold text-base' : isCompleted ? 'text-neutral-700' : 'text-neutral-400'}`}>
                      {status}
                    </h5>
                    <span className="text-[10px] text-neutral-500">
                      {status === 'Pending' && 'Order received at kitchen workstation.'}
                      {status === 'Accepted' && 'Chef approved. Preparing fresh raw ingredients.'}
                      {status === 'Preparing' && 'Master chefs preparing your gourmet meal.'}
                      {status === 'Ready' && 'Food cooked. Being served to your table.'}
                      {status === 'Served' && 'Delivered to your table. Enjoy your hot meal!'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Order Receipt */}
        <div className="bg-white p-4 rounded-2xl border border-neutral-200/80 space-y-3 shadow-2xs text-xs text-[#06382B]">
          <h4 className="font-serif text-[#06382B] font-bold text-sm tracking-wide border-b border-neutral-100 pb-2">
            Order Summary
          </h4>
          <div className="space-y-1.5">
            {activeOrder.items.map((ci) => (
              <div key={ci.item.id} className="flex justify-between">
                <span>{ci.item.name} <span className="text-[#D4AF37] font-bold">x{ci.quantity}</span></span>
                <span className="font-semibold text-[#06382B]">₹{(ci.item.price * ci.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-between font-serif font-bold text-[#06382B] text-sm pt-2 border-t border-neutral-100">
            <span>Total Bill</span>
            <span>₹{activeOrder.total}</span>
          </div>
        </div>

      </div>

      {/* Footer Notice */}
      <div className="bg-white border-t border-neutral-200/80 p-4 shrink-0 pb-20 text-center">
        <div className="text-xs text-[#06382B] font-semibold flex items-center justify-center gap-1.5">
          <span className="w-2 h-2 bg-emerald-600 rounded-full animate-ping inline-block" />
          <span>{isPending ? 'You can cancel order until accepted by kitchen' : 'Active session ends when Manager updates status to Served'}</span>
        </div>
      </div>

      {/* Cancel Order Confirmation Modal */}
      {showCancelModal && (
        <div className="absolute inset-0 bg-[#04291F]/80 backdrop-blur-xs flex items-center justify-center p-6 z-50 animate-fade-in">
          <div className="bg-white p-5 rounded-[24px] max-w-xs w-full text-center space-y-4 shadow-2xl border border-neutral-200">
            <XCircle className="w-12 h-12 text-red-500 mx-auto" />
            <div>
              <h4 className="font-serif font-bold text-[#06382B] text-base">Cancel Your Order?</h4>
              <p className="text-neutral-500 text-xs mt-1">
                Are you sure you want to cancel this order? This action cannot be undone.
              </p>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => setShowCancelModal(false)}
                className="flex-1 bg-neutral-100 text-neutral-700 py-2.5 rounded-full text-xs font-bold hover:bg-neutral-200 cursor-pointer"
              >
                No, Keep
              </button>
              <button 
                onClick={handleConfirmCancel}
                className="flex-1 bg-red-600 text-white py-2.5 rounded-full text-xs font-bold hover:bg-red-700 cursor-pointer shadow-md"
              >
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </MobileContainer>
  );
}
