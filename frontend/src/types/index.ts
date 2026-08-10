// These mirror the backend interfaces (backend/src/types/index.ts)
// Keeping frontend/backend types in sync is one of the biggest wins of using
// TypeScript across a full-stack project — you catch API contract mismatches
// at compile time instead of at runtime.

export interface User {
  id: string;
  name: string;
  email: string;
  avatarColor: string;
}

export type BoardRole = "admin" | "member";

export interface BoardMember {
  user: User;
  role: BoardRole;
}

export interface Board {
  _id: string;
  title: string;
  description?: string;
  owner: string;
  members: BoardMember[];
  createdAt: string;
}

export interface List {
  _id: string;
  title: string;
  board: string;
  order: number;
}

export type TaskPriority = "low" | "medium" | "high";

export interface Task {
  _id: string;
  title: string;
  description?: string;
  list: string;
  board: string;
  assignees: User[];
  priority: TaskPriority;
  dueDate?: string;
  order: number;
}

export interface AuthResponse {
  token: string;
  user: User;
}
