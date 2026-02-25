import React from 'react';
import { ContextHeader } from '../components/layout';
import { Card, CardHeader, CardTitle, CardContent, Input } from '../components/ui';
import './Settings.css';

export const Settings: React.FC = () => {
  return (
    <div className="page">
      <ContextHeader
        title="Settings"
        subtitle="Configure your job preferences to receive personalized matches."
      />

      <div className="settings__container">
        <Card>
          <CardHeader>
            <CardTitle>Job Preferences</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="settings__fields">
              <div className="settings__field">
                <Input
                  label="Role Keywords"
                  placeholder="e.g., Senior Developer, Product Manager"
                  helperText="Enter job titles or keywords you're looking for."
                  fullWidth
                />
              </div>

              <div className="settings__field">
                <Input
                  label="Preferred Locations"
                  placeholder="e.g., San Francisco, Remote, New York"
                  helperText="Specify cities, regions, or 'Remote' for remote positions."
                  fullWidth
                />
              </div>

              <div className="settings__field">
                <label className="settings__field-label">Work Mode</label>
                <div className="settings__options">
                  <label className="settings__option">
                    <input type="checkbox" className="settings__checkbox" />
                    <span className="settings__option-label">Remote</span>
                  </label>
                  <label className="settings__option">
                    <input type="checkbox" className="settings__checkbox" />
                    <span className="settings__option-label">Hybrid</span>
                  </label>
                  <label className="settings__option">
                    <input type="checkbox" className="settings__checkbox" />
                    <span className="settings__option-label">Onsite</span>
                  </label>
                </div>
              </div>

              <div className="settings__field">
                <label className="settings__field-label">Experience Level</label>
                <div className="settings__options">
                  <label className="settings__option">
                    <input type="radio" name="experience" className="settings__radio" />
                    <span className="settings__option-label">Entry Level</span>
                  </label>
                  <label className="settings__option">
                    <input type="radio" name="experience" className="settings__radio" />
                    <span className="settings__option-label">Mid Level</span>
                  </label>
                  <label className="settings__option">
                    <input type="radio" name="experience" className="settings__radio" />
                    <span className="settings__option-label">Senior Level</span>
                  </label>
                  <label className="settings__option">
                    <input type="radio" name="experience" className="settings__radio" />
                    <span className="settings__option-label">Executive</span>
                  </label>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
