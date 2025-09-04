import { useState, useMemo } from "react";
import Header from "@/components/Header";
import TabNavigation from "@/components/TabNavigation";
import CategoryFilter from "@/components/CategoryFilter";
import BannerCarousel from "@/components/BannerCarousel";
import SortDropdown, { SortOption } from "@/components/SortDropdown";
import RestaurantCard from "@/components/RestaurantCard";
import { categories, restaurants } from "@/data/mockData";

const Index = () => {
  const [activeTab, setActiveTab] = useState("restaurants");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortOption, setSortOption] = useState<SortOption>("most-popular");

  // Filter and sort restaurants
  const filteredAndSortedRestaurants = useMemo(() => {
    let filtered = [...restaurants];

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(restaurant =>
        restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        restaurant.cuisine.some(c => c.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter(restaurant =>
        restaurant.tags.includes(selectedCategory)
      );
    }

    // Sort restaurants
    switch (sortOption) {
      case "highest-rated":
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case "newest":
        // For demo purposes, reverse order to simulate newest
        filtered.reverse();
        break;
      case "most-rated":
        filtered.sort((a, b) => b.reviewCount - a.reviewCount);
        break;
      case "most-popular":
      default:
        // Keep default order for most popular
        break;
    }

    return filtered;
  }, [searchQuery, selectedCategory, sortOption]);

  if (activeTab === "grocery") {
    return (
      <div className="min-h-screen bg-background">
        <Header searchQuery={searchQuery} onSearchChange={setSearchQuery} />
        <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
        <div className="container mx-auto px-4 py-20">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Grocery Section</h2>
            <p className="text-muted-foreground">Coming Soon!</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
      <CategoryFilter 
        categories={categories}
        selectedCategory={selectedCategory}
        onCategorySelect={setSelectedCategory}
      />
      <BannerCarousel />
      
      <div className="container mx-auto px-4 py-6">
        <SortDropdown 
          currentSort={sortOption}
          onSortChange={setSortOption}
          storeCount={filteredAndSortedRestaurants.length}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredAndSortedRestaurants.map((restaurant) => (
            <RestaurantCard key={restaurant.id} restaurant={restaurant} />
          ))}
        </div>

        {filteredAndSortedRestaurants.length === 0 && (
          <div className="text-center py-20">
            <h3 className="text-xl font-semibold mb-2">No restaurants found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search or filters
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
