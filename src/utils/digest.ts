import type { Job } from '../data/jobs';
import type { Preferences } from '../data/preferences';
import { calculateMatchScore, type JobWithScore } from './matchScore';

export interface DigestJob {
  id: string;
  title: string;
  company: string;
  location: string;
  mode: string;
  experience: string;
  salaryRange: string;
  matchScore: number;
  applyUrl: string;
}

export interface Digest {
  date: string;
  jobs: DigestJob[];
  generatedAt: string;
}

export const getDigestKey = (date: string): string => `jobTrackerDigest_${date}`;

export const getTodayDate = (): string => {
  const now = new Date();
  return now.toISOString().split('T')[0];
};

export const formatDisplayDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const generateDigest = (allJobs: Job[], prefs: Preferences): Digest => {
  // Calculate match scores for all jobs
  const jobsWithScores: JobWithScore[] = allJobs.map((job) => ({
    ...job,
    matchScore: calculateMatchScore(job, prefs),
  }));

  // Sort by: 1) matchScore descending, 2) postedDaysAgo ascending
  const sortedJobs = jobsWithScores.sort((a, b) => {
    if (b.matchScore !== a.matchScore) {
      return b.matchScore - a.matchScore;
    }
    return a.postedDaysAgo - b.postedDaysAgo;
  });

  // Select top 10
  const topJobs = sortedJobs.slice(0, 10);

  // Map to digest format
  const digestJobs: DigestJob[] = topJobs.map((job) => ({
    id: job.id,
    title: job.title,
    company: job.company,
    location: job.location,
    mode: job.mode,
    experience: job.experience,
    salaryRange: job.salaryRange,
    matchScore: job.matchScore,
    applyUrl: job.applyUrl,
  }));

  const today = getTodayDate();

  return {
    date: today,
    jobs: digestJobs,
    generatedAt: new Date().toISOString(),
  };
};

export const loadDigest = (date: string): Digest | null => {
  const key = getDigestKey(date);
  const saved = localStorage.getItem(key);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      return null;
    }
  }
  return null;
};

export const saveDigest = (digest: Digest): void => {
  const key = getDigestKey(digest.date);
  localStorage.setItem(key, JSON.stringify(digest));
};

export const formatDigestForClipboard = (digest: Digest): string => {
  const lines: string[] = [
    `Top 10 Jobs For You — 9AM Digest`,
    `Date: ${formatDisplayDate(digest.date)}`,
    ``,
    `=====================================`,
    ``,
  ];

  digest.jobs.forEach((job, index) => {
    lines.push(`${index + 1}. ${job.title}`);
    lines.push(`   Company: ${job.company}`);
    lines.push(`   Location: ${job.location} (${job.mode})`);
    lines.push(`   Experience: ${job.experience}`);
    lines.push(`   Salary: ${job.salaryRange}`);
    lines.push(`   Match Score: ${job.matchScore}%`);
    lines.push(`   Apply: ${job.applyUrl}`);
    lines.push('');
  });

  lines.push('=====================================');
  lines.push('');
  lines.push('This digest was generated based on your preferences.');

  return lines.join('\n');
};

export const createEmailDraft = (digest: Digest): string => {
  const subject = encodeURIComponent('My 9AM Job Digest');
  const body = encodeURIComponent(formatDigestForClipboard(digest));
  return `mailto:?subject=${subject}&body=${body}`;
};
