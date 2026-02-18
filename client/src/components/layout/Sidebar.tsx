import { NavLink } from "react-router-dom";
import { LayoutDashboard, CheckSquare, Users, ClipboardList, List, LogOut } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

export default function Sidebar() {
  const { user, logout, isAdmin } = useAuth();
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors " +
    (isActive ? "bg-blue-600 text-white" : "text-gray-300 hover:bg-gray-700");

  return (
    <aside className="w-64 bg-gray-800 min-h-screen flex flex-col">
      <div className="p-6 border-b border-gray-700">
        <h1 className="text-xl font-bold text-white">TaskList</h1>
        <p className="text-sm text-gray-400 mt-1">{user?.name}</p>
        <span className="text-xs px-2 py-0.5 rounded bg-blue-600 text-white mt-1 inline-block">
          {user?.role === "ADMIN" ? "Admin" : "Funcionario"}
        </span>
      </div>

      <nav className="flex-1 p-4 flex flex-col gap-1">
        <NavLink to="/dashboard" className={linkClass}>
          <LayoutDashboard size={20} /> Dashboard
        </NavLink>
        <NavLink to="/my-tasks" className={linkClass}>
          <CheckSquare size={20} /> Minhas Tarefas
        </NavLink>
        <NavLink to="/all-tasks" className={linkClass}>
          <List size={20} /> Todas as Tarefas
        </NavLink>
        <NavLink to="/team-tasks" className={linkClass}>
          <ClipboardList size={20} /> Equipe
        </NavLink>
        {isAdmin && (
          <NavLink to="/employees" className={linkClass}>
            <Users size={20} /> Funcionarios
          </NavLink>
        )}
      </nav>

      <div className="p-4 border-t border-gray-700">
        <button onClick={logout} className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-700 w-full transition-colors">
          <LogOut size={20} /> Sair
        </button>
      </div>
    </aside>
  );
}
