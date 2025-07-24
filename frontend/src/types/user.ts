export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserData {
  name: string;
  email: string;
  phone?: string;
}

export interface UpdateUserData {
  name?: string;
  email?: string;
  phone?: string;
  active?: boolean;
} 