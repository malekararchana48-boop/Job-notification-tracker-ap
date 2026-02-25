import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import './Navigation.css';

interface NavItem {
  path: string;
  label: string;
}

const navItems: NavItem[] = [
  { path: '/dashboard', label: 'Dashboard' },
  { path: '/saved', label: 'Saved' },
  { path: '/digest', label: 'Digest' },
  { path: '/settings', label: 'Settings' },
  { path: '/proof', label: 'Proof' },
];

export const Navigation: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="navigation">
      {/* Desktop Navigation */}
      <ul className="navigation__list">
        {navItems.map((item) => (
          <li key={item.path} className="navigation__item">
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                `navigation__link ${isActive ? 'navigation__link--active' : ''}`
              }
            >
              {item.label}
            </NavLink>
          </li>
        ))}
      </ul>

      {/* Mobile Hamburger Button */}
      <button
        type="button"
        className="navigation__mobile-toggle"
        onClick={toggleMobileMenu}
        aria-expanded={isMobileMenuOpen}
        aria-label="Toggle navigation menu"
      >
        <span className="navigation__hamburger" aria-hidden="true">
          <span className="navigation__hamburger-line" />
          <span className="navigation__hamburger-line" />
          <span className="navigation__hamburger-line" />
        </span>
      </button>

      {/* Mobile Dropdown Menu */}
      {isMobileMenuOpen && (
        <div className="navigation__mobile-menu">
          <ul className="navigation__mobile-list">
            {navItems.map((item) => (
              <li key={item.path} className="navigation__mobile-item">
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `navigation__mobile-link ${isActive ? 'navigation__mobile-link--active' : ''}`
                  }
                  onClick={closeMobileMenu}
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
};
