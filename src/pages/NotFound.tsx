import React from 'react';
import { ContextHeader } from '../components/layout';

export const NotFound: React.FC = () => {
  return (
    <div className="page">
      <ContextHeader
        title="Page Not Found"
        subtitle="The page you are looking for does not exist."
      />
    </div>
  );
};
