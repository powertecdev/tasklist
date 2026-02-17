import { Request, Response } from "express";
import { taskService } from "../services/taskService";

export class TaskController {
  async findAll(req: Request, res: Response) {
    try {
      const result = await taskService.findAll(req.query as any);
      res.json(result);
    } catch (error: any) {
      res.status(error.status || 500).json({ error: error.message });
    }
  }

  async findMyTasks(req: Request, res: Response) {
    try {
      const tasks = await taskService.findByUser(req.user!.userId);
      res.json(tasks);
    } catch (error: any) {
      res.status(error.status || 500).json({ error: error.message });
    }
  }

  async findByUser(req: Request, res: Response) {
    try {
      const tasks = await taskService.findByUser(req.params.userId);
      res.json(tasks);
    } catch (error: any) {
      res.status(error.status || 500).json({ error: error.message });
    }
  }

  async findById(req: Request, res: Response) {
    try {
      const task = await taskService.findById(req.params.id);
      res.json(task);
    } catch (error: any) {
      res.status(error.status || 500).json({ error: error.message });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const task = await taskService.create(req.body, req.user!.userId, req.user!.role);
      res.status(201).json(task);
    } catch (error: any) {
      res.status(error.status || 500).json({ error: error.message });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const task = await taskService.update(req.params.id, req.body, req.user!.userId, req.user!.role);
      res.json(task);
    } catch (error: any) {
      res.status(error.status || 500).json({ error: error.message });
    }
  }

  async updateStatus(req: Request, res: Response) {
    try {
      const { status, nextStep } = req.body;
      const task = await taskService.updateStatus(
        req.params.id, status, nextStep || null,
        req.user!.userId, req.user!.role
      );
      res.json(task);
    } catch (error: any) {
      res.status(error.status || 500).json({ error: error.message });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const result = await taskService.delete(req.params.id, req.user!.userId, req.user!.role);
      res.json(result);
    } catch (error: any) {
      res.status(error.status || 500).json({ error: error.message });
    }
  }
}

export const taskController = new TaskController();
