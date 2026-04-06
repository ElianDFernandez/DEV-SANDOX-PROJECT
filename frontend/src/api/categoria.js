import api from "./axios";

export const getCategorias = async () => {
  const response = await api.get("/categorias");
  return response.data;
}

export const createCategoria = async (datos) => {
  const response = await api.post("/categorias", datos);
  return response.data;
}

export const updateCategoria = async (id, datos) => {
  const response = await api.put(`/categorias/${id}`, datos);
  return response.data;
}

export const deleteCategoria = async (id) => {
  const response = await api.delete(`/categorias/${id}`);
  return response.data;
}