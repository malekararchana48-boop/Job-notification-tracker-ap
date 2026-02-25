import React from 'react';
import './ContextHeader.css';

interface ContextHeaderProps {
  title: string;
  subtitle?: string;
}

export const ContextHeader: React.FC<ContextHeaderProps> = ({
  title,
  subtitle,
}) => {
  return (
    <div className="context-header">
      <h1 className="context-header__title">{title}</h1>
      {subtitle && (
        <p className="context-header__subtitle">{subtitle}</p>
      )}
    </div>
  );
};
