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
      alert('Por favor, ingresa un responsable antes de guardar.');
      return;
    }

    // Validar que al menos un equipo tenga estado diferente a pendiente
    const tieneRevisiones = Object.values(revision).some(
      (r) => r.estado !== 'pendiente'
    );

    if (!tieneRevisiones) {
      alert('Por favor, marca al menos un equipo antes de guardar.');
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
        <Header responsable={responsable} onCambiarResponsable={onCambiarResponsable} />
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
        <Header responsable={responsable} onCambiarResponsable={onCambiarResponsable} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-danger-50 border border-danger-200 rounded-lg p-4">
            <p className="text-danger-800">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  const equiposConNO = equipos.filter(
    (e) => revision[e.id]?.estado === 'no'
  ).length;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header responsable={responsable} onCambiarResponsable={onCambiarResponsable} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Información del vehículo */}
        <div className="mb-6">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <button
              onClick={() => navigate('/')}
              className="text-primary-600 hover:text-primary-700 flex items-center"
            >
              ← Volver al dashboard
            </button>
            <Link
              to={`/vehiculo/${id}/items`}
              className="text-gray-600 hover:text-gray-800 text-sm"
            >
              Configurar ítems de este vehículo
            </Link>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">
            {vehiculo?.codigo} - {vehiculo?.nombre || 'Sin nombre'}
          </h2>
          {equiposConNO > 0 && (
            <div className="mt-4 bg-danger-50 border border-danger-200 rounded-lg p-4">
              <p className="text-danger-800 font-semibold">
                ⚠️ Atención: {equiposConNO} equipo(s) marcado(s) como NO
              </p>
            </div>
          )}
        </div>

        {/* Tabla de inventario */}
        <div className="card overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Compartimento
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Equipo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cant. Esperada
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
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
                      className={estadoActual === 'no' ? 'bg-danger-50' : ''}
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
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center justify-center space-x-4">
                          <label className="flex items-center cursor-pointer">
                            <input
                              type="radio"
                              name={`estado_${equipo.id}`}
                              value="si"
                              checked={estadoActual === 'si'}
                              onChange={() => handleEstadoChange(equipo.id, 'si')}
                              className="w-5 h-5 text-success-600 focus:ring-success-500"
                            />
                            <span className="ml-2 text-sm font-medium text-success-700">SI</span>
                          </label>
                          <label className="flex items-center cursor-pointer">
                            <input
                              type="radio"
                              name={`estado_${equipo.id}`}
                              value="no"
                              checked={estadoActual === 'no'}
                              onChange={() => handleEstadoChange(equipo.id, 'no')}
                              className="w-5 h-5 text-danger-600 focus:ring-danger-500"
                            />
                            <span className="ml-2 text-sm font-medium text-danger-700">NO</span>
                          </label>
                          <label className="flex items-center cursor-pointer">
                            <input
                              type="radio"
                              name={`estado_${equipo.id}`}
                              value="pendiente"
                              checked={estadoActual === 'pendiente'}
                              onChange={() => handleEstadoChange(equipo.id, 'pendiente')}
                              className="w-5 h-5 text-gray-400 focus:ring-gray-500"
                            />
                            <span className="ml-2 text-sm font-medium text-gray-600">Pendiente</span>
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
                          rows="2"
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
        <div className="mt-6 flex justify-end">
          <button
            onClick={handleGuardar}
            disabled={saving || !responsable}
            className={`btn-success text-lg px-8 py-3 ${
              saving || !responsable ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {saving ? 'Guardando...' : 'Guardar Revisión'}
          </button>
        </div>

        {error && (
          <div className="mt-4 bg-danger-50 border border-danger-200 rounded-lg p-4">
            <p className="text-danger-800">{error}</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default RevisionView;
