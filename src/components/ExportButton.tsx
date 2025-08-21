import { ReactNode, useRef } from 'react';
import html2canvas from 'html2canvas';
import styles from './ExportButton.module.css';

interface ExportButtonProps {
  targetElementId: string;
  filename?: string;
  disabled?: boolean;
}

const ExportButton = ({
  targetElementId,
  filename = 'horoscope',
  disabled = false,
}: ExportButtonProps): ReactNode => {
  const isExporting = useRef<boolean>(false);

  const handleExportClick = async (): Promise<void> => {
    if (isExporting.current || disabled) {
      return;
    }

    isExporting.current = true;

    try {
      const targetElement = document.getElementById(targetElementId);

      if (!targetElement) {
        console.error(`Element with id "${targetElementId}" not found`);
        alert('Cannot find content to export. Please try again.');
        return;
      }

      // Add export class to optimize styling for image
      targetElement.classList.add('exporting');

      const canvas = await html2canvas(targetElement, {
        backgroundColor: '#0f0f23',
        scale: 2, // Higher quality
        useCORS: true,
        allowTaint: false,
        removeContainer: true,
        scrollX: 0,
        scrollY: 0,
        width: targetElement.scrollWidth,
        height: targetElement.scrollHeight,
        onclone: (clonedDocument) => {
          // Ensure fonts are loaded in the cloned document
          const clonedElement = clonedDocument.getElementById(targetElementId);
          if (clonedElement) {
            clonedElement.style.fontFamily = 'Inter, system-ui, sans-serif';
          }
        },
      });

      // Remove export class
      targetElement.classList.remove('exporting');

      // Create download link
      const link = document.createElement('a');
      link.download = `${filename}-${new Date().toISOString().slice(0, 10)}.png`;
      link.href = canvas.toDataURL('image/png', 1.0);

      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      console.log('✅ Horoscope exported successfully');
    } catch (error) {
      console.error('❌ Export failed:', error);
      alert('Failed to export image. Please try again.');
    } finally {
      isExporting.current = false;
    }
  };

  const handleExportKeyDown = (event: React.KeyboardEvent): void => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleExportClick();
    }
  };

  return (
    <button
      type="button"
      onClick={handleExportClick}
      onKeyDown={handleExportKeyDown}
      disabled={disabled || isExporting.current}
      className={`${styles.exportButton} button button-primary text-xs`}
      aria-label="Export horoscope as image"
      tabIndex={0}
    >
      📸 Save Image
    </button>
  );
};

export default ExportButton;
