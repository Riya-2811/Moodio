import React, { useState, useEffect } from 'react';

/**
 * Toast Notification Component
 * Displays temporary success/error/info messages
 */
const Toast = ({ message, type = 'success', duration = 3000, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      if (onClose) {
        setTimeout(onClose, 300); // Wait for fade out animation
      }
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const bgColor = {
    success: 'bg-gradient-to-r from-soft-green to-green-400 dark:from-soft-green dark:to-green-500/80',
    error: 'bg-gradient-to-r from-warm-pink to-pink-400 dark:from-warm-pink dark:to-pink-500/80',
    info: 'bg-gradient-to-r from-indigo-500 to-purple-500 dark:from-indigo-600 dark:to-purple-600',
    warning: 'bg-gradient-to-r from-orange-400 to-yellow-400 dark:from-orange-500 dark:to-yellow-500/80',
  }[type] || 'bg-gradient-to-r from-soft-green to-green-400 dark:from-soft-green dark:to-green-500/80';

  const textColor = {
    success: 'text-gray-800 dark:text-white',
    error: 'text-gray-800 dark:text-white',
    info: 'text-white dark:text-white',
    warning: 'text-gray-800 dark:text-white',
  }[type] || 'text-gray-800 dark:text-white';

  if (!isVisible) return null;

  return (
    <div className={`fixed top-4 right-4 ${bgColor} ${textColor} px-6 py-4 rounded-softer shadow-xl border-2 border-gray-800/20 dark:border-gray-300/20 z-50 animate-slideInRight transform transition-all duration-300 opacity-100 translate-x-0`}>
      <div className="flex items-center gap-3">
        <div className="text-2xl font-bold">
          {type === 'success' && '✓'}
          {type === 'error' && '✕'}
          {type === 'info' && 'ℹ'}
          {type === 'warning' && '⚠'}
        </div>
        <p className="font-bold text-base">{message}</p>
      </div>
    </div>
  );
};

/**
 * Toast Manager Hook
 * Use this to show toasts throughout the app
 */
export const useToast = () => {
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success', duration = 3000) => {
    setToast({ message, type, duration });
  };

  const ToastContainer = () => {
    if (!toast) return null;
    
    return (
      <Toast
        message={toast.message}
        type={toast.type}
        duration={toast.duration}
        onClose={() => setToast(null)}
      />
    );
  };

  return { showToast, ToastContainer };
};

export default Toast;

