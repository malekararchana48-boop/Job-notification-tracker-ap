import React from 'react';
import './TopBar.css';

export type StatusType = 'not-started' | 'in-progress' | 'shipped';

interface TopBarProps {
  appName?: string;
  currentStep?: number;
  totalSteps?: number;
  status?: StatusType;
}

const statusLabels: Record<StatusType, string> = {
  'not-started': 'Not Started',
  'in-progress': 'In Progress',
  'shipped': 'Shipped',
};

export const TopBar: React.FC<TopBarProps> = ({
  appName = 'Job Notification App',
  currentStep = 1,
  totalSteps = 5,
  status = 'not-started',
}) => {
  return (
    <header className="top-bar">
      <div className="top-bar__left">
        <span className="top-bar__app-name">{appName}</span>
      </div>
      <div className="top-bar__center">
        <span className="top-bar__progress">
          Step {currentStep} / {totalSteps}
        </span>
      </div>
      <div className="top-bar__right">
        <span className={`top-bar__status top-bar__status--${status}`}>
          {statusLabels[status]}
        </span>
      </div>
    </header>
  );
};
