import { Request, Response } from "express";
import { taskService } from "../services/taskService";

export class CommentController {
  async findAll(req: Request, res: Response) {
    try {
      const comments = await taskService.getComments(req.params.taskId);
      res.json(comments);
    } catch (error: any) {
      res.status(error.status || 500).json({ error: error.message });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const comment = await taskService.addComment(req.params.taskId, req.body.content, req.user!.userId);
      res.status(201).json(comment);
    } catch (error: any) {
      res.status(error.status || 500).json({ error: error.message });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const result = await taskService.deleteComment(req.params.id, req.user!.userId, req.user!.role);
      res.json(result);
    } catch (error: any) {
      res.status(error.status || 500).json({ error: error.message });
    }
  }
}

export const commentController = new CommentController();
