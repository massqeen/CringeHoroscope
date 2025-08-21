import type { ReactNode } from 'react';

import styles from './GenerateButton.module.css';

interface GenerateButtonProps {
  onGenerate: () => void;
  isLoading: boolean;
  disabled?: boolean;
}

const GenerateButton = ({
  onGenerate,
  isLoading,
  disabled = false,
}: GenerateButtonProps): ReactNode => {
  const handleGenerateClick = (): void => {
    onGenerate();
  };

  const handleGenerateKeyDown = (event: React.KeyboardEvent): void => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onGenerate();
    }
  };

  const isButtonDisabled = isLoading || disabled;

  return (
    <div className={styles.generateButtonContainer}>
      <button
        onClick={handleGenerateClick}
        onKeyDown={handleGenerateKeyDown}
        disabled={isButtonDisabled}
        className={`${styles.generateButton} button button-primary w-full text-lg py-4`}
        style={{
          cursor: isButtonDisabled ? 'not-allowed' : 'pointer',
        }}
        aria-label="Generate your sarcastic horoscope"
        tabIndex={0}
      >
        {isLoading ? (
          <>
            <span className="loading"></span>
            Consulting the cosmic forces...
          </>
        ) : (
          <>
            <span style={{ fontSize: '24px' }}>✨</span> Generate My Cosmic Roast{' '}
            <span style={{ fontSize: '24px' }}>🔥</span>
          </>
        )}
      </button>
    </div>
  );
};

export default GenerateButton;
