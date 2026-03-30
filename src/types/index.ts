// Memory types
export interface Memory {
  id: string;
  type: 'photo' | 'note' | 'voice' | 'document';
  title: string;
  content: string | File;
  thumbnail?: string;
  createdAt: string;
  description?: string;
}

// User types
export interface User {
  isAuthenticated: boolean;
  createdAt?: string;
}

// Auth context type
export interface AuthContextType {
  user: User;
  login: (password: string) => boolean;
  register: (password: string) => boolean;
  logout: () => void;
  isLoading: boolean;
}

// Memory context type
export interface MemoryContextType {
  memories: Memory[];
  loading?: boolean;
  addMemory: (memory: Memory) => Promise<void>;
  deleteMemory: (id: string) => Promise<void>;
  updateMemory: (id: string, memory: Partial<Memory>) => Promise<void>;
  getRecentMemories: (count: number) => Promise<Memory[]>;
}
