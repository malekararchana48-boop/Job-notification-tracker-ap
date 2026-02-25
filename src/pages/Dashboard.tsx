import React from 'react';
import { ContextHeader } from '../components/layout';
import { EmptyState } from '../components/ui';

export const Dashboard: React.FC = () => {
  return (
    <div className="page">
      <ContextHeader
        title="Dashboard"
        subtitle="Your personalized job matches and activity overview."
      />

      <EmptyState
        title="No jobs yet"
        description="In the next step, you will load a realistic dataset."
      />
    </div>
  );
};
