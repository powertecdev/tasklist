import { Search } from "lucide-react";

interface Props {
  search: string;
  onSearchChange: (v: string) => void;
  filterStatus: string;
  onStatusChange: (v: string) => void;
  filterPriority: string;
  onPriorityChange: (v: string) => void;
}

export default function TaskFilters({ search, onSearchChange, filterStatus, onStatusChange, filterPriority, onPriorityChange }: Props) {
  return (
    <div className="flex gap-3 mb-6 flex-wrap">
      <div className="relative flex-1 min-w-[200px]">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input type="text" placeholder="Buscar tarefas..." value={search} onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
      </div>
      <select value={filterStatus} onChange={(e) => onStatusChange(e.target.value)}
        className="px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
        <option value="">Todos os status</option>
        <option value="PENDING">Pendente</option>
        <option value="IN_PROGRESS">Em Progresso</option>
        <option value="COMPLETED">Concluida</option>
        <option value="CANCELLED">Cancelada</option>
      </select>
      <select value={filterPriority} onChange={(e) => onPriorityChange(e.target.value)}
        className="px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
        <option value="">Todas prioridades</option>
        <option value="LOW">Baixa</option>
        <option value="MEDIUM">Media</option>
        <option value="HIGH">Alta</option>
        <option value="URGENT">Urgente</option>
      </select>
    </div>
  );
}
