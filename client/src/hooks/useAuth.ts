import { useCallback } from 'react';
import { useApi } from './useApi';
import { AuthService } from '../api/services/authService';
import { LoginRequest, RegisterRequest } from '../api/types';

export function useAuth() {
  const loginApi = useApi(AuthService.login);
  const registerApi = useApi(AuthService.register);
  const logoutApi = useApi(AuthService.logout);
  const getCurrentUserApi = useApi(AuthService.getCurrentUser);

  const login = useCallback(async (credentials: LoginRequest) => {
    const result = await loginApi.execute(credentials);
    if (result) {
      localStorage.setItem('authToken', result.token);
    }
    return result;
  }, [loginApi]);

  const register = useCallback(async (userData: RegisterRequest) => {
    const result = await registerApi.execute(userData);
    if (result) {
      localStorage.setItem('authToken', result.token);
    }
    return result;
  }, [registerApi]);

  const logout = useCallback(async () => {
    await logoutApi.execute();
    localStorage.removeItem('authToken');
  }, [logoutApi]);

  const getCurrentUser = useCallback(async () => {
    return await getCurrentUserApi.execute();
  }, [getCurrentUserApi]);

  return {
    login: {
      execute: login,
      loading: loginApi.loading,
      error: loginApi.error,
    },
    register: {
      execute: register,
      loading: registerApi.loading,
      error: registerApi.error,
    },
    logout: {
      execute: logout,
      loading: logoutApi.loading,
      error: logoutApi.error,
    },
    getCurrentUser: {
      execute: getCurrentUser,
      loading: getCurrentUserApi.loading,
      error: getCurrentUserApi.error,
      data: getCurrentUserApi.data,
    },
  };
}
