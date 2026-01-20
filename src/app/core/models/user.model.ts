export interface User {
  email: string;
  nome: string;
  ruolo: string;
}

// AuthenticationRequestDTO
export interface LoginRequest {
  email: string;
  password: string;
}

// AuthenticationResponseDTO
export interface LoginResponse {
  token: string;
}

// RegisterRequestDTO
export interface RegisterRequest {
  email: string;
  password: string;
  nome: string;
  ruolo: string;
}

// RegisterResponseDTO
export interface RegisterResponse {
  token: string;
  email: string;
  nome: string;
}
