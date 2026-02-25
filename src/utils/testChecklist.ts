export interface TestItem {
  id: string;
  label: string;
  tooltip: string;
}

export interface TestStatus {
  [testId: string]: boolean;
}

const TEST_STATUS_KEY = 'jobTrackerTestStatus';

export const testItems: TestItem[] = [
  {
    id: 'prefs-persist',
    label: 'Preferences persist after refresh',
    tooltip: 'Go to Settings, set preferences, refresh page, verify they remain',
  },
  {
    id: 'match-score',
    label: 'Match score calculates correctly',
    tooltip: 'Set preferences with keywords, check jobs show correct match scores',
  },
  {
    id: 'show-matches-toggle',
    label: '"Show only matches" toggle works',
    tooltip: 'Toggle "Show only matches" on Dashboard, verify filtering works',
  },
  {
    id: 'save-persist',
    label: 'Save job persists after refresh',
    tooltip: 'Save a job, refresh page, verify it remains in Saved section',
  },
  {
    id: 'apply-new-tab',
    label: 'Apply opens in new tab',
    tooltip: 'Click Apply button, verify job opens in new tab',
  },
  {
    id: 'status-persist',
    label: 'Status update persists after refresh',
    tooltip: 'Change job status, refresh page, verify status remains',
  },
  {
    id: 'status-filter',
    label: 'Status filter works correctly',
    tooltip: 'Use Status filter on Dashboard, verify correct jobs show',
  },
  {
    id: 'digest-top10',
    label: 'Digest generates top 10 by score',
    tooltip: 'Generate digest, verify top 10 highest match score jobs shown',
  },
  {
    id: 'digest-persist',
    label: 'Digest persists for the day',
    tooltip: 'Generate digest, refresh page, verify same digest loads',
  },
  {
    id: 'no-console-errors',
    label: 'No console errors on main pages',
    tooltip: 'Open browser console, navigate all pages, verify no errors',
  },
];

export const loadTestStatus = (): TestStatus => {
  const saved = localStorage.getItem(TEST_STATUS_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      return {};
    }
  }
  return {};
};

export const saveTestStatus = (status: TestStatus): void => {
  localStorage.setItem(TEST_STATUS_KEY, JSON.stringify(status));
};

export const updateTestStatus = (testId: string, checked: boolean): void => {
  const status = loadTestStatus();
  status[testId] = checked;
  saveTestStatus(status);
};

export const getTestStatus = (testId: string): boolean => {
  const status = loadTestStatus();
  return status[testId] || false;
};

export const getPassedCount = (): number => {
  const status = loadTestStatus();
  return testItems.filter((item) => status[item.id]).length;
};

export const areAllTestsPassed = (): boolean => {
  return getPassedCount() === testItems.length;
};

export const resetTestStatus = (): void => {
  localStorage.removeItem(TEST_STATUS_KEY);
};
