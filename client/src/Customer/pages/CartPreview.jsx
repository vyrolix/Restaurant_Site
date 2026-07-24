import React from 'react';
import { useApp } from '../../context/AppContext';
import { ArrowLeft, Trash2, Plus, Minus, AlertTriangle, CheckCircle, ShoppingBag } from 'lucide-react';
import steakImg from '../../assets/steak.png';
import tableImg from '../../assets/table.png';
import salmonImg from '../../assets/salmon.png';
import saladImg from '../../assets/salad.png';

export default function CartPreview() {
  const { cart, updateQuantity, calculateCartTotals, placeOrder, setCurrentScreen, isDineIn, tableId } = useApp();

  const { subtotal, tax, total } = calculateCartTotals();

  const getImage = (key) => {
    switch (key) {
      case 'steak': return steakImg;
      case 'table': return tableImg;
      case 'salmon': return salmonImg;
      case 'salad': return saladImg;
      default: return tableImg;
    }
  };

  return (
    <div className="h-[100dvh] w-full bg-palette-gradient flex items-center justify-center p-0 sm:p-4 font-sans overflow-hidden">
      <div className="w-full max-w-md bg-[#E3EFE6] shadow-2xl h-[100dvh] sm:h-[850px] sm:rounded-[36px] overflow-hidden flex flex-col justify-between relative border border-[#8EB69B]/20 animate-fade-up">
        
        {/* Top Header */}
        <div className="bg-gradient-to-r from-[#051F20] via-[#0B2B26] to-[#163832] p-4 text-[#E3EFE6] flex items-center gap-4 shrink-0 border-b border-[#8EB69B]/20">
          <button 
            onClick={() => setCurrentScreen('menu')}
            className="hover:bg-[#051F20] p-1.5 rounded-full transition-colors cursor-pointer text-[#8EB69B]"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="font-serif font-bold text-lg leading-tight text-[#E3EFE6]">Your Cart</h2>
            <span className="text-[10px] text-[#8EB69B] uppercase tracking-wider font-semibold">
              {isDineIn ? `Table ${tableId} Session` : 'Guest Mode'}
            </span>
          </div>
        </div>

        {/* Cart Item List */}
        <div className="flex-grow overflow-y-auto p-4 space-y-3.5 scrollbar-thin">
          {cart.map((ci) => (
            <div 
              key={ci.item.id}
              className="bg-white p-3.5 rounded-2xl border border-[#8EB69B]/25 flex justify-between gap-3 shadow-xs items-center"
            >
              {/* Product Thumbnail */}
              <div className="w-14 h-14 shrink-0 rounded-lg overflow-hidden border border-neutral-100">
                <img src={getImage(ci.item.image)} alt={ci.item.name} className="w-full h-full object-cover" />
              </div>

              {/* Title & Price */}
              <div className="flex-grow">
                <h4 className="font-serif font-bold text-[#051F20] text-sm leading-snug">{ci.item.name}</h4>
                <span className="text-[#163832]/70 text-xs">${ci.item.price} each</span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2.5">
                <div className="flex items-center bg-[#E3EFE6]/60 rounded-lg border border-[#8EB69B]/30">
                  <button 
                    onClick={() => updateQuantity(ci.item.id, ci.quantity - 1)}
                    className="p-1.5 text-[#163832] hover:text-red-600 cursor-pointer"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-xs font-bold w-5 text-center text-[#051F20]">{ci.quantity}</span>
                  <button 
                    onClick={() => updateQuantity(ci.item.id, ci.quantity + 1)}
                    className="p-1.5 text-[#163832] hover:text-green-700 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <button 
                  onClick={() => updateQuantity(ci.item.id, 0)}
                  className="text-[#8EB69B] hover:text-red-600 p-1.5 cursor-pointer transition-colors duration-200"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          {cart.length === 0 && (
            <div className="text-center py-20 text-[#163832]/60 text-sm space-y-4">
              <ShoppingBag className="w-12 h-12 mx-auto text-[#8EB69B]" />
              <p>Your cart is empty. Go back and select some delicacies!</p>
              <button 
                onClick={() => setCurrentScreen('menu')}
                className="bg-[#0B2B26] text-[#8EB69B] px-5 py-2.5 rounded-full text-xs font-semibold hover:bg-[#163832] transition-colors cursor-pointer border border-[#8EB69B]/20"
              >
                Explore Menu
              </button>
            </div>
          )}
        </div>

        {/* Footer Area */}
        {cart.length > 0 && (
          <div className="bg-white border-t border-[#8EB69B]/30 p-5 space-y-4 shrink-0">
            {/* Calculation summary */}
            <div className="space-y-2 text-sm text-[#163832]">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax (5% GST)</span>
                <span>${tax}</span>
              </div>
              <div className="flex justify-between text-base font-bold text-[#051F20] border-t border-[#8EB69B]/20 pt-2 font-serif">
                <span>Grand Total</span>
                <span>${total}</span>
              </div>
            </div>

            {/* Dine-in Restriction Notice */}
            {!isDineIn && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <p className="text-[11px] text-amber-700 leading-normal">
                  Ordering is disabled in Guest Mode. Please scan a table QR code inside the restaurant to start a dining session and place orders.
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button 
                onClick={() => setCurrentScreen('menu')}
                className="flex-1 border border-[#8EB69B]/40 text-[#051F20] hover:bg-[#E3EFE6] py-3.5 rounded-full font-semibold text-xs text-center cursor-pointer transition-colors duration-200"
              >
                Add More
              </button>
              
              {isDineIn ? (
                <button 
                  onClick={placeOrder}
                  className="flex-[2] bg-[#0B2B26] hover:bg-[#163832] text-[#8EB69B] py-3.5 rounded-full font-bold text-xs shadow-lg transition-all duration-300 transform active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer border border-[#8EB69B]/30"
                >
                  <CheckCircle className="w-4 h-4" />
                  Place Active Order
                </button>
              ) : (
                <button 
                  disabled
                  className="flex-[2] bg-neutral-200 text-neutral-400 py-3.5 rounded-full font-bold text-xs cursor-not-allowed flex items-center justify-center gap-1.5"
                >
                  Ordering Blocked
                </button>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
