/**
 * Servicios API para revisiones.
 */
import api from './axios';

export const revisionesService = {
  /**
   * Obtiene todas las revisiones.
   * @param {object} filters - Filtros opcionales (vehiculo, responsable)
   */
  getAll: (filters = {}) => {
    return api.get('/revisiones/', { params: filters });
  },

  /**
   * Obtiene una revisión por ID.
   */
  getById: (id) => api.get(`/revisiones/${id}/`),

  /**
   * Crea una nueva revisión.
   * @param {object} revisionData - Datos de la revisión
   */
  create: (revisionData) => api.post('/revisiones/', revisionData),
};
