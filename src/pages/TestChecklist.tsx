import React, { useState, useEffect, useCallback } from 'react';
import { ContextHeader } from '../components/layout';
import { Button, Badge } from '../components/ui';
import {
  testItems,
  loadTestStatus,
  updateTestStatus,
  getPassedCount,
  resetTestStatus,
} from '../utils/testChecklist';
import './TestChecklist.css';

export const TestChecklist: React.FC = () => {
  const [status, setStatus] = useState<Record<string, boolean>>({});
  const [passedCount, setPassedCount] = useState(0);

  // Load test status on mount
  useEffect(() => {
    const saved = loadTestStatus();
    setStatus(saved);
    setPassedCount(getPassedCount());

    // Listen for storage changes
    const handleStorageChange = () => {
      const updated = loadTestStatus();
      setStatus(updated);
      setPassedCount(getPassedCount());
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleToggle = useCallback((testId: string) => {
    const newStatus = !status[testId];
    updateTestStatus(testId, newStatus);
    setStatus((prev) => ({ ...prev, [testId]: newStatus }));
    setPassedCount(getPassedCount());
  }, [status]);

  const handleReset = useCallback(() => {
    resetTestStatus();
    setStatus({});
    setPassedCount(0);
  }, []);

  const allPassed = passedCount === testItems.length;

  return (
    <div className="page">
      <ContextHeader
        title="Test Checklist"
        subtitle="Verify all features work correctly before shipping."
      />

      <div className="test-checklist__container">
        {/* Summary Header */}
        <div className="test-checklist__summary">
          <div className="test-checklist__score">
            <span className="test-checklist__score-label">Tests Passed:</span>
            <span className="test-checklist__score-value">
              {passedCount} / {testItems.length}
            </span>
            {allPassed ? (
              <Badge variant="success">Ready to Ship</Badge>
            ) : (
              <Badge variant="warning">In Progress</Badge>
            )}
          </div>

          {!allPassed && (
            <p className="test-checklist__warning">
              Resolve all issues before shipping.
            </p>
          )}
        </div>

        {/* Reset Button */}
        <div className="test-checklist__actions">
          <Button variant="secondary" size="sm" onClick={handleReset}>
            Reset Test Status
          </Button>
        </div>

        {/* Checklist */}
        <div className="test-checklist__list">
          {testItems.map((item, index) => (
            <div
              key={item.id}
              className={`test-checklist__item ${
                status[item.id] ? 'test-checklist__item--checked' : ''
              }`}
            >
              <label className="test-checklist__label">
                <input
                  type="checkbox"
                  checked={status[item.id] || false}
                  onChange={() => handleToggle(item.id)}
                  className="test-checklist__checkbox"
                />
                <span className="test-checklist__number">{index + 1}</span>
                <span className="test-checklist__text">{item.label}</span>
              </label>
              <span
                className="test-checklist__tooltip"
                title={item.tooltip}
              >
                How to test
              </span>
            </div>
          ))}
        </div>

        {/* Ship Navigation */}
        <div className="test-checklist__ship">
          {allPassed ? (
            <div className="test-checklist__ship-ready">
              <p className="test-checklist__ship-message">
                All tests passed! You can now proceed to shipping.
              </p>
              <Button
                variant="primary"
                size="lg"
                onClick={() => window.location.href = '/jt/08-ship'}
              >
                Go to Ship Page
              </Button>
            </div>
          ) : (
            <div className="test-checklist__ship-locked">
              <p className="test-checklist__ship-message">
                Complete all tests to unlock the shipping page.
              </p>
              <Button
                variant="secondary"
                size="lg"
                disabled
              >
                Ship Page Locked
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
