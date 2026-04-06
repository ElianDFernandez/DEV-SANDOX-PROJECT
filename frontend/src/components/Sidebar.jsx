import { Flex, Heading, Button, VStack, Spacer, Box } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { Sun, Moon, LayoutDashboard, FolderTree, X, BarChart3, Package, FileText, Users } from "lucide-react";

const SidebarContent = ({ isDarkMode, toggleTheme, onClose }) => {
  const navigate = useNavigate();
  return (
    <Flex direction="column" h="full" w="full">
      <Flex align="center" justify="space-between" mb={10}>
        <Heading size="xl" color="marca.500" textAlign="center" w="full">
          {import.meta.env.VITE_APP_NAME || "PLATERO"}
        </Heading>
        <Box display={{ base: "block", md: "none" }} onClick={onClose} cursor="pointer">
          <X size={24} />
        </Box>
      </Flex>
      <VStack align="stretch" gap={2}>
        <Button variant="ghost" color="texto.secundario" _hover={{ color:"marca.500" }} justifyContent="start" gap={3} onClick={() => { navigate("/dashboard"); onClose?.(); }}>
          <LayoutDashboard size={20} /> Panel Principal
        </Button>
        <Button variant="ghost" color="texto.secundario" _hover={{ color:"marca.500" }} justifyContent="start" gap={3} onClick={() => { navigate("/categorias"); onClose?.(); }}>
          <FolderTree size={20} /> Categorías
        </Button>
        <Button variant="ghost" color="texto.secundario" _hover={{ color:"marca.500" }} justifyContent="start" gap={3} onClick={() => { navigate("/articulos"); onClose?.(); }}>
          <Package size={20} /> Artículos
        </Button>
        <Button variant="ghost" color="texto.secundario" _hover={{ color:"marca.500" }} justifyContent="start" gap={3} onClick={() => { navigate("/movimientos"); onClose?.(); }}>
          <BarChart3 size={20} /> Movimientos
        </Button>
        <Button variant="ghost" color="texto.secundario" _hover={{ color:"marca.500" }} justifyContent="start" gap={3} onClick={() => { navigate("/ordenes"); onClose?.(); }}>
          <FileText size={20} /> Órdenes
        </Button>
        <Button variant="ghost" color="texto.secundario" _hover={{ color:"marca.500" }} justifyContent="start" gap={3} onClick={() => { navigate("/usuarios"); onClose?.(); }}>
          <Users size={20} /> Usuarios
        </Button>
      </VStack>
      <Spacer />
      <Button variant="outline" w="full" color="texto.secundario" border="none" gap={3} onClick={toggleTheme}>
        {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        {isDarkMode ? "Modo Claro" : "Modo Oscuro"}
      </Button>
    </Flex>
  );
};

const Sidebar = ({ isOpen, onClose, isDarkMode, toggleTheme }) => {
  return (
    <>
      {/* SIDEBAR ESCRITORIO */}
      <Box as="nav" display={{ base: "none", md: "block" }} w="260px" pos="fixed" top={0} left={0} h="100vh" bg="transparent" p={4} boxShadow="none">
        <Box bg="superficie.sidebar" borderRadius="xl" h="calc(100vh - 32px)" p={6} boxShadow="xl" display="flex" flexDirection="column" border="1px solid" borderColor="superficie.borde">
          <SidebarContent isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
        </Box>
      </Box>
      {/* SIDEBAR MÓVIL */}
      <Box display={{ base: isOpen ? "block" : "none", md: "none" }} pos="fixed" inset={0} bg="blackAlpha.600" zIndex="overlay" onClick={onClose}/>
      <Box display={{ base: "block", md: "none" }} pos="fixed" top={0} left={0} h="100vh" w="280px" bg="superficie.sidebar" p={6} zIndex="modal" transition="transform 0.3s" transform={isOpen ? "translateX(0)" : "translateX(-100%)"}>
        <SidebarContent isDarkMode={isDarkMode} toggleTheme={toggleTheme} onClose={onClose} />
      </Box>
    </>
  );
};

export default Sidebar;