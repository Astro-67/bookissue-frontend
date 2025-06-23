// User types based on your backend
export interface User {
  id: number;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  full_name: string;
  role: 'student' | 'staff' | 'ict';
  phone_number?: string;
  student_id?: string;
  department?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  username: string;
  password: string;
  password_confirm: string;
  first_name: string;
  last_name: string;
  role: 'student' | 'staff' | 'ict';
  phone_number?: string;
  student_id?: string;
  department?: string;
}

export interface AuthResponse {
  user: User;
  tokens: {
    access: string;
    refresh: string;
  };
  message: string;
}

// Error types
export interface ApiError {
  message: string;
  status: number;
  details?: Record<string, string[]>;
}
