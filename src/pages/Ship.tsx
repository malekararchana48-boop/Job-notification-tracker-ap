import React, { useState, useEffect } from 'react';
import { ContextHeader } from '../components/layout';
import { Button, Badge } from '../components/ui';
import { areAllTestsPassed, getPassedCount, testItems } from '../utils/testChecklist';
import './Ship.css';

export const Ship: React.FC = () => {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [passedCount, setPassedCount] = useState(0);

  // Check test status on mount and when storage changes
  useEffect(() => {
    const checkStatus = () => {
      setIsUnlocked(areAllTestsPassed());
      setPassedCount(getPassedCount());
    };

    checkStatus();

    // Listen for storage changes
    window.addEventListener('storage', checkStatus);
    return () => window.removeEventListener('storage', checkStatus);
  }, []);

  // Locked state - all tests not passed
  if (!isUnlocked) {
    return (
      <div className="page">
        <ContextHeader
          title="Ship"
          subtitle="Deploy your Job Notification Tracker."
        />

        <div className="ship__container">
          <div className="ship__locked">
            <div className="ship__locked-icon">🔒</div>
            <h2 className="ship__locked-title">Complete all tests before shipping.</h2>
            <p className="ship__locked-text">
              You have completed {passedCount} of {testItems.length} required tests.
            </p>
            <div className="ship__locked-progress">
              <div
                className="ship__locked-bar"
                style={{ width: `${(passedCount / testItems.length) * 100}%` }}
              />
            </div>
            <Button
              variant="primary"
              size="lg"
              onClick={() => window.location.href = '/jt/07-test'}
            >
              Go to Test Checklist
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Unlocked state - all tests passed
  return (
    <div className="page">
      <ContextHeader
        title="Ship"
        subtitle="Your Job Notification Tracker is ready for deployment."
      />

      <div className="ship__container">
        <div className="ship__ready">
          <div className="ship__ready-icon">🚀</div>
          <Badge variant="success">All Tests Passed</Badge>
          <h2 className="ship__ready-title">Ready to Ship!</h2>
          <p className="ship__ready-text">
            Congratulations! You have successfully completed all {testItems.length} tests.
            Your Job Notification Tracker is verified and ready for deployment.
          </p>

          <div className="ship__ready-summary">
            <h3 className="ship__ready-subtitle">Features Verified:</h3>
            <ul className="ship__ready-list">
              <li>✓ Premium design system with off-white background</li>
              <li>✓ Preference-based match scoring</li>
              <li>✓ Job saving with localStorage persistence</li>
              <li>✓ Status tracking (Applied, Rejected, Selected)</li>
              <li>✓ Daily digest generation</li>
              <li>✓ Toast notifications</li>
              <li>✓ Responsive navigation</li>
              <li>✓ No console errors</li>
            </ul>
          </div>

          <div className="ship__ready-actions">
            <Button
              variant="primary"
              size="lg"
              onClick={() => window.open('https://github.com/malekararchana48-boop/Job-notification-tracker-ap', '_blank')}
            >
              View on GitHub
            </Button>
            <Button
              variant="secondary"
              size="lg"
              onClick={() => window.location.href = '/jt/07-test'}
            >
              Back to Tests
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
