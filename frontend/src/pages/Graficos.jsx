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
  Route,
} from "lucide-react";
import styles from "./Graficos.module.css";

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

  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8080";

  const fetchStats = () => {
    setLoading(true);
    const params = new URLSearchParams(dates);
    fetch(`${apiUrl}/api/ocorrencias/stats?${params.toString()}`)
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
    return <div className={styles.loading}>Carregando estatísticas...</div>;
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
    <div className={styles.container}>
      {/* 1. Header & Filters */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>
            Relatórios e Estatísticas
          </h1>
          <p className={styles.subtitle}>
            Análise detalhada de segurança e incidentes.
          </p>
        </div>

        <div className={styles.controls}>
          <div className={styles.datePicker}>
            <span className={styles.dateLabel}>
              Período:
            </span>
            <input
              type="date"
              className={styles.dateInput}
              value={dates.inicio}
              onChange={(e) => setDates({...dates, inicio: e.target.value})}
            />
            <span className={styles.separator}>-</span>
            <input
              type="date"
              className={styles.dateInput}
              value={dates.fim}
              onChange={(e) => setDates({...dates, fim: e.target.value})}
            />
          </div>
          <button onClick={fetchStats} className={styles.btnApply}>
            <Filter size={18} /> Aplicar
          </button>
          <button className={styles.btnExport}>
            <Download size={18} /> Exportar PDF
          </button>
        </div>
      </div>

      {/* 2. KPI Cards */}
      <div className={styles.kpiGrid}>
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
      <div className={styles.mainGrid}>
        {/* Nova Estatística: Ocorrências por Fonte */}
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>
            <Radio size={18} className="text-cyan-500" /> Ocorrências por Fonte
          </h3>
          <div className={styles.listSpace}>
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

        {/* Nova Estatística: Ocorrências por Rota */}
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>
            <Route size={18} className="text-teal-500" /> Ocorrências por Rota
          </h3>
          <div className={styles.listSpace}>
            {Object.entries(stats.porRota || {}).map(([rota, count]) => (
              <ProgressBar
                key={rota}
                label={rota}
                percent={`${(count / stats.totalOcorrencias) * 100}%`}
                count={count}
                color="bg-teal-500"
              />
            ))}
          </div>
        </div>

        {/* Chart 2: Distribution by Type */}
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>
            <PieChart size={18} className="text-purple-500" /> Distribuição por
            Tipo
          </h3>

          {/* Gráfico de Pizza Simples (Visualização em Lista com Barras) */}
          <div className={styles.pieContainer}>
            <div
              className={styles.pieCircle}
              style={{ background: conicGradient }}
            >
              <div className={styles.pieInner}>
                <span className={styles.pieNumber}>{stats.totalOcorrencias}</span>
                <span className={styles.pieLabel}>Total</span>
              </div>
            </div>
          </div>

          <div className={styles.legendSpace}>
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
      <div className={styles.secondaryGrid}>
        {/* Locais Críticos */}
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>
            <MapPin size={18} className="text-red-500" /> Regiões com Mais Casos
          </h3>
          <div className={styles.listSpace}>
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
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>
            <Calendar size={18} className="text-indigo-500" /> Horários de Pico
          </h3>
          <div className={styles.chartContainer}>
            {peakHoursData.map((count, i) => {
              const height = (count / maxPeakCount) * 100;
              return (
                <div
                  key={i}
                  className={`${styles.bar} group`}
                  style={{ height: `${height}%` }}
                >
                  <div className={styles.tooltip}>
                    {i}h: {count}
                  </div>
                </div>
              );
            })}
          </div>
          <div className={styles.axisX}>
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
    <div className="flex items-center justify-between text-sm"> {/* Mantido inline por simplicidade ou pode ir para CSS */}
      <div className="flex items-center gap-2">
        <div className={`w-3 h-3 rounded-full ${color}`}></div> {/* Cor dinâmica */}
        <span className="text-gray-600">{label}</span>
      </div>
      <span className="font-bold text-gray-800">{value}</span>
    </div>
  );
}

function ProgressBar({ label, percent, count, color }) {
  return (
    <div>
      <div className="flex justify-between text-sm mb-1"> {/* Mantido inline por simplicidade ou pode ir para CSS */}
        <span className="font-medium text-gray-700">{label}</span>
        <span className="text-gray-500">{count} casos</span>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-2.5">
        <div className={`h-2.5 rounded-full ${color}`} style={{ width: percent }}></div> {/* Cor dinâmica */}
      </div>
    </div>
  );
}
