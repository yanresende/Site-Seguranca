import { Stethoscope } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // No futuro, chamada para o Backend Spring Boot
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-10 space-y-8 border border-gray-100">
        <div className="text-center">
          <div className="inline-flex p-4 bg-blue-600 rounded-2xl text-white mb-4">
            <Stethoscope size={32} />
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900 italic">
            NaviData
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Acesse sua conta para gerenciar a clínica
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleLogin}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              E-mail profissional
            </label>
            <input
              type="email"
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              placeholder="exemplo@navidata.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Senha
            </label>
            <input
              type="password"
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              placeholder="••••••••"
            />
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center text-gray-500">
              <input
                type="checkbox"
                className="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              Lembrar-me
            </label>
            <a
              href="#"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Esqueceu a senha?
            </a>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transform active:scale-95 transition-all shadow-lg shadow-blue-200"
          >
            Entrar no Sistema
          </button>
        </form>

        <p className="text-center text-xs text-gray-400 mt-8">
          &copy; 2026 Navi Health System. Todos os direitos reservados.
        </p>
      </div>
    </div>
  );
}
