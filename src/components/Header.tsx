import { Search, MapPin, ShoppingCart, User, Menu } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import heyfoodLogo from "@/assets/heyfood-logo.png";

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const Header = ({ searchQuery, onSearchChange }: HeaderProps) => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Mobile Menu Button */}
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>

          {/* Logo */}
          <div className="flex items-center gap-2">
            <img 
              src={heyfoodLogo} 
              alt="HeyFood" 
              className="h-10 w-10 rounded-full"
            />
            <span className="hidden font-bold text-xl md:inline">HeyFood</span>
          </div>

          {/* Location */}
          <div className="hidden md:flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span className="text-sm">Set Location</span>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search restaurants or food"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Auth & Cart */}
          <div className="flex items-center gap-4">
            <Button variant="ghost" className="hidden md:flex">
              <User className="h-4 w-4 mr-2" />
              Sign In
            </Button>
            
            <Button variant="ghost" className="relative">
              <ShoppingCart className="h-4 w-4" />
              <span className="ml-2 hidden md:inline">Cart</span>
              <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full text-xs h-5 w-5 flex items-center justify-center">
                0
              </span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;