export interface User {
  id?: number;
  username: string;
  email: string;
  role?: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  confirmPassword?: string;
}

export interface AuthResponse {
  token: string;
  type?: string;
  user: User;
}
