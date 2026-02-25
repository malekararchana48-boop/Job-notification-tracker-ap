import React from 'react';
import { ContextHeader } from '../components/layout';
import { EmptyState } from '../components/ui';

export const Digest: React.FC = () => {
  return (
    <div className="page">
      <ContextHeader
        title="Daily Digest"
        subtitle="Your personalized morning summary of new opportunities."
      />

      <EmptyState
        title="Your digest is empty"
        description="Once you configure your preferences, you'll receive a daily summary of matching jobs delivered every morning at 9AM."
      />
    </div>
  );
};
