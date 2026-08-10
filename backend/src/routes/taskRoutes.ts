import express from "express";
import {
  createTask,
  getTasksByBoard,
  updateTask,
  moveTask,
  deleteTask,
} from "../controllers/taskController";
import { protect } from "../middleware/auth";

const router = express.Router();

router.use(protect);

router.route("/").post(createTask);
router.get("/board/:boardId", getTasksByBoard);
router.put("/move", moveTask);
router.route("/:id").put(updateTask).delete(deleteTask);

export default router;
