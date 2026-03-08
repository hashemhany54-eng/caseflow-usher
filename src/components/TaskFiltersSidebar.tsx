import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface FilterOption {
  value: string;
  label: string;
}

interface TaskFiltersSidebarProps {
  categoryFilter: string;
  taskTypeFilter: string;
  statusFilter: string;
  priorityFilter: string;
  labFilter: string;
  localSearch: string;
  onCategoryChange: (v: string) => void;
  onTaskTypeChange: (v: string) => void;
  onStatusChange: (v: string) => void;
  onPriorityChange: (v: string) => void;
  onLabChange: (v: string) => void;
  onLocalSearchChange: (v: string) => void;
  taskTypes: string[];
  labs: string[];
}

const categoryOptions: FilterOption[] = [
  { value: "my_tasks", label: "Your Tasks" },
  { value: "completed", label: "Completed" },
  { value: "assigned_others", label: "Assigned to Other" },
  { value: "all", label: "All Assigned" },
  { value: "waiting_practice", label: "Waiting on Practice" },
];

const statusOptions: FilterOption[] = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "in_progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
  { value: "skipped", label: "Skipped" },
];

const priorityOptions: FilterOption[] = [
  { value: "all", label: "All" },
  { value: "high", label: "High" },
  { value: "medium", label: "Medium" },
  { value: "low", label: "Low" },
];

function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <h3 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70 px-3">
        {title}
      </h3>
      <div className="space-y-0.5">{children}</div>
    </div>
  );
}

function FilterButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full text-left px-3 py-1.5 rounded-md text-xs transition-colors",
        active
          ? "bg-primary/10 text-primary font-medium"
          : "text-muted-foreground hover:bg-secondary hover:text-foreground"
      )}
    >
      {label}
    </button>
  );
}

export function TaskFiltersSidebar({
  categoryFilter, taskTypeFilter, statusFilter, priorityFilter, labFilter, localSearch,
  onCategoryChange, onTaskTypeChange, onStatusChange, onPriorityChange, onLabChange, onLocalSearchChange,
  taskTypes, labs,
}: TaskFiltersSidebarProps) {
  const allTypesOptions: FilterOption[] = [
    { value: "all", label: "All" },
    ...taskTypes.map((t) => ({ value: t, label: t })),
  ];

  const allLabOptions: FilterOption[] = [
    { value: "all", label: "All" },
    ...labs.map((l) => ({ value: l, label: l })),
  ];

  return (
    <div className="w-52 border-r shrink-0 hidden lg:flex flex-col h-full">
      <div className="p-3">
        <div className="relative">
          <Search className="absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search patient..."
            value={localSearch}
            onChange={(e) => onLocalSearchChange(e.target.value)}
            className="pl-7 h-8 text-xs bg-secondary border-0"
          />
        </div>
      </div>
      <ScrollArea className="flex-1">
        <div className="px-2 pb-4 space-y-5">
          <FilterSection title="Category">
            {categoryOptions.map((opt) => (
              <FilterButton
                key={opt.value}
                label={opt.label}
                active={categoryFilter === opt.value}
                onClick={() => onCategoryChange(opt.value)}
              />
            ))}
          </FilterSection>

          <FilterSection title="Task Type">
            {allTypesOptions.map((opt) => (
              <FilterButton
                key={opt.value}
                label={opt.label}
                active={taskTypeFilter === opt.value}
                onClick={() => onTaskTypeChange(opt.value)}
              />
            ))}
          </FilterSection>

          <FilterSection title="Status">
            {statusOptions.map((opt) => (
              <FilterButton
                key={opt.value}
                label={opt.label}
                active={statusFilter === opt.value}
                onClick={() => onStatusChange(opt.value)}
              />
            ))}
          </FilterSection>

          <FilterSection title="Priority">
            {priorityOptions.map((opt) => (
              <FilterButton
                key={opt.value}
                label={opt.label}
                active={priorityFilter === opt.value}
                onClick={() => onPriorityChange(opt.value)}
              />
            ))}
          </FilterSection>

          {allLabOptions.length > 1 && (
            <FilterSection title="Lab">
              {allLabOptions.map((opt) => (
                <FilterButton
                  key={opt.value}
                  label={opt.label}
                  active={labFilter === opt.value}
                  onClick={() => onLabChange(opt.value)}
                />
              ))}
            </FilterSection>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
