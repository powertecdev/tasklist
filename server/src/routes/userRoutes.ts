import { Router } from "express";
import { userController } from "../controllers/userController";
import { auth } from "../middlewares/auth";
import { roleGuard } from "../middlewares/roleGuard";
import { validate } from "../middlewares/validate";
import { createUserSchema, updateUserSchema } from "../schemas/userSchemas";

const router = Router();

router.get("/", auth, userController.findAll);
router.get("/:id", auth, userController.findById);
router.post("/", auth, roleGuard("ADMIN"), validate(createUserSchema), userController.create);
router.put("/:id", auth, roleGuard("ADMIN"), validate(updateUserSchema), userController.update);
router.patch("/:id/toggle", auth, roleGuard("ADMIN"), userController.toggleActive);
router.delete("/:id", auth, roleGuard("ADMIN"), userController.delete);

export default router;
