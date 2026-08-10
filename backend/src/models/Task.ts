import mongoose, { Schema } from "mongoose";
import { ITask } from "../types";

const taskSchema = new Schema<ITask>({
  title: { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  list: { type: Schema.Types.ObjectId, ref: "List", required: true },
  board: { type: Schema.Types.ObjectId, ref: "Board", required: true },
  assignees: [{ type: Schema.Types.ObjectId, ref: "User" }],
  priority: { type: String, enum: ["low", "medium", "high"], default: "medium" },
  dueDate: { type: Date },
  order: { type: Number, required: true, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<ITask>("Task", taskSchema);
