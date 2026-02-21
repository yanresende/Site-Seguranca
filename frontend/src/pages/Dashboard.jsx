import StatsCard from "../components/StatsCard";
import { ShieldAlert, FileWarning, Siren, Activity, MapPin, Calendar, TrendingUp, AlertTriangle } from "lucide-react";

export default function Dashboard() {
  return (
    <div className="space-y-8">
      {/* 1. Título e Boas-vindas */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Painel de Segurança</h1>
        <p className="text-gray-500">Bem Vindo de Volta Ana</p>
      </div>

      {/* 2. Grid de Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Ocorrências (Mês)"
          value="42"
          icon={<FileWarning className="text-blue-600" />}
          color="bg-blue-600"
        />
        <StatsCard
          title="Itens Recuperados"
          value="3"
          icon={<ShieldAlert className="text-green-600" />}
          color="bg-green-600"
        />
        <StatsCard
          title="Polícia Acionada"
          value="1"
          icon={<Siren className="text-orange-600" />}
          color="bg-orange-600"
        />
        <StatsCard
          title="Valor Recuperado"
          value="R$ 1.2k"
          icon={<Activity className="text-purple-600" />}
          color="bg-purple-600"
        />
      </div>

      {/* 2.5. Estatísticas Detalhadas (Novos Gráficos CSS) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LOCAIS CRÍTICOS (Ranking) */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="font-bold text-gray-800 mb-6 flex items-center gap-2">
            <MapPin size={18} className="text-red-500" /> Locais Críticos
          </h3>
          <div className="space-y-4">
            <ProgressBar label="Rua das Flores" percent="75%" count="32" color="bg-red-500" />
            <ProgressBar label="Parque Central" percent="45%" count="18" color="bg-orange-500" />
            <ProgressBar label="Antena rua peixoto" percent="30%" count="12" color="bg-yellow-500" />
            <ProgressBar label="Avenida Principal" percent="15%" count="6" color="bg-blue-500" />
          </div>
        </div>

        {/* FREQUÊNCIA SEMANAL (Gráfico de Barras) */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col">
          <h3 className="font-bold text-gray-800 mb-6 flex items-center gap-2">
            <Calendar size={18} className="text-blue-500" /> Incidência Semanal
          </h3>
          <div className="flex-1 flex items-end justify-between gap-2 px-2">
            <BarDay day="Seg" height="h-12" color="bg-blue-200" />
            <BarDay day="Ter" height="h-16" color="bg-blue-200" />
            <BarDay day="Qua" height="h-14" color="bg-blue-200" />
            <BarDay day="Qui" height="h-24" color="bg-blue-300" />
            <BarDay day="Sex" height="h-40" color="bg-blue-500" />
            <BarDay day="Sáb" height="h-32" color="bg-blue-600" />
            <BarDay day="Dom" height="h-20" color="bg-blue-400" />
          </div>
          <p className="text-xs text-center text-gray-400 mt-4">Volume de ocorrências por dia</p>
        </div>

        {/* TIPOS DE INFRAÇÃO (Lista com Ícones) */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="font-bold text-gray-800 mb-6 flex items-center gap-2">
            <TrendingUp size={18} className="text-purple-500" /> Tipos de Infrações
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 text-purple-600 rounded-lg"><FileWarning size={16}/></div>
                <span className="text-sm font-medium text-gray-700">Furto De Cabo</span>
              </div>
              <span className="font-bold text-gray-800">65%</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 text-red-600 rounded-lg"><AlertTriangle size={16}/></div>
                <span className="text-sm font-medium text-gray-700">Suspeito</span>
              </div>
              <span className="font-bold text-gray-800">15%</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 text-orange-600 rounded-lg"><Activity size={16}/></div>
                <span className="text-sm font-medium text-gray-700">Vandalismo</span>
              </div>
              <span className="font-bold text-gray-800">10%</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Tabela de Próximas Consultas (Agora dentro do return!) */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-50 flex justify-between items-center">
          <h3 className="font-bold text-gray-800">Últimas Ocorrências</h3>
          <button className="text-sm text-blue-600 font-medium hover:underline">
            Ver histórico completo
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-400 text-xs uppercase font-semibold">
              <tr>
                <th className="px-6 py-4">Suspeito</th>
                <th className="px-6 py-4">Horário</th>
                <th className="px-6 py-4">Infração</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              <TableRow
                name="Indivíduo A (Camisa Vermelha)"
                time="09:15"
                type="Furto - Cabos de Internet"
                status="Detido"
              />
              <TableRow
                name="Bruno Costa"
                time="10:30"
                type="Tentativa de Furto de Cabo"
                status="Liberado"
              />
              <TableRow
                name="Desconhecido"
                time="14:00"
                type="Abordagem Suspeita"
                status="Em Análise"
              />
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// --- Componentes Auxiliares para os Gráficos ---

function ProgressBar({ label, percent, count, color }) {
  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="font-medium text-gray-700">{label}</span>
        <span className="text-gray-500">{count} casos</span>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-2.5">
        <div className={`h-2.5 rounded-full ${color}`} style={{ width: percent }}></div>
      </div>
    </div>
  );
}

function BarDay({ day, height, color }) {
  return (
    <div className="flex flex-col items-center gap-2 group cursor-pointer">
      <div className="relative w-full flex justify-center">
        <div className={`w-8 rounded-t-lg transition-all group-hover:opacity-80 ${height} ${color}`}></div>
      </div>
      <span className="text-xs font-medium text-gray-500">{day}</span>
    </div>
  );
}

function TableRow({ name, time, type, status }) {
  const statusColors = {
    "Liberado": "bg-green-100 text-green-700",
    "Em Análise": "bg-blue-100 text-blue-700",
    "Detido": "bg-red-100 text-red-700",
  };

  return (
    <tr className="hover:bg-gray-50 transition">
      <td className="px-6 py-4 font-medium text-gray-700">{name}</td>
      <td className="px-6 py-4 text-gray-500">{time}</td>
      <td className="px-6 py-4 text-gray-500">{type}</td>
      <td className="px-6 py-4">
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[status]}`}
        >
          {status}
        </span>
      </td>
    </tr>
  );
}
