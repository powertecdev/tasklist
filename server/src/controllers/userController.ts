import { Request, Response } from "express";
import { userService } from "../services/userService";

export class UserController {
  async findAll(_req: Request, res: Response) {
    try {
      const users = await userService.findAll();
      res.json(users);
    } catch (error: any) {
      res.status(error.status || 500).json({ error: error.message });
    }
  }

  async findById(req: Request, res: Response) {
    try {
      const user = await userService.findById(req.params.id);
      res.json(user);
    } catch (error: any) {
      res.status(error.status || 500).json({ error: error.message });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const user = await userService.create(req.body);
      res.status(201).json(user);
    } catch (error: any) {
      res.status(error.status || 500).json({ error: error.message });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const user = await userService.update(req.params.id, req.body);
      res.json(user);
    } catch (error: any) {
      res.status(error.status || 500).json({ error: error.message });
    }
  }

  async toggleActive(req: Request, res: Response) {
    try {
      const user = await userService.toggleActive(req.params.id);
      res.json(user);
    } catch (error: any) {
      res.status(error.status || 500).json({ error: error.message });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const result = await userService.delete(req.params.id);
      res.json(result);
    } catch (error: any) {
      res.status(error.status || 500).json({ error: error.message });
    }
  }
}

export const userController = new UserController();
