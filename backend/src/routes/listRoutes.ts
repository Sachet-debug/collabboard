import express from "express";
import {
  createList,
  getListsByBoard,
  updateList,
  reorderLists,
  deleteList,
} from "../controllers/listController";
import { protect } from "../middleware/auth";

const router = express.Router();

router.use(protect);

router.route("/").post(createList);
router.get("/board/:boardId", getListsByBoard);
router.put("/reorder", reorderLists);
router.route("/:id").put(updateList).delete(deleteList);

export default router;
