import { useState } from 'react';
import { Save, ArrowLeft, MapPin, User, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function NovoPaciente() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nome: '', cpf: '', email: '', telefone: '',
    cep: '', rua: '', bairro: '', cidade: '', uf: '',
    itemFurtado: '', valorEstimado: ''
  });

  // Função para buscar o CEP automaticamente
  const checkCEP = (e) => {
    const cep = e.target.value.replace(/\D/g, '');
    if (cep.length === 8) {
      fetch(`https://viacep.com.br/ws/${cep}/json/`)
        .then(res => res.json())
        .then(data => {
          if (!data.erro) {
            setFormData(prev => ({
              ...prev,
              rua: data.logradouro,
              bairro: data.bairro,
              cidade: data.localidade,
              uf: data.uf
            }));
          }
        });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Dados salvos:", formData);
    alert("Ocorrência registrada com sucesso! (Simulado)");
    navigate('/pacientes');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* CABEÇALHO */}
      <div className="flex items-center justify-between">
        <button onClick={() => navigate('/pacientes')} className="flex items-center gap-2 text-gray-500 hover:text-gray-700 transition">
          <ArrowLeft size={20} /> Voltar
        </button>
        <button onClick={handleSubmit} className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-100">
          <Save size={20} /> Salvar Registro
        </button>
      </div>

      <form className="space-y-6">
        {/* SECÇÃO: DADOS PESSOAIS */}
        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-blue-600 font-bold mb-4">
            <User size={20} /> <span>Dados do Suspeito</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Nome (ou Vulgo)" placeholder="Ex: Maria Oliveira" value={formData.nome} onChange={e => setFormData({...formData, nome: e.target.value})} />
            <Input label="CPF" placeholder="000.000.000-00" value={formData.cpf} onChange={e => setFormData({...formData, cpf: e.target.value})} />
            <Input label="Características Físicas" placeholder="Ex: Tatuagem no braço, boné preto" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
            <Input label="Telefone (se houver)" placeholder="(11) 99999-9999" value={formData.telefone} onChange={e => setFormData({...formData, telefone: e.target.value})} />
          </div>
        </div>

        {/* SECÇÃO: DADOS DA INFRAÇÃO */}
        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-red-600 font-bold mb-4">
            <AlertTriangle size={20} /> <span>Detalhes da Ocorrência</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Item Subtraído" placeholder="Ex: Garrafa de Whisky" value={formData.itemFurtado} onChange={e => setFormData({...formData, itemFurtado: e.target.value})} />
            <Input label="Valor Estimado (R$)" type="number" placeholder="0,00" value={formData.valorEstimado} onChange={e => setFormData({...formData, valorEstimado: e.target.value})} />
          </div>
        </div>

        {/* SECÇÃO: ENDEREÇO */}
        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-green-600 font-bold mb-4">
            <MapPin size={20} /> <span>Endereço</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">CEP (Busca automática)</label>
              <input 
                className="w-full px-4 py-2 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="00000-000"
                onBlur={checkCEP}
              />
            </div>
            <div className="md:col-span-2">
              <Input label="Rua" value={formData.rua} onChange={e => setFormData({...formData, rua: e.target.value})} />
            </div>
            <Input label="Bairro" value={formData.bairro} onChange={e => setFormData({...formData, bairro: e.target.value})} />
            <Input label="Cidade" value={formData.cidade} onChange={e => setFormData({...formData, cidade: e.target.value})} />
            <Input label="UF" value={formData.uf} onChange={e => setFormData({...formData, uf: e.target.value})} />
          </div>
        </div>
      </form>
    </div>
  );
}

function Input({ label, type = "text", placeholder, value, onChange }) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <input 
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full px-4 py-2 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500 transition"
      />
    </div>
  );
}