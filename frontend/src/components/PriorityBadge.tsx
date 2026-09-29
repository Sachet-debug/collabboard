import { TaskPriority } from "../types";

const styles: Record<TaskPriority, string> = {
  low: "bg-emerald-100 text-emerald-700",
  medium: "bg-amber-100 text-amber-700",
  high: "bg-red-100 text-red-700",
};

const PriorityBadge = ({ priority }: { priority: TaskPriority }) => (
  <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full capitalize ${styles[priority]}`}>
    {priority}
  </span>
);

export default PriorityBadge;
