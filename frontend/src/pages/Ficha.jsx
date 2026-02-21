import { useState } from 'react';
import { 
  User, FileWarning, Siren, ShieldAlert, 
  Clock, Plus, ArrowLeft, Download, Camera 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Prontuario() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('historico');

  return (
    <div className="space-y-6">
      {/* CABEÇALHO DO Suspeito */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/suspeitos')} className="p-2 hover:bg-gray-100 rounded-full transition">
            <ArrowLeft size={20} className="text-gray-500" />
          </button>
          <div className="w-16 h-16 rounded-2xl bg-red-600 flex items-center justify-center text-white text-2xl font-bold">
            MS
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Marcos Silva (Vulgo: "Ligeiro")</h1>
            <p className="text-sm text-gray-500">CPF: 123.456.789-00 • 34 anos • Reincidente</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50 transition">
            <Download size={18} /> Exportar B.O.
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-100">
            <Plus size={18} /> Nova Ocorrência
          </button>
        </div>
      </div>

      {/* NAVEGAÇÃO POR ABAS */}
      <div className="flex gap-4 border-b border-gray-200">
        <TabButton id="historico" label="Histórico de Furtos" activeTab={activeTab} setActiveTab={setActiveTab} icon={<Clock size={18}/>} />
        <TabButton id="dados" label="Dados Gerais" activeTab={activeTab} setActiveTab={setActiveTab} icon={<User size={18}/>} />
        <TabButton id="exames" label="Evidências/Fotos" activeTab={activeTab} setActiveTab={setActiveTab} icon={<Camera size={18}/>} />
      </div>

      {/* CONTEÚDO DAS ABAS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* COLUNA DA ESQUERDA: LINHA DO TEMPO / EVOLUÇÕES */}
        <div className="lg:col-span-2 space-y-4">
          {activeTab === 'historico' && (
            <>
              <EvolucaoCard 
                date="20 Fev 2026" 
                doctor="Agente Resende" 
                text="Indivíduo flagrado cortando cabo de internet no poste. Abordado no local. Polícia não acionada."
              />
              <EvolucaoCard 
                date="10 Jan 2026" 
                doctor="Agente Resende" 
                text="Primeira ocorrência. Tentativa de levar 5m de cabo. Alegou que era dele. Liberado após devolução."
              />
            </>
          )}
          {activeTab === 'dados' && (
            <div className="bg-white p-6 rounded-2xl border border-gray-100">
              <h3 className="font-bold mb-4">Informações de Contato</h3>
              <p className="text-gray-600 italic">Aqui entrarão os dados que preenchemos no formulário de cadastro...</p>
            </div>
          )}
        </div>

        {/* COLUNA DA DIREITA: RESUMO FIXO */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
              <ShieldAlert size={18} className="text-red-600" /> Alertas de Segurança
            </h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-2 rounded-lg font-medium">
                • Agressivo na abordagem
              </li>
              <li className="flex items-center gap-2 text-sm text-orange-600 bg-orange-50 p-2 rounded-lg font-medium">
                • Anda em grupo
              </li>
            </ul>
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
        active ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
      }`}
    >
      {icon} {label}
    </button>
  );
}

function EvolucaoCard({ date, doctor, text }) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-3">
      <div className="flex justify-between items-center">
        <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">{date}</span>
        <span className="text-xs text-gray-400 font-medium">{doctor}</span>
      </div>
      <p className="text-gray-700 leading-relaxed">{text}</p>
      <div className="pt-3 border-t border-gray-50 flex gap-2">
        <button className="text-xs text-gray-400 hover:text-blue-600 transition">Editar</button>
        <button className="text-xs text-gray-400 hover:text-red-600 transition">Excluir</button>
      </div>
    </div>
  );
}