import * as express from "express";
import { stoneRoutes } from "./routes";

export class AppRoutes {

    public static instanceRoutes(app: express.Application) {
        app.use('/stones', stoneRoutes)
    }

}