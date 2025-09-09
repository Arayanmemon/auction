import { apiClient } from '../client';
import { ApiResponse, AuthResponse, LoginRequest, RegisterRequest, User } from '../types';

interface BackendAuthResponse {
  success: boolean;
  message: string;
  data: User;
  token: string;
}

export class AuthService {
  static async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await apiClient.post<BackendAuthResponse>('/auth/login', credentials);
    return {
      user: response.data,
      token: response.token
    };
  }

  static async register(userData: RegisterRequest): Promise<AuthResponse> {
    const response = await apiClient.post<BackendAuthResponse>('/auth/register', userData);
    return {
      user: response.data,
      token: response.token
    };
  }

  static async logout(): Promise<void> {
    await apiClient.post('/auth/logout');
    localStorage.removeItem('authToken');
  }

  static async getCurrentUser(): Promise<User> {
    const response = await apiClient.get<ApiResponse<User>>('/auth/me');
    return response.data;
  }

  static async refreshToken(): Promise<AuthResponse> {
    const response = await apiClient.post<BackendAuthResponse>('/auth/refresh');
    return {
      user: response.data,
      token: response.token
    };
  }
}
