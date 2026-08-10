import mongoose, { Schema } from "mongoose";
import { IBoard } from "../types";

const boardSchema = new Schema<IBoard>({
  title: { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
  members: [
    {
      user: { type: Schema.Types.ObjectId, ref: "User", required: true },
      role: { type: String, enum: ["admin", "member"], default: "member" },
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IBoard>("Board", boardSchema);
