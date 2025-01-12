export interface User {
  id: string;
  username: string;
  password: string;
}

export interface Task {
  id: string;
  userId: string;
  title: string;
  description: string;
  status: 'pending' | 'completed';
  deadline: string;
  createdAt: string;
}

export interface AuthState {
  currentUser: User | null;
  isAuthenticated: boolean;
}