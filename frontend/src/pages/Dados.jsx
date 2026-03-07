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
import styles from "./Dados.module.css";

export default function Dados() {
  const navigate = useNavigate();
  const { id } = useParams(); // Pega o ID da URL (se configurado na rota)
  const [activeTab, setActiveTab] = useState("detalhes");
  const [dados, setDados] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8080";

  const statusColors = {
    Concluido: styles.statusConcluido,
    "Em andamento": styles.statusEmAndamento,
    Pendente: styles.statusPendente,
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

    fetch(`${apiUrl}/api/ocorrencias/${idBusca}`)
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

    fetch(`${apiUrl}/api/ocorrencias/${idBusca}/visitas`, {
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
      `${apiUrl}/api/ocorrencias/${ocorrenciaId}/visitas/${visitaId}`,
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

    fetch(`${apiUrl}/api/ocorrencias/${idToDelete}`, {
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

    fetch(`${apiUrl}/api/ocorrencias/${id}`, {
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

  // Função para buscar o CEP automaticamente
  const checkCEP = (e) => {
    const cep = e.target.value.replace(/\D/g, "");
    if (cep.length === 8) {
      fetch(`https://brasilapi.com.br/api/cep/v1/${cep}`)
        .then((res) => {
          if (!res.ok) throw new Error("CEP não encontrado");
          return res.json();
        })
        .then((data) => {
          setFormData((prev) => ({
            ...prev,
            rua: data.street,
            bairro: data.neighborhood,
            cidade: data.city,
            uf: data.state,
          }));
        })
        .catch((err) => console.error("Erro ao buscar CEP:", err.message));
    }
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
    <div className={styles.container}>
      {/* CABEÇALHO */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <button
            onClick={() => navigate("/vandalismo")}
            className={styles.backButton}
          >
            <ArrowLeft size={20} className="text-gray-500" />
          </button>
          <div className={styles.iconContainer}>
            <MapPin size={32} />
          </div>
          <div>
            <h1 className={styles.title}>
              {dados.rua}, {dados.numero}
            </h1>
            <p className={styles.subtitle}>
              {dados.bairro}, {dados.cidade} - {dados.uf}
            </p>
          </div>
        </div>
        <div className={styles.headerActions}>
          {isEditing ? (
            <>
              <button
                onClick={() => setIsEditing(false)}
                className={styles.cancelButton}
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className={styles.saveButton}
              >
                <Save size={18} /> {isSaving ? "Salvando..." : "Salvar"}
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className={styles.editButton}
            >
              <Edit size={18} /> Editar
            </button>
          )}
          <button
            onClick={handleDeleteOcorrencia}
            className={styles.deleteButton}
            disabled={isEditing}
          >
            <Trash2 size={18} /> Excluir
          </button>
        </div>
      </div>

      {/* NAVEGAÇÃO POR ABAS */}
      <div className={styles.tabsContainer}>
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
      <div className={styles.contentGrid}>
        {/* COLUNA DA ESQUERDA */}
        <div className={styles.leftColumn}>
          {activeTab === "detalhes" && (
            <>
              {/* CRONOLOGIA */}
              <div className={styles.card}>
                <h3 className={styles.cardTitle}>
                  <Clock size={18} className="text-blue-600" /> Cronologia
                </h3>
                <div className={styles.grid3}>
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
              <div className={`${styles.card} space-y-4`}>
                <h3 className={styles.cardTitle}>
                  <FileText size={18} className="text-orange-600" /> Informações
                  do Registro
                </h3>
                <div className={styles.grid2}>
                  {isEditing ? (
                    <>
                      <div>
                        <span className={styles.label}>
                          Status
                        </span>
                        <select
                          name="status"
                          value={formData.status || "Pendente"}
                          onChange={handleChange}
                          className={styles.input}
                        >
                          <option value="Pendente">Pendente</option>
                          <option value="Em andamento">Em andamento</option>
                          <option value="Concluido">Concluido</option>
                        </select>
                      </div>
                      <div>
                        <span className={styles.label}>Causa Real</span>
                        <select
                          name="causaReal"
                          value={formData.causaReal || ""}
                          onChange={handleChange}
                          className={styles.input}
                        >
                          <option value="">Selecione...</option>
                          {[
                            "ABALROAMENTO",
                            "DESCARGA ELÉTRICA",
                            "ERRO OPERACIONAL INTERNO",
                            "INCÊNDIO",
                            "INCONCLUSIVO",
                            "NÃO APURADO POR FALTA DE INFORMAÇÕES",
                            "OBRAS DE TERCEIROS",
                            "QUEDA OU PODA DE ÁRVORE",
                            "SABOTAGEM - AÇÃO INTENCIONAL",
                            "SEM MOVIMENTAÇÃO NAS IMAGENS",
                            "TROCA DE POSTE",
                            "VANDALISMO",
                            "VANDALISMO DEVIDO FURTO DE CABO METÁLICO",
                            "OUTROS",
                          ].map((opt) => (
                            <option key={opt} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <span className={styles.label}>
                          Fonte
                        </span>
                        <select
                          name="fonte"
                          value={formData.fonte || ""}
                          onChange={handleChange}
                          className={styles.input}
                        >
                          <option value="">Selecione...</option>
                          <option value="Grupo Crise">Grupo Crise</option>
                          <option value="Relatório Analítico">
                            Relatório Analítico
                          </option>
                        </select>
                      </div>
                      <div>
                        <span className={styles.label}>
                          Rota
                        </span>
                        <select
                          name="rota"
                          value={formData.rota || ""}
                          onChange={handleChange}
                          className={styles.input}
                        >
                          <option value="">Selecione...</option>
                          <option value="Em Rota">Em Rota</option>
                          <option value="Fora de Rota">Fora de Rota</option>
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
                        <span className={styles.label}>
                          Status
                        </span>
                        <div className="mt-1">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-bold ${statusColors[dados.status] || styles.statusDefault}`}
                          >
                            {dados.status || "Pendente"}
                          </span>
                        </div>
                      </div>
                      <DetailItem label="Causa Real" value={dados.causaReal} />
                      <DetailItem label="Fonte" value={dados.fonte} />
                      <DetailItem label="Rota" value={dados.rota} />
                      <div className="md:col-span-2">
                        <span className={styles.label}>
                          Observações
                        </span>
                        <p className={styles.obsBox}>
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
            <div className={`${styles.card} animate-in fade-in duration-300`}>
              <h3 className={styles.cardTitle}>
                <MapPin size={18} className="text-green-600" /> Localização
              </h3>
              <div className={styles.grid2}>
                {isEditing ? (
                  <>
                    <EditableItem
                      label="CEP"
                      name="cep"
                      value={formData.cep}
                      onChange={handleChange}
                      onBlur={checkCEP}
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
            <div className={`${styles.card} space-y-6 animate-in fade-in duration-300`}>
              <h3 className={styles.cardTitle}>
                <Clock size={18} className="text-green-600" /> Histórico de
                Visitas Técnicas
              </h3>

              {/* Formulário de Adição */}
              <form
                onSubmit={adicionarVisita}
                className={styles.visitaForm}
              >
                <div className={styles.visitaFormTitle}>
                  <Plus size={16} className="text-green-600" /> Nova Visita
                </div>
                <div className={styles.grid2}>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-500">
                      Data
                    </label>
                    <input
                      type="date"
                      required
                      className={styles.visitaInput}
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
                      className={styles.visitaInput}
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
                    className={`${styles.visitaInput} resize-none`}
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
                    className={styles.visitaAddButton}
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
                      className={`${styles.visitaItem} group`}
                    >
                      <div className="flex flex-col items-center min-w-[80px]">
                        <div className="bg-green-50 text-green-700 text-xs font-bold px-2 py-1 rounded-md mb-1">
                          {v.data.split("-").reverse().join("/")}
                        </div>
                        <span className="text-xs text-gray-400 flex items-center gap-1">
                          <Clock size={10} /> {v.hora}
                        </span>
                      </div>
                      <div className="flex-1 border-l-2 border-gray-100 pl-4 min-w-0">
                        <p className="text-sm text-gray-600 leading-relaxed break-words">
                          {v.registro}
                        </p>
                      </div>
                      <button
                        onClick={() => handleDeleteVisita(v.id)}
                        className={styles.visitaDeleteButton}
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
        <div className={styles.rightColumn}>
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>
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
                    className={`px-3 py-1 rounded-full text-xs font-bold ${dados.filmagem === "Sim" ? styles.statusConcluido : styles.statusPendente}`}
                  >
                    {dados.filmagem}
                  </span>
                )}
              </div>
              <div>
                <span className={`${styles.label} mb-2 block`}>
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
      className={`${styles.tabButton} ${
        active
          ? styles.tabActive
          : styles.tabInactive
      }`}
    >
      {icon} {label}
    </button>
  );
}

function InfoCard({ label, date, time }) {
  return (
    <div className={styles.infoCard}>
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
      <span className={styles.label}>
        {label}
      </span>
      <p className="text-gray-700 font-medium mt-1">{value || "N/A"}</p>
    </div>
  );
}

function EditableItem({ label, name, value, onChange, onBlur, type = "text" }) {
  return (
    <div>
      {label && (
        <span className={styles.label}>
          {label}
        </span>
      )}
      {type === "textarea" ? (
        <textarea
          name={name}
          value={value || ""}
          onChange={onChange}
          rows="3"
          className={styles.input}
        />
      ) : (
        <input
          type={type}
          name={name}
          value={value || ""}
          onChange={onChange}
          onBlur={onBlur}
          className={styles.input}
        />
      )}
    </div>
  );
}

function EditableInfoCard({ label, dateName, timeName, value, onChange }) {
  return (
    <div className={`${styles.infoCard} space-y-2`}>
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
