import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../lib/prisma";
import { env } from "../config/env";
import { AuthPayload } from "../middlewares/auth";

export class AuthService {
  async login(email: string, password: string) {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      throw { status: 401, message: "Credenciais inválidas" };
    }

    if (!user.isActive) {
      throw { status: 403, message: "Conta desativada. Contate o administrador." };
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      throw { status: 401, message: "Credenciais inválidas" };
    }

    const payload: AuthPayload = { userId: user.id, role: user.role };

    const accessToken = jwt.sign(payload, env.JWT_SECRET, {
      expiresIn: env.JWT_EXPIRES_IN,
    });

    const refreshToken = jwt.sign(payload, env.JWT_REFRESH_SECRET, {
      expiresIn: env.JWT_REFRESH_EXPIRES_IN,
    });

    const { password: _, ...userWithoutPassword } = user;

    return { user: userWithoutPassword, accessToken, refreshToken };
  }

  async refresh(refreshToken: string) {
    try {
      const decoded = jwt.verify(refreshToken, env.JWT_REFRESH_SECRET) as AuthPayload;

      const user = await prisma.user.findUnique({ where: { id: decoded.userId } });

      if (!user || !user.isActive) {
        throw { status: 401, message: "Token inválido" };
      }

      const payload: AuthPayload = { userId: user.id, role: user.role };

      const newAccessToken = jwt.sign(payload, env.JWT_SECRET, {
        expiresIn: env.JWT_EXPIRES_IN,
      });

      const newRefreshToken = jwt.sign(payload, env.JWT_REFRESH_SECRET, {
        expiresIn: env.JWT_REFRESH_EXPIRES_IN,
      });

      return { accessToken: newAccessToken, refreshToken: newRefreshToken };
    } catch {
      throw { status: 401, message: "Refresh token inválido ou expirado" };
    }
  }

  async getMe(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true, name: true, email: true, role: true,
        department: true, avatar: true, isActive: true,
        createdAt: true, updatedAt: true,
      },
    });

    if (!user) {
      throw { status: 404, message: "Usuário não encontrado" };
    }

    return user;
  }

  async changePassword(userId: string, currentPassword: string, newPassword: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      throw { status: 404, message: "Usuário não encontrado" };
    }

    const validPassword = await bcrypt.compare(currentPassword, user.password);
    if (!validPassword) {
      throw { status: 400, message: "Senha atual incorreta" };
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    return { message: "Senha alterada com sucesso" };
  }
}

export const authService = new AuthService();
