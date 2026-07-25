import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Plus, Edit2, CheckCircle2, XCircle, Search, Trash2, Camera, RefreshCw, Star, Sparkles } from 'lucide-react';
import steakImg from '../../assets/steak.png';
import tableImg from '../../assets/table.png';
import salmonImg from '../../assets/salmon.png';
import saladImg from '../../assets/salad.png';

export default function MenuManager() {
  const { 
    menuItems, 
    toggleItemStock, 
    togglePopularStatus,
    updateItemPrice, 
    updateMenuItem, 
    removeMenuItemImage, 
    addNewMenuItem 
  } = useApp();

  const [search, setSearch] = useState('');
  const [viewFilter, setViewFilter] = useState('all'); // 'all' or 'featured'
  const [editingItem, setEditingItem] = useState(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const handleFeatureToggle = async (itemId) => {
    const res = await togglePopularStatus(itemId);
    if (res && res.success === false) {
      setToastMessage(res.message);
      setTimeout(() => setToastMessage(null), 3500);
    }
  };

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: 'Breakfast & South Indian',
    subcategory: 'South Indian',
    description: '',
    image: 'table',
    customImage: '',
    isVeg: true
  });

  const categoriesList = [
    'Breakfast & South Indian',
    'Chinese',
    'Tandoor',
    'Continental',
    'Indian Main Course',
    'Desserts & Beverages'
  ];

  const getImageSrc = (item) => {
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

  const openEditModal = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      price: item.price,
      category: item.category,
      subcategory: item.subcategory,
      description: item.description,
      image: item.image || 'table',
      customImage: item.customImage || '',
      isVeg: item.isVeg !== false
    });
  };

  const openAddModal = () => {
    setIsAddingNew(true);
    setFormData({
      name: '',
      price: '199',
      category: 'Breakfast & South Indian',
      subcategory: 'South Indian',
      description: '',
      image: 'table',
      customImage: '',
      isVeg: true
    });
  };

  // HIGH PERFORMANCE HTML5 CANVAS IMAGE COMPRESSOR
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_SIZE = 350;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_SIZE) {
              height *= MAX_SIZE / width;
              width = MAX_SIZE;
            }
          } else {
            if (height > MAX_SIZE) {
              width *= MAX_SIZE / height;
              height = MAX_SIZE;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.7);
          setFormData((prev) => ({ ...prev, customImage: compressedDataUrl }));
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (editingItem) {
      updateMenuItem(editingItem.id, {
        name: formData.name,
        price: Number(formData.price),
        category: formData.category,
        subcategory: formData.subcategory,
        description: formData.description,
        image: formData.image,
        customImage: formData.customImage || null,
        isVeg: formData.isVeg
      });
      setEditingItem(null);
    } else if (isAddingNew) {
      addNewMenuItem({
        name: formData.name,
        price: Number(formData.price),
        category: formData.category,
        subcategory: formData.subcategory,
        description: formData.description,
        image: formData.image,
        customImage: formData.customImage || null,
        isVeg: formData.isVeg
      });
      setIsAddingNew(false);
    }
  };

  const featuredCount = menuItems.filter((i) => i.isPopular === true).length;

  const filteredItems = menuItems.filter((item) => {
    const matchesSearch = 
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.category.toLowerCase().includes(search.toLowerCase()) ||
      (item.subcategory && item.subcategory.toLowerCase().includes(search.toLowerCase()));

    if (viewFilter === 'featured') {
      return matchesSearch && item.isPopular === true;
    }
    return matchesSearch;
  });

  return (
    <div className="p-4 space-y-4 font-sans text-xs relative">
      
      {/* Toast Alert Banner */}
      {toastMessage && (
        <div className="fixed top-20 left-4 right-4 z-50 bg-red-600 text-white p-3 rounded-2xl shadow-2xl font-bold text-xs text-center border border-white/30 animate-bounce">
          {toastMessage}
        </div>
      )}
      
      {/* Header & Add Button */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="font-serif text-[#06382B] font-bold text-base">Menu & Home Display Controls</h3>
          <span className="text-[10px] text-neutral-500">Manage dish stock, prices, photos & Home Page Featured items</span>
        </div>
        
        <button 
          onClick={openAddModal}
          className="bg-[#06382B] hover:bg-[#04291F] text-[#D4AF37] px-3 py-2 rounded-xl text-xs font-bold shadow-md cursor-pointer flex items-center gap-1 border border-[#D4AF37]/30 transition-transform active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4" /> Add Item
        </button>
      </div>

      {/* HOME POPULAR ITEMS CONTROL PANEL */}
      <div className="bg-[#06382B]/5 border border-[#06382B]/20 rounded-2xl p-3.5 space-y-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-1.5 text-[#06382B] font-bold text-xs">
            <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
            <span>Home Page Featured Dishes Control</span>
          </div>
          <span className="bg-[#06382B] text-[#D4AF37] px-2.5 py-0.5 rounded-full text-[10px] font-bold shadow-xs">
            {featuredCount} Featured
          </span>
        </div>
        <p className="text-[11px] text-[#06382B]/80 leading-relaxed">
          Click the ⭐ <b>Featured</b> button on any dish below to select exactly which dishes appear on the Customer Home Page under <i>"Popular near you"</i>!
        </p>

        <div className="flex gap-2 pt-1">
          <button
            onClick={() => setViewFilter('all')}
            className={`px-3 py-1 rounded-xl font-bold text-[11px] cursor-pointer transition-all ${
              viewFilter === 'all'
                ? 'bg-[#06382B] text-[#D4AF37]'
                : 'bg-white text-neutral-600 border border-neutral-200'
            }`}
          >
            All Menu Items ({menuItems.length})
          </button>
          <button
            onClick={() => setViewFilter('featured')}
            className={`px-3 py-1 rounded-xl font-bold text-[11px] cursor-pointer transition-all flex items-center gap-1 ${
              viewFilter === 'featured'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'bg-white text-amber-700 border border-amber-300'
            }`}
          >
            <Star className="w-3 h-3 fill-current" /> ⭐ Home Featured ({featuredCount})
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
        <input 
          type="text" 
          placeholder="Search items by name, category, or subcategory..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-white border border-neutral-200 rounded-xl py-2 pl-9 pr-4 text-xs focus:outline-none focus:ring-1 focus:ring-[#06382B] shadow-2xs"
        />
      </div>

      {/* Item List */}
      <div className="bg-white rounded-2xl border border-neutral-200/80 shadow-2xs overflow-hidden divide-y divide-neutral-100">
        {filteredItems.length === 0 ? (
          <div className="p-8 text-center text-neutral-400">
            {viewFilter === 'featured' 
              ? 'No dishes featured on Home Page yet. Click ⭐ Featured on any dish to select it!'
              : 'No menu items found matching search.'
            }
          </div>
        ) : (
          filteredItems.map((item) => (
            <div key={item.id} className="p-3 flex justify-between items-center gap-3">
              
              {/* Dish Thumbnail & Camera Trigger */}
              <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-neutral-200 group">
                <img src={getImageSrc(item)} alt={item.name} className="w-full h-full object-cover" />
                <button 
                  onClick={() => openEditModal(item)}
                  className="absolute inset-0 bg-black/60 text-[#D4AF37] flex items-center justify-center cursor-pointer opacity-90 group-hover:opacity-100 transition-opacity"
                  title="Edit Dish & Photo"
                >
                  <Camera className="w-4 h-4" />
                </button>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-600 shrink-0" />
                  <h4 className="font-serif font-bold text-[#06382B] text-xs truncate">{item.name}</h4>
                  {item.isPopular && (
                    <span className="bg-amber-100 text-amber-800 text-[9px] font-bold px-1.5 py-0.2 rounded-md flex items-center gap-0.5 shrink-0 border border-amber-300">
                      <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-500" /> Home
                    </span>
                  )}
                </div>
                <span className="text-[10px] text-neutral-400 truncate block">
                  {item.subcategory} • {item.category}
                </span>
                
                {/* Quick Inline Price Edit */}
                <div className="flex items-center gap-1 mt-1">
                  <span className="text-neutral-500 font-bold text-[10px]">₹</span>
                  <input 
                    type="number"
                    defaultValue={item.price}
                    onBlur={(e) => {
                      const newP = Number(e.target.value);
                      if (newP > 0 && newP !== item.price) {
                        updateItemPrice(item.id, newP);
                      }
                    }}
                    className="w-16 bg-neutral-50 border border-neutral-200 rounded px-1 py-0.5 font-bold text-[#06382B] text-xs focus:outline-none focus:bg-white"
                  />
                </div>
              </div>

              {/* Actions: Edit, Home Feature & Stock Toggle */}
              <div className="flex items-center gap-1.5 shrink-0">
                <button 
                  onClick={() => openEditModal(item)}
                  className="p-1.5 bg-neutral-100 hover:bg-neutral-200 text-[#06382B] rounded-lg cursor-pointer transition-colors"
                  title="Full Edit"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>

                <button 
                  onClick={() => handleFeatureToggle(item.id)}
                  className={`p-1.5 rounded-lg border transition-all cursor-pointer flex items-center gap-1 text-[10px] font-bold ${
                    item.isPopular 
                      ? 'bg-amber-100 text-amber-800 border-amber-300 shadow-xs' 
                      : 'bg-neutral-100 text-neutral-500 border-neutral-200 hover:text-amber-700'
                  }`}
                  title={item.isPopular ? 'Featured on Home Page (Popular)' : 'Feature on Home Page'}
                >
                  <Star className={`w-3.5 h-3.5 ${item.isPopular ? 'fill-amber-400 text-amber-500' : ''}`} />
                  <span className="hidden sm:inline">{item.isPopular ? 'Featured' : 'Home'}</span>
                </button>

                <button 
                  onClick={() => toggleItemStock(item.id)}
                  className={`px-2.5 py-1.5 rounded-xl font-bold text-[10px] flex items-center gap-1 cursor-pointer transition-all duration-200 ${
                    item.inStock 
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                      : 'bg-red-100 text-red-800 border border-red-300'
                  }`}
                >
                  {item.inStock ? (
                    <>
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" /> In Stock
                    </>
                  ) : (
                    <>
                      <XCircle className="w-3 h-3 text-red-600" /> Not Available
                    </>
                  )}
                </button>
              </div>

            </div>
          ))
        )}
      </div>

      {/* Edit / Add Modal */}
      {(editingItem || isAddingNew) && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-[#F7FAF7] w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl border border-[#06382B]/30 flex flex-col max-h-[90vh]">
            <div className="bg-[#06382B] p-3.5 text-white flex justify-between items-center shrink-0">
              <h4 className="font-serif font-bold text-sm text-[#D4AF37]">
                {editingItem ? `Edit: ${editingItem.name}` : 'Add New Gourmet Dish'}
              </h4>
              <button 
                onClick={() => { setEditingItem(null); setIsAddingNew(false); }}
                className="text-white/70 hover:text-white font-bold text-base cursor-pointer"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="p-4 space-y-3 overflow-y-auto flex-1">
              
              {/* Photo Upload Section */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-[#06382B] uppercase tracking-wider block">
                  Dish Custom Image / Photo
                </label>
                <div className="flex items-center gap-3 bg-white p-2.5 rounded-xl border border-neutral-200">
                  <div className="w-14 h-14 rounded-lg overflow-hidden border border-neutral-200 shrink-0 bg-neutral-100">
                    <img 
                      src={formData.customImage || getImageSrc({ image: formData.image })} 
                      alt="Preview" 
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="space-y-1.5 flex-1">
                    <label className="bg-[#06382B] text-[#D4AF37] px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer inline-flex items-center gap-1 shadow-xs hover:bg-[#04291F]">
                      <Camera className="w-3.5 h-3.5" /> Upload Photo
                      <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                    </label>

                    {formData.customImage && (
                      <button
                        type="button"
                        onClick={() => setFormData((prev) => ({ ...prev, customImage: '' }))}
                        className="text-red-600 text-[10px] font-bold hover:underline block"
                      >
                        Reset to default photo
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-[#06382B] uppercase">Dish Name</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-white border border-neutral-200 rounded-xl p-2.5 text-xs font-medium focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-bold text-[#06382B] uppercase">Price (₹)</label>
                  <input 
                    type="number" 
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full bg-white border border-neutral-200 rounded-xl p-2.5 text-xs font-medium focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-[#06382B] uppercase">Diet Type</label>
                  <select 
                    value={formData.isVeg ? 'veg' : 'nonveg'}
                    onChange={(e) => setFormData({ ...formData, isVeg: e.target.value === 'veg' })}
                    className="w-full bg-white border border-neutral-200 rounded-xl p-2.5 text-xs font-medium focus:outline-none"
                  >
                    <option value="veg">100% Pure Veg</option>
                    <option value="nonveg">Non-Veg</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-[#06382B] uppercase">Category</label>
                <select 
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full bg-white border border-neutral-200 rounded-xl p-2.5 text-xs font-medium focus:outline-none"
                >
                  {categoriesList.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-[#06382B] uppercase">Subcategory</label>
                <input 
                  type="text" 
                  value={formData.subcategory}
                  onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
                  placeholder="e.g. Starters, Soup, South Indian..."
                  className="w-full bg-white border border-neutral-200 rounded-xl p-2.5 text-xs font-medium focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-[#06382B] uppercase">Description</label>
                <textarea 
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={2}
                  className="w-full bg-white border border-neutral-200 rounded-xl p-2.5 text-xs font-medium focus:outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-neutral-200">
                <button 
                  type="button" 
                  onClick={() => { setEditingItem(null); setIsAddingNew(false); }}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-neutral-600 bg-neutral-100 hover:bg-neutral-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold text-[#D4AF37] bg-[#06382B] hover:bg-[#04291F] cursor-pointer shadow-md"
                >
                  Save Changes
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
