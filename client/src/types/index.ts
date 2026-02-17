export type Role = "ADMIN" | "EMPLOYEE";
export type TaskStatus = "PENDING" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
export type TaskPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  department?: string;
  avatar?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  taskCount?: number;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  nextStep?: string | null;
  dueDate?: string | null;
  completedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  ownerId: string;
  owner: User;
  createdById: string;
  createdBy: User;
  commentCount?: number;
  comments?: Comment[];
}

export interface Comment {
  id: string;
  content: string;
  createdAt: string;
  authorId: string;
  author: { id: string; name: string; avatar?: string };
}

export interface TaskFilters {
  status?: TaskStatus[];
  priority?: TaskPriority[];
  ownerId?: string;
  search?: string;
  dueBefore?: string;
  dueAfter?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
}

export interface DashboardStats {
  total: number;
  pending: number;
  inProgress: number;
  completed: number;
  cancelled: number;
  urgent: number;
  overdue: number;
}

export interface UserOverview {
  id: string;
  name: string;
  department?: string;
  avatar?: string;
  stats: {
    total: number;
    completed: number;
    pending: number;
    inProgress: number;
    overdue: number;
    completionRate: number;
  };
}
