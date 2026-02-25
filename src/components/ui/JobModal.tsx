import React from 'react';
import { Button, Badge } from './index';
import type { Job } from '../../data/jobs';
import './JobModal.css';

interface JobModalProps {
  job: Job | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (jobId: string) => void;
  isSaved: boolean;
}

export const JobModal: React.FC<JobModalProps> = ({
  job,
  isOpen,
  onClose,
  onSave,
  isSaved,
}) => {
  if (!isOpen || !job) return null;

  const handleApply = () => {
    window.open(job.applyUrl, '_blank', 'noopener,noreferrer');
  };

  const getSourceVariant = (source: string) => {
    switch (source) {
      case 'LinkedIn':
        return 'default';
      case 'Naukri':
        return 'success';
      case 'Indeed':
        return 'warning';
      default:
        return 'default';
    }
  };

  return (
    <div className="job-modal__overlay" onClick={onClose}>
      <div className="job-modal" onClick={(e) => e.stopPropagation()}>
        <div className="job-modal__header">
          <div className="job-modal__title-section">
            <h2 className="job-modal__title">{job.title}</h2>
            <span className="job-modal__company">{job.company}</span>
          </div>
          <button
            type="button"
            className="job-modal__close"
            onClick={onClose}
            aria-label="Close modal"
          >
            ×
          </button>
        </div>

        <div className="job-modal__content">
          <div className="job-modal__meta">
            <div className="job-modal__meta-item">
              <span className="job-modal__meta-label">Location</span>
              <span className="job-modal__meta-value">
                {job.location} · {job.mode}
              </span>
            </div>
            <div className="job-modal__meta-item">
              <span className="job-modal__meta-label">Experience</span>
              <span className="job-modal__meta-value">{job.experience}</span>
            </div>
            <div className="job-modal__meta-item">
              <span className="job-modal__meta-label">Salary</span>
              <span className="job-modal__meta-value">{job.salaryRange}</span>
            </div>
            <div className="job-modal__meta-item">
              <span className="job-modal__meta-label">Source</span>
              <Badge variant={getSourceVariant(job.source) as 'default' | 'success' | 'warning'}>
                {job.source}
              </Badge>
            </div>
          </div>

          <div className="job-modal__section">
            <h3 className="job-modal__section-title">Description</h3>
            <p className="job-modal__description">{job.description}</p>
          </div>

          <div className="job-modal__section">
            <h3 className="job-modal__section-title">Required Skills</h3>
            <div className="job-modal__skills">
              {job.skills.map((skill) => (
                <span key={skill} className="job-modal__skill">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div className="job-modal__posted">
            Posted {job.postedDaysAgo === 0 ? 'today' : `${job.postedDaysAgo} days ago`}
          </div>
        </div>

        <div className="job-modal__footer">
          <Button variant="secondary" onClick={() => onSave(job.id)}>
            {isSaved ? 'Saved' : 'Save Job'}
          </Button>
          <Button variant="primary" onClick={handleApply}>
            Apply Now
          </Button>
        </div>
      </div>
    </div>
  );
};
