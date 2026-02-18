import { User } from "../../types";
import { Pencil, UserCheck, UserX, Trash2 } from "lucide-react";

interface Props {
  employee: User;
  onEdit: (emp: User) => void;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function EmployeeCard({ employee, onEdit, onToggle, onDelete }: Props) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-semibold text-gray-900">{employee.name}</h3>
          <p className="text-sm text-gray-500">{employee.email}</p>
          {employee.department && <p className="text-xs text-gray-400 mt-1">{employee.department}</p>}
        </div>
        <div className="flex gap-1">
          <button onClick={() => onEdit(employee)} className="p-1.5 hover:bg-gray-100 rounded text-gray-500"><Pencil size={16} /></button>
          <button onClick={() => onToggle(employee.id)} className="p-1.5 hover:bg-gray-100 rounded text-gray-500">
            {employee.isActive ? <UserX size={16} /> : <UserCheck size={16} />}
          </button>
          <button onClick={() => onDelete(employee.id)} className="p-1.5 hover:bg-red-50 rounded text-red-500"><Trash2 size={16} /></button>
        </div>
      </div>
      <div className="flex gap-2 mt-3">
        <span className={"text-xs px-2 py-1 rounded-full font-medium " +
          (employee.role === "ADMIN" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700")}>
          {employee.role === "ADMIN" ? "Admin" : "Funcionario"}
        </span>
        <span className={"text-xs px-2 py-1 rounded-full font-medium " +
          (employee.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700")}>
          {employee.isActive ? "Ativo" : "Inativo"}
        </span>
        <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">
          {employee.taskCount ?? 0} tarefas
        </span>
      </div>
    </div>
  );
}
