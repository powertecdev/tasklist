import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import api from "../api/axios";
import { DashboardStats, UserOverview, Task } from "../types";
import { statusLabels, statusColors, priorityLabels, priorityColors, formatDate, isOverdue } from "../utils/formatters";
import { ClipboardList, Clock, CheckCircle, AlertTriangle, Users, TrendingUp, ArrowRight, Calendar } from "lucide-react";

export default function Dashboard() {
  const { user, isAdmin } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [overview, setOverview] = useState<UserOverview[]>([]);
  const [myTasks, setMyTasks] = useState<Task[]>([]);
  const [myStats, setMyStats] = useState({ total: 0, pending: 0, inProgress: 0, completed: 0, overdue: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        // Todos os usuarios carregam suas tarefas
        const myRes = await api.get("/tasks/my");
        const tasks: Task[] = myRes.data;
        setMyTasks(tasks);

        const pending = tasks.filter((t) => t.status === "PENDING").length;
        const inProgress = tasks.filter((t) => t.status === "IN_PROGRESS").length;
        const completed = tasks.filter((t) => t.status === "COMPLETED").length;
        const overdue = tasks.filter((t) => isOverdue(t.dueDate, t.status)).length;
        setMyStats({ total: tasks.length, pending, inProgress, completed, overdue });

        // Admin carrega dashboard global
        if (isAdmin) {
          const [statsRes, overviewRes] = await Promise.all([
            api.get("/dashboard/stats"),
            api.get("/dashboard/overview"),
          ]);
          setStats(statsRes.data);
          setOverview(overviewRes.data);
        }
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    load();
  }, [isAdmin]);

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full" /></div>;

  const activeTasks = myTasks.filter((t) => t.status === "PENDING" || t.status === "IN_PROGRESS");
  const urgentTasks = activeTasks.filter((t) => t.priority === "URGENT" || t.priority === "HIGH");
  const overdueTasks = activeTasks.filter((t) => isOverdue(t.dueDate, t.status));

  const myCards = [
    { label: "Total", value: myStats.total, icon: ClipboardList, color: "bg-blue-500" },
    { label: "Pendentes", value: myStats.pending, icon: Clock, color: "bg-yellow-500" },
    { label: "Em Progresso", value: myStats.inProgress, icon: TrendingUp, color: "bg-indigo-500" },
    { label: "Concluidas", value: myStats.completed, icon: CheckCircle, color: "bg-green-500" },
    { label: "Atrasadas", value: myStats.overdue, icon: AlertTriangle, color: "bg-red-500" },
  ];

  const globalCards = stats ? [
    { label: "Total", value: stats.total, icon: ClipboardList, color: "bg-blue-500" },
    { label: "Pendentes", value: stats.pending, icon: Clock, color: "bg-yellow-500" },
    { label: "Em Progresso", value: stats.inProgress, icon: TrendingUp, color: "bg-indigo-500" },
    { label: "Concluidas", value: stats.completed, icon: CheckCircle, color: "bg-green-500" },
    { label: "Urgentes", value: stats.urgent, icon: AlertTriangle, color: "bg-red-500" },
    { label: "Atrasadas", value: stats.overdue, icon: AlertTriangle, color: "bg-orange-500" },
  ] : [];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Bem-vindo, {user?.name}!
      </h1>

      {/* MINHAS METRICAS — para todos */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Minhas Tarefas</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {myCards.map((card) => (
            <div key={card.label} className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-center gap-3">
                <div className={card.color + " p-2 rounded-lg"}>
                  <card.icon size={20} className="text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                  <p className="text-xs text-gray-500">{card.label}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* TAREFAS URGENTES / ATRASADAS */}
      {(urgentTasks.length > 0 || overdueTasks.length > 0) && (
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {overdueTasks.length > 0 && (
            <div className="bg-white rounded-xl border border-red-200">
              <div className="p-4 border-b border-red-100 flex items-center gap-2">
                <AlertTriangle size={18} className="text-red-600" />
                <h3 className="font-semibold text-red-700">Atrasadas ({overdueTasks.length})</h3>
              </div>
              <div className="divide-y divide-red-50">
                {overdueTasks.slice(0, 5).map((task) => (
                  <div key={task.id} className="p-4">
                    <p className="font-medium text-gray-900">{task.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Calendar size={12} className="text-red-500" />
                      <span className="text-xs text-red-600">Prazo: {formatDate(task.dueDate)}</span>
                    </div>
                    {task.nextStep && (
                      <div className="flex items-center gap-1 mt-2 text-xs text-amber-700">
                        <ArrowRight size={12} /> {task.nextStep}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {urgentTasks.length > 0 && (
            <div className="bg-white rounded-xl border border-orange-200">
              <div className="p-4 border-b border-orange-100 flex items-center gap-2">
                <AlertTriangle size={18} className="text-orange-600" />
                <h3 className="font-semibold text-orange-700">Alta Prioridade ({urgentTasks.length})</h3>
              </div>
              <div className="divide-y divide-orange-50">
                {urgentTasks.slice(0, 5).map((task) => (
                  <div key={task.id} className="p-4">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-gray-900">{task.title}</p>
                      <span className={"text-xs px-2 py-0.5 rounded-full font-medium " + priorityColors[task.priority]}>
                        {priorityLabels[task.priority]}
                      </span>
                    </div>
                    <span className={"text-xs px-2 py-0.5 rounded-full mt-2 inline-block " + statusColors[task.status]}>
                      {statusLabels[task.status]}
                    </span>
                    {task.nextStep && (
                      <div className="flex items-center gap-1 mt-2 text-xs text-amber-700">
                        <ArrowRight size={12} /> {task.nextStep}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* PROXIMOS PASSOS — lista resumida */}
      {activeTasks.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 mb-8">
          <div className="p-4 border-b border-gray-200 flex items-center gap-2">
            <ArrowRight size={18} className="text-amber-600" />
            <h3 className="font-semibold">Proximos Passos</h3>
          </div>
          <div className="divide-y divide-gray-100">
            {activeTasks.filter((t) => t.nextStep).slice(0, 8).map((task) => (
              <div key={task.id} className="p-4 flex items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-gray-900 text-sm">{task.title}</p>
                    <span className={"text-xs px-2 py-0.5 rounded-full " + statusColors[task.status]}>
                      {statusLabels[task.status]}
                    </span>
                  </div>
                  <p className="text-sm text-amber-700 mt-1 bg-amber-50 px-3 py-1.5 rounded-lg inline-block">
                    {task.nextStep}
                  </p>
                </div>
                {task.dueDate && (
                  <span className={"text-xs px-2 py-1 rounded-full shrink-0 " +
                    (isOverdue(task.dueDate, task.status) ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-600")}>
                    {formatDate(task.dueDate)}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ADMIN — metricas globais */}
      {isAdmin && stats && (
        <>
          <div className="border-t border-gray-200 pt-8 mb-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Visao Geral da Empresa</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
              {globalCards.map((card) => (
                <div key={card.label} className="bg-white rounded-xl border border-gray-200 p-4">
                  <div className="flex items-center gap-3">
                    <div className={card.color + " p-2 rounded-lg"}>
                      <card.icon size={20} className="text-white" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                      <p className="text-xs text-gray-500">{card.label}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200">
            <div className="p-6 border-b border-gray-200 flex items-center gap-2">
              <Users size={20} className="text-gray-600" />
              <h2 className="text-lg font-semibold">Visao por Funcionario</h2>
            </div>
            <div className="divide-y divide-gray-100">
              {overview.map((emp) => (
                <div key={emp.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                  <div>
                    <p className="font-medium text-gray-900">{emp.name}</p>
                    {emp.department && <p className="text-sm text-gray-500">{emp.department}</p>}
                  </div>
                  <div className="flex items-center gap-6 text-sm">
                    <div className="text-center">
                      <p className="font-semibold text-gray-900">{emp.stats.total}</p>
                      <p className="text-xs text-gray-500">Total</p>
                    </div>
                    <div className="text-center">
                      <p className="font-semibold text-green-600">{emp.stats.completed}</p>
                      <p className="text-xs text-gray-500">Feitas</p>
                    </div>
                    <div className="text-center">
                      <p className="font-semibold text-blue-600">{emp.stats.inProgress}</p>
                      <p className="text-xs text-gray-500">Andamento</p>
                    </div>
                    {emp.stats.overdue > 0 && (
                      <div className="text-center">
                        <p className="font-semibold text-red-600">{emp.stats.overdue}</p>
                        <p className="text-xs text-gray-500">Atrasadas</p>
                      </div>
                    )}
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: emp.stats.completionRate + "%" }} />
                    </div>
                    <span className="text-xs font-medium text-gray-600 w-10">{emp.stats.completionRate}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
