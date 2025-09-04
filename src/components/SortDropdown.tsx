import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export type SortOption = "most-popular" | "highest-rated" | "newest" | "most-rated";

interface SortDropdownProps {
  currentSort: SortOption;
  onSortChange: (sort: SortOption) => void;
  storeCount: number;
}

const sortOptions = [
  { value: "most-popular" as const, label: "Most Popular" },
  { value: "highest-rated" as const, label: "Highest rated" },
  { value: "newest" as const, label: "Newest" },
  { value: "most-rated" as const, label: "Most Rated" },
];

const SortDropdown = ({ currentSort, onSortChange, storeCount }: SortDropdownProps) => {
  const currentSortLabel = sortOptions.find(option => option.value === currentSort)?.label;

  return (
    <div className="flex items-center justify-between mb-6">
      <div className="text-lg font-semibold">
        All Stores
        <span className="text-muted-foreground ml-2">({storeCount} Stores)</span>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="min-w-[150px] justify-between">
            <span className="flex items-center gap-2">
              <span className="text-sm">Sort</span>
              <span className="font-medium">{currentSortLabel}</span>
            </span>
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        
        <DropdownMenuContent align="end" className="w-48 bg-background border">
          {sortOptions.map((option) => (
            <DropdownMenuItem
              key={option.value}
              onClick={() => onSortChange(option.value)}
              className={`cursor-pointer ${
                currentSort === option.value ? 'bg-primary/10 text-primary' : ''
              }`}
            >
              {option.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default SortDropdown;