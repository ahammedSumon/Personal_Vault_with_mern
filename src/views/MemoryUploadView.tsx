import React, { useState } from 'react';
import { useMemory } from '../context/MemoryContext';
import { validateMemoryTitle, generateId, fileToDataUrl, isImageFile, isAudioFile, isDocumentFile } from '../utils';
import { Memory } from '../types';
import '../styles/MemoryUpload.css';

const MemoryUploadView: React.FC = () => {
  const [memoryType, setMemoryType] = useState<'photo' | 'note' | 'voice' | 'document'>('photo');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [noteContent, setNoteContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { addMemory } = useMemory();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (memoryType === 'photo' && !isImageFile(selectedFile)) {
        setError('Please select a valid image file');
        return;
      }
      if (memoryType === 'voice' && !isAudioFile(selectedFile)) {
        setError('Please select a valid audio file');
        return;
      }
      if (memoryType === 'document' && !isDocumentFile(selectedFile)) {
        setError('Please select a valid document file (PDF, Word, Excel, etc.)');
        return;
      }
      setFile(selectedFile);
      setError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validate title
    const titleValidation = validateMemoryTitle(title);
    if (!titleValidation.valid) {
      setError(titleValidation.error || 'Invalid title');
      return;
    }

    setIsLoading(true);

    try {
      let thumbnail: string | undefined;
      let content: string = '';

      if (memoryType === 'note') {
        content = noteContent;
      } else if (file) {
        // Convert all file types to base64 for storage
        content = await fileToDataUrl(file);
        
        // For photos, also set thumbnail
        if (memoryType === 'photo') {
          thumbnail = content;
        }
      } else {
        setError('Please select a file');
        setIsLoading(false);
        return;
      }

      const newMemory: Memory = {
        id: generateId(),
        type: memoryType,
        title,
        content,
        description,
        thumbnail,
        createdAt: new Date().toISOString()
      };

      await addMemory(newMemory);

      // Reset form
      setTitle('');
      setDescription('');
      setNoteContent('');
      setFile(null);
      setSuccess('Memory added successfully!');

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to add memory. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="memory-upload-container">
      <div className="upload-card">
        <h2>Add New Memory</h2>

        <form onSubmit={handleSubmit} className="upload-form">
          {/* Memory Type Selection */}
          <div className="form-group">
            <label>Memory Type</label>
            <div className="type-selector">
              <button
                type="button"
                className={`type-button ${memoryType === 'photo' ? 'active' : ''}`}
                onClick={() => {
                  setMemoryType('photo');
                  setFile(null);
                }}
              >
                📷 Photo
              </button>
              <button
                type="button"
                className={`type-button ${memoryType === 'note' ? 'active' : ''}`}
                onClick={() => {
                  setMemoryType('note');
                  setFile(null);
                }}
              >
                📝 Note
              </button>
              <button
                type="button"
                className={`type-button ${memoryType === 'voice' ? 'active' : ''}`}
                onClick={() => {
                  setMemoryType('voice');
                  setFile(null);
                }}
              >
                🎙️ Voice
              </button>
              <button
                type="button"
                className={`type-button ${memoryType === 'document' ? 'active' : ''}`}
                onClick={() => {
                  setMemoryType('document');
                  setFile(null);
                }}
              >
                📄 Document
              </button>
            </div>
          </div>

          {/* Title */}
          <div className="form-group">
            <label htmlFor="title">Title *</label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Give your memory a title"
              disabled={isLoading}
              required
              maxLength={100}
            />
            <span className="char-count">{title.length}/100</span>
          </div>

          {/* Description */}
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add some context (optional)"
              disabled={isLoading}
              rows={3}
              maxLength={500}
            />
            <span className="char-count">{description.length}/500</span>
          </div>

          {/* File Input for Photo/Voice/Document */}
          {(memoryType === 'photo' || memoryType === 'voice' || memoryType === 'document') && (
            <div className="form-group">
              <label htmlFor="file">
                {memoryType === 'photo' ? 'Select Photo' : memoryType === 'voice' ? 'Select Audio File' : 'Select Document'} *
              </label>
              <label htmlFor="file" className="file-input-wrapper">
                <input
                  id="file"
                  type="file"
                  onChange={handleFileChange}
                  accept={memoryType === 'photo' ? 'image/*' : memoryType === 'voice' ? 'audio/*' : '.pdf,.doc,.docx,.xls,.xlsx,.txt'}
                  disabled={isLoading}
                  required
                />
                <span className="file-name">
                  {file ? file.name : 'Click to select file'}
                </span>
              </label>
            </div>
          )}

          {/* Note Content */}
          {memoryType === 'note' && (
            <div className="form-group">
              <label htmlFor="noteContent">Note Content *</label>
              <textarea
                id="noteContent"
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                placeholder="Write your note here..."
                disabled={isLoading}
                rows={8}
                required
              />
            </div>
          )}

          {/* Error Message */}
          {error && <div className="form-error">{error}</div>}

          {/* Success Message */}
          {success && <div className="form-success">{success}</div>}

          {/* Submit Button */}
          <button type="submit" className="submit-button" disabled={isLoading}>
            {isLoading ? 'Adding Memory...' : 'Add Memory'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default MemoryUploadView;
