import api from "./axios";

export const fetchFormula = async (articuloId) => {
  const { data } = await api.get(`/articulos/${articuloId}/formulas`);
  return data;
};

export const addIngredienteFormula = async (articuloId, payload) => {
  const { data } = await api.post(`/articulos/${articuloId}/formulas`, payload);
  return data;
};

export const removeIngredienteFormula = async (articuloId, materiaPrimaId) => {
  const { data } = await api.delete(`/articulos/${articuloId}/formulas/${materiaPrimaId}`);
  return data;
};
