import { Request, Response } from "express";
import { authService } from "../services/authService";

export class AuthController {
  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const result = await authService.login(email, password);

      res.cookie("refreshToken", result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
        path: "/",
      });

      res.json({ user: result.user, accessToken: result.accessToken });
    } catch (error: any) {
      res.status(error.status || 500).json({ error: error.message });
    }
  }

  async refresh(req: Request, res: Response) {
    try {
      const refreshToken = req.cookies?.refreshToken;

      if (!refreshToken) {
        res.status(401).json({ error: "Refresh token não encontrado" });
        return;
      }

      const result = await authService.refresh(refreshToken);

      res.cookie("refreshToken", result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
        path: "/",
      });

      res.json({ accessToken: result.accessToken });
    } catch (error: any) {
      res.status(error.status || 500).json({ error: error.message });
    }
  }

  async logout(_req: Request, res: Response) {
    res.clearCookie("refreshToken", { path: "/" });
    res.json({ message: "Logout realizado com sucesso" });
  }

  async me(req: Request, res: Response) {
    try {
      const user = await authService.getMe(req.user!.userId);
      res.json(user);
    } catch (error: any) {
      res.status(error.status || 500).json({ error: error.message });
    }
  }

  async changePassword(req: Request, res: Response) {
    try {
      const { currentPassword, newPassword } = req.body;
      const result = await authService.changePassword(req.user!.userId, currentPassword, newPassword);
      res.json(result);
    } catch (error: any) {
      res.status(error.status || 500).json({ error: error.message });
    }
  }
}

export const authController = new AuthController();
