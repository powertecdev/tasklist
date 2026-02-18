import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useTasks } from "../hooks/useTasks";
import { useEmployees } from "../hooks/useEmployees";
import TaskCard from "../components/tasks/TaskCard";
import { ClipboardList, CheckCircle, Clock, AlertTriangle } from "lucide-react";

export default function AllTasks() {
  const { isAdmin } = useAuth();
  const { tasks, loading, pagination, fetchTasks, updateStatus, deleteTask } = useTasks();
  const { employees, fetchEmployees } = useEmployees();
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterPriority, setFilterPriority] = useState("");
  const [filterOwner, setFilterOwner] = useState("");
  const [tab, setTab] = useState<"active" | "completed">("active");

  useEffect(() => { fetchEmployees(); }, []);

  useEffect(() => {
    const filters: any = { limit: 50 };
    if (tab === "active") {
      filters.status = filterStatus || "PENDING,IN_PROGRESS";
    } else {
      filters.status = "COMPLETED,CANCELLED";
    }
    if (filterPriority) filters.priority = filterPriority;
    if (filterOwner) filters.ownerId = filterOwner;
    if (search) filters.search = search;
    fetchTasks(filters);
  }, [tab, filterStatus, filterPriority, filterOwner, search]);

  const handleStatusChange = async (id: string, newStatus: string) => {
    if (newStatus === "COMPLETED") {
      await updateStatus(id, newStatus);
    } else {
      const nextStep = prompt("Qual o proximo passo?");
      if (nextStep && nextStep.length >= 3) await updateStatus(id, newStatus, nextStep);
      else { alert("Proximo passo deve ter no minimo 3 caracteres"); return; }
    }
    fetchTasks({ status: tab === "active" ? "PENDING,IN_PROGRESS" : "COMPLETED,CANCELLED", limit: 50 });
  };

  const handleDelete = async (id: string) => {
    if (confirm("Excluir esta tarefa?")) {
      await deleteTask(id);
      fetchTasks({ status: tab === "active" ? "PENDING,IN_PROGRESS" : "COMPLETED,CANCELLED", limit: 50 });
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Todas as Tarefas</h1>

      <div className="flex gap-2 mb-6">
        <button onClick={() => setTab("active")}
          className={"px-4 py-2.5 rounded-lg font-medium transition-colors flex items-center gap-2 " +
            (tab === "active" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200")}>
          <Clock size={18} /> Ativas
        </button>
        <button onClick={() => setTab("completed")}
          className={"px-4 py-2.5 rounded-lg font-medium transition-colors flex items-center gap-2 " +
            (tab === "completed" ? "bg-green-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200")}>
          <CheckCircle size={18} /> Historico
        </button>
      </div>

      <div className="flex gap-3 mb-6 flex-wrap">
        <input type="text" placeholder="Buscar..." value={search} onChange={(e) => setSearch(e.target.value)}
          className="flex-1 min-w-[200px] px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
        <select value={filterOwner} onChange={(e) => setFilterOwner(e.target.value)}
          className="px-3 py-2.5 border border-gray-300 rounded-lg">
          <option value="">Todos funcionarios</option>
          {employees.filter((e) => e.isActive).map((emp) => (
            <option key={emp.id} value={emp.id}>{emp.name}</option>
          ))}
        </select>
        <select value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)}
          className="px-3 py-2.5 border border-gray-300 rounded-lg">
          <option value="">Todas prioridades</option>
          <option value="LOW">Baixa</option>
          <option value="MEDIUM">Media</option>
          <option value="HIGH">Alta</option>
          <option value="URGENT">Urgente</option>
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full" /></div>
      ) : tasks.length === 0 ? (
        <div className="text-center py-12">
          <ClipboardList size={48} className="text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">{tab === "active" ? "Nenhuma tarefa ativa." : "Nenhuma tarefa no historico."}</p>
        </div>
      ) : (
        <>
          <p className="text-sm text-gray-500 mb-4">{pagination.total} tarefa(s) encontrada(s)</p>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {tasks.map((task) => (
              <TaskCard key={task.id} task={task} canEdit={isAdmin}
                onDelete={isAdmin ? handleDelete : undefined}
                onStatusChange={isAdmin ? handleStatusChange : undefined} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
