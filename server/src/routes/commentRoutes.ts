import { Router } from "express";
import { commentController } from "../controllers/commentController";
import { auth } from "../middlewares/auth";
import { validate } from "../middlewares/validate";
import { commentSchema } from "../schemas/taskSchemas";

const router = Router();

router.get("/:taskId/comments", auth, commentController.findAll);
router.post("/:taskId/comments", auth, validate(commentSchema), commentController.create);
router.delete("/:taskId/comments/:id", auth, commentController.delete);

export default router;
