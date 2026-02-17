import { useEffect, useState } from "react";
import { useEmployees } from "../hooks/useEmployees";
import { User } from "../types";
import EmployeeForm from "../components/employees/EmployeeForm";
import Modal from "../components/ui/Modal";
import { Plus, Pencil, Trash2, UserCheck, UserX } from "lucide-react";

export default function ManageEmployees() {
  const { employees, loading, fetchEmployees, createEmployee, updateEmployee, toggleActive, deleteEmployee } = useEmployees();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<User | null>(null);

  useEffect(() => { fetchEmployees(); }, []);

  const handleCreate = async (data: any) => {
    await createEmployee(data);
    setModalOpen(false);
    fetchEmployees();
  };

  const handleUpdate = async (data: any) => {
    if (editing) { await updateEmployee(editing.id, data); setEditing(null); fetchEmployees(); }
  };

  const handleToggle = async (id: string) => { await toggleActive(id); fetchEmployees(); };

  const handleDelete = async (id: string) => {
    if (confirm("Excluir este funcionario?")) {
      try { await deleteEmployee(id); fetchEmployees(); }
      catch (err: any) { alert(err.response?.data?.error || "Erro ao excluir"); }
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Gerenciar Funcionarios</h1>
        <button onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors">
          <Plus size={20} /> Novo Funcionario
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full" /></div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Nome</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Email</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Depto</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Cargo</th>
                <th className="text-center px-6 py-4 text-sm font-semibold text-gray-600">Tarefas</th>
                <th className="text-center px-6 py-4 text-sm font-semibold text-gray-600">Status</th>
                <th className="text-right px-6 py-4 text-sm font-semibold text-gray-600">Acoes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {employees.map((emp) => (
                <tr key={emp.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">{emp.name}</td>
                  <td className="px-6 py-4 text-gray-600">{emp.email}</td>
                  <td className="px-6 py-4 text-gray-600">{emp.department || "-"}</td>
                  <td className="px-6 py-4">
                    <span className={"text-xs px-2 py-1 rounded-full font-medium " +
                      (emp.role === "ADMIN" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700")}>
                      {emp.role === "ADMIN" ? "Admin" : "Funcionario"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center text-gray-600">{emp.taskCount ?? 0}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={"text-xs px-2 py-1 rounded-full font-medium " +
                      (emp.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700")}>
                      {emp.isActive ? "Ativo" : "Inativo"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-1 justify-end">
                      <button onClick={() => setEditing(emp)} className="p-2 hover:bg-gray-100 rounded text-gray-500" title="Editar"><Pencil size={16} /></button>
                      <button onClick={() => handleToggle(emp.id)} className="p-2 hover:bg-gray-100 rounded text-gray-500"
                        title={emp.isActive ? "Desativar" : "Ativar"}>
                        {emp.isActive ? <UserX size={16} /> : <UserCheck size={16} />}
                      </button>
                      <button onClick={() => handleDelete(emp.id)} className="p-2 hover:bg-red-50 rounded text-red-500" title="Excluir"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal isOpen={modalOpen || !!editing} onClose={() => { setModalOpen(false); setEditing(null); }}
        title={editing ? "Editar Funcionario" : "Novo Funcionario"}>
        <EmployeeForm employee={editing}
          onSubmit={editing ? handleUpdate : handleCreate}
          onCancel={() => { setModalOpen(false); setEditing(null); }} />
      </Modal>
    </div>
  );
}
