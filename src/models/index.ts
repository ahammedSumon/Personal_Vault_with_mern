import { Memory } from '../types';

const API_URL = 'http://localhost:5000/api/files';

// Memory Model - now uses backend API instead of localStorage
export class MemoryModel {
  static async getAll(): Promise<Memory[]> {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error('Failed to fetch memories');
      const result = await response.json();
      // Convert MongoDB format (_id) to app format (id)
      return result.data.map((item: any) => ({
        id: item._id,
        title: item.title,
        description: item.description,
        type: item.type,
        content: item.content,
        thumbnail: item.thumbnail,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt
      }));
    } catch (error) {
      console.error('Error getting memories:', error);
      return [];
    }
  }

  static async add(memory: Memory): Promise<void> {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: memory.title,
          description: memory.description,
          type: memory.type,
          content: memory.content,
          thumbnail: memory.thumbnail
        })
      });
      if (!response.ok) throw new Error('Failed to add memory');
    } catch (error) {
      console.error('Error adding memory:', error);
    }
  }

  static async delete(id: string): Promise<void> {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      });
      if (!response.ok) throw new Error('Failed to delete memory');
    } catch (error) {
      console.error('Error deleting memory:', error);
    }
  }

  static async update(id: string, updates: Partial<Memory>): Promise<void> {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: updates.title,
          description: updates.description,
          type: updates.type,
          content: updates.content,
          thumbnail: updates.thumbnail
        })
      });
      if (!response.ok) throw new Error('Failed to update memory');
    } catch (error) {
      console.error('Error updating memory:', error);
    }
  }

  static async getRecent(count: number): Promise<Memory[]> {
    try {
      const memories = await this.getAll();
      return memories
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, count);
    } catch (error) {
      console.error('Error getting recent memories:', error);
      return [];
    }
  }
}

// User Model - handles authentication (kept for now, can be extended to backend later)
export class UserModel {
  static getPassword(): string | null {
    try {
      return localStorage.getItem('vault_password');
    } catch (error) {
      console.error('Error getting password:', error);
      return null;
    }
  }

  static setPassword(password: string): void {
    try {
      localStorage.setItem('vault_password', btoa(password));
      localStorage.setItem('vault_user', JSON.stringify({ createdAt: new Date().toISOString() }));
    } catch (error) {
      console.error('Error setting password:', error);
    }
  }

  static verifyPassword(password: string): boolean {
    try {
      const stored = this.getPassword();
      if (!stored) return false;
      return btoa(password) === stored;
    } catch (error) {
      console.error('Error verifying password:', error);
      return false;
    }
  }

  static isRegistered(): boolean {
    return this.getPassword() !== null;
  }

  static logout(): void {
    try {
      localStorage.removeItem('vault_auth_token');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  }

  static setAuthToken(): void {
    try {
      localStorage.setItem('vault_auth_token', 'authenticated');
    } catch (error) {
      console.error('Error setting auth token:', error);
    }
  }

  static isAuthenticated(): boolean {
    return localStorage.getItem('vault_auth_token') !== null;
  }
}
