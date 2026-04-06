import { useState, useEffect } from "react";
import { Heading, Box, Text, SimpleGrid, VStack, HStack, Separator, Center, Spinner } from "@chakra-ui/react";
import { BarChart3, Users, Package, Clock } from "lucide-react";
import MainLayout from "../components/MainLayout";

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const userNameFull = localStorage.getItem("user_name") || "Usuario";
  const userName = userNameFull.split(" ")[0];

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const stats = [
    { label: "Ventas Hoy", value: "$12,450", icon: BarChart3, color: "marca.500" },
    { label: "Clientes", value: "140", icon: Users, color: "orange.500" },
    { label: "Stock Bajo", value: "12", icon: Package, color: "red.500" },
  ];

  if (loading) {
    return (
      <MainLayout>
        <Center h="70vh">
          <Spinner size="xl" color="marca.500" thickness="4px" />
        </Center>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <VStack align="stretch" gap={4}>
        {/* Banner de Bienvenida */}
        <Box w="full" bg="superficie.tarjeta" borderRadius="xl" p={5} boxShadow="sm" border="1px solid" borderColor="superficie.borde">
          <Heading size="xl" color="texto.principal" mb={2} letterSpacing="tight">
            ¡Bienvenido de nuevo, {userName}! 👋
          </Heading>
          <Text color="texto.secundario">
            Aquí tienes un resumen de lo que está pasando hoy.
          </Text>
        </Box>
        {/* Grid de Estadísticas Rápidas */}
        <SimpleGrid columns={{ base: 1, md: 3 }} gap={2}>
          {stats.map((stat, index) => (
            <Box key={index} bg="superficie.tarjeta" p={4} borderRadius="xl" boxShadow="sm" border="1px solid" borderColor="superficie.borde">
              <HStack gap={4}>
                <Box p={2} borderRadius="lg" bg="superficie.fondo" color={stat.color}>
                  <stat.icon size={24} />
                </Box>
                <VStack align="start" gap={0}>
                  <Text fontSize="sm" color="texto.secundario" fontWeight="medium">{stat.label}</Text>
                  <Text fontSize="2xl" color="texto.principal" fontWeight="bold">{stat.value}</Text>
                </VStack>
              </HStack>
            </Box>
          ))}
        </SimpleGrid>
        {/* Sección de Actividad Reciente (Placeholder) */}
        <Box bg="superficie.tarjeta" borderRadius="xl" p={4} boxShadow="sm" border="1px solid" borderColor="superficie.borde">
          <HStack mb={4} gap={2}>
            <Clock size={20} color="var(--chakra-colors-marca-500)" />
            <Heading size="md" color="texto.principal">Actividad Reciente</Heading>
          </HStack>
          <Separator mb={4} borderColor="superficie.borde" opacity="0.5" />
          <VStack align="stretch" gap={3}>
            {[1, 2, 3].map((i) => (
              <HStack key={i} justify="space-between" p={2} borderRadius="md" _hover={{ bg: "superficie.fondo" }} transition="bg 0.2s">
                <VStack align="start" gap={0}>
                  <Text fontWeight="bold" color="texto.principal" fontSize="sm">Actualización de inventario</Text>
                  <Text color="texto.secundario" fontSize="xs">Hace {i * 10} minutos</Text>
                </VStack>
                <Text fontWeight="bold" color="marca.500" fontSize="sm">#00{i}A</Text>
              </HStack>
            ))}
          </VStack>
        </Box>
      </VStack>
    </MainLayout>
  );
};

export default Dashboard;