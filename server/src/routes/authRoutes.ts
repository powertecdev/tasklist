import { Router } from "express";
import { authController } from "../controllers/authController";
import { auth } from "../middlewares/auth";
import { validate } from "../middlewares/validate";
import { loginSchema, changePasswordSchema } from "../schemas/authSchemas";

const router = Router();

router.post("/login", validate(loginSchema), authController.login);
router.post("/refresh", authController.refresh);
router.post("/logout", auth, authController.logout);
router.get("/me", auth, authController.me);
router.patch("/me/password", auth, validate(changePasswordSchema), authController.changePassword);

export default router;
