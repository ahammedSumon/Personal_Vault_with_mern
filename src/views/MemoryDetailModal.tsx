import React from 'react';
import { Memory } from '../types';
import { formatDate } from '../utils';
import '../styles/MemoryDetail.css';

interface MemoryDetailModalProps {
  memory: Memory;
  onClose: () => void;
}

const MemoryDetailModal: React.FC<MemoryDetailModalProps> = ({ memory, onClose }) => {
  const handleDownload = () => {
    if (memory.type === 'photo' && memory.thumbnail) {
      const link = document.createElement('a');
      link.href = memory.thumbnail;
      link.download = `${memory.title}-photo.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else if (memory.type === 'voice' && typeof memory.content === 'string' && memory.content.startsWith('data:')) {
      const link = document.createElement('a');
      link.href = memory.content;
      link.download = `${memory.title}-voice.webm`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else if (memory.type === 'document' && typeof memory.content === 'string' && memory.content.startsWith('data:')) {
      const link = document.createElement('a');
      link.href = memory.content;
      link.download = `${memory.title}-document`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else if (memory.type === 'note' && typeof memory.content === 'string') {
      const element = document.createElement('a');
      element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(memory.content));
      element.setAttribute('download', `${memory.title}-note.txt`);
      element.style.display = 'none';
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>✕</button>

        <div className="modal-header">
          <div className="modal-icon">
            {memory.type === 'photo' && '📷'}
            {memory.type === 'note' && '📝'}
            {memory.type === 'voice' && '🎙️'}
            {memory.type === 'document' && '📄'}
          </div>
          <div>
            <h2>{memory.title}</h2>
            <p className="modal-date">{formatDate(memory.createdAt)}</p>
          </div>
        </div>

        <div className="modal-body">
          {memory.type === 'photo' && memory.thumbnail && (
            <div className="modal-section">
              <img src={memory.thumbnail} alt={memory.title} className="modal-image" />
            </div>
          )}

          {memory.type === 'note' && typeof memory.content === 'string' && (
            <div className="modal-section">
              <h3>Note Content:</h3>
              <div className="note-content">
                {memory.content}
              </div>
            </div>
          )}

          {memory.type === 'voice' && (
            <div className="modal-section">
              <h3>Voice Message:</h3>
              {typeof memory.content === 'string' && memory.content.startsWith('data:') ? (
                <audio controls className="modal-audio">
                  <source src={memory.content} type="audio/webm" />
                  Your browser does not support the audio element.
                </audio>
              ) : (
                <p className="modal-placeholder">No audio file available</p>
              )}
            </div>
          )}

          {memory.type === 'document' && (
            <div className="modal-section">
              <h3>Document:</h3>
              <div className="doc-preview">
                <div className="doc-icon">📄</div>
                <p>File type: {memory.content instanceof File ? memory.content.type : 'Unknown'}</p>
                <p className="doc-name">{memory.title}</p>
              </div>
            </div>
          )}

          {memory.description && (
            <div className="modal-section">
              <h3>Description:</h3>
              <p className="modal-description">{memory.description}</p>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="modal-button cancel-button" onClick={onClose}>
            Close
          </button>
          <button className="modal-button download-button" onClick={handleDownload}>
            ⬇️ Download
          </button>
        </div>
      </div>
    </div>
  );
};

export default MemoryDetailModal;
