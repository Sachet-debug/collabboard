"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const boardController_1 = require("../controllers/boardController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.use(auth_1.protect); // all board routes require auth
router.route("/").post(boardController_1.createBoard).get(boardController_1.getBoards);
router.route("/:id").get(boardController_1.getBoardById).put(boardController_1.updateBoard).delete(boardController_1.deleteBoard);
router.post("/:id/members", boardController_1.addMember);
exports.default = router;
//# sourceMappingURL=boardRoutes.js.map