import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface TaskFiltersBarProps {
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

export function TaskFiltersBar({
  categoryFilter, taskTypeFilter, statusFilter, priorityFilter, labFilter, localSearch,
  onCategoryChange, onTaskTypeChange, onStatusChange, onPriorityChange, onLabChange, onLocalSearchChange,
  taskTypes, labs,
}: TaskFiltersBarProps) {
  return (
    <div className="flex items-center gap-2 flex-wrap mb-4">
      <Select value={categoryFilter} onValueChange={onCategoryChange}>
        <SelectTrigger className="w-[180px] h-8 text-xs"><SelectValue placeholder="Task Category" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="my_tasks">Your Tasks</SelectItem>
          <SelectItem value="completed">Completed Tasks</SelectItem>
          <SelectItem value="assigned_others">Assigned to Other</SelectItem>
          <SelectItem value="all">All Assigned</SelectItem>
          <SelectItem value="waiting_practice">Waiting on Practice</SelectItem>
        </SelectContent>
      </Select>
      <div className="relative flex-1 min-w-[180px] max-w-xs">
        <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search patient..."
          value={localSearch}
          onChange={(e) => onLocalSearchChange(e.target.value)}
          className="pl-8 h-8 text-xs bg-secondary border-0"
        />
      </div>
      <Select value={taskTypeFilter} onValueChange={onTaskTypeChange}>
        <SelectTrigger className="w-[150px] h-8 text-xs"><SelectValue placeholder="Task Type" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Types</SelectItem>
          {taskTypes.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
        </SelectContent>
      </Select>
      <Select value={statusFilter} onValueChange={onStatusChange}>
        <SelectTrigger className="w-[130px] h-8 text-xs"><SelectValue placeholder="Status" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="pending">Pending</SelectItem>
          <SelectItem value="in_progress">In Progress</SelectItem>
          <SelectItem value="completed">Completed</SelectItem>
          <SelectItem value="skipped">Skipped</SelectItem>
        </SelectContent>
      </Select>
      <Select value={priorityFilter} onValueChange={onPriorityChange}>
        <SelectTrigger className="w-[120px] h-8 text-xs"><SelectValue placeholder="Priority" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Priority</SelectItem>
          <SelectItem value="high">High</SelectItem>
          <SelectItem value="medium">Medium</SelectItem>
          <SelectItem value="low">Low</SelectItem>
        </SelectContent>
      </Select>
      <Select value={labFilter} onValueChange={onLabChange}>
        <SelectTrigger className="w-[120px] h-8 text-xs"><SelectValue placeholder="Lab" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Labs</SelectItem>
          {labs.map((l) => <SelectItem key={l} value={l}>{l}</SelectItem>)}
        </SelectContent>
      </Select>
    </div>
  );
}
