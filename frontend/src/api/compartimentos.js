/**
 * Servicios API para compartimentos.
 */
import api from './axios';

export const compartimentosService = {
  /**
   * Lista compartimentos, opcionalmente filtrados por vehículo.
   * @param {number} vehiculoId - ID del vehículo (opcional)
   */
  getAll: (vehiculoId = null) => {
    const params = vehiculoId ? { vehiculo: vehiculoId } : {};
    return api.get('/compartimentos/', { params });
  },

  /**
   * Obtiene un compartimento por ID.
   */
  getById: (id) => api.get(`/compartimentos/${id}/`),

  /**
   * Crea un compartimento (se guarda en el backend/admin).
   * @param {object} data - { vehiculo, nombre, orden?, activo? }
   */
  create: (data) => api.post('/compartimentos/', data),

  /**
   * Actualiza un compartimento.
   */
  update: (id, data) => api.patch(`/compartimentos/${id}/`, data),

  /**
   * Elimina un compartimento.
   */
  delete: (id) => api.delete(`/compartimentos/${id}/`),
};
