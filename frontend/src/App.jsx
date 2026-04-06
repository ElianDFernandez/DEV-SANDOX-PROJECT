import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";
import { system } from "./theme"
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import PerfilPage from "./pages/PerfilPage";
import CategoriasPage from "./pages/CategoriasPage";
import ArticulosPage from "./pages/ArticulosPage";

function App() {
  const token = localStorage.getItem("token");
  const isAuthenticated = !!token;

  return (
    <ChakraProvider value={system}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />     
          <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />
          <Route path="/perfil" element={isAuthenticated ? <PerfilPage /> : <Navigate to="/login" />} />
          <Route path="/categorias" element={isAuthenticated ? <CategoriasPage /> : <Navigate to="/login" />} />
          <Route path="/articulos" element={isAuthenticated ? <ArticulosPage /> : <Navigate to="/login" />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </BrowserRouter>
    </ChakraProvider>
  )
}

export default App;