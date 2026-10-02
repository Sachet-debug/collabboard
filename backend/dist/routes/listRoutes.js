"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const listController_1 = require("../controllers/listController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.use(auth_1.protect);
router.route("/").post(listController_1.createList);
router.get("/board/:boardId", listController_1.getListsByBoard);
router.put("/reorder", listController_1.reorderLists);
router.route("/:id").put(listController_1.updateList).delete(listController_1.deleteList);
exports.default = router;
//# sourceMappingURL=listRoutes.js.map