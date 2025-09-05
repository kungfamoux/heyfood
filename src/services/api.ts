import { supabase } from '@/lib/supabase';
import { Database } from '@/types/database.types';

type MenuItem = Database['public']['Tables']['menu_items']['Row'] & {
  restaurant: Database['public']['Tables']['restaurants']['Row'];
  category: Database['public']['Tables']['categories']['Row'];
};

type Category = Database['public']['Tables']['categories']['Row'];

// Generate a random food image URL from Picsum Photos
const getRandomFoodImage = (id: string, width = 400, height = 300) => {
  const foodCategories = ['pasta', 'pizza', 'burger', 'sushi', 'salad', 'steak', 'chicken', 'dessert'];
  const category = foodCategories[Math.floor(Math.random() * foodCategories.length)];
  return `https://picsum.photos/seed/${id}-${category}/${width}/${height}?grayscale`;
};

export const fetchMenuItems = async (): Promise<MenuItem[]> => {
  const { data: menuItems, error } = await supabase
    .from('menu_items')
    .select(`
      *,
      restaurant:restaurant_id(*),
      category:category_id(*)
    `)
    .order('name');

  if (error) {
    console.error('Error fetching menu items:', error);
    throw error;
  }

  // Add random food images to each menu item
  const itemsWithImages = (menuItems || []).map(item => ({
    ...item,
    image_url: item.image_url || getRandomFoodImage(item.id)
  }));

  return itemsWithImages as MenuItem[];
};

export const fetchCategories = async (): Promise<Category[]> => {
  const { data: categories, error } = await supabase
    .from('categories')
    .select('*')
    .order('name');

  if (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }

  return categories || [];
};

export const searchMenuItems = async (query: string): Promise<MenuItem[]> => {
  if (!query.trim()) return [];

  const { data: menuItems, error } = await supabase
    .from('menu_items')
    .select(`
      *,
      restaurant:restaurant_id(*),
      category:category_id(*)
    `)
    .or(`name.ilike.%${query}%,description.ilike.%${query}%`);

  if (error) {
    console.error('Error searching menu items:', error);
    throw error;
  }

  return (menuItems || []) as MenuItem[];
};
