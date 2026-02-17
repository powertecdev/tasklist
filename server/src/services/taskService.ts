import prisma from "../lib/prisma";

interface TaskFilters {
  status?: string;
  priority?: string;
  ownerId?: string;
  search?: string;
  dueBefore?: string;
  dueAfter?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
}

const taskInclude = {
  owner: {
    select: { id: true, name: true, email: true, department: true, avatar: true },
  },
  createdBy: {
    select: { id: true, name: true, email: true },
  },
  _count: { select: { comments: true } },
};

function formatTask(t: any) {
  return { ...t, commentCount: t._count?.comments ?? 0, _count: undefined };
}

export class TaskService {
  async findAll(filters: TaskFilters) {
    const page = Number(filters.page) || 1;
    const limit = Number(filters.limit) || 20;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (filters.status) {
      where.status = { in: filters.status.split(",") };
    }
    if (filters.priority) {
      where.priority = { in: filters.priority.split(",") };
    }
    if (filters.ownerId) {
      where.ownerId = filters.ownerId;
    }
    if (filters.search) {
      where.OR = [
        { title: { contains: filters.search, mode: "insensitive" } },
        { description: { contains: filters.search, mode: "insensitive" } },
        { nextStep: { contains: filters.search, mode: "insensitive" } },
      ];
    }
    if (filters.dueBefore || filters.dueAfter) {
      where.dueDate = {};
      if (filters.dueBefore) where.dueDate.lte = new Date(filters.dueBefore);
      if (filters.dueAfter) where.dueDate.gte = new Date(filters.dueAfter);
    }

    const orderBy: any = {};
    orderBy[filters.sortBy || "createdAt"] = filters.sortOrder || "desc";

    const [tasks, total] = await Promise.all([
      prisma.task.findMany({ where, include: taskInclude, orderBy, skip, take: limit }),
      prisma.task.count({ where }),
    ]);

    return {
      tasks: tasks.map(formatTask),
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async findByUser(userId: string) {
    const tasks = await prisma.task.findMany({
      where: { ownerId: userId },
      include: taskInclude,
      orderBy: [{ priority: "desc" }, { createdAt: "desc" }],
    });
    return tasks.map(formatTask);
  }

  async findById(id: string) {
    const task = await prisma.task.findUnique({
      where: { id },
      include: {
        ...taskInclude,
        comments: {
          include: { author: { select: { id: true, name: true, avatar: true } } },
          orderBy: { createdAt: "asc" },
        },
      },
    });
    if (!task) throw { status: 404, message: "Tarefa nao encontrada" };
    return formatTask(task);
  }

  async create(data: any, createdById: string, userRole: string) {
    const ownerId = data.ownerId || createdById;
    if (userRole === "EMPLOYEE" && ownerId !== createdById) {
      throw { status: 403, message: "Funcionario so pode criar tarefas para si mesmo" };
    }

    const task = await prisma.task.create({
      data: {
        title: data.title,
        description: data.description,
        status: data.status || "PENDING",
        priority: data.priority || "MEDIUM",
        nextStep: data.nextStep || null,
        dueDate: data.dueDate ? new Date(data.dueDate) : null,
        ownerId,
        createdById,
      },
      include: taskInclude,
    });
    return formatTask(task);
  }

  async update(id: string, data: any, userId: string, userRole: string) {
    const task = await prisma.task.findUnique({ where: { id } });
    if (!task) throw { status: 404, message: "Tarefa nao encontrada" };
    if (userRole === "EMPLOYEE" && task.ownerId !== userId) {
      throw { status: 403, message: "Sem permissao para editar esta tarefa" };
    }

    const newStatus = data.status || task.status;
    const updateData: any = { ...data };

    if (data.dueDate !== undefined) {
      updateData.dueDate = data.dueDate ? new Date(data.dueDate) : null;
    }
    if (newStatus === "COMPLETED") {
      updateData.completedAt = new Date();
      updateData.nextStep = null;
    } else if (newStatus === "CANCELLED") {
      updateData.nextStep = null;
    } else if (task.status === "COMPLETED" || task.status === "CANCELLED") {
      updateData.completedAt = null;
    }
    if (userRole === "EMPLOYEE" && data.ownerId && data.ownerId !== task.ownerId) {
      throw { status: 403, message: "Sem permissao para reatribuir tarefa" };
    }

    const updated = await prisma.task.update({ where: { id }, data: updateData, include: taskInclude });
    return formatTask(updated);
  }

  async updateStatus(id: string, status: string, nextStep: string | null, userId: string, userRole: string) {
    const task = await prisma.task.findUnique({ where: { id } });
    if (!task) throw { status: 404, message: "Tarefa nao encontrada" };
    if (userRole === "EMPLOYEE" && task.ownerId !== userId) {
      throw { status: 403, message: "Sem permissao para alterar esta tarefa" };
    }

    const updateData: any = { status };
    if (status === "COMPLETED") {
      updateData.completedAt = new Date();
      updateData.nextStep = null;
    } else if (status === "CANCELLED") {
      updateData.nextStep = null;
      updateData.completedAt = null;
    } else {
      updateData.completedAt = null;
      updateData.nextStep = nextStep;
    }

    const updated = await prisma.task.update({ where: { id }, data: updateData, include: taskInclude });
    return formatTask(updated);
  }

  async delete(id: string, userId: string, userRole: string) {
    const task = await prisma.task.findUnique({ where: { id } });
    if (!task) throw { status: 404, message: "Tarefa nao encontrada" };
    if (userRole === "EMPLOYEE" && task.ownerId !== userId) {
      throw { status: 403, message: "Sem permissao para excluir esta tarefa" };
    }
    await prisma.task.delete({ where: { id } });
    return { message: "Tarefa excluida com sucesso" };
  }

  async getStats() {
    const [total, pending, inProgress, completed, cancelled, urgent] = await Promise.all([
      prisma.task.count(),
      prisma.task.count({ where: { status: "PENDING" } }),
      prisma.task.count({ where: { status: "IN_PROGRESS" } }),
      prisma.task.count({ where: { status: "COMPLETED" } }),
      prisma.task.count({ where: { status: "CANCELLED" } }),
      prisma.task.count({ where: { priority: "URGENT", status: { not: "COMPLETED" } } }),
    ]);
    const overdue = await prisma.task.count({
      where: { dueDate: { lt: new Date() }, status: { notIn: ["COMPLETED", "CANCELLED"] } },
    });
    return { total, pending, inProgress, completed, cancelled, urgent, overdue };
  }

  async getOverview() {
    const users = await prisma.user.findMany({
      where: { isActive: true },
      select: {
        id: true, name: true, department: true, avatar: true,
        tasks: { select: { status: true, priority: true, nextStep: true, dueDate: true } },
      },
      orderBy: { name: "asc" },
    });

    return users.map((user) => {
      const total = user.tasks.length;
      const completed = user.tasks.filter((t) => t.status === "COMPLETED").length;
      const pending = user.tasks.filter((t) => t.status === "PENDING").length;
      const inProgress = user.tasks.filter((t) => t.status === "IN_PROGRESS").length;
      const overdue = user.tasks.filter(
        (t) => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== "COMPLETED" && t.status !== "CANCELLED"
      ).length;
      const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
      return {
        id: user.id, name: user.name, department: user.department, avatar: user.avatar,
        stats: { total, completed, pending, inProgress, overdue, completionRate },
      };
    });
  }

  async getComments(taskId: string) {
    const task = await prisma.task.findUnique({ where: { id: taskId } });
    if (!task) throw { status: 404, message: "Tarefa nao encontrada" };
    return prisma.comment.findMany({
      where: { taskId },
      include: { author: { select: { id: true, name: true, avatar: true } } },
      orderBy: { createdAt: "asc" },
    });
  }

  async addComment(taskId: string, content: string, authorId: string) {
    const task = await prisma.task.findUnique({ where: { id: taskId } });
    if (!task) throw { status: 404, message: "Tarefa nao encontrada" };
    return prisma.comment.create({
      data: { content, taskId, authorId },
      include: { author: { select: { id: true, name: true, avatar: true } } },
    });
  }

  async deleteComment(commentId: string, userId: string, userRole: string) {
    const comment = await prisma.comment.findUnique({ where: { id: commentId } });
    if (!comment) throw { status: 404, message: "Comentario nao encontrado" };
    if (userRole === "EMPLOYEE" && comment.authorId !== userId) {
      throw { status: 403, message: "Sem permissao para excluir este comentario" };
    }
    await prisma.comment.delete({ where: { id: commentId } });
    return { message: "Comentario excluido" };
  }
}

export const taskService = new TaskService();
