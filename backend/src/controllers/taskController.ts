import { Response } from "express";
import Task from "../models/Task";
import { AuthRequest } from "../types";

// @route  POST /api/tasks
export const createTask = async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, list, board, priority, dueDate } = req.body;
    const count = await Task.countDocuments({ list });
    const task = await Task.create({
      title,
      description,
      list,
      board,
      priority,
      dueDate,
      order: count,
    });
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: "Failed to create task", error });
  }
};

// @route  GET /api/tasks/board/:boardId
export const getTasksByBoard = async (req: AuthRequest, res: Response) => {
  try {
    const tasks = await Task.find({ board: req.params.boardId })
      .populate("assignees", "name avatarColor")
      .sort({ order: 1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch tasks", error });
  }
};

// @route  PUT /api/tasks/:id
export const updateTask = async (req: AuthRequest, res: Response) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: "Failed to update task", error });
  }
};

// @route  PUT /api/tasks/move
// Handles moving a task to a new list and/or new position (drag-and-drop)
export const moveTask = async (req: AuthRequest, res: Response) => {
  try {
    const { taskId, sourceListId, destListId, destOrder } = req.body;

    // Update the moved task's list + order
    await Task.findByIdAndUpdate(taskId, { list: destListId, order: destOrder });

    // Re-sequence tasks in destination list
    const destTasks = await Task.find({ list: destListId }).sort({ order: 1 });
    const reorderOps = destTasks.map((t, index) => ({
      updateOne: { filter: { _id: t._id }, update: { order: index } },
    }));
    if (reorderOps.length) await Task.bulkWrite(reorderOps);

    // Re-sequence tasks in source list if different
    if (sourceListId !== destListId) {
      const sourceTasks = await Task.find({ list: sourceListId }).sort({ order: 1 });
      const sourceOps = sourceTasks.map((t, index) => ({
        updateOne: { filter: { _id: t._id }, update: { order: index } },
      }));
      if (sourceOps.length) await Task.bulkWrite(sourceOps);
    }

    res.json({ message: "Task moved" });
  } catch (error) {
    res.status(500).json({ message: "Failed to move task", error });
  }
};

// @route  DELETE /api/tasks/:id
export const deleteTask = async (req: AuthRequest, res: Response) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: "Task deleted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete task", error });
  }
};
