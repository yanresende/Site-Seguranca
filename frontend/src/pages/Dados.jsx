import { useState, useEffect } from "react";
import {
  MapPin,
  Clock,
  Video,
  FileText,
  ArrowLeft,
  Edit,
  Trash2,
  ExternalLink,
  Info,
  Plus,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

export default function Dados() {
  const navigate = useNavigate();
  const { id } = useParams(); // Pega o ID da URL (se configurado na rota)
  const [activeTab, setActiveTab] = useState("detalhes");
  const [dados, setDados] = useState(null);
  const [loading, setLoading] = useState(true);

  // Estado para gerenciar as visitas técnicas
  const [visitas, setVisitas] = useState([
    { id: 1, data: "2024-12-26", hora: "09:00", registro: "Visita técnica inicial. Constatado corte de cabos." }
  ]);
  const [novaVisita, setNovaVisita] = useState({ data: "", hora: "", registro: "" });

  // Busca os dados do backend ao carregar a página
  useEffect(() => {
    // Se você ainda não tem rotas com ID, pode testar fixo com ".../ocorrencias/1"
    const idBusca = id || 1; 
    
    fetch(`http://localhost:8080/api/ocorrencias/${idBusca}`)
      .then((res) => {
        if (!res.ok) throw new Error("Erro na resposta da API");
        return res.json();
      })
      .then((data) => {
        setDados(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Erro ao buscar dados:", error);
        setLoading(false);
      });
  }, [id]);

  const adicionarVisita = (e) => {
    e.preventDefault();
    if (!novaVisita.data || !novaVisita.hora || !novaVisita.registro) return;
    setVisitas([...visitas, { ...novaVisita, id: Date.now() }]);
    setNovaVisita({ data: "", hora: "", registro: "" });
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen text-gray-500">Carregando dados...</div>;
  }

  if (!dados) {
    return <div className="flex justify-center items-center h-screen text-red-500">Registro não encontrado.</div>;
  }

  return (
    <div className="space-y-6">
      {/* CABEÇALHO */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/vandalismo")}
            className="p-2 hover:bg-gray-100 rounded-full transition"
          >
            <ArrowLeft size={20} className="text-gray-500" />
          </button>
          <div className="w-16 h-16 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center text-2xl font-bold">
            <MapPin size={32} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              {dados.rua}, {dados.numero}
            </h1>
            <p className="text-sm text-gray-500">
              {dados.bairro}, {dados.cidade} - {dados.uf}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50 transition">
            <Edit size={18} /> Editar
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-xl text-sm font-bold hover:bg-red-100 transition">
            <Trash2 size={18} /> Excluir
          </button>
        </div>
      </div>

      {/* NAVEGAÇÃO POR ABAS */}
      <div className="flex gap-4 border-b border-gray-200">
        <TabButton
          id="detalhes"
          label="Detalhes da Ocorrência"
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          icon={<Info size={18} />}
        />
        <TabButton
          id="endereco"
          label="Endereço Completo"
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          icon={<MapPin size={18} />}
        />
        <TabButton
          id="visita"
          label="Visitas"
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          icon={<Clock size={18} />}
        />
      </div>

      {/* CONTEÚDO DAS ABAS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* COLUNA DA ESQUERDA */}
        <div className="lg:col-span-2 space-y-6">
          {activeTab === "detalhes" && (
            <>
              {/* CRONOLOGIA */}
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Clock size={18} className="text-blue-600" /> Cronologia
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <InfoCard
                    label="Acionamento"
                    date={dados.dataAcionamento || dados.data_acionamento}
                    time={dados.horaAcionamento || dados.hora_acionamento}
                  />
                  <InfoCard
                    label="Vandalismo"
                    date={dados.dataVandalismo || dados.data_vandalismo}
                    time={dados.horaQueda || dados.hora_queda}
                  />
                  <InfoCard
                    label="Visita Técnica"
                    date={dados.dataVisita || dados.data_visita}
                    time={dados.horaVisita || dados.hora_visita}
                  />
                </div>
              </div>

              {/* INFORMAÇÕES */}
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                <h3 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                  <FileText size={18} className="text-orange-600" /> Informações
                  do Registro
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <span className="text-xs font-medium text-gray-400 uppercase">
                      Causa Real
                    </span>
                    <p className="text-gray-700 font-medium mt-1">
                      {dados.causaReal || dados.causa_real}
                    </p>
                  </div>
                  <div>
                    <span className="text-xs font-medium text-gray-400 uppercase">
                      Fonte
                    </span>
                    <p className="text-gray-700 font-medium mt-1">
                      {dados.fonte}
                    </p>
                  </div>
                  <div className="md:col-span-2">
                    <span className="text-xs font-medium text-gray-400 uppercase">
                      Observações
                    </span>
                    <p className="text-gray-700 mt-1 bg-gray-50 p-3 rounded-lg text-sm">
                      {dados.observacoes}
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === "endereco" && (
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                <MapPin size={18} className="text-green-600" /> Localização
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <DetailItem label="CEP" value={dados.cep} />
                <DetailItem label="Rua" value={dados.rua} />
                <DetailItem label="Número" value={dados.numero} />
                <DetailItem label="Bairro" value={dados.bairro} />
                <DetailItem label="Cidade" value={dados.cidade} />
                <DetailItem label="Estado" value={dados.uf} />
              </div>
            </div>
          )}
          {activeTab === "visita" && (
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6">
              <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Clock size={18} className="text-green-600" /> Histórico de
                Visitas Técnicas
              </h3>

              {/* Formulário de Adição */}
              <form
                onSubmit={adicionarVisita}
                className="bg-gray-50 p-5 rounded-xl border border-gray-200 space-y-4"
              >
                <div className="flex items-center gap-2 text-sm font-bold text-gray-700">
                  <Plus size={16} className="text-green-600" /> Nova Visita
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-500">
                      Data
                    </label>
                    <input
                      type="date"
                      required
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-green-500 bg-white"
                      value={novaVisita.data}
                      onChange={(e) =>
                        setNovaVisita({ ...novaVisita, data: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-500">
                      Hora
                    </label>
                    <input
                      type="time"
                      required
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-green-500 bg-white"
                      value={novaVisita.hora}
                      onChange={(e) =>
                        setNovaVisita({ ...novaVisita, hora: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-500">
                    Registro da Atividade
                  </label>
                  <textarea
                    required
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-green-500 bg-white resize-none"
                    rows="2"
                    placeholder="Descreva o que foi realizado..."
                    value={novaVisita.registro}
                    onChange={(e) =>
                      setNovaVisita({ ...novaVisita, registro: e.target.value })
                    }
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-green-700 transition shadow-sm flex items-center gap-2"
                  >
                    <Plus size={16} /> Adicionar
                  </button>
                </div>
              </form>

              {/* Lista de Visitas */}
              <div className="space-y-3">
                {visitas.length === 0 ? (
                  <div className="text-center py-8 text-gray-400 text-sm">
                    Nenhuma visita registrada.
                  </div>
                ) : (
                  visitas.map((v) => (
                    <div
                      key={v.id}
                      className="flex gap-4 p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition group bg-white"
                    >
                      <div className="flex flex-col items-center min-w-[80px]">
                        <div className="bg-green-50 text-green-700 text-xs font-bold px-2 py-1 rounded-md mb-1">
                          {v.data.split("-").reverse().join("/")}
                        </div>
                        <span className="text-xs text-gray-400 flex items-center gap-1">
                          <Clock size={10} /> {v.hora}
                        </span>
                      </div>
                      <div className="flex-1 border-l-2 border-gray-100 pl-4">
                        <p className="text-sm text-gray-600 leading-relaxed">
                          {v.registro}
                        </p>
                      </div>
                      <button
                        onClick={() =>
                          setVisitas(visitas.filter((item) => item.id !== v.id))
                        }
                        className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition self-start"
                        title="Remover visita"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* COLUNA DA DIREITA: RESUMO FIXO */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Video size={18} className="text-purple-600" /> Mídia e Evidências
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                <span className="text-sm text-gray-600">
                  Filmagem Disponível?
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold ${dados.filmagem === "Sim" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                >
                  {dados.filmagem}
                </span>
              </div>
              <div>
                <span className="text-xs font-medium text-gray-400 uppercase mb-2 block">
                  Link das Fotos
                </span>
                <a
                  href="#"
                  className="flex items-center gap-2 text-blue-600 text-sm font-medium hover:underline truncate"
                >
                  <ExternalLink size={14} /> {dados.fotografico}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Componentes Auxiliares
function TabButton({ id, label, activeTab, setActiveTab, icon }) {
  const active = activeTab === id;
  return (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-all font-medium text-sm ${
        active
          ? "border-blue-600 text-blue-600"
          : "border-transparent text-gray-500 hover:text-gray-700"
      }`}
    >
      {icon} {label}
    </button>
  );
}

function InfoCard({ label, date, time }) {
  return (
    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
      <span className="text-xs font-bold text-gray-400 uppercase block mb-1">{label}</span>
      <div className="font-bold text-gray-800">{date || "--/--/----"}</div>
      <div className="text-sm text-gray-500">{time || "--:--"}</div>
    </div>
  );
}

function DetailItem({ label, value }) {
  return (
    <div>
      <span className="text-xs font-medium text-gray-400 uppercase">{label}</span>
      <p className="text-gray-700 font-medium mt-1">{value || "N/A"}</p>
    </div>
  );
}
