import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useEmployees } from "../hooks/useEmployees";
import { Users, ChevronRight } from "lucide-react";

export default function TeamTasks() {
  const { employees, fetchEmployees } = useEmployees();
  const navigate = useNavigate();

  useEffect(() => { fetchEmployees(); }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Equipe</h1>

      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-4 border-b border-gray-200 flex items-center gap-2">
          <Users size={18} className="text-gray-600" />
          <h2 className="font-semibold">Funcionarios</h2>
        </div>
        <div className="divide-y divide-gray-100">
          {employees.filter((e) => e.isActive).map((emp) => (
            <button key={emp.id} onClick={() => navigate("/team-tasks/" + emp.id)}
              className="w-full text-left p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
              <div>
                <p className="font-medium text-gray-900">{emp.name}</p>
                {emp.department && <p className="text-xs text-gray-500">{emp.department}</p>}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">{emp.taskCount ?? 0} tarefas</span>
                <ChevronRight size={16} className="text-gray-400" />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
