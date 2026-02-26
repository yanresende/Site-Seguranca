import { Link, Outlet } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Calendar,
  Settings,
  LogOut,
} from "lucide-react";

export default function Layout() {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* SIDEBAR */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-blue-600 tracking-tight">
            Sentinela
          </h1>
          <p className="text-xs text-gray-400">
            Sistema De Segurança Inteligente
          </p>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          <SidebarItem
            icon={<LayoutDashboard size={20} />}
            label="Dashboard"
            to="/dashboard"
          />
          <SidebarItem
            icon={<Users size={20} />}
            label="Suspeitos"
            to="/suspeitos"
          />
          <SidebarItem
            icon={<Users size={20} />}
            label="Vandalismo"
            to="/vandalismo"
          />
          <SidebarItem
            icon={<Users size={20} />}
            label="Técnico"
            to="/tecnico"
          />
          <SidebarItem
            icon={<Calendar size={20} />}
            label="Ocorrências"
            to="/ocorrencia"
          />
          <SidebarItem
            icon={<Settings size={20} />}
            label="Configurações"
            to="/config"
          />
        </nav>

        <div className="p-4 border-t border-gray-100">
          <button className="flex items-center gap-3 text-red-500 hover:bg-red-50 w-full p-2 rounded-lg transition">
            <LogOut size={20} />
            <span className="font-medium">Sair</span>
          </button>
        </div>
      </aside>

      {/* CONTEÚDO PRINCIPAL */}
      <main className="flex-1 overflow-y-auto p-8">
        {/* O Outlet é onde as páginas (Dashboard, etc) vão aparecer */}
        <Outlet />
      </main>
    </div>
  );
}

function SidebarItem({ icon, label, to }) {
  return (
    <Link
      to={to}
      className="flex items-center gap-3 text-gray-600 hover:bg-blue-50 hover:text-blue-600 p-3 rounded-xl transition-all group"
    >
      <span className="group-hover:scale-110 transition-transform">{icon}</span>
      <span className="font-medium">{label}</span>
    </Link>
  );
}
