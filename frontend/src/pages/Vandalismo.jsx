import { useNavigate } from "react-router-dom";
import {
  Search,
  Plus,
  MoreHorizontal,
  MapPinned,
  FileWarning,
  Settings,
  Trash2,
  ExternalLink,
  FileText,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import api from "../services/api"; // Importe o seu serviço
import styles from "./Vandalismo.module.css";

export default function Vandalismo() {
  const navigate = useNavigate();
  const [ocorrencias, setOcorrencias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("Todos");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams({
      page: page,
      size: 10, // 10 itens por página
      sort: 'dataVandalismo,desc', // Ordena por data, mais recentes primeiro
      searchTerm: searchTerm,
      status: statusFilter,
    });

    // Usa o 'api' em vez de 'fetch'. O axios já trata o JSON automaticamente.
    api.get(`/api/ocorrencias?${params.toString()}`)
      .then((response) => {
        setOcorrencias(response.data.content);
        setTotalPages(response.data.totalPages);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [page, searchTerm, statusFilter]); // Refaz a busca quando a página ou os filtros mudam

  // Reseta para a primeira página sempre que um filtro é alterado
  useEffect(() => {
    setPage(0);
  }, [searchTerm, statusFilter]);

  const handlePreviousPage = () => {
    setPage((prevPage) => Math.max(prevPage - 1, 0));
  };

  const handleNextPage = () => {
    setPage((prevPage) => Math.min(prevPage + 1, totalPages - 1));
  };

  return (
    <div className={styles.container}>
      {/* CABEÇALHO DA PÁGINA */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>
            Banco de Vandalismo
          </h1>
          <p className={styles.subtitle}>
            Gerencie os registros de incidentes e pessoas envolvidas.
          </p>
        </div>
        <button
          onClick={() => navigate("/vandalismo/novo")}
          className={styles.newButton}
        >
          <Plus size={20} />
          Novo Registro
        </button>
      </div>

      {/* BARRA DE FILTROS */}
      <div className={styles.filterBar}>
        <div className={styles.searchContainer}>
          <Search
            className={styles.searchIcon}
            size={18}
          />
          <input
            type="text"
            placeholder="Buscar por rua, bairro ou cidade..."
            className={styles.searchInput}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          className={styles.statusSelect}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="Todos">Todos os Status</option>
          <option value="Pendente">Pendente</option>
          <option value="Em andamento">Em andamento</option>
          <option value="Concluido">Concluído</option>
        </select>
      </div>

      {/* TABELA DE VANDALISMO */}
      <div className={styles.tableContainer}>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className={styles.tableHeader}>
              <tr>
                <th className="px-6 py-4">Local</th>
                <th className="px-6 py-4">Data Vandalismo</th>
                <th className="px-6 py-4">Observações</th>
                <th className="px-6 py-4">Fonte</th>
                <th className="px-6 py-4">Ver Dados</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading && (
                <tr>
                  <td colSpan="5" className={styles.loadingText}>
                    Carregando...
                  </td>
                </tr>
              )}
              {error && (
                <tr>
                  <td colSpan="5" className={styles.errorText}>
                    {error}
                  </td>
                </tr>
              )}
              {!loading &&
                !error &&
                ocorrencias.map((ocorrencia) => (
                  <VandalismoRow key={ocorrencia.id} ocorrencia={ocorrencia} />
                ))}
            </tbody>
          </table>
        </div>
        {/* CONTROLES DE PAGINAÇÃO */}
        {!loading && totalPages > 1 && (
          <div className={styles.paginationContainer}>
            <button
              onClick={handlePreviousPage}
              disabled={page === 0}
              className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Anterior
            </button>
            <span className="text-sm text-gray-500">
              Página {page + 1} de {totalPages}
            </span>
            <button
              onClick={handleNextPage}
              disabled={page >= totalPages - 1}
              className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Próximo
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function VandalismoRow({ ocorrencia }) {
  const navigate = useNavigate();

  const statusColors = {
    "Concluido": "text-green-600 bg-green-50 hover:bg-green-100",
    "Concluida": "text-green-600 bg-green-50 hover:bg-green-100",
    "Em andamento": "text-orange-600 bg-orange-50 hover:bg-orange-100",
    "Pendente": "text-red-600 bg-red-50 hover:bg-red-100",
  };

  // Format date and time
  const dataFormatada = ocorrencia.dataVandalismo
    ? `${ocorrencia.dataVandalismo.split("-").reverse().join("/")} - ${ocorrencia.horaQueda || ''}`
    : "N/A";
  const status = ocorrencia.status || "Pendente";

  return (
    <tr className="hover:bg-gray-50 transition group">
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-red-50 text-red-600 flex items-center justify-center font-bold">
            <MapPinned
              size={20}
              alt="Ícone de vandalismo"
              aria-label="Mapa"
            />
          </div>
          <div>
            <div className="font-bold text-gray-700">{`${ocorrencia.rua}, ${ocorrencia.numero} - ${ocorrencia.bairro}`}</div>
            <div className={`text-xs font-medium px-2 py-1 rounded transition ${statusColors[status] || "text-gray-600 bg-gray-50"}`}>
              {status}
            </div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 text-sm text-gray-500">{dataFormatada}</td>
      <td className="px-6 py-4 text-sm text-gray-500 truncate max-w-xs">
        {ocorrencia.observacoes}
      </td>
      <td className="px-6 py-4 text-sm text-gray-500">{ocorrencia.fonte}</td>
      <td className="px-6 py-4 text-sm text-gray-500">
        <button
          onClick={() => navigate(`/vandalismo/dados/${ocorrencia.id}`)}
          className="text-blue-600 hover:underline flex items-center gap-1"
        >
          <FileText size={14} /> Ver Dados
        </button>
      </td>
    </tr>
  );
}
