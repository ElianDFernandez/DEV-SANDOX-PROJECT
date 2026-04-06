import api from "./axios";

export const fetchArticulos = async (categoriaId = null) => {
	const params = {};
	if (categoriaId) params.categoria_id = categoriaId;
	const { data } = await api.get("/articulos", { params });
	// data: { articulos: [...], categorias: [...] }
	return data;
};

// Crear un artículo
export const createArticulo = async (articulo) => {
	const { data } = await api.post("/articulos", articulo);
	return data;
};

// Actualizar un artículo
export const updateArticulo = async (id, articulo) => {
	const { data } = await api.put(`/articulos/${id}`, articulo);
	return data;
};

// Eliminar un artículo
export const deleteArticulo = async (id) => {
	const { data } = await api.delete(`/articulos/${id}`);
	return data;
};

// Obtener detalle de un artículo
export const fetchArticulo = async (id) => {
	const { data } = await api.get(`/articulos/${id}`);
	return data;
};

