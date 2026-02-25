import React from 'react';
import './StatusIndicator.css';

export type StatusState = 'idle' | 'loading' | 'success' | 'error';

interface StatusIndicatorProps {
  state?: StatusState;
  message?: string;
  className?: string;
}

const stateMessages: Record<StatusState, string> = {
  idle: 'Ready',
  loading: 'Processing...',
  success: 'Completed successfully',
  error: 'Something went wrong',
};

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  state = 'idle',
  message,
  className = '',
}) => {
  const displayMessage = message || stateMessages[state];

  return (
    <div className={`status-indicator status-indicator--${state} ${className}`}>
      <span className="status-indicator__dot" aria-hidden="true" />
      <span className="status-indicator__message">{displayMessage}</span>
    </div>
  );
};
