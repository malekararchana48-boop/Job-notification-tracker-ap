import React from 'react';
import './Workspace.css';

interface WorkspaceProps {
  children: React.ReactNode;
  sidebar?: React.ReactNode;
}

export const Workspace: React.FC<WorkspaceProps> = ({ children, sidebar }) => {
  return (
    <div className="workspace">
      <main className="workspace__primary">{children}</main>
      {sidebar && (
        <aside className="workspace__secondary">{sidebar}</aside>
      )}
    </div>
  );
};
