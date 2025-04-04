import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api', // Assumindo que sua API Laravel roda na porta 8000
  headers: {
    'Content-Type': 'application/json',
  },
});

// Adicionar interceptor para incluir o token de autenticação
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;