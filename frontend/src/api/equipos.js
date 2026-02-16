/**
 * Servicios API para equipos.
 */
import api from './axios';

export const equiposService = {
  /**
   * Lista equipos, opcionalmente por compartimento o por vehículo.
   * @param {number} compartimentoId - ID del compartimento (opcional)
   * @param {number} vehiculoId - ID del vehículo (opcional)
   */
  getAll: ({ compartimentoId = null, vehiculoId = null } = {}) => {
    const params = {};
    if (compartimentoId) params.compartimento = compartimentoId;
    if (vehiculoId) params.vehiculo = vehiculoId;
    return api.get('/equipos/', { params });
  },

  /**
   * Obtiene un equipo por ID.
   */
  getById: (id) => api.get(`/equipos/${id}/`),

  /**
   * Crea un equipo (se guarda en el backend/admin).
   * @param {object} data - { compartimento, nombre, cantidad_esperada?, orden?, activo? }
   */
  create: (data) => api.post('/equipos/', data),

  /**
   * Actualiza un equipo.
   */
  update: (id, data) => api.patch(`/equipos/${id}/`, data),

  /**
   * Elimina un equipo.
   */
  delete: (id) => api.delete(`/equipos/${id}/`),
};
