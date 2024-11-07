import { Routes, Route, BrowserRouter, Navigate } from "react-router-dom";
import PrivateRoute from "./privateRoute";
import MainContent from "./components/home/MainContent";
import Login from "./components/Login";
import Usuario from "./components/usuarios/Usuario";
import Turno from "./components/turno/Turno";
import Dashboard from "./components/home/Dashboard";
import NotFound from "./components/templates/NotFound";
import Maquinas from "./components/maquina/Maquinas";
import TipoProducto from "./components/tipoProducto/TipoProducto";
import Categoria from "./components/categoria/Categoria";
import Producto from "./components/producto/Producto";
import MateriaPrima from "./components/materiaPrima/MateriaPrima";
import Prediccion from "./components/prediccion/Prediccion";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <BrowserRouter>
      <Toaster />
      <Routes>
        {/* Rutas públicas */}

        <Route path="/dev/" element={<Navigate to="/dev/login" />} />
        <Route path="/dev/login" element={<Login />} />

        {/* Rutas privadas */}
        <Route
          path="/dev/"
          element={
            <PrivateRoute>
              <MainContent />
            </PrivateRoute>
          }
        >
          {/* Ruta anidada protegida */}
          <Route path="/dev/dashboard" element={<Dashboard />} />

          <Route
            path="/dev/usuarios"
            element={
              <PrivateRoute requiredUserGroup="true">
                <Usuario />
              </PrivateRoute>
            }
          />
          <Route path="/dev/turno" element={
            <PrivateRoute opgroup="true">
              <Turno />
            </PrivateRoute>}
          />
          <Route path="/dev/maquinas" element={
            <PrivateRoute opgroup="true">
              <Maquinas />
            </PrivateRoute>}
          />
          <Route path="/dev/tipoProducto" element={
            <PrivateRoute opgroup="true">
              <TipoProducto />
            </PrivateRoute>}
          />
          <Route path="/dev/categoria" element={
            <PrivateRoute opgroup="true">
              <Categoria />
            </PrivateRoute>}
          />
          <Route path="/dev/producto" element={
            <PrivateRoute opgroup="true">
              <Producto />
            </PrivateRoute>}
          />
          <Route path="/dev/materiaprima" element={
            <PrivateRoute opgroup="true">
              <MateriaPrima />
            </PrivateRoute>}
          />
          <Route path="/dev/prediccion" element={
            <PrivateRoute opgroup="true">
              <Prediccion />
            </PrivateRoute>}
          />
          {/* Agrega la ruta comodín para páginas no encontradas */}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;