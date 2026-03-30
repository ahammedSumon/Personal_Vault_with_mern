import React, { useState } from 'react';
import { Memory } from '../types';
import { useMemory } from '../context/MemoryContext';
import { useAuth } from '../context/AuthContext';
import { formatDate } from '../utils';
import MemoryUploadView from './MemoryUploadView';
import MemoryListView from './MemoryListView';
import MemoryDetailModal from './MemoryDetailModal';
import '../styles/Dashboard.css';

type DashboardTab = 'hero' | 'add' | 'list';

const DashboardView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<DashboardTab>('hero');
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null);
  const { memories } = useMemory();
  const { logout } = useAuth();
  
  // Get recent memories (last 12) sorted by date
  const recentMemories = [...memories]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 12);

  // Group memories by type
  const memoriesByType = {
    photo: recentMemories.filter(m => m.type === 'photo').slice(0, 3),
    note: recentMemories.filter(m => m.type === 'note').slice(0, 3),
    voice: recentMemories.filter(m => m.type === 'voice').slice(0, 3),
    document: recentMemories.filter(m => m.type === 'document').slice(0, 3),
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
    }
  };

  const handleCardClick = (memory: Memory) => {
    setSelectedMemory(memory);
    // Prevent body scroll when modal is open
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

              {recentMemories.length > 0 ? (
                <div className="recent-memories">
                  {memoriesByType.photo.length > 0 && (
                    <div className="type-section type-photos">
                      <h3>📷 Photos</h3>
                      <div className="memory-grid photos-grid">
                        {memoriesByType.photo.map((memory) => (
                          <div 
                            key={memory.id} 
                            className="memory-card photo-card"
                            onClick={() => handleCardClick(memory)}
                            role="button"
                            tabIndex={0}
                          >
                            <div className="memory-icon">📷</div>
                            <div className="memory-info">
                              <h4>{memory.title}</h4>
                              <p className="memory-description">{memory.description || 'No description'}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {memoriesByType.note.length > 0 && (
                    <div className="type-section type-notes">
                      <h3>📝 Notes</h3>
                      <div className="memory-grid notes-grid">
                        {memoriesByType.note.map((memory) => (
                          <div 
                            key={memory.id} 
                            className="memory-card note-card"
                            onClick={() => handleCardClick(memory)}
                            role="button"
                            tabIndex={0}
                          >
                            <div className="memory-icon">📝</div>
                            <div className="memory-info">
                              <h4>{memory.title}</h4>
                              <p className="memory-description">{memory.description || 'No description'}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {memoriesByType.voice.length > 0 && (
                    <div className="type-section type-voice">
                      <h3>🎙️ Voice Messages</h3>
                      <div className="memory-grid voice-grid">
                        {memoriesByType.voice.map((memory) => (
                          <div 
                            key={memory.id} 
                            className="memory-card voice-card"
                            onClick={() => handleCardClick(memory)}
                            role="button"
                            tabIndex={0}
                          >
                            <div className="memory-icon">🎙️</div>
                            <div className="memory-info">
                              <h4>{memory.title}</h4>
                              <p className="memory-description">{memory.description || 'No description'}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {memoriesByType.document.length > 0 && (
                    <div className="type-section type-documents">
                      <h3>📄 Documents</h3>
                      <div className="memory-grid docs-grid">
                        {memoriesByType.document.map((memory) => (
                          <div 
                            key={memory.id} 
                            className="memory-card doc-card"
                            onClick={() => handleCardClick(memory)}
                            role="button"
                            tabIndex={0}
                          >
                            <div className="memory-icon">📄</div>
                            <div className="memory-info">
                              <h4>{memory.title}</h4>
                              <p className="memory-description">{memory.description || 'No description'}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="empty-state">
                  <p>📭 No Data yet. Start by adding your first Data!</p>
                  <button onClick={() => setActiveTab('add')} className="cta-button">
                    Add Your First Data
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
              // Restore body scroll when modal closes
              document.body.style.overflow = 'unset';
            }} 
          />
        )}
      </main>
    </div>
  );
};

export default DashboardView;
