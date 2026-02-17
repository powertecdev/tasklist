import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useTasks } from "../hooks/useTasks";
import { useEmployees } from "../hooks/useEmployees";
import { Task } from "../types";
import TaskCard from "../components/tasks/TaskCard";
import TaskForm from "../components/tasks/TaskForm";
import Modal from "../components/ui/Modal";
import { Plus, Search } from "lucide-react";

export default function MyTasks() {
  const { user, isAdmin } = useAuth();
  const { tasks, loading, fetchMyTasks, createTask, updateTask, updateStatus, deleteTask } = useTasks();
  const { employees, fetchEmployees } = useEmployees();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  useEffect(() => { fetchMyTasks(); if (isAdmin) fetchEmployees(); }, []);

  const handleCreate = async (data: any) => {
    await createTask(data);
    setModalOpen(false);
    fetchMyTasks();
  };

  const handleUpdate = async (data: any) => {
    if (editingTask) {
      await updateTask(editingTask.id, data);
      setEditingTask(null);
      fetchMyTasks();
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    if (newStatus === "COMPLETED") {
      await updateStatus(id, newStatus);
    } else {
      const nextStep = prompt("Qual o proximo passo?");
      if (nextStep && nextStep.length >= 3) await updateStatus(id, newStatus, nextStep);
      else { alert("Proximo passo deve ter no minimo 3 caracteres"); return; }
    }
    fetchMyTasks();
  };

  const handleDelete = async (id: string) => {
    if (confirm("Excluir esta tarefa?")) { await deleteTask(id); fetchMyTasks(); }
  };

  const filtered = tasks.filter((t) => {
    if (search && !t.title.toLowerCase().includes(search.toLowerCase())) return false;
    if (filterStatus && t.status !== filterStatus) return false;
    return true;
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Minhas Tarefas</h1>
        <button onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors">
          <Plus size={20} /> Nova Tarefa
        </button>
      </div>

      <div className="flex gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Buscar tarefas..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
        </div>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
          className="px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
          <option value="">Todos os status</option>
          <option value="PENDING">Pendente</option>
          <option value="IN_PROGRESS">Em Progresso</option>
          <option value="COMPLETED">Concluida</option>
          <option value="CANCELLED">Cancelada</option>
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full" /></div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 text-gray-500">Nenhuma tarefa encontrada.</div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((task) => (
            <TaskCard key={task.id} task={task} canEdit
              onEdit={(t) => setEditingTask(t)} onDelete={handleDelete} onStatusChange={handleStatusChange} />
          ))}
        </div>
      )}

      <Modal isOpen={modalOpen || !!editingTask} onClose={() => { setModalOpen(false); setEditingTask(null); }}
        title={editingTask ? "Editar Tarefa" : "Nova Tarefa"}>
        <TaskForm task={editingTask} employees={employees} isAdmin={isAdmin} userId={user?.id}
          onSubmit={editingTask ? handleUpdate : handleCreate} onCancel={() => { setModalOpen(false); setEditingTask(null); }} />
      </Modal>
    </div>
  );
}
