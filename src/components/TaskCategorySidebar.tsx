import { taskCategories } from "@/data/mockData";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

interface TaskCategorySidebarProps {
  activeCategory: string;
  onCategoryChange: (key: string) => void;
  categoryCounts: Record<string, number>;
}

export function TaskCategorySidebar({ activeCategory, onCategoryChange, categoryCounts }: TaskCategorySidebarProps) {
  return (
    <ScrollArea className="w-52 border-r shrink-0 hidden lg:block">
      <div className="p-2 space-y-0.5">
        {taskCategories.map((cat) => {
          const count = categoryCounts[cat.key] ?? 0;
          return (
            <button
              key={cat.key}
              onClick={() => onCategoryChange(cat.key)}
              className={cn(
                "w-full text-left px-3 py-2 rounded-lg text-xs transition-colors flex items-center justify-between",
                activeCategory === cat.key
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              )}
            >
              <span className="truncate">{cat.label}</span>
              {count > 0 && (
                <span className={cn(
                  "text-[10px] min-w-[18px] text-center rounded-full px-1",
                  activeCategory === cat.key ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
                )}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </ScrollArea>
  );
}
