import { useState, useEffect, useCallback } from 'react';
import type { Cringe } from '../types';

const CRINGE_WARNING_SHOWN_KEY = 'cringe-warning-shown';

interface UseCringeWarningReturn {
  isModalOpen: boolean;
  shouldShowWarning: (cringeLevel: Cringe) => boolean;
  handleCloseModal: () => void;
  resetWarningState: () => void;
}

export const useCringeWarning = (): UseCringeWarningReturn => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [hasShownWarning, setHasShownWarning] = useState<boolean>(false);

  // Load warning state from localStorage on component mount
  useEffect(() => {
    const warningShown = localStorage.getItem(CRINGE_WARNING_SHOWN_KEY) === 'true';
    setHasShownWarning(warningShown);
  }, []);

  // Check if warning should be shown for maximum cringe level
  const shouldShowWarning = useCallback(
    (cringeLevel: Cringe): boolean => {
      const isMaximumCringe = cringeLevel === 3;
      const shouldShow = isMaximumCringe && !hasShownWarning;

      if (shouldShow) {
        setIsModalOpen(true);
      }

      return shouldShow;
    },
    [hasShownWarning],
  );

  // Handle modal close and mark warning as shown
  const handleCloseModal = useCallback((): void => {
    setIsModalOpen(false);
    setHasShownWarning(true);
    localStorage.setItem(CRINGE_WARNING_SHOWN_KEY, 'true');
  }, []);

  // Reset warning state (useful for testing)
  const resetWarningState = useCallback((): void => {
    setHasShownWarning(false);
    setIsModalOpen(false);
    localStorage.removeItem(CRINGE_WARNING_SHOWN_KEY);
  }, []);

  return {
    isModalOpen,
    shouldShowWarning,
    handleCloseModal,
    resetWarningState,
  };
};
