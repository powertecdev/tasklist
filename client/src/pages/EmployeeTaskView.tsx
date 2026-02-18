import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTasks } from "../hooks/useTasks";
import { useAuth } from "../contexts/AuthContext";
import TaskCard from "../components/tasks/TaskCard";
import { ArrowLeft } from "lucide-react";
import api from "../api/axios";
import { User } from "../types";

export default function EmployeeTaskView() {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const { tasks, loading, fetchUserTasks, updateStatus, deleteTask } = useTasks();
  const [employee, setEmployee] = useState<User | null>(null);
  const [tab, setTab] = useState<"active" | "completed">("active");

  useEffect(() => {
    if (userId) {
      fetchUserTasks(userId);
      api.get("/users/" + userId).then((res) => setEmployee(res.data)).catch(console.error);
    }
  }, [userId]);

  const activeTasks = tasks.filter((t) => t.status === "PENDING" || t.status === "IN_PROGRESS");
  const completedTasks = tasks.filter((t) => t.status === "COMPLETED" || t.status === "CANCELLED");
  const displayTasks = tab === "active" ? activeTasks : completedTasks;

  const handleStatusChange = async (id: string, newStatus: string) => {
    if (newStatus === "COMPLETED") {
      await updateStatus(id, newStatus);
    } else {
      const nextStep = prompt("Qual o proximo passo?");
      if (nextStep && nextStep.length >= 3) await updateStatus(id, newStatus, nextStep);
      else { alert("Proximo passo deve ter no minimo 3 caracteres"); return; }
    }
    if (userId) fetchUserTasks(userId);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Excluir esta tarefa?")) {
      await deleteTask(id);
      if (userId) fetchUserTasks(userId);
    }
  };

  return (
    <div>
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4">
        <ArrowLeft size={20} /> Voltar
      </button>

      <h1 className="text-2xl font-bold text-gray-900 mb-1">
        Tarefas de {employee?.name || "..."}
      </h1>
      {employee?.department && <p className="text-gray-500 mb-6">{employee.department}</p>}

      <div className="flex gap-2 mb-6">
        <button onClick={() => setTab("active")}
          className={"px-4 py-2 rounded-lg font-medium " + (tab === "active" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600")}>
          Ativas ({activeTasks.length})
        </button>
        <button onClick={() => setTab("completed")}
          className={"px-4 py-2 rounded-lg font-medium " + (tab === "completed" ? "bg-green-600 text-white" : "bg-gray-100 text-gray-600")}>
          Historico ({completedTasks.length})
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full" /></div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {displayTasks.map((task) => (
            <TaskCard key={task.id} task={task} canEdit={isAdmin}
              onDelete={isAdmin ? handleDelete : undefined}
              onStatusChange={isAdmin ? handleStatusChange : undefined} />
          ))}
        </div>
      )}
      {!loading && displayTasks.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          {tab === "active" ? "Nenhuma tarefa ativa." : "Nenhuma tarefa no historico."}
        </div>
      )}
    </div>
  );
}
