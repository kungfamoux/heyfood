import { useState } from "react";
import { Heart, Clock, Star, MapPin, Plus, Minus, ShoppingCart } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import { useCart } from "@/contexts/CartContext";
import { formatNaira } from "@/lib/utils";
import TabNavigation from "@/components/TabNavigation";
import BannerCarousel from "@/components/BannerCarousel";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { fetchMenuItems, fetchCategories, searchMenuItems } from "@/services/api";
import { Skeleton } from "@/components/ui/skeleton";
import { useIsMobile } from "@/hooks/use-mobile";

type MenuItem = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  category_id: string | null;
  restaurant: {
    name: string;
    rating: number;
    delivery_time: string;
    distance_km: number;
    delivery_fee: number;
  };
  category: {
    name: string;
  } | null;
};

type Category = {
  id: string;
  name: string;
  icon: string | null;
};

const SearchBar = ({ value, onChange }: { value: string; onChange: (value: string) => void }) => (
  <div className="relative w-full max-w-2xl mx-auto mb-6">
    <Input
      type="text"
      placeholder="Search for dishes..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full pl-10 pr-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
    />
    <div className="absolute left-3 top-2.5 text-gray-400">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    </div>
  </div>
);

const CategoryFilter = ({ 
  categories, 
  selectedCategory, 
  onSelectCategory,
  className = '' 
}: { 
  categories: Category[]; 
  selectedCategory: string | null; 
  onSelectCategory: (id: string | null) => void;
  className?: string;
}) => (
  <div className={`flex flex-wrap gap-2 ${className}`}>
    <button
      onClick={() => onSelectCategory(null)}
      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
        !selectedCategory 
          ? 'bg-primary text-white' 
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      }`}
    >
      All
    </button>
    {categories.map((category) => (
      <button
        key={category.id}
        onClick={() => onSelectCategory(category.id)}
        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
          selectedCategory === category.id
            ? 'bg-primary text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        {category.name}
      </button>
    ))}
  </div>
);

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const isMobile = useIsMobile();
  const { addToCart } = useCart();

  const handleAddToCart = (item: any) => {
    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      image_url: item.image_url,
      restaurant: {
        name: item.restaurant.name,
        id: item.restaurant.id,
      },
    });
    
    // Reset quantity after adding to cart
    setQuantities(prev => ({
      ...prev,
      [item.id]: 0
    }));
  };

  const updateQuantity = (itemId: string, newQuantity: number) => {
    setQuantities(prev => ({
      ...prev,
      [itemId]: Math.max(0, newQuantity)
    }));
  };

  const { data: menuItems = [], isLoading: isLoadingMenuItems } = useQuery({
    queryKey: ['menuItems', selectedCategory, searchQuery],
    queryFn: async () => {
      let items: MenuItem[] = [];
      
      if (searchQuery) {
        items = await searchMenuItems(searchQuery);
      } else {
        items = await fetchMenuItems();
      }
      
      // Apply category filter if a category is selected
      if (selectedCategory) {
        items = items.filter(item => item.category_id === selectedCategory);
      }
      
      return items;
    },
  });

  const { data: categories = [], isLoading: isLoadingCategories } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  });

  if (isLoadingMenuItems || isLoadingCategories) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header searchQuery={searchQuery} onSearchChange={setSearchQuery} />
        <main className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden">
                <Skeleton className="h-48 w-full" />
                <div className="p-4">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    );
  }

  const handleTabChange = (tab: string) => {
    // Handle tab change logic here
    console.log('Tab changed to:', tab);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header searchQuery={searchQuery} onSearchChange={handleSearch} />
      <TabNavigation activeTab="menu" onTabChange={handleTabChange} />
      <BannerCarousel />
      <div className="container mx-auto px-4 py-6">
        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          className="my-6"
        />
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-6">
            {selectedCategory
              ? categories.find(c => c.id === selectedCategory)?.name || 'Menu Items'
              : 'All Menu Items'}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {menuItems.map((item) => (
              <Card 
                key={item.id} 
                className="group bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 hover:border-primary/20"
              >
                <CardContent className="p-0">
                  <div className="relative h-52 overflow-hidden bg-gray-50">
                    <div className="w-full h-full flex flex-col items-center justify-center p-4">
                      <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                        <svg 
                          className="w-10 h-10 text-gray-300" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24" 
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={1.5} 
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
                          />
                        </svg>
                      </div>
                      <p className="text-sm text-gray-400 font-medium">Food Image</p>
                      <p className="text-xs text-gray-300 mt-1">Not available</p>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <button 
                      className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg hover:bg-white hover:scale-110 transition-all duration-200"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        // Handle favorite
                      }}
                      aria-label="Add to favorites"
                      title="Add to favorites"
                    >
                      <Heart className="w-5 h-5 text-rose-500 hover:fill-rose-500 transition-colors" />
                    </button>
                    {item.restaurant.delivery_fee === 0 && (
                      <span className="absolute top-3 left-3 bg-green-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                        Free Delivery
                      </span>
                    )}
                  </div>
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-bold text-lg text-gray-900 line-clamp-1">{item.name}</h3>
                      <div className="flex items-center bg-primary/10 text-primary px-2.5 py-1 rounded-full text-sm font-medium">
                        <Star className="w-3.5 h-3.5 mr-1 fill-current" />
                        <span>{item.restaurant.rating.toFixed(1)}</span>
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2 min-h-[2.5rem]">
                      {item.description || 'A delicious dish you\'ll love'}
                    </p>
                    <div className="flex flex-col gap-3">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-xl text-gray-900">
                          ₦{item.price.toLocaleString('en-NG')}
                        </span>
                        <div className="flex items-center text-sm text-gray-500 bg-gray-50 px-3 py-1.5 rounded-full">
                          <Clock className="w-4 h-4 mr-1.5 text-gray-400" />
                          <span className="font-medium">{item.restaurant.delivery_time}</span>
                        </div>
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <div className="flex items-center bg-gray-50 px-3 py-1.5 rounded-full">
                          <MapPin className="h-3.5 w-3.5 mr-1.5 text-gray-400" />
                          <span className="font-medium">{item.restaurant.distance_km.toFixed(1)} km</span>
                        </div>
                        {item.restaurant.delivery_fee > 0 && (
                          <>
                            <span className="mx-2 text-gray-300">•</span>
                            <span className="font-medium">
                              ₦{item.restaurant.delivery_fee.toLocaleString('en-NG')} delivery
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-4">
                      <div className="flex items-center border rounded-lg overflow-hidden">
                        <button
                          aria-label="Decrease quantity"
                          title="Decrease quantity"
                          className="h-10 w-10 flex items-center justify-center bg-gray-100 hover:bg-gray-200 transition-colors"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            updateQuantity(item.id, (quantities[item.id] || 1) - 1);
                          }}
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="w-10 text-center font-medium">
                          {quantities[item.id] || 1}
                        </span>
                        <button
                          aria-label="Increase quantity"
                          title="Increase quantity"
                          className="h-10 w-10 flex items-center justify-center bg-gray-100 hover:bg-gray-200 transition-colors"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            updateQuantity(item.id, (quantities[item.id] || 1) + 1);
                          }}
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                      <button 
                        className="flex-1 bg-primary hover:bg-primary/90 text-white font-medium py-2.5 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          const quantity = quantities[item.id] || 1;
                          for (let i = 0; i < quantity; i++) {
                            handleAddToCart(item);
                          }
                        }}
                      >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Add {quantities[item.id] > 1 ? `${quantities[item.id]}x` : ''}
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {menuItems.length === 0 && (
              <div className="col-span-full text-center py-12">
                <h3 className="text-lg font-medium text-gray-900 mb-2">No menu items found</h3>
                <p className="text-gray-500">Try adjusting your search or filters</p>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Index;
