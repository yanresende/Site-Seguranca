import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Suspeitos from "./pages/Suspeitos";
import NovaOcorrencia from "./pages/NovaOcorrencia";
import NovoVandalismo from "./pages/NovoVandalismo";
import Vandalismo from "./pages/Vandalismo";
import Ficha from './pages/Ficha';
import Dados from './pages/Dados';
import Ocorrencia from "./pages/Ocorrencia";
import Configuracoes from './pages/Configuracoes';
import Tecnico from "./pages/Tecnico";
import Graficos from "./pages/Graficos";

// Página temporária de Pacientes

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        {/* Todas as rotas abaixo terão a Sidebar */}

        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/suspeitos" element={<Suspeitos />} />
          <Route path="/tecnico" element={<Tecnico />} />
          <Route path="/vandalismo" element={<Vandalismo />} />
          <Route path="/config" element={<Configuracoes />} />
          <Route path="/suspeitos/novo" element={<NovaOcorrencia />} />
          <Route path="/vandalismo/novo" element={<NovoVandalismo />} />
          <Route path="/suspeitos/ficha" element={<Ficha />} />
          <Route path="/vandalismo/dados/:id" element={<Dados />} />
          <Route path="/ocorrencia" element={<Ocorrencia />} />
          <Route path="/graficos" element={<Graficos />} />
        </Route>

        <Route path="/" element={<Navigate to="/dashboard" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
