import { Badge } from "@/components/ui/badge";

interface Category {
  id: string;
  name: string;
  icon: string;
}

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: string | null;
  onCategorySelect: (categoryId: string | null) => void;
}

const CategoryFilter = ({ categories, selectedCategory, onCategorySelect }: CategoryFilterProps) => {
  return (
    <div className="py-6">
      <div className="container mx-auto px-4">
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((category) => (
            <Badge
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "secondary"}
              className={`
                flex items-center gap-2 px-4 py-2 cursor-pointer whitespace-nowrap
                transition-colors hover:bg-primary/90 hover:text-primary-foreground
                ${selectedCategory === category.id ? 'bg-primary text-primary-foreground' : ''}
              `}
              onClick={() => 
                onCategorySelect(selectedCategory === category.id ? null : category.id)
              }
            >
              <span className="text-lg">{category.icon}</span>
              <span className="text-sm font-medium">{category.name}</span>
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryFilter;