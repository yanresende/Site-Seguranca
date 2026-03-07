import { useState } from "react";
import { Save, ArrowLeft, MapPin, User, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import styles from "./NovoVandalismo.module.css";

export default function NovaOcorrencia() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    data_acionamento: "",
    hora_acionamento: "",
    data_vandalismo: "",
    hora_queda: "",
    rota: "",
    data_visita: "",
    hora_visita: "",
    filmagem: "",
    causa_real: "",
    observacoes: "",
    fotografico: "",
    fonte: "",
    cep: "",
    rua: "",
    bairro: "",
    cidade: "",
    uf: "",
    numero: "",
  });

  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8080";

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

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validação manual dos campos obrigatórios
    if (
      !formData.data_acionamento ||
      !formData.hora_acionamento ||
      !formData.data_vandalismo ||
      !formData.hora_queda ||
      !formData.rua ||
      !formData.bairro ||
      !formData.cidade
    ) {
      alert("Por favor, preencha todos os campos obrigatórios marcados com *.");
      return;
    }

    // Prepara o objeto para enviar ao backend (convertendo para o formato esperado pela API)
    const payload = {
      rua: formData.rua,
      bairro: formData.bairro,
      cidade: formData.cidade,
      uf: formData.uf,
      numero: formData.numero,
      cep: formData.cep,
      dataAcionamento: formData.data_acionamento || null,
      horaAcionamento: formData.hora_acionamento ? formData.hora_acionamento + ":00" : null,
      dataVandalismo: formData.data_vandalismo || null,
      horaQueda: formData.hora_queda ? formData.hora_queda + ":00" : null,
      causaReal: formData.causa_real,
      observacoes: formData.observacoes,
      filmagem: formData.filmagem,
      fonte: formData.fonte,
      rota: formData.rota,
      fotografico: formData.fotografico,
      status: "Pendente" // Define um status inicial padrão
    };

    fetch(`${apiUrl}/api/ocorrencias`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((res) => {
        if (res.ok) {
          alert("Ocorrência registrada com sucesso!");
          navigate("/vandalismo");
        } else {
          alert("Erro ao registrar ocorrência. Verifique os dados.");
        }
      })
      .catch((error) => {
        console.error("Erro:", error);
        alert("Erro de conexão com o servidor.");
      });
  };

  return (
    <div className={styles.container}>
      {/* CABEÇALHO */}
      <div className={styles.header}>
        <button
          onClick={() => navigate("/vandalismo")}
          className={styles.backButton}
        >
          <ArrowLeft size={20} /> Voltar
        </button>
        <button
          onClick={handleSubmit}
          className={styles.saveButton}
        >
          <Save size={20} /> Salvar Registro
        </button>
      </div>

      <form className={styles.form}>
        {/* SECÇÃO: Data e Hora */}
        <div className={styles.section}>
          <div className={styles.sectionTitleBlue}>
            <User size={20} /> <span>Dados da Ocorrência</span>
          </div>
          <div className={styles.grid2}>
            <Input
              label="Data do Acionamento"
              required
              type="date"
              placeholder="Ex: 25/12/2024"
              value={formData.data_acionamento}
              onChange={(e) =>
                setFormData({ ...formData, data_acionamento: e.target.value })
              }
            />
            <Input
              label="Hora do Acionamento"
              required
              type="time"
              placeholder="00:00"
              value={formData.hora_acionamento}
              onChange={(e) =>
                setFormData({ ...formData, hora_acionamento: e.target.value })
              }
            />
            <Input
              label="Data do Vandalismo"
              required
              type="date"
              placeholder="Ex: 25/12/2024"
              value={formData.data_vandalismo}
              onChange={(e) =>
                setFormData({ ...formData, data_vandalismo: e.target.value })
              }
            />
            <Input
              label="Hora do Vandalismo"
              required
              type="time"
              placeholder="00:00"
              value={formData.hora_queda}
              onChange={(e) =>
                setFormData({ ...formData, hora_queda: e.target.value })
              }
            />
          </div>
        </div>

        {/* SECÇÃO: DADOS DA INFRAÇÃO */}
        <div className={styles.section}>
          <div className={styles.sectionTitleRed}>
            <AlertTriangle size={20} /> <span>Detalhes da Ocorrência</span>
          </div>
          <div className={styles.grid2}>
            <Input
              label="Causa Real"
              options={[
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
              ]}
              value={formData.causa_real}
              onChange={(e) =>
                setFormData({ ...formData, causa_real: e.target.value })
              }
            />
            <Input
              label="Fonte"
              options={["Grupo Crise", "Relatório Analítico"]}
              value={formData.fonte}
              onChange={(e) =>
                setFormData({ ...formData, fonte: e.target.value })
              }
            />
            <Input
              label="Rota"
              options={["Em Rota", "Fora de Rota"]}
              value={formData.rota}
              onChange={(e) =>
                setFormData({ ...formData, rota: e.target.value })
              }
            />
            <Input
              label="Fotográfico disponível?"
              placeholder={"Link do drive das fotos"}
              value={formData.fotografico}
              onChange={(e) =>
                setFormData({ ...formData, fotografico: e.target.value })
              }
            />
            <Input
              label="Observações"
              placeholder="Ex: detalhes adicionais"
              value={formData.observacoes}
              onChange={(e) =>
                setFormData({ ...formData, observacoes: e.target.value })
              }
            />
          </div>
        </div>

        {/* SECÇÃO: ENDEREÇO */}
        <div className={styles.section}>
          <div className={styles.sectionTitleGreen}>
            <MapPin size={20} /> <span>Endereço</span>
          </div>
          <div className={styles.grid3}>
            <div className={styles.inputContainer}>
              <label className={styles.label}>
                CEP (Busca automática)
              </label>
              <input
                className={styles.inputField}
                placeholder="00000-000"
                onBlur={checkCEP}
                value={formData.cep}
                onChange={(e) =>
                  setFormData({ ...formData, cep: e.target.value })
                }
              />
            </div>
            <div className="md:col-span-2">
              <Input
                label="Rua"
                required
                value={formData.rua}
                onChange={(e) =>
                  setFormData({ ...formData, rua: e.target.value })
                }
              />
            </div>
            <Input
              label="Bairro"
              required
              value={formData.bairro}
              onChange={(e) =>
                setFormData({ ...formData, bairro: e.target.value })
              }
            />
            <Input
              label="Cidade"
              required
              value={formData.cidade}
              onChange={(e) =>
                setFormData({ ...formData, cidade: e.target.value })
              }
            />
            <Input
              label="UF"
              required
              value={formData.uf}
              onChange={(e) => setFormData({ ...formData, uf: e.target.value })}
            />
            <Input
              label="Numero"
              value={formData.numero}
              onChange={(e) =>
                setFormData({ ...formData, numero: e.target.value })
              }
            />
          </div>
        </div>
      </form>
    </div>
  );
}

function Input({ label, type = "text", placeholder, value, onChange, options, required }) {
  return (
    <div className={styles.inputContainer}>
      <label className={styles.label}>
        {label} {required && <span className={styles.required}>*</span>}
      </label>
      {options ? (
        <select
          value={value}
          onChange={onChange}
          className={styles.inputField}
        >
          <option value="">Selecione...</option>
          {options.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={styles.inputField}
        />
      )}
    </div>
  );
}
