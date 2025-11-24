import React from 'react';

export interface ProgressStage {
  id: string;
  label: string;
  icon: string;
  status: 'pending' | 'active' | 'completed' | 'error';
}

interface ProgressStagesProps {
  stages: ProgressStage[];
  className?: string;
}

const ProgressStages: React.FC<ProgressStagesProps> = ({ stages, className = '' }) => {
  return (
    <div className={`progress-stages ${className}`}>
      {stages.map((stage, index) => (
        <div 
          key={stage.id} 
          className={`progress-stage ${stage.status}`}
        >
          <div className={`stage-icon ${stage.status}`}>
            {stage.status === 'completed' ? (
              <i className="fas fa-check"></i>
            ) : stage.status === 'error' ? (
              <i className="fas fa-times"></i>
            ) : stage.status === 'active' ? (
              <i className="fas fa-spinner fa-spin"></i>
            ) : (
              <i className={stage.icon}></i>
            )}
          </div>
          <div className="stage-label">
            {stage.label}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProgressStages;