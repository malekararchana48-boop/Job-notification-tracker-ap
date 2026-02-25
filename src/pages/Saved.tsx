import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { ContextHeader } from '../components/layout';
import { JobCard, JobModal, EmptyState } from '../components/ui';
import { jobs } from '../data/jobs';
import { loadPreferences } from '../data/preferences';
import { calculateMatchScore, type JobWithScore } from '../utils/matchScore';
import './Saved.css';

const SAVED_JOBS_KEY = 'jobTracker_savedJobs';

export const Saved: React.FC = () => {
  const [savedJobIds, setSavedJobIds] = useState<string[]>([]);
  const [selectedJob, setSelectedJob] = useState<JobWithScore | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hasPreferences, setHasPreferences] = useState(false);

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
    const hasAny = !!(
      prefs.roleKeywords ||
      prefs.preferredLocations.length > 0 ||
      prefs.preferredMode.length > 0 ||
      prefs.experienceLevel ||
      prefs.skills
    );
    setHasPreferences(hasAny);
  }, []);

  // Save to localStorage whenever savedJobIds changes
  useEffect(() => {
    localStorage.setItem(SAVED_JOBS_KEY, JSON.stringify(savedJobIds));
  }, [savedJobIds]);

  const savedJobs = useMemo(() => {
    const prefs = loadPreferences();
    return jobs
      .filter((job) => savedJobIds.includes(job.id))
      .map((job) => ({
        ...job,
        matchScore: calculateMatchScore(job, prefs),
      }));
  }, [savedJobIds]);

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

  const isJobSaved = (jobId: string) => savedJobIds.includes(jobId);

  return (
    <div className="page">
      <ContextHeader
        title="Saved Jobs"
        subtitle="Jobs you've bookmarked for later consideration."
      />

      <div className="saved__container">
        {savedJobs.length > 0 ? (
          <div className="saved__jobs">
            <div className="saved__count">
              {savedJobs.length} {savedJobs.length === 1 ? 'job' : 'jobs'} saved
            </div>
            <div className="saved__grid">
              {savedJobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  isSaved={isJobSaved(job.id)}
                  onView={handleView}
                  onSave={handleSave}
                  onApply={handleApply}
                  showScore={hasPreferences}
                />
              ))}
            </div>
          </div>
        ) : (
          <EmptyState
            title="No saved jobs yet"
            description="When you find interesting opportunities, save them here to review later. Your saved jobs will appear in this space and persist even after you close the browser."
          />
        )}
      </div>

      <JobModal
        job={selectedJob}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSave}
        isSaved={selectedJob ? isJobSaved(selectedJob.id) : false}
      />
    </div>
  );
};
