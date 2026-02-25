import React from 'react';
import './ProofFooter.css';

export type ChecklistItem = {
  label: string;
  checked: boolean;
};

interface ProofFooterProps {
  items?: ChecklistItem[];
}

const defaultItems: ChecklistItem[] = [
  { label: 'UI Built', checked: false },
  { label: 'Logic Working', checked: false },
  { label: 'Test Passed', checked: false },
  { label: 'Deployed', checked: false },
];

export const ProofFooter: React.FC<ProofFooterProps> = ({
  items = defaultItems,
}) => {
  return (
    <footer className="proof-footer">
      <div className="proof-footer__content">
        {items.map((item, index) => (
          <div
            key={index}
            className={`proof-footer__item ${item.checked ? 'proof-footer__item--checked' : ''}`}
          >
            <span className="proof-footer__checkbox">
              {item.checked ? '☑' : '☐'}
            </span>
            <span className="proof-footer__label">{item.label}</span>
          </div>
        ))}
      </div>
    </footer>
  );
};
