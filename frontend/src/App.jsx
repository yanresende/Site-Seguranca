import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Suspeitos from "./pages/Suspeitos";
import NovaOcorrencia from "./pages/NovaOcorrencia";
import Ficha from './pages/Ficha';
import Ocorrencia from "./pages/Ocorrencia";
import Configuracoes from './pages/Configuracoes';

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
          <Route path="/config" element={<Configuracoes />} />
          <Route path="/suspeitos/novo" element={<NovaOcorrencia />} />
          <Route path="/suspeitos/ficha" element={<Ficha />} />
          <Route path="/ocorrencia" element={<Ocorrencia />} />
        </Route>

        <Route path="/" element={<Navigate to="/dashboard" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
