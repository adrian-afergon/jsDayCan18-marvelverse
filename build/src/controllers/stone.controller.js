"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const stones_1 = require("./stones");
class StoneController {
    static getStones(req, res) {
        console.log(req.ip);
        res.send(stones_1.stones);
    }
}
exports.StoneController = StoneController;
//# sourceMappingURL=stone.controller.js.map