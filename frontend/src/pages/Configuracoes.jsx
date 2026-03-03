import { useState, useEffect } from 'react';
import { User, Building, Bell, Shield, Save, Camera, Loader2 } from 'lucide-react';
import styles from './Configuracoes.module.css';

export default function Configuracoes() {
  const [activeTab, setActiveTab] = useState('perfil');
  const [formData, setFormData] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8080";

  // Carrega os dados do usuário logado do localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setFormData(JSON.parse(storedUser));
    }
  }, []);

  if (!formData) {
    return <div className="flex justify-center items-center h-screen text-gray-500">Carregando...</div>;
  }

  return (
    <div className={styles.container}>
      <div>
        <h1 className={styles.title}>Configurações</h1>
        <p className={styles.subtitle}>Gerencie seu perfil de acesso e preferências.</p>
      </div>

      <div className={styles.mainLayout}>
        {/* MENU LATERAL DE CONFIGURAÇÕES */}
        <aside className={styles.sidebar}>
          <SettingsTab active={activeTab === 'perfil'} onClick={() => setActiveTab('perfil')} icon={<User size={18} />} label="Meu Perfil" />
          <SettingsTab active={activeTab === 'clinica'} onClick={() => setActiveTab('clinica')} icon={<Building size={18} />} label="Dados da Unidade" />
          <SettingsTab active={activeTab === 'notificacoes'} onClick={() => setActiveTab('notificacoes')} icon={<Bell size={18} />} label="Notificações" />
          <SettingsTab active={activeTab === 'seguranca'} onClick={() => setActiveTab('seguranca')} icon={<Shield size={18} />} label="Segurança" />
        </aside>

        {/* ÁREA DE CONTEÚDO */}
        <div className={styles.contentArea}>
          <div className={styles.contentPadding}>
            {activeTab === 'perfil' && <PerfilSection formData={formData} />}
            {activeTab === 'clinica' && <div className="text-gray-500 italic">Configurações da unidade em breve...</div>}
            {activeTab === 'notificacoes' && <div className="text-gray-500 italic">Preferências de notificações em breve...</div>}
            {activeTab === 'seguranca' && <div className="text-gray-500 italic">Troca de senha em breve...</div>}
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
      className={`${styles.tabButton} ${active ? styles.tabActive : styles.tabInactive
        }`}
    >
      {icon} {label}
    </button>
  );
}

// Seção de Perfil
function PerfilSection({ formData }) {
  return (
    <div className={`${styles.perfilSection} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
      <div className={styles.avatarContainer}>
        <div className={styles.avatarWrapper}>
          <div className={styles.avatarPlaceholder}>
            <User size={40} />
          </div>
          <button className={styles.avatarUploadButton} disabled>
            <Camera size={16} />
          </button>
        </div>
        <div className={styles.avatarTextContainer}>
          <h3 className={styles.avatarTitle}>Sua Foto</h3>
          <p className={styles.avatarSubtitle}>PNG ou JPG de até 5MB.</p>
        </div>
      </div>

      <div className={styles.formGrid}>
        <div className={styles.inputGroup}>
          <label className={styles.label}>Nome</label>
          <input type="text" name="nome" value={formData.nome || ''} disabled className={styles.input} />
        </div>
        <div className={styles.inputGroup}>
          <label className={styles.label}>E-mail</label>
          <input type="email" name="email" value={formData.email || ''} disabled className={styles.input} />
        </div>
        <div className={styles.inputGroup}>
          <label className={styles.label}>Cargo / Posto</label>
          <input type="text" name="cargo" value={formData.cargo || ''} disabled className={styles.input} />
        </div>
      </div>
    </div>
  );
}