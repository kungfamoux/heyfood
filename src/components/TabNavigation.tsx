import { Utensils, ShoppingBasket } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TabNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const TabNavigation = ({ activeTab, onTabChange }: TabNavigationProps) => {
  return (
    <div className="py-4">
      <div className="container mx-auto px-4">
        <div className="flex gap-2">
          <Button
            variant={activeTab === "restaurants" ? "default" : "ghost"}
            className={`
              flex items-center gap-2 px-6 py-3 rounded-full
              ${activeTab === "restaurants" 
                ? "bg-primary text-primary-foreground" 
                : "text-muted-foreground hover:text-foreground"
              }
            `}
            onClick={() => onTabChange("restaurants")}
          >
            <Utensils className="h-4 w-4" />
            Restaurants
          </Button>
          
          <Button
            variant={activeTab === "grocery" ? "default" : "ghost"}
            className={`
              flex items-center gap-2 px-6 py-3 rounded-full
              ${activeTab === "grocery" 
                ? "bg-primary text-primary-foreground" 
                : "text-muted-foreground hover:text-foreground"
              }
            `}
            onClick={() => onTabChange("grocery")}
          >
            <ShoppingBasket className="h-4 w-4" />
            Grocery
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TabNavigation;