import { useState, useCallback } from "react";
import api from "../api/axios";
import { Task, TaskFilters } from "../types";

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, totalPages: 0 });

  const fetchTasks = useCallback(async (filters?: TaskFilters) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters?.status?.length) params.set("status", filters.status.join(","));
      if (filters?.priority?.length) params.set("priority", filters.priority.join(","));
      if (filters?.ownerId) params.set("ownerId", filters.ownerId);
      if (filters?.search) params.set("search", filters.search);
      if (filters?.sortBy) params.set("sortBy", filters.sortBy);
      if (filters?.sortOrder) params.set("sortOrder", filters.sortOrder);
      if (filters?.page) params.set("page", String(filters.page));
      if (filters?.limit) params.set("limit", String(filters.limit));
      const { data } = await api.get("/tasks?" + params.toString());
      setTasks(data.tasks);
      setPagination(data.pagination);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, []);

  const fetchMyTasks = useCallback(async () => {
    setLoading(true);
    try { const { data } = await api.get("/tasks/my"); setTasks(data); }
    catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, []);

  const fetchUserTasks = useCallback(async (userId: string) => {
    setLoading(true);
    try { const { data } = await api.get("/tasks/user/" + userId); setTasks(data); }
    catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, []);

  const createTask = async (taskData: any) => { const { data } = await api.post("/tasks", taskData); return data; };
  const updateTask = async (id: string, taskData: any) => { const { data } = await api.put("/tasks/" + id, taskData); return data; };
  const updateStatus = async (id: string, status: string, nextStep?: string | null) => {
    const { data } = await api.patch("/tasks/" + id + "/status", { status, nextStep }); return data;
  };
  const deleteTask = async (id: string) => { await api.delete("/tasks/" + id); };

  return { tasks, loading, pagination, fetchTasks, fetchMyTasks, fetchUserTasks, createTask, updateTask, updateStatus, deleteTask };
}
