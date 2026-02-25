import React from 'react';
import { Badge, Button } from './index';
import type { JobWithScore } from '../../utils/matchScore';
import { getScoreVariant, getScoreLabel } from '../../utils/matchScore';
import './JobCard.css';

interface JobCardProps {
  job: JobWithScore;
  isSaved: boolean;
  onView: (job: JobWithScore) => void;
  onSave: (jobId: string) => void;
  onApply: (url: string) => void;
  showScore?: boolean;
}

export const JobCard: React.FC<JobCardProps> = ({
  job,
  isSaved,
  onView,
  onSave,
  onApply,
  showScore = false,
}) => {
  const formatPostedTime = (days: number): string => {
    if (days === 0) return 'Today';
    if (days === 1) return '1 day ago';
    return `${days} days ago`;
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

  const scoreVariant = getScoreVariant(job.matchScore);

  return (
    <div className="job-card">
      <div className="job-card__header">
        <div className="job-card__title-section">
          <h3 className="job-card__title">{job.title}</h3>
          <span className="job-card__company">{job.company}</span>
        </div>
        <div className="job-card__badges">
          {showScore && (
            <Badge variant={scoreVariant}>
              {job.matchScore}% {getScoreLabel(job.matchScore)}
            </Badge>
          )}
          <Badge variant={getSourceVariant(job.source) as 'default' | 'success' | 'warning'}>
            {job.source}
          </Badge>
        </div>
      </div>

      <div className="job-card__details">
        <div className="job-card__detail">
          <span className="job-card__detail-label">Location</span>
          <span className="job-card__detail-value">
            {job.location} · {job.mode}
          </span>
        </div>
        <div className="job-card__detail">
          <span className="job-card__detail-label">Experience</span>
          <span className="job-card__detail-value">{job.experience}</span>
        </div>
        <div className="job-card__detail">
          <span className="job-card__detail-label">Salary</span>
          <span className="job-card__detail-value">{job.salaryRange}</span>
        </div>
      </div>

      <div className="job-card__skills">
        {job.skills.slice(0, 4).map((skill) => (
          <span key={skill} className="job-card__skill">
            {skill}
          </span>
        ))}
        {job.skills.length > 4 && (
          <span className="job-card__skill job-card__skill--more">
            +{job.skills.length - 4}
          </span>
        )}
      </div>

      <div className="job-card__footer">
        <span className="job-card__posted">{formatPostedTime(job.postedDaysAgo)}</span>
        <div className="job-card__actions">
          <Button variant="secondary" size="sm" onClick={() => onView(job)}>
            View
          </Button>
          <Button
            variant={isSaved ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => onSave(job.id)}
          >
            {isSaved ? 'Saved' : 'Save'}
          </Button>
          <Button variant="primary" size="sm" onClick={() => onApply(job.applyUrl)}>
            Apply
          </Button>
        </div>
      </div>
    </div>
  );
};
