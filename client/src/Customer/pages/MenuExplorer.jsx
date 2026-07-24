import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import MobileContainer from '../../components/MobileContainer';
import DishDetailSheet from '../../components/DishDetailSheet';
import { Search, ShoppingBag, Plus, Minus, Info } from 'lucide-react';
import steakImg from '../../assets/steak.png';
import tableImg from '../../assets/table.png';
import salmonImg from '../../assets/salmon.png';
import saladImg from '../../assets/salad.png';

export default function MenuExplorer() {
  const { menuItems, cart, addToCart, removeFromCart, setCurrentScreen, tableId, selectedCategory, setSelectedCategory } = useApp();
  const [search, setSearch] = useState('');
  const [selectedSubcategory, setSelectedSubcategory] = useState('All');
  const [selectedDetailItem, setSelectedDetailItem] = useState(null);

  const categories = [
    'All',
    'Breakfast & South Indian',
    'Chinese',
    'Tandoor',
    'Continental',
    'Indian Main Course',
    'Desserts & Beverages'
  ];

  const availableSubcategories = ['All', ...new Set(
    menuItems
      .filter((item) => selectedCategory === 'All' || item.category === selectedCategory)
      .map((item) => item.subcategory)
      .filter(Boolean)
  )];

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

  const filteredItems = menuItems.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase()) || 
                          item.description.toLowerCase().includes(search.toLowerCase()) ||
                          (item.subcategory && item.subcategory.toLowerCase().includes(search.toLowerCase()));
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSubcategory = selectedSubcategory === 'All' || item.subcategory === selectedSubcategory;
    return matchesSearch && matchesCategory && matchesSubcategory;
  });

  const cartItemCount = cart.reduce((acc, ci) => acc + ci.quantity, 0);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const input = e.target.querySelector('input');
    if (input) input.blur();
  };

  return (
    <MobileContainer>
      {/* Top Header with Emerald Gradient */}
      <div className="bg-gradient-to-r from-[#04291F] via-[#06382B] to-[#0B4A3A] p-4 text-[#FAF7F2] space-y-3 z-10 shrink-0 border-b border-[#D4AF37]/30 shadow-md">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="font-serif font-bold text-lg leading-tight tracking-wide text-[#D4AF37]">Menu Explorer</h2>
            <span className="text-[10px] text-white/80 uppercase tracking-wider font-semibold">
              K/N Restaurant • Table {tableId || 1}
            </span>
          </div>
          {cartItemCount > 0 && (
            <button 
              onClick={() => setCurrentScreen('cart')}
              className="bg-[#D4AF37] hover:bg-[#b8982e] text-[#06382B] p-2 rounded-full relative transition-colors duration-200 cursor-pointer shadow-md"
            >
              <ShoppingBag className="w-5 h-5" />
              <span className="absolute -top-1.5 -right-1.5 bg-[#06382B] text-white text-[9px] w-4.5 h-4.5 rounded-full flex items-center justify-center font-bold">
                {cartItemCount}
              </span>
            </button>
          )}
        </div>

        {/* Search bar with Keyboard Blur on Enter */}
        <form onSubmit={handleSearchSubmit} className="relative w-full">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-[#D4AF37]" />
          <input 
            type="text" 
            placeholder="Search Dosa, Paneer, Biryani, Chai..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.currentTarget.blur();
              }
            }}
            className="w-full bg-[#04291F]/60 border border-[#D4AF37]/30 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white placeholder-white/60 focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
          />
        </form>
      </div>

      {/* Main Categories Carousel */}
      <div className="flex gap-2 overflow-x-auto px-4 py-2.5 bg-[#F7FAF7] shrink-0 scrollbar-none border-b border-[#06382B]/10">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => {
              setSelectedCategory(cat);
              setSelectedSubcategory('All');
            }}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
              selectedCategory === cat 
                ? 'bg-[#06382B] text-[#D4AF37] shadow-xs border border-[#D4AF37]/40' 
                : 'bg-white text-[#06382B] border border-neutral-200 hover:bg-[#06382B]/10'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Subcategory Filter Pills */}
      {availableSubcategories.length > 2 && (
        <div className="flex gap-1.5 overflow-x-auto px-4 py-2 bg-white/80 shrink-0 scrollbar-none border-b border-[#06382B]/10">
          {availableSubcategories.map((subcat) => (
            <button
              key={subcat}
              onClick={() => setSelectedSubcategory(subcat)}
              className={`px-3 py-1 rounded-lg text-[11px] font-medium whitespace-nowrap transition-all cursor-pointer ${
                selectedSubcategory === subcat
                  ? 'bg-[#06382B] text-white font-semibold'
                  : 'text-[#06382B]/70 hover:text-[#06382B]'
              }`}
            >
              {subcat}
            </button>
          ))}
        </div>
      )}

      {/* Menu Items List */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3.5 scrollbar-thin pb-24 bg-[#F7FAF7]">
        {filteredItems.map((item) => {
          const cartItem = cart.find((ci) => ci.item.id === item.id);
          const quantity = cartItem ? cartItem.quantity : 0;
          return (
            <div 
              key={item.id}
              onClick={() => setSelectedDetailItem(item)}
              className={`bg-white p-3.5 rounded-2xl border flex justify-between gap-3 shadow-xs items-center transition-all duration-300 cursor-pointer hover:shadow-md active:scale-[0.99] ${
                item.inStock ? 'border-neutral-200/80' : 'border-red-200 opacity-60'
              }`}
            >
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 border-2 border-emerald-600 rounded-sm flex items-center justify-center p-[1px]">
                    <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full" />
                  </span>
                  <span className="bg-[#06382B]/10 text-[#06382B] px-2 py-0.5 rounded text-[9px] font-bold uppercase">
                    {item.subcategory}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 pt-0.5">
                  <h3 className="font-serif font-bold text-[#06382B] text-[15px]">{item.name}</h3>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedDetailItem(item);
                    }}
                    className="text-[#D4AF37] hover:text-[#06382B] transition-colors cursor-pointer"
                  >
                    <Info className="w-3.5 h-3.5" />
                  </button>
                </div>

                <p className="text-neutral-500 text-xs line-clamp-1 pr-2">{item.description}</p>
                <span className="font-serif text-[#06382B] font-bold text-sm">₹{item.price}</span>
              </div>

              <div className="relative w-20 h-20 shrink-0 rounded-xl overflow-hidden shadow-inner border border-neutral-100">
                <img src={getImage(item)} alt={item.name} className="w-full h-full object-cover" />
                
                {!item.inStock ? (
                  <div className="absolute inset-0 bg-black/70 flex items-center justify-center text-white text-[8px] font-bold uppercase tracking-wider text-center p-1">
                    Not Available
                  </div>
                ) : quantity > 0 ? (
                  <div 
                    onClick={(e) => e.stopPropagation()}
                    className="absolute inset-x-1 bottom-1 bg-[#06382B] text-white rounded-lg h-6 flex items-center justify-between px-1 shadow-md border border-[#D4AF37]/40"
                  >
                    <button onClick={() => removeFromCart(item.id)} className="text-white hover:text-[#D4AF37] p-0.5 cursor-pointer">
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="text-[10px] font-bold text-[#D4AF37]">{quantity}</span>
                    <button onClick={() => addToCart(item)} className="text-white hover:text-[#D4AF37] p-0.5 cursor-pointer">
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(item);
                    }}
                    className="absolute right-1 bottom-1 bg-[#06382B] hover:bg-[#04291F] text-[#D4AF37] p-1.5 rounded-lg shadow-md cursor-pointer hover:scale-105 active:scale-95 transition-transform border border-[#D4AF37]/40"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {filteredItems.length === 0 && (
          <div className="text-center py-10 text-neutral-400 text-sm">
            No dishes found matching your search.
          </div>
        )}
      </div>

      {/* Floating Bottom View Cart Bar */}
      {cartItemCount > 0 && (
        <div className="absolute bottom-16 inset-x-4 z-30 animate-fade-up">
          <button 
            onClick={() => setCurrentScreen('cart')}
            className="w-full bg-[#06382B] hover:bg-[#04291F] text-[#FAF7F2] rounded-full py-3.5 px-6 flex justify-between items-center shadow-2xl transition-all duration-300 transform active:scale-[0.98] cursor-pointer border border-[#D4AF37]/40"
          >
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="w-5 h-5 text-[#D4AF37]" />
              <span className="font-semibold text-sm tracking-wide">{cartItemCount} items selected</span>
            </div>
            <span className="text-[#D4AF37] font-bold text-sm tracking-wide">View Cart &rarr;</span>
          </button>
        </div>
      )}

      {/* Item Detail Sheet Modal */}
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
