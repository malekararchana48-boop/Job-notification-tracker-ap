import React, { useState, useEffect } from 'react';
import { ContextHeader } from '../components/layout';
import { Card, CardHeader, CardTitle, CardContent, Input, Button } from '../components/ui';
import {
  type Preferences,
  defaultPreferences,
  locations,
  modes,
  experienceLevels,
  loadPreferences,
  savePreferences,
} from '../data/preferences';
import './Settings.css';

export const Settings: React.FC = () => {
  const [prefs, setPrefs] = useState<Preferences>(defaultPreferences);
  const [isSaved, setIsSaved] = useState(false);

  // Load preferences on mount
  useEffect(() => {
    const loaded = loadPreferences();
    setPrefs(loaded);
  }, []);

  const handleChange = (field: keyof Preferences, value: string | string[] | number) => {
    setPrefs((prev) => ({ ...prev, [field]: value }));
    setIsSaved(false);
  };

  const handleLocationToggle = (location: string) => {
    setPrefs((prev) => {
      const newLocations = prev.preferredLocations.includes(location)
        ? prev.preferredLocations.filter((l) => l !== location)
        : [...prev.preferredLocations, location];
      return { ...prev, preferredLocations: newLocations };
    });
    setIsSaved(false);
  };

  const handleModeToggle = (mode: string) => {
    setPrefs((prev) => {
      const newModes = prev.preferredMode.includes(mode)
        ? prev.preferredMode.filter((m) => m !== mode)
        : [...prev.preferredMode, mode];
      return { ...prev, preferredMode: newModes };
    });
    setIsSaved(false);
  };

  const handleSave = () => {
    savePreferences(prefs);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleClear = () => {
    setPrefs(defaultPreferences);
    savePreferences(defaultPreferences);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

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
              {/* Role Keywords */}
              <div className="settings__field">
                <Input
                  label="Role Keywords"
                  placeholder="e.g., Developer, Engineer, Analyst"
                  helperText="Enter comma-separated job titles or keywords you're looking for."
                  fullWidth
                  value={prefs.roleKeywords}
                  onChange={(e) => handleChange('roleKeywords', e.target.value)}
                />
              </div>

              {/* Preferred Locations */}
              <div className="settings__field">
                <label className="settings__field-label">Preferred Locations</label>
                <div className="settings__options settings__options--multi">
                  {locations.map((location) => (
                    <label key={location} className="settings__option">
                      <input
                        type="checkbox"
                        className="settings__checkbox"
                        checked={prefs.preferredLocations.includes(location)}
                        onChange={() => handleLocationToggle(location)}
                      />
                      <span className="settings__option-label">{location}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Work Mode */}
              <div className="settings__field">
                <label className="settings__field-label">Preferred Work Mode</label>
                <div className="settings__options">
                  {modes.map((mode) => (
                    <label key={mode} className="settings__option">
                      <input
                        type="checkbox"
                        className="settings__checkbox"
                        checked={prefs.preferredMode.includes(mode)}
                        onChange={() => handleModeToggle(mode)}
                      />
                      <span className="settings__option-label">{mode}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Experience Level */}
              <div className="settings__field">
                <label className="settings__field-label">Experience Level</label>
                <select
                  className="settings__select"
                  value={prefs.experienceLevel}
                  onChange={(e) => handleChange('experienceLevel', e.target.value)}
                >
                  <option value="">Select experience level</option>
                  {experienceLevels.map((level) => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </select>
              </div>

              {/* Skills */}
              <div className="settings__field">
                <Input
                  label="Skills"
                  placeholder="e.g., React, Python, SQL, Java"
                  helperText="Enter comma-separated skills you possess."
                  fullWidth
                  value={prefs.skills}
                  onChange={(e) => handleChange('skills', e.target.value)}
                />
              </div>

              {/* Min Match Score Slider */}
              <div className="settings__field">
                <label className="settings__field-label">
                  Minimum Match Score: {prefs.minMatchScore}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={prefs.minMatchScore}
                  onChange={(e) => handleChange('minMatchScore', parseInt(e.target.value))}
                  className="settings__slider"
                />
                <span className="settings__slider-hint">
                  Jobs below this threshold will be hidden when "Show only matches" is enabled.
                </span>
              </div>

              {/* Action Buttons */}
              <div className="settings__actions">
                <Button variant="primary" onClick={handleSave}>
                  {isSaved ? 'Saved!' : 'Save Preferences'}
                </Button>
                <Button variant="secondary" onClick={handleClear}>
                  Clear All
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
