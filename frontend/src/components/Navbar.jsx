import { useState } from "react";
import { Flex, Box, Button, Text, HStack, IconButton } from "@chakra-ui/react";
import { MenuRoot, MenuTrigger, MenuContent, MenuItem } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { Bell, Menu as MenuIcon } from "lucide-react";
import { logout } from "../api/auth";

const Navbar = ({ onOpen }) => {
  const navigate = useNavigate();
  const userName = localStorage.getItem("user_name") || "Usuario";
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try { await logout(); } 
    catch (error) { console.error(error); } 
    finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user_name");
      window.location.href = "/login";
    }
  };

  return (
    <Flex as="header" w="full" mb={4} justify={{ base: "space-between", md: "flex-end" }} align="center" pointerEvents={isLoggingOut ? "none" : "auto"} opacity={isLoggingOut ? 0.7 : 1} transition="opacity 0.2s">
      <Box display={{ base: "block", md: "none" }} bg="superficie.tarjeta" borderRadius="xl" p={1} boxShadow="sm">
        <IconButton variant="ghost" onClick={onOpen} aria-label="Abrir menú" color="texto.principal" _hover={{ bg: "transparent", color: "marca.500" }} _active={{ bg: "transparent" }}>
          <MenuIcon size={24} />
        </IconButton>
      </Box>
      <HStack gap={3}>
        {/* BOTÓN DE NOTIFICACIONES (A Implementar) */}
        <Box bg="superficie.tarjeta" borderRadius="xl" p={1} boxShadow="md" border="1px solid" borderColor="superficie.borde" display="flex" alignItems="center" justifyContent="center">
          <IconButton variant="ghost" h="40px" w="40px" aria-label="Notificaciones" color="texto.principal" _hover={{ bg: "transparent", color: "marca.500" }} _active={{ bg: "transparent" }} position="relative" onClick={() => console.log("Notificaciones clickeadas")} >
            <Bell size={22} />
            <Box position="absolute" top="8px" right="8px" w="8px" h="8px" bg="red.500" borderRadius="full" border="2px solid" borderColor="superficie.tarjeta"/>
          </IconButton>
        </Box>
        {/* MENÚ DE USUARIO */}
        <Box position="relative" bg="superficie.tarjeta" borderRadius="xl" p={1} boxShadow="md" border="1px solid" borderColor="superficie.borde" display="flex" alignItems="center" justifyContent="center">
          <MenuRoot>
            <MenuTrigger asChild>
              <Button variant="ghost" h="40px" px={2} py={0} color="texto.principal" disabled={isLoggingOut} _hover={{ bg: "transparent", color: "marca.500" }} _focus={{ outline: "none", boxShadow: "none", bg: "transparent" }} _active={{ bg: "transparent" }} _expanded={{ bg: "transparent", color: "marca.500" }}>
                <HStack gap={2}>
                  <Box borderRadius="xl" bg="marca.500" minW="32px" h="32px" display="flex" alignItems="center" justifyContent="center" color="texto.inverso"fontSize="sm"fontWeight="bold">
                    {userName.charAt(0).toUpperCase()}
                  </Box>
                  <Text fontSize="sm" fontWeight="bold" truncate transition="color 0.2s">
                    {isLoggingOut ? "Saliendo..." : userName}
                  </Text>
                </HStack>
              </Button>
            </MenuTrigger>
            <MenuContent position="absolute" top="100%" right="0" mt={2} bg="superficie.tarjeta" borderColor="superficie.borde" borderRadius="xl" boxShadow="md" p={2} minW="200px" zIndex="popover">
              <MenuItem value="perfil" cursor="pointer" borderRadius="md" px={3} py={2} disabled={isLoggingOut} _hover={{ bg: "transparent", color: "marca.500" }} _focus={{ outline: "none", bg: "transparent", color: "marca.500" }} _active={{ bg: "transparent" }} onClick={() => navigate("/perfil")}>
                Mi Perfil
              </MenuItem>
              <MenuItem value="logout" cursor="pointer" borderRadius="md" px={3} py={2} color="red.600" disabled={isLoggingOut} _hover={{ bg: "transparent", color: "texto.error" }} _focus={{ outline: "none", bg: "transparent", color: "red.700" }} _active={{ bg: "transparent" }} onClick={handleLogout}>
                {isLoggingOut ? "Cerrando sesión..." : "Cerrar Sesión"}
              </MenuItem>
            </MenuContent>
          </MenuRoot>
        </Box>
      </HStack>
    </Flex>
  );
};

export default Navbar;