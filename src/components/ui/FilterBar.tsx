import React from 'react';
import './FilterBar.css';

export interface FilterState {
  keyword: string;
  location: string;
  mode: string;
  experience: string;
  source: string;
  sort: string;
}

interface FilterBarProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
}

const locations = ['All', 'Bangalore', 'Hyderabad', 'Pune', 'Chennai', 'Gurgaon', 'Mumbai', 'Noida', 'Delhi', 'Kolkata', 'Faridabad', 'Patna'];
const modes = ['All', 'Remote', 'Hybrid', 'Onsite'];
const experiences = ['All', 'Fresher', '0-1', '1-3', '3-5'];
const sources = ['All', 'LinkedIn', 'Naukri', 'Indeed'];
const sortOptions = [
  { value: 'latest', label: 'Latest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'salary-high', label: 'Salary: High to Low' },
  { value: 'salary-low', label: 'Salary: Low to High' },
];

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onFilterChange,
}) => {
  const handleChange = (field: keyof FilterState, value: string) => {
    onFilterChange({ ...filters, [field]: value });
  };

  const handleClear = () => {
    onFilterChange({
      keyword: '',
      location: 'All',
      mode: 'All',
      experience: 'All',
      source: 'All',
      sort: 'latest',
    });
  };

  const hasActiveFilters =
    filters.keyword ||
    filters.location !== 'All' ||
    filters.mode !== 'All' ||
    filters.experience !== 'All' ||
    filters.source !== 'All';

  return (
    <div className="filter-bar">
      <div className="filter-bar__row">
        <div className="filter-bar__search">
          <input
            type="text"
            placeholder="Search by title or company..."
            value={filters.keyword}
            onChange={(e) => handleChange('keyword', e.target.value)}
            className="filter-bar__input"
          />
        </div>

        <div className="filter-bar__filters">
          <select
            value={filters.location}
            onChange={(e) => handleChange('location', e.target.value)}
            className="filter-bar__select"
          >
            {locations.map((loc) => (
              <option key={loc} value={loc}>
                {loc === 'All' ? 'All Locations' : loc}
              </option>
            ))}
          </select>

          <select
            value={filters.mode}
            onChange={(e) => handleChange('mode', e.target.value)}
            className="filter-bar__select"
          >
            {modes.map((mode) => (
              <option key={mode} value={mode}>
                {mode === 'All' ? 'All Modes' : mode}
              </option>
            ))}
          </select>

          <select
            value={filters.experience}
            onChange={(e) => handleChange('experience', e.target.value)}
            className="filter-bar__select"
          >
            {experiences.map((exp) => (
              <option key={exp} value={exp}>
                {exp === 'All' ? 'All Experience' : exp}
              </option>
            ))}
          </select>

          <select
            value={filters.source}
            onChange={(e) => handleChange('source', e.target.value)}
            className="filter-bar__select"
          >
            {sources.map((source) => (
              <option key={source} value={source}>
                {source === 'All' ? 'All Sources' : source}
              </option>
            ))}
          </select>

          <select
            value={filters.sort}
            onChange={(e) => handleChange('sort', e.target.value)}
            className="filter-bar__select filter-bar__select--sort"
          >
            {sortOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {hasActiveFilters && (
        <div className="filter-bar__clear">
          <button type="button" className="filter-bar__clear-btn" onClick={handleClear}>
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
};
