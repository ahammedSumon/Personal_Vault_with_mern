import React, { useState } from 'react';
import { Memory } from '../types';
import { fileToDataUrl, isImageFile, isAudioFile, isDocumentFile } from '../utils';
import '../styles/MemoryEdit.css';

interface MemoryEditViewProps {
  memory: Memory;
  onSave: (updatedMemory: Partial<Memory>) => void;
  onClose: () => void;
}

const MemoryEditView: React.FC<MemoryEditViewProps> = ({ memory, onSave, onClose }) => {
  const [title, setTitle] = useState(memory.title);
  const [description, setDescription] = useState(memory.description || '');
  const [noteContent, setNoteContent] = useState(
    typeof memory.content === 'string' && memory.type === 'note' ? memory.content : ''
  );
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | undefined>(memory.thumbnail);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (memory.type === 'photo' && !isImageFile(selectedFile)) {
        setError('Please select a valid image file');
        return;
      }
      if (memory.type === 'voice' && !isAudioFile(selectedFile)) {
        setError('Please select a valid audio file');
        return;
      }
      if (memory.type === 'document' && !isDocumentFile(selectedFile)) {
        setError('Please select a valid document file');
        return;
      }

      setFile(selectedFile);
      setError('');

      // Generate preview for images
      if (memory.type === 'photo') {
        const newPreview = await fileToDataUrl(selectedFile);
        setPreview(newPreview);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    setIsLoading(true);

    try {
      const updates: Partial<Memory> = {
        title,
        description,
      };

      if (memory.type === 'note') {
        updates.content = noteContent;
      }

      if (file && (memory.type === 'photo' || memory.type === 'voice' || memory.type === 'document')) {
        updates.content = file.name;
        if (memory.type === 'photo' && preview) {
          updates.thumbnail = preview;
        }
      }

      onSave(updates);
      setSuccess('Memory updated successfully!');

      setTimeout(() => {
        onClose();
      }, 500);
    } catch (err) {
      setError('Failed to update memory. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="edit-modal-overlay">
      <div className="edit-modal">
        <div className="edit-modal-header">
          <h2>Edit Memory</h2>
          <button className="close-button" onClick={onClose} disabled={isLoading}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="edit-form">
          {/* Title */}
          <div className="form-group">
            <label htmlFor="edit-title">Title *</label>
            <input
              id="edit-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Memory title"
              disabled={isLoading}
              required
              maxLength={100}
            />
            <span className="char-count">{title.length}/100</span>
          </div>

          {/* Description */}
          <div className="form-group">
            <label htmlFor="edit-description">Description</label>
            <textarea
              id="edit-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add some context (optional)"
              disabled={isLoading}
              rows={3}
              maxLength={500}
            />
            <span className="char-count">{description.length}/500</span>
          </div>

          {/* Note Content - Only for notes */}
          {memory.type === 'note' && (
            <div className="form-group">
              <label htmlFor="edit-note-content">Note Content</label>
              <textarea
                id="edit-note-content"
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                placeholder="Edit note content..."
                disabled={isLoading}
                rows={8}
              />
            </div>
          )}

          {/* File Upload for Photo/Voice/Document */}
          {(memory.type === 'photo' || memory.type === 'voice' || memory.type === 'document') && (
            <div className="form-group">
              <label htmlFor="edit-file">
                {memory.type === 'photo' ? 'Change Photo (Optional)' : memory.type === 'voice' ? 'Change Audio (Optional)' : 'Change Document (Optional)'}
              </label>

              {memory.type === 'photo' && preview && (
                <div className="preview-container">
                  <img src={preview} alt="Preview" className="preview-image" />
                </div>
              )}

              <label htmlFor="edit-file" className="file-input-wrapper">
                <input
                  id="edit-file"
                  type="file"
                  onChange={handleFileChange}
                  accept={memory.type === 'photo' ? 'image/*' : memory.type === 'voice' ? 'audio/*' : '.pdf,.doc,.docx,.xls,.xlsx,.txt'}
                  disabled={isLoading}
                />
                <span className="file-name">
                  {file ? file.name : 'Click to change file'}
                </span>
              </label>
            </div>
          )}

          {/* Memory Info */}
          <div className="memory-info">
            <p>
              <strong>Type:</strong> {memory.type === 'photo' ? '📷 Photo' : memory.type === 'note' ? '📝 Note' : memory.type === 'voice' ? '🎙️ Voice' : '📄 Document'}
            </p>
            <p>
              <strong>Created:</strong> {new Date(memory.createdAt).toLocaleString()}
            </p>
          </div>

          {/* Error Message */}
          {error && <div className="form-error">{error}</div>}

          {/* Success Message */}
          {success && <div className="form-success">{success}</div>}

          {/* Buttons */}
          <div className="edit-buttons">
            <button type="button" className="cancel-button" onClick={onClose} disabled={isLoading}>
              Cancel
            </button>
            <button type="submit" className="save-button" disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MemoryEditView;
