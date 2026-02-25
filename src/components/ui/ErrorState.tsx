import React from 'react';
import './ErrorState.css';
import { Button } from './Button';

interface ErrorStateProps {
  title?: string;
  message: string;
  solution?: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Something went wrong',
  message,
  solution,
  onRetry,
  className = '',
}) => {
  return (
    <div className={`error-state ${className}`} role="alert">
      <div className="error-state__icon" aria-hidden="true">
        <svg
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      </div>
      <h3 className="error-state__title">{title}</h3>
      <p className="error-state__message">{message}</p>
      {solution && (
        <div className="error-state__solution">
          <span className="error-state__solution-label">How to fix:</span>
          <p className="error-state__solution-text">{solution}</p>
        </div>
      )}
      {onRetry && (
        <Button variant="primary" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  );
};
