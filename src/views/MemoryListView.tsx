import React, { useState } from 'react';
import { useMemory } from '../context/MemoryContext';
import { Memory } from '../types';
import { formatDate } from '../utils';
import MemoryEditView from './MemoryEditView';
import '../styles/MemoryList.css';

const MemoryListView: React.FC<{onMemoryClick?: (memory: Memory) => void}> = ({ onMemoryClick }) => {
  const { memories, loading, deleteMemory, updateMemory } = useMemory();
  const [filterType, setFilterType] = useState<'all' | 'photo' | 'note' | 'voice' | 'document'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingMemory, setEditingMemory] = useState<Memory | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

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
      setDeletingId(id);
      setError(null);
      try {
        await deleteMemory(id);
      } catch (err) {
        setError('Failed to delete item. Please try again.');
        console.error(err);
      } finally {
        setDeletingId(null);
      }
    }
  };

  const handleEdit = (memory: Memory) => {
    setEditingMemory(memory);
  };

  const handleSaveEdit = async (updates: Partial<Memory>) => {
    if (editingMemory) {
      setError(null);
      try {
        await updateMemory(editingMemory.id, updates);
        setEditingMemory(null);
      } catch (err) {
        setError('Failed to update item. Please try again.');
        console.error(err);
      }
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
        <h2>All Items ({sortedMemories.length})</h2>

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

      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading your items...</p>
        </div>
      ) : sortedMemories.length > 0 ? (
        <div className="memories-grid">
          {error && (
            <div className="error-message" style={{ gridColumn: '1 / -1' }}>
              ⚠️ {error}
            </div>
          )}
          {sortedMemories.map((memory) => (
            <div 
              key={memory.id} 
              className={`memory-card ${memory.type}-card`}
              onClick={() => handleCardClick(memory)}
              role="button"
              tabIndex={0}
            >
              {memory.type === 'photo' && memory.thumbnail && (
                <div className="memory-thumbnail">
                  <img src={memory.thumbnail} alt={memory.title} />
                </div>
              )}
              {memory.type !== 'photo' && (
                <div className="memory-icon-large">
                  {memory.type === 'note' && '📝'}
                  {memory.type === 'voice' && '🎙️'}
                  {memory.type === 'document' && '📄'}
                </div>
              )}
              <div className="memory-overlay">
                <div className="memory-type-badge">{memory.type}</div>
                <h4>{memory.title}</h4>
                {memory.description && (
                  <p className="memory-description">{memory.description.substring(0, 60)}...</p>
                )}
                <p className="memory-date">{formatDate(memory.createdAt)}</p>
              </div>
              <div className="card-actions" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={() => handleEdit(memory)}
                  className="edit-button"
                  title="Edit item"
                  disabled={deletingId === memory.id}
                >
                  {deletingId === memory.id ? '⏳' : '✏️'}
                </button>
                <button
                  onClick={() => handleDelete(memory.id, memory.title)}
                  className="delete-button"
                  title="Delete item"
                  disabled={deletingId === memory.id}
                >
                  {deletingId === memory.id ? '⏳' : '🗑️'}
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <p>📭 No items found</p>
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
