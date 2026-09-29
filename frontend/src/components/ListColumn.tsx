import { useState, FormEvent } from "react";
import { Droppable } from "@hello-pangea/dnd";
import { List, Task } from "../types";
import TaskCard from "./TaskCard";

interface Props {
  list: List;
  tasks: Task[];
  onAddTask: (listId: string, title: string) => Promise<void>;
}

const ListColumn = ({ list, tasks, onAddTask }: Props) => {
  const [adding, setAdding] = useState(false);
  const [title, setTitle] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setSubmitting(true);
    try {
      await onAddTask(list._id, title.trim());
      setTitle("");
      setAdding(false);
    } finally {
      setSubmitting(false);
    }
  };

  const sortedTasks = [...tasks].sort((a, b) => a.order - b.order);

  return (
    <div className="w-72 shrink-0 bg-canvas rounded-lg border border-line flex flex-col max-h-full">
      <div className="px-3 py-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-ink">{list.title}</h3>
        <span className="text-xs text-ink/40">{tasks.length}</span>
      </div>

      <Droppable droppableId={list._id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex-1 overflow-y-auto px-3 space-y-2 pb-2 min-h-[40px] transition-colors rounded-md ${
              snapshot.isDraggingOver ? "bg-accent/5" : ""
            }`}
          >
            {sortedTasks.map((task, index) => (
              <TaskCard key={task._id} task={task} index={index} />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>

      <div className="p-3 pt-1">
        {adding ? (
          <form onSubmit={handleSubmit} className="space-y-2">
            <input
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Escape") {
                  setAdding(false);
                  setTitle("");
                }
              }}
              placeholder="Task title"
              className="w-full rounded-md border border-line bg-white px-2.5 py-2 text-sm outline-none focus:border-accent focus:ring-1 focus:ring-accent"
            />
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={submitting}
                className="text-xs font-medium bg-accent text-white px-3 py-1.5 rounded-md hover:bg-accentDark transition disabled:opacity-60"
              >
                {submitting ? "Adding..." : "Add"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setAdding(false);
                  setTitle("");
                }}
                className="text-xs font-medium text-ink/50 hover:text-ink px-2"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <button
            onClick={() => setAdding(true)}
            className="w-full text-left text-sm text-ink/50 hover:text-ink hover:bg-white rounded-md px-2.5 py-2 transition"
          >
            + Add a task
          </button>
        )}
      </div>
    </div>
  );
};

export default ListColumn;
