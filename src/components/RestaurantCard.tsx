import { Star, Clock, MapPin, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export interface Restaurant {
  id: string;
  name: string;
  image: string;
  rating: number;
  reviewCount: number;
  cuisine: string;
  deliveryTime: string;
  isOpen: boolean;
  discount?: string;
  tags: string[];
  deliveryFee: string;
  minOrder: string;
  distance: string;
}

interface RestaurantCardProps {
  restaurant: Restaurant;
}

const RestaurantCard = ({ restaurant }: RestaurantCardProps) => {
  return (
    <Card className="overflow-hidden cursor-pointer transition-all hover:shadow-lg group border border-gray-200 rounded-xl">
      <div className="relative">
        <div className="relative aspect-video">
          <img
            src={restaurant.image}
            alt={restaurant.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          
          {restaurant.discount && (
            <Badge className="absolute top-2 left-2 bg-orange-500 hover:bg-orange-600 text-white border-0 text-xs font-medium">
              {restaurant.discount}
            </Badge>
          )}
          
          {!restaurant.isOpen && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <Badge variant="secondary" className="bg-white/90 text-gray-800 text-xs">
                <Clock className="h-3 w-3 mr-1" />
                Opens at 08:00 AM
              </Badge>
            </div>
          )}
        </div>
        
        {/* Tags */}
        {restaurant.tags && restaurant.tags.length > 0 && (
          <div className="absolute bottom-2 left-2 flex gap-1">
            {restaurant.tags.slice(0, 2).map((tag, index) => (
              <Badge 
                key={index} 
                variant="secondary" 
                className="bg-white/90 text-gray-800 text-xs font-medium border-0"
              >
                {tag}
              </Badge>
            ))}
            {restaurant.tags.length > 2 && (
              <Badge variant="secondary" className="bg-white/90 text-gray-800 text-xs border-0">
                +{restaurant.tags.length - 2}
              </Badge>
            )}
          </div>
        )}
      </div>
      
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <h3 className="font-bold text-lg text-gray-900 mb-1 line-clamp-1">
            {restaurant.name}
          </h3>
          <div className="flex items-center bg-gray-100 rounded-full px-2 py-0.5">
            <Star className="h-3.5 w-3.5 text-yellow-500 fill-yellow-500 mr-1" />
            <span className="text-xs font-medium text-gray-800">
              {restaurant.rating.toFixed(1)}
            </span>
          </div>
        </div>
        
        <p className="text-muted-foreground text-sm mb-3">
          {restaurant.cuisine}
        </p>
        
        <div className="flex items-center text-sm text-gray-500 mb-3">
          <div className="flex items-center">
            <MapPin className="h-3.5 w-3.5 mr-1" />
            <span className="text-xs">{restaurant.distance || '1.2 km'}</span>
            <span className="mx-1.5">•</span>
          </div>
          <div className="flex items-center">
            <Clock className="h-3.5 w-3.5 mr-1" />
            <span className="text-xs">{restaurant.deliveryTime}</span>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-1.5 mb-3">
          {restaurant.tags.map((tag, index) => (
            <Badge 
              key={index} 
              variant="outline" 
              className="text-xs text-gray-600 border-gray-200 bg-gray-50"
            >
              {tag}
            </Badge>
          ))}
        </div>
        
        <div className="flex items-center justify-between text-xs text-gray-500 border-t border-gray-100 pt-3">
          <div>
            {restaurant.deliveryFee ? (
              <span>Delivery: {restaurant.deliveryFee}</span>
            ) : (
              <span className="text-green-600 font-medium">Free delivery</span>
            )}
            {restaurant.minOrder && (
              <span className="mx-1.5">•</span>
            )}
            {restaurant.minOrder && (
              <span>Min. order: {restaurant.minOrder}</span>
            )}
          </div>
          <ChevronRight className="h-4 w-4 text-gray-400" />
        </div>
      </CardContent>
    </Card>
  );
};

export default RestaurantCard;