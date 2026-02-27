import { useState } from "react";
import StatsCard from "../components/StatsCard";
import {
  ShieldAlert,
  FileWarning,
  Siren,
  Activity,
  MapPin,
  Calendar,
  TrendingUp,
  Filter,
  Download,
  PieChart,
} from "lucide-react";

export default function Graficos() {
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
            />
            <span className="text-gray-400">-</span>
            <input
              type="date"
              className="text-sm outline-none text-gray-600 bg-transparent"
            />
          </div>
          <button className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 font-medium shadow-sm transition">
            <Filter size={18} /> Filtros
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
          value="1,248"
          icon={<FileWarning className="text-blue-600" />}
          color="bg-blue-600"
        />
        <StatsCard
          title="Taxa de Resolução"
          value="86%"
          icon={<ShieldAlert className="text-green-600" />}
          color="bg-green-600"
        />
        <StatsCard
          title="Tempo Médio Resp."
          value="12 min"
          icon={<Siren className="text-orange-600" />}
          color="bg-orange-600"
        />
        <StatsCard
          title="Prejuízo Evitado"
          value="R$ 45k"
          icon={<Activity className="text-purple-600" />}
          color="bg-purple-600"
        />
      </div>

      {/* 3. Main Charts Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart 1: Weekly/Monthly Trend (Wide) */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-gray-800 flex items-center gap-2">
              <TrendingUp size={18} className="text-blue-500" /> Tendência de
              Ocorrências
            </h3>
            <select className="text-sm border-none bg-gray-50 rounded-lg px-2 py-1 outline-none text-gray-600">
              <option>Últimos 7 dias</option>
              <option>Últimos 30 dias</option>
              <option>Este Ano</option>
            </select>
          </div>

          {/* Simulated Bar Chart */}
          <div className="flex-1 flex items-end justify-between gap-4 px-2 h-64">
            <BarDay day="01/02" height="h-32" color="bg-blue-200" />
            <BarDay day="02/02" height="h-40" color="bg-blue-300" />
            <BarDay day="03/02" height="h-24" color="bg-blue-200" />
            <BarDay day="04/02" height="h-52" color="bg-blue-500" />
            <BarDay day="05/02" height="h-44" color="bg-blue-400" />
            <BarDay day="06/02" height="h-60" color="bg-blue-600" />
            <BarDay day="07/02" height="h-36" color="bg-blue-300" />
            <BarDay day="08/02" height="h-20" color="bg-blue-200" />
            <BarDay day="09/02" height="h-48" color="bg-blue-500" />
            <BarDay day="10/02" height="h-56" color="bg-blue-600" />
          </div>
        </div>

        {/* Chart 2: Distribution by Type */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="font-bold text-gray-800 mb-6 flex items-center gap-2">
            <PieChart size={18} className="text-purple-500" /> Distribuição por
            Tipo
          </h3>

          {/* CSS Pie Chart Simulation (Conic Gradient) */}
          <div className="flex justify-center mb-6">
            <div
              className="w-48 h-48 rounded-full bg-gray-100 relative"
              style={{
                background:
                  "conic-gradient(#3b82f6 0% 65%, #ef4444 65% 80%, #f97316 80% 100%)",
              }}
            >
              <div className="absolute inset-4 bg-white rounded-full flex items-center justify-center flex-col">
                <span className="text-3xl font-bold text-gray-800">1.2k</span>
                <span className="text-xs text-gray-400">Total</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <LegendItem
              color="bg-blue-500"
              label="Furto de Cabos"
              value="65%"
            />
            <LegendItem color="bg-red-500" label="Vandalismo" value="15%" />
            <LegendItem color="bg-orange-500" label="Invasão" value="20%" />
          </div>
        </div>
      </div>

      {/* 4. Secondary Stats Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Locais Críticos */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="font-bold text-gray-800 mb-6 flex items-center gap-2">
            <MapPin size={18} className="text-red-500" /> Top 5 Locais Críticos
          </h3>
          <div className="space-y-5">
            <ProgressBar
              label="Rua das Flores, Centro"
              percent="85%"
              count="142"
              color="bg-red-500"
            />
            <ProgressBar
              label="Av. Paulista, Bela Vista"
              percent="60%"
              count="98"
              color="bg-orange-500"
            />
            <ProgressBar
              label="Rua Augusta, Consolação"
              percent="45%"
              count="76"
              color="bg-yellow-500"
            />
            <ProgressBar
              label="Parque Ibirapuera"
              percent="30%"
              count="45"
              color="bg-blue-500"
            />
            <ProgressBar
              label="Terminal Barra Funda"
              percent="20%"
              count="32"
              color="bg-green-500"
            />
          </div>
        </div>

        {/* Horários de Pico */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="font-bold text-gray-800 mb-6 flex items-center gap-2">
            <Calendar size={18} className="text-indigo-500" /> Horários de Pico
          </h3>
          <div className="h-64 flex items-end gap-2">
            {/* Simulated Histogram */}
            {[10, 20, 45, 80, 100, 60, 40, 30, 20, 15, 10, 5].map((h, i) => (
              <div
                key={i}
                className="flex-1 bg-indigo-100 rounded-t-md relative group hover:bg-indigo-200 transition-all"
                style={{ height: `${h}%` }}
              >
                <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded pointer-events-none">
                  {h * 2}
                </div>
              </div>
            ))}
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
