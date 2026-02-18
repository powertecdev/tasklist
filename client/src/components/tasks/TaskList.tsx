import { Task } from "../../types";
import TaskCard from "./TaskCard";

interface Props {
  tasks: Task[];
  canEdit?: boolean;
  onEdit?: (task: Task) => void;
  onDelete?: (id: string) => void;
  onStatusChange?: (id: string, status: string) => void;
}

export default function TaskList({ tasks, canEdit, onEdit, onDelete, onStatusChange }: Props) {
  if (tasks.length === 0) {
    return <div className="text-center py-12 text-gray-500">Nenhuma tarefa encontrada.</div>;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} canEdit={canEdit}
          onEdit={onEdit} onDelete={onDelete} onStatusChange={onStatusChange} />
      ))}
    </div>
  );
}
