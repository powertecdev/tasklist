import { User } from "../../types";
import EmployeeCard from "./EmployeeCard";

interface Props {
  employees: User[];
  onEdit: (emp: User) => void;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function EmployeeList({ employees, onEdit, onToggle, onDelete }: Props) {
  if (employees.length === 0) {
    return <div className="text-center py-12 text-gray-500">Nenhum funcionario cadastrado.</div>;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {employees.map((emp) => (
        <EmployeeCard key={emp.id} employee={emp} onEdit={onEdit} onToggle={onToggle} onDelete={onDelete} />
      ))}
    </div>
  );
}
