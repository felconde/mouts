export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

export interface AuthResponse {
  user: {
    id: string;
    name: string;
    email: string;
    phone?: string;
    active: boolean;
    createdAt: string;
    updatedAt: string;
  };
  access_token: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
} 