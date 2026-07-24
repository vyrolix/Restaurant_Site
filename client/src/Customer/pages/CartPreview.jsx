import React from 'react';
import { useApp } from '../../context/AppContext';
import MobileContainer from '../../components/MobileContainer';
import { ArrowLeft, Trash2, Plus, Minus, CheckCircle, ShoppingBag } from 'lucide-react';
import steakImg from '../../assets/steak.png';
import tableImg from '../../assets/table.png';
import salmonImg from '../../assets/salmon.png';
import saladImg from '../../assets/salad.png';

export default function CartPreview() {
  const { cart, updateQuantity, calculateCartTotals, placeOrder, setCurrentScreen, tableId } = useApp();

  const { subtotal, packagingCharge, tax, total } = calculateCartTotals();

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
    <MobileContainer>
      {/* Top Header */}
      <div className="bg-gradient-to-r from-[#04291F] via-[#06382B] to-[#0B4A3A] p-4 text-[#FAF7F2] flex items-center gap-4 shrink-0 border-b border-[#D4AF37]/20">
        <button 
          onClick={() => setCurrentScreen('menu')}
          className="hover:bg-[#06382B] p-1.5 rounded-full transition-colors cursor-pointer text-[#D4AF37]"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="font-serif font-bold text-lg leading-tight text-[#FAF7F2]">Your Cart</h2>
          <span className="text-[10px] text-[#D4AF37] uppercase tracking-wider font-semibold">
            Table {tableId || 1} • Active Session
          </span>
        </div>
      </div>

      {/* Cart Item List */}
      <div className="flex-grow overflow-y-auto p-4 space-y-3 scrollbar-thin pb-24 bg-[#F7FAF7]">
        {cart.map((ci) => (
          <div 
            key={ci.item.id}
            className="bg-white p-3 rounded-2xl border border-[#06382B]/15 flex justify-between gap-3 shadow-xs items-center"
          >
            <div className="w-12 h-12 shrink-0 rounded-lg overflow-hidden border border-neutral-100">
              <img src={getImage(ci.item.image)} alt={ci.item.name} className="w-full h-full object-cover" />
            </div>

            <div className="flex-grow">
              <h4 className="font-serif font-bold text-[#06382B] text-sm leading-snug">{ci.item.name}</h4>
              <span className="text-[#06382B]/70 text-xs">₹{ci.item.price} each</span>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center bg-[#F7FAF7] rounded-lg border border-[#06382B]/20">
                <button 
                  onClick={() => updateQuantity(ci.item.id, ci.quantity - 1)}
                  className="p-1 text-[#06382B] hover:text-red-600 cursor-pointer"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="text-xs font-bold w-5 text-center text-[#06382B]">{ci.quantity}</span>
                <button 
                  onClick={() => updateQuantity(ci.item.id, ci.quantity + 1)}
                  className="p-1 text-[#06382B] hover:text-green-700 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              <button 
                onClick={() => updateQuantity(ci.item.id, 0)}
                className="text-[#D4AF37] hover:text-red-600 p-1 cursor-pointer transition-colors duration-200"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}

        {cart.length === 0 && (
          <div className="text-center py-20 text-[#06382B]/60 text-sm space-y-4">
            <ShoppingBag className="w-12 h-12 mx-auto text-[#D4AF37]" />
            <p>Your cart is empty. Go back and select some delicacies!</p>
            <button 
              onClick={() => setCurrentScreen('menu')}
              className="bg-[#06382B] text-[#D4AF37] px-5 py-2.5 rounded-full text-xs font-semibold hover:bg-[#04291F] transition-colors cursor-pointer border border-[#D4AF37]/30"
            >
              Explore Menu
            </button>
          </div>
        )}
      </div>

      {/* Footer Area */}
      {cart.length > 0 && (
        <div className="bg-white border-t border-[#06382B]/15 p-4 space-y-3 shrink-0 pb-24">
          <div className="space-y-1.5 text-xs text-[#06382B]">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{subtotal}</span>
            </div>
            <div className="flex justify-between">
              <span>Restaurant Packaging Charge</span>
              <span>₹{packagingCharge}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax (5% GST)</span>
              <span>₹{tax}</span>
            </div>
            <div className="flex justify-between text-base font-bold text-[#06382B] border-t border-[#06382B]/15 pt-2 font-serif">
              <span>Grand Total</span>
              <span>₹{total}</span>
            </div>
          </div>

          <div className="flex gap-2">
            <button 
              onClick={() => setCurrentScreen('menu')}
              className="flex-1 border border-[#06382B]/30 text-[#06382B] hover:bg-[#F7FAF7] py-3 rounded-full font-semibold text-xs text-center cursor-pointer transition-colors duration-200"
            >
              Add More
            </button>
            
            <button 
              onClick={placeOrder}
              className="flex-[2] bg-[#06382B] hover:bg-[#04291F] text-[#D4AF37] py-3 rounded-full font-bold text-xs shadow-lg transition-all duration-300 transform active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer border border-[#D4AF37]/30"
            >
              <CheckCircle className="w-4 h-4" />
              Place Order
            </button>
          </div>
        </div>
      )}
    </MobileContainer>
  );
}
