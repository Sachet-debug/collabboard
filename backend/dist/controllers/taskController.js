"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTask = exports.moveTask = exports.updateTask = exports.getTasksByBoard = exports.createTask = void 0;
const Task_1 = __importDefault(require("../models/Task"));
// @route  POST /api/tasks
const createTask = async (req, res) => {
    try {
        const { title, description, list, board, priority, dueDate } = req.body;
        const count = await Task_1.default.countDocuments({ list });
        const task = await Task_1.default.create({
            title,
            description,
            list,
            board,
            priority,
            dueDate,
            order: count,
        });
        res.status(201).json(task);
    }
    catch (error) {
        res.status(500).json({ message: "Failed to create task", error });
    }
};
exports.createTask = createTask;
// @route  GET /api/tasks/board/:boardId
const getTasksByBoard = async (req, res) => {
    try {
        const tasks = await Task_1.default.find({ board: req.params.boardId })
            .populate("assignees", "name avatarColor")
            .sort({ order: 1 });
        res.json(tasks);
    }
    catch (error) {
        res.status(500).json({ message: "Failed to fetch tasks", error });
    }
};
exports.getTasksByBoard = getTasksByBoard;
// @route  PUT /api/tasks/:id
const updateTask = async (req, res) => {
    try {
        const task = await Task_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!task)
            return res.status(404).json({ message: "Task not found" });
        res.json(task);
    }
    catch (error) {
        res.status(500).json({ message: "Failed to update task", error });
    }
};
exports.updateTask = updateTask;
// @route  PUT /api/tasks/move
// Handles moving a task to a new list and/or new position (drag-and-drop)
const moveTask = async (req, res) => {
    try {
        const { taskId, sourceListId, destListId, destOrder } = req.body;
        // Update the moved task's list + order
        await Task_1.default.findByIdAndUpdate(taskId, { list: destListId, order: destOrder });
        // Re-sequence tasks in destination list
        const destTasks = await Task_1.default.find({ list: destListId }).sort({ order: 1 });
        const reorderOps = destTasks.map((t, index) => ({
            updateOne: { filter: { _id: t._id }, update: { order: index } },
        }));
        if (reorderOps.length)
            await Task_1.default.bulkWrite(reorderOps);
        // Re-sequence tasks in source list if different
        if (sourceListId !== destListId) {
            const sourceTasks = await Task_1.default.find({ list: sourceListId }).sort({ order: 1 });
            const sourceOps = sourceTasks.map((t, index) => ({
                updateOne: { filter: { _id: t._id }, update: { order: index } },
            }));
            if (sourceOps.length)
                await Task_1.default.bulkWrite(sourceOps);
        }
        res.json({ message: "Task moved" });
    }
    catch (error) {
        res.status(500).json({ message: "Failed to move task", error });
    }
};
exports.moveTask = moveTask;
// @route  DELETE /api/tasks/:id
const deleteTask = async (req, res) => {
    try {
        await Task_1.default.findByIdAndDelete(req.params.id);
        res.json({ message: "Task deleted" });
    }
    catch (error) {
        res.status(500).json({ message: "Failed to delete task", error });
    }
};
exports.deleteTask = deleteTask;
//# sourceMappingURL=taskController.js.map