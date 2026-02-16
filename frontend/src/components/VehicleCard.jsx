/**
 * Componente VehicleCard - Tarjeta que representa un vehículo en el dashboard.
 */
import React from 'react';
import { useNavigate, Link } from 'react-router-dom';

const VehicleCard = ({ vehiculo, estado, estadoData }) => {
  const navigate = useNavigate();

  // Si estadoData existe, usar sus propiedades; si no, estado es un string
  const estadoStr = estadoData?.estado || estado || 'pendiente';
  const estadoInfo = estadoData || { estado: estadoStr };

  // Colores según el estado
  const estadoColors = {
    pendiente: 'bg-gray-100 border-gray-300',
    completo: 'bg-success-50 border-success-300',
    critico: 'bg-danger-50 border-danger-300',
  };

  const estadoLabels = {
    pendiente: 'Pendiente',
    completo: 'Completo',
    critico: 'Crítico',
  };

  const estadoIcons = {
    pendiente: '⏳',
    completo: '✅',
    critico: '⚠️',
  };

  const handleClick = () => {
    navigate(`/vehiculo/${vehiculo.id}`);
  };

  return (
    <div
      onClick={handleClick}
      className={`card cursor-pointer border-2 transition-all duration-200 hover:scale-105 ${estadoColors[estadoStr] || estadoColors.pendiente}`}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900">{vehiculo.codigo}</h3>
          {vehiculo.nombre && (
            <p className="text-sm text-gray-600 mt-1">{vehiculo.nombre}</p>
          )}
        </div>
        <span className="text-2xl">{estadoIcons[estadoStr] || estadoIcons.pendiente}</span>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">Estado:</span>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
            estadoStr === 'completo' ? 'bg-success-200 text-success-800' :
            estadoStr === 'critico' ? 'bg-danger-200 text-danger-800' :
            'bg-gray-200 text-gray-800'
          }`}>
            {estadoLabels[estadoStr] || estadoLabels.pendiente}
          </span>
        </div>

        {estadoStr && estadoStr !== 'pendiente' && estadoInfo && (
          <div className="pt-2 border-t border-gray-200">
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-gray-600">Equipos:</span>
                <span className="font-semibold ml-1">{estadoInfo.total_equipos || 0}</span>
              </div>
              <div>
                <span className="text-gray-600">SI:</span>
                <span className="font-semibold text-success-600 ml-1">
                  {estadoInfo.equipos_si || 0}
                </span>
              </div>
              {estadoInfo.equipos_no > 0 && (
                <div className="col-span-2">
                  <span className="text-gray-600">NO:</span>
                  <span className="font-semibold text-danger-600 ml-1">
                    {estadoInfo.equipos_no || 0}
                  </span>
                </div>
              )}
            </div>
            {estadoInfo.ultima_revision_fecha && (
              <p className="text-xs text-gray-500 mt-2">
                Última revisión: {new Date(estadoInfo.ultima_revision_fecha).toLocaleDateString('es-ES')}
              </p>
            )}
          </div>
        )}
      </div>
      <div className="mt-3 pt-3 border-t border-gray-200 flex gap-2">
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); navigate(`/vehiculo/${vehiculo.id}`); }}
          className="flex-1 py-2 px-3 text-sm font-medium bg-primary-600 text-white rounded-md hover:bg-primary-700"
        >
          Hacer revisión
        </button>
        <Link
          to={`/vehiculo/${vehiculo.id}/items`}
          onClick={(e) => e.stopPropagation()}
          className="py-2 px-3 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 text-center"
        >
          Configurar ítems
        </Link>
      </div>
    </div>
  );
};

export default VehicleCard;
