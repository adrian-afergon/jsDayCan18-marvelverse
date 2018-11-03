import {Request, Response} from 'express';
import {stones} from "./stones";

export class StoneController {
    static getStones (req: Request, res: Response) {
        console.log(req.ip);
        res.send(stones)
    }
}


