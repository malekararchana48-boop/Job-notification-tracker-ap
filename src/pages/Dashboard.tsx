import React, { useState, useMemo, useEffect } from 'react';
import { ContextHeader } from '../components/layout';
import { JobCard, JobModal, FilterBar, EmptyState } from '../components/ui';
import { jobs, type Job } from '../data/jobs';
import type { FilterState } from '../components/ui';
import './Dashboard.css';

const SAVED_JOBS_KEY = 'jobTracker_savedJobs';

export const Dashboard: React.FC = () => {
  const [filters, setFilters] = useState<FilterState>({
    keyword: '',
    location: 'All',
    mode: 'All',
    experience: 'All',
    source: 'All',
    sort: 'latest',
  });

  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [savedJobIds, setSavedJobIds] = useState<string[]>([]);

  // Load saved jobs from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(SAVED_JOBS_KEY);
    if (saved) {
      try {
        setSavedJobIds(JSON.parse(saved));
      } catch {
        setSavedJobIds([]);
      }
    }
  }, []);

  // Save to localStorage whenever savedJobIds changes
  useEffect(() => {
    localStorage.setItem(SAVED_JOBS_KEY, JSON.stringify(savedJobIds));
  }, [savedJobIds]);

  const filteredJobs = useMemo(() => {
    let result = [...jobs];

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

    // Sort
    switch (filters.sort) {
      case 'latest':
        result.sort((a, b) => a.postedDaysAgo - b.postedDaysAgo);
        break;
      case 'oldest':
        result.sort((a, b) => b.postedDaysAgo - a.postedDaysAgo);
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
  }, [filters]);

  const handleView = (job: Job) => {
    setSelectedJob(job);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedJob(null);
  };

  const handleSave = (jobId: string) => {
    setSavedJobIds((prev) => {
      if (prev.includes(jobId)) {
        return prev.filter((id) => id !== jobId);
      }
      return [...prev, jobId];
    });
  };

  const handleApply = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const isJobSaved = (jobId: string) => savedJobIds.includes(jobId);

  return (
    <div className="page">
      <ContextHeader
        title="Dashboard"
        subtitle="Discover personalized job opportunities from top Indian companies."
      />

      <div className="dashboard__container">
        <FilterBar filters={filters} onFilterChange={setFilters} />

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
                  onView={handleView}
                  onSave={handleSave}
                  onApply={handleApply}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="dashboard__empty">
            <EmptyState
              title="No jobs match your search"
              description="Try adjusting your filters or search terms to see more results."
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
    </div>
  );
};
