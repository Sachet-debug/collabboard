import express from "express";
import {
  createBoard,
  getBoards,
  getBoardById,
  updateBoard,
  deleteBoard,
  addMember,
} from "../controllers/boardController";
import { protect } from "../middleware/auth";

const router = express.Router();

router.use(protect); // all board routes require auth

router.route("/").post(createBoard).get(getBoards);
router.route("/:id").get(getBoardById).put(updateBoard).delete(deleteBoard);
router.post("/:id/members", addMember);

export default router;
