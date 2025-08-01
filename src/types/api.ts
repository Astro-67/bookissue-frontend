// User types based on your backend
export interface User {
  id: number;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  full_name: string;
  role: 'student' | 'staff' | 'ict' | 'super_admin';
  phone_number?: string;
  student_id?: string;
  department?: string;
  profile_picture?: string;
  profile_picture_url?: string;
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
  role: 'student' | 'staff' | 'ict' | 'super_admin';
  phone_number?: string;
  student_id?: string;
  department?: string;
}

export interface UpdateProfileData {
  first_name?: string;
  last_name?: string;
  phone_number?: string;
  email?: string;
}

export interface ChangePasswordData {
  old_password: string;
  new_password: string;
  confirm_password: string;
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
  screenshot?: string;
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
  screenshot?: File;
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

// Notification types
export interface Notification {
  id: number;
  user: number;
  title: string;
  message: string;
  notification_type: 'ticket_status' | 'new_comment' | 'assignment' | 'new_ticket' | 'general';
  is_read: boolean;
  ticket_id?: number;
  comment_id?: number;
  created_at: string;
  time_ago: string;
}

export interface MarkNotificationReadData {
  notification_ids: number[];
}

export interface NotificationFilters {
  is_read?: boolean;
  notification_type?: string;
}
