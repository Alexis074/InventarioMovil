/**
 * Componente RevisionView - Vista para realizar una revisión de inventario.
 */
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { vehiculosService } from '../api/vehiculos';
import { revisionesService } from '../api/revisiones';
import Header from './Header';

const RevisionView = ({ responsable, onCambiarResponsable }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [vehiculo, setVehiculo] = useState(null);
  const [equipos, setEquipos] = useState([]);
  const [revision, setRevision] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      cargarDatos();
    }
  }, [id]);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const response = await vehiculosService.getById(id);
      const vehiculoData = response.data;
      setVehiculo(vehiculoData);

      // Extraer todos los equipos de los compartimentos
      const equiposList = [];
      (vehiculoData.compartimentos || []).forEach((compartimento) => {
        (compartimento.equipos || []).forEach((equipo) => {
          equiposList.push({
            ...equipo,
            compartimento_nombre: compartimento.nombre,
          });
        });
      });
      setEquipos(equiposList);

      // Inicializar estado de revisión (todos pendientes)
      const revisionInicial = {};
      equiposList.forEach((equipo) => {
        revisionInicial[equipo.id] = {
          estado: 'pendiente',
          observaciones: '',
        };
      });
      setRevision(revisionInicial);
    } catch (err) {
      console.error('Error cargando datos:', err);
      setError('Error al cargar los datos del vehículo.');
    } finally {
      setLoading(false);
    }
  };

  const handleEstadoChange = (equipoId, estado) => {
    setRevision((prev) => ({
      ...prev,
      [equipoId]: {
        ...prev[equipoId],
        estado,
      },
    }));
  };

  const handleObservacionesChange = (equipoId, observaciones) => {
    setRevision((prev) => ({
      ...prev,
      [equipoId]: {
        ...prev[equipoId],
        observaciones,
      },
    }));
  };

  const handleGuardar = async () => {
    if (!responsable) {
      alert('Por favor, selecciona un responsable en el Dashboard antes de continuar.');
      return;
    }

    // Validar que TODOS los ítems estén marcados (no pendientes)
    // El usuario especificó: "no debe dejar guardar la revision hasta que no se marquen todos los item"
    const itemsPendientes = Object.values(revision).filter(r => r.estado === 'pendiente').length;

    if (itemsPendientes > 0) {
      alert(`Faltan marcar ${itemsPendientes} ítem(s). Debes seleccionar SI o NO para todos los equipos.`);
      return;
    }

    try {
      setSaving(true);
      setError(null);

      // Preparar datos para enviar
      const detalles = equipos.map((equipo) => ({
        equipo: equipo.id,
        estado: revision[equipo.id]?.estado || 'pendiente',
        observaciones: revision[equipo.id]?.observaciones || '',
      }));

      const revisionData = {
        vehiculo: parseInt(id),
        responsable,
        observaciones_generales: '',
        detalles,
      };

      await revisionesService.create(revisionData);

      // Redirigir al dashboard con mensaje de éxito
      navigate('/', { state: { mensaje: 'Revisión guardada exitosamente.' } });
    } catch (err) {
      console.error('Error guardando revisión:', err);
      setError('Error al guardar la revisión. Intenta nuevamente.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header responsable={responsable} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Cargando datos...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error && !vehiculo) {
    return (
      <div className="min-h-screen">
        <Header responsable={responsable} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  const equiposConNO = equipos.filter(
    (e) => revision[e.id]?.estado === 'no'
  ).length;

  // Calculamos si hay pendientes para deshabilitar visualmente si se desea (opcional, pero buena UX)
  const hayPendientes = Object.values(revision).some(r => r.estado === 'pendiente');

  return (
    <div className="min-h-screen bg-gray-50">
      <Header responsable={responsable} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Información del vehículo */}
        <div className="mb-6">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <button
              onClick={() => navigate('/')}
              className="text-primary-600 hover:text-primary-700 flex items-center shadow-sm px-3 py-1 bg-white rounded border border-gray-200"
            >
              ← Volver al dashboard
            </button>
            <Link
              to={`/vehiculo/${id}/items`}
              className="text-gray-600 hover:text-gray-800 text-sm underline"
            >
              Configurar ítems de este vehículo
            </Link>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 border-b pb-2">
            Verificando: {vehiculo?.codigo} - {vehiculo?.nombre || 'Sin nombre'}
          </h2>
          {equiposConNO > 0 && (
            <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4 animate-pulse">
              <p className="text-red-800 font-semibold">
                ⚠️ Atención: {equiposConNO} equipo(s) marcado(s) como NO
              </p>
            </div>
          )}
        </div>

        {/* Tabla de inventario */}
        <div className="card overflow-x-auto shadow-lg rounded-lg bg-white border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                  Compartimento
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                  Equipo
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                  Cant.
                </th>
                <th className="px-6 py-3 text-center text-xs font-bold text-gray-600 uppercase tracking-wider bg-yellow-50">
                  ESTADO (Obligatorio)
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                  Observaciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {equipos.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                    No hay equipos configurados para este vehículo.
                  </td>
                </tr>
              ) : (
                equipos.map((equipo) => {
                  const estadoActual = revision[equipo.id]?.estado || 'pendiente';
                  return (
                    <tr
                      key={equipo.id}
                      className={`hover:bg-gray-50 transition-colors ${estadoActual === 'no' ? 'bg-red-50 hover:bg-red-100' : ''}`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {equipo.compartimento_nombre}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {equipo.nombre}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                        {equipo.cantidad_esperada}
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap border-l border-r border-gray-100 ${estadoActual === 'pendiente' ? 'bg-yellow-50' : ''}`}>
                        <div className="flex items-center justify-center space-x-4">
                          <label className={`flex items-center cursor-pointer p-1 rounded hover:bg-green-100 ${estadoActual === 'si' ? 'bg-green-100 ring-2 ring-green-500' : ''}`}>
                            <input
                              type="radio"
                              name={`estado_${equipo.id}`}
                              value="si"
                              checked={estadoActual === 'si'}
                              onChange={() => handleEstadoChange(equipo.id, 'si')}
                              className="w-5 h-5 text-green-600 focus:ring-green-500"
                            />
                            <span className="ml-2 text-sm font-bold text-green-700">SI</span>
                          </label>
                          <label className={`flex items-center cursor-pointer p-1 rounded hover:bg-red-100 ${estadoActual === 'no' ? 'bg-red-100 ring-2 ring-red-500' : ''}`}>
                            <input
                              type="radio"
                              name={`estado_${equipo.id}`}
                              value="no"
                              checked={estadoActual === 'no'}
                              onChange={() => handleEstadoChange(equipo.id, 'no')}
                              className="w-5 h-5 text-red-600 focus:ring-red-500"
                            />
                            <span className="ml-2 text-sm font-bold text-red-700">NO</span>
                          </label>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <textarea
                          value={revision[equipo.id]?.observaciones || ''}
                          onChange={(e) =>
                            handleObservacionesChange(equipo.id, e.target.value)
                          }
                          placeholder="Observaciones..."
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-primary-500 focus:border-primary-500"
                          rows="1"
                        />
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Botón guardar */}
        <div className="mt-8 flex justify-end sticky bottom-4">
          <div className="bg-white p-4 shadow-xl rounded-lg border border-gray-200 flex items-center gap-4">
            {hayPendientes && (
              <span className="text-yellow-700 font-medium text-sm">
                Faltan marcar opciones
              </span>
            )}
            <button
              onClick={handleGuardar}
              disabled={saving || !responsable || hayPendientes}
              className={`btn-success text-lg px-8 py-3 rounded-lg font-bold shadow-md transition-all
                ${saving || !responsable || hayPendientes
                  ? 'bg-gray-400 cursor-not-allowed opacity-70'
                  : 'bg-green-600 hover:bg-green-700 hover:scale-105'
                }`}
            >
              {saving ? 'Guardando...' : 'GUARDAR REVISIÓN DEL VEHÍCULO'}
            </button>
          </div>
        </div>

        {error && (
          <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">{error}</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default RevisionView;
