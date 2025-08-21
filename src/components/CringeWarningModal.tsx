import { ReactNode, useEffect, useRef, useState } from 'react';
import styles from './CringeWarningModal.module.css';

interface CringeWarningModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CringeWarningModal = ({ isOpen, onClose }: CringeWarningModalProps): ReactNode => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [playWithSound, setPlayWithSound] = useState<boolean>(false);

  // Handle escape key and click outside to close
  useEffect(() => {
    if (!isOpen) return;

    const handleEscapeKey = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    const handleClickOutside = (event: MouseEvent): void => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscapeKey);
    document.addEventListener('mousedown', handleClickOutside);

    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Auto-focus modal when opened for accessibility
  useEffect(() => {
    if (isOpen && modalRef.current) {
      modalRef.current.focus();
    }
  }, [isOpen]);

  // Reset sound state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setPlayWithSound(false);
    }
  }, [isOpen]);

  const handlePlayWithSound = (): void => {
    setPlayWithSound(true);
  };

  if (!isOpen) {
    return null;
  }

  // YouTube URL with or without mute based on user choice
  const youtubeUrl = playWithSound
    ? 'https://www.youtube.com/embed/Sagg08DrO5U?autoplay=1&rel=0&modestbranding=1'
    : 'https://www.youtube.com/embed/Sagg08DrO5U?autoplay=1&mute=1&rel=0&modestbranding=1';

  return (
    <div
      className={styles.modalOverlay}
      role="dialog"
      aria-modal="true"
      aria-labelledby="cringe-warning-title"
    >
      <div ref={modalRef} className={styles.modalContent} tabIndex={-1}>
        {/* Modal Header */}
        <div className={styles.modalHeader}>
          <h2 id="cringe-warning-title" className={styles.modalTitle}>
            🔥 Maximum Cringe Level Activated! 🔥
          </h2>
          <button
            onClick={onClose}
            className={styles.closeButton}
            aria-label="Close warning modal"
            tabIndex={0}
          >
            ×
          </button>
        </div>

        {/* Modal Body */}
        <div className={styles.modalBody}>
          <div className={styles.warningText}>
            <p>⚠️ You've chosen the most hardcore cringe level!</p>
            <p>Prepare yourself for the ultimate cringe experience...</p>
          </div>

          {/* YouTube Video Embed */}
          <div className={styles.videoContainer}>
            <iframe
              key={playWithSound ? 'with-sound' : 'muted'} // Force re-render when sound state changes
              src={youtubeUrl}
              title="Cringe Level Maximum Warning"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className={styles.videoEmbed}
              loading="lazy"
            ></iframe>
          </div>

          {/* Sound Control */}
          {!playWithSound && (
            <div className={styles.soundControl}>
              <button
                onClick={handlePlayWithSound}
                className={styles.soundButton}
                aria-label="Play video with sound"
                tabIndex={0}
              >
                🔊 Play with Sound
              </button>
              <p className={styles.soundHint}>
                Click to enable audio for the full cringe experience!
              </p>
            </div>
          )}

          {playWithSound && (
            <div className={styles.soundControl}>
              <p className={styles.soundEnabled}>🔊 Audio enabled! Enjoy the cringe! 🎵</p>
            </div>
          )}

          {/* Modal Footer */}
          <div className={styles.modalFooter}>
            <button onClick={onClose} className={styles.continueButton} tabIndex={0}>
              I'm Ready for Maximum Cringe! 💀
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CringeWarningModal;
