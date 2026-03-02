import StatsCard from "../components/StatsCard";
import { ShieldAlert, FileWarning, Siren, Activity, MapPin, Calendar, TrendingUp, AlertTriangle } from "lucide-react";
import styles from "./Dashboard.module.css";

export default function Dashboard() {
  return (
    <div className={styles.container}>
      {/* 1. Título e Boas-vindas */}
      <div className={styles.header}>
        <h1 className={styles.title}>Painel de Segurança</h1>
        <p className={styles.subtitle}>Bem Vindo de Volta Ana</p>
      </div>

      {/* 2. Grid de Cards */}
      <div className={styles.kpiGrid}>
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
      <div className={styles.chartsGrid}>
        
        {/* LOCAIS CRÍTICOS (Ranking) */}
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>
            <MapPin size={18} className="text-red-500" /> Locais Críticos
          </h3>
          <div className={styles.listSpace}>
            <ProgressBar label="Rua das Flores" percent="75%" count="32" color="bg-red-500" />
            <ProgressBar label="Parque Central" percent="45%" count="18" color="bg-orange-500" />
            <ProgressBar label="Antena rua peixoto" percent="30%" count="12" color="bg-yellow-500" />
            <ProgressBar label="Avenida Principal" percent="15%" count="6" color="bg-blue-500" />
          </div>
        </div>

        {/* FREQUÊNCIA SEMANAL (Gráfico de Barras) */}
        <div className={`${styles.card} flex flex-col`}>
          <h3 className={styles.cardTitle}>
            <Calendar size={18} className="text-blue-500" /> Incidência Semanal
          </h3>
          <div className={styles.chartContainer}>
            <BarDay day="Seg" height="h-12" color="bg-blue-200" />
            <BarDay day="Ter" height="h-16" color="bg-blue-200" />
            <BarDay day="Qua" height="h-14" color="bg-blue-200" />
            <BarDay day="Qui" height="h-24" color="bg-blue-300" />
            <BarDay day="Sex" height="h-40" color="bg-blue-500" />
            <BarDay day="Sáb" height="h-32" color="bg-blue-600" />
            <BarDay day="Dom" height="h-20" color="bg-blue-400" />
          </div>
          <p className={styles.chartLabel}>Volume de ocorrências por dia</p>
        </div>

        {/* TIPOS DE INFRAÇÃO (Lista com Ícones) */}
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>
            <TrendingUp size={18} className="text-purple-500" /> Tipos de Infrações
          </h3>
          <div className={styles.listSpace}>
            <div className={styles.statItem}>
              <div className={styles.statIconGroup}>
                <div className={`${styles.statIconBox} bg-purple-100 text-purple-600`}><FileWarning size={16}/></div>
                <span className={styles.statLabel}>Furto De Cabo</span>
              </div>
              <span className={styles.statValue}>65%</span>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statIconGroup}>
                <div className={`${styles.statIconBox} bg-red-100 text-red-600`}><AlertTriangle size={16}/></div>
                <span className={styles.statLabel}>Suspeito</span>
              </div>
              <span className={styles.statValue}>15%</span>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statIconGroup}>
                <div className={`${styles.statIconBox} bg-orange-100 text-orange-600`}><Activity size={16}/></div>
                <span className={styles.statLabel}>Vandalismo</span>
              </div>
              <span className={styles.statValue}>10%</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Tabela de Próximas Consultas (Agora dentro do return!) */}
      <div className={styles.tableContainer}>
        <div className={styles.tableHeader}>
          <h3 className={styles.tableTitle}>Últimas Ocorrências</h3>
          <button className={styles.viewAllLink}>
            Ver histórico completo
          </button>
        </div>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead className={styles.thead}>
              <tr>
                <th className="px-6 py-4">Descrição da Ocorrência</th>
                <th className="px-6 py-4">Horário</th>
                <th className="px-6 py-4">Infração</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className={styles.tbody}>
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
      <div className={styles.progressHeader}>
        <span className={styles.progressLabel}>{label}</span>
        <span className={styles.progressCount}>{count} casos</span>
      </div>
      <div className={styles.progressTrack}>
        <div className={`${styles.progressFill} ${color}`} style={{ width: percent }}></div>
      </div>
    </div>
  );
}

function BarDay({ day, height, color }) {
  return (
    <div className={`${styles.barDayContainer} group`}>
      <div className={styles.barDayWrapper}>
        <div className={`${styles.barDayBar} ${height} ${color}`}></div>
      </div>
      <span className={styles.barDayLabel}>{day}</span>
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
    <tr className={styles.tableRow}>
      <td className={styles.tdName}>{name}</td>
      <td className={styles.td}>{time}</td>
      <td className={styles.td}>{type}</td>
      <td className={styles.tdStatus}>
        <span
          className={`${styles.statusBadge} ${statusColors[status]}`}
        >
          {status}
        </span>
      </td>
    </tr>
  );
}
