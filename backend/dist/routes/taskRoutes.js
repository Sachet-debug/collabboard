"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const taskController_1 = require("../controllers/taskController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.use(auth_1.protect);
router.route("/").post(taskController_1.createTask);
router.get("/board/:boardId", taskController_1.getTasksByBoard);
router.put("/move", taskController_1.moveTask);
router.route("/:id").put(taskController_1.updateTask).delete(taskController_1.deleteTask);
exports.default = router;
//# sourceMappingURL=taskRoutes.js.map