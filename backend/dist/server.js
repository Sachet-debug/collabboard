"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const app_1 = __importDefault(require("./app"));
const db_1 = __importDefault(require("./config/db"));
const socketHandler_1 = __importDefault(require("./sockets/socketHandler"));
const PORT = process.env.PORT || 5000;
const server = http_1.default.createServer(app_1.default);
const io = new socket_io_1.Server(server, {
    cors: { origin: process.env.CLIENT_URL || "*" },
});
(0, socketHandler_1.default)(io);
(0, db_1.default)().then(() => {
    server.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
});
//# sourceMappingURL=server.js.map