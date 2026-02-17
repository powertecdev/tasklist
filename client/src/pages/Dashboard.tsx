import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import api from "../api/axios";
import { DashboardStats, UserOverview } from "../types";
import { ClipboardList, Clock, CheckCircle, AlertTriangle, Users, TrendingUp } from "lucide-react";

export default function Dashboard() {
  const { user, isAdmin } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [overview, setOverview] = useState<UserOverview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
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

  const cards = stats ? [
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

      {isAdmin && stats ? (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
            {cards.map((card) => (
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
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
          <ClipboardList size={48} className="text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">Acesse "Minhas Tarefas" para gerenciar suas atividades.</p>
        </div>
      )}
    </div>
  );
}
