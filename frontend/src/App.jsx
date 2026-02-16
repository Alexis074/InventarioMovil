/**
 * Componente principal de la aplicación.
 */
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import RevisionView from './components/RevisionView';
import GestionarInventario from './components/GestionarInventario';
import LoginForm from './components/LoginForm';

function App() {
  const [responsable, setResponsable] = useState(() => {
    // Cargar responsable desde localStorage al iniciar
    return localStorage.getItem('inventario_responsable') || '';
  });

  useEffect(() => {
    // Guardar responsable en localStorage cuando cambie
    if (responsable) {
      localStorage.setItem('inventario_responsable', responsable);
    } else {
      localStorage.removeItem('inventario_responsable');
    }
  }, [responsable]);

  const handleLogin = (nombre) => {
    setResponsable(nombre);
  };

  const handleCambiarResponsable = () => {
    setResponsable('');
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={
            responsable ? (
              <Navigate to="/" replace />
            ) : (
              <LoginForm onLogin={handleLogin} />
            )
          }
        />
        <Route
          path="/"
          element={
            responsable ? (
              <Dashboard
                responsable={responsable}
                onCambiarResponsable={handleCambiarResponsable}
              />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/vehiculo/:id"
          element={
            responsable ? (
              <RevisionView
                responsable={responsable}
                onCambiarResponsable={handleCambiarResponsable}
              />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/vehiculo/:id/items"
          element={
            responsable ? (
              <GestionarInventario
                responsable={responsable}
                onCambiarResponsable={handleCambiarResponsable}
              />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
