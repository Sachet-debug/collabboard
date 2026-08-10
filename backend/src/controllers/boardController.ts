import { Response } from "express";
import Board from "../models/Board";
import List from "../models/List";
import Task from "../models/Task";
import User from "../models/User";
import { AuthRequest } from "../types";

// @route  POST /api/boards
export const createBoard = async (req: AuthRequest, res: Response) => {
  try {
    const { title, description } = req.body;
    const board = await Board.create({
      title,
      description,
      owner: req.userId,
      members: [{ user: req.userId, role: "admin" }],
    });
    res.status(201).json(board);
  } catch (error) {
    res.status(500).json({ message: "Failed to create board", error });
  }
};

// @route  GET /api/boards  (all boards the user is a member of)
export const getBoards = async (req: AuthRequest, res: Response) => {
  try {
    const boards = await Board.find({ "members.user": req.userId }).sort({ createdAt: -1 });
    res.json(boards);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch boards", error });
  }
};

// @route  GET /api/boards/:id
export const getBoardById = async (req: AuthRequest, res: Response) => {
  try {
    const board = await Board.findById(req.params.id).populate("members.user", "name email avatarColor");
    if (!board) return res.status(404).json({ message: "Board not found" });
    res.json(board);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch board", error });
  }
};

// @route  PUT /api/boards/:id
export const updateBoard = async (req: AuthRequest, res: Response) => {
  try {
    const board = await Board.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!board) return res.status(404).json({ message: "Board not found" });
    res.json(board);
  } catch (error) {
    res.status(500).json({ message: "Failed to update board", error });
  }
};

// @route  DELETE /api/boards/:id  (cascades to lists + tasks)
export const deleteBoard = async (req: AuthRequest, res: Response) => {
  try {
    const boardId = req.params.id;
    await Task.deleteMany({ board: boardId });
    await List.deleteMany({ board: boardId });
    await Board.findByIdAndDelete(boardId);
    res.json({ message: "Board deleted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete board", error });
  }
};

// @route  POST /api/boards/:id/members  (invite by email)
export const addMember = async (req: AuthRequest, res: Response) => {
  try {
    const { email, role } = req.body;
    const board = await Board.findById(req.params.id);
    if (!board) return res.status(404).json({ message: "Board not found" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "No user with that email" });

    const alreadyMember = board.members.some((m) => m.user.toString() === user._id.toString());
    if (alreadyMember) return res.status(400).json({ message: "User already a member" });

    board.members.push({ user: user._id, role: role || "member" });
    await board.save();
    res.json(board);
  } catch (error) {
    res.status(500).json({ message: "Failed to add member", error });
  }
};
