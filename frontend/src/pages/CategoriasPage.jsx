import { useEffect, useState } from "react";
import { Box, Heading, Button, VStack, HStack, Text, Input, Field, Dialog, Stack } from "@chakra-ui/react";
import AlertMessage from "../components/AlertMessage";
import PageLoader from "../components/PageLoader";
import ConfirmDialog from "../components/ConfirmDialog";
import { Plus, Edit, Trash } from "lucide-react";
import MainLayout from "../components/MainLayout";
import { getCategorias, createCategoria, updateCategoria, deleteCategoria } from "../api/categoria";

const CategoriasPage = () => {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [errorMsg, setErrorMsg] = useState(null);

  const [isOpen, setIsOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);

  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [idToDelete, setIdToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  
  const [fadingOutId, setFadingOutId] = useState(null);

  const fetchCategorias = async () => {
    try {
      const data = await getCategorias();
      setCategorias(data);
    } catch (err) {
      setError("Error al cargar categorías");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategorias();
  }, []);

  const clearMessages = () => {
    setErrorMsg(null);
  };

    if (loading) {
      return <PageLoader />;
    }

  const handleOpenModal = (cat = null) => {
    clearMessages();
    if (cat) {
      setSelectedId(cat.id);
      setNombre(cat.nombre);
      setDescripcion(cat.descripcion || "");
    } else {
      setSelectedId(null);
      setNombre("");
      setDescripcion("");
    }
    setFormError(null);
    setIsOpen(true);
  };

  const handleSubmit = async () => {
    if (!nombre.trim()) {
      setFormError("El nombre es obligatorio");
      return;
    }
    setSubmitting(true);
    clearMessages();
    try {
      if (selectedId) {
        await updateCategoria(selectedId, { nombre, descripcion });
      } else {
        await createCategoria({ nombre, descripcion });
      }
      await fetchCategorias();
      setIsOpen(false);
    } catch (err) {
      setErrorMsg("Error al guardar la categoría");
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
      await deleteCategoria(idToDelete);
      setIsDeleteAlertOpen(false);
      setFadingOutId(idToDelete);
      setTimeout(async () => {
        await fetchCategorias();
        setFadingOutId(null);
      }, 450);

    } catch (err) {
      if (err.response?.status === 500 || err.response?.data?.message?.includes("1451")) {
        setErrorMsg("No se puede eliminar: Esta categoría tiene artículos asociados.");
      } else {
        setErrorMsg("Ocurrió un error inesperado al intentar eliminar.");
      }
      setIsDeleteAlertOpen(false);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <MainLayout>
      <Box>
        <HStack justify="space-between" mb={6}>
          <Heading size="lg" color="texto.principal">Categorías</Heading>
          <Button bg="marca.500" _hover={{ bg: "marca.600" }} size="sm" onClick={() => handleOpenModal()}>
            <Plus size={18}/> 
            <Text style={{ marginLeft: '8px' }} display={{ base: "none", md: "inline" }} color="texto.inverso">
                Nueva Categoría
            </Text>
          </Button>
        </HStack>
        {/* ALERTAS DE FEEDBACK */}
        {errorMsg && (
          <AlertMessage type="error">{errorMsg}</AlertMessage>
        )}
        {error ? (
          <AlertMessage type="error">{error}</AlertMessage>
        ) : (
          <VStack align="stretch" gap={2}>
            {categorias.length === 0 ? (
              <Text color="texto.secundario">No hay categorías registradas.</Text>
            ) : (
              categorias.map((cat) => {
                const cantidadArticulos = Number(cat.articulos_count) || 0;
                const tieneArticulos = cantidadArticulos > 0;
                const isFadingOut = fadingOutId === cat.id;
                return (
                    <HStack key={cat.id} bg="superficie.tarjeta" borderRadius="xl" justify="space-between" border="1px solid" borderColor="superficie.borde" p={isFadingOut ? 0 : 3} borderWidth={isFadingOut ? "0px" : "1px"} maxHeight={isFadingOut ? "0px" : "120px"} overflow="hidden"mt={isFadingOut ? "-8px" : "0"} opacity={isFadingOut ? 0 : 1} transform={isFadingOut ? "translateX(100px)" : "translateX(0)"} transition="opacity 0.2s ease, transform 0.2s ease, max-height 0.2s ease 0.2s, padding 0.2s ease 0.2s, border-width 0.2s ease 0.2s, margin-top 0.2s ease 0.2s" pointerEvents={isFadingOut ? "none" : "auto"} >
                    <VStack align="start" gap={1}>
                      <HStack gap={2}>
                        <Text color="texto.principal" fontWeight="medium">{cat.nombre}</Text>
                        {tieneArticulos && (
                          <Text fontSize="xs" fontWeight="semibold" bg="superficie.fondo" color="texto.secundario" px={2} py={0.5} borderRadius="md">
                            {cantidadArticulos} {cantidadArticulos === 1 ? 'artículo' : 'artículos'}
                          </Text>
                        )}
                      </HStack>
                      {cat.descripcion && <Text fontSize="xs" color="texto.secundario">{cat.descripcion}</Text>}
                    </VStack>
                    <HStack gap={2}>
                      <Button size="xs" variant="outline" onClick={() => handleOpenModal(cat)} _hover={{ bg: "marca.500",}}>
                        <Edit size={14}/>
                        <Text style={{ marginLeft: '4px' }} display={{ base: "none", md: "inline" }} color="texto.principal">
                            Editar
                        </Text>
                      </Button>
                      <Button size="xs" variant="outline" _hover={!tieneArticulos ? { bg: "red.600" } : {}} onClick={() => confirmDelete(cat.id)} disabled={tieneArticulos} title={tieneArticulos ? "No puedes eliminar una categoría con artículos" : "Eliminar"} opacity={tieneArticulos ? 0.5 : 1}>
                        <Trash size={14}/> 
                        <Text style={{ marginLeft: '4px' }} display={{ base: "none", md: "inline" }} color="texto.principal">
                          Eliminar
                        </Text>
                      </Button>
                    </HStack>
                  </HStack>
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
                <Dialog.Title>{selectedId ? "Editar Categoría" : "Nueva Categoría"}</Dialog.Title>
              </Dialog.Header>
              <Dialog.Body>
                <Stack gap={4}>
                  <Field.Root invalid={!!formError} required>
                    <Field.Label>Nombre</Field.Label>
                    <Input value={nombre} onChange={e => setNombre(e.target.value)} placeholder="Ej. Bebidas"/>
                    {formError && <Field.ErrorText>{formError}</Field.ErrorText>}
                  </Field.Root>
                  <Field.Root>
                    <Field.Label>Descripción</Field.Label>
                    <Input value={descripcion} onChange={e => setDescripcion(e.target.value)} placeholder="Opcional..." />
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
        {/* DIALOG DE CONFIRMACIÓN PARA ELIMINAR */}
        <ConfirmDialog open={isDeleteAlertOpen} onClose={() => setIsDeleteAlertOpen(false)} onConfirm={handleDelete} title="¿Estás seguro?" message="Esta acción eliminará la categoría permanentemente." loading={deleting} confirmText="Eliminar" cancelText="Cancelar" confirmColor="red.600" confirmTextColor="white"/>
      </Box>
    </MainLayout>
  );
};

export default CategoriasPage;