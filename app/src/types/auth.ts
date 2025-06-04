export interface User {
  id: string;
  name?: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  access_token: string;
}

export interface Course {
  id: string;
  title: string;
  description?: string;
  price: number;
  stripePriceId: string;
  createdAt: string;
  updatedAt: string;
  isPurchased?: boolean;
  purchaseId?: string | null;
}
