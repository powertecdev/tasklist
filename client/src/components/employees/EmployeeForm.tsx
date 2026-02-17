import { useState, useEffect } from "react";
import { User } from "../../types";

interface EmployeeFormProps {
  employee?: User | null;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

export default function EmployeeForm({ employee, onSubmit, onCancel }: EmployeeFormProps) {
  const [form, setForm] = useState({ name: "", email: "", password: "", department: "", role: "EMPLOYEE" });

  useEffect(() => {
    if (employee) {
      setForm({ name: employee.name, email: employee.email, password: "", department: employee.department || "", role: employee.role });
    }
  }, [employee]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data: any = { ...form };
    if (employee && !data.password) delete data.password;
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Nome *</label>
        <input type="text" required minLength={2} value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
        <input type="email" required value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{employee ? "Nova Senha (opcional)" : "Senha *"}</label>
        <input type="password" minLength={6} required={!employee} value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Departamento</label>
        <input type="text" value={form.department}
          onChange={(e) => setForm({ ...form, department: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Cargo</label>
        <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
          <option value="EMPLOYEE">Funcionario</option>
          <option value="ADMIN">Administrador</option>
        </select>
      </div>
      <div className="flex gap-3 pt-4">
        <button type="submit" className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
          {employee ? "Salvar" : "Cadastrar"}
        </button>
        <button type="button" onClick={onCancel} className="px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium">
          Cancelar
        </button>
      </div>
    </form>
  );
}
