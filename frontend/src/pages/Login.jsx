import { useState, useEffect } from "react";
import { Shield, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import styles from "./Login.module.css";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Redireciona se o usuário já estiver logado
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/dashboard', { replace: true });
    }
  }, [navigate]);

  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8080";

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Simulação de chamada ao backend (ajuste a URL conforme sua API real)
      const response = await fetch(`${apiUrl}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha }),
      });

      if (response.ok) {
        const data = await response.json();
        
        // Salva o token para uso futuro (ex: Authorization header)
        if (data.token) localStorage.setItem("token", data.token);
        if (data.user) localStorage.setItem("user", JSON.stringify(data.user));

        navigate("/dashboard");
      } else {
        // Tenta ler a mensagem de erro do backend
        const errData = await response.json().catch(() => ({}));
        setError(errData.message || "Credenciais inválidas. Tente novamente.");
      }
    } catch (err) {
      console.error(err);
      setError("Erro de conexão com o servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <div className={styles.logoContainer}>
            <Shield size={32} />
          </div>
          <h2 className={styles.title}>
            Sentinela
          </h2>
          <p className={styles.subtitle}>
            Sistema de Segurança
          </p>
        </div>

        <form className={styles.form} onSubmit={handleLogin}>
          {error && <div className={styles.errorMessage}>{error}</div>}
          
          <div>
            <label className={styles.label}>
              ID Funcional / E-mail
            </label>
            <input
              type="email"
              required
              className={styles.input}
              placeholder="agente.silva@sentinela.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className={styles.label}>
              Senha
            </label>
            <input
              type="password"
              required
              className={styles.input}
              placeholder="••••••••"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
            />
          </div>

          <div className={styles.optionsRow}>
            <label className={styles.rememberLabel}>
              <input
                type="checkbox"
                className={styles.checkbox}
              />
              Lembrar-me
            </label>
            <a
              href="#"
              className={styles.forgotLink}
            >
              Esqueceu a senha?
            </a>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={styles.button}
          >
            {loading ? (
              <>
                <Loader2 size={20} className="animate-spin" /> Entrando...
              </>
            ) : (
              "Entrar no Sistema"
            )}
          </button>
        </form>

        <p className={styles.footer}>
          &copy; 2026 Sentinela Security. Todos os direitos reservados.
        </p>
      </div>
    </div>
  );
}
