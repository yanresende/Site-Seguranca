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
import { Save } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

export default function Dados() {
  const navigate = useNavigate();
  const { id } = useParams(); // Pega o ID da URL (se configurado na rota)
  const [activeTab, setActiveTab] = useState("detalhes");
  const [dados, setDados] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const statusColors = {
    Concluido: "bg-green-100 text-green-700",
    "Em andamento": "bg-orange-100 text-orange-700",
    Pendente: "bg-red-100 text-red-700",
  };

  // Estado para gerenciar as visitas técnicas
  const [visitas, setVisitas] = useState([
    {
      id: 1,
      data: "2024-12-26",
      hora: "09:00",
      registro: "Visita técnica inicial. Constatado corte de cabos.",
    },
  ]);
  const [novaVisita, setNovaVisita] = useState({
    data: "",
    hora: "",
    registro: "",
  });

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
        setFormData(data); // Inicializa o formulário de edição
        // Atualiza a lista de visitas se houver dados vindos do backend
        if (data.visitas && Array.isArray(data.visitas)) {
          const visitasBackend = data.visitas.map((v) => ({
            id: v.id,
            data: v.dataVisita, // Backend: dataVisita -> Frontend: data
            hora: v.horaVisita, // Backend: horaVisita -> Frontend: hora
            registro: v.registroVisita, // Backend: registroVisita -> Frontend: registro
          }));
          setVisitas(visitasBackend);
        }
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

    // Prepara o payload conforme o modelo Java (Visita.java)
    const payload = {
      dataVisita: novaVisita.data,
      horaVisita: novaVisita.hora + ":00", // Adiciona segundos para o LocalTime do Java
      registroVisita: novaVisita.registro,
    };

    const idBusca = id || 1; // Garante que temos um ID

    fetch(`http://localhost:8080/api/ocorrencias/${idBusca}/visitas`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Erro ao salvar visita");
        return res.json();
      })
      .then((savedVisita) => {
        // Mapeia a resposta do backend de volta para o formato do frontend
        const nova = {
          id: savedVisita.id,
          data: savedVisita.dataVisita,
          hora: savedVisita.horaVisita,
          registro: savedVisita.registroVisita,
        };
        setVisitas([...visitas, nova]);
        setNovaVisita({ data: "", hora: "", registro: "" });
      })
      .catch((err) => alert("Erro ao adicionar visita: " + err.message));
  };

  const handleDeleteVisita = (visitaId) => {
    if (!window.confirm("Tem certeza que deseja excluir esta visita?")) {
      return;
    }

    const ocorrenciaId = id || 1;

    fetch(
      `http://localhost:8080/api/ocorrencias/${ocorrenciaId}/visitas/${visitaId}`,
      {
        method: "DELETE",
      },
    )
      .then((res) => {
        if (res.ok) {
          // res.ok é true para status 204 (No Content)
          // Remove a visita do estado local para atualizar a UI
          setVisitas((prevVisitas) =>
            prevVisitas.filter((v) => v.id !== visitaId),
          );
        } else {
          throw new Error("Falha ao excluir a visita.");
        }
      })
      .catch((error) => {
        console.error("Erro ao excluir visita:", error);
        alert(error.message);
      });
  };

  const handleDeleteOcorrencia = () => {
    if (
      !window.confirm(
        "Tem certeza que deseja excluir esta ocorrência permanentemente? Todas as visitas associadas também serão apagadas.",
      )
    ) {
      return;
    }

    const idToDelete = id || 1;

    fetch(`http://localhost:8080/api/ocorrencias/${idToDelete}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (res.ok) {
          alert("Ocorrência excluída com sucesso!");
          navigate("/vandalismo"); // Redireciona para a lista após excluir
        } else {
          alert("Erro ao excluir a ocorrência.");
        }
      })
      .catch((err) => console.error("Erro:", err));
  };

  const handleSave = () => {
    // Validação: Datas e Horários da Cronologia são obrigatórios
    if (
      !formData.dataAcionamento ||
      !formData.horaAcionamento ||
      !formData.dataVandalismo ||
      !formData.horaQueda
    ) {
      alert("Por favor, preencha todas as datas e horários na seção de Cronologia.");
      return;
    }

    setIsSaving(true);
    // Garante que a hora seja enviada com segundos para o backend
    const payload = {
      ...formData,
      horaAcionamento: formData.horaAcionamento
        ? formData.horaAcionamento.substring(0, 5) + ":00"
        : null,
      horaQueda: formData.horaQueda
        ? formData.horaQueda.substring(0, 5) + ":00"
        : null,
    };

    fetch(`http://localhost:8080/api/ocorrencias/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Falha ao salvar alterações");
        return res.json();
      })
      .then((updatedData) => {
        setDados(updatedData);
        setFormData(updatedData);
        setIsEditing(false);
        alert("Dados salvos com sucesso!");
      })
      .catch((error) => {
        console.error("Erro ao salvar:", error);
        alert("Não foi possível salvar as alterações.");
      })
      .finally(() => setIsSaving(false));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-500">
        Carregando dados...
      </div>
    );
  }

  if (!dados) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        Registro não encontrado.
      </div>
    );
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
          {isEditing ? (
            <>
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50 transition"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-xl text-sm font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-100 disabled:bg-blue-300"
              >
                <Save size={18} /> {isSaving ? "Salvando..." : "Salvar"}
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50 transition"
            >
              <Edit size={18} /> Editar
            </button>
          )}
          <button
            onClick={handleDeleteOcorrencia}
            className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-xl text-sm font-bold hover:bg-red-100 transition"
            disabled={isEditing}
          >
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
                  {isEditing ? (
                    <>
                      <EditableInfoCard
                        label="Acionamento"
                        dateName="dataAcionamento"
                        timeName="horaAcionamento"
                        value={formData}
                        onChange={handleChange}
                      />
                      <EditableInfoCard
                        label="Vandalismo"
                        dateName="dataVandalismo"
                        timeName="horaQueda"
                        value={formData}
                        onChange={handleChange}
                      />
                      <InfoCard
                        label="Visita Técnica"
                        date={visitas[0]?.data}
                        time={visitas[0]?.hora}
                      />
                    </>
                  ) : (
                    <>
                      <InfoCard
                        label="Acionamento"
                        date={dados.dataAcionamento}
                        time={dados.horaAcionamento}
                      />
                      <InfoCard
                        label="Vandalismo"
                        date={dados.dataVandalismo}
                        time={dados.horaQueda}
                      />
                      <InfoCard
                        label="Última Visita Técnica"
                        date={visitas[0]?.data}
                        time={visitas[0]?.hora}
                      />
                    </>
                  )}
                </div>
              </div>

              {/* INFORMAÇÕES */}
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                <h3 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                  <FileText size={18} className="text-orange-600" /> Informações
                  do Registro
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {isEditing ? (
                    <>
                      <div>
                        <span className="text-xs font-medium text-gray-400 uppercase">
                          Status
                        </span>
                        <select
                          name="status"
                          value={formData.status || "Pendente"}
                          onChange={handleChange}
                          className="w-full mt-1 px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                        >
                          <option value="Pendente">Pendente</option>
                          <option value="Em andamento">Em andamento</option>
                          <option value="Concluido">Concluido</option>
                        </select>
                      </div>
                      <EditableItem
                        label="Causa Real"
                        name="causaReal"
                        value={formData.causaReal}
                        onChange={handleChange}
                      />
                      <div>
                        <span className="text-xs font-medium text-gray-400 uppercase">
                          Fonte
                        </span>
                        <select
                          name="fonte"
                          value={formData.fonte || ""}
                          onChange={handleChange}
                          className="w-full mt-1 px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                        >
                          <option value="">Selecione...</option>
                          <option value="Grupo Crise">Grupo Crise</option>
                          <option value="Relatório Analítico">
                            Relatório Analítico
                          </option>
                        </select>
                      </div>
                      <div className="md:col-span-2">
                        <EditableItem
                          label="Observações"
                          name="observacoes"
                          value={formData.observacoes}
                          onChange={handleChange}
                          type="textarea"
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <span className="text-xs font-medium text-gray-400 uppercase">
                          Status
                        </span>
                        <div className="mt-1">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-bold ${statusColors[dados.status] || "bg-gray-100 text-gray-700"}`}
                          >
                            {dados.status || "Pendente"}
                          </span>
                        </div>
                      </div>
                      <DetailItem label="Causa Real" value={dados.causaReal} />
                      <DetailItem label="Fonte" value={dados.fonte} />
                      <div className="md:col-span-2">
                        <span className="text-xs font-medium text-gray-400 uppercase">
                          Observações
                        </span>
                        <p className="text-gray-700 mt-1 bg-gray-50 p-3 rounded-lg text-sm">
                          {dados.observacoes}
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </>
          )}

          {activeTab === "endereco" && (
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm animate-in fade-in duration-300">
              <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                <MapPin size={18} className="text-green-600" /> Localização
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {isEditing ? (
                  <>
                    <EditableItem
                      label="CEP"
                      name="cep"
                      value={formData.cep}
                      onChange={handleChange}
                    />
                    <EditableItem
                      label="Rua"
                      name="rua"
                      value={formData.rua}
                      onChange={handleChange}
                    />
                    <EditableItem
                      label="Número"
                      name="numero"
                      value={formData.numero}
                      onChange={handleChange}
                    />
                    <EditableItem
                      label="Bairro"
                      name="bairro"
                      value={formData.bairro}
                      onChange={handleChange}
                    />
                    <EditableItem
                      label="Cidade"
                      name="cidade"
                      value={formData.cidade}
                      onChange={handleChange}
                    />
                    <EditableItem
                      label="Estado"
                      name="uf"
                      value={formData.uf}
                      onChange={handleChange}
                    />
                  </>
                ) : (
                  <>
                    <DetailItem label="CEP" value={dados.cep} />
                    <DetailItem label="Rua" value={dados.rua} />
                    <DetailItem label="Número" value={dados.numero} />
                    <DetailItem label="Bairro" value={dados.bairro} />
                    <DetailItem label="Cidade" value={dados.cidade} />
                    <DetailItem label="Estado" value={dados.uf} />
                  </>
                )}
              </div>
            </div>
          )}
          {activeTab === "visita" && (
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6 animate-in fade-in duration-300">
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
                        onClick={() => handleDeleteVisita(v.id)}
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
                <span className="text-sm text-gray-600">Filmagem?</span>
                {isEditing ? (
                  <select
                    name="filmagem"
                    value={formData.filmagem}
                    onChange={handleChange}
                    className="text-sm bg-white border border-gray-200 rounded-md px-2 py-1"
                  >
                    <option value="Sim">Sim</option>
                    <option value="Não">Não</option>
                  </select>
                ) : (
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${dados.filmagem === "Sim" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                  >
                    {dados.filmagem}
                  </span>
                )}
              </div>
              <div>
                <span className="text-xs font-medium text-gray-400 uppercase mb-2 block">
                  Link das Fotos
                </span>
                {isEditing ? (
                  <EditableItem
                    label=""
                    name="fotografico"
                    value={formData.fotografico}
                    onChange={handleChange}
                  />
                ) : (
                  <a
                    href={dados.fotografico || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-blue-600 text-sm font-medium hover:underline truncate"
                  >
                    <ExternalLink size={14} />{" "}
                    {dados.fotografico || "Nenhum link"}
                  </a>
                )}
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
      <span className="text-xs font-bold text-gray-400 uppercase block mb-1">
        {label}
      </span>
      <div className="font-bold text-gray-800">
        {date
          ? new Date(date + "T00:00:00").toLocaleDateString("pt-BR")
          : "--/--/----"}
      </div>
      <div className="text-sm text-gray-500">{time || "--:--"}</div>
    </div>
  );
}

function DetailItem({ label, value }) {
  return (
    <div>
      <span className="text-xs font-medium text-gray-400 uppercase">
        {label}
      </span>
      <p className="text-gray-700 font-medium mt-1">{value || "N/A"}</p>
    </div>
  );
}

function EditableItem({ label, name, value, onChange, type = "text" }) {
  return (
    <div>
      {label && (
        <span className="text-xs font-medium text-gray-400 uppercase">
          {label}
        </span>
      )}
      {type === "textarea" ? (
        <textarea
          name={name}
          value={value || ""}
          onChange={onChange}
          rows="3"
          className="w-full mt-1 px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        />
      ) : (
        <input
          type={type}
          name={name}
          value={value || ""}
          onChange={onChange}
          className="w-full mt-1 px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        />
      )}
    </div>
  );
}

function EditableInfoCard({ label, dateName, timeName, value, onChange }) {
  return (
    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-2">
      <span className="text-xs font-bold text-gray-400 uppercase block">
        {label} <span className="text-red-500">*</span>
      </span>
      <div>
        <input
          type="date"
          name={dateName}
          required
          value={value[dateName] || ""}
          onChange={onChange}
          className="w-full text-sm p-1 border border-gray-200 rounded"
        />
      </div>
      <div>
        <input
          type="time"
          name={timeName}
          required
          value={value[timeName] || ""}
          onChange={onChange}
          className="w-full text-sm p-1 border border-gray-200 rounded"
        />
      </div>
    </div>
  );
}
