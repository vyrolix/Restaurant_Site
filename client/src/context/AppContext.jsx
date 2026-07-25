import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { 
  fetchCloudMenu, pushCloudMenu, 
  fetchCloudOrders, pushCloudOrders, 
  fetchCloudStock, pushCloudStock, 
  fetchCloudImages, pushCloudImages,
  fetchCloudPopular, pushCloudPopular
} from '../Services/cloudSync';

const AppContext = createContext();

// Helper to merge Menu items with Cloud Stock, Cloud Image & Cloud Popular Maps
const applyCloudOverrides = (items, stockMap = {}, imageMap = {}, popularMap = {}) => {
  if (!items || !Array.isArray(items)) return items;

  const hasPopularOverrides = Object.keys(popularMap).length > 0;

  return items.map((item, idx) => {
    const isPop = popularMap[item.id] !== undefined 
      ? popularMap[item.id] 
      : (hasPopularOverrides ? false : idx < 6);

    return {
      ...item,
      inStock: stockMap[item.id] !== undefined ? stockMap[item.id] : item.inStock,
      customImage: imageMap[item.id] !== undefined ? imageMap[item.id] : item.customImage,
      isPopular: isPop
    };
  });
};

// Official K/N Restaurant Menu
export const mockMenuItems = [
  // 1. BREAKFAST & SOUTH INDIAN
  { id: 'bs1', name: 'Idli Sambhar', price: 59, category: 'Breakfast & South Indian', subcategory: 'South Indian', description: 'Soft steamed rice cakes served with hot lentil sambhar and coconut chutney.', image: 'table', isVeg: true, inStock: true },
  { id: 'bs2', name: 'Vada Sambhar', price: 69, category: 'Breakfast & South Indian', subcategory: 'South Indian', description: 'Crispy lentil donuts served with flavorful sambhar.', image: 'table', isVeg: true, inStock: true },
  { id: 'bs3', name: 'Uttapam', price: 69, category: 'Breakfast & South Indian', subcategory: 'South Indian', description: 'Thick savory pancake topped with veggies.', image: 'table', isVeg: true, inStock: true },
  { id: 'bs4', name: 'Plain Dosa', price: 60, category: 'Breakfast & South Indian', subcategory: 'South Indian', description: 'Crispy golden crepe made from fermented rice batter.', image: 'table', isVeg: true, inStock: true },
  { id: 'bs5', name: 'Masala Dosa', price: 79, category: 'Breakfast & South Indian', subcategory: 'South Indian', description: 'Crispy dosa stuffed with spiced potato mash.', image: 'table', isVeg: true, inStock: true },
  { id: 'bs6', name: 'Onion Dosa', price: 89, category: 'Breakfast & South Indian', subcategory: 'South Indian', description: 'Dosa topped with finely chopped crispy onions.', image: 'table', isVeg: true, inStock: true },
  { id: 'bs7', name: 'Rava Dosa', price: 99, category: 'Breakfast & South Indian', subcategory: 'South Indian', description: 'Crispy semolina dosa spiced with black pepper and herbs.', image: 'table', isVeg: true, inStock: true },
  { id: 'bs8', name: 'Corn Dosa', price: 99, category: 'Breakfast & South Indian', subcategory: 'South Indian', description: 'Golden dosa filled with sweet corn and spices.', image: 'table', isVeg: true, inStock: true },
  { id: 'bs9', name: 'Paneer Dosa', price: 110, category: 'Breakfast & South Indian', subcategory: 'South Indian', description: 'Crispy dosa loaded with savory shredded paneer.', image: 'table', isVeg: true, inStock: true },
  { id: 'bs10', name: 'Cheese Dosa', price: 99, category: 'Breakfast & South Indian', subcategory: 'South Indian', description: 'Melted cheese wrapped in a crispy dosa.', image: 'table', isVeg: true, inStock: true },
  { id: 'bs11', name: 'Schezwan Dosa', price: 89, category: 'Breakfast & South Indian', subcategory: 'South Indian', description: 'Fusion dosa smeared with spicy Schezwan sauce.', image: 'table', isVeg: true, inStock: true },
  { id: 'bs12', name: 'Paneer & Butter Dosa', price: 119, category: 'Breakfast & South Indian', subcategory: 'South Indian', description: 'Rich butter dosa filled with cottage cheese.', image: 'table', isVeg: true, inStock: true },
  { id: 'bs13', name: 'Sabudana Vada', price: 99, category: 'Breakfast & South Indian', subcategory: 'South Indian', description: 'Deep fried sago tapioca patties with peanuts.', image: 'table', isVeg: true, inStock: true },
  { id: 'bs14', name: 'Chole Bhature', price: 119, category: 'Breakfast & South Indian', subcategory: 'Indian Breakfast', description: 'Fluffy fried bhaturas served with spicy chickpea curry.', image: 'table', isVeg: true, inStock: true },
  { id: 'bs15', name: 'Poha', price: 49, category: 'Breakfast & South Indian', subcategory: 'Indian Breakfast', description: 'Flattened rice cooked with mustard seeds, curry leaves, and peanuts.', image: 'table', isVeg: true, inStock: true },
  { id: 'bs16', name: 'Mix Pakoda', price: 80, category: 'Breakfast & South Indian', subcategory: 'Indian Breakfast', description: 'Assorted vegetable fritters fried to crisp golden perfection.', image: 'table', isVeg: true, inStock: true },
  { id: 'bs17', name: 'Paneer Pakoda', price: 99, category: 'Breakfast & South Indian', subcategory: 'Indian Breakfast', description: 'Cottage cheese cubes dipped in spiced gram flour batter.', image: 'table', isVeg: true, inStock: true },
  { id: 'bs18', name: 'Onion Pakoda', price: 69, category: 'Breakfast & South Indian', subcategory: 'Indian Breakfast', description: 'Crispy sliced onion fritters.', image: 'table', isVeg: true, inStock: true },
  { id: 'bs19', name: 'Plain Paratha', price: 49, category: 'Breakfast & South Indian', subcategory: 'Paratha', description: 'Layered whole wheat flatbread baked on tawa.', image: 'table', isVeg: true, inStock: true },
  { id: 'bs20', name: 'Aloo Paratha', price: 69, category: 'Breakfast & South Indian', subcategory: 'Paratha', description: 'Stuffed paratha filled with spiced mashed potatoes.', image: 'table', isVeg: true, inStock: true },
  { id: 'bs21', name: 'Paneer Paratha', price: 89, category: 'Breakfast & South Indian', subcategory: 'Paratha', description: 'Stuffed paratha filled with savory cottage cheese.', image: 'table', isVeg: true, inStock: true },
  { id: 'bs22', name: 'Gobhi Paratha', price: 89, category: 'Breakfast & South Indian', subcategory: 'Paratha', description: 'Flatbread stuffed with spiced grated cauliflower.', image: 'table', isVeg: true, inStock: true },
  { id: 'bs23', name: 'Mix Paratha', price: 89, category: 'Breakfast & South Indian', subcategory: 'Paratha', description: 'Multi-veggie stuffed paratha.', image: 'table', isVeg: true, inStock: true },
  { id: 'bs24', name: 'Onion Paratha', price: 59, category: 'Breakfast & South Indian', subcategory: 'Paratha', description: 'Crispy flatbread stuffed with seasoned onions.', image: 'table', isVeg: true, inStock: true },
  { id: 'bs25', name: 'Adrak Chai', price: 39, category: 'Breakfast & South Indian', subcategory: 'Tea / Coffee', description: 'Hot brewed tea infused with fresh ginger.', image: 'table', isVeg: true, inStock: true },
  { id: 'bs26', name: 'Masala Chai', price: 49, category: 'Breakfast & South Indian', subcategory: 'Tea / Coffee', description: 'Traditional Indian tea spiced with aromatic herbs.', image: 'table', isVeg: true, inStock: true },
  { id: 'bs27', name: 'Plain Chai', price: 29, category: 'Breakfast & South Indian', subcategory: 'Tea / Coffee', description: 'Classic hot milk tea.', image: 'table', isVeg: true, inStock: true },
  { id: 'bs28', name: 'Elaichi Chai', price: 49, category: 'Breakfast & South Indian', subcategory: 'Tea / Coffee', description: 'Fragrant tea infused with green cardamom.', image: 'table', isVeg: true, inStock: true },
  { id: 'bs29', name: 'Lemon Tea', price: 29, category: 'Breakfast & South Indian', subcategory: 'Tea / Coffee', description: 'Refreshing black tea with fresh lemon juice.', image: 'table', isVeg: true, inStock: true },
  { id: 'bs30', name: 'Black Tea', price: 29, category: 'Breakfast & South Indian', subcategory: 'Tea / Coffee', description: 'Pure brewed black tea.', image: 'table', isVeg: true, inStock: true },
  { id: 'bs31', name: 'Green Tea', price: 69, category: 'Breakfast & South Indian', subcategory: 'Tea / Coffee', description: 'Healthy antioxidant rich green tea.', image: 'table', isVeg: true, inStock: true },
  { id: 'bs32', name: 'Black Coffee', price: 39, category: 'Breakfast & South Indian', subcategory: 'Tea / Coffee', description: 'Strong roasted black coffee.', image: 'table', isVeg: true, inStock: true },
  { id: 'bs33', name: 'Hot Coffee', price: 45, category: 'Breakfast & South Indian', subcategory: 'Tea / Coffee', description: 'Creamy hot brewed espresso milk coffee.', image: 'table', isVeg: true, inStock: true },

  // 2. WOW CHINESE
  { id: 'ch1', name: 'Paneer Chilli', price: 249, category: 'Chinese', subcategory: 'Starters', description: 'Crispy paneer cubes tossed in garlic soy chilli sauce.', image: 'table', isVeg: true, inStock: true },
  { id: 'ch2', name: 'Paneer Coriander Chilli', price: 249, category: 'Chinese', subcategory: 'Starters', description: 'Cottage cheese tossed with fresh cilantro & green chillies.', image: 'table', isVeg: true, inStock: true },
  { id: 'ch3', name: 'Spring Roll', price: 249, category: 'Chinese', subcategory: 'Starters', description: 'Crispy vegetable rolls served with sweet chilli sauce.', image: 'table', isVeg: true, inStock: true },
  { id: 'ch4', name: 'Gobhi Chilli', price: 199, category: 'Chinese', subcategory: 'Starters', description: 'Crispy cauliflower tossed in spicy soya sauce.', image: 'table', isVeg: true, inStock: true },
  { id: 'ch5', name: 'Veg Manchurian', price: 219, category: 'Chinese', subcategory: 'Starters', description: 'Vegetable dumplings in tangy Manchurian gravy.', image: 'table', isVeg: true, inStock: true },
  { id: 'ch6', name: 'Veg Crispy', price: 239, category: 'Chinese', subcategory: 'Starters', description: 'Assorted crispy vegetables tossed in spicy red sauce.', image: 'table', isVeg: true, inStock: true },
  { id: 'ch7', name: 'Crispy Corn', price: 249, category: 'Chinese', subcategory: 'Starters', description: 'Deep fried sweet corn tossed with capsicum and pepper.', image: 'table', isVeg: true, inStock: true },
  { id: 'ch8', name: 'Honey Chilli Potato', price: 219, category: 'Chinese', subcategory: 'Starters', description: 'Crispy potato fingers glazed with honey and chilli sauce.', image: 'table', isVeg: true, inStock: true },
  { id: 'ch9', name: 'Soya Chilli', price: 169, category: 'Chinese', subcategory: 'Starters', description: 'High-protein soya chunks tossed in Chinese gravy.', image: 'table', isVeg: true, inStock: true },
  { id: 'ch10', name: 'Veg Lolipop', price: 189, category: 'Chinese', subcategory: 'Starters', description: 'Spiced vegetable drumsticks served crispy.', image: 'table', isVeg: true, inStock: true },
  { id: 'ch11', name: 'Veg Kothe', price: 219, category: 'Chinese', subcategory: 'Starters', description: 'Pan-fried veg balls in spicy garlic coriander gravy.', image: 'table', isVeg: true, inStock: true },
  { id: 'ch12', name: 'Corn & Salted Pepper', price: 249, category: 'Chinese', subcategory: 'Starters', description: 'Sweet corn tossed with crushed sea salt and black pepper.', image: 'table', isVeg: true, inStock: true },
  { id: 'ch13', name: 'Veg Manchow Soup', price: 129, category: 'Chinese', subcategory: 'Soup', description: 'Spicy garlic soup garnished with crispy fried noodles.', image: 'table', isVeg: true, inStock: true },
  { id: 'ch14', name: 'Hot & Sour Soup', price: 135, category: 'Chinese', subcategory: 'Soup', description: 'Tangy and spicy soup packed with mushrooms & bamboo shoots.', image: 'table', isVeg: true, inStock: true },
  { id: 'ch15', name: 'Cream of Mushroom Soup', price: 199, category: 'Chinese', subcategory: 'Soup', description: 'Rich velvety soup made with wild mushrooms and cream.', image: 'table', isVeg: true, inStock: true },
  { id: 'ch16', name: 'Cream of Tomato Soup', price: 149, category: 'Chinese', subcategory: 'Soup', description: 'Classic ripe tomato soup served with golden croutons.', image: 'table', isVeg: true, inStock: true },
  { id: 'ch17', name: 'Veg Clear Soup', price: 109, category: 'Chinese', subcategory: 'Soup', description: 'Light clear vegetable broth infused with ginger.', image: 'table', isVeg: true, inStock: true },
  { id: 'ch18', name: 'Lemon Coriander Soup', price: 119, category: 'Chinese', subcategory: 'Soup', description: 'Zesty lemon soup with fresh cilantro.', image: 'table', isVeg: true, inStock: true },
  { id: 'ch19', name: 'Broccoli Almond Soup', price: 169, category: 'Chinese', subcategory: 'Soup', description: 'Healthy broccoli cream soup topped with toasted almonds.', image: 'table', isVeg: true, inStock: true },
  { id: 'ch20', name: 'Veg Noodles', price: 149, category: 'Chinese', subcategory: 'Noodles', description: 'Classic stir-fried noodles with julienned vegetables.', image: 'table', isVeg: true, inStock: true },
  { id: 'ch21', name: 'Hakka Noodles', price: 199, category: 'Chinese', subcategory: 'Noodles', description: 'Indo-Chinese style wok-tossed noodles.', image: 'table', isVeg: true, inStock: true },
  { id: 'ch22', name: 'Singapuri Noodles', price: 219, category: 'Chinese', subcategory: 'Noodles', description: 'Mildly yellow curry spiced noodles with veggies.', image: 'table', isVeg: true, inStock: true },
  { id: 'ch23', name: 'Schezwan Noodles', price: 179, category: 'Chinese', subcategory: 'Noodles', description: 'Spicy noodles tossed in fiery Schezwan red pepper sauce.', image: 'table', isVeg: true, inStock: true },
  { id: 'ch24', name: 'Chilli Garlic Noodles', price: 219, category: 'Chinese', subcategory: 'Noodles', description: 'Noodles flavored with toasted garlic and red chillies.', image: 'table', isVeg: true, inStock: true },
  { id: 'ch25', name: 'Veg Fried Rice', price: 199, category: 'Chinese', subcategory: 'Chinese Rice', description: 'Aromatic fried rice with diced vegetables and soy.', image: 'table', isVeg: true, inStock: true },
  { id: 'ch26', name: 'Schezwan Fried Rice', price: 219, category: 'Chinese', subcategory: 'Chinese Rice', description: 'Fried rice tossed in spicy Schezwan sauce.', image: 'table', isVeg: true, inStock: true },
  { id: 'ch27', name: 'Manchurian Fried Rice', price: 239, category: 'Chinese', subcategory: 'Chinese Rice', description: 'Combination of Manchurian gravy and fried rice.', image: 'table', isVeg: true, inStock: true },
  { id: 'ch28', name: 'Paneer Fried Rice', price: 269, category: 'Chinese', subcategory: 'Chinese Rice', description: 'Fried rice loaded with fried cottage cheese cubes.', image: 'table', isVeg: true, inStock: true },
  { id: 'ch29', name: 'Sun Garlic Fried Rice', price: 229, category: 'Chinese', subcategory: 'Chinese Rice', description: 'Fried rice infused with roasted golden garlic.', image: 'table', isVeg: true, inStock: true },
  { id: 'ch30', name: 'Lemon Fried Rice', price: 199, category: 'Chinese', subcategory: 'Chinese Rice', description: 'Refreshing zesty lemon flavored rice.', image: 'table', isVeg: true, inStock: true },

  // 3. TANDOOR
  { id: 'tn1', name: 'Hara Bhara Kabab', price: 230, category: 'Tandoor', subcategory: 'Starters', description: 'Pan-fried spinach, green peas, and potato patties.', image: 'table', isVeg: true, inStock: true },
  { id: 'tn2', name: 'Dahi Kabab', price: 239, category: 'Tandoor', subcategory: 'Starters', description: 'Crispy kababs made from hung curd and spices.', image: 'table', isVeg: true, inStock: true },
  { id: 'tn3', name: 'Paneer Afgani', price: 320, category: 'Tandoor', subcategory: 'Starters', description: 'Creamy cashew marinated tandoori paneer tikka.', image: 'table', isVeg: true, inStock: true },
  { id: 'tn4', name: 'Corn Kabab', price: 280, category: 'Tandoor', subcategory: 'Starters', description: 'Crispy golden sweet corn patties.', image: 'table', isVeg: true, inStock: true },
  { id: 'tn5', name: 'Veg Navratan Seekh', price: 270, category: 'Tandoor', subcategory: 'Starters', description: 'Minced vegetable seekh kabab grilled on skewers.', image: 'table', isVeg: true, inStock: true },
  { id: 'tn6', name: 'Beetroot Kabab', price: 249, category: 'Tandoor', subcategory: 'Starters', description: 'Nutritious roasted beetroot patties with herbs.', image: 'table', isVeg: true, inStock: true },
  { id: 'tn7', name: 'Stuffed Beetroot Kabab', price: 269, category: 'Tandoor', subcategory: 'Starters', description: 'Beetroot kabab stuffed with cream cheese.', image: 'table', isVeg: true, inStock: true },
  { id: 'tn8', name: 'Soya Chaap Tikka', price: 220, category: 'Tandoor', subcategory: 'Starters', description: 'Tandoori marinated soya chaap grilled over coals.', image: 'table', isVeg: true, inStock: true },
  { id: 'tn9', name: 'Stuffed Mushroom', price: 280, category: 'Tandoor', subcategory: 'Starters', description: 'Button mushrooms stuffed with spiced cottage cheese.', image: 'table', isVeg: true, inStock: true },
  { id: 'tn10', name: 'Dahi Shole', price: 299, category: 'Tandoor', subcategory: 'Starters', description: 'Crispy bread rolls filled with seasoned hung curd.', image: 'table', isVeg: true, inStock: true },
  { id: 'tn11', name: 'Aloo Nazakat', price: 299, category: 'Tandoor', subcategory: 'Starters', description: 'Stuffed tandoori roasted potatoes.', image: 'table', isVeg: true, inStock: true },
  { id: 'tn12', name: 'Tandoori Broccoli', price: 199, category: 'Tandoor', subcategory: 'Starters', description: 'Marinated broccoli florets roasted in clay oven.', image: 'table', isVeg: true, inStock: true },
  { id: 'tn13', name: 'Veg Platter', price: 420, category: 'Tandoor', subcategory: 'Starters', description: 'Assorted platter of Paneer Tikka, Kababs, and Soya Chaap.', image: 'table', isVeg: true, inStock: true },
  { id: 'tn14', name: 'Paneer Tikka (Achari/Lehsuni/Kasturi)', price: 299, category: 'Tandoor', subcategory: 'Starters', description: 'Classic tandoori paneer tikka available in Achari, Garlic, or Fenugreek flavor.', image: 'steak', isVeg: true, inStock: true },
  { id: 'tn15', name: 'Tandoori Roti Plain', price: 20, category: 'Tandoor', subcategory: 'Roti & Naan', description: 'Whole wheat flatbread baked in tandoor.', image: 'table', isVeg: true, inStock: true },
  { id: 'tn16', name: 'Tandoori Roti Butter', price: 25, category: 'Tandoor', subcategory: 'Roti & Naan', description: 'Clay oven bread brushed with fresh butter.', image: 'table', isVeg: true, inStock: true },
  { id: 'tn17', name: 'Missi Roti', price: 49, category: 'Tandoor', subcategory: 'Roti & Naan', description: 'Gram flour flatbread seasoned with spices.', image: 'table', isVeg: true, inStock: true },
  { id: 'tn18', name: 'Khamiri Roti', price: 59, category: 'Tandoor', subcategory: 'Roti & Naan', description: 'Traditional Mughal style leavened soft bread.', image: 'table', isVeg: true, inStock: true },
  { id: 'tn19', name: 'Roti Basket', price: 149, category: 'Tandoor', subcategory: 'Roti & Naan', description: 'Assorted basket of Butter Roti, Naan, and Laccha Paratha.', image: 'table', isVeg: true, inStock: true },
  { id: 'tn20', name: 'Laccha Paratha', price: 49, category: 'Tandoor', subcategory: 'Roti & Naan', description: 'Multi-layered crispy tandoori paratha.', image: 'table', isVeg: true, inStock: true },
  { id: 'tn21', name: 'Stuffed Kulcha', price: 79, category: 'Tandoor', subcategory: 'Roti & Naan', description: 'Soft bread stuffed with potatoes and spices.', image: 'table', isVeg: true, inStock: true },
  { id: 'tn22', name: 'Kashmiri Naan', price: 119, category: 'Tandoor', subcategory: 'Roti & Naan', description: 'Sweet naan topped with dry fruits and nuts.', image: 'table', isVeg: true, inStock: true },
  { id: 'tn23', name: 'Plain Naan', price: 49, category: 'Tandoor', subcategory: 'Roti & Naan', description: 'Classic fine flour bread baked in tandoor.', image: 'table', isVeg: true, inStock: true },
  { id: 'tn24', name: 'Butter Naan', price: 59, category: 'Tandoor', subcategory: 'Roti & Naan', description: 'Soft naan brushed with amul butter.', image: 'table', isVeg: true, inStock: true },
  { id: 'tn25', name: 'Stuffed Naan', price: 79, category: 'Tandoor', subcategory: 'Roti & Naan', description: 'Naan filled with seasoned vegetables.', image: 'table', isVeg: true, inStock: true },
  { id: 'tn26', name: 'Garlic Naan', price: 79, category: 'Tandoor', subcategory: 'Roti & Naan', description: 'Naan topped with chopped garlic and coriander.', image: 'table', isVeg: true, inStock: true },
  { id: 'tn27', name: 'Cheese Naan', price: 89, category: 'Tandoor', subcategory: 'Roti & Naan', description: 'Naan stuffed with gooey melted cheese.', image: 'table', isVeg: true, inStock: true },

  // 4. CONTINENTAL
  { id: 'cnt1', name: 'Ring Onion', price: 199, category: 'Continental', subcategory: 'Starters', description: 'Golden batter-fried onion rings served with mayo Dip.', image: 'table', isVeg: true, inStock: true },
  { id: 'cnt2', name: 'Corn Cheese Ball', price: 229, category: 'Continental', subcategory: 'Starters', description: 'Crispy fried balls filled with cheese and sweet corn.', image: 'table', isVeg: true, inStock: true },
  { id: 'cnt3', name: 'Nutty Roll', price: 149, category: 'Continental', subcategory: 'Starters', description: 'Crispy rolls stuffed with crushed nuts and veggies.', image: 'table', isVeg: true, inStock: true },
  { id: 'cnt4', name: 'Cigar Roll', price: 199, category: 'Continental', subcategory: 'Starters', description: 'Thin crispy rolls stuffed with cheesy vegetables.', image: 'table', isVeg: true, inStock: true },
  { id: 'cnt5', name: 'Cheese Chilli Toast', price: 199, category: 'Continental', subcategory: 'Starters', description: 'Toasted bread topped with green chillies and melted cheese.', image: 'table', isVeg: true, inStock: true },
  { id: 'cnt6', name: 'Quesadilla', price: 219, category: 'Continental', subcategory: 'Starters', description: 'Mexican tortilla stuffed with melted cheese and veggies.', image: 'table', isVeg: true, inStock: true },
  { id: 'cnt7', name: 'Loaded Nachos', price: 189, category: 'Continental', subcategory: 'Starters', description: 'Crispy tortilla chips topped with cheese sauce and salsa.', image: 'table', isVeg: true, inStock: true },
  { id: 'cnt8', name: 'Russian Salad', price: 179, category: 'Continental', subcategory: 'Salads', description: 'Diced boiled veggies mixed in rich creamy mayonnaise.', image: 'salad', isVeg: true, inStock: true },
  { id: 'cnt9', name: 'Greek Salad', price: 249, category: 'Continental', subcategory: 'Salads', description: 'Fresh cucumbers, tomatoes, olives, and feta cheese with olive oil.', image: 'salad', isVeg: true, inStock: true },
  { id: 'cnt10', name: 'Green Salad', price: 99, category: 'Continental', subcategory: 'Salads', description: 'Sliced fresh garden vegetables.', image: 'salad', isVeg: true, inStock: true },
  { id: 'cnt11', name: 'Cucumber Salad', price: 129, category: 'Continental', subcategory: 'Salads', description: 'Fresh sliced cucumbers tossed with lemon herbs.', image: 'salad', isVeg: true, inStock: true },
  { id: 'cnt12', name: 'Beans Sprout Salad', price: 199, category: 'Continental', subcategory: 'Salads', description: 'Healthy sprouted beans tossed with onion and lemon.', image: 'salad', isVeg: true, inStock: true },
  { id: 'cnt13', name: 'Watermelon Feta Salad', price: 219, category: 'Continental', subcategory: 'Salads', description: 'Juicy watermelon cubes with mint and feta cheese.', image: 'salad', isVeg: true, inStock: true },
  { id: 'cnt14', name: 'Alfredo Pasta (White Sauce)', price: 249, category: 'Continental', subcategory: 'Pasta', description: 'Penne pasta in rich creamy parmesan garlic sauce.', image: 'table', isVeg: true, inStock: true },
  { id: 'cnt15', name: 'Creamy Pesto Pasta', price: 249, category: 'Continental', subcategory: 'Pasta', description: 'Pasta tossed in aromatic basil pesto cream.', image: 'table', isVeg: true, inStock: true },
  { id: 'cnt16', name: 'Pomodoro Penne (Red Sauce)', price: 239, category: 'Continental', subcategory: 'Pasta', description: 'Pasta in spicy Italian tomato and basil sauce.', image: 'table', isVeg: true, inStock: true },
  { id: 'cnt17', name: 'Arabita Pasta', price: 239, category: 'Continental', subcategory: 'Pasta', description: 'Spicy red sauce pasta with chilli flakes and garlic.', image: 'table', isVeg: true, inStock: true },
  { id: 'cnt18', name: 'Agli-O-Lio Pasta', price: 279, category: 'Continental', subcategory: 'Pasta', description: 'Spaghetti tossed in olive oil, garlic, and dried chillies.', image: 'table', isVeg: true, inStock: true },
  { id: 'cnt19', name: 'Mac in Cheese', price: 309, category: 'Continental', subcategory: 'Pasta', description: 'Baked macaroni pasta enveloped in cheddar cheese sauce.', image: 'table', isVeg: true, inStock: true },
  { id: 'cnt20', name: 'Red White Melon (Pink Sauce)', price: 289, category: 'Continental', subcategory: 'Pasta', description: 'Combination of white cream sauce and tomato red sauce.', image: 'table', isVeg: true, inStock: true },
  { id: 'cnt21', name: 'Cottage Cheese Burger', price: 159, category: 'Continental', subcategory: 'Burgers', description: 'Grilled paneer patty burger with lettuce and mayo.', image: 'table', isVeg: true, inStock: true },
  { id: 'cnt22', name: 'Mix Cheese Burger', price: 139, category: 'Continental', subcategory: 'Burgers', description: 'Crispy veggie patty with double cheese slice.', image: 'table', isVeg: true, inStock: true },
  { id: 'cnt23', name: 'Corn & Chick Peas Burger', price: 179, category: 'Continental', subcategory: 'Burgers', description: 'Nutritious chickpea and sweet corn patty burger.', image: 'table', isVeg: true, inStock: true },
  { id: 'cnt24', name: 'Veg Burger', price: 89, category: 'Continental', subcategory: 'Burgers', description: 'Classic vegetable patty burger.', image: 'table', isVeg: true, inStock: true },
  { id: 'cnt25', name: 'Loaded Burger', price: 99, category: 'Continental', subcategory: 'Burgers', description: 'Loaded with extra cheese sauce and crispy onion rings.', image: 'table', isVeg: true, inStock: true },
  { id: 'cnt26', name: 'Spicy Paneer Tikka Pizza', price: 199, category: 'Continental', subcategory: 'Pizza', description: 'Topped with tandoori paneer tikka, onions, and capsicum.', image: 'table', isVeg: true, inStock: true },
  { id: 'cnt27', name: 'Farmhouse Pizza', price: 179, category: 'Continental', subcategory: 'Pizza', description: 'Loaded with capsicum, onion, tomato, and mushrooms.', image: 'table', isVeg: true, inStock: true },
  { id: 'cnt28', name: 'Mexican Green Wave Pizza', price: 189, category: 'Continental', subcategory: 'Pizza', description: 'Spicy jalapenos, corn, onions, and Mexican herbs.', image: 'table', isVeg: true, inStock: true },
  { id: 'cnt29', name: 'Corn & Spinach Pizza', price: 159, category: 'Continental', subcategory: 'Pizza', description: 'Creamy spinach and sweet corn topping.', image: 'table', isVeg: true, inStock: true },
  { id: 'cnt30', name: 'Angry Bird Pizza', price: 249, category: 'Continental', subcategory: 'Pizza', description: 'Extra spicy red pepper and cheese delight.', image: 'table', isVeg: true, inStock: true },
  { id: 'cnt31', name: 'Spicy Jalapeños Style Pizza', price: 269, category: 'Continental', subcategory: 'Pizza', description: 'Loaded with spicy jalapeno slices and mozzarella.', image: 'table', isVeg: true, inStock: true },
  { id: 'cnt32', name: 'Peri Peri Pizza', price: 169, category: 'Continental', subcategory: 'Pizza', description: 'Zesty peri peri spiced vegetable pizza.', image: 'table', isVeg: true, inStock: true },
  { id: 'cnt33', name: 'K/N Special Sandwich', price: 179, category: 'Continental', subcategory: 'Sandwiches', description: 'Chef signature multi-layer grilled sandwich.', image: 'table', isVeg: true, inStock: true },
  { id: 'cnt34', name: 'Paneer Tikka Sandwich', price: 139, category: 'Continental', subcategory: 'Sandwiches', description: 'Grilled sandwich stuffed with spiced paneer tikka.', image: 'table', isVeg: true, inStock: true },
  { id: 'cnt35', name: 'Veg Green Sandwich', price: 119, category: 'Continental', subcategory: 'Sandwiches', description: 'Fresh cucumber, tomato, and mint chutney sandwich.', image: 'table', isVeg: true, inStock: true },
  { id: 'cnt36', name: 'Cheese Grill Sandwich', price: 149, category: 'Continental', subcategory: 'Sandwiches', description: 'Triple layered cheese grilled sandwich.', image: 'table', isVeg: true, inStock: true },
  { id: 'cnt37', name: 'Pizza Sandwich', price: 169, category: 'Continental', subcategory: 'Sandwiches', description: 'Sandwich stuffed with pizza toppings and mozzarella.', image: 'table', isVeg: true, inStock: true },

  // 5. INDIAN MAIN COURSE
  { id: 'in1', name: 'Paneer Masala (Kadhai/Kolhapuri)', price: 290, category: 'Indian Main Course', subcategory: 'Paneer Special', description: 'Rich gravy paneer choice of Chatpata, Kadhai, Mutter, or Kolhapuri style.', image: 'steak', isVeg: true, inStock: true },
  { id: 'in2', name: 'Paneer Creamy (Butter Masala/Lababdar)', price: 310, category: 'Indian Main Course', subcategory: 'Paneer Special', description: 'Luscious cashew gravy paneer (Butter Masala, Lababdar, Shahi, Laziz).', image: 'steak', isVeg: true, inStock: true },
  { id: 'in3', name: 'Fruity / Dryfruit Paneer (Korma/Kaju)', price: 330, category: 'Indian Main Course', subcategory: 'Paneer Special', description: 'Mughlai style sweet nut gravy paneer.', image: 'steak', isVeg: true, inStock: true },
  { id: 'in4', name: 'Stuffing Paneer (Pasanda/Pesawari)', price: 360, category: 'Indian Main Course', subcategory: 'Paneer Special', description: 'Stuffed cottage cheese triangles in rich gravy.', image: 'steak', isVeg: true, inStock: true },
  { id: 'in5', name: 'Paneer Special (Palak/Do Pyaaza/Bhurji)', price: 285, category: 'Indian Main Course', subcategory: 'Paneer Special', description: 'Paneer cooked in spinach, onion, or scrambled Bhurji style.', image: 'steak', isVeg: true, inStock: true },
  { id: 'in6', name: 'Spicy / Tadka Paneer (Angara/Toofani)', price: 329, category: 'Indian Main Course', subcategory: 'Paneer Special', description: 'Smoky spiced paneer cooked over high flame.', image: 'steak', isVeg: true, inStock: true },
  { id: 'in7', name: 'Kofta Delicious (Malai/Paneer Kofta)', price: 299, category: 'Indian Main Course', subcategory: 'Veg Main Course', description: 'Soft paneer dumpling balls in rich gravy.', image: 'table', isVeg: true, inStock: true },
  { id: 'in8', name: 'Seasonal Veg (Mix Veg/Aloo Gobhi)', price: 239, category: 'Indian Main Course', subcategory: 'Veg Main Course', description: 'Fresh seasonal vegetables cooked in Indian spices.', image: 'table', isVeg: true, inStock: true },
  { id: 'in9', name: 'Veg Handi Special', price: 229, category: 'Indian Main Course', subcategory: 'Veg Main Course', description: 'Assorted veggies cooked in a clay pot clay handi.', image: 'table', isVeg: true, inStock: true },
  { id: 'in10', name: 'Veg Stuffed Options (Dum Aloo/Palak)', price: 279, category: 'Indian Main Course', subcategory: 'Veg Main Course', description: 'Stuffed capsicum, stuffed tomato, or Kashmiri Dum Aloo.', image: 'table', isVeg: true, inStock: true },
  { id: 'in11', name: 'Desi Ghee Dal Tadka', price: 239, category: 'Indian Main Course', subcategory: 'Taste of Dal', description: 'Yellow lentils tempered with aromatic spices and pure desi ghee.', image: 'table', isVeg: true, inStock: true },
  { id: 'in12', name: 'Dal Fry', price: 219, category: 'Indian Main Course', subcategory: 'Taste of Dal', description: 'Yellow arhar dal fried with onions and tomatoes.', image: 'table', isVeg: true, inStock: true },
  { id: 'in13', name: 'Dal Makhni', price: 249, category: 'Indian Main Course', subcategory: 'Taste of Dal', description: 'Black lentils slow cooked overnight with cream and butter.', image: 'table', isVeg: true, inStock: true },
  { id: 'in14', name: 'Lehsuni Dal Palak', price: 229, category: 'Indian Main Course', subcategory: 'Taste of Dal', description: 'Lentils cooked with garlic and fresh spinach.', image: 'table', isVeg: true, inStock: true },
  { id: 'in15', name: 'Dal Khichdi (Butter)', price: 180, category: 'Indian Main Course', subcategory: 'Taste of Dal', description: 'Comfort food made of rice and lentils with butter.', image: 'table', isVeg: true, inStock: true },
  { id: 'in16', name: 'Veg Raita', price: 50, category: 'Indian Main Course', subcategory: 'Raita', description: 'Chilled curd with onion, tomato, and cucumber.', image: 'table', isVeg: true, inStock: true },
  { id: 'in17', name: 'Fruit Raita', price: 89, category: 'Indian Main Course', subcategory: 'Raita', description: 'Sweet yogurt mixed with pineapple and grapes.', image: 'table', isVeg: true, inStock: true },
  { id: 'in18', name: 'Boondi Raita', price: 70, category: 'Indian Main Course', subcategory: 'Raita', description: 'Spiced yogurt mixed with crispy chickpea boondi.', image: 'table', isVeg: true, inStock: true },
  { id: 'in19', name: 'Jeera Rice', price: 210, category: 'Indian Main Course', subcategory: 'Rice & Biryani', description: 'Basmati rice tempered with cumin seeds.', image: 'table', isVeg: true, inStock: true },
  { id: 'in20', name: 'Veg Pulao', price: 230, category: 'Indian Main Course', subcategory: 'Rice & Biryani', description: 'Basmati rice cooked with fresh green vegetables.', image: 'table', isVeg: true, inStock: true },
  { id: 'in21', name: 'Kashmiri Pulao', price: 310, category: 'Indian Main Course', subcategory: 'Rice & Biryani', description: 'Saffron rice cooked with sweet fruits and nuts.', image: 'table', isVeg: true, inStock: true },
  { id: 'in22', name: 'Veg-Handi Biryani', price: 249, category: 'Indian Main Course', subcategory: 'Rice & Biryani', description: 'Layered dum biryani with vegetables and mint.', image: 'table', isVeg: true, inStock: true },
  { id: 'in23', name: 'Paneer Tikka Biryani', price: 289, category: 'Indian Main Course', subcategory: 'Rice & Biryani', description: 'Fragrant basmati rice layered with tandoori paneer tikka.', image: 'table', isVeg: true, inStock: true },
  { id: 'in24', name: 'Veg Hyderabadi Biryani', price: 279, category: 'Indian Main Course', subcategory: 'Rice & Biryani', description: 'Spicy Hyderabadi style vegetable biryani.', image: 'table', isVeg: true, inStock: true },

  // 6. DESSERTS & BEVERAGES
  { id: 'db1', name: 'Mastani Shake', price: 180, category: 'Desserts & Beverages', subcategory: 'Shakes', description: 'Thick mango ice-cream shake topped with dry fruits.', image: 'table', isVeg: true, inStock: true },
  { id: 'db2', name: 'Mango Shake', price: 170, category: 'Desserts & Beverages', subcategory: 'Shakes', description: 'Fresh Alphonso mango milk shake.', image: 'table', isVeg: true, inStock: true },
  { id: 'db3', name: 'Brownie Shake', price: 160, category: 'Desserts & Beverages', subcategory: 'Shakes', description: 'Chocolate shake blended with chocolate brownie pieces.', image: 'table', isVeg: true, inStock: true },
  { id: 'db4', name: 'Dry Fruit Shake', price: 210, category: 'Desserts & Beverages', subcategory: 'Shakes', description: 'Rich shake made with almonds, cashews, and pistachios.', image: 'table', isVeg: true, inStock: true },
  { id: 'db5', name: 'Nutella Shake', price: 170, category: 'Desserts & Beverages', subcategory: 'Shakes', description: 'Creamy hazelnut Nutella chocolate shake.', image: 'table', isVeg: true, inStock: true },
  { id: 'db6', name: 'Oreo Shake', price: 190, category: 'Desserts & Beverages', subcategory: 'Shakes', description: 'Chilled milk shake blended with Oreo cookies.', image: 'table', isVeg: true, inStock: true },
  { id: 'db7', name: 'Kitkat Shake', price: 190, category: 'Desserts & Beverages', subcategory: 'Shakes', description: 'Delicious shake blended with crispy Kitkat bars.', image: 'table', isVeg: true, inStock: true },
  { id: 'db8', name: 'Cold Coffee with Ice-Cream', price: 150, category: 'Desserts & Beverages', subcategory: 'Shakes', description: 'Chilled brewed coffee topped with vanilla scoop.', image: 'table', isVeg: true, inStock: true },
  { id: 'db9', name: 'Virgin Mojito', price: 129, category: 'Desserts & Beverages', subcategory: 'Mocktails', description: 'Refreshing lime and mint cooler with sparkling soda.', image: 'table', isVeg: true, inStock: true },
  { id: 'db10', name: 'Blue Logan', price: 139, category: 'Desserts & Beverages', subcategory: 'Mocktails', description: 'Blue curacao mocktail with lemon and soda.', image: 'table', isVeg: true, inStock: true },
  { id: 'db11', name: 'Peena Colada', price: 149, category: 'Desserts & Beverages', subcategory: 'Mocktails', description: 'Tropical pineapple and coconut cream cooler.', image: 'table', isVeg: true, inStock: true },
  { id: 'db12', name: 'Fruit Punch', price: 149, category: 'Desserts & Beverages', subcategory: 'Mocktails', description: 'Blend of fruit juices topped with vanilla ice cream.', image: 'table', isVeg: true, inStock: true },
  { id: 'db13', name: 'Fresh Lime Soda', price: 119, category: 'Desserts & Beverages', subcategory: 'Mocktails', description: 'Fizzy lemon soda served sweet or salted.', image: 'table', isVeg: true, inStock: true },
  { id: 'db14', name: 'Vanilla Ice-Cream', price: 90, category: 'Desserts & Beverages', subcategory: 'Desserts', description: 'Classic vanilla bean scoop.', image: 'table', isVeg: true, inStock: true },
  { id: 'db15', name: 'Chocolate Ice-Cream', price: 110, category: 'Desserts & Beverages', subcategory: 'Desserts', description: 'Rich dark chocolate scoop.', image: 'table', isVeg: true, inStock: true },
  { id: 'db16', name: 'Gulab Jamun (2 Pcs)', price: 80, category: 'Desserts & Beverages', subcategory: 'Desserts', description: 'Warm fried milk dumplings soaked in sugar syrup.', image: 'table', isVeg: true, inStock: true },
  { id: 'db17', name: 'White Rasogulla (2 Pcs)', price: 90, category: 'Desserts & Beverages', subcategory: 'Desserts', description: 'Soft spongy cottage cheese balls in light syrup.', image: 'table', isVeg: true, inStock: true },
  { id: 'db18', name: 'Gajar Halwa', price: 85, category: 'Desserts & Beverages', subcategory: 'Desserts', description: 'Traditional winter carrot dessert cooked in milk and ghee.', image: 'table', isVeg: true, inStock: true },
  { id: 'db19', name: 'Moong Daal Halwa', price: 120, category: 'Desserts & Beverages', subcategory: 'Desserts', description: 'Rich lentils pudding fried in pure desi ghee.', image: 'table', isVeg: true, inStock: true },
  { id: 'db20', name: 'Sizzling Brownie', price: 200, category: 'Desserts & Beverages', subcategory: 'Desserts', description: 'Hot chocolate brownie on sizzling plate with vanilla scoop.', image: 'table', isVeg: true, inStock: true },
  { id: 'db21', name: 'Nutella Waffle', price: 249, category: 'Desserts & Beverages', subcategory: 'Waffles', description: 'Crispy warm waffle smothered with Nutella spread.', image: 'table', isVeg: true, inStock: true },
  { id: 'db22', name: 'Chocolate Waffle', price: 199, category: 'Desserts & Beverages', subcategory: 'Waffles', description: 'Belgian waffle topped with melted milk chocolate.', image: 'table', isVeg: true, inStock: true },
  { id: 'db23', name: 'Strawberry Waffle', price: 229, category: 'Desserts & Beverages', subcategory: 'Waffles', description: 'Fresh waffle topped with strawberry compote.', image: 'table', isVeg: true, inStock: true },
  { id: 'db24', name: 'Blue-Berry Waffle', price: 229, category: 'Desserts & Beverages', subcategory: 'Waffles', description: 'Waffle topped with wild blueberry glaze.', image: 'table', isVeg: true, inStock: true }
];

const initialTables = Array.from({ length: 10 }, (_, i) => ({
  id: i + 1,
  capacity: i % 2 === 0 ? 4 : 2,
  status: 'Available',
  activeGuest: null
}));

export function AppProvider({ children }) {
  const [currentScreen, setCurrentScreenState] = useState('welcome');
  const screenHistoryRef = useRef(['welcome']);

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [tableId, setTableId] = useState('1');
  const [guestName, setGuestName] = useState('Valued Guest');
  const [isDineIn, setIsDineIn] = useState(true);
  
  const [cart, setCart] = useState([]);

  const [rawActiveOrder, setRawActiveOrder] = useState(() => {
    const saved = localStorage.getItem('kn_active_order');
    return saved ? JSON.parse(saved) : null;
  });

  const [ordersQueue, setOrdersQueue] = useState([]);
  const [tables, setTables] = useState(initialTables);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => {
    return localStorage.getItem('kn_admin_logged_in') === 'true';
  });

  const [menuItemsList, setMenuItemsList] = useState(() => {
    const saved = localStorage.getItem('kn_menu_items');
    const baseItems = saved ? JSON.parse(saved) : mockMenuItems;
    return baseItems;
  });

  // DYNAMICALLY COMPUTED LIVE ACTIVE ORDER FROM ORDERS QUEUE
  const activeOrder = rawActiveOrder 
    ? (ordersQueue.find((o) => o.id === rawActiveOrder.id) || rawActiveOrder) 
    : null;

  // HIGH SPEED CLOUD REAL-TIME SYNC ACROSS ALL DEVICES
  useEffect(() => {
    let bc;
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      bc = new BroadcastChannel('kn_restaurant_realtime_sync');
      bc.onmessage = (event) => {
        if (event.data) {
          if (event.data.type === 'SYNC_MENU' && event.data.menuItems) {
            setMenuItemsList(event.data.menuItems);
          }
          if (event.data.type === 'SYNC_ORDERS') {
            if (event.data.ordersQueue) setOrdersQueue([...event.data.ordersQueue]);
            if (event.data.tables) setTables([...event.data.tables]);
          }
        }
      };
    }

    const syncCloudAndLocal = async () => {
      // Parallel High-Speed Concurrent Cloud Polling (~80ms latency)
      const [cloudOrders, cloudStockMap, cloudImageMap, cloudPopularMap, cloudMenu] = await Promise.all([
        fetchCloudOrders(),
        fetchCloudStock(),
        fetchCloudImages(),
        fetchCloudPopular(),
        fetchCloudMenu()
      ]);

      // 1. Process Orders
      let currentCloudQueue = [];
      if (cloudOrders) {
        currentCloudQueue = cloudOrders.ordersQueue || (Array.isArray(cloudOrders) ? cloudOrders : []);
        if (Array.isArray(cloudOrders.tables) && cloudOrders.tables.length > 0) {
          setTables([...cloudOrders.tables]);
        }
      }

      // AUTOMATIC SELF-HEALING: If local customer has rawActiveOrder missing from Cloud, inject & sync to Cloud!
      const activeSaved = localStorage.getItem('kn_active_order');
      if (activeSaved) {
        try {
          const activeObj = JSON.parse(activeSaved);
          if (activeObj && activeObj.id && !currentCloudQueue.some((o) => o.id === activeObj.id)) {
            currentCloudQueue = [activeObj, ...currentCloudQueue];
            pushCloudOrders(currentCloudQueue, tables);
          }
        } catch (e) {}
      }

      setOrdersQueue([...currentCloudQueue]);

      // 2. Process Overrides
      if (cloudStockMap && Object.keys(cloudStockMap).length > 0) {
        localStorage.setItem('kn_stock_overrides', JSON.stringify(cloudStockMap));
      }
      if (cloudImageMap && Object.keys(cloudImageMap).length > 0) {
        localStorage.setItem('kn_custom_images', JSON.stringify(cloudImageMap));
      }
      if (cloudPopularMap && Object.keys(cloudPopularMap).length > 0) {
        localStorage.setItem('kn_popular_overrides', JSON.stringify(cloudPopularMap));
      }

      // 3. Merge Menu Items
      const baseMenu = (cloudMenu && Array.isArray(cloudMenu.items)) 
        ? cloudMenu.items 
        : (Array.isArray(cloudMenu) && cloudMenu.length >= 5 ? cloudMenu : menuItemsList);

      const finalMerged = applyCloudOverrides(baseMenu, cloudStockMap || {}, cloudImageMap || {}, cloudPopularMap || {});
      setMenuItemsList(finalMerged);
      localStorage.setItem('kn_menu_items', JSON.stringify(finalMerged));
    };

    // Initial Fetch
    syncCloudAndLocal();

    // 1-second Polling for Multi-Network Sync
    const intervalId = setInterval(syncCloudAndLocal, 1000);

    return () => {
      if (bc) bc.close();
      clearInterval(intervalId);
    };
  }, []);

  // OS & ANDROID HARDWARE BACK BUTTON HISTORY NAVIGATION HANDLER
  useEffect(() => {
    if (!window.history.state || !window.history.state.screen) {
      window.history.replaceState({ screen: 'welcome', index: 0 }, '', '');
    }

    const handlePopState = (event) => {
      if (event.state && event.state.screen) {
        setCurrentScreenState(event.state.screen);
      } else {
        const historyStack = screenHistoryRef.current;
        if (historyStack.length > 1) {
          historyStack.pop();
          const previousScreen = historyStack[historyStack.length - 1];
          setCurrentScreenState(previousScreen);
        } else {
          setCurrentScreenState('welcome');
        }
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const setCurrentScreen = (newScreen) => {
    if (newScreen !== currentScreen) {
      screenHistoryRef.current.push(newScreen);
      window.history.pushState({ screen: newScreen, index: screenHistoryRef.current.length - 1 }, '', '');
      setCurrentScreenState(newScreen);
    }
  };

  useEffect(() => {
    localStorage.setItem('kn_admin_logged_in', isAdminLoggedIn.toString());
  }, [isAdminLoggedIn]);

  useEffect(() => {
    if (rawActiveOrder) {
      localStorage.setItem('kn_active_order', JSON.stringify(rawActiveOrder));
    } else {
      localStorage.removeItem('kn_active_order');
    }
  }, [rawActiveOrder]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tableParam = params.get('table');
    if (tableParam) {
      setTableId(tableParam);
      const savedName = localStorage.getItem(`kn_guest_name_t${tableParam}`);
      if (savedName) setGuestName(savedName);
    }
  }, []);

  const addToCart = (item) => {
    setCart((prevCart) => {
      const existing = prevCart.find((ci) => ci.item.id === item.id);
      if (existing) {
        return prevCart.map((ci) => 
          ci.item.id === item.id ? { ...ci, quantity: ci.quantity + 1 } : ci
        );
      }
      return [...prevCart, { item, quantity: 1 }];
    });
  };

  const removeFromCart = (itemId) => {
    setCart((prevCart) => {
      const existing = prevCart.find((ci) => ci.item.id === itemId);
      if (existing && existing.quantity > 1) {
        return prevCart.map((ci) => 
          ci.item.id === itemId ? { ...ci, quantity: ci.quantity - 1 } : ci
        );
      }
      return prevCart.filter((ci) => ci.item.id !== itemId);
    });
  };

  const updateQuantity = (itemId, qty) => {
    if (qty <= 0) {
      setCart((prevCart) => prevCart.filter((ci) => ci.item.id === itemId));
    } else {
      setCart((prevCart) => 
        prevCart.map((ci) => ci.item.id === itemId ? { ...ci, quantity: qty } : ci)
      );
    }
  };

  const clearCart = () => setCart([]);

  const endSession = async () => {
    if (tableId) {
      localStorage.removeItem(`kn_guest_name_t${tableId}`);
      setTables((prev) => {
        const updated = prev.map((t) => Number(t.id) === Number(tableId) ? { ...t, status: 'Available', activeGuest: null } : t);
        pushCloudOrders(ordersQueue, updated);
        return updated;
      });
    }
    setGuestName('Valued Guest');
    setCart([]);
    setRawActiveOrder(null);
    localStorage.removeItem('kn_active_order');
    setCurrentScreen('welcome');
  };

  // INSTANT NON-BLOCKING PLACE ORDER
  const placeOrder = () => {
    if (cart.length === 0) return;
    
    const totals = calculateCartTotals();
    const newOrder = {
      id: `ord-${Math.floor(1000 + Math.random() * 9000)}`,
      items: [...cart],
      status: 'Pending',
      tableId: tableId || '1',
      guestName: guestName || 'Valued Guest',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      createdTimestamp: Date.now(),
      total: totals.total,
      subtotal: totals.subtotal,
      tax: totals.tax
    };

    // 1. Instantly update customer state & UI
    setRawActiveOrder(newOrder);
    localStorage.setItem('kn_active_order', JSON.stringify(newOrder));
    setCart([]);
    setCurrentScreen('order-tracker');

    // 2. Immediately merge order in local queue and trigger state update
    const updatedQueue = [newOrder, ...ordersQueue.filter((o) => o.id !== newOrder.id)];
    setOrdersQueue(updatedQueue);

    // 3. Fire non-blocking push to Supabase Cloud Database & BroadcastChannel
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        const bc = new BroadcastChannel('kn_restaurant_realtime_sync');
        bc.postMessage({ type: 'SYNC_ORDERS', ordersQueue: updatedQueue });
        bc.close();
      } catch (e) {}
    }

    pushCloudOrders(updatedQueue, tables);
  };

  const cancelOrder = (orderId) => {
    const targetOrder = ordersQueue.find((o) => o.id === orderId);
    if (targetOrder && targetOrder.status !== 'Pending') {
      return { success: false, message: 'Order cannot be cancelled after kitchen acceptance.' };
    }

    setRawActiveOrder(null);
    localStorage.removeItem('kn_active_order');
    setCart([]);
    setCurrentScreen('home');

    const updatedQueue = ordersQueue.map((o) => o.id === orderId ? { ...o, status: 'Cancelled' } : o);
    setOrdersQueue([...updatedQueue]);

    // Push updated queue to Supabase Cloud Database
    pushCloudOrders(updatedQueue, tables);

    return { success: true, message: 'Order cancelled successfully.' };
  };

  const calculateCartTotals = () => {
    const subtotal = cart.reduce((acc, ci) => acc + (ci.item.price * ci.quantity), 0);
    const packagingCharge = cart.length > 0 ? 15 : 0;
    const tax = (subtotal + packagingCharge) * 0.05;
    const total = subtotal + packagingCharge + tax;

    return {
      subtotal: parseFloat(subtotal.toFixed(2)),
      packagingCharge,
      tax: parseFloat(tax.toFixed(2)),
      total: parseFloat(total.toFixed(2))
    };
  };

  // INSTANT UPDATE ORDER STATUS
  const updateOrderStatus = (orderId, nextStatus) => {
    const updatedQueue = ordersQueue.map((o) => o.id === orderId ? { ...o, status: nextStatus } : o);
    setOrdersQueue([...updatedQueue]);

    // Push updated queue to Supabase Cloud Database
    pushCloudOrders(updatedQueue, tables);
  };

  const ADMIN_HASH = 'd58da41e0f5515574c3045d5a2047f88b127cb9de1ccbbde2bf57f23f987d69c';

  const sha256 = async (str) => {
    const msgBuffer = new TextEncoder().encode(str);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  };

  const adminLogin = async (inputPassword) => {
    if (!inputPassword) return false;
    const computedHash = await sha256(inputPassword);
    if (computedHash === ADMIN_HASH) {
      setIsAdminLoggedIn(true);
      setCurrentScreen('admin-dashboard');
      return true;
    }
    return false;
  };

  const adminLogout = () => {
    setIsAdminLoggedIn(false);
    setCurrentScreen('welcome');
  };

  // TOGGLE POPULAR STATUS WITH 6-ITEM MINIMUM GUARD & MODULAR CLOUD SYNC
  const togglePopularStatus = async (itemId) => {
    const cloudPopular = await fetchCloudPopular();
    const localPopular = JSON.parse(localStorage.getItem('kn_popular_overrides') || '{}');
    const currentPopularMap = { ...cloudPopular, ...localPopular };

    const currentItem = menuItemsList.find((i) => i.id === itemId);
    const isCurrentlyPopular = currentItem ? currentItem.isPopular : false;

    // Count currently featured items
    const currentlyFeaturedCount = menuItemsList.filter((i) => i.isPopular).length;

    // GUARD: Minimum 6 items must remain featured on the Home Page!
    if (isCurrentlyPopular && currentlyFeaturedCount <= 6) {
      return { 
        success: false, 
        message: 'Minimum 6 items must remain featured on the Home Page for customer experience!' 
      };
    }

    const newPopularStatus = !isCurrentlyPopular;
    const updatedPopularMap = { ...currentPopularMap, [itemId]: newPopularStatus };

    localStorage.setItem('kn_popular_overrides', JSON.stringify(updatedPopularMap));

    const updatedList = menuItemsList.map((i) => 
      i.id === itemId ? { ...i, isPopular: newPopularStatus } : i
    );
    setMenuItemsList(updatedList);
    localStorage.setItem('kn_menu_items', JSON.stringify(updatedList));

    // Push lightweight popular override map (~1KB) to Supabase Cloud
    await pushCloudPopular(updatedPopularMap);

    return { success: true };
  };

  // REAL-TIME MODULAR CLOUD & PERMANENT LOCAL DISH STOCK TOGGLE
  const toggleItemStock = async (itemId) => {
    const cloudStock = await fetchCloudStock();
    const currentItem = menuItemsList.find((i) => i.id === itemId);
    const newStock = currentItem ? !currentItem.inStock : false;
    
    const updatedStockMap = { ...cloudStock, [itemId]: newStock };
    localStorage.setItem('kn_stock_overrides', JSON.stringify(updatedStockMap));

    const updatedList = menuItemsList.map((i) => i.id === itemId ? { ...i, inStock: newStock } : i);
    setMenuItemsList(updatedList);

    // Push lightweight stock override map (~1KB) to Supabase Cloud
    await pushCloudStock(updatedStockMap);
  };

  // REAL-TIME CLOUD & PERMANENT LOCAL PRICE EDIT
  const updateItemPrice = async (itemId, newPrice) => {
    const updatedList = menuItemsList.map((i) => i.id === itemId ? { ...i, price: Number(newPrice) } : i);
    setMenuItemsList(updatedList);

    // Push to Supabase Cloud Database
    await pushCloudMenu(updatedList);
  };

  // REAL-TIME MODULAR CLOUD & PERMANENT LOCAL MENU ITEM EDIT (CUSTOM IMAGE INCLUDED)
  const updateMenuItem = async (itemId, updatedFields) => {
    if (updatedFields.customImage) {
      const cloudImages = await fetchCloudImages();
      const updatedImageMap = { ...cloudImages, [itemId]: updatedFields.customImage };
      localStorage.setItem('kn_custom_images', JSON.stringify(updatedImageMap));
      // Push modular image map (~50KB) to Supabase Cloud
      await pushCloudImages(updatedImageMap);
    }

    if (updatedFields.inStock !== undefined) {
      const cloudStock = await fetchCloudStock();
      const updatedStockMap = { ...cloudStock, [itemId]: updatedFields.inStock };
      localStorage.setItem('kn_stock_overrides', JSON.stringify(updatedStockMap));
      // Push lightweight stock map to Supabase Cloud
      await pushCloudStock(updatedStockMap);
    }

    const updatedList = menuItemsList.map((item) => 
      item.id === itemId ? { ...item, ...updatedFields } : item
    );

    setMenuItemsList(updatedList);
    localStorage.setItem('kn_menu_items', JSON.stringify(updatedList));

    // Push menu array to Supabase Cloud Database
    await pushCloudMenu(updatedList);
  };

  const removeMenuItemImage = async (itemId) => {
    const cloudImages = await fetchCloudImages();
    delete cloudImages[itemId];
    localStorage.setItem('kn_custom_images', JSON.stringify(cloudImages));
    await pushCloudImages(cloudImages);

    const updatedList = menuItemsList.map((item) => 
      item.id === itemId ? { ...item, image: 'table', customImage: null } : item
    );

    setMenuItemsList(updatedList);
    localStorage.setItem('kn_menu_items', JSON.stringify(updatedList));
    await pushCloudMenu(updatedList);
  };

  const addNewMenuItem = async (newItemData) => {
    const newId = `custom-${Date.now()}`;
    const newItem = {
      id: newId,
      name: newItemData.name || 'New Gourmet Dish',
      price: Number(newItemData.price) || 199,
      category: newItemData.category || 'Continental',
      subcategory: newItemData.subcategory || 'Starters',
      description: newItemData.description || 'Fresh gourmet dish prepared by master chefs.',
      image: newItemData.image || 'table',
      customImage: newItemData.customImage || null,
      isVeg: newItemData.isVeg !== false,
      inStock: true
    };

    if (newItem.customImage) {
      const cloudImages = await fetchCloudImages();
      const updatedImageMap = { ...cloudImages, [newId]: newItem.customImage };
      localStorage.setItem('kn_custom_images', JSON.stringify(updatedImageMap));
      await pushCloudImages(updatedImageMap);
    }

    const updatedList = [newItem, ...menuItemsList];
    setMenuItemsList(updatedList);
    localStorage.setItem('kn_menu_items', JSON.stringify(updatedList));
    await pushCloudMenu(updatedList);
  };

  return (
    <AppContext.Provider value={{
      currentScreen,
      setCurrentScreen,
      selectedCategory,
      setSelectedCategory,
      tableId,
      setTableId,
      guestName,
      setGuestName,
      isDineIn: true,
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      endSession,
      placeOrder,
      cancelOrder,
      activeOrder,
      ordersQueue,
      updateOrderStatus,
      calculateCartTotals,
      menuItems: menuItemsList,
      isAdminLoggedIn,
      adminLogin,
      adminLogout,
      tables,
      toggleItemStock,
      togglePopularStatus,
      updateItemPrice,
      updateMenuItem,
      removeMenuItemImage,
      addNewMenuItem
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
