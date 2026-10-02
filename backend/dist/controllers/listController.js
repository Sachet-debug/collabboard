"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteList = exports.reorderLists = exports.updateList = exports.getListsByBoard = exports.createList = void 0;
const List_1 = __importDefault(require("../models/List"));
const Task_1 = __importDefault(require("../models/Task"));
// @route  POST /api/lists
const createList = async (req, res) => {
    try {
        const { title, board } = req.body;
        const count = await List_1.default.countDocuments({ board });
        const list = await List_1.default.create({ title, board, order: count });
        res.status(201).json(list);
    }
    catch (error) {
        res.status(500).json({ message: "Failed to create list", error });
    }
};
exports.createList = createList;
// @route  GET /api/lists/board/:boardId
const getListsByBoard = async (req, res) => {
    try {
        const lists = await List_1.default.find({ board: req.params.boardId }).sort({ order: 1 });
        res.json(lists);
    }
    catch (error) {
        res.status(500).json({ message: "Failed to fetch lists", error });
    }
};
exports.getListsByBoard = getListsByBoard;
// @route  PUT /api/lists/:id
const updateList = async (req, res) => {
    try {
        const list = await List_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!list)
            return res.status(404).json({ message: "List not found" });
        res.json(list);
    }
    catch (error) {
        res.status(500).json({ message: "Failed to update list", error });
    }
};
exports.updateList = updateList;
// @route  PUT /api/lists/reorder  (bulk order update after drag-and-drop)
const reorderLists = async (req, res) => {
    try {
        const { lists } = req.body;
        const ops = lists.map((l) => ({
            updateOne: { filter: { _id: l.id }, update: { order: l.order } },
        }));
        await List_1.default.bulkWrite(ops);
        res.json({ message: "Lists reordered" });
    }
    catch (error) {
        res.status(500).json({ message: "Failed to reorder lists", error });
    }
};
exports.reorderLists = reorderLists;
// @route  DELETE /api/lists/:id
const deleteList = async (req, res) => {
    try {
        await Task_1.default.deleteMany({ list: req.params.id });
        await List_1.default.findByIdAndDelete(req.params.id);
        res.json({ message: "List deleted" });
    }
    catch (error) {
        res.status(500).json({ message: "Failed to delete list", error });
    }
};
exports.deleteList = deleteList;
//# sourceMappingURL=listController.js.map