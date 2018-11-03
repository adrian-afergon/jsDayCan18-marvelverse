"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const routes_1 = require("./routes");
class AppRoutes {
    static instanceRoutes(app) {
        app.use('/stones', routes_1.stoneRoutes);
    }
}
exports.AppRoutes = AppRoutes;
//# sourceMappingURL=app.routes.js.map