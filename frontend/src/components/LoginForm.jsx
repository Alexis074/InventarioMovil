/**
 * Componente LoginForm - Formulario para ingresar el responsable.
 */
import React, { useState } from 'react';

const LoginForm = ({ onLogin }) => {
  const [responsable, setResponsable] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (responsable.trim()) {
      onLogin(responsable.trim());
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100">
      <div className="card max-w-md w-full mx-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Inventario CBVSIM
          </h1>
          <p className="text-gray-600">
            Sistema de Control de Inventario de Vehículos
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="responsable"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Responsable del Inventario
            </label>
            <input
              id="responsable"
              type="text"
              value={responsable}
              onChange={(e) => setResponsable(e.target.value)}
              placeholder="Ingrese su nombre o grupo"
              className="input-field"
              required
              autoFocus
            />
            <p className="mt-2 text-sm text-gray-500">
              Ingrese el nombre de la persona o grupo responsable de realizar el inventario.
            </p>
          </div>

          <button
            type="submit"
            className="btn-primary w-full text-lg py-3"
          >
            Ingresar
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
