import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import MobileContainer from '../../components/MobileContainer';
import DishDetailSheet from '../../components/DishDetailSheet';
import { Search, ShoppingBag, SlidersHorizontal, Heart, Star, Clock, ChevronRight, Plus } from 'lucide-react';
import steakImg from '../../assets/steak.png';
import tableImg from '../../assets/table.png';
import salmonImg from '../../assets/salmon.png';
import saladImg from '../../assets/salad.png';

export default function CustomerHome() {
  const { setCurrentScreen, setSelectedCategory, tableId, guestName, menuItems, addToCart, cart } = useApp();
  const [search, setSearch] = useState('');
  const [selectedDetailItem, setSelectedDetailItem] = useState(null);

  const cartCount = cart.reduce((acc, ci) => acc + ci.quantity, 0);
  const explicitPopular = menuItems.filter((i) => i.isPopular === true);
  const popularDishes = explicitPopular.length > 0 ? explicitPopular : menuItems.slice(0, 20);

  const getImage = (item) => {
    if (!item) return tableImg;
    if (item.customImage) return item.customImage;
    switch (item.image) {
      case 'steak': return steakImg;
      case 'table': return tableImg;
      case 'salmon': return salmonImg;
      case 'salad': return saladImg;
      default: return tableImg;
    }
  };

  const handleCategorySelect = (categoryName) => {
    let target = 'All';
    if (categoryName.includes('South')) target = 'Breakfast & South Indian';
    else if (categoryName.includes('Chinese')) target = 'Chinese';
    else if (categoryName.includes('Tandoor')) target = 'Tandoor';
    else if (categoryName.includes('Continental')) target = 'Continental';
    else if (categoryName.includes('Main Course')) target = 'Indian Main Course';
    else if (categoryName.includes('Desserts')) target = 'Desserts & Beverages';

    setSelectedCategory(target);
    setCurrentScreen('menu');
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const input = e.target.querySelector('input');
    if (input) input.blur();
  };

  return (
    <MobileContainer>
      {/* Scrollable Container */}
      <div className="flex-1 overflow-y-auto bg-[#F7FAF7] pb-24 select-none scrollbar-thin p-4 space-y-5">

        {/* Top Header: Welcome [Guest Name] & Table Number */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 bg-[#06382B] text-[#D4AF37] rounded-2xl flex items-center justify-center font-serif font-bold text-sm shadow-md shrink-0 border border-[#D4AF37]/30">
              K/N
            </div>
            <div>
              <h4 className="font-serif font-bold text-base text-[#06382B] leading-tight tracking-wider">
                Welcome, {guestName || 'Valued Guest'}!
              </h4>
              <span className="text-[10px] text-[#06382B]/80 font-medium block">
                K/N Restaurant • Table {tableId || 1}
              </span>
            </div>
          </div>

          <button
            onClick={() => setCurrentScreen('cart')}
            className="w-10 h-10 bg-white border border-[#06382B]/15 rounded-full flex items-center justify-center relative shadow-2xs text-[#06382B] cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#D4AF37] text-[#06382B] text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
        </div>

        {/* Hero Headline */}
        <div className="space-y-1">
          <h1 className="font-serif text-[#06382B] text-2xl font-bold leading-tight">
            Delicious food,Served fresh & fast<br />
            <span className="text-[#06382B]/70 font-sans text-xl font-medium"></span>
          </h1>
        </div>

        {/* Search Pill Input with Auto Keyboard Close on Enter */}
        <form onSubmit={handleSearchSubmit} className="relative flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-neutral-400 absolute left-4 top-3.5" />
            <input
              type="text"
              placeholder="Search for food, dishes, or drinks..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onFocus={() => setCurrentScreen('menu')}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.currentTarget.blur();
                }
              }}
              className="w-full bg-white border border-neutral-200/80 rounded-full py-3 pl-11 pr-4 text-xs text-[#06382B] placeholder-neutral-400 focus:outline-none shadow-2xs"
            />
          </div>
          <button
            type="button"
            onClick={() => setCurrentScreen('menu')}
            className="w-10 h-10 bg-white border border-neutral-200/80 rounded-full flex items-center justify-center text-[#06382B] shadow-2xs cursor-pointer shrink-0"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>
        </form>

        {/* Category Grid Cards */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { name: 'South Indian', icon: '🍲' },
            { name: 'Chinese', icon: '🍜' },
            { name: 'Tandoor', icon: '🍢' },
            { name: 'Continental', icon: '🍕' },
            { name: 'Main Course', icon: '🍛' },
            { name: 'Desserts', icon: '🍰' }
          ].map((cat, i) => (
            <div
              key={i}
              onClick={() => handleCategorySelect(cat.name)}
              className="bg-white p-3 rounded-2xl border border-neutral-200/60 shadow-2xs flex flex-col items-center justify-center gap-1.5 text-center cursor-pointer hover:border-[#06382B] hover:shadow-md transition-all active:scale-95"
            >
              <span className="text-2xl">{cat.icon}</span>
              <span className="text-[11px] font-bold text-[#06382B]">{cat.name}</span>
            </div>
          ))}
        </div>

        {/* Promo Banner Card */}
        <div className="bg-gradient-to-r from-[#04291F] via-[#06382B] to-[#0B4A3A] rounded-2xl p-4 text-white shadow-md relative overflow-hidden flex items-center justify-between border border-[#D4AF37]/30">
          <div className="space-y-2 z-10 max-w-[62%]">
            <span className="bg-[#D4AF37] text-[#06382B] text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
              Special Recommendation
            </span>
            <h3 className="font-serif font-bold text-sm leading-snug text-white">
              100% Pure Veg & Gourmet Delicacies
            </h3>
            <p className="text-[10px] text-white/80 leading-relaxed">
              Prepared fresh within 15 mins by master chefs.
            </p>
            <button
              onClick={() => setCurrentScreen('menu')}
              className="bg-[#D4AF37] hover:bg-[#b8982e] text-[#06382B] px-3.5 py-1 rounded-full text-[11px] font-bold cursor-pointer transition-transform active:scale-95 shadow-xs"
            >
              Explore Now
            </button>
          </div>

          <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-[#D4AF37] shadow-lg shrink-0">
            <img src={salmonImg} alt="Special Dish" className="w-full h-full object-cover" />
          </div>
        </div>

        {/* Popular Items Grid */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="font-serif font-bold text-[#06382B] text-sm">Popular near you</h3>
            <button onClick={() => setCurrentScreen('menu')} className="text-xs text-[#06382B] font-semibold flex items-center cursor-pointer">
              See All <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {popularDishes.map((item, idx) => (
              <div
                key={item.id}
                onClick={() => setSelectedDetailItem(item)}
                className={`bg-white p-3 rounded-2xl border shadow-2xs space-y-2 flex flex-col justify-between relative cursor-pointer hover:shadow-md transition-all active:scale-[0.98] ${item.inStock ? 'border-neutral-200/80' : 'border-red-200 opacity-70'
                  }`}
              >

                {/* Heart wishlist button */}
                <button
                  onClick={(e) => e.stopPropagation()}
                  className="absolute top-4 right-4 z-10 text-neutral-400 hover:text-red-500 cursor-pointer"
                >
                  <Heart className="w-3.5 h-3.5" />
                </button>

                {/* Dish Image */}
                <div className="h-28 w-full rounded-xl overflow-hidden relative">
                  <img src={getImage(item)} alt={item.name} className="w-full h-full object-cover" />

                  {!item.inStock ? (
                    <div className="absolute inset-0 bg-black/70 flex items-center justify-center text-white text-[9px] font-bold uppercase tracking-wider text-center p-1">
                      Not Available
                    </div>
                  ) : (
                    <>
                      {/* Rating badge */}
                      <div className="absolute bottom-1.5 left-1.5 bg-black/60 backdrop-blur-xs text-white px-2 py-0.5 rounded-full text-[9px] font-bold flex items-center gap-1">
                        <Star className="w-2.5 h-2.5 text-amber-400 fill-amber-400" />
                        <span>4.{8 - (idx % 3)}</span>
                      </div>

                      {/* Prep time */}
                      <div className="absolute bottom-1.5 right-1.5 bg-white/90 text-[#06382B] px-1.5 py-0.5 rounded-md text-[8px] font-bold flex items-center gap-0.5">
                        <Clock className="w-2.5 h-2.5" />
                        <span>15mins</span>
                      </div>
                    </>
                  )}
                </div>

                {/* Dish Details */}
                <div>
                  <h4 className="font-serif font-bold text-xs text-[#06382B] line-clamp-1">{item.name}</h4>
                  <p className="text-[10px] text-neutral-400 line-clamp-1">{item.description}</p>
                </div>

                {/* Price & Add button */}
                <div className="flex justify-between items-center pt-1 border-t border-neutral-100">
                  <span className="font-bold text-xs text-[#06382B]">₹{item.price}</span>
                  {item.inStock ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(item);
                      }}
                      className="bg-[#06382B] hover:bg-[#04291F] text-[#D4AF37] p-1.5 rounded-lg text-xs font-bold cursor-pointer hover:scale-105 active:scale-95 transition-transform"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <span className="text-[9px] font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded">Not Available</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Interactive Dish Detail Sheet Overlay */}
      {selectedDetailItem && (
        <DishDetailSheet
          item={selectedDetailItem}
          onClose={() => setSelectedDetailItem(null)}
          onSelectRecommend={(recItem) => setSelectedDetailItem(recItem)}
        />
      )}
    </MobileContainer>
  );
}
