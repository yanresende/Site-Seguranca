import { useState } from 'react';
import { User, Building2, Bell, Shield, Save, Camera } from 'lucide-react';

export default function Configuracoes() {
  const [activeTab, setActiveTab] = useState('perfil');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Configurações</h1>
        <p className="text-gray-500">Gerencie sua conta e as preferências do sistema.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* MENU LATERAL DE CONFIGURAÇÕES */}
        <aside className="w-full md:w-64 space-y-1">
          <SettingsTab active={activeTab === 'perfil'} onClick={() => setActiveTab('perfil')} icon={<User size={18}/>} label="Meu Perfil" />
          <SettingsTab active={activeTab === 'clinica'} onClick={() => setActiveTab('clinica')} icon={<Building2 size={18}/>} label="Dados da Clínica" />
          <SettingsTab active={activeTab === 'notificacoes'} onClick={() => setActiveTab('notificacoes')} icon={<Bell size={18}/>} label="Notificações" />
          <SettingsTab active={activeTab === 'seguranca'} onClick={() => setActiveTab('seguranca')} icon={<Shield size={18}/>} label="Segurança" />
        </aside>

        {/* ÁREA DE CONTEÚDO */}
        <div className="flex-1 bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-8">
            {activeTab === 'perfil' && <PerfilSection />}
            {activeTab === 'clinica' && <div className="text-gray-500 italic">Configurações da clínica em breve...</div>}
            {activeTab === 'notificacoes' && <div className="text-gray-500 italic">Preferências de notificações em breve...</div>}
            {activeTab === 'seguranca' && <div className="text-gray-500 italic">Troca de senha em breve...</div>}
          </div>
          
          <div className="bg-gray-50 px-8 py-4 flex justify-end gap-3 border-t border-gray-100">
            <button className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-200 rounded-xl transition">Descartar</button>
            <button className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-xl text-sm font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-100">
              <Save size={18} /> Salvar Alterações
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Sub-componente para os itens do menu
function SettingsTab({ icon, label, active, onClick }) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition ${
        active ? 'bg-blue-600 text-white shadow-md shadow-blue-100' : 'text-gray-500 hover:bg-white hover:text-gray-700'
      }`}
    >
      {icon} {label}
    </button>
  );
}

// Seção de Perfil
function PerfilSection() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="flex items-center gap-6">
        <div className="relative group">
          <div className="w-24 h-24 rounded-3xl bg-blue-50 flex items-center justify-center text-blue-600 border-2 border-dashed border-blue-200">
            <User size={40} />
          </div>
          <button className="absolute -bottom-2 -right-2 p-2 bg-white rounded-lg shadow-md border border-gray-100 text-gray-600 hover:text-blue-600 transition">
            <Camera size={16} />
          </button>
        </div>
        <div>
          <h3 className="font-bold text-gray-800">Sua Foto</h3>
          <p className="text-xs text-gray-400">PNG ou JPG de até 5MB.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">Nome Completo</label>
          <input type="text" className="w-full px-4 py-2 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500" defaultValue="Dr. Yan Resende" />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">CRM</label>
          <input type="text" className="w-full px-4 py-2 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500" defaultValue="123456-SP" />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">E-mail</label>
          <input type="email" className="w-full px-4 py-2 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500" defaultValue="yan@navidata.com" />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">Especialidade Principal</label>
          <select className="w-full px-4 py-2 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500 bg-white">
            <option>Cardiologia</option>
            <option>Ortopedia</option>
            <option>Clínica Geral</option>
          </select>
        </div>
      </div>
    </div>
  );
}