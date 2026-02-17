import bcrypt from "bcryptjs";
import prisma from "../lib/prisma";
import { CreateUserInput, UpdateUserInput } from "../schemas/userSchemas";

export class UserService {
  async findAll() {
    const users = await prisma.user.findMany({
      select: {
        id: true, name: true, email: true, role: true,
        department: true, avatar: true, isActive: true,
        createdAt: true, updatedAt: true,
        _count: { select: { tasks: true } },
      },
      orderBy: { name: "asc" },
    });

    return users.map((user) => ({
      ...user,
      taskCount: user._count.tasks,
      _count: undefined,
    }));
  }

  async findById(id: string) {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true, name: true, email: true, role: true,
        department: true, avatar: true, isActive: true,
        createdAt: true, updatedAt: true,
        _count: { select: { tasks: true } },
      },
    });

    if (!user) {
      throw { status: 404, message: "Usuário não encontrado" };
    }

    return { ...user, taskCount: user._count.tasks, _count: undefined };
  }

  async create(data: CreateUserInput) {
    const existing = await prisma.user.findUnique({ where: { email: data.email } });
    if (existing) {
      throw { status: 409, message: "Email já cadastrado" };
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await prisma.user.create({
      data: { ...data, password: hashedPassword },
      select: {
        id: true, name: true, email: true, role: true,
        department: true, isActive: true, createdAt: true,
      },
    });

    return user;
  }

  async update(id: string, data: UpdateUserInput) {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw { status: 404, message: "Usuário não encontrado" };
    }

    if (data.email && data.email !== user.email) {
      const existing = await prisma.user.findUnique({ where: { email: data.email } });
      if (existing) {
        throw { status: 409, message: "Email já cadastrado" };
      }
    }

    const updated = await prisma.user.update({
      where: { id },
      data,
      select: {
        id: true, name: true, email: true, role: true,
        department: true, isActive: true, updatedAt: true,
      },
    });

    return updated;
  }

  async toggleActive(id: string) {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw { status: 404, message: "Usuário não encontrado" };
    }

    const updated = await prisma.user.update({
      where: { id },
      data: { isActive: !user.isActive },
      select: { id: true, name: true, isActive: true },
    });

    return updated;
  }

  async delete(id: string) {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw { status: 404, message: "Usuário não encontrado" };
    }

    const taskCount = await prisma.task.count({ where: { ownerId: id } });
    if (taskCount > 0) {
      throw {
        status: 400,
        message: "Não é possível excluir. Funcionário possui " + taskCount + " tarefa(s). Desative-o ao invés de excluir.",
      };
    }

    await prisma.user.delete({ where: { id } });
    return { message: "Usuário excluído com sucesso" };
  }
}

export const userService = new UserService();
