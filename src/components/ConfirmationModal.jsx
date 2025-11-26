import React from 'react';
import { FaExclamationTriangle, FaTimes } from 'react-icons/fa';

/**
 * ConfirmationModal Component
 * A beautiful, reusable confirmation modal that matches Moodio's aesthetic
 * 
 * @param {boolean} isOpen - Whether the modal is visible
 * @param {function} onClose - Function to call when modal should close
 * @param {function} onConfirm - Function to call when user confirms
 * @param {string} title - Modal title
 * @param {string} message - Modal message/body text
 * @param {string} confirmText - Text for confirm button (default: "Confirm")
 * @param {string} cancelText - Text for cancel button (default: "Cancel")
 * @param {string} variant - Modal variant: 'danger' (red/delete), 'warning' (yellow), 'info' (blue), default (purple)
 */
const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger', // 'danger', 'warning', 'info'
}) => {
  // Handle Escape key - Must be called unconditionally (before early return)
  React.useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Early return after all hooks
  if (!isOpen) return null;

  // Variant color schemes
  const variantStyles = {
    danger: {
      iconBg: 'bg-red-100 dark:bg-red-900/30',
      iconColor: 'text-red-600 dark:text-red-400',
      confirmBg: 'bg-red-500 dark:bg-red-600 hover:bg-red-600 dark:hover:bg-red-700',
      confirmText: 'text-white',
      border: 'border-red-200 dark:border-red-800',
    },
    warning: {
      iconBg: 'bg-yellow-100 dark:bg-yellow-900/30',
      iconColor: 'text-yellow-600 dark:text-yellow-400',
      confirmBg: 'bg-yellow-500 dark:bg-yellow-600 hover:bg-yellow-600 dark:hover:bg-yellow-700',
      confirmText: 'text-white',
      border: 'border-yellow-200 dark:border-yellow-800',
    },
    info: {
      iconBg: 'bg-blue-100 dark:bg-blue-900/30',
      iconColor: 'text-blue-600 dark:text-blue-400',
      confirmBg: 'bg-accent-blue dark:bg-accent-blue hover:bg-blue-500 dark:hover:bg-blue-600',
      confirmText: 'text-white',
      border: 'border-blue-200 dark:border-blue-800',
    },
  };

  const styles = variantStyles[variant] || variantStyles.danger;

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  const handleBackdropClick = (e) => {
    // Close modal when clicking on backdrop
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 dark:bg-black/70 transition-opacity duration-300 animate-[fadeIn_0.2s_ease-out]"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      {/* Modal Container */}
      <div className="bg-white dark:bg-dark-surface rounded-softer shadow-xl max-w-md w-full transform transition-all duration-300 scale-100 border-2 border-gray-200 dark:border-dark-border animate-[slideUp_0.3s_ease-out]">
        {/* Header */}
        <div className={`flex items-center justify-between p-6 border-b-2 ${styles.border} bg-gradient-to-r from-soft-green/20 to-sky-blue/20 dark:from-dark-surface dark:to-dark-surface`}>
          <div className="flex items-center gap-3">
            <div className={`${styles.iconBg} p-2 rounded-full`}>
              <FaExclamationTriangle className={`${styles.iconColor} text-xl`} />
            </div>
            <h3 id="modal-title" className="text-xl font-bold text-gray-800 dark:text-gray-100">
              {title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-soft text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-bg transition-colors duration-200"
            aria-label="Close modal"
          >
            <FaTimes className="text-lg" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          <p id="modal-description" className="text-gray-600 dark:text-gray-300 leading-relaxed">
            {message}
          </p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t-2 border-gray-200 dark:border-dark-border bg-gray-50 dark:bg-dark-bg rounded-b-softer">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-soft font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-dark-surface hover:bg-gray-200 dark:hover:bg-dark-surface-elevated border border-gray-300 dark:border-dark-border transition-all duration-200"
          >
            {cancelText}
          </button>
          <button
            onClick={handleConfirm}
            className={`px-6 py-2.5 rounded-soft font-medium ${styles.confirmBg} ${styles.confirmText} shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;

