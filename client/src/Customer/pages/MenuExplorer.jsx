import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Search, ShoppingBag, Plus, Minus, Info } from 'lucide-react';
import steakImg from '../../assets/steak.png';
import tableImg from '../../assets/table.png';
import salmonImg from '../../assets/salmon.png';
import saladImg from '../../assets/salad.png';

export default function MenuExplorer() {
  const { menuItems, cart, addToCart, removeFromCart, setCurrentScreen, tableId, isDineIn } = useApp();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDetailItem, setSelectedDetailItem] = useState(null);

  const categories = ['All', 'Starters', 'Mains', 'Drinks'];

  const getImage = (key) => {
    switch (key) {
      case 'steak': return steakImg;
      case 'table': return tableImg;
      case 'salmon': return salmonImg;
      case 'salad': return saladImg;
      default: return tableImg;
    }
  };

  const filteredItems = menuItems.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase()) || 
                          item.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const cartItemCount = cart.reduce((acc, ci) => acc + ci.quantity, 0);

  return (
    <div className="h-[100dvh] w-full bg-palette-gradient flex items-center justify-center p-0 sm:p-4 font-sans overflow-hidden">
      <div className="w-full max-w-md bg-[#E3EFE6] shadow-2xl h-[100dvh] sm:h-[850px] sm:rounded-[36px] overflow-hidden flex flex-col justify-between relative border border-[#8EB69B]/20 animate-fade-up">
        
        {/* Top Header */}
        <div className="bg-gradient-to-r from-[#051F20] via-[#0B2B26] to-[#163832] p-4 text-[#E3EFE6] space-y-3 z-10 shrink-0 border-b border-[#8EB69B]/20">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="font-serif font-bold text-lg leading-tight tracking-wide text-[#E3EFE6]">K/N Restaurant</h2>
              <span className="text-[10px] text-[#8EB69B] uppercase tracking-wider font-semibold">
                {isDineIn ? `Dine-In • Table ${tableId}` : 'Guest Mode (Ordering Blocked)'}
              </span>
            </div>
            {cartItemCount > 0 && (
              <button 
                onClick={() => setCurrentScreen('cart')}
                className="bg-[#8EB69B] hover:bg-[#7aa788] text-[#051F20] p-2 rounded-full relative transition-colors duration-200 cursor-pointer shadow-md"
              >
                <ShoppingBag className="w-5 h-5" />
                <span className="absolute -top-1.5 -right-1.5 bg-[#051F20] text-[#E3EFE6] text-[9px] w-4.5 h-4.5 rounded-full flex items-center justify-center font-bold">
                  {cartItemCount}
                </span>
              </button>
            )}
          </div>

          {/* Search bar */}
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-[#8EB69B]" />
            <input 
              type="text" 
              placeholder="Search dishes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#051F20]/60 border border-[#8EB69B]/30 rounded-xl py-2.5 pl-10 pr-4 text-sm text-[#E3EFE6] placeholder-[#8EB69B]/60 focus:outline-none focus:ring-1 focus:ring-[#8EB69B]"
            />
          </div>
        </div>

        {/* Categories Carousel */}
        <div className="flex gap-2 overflow-x-auto px-4 py-3 bg-palette-light-gradient shrink-0 scrollbar-none border-b border-[#8EB69B]/20">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                selectedCategory === cat 
                  ? 'bg-[#0B2B26] text-[#8EB69B] shadow-sm' 
                  : 'bg-white text-[#163832] border border-[#8EB69B]/30 hover:bg-[#8EB69B]/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Menu Items List */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3.5 scrollbar-thin">
          {filteredItems.map((item) => {
            const cartItem = cart.find((ci) => ci.item.id === item.id);
            const quantity = cartItem ? cartItem.quantity : 0;
            return (
              <div 
                key={item.id}
                className="bg-white p-3.5 rounded-2xl border border-[#8EB69B]/25 flex justify-between gap-3 shadow-xs items-center hover:shadow-md transition-shadow duration-300"
              >
                {/* Details text */}
                <div className="flex-1 space-y-1.5">
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-serif font-bold text-[#051F20] text-[15px]">{item.name}</h3>
                    <button 
                      onClick={() => setSelectedDetailItem(item)}
                      className="text-[#8EB69B] hover:text-[#235347] transition-colors cursor-pointer"
                    >
                      <Info className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <p className="text-[#163832]/80 text-xs line-clamp-2 pr-2">{item.description}</p>
                  <span className="font-serif text-[#235347] font-bold text-sm">${item.price}</span>
                </div>

                {/* Thumbnail & Counter */}
                <div className="relative w-20 h-20 shrink-0 rounded-xl overflow-hidden shadow-inner border border-neutral-100">
                  <img src={getImage(item.image)} alt={item.name} className="w-full h-full object-cover" />
                  
                  {/* Plus/Minus Controller Overlay */}
                  {quantity > 0 ? (
                    <div className="absolute inset-x-1 bottom-1 bg-[#0B2B26] text-white rounded-lg h-6 flex items-center justify-between px-1 shadow-md">
                      <button onClick={() => removeFromCart(item.id)} className="text-white hover:text-[#8EB69B] p-0.5 cursor-pointer">
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-[10px] font-bold text-[#8EB69B]">{quantity}</span>
                      <button onClick={() => addToCart(item)} className="text-white hover:text-[#8EB69B] p-0.5 cursor-pointer">
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <button 
                      onClick={() => addToCart(item)}
                      className="absolute right-1 bottom-1 bg-[#0B2B26] hover:bg-[#163832] text-[#8EB69B] p-1.5 rounded-lg shadow-md cursor-pointer hover:scale-105 active:scale-95 transition-transform"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}

          {filteredItems.length === 0 && (
            <div className="text-center py-10 text-[#163832]/60 text-sm">
              No dishes found matching your search.
            </div>
          )}
        </div>

        {/* Floating Bottom View Cart Bar */}
        {cartItemCount > 0 && (
          <div className="absolute bottom-6 inset-x-6 z-30 animate-fade-up">
            <button 
              onClick={() => setCurrentScreen('cart')}
              className="w-full bg-[#0B2B26] hover:bg-[#163832] text-[#E3EFE6] rounded-full py-4 px-6 flex justify-between items-center shadow-2xl transition-all duration-300 transform active:scale-[0.98] cursor-pointer border border-[#8EB69B]/30"
            >
              <div className="flex items-center gap-2.5">
                <ShoppingBag className="w-5 h-5 text-[#8EB69B]" />
                <span className="font-semibold text-sm tracking-wide">{cartItemCount} items selected</span>
              </div>
              <span className="text-[#8EB69B] font-bold text-sm tracking-wide">View Cart &rarr;</span>
            </button>
          </div>
        )}

        {/* Item Detail Modal */}
        {selectedDetailItem && (
          <div className="absolute inset-0 bg-[#051F20]/70 backdrop-blur-xs flex items-center justify-center p-6 z-50 animate-fade-in">
            <div className="bg-[#E3EFE6] w-full max-w-sm rounded-[24px] overflow-hidden shadow-2xl flex flex-col border border-[#8EB69B]/30">
              <div className="h-44 w-full relative">
                <img 
                  src={getImage(selectedDetailItem.image)} 
                  alt={selectedDetailItem.name} 
                  className="w-full h-full object-cover"
                />
                <button 
                  onClick={() => setSelectedDetailItem(null)}
                  className="absolute top-3 right-3 bg-[#051F20]/70 hover:bg-[#051F20] text-[#E3EFE6] w-7 h-7 rounded-full flex items-center justify-center font-bold text-sm cursor-pointer"
                >
                  &times;
                </button>
              </div>
              <div className="p-5 space-y-3">
                <div>
                  <span className="bg-[#0B2B26]/10 text-[#0B2B26] px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider">
                    {selectedDetailItem.category}
                  </span>
                  <h3 className="font-serif font-bold text-[#051F20] text-xl mt-1">{selectedDetailItem.name}</h3>
                </div>
                <p className="text-[#163832] text-sm leading-relaxed">{selectedDetailItem.description}</p>
                <div className="flex justify-between items-center pt-2">
                  <span className="font-serif text-[#235347] font-bold text-lg">${selectedDetailItem.price}</span>
                  <button 
                    onClick={() => {
                      addToCart(selectedDetailItem);
                      setSelectedDetailItem(null);
                    }}
                    className="bg-[#0B2B26] hover:bg-[#163832] text-[#8EB69B] py-2 px-5 rounded-full text-xs font-semibold cursor-pointer transition-colors duration-200"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
