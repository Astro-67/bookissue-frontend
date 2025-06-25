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

// Ticket types
export interface Ticket {
  id: number;
  title: string;
  description: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED';
  created_by: User;
  assigned_to: User | null;
  created_at: string;
  updated_at: string;
  resolved_at?: string;
  comments_count?: number;
}

export interface CreateTicketData {
  title: string;
  description: string;
}

export interface UpdateTicketData {
  title?: string;
  description?: string;
  status?: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED';
  assigned_to?: number | null;
}

// Filter types
export interface TicketFilters {
  status?: string;
  assigned_to?: number;
  created_by?: number;
  search?: string;
}

// Comment types
export interface Comment {
  id: number;
  ticket: number;
  author: number;
  author_name: string;
  author_details: User;
  message: string;
  created_at: string;
  ticket_title: string;
}

export interface CreateCommentData {
  message: string;
}
