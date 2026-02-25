import React from 'react';
import { ContextHeader } from '../components/layout';
import { EmptyState } from '../components/ui';

export const Saved: React.FC = () => {
  return (
    <div className="page">
      <ContextHeader
        title="Saved Jobs"
        subtitle="Jobs you've bookmarked for later consideration."
      />

      <EmptyState
        title="No saved jobs yet"
        description="When you find interesting opportunities, save them here to review later. Your saved jobs will appear in this space."
      />
    </div>
  );
};
