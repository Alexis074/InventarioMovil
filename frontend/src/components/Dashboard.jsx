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

      // Cargar vehículos y estados en paralelo - IMPORTANTE: manejar errores de manera que si uno falla, no se rompa todo si es posible.
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

  const verificarInventarioCompleto = () => {
    if (!vehiculos.length) return false;
    const hoy = new Date().toISOString().split('T')[0];

    return vehiculos.every(vehiculo => {
      const estadoInfo = estados[vehiculo.id];
      if (!estadoInfo) return false;

      const fechaRevision = estadoInfo.ultima_revision_fecha ? estadoInfo.ultima_revision_fecha.split('T')[0] : null;
      const esHoy = fechaRevision === hoy;
      const revisado = estadoInfo.estado !== 'pendiente';
      const mismoResponsable = estadoInfo.ultima_revision_responsable === responsable;

      return esHoy && revisado && mismoResponsable;
    });
  };

  const handleGuardarInventario = () => {
    if (verificarInventarioCompleto()) {
      alert(`¡Inventario completado exitosamente!\n\nResponsable: ${responsable}\nFecha: ${new Date().toLocaleDateString()}`);
    } else {
      alert("Aún faltan vehículos por revisar hoy con este responsable.");
    }
  };

  const inventarioCompleto = verificarInventarioCompleto();

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header responsable={responsable} />
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
        <Header responsable={responsable} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 max-w-xl">
            <p className="text-red-800 font-medium">{msg}</p>
            {detail && <p className="text-red-700 text-sm mt-2">{detail}</p>}
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
      <Header responsable={responsable} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Panel de Responsable */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-8 border border-gray-200">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="flex-1">
              <label htmlFor="responsableSelect" className="block text-sm font-medium text-gray-700 mb-1">
                Seleccionar Responsable del Inventario:
              </label>
              <select
                id="responsableSelect"
                value={responsable}
                onChange={(e) => onCambiarResponsable(e.target.value)}
                className="block w-full md:w-64 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md shadow-sm"
              >
                <option value="Personal Rentado">Personal Rentado</option>
                <option value="Grupo 1">Grupo 1 (Martes)</option>
                <option value="Grupo 2">Grupo 2 (Miércoles)</option>
                <option value="Grupo 3">Grupo 3 (Jueves)</option>
                <option value="Grupo 4">Grupo 4 (Lunes)</option>
                <option value="Grupo 5">Grupo 5 (Viernes)</option>
              </select>
            </div>

            <div>
              <button
                onClick={handleGuardarInventario}
                disabled={!inventarioCompleto}
                className={`w-full md:w-auto px-6 py-3 rounded-md font-bold text-white shadow-md transition-all duration-200 flex items-center justify-center gap-2
                            ${inventarioCompleto
                    ? 'bg-green-600 hover:bg-green-700 cursor-pointer transform hover:scale-105'
                    : 'bg-gray-400 cursor-not-allowed opacity-70'
                  }`}
              >
                {inventarioCompleto ? (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    GUARDAR INVENTARIO REALIZADO
                  </>
                ) : (
                  'Completar todas las revisiones para guardar'
                )}
              </button>
            </div>
          </div>
          {!inventarioCompleto && vehiculos.length > 0 && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-800 flex items-start gap-2">
              <svg className="w-5 h-5 text-yellow-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>
                Para finalizar el inventario del día, debes completar la revisión de <strong>todos</strong> los vehículos disponibles marcando el estado de cada ítem.
              </span>
            </div>
          )}
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Vehículos Disponibles
          </h2>
          <p className="text-gray-600">
            Realiza la revisión vehículo por vehículo.
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
