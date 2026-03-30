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
    await MemoryModel.add(memory);
    // Refresh memories list
    const updated = await MemoryModel.getAll();
    setMemories(updated);
  };

  const deleteMemory = async (id: string): Promise<void> => {
    await MemoryModel.delete(id);
    // Refresh memories list
    const updated = await MemoryModel.getAll();
    setMemories(updated);
  };

  const updateMemory = async (id: string, updates: Partial<Memory>): Promise<void> => {
    await MemoryModel.update(id, updates);
    // Refresh memories list
    const updated = await MemoryModel.getAll();
    setMemories(updated);
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
