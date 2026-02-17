export function formatDate(date: string | null | undefined): string {
  if (!date) return "-";
  return new Date(date).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" });
}

export function formatDateTime(date: string | null | undefined): string {
  if (!date) return "-";
  return new Date(date).toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

export function isOverdue(dueDate: string | null | undefined, status: string): boolean {
  if (!dueDate || status === "COMPLETED" || status === "CANCELLED") return false;
  return new Date(dueDate) < new Date();
}

export const statusLabels: Record<string, string> = {
  PENDING: "Pendente", IN_PROGRESS: "Em Progresso", COMPLETED: "Concluida", CANCELLED: "Cancelada",
};
export const priorityLabels: Record<string, string> = {
  LOW: "Baixa", MEDIUM: "Media", HIGH: "Alta", URGENT: "Urgente",
};
export const statusColors: Record<string, string> = {
  PENDING: "bg-gray-100 text-gray-700", IN_PROGRESS: "bg-blue-100 text-blue-700",
  COMPLETED: "bg-green-100 text-green-700", CANCELLED: "bg-red-100 text-red-700",
};
export const priorityColors: Record<string, string> = {
  LOW: "bg-green-100 text-green-700", MEDIUM: "bg-yellow-100 text-yellow-700",
  HIGH: "bg-orange-100 text-orange-700", URGENT: "bg-red-100 text-red-700",
};
