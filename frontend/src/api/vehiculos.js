/**
 * Servicios API para vehículos.
 */
import api from './axios';

export const vehiculosService = {
  /**
   * Obtiene todos los vehículos.
   */
  getAll: () => api.get('/vehiculos/'),

  /**
   * Obtiene un vehículo por ID.
   */
  getById: (id) => api.get(`/vehiculos/${id}/`),

  /**
   * Obtiene el estado de un vehículo específico.
   * @param {number} id - ID del vehículo
   * @param {string} responsable - Nombre del responsable (opcional)
   */
  getEstado: (id, responsable = null) => {
    const params = responsable ? { responsable } : {};
    return api.get(`/vehiculos/${id}/estado/`, { params });
  },

  /**
   * Obtiene el estado de todos los vehículos.
   * @param {string} responsable - Nombre del responsable (opcional)
   */
  getEstados: (responsable = null) => {
    const params = responsable ? { responsable } : {};
    return api.get('/vehiculos/estados/', { params });
  },
};
