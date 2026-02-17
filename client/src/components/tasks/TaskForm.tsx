import { useState, useEffect } from "react";
import { Task, User } from "../../types";

interface TaskFormProps {
  task?: Task | null;
  employees?: User[];
  isAdmin?: boolean;
  userId?: string;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

export default function TaskForm({ task, employees, isAdmin, userId, onSubmit, onCancel }: TaskFormProps) {
  const [form, setForm] = useState({
    title: "", description: "", status: "PENDING", priority: "MEDIUM",
    nextStep: "", dueDate: "", ownerId: userId || "",
  });

  useEffect(() => {
    if (task) {
      setForm({
        title: task.title, description: task.description || "",
        status: task.status, priority: task.priority,
        nextStep: task.nextStep || "", dueDate: task.dueDate ? task.dueDate.split("T")[0] : "",
        ownerId: task.ownerId,
      });
    }
  }, [task]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data: any = { ...form };
    if (data.dueDate) data.dueDate = new Date(data.dueDate).toISOString();
    else data.dueDate = null;
    if (!data.nextStep) data.nextStep = null;
    if (!isAdmin) delete data.ownerId;
    onSubmit(data);
  };

  const needsNextStep = form.status === "PENDING" || form.status === "IN_PROGRESS";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Titulo *</label>
        <input type="text" required minLength={3} value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Descricao</label>
        <textarea rows={3} value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
            <option value="PENDING">Pendente</option>
            <option value="IN_PROGRESS">Em Progresso</option>
            <option value="COMPLETED">Concluida</option>
            <option value="CANCELLED">Cancelada</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Prioridade</label>
          <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
            <option value="LOW">Baixa</option>
            <option value="MEDIUM">Media</option>
            <option value="HIGH">Alta</option>
            <option value="URGENT">Urgente</option>
          </select>
        </div>
      </div>

      {needsNextStep && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Proximo Passo *</label>
          <input type="text" required minLength={3} maxLength={500} value={form.nextStep}
            placeholder="Qual o proximo passo para esta tarefa?"
            onChange={(e) => setForm({ ...form, nextStep: e.target.value })}
            className="w-full px-3 py-2 border border-amber-300 bg-amber-50 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500" />
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Prazo</label>
        <input type="date" value={form.dueDate}
          onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
      </div>

      {isAdmin && employees && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Atribuir para</label>
          <select value={form.ownerId} onChange={(e) => setForm({ ...form, ownerId: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
            {employees.filter((e) => e.isActive).map((emp) => (
              <option key={emp.id} value={emp.id}>{emp.name}</option>
            ))}
          </select>
        </div>
      )}

      <div className="flex gap-3 pt-4">
        <button type="submit" className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors">
          {task ? "Salvar" : "Criar Tarefa"}
        </button>
        <button type="button" onClick={onCancel} className="px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium transition-colors">
          Cancelar
        </button>
      </div>
    </form>
  );
}
