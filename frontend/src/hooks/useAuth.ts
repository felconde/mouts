import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';
import { LoginData, RegisterData, AuthResponse, User } from '../types/auth';

// Chave para armazenar o token no localStorage
const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

// Funções para gerenciar token e usuário
export const getToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(TOKEN_KEY);
  }
  return null;
};

export const setToken = (token: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(TOKEN_KEY, token);
  }
};

export const removeToken = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }
};

export const getUser = (): User | null => {
  if (typeof window !== 'undefined') {
    const userStr = localStorage.getItem(USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  }
  return null;
};

export const setUser = (user: User): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }
};

// Hook para login
export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: LoginData): Promise<AuthResponse> => {
      const response = await api.post('/auth/login', data);
      return response.data;
    },
    onSuccess: (data) => {
      setToken(data.access_token);
      setUser(data.user);
      queryClient.invalidateQueries({ queryKey: ['auth'] });
    },
  });
};

// Hook para registro
export const useRegister = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: RegisterData): Promise<AuthResponse> => {
      const response = await api.post('/auth/register', data);
      return response.data;
    },
    onSuccess: (data) => {
      setToken(data.access_token);
      setUser(data.user);
      queryClient.invalidateQueries({ queryKey: ['auth'] });
    },
  });
};

// Hook para logout
export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      // Opcional: chamar endpoint de logout no backend
      return Promise.resolve();
    },
    onSuccess: () => {
      removeToken();
      queryClient.clear();
    },
  });
};

// Hook para verificar usuário autenticado
export const useAuth = () => {
  return useQuery({
    queryKey: ['auth'],
    queryFn: async (): Promise<User | null> => {
      const token = getToken();
      if (!token) {
        return null;
      }

      try {
        const response = await api.get('/auth/me');
        return response.data;
      } catch (error) {
        removeToken();
        return null;
      }
    },
    initialData: getUser,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

// Hook para verificar se está autenticado
export const useIsAuthenticated = () => {
  const { data: user, isLoading } = useAuth();
  return {
    isAuthenticated: !!user,
    user,
    isLoading,
  };
}; 