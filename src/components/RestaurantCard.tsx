import { Star, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Restaurant {
  id: string;
  name: string;
  image: string;
  rating: number;
  reviewCount: number;
  cuisine: string[];
  deliveryTime: string;
  isOpen: boolean;
  discount?: string;
}

interface RestaurantCardProps {
  restaurant: Restaurant;
}

const RestaurantCard = ({ restaurant }: RestaurantCardProps) => {
  return (
    <Card className="overflow-hidden cursor-pointer transition-all hover:shadow-lg group">
      <div className="relative">
        <img
          src={restaurant.image}
          alt={restaurant.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {restaurant.discount && (
          <Badge className="absolute top-3 left-3 bg-destructive text-destructive-foreground">
            {restaurant.discount}
          </Badge>
        )}
        
        {!restaurant.isOpen && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <Badge variant="secondary" className="text-sm">
              <Clock className="h-3 w-3 mr-1" />
              Opens at 08:00 AM
            </Badge>
          </div>
        )}
      </div>
      
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
          {restaurant.name}
        </h3>
        
        <p className="text-muted-foreground text-sm mb-3">
          {restaurant.cuisine.join(", ")}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="font-medium">{restaurant.rating}</span>
            <span className="text-muted-foreground text-sm">
              ({restaurant.reviewCount}+ Ratings)
            </span>
          </div>
          
          <span className="text-sm text-muted-foreground">
            {restaurant.deliveryTime}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default RestaurantCard;