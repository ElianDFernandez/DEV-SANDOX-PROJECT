import { useState, useEffect } from "react";
import { Box } from "@chakra-ui/react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const MainLayout = ({ children }) => {

  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const stored = sessionStorage.getItem("dark_mode");
    if (stored !== null) {
      return stored === "true";
    }
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    sessionStorage.setItem("dark_mode", isDarkMode);
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  return (
    <Box minH="100vh" overflowX="hidden" bg="superficie.fondo">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
      <Box ml={{ base: 0, md: "260px" }} w={{ base: "100%", md: "calc(100% - 260px)" }} transition="margin 0.3s ease-in-out">
        <Box position="sticky" top="0" zIndex="sticky" bg="transparent" pt={{ base: 4, md: 4 }} px={{ base: 4, md: 4 }} pb={2}>
          <Navbar onOpen={() => setSidebarOpen(true)} />
        </Box>
        <Box as="main" px={{ base: 4, md: 4 }} pb={{ base: 4, md: 4 }}>
          {children}
        </Box>
        
      </Box>
    </Box>
  );
};

export default MainLayout;