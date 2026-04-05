import React, { createContext, useContext, useState, useEffect } from 'react';
import { MemoryContextType, Memory } from '../types';
import { MemoryModel } from '../models';

const MemoryContext = createContext<MemoryContextType | undefined>(undefined);

export const MemoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [loading, setLoading] = useState(true);

  // Load memories on mount
  useEffect(() => {
    const loadMemories = async () => {
      setLoading(true);
      const loaded = await MemoryModel.getAll();
      setMemories(loaded);
      setLoading(false);
    };
    loadMemories();
  }, []);

  const addMemory = async (memory: Memory): Promise<void> => {
    // Optimistic update - add to local state immediately
    setMemories(prev => [memory, ...prev]);
    
    try {
      // Send to backend
      await MemoryModel.add(memory);
    } catch (error) {
      // Revert on error
      setMemories(prev => prev.filter(m => m.id !== memory.id));
      throw error;
    }
  };

  const deleteMemory = async (id: string): Promise<void> => {
    // Optimistic update - remove from local state immediately
    const previousMemories = memories;
    setMemories(prev => prev.filter(m => m.id !== id));
    
    try {
      // Send to backend
      await MemoryModel.delete(id);
    } catch (error) {
      // Revert on error
      setMemories(previousMemories);
      throw error;
    }
  };

  const updateMemory = async (id: string, updates: Partial<Memory>): Promise<void> => {
    // Optimistic update - update in local state immediately
    const previousMemories = memories;
    setMemories(prev => 
      prev.map(m => m.id === id ? { ...m, ...updates } : m)
    );
    
    try {
      // Send to backend
      await MemoryModel.update(id, updates);
    } catch (error) {
      // Revert on error
      setMemories(previousMemories);
      throw error;
    }
  };

  const getRecentMemories = async (count: number): Promise<Memory[]> => {
    return await MemoryModel.getRecent(count);
  };

  return (
    <MemoryContext.Provider value={{ memories, addMemory, deleteMemory, updateMemory, getRecentMemories, loading }}>
      {children}
    </MemoryContext.Provider>
  );
};

export const useMemory = (): MemoryContextType => {
  const context = useContext(MemoryContext);
  if (!context) {
    throw new Error('useMemory must be used within MemoryProvider');
  }
  return context;
};
