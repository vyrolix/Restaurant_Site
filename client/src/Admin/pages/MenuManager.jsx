import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Search, CheckCircle, XCircle, Edit3, Plus, Trash2, Camera, Upload, Link as LinkIcon, Image as ImageIcon, X } from 'lucide-react';
import steakImg from '../../assets/steak.png';
import tableImg from '../../assets/table.png';
import salmonImg from '../../assets/salmon.png';
import saladImg from '../../assets/salad.png';

export default function MenuManager() {
  const { menuItems, toggleItemStock, updateMenuItem, removeMenuItemImage, addNewMenuItem } = useApp();
  const [search, setSearch] = useState('');
  
  // Modals
  const [editingItem, setEditingItem] = useState(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  // Form State
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

  const getImageSrc = (item) => {
    if (item.customImage) return item.customImage;
    switch (item.image) {
      case 'steak': return steakImg;
      case 'table': return tableImg;
      case 'salmon': return salmonImg;
      case 'salad': return saladImg;
      default: return tableImg;
    }
  };

  const filteredItems = menuItems.filter((item) => 
    item.name.toLowerCase().includes(search.toLowerCase()) ||
    item.category.toLowerCase().includes(search.toLowerCase()) ||
    item.subcategory.toLowerCase().includes(search.toLowerCase())
  );

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

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, customImage: reader.result }));
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
      addNewMenuItem(formData);
      setIsAddingNew(false);
    }
  };

  const handleRemoveImage = (id) => {
    removeMenuItemImage(id);
    setFormData((prev) => ({ ...prev, customImage: '' }));
  };

  return (
    <div className="p-4 space-y-4 font-sans text-xs">
      
      {/* Header & Add Button */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="font-serif text-[#06382B] font-bold text-base">Menu & Stock Management</h3>
          <span className="text-[10px] text-neutral-500">Edit dish prices, photos, category & stock</span>
        </div>
        
        <button 
          onClick={openAddModal}
          className="bg-[#06382B] hover:bg-[#04291F] text-[#D4AF37] px-3 py-2 rounded-xl text-xs font-bold shadow-md cursor-pointer flex items-center gap-1 border border-[#D4AF37]/30 transition-transform active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4" /> Add Item
        </button>
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
        {filteredItems.map((item) => (
          <div key={item.id} className="p-3 flex justify-between items-center gap-3">
            
            {/* Dish Thumbnail */}
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
              </div>
              <span className="text-[9px] text-neutral-400 block truncate">{item.category} • {item.subcategory}</span>
            </div>

            {/* Price & Edit Button */}
            <div className="flex items-center gap-2 shrink-0">
              <span className="font-serif font-bold text-[#06382B] text-xs">₹{item.price}</span>
              
              <button 
                onClick={() => openEditModal(item)}
                className="p-1.5 bg-neutral-100 hover:bg-[#06382B] hover:text-[#D4AF37] text-[#06382B] rounded-lg transition-colors cursor-pointer"
                title="Edit Dish Details"
              >
                <Edit3 className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Stock Switch */}
            <button 
              onClick={() => toggleItemStock(item.id)}
              className={`px-2 py-1 rounded-full text-[10px] font-bold shrink-0 transition-colors cursor-pointer flex items-center gap-1 ${
                item.inStock 
                  ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200' 
                  : 'bg-red-100 text-red-700 hover:bg-red-200'
              }`}
            >
              {item.inStock ? (
                <><CheckCircle className="w-3 h-3 text-emerald-600" /> In Stock</>
              ) : (
                <><XCircle className="w-3 h-3 text-red-600" /> Out</>
              )}
            </button>
          </div>
        ))}
      </div>

      {/* Edit / Add Menu Item Modal */}
      {(editingItem || isAddingNew) && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in overflow-y-auto">
          <div className="bg-white rounded-3xl p-5 max-w-sm w-full space-y-4 border border-[#06382B]/30 shadow-2xl my-auto">
            
            <div className="flex justify-between items-center border-b border-neutral-100 pb-2">
              <h4 className="font-serif font-bold text-[#06382B] text-sm">
                {editingItem ? `Edit Dish: ${editingItem.name}` : 'Add New Menu Item'}
              </h4>
              <button 
                onClick={() => {
                  setEditingItem(null);
                  setIsAddingNew(false);
                }}
                className="text-neutral-400 hover:text-red-600 p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3">
              
              {/* Name */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-[#06382B] uppercase">Dish Name</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Special Paneer Tikka"
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-2.5 text-xs text-[#06382B] focus:outline-none focus:ring-1 focus:ring-[#06382B]"
                  required
                />
              </div>

              {/* Price & Category */}
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-[#06382B] uppercase">Price (₹)</label>
                  <input 
                    type="number" 
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="199"
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-2.5 text-xs text-[#06382B] focus:outline-none focus:ring-1 focus:ring-[#06382B]"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-[#06382B] uppercase">Category</label>
                  <select 
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-2.5 text-xs text-[#06382B] focus:outline-none"
                  >
                    <option>Breakfast & South Indian</option>
                    <option>Chinese</option>
                    <option>Tandoor</option>
                    <option>Continental</option>
                    <option>Indian Main Course</option>
                    <option>Desserts & Beverages</option>
                  </select>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-[#06382B] uppercase">Short Description</label>
                <input 
                  type="text" 
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Fresh ingredients, aromatic spices..."
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-2.5 text-xs text-[#06382B] focus:outline-none focus:ring-1 focus:ring-[#06382B]"
                />
              </div>

              {/* Dish Image Management Section */}
              <div className="space-y-2 pt-1 border-t border-neutral-100">
                <label className="text-[10px] font-bold text-[#06382B] uppercase flex justify-between items-center">
                  <span>Dish Image Options</span>
                  {editingItem && (
                    <button 
                      type="button"
                      onClick={() => handleRemoveImage(editingItem.id)}
                      className="text-red-600 hover:text-red-800 text-[9px] font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" /> Remove Photo
                    </button>
                  )}
                </label>

                {/* Current Image Preview */}
                <div className="flex items-center gap-3 bg-neutral-50 p-2.5 rounded-xl border border-neutral-200">
                  <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 border border-neutral-300">
                    <img 
                      src={formData.customImage || getImageSrc(formData)} 
                      alt="Preview" 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  <div className="flex-1 min-w-0 text-[10px]">
                    <span className="font-bold text-[#06382B] block">Active Preview</span>
                    <span className="text-neutral-400 truncate block">
                      {formData.customImage ? 'Custom Upload / URL' : `Preset (${formData.image})`}
                    </span>
                  </div>
                </div>

                {/* Option 1: File Upload */}
                <div className="space-y-1">
                  <span className="text-[9px] text-neutral-500 font-semibold block">Option A: Upload Image File</span>
                  <label className="flex items-center justify-center gap-2 w-full bg-white border border-dashed border-[#06382B]/40 rounded-xl p-2.5 text-xs font-bold text-[#06382B] cursor-pointer hover:bg-[#06382B]/5 transition-colors">
                    <Upload className="w-4 h-4 text-[#D4AF37]" /> Upload Local Photo
                    <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                  </label>
                </div>

                {/* Option 2: Image URL */}
                <div className="space-y-1">
                  <span className="text-[9px] text-neutral-500 font-semibold block">Option B: Paste Image Web URL</span>
                  <div className="relative">
                    <LinkIcon className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-3" />
                    <input 
                      type="url" 
                      placeholder="https://images.unsplash.com/photo..."
                      value={formData.customImage}
                      onChange={(e) => setFormData({ ...formData, customImage: e.target.value })}
                      className="w-full bg-neutral-50 border border-neutral-200 rounded-xl py-2 pl-9 pr-3 text-xs text-[#06382B] focus:outline-none"
                    />
                  </div>
                </div>

                {/* Option 3: Presets */}
                <div className="space-y-1">
                  <span className="text-[9px] text-neutral-500 font-semibold block">Option C: Select Preset Photo</span>
                  <div className="grid grid-cols-4 gap-1.5">
                    {[
                      { key: 'steak', label: 'Paneer' },
                      { key: 'table', label: 'South' },
                      { key: 'salmon', label: 'Pizza' },
                      { key: 'salad', label: 'Salad' }
                    ].map((p) => (
                      <button
                        key={p.key}
                        type="button"
                        onClick={() => setFormData({ ...formData, image: p.key, customImage: '' })}
                        className={`py-1 px-2 rounded-lg text-[9px] font-bold transition-all border cursor-pointer ${
                          formData.image === p.key && !formData.customImage
                            ? 'bg-[#06382B] text-[#D4AF37] border-[#06382B]'
                            : 'bg-white text-neutral-600 border-neutral-200'
                        }`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>

              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-2 border-t border-neutral-100">
                <button 
                  type="button"
                  onClick={() => {
                    setEditingItem(null);
                    setIsAddingNew(false);
                  }}
                  className="flex-1 bg-neutral-100 text-neutral-700 py-3 rounded-xl font-bold text-xs hover:bg-neutral-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-[2] bg-[#06382B] hover:bg-[#04291F] text-[#D4AF37] py-3 rounded-xl font-bold text-xs shadow-md cursor-pointer border border-[#D4AF37]/30 transition-transform active:scale-95"
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
