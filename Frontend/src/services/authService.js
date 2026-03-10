import apiClient from './apiClient';

class ApiError extends Error {
  constructor(message, code = null, errors = null) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.errors = errors;
  }
}

const getApiError = (error, fallbackMessage) => {
  const responseData = error.response?.data || {};

  if (typeof responseData?.message === 'string' && responseData.message.trim()) {
    return {
      message: responseData.message,
      code: responseData.code || null,
      errors: responseData.errors || null,
    };
  }

  const validationErrors = responseData?.errors;

  if (validationErrors && typeof validationErrors === 'object') {
    const firstFieldErrors = Object.values(validationErrors).find(
      (messages) => Array.isArray(messages) && messages.length > 0
    );

    if (firstFieldErrors) {
      return {
        message: firstFieldErrors[0],
        code: responseData.code || null,
        errors: validationErrors,
      };
    }
  }

  return {
    message: fallbackMessage,
    code: responseData.code || null,
    errors: responseData.errors || null,
  };
};

const buildApiError = (error, fallbackMessage) => {
  const parsedError = getApiError(error, fallbackMessage);

  return new ApiError(parsedError.message, parsedError.code, parsedError.errors);
};

export const authService = {
  login: async (email, password) => {
    try {
      const response = await apiClient.post('/login', {
        email,
        password,
      });

      return response.data;
    } catch (error) {
      throw buildApiError(error, 'Error al iniciar sesion');
    }
  },

  logout: async () => {
    try {
      await apiClient.post('/logout');
    } catch (error) {
      console.error('Error al cerrar sesion:', error);
    }
  },

  register: async (userData) => {
    try {
      const response = await apiClient.post('/register', userData);

      return response.data;
    } catch (error) {
      throw buildApiError(error, 'Error al registrar usuario');
    }
  },

  resendVerificationEmail: async (email) => {
    try {
      const payload = email ? { email } : {};
      const response = await apiClient.post('/email/verification-notification', payload);

      return response.data;
    } catch (error) {
      throw buildApiError(error, 'No se pudo reenviar el correo de verificacion');
    }
  },

  verifyEmail: async ({ id, hash, expires, signature }) => {
    try {
      const response = await apiClient.get(`/email/verify/${id}/${hash}`, {
        params: { expires, signature },
      });

      return response.data;
    } catch (error) {
      throw buildApiError(error, 'No se pudo verificar el correo');
    }
  },

  getProfile: async () => {
    try {
      const response = await apiClient.get('/me');

      return response.data;
    } catch (error) {
      throw buildApiError(error, 'Error al obtener perfil');
    }
  },

  getAdminUsers: async () => {
    try {
      const response = await apiClient.get('/admin/users');

      return response.data;
    } catch (error) {
      throw buildApiError(error, 'Error al obtener usuarios');
    }
  },

  getRoles: async () => {
    try {
      const response = await apiClient.get('/admin/roles');

      return response.data;
    } catch (error) {
      throw buildApiError(error, 'Error al obtener roles');
    }
  },

  updateUserRole: async (userId, role) => {
    try {
      const response = await apiClient.patch(`/admin/users/${userId}/role`, { role });

      return response.data;
    } catch (error) {
      throw buildApiError(error, 'Error al actualizar rol');
    }
  },
};