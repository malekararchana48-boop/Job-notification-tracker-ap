export interface Preferences {
  roleKeywords: string;
  preferredLocations: string[];
  preferredMode: string[];
  experienceLevel: string;
  skills: string;
  minMatchScore: number;
}

export const PREFERENCES_KEY = 'jobTrackerPreferences';

export const defaultPreferences: Preferences = {
  roleKeywords: '',
  preferredLocations: [],
  preferredMode: [],
  experienceLevel: '',
  skills: '',
  minMatchScore: 40,
};

export const locations = [
  'Bangalore',
  'Hyderabad',
  'Pune',
  'Chennai',
  'Gurgaon',
  'Mumbai',
  'Noida',
  'Delhi',
  'Kolkata',
  'Faridabad',
  'Patna',
];

export const modes = ['Remote', 'Hybrid', 'Onsite'];

export const experienceLevels = ['Fresher', '0-1', '1-3', '3-5'];

export const loadPreferences = (): Preferences => {
  const saved = localStorage.getItem(PREFERENCES_KEY);
  if (saved) {
    try {
      return { ...defaultPreferences, ...JSON.parse(saved) };
    } catch {
      return defaultPreferences;
    }
  }
  return defaultPreferences;
};

export const savePreferences = (prefs: Preferences): void => {
  localStorage.setItem(PREFERENCES_KEY, JSON.stringify(prefs));
};
