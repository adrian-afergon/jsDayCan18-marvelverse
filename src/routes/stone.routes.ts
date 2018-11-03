import { Router } from "express";
import { StoneController } from '../controllers';

export const router: Router = Router();
router.get('/', StoneController.getStones);
export const stoneRoutes: Router = router;