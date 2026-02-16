/**
 * Componente Header - Barra superior de la aplicación.
 */
import React from 'react';

const Header = ({ responsable, onCambiarResponsable }) => {
  return (
    <header className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Inventario CBVSIM</h1>
            {responsable && (
              <p className="text-sm text-gray-600 mt-1">
                Responsable: <span className="font-semibold">{responsable}</span>
              </p>
            )}
          </div>
          {responsable && (
            <button
              onClick={onCambiarResponsable}
              className="btn-secondary text-sm"
            >
              Cambiar Responsable
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
