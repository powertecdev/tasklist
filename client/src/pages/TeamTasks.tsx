import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useTasks } from "../hooks/useTasks";
import { useEmployees } from "../hooks/useEmployees";
import TaskCard from "../components/tasks/TaskCard";
import { Users, ChevronRight } from "lucide-react";

export default function TeamTasks() {
  const { isAdmin } = useAuth();
  const { tasks, loading, fetchUserTasks, updateStatus, deleteTask } = useTasks();
  const { employees, fetchEmployees } = useEmployees();
  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  useEffect(() => { fetchEmployees(); }, []);
  useEffect(() => { if (selectedUser) fetchUserTasks(selectedUser); }, [selectedUser]);

  const handleStatusChange = async (id: string, newStatus: string) => {
    if (newStatus === "COMPLETED") {
      await updateStatus(id, newStatus);
    } else {
      const nextStep = prompt("Qual o proximo passo?");
      if (nextStep && nextStep.length >= 3) await updateStatus(id, newStatus, nextStep);
      else { alert("Proximo passo deve ter no minimo 3 caracteres"); return; }
    }
    if (selectedUser) fetchUserTasks(selectedUser);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Excluir esta tarefa?")) {
      await deleteTask(id);
      if (selectedUser) fetchUserTasks(selectedUser);
    }
  };

  const selectedEmployee = employees.find((e) => e.id === selectedUser);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Tarefas da Equipe</h1>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-4">
          <div className="bg-white rounded-xl border border-gray-200">
            <div className="p-4 border-b border-gray-200 flex items-center gap-2">
              <Users size={18} className="text-gray-600" />
              <h2 className="font-semibold">Funcionarios</h2>
            </div>
            <div className="divide-y divide-gray-100">
              {employees.filter((e) => e.isActive).map((emp) => (
                <button key={emp.id} onClick={() => setSelectedUser(emp.id)}
                  className={"w-full text-left p-4 flex items-center justify-between hover:bg-gray-50 transition-colors " +
                    (selectedUser === emp.id ? "bg-blue-50 border-l-4 border-blue-600" : "")}>
                  <div>
                    <p className="font-medium text-gray-900">{emp.name}</p>
                    {emp.department && <p className="text-xs text-gray-500">{emp.department}</p>}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">{emp.taskCount ?? 0}</span>
                    <ChevronRight size={16} className="text-gray-400" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="col-span-8">
          {!selectedUser ? (
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
              <Users size={48} className="text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Selecione um funcionario para ver suas tarefas.</p>
            </div>
          ) : loading ? (
            <div className="flex justify-center py-12"><div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full" /></div>
          ) : (
            <>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Tarefas de {selectedEmployee?.name}
                <span className="text-sm font-normal text-gray-500 ml-2">({tasks.length} tarefas)</span>
              </h2>
              {tasks.length === 0 ? (
                <div className="text-center py-12 text-gray-500">Nenhuma tarefa encontrada.</div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {tasks.map((task) => (
                    <TaskCard key={task.id} task={task} canEdit={isAdmin}
                      onDelete={isAdmin ? handleDelete : undefined}
                      onStatusChange={isAdmin ? handleStatusChange : undefined} />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
