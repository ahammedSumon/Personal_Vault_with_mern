import React, { useState, useMemo, useEffect } from 'react';
import { Memory } from '../types';
import { useMemory } from '../context/MemoryContext';
import { useAuth } from '../context/AuthContext';
import { formatDate } from '../utils';
import MemoryUploadView from './MemoryUploadView';
import MemoryListView from './MemoryListView';
import MemoryDetailModal from './MemoryDetailModal';
import '../styles/Dashboard.css';

type DashboardTab = 'hero' | 'add' | 'list';
type FilterType = 'all' | 'photo' | 'note' | 'voice' | 'document';

const DashboardView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<DashboardTab>(() => {
    const saved = localStorage.getItem('activeTab');
    return (saved as DashboardTab) || 'hero';
  });
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null);
  const [filterType, setFilterType] = useState<FilterType>('all');
  const { memories, loading } = useMemory();
  const { logout } = useAuth();
  
  // Persist activeTab to localStorage
  useEffect(() => {
    localStorage.setItem('activeTab', activeTab);
  }, [activeTab]);
  
  // Memoize sorting to avoid recalculation on every render
  const recentMemories = useMemo(() => {
    return [...memories]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 12);
  }, [memories]);

  // Apply filter
  const filteredMemories = useMemo(() => {
    return filterType === 'all' 
      ? recentMemories 
      : recentMemories.filter(m => m.type === filterType);
  }, [recentMemories, filterType]);

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
    }
  };

  const handleCardClick = (memory: Memory) => {
    setSelectedMemory(memory);
    document.body.style.overflow = 'hidden';
  };

  return (
    <div className="dashboard-container">
      {selectedMemory && <div className="modal-overlay-blocker"></div>}
      <header className="dashboard-header">
        <div className="header-left">
          <h1>🛡️ Personal Safe Vault</h1>
          <p>Welcome back! You have {memories.length} items</p>
        </div>
        <button onClick={handleLogout} className="logout-button">
          Logout
        </button>
      </header>

      <nav className="dashboard-nav">
        <button
          className={`nav-button ${activeTab === 'hero' ? 'active' : ''}`}
          onClick={() => setActiveTab('hero')}
        >
          Home
        </button>
        <button
          className={`nav-button ${activeTab === 'add' ? 'active' : ''}`}
          onClick={() => setActiveTab('add')}
        >
          ➕ Add Data
        </button>
        <button
          className={`nav-button ${activeTab === 'list' ? 'active' : ''}`}
          onClick={() => setActiveTab('list')}
        >
          📚 All Data
        </button>
      </nav>

      <main className="dashboard-main">
        {activeTab === 'hero' && (
          <section className="hero-section">
            <div className="hero-content">
              <h2>Welcome to Your Personal Safe Vault</h2>
              <p>Securely store and organize your photos, notes, voice messages, documents, and files.</p>

              {loading ? (
                <div className="loading-container">
                  <div className="loading-spinner"></div>
                  <p>Loading your items...</p>
                </div>
              ) : recentMemories.length > 0 ? (
                <div className="recent-memories">
                  {/* Filter Buttons */}
                  <div className="filter-buttons">
                    <button
                      className={`filter-btn ${filterType === 'all' ? 'active' : ''}`}
                      onClick={() => setFilterType('all')}
                    >
                      All Items
                    </button>
                    <button
                      className={`filter-btn ${filterType === 'photo' ? 'active' : ''}`}
                      onClick={() => setFilterType('photo')}
                    >
                      📷 Photos
                    </button>
                    <button
                      className={`filter-btn ${filterType === 'note' ? 'active' : ''}`}
                      onClick={() => setFilterType('note')}
                    >
                      📝 Notes
                    </button>
                    <button
                      className={`filter-btn ${filterType === 'voice' ? 'active' : ''}`}
                      onClick={() => setFilterType('voice')}
                    >
                      🎙️ Voice
                    </button>
                    <button
                      className={`filter-btn ${filterType === 'document' ? 'active' : ''}`}
                      onClick={() => setFilterType('document')}
                    >
                      📄 Documents
                    </button>
                  </div>

                  {/* Unified Memory Grid */}
                  <div className="memory-grid unified-grid">
                    {filteredMemories.length > 0 ? (
                      filteredMemories.map((memory) => (
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
                        </div>
                      ))
                    ) : (
                      <div className="no-results">
                        <p>No {filterType === 'all' ? 'items' : filterType + 's'} yet</p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="empty-state">
                  <p>📭 No items yet. Start by adding your first data!</p>
                  <button onClick={() => setActiveTab('add')} className="cta-button">
                    Add Your First Item
                  </button>
                </div>
              )}
            </div>
          </section>
        )}

        {activeTab === 'add' && <MemoryUploadView />}

        {activeTab === 'list' && <MemoryListView onMemoryClick={handleCardClick} />}

        {selectedMemory && (
          <MemoryDetailModal 
            memory={selectedMemory} 
            onClose={() => {
              setSelectedMemory(null);
              document.body.style.overflow = 'unset';
            }} 
          />
        )}
      </main>
    </div>
  );
};

export default DashboardView;
