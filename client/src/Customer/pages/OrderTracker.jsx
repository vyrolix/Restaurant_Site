import React from 'react';
import { useApp } from '../../context/AppContext';
import { Check, Clock, ChefHat, CheckSquare, Bell, ArrowRight, LogOut } from 'lucide-react';

export default function OrderTracker() {
  const { activeOrder, advanceOrderStatus, endSession, tableId, guestName } = useApp();

  const statusList = ['Pending', 'Accepted', 'Preparing', 'Ready', 'Served'];

  const getStatusIndex = (currentStatus) => {
    return statusList.indexOf(currentStatus);
  };

  const getStatusIcon = (status, isActive, isCompleted) => {
    const color = isCompleted ? 'bg-restaurant-green text-restaurant-gold' : isActive ? 'bg-restaurant-gold text-restaurant-green' : 'bg-neutral-200 text-neutral-400';
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
      <div className="h-[100dvh] w-full bg-neutral-900 flex items-center justify-center p-0 sm:p-4 font-sans overflow-hidden">
        <div className="w-full max-w-md bg-restaurant-cream shadow-2xl h-[100dvh] sm:h-[850px] sm:rounded-[36px] overflow-hidden flex flex-col items-center justify-center p-6 text-center space-y-4 animate-fade-up">
          <Clock className="w-16 h-16 text-neutral-300 animate-spin" />
          <h2 className="font-serif font-bold text-xl text-[#052217]">No Active Order</h2>
          <p className="text-neutral-500 text-xs max-w-[280px]">
            You do not have any active order sessions. Please scan your QR code and place an order to track it.
          </p>
          <button 
            onClick={() => endSession()}
            className="bg-[#1C1C1C] text-white py-3 px-6 rounded-full text-xs font-semibold cursor-pointer"
          >
            Go Back Welcome
          </button>
        </div>
      </div>
    );
  }

  const activeIndex = getStatusIndex(activeOrder.status);

  return (
    <div className="h-[100dvh] w-full bg-neutral-900 flex items-center justify-center p-0 sm:p-4 font-sans overflow-hidden">
      <div className="w-full max-w-md bg-restaurant-cream shadow-2xl h-[100dvh] sm:h-[850px] sm:rounded-[36px] overflow-hidden flex flex-col justify-between relative border border-neutral-200/20 animate-fade-up">
        
        {/* Top Header */}
        <div className="bg-[#052217] p-4 text-[#F7F6F3] flex justify-between items-center shrink-0">
          <div>
            <h2 className="font-serif font-bold text-lg leading-tight">Live Status</h2>
            <span className="text-[10px] text-restaurant-gold uppercase tracking-wider">
              Table {tableId} • Order: {activeOrder.id}
            </span>
          </div>
          <span className="bg-restaurant-gold/20 text-restaurant-gold px-3 py-1 rounded-full text-xs font-bold font-mono">
            {activeOrder.status}
          </span>
        </div>

        {/* Order Details and Progress (Scrollable area) */}
        <div className="flex-grow overflow-y-auto p-5 space-y-6 scrollbar-thin">
          
          {/* Welcome User Banner */}
          <div className="bg-white p-4 rounded-2xl border border-neutral-200/35 text-center space-y-1 shadow-sm">
            <h3 className="font-serif text-[#052217] font-bold text-base">Enjoy Dining, {guestName}!</h3>
            <p className="text-neutral-400 text-[11px]">Your chef is notified. Follow your order status below.</p>
          </div>

          {/* Status Tracker Flow */}
          <div className="bg-white p-5 rounded-2xl border border-neutral-200/35 space-y-6 shadow-sm">
            <h4 className="font-serif text-[#052217] font-bold text-sm tracking-wide border-b border-neutral-100 pb-2">
              Kitchen Preparation Steps
            </h4>
            
            <div className="relative pl-10 space-y-5">
              {/* Connecting Line */}
              <div className="absolute left-4 top-4 bottom-4 w-[2px] bg-neutral-200" />
              
              {statusList.map((status, index) => {
                const isActive = activeOrder.status === status;
                const isCompleted = index < activeIndex || activeOrder.status === 'Paid' || activeOrder.status === 'Session Closed';
                return (
                  <div key={status} className="relative flex items-center gap-4">
                    {/* Circle icon */}
                    <div className="absolute -left-10 z-10">
                      {getStatusIcon(status, isActive, isCompleted)}
                    </div>
                    {/* Status Text details */}
                    <div>
                      <h5 className={`text-sm font-semibold ${isActive ? 'text-restaurant-green font-bold text-base' : isCompleted ? 'text-neutral-800' : 'text-neutral-400'}`}>
                        {status}
                      </h5>
                      <span className="text-[10px] text-neutral-400">
                        {status === 'Pending' && 'Order received and awaiting chef response.'}
                        {status === 'Accepted' && 'Chef approved. Sourcing raw ingredients.'}
                        {status === 'Preparing' && 'Kitchen preparing your gourmet meal.'}
                        {status === 'Ready' && 'Meal cooked. Served to table in seconds.'}
                        {status === 'Served' && 'Food delivered. Enjoy your hot meal!'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Order Summary Card */}
          <div className="bg-white p-4 rounded-2xl border border-neutral-200/35 space-y-3 shadow-sm text-xs text-neutral-600">
            <h4 className="font-serif text-[#052217] font-bold text-sm tracking-wide border-b border-neutral-100 pb-2">
              Ordered Items
            </h4>
            <div className="space-y-1.5">
              {activeOrder.items.map((ci) => (
                <div key={ci.item.id} className="flex justify-between">
                  <span>{ci.item.name} <span className="text-neutral-400">x{ci.quantity}</span></span>
                  <span className="font-semibold">${(ci.item.price * ci.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-between font-serif font-bold text-restaurant-green text-sm pt-2 border-t border-neutral-100">
              <span>Total Paid/Settling</span>
              <span>${activeOrder.total}</span>
            </div>
          </div>

        </div>

        {/* Bottom Simulation & Session Ending Area */}
        <div className="bg-white border-t border-neutral-200/50 p-5 space-y-3 shrink-0">
          
          {/* Active order simulation actions */}
          {activeOrder.status !== 'Session Closed' ? (
            <div className="space-y-2">
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-2.5 text-center">
                <span className="text-[10px] text-emerald-800 font-semibold uppercase tracking-wider block">
                  Interactive Simulator Panel
                </span>
                <span className="text-[11px] text-emerald-600 block">
                  Simulate the kitchen dashboard to advance order stages.
                </span>
              </div>
              
              <button 
                onClick={advanceOrderStatus}
                className="w-full bg-[#1C1C1C] hover:bg-neutral-800 text-[#C5A880] py-3.5 rounded-full font-bold text-xs shadow-md transition-all duration-300 transform active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                Simulate Status Update &rarr;
              </button>
            </div>
          ) : (
            <div className="text-center py-2 text-emerald-700 text-sm font-semibold flex items-center justify-center gap-2">
              <LogOut className="w-4 h-4 animate-ping" />
              Closing Session... Thank you!
            </div>
          )}

          {/* Manual Exit Option */}
          {activeOrder.status === 'Served' && (
            <button 
              onClick={() => endSession()}
              className="w-full border border-red-200 hover:bg-red-50 text-red-600 py-3 rounded-full font-bold text-xs transition-colors duration-200 cursor-pointer"
            >
              Pay & End Session
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
