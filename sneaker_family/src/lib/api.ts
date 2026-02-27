import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true,
});

// ✅ Intercepteur pour injecter le Token JWT dans chaque requête
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getProducts = async () => {
  try {
    const res = await api.get("/products");
    return res.data;
  } catch (error) {
    console.error("Erreur lors de l'appel API getProducts:", error);
    return [];
  }
};

export default api;