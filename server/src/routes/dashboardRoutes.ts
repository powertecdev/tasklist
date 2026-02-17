import { Router } from "express";
import { dashboardController } from "../controllers/dashboardController";
import { auth } from "../middlewares/auth";
import { roleGuard } from "../middlewares/roleGuard";

const router = Router();

router.get("/stats", auth, roleGuard("ADMIN"), dashboardController.getStats);
router.get("/overview", auth, roleGuard("ADMIN"), dashboardController.getOverview);

export default router;
