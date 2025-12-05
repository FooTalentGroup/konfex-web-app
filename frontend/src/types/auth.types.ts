export interface SignInRequest {
  email: string;
  password: string;
}

export interface SignUpRequest {
  email: string;
  password: string;
  name?: string | null;
  role?: 'USER' | 'ADMIN';
}

export interface User {
  id: number;
  email: string;
  name: string | null;
  role: 'USER' | 'ADMIN';
}

export interface SignInResponse {
  user: User;
  token: string;
  refreshToken: string;
}

export interface SignUpResponse {
  id: number;
  email: string;
  name: string | null;
  role: 'USER' | 'ADMIN';
}

export interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data?: T;
  errors?: string[];
}

