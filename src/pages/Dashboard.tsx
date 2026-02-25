import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { ContextHeader } from '../components/layout';
import { JobCard, JobModal, FilterBar, EmptyState, Button, ToastContainer } from '../components/ui';
import { useToast } from '../components/ui';
import { jobs } from '../data/jobs';
import { loadPreferences } from '../data/preferences';
import { calculateMatchScore, type JobWithScore } from '../utils/matchScore';
import type { FilterState } from '../components/ui';
import type { JobStatus } from '../utils/status';
import { getJobStatus, saveStatus, addStatusUpdate } from '../utils/status';
import './Dashboard.css';

const SAVED_JOBS_KEY = 'jobTracker_savedJobs';

// Status store for reactive updates
let statusListeners: (() => void)[] = [];
const notifyStatusListeners = () => statusListeners.forEach((cb) => cb());

export const Dashboard: React.FC = () => {
  const [filters, setFilters] = useState<FilterState>({
    keyword: '',
    location: 'All',
    mode: 'All',
    experience: 'All',
    source: 'All',
    sort: 'latest',
    status: 'All',
  });

  const [selectedJob, setSelectedJob] = useState<JobWithScore | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [savedJobIds, setSavedJobIds] = useState<string[]>([]);
  const [showOnlyMatches, setShowOnlyMatches] = useState(false);
  const [hasPreferences, setHasPreferences] = useState(false);
  const [minMatchScore, setMinMatchScore] = useState(40);
  const [statusVersion, setStatusVersion] = useState(0);
  const { toasts, addToast, removeToast } = useToast();

  // Load saved jobs and preferences from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(SAVED_JOBS_KEY);
    if (saved) {
      try {
        setSavedJobIds(JSON.parse(saved));
      } catch {
        setSavedJobIds([]);
      }
    }

    const prefs = loadPreferences();
    const hasAnyPreference = !!(
      prefs.roleKeywords ||
      prefs.preferredLocations.length > 0 ||
      prefs.preferredMode.length > 0 ||
      prefs.experienceLevel ||
      prefs.skills
    );
    setHasPreferences(hasAnyPreference);
    setMinMatchScore(prefs.minMatchScore);

    // Listen for preference changes from other tabs/pages
    const handleStorageChange = () => {
      const updatedPrefs = loadPreferences();
      const hasAny = !!(
        updatedPrefs.roleKeywords ||
        updatedPrefs.preferredLocations.length > 0 ||
        updatedPrefs.preferredMode.length > 0 ||
        updatedPrefs.experienceLevel ||
        updatedPrefs.skills
      );
      setHasPreferences(hasAny);
      setMinMatchScore(updatedPrefs.minMatchScore);
    };

    window.addEventListener('storage', handleStorageChange);

    // Listen for status changes
    const handleStatusChange = () => setStatusVersion((v) => v + 1);
    statusListeners.push(handleStatusChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      statusListeners = statusListeners.filter((cb) => cb !== handleStatusChange);
    };
  }, []);

  // Save to localStorage whenever savedJobIds changes
  useEffect(() => {
    localStorage.setItem(SAVED_JOBS_KEY, JSON.stringify(savedJobIds));
  }, [savedJobIds]);

  const handleStatusChange = useCallback((jobId: string, status: JobStatus) => {
    const job = jobs.find((j) => j.id === jobId);
    if (!job) return;

    const prevStatus = getJobStatus(jobId);
    if (prevStatus === status) return;

    saveStatus(jobId, status);

    // Add to history
    addStatusUpdate({
      jobId,
      jobTitle: job.title,
      company: job.company,
      status,
      updatedAt: new Date().toISOString(),
    });

    // Show toast for Applied, Rejected, Selected
    if (status !== 'Not Applied') {
      addToast(`Status updated: ${status}`, 'success');
    }

    // Trigger re-render
    setStatusVersion((v) => v + 1);
    notifyStatusListeners();
  }, [addToast]);

  // Calculate match scores for all jobs
  const jobsWithScores = useMemo(() => {
    const prefs = loadPreferences();
    return jobs.map((job) => ({
      ...job,
      matchScore: calculateMatchScore(job, prefs),
    }));
  }, [statusVersion]);

  const filteredJobs = useMemo(() => {
    let result = [...jobsWithScores];

    // Keyword filter (title or company)
    if (filters.keyword) {
      const keyword = filters.keyword.toLowerCase();
      result = result.filter(
        (job) =>
          job.title.toLowerCase().includes(keyword) ||
          job.company.toLowerCase().includes(keyword)
      );
    }

    // Location filter
    if (filters.location !== 'All') {
      result = result.filter((job) => job.location === filters.location);
    }

    // Mode filter
    if (filters.mode !== 'All') {
      result = result.filter((job) => job.mode === filters.mode);
    }

    // Experience filter
    if (filters.experience !== 'All') {
      result = result.filter((job) => job.experience === filters.experience);
    }

    // Source filter
    if (filters.source !== 'All') {
      result = result.filter((job) => job.source === filters.source);
    }

    // Status filter (AND logic with all other filters)
    if (filters.status !== 'All') {
      result = result.filter((job) => getJobStatus(job.id) === filters.status);
    }

    // Show only matches toggle
    if (showOnlyMatches) {
      result = result.filter((job) => job.matchScore >= minMatchScore);
    }

    // Sort
    switch (filters.sort) {
      case 'latest':
        result.sort((a, b) => a.postedDaysAgo - b.postedDaysAgo);
        break;
      case 'oldest':
        result.sort((a, b) => b.postedDaysAgo - a.postedDaysAgo);
        break;
      case 'match-score':
        result.sort((a, b) => b.matchScore - a.matchScore);
        break;
      case 'salary-high':
        // Simple sort by extracting first number from salary range
        result.sort((a, b) => {
          const getFirstNum = (s: string) => {
            const match = s.match(/\d+/);
            return match ? parseInt(match[0]) : 0;
          };
          return getFirstNum(b.salaryRange) - getFirstNum(a.salaryRange);
        });
        break;
      case 'salary-low':
        result.sort((a, b) => {
          const getFirstNum = (s: string) => {
            const match = s.match(/\d+/);
            return match ? parseInt(match[0]) : 0;
          };
          return getFirstNum(a.salaryRange) - getFirstNum(b.salaryRange);
        });
        break;
    }

    return result;
  }, [filters, jobsWithScores, showOnlyMatches, minMatchScore]);

  const handleView = useCallback((job: JobWithScore) => {
    setSelectedJob(job);
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedJob(null);
  };

  const handleSave = useCallback((jobId: string) => {
    setSavedJobIds((prev) => {
      const newSaved = prev.includes(jobId)
        ? prev.filter((id) => id !== jobId)
        : [...prev, jobId];
      localStorage.setItem(SAVED_JOBS_KEY, JSON.stringify(newSaved));
      return newSaved;
    });
  }, []);

  const handleApply = useCallback((url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  }, []);

  const handleToggleMatches = () => {
    setShowOnlyMatches((prev) => !prev);
  };

  const isJobSaved = (jobId: string) => savedJobIds.includes(jobId);

  return (
    <div className="page">
      <ContextHeader
        title="Dashboard"
        subtitle="Discover personalized job opportunities from top Indian companies."
      />

      <div className="dashboard__container">
        {/* Preferences Banner */}
        {!hasPreferences && (
          <div className="dashboard__banner">
            <span className="dashboard__banner-text">
              Set your preferences to activate intelligent matching.
            </span>
            <Button variant="primary" size="sm" onClick={() => window.location.href = '/settings'}>
              Go to Settings
            </Button>
          </div>
        )}

        <FilterBar filters={filters} onFilterChange={setFilters} />

        {/* Match Toggle */}
        <div className="dashboard__toggle">
          <label className="dashboard__toggle-label">
            <input
              type="checkbox"
              checked={showOnlyMatches}
              onChange={handleToggleMatches}
              className="dashboard__toggle-input"
            />
            <span className="dashboard__toggle-text">
              Show only jobs above my threshold ({minMatchScore}%)
            </span>
          </label>
        </div>

        {filteredJobs.length > 0 ? (
          <div className="dashboard__jobs">
            <div className="dashboard__count">
              Showing {filteredJobs.length} of {jobs.length} jobs
            </div>
            <div className="dashboard__grid">
              {filteredJobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  isSaved={isJobSaved(job.id)}
                  status={getJobStatus(job.id)}
                  onView={handleView}
                  onSave={handleSave}
                  onApply={handleApply}
                  onStatusChange={handleStatusChange}
                  showScore={hasPreferences}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="dashboard__empty">
            <EmptyState
              title="No roles match your criteria"
              description="Adjust filters or lower your match threshold to see more results."
            />
          </div>
        )}
      </div>

      <JobModal
        job={selectedJob}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSave}
        isSaved={selectedJob ? isJobSaved(selectedJob.id) : false}
      />

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
};
