import api from "./axios";
import { Board, List, Task } from "../types";

// ---------- Boards ----------
export const fetchBoards = () => api.get<Board[]>("/boards");
export const fetchBoardById = (id: string) => api.get<Board>(`/boards/${id}`);
export const createBoard = (title: string, description?: string) =>
  api.post<Board>("/boards", { title, description });

// ---------- Lists ----------
export const fetchListsByBoard = (boardId: string) =>
  api.get<List[]>(`/lists/board/${boardId}`);
export const createList = (title: string, board: string) =>
  api.post<List>("/lists", { title, board });

// ---------- Tasks ----------
export const fetchTasksByBoard = (boardId: string) =>
  api.get<Task[]>(`/tasks/board/${boardId}`);
export const createTask = (
  title: string,
  list: string,
  board: string,
  priority: "low" | "medium" | "high" = "medium"
) => api.post<Task>("/tasks", { title, list, board, priority });
export const moveTask = (
  taskId: string,
  sourceListId: string,
  destListId: string,
  destOrder: number
) => api.put("/tasks/move", { taskId, sourceListId, destListId, destOrder });
