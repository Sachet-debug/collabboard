import mongoose, { Schema } from "mongoose";
import { IList } from "../types";

const listSchema = new Schema<IList>({
  title: { type: String, required: true, trim: true },
  board: { type: Schema.Types.ObjectId, ref: "Board", required: true },
  order: { type: Number, required: true, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IList>("List", listSchema);
