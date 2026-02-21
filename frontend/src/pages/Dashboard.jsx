import StatsCard from "../components/StatsCard";
import { ShieldAlert, FileWarning, Siren, Activity } from "lucide-react";

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
                type="Furto - Eletrônicos"
                status="Detido"
              />
              <TableRow
                name="Bruno Costa"
                time="10:30"
                type="Tentativa de Furto"
                status="Liberado"
              />
              <TableRow
                name="Desconhecido"
                time="14:00"
                type="Comportamento Suspeito"
                status="Em Análise"
              />
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// O componente auxiliar fica aqui fora mesmo, sem problemas!
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
