import { useEffect, useState, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import {
  fetchBoardById,
  fetchListsByBoard,
  fetchTasksByBoard,
  createList as createListApi,
  createTask as createTaskApi,
  moveTask as moveTaskApi,
} from "../api/boardApi";
import { Board, List, Task } from "../types";
import ListColumn from "../components/ListColumn";
import AddListForm from "../components/AddListForm";
import { useSocket, emitBoardChange } from "../hooks/useSocket";

const BoardView = () => {
  const { boardId } = useParams<{ boardId: string }>();

  const [board, setBoard] = useState<Board | null>(null);
  const [lists, setLists] = useState<List[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!boardId) return;
    loadBoardData(boardId, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [boardId]);

  const loadBoardData = async (id: string, showSpinner: boolean) => {
    if (showSpinner) setLoading(true);
    setError("");
    try {
      const [boardRes, listsRes, tasksRes] = await Promise.all([
        fetchBoardById(id),
        fetchListsByBoard(id),
        fetchTasksByBoard(id),
      ]);
      setBoard(boardRes.data);
      setLists(listsRes.data);
      setTasks(tasksRes.data);
    } catch (err) {
      if (showSpinner) {
        setError("Couldn't load this board. It may not exist or you may not have access.");
      }
    } finally {
      if (showSpinner) setLoading(false);
    }
  };

  // Called whenever ANOTHER user's action arrives via Socket.io — quietly
  // re-sync this board's data without showing a loading spinner.
  const handleRemoteChange = useCallback(() => {
    if (boardId) loadBoardData(boardId, false);
  }, [boardId]);

  useSocket(boardId, handleRemoteChange);

  const handleAddList = async (title: string) => {
    if (!boardId) return;
    const { data } = await createListApi(title, boardId);
    setLists((prev) => [...prev, data]);
    emitBoardChange("listCreated", boardId, data);
  };

  const handleAddTask = async (listId: string, title: string) => {
    if (!boardId) return;
    const { data } = await createTaskApi(title, listId, boardId);
    setTasks((prev) => [...prev, data]);
    emitBoardChange("taskCreated", boardId, data);
  };

  const handleDragEnd = async (result: DropResult) => {
    const { source, destination, draggableId } = result;

    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) {
      return;
    }

    const sourceListId = source.droppableId;
    const destListId = destination.droppableId;
    const taskId = draggableId;

    const previousTasks = tasks;

    setTasks((prev) => {
      const updated = [...prev];

      const sourceTasks = updated
        .filter((t) => t.list === sourceListId && t._id !== taskId)
        .sort((a, b) => a.order - b.order);

      const destTasks = updated
        .filter((t) => t.list === destListId && t._id !== taskId)
        .sort((a, b) => a.order - b.order);

      const movedTask = updated.find((t) => t._id === taskId);
      if (!movedTask) return prev;

      const newDestTasks = [...destTasks];
      newDestTasks.splice(destination.index, 0, { ...movedTask, list: destListId });

      const reSequencedSource = sourceTasks.map((t, i) => ({ ...t, order: i }));
      const reSequencedDest = newDestTasks.map((t, i) => ({ ...t, order: i }));

      const untouched = updated.filter(
        (t) => t.list !== sourceListId && t.list !== destListId
      );

      return [...untouched, ...reSequencedSource, ...reSequencedDest];
    });

    try {
      if (!boardId) return;
      await moveTaskApi(taskId, sourceListId, destListId, destination.index);
      emitBoardChange("taskMoved", boardId, {
        taskId,
        sourceListId,
        destListId,
        destOrder: destination.index,
      });
    } catch (err) {
      setTasks(previousTasks);
      setError("Couldn't save that move — please try again.");
      setTimeout(() => setError(""), 3000);
    }
  };

  if (loading) {
    return <div className="p-8 text-sm text-ink/50">Loading board...</div>;
  }

  if (error && !board) {
    return (
      <div className="p-8">
        <Link to="/dashboard" className="text-sm text-accent hover:underline">
          ← Back to boards
        </Link>
        <p className="text-sm text-red-600 mt-4">{error}</p>
      </div>
    );
  }

  if (!board) return null;

  return (
    <div className="min-h-screen flex flex-col">
      <div className="px-8 py-5 border-b border-line">
        <Link to="/dashboard" className="text-sm text-accent hover:underline">
          ← Back to boards
        </Link>
        <h1 className="text-xl font-semibold text-ink mt-2">{board.title}</h1>
        {board.description && (
          <p className="text-sm text-ink/60 mt-0.5">{board.description}</p>
        )}
        {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
      </div>

      <div className="flex-1 overflow-x-auto px-8 py-6">
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="flex gap-4 h-full items-start">
            {lists
              .sort((a, b) => a.order - b.order)
              .map((list) => (
                <ListColumn
                  key={list._id}
                  list={list}
                  tasks={tasks.filter((t) => t.list === list._id)}
                  onAddTask={handleAddTask}
                />
              ))}
            <AddListForm onAdd={handleAddList} />
          </div>
        </DragDropContext>
      </div>
    </div>
  );
};

export default BoardView;
