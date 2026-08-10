import { Request } from "express";
import { Document, Types } from "mongoose";

// ---------- User ----------
export interface IUser extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  avatarColor: string;
  createdAt: Date;
  comparePassword(candidate: string): Promise<boolean>;
}

// ---------- Board ----------
export type BoardRole = "admin" | "member";

export interface IBoardMember {
  user: Types.ObjectId;
  role: BoardRole;
}

export interface IBoard extends Document {
  _id: Types.ObjectId;
  title: string;
  description?: string;
  owner: Types.ObjectId;
  members: IBoardMember[];
  createdAt: Date;
}

// ---------- List ----------
export interface IList extends Document {
  _id: Types.ObjectId;
  title: string;
  board: Types.ObjectId;
  order: number;
  createdAt: Date;
}

// ---------- Task ----------
export type TaskPriority = "low" | "medium" | "high";

export interface ITask extends Document {
  _id: Types.ObjectId;
  title: string;
  description?: string;
  list: Types.ObjectId;
  board: Types.ObjectId;
  assignees: Types.ObjectId[];
  priority: TaskPriority;
  dueDate?: Date;
  order: number;
  createdAt: Date;
}

// ---------- Auth ----------
export interface AuthRequest extends Request {
  userId?: string;
}

export interface JwtPayload {
  userId: string;
}
