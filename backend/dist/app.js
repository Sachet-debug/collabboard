"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const boardRoutes_1 = __importDefault(require("./routes/boardRoutes"));
const listRoutes_1 = __importDefault(require("./routes/listRoutes"));
const taskRoutes_1 = __importDefault(require("./routes/taskRoutes"));
const errorHandler_1 = require("./middleware/errorHandler");
const app = (0, express_1.default)();
app.use((0, cors_1.default)({ origin: process.env.CLIENT_URL || "*" }));
app.use(express_1.default.json());
app.get("/api/health", (req, res) => res.json({ status: "ok" }));
app.use("/api/auth", authRoutes_1.default);
app.use("/api/boards", boardRoutes_1.default);
app.use("/api/lists", listRoutes_1.default);
app.use("/api/tasks", taskRoutes_1.default);
app.use(errorHandler_1.notFound);
app.use(errorHandler_1.errorHandler);
exports.default = app;
//# sourceMappingURL=app.js.map