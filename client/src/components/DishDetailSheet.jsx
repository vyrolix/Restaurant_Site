import React from 'react';
import { ArrowLeft, Heart, Share2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { useApp } from '../context/AppContext';
import steakImg from '../assets/steak.png';
import tableImg from '../assets/table.png';
import salmonImg from '../assets/salmon.png';
import saladImg from '../assets/salad.png';

export default function DishDetailSheet({ item, onClose, onSelectRecommend }) {
  const { menuItems, cart, addToCart, removeFromCart } = useApp();

  if (!item) return null;

  const cartItem = cart.find((ci) => ci.item.id === item.id);
  const quantity = cartItem ? cartItem.quantity : 0;

  const getImage = (targetItem) => {
    if (!targetItem) return tableImg;
    if (targetItem.customImage) return targetItem.customImage;
    switch (targetItem.image) {
      case 'steak': return steakImg;
      case 'table': return tableImg;
      case 'salmon': return salmonImg;
      case 'salad': return saladImg;
      default: return tableImg;
    }
  };

  const originalPrice = Math.round(item.price * 1.2);
  const discountPct = Math.round(((originalPrice - item.price) / originalPrice) * 100);

  // Recommendations: Other items from same or general menu excluding current item
  const recommendations = menuItems
    .filter((m) => m.id !== item.id && (m.category === item.category || true))
    .slice(0, 3);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: item.name,
          text: `Check out ${item.name} at K/N Restaurant for ₹${item.price}!`,
          url: window.location.href
        });
      } catch (err) {}
    }
  };

  return (
    <div className="absolute inset-0 bg-black/60 backdrop-blur-xs z-50 flex flex-col justify-end animate-fade-in">
      {/* Backdrop Click to Close */}
      <div className="flex-1 w-full" onClick={onClose} />

      {/* Main Sheet Container */}
      <div className="bg-[#F4F8F5] w-full max-h-[92dvh] rounded-t-[32px] overflow-hidden flex flex-col shadow-2xl animate-slide-up border-t border-[#D4AF37]/30 relative">
        
        {/* Top Hero Image Banner */}
        <div className="h-56 sm:h-64 w-full relative shrink-0 bg-black">
          <img 
            src={getImage(item)} 
            alt={item.name} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/30" />

          {/* Floating Action Bar: Back, Wishlist, Share */}
          <div className="absolute top-4 inset-x-4 flex justify-between items-center z-10">
            <button 
              onClick={onClose}
              className="w-9 h-9 bg-white/90 hover:bg-white text-[#06382B] rounded-full flex items-center justify-center shadow-md backdrop-blur-md cursor-pointer transition-transform active:scale-95"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2">
              <button 
                className="w-9 h-9 bg-white/90 hover:bg-white text-[#06382B] hover:text-red-500 rounded-full flex items-center justify-center shadow-md backdrop-blur-md cursor-pointer transition-transform active:scale-95"
              >
                <Heart className="w-4 h-4" />
              </button>
              <button 
                onClick={handleShare}
                className="w-9 h-9 bg-white/90 hover:bg-white text-[#06382B] rounded-full flex items-center justify-center shadow-md backdrop-blur-md cursor-pointer transition-transform active:scale-95"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Image Pagination Dots */}
          <div className="absolute bottom-3 inset-x-0 flex justify-center gap-1.5 z-10">
            <span className="w-4 h-1.5 bg-white rounded-full" />
            <span className="w-1.5 h-1.5 bg-white/50 rounded-full" />
            <span className="w-1.5 h-1.5 bg-white/50 rounded-full" />
            <span className="w-1.5 h-1.5 bg-white/50 rounded-full" />
          </div>
        </div>

        {/* Scrollable Sheet Details Content */}
        <div className="p-5 overflow-y-auto space-y-4 pb-20 scrollbar-thin">
          
          {/* Header Row: Title & Veg Tag */}
          <div className="flex justify-between items-start gap-2">
            <div>
              <h2 className="font-serif font-bold text-[#06382B] text-2xl leading-tight">
                {item.name}
              </h2>
              <span className="text-xs text-neutral-500 font-medium">
                {item.subcategory || item.category}
              </span>
            </div>

            <span className="bg-emerald-50 border border-emerald-600 text-emerald-700 px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 shrink-0">
              <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block" /> Veg
            </span>
          </div>

          {/* Pricing Row: Price, Struck-through Price, Discount Badge */}
          <div className="flex items-center gap-2.5">
            <span className="font-serif font-bold text-2xl text-[#06382B]">
              ₹{item.price}
            </span>
            <span className="text-neutral-400 text-sm line-through font-semibold">
              ₹{originalPrice}
            </span>
            <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
              {discountPct}% OFF
            </span>
          </div>

          {/* Description */}
          <p className="text-neutral-600 text-xs leading-relaxed">
            {item.description}
          </p>

          {/* In Stock / Not Available Indicator */}
          <div className="flex items-center gap-1.5 text-xs font-bold">
            <span className={`w-2 h-2 rounded-full ${item.inStock ? 'bg-emerald-500' : 'bg-red-500'}`} />
            <span className={item.inStock ? 'text-emerald-700' : 'text-red-600'}>
              {item.inStock ? 'In Stock' : 'Not Available'}
            </span>
          </div>

          {/* Add to Cart / Quantity Controls Bar */}
          {item.inStock && (
            <div className="flex items-center gap-3 pt-1">
              <div className="flex items-center justify-between bg-white border border-neutral-300 rounded-xl px-3 py-2 w-28 shadow-2xs">
                <button 
                  onClick={() => removeFromCart(item.id)}
                  disabled={quantity === 0}
                  className="text-[#06382B] disabled:opacity-30 cursor-pointer p-0.5"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="font-bold text-sm text-[#06382B]">{quantity || 1}</span>
                <button 
                  onClick={() => addToCart(item)}
                  className="text-[#06382B] cursor-pointer p-0.5"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <button 
                onClick={() => {
                  if (quantity === 0) addToCart(item);
                  onClose();
                }}
                className="flex-1 bg-[#06382B] hover:bg-[#04291F] text-white py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.98] cursor-pointer border border-[#D4AF37]/30"
              >
                <ShoppingBag className="w-4 h-4 text-[#D4AF37]" />
                <span>{quantity > 0 ? 'Update Cart' : 'Add to Cart'}</span>
              </button>
            </div>
          )}

          {/* "You may also like" Section */}
          <div className="pt-3 space-y-2 border-t border-neutral-200/60">
            <h4 className="font-serif font-bold text-[#06382B] text-sm">
              You may also like
            </h4>

            <div className="grid grid-cols-3 gap-2.5">
              {recommendations.map((rec) => (
                <div 
                  key={rec.id}
                  onClick={() => {
                    if (onSelectRecommend) onSelectRecommend(rec);
                  }}
                  className="bg-white p-2 rounded-2xl border border-neutral-200/80 shadow-2xs space-y-1.5 cursor-pointer hover:border-[#06382B] transition-all active:scale-95"
                >
                  <div className="h-20 w-full rounded-xl overflow-hidden">
                    <img src={getImage(rec)} alt={rec.name} className="w-full h-full object-cover" />
                  </div>
                  <h5 className="font-serif font-bold text-[11px] text-[#06382B] truncate">
                    {rec.name}
                  </h5>
                  <span className="font-bold text-[11px] text-[#06382B] block">
                    ₹{rec.price}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
