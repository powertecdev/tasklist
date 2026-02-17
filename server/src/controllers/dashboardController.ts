import { Request, Response } from "express";
import { taskService } from "../services/taskService";

export class DashboardController {
  async getStats(_req: Request, res: Response) {
    try {
      const stats = await taskService.getStats();
      res.json(stats);
    } catch (error: any) {
      res.status(error.status || 500).json({ error: error.message });
    }
  }

  async getOverview(_req: Request, res: Response) {
    try {
      const overview = await taskService.getOverview();
      res.json(overview);
    } catch (error: any) {
      res.status(error.status || 500).json({ error: error.message });
    }
  }
}

export const dashboardController = new DashboardController();
