export type JobStatus = 'Not Applied' | 'Applied' | 'Rejected' | 'Selected';

export interface StatusUpdate {
  jobId: string;
  jobTitle: string;
  company: string;
  status: JobStatus;
  updatedAt: string;
}

const STATUS_KEY = 'jobTrackerStatus';
const STATUS_HISTORY_KEY = 'jobTrackerStatusHistory';

export const statusOptions: JobStatus[] = ['Not Applied', 'Applied', 'Rejected', 'Selected'];

export const getStatusColor = (status: JobStatus): string => {
  switch (status) {
    case 'Not Applied':
      return 'neutral';
    case 'Applied':
      return 'blue';
    case 'Rejected':
      return 'red';
    case 'Selected':
      return 'green';
    default:
      return 'neutral';
  }
};

export const loadStatuses = (): Record<string, JobStatus> => {
  const saved = localStorage.getItem(STATUS_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      return {};
    }
  }
  return {};
};

export const saveStatus = (jobId: string, status: JobStatus): void => {
  const statuses = loadStatuses();
  statuses[jobId] = status;
  localStorage.setItem(STATUS_KEY, JSON.stringify(statuses));
};

export const getJobStatus = (jobId: string): JobStatus => {
  const statuses = loadStatuses();
  return statuses[jobId] || 'Not Applied';
};

export const loadStatusHistory = (): StatusUpdate[] => {
  const saved = localStorage.getItem(STATUS_HISTORY_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      return [];
    }
  }
  return [];
};

export const addStatusUpdate = (update: StatusUpdate): void => {
  const history = loadStatusHistory();
  // Add to beginning, keep only last 20 updates
  const newHistory = [update, ...history].slice(0, 20);
  localStorage.setItem(STATUS_HISTORY_KEY, JSON.stringify(newHistory));
};

export const getRecentStatusUpdates = (limit: number = 10): StatusUpdate[] => {
  const history = loadStatusHistory();
  return history.slice(0, limit);
};
