import React, { useState } from 'react';
import { useMemory } from '../context/MemoryContext';
import { Memory } from '../types';
import { formatDate } from '../utils';
import MemoryEditView from './MemoryEditView';
import '../styles/MemoryList.css';

const MemoryListView: React.FC<{onMemoryClick?: (memory: Memory) => void}> = ({ onMemoryClick }) => {
  const { memories, deleteMemory, updateMemory } = useMemory();
  const [filterType, setFilterType] = useState<'all' | 'photo' | 'note' | 'voice' | 'document'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingMemory, setEditingMemory] = useState<Memory | null>(null);

  const filteredMemories = memories.filter((memory) => {
    const matchesType = filterType === 'all' || memory.type === filterType;
    const matchesSearch =
      searchQuery === '' ||
      memory.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      memory.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  const sortedMemories = [...filteredMemories].sort((a, b) => {
    const timeA = new Date(a.createdAt).getTime();
    const timeB = new Date(b.createdAt).getTime();
    return sortBy === 'newest' ? timeB - timeA : timeA - timeB;
  });

  const handleDelete = async (id: string, title: string) => {
    if (window.confirm(`Delete "${title}"?`)) {
      await deleteMemory(id);
    }
  };

  const handleEdit = (memory: Memory) => {
    setEditingMemory(memory);
  };

  const handleSaveEdit = async (updates: Partial<Memory>) => {
    if (editingMemory) {
      await updateMemory(editingMemory.id, updates);
      setEditingMemory(null);
    }
  };

  const handleCardClick = (memory: Memory) => {
    if (onMemoryClick) {
      onMemoryClick(memory);
    }
  };

  return (
    <div className="memory-list-container">
      <div className="list-header">
        <h2>All Memories ({sortedMemories.length})</h2>

        <div className="list-controls">
          {/* Search */}
          <div className="search-group">
            <input
              type="text"
              placeholder="🔍 Search by title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>

          {/* Filter */}
          <div className="filter-group">
            <label htmlFor="filter">Filter:</label>
            <select
              id="filter"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
            >
              <option value="all">All Types</option>
              <option value="photo">📷 Photos</option>
              <option value="note">📝 Notes</option>
              <option value="voice">🎙️ Voice</option>
              <option value="document">📄 Documents</option>
            </select>
          </div>

          {/* Sort */}
          <div className="sort-group">
            <label htmlFor="sort">Sort:</label>
            <select
              id="sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>
        </div>
      </div>

      {sortedMemories.length > 0 ? (
        <div className="memories-grid">
          {sortedMemories.map((memory) => (
            <div 
              key={memory.id} 
              className="memory-card"
              onClick={() => handleCardClick(memory)}
              role="button"
              tabIndex={0}
            >
              <div className="card-header">
                <span className="card-icon">
                  {memory.type === 'photo' ? '📷' : memory.type === 'note' ? '📝' : memory.type === 'voice' ? '🎙️' : '📄'}
                </span>
                <h4 className="card-title">{memory.title}</h4>
              </div>
              <p className="card-description">
                {memory.description || (typeof memory.content === 'string' ? memory.content.substring(0, 80) : 'Uploaded file')}
              </p>
              <div className="card-footer">
                <span className="card-date">{formatDate(memory.createdAt)}</span>
                <div className="card-actions" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => handleEdit(memory)}
                    className="edit-button"
                    title="Edit memory"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => handleDelete(memory.id, memory.title)}
                    className="delete-button"
                    title="Delete memory"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <p>📭 No memories found</p>
          {filterType !== 'all' && (
            <button onClick={() => setFilterType('all')} className="reset-filter">
              Clear Filter
            </button>
          )}
        </div>
      )}

      {/* Edit Modal */}
      {editingMemory && (
        <MemoryEditView
          memory={editingMemory}
          onSave={handleSaveEdit}
          onClose={() => setEditingMemory(null)}
        />
      )}
    </div>
  );
};

export default MemoryListView;
