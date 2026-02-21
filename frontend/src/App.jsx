import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Pacientes from './pages/Pacientes';
import NovoPaciente from './pages/NovoPaciente';
import Prontuario from './pages/Prontuario';
import Agenda from './pages/Agenda';
import Configuracoes from './pages/Configuracoes';

// Página temporária de Pacientes

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={<Login />}
        />

        {/* Todas as rotas abaixo terão a Sidebar */}

        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/pacientes" element={<Pacientes />} />
          <Route path="/config" element={<Configuracoes />} />
          <Route path="/pacientes/novo" element={<NovoPaciente />} />
          <Route path="/pacientes/prontuario" element={<Prontuario />} />
          <Route path="/agenda" element={<Agenda />} />
        </Route>

        <Route path="/" element={<Navigate to="/dashboard" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
