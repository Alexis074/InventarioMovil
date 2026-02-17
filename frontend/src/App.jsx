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
  const [responsable, setResponsable] = useState(getResponsableDefault());

  function getResponsableDefault() {
    // 0: Domingo, 1: Lunes, 2: Martes, 3: Miércoles, 4: Jueves, 5: Viernes, 6: Sábado
    const dia = new Date().getDay();
    switch (dia) {
      case 1: /** Lunes */ return "Grupo 4";
      case 2: /** Martes */ return "Grupo 1";
      case 3: /** Miércoles */ return "Grupo 2";
      case 4: /** Jueves */ return "Grupo 3";
      case 5: /** Viernes */ return "Grupo 5";
      default: return "Personal Rentado";
    }
  }

  // Si el usuario cambia el responsable manualmente, lo actualizamos.
  // Pero la inicialización SIEMPRE respeta el día, a menos que queramos persistencia (el prompt dice "segun el dia ya debe estar preseleccoionada").
  // Por lo tanto, no uso localStorage para persistir entre recargas si el requerimiento es estricto con el día.

  const handleCambiarResponsable = (nuevoResponsable) => {
    setResponsable(nuevoResponsable);
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <Dashboard
              responsable={responsable}
              onCambiarResponsable={handleCambiarResponsable}
            />
          }
        />
        <Route
          path="/vehiculo/:id"
          element={
            <RevisionView
              responsable={responsable}
              onCambiarResponsable={handleCambiarResponsable}
            />
          }
        />
        <Route
          path="/vehiculo/:id/items"
          element={
            <GestionarInventario
              responsable={responsable}
              onCambiarResponsable={handleCambiarResponsable}
            />
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
