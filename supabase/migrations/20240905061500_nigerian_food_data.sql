-- Create necessary tables if they don't exist
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  icon TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.restaurants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  image_url TEXT NOT NULL,
  rating NUMERIC(3, 2) NOT NULL DEFAULT 0,
  review_count INTEGER NOT NULL DEFAULT 0,
  delivery_time TEXT NOT NULL,
  is_open BOOLEAN NOT NULL DEFAULT true,
  delivery_fee NUMERIC(10, 2),
  min_order NUMERIC(10, 2),
  distance_km NUMERIC(5, 2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.restaurant_categories (
  restaurant_id UUID NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  PRIMARY KEY (restaurant_id, category_id)
);

CREATE TABLE IF NOT EXISTS public.restaurant_tags (
  restaurant_id UUID NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES public.tags(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  PRIMARY KEY (restaurant_id, tag_id)
);

CREATE TABLE IF NOT EXISTS public.menu_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID REFERENCES public.restaurants(id) ON DELETE CASCADE,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  description TEXT,
  price INTEGER NOT NULL,
  image_url TEXT,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- First, modify the categories table to make icon column nullable if it exists
ALTER TABLE public.categories ALTER COLUMN icon DROP NOT NULL;

-- Insert Nigerian food categories
INSERT INTO public.categories (name, icon) VALUES
  ('Jollof Rice', NULL),
  ('Pounded Yam', NULL),
  ('Suya', NULL),
  ('Pepper Soup', NULL),
  ('Amala', NULL),
  ('Egusi Soup', NULL),
  ('Akara', NULL),
  ('Moi Moi', NULL),
  ('Puff Puff', NULL),
  ('Boli', NULL),
  ('Eba', NULL),
  ('Semo', NULL),
  ('Nkwobi', NULL),
  ('Ofada Rice', NULL),
  ('Abacha', NULL),
  ('Efo Riro', NULL),
  ('Oha Soup', NULL),
  ('Banga Soup', NULL),
  ('Ogbono Soup', NULL),
  ('Afang Soup', NULL),
  ('Edikang Ikong', NULL),
  ('Bitterleaf Soup', NULL),
  ('Owo Soup', NULL),
  ('Banga Rice', NULL),
  ('Coconut Rice', NULL),
  ('Fried Rice', NULL),
  ('Jollof Spaghetti', NULL),
  ('Yam Porridge', NULL),
  ('Beans', NULL),
  ('Plantain', NULL);

-- Insert Nigerian food tags (using INSERT IGNORE to skip duplicates)
INSERT INTO public.tags (name)
SELECT unnest(ARRAY[
  'Spicy', 'Halal', 'Vegetarian', 'Vegan', 'Gluten Free',
  'Peppery', 'Finger Food', 'Grilled', 'Fried', 'Stew',
  'Native', 'Party Rice', 'Swallow', 'Snack', 'Pepper Soup',
  'Seafood', 'Palm Oil', 'Coconut', 'Spicy Sauce', 'Beef',
  'Chicken', 'Fish', 'Goat', 'Pork', 'Snail',
  'Crayfish', 'Stockfish', 'Dried Fish', 'Ponmo', 'Shaki',
  'Kidney', 'Liver', 'Gizzard', 'Peppered', 'Smoked',
  'Boiled', 'Roasted', 'Steamed'
])
WHERE NOT EXISTS (
  SELECT 1 FROM public.tags
);

-- Insert 1. Mama Ebo's Kitchen
DO $$
DECLARE
  v_restaurant_id UUID;
  v_category_jollof_id UUID;
  v_category_pounded_yam_id UUID;
  v_category_egusi_soup_id UUID;
  v_category_pepper_soup_id UUID;
BEGIN
  -- Insert the restaurant and get its ID
  INSERT INTO public.restaurants (
    name,
    image_url,
    rating,
    review_count,
    delivery_time,
    is_open,
    delivery_fee,
    min_order,
    distance_km
  ) VALUES (
    'Mama Ebo''s Kitchen',
    'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    4.7,
    342,
    '20-35 min',
    true,
    5.00,
    15.00,
    0.8
  ) RETURNING id INTO v_restaurant_id;

  -- Get category IDs
  SELECT id INTO v_category_jollof_id FROM public.categories WHERE name = 'Jollof Rice';
  SELECT id INTO v_category_pounded_yam_id FROM public.categories WHERE name = 'Pounded Yam';
  SELECT id INTO v_category_egusi_soup_id FROM public.categories WHERE name = 'Egusi Soup';
  SELECT id INTO v_category_pepper_soup_id FROM public.categories WHERE name = 'Pepper Soup';

  -- Insert categories for the restaurant
  INSERT INTO public.restaurant_categories (restaurant_id, category_id)
  SELECT v_restaurant_id, id 
  FROM public.categories 
  WHERE name IN ('Jollof Rice', 'Pounded Yam', 'Egusi Soup', 'Pepper Soup')
  ON CONFLICT DO NOTHING;

  -- Insert tags for the restaurant
  INSERT INTO public.restaurant_tags (restaurant_id, tag_id)
  SELECT v_restaurant_id, id 
  FROM public.tags 
  WHERE name IN ('Spicy', 'Halal', 'Peppery', 'Native')
  ON CONFLICT DO NOTHING;

  -- Insert menu items for Mama Ebo's Kitchen
  INSERT INTO public.menu_items (restaurant_id, category_id, name, description, price, image_url, is_available)
  SELECT 
    v_restaurant_id, 
    v_category_jollof_id, 
    'Party Jollof Rice', 
    'Special party-style jollof rice with fried plantains and chicken', 
    2500, 
    'https://images.unsplash.com/photo-1608036600297-1f4c8b2a0d0e', 
    true
  UNION ALL
  SELECT 
    v_restaurant_id, 
    v_category_pounded_yam_id, 
    'Pounded Yam with Egusi', 
    'Fresh pounded yam with egusi soup and assorted meat', 
    3500, 
    'https://images.unsplash.com/photo-1608326389236-5e6c5abf3f3e', 
    true
  UNION ALL
  SELECT 
    v_restaurant_id, 
    v_category_pepper_soup_id, 
    'Goat Meat Pepper Soup', 
    'Spicy goat meat pepper soup with uziza leaves', 
    1800, 
    'https://images.unsplash.com/photo-1608036600297-1f4c8b2a0d0e', 
    true;
END;
$$;

-- Insert 2. Suya Express
DO $$
DECLARE
  v_restaurant_id UUID;
  v_category_suya_id UUID;
  v_category_pepper_soup_id UUID;
  v_category_grilled_fish_id UUID;
BEGIN
  -- Insert the restaurant and get its ID
  INSERT INTO public.restaurants (
    name,
    image_url,
    rating,
    review_count,
    delivery_time,
    is_open,
    delivery_fee,
    min_order,
    distance_km
  ) VALUES (
    'Suya Express',
    'https://images.unsplash.com/photo-1585937420612-8c7d0c6e8b5b',
    4.5,
    215,
    '15-30 min',
    true,
    4.50,
    10.00,
    1.2
  ) RETURNING id INTO v_restaurant_id;

  -- Get category IDs
  SELECT id INTO v_category_suya_id FROM public.categories WHERE name = 'Suya';
  SELECT id INTO v_category_pepper_soup_id FROM public.categories WHERE name = 'Pepper Soup';
  SELECT id INTO v_category_grilled_fish_id FROM public.categories WHERE name = 'Grilled Fish';

  -- Insert categories for the restaurant
  INSERT INTO public.restaurant_categories (restaurant_id, category_id)
  SELECT v_restaurant_id, id 
  FROM public.categories 
  WHERE name IN ('Suya', 'Pepper Soup', 'Grilled Fish')
  ON CONFLICT DO NOTHING;

  -- Insert tags for the restaurant
  INSERT INTO public.restaurant_tags (restaurant_id, tag_id)
  SELECT v_restaurant_id, id 
  FROM public.tags 
  WHERE name IN ('Grilled', 'Spicy', 'Peppery', 'Beef', 'Chicken')
  ON CONFLICT DO NOTHING;

  -- Insert menu items for Suya Express
  INSERT INTO public.menu_items (restaurant_id, category_id, name, description, price, image_url, is_available)
  VALUES
    (v_restaurant_id, v_category_suya_id, 'Beef Suya (Small)', 'Tender beef suya with spicy peanut sauce', 1500, 'https://images.unsplash.com/photo-1512621776955-3099b9f4b1d1', true),
    (v_restaurant_id, v_category_suya_id, 'Chicken Suya (Full)', 'Grilled chicken suya with spicy yaji', 3000, 'https://images.unsplash.com/photo-1512621776955-3099b9f4b1d1', true),
    (v_restaurant_id, v_category_pepper_soup_id, 'Assorted Meat Pepper Soup', 'Spicy pepper soup with assorted meat', 2200, 'https://images.unsplash.com/photo-1512621776955-3099b9f4b1d1', true);
END $$;

-- Insert 3. Kilishi Hub
DO $$
DECLARE
  v_restaurant_id UUID;
  v_category_kilishi_id UUID;
  v_category_suya_id UUID;
  v_category_pepper_soup_id UUID;
BEGIN
  -- Insert the restaurant and get its ID
  INSERT INTO public.restaurants (
    name,
    image_url,
    rating,
    review_count,
    delivery_time,
    is_open,
    delivery_fee,
    min_order,
    distance_km
  ) VALUES (
    'Kilishi Hub',
    'https://images.unsplash.com/photo-1565557623262-b51c2513a641',
    4.3,
    198,
    '25-45 min',
    true,
    5.00,
    12.00,
    2.1
  ) RETURNING id INTO v_restaurant_id;

  -- Get category IDs
  SELECT id INTO v_category_kilishi_id FROM public.categories WHERE name = 'Kilishi';
  SELECT id INTO v_category_suya_id FROM public.categories WHERE name = 'Suya';
  SELECT id INTO v_category_pepper_soup_id FROM public.categories WHERE name = 'Pepper Soup';

  -- Insert categories for the restaurant
  INSERT INTO public.restaurant_categories (restaurant_id, category_id)
  SELECT v_restaurant_id, id 
  FROM public.categories 
  WHERE name IN ('Kilishi', 'Suya', 'Pepper Soup')
  ON CONFLICT DO NOTHING;

  -- Insert tags for the restaurant
  INSERT INTO public.restaurant_tags (restaurant_id, tag_id)
  SELECT v_restaurant_id, id 
  FROM public.tags 
  WHERE name IN ('Dried', 'Spicy', 'Beef', 'Peppery', 'Northern')
  ON CONFLICT DO NOTHING;

  -- Insert menu items for Kilishi Hub
  INSERT INTO public.menu_items (restaurant_id, category_id, name, description, price, image_url, is_available)
  VALUES
    (v_restaurant_id, v_category_suya_id, 'Kilishi (100g)', 'Premium Northern-style dried beef jerky', 2500, 'https://images.unsplash.com/photo-1603360946368-8c5f2d7d9b3d', true),
    (v_restaurant_id, v_category_pepper_soup_id, 'Beef Pepper Soup', 'Spicy beef pepper soup with utazi leaves', 1800, 'https://images.unsplash.com/photo-1603360946368-8c5f2d7d9b3d', true),
    (v_restaurant_id, (SELECT id FROM public.categories WHERE name = 'Puff Puff'), 'Puff Puff (5pcs)', 'Sweet fried dough balls', 1000, 'https://images.unsplash.com/photo-1603360946368-8c5f2d7d9b3d', true);
END $$;

-- 4. Buka Spot
DO $$
DECLARE
  v_restaurant_id UUID;
  v_category_amala_id UUID;
  v_category_ewedu_id UUID;
  v_category_gbegiri_id UUID;
  v_category_efo_riro_id UUID;
BEGIN
  -- Insert the restaurant and get its ID
  INSERT INTO public.restaurants (
    name,
    image_url,
    rating,
    review_count,
    delivery_time,
    is_open,
    delivery_fee,
    min_order,
    distance_km
  ) VALUES (
    'Buka Spot',
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4',
    4.6,
    278,
    '20-40 min',
    true,
    5.50,
    12.00,
    1.5
  ) RETURNING id INTO v_restaurant_id;

  -- Get category IDs
  SELECT id INTO v_category_amala_id FROM public.categories WHERE name = 'Amala';
  SELECT id INTO v_category_ewedu_id FROM public.categories WHERE name = 'Ewedu';
  SELECT id INTO v_category_gbegiri_id FROM public.categories WHERE name = 'Gbegiri';
  SELECT id INTO v_category_efo_riro_id FROM public.categories WHERE name = 'Efo Riro';

  -- Insert categories for the restaurant
  INSERT INTO public.restaurant_categories (restaurant_id, category_id)
  SELECT v_restaurant_id, id 
  FROM public.categories 
  WHERE name IN ('Amala', 'Ewedu', 'Gbegiri', 'Efo Riro')
  ON CONFLICT DO NOTHING;

  -- Insert tags for the restaurant
  INSERT INTO public.restaurant_tags (restaurant_id, tag_id)
  SELECT v_restaurant_id, id 
  FROM public.tags 
  WHERE name IN ('Native', 'Spicy', 'Palm Oil', 'Beef', 'Goat')
  ON CONFLICT DO NOTHING;

  -- Insert menu items for Buka Spot
  INSERT INTO public.menu_items (restaurant_id, category_id, name, description, price, image_url, is_available)
  VALUES
    (v_restaurant_id, v_category_amala_id, 'Amala with Ewedu & Gbegiri', 'Soft amala with ewedu and gbegiri soup, assorted meat', 2800, 'https://images.unsplash.com/photo-1603360946368-8c5f2d7d9b3d', true),
    (v_restaurant_id, v_category_efo_riro_id, 'Efo Riro with Pounded Yam', 'Rich vegetable soup with pounded yam', 3200, 'https://images.unsplash.com/photo-1603360946368-8c5f2d7d9b3d', true),
    (v_restaurant_id, v_category_amala_id, 'Amala with Efo Riro', 'Amala with rich vegetable soup', 2700, 'https://images.unsplash.com/photo-1603360946368-8c5f2d7d9b3d', true);
END $$;

-- 5. The Fishery
DO $$
DECLARE
  v_restaurant_id UUID;
  v_category_pepper_soup_id UUID;
  v_category_banga_soup_id UUID;
  v_category_fisherman_soup_id UUID;
BEGIN
  -- Insert the restaurant and get its ID
  INSERT INTO public.restaurants (
    name,
    image_url,
    rating,
    review_count,
    delivery_time,
    is_open,
    delivery_fee,
    min_order,
    distance_km
  ) VALUES (
    'The Fishery',
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4',
    4.4,
    189,
    '25-45 min',
    true,
    6.50,
    15.00,
    2.3
  ) RETURNING id INTO v_restaurant_id;

  -- Get category IDs
  SELECT id INTO v_category_pepper_soup_id FROM public.categories WHERE name = 'Pepper Soup';
  SELECT id INTO v_category_banga_soup_id FROM public.categories WHERE name = 'Banga Soup';
  SELECT id INTO v_category_fisherman_soup_id FROM public.categories WHERE name = 'Fisherman Soup';

  -- Insert categories for the restaurant
  INSERT INTO public.restaurant_categories (restaurant_id, category_id)
  SELECT v_restaurant_id, id 
  FROM public.categories 
  WHERE name IN ('Pepper Soup', 'Banga Soup', 'Fisherman Soup')
  ON CONFLICT DO NOTHING;

  -- Insert tags for the restaurant
  INSERT INTO public.restaurant_tags (restaurant_id, tag_id)
  SELECT v_restaurant_id, id 
  FROM public.tags 
  WHERE name IN ('Seafood', 'Fish', 'Peppery', 'Spicy')
  ON CONFLICT DO NOTHING;

  -- Insert menu items for The Fishery
  INSERT INTO public.menu_items (restaurant_id, category_id, name, description, price, image_url, is_available)
  VALUES
    (v_restaurant_id, v_category_fisherman_soup_id, 'Fisherman Soup', 'Rich seafood pepper soup with assorted fish', 4500, 'https://images.unsplash.com/photo-1603360946368-8c5f2d7d9b3d', true),
    (v_restaurant_id, v_category_banga_soup_id, 'Banga Soup with Starch', 'Palm fruit soup with starch and fresh fish', 3800, 'https://images.unsplash.com/photo-1603360946368-8c5f2d7d9b3d', true),
    (v_restaurant_id, v_category_pepper_soup_id, 'Assorted Seafood Pepper Soup', 'Mix of fish, prawns and periwinkle in pepper soup', 5200, 'https://images.unsplash.com/photo-1603360946368-8c5f2d7d9b3d', true);
END $$;

-- 6. Ofada Express
DO $$
DECLARE
  v_restaurant_id UUID;
  v_category_ofada_rice_id UUID;
  v_category_plantain_id UUID;
BEGIN
  -- Insert the restaurant and get its ID
  INSERT INTO public.restaurants (
    name,
    image_url,
    rating,
    review_count,
    delivery_time,
    is_open,
    delivery_fee,
    min_order,
    distance_km
  ) VALUES (
    'Ofada Express',
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4',
    4.7,
    312,
    '20-35 min',
    true,
    5.00,
    12.00,
    1.8
  ) RETURNING id INTO v_restaurant_id;

  -- Get category IDs
  SELECT id INTO v_category_ofada_rice_id FROM public.categories WHERE name = 'Ofada Rice';
  SELECT id INTO v_category_plantain_id FROM public.categories WHERE name = 'Plantain';

  -- Insert categories for the restaurant
  INSERT INTO public.restaurant_categories (restaurant_id, category_id)
  SELECT v_restaurant_id, id 
  FROM public.categories 
  WHERE name IN ('Ofada Rice', 'Plantain')
  ON CONFLICT DO NOTHING;

  -- Insert tags for the restaurant
  INSERT INTO public.restaurant_tags (restaurant_id, tag_id)
  SELECT v_restaurant_id, id 
  FROM public.tags 
  WHERE name IN ('Native', 'Spicy', 'Beef', 'Chicken')
  ON CONFLICT DO NOTHING;

  -- Menu Items for Ofada Express
  INSERT INTO public.menu_items (restaurant_id, category_id, name, description, price, image_url, is_available)
  VALUES
    (v_restaurant_id, v_category_ofada_rice_id, 'Ofada Rice Special', 'Ofada rice with assorted meat and sauce', 3500, 'https://images.unsplash.com/photo-1603360946368-8c5f2d7d9b3d', true),
    (v_restaurant_id, v_category_plantain_id, 'Dodo & Fish', 'Fried plantain with grilled fish', 3000, 'https://images.unsplash.com/photo-1603360946368-8c5f2d7d9b3d', true);
END $$;

WITH restaurant_id AS (SELECT id FROM public.restaurants WHERE name = 'Ofada Express'),
category_map AS (SELECT id, name FROM public.categories)

INSERT INTO public.menu_items (restaurant_id, category_id, name, description, price, image_url, is_available) VALUES
((SELECT id FROM restaurant_id), (SELECT id FROM category_map WHERE name = 'Ofada Rice'), 'Ofada Rice Special', 'Ofada rice with assorted meat and sauce', 3500, 'https://images.unsplash.com/photo-1603360946368-8c5f2d7d9b3d', true),
((SELECT id FROM restaurant_id), (SELECT id FROM category_map WHERE name = 'Plantain'), 'Dodo Ikire', 'Fried plantain with beans and fish', 2800, 'https://images.unsplash.com/photo-1603360946368-8c5f2d7d9b3d', true),
((SELECT id FROM restaurant_id), (SELECT id FROM category_map WHERE name = 'Ofada Rice'), 'Ofada Rice with Grilled Chicken', 'Ofada rice with grilled chicken and sauce', 4000, 'https://images.unsplash.com/photo-1603360946368-8c5f2d7d9b3d', true);

-- 7. Akara Republic
DO $$
DECLARE
  v_restaurant_id UUID;
  v_category_akara_id UUID;
  v_category_moi_moi_id UUID;
  v_category_pap_id UUID;
BEGIN
  -- Insert the restaurant and get its ID
  INSERT INTO public.restaurants (
    name,
    image_url,
    rating,
    review_count,
    delivery_time,
    is_open,
    delivery_fee,
    min_order,
    distance_km
  ) VALUES (
    'Akara Republic',
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4',
    4.2,
    145,
    '20-35 min',
    true,
    3.99,
    15.00,
    2.1
  ) RETURNING id INTO v_restaurant_id;

  -- Get category IDs
  SELECT id INTO v_category_akara_id FROM public.categories WHERE name = 'Akara';
  SELECT id INTO v_category_moi_moi_id FROM public.categories WHERE name = 'Moi Moi';
  SELECT id INTO v_category_pap_id FROM public.categories WHERE name = 'Pap';

  -- Add categories
  INSERT INTO public.restaurant_categories (restaurant_id, category_id)
  SELECT v_restaurant_id, id 
  FROM public.categories 
  WHERE name IN ('Akara', 'Moi Moi', 'Pap')
  ON CONFLICT DO NOTHING;

  -- Add tags
  INSERT INTO public.restaurant_tags (restaurant_id, tag_id)
  SELECT v_restaurant_id, id 
  FROM public.tags 
  WHERE name IN ('Vegetarian', 'Vegan', 'Breakfast', 'Snack')
  ON CONFLICT DO NOTHING;

  -- Insert menu items for Akara Republic
  INSERT INTO public.menu_items (restaurant_id, category_id, name, description, price, image_url, is_available)
  VALUES
    (v_restaurant_id, v_category_akara_id, 'Akara & Pap', 'Bean cakes with pap and milk', 1200, 'https://images.unsplash.com/photo-1603360946368-8c5f2d7d9b3d', true),
    (v_restaurant_id, v_category_moi_moi_id, 'Moi Moi Special', 'Steamed bean pudding with fish and egg', 1500, 'https://images.unsplash.com/photo-1603360946368-8c5f2d7d9b3d', true),
    (v_restaurant_id, v_category_akara_id, 'Akara Burger', 'Bean cake burger with bread and sauce', 1800, 'https://images.unsplash.com/photo-1603360946368-8c5f2d7d9b3d', true);
END $$;

-- 8. The Swallow Place
DO $$
DECLARE
  v_restaurant_id UUID;
  v_category_pounded_yam_id UUID;
  v_category_eba_id UUID;
  v_category_semo_id UUID;
  v_category_amala_id UUID;
BEGIN
  -- Insert the restaurant and get its ID
  INSERT INTO public.restaurants (
    name,
    image_url,
    rating,
    review_count,
    delivery_time,
    is_open,
    delivery_fee,
    min_order,
    distance_km
  ) VALUES (
    'The Swallow Place',
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4',
    4.3,
    198,
    '25-40 min',
    true,
    4.50,
    12.00,
    1.5
  ) RETURNING id INTO v_restaurant_id;

  -- Get category IDs
  SELECT id INTO v_category_pounded_yam_id FROM public.categories WHERE name = 'Pounded Yam';
  SELECT id INTO v_category_eba_id FROM public.categories WHERE name = 'Eba';
  SELECT id INTO v_category_semo_id FROM public.categories WHERE name = 'Semo';
  SELECT id INTO v_category_amala_id FROM public.categories WHERE name = 'Amala';

  -- Insert categories for the restaurant
  INSERT INTO public.restaurant_categories (restaurant_id, category_id)
  SELECT v_restaurant_id, id 
  FROM public.categories 
  WHERE name IN ('Pounded Yam', 'Eba', 'Semo', 'Amala')
  ON CONFLICT DO NOTHING;

  -- Insert tags for the restaurant
  INSERT INTO public.restaurant_tags (restaurant_id, tag_id)
  SELECT v_restaurant_id, id 
  FROM public.tags 
  WHERE name IN ('Swallow', 'Native', 'Spicy', 'Peppery')
  ON CONFLICT DO NOTHING;

  -- Insert menu items for The Swallow Place
  INSERT INTO public.menu_items (restaurant_id, category_id, name, description, price, image_url, is_available)
  VALUES
    (v_restaurant_id, v_category_pounded_yam_id, 'Pounded Yam with Egusi', 'Pounded yam with melon seed soup and assorted meat', 3500, 'https://images.unsplash.com/photo-1603360946368-8c5f2d7d9b3d', true),
    (v_restaurant_id, v_category_eba_id, 'Eba with Okro Soup', 'Garri with okro soup and assorted meat', 3200, 'https://images.unsplash.com/photo-1603360946368-8c5f2d7d9b3d', true),
    (v_restaurant_id, v_category_semo_id, 'Semo with Efo Riro', 'Semo with vegetable soup and fish', 3000, 'https://images.unsplash.com/photo-1603360946368-8c5f2d7d9b3d', true),
    (v_restaurant_id, v_category_amala_id, 'Amala with Ewedu', 'Amala with jute leaves soup and assorted meat', 2800, 'https://images.unsplash.com/photo-1603360946368-8c5f2d7d9b3d', true);
END;
$$;
