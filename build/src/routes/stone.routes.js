"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controllers_1 = require("../controllers");
exports.router = express_1.Router();
exports.router.get('/', controllers_1.StoneController.getStones);
exports.stoneRoutes = exports.router;
//# sourceMappingURL=stone.routes.js.map