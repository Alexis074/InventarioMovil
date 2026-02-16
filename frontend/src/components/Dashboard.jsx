/**
 * Componente Dashboard - Pantalla principal con grid de vehículos.
 */
import React, { useState, useEffect } from 'react';
import { vehiculosService } from '../api/vehiculos';
import VehicleCard from './VehicleCard';
import Header from './Header';

const Dashboard = ({ responsable, onCambiarResponsable }) => {
  const [vehiculos, setVehiculos] = useState([]);
  const [estados, setEstados] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    cargarDatos();
  }, [responsable]);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      setError(null);

      // Cargar vehículos y estados en paralelo
      const [vehiculosRes, estadosRes] = await Promise.all([
        vehiculosService.getAll(),
        responsable
          ? vehiculosService.getEstados(responsable)
          : vehiculosService.getEstados(),
      ]);

      setVehiculos(vehiculosRes.data.results || vehiculosRes.data);
      
      // Crear mapa de estados por vehículo_id
      const estadosMap = {};
      (estadosRes.data || []).forEach((estado) => {
        estadosMap[estado.vehiculo_id] = estado;
      });
      setEstados(estadosMap);
    } catch (err) {
      console.error('Error cargando datos:', err);
      const isNetworkError = !err.response;
      setError({
        message: 'Error al cargar los vehículos. Verifica que el servidor esté corriendo.',
        detail: isNetworkError
          ? 'No se pudo conectar al backend. Inicia Django con: python manage.py runserver 0.0.0.0:8000'
          : err.response?.status === 403
            ? 'Acceso denegado. Inicia sesión si es necesario.'
            : `Error del servidor: ${err.response?.status || ''}`,
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header responsable={responsable} onCambiarResponsable={onCambiarResponsable} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Cargando vehículos...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    const msg = typeof error === 'string' ? error : error.message;
    const detail = typeof error === 'object' && error.detail;
    return (
      <div className="min-h-screen">
        <Header responsable={responsable} onCambiarResponsable={onCambiarResponsable} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 max-w-xl">
            <p className="text-red-800 font-medium">{msg}</p>
            {detail && <p className="text-red-700 text-sm mt-2">{detail}</p>}
            <p className="text-gray-600 text-sm mt-2">
              Backend esperado: <code className="bg-gray-100 px-1">http://localhost:8000/api</code>
            </p>
            <button
              type="button"
              onClick={() => { setError(null); cargarDatos(); }}
              className="mt-3 px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700"
            >
              Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header responsable={responsable} onCambiarResponsable={onCambiarResponsable} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Vehículos Disponibles
          </h2>
          <p className="text-gray-600">
            Selecciona un vehículo para realizar su revisión de inventario.
          </p>
        </div>

        {vehiculos.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">No hay vehículos disponibles.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vehiculos.map((vehiculo) => {
              const estadoInfo = estados[vehiculo.id];
              return (
                <VehicleCard
                  key={vehiculo.id}
                  vehiculo={vehiculo}
                  estado={estadoInfo?.estado || 'pendiente'}
                  estadoData={estadoInfo}
                />
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
