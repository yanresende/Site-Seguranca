import { useNavigate } from "react-router-dom";
import {
  Search,
  Plus,
  MoreHorizontal,
  MapPinned,
  FileWarning,
  Settings,
  Trash2,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";

export default function Vandalismo() {
  const navigate = useNavigate();
  const [ocorrencias, setOcorrencias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8080/api/ocorrencias")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Falha ao buscar ocorrências");
        }
        return res.json();
      })
      .then((data) => {
        setOcorrencias(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);
  return (
    <div className="space-y-6">
      {/* CABEÇALHO DA PÁGINA */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Banco de Vandalismo
          </h1>
          <p className="text-gray-500 text-sm">
            Gerencie os registros de incidentes e pessoas envolvidas.
          </p>
        </div>
        <button
          onClick={() => navigate("/vandalismo/novo")}
          className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl font-semibold hover:bg-blue-700 transition-all shadow-md shadow-blue-100"
        >
          <Plus size={20} />
          Novo Registro
        </button>
      </div>

      {/* BARRA DE FILTROS */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Buscar por rua, bairro ou cidade..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
        </div>
        <select className="px-4 py-2 rounded-lg border border-gray-200 outline-none text-gray-600 bg-white">
          <option>Local</option>
          <option>Status</option>
          <option>Fonte</option>
        </select>
      </div>

      {/* TABELA DE VANDALISMO */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-400 text-xs uppercase font-semibold">
              <tr>
                <th className="px-6 py-4">Local</th>
                <th className="px-6 py-4">Data Acionamento</th>
                <th className="px-6 py-4">Observações</th>
                <th className="px-6 py-4">Fonte</th>
                <th className="px-6 py-4">Drive</th>
                <th className="px-6 py-4 text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading && (
                <tr>
                  <td colSpan="6" className="text-center py-8 text-gray-500">
                    Carregando...
                  </td>
                </tr>
              )}
              {error && (
                <tr>
                  <td colSpan="6" className="text-center py-8 text-red-500">
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
      </div>
    </div>
  );
}

function VandalismoRow({ ocorrencia }) {
  const navigate = useNavigate();
  const [menuAberto, setMenuAberto] = useState(false);
  const menuRef = useRef(null);

  const statusColors = {
    "Concluido": "text-green-600 bg-green-50 hover:bg-green-100",
    "Em andamento": "text-orange-600 bg-orange-50 hover:bg-orange-100",
    "Pendente": "text-red-600 bg-red-50 hover:bg-red-100",
  };

  // Fecha o menu se o usuário clicar fora dele
  useEffect(() => {
    function handleClickFora(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuAberto(false);
      }
    }
    document.addEventListener("mousedown", handleClickFora);
    return () => document.removeEventListener("mousedown", handleClickFora);
  }, []);

  // Format date and time
  const dataFormatada = `${ocorrencia.dataAcionamento.split("-").reverse().join("/")} - ${ocorrencia.horaAcionamento}`;
  const status = "Pendente"; // Placeholder, as it's not in the model

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
            <div className="font-bold text-gray-700">{`${ocorrencia.rua}, ${ocorrencia.numero}`}</div>
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
      <td className="px-6 py-4 text-sm text-gray-500">{ocorrencia.fotografico}</td>
      

      {/* BOTÃO DE AÇÃO COM MENU DROP DOWN */}
      <td className="px-6 py-4 text-center relative" ref={menuRef}>
        <button
          onClick={() => setMenuAberto(!menuAberto)}
          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition"
        >
          <MoreHorizontal size={20} />
        </button>

        {menuAberto && (
          <div className="absolute right-6 top-12 w-48 bg-white rounded-xl shadow-xl border border-gray-100 z-50 py-2 animate-in fade-in zoom-in duration-200">
            <button
              onClick={() => navigate(`/vandalismo/dados/${ocorrencia.id}`)}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 flex items-center gap-2"
            >
              <FileWarning size={16} /> Ver Dados
            </button>
            <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 flex items-center gap-2">
              <Settings size={16} /> Editar Dados
            </button>
            <div className="border-t border-gray-50 my-1"></div>
            <button className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2">
              <Trash2 size={16} /> Excluir Registro
            </button>
          </div>
        )}
      </td>
    </tr>
  );
}
