import { Draggable } from "@hello-pangea/dnd";
import { Task } from "../types";
import PriorityBadge from "./PriorityBadge";

interface Props {
  task: Task;
  index: number;
}

const TaskCard = ({ task, index }: Props) => {
  return (
    <Draggable draggableId={task._id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`bg-white border border-line rounded-md p-3 shadow-sm hover:shadow-md transition cursor-grab active:cursor-grabbing ${
            snapshot.isDragging ? "shadow-lg ring-2 ring-accent/40" : ""
          }`}
        >
          <p className="text-sm text-ink font-medium">{task.title}</p>

          {task.description && (
            <p className="text-xs text-ink/50 mt-1 line-clamp-2">{task.description}</p>
          )}

          <div className="flex items-center justify-between mt-3">
            <PriorityBadge priority={task.priority} />

            {task.assignees.length > 0 && (
              <div className="flex -space-x-1.5">
                {task.assignees.slice(0, 3).map((a) => (
                  <div
                    key={a.id}
                    title={a.name}
                    className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-medium text-white border-2 border-white"
                    style={{ backgroundColor: a.avatarColor || "#3D5A80" }}
                  >
                    {a.name?.[0]?.toUpperCase()}
                  </div>
                ))}
              </div>
            )}
          </div>

          {task.dueDate && (
            <p className="text-[11px] text-ink/40 mt-2">
              Due {new Date(task.dueDate).toLocaleDateString()}
            </p>
          )}
        </div>
      )}
    </Draggable>
  );
};

export default TaskCard;
