import React, { useState } from 'react';
import './PromptBox.css';

interface PromptBoxProps {
  content: string;
  label?: string;
  className?: string;
}

export const PromptBox: React.FC<PromptBoxProps> = ({
  content,
  label = 'Copy prompt',
  className = '',
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className={`prompt-box ${className}`}>
      {label && <label className="prompt-box__label">{label}</label>}
      <div className="prompt-box__content">
        <pre className="prompt-box__text">{content}</pre>
        <button
          type="button"
          className="prompt-box__copy-btn"
          onClick={handleCopy}
          aria-label={copied ? 'Copied' : 'Copy to clipboard'}
        >
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
    </div>
  );
};
