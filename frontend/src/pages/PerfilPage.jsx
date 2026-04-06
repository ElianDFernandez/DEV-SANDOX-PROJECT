import { useEffect, useState } from "react";
import { Box, Container, Heading, Text, Card, Badge, Separator, Flex, SimpleGrid, VStack, Input, Button, HStack } from "@chakra-ui/react";
import AlertMessage from "../components/AlertMessage";
import PageLoader from "../components/PageLoader";
import { User, Lock, Save } from "lucide-react";
import MainLayout from "../components/MainLayout";
import { getPerfil, updateProfile } from "../api/auth";

const PerfilPage = () => {
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    currentPassword: "",
    newPassword: ""
  });

  useEffect(() => {
    getPerfil()
      .then((response) => {
        const user = response.usuario;
        setUsuario(user);
        setFormData((prev) => ({
          ...prev,
          nombre: user.nombre,
          email: user.email
        }));
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
      });
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrorMsg("");
    setSuccessMsg("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const response = await updateProfile(formData);
      const userActualizado = response.usuario;
      setSuccessMsg("¡Perfil actualizado correctamente!");
      localStorage.setItem("user_name", userActualizado.nombre);
      setUsuario(userActualizado);
      setFormData((prev) => ({ ...prev, nombre: userActualizado.nombre, email: userActualizado.email, currentPassword: "", newPassword: "" }));
    } catch (error) {
      const dataError = error.response?.data;
      if (dataError?.mensaje) {
        setErrorMsg(dataError.mensaje);
      } else if (dataError?.errors) {
        const primerError = Object.values(dataError.errors)[0][0];
        setErrorMsg(primerError);
      } else {
        setErrorMsg("Ocurrió un error inesperado al guardar.");
      }
    } finally {
      setIsSaving(false);
    }
  };

    if (loading) {
      return <PageLoader />;
    }

  return (
    <MainLayout>
      <Container maxW="3xl" py={6}>
        <Heading size="xl" mb={8} color="texto.principal" letterSpacing="tight">
          Mi Perfil
        </Heading>
        <Card.Root bg="superficie.tarjeta" borderRadius="2xl" shadow="xl">
          <Card.Header p={8} pb={4}>
            <Flex justify="space-between" align="start">
              <Box>
                <Heading size="lg" color="marca.500" mb={1}>
                  {usuario?.nombre}
                </Heading>
                <Text color="texto.secundario" mb={4}>
                  {usuario?.email}
                </Text>
                <Text fontSize="xs" fontWeight="bold" color="texto.secundario" letterSpacing="widest">
                  REGISTRADO EL {new Date(usuario?.created_at).toLocaleDateString("es-ES", {
                    year: "numeric", month: "long", day: "numeric"
                  }).toUpperCase()}
                </Text>
              </Box>
              <Badge bg="marca.500" color="texto.inverso" px={3} py={1} borderRadius="full" fontSize="xs" fontWeight="bold">
                {usuario?.roles?.[0]?.name || "Usuario"}
              </Badge>
            </Flex>
          </Card.Header>
          <Separator borderColor="superficie.borde" opacity="0.5" />
          <Card.Body p={8}>
            {errorMsg && <AlertMessage type="error">{errorMsg}</AlertMessage>}
            {successMsg && <AlertMessage type="success">{successMsg}</AlertMessage>}
            <form onSubmit={handleSubmit}>
              <VStack align="stretch" gap={8}>
                <Box>
                  <Heading size="sm" color="texto.principal" mb={4} display="flex" alignItems="center" gap={2}>
                    <User size={18} /> Datos Personales
                  </Heading>
                  <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
                    <Box>
                      <Text fontSize="sm" fontWeight="medium" color="texto.secundario" mb={1}>Nombre completo</Text>
                      <Input name="nombre" value={formData.nombre} onChange={handleChange} bg="superficie.fondo" borderColor="superficie.borde" _focus={{ borderColor: "marca.500" }} />
                    </Box>
                    <Box>
                      <Text fontSize="sm" fontWeight="medium" color="texto.secundario" mb={1}>Correo electrónico</Text>
                      <Input name="email" type="email" value={formData.email} onChange={handleChange} bg="superficie.fondo" borderColor="superficie.borde" _focus={{ borderColor: "marca.500" }} />
                    </Box>
                  </SimpleGrid>
                </Box>
                <Separator borderColor="superficie.borde" opacity="0.5" />
                <Box>
                  <Heading size="sm" color="texto.principal" mb={4} display="flex" alignItems="center" gap={2}>
                    <Lock size={18} /> Seguridad
                  </Heading>
                  <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
                    <Box>
                      <Text fontSize="sm" fontWeight="medium" color="texto.secundario" mb={1}>Contraseña actual</Text>
                      <Input name="currentPassword" type="password" placeholder="Solo si cambias clave" value={formData.currentPassword} onChange={handleChange} bg="superficie.fondo" borderColor="superficie.borde" _focus={{ borderColor: "marca.500" }} />
                    </Box>
                    <Box>
                      <Text fontSize="sm" fontWeight="medium" color="texto.secundario" mb={1}>Nueva contraseña</Text>
                      <Input name="newPassword" type="password" placeholder="Mínimo 8 caracteres" value={formData.newPassword} onChange={handleChange} bg="superficie.fondo" borderColor="superficie.borde" _focus={{ borderColor: "marca.500" }} />
                    </Box>
                  </SimpleGrid>
                </Box>
                <HStack justify="flex-end" pt={4}>
                  <Button type="submit" bg="marca.500" color="texto.inverso" gap={2} disabled={isSaving} _hover={{ opacity: 0.9 }}>
                    <Save size={18} />
                    {isSaving ? "Guardando..." : "Guardar Cambios"}
                  </Button>
                </HStack>
              </VStack>
            </form>
          </Card.Body>
        </Card.Root>
      </Container>
    </MainLayout>
  );
};

export default PerfilPage;