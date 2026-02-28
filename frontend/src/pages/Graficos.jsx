import { useState, useEffect } from "react";
import StatsCard from "../components/StatsCard";
import {
  ShieldAlert,
  FileWarning,
  Siren,
  Activity,
  MapPin,
  Calendar,
  Filter,
  Download,
  PieChart,
  Radio,
} from "lucide-react";

export default function Graficos() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const today = new Date();
  const defaultFim = today.toISOString().split('T')[0];
  const defaultInicio = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
  const [dates, setDates] = useState({
    inicio: defaultInicio,
    fim: defaultFim
  });

  const fetchStats = () => {
    setLoading(true);
    const params = new URLSearchParams(dates);
    fetch(`http://localhost:8080/api/dashboard/stats?${params.toString()}`)
      .then(res => res.json())
      .then(data => {
        setStats(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Erro ao carregar estatísticas:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading || !stats) {
    return <div className="flex justify-center items-center h-screen text-gray-500">Carregando estatísticas...</div>;
  }

  // Cálculos para exibição
  const taxaResolucao = stats.totalOcorrencias > 0 
    ? Math.round((stats.concluidos / stats.totalOcorrencias) * 100) 
    : 0;

  // Preparar dados para o gráfico de pizza (Status)
  const statusData = Object.entries(stats.porStatus || {});
  const statusHexColors = {
    "Concluido": "#22c55e",
    "Pendente": "#ef4444",
    "Em andamento": "#f97316"
  };
  const statusBgColors = {
    "Concluido": "bg-green-500",
    "Concluida": "bg-green-500",
    "Pendente": "bg-red-500",
    "Em andamento": "bg-orange-500"
  };

  // Gerar o conic-gradient para o gráfico de pizza
  let cumulativePercent = 0;
  const gradientParts = statusData.map(([status, count]) => {
    const percent = (count / stats.totalOcorrencias) * 100;
    const color = statusHexColors[status] || "#6b7280"; // gray-500
    const part = `${color} ${cumulativePercent}% ${cumulativePercent + percent}%`;
    cumulativePercent += percent;
    return part;
  });
  const conicGradient = `conic-gradient(${gradientParts.join(', ')})`;

  // Preparar dados para o gráfico de Horários de Pico
  const peakHoursData = new Array(24).fill(0); // 24 barras para 24h
  Object.entries(stats.porHora || {}).forEach(([hour, count]) => {
    const hourInt = parseInt(hour, 10);
    if (hourInt >= 0 && hourInt < 24) peakHoursData[hourInt] += count;
  });
  const maxPeakCount = Math.max(...peakHoursData, 1);

  // Encontrar o bairro com mais casos
  const topBairroEntry = Object.entries(stats.porBairro || {})[0];
  const topBairroName = topBairroEntry ? topBairroEntry[0] : "N/A";

  return (
    <div className="space-y-8">
      {/* 1. Header & Filters */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Relatórios e Estatísticas
          </h1>
          <p className="text-gray-500">
            Análise detalhada de segurança e incidentes.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-2">
          <div className="flex items-center gap-2 bg-white p-2 rounded-xl border border-gray-200 shadow-sm">
            <span className="text-xs font-bold text-gray-400 uppercase ml-2">
              Período:
            </span>
            <input
              type="date"
              className="text-sm outline-none text-gray-600 bg-transparent"
              value={dates.inicio}
              onChange={(e) => setDates({...dates, inicio: e.target.value})}
            />
            <span className="text-gray-400">-</span>
            <input
              type="date"
              className="text-sm outline-none text-gray-600 bg-transparent"
              value={dates.fim}
              onChange={(e) => setDates({...dates, fim: e.target.value})}
            />
          </div>
          <button onClick={fetchStats} className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 font-medium shadow-sm transition">
            <Filter size={18} /> Aplicar
          </button>
          <button className="flex items-center gap-2 bg-blue-600 px-4 py-2 rounded-xl text-white hover:bg-blue-700 font-bold shadow-lg shadow-blue-100 transition">
            <Download size={18} /> Exportar PDF
          </button>
        </div>
      </div>

      {/* 2. KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total de Ocorrências"
          value={stats.totalOcorrencias}
          icon={<FileWarning className="text-blue-600" />}
          color="bg-blue-600"
        />
        <StatsCard
          title="Taxa de Resolução"
          value={`${taxaResolucao}%`}
          icon={<ShieldAlert className="text-green-600" />}
          color="bg-green-600"
        />
        <StatsCard
          title="Ocorrências Pendentes"
          value={stats.porStatus["Pendente"] || 0}
          icon={<Siren className="text-orange-600" />}
          color="bg-orange-600"
        />
        <StatsCard
          title="Bairro com Mais Casos"
          value={topBairroName}
          icon={<MapPin className="text-purple-600" />}
          color="bg-purple-600"
        />
      </div>

      {/* 3. Main Charts Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Nova Estatística: Ocorrências por Fonte */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="font-bold text-gray-800 mb-6 flex items-center gap-2">
            <Radio size={18} className="text-cyan-500" /> Ocorrências por Fonte
          </h3>
          <div className="space-y-5">
            {Object.entries(stats.porFonte || {}).map(([fonte, count]) => (
              <ProgressBar
                key={fonte}
                label={fonte}
                percent={`${(count / stats.totalOcorrencias) * 100}%`}
                count={count}
                color="bg-cyan-500"
              />
            ))}
          </div>
        </div>

        {/* Chart 2: Distribution by Type */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="font-bold text-gray-800 mb-6 flex items-center gap-2">
            <PieChart size={18} className="text-purple-500" /> Distribuição por
            Tipo
          </h3>

          {/* Gráfico de Pizza Simples (Visualização em Lista com Barras) */}
          <div className="flex justify-center mb-6">
            <div
              className="w-48 h-48 rounded-full relative"
              style={{ background: conicGradient }}
            >
              <div className="absolute inset-4 bg-white rounded-full flex items-center justify-center flex-col">
                <span className="text-3xl font-bold text-gray-800">{stats.totalOcorrencias}</span>
                <span className="text-xs text-gray-400">Total</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {statusData.map(([status, count]) => (
              <LegendItem 
                key={status}
                color={statusBgColors[status] || "bg-gray-400"} 
                label={status} 
                value={`${Math.round((count / stats.totalOcorrencias) * 100)}% (${count})`} 
              />
            ))}
          </div>
        </div>
      </div>

      {/* 4. Secondary Stats Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Locais Críticos */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="font-bold text-gray-800 mb-6 flex items-center gap-2">
            <MapPin size={18} className="text-red-500" /> Regiões com Mais Casos
          </h3>
          <div className="space-y-5">
            {Object.entries(stats.porBairro || {}).slice(0, 5).map(([bairro, count]) => (
              <ProgressBar
                key={bairro}
                label={bairro}
                percent={`${(count / stats.totalOcorrencias) * 100}%`}
                count={count}
                color="bg-red-500"
              />
            ))}
          </div>
        </div>

        {/* Horários de Pico */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="font-bold text-gray-800 mb-6 flex items-center gap-2">
            <Calendar size={18} className="text-indigo-500" /> Horários de Pico
          </h3>
          <div className="h-64 flex items-end gap-1 px-1">
            {peakHoursData.map((count, i) => {
              const height = (count / maxPeakCount) * 100;
              return (
                <div
                  key={i}
                  className="flex-1 bg-indigo-100 rounded-t-md relative group hover:bg-indigo-200 transition-all"
                  style={{ height: `${height}%` }}
                >
                  <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded pointer-events-none whitespace-nowrap z-10">
                    {i}h: {count}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex justify-between text-xs text-gray-400 mt-2 px-1">
            <span>00h</span>
            <span>06h</span>
            <span>12h</span>
            <span>18h</span>
            <span>23h</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Componentes Auxiliares para os Gráficos ---

function LegendItem({ color, label, value }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <div className="flex items-center gap-2">
        <div className={`w-3 h-3 rounded-full ${color}`}></div>
        <span className="text-gray-600">{label}</span>
      </div>
      <span className="font-bold text-gray-800">{value}</span>
    </div>
  );
}

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
