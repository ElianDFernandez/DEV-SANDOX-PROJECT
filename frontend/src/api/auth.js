import api from "./axios";

export const login = async (credentials) => {
  const response = await api.post("/login", credentials);
  return response.data;
};

export const logout = async () => {
  const response = await api.post("/logout");
  return response.data;
};

export const getPerfil = async () => {
  const response = await api.get("/perfil");
  return response.data;
};

export const updateProfile = async (datos) => {
  const response = await api.put("/perfil", datos);
  return response.data;
};