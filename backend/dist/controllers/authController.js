"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMe = exports.login = exports.register = void 0;
const User_1 = __importDefault(require("../models/User"));
const generateToken_1 = __importDefault(require("../utils/generateToken"));
// @route  POST /api/auth/register
const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const existingUser = await User_1.default.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already registered" });
        }
        const user = await User_1.default.create({ name, email, password });
        const token = (0, generateToken_1.default)(user._id.toString());
        res.status(201).json({
            token,
            user: { id: user._id, name: user.name, email: user.email, avatarColor: user.avatarColor },
        });
    }
    catch (error) {
        res.status(500).json({ message: "Registration failed", error });
    }
};
exports.register = register;
// @route  POST /api/auth/login
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User_1.default.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        const token = (0, generateToken_1.default)(user._id.toString());
        res.json({
            token,
            user: { id: user._id, name: user.name, email: user.email, avatarColor: user.avatarColor },
        });
    }
    catch (error) {
        res.status(500).json({ message: "Login failed", error });
    }
};
exports.login = login;
// @route  GET /api/auth/me
const getMe = async (req, res) => {
    try {
        const user = await User_1.default.findById(req.userId).select("-password");
        if (!user)
            return res.status(404).json({ message: "User not found" });
        res.json(user);
    }
    catch (error) {
        res.status(500).json({ message: "Failed to fetch user", error });
    }
};
exports.getMe = getMe;
//# sourceMappingURL=authController.js.map