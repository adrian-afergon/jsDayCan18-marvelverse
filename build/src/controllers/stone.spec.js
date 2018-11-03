"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const stone_controller_1 = require("./stone.controller");
const stones_1 = require("./stones");
describe('StoneController', () => {
    it('should return the stone list', () => {
        const aRequest = null;
        const aResponse = createResponseMock();
        stone_controller_1.StoneController.getStones(aRequest, aResponse);
        expect(aResponse.send).toHaveBeenCalledWith(stones_1.stones);
    });
});
const createResponseMock = () => {
    return new Response();
};
//# sourceMappingURL=stone.spec.js.map