import { useState } from "react";
import { Save, ArrowLeft, MapPin, User, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";

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

  // Função para buscar o CEP automaticamente
  const checkCEP = (e) => {
    const cep = e.target.value.replace(/\D/g, "");
    if (cep.length === 8) {
      fetch(`https://viacep.com.br/ws/${cep}/json/`)
        .then((res) => res.json())
        .then((data) => {
          if (!data.erro) {
            setFormData((prev) => ({
              ...prev,
              rua: data.logradouro,
              bairro: data.bairro,
              cidade: data.localidade,
              uf: data.uf,
            }));
          }
        });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Dados salvos:", formData);
    alert("Ocorrência registrada com sucesso! (Simulado)");
    navigate("/vandalismo");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* CABEÇALHO */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate("/vandalismo")}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-700 transition"
        >
          <ArrowLeft size={20} /> Voltar
        </button>
        <button
          onClick={handleSubmit}
          className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-100"
        >
          <Save size={20} /> Salvar Registro
        </button>
      </div>

      <form className="space-y-6">
        {/* SECÇÃO: Data e Hora */}
        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-blue-600 font-bold mb-4">
            <User size={20} /> <span>Dados da Ocorrência</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Data do Acionamento"
              type="date"
              placeholder="Ex: 25/12/2024"
              value={formData.data_acionamento}
              onChange={(e) =>
                setFormData({ ...formData, data_acionamento: e.target.value })
              }
            />
            <Input
              label="Hora do Acionamento"
              type="time"
              placeholder="00:00"
              value={formData.hora_acionamento}
              onChange={(e) =>
                setFormData({ ...formData, hora_acionamento: e.target.value })
              }
            />
            <Input
              label="Data do Vandalismo"
              type="date"
              placeholder="Ex: 25/12/2024"
              value={formData.data_vandalismo}
              onChange={(e) =>
                setFormData({ ...formData, data_vandalismo: e.target.value })
              }
            />
            <Input
              label="Hora do Vandalismo"
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
        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-red-600 font-bold mb-4">
            <AlertTriangle size={20} /> <span>Detalhes da Ocorrência</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Filmagem disponível?"
              options={["Sim", "Não"]}
              value={formData.filmagem}
              onChange={(e) =>
                setFormData({ ...formData, filmagem: e.target.value })
              }
            />
            <Input
              label="Causa Real"
              placeholder="Ex: Escreva a causa real do vandalismo"
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
        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-green-600 font-bold mb-4">
            <MapPin size={20} /> <span>Endereço</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">
                CEP (Busca automática)
              </label>
              <input
                className="w-full px-4 py-2 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="00000-000"
                onBlur={checkCEP}
              />
            </div>
            <div className="md:col-span-2">
              <Input
                label="Rua"
                value={formData.rua}
                onChange={(e) =>
                  setFormData({ ...formData, rua: e.target.value })
                }
              />
            </div>
            <Input
              label="Bairro"
              value={formData.bairro}
              onChange={(e) =>
                setFormData({ ...formData, bairro: e.target.value })
              }
            />
            <Input
              label="Cidade"
              value={formData.cidade}
              onChange={(e) =>
                setFormData({ ...formData, cidade: e.target.value })
              }
            />
            <Input
              label="UF"
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

function Input({ label, type = "text", placeholder, value, onChange, options }) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      {options ? (
        <select
          value={value}
          onChange={onChange}
          className="w-full px-4 py-2 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500 transition bg-white"
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
          className="w-full px-4 py-2 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500 transition"
        />
      )}
    </div>
  );
}
