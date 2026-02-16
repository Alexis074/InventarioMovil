/**
 * GestionarInventario - Configurar compartimentos y equipos de un vehículo.
 * Los datos se envían al backend (Django admin/API).
 */
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { vehiculosService } from '../api/vehiculos';
import { compartimentosService } from '../api/compartimentos';
import { equiposService } from '../api/equipos';
import Header from './Header';

const GestionarInventario = ({ responsable, onCambiarResponsable }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [vehiculo, setVehiculo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  // Formulario nuevo compartimento
  const [nuevoCompartimento, setNuevoCompartimento] = useState({ nombre: '', orden: 0 });
  // Formulario nuevo equipo
  const [nuevoEquipo, setNuevoEquipo] = useState({
    compartimento: '',
    nombre: '',
    cantidad_esperada: 1,
    orden: 0,
  });

  const cargarDatos = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await vehiculosService.getById(id);
      setVehiculo(response.data);
    } catch (err) {
      console.error('Error cargando vehículo:', err);
      setError('Error al cargar el vehículo. Verifica que el servidor esté corriendo.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) cargarDatos();
  }, [id]);

  const handleCrearCompartimento = async (e) => {
    e.preventDefault();
    if (!nuevoCompartimento.nombre.trim()) return;
    try {
      setSaving(true);
      await compartimentosService.create({
        vehiculo: parseInt(id, 10),
        nombre: nuevoCompartimento.nombre.trim(),
        orden: parseInt(nuevoCompartimento.orden, 10) || 0,
        activo: true,
      });
      setNuevoCompartimento({ nombre: '', orden: vehiculo?.compartimentos?.length ?? 0 });
      await cargarDatos();
    } catch (err) {
      console.error('Error creando compartimento:', err);
      setError(err.response?.data ? JSON.stringify(err.response.data) : 'Error al crear compartimento.');
    } finally {
      setSaving(false);
    }
  };

  const handleCrearEquipo = async (e) => {
    e.preventDefault();
    if (!nuevoEquipo.nombre.trim() || !nuevoEquipo.compartimento) return;
    try {
      setSaving(true);
      await equiposService.create({
        compartimento: parseInt(nuevoEquipo.compartimento, 10),
        nombre: nuevoEquipo.nombre.trim(),
        cantidad_esperada: parseInt(nuevoEquipo.cantidad_esperada, 10) || 1,
        orden: parseInt(nuevoEquipo.orden, 10) || 0,
        activo: true,
      });
      setNuevoEquipo({ compartimento: '', nombre: '', cantidad_esperada: 1, orden: 0 });
      await cargarDatos();
    } catch (err) {
      console.error('Error creando equipo:', err);
      setError(err.response?.data ? JSON.stringify(err.response.data) : 'Error al crear equipo.');
    } finally {
      setSaving(false);
    }
  };

  const handleEliminarCompartimento = async (compartimentoId) => {
    if (!window.confirm('¿Eliminar este compartimento y todos sus equipos?')) return;
    try {
      setSaving(true);
      await compartimentosService.delete(compartimentoId);
      await cargarDatos();
    } catch (err) {
      console.error('Error eliminando compartimento:', err);
      setError('Error al eliminar compartimento.');
    } finally {
      setSaving(false);
    }
  };

  const handleEliminarEquipo = async (equipoId) => {
    if (!window.confirm('¿Eliminar este equipo?')) return;
    try {
      setSaving(true);
      await equiposService.delete(equipoId);
      await cargarDatos();
    } catch (err) {
      console.error('Error eliminando equipo:', err);
      setError('Error al eliminar equipo.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header responsable={responsable} onCambiarResponsable={onCambiarResponsable} />
        <div className="max-w-7xl mx-auto px-4 py-8 flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" />
        </div>
      </div>
    );
  }

  if (error && !vehiculo) {
    return (
      <div className="min-h-screen">
        <Header responsable={responsable} onCambiarResponsable={onCambiarResponsable} />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">{error}</p>
            <button
              type="button"
              onClick={() => navigate('/')}
              className="mt-3 text-primary-600 hover:underline"
            >
              ← Volver al dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  const compartimentos = vehiculo?.compartimentos || [];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header responsable={responsable} onCambiarResponsable={onCambiarResponsable} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          type="button"
          onClick={() => navigate('/')}
          className="text-primary-600 hover:text-primary-700 mb-4 flex items-center"
        >
          ← Volver al dashboard
        </button>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Gestionar inventario: {vehiculo?.codigo} – {vehiculo?.nombre || 'Sin nombre'}
        </h1>
        <p className="text-gray-600 mb-6">
          Añade compartimentos y equipos. Los datos se guardan en el servidor.
        </p>

        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3 text-red-800 text-sm">
            {error}
          </div>
        )}

        {/* Formulario: nuevo compartimento */}
        <div className="card mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Añadir compartimento</h2>
          <form onSubmit={handleCrearCompartimento} className="flex flex-wrap gap-3 items-end">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
              <input
                type="text"
                value={nuevoCompartimento.nombre}
                onChange={(e) => setNuevoCompartimento((c) => ({ ...c, nombre: e.target.value }))}
                placeholder="Ej: Lateral izquierdo"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            <div className="w-24">
              <label className="block text-sm font-medium text-gray-700 mb-1">Orden</label>
              <input
                type="number"
                min="0"
                value={nuevoCompartimento.orden}
                onChange={(e) => setNuevoCompartimento((c) => ({ ...c, orden: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            <button
              type="submit"
              disabled={saving || !nuevoCompartimento.nombre.trim()}
              className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50"
            >
              {saving ? 'Guardando…' : 'Añadir compartimento'}
            </button>
          </form>
        </div>

        {/* Formulario: nuevo equipo */}
        <div className="card mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Añadir equipo</h2>
          <form onSubmit={handleCrearEquipo} className="flex flex-wrap gap-3 items-end">
            <div className="w-full sm:w-48">
              <label className="block text-sm font-medium text-gray-700 mb-1">Compartimento</label>
              <select
                value={nuevoEquipo.compartimento}
                onChange={(e) => setNuevoEquipo((q) => ({ ...q, compartimento: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">Selecciona…</option>
                {compartimentos.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nombre}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex-1 min-w-[180px]">
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del equipo</label>
              <input
                type="text"
                value={nuevoEquipo.nombre}
                onChange={(e) => setNuevoEquipo((q) => ({ ...q, nombre: e.target.value }))}
                placeholder="Ej: Manguera 50mm"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            <div className="w-20">
              <label className="block text-sm font-medium text-gray-700 mb-1">Cant.</label>
              <input
                type="number"
                min="1"
                value={nuevoEquipo.cantidad_esperada}
                onChange={(e) => setNuevoEquipo((q) => ({ ...q, cantidad_esperada: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            <div className="w-20">
              <label className="block text-sm font-medium text-gray-700 mb-1">Orden</label>
              <input
                type="number"
                min="0"
                value={nuevoEquipo.orden}
                onChange={(e) => setNuevoEquipo((q) => ({ ...q, orden: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            <button
              type="submit"
              disabled={saving || !nuevoEquipo.nombre.trim() || !nuevoEquipo.compartimento}
              className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50"
            >
              {saving ? 'Guardando…' : 'Añadir equipo'}
            </button>
          </form>
        </div>

        {/* Listado actual */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Inventario actual</h2>
          {compartimentos.length === 0 ? (
            <p className="text-gray-500">No hay compartimentos. Añade uno arriba.</p>
          ) : (
            <ul className="space-y-4">
              {compartimentos.map((comp) => (
                <li key={comp.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-gray-900">{comp.nombre}</span>
                    <button
                      type="button"
                      onClick={() => handleEliminarCompartimento(comp.id)}
                      disabled={saving}
                      className="text-red-600 hover:text-red-800 text-sm disabled:opacity-50"
                    >
                      Eliminar compartimento
                    </button>
                  </div>
                  <ul className="ml-4 space-y-1">
                    {(comp.equipos || []).length === 0 ? (
                      <li className="text-gray-500 text-sm">Sin equipos</li>
                    ) : (
                      (comp.equipos || []).map((eq) => (
                        <li key={eq.id} className="flex justify-between items-center text-sm">
                          <span>
                            {eq.nombre}
                            {eq.cantidad_esperada > 1 && (
                              <span className="text-gray-500 ml-1">(x{eq.cantidad_esperada})</span>
                            )}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleEliminarEquipo(eq.id)}
                            disabled={saving}
                            className="text-red-500 hover:text-red-700"
                          >
                            Eliminar
                          </button>
                        </li>
                      ))
                    )}
                  </ul>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  );
};

export default GestionarInventario;
