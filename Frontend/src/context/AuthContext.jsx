import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

const USE_MOCK_AUTH = String(import.meta.env.VITE_USE_MOCK_AUTH || 'false').toLowerCase() === 'true';

const normalizeRole = (role) => {
  const normalized = String(role || '').toLowerCase();

  if (normalized === 'user' || normalized === 'usuario') {
    return 'usuario';
  }

  if (normalized === 'admin') {
    return 'admin';
  }

  if (normalized === 'editor') {
    return 'editor';
  }

  return 'usuario';
};

const normalizeUser = (user) => {
  if (!user || typeof user !== 'object') {
    return null;
  }

  return {
    ...user,
    role: normalizeRole(user.role),
  };
};

const roleHierarchy = {
  usuario: 1,
  editor: 2,
  admin: 3,
};

const clearStoredAuth = () => {
  localStorage.removeItem('user');
  localStorage.removeItem('token');
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth debe ser usado dentro de AuthProvider');
  }

  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const restoreSession = async () => {
      const storedUser = localStorage.getItem('user');
      const token = localStorage.getItem('token');

      if (!storedUser || !token) {
        setLoading(false);
        return;
      }

      try {
        if (USE_MOCK_AUTH) {
          const parsedUser = JSON.parse(storedUser);
          const normalizedUser = normalizeUser(parsedUser);

          if (normalizedUser) {
            setUser(normalizedUser);
          }

          setLoading(false);
          return;
        }

        const profile = await authService.getProfile();
        const normalizedUser = normalizeUser(profile.user);

        if (!normalizedUser) {
          clearStoredAuth();
          setUser(null);
          setLoading(false);
          return;
        }

        setUser(normalizedUser);
        localStorage.setItem('user', JSON.stringify(normalizedUser));
      } catch (error) {
        clearStoredAuth();
        setUser(null);
      }

      setLoading(false);
    };

    restoreSession();
  }, []);

  const persistAuth = (userData, token) => {
    const normalizedUser = normalizeUser(userData);

    if (!normalizedUser || !token) {
      throw new Error('Respuesta de autenticacion invalida');
    }

    setUser(normalizedUser);
    localStorage.setItem('user', JSON.stringify(normalizedUser));
    localStorage.setItem('token', token);
  };

  const setAuthenticatedUser = (userData) => {
    const normalizedUser = normalizeUser(userData);

    if (!normalizedUser) {
      return;
    }

    setUser(normalizedUser);
    localStorage.setItem('user', JSON.stringify(normalizedUser));
  };

  const refreshProfile = async () => {
    if (USE_MOCK_AUTH) {
      return null;
    }

    const profile = await authService.getProfile();

    if (profile?.user) {
      setAuthenticatedUser(profile.user);
    }

    return profile;
  };

  const login = async (email, password) => {
    if (USE_MOCK_AUTH) {
      const usuarios = {
        'admin@parroquia.com': {
          id: 1,
          name: 'Administrador',
          email: 'admin@parroquia.com',
          role: 'admin',
          password: 'admin123',
        },
        'editor@parroquia.com': {
          id: 2,
          name: 'Editor',
          email: 'editor@parroquia.com',
          role: 'editor',
          password: 'editor123',
        },
        'usuario@parroquia.com': {
          id: 3,
          name: 'Usuario',
          email: 'usuario@parroquia.com',
          role: 'usuario',
          password: 'usuario123',
        },
      };

      const usuario = usuarios[email];

      if (usuario && usuario.password === password) {
        const mockToken = `mock-token-${usuario.id}`;

        persistAuth(
          {
            id: usuario.id,
            name: usuario.name,
            email: usuario.email,
            role: usuario.role,
          },
          mockToken
        );

        return { success: true };
      }

      return { success: false, error: 'Credenciales incorrectas' };
    }

    try {
      const data = await authService.login(email, password);
      persistAuth(data.user, data.token);

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        code: error.code || null,
      };
    }
  };

  const register = async (userData) => {
    if (USE_MOCK_AUTH) {
      return {
        success: true,
        requiresVerification: false,
        message: 'Usuario registrado en modo mock.',
      };
    }

    try {
      const payload = {
        name: userData.name,
        email: userData.email,
        password: userData.password,
        password_confirmation: userData.password_confirmation || userData.confirmPassword,
      };

      const data = await authService.register(payload);

      return {
        success: true,
        requiresVerification: Boolean(data.requires_verification),
        message: data.message,
      };
    } catch (error) {
      return { success: false, error: error.message, code: error.code || null };
    }
  };

  const resendVerificationEmail = async (email) => {
    if (USE_MOCK_AUTH) {
      return { success: true, message: 'Correo de verificacion simulado.' };
    }

    try {
      const data = await authService.resendVerificationEmail(email || user?.email);

      return { success: true, message: data.message };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        code: error.code || null,
      };
    }
  };

  const logout = () => {
    setUser(null);
    clearStoredAuth();

    if (!USE_MOCK_AUTH) {
      authService.logout();
    }
  };

  const hasPermission = (requiredRole) => {
    if (!user) {
      return false;
    }

    const userLevel = roleHierarchy[normalizeRole(user.role)] || 0;
    const requiredLevel = roleHierarchy[normalizeRole(requiredRole)] || 0;

    return userLevel >= requiredLevel;
  };

  const value = {
    user,
    login,
    register,
    logout,
    hasPermission,
    isAuthenticated: !!user,
    loading,
    resendVerificationEmail,
    refreshProfile,
    setAuthenticatedUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};