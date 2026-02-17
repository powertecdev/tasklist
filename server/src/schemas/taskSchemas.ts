import { z } from "zod";

export const createTaskSchema = z
  .object({
    title: z.string().min(3, "Título deve ter no mínimo 3 caracteres"),
    description: z.string().optional(),
    status: z.enum(["PENDING", "IN_PROGRESS", "COMPLETED", "CANCELLED"]).default("PENDING"),
    priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).default("MEDIUM"),
    nextStep: z.string().max(500, "Próximo passo deve ter no máximo 500 caracteres").optional().nullable(),
    dueDate: z.string().datetime().optional().nullable(),
    ownerId: z.string().uuid("ID do responsável inválido").optional(),
  })
  .refine(
    (data) => {
      if (data.status === "PENDING" || data.status === "IN_PROGRESS") {
        return data.nextStep && data.nextStep.trim().length >= 3;
      }
      return true;
    },
    {
      message: "Próximo passo é obrigatório (mín. 3 caracteres) para tarefas pendentes ou em progresso",
      path: ["nextStep"],
    }
  );

export const updateTaskSchema = z
  .object({
    title: z.string().min(3, "Título deve ter no mínimo 3 caracteres").optional(),
    description: z.string().optional().nullable(),
    status: z.enum(["PENDING", "IN_PROGRESS", "COMPLETED", "CANCELLED"]).optional(),
    priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).optional(),
    nextStep: z.string().max(500, "Próximo passo deve ter no máximo 500 caracteres").optional().nullable(),
    dueDate: z.string().datetime().optional().nullable(),
    ownerId: z.string().uuid("ID do responsável inválido").optional(),
  })
  .refine(
    (data) => {
      if (data.status === "PENDING" || data.status === "IN_PROGRESS") {
        return data.nextStep && data.nextStep.trim().length >= 3;
      }
      return true;
    },
    {
      message: "Próximo passo é obrigatório (mín. 3 caracteres) para tarefas pendentes ou em progresso",
      path: ["nextStep"],
    }
  );

export const updateTaskStatusSchema = z
  .object({
    status: z.enum(["PENDING", "IN_PROGRESS", "COMPLETED", "CANCELLED"]),
    nextStep: z.string().max(500).optional().nullable(),
  })
  .refine(
    (data) => {
      if (data.status === "PENDING" || data.status === "IN_PROGRESS") {
        return data.nextStep && data.nextStep.trim().length >= 3;
      }
      return true;
    },
    {
      message: "Próximo passo é obrigatório ao voltar para PENDING ou IN_PROGRESS",
      path: ["nextStep"],
    }
  );

export const commentSchema = z.object({
  content: z.string().min(1, "Comentário não pode ser vazio").max(2000, "Máximo 2000 caracteres"),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
export type UpdateTaskStatusInput = z.infer<typeof updateTaskStatusSchema>;
export type CommentInput = z.infer<typeof commentSchema>;
