import { z } from "zod";

export const createUserSchema = z.object({
  name: z.string().min(2, "Nome deve ter no mínimo 2 caracteres"),
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
  role: z.enum(["ADMIN", "EMPLOYEE"]).default("EMPLOYEE"),
  department: z.string().optional(),
});

export const updateUserSchema = z.object({
  name: z.string().min(2, "Nome deve ter no mínimo 2 caracteres").optional(),
  email: z.string().email("Email inválido").optional(),
  role: z.enum(["ADMIN", "EMPLOYEE"]).optional(),
  department: z.string().optional(),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
