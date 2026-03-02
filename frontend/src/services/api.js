import axios from "axios";

const api = axios.create({
  // O Vite vai buscar a variável VITE_API_URL que você configurou no painel do Railway.
  // Se não encontrar (ex: no seu PC), ele usa o localhost:8080.
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080",
});

export default api;
