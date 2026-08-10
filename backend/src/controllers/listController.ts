import { Response } from "express";
import List from "../models/List";
import Task from "../models/Task";
import { AuthRequest } from "../types";

// @route  POST /api/lists
export const createList = async (req: AuthRequest, res: Response) => {
  try {
    const { title, board } = req.body;
    const count = await List.countDocuments({ board });
    const list = await List.create({ title, board, order: count });
    res.status(201).json(list);
  } catch (error) {
    res.status(500).json({ message: "Failed to create list", error });
  }
};

// @route  GET /api/lists/board/:boardId
export const getListsByBoard = async (req: AuthRequest, res: Response) => {
  try {
    const lists = await List.find({ board: req.params.boardId }).sort({ order: 1 });
    res.json(lists);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch lists", error });
  }
};

// @route  PUT /api/lists/:id
export const updateList = async (req: AuthRequest, res: Response) => {
  try {
    const list = await List.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!list) return res.status(404).json({ message: "List not found" });
    res.json(list);
  } catch (error) {
    res.status(500).json({ message: "Failed to update list", error });
  }
};

// @route  PUT /api/lists/reorder  (bulk order update after drag-and-drop)
export const reorderLists = async (req: AuthRequest, res: Response) => {
  try {
    const { lists }: { lists: { id: string; order: number }[] } = req.body;
    const ops = lists.map((l) => ({
      updateOne: { filter: { _id: l.id }, update: { order: l.order } },
    }));
    await List.bulkWrite(ops);
    res.json({ message: "Lists reordered" });
  } catch (error) {
    res.status(500).json({ message: "Failed to reorder lists", error });
  }
};

// @route  DELETE /api/lists/:id
export const deleteList = async (req: AuthRequest, res: Response) => {
  try {
    await Task.deleteMany({ list: req.params.id });
    await List.findByIdAndDelete(req.params.id);
    res.json({ message: "List deleted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete list", error });
  }
};
