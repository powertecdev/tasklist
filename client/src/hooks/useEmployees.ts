import { useState, useCallback } from "react";
import api from "../api/axios";
import { User } from "../types";

export function useEmployees() {
  const [employees, setEmployees] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchEmployees = useCallback(async () => {
    setLoading(true);
    try { const { data } = await api.get("/users"); setEmployees(data); }
    catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, []);

  const createEmployee = async (d: any) => { const { data } = await api.post("/users", d); return data; };
  const updateEmployee = async (id: string, d: any) => { const { data } = await api.put("/users/" + id, d); return data; };
  const toggleActive = async (id: string) => { const { data } = await api.patch("/users/" + id + "/toggle"); return data; };
  const deleteEmployee = async (id: string) => { await api.delete("/users/" + id); };

  return { employees, loading, fetchEmployees, createEmployee, updateEmployee, toggleActive, deleteEmployee };
}
