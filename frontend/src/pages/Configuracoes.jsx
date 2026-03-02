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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!formData || !formData.id) {
      alert("Dados do usuário não encontrados.");
      return;
    }

    setIsSaving(true);
    try {
      // Nota: Você precisará criar este endpoint no seu backend!
      const response = await fetch(`${apiUrl}/api/usuarios/${formData.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Falha ao salvar as alterações.");
      }

      const updatedUser = await response.json();
      // Atualiza o estado e o localStorage
      setFormData(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      alert("Perfil atualizado com sucesso!");

    } catch (error) {
      console.error("Erro ao salvar:", error);
      alert(error.message);
    } finally {
      setIsSaving(false);
    }
  };

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
          <SettingsTab active={activeTab === 'perfil'} onClick={() => setActiveTab('perfil')} icon={<User size={18}/>} label="Meu Perfil" />
          <SettingsTab active={activeTab === 'clinica'} onClick={() => setActiveTab('clinica')} icon={<Building size={18}/>} label="Dados da Unidade" />
          <SettingsTab active={activeTab === 'notificacoes'} onClick={() => setActiveTab('notificacoes')} icon={<Bell size={18}/>} label="Notificações" />
          <SettingsTab active={activeTab === 'seguranca'} onClick={() => setActiveTab('seguranca')} icon={<Shield size={18}/>} label="Segurança" />
        </aside>

        {/* ÁREA DE CONTEÚDO */}
        <div className={styles.contentArea}>
          <div className={styles.contentPadding}>
            {activeTab === 'perfil' && <PerfilSection formData={formData} onChange={handleChange} />}
            {activeTab === 'clinica' && <div className="text-gray-500 italic">Configurações da unidade em breve...</div>}
            {activeTab === 'notificacoes' && <div className="text-gray-500 italic">Preferências de notificações em breve...</div>}
            {activeTab === 'seguranca' && <div className="text-gray-500 italic">Troca de senha em breve...</div>}
          </div>
          
          <div className={styles.footer}>
            <button className={styles.discardButton}>Descartar</button>
            <button 
              onClick={handleSave}
              disabled={isSaving}
              className={styles.saveButton}
            >
              {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
              {isSaving ? 'Salvando...' : 'Salvar Alterações'}
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
      className={`${styles.tabButton} ${
        active ? styles.tabActive : styles.tabInactive
      }`}
    >
      {icon} {label}
    </button>
  );
}

// Seção de Perfil
function PerfilSection({ formData, onChange }) {
  return (
    <div className={`${styles.perfilSection} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
      <div className={styles.avatarContainer}>
        <div className={styles.avatarWrapper}>
          <div className={styles.avatarPlaceholder}>
            <User size={40} />
          </div>
          <button className={styles.avatarUploadButton}>
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
          <label className={styles.label}>Nome Completo</label>
          <input type="text" name="nome" value={formData.nome || ''} onChange={onChange} className={styles.input} />
        </div>
        <div className={styles.inputGroup}>
          <label className={styles.label}>Matrícula</label>
          <input type="text" name="matricula" value={formData.matricula || 'N/A'} onChange={onChange} className={styles.input} disabled />
        </div>
        <div className={styles.inputGroup}>
          <label className={styles.label}>E-mail</label>
          <input type="email" name="email" value={formData.email || ''} onChange={onChange} className={styles.input} />
        </div>
        <div className={styles.inputGroup}>
          <label className={styles.label}>Cargo / Posto</label>
          <select name="cargo" value={formData.cargo || ''} onChange={onChange} className={styles.select}>
            <option value="">Selecione...</option>
            <option value="Admin">Admin</option>
            <option value="Chefe de Segurança">Chefe de Segurança</option>
            <option value="Monitoramento">Monitoramento</option>
            <option value="Fiscal de Loja">Fiscal de Loja</option>
          </select>
        </div>
      </div>
    </div>
  );
}