"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addMember = exports.deleteBoard = exports.updateBoard = exports.getBoardById = exports.getBoards = exports.createBoard = void 0;
const Board_1 = __importDefault(require("../models/Board"));
const List_1 = __importDefault(require("../models/List"));
const Task_1 = __importDefault(require("../models/Task"));
const User_1 = __importDefault(require("../models/User"));
// @route  POST /api/boards
const createBoard = async (req, res) => {
    try {
        const { title, description } = req.body;
        const board = await Board_1.default.create({
            title,
            description,
            owner: req.userId,
            members: [{ user: req.userId, role: "admin" }],
        });
        res.status(201).json(board);
    }
    catch (error) {
        res.status(500).json({ message: "Failed to create board", error });
    }
};
exports.createBoard = createBoard;
// @route  GET /api/boards  (all boards the user is a member of)
const getBoards = async (req, res) => {
    try {
        const boards = await Board_1.default.find({ "members.user": req.userId }).sort({ createdAt: -1 });
        res.json(boards);
    }
    catch (error) {
        res.status(500).json({ message: "Failed to fetch boards", error });
    }
};
exports.getBoards = getBoards;
// @route  GET /api/boards/:id
const getBoardById = async (req, res) => {
    try {
        const board = await Board_1.default.findById(req.params.id).populate("members.user", "name email avatarColor");
        if (!board)
            return res.status(404).json({ message: "Board not found" });
        res.json(board);
    }
    catch (error) {
        res.status(500).json({ message: "Failed to fetch board", error });
    }
};
exports.getBoardById = getBoardById;
// @route  PUT /api/boards/:id
const updateBoard = async (req, res) => {
    try {
        const board = await Board_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!board)
            return res.status(404).json({ message: "Board not found" });
        res.json(board);
    }
    catch (error) {
        res.status(500).json({ message: "Failed to update board", error });
    }
};
exports.updateBoard = updateBoard;
// @route  DELETE /api/boards/:id  (cascades to lists + tasks)
const deleteBoard = async (req, res) => {
    try {
        const boardId = req.params.id;
        await Task_1.default.deleteMany({ board: boardId });
        await List_1.default.deleteMany({ board: boardId });
        await Board_1.default.findByIdAndDelete(boardId);
        res.json({ message: "Board deleted" });
    }
    catch (error) {
        res.status(500).json({ message: "Failed to delete board", error });
    }
};
exports.deleteBoard = deleteBoard;
// @route  POST /api/boards/:id/members  (invite by email)
const addMember = async (req, res) => {
    try {
        const { email, role } = req.body;
        const board = await Board_1.default.findById(req.params.id);
        if (!board)
            return res.status(404).json({ message: "Board not found" });
        const user = await User_1.default.findOne({ email });
        if (!user)
            return res.status(404).json({ message: "No user with that email" });
        const alreadyMember = board.members.some((m) => m.user.toString() === user._id.toString());
        if (alreadyMember)
            return res.status(400).json({ message: "User already a member" });
        board.members.push({ user: user._id, role: role || "member" });
        await board.save();
        res.json(board);
    }
    catch (error) {
        res.status(500).json({ message: "Failed to add member", error });
    }
};
exports.addMember = addMember;
//# sourceMappingURL=boardController.js.map