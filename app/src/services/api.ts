import type {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  Course,
} from "../types/auth.ts";

const API_BASE_URL = "http://localhost:8000/api"; // Ajustez selon votre config NestJS

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = "ApiError";
  }
}

async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem("auth_token");

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new ApiError(response.status, `API Error: ${response.statusText}`);
  }

  return response.json();
}

export const authApi = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    return apiCall<AuthResponse>("/auth/signin", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    return apiCall<AuthResponse>("/auth/signup", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  me: async (): Promise<AuthResponse> => {
    console.log("authApi me");
    return apiCall<AuthResponse>("/auth/me");
  },
};

export const coursesApi = {
  getCourses: async (): Promise<Course[]> => {
    return apiCall<Course[]>("/courses");
  },

  getCoursesWithPurchaseStatus: async (): Promise<Course[]> => {
    const response = await apiCall<Course[]>("/courses/with-purchase-status");
    console.log("coursesApi getCoursesWithPurchaseStatus", response);
    return response;
  },
};

// Export de l'instance api pour purchaseApi
export const api = {
  get: <T>(endpoint: string) => apiCall<T>(endpoint),
  post: <T>(endpoint: string, data?: any) =>
    apiCall<T>(endpoint, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    }),
};
