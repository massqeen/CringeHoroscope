import type { ReactNode } from 'react';
import { getCssColor, getTextColor, isLightColor } from '../utils/colorUtils';
import styles from './LuckyElements.module.css';

interface LuckyElementsProps {
  luckyColor?: string;
  luckyNumber?: number;
}

const LuckyElements = ({ luckyColor, luckyNumber }: LuckyElementsProps): ReactNode => {
  // Early return if no lucky elements to display
  if (!luckyColor && !luckyNumber) {
    return null;
  }

  return (
    <div className={styles.luckyElementsCard}>
      {/* Decorative elements */}
      <div className={styles.luckyElementsDecoration}>🌟</div>

      <div className={styles.luckyElementsContent}>
        <div className="mb-md">
          <h4 className={styles.luckyElementsTitle}>✨ Your Lucky Elements ✨</h4>
        </div>

        <div className={styles.luckyElementsGrid}>
          {luckyColor && (
            <div className={styles.luckyElementItem}>
              <span className={styles.luckyTitle}>🎨 Lucky Color:</span>
              <span
                className={styles.luckyColorBadge}
                style={{
                  backgroundColor: getCssColor(luckyColor),
                  color: getTextColor(luckyColor),
                  textShadow: isLightColor(luckyColor)
                    ? '0 1px 2px rgba(255,255,255,0.3)'
                    : '0 1px 2px rgba(0,0,0,0.3)',
                  border: isLightColor(luckyColor) ? '1px solid rgba(0,0,0,0.1)' : 'none',
                }}
                aria-label={`Lucky color is ${luckyColor}`}
              >
                {luckyColor}
              </span>
            </div>
          )}
          {luckyNumber && (
            <div className={styles.luckyElementItem}>
              <span className={styles.luckyTitle}>🔢 Lucky Number:</span>
              <span
                className={styles.luckyNumberBadge}
                aria-label={`Lucky number is ${luckyNumber}`}
              >
                {luckyNumber}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LuckyElements;
