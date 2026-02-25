import type { Job } from '../data/jobs';
import type { Preferences } from '../data/preferences';

export interface JobWithScore extends Job {
  matchScore: number;
}

export const calculateMatchScore = (job: Job, prefs: Preferences): number => {
  let score = 0;

  // Parse user inputs
  const roleKeywords = prefs.roleKeywords
    .split(',')
    .map((k) => k.trim().toLowerCase())
    .filter((k) => k.length > 0);

  const userSkills = prefs.skills
    .split(',')
    .map((s) => s.trim().toLowerCase())
    .filter((s) => s.length > 0);

  const jobTitle = job.title.toLowerCase();
  const jobDescription = job.description.toLowerCase();
  const jobSkills = job.skills.map((s) => s.toLowerCase());

  // +25 if any roleKeyword appears in job.title (case-insensitive)
  if (roleKeywords.length > 0) {
    const hasKeywordInTitle = roleKeywords.some((keyword) =>
      jobTitle.includes(keyword)
    );
    if (hasKeywordInTitle) {
      score += 25;
    }
  }

  // +15 if any roleKeyword appears in job.description
  if (roleKeywords.length > 0) {
    const hasKeywordInDesc = roleKeywords.some((keyword) =>
      jobDescription.includes(keyword)
    );
    if (hasKeywordInDesc) {
      score += 15;
    }
  }

  // +15 if job.location matches preferredLocations
  if (prefs.preferredLocations.length > 0) {
    if (prefs.preferredLocations.includes(job.location)) {
      score += 15;
    }
  }

  // +10 if job.mode matches preferredMode
  if (prefs.preferredMode.length > 0) {
    if (prefs.preferredMode.includes(job.mode)) {
      score += 10;
    }
  }

  // +10 if job.experience matches experienceLevel
  if (prefs.experienceLevel) {
    if (job.experience === prefs.experienceLevel) {
      score += 10;
    }
  }

  // +15 if overlap between job.skills and user.skills (any match)
  if (userSkills.length > 0) {
    const hasSkillMatch = userSkills.some((skill) =>
      jobSkills.some((jobSkill) => jobSkill.includes(skill) || skill.includes(jobSkill))
    );
    if (hasSkillMatch) {
      score += 15;
    }
  }

  // +5 if postedDaysAgo <= 2
  if (job.postedDaysAgo <= 2) {
    score += 5;
  }

  // +5 if source is LinkedIn
  if (job.source === 'LinkedIn') {
    score += 5;
  }

  // Cap score at 100
  return Math.min(score, 100);
};

export const getScoreVariant = (score: number): 'success' | 'warning' | 'default' | 'error' => {
  if (score >= 80) return 'success';      // green
  if (score >= 60) return 'warning';      // amber
  if (score >= 40) return 'default';      // neutral
  return 'error';                         // subtle grey (using error variant for <40)
};

export const getScoreLabel = (score: number): string => {
  if (score >= 80) return 'Excellent';
  if (score >= 60) return 'Good';
  if (score >= 40) return 'Fair';
  return 'Low';
};
