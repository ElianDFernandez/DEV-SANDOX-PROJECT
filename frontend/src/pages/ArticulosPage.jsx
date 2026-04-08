import { useEffect, useState } from "react";
import { Box, Heading, Button, VStack, HStack, Text, Input, Field, Dialog, Stack, NativeSelect, Flex } from "@chakra-ui/react";
import AlertMessage from "../components/AlertMessage";
import PageLoader from "../components/PageLoader";
import ConfirmDialog from "../components/ConfirmDialog";
import { Plus, Edit, Trash, Filter, List } from "lucide-react";
import MainLayout from "../components/MainLayout";
import {
  fetchArticulos,
  createArticulo,
  updateArticulo,
  deleteArticulo,
  recalcularCostoArticulo
} from "../api/articulos";
import { fetchFormula, addIngredienteFormula, removeIngredienteFormula } from "../api/formulas";

const ArticulosPage = () => {
  const [articulos, setArticulos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [form, setForm] = useState({
    nombre: "",
    categoria_id: "",
    tipo: "insumo",
    sku: "",
    unidad_medida: "",
    stock_actual: 0,
    stock_minimo: 0,
    costo_base: 0,
    margen_ganancia: 0,
    esta_activo: true
  });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [idToDelete, setIdToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [categoriaFiltro, setCategoriaFiltro] = useState("");
  const [fadingOutId, setFadingOutId] = useState(null);
  const [isFormulaOpen, setIsFormulaOpen] = useState(false);
  const [selectedProducto, setSelectedProducto] = useState(null);
  const [formulaItems, setFormulaItems] = useState([]);
  const [formulaLoading, setFormulaLoading] = useState(false);
  const [formulaSaving, setFormulaSaving] = useState(false);
  const [formulaDeletingId, setFormulaDeletingId] = useState(null);
  const [formulaRecalculating, setFormulaRecalculating] = useState(false);
  const [formulaError, setFormulaError] = useState(null);
  const [formulaForm, setFormulaForm] = useState({ materia_prima_id: "", cantidad_necesaria: "1" });

  const fetchData = async (categoriaId = null) => {
    setLoading(true);
    try {
      const data = await fetchArticulos(categoriaId);
      setArticulos(data.articulos);
      setCategorias(data.categorias);
    } catch (err) {
      setError("Error al cargar artículos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCategoriaFiltro = (e) => {
    const value = e.target.value;
    setCategoriaFiltro(value);
    fetchData(value || null);
  };

  const clearMessages = () => {
    setErrorMsg(null);
  };

  const loadFormula = async (productoId) => {
    setFormulaLoading(true);
    setFormulaError(null);
    try {
      const data = await fetchFormula(productoId);
      setFormulaItems(data.formula || []);
    } catch (err) {
      setFormulaError("No se pudo cargar la fórmula del producto.");
    } finally {
      setFormulaLoading(false);
    }
  };

  const handleOpenFormula = async (articulo) => {
    clearMessages();
    setSelectedProducto(articulo);
    setFormulaForm({ materia_prima_id: "", cantidad_necesaria: "1" });
    setIsFormulaOpen(true);
    await loadFormula(articulo.id);
  };

  const handleCloseFormula = () => {
    if (formulaSaving || formulaDeletingId) return;
    setIsFormulaOpen(false);
    setSelectedProducto(null);
    setFormulaItems([]);
    setFormulaError(null);
    setFormulaForm({ materia_prima_id: "", cantidad_necesaria: "1" });
  };

  const handleAddIngrediente = async () => {
    if (!selectedProducto) return;

    const cantidad = Number(formulaForm.cantidad_necesaria);
    if (!formulaForm.materia_prima_id) {
      setFormulaError("Selecciona un insumo.");
      return;
    }
    if (!Number.isFinite(cantidad) || cantidad <= 0) {
      setFormulaError("La cantidad debe ser mayor que 0.");
      return;
    }

    setFormulaSaving(true);
    setFormulaError(null);
    try {
      await addIngredienteFormula(selectedProducto.id, { materia_prima_id: Number(formulaForm.materia_prima_id), cantidad_necesaria: cantidad });
      await loadFormula(selectedProducto.id);
      setFormulaForm({ materia_prima_id: "", cantidad_necesaria: "1" });
    } catch (err) {
      setFormulaError("No se pudo agregar el insumo a la fórmula.");
    } finally {
      setFormulaSaving(false);
    }
  };

  const handleRemoveIngrediente = async (materiaPrimaId) => {
    if (!selectedProducto) return;
    setFormulaDeletingId(materiaPrimaId);
    setFormulaError(null);
    try {
      await removeIngredienteFormula(selectedProducto.id, materiaPrimaId);
      await loadFormula(selectedProducto.id);
    } catch (err) {
      setFormulaError("No se pudo quitar el insumo de la fórmula.");
    } finally {
      setFormulaDeletingId(null);
    }
  };

  const handleRecalcularCosto = async () => {
    if (!selectedProducto) return;

    setFormulaRecalculating(true);
    setFormulaError(null);
    try {
      await recalcularCostoArticulo(selectedProducto.id);
      await fetchData(categoriaFiltro || null);
      await loadFormula(selectedProducto.id);
    } catch (err) {
      setFormulaError("No se pudo recalcular el costo del producto.");
    } finally {
      setFormulaRecalculating(false);
    }
  };

  const insumosDisponibles = articulos.filter((item) => item.tipo === "insumo" && item.id !== selectedProducto?.id && item.esta_activo);
  const insumoSeleccionado = insumosDisponibles.find((item) => item.id === Number(formulaForm.materia_prima_id));

  if (loading) {
    return <PageLoader />;
  }

  const handleOpenModal = (art = null) => {
    if (!categorias || categorias.length === 0) {
      setErrorMsg("Debes crear al menos una categoría antes de crear artículos.");
      return;
    }
    clearMessages();
    if (art) {
      setSelectedId(art.id);
      setForm({ nombre: art.nombre || "", categoria_id: art.categoria_id || "", tipo: art.tipo || "insumo", sku: art.sku || "", unidad_medida: art.unidad_medida || "", stock_actual: art.stock_actual || 0, stock_minimo: art.stock_minimo || 0, costo_base: art.costo_base || 0, margen_ganancia: art.margen_ganancia || 0, esta_activo: art.esta_activo ?? true });
    } else {
      setSelectedId(null);
      setForm({ nombre: "", categoria_id: "", tipo: "insumo", sku: "", unidad_medida: "", stock_actual: 0, stock_minimo: 0, costo_base: 0, margen_ganancia: 0, esta_activo: true });
    }
    setFormError(null);
    setIsOpen(true);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleSubmit = async () => {
    if (!form.nombre.trim()) {
      setFormError("El nombre es obligatorio");
      return;
    }
    setSubmitting(true);
    clearMessages();
    try {
      if (selectedId) {
        await updateArticulo(selectedId, form);
      } else {
        await createArticulo(form);
      }
      await fetchData(categoriaFiltro || null);
      setIsOpen(false);
    } catch (err) {
      setErrorMsg("Error al guardar el artículo");
      setFormError("Error al procesar la solicitud");
    } finally {
      setSubmitting(false);
    }
  };

  const confirmDelete = (id) => {
    clearMessages();
    setIdToDelete(id);
    setIsDeleteAlertOpen(true);
  };

  const handleDelete = async () => {
    setDeleting(true);
    clearMessages();
    try {
      await deleteArticulo(idToDelete);
      setIsDeleteAlertOpen(false);
      setFadingOutId(idToDelete);
      setTimeout(async () => {
        await fetchData(categoriaFiltro || null);
        setFadingOutId(null);
      }, 450);
    } catch (err) {
      setErrorMsg("Ocurrió un error inesperado al intentar eliminar.");
      setIsDeleteAlertOpen(false);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <MainLayout>
      <Box>
        <HStack justify="space-between" mb={6}>
          <Heading size="lg" color="texto.principal">Artículos</Heading>
          <Flex gap={2}>
                <Box position="relative" w={{ base: "150px", md: "210px" }}>
                    <Box position="absolute" left="10px" top="50%" transform="translateY(-50%)" zIndex="1" pointerEvents="none" color="texto.secundario">
                        <Filter size={16} />
                    </Box>
                    <NativeSelect.Root size="sm">
                    <NativeSelect.Field value={categoriaFiltro} onChange={handleCategoriaFiltro} bg="superficie.tarjeta" borderColor="superficie.borde" borderRadius="md" _focus={{ borderColor: "marca.500", outline: "none" }} pl="34px" >
                        <option value="">Todas las categorías</option>
                        {categorias.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                        ))}
                    </NativeSelect.Field>
                    <NativeSelect.Indicator />
                    </NativeSelect.Root>
                </Box>
                <Button bg="marca.500" _hover={{ bg: "marca.600" }} size="sm" onClick={() => handleOpenModal()} title={(!categorias || categorias.length === 0) ? "Debes crear al menos una categoría" : undefined}>
                  <Plus size={18}/> 
                  <Text style={{ marginLeft: '8px' }} display={{ base: "none", md: "inline" }} color="texto.inverso">
                    Nuevo Artículo
                  </Text>
                </Button>
            </Flex>
        </HStack>

        {/* ALERTAS DE FEEDBACK */}
        {errorMsg && (
          <AlertMessage type="error">{errorMsg}</AlertMessage>
        )}
        {error ? (
          <AlertMessage type="error">{error}</AlertMessage>
        ) : (
          <VStack align="stretch" gap={2}>
            {articulos.length === 0 ? (
              <Text color="texto.secundario">No hay artículos registrados.</Text>
            ) : (
              [...articulos]
                .sort((a, b) => {
                  if (a.esta_activo === b.esta_activo) return 0;
                  return a.esta_activo ? -1 : 1;
                })
                .map((art) => {
                const isFadingOut = fadingOutId === art.id;
                return (
                  <Stack key={art.id} direction={{ base: "column", md: "row" }} bg="superficie.tarjeta" borderRadius="xl" justify="space-between" border="1px solid" borderColor="superficie.borde" p={isFadingOut ? 0 : 3} borderWidth={isFadingOut ? "0px" : "1px"} maxHeight={isFadingOut ? "0px" : "260px"} overflow="hidden" mt={isFadingOut ? "-8px" : "0"} opacity={isFadingOut ? 0 : (art.esta_activo ? 1 : 0.5)} transform={isFadingOut ? "translateX(100px)" : "translateX(0)"} transition="opacity 0.2s ease, transform 0.2s ease, max-height 0.2s ease 0.2s, padding 0.2s ease 0.2s, border-width 0.2s ease 0.2s, margin-top 0.2s ease 0.2s" pointerEvents={isFadingOut ? "none" : "auto"} gap={3}>
                    <Box flex={1} minW={0}>
                      <HStack gap={2} mb={1} align="center">
                        <Text color="texto.principal" fontWeight="medium" isTruncated maxW="180px">{art.nombre}</Text>
                        <Text fontSize="xs" fontWeight="semibold" bg={art.tipo === 'insumo' ? "yellow.500" : "green.500"} color="white" px={2} py={0.5} borderRadius="md">
                          {art.tipo === 'insumo' ? 'Insumo' : 'Producto terminado'}
                        </Text>
                      </HStack>
                      <HStack direction={{ base: "column", md: "row" }} spacing={{ base: 1, md: 6 }} align={{ base: "stretch", md: "start" }}>
                        <VStack align="start" spacing={0} minW={{ base: "auto", md: "120px" }}>
                          <Text fontSize="xs" color="texto.secundario">SKU: <b>{art.sku || '-'}</b></Text>
                          <Text fontSize="xs" color="texto.secundario">Unidad: <b>{art.unidad_medida}</b></Text>
                        </VStack>
                        <VStack align="start" spacing={0} minW={{ base: "auto", md: "120px" }}>
                          <Text fontSize="xs" color="texto.secundario">Stock: <b>{art.stock_actual}</b> (mín: <b>{art.stock_minimo}</b>)</Text>
                          <Text fontSize="xs" color="texto.secundario">Categoría: <b>{art.categoria?.nombre || '-'}</b></Text>
                        </VStack>
                        <VStack align="start" spacing={0} minW={{ base: "auto", md: "120px" }}>
                          <Text fontSize="xs" color="texto.secundario">Costo base: <b>${art.costo_base}</b></Text>
                          {art.tipo === 'producto_terminado' && (
                            <Text fontSize="xs" color="texto.secundario">Margen: <b>{art.margen_ganancia}%</b></Text>
                          )}
                        </VStack>
                      </HStack>
                    </Box>
                    <HStack gap={2} alignSelf={{ base: "stretch", md: "flex-start" }} justify={{ base: "flex-end", md: "flex-start" }} wrap="wrap" pt={1}>
                      <Button size="xs" variant="outline" onClick={() => handleOpenModal(art)} _hover={{ bg: "marca.500",}}>
                        <Edit size={14}/>
                        <Text style={{ marginLeft: '4px' }} display={{ base: "none", md: "inline" }} color="texto.principal">
                            Editar
                        </Text>
                      </Button>
                      {art.tipo === "producto_terminado" && (
                        <Button size="xs" variant="outline" onClick={() => handleOpenFormula(art)} _hover={{ bg: "marca.500" }}>
                          <List size={14} />
                          <Text style={{ marginLeft: '4px' }} display={{ base: "none", md: "inline" }} color="texto.principal">
                            Fórmula
                          </Text>
                        </Button>
                      )}
                      <Button size="xs" variant="outline" _hover={{ bg: "red.600" }} onClick={() => confirmDelete(art.id)}>
                        <Trash size={14}/> 
                        <Text style={{ marginLeft: '4px' }} display={{ base: "none", md: "inline" }} color="texto.principal">
                          Eliminar
                        </Text>
                      </Button>
                    </HStack>
                  </Stack>
                );
              })
            )}
          </VStack>
        )}
        {/* MODAL PARA CREATE / UPDATE */}
        <Dialog.Root open={isOpen} onOpenChange={(e) => !submitting && setIsOpen(e.open)}>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content bg="superficie.tarjeta" borderRadius="xl" p={2} boxShadow="xl" w={{ base: "90%", md: "90%" }}>
              <Dialog.Header>
                <Dialog.Title>{selectedId ? "Editar Artículo" : "Nuevo Artículo"}</Dialog.Title>
              </Dialog.Header>
                <Dialog.Body>
                    <Stack gap={4}>
                        <Field.Root invalid={!!formError} required>
                            <Field.Label>Nombre</Field.Label>
                            <Input name="nombre" value={form.nombre} onChange={handleChange} placeholder="Ej. Coca Cola"/>
                            {formError && <Field.ErrorText>{formError}</Field.ErrorText>}
                        </Field.Root>
                        <HStack gap={4} align="flex-start">
                            <Field.Root flex="1">
                            <Field.Label>Categoría</Field.Label>
                            <NativeSelect.Root>
                                <NativeSelect.Field name="categoria_id" value={form.categoria_id} onChange={handleChange}>
                                <option value="">Seleccionar...</option>
                                {categorias.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                                ))}
                                </NativeSelect.Field>
                                <NativeSelect.Indicator />
                            </NativeSelect.Root>
                            </Field.Root>

                            <Field.Root flex="1">
                            <Field.Label>Tipo</Field.Label>
                            <NativeSelect.Root>
                                <NativeSelect.Field name="tipo" value={form.tipo} onChange={handleChange}>
                                <option value="insumo">Insumo</option>
                                <option value="producto_terminado">Producto terminado</option>
                                </NativeSelect.Field>
                                <NativeSelect.Indicator />
                            </NativeSelect.Root>
                            </Field.Root>
                        </HStack>
                        <HStack gap={4} align="flex-start">
                            <Field.Root flex="1">
                            <Field.Label>SKU</Field.Label>
                            <Input name="sku" value={form.sku} onChange={handleChange} placeholder="Opcional..."/>
                            </Field.Root>
                            <Field.Root flex="1">
                            <Field.Label>Unidad de medida</Field.Label>
                            <Input name="unidad_medida" value={form.unidad_medida} onChange={handleChange} placeholder="Ej. litros, un..."/>
                            </Field.Root>
                        </HStack>
                        <HStack gap={4} align="flex-start">
                            <Field.Root flex="1">
                            <Field.Label>Stock actual</Field.Label>
                            <Input name="stock_actual" type="number" value={form.stock_actual} onChange={handleChange}/>
                            </Field.Root>
                            
                            <Field.Root flex="1">
                            <Field.Label>Stock mínimo</Field.Label>
                            <Input name="stock_minimo" type="number" value={form.stock_minimo} onChange={handleChange}/>
                            </Field.Root>
                        </HStack>
                        <HStack gap={4} align="flex-start">
                            <Field.Root flex="1">
                            <Field.Label>Costo base</Field.Label>
                            <Input name="costo_base" type="number" value={form.costo_base} onChange={handleChange}/>
                            </Field.Root>
                            
                            {form.tipo === "producto_terminado" && (
                            <Field.Root flex="1">
                                <Field.Label>Margen ganancia (%)</Field.Label>
                                <Input name="margen_ganancia" type="number" value={form.margen_ganancia} onChange={handleChange}/>
                            </Field.Root>
                            )}
                        </HStack>

                        <Field.Root display="flex" flexDirection="row" alignItems="center" gap={3} mt={2}>
                            <input name="esta_activo" type="checkbox" checked={form.esta_activo} onChange={handleChange} style={{ width: '18px', height: '18px', cursor: 'pointer' }}/>
                            <Field.Label m={0} cursor="pointer">Artículo Activo</Field.Label>
                        </Field.Root>
                    </Stack>
                </Dialog.Body>
              <Dialog.Footer>
                <Button onClick={() => setIsOpen(false)} variant="ghost" disabled={submitting}>
                  Cancelar
                </Button>
                <Button bg="marca.500" color="texto.inverso" onClick={handleSubmit} loading={submitting}>
                  {selectedId ? "Guardar Cambios" : "Crear"}
                </Button>
              </Dialog.Footer>
              <Dialog.CloseTrigger disabled={submitting} />
            </Dialog.Content>
          </Dialog.Positioner>
        </Dialog.Root>

        <Dialog.Root open={isFormulaOpen} onOpenChange={(e) => !formulaSaving && !formulaDeletingId && setIsFormulaOpen(e.open)}>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content bg="superficie.tarjeta" borderRadius="xl" p={3} boxShadow="xl" w={{ base: "98vw", md: "1200px", lg: "1320px" }} maxW="none">
              <Dialog.Header>
                <Dialog.Title>
                  Fórmula de {selectedProducto?.nombre || "producto"}
                </Dialog.Title>
              </Dialog.Header>
              <Dialog.Body>
                <Stack gap={4}>
                  <Text color="texto.secundario" fontSize="sm">
                    Agrega insumos y su cantidad necesaria para producir 1 unidad del producto terminado.
                  </Text>

                  {formulaError && <AlertMessage type="error">{formulaError}</AlertMessage>}

                  <Field.Root>
                    <Field.Label>Ingredientes actuales</Field.Label>
                    {formulaLoading ? (
                      <Text color="texto.secundario">Cargando fórmula...</Text>
                    ) : formulaItems.length === 0 ? (
                      <Box bg="fondo.secundario" border="1px dashed" borderColor="superficie.borde" borderRadius="lg" p={4}>
                        <Text color="texto.secundario">Todavía no agregaste insumos para este producto.</Text>
                      </Box>
                    ) : (
                      <VStack align="stretch" gap={2}>
                        {formulaItems.map((item) => (
                          <Box key={item.id} bg="fondo.secundario" borderRadius="lg" p={3} border="1px solid" borderColor="superficie.borde">
                            <Stack direction={{ base: "column", md: "row" }} justify="space-between" align={{ base: "stretch", md: "center" }} gap={3}>
                              <VStack align="start" gap={0}>
                                <Text color="texto.principal" fontWeight="semibold" fontSize="sm">{item.nombre}</Text>
                                <Text color="texto.secundario" fontSize="xs">Insumo de la fórmula</Text>
                              </VStack>

                              <HStack justify="space-between" w={{ base: "100%", md: "auto" }} gap={2}>
                                <Box bg="superficie.tarjeta" border="1px solid" borderColor="superficie.borde" borderRadius="md" px={3} py={1.5}>
                                  <Text color="texto.principal" fontSize="xs" fontWeight="medium">
                                    {item.pivot?.cantidad_necesaria} {item.unidad_medida}
                                  </Text>
                                </Box>
                                <Button size="xs" variant="ghost" _hover={{ bg: "red.600", color: "white" }} onClick={() => handleRemoveIngrediente(item.id)} loading={formulaDeletingId === item.id}>
                                  Quitar
                                </Button>
                              </HStack>
                            </Stack>
                          </Box>
                        ))}
                      </VStack>
                    )}
                  </Field.Root>

                  <Field.Root>
                    <Field.Label>Agregar insumo</Field.Label>
                    <HStack align="end" gap={3} flexWrap={{ base: "wrap", md: "nowrap" }}>
                      <Box flex={1} minW={{ base: "100%", md: "auto" }}>
                        <NativeSelect.Root>
                          <NativeSelect.Field value={formulaForm.materia_prima_id} onChange={(e) => setFormulaForm((prev) => ({ ...prev, materia_prima_id: e.target.value }))}>
                            <option value="">Seleccionar insumo...</option>
                            {insumosDisponibles.map((insumo) => (
                              <option key={insumo.id} value={insumo.id}>{insumo.nombre}</option>
                            ))}
                          </NativeSelect.Field>
                          <NativeSelect.Indicator />
                        </NativeSelect.Root>
                      </Box>

                      <HStack w={{ base: "100%", md: "260px" }} gap={2}>
                        <Input type="number" min="0.001" step="0.001" value={formulaForm.cantidad_necesaria} onChange={(e) => setFormulaForm((prev) => ({ ...prev, cantidad_necesaria: e.target.value }))} placeholder="Cantidad" />
                        <Text minW="72px" color="texto.secundario" fontSize="sm">
                          {insumoSeleccionado?.unidad_medida || "unidad"}
                        </Text>
                      </HStack>

                      <Button bg="marca.500" color="texto.inverso" onClick={handleAddIngrediente} loading={formulaSaving} disabled={insumosDisponibles.length === 0}>
                        Agregar
                      </Button>
                    </HStack>
                    {insumosDisponibles.length === 0 && (
                      <Text color="texto.secundario" fontSize="sm" mt={2}>
                        No hay insumos activos disponibles para agregar.
                      </Text>
                    )}
                  </Field.Root>
                </Stack>
              </Dialog.Body>
              <Dialog.Footer>
                {formulaItems.length > 0 && (
                  <Button variant="outline" onClick={handleRecalcularCosto} loading={formulaRecalculating} disabled={formulaSaving || !!formulaDeletingId || formulaLoading}>
                    Recalcular costo
                  </Button>
                )}
                <Button variant="ghost" onClick={handleCloseFormula} disabled={formulaSaving || !!formulaDeletingId}>
                  Cerrar
                </Button>
              </Dialog.Footer>
              <Dialog.CloseTrigger disabled={formulaSaving || !!formulaDeletingId} />
            </Dialog.Content>
          </Dialog.Positioner>
        </Dialog.Root>

        {/* DIALOG DE CONFIRMACIÓN PARA ELIMINAR */}
        <ConfirmDialog open={isDeleteAlertOpen} onClose={() => setIsDeleteAlertOpen(false)} onConfirm={handleDelete} title="¿Estás seguro?" message="Esta acción eliminará el artículo permanentemente." loading={deleting} confirmText="Eliminar" cancelText="Cancelar" confirmColor="red.600" confirmTextColor="white"/>
      </Box>
    </MainLayout>
  );
};

export default ArticulosPage;