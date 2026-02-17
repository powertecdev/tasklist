import { Task } from "../../types";
import { formatDate, isOverdue, statusLabels, priorityLabels, statusColors, priorityColors } from "../../utils/formatters";
import { ArrowRight, Calendar, MessageSquare, Pencil, Trash2 } from "lucide-react";

interface TaskCardProps {
  task: Task;
  canEdit?: boolean;
  onEdit?: (task: Task) => void;
  onDelete?: (id: string) => void;
  onStatusChange?: (id: string, status: string) => void;
}

export default function TaskCard({ task, canEdit, onEdit, onDelete, onStatusChange }: TaskCardProps) {
  const overdue = isOverdue(task.dueDate, task.status);

  return (
    <div className={"bg-white rounded-xl border p-5 hover:shadow-md transition-shadow " + (overdue ? "border-red-300" : "border-gray-200")}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 truncate">{task.title}</h3>
          {task.description && <p className="text-sm text-gray-500 mt-1 line-clamp-2">{task.description}</p>}
        </div>
        {canEdit && (
          <div className="flex gap-1 shrink-0">
            <button onClick={() => onEdit?.(task)} className="p-1.5 hover:bg-gray-100 rounded text-gray-500"><Pencil size={16} /></button>
            <button onClick={() => onDelete?.(task.id)} className="p-1.5 hover:bg-red-50 rounded text-red-500"><Trash2 size={16} /></button>
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2 mt-3">
        <span className={"text-xs px-2.5 py-1 rounded-full font-medium " + statusColors[task.status]}>{statusLabels[task.status]}</span>
        <span className={"text-xs px-2.5 py-1 rounded-full font-medium " + priorityColors[task.priority]}>{priorityLabels[task.priority]}</span>
        {task.dueDate && (
          <span className={"text-xs px-2.5 py-1 rounded-full flex items-center gap-1 " + (overdue ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-600")}>
            <Calendar size={12} /> {formatDate(task.dueDate)}
          </span>
        )}
        {(task.commentCount ?? 0) > 0 && (
          <span className="text-xs px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 flex items-center gap-1">
            <MessageSquare size={12} /> {task.commentCount}
          </span>
        )}
      </div>

      {task.nextStep && (task.status === "PENDING" || task.status === "IN_PROGRESS") && (
        <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
          <div className="flex items-center gap-1.5 text-amber-700 text-xs font-semibold mb-1">
            <ArrowRight size={14} /> PROXIMO PASSO
          </div>
          <p className="text-sm text-amber-900">{task.nextStep}</p>
        </div>
      )}

      <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
        <span className="text-xs text-gray-400">{task.owner?.name}</span>
        {canEdit && task.status !== "COMPLETED" && task.status !== "CANCELLED" && (
          <button
            onClick={() => onStatusChange?.(task.id, task.status === "PENDING" ? "IN_PROGRESS" : "COMPLETED")}
            className="text-xs px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {task.status === "PENDING" ? "Iniciar" : "Concluir"}
          </button>
        )}
      </div>
    </div>
  );
}
