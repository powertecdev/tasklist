import { Router } from "express";
import { taskController } from "../controllers/taskController";
import { auth } from "../middlewares/auth";
import { validate } from "../middlewares/validate";
import { createTaskSchema, updateTaskSchema, updateTaskStatusSchema } from "../schemas/taskSchemas";

const router = Router();

router.get("/", auth, taskController.findAll);
router.get("/my", auth, taskController.findMyTasks);
router.get("/user/:userId", auth, taskController.findByUser);
router.get("/:id", auth, taskController.findById);
router.post("/", auth, validate(createTaskSchema), taskController.create);
router.put("/:id", auth, validate(updateTaskSchema), taskController.update);
router.patch("/:id/status", auth, validate(updateTaskStatusSchema), taskController.updateStatus);
router.delete("/:id", auth, taskController.delete);

export default router;
