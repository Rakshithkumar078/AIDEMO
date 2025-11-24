import React from 'react';

export interface ErrorAlertProps {
  error: string;
  onDismiss?: () => void;
  variant?: 'danger' | 'warning' | 'info';
  className?: string;
}

const ErrorAlert: React.FC<ErrorAlertProps> = ({ 
  error, 
  onDismiss, 
  variant = 'danger',
  className = '' 
}) => {
  if (!error) return null;

  const getIcon = () => {
    switch (variant) {
      case 'warning':
        return 'fas fa-exclamation-triangle';
      case 'info':
        return 'fas fa-info-circle';
      default:
        return 'fas fa-exclamation-circle';
    }
  };

  return (
    <div className={`alert alert-${variant} alert-dismissible d-flex align-items-center ${className}`} role="alert">
      <i className={`${getIcon()} me-2`}></i>
      <div className="flex-grow-1">
        {error}
      </div>
      {onDismiss && (
        <button
          type="button"
          className="btn-close"
          onClick={onDismiss}
          aria-label="Close"
        ></button>
      )}
    </div>
  );
};

export default ErrorAlert;