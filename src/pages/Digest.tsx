import React, { useState, useEffect, useCallback } from 'react';
import { ContextHeader } from '../components/layout';
import { EmptyState, Button, Badge } from '../components/ui';
import { loadPreferences } from '../data/preferences';
import { jobs } from '../data/jobs';
import {
  generateDigest,
  loadDigest,
  saveDigest,
  getTodayDate,
  formatDisplayDate,
  formatDigestForClipboard,
  createEmailDraft,
  type Digest as DigestData,
} from '../utils/digest';
import { getScoreVariant } from '../utils/matchScore';
import './Digest.css';

export const Digest: React.FC = () => {
  const [digest, setDigest] = useState<DigestData | null>(null);
  const [hasPreferences, setHasPreferences] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  // Check for preferences and existing digest on mount
  useEffect(() => {
    const prefs = loadPreferences();
    const hasAny = !!(
      prefs.roleKeywords ||
      prefs.preferredLocations.length > 0 ||
      prefs.preferredMode.length > 0 ||
      prefs.experienceLevel ||
      prefs.skills
    );
    setHasPreferences(hasAny);

    // Load existing digest for today if available
    const today = getTodayDate();
    const existingDigest = loadDigest(today);
    if (existingDigest) {
      setDigest(existingDigest);
    }
  }, []);

  const handleGenerate = useCallback(() => {
    setIsGenerating(true);

    // Simulate a brief delay for UX
    setTimeout(() => {
      const prefs = loadPreferences();
      const newDigest = generateDigest(jobs, prefs);
      saveDigest(newDigest);
      setDigest(newDigest);
      setIsGenerating(false);
    }, 500);
  }, []);

  const handleCopy = useCallback(async () => {
    if (!digest) return;

    const text = formatDigestForClipboard(digest);
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  }, [digest]);

  const handleEmailDraft = useCallback(() => {
    if (!digest) return;
    const mailtoUrl = createEmailDraft(digest);
    window.location.href = mailtoUrl;
  }, [digest]);

  const handleApply = useCallback((url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  }, []);

  // No preferences state
  if (!hasPreferences) {
    return (
      <div className="page">
        <ContextHeader
          title="Daily Digest"
          subtitle="Your personalized morning summary of new opportunities."
        />

        <div className="digest__container">
          <div className="digest__blocking">
            <h2 className="digest__blocking-title">Set Preferences First</h2>
            <p className="digest__blocking-text">
              Set your preferences to generate a personalized digest.
            </p>
            <Button
              variant="primary"
              onClick={() => window.location.href = '/settings'}
            >
              Go to Settings
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // No digest generated yet
  if (!digest) {
    return (
      <div className="page">
        <ContextHeader
          title="Daily Digest"
          subtitle="Your personalized morning summary of new opportunities."
        />

        <div className="digest__container">
          <div className="digest__generate">
            <p className="digest__note">
              Demo Mode: Daily 9AM trigger simulated manually.
            </p>
            <Button
              variant="primary"
              size="lg"
              onClick={handleGenerate}
              isLoading={isGenerating}
            >
              Generate Today's 9AM Digest (Simulated)
            </Button>
          </div>

          <EmptyState
            title="Your digest is empty"
            description="Click the button above to generate your personalized job digest for today."
          />
        </div>
      </div>
    );
  }

  // No matches found
  if (digest.jobs.length === 0) {
    return (
      <div className="page">
        <ContextHeader
          title="Daily Digest"
          subtitle="Your personalized morning summary of new opportunities."
        />

        <div className="digest__container">
          <div className="digest__generate">
            <p className="digest__note">
              Demo Mode: Daily 9AM trigger simulated manually.
            </p>
            <Button
              variant="primary"
              size="lg"
              onClick={handleGenerate}
              isLoading={isGenerating}
            >
              Regenerate Today's Digest
            </Button>
          </div>

          <EmptyState
            title="No matching roles today"
            description="Check again tomorrow for new opportunities that match your preferences."
          />
        </div>
      </div>
    );
  }

  // Digest with jobs - Email style layout
  return (
    <div className="page">
      <ContextHeader
        title="Daily Digest"
        subtitle="Your personalized morning summary of new opportunities."
      />

      <div className="digest__container">
        {/* Demo Note */}
        <p className="digest__note">
          Demo Mode: Daily 9AM trigger simulated manually.
        </p>

        {/* Action Buttons */}
        <div className="digest__actions">
          <Button
            variant="secondary"
            onClick={handleCopy}
          >
            {copied ? 'Copied!' : 'Copy Digest to Clipboard'}
          </Button>
          <Button
            variant="secondary"
            onClick={handleEmailDraft}
          >
            Create Email Draft
          </Button>
          <Button
            variant="primary"
            onClick={handleGenerate}
            isLoading={isGenerating}
          >
            Regenerate Digest
          </Button>
        </div>

        {/* Email Style Digest Card */}
        <div className="digest__email">
          {/* Header */}
          <div className="digest__email-header">
            <h2 className="digest__email-title">
              Top 10 Jobs For You — 9AM Digest
            </h2>
            <p className="digest__email-date">
              {formatDisplayDate(digest.date)}
            </p>
          </div>

          {/* Jobs List */}
          <div className="digest__email-body">
            {digest.jobs.map((job, index) => (
              <div key={job.id} className="digest__job">
                <div className="digest__job-header">
                  <span className="digest__job-number">{index + 1}</span>
                  <h3 className="digest__job-title">{job.title}</h3>
                  <Badge variant={getScoreVariant(job.matchScore)}>
                    {job.matchScore}% Match
                  </Badge>
                </div>

                <div className="digest__job-details">
                  <div className="digest__job-detail">
                    <span className="digest__job-label">Company</span>
                    <span className="digest__job-value">{job.company}</span>
                  </div>
                  <div className="digest__job-detail">
                    <span className="digest__job-label">Location</span>
                    <span className="digest__job-value">
                      {job.location} · {job.mode}
                    </span>
                  </div>
                  <div className="digest__job-detail">
                    <span className="digest__job-label">Experience</span>
                    <span className="digest__job-value">{job.experience}</span>
                  </div>
                  <div className="digest__job-detail">
                    <span className="digest__job-label">Salary</span>
                    <span className="digest__job-value">{job.salaryRange}</span>
                  </div>
                </div>

                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleApply(job.applyUrl)}
                >
                  Apply
                </Button>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="digest__email-footer">
            <p>
              This digest was generated based on your preferences.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
