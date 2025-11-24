import React, { useState } from 'react';
import './SourceReferences.css';

export interface SourceReference {
  document: string;
  page?: number;
  confidence: number;
  content: string;
}

interface SourceReferencesProps {
  sources: SourceReference[];
  className?: string;
}

const SourceReferences: React.FC<SourceReferencesProps> = ({ sources, className = '' }) => {
  const [expandedSources, setExpandedSources] = useState<Set<number>>(new Set());

  const toggleSource = (index: number) => {
    const newExpanded = new Set(expandedSources);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedSources(newExpanded);
  };

  const getConfidenceBadgeClass = (confidence: number): string => {
    if (confidence >= 0.8) return 'confidence-high';
    if (confidence >= 0.6) return 'confidence-medium';
    return 'confidence-low';
  };

  const getConfidenceLabel = (confidence: number): string => {
    if (confidence >= 0.8) return 'High';
    if (confidence >= 0.6) return 'Medium';
    return 'Low';
  };

  const formatDocumentName = (document: string): string => {
    // Extract filename from path and remove any prefixes
    const filename = document.split('/').pop() || document;
    return filename.replace(/^[^_]*_/, '');
  };

  const truncateContent = (content: string, maxLength: number = 150): string => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  if (!sources || sources.length === 0) {
    return null;
  }

  return (
    <div className={`source-references ${className}`}>
      <div className="source-references-header">
        <i className="fas fa-file-alt me-2"></i>
        <span className="fw-bold">Sources ({sources.length})</span>
      </div>
      
      <div className="source-references-list">
        {sources.map((source, index) => (
          <div 
            key={index} 
            className={`source-card ${expandedSources.has(index) ? 'expanded' : ''}`}
          >
            <div 
              className="source-card-header"
              onClick={() => toggleSource(index)}
              role="button"
              tabIndex={0}
              onKeyPress={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  toggleSource(index);
                }
              }}
            >
              <div className="source-info">
                <div className="source-document">
                  <i className="fas fa-file me-2"></i>
                  <span className="document-name">
                    {formatDocumentName(source.document)}
                  </span>
                  {source.page && (
                    <span className="page-number">
                      <i className="fas fa-bookmark ms-2 me-1"></i>
                      Page {source.page}
                    </span>
                  )}
                </div>
                <div className="source-meta">
                  <span 
                    className={`confidence-badge ${getConfidenceBadgeClass(source.confidence)}`}
                    title={`Confidence: ${Math.round(source.confidence * 100)}%`}
                  >
                    {getConfidenceLabel(source.confidence)} {Math.round(source.confidence * 100)}%
                  </span>
                  <i className={`fas fa-chevron-${expandedSources.has(index) ? 'up' : 'down'} expand-icon`}></i>
                </div>
              </div>
            </div>
            
            <div className="source-card-body">
              <div className="source-content-preview">
                <div className="content-text">
                  {expandedSources.has(index) ? source.content : truncateContent(source.content)}
                </div>
                {!expandedSources.has(index) && source.content.length > 150 && (
                  <button 
                    className="btn btn-link btn-sm p-0 expand-link"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleSource(index);
                    }}
                  >
                    Show more
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SourceReferences;