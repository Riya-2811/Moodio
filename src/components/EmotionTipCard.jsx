import React from 'react';

/**
 * EmotionTipCard Component
 * Displays a single emotion regulation tip with emoji, title, and description
 * 
 * @param {Object} tip - Tip object with emoji, title, and description
 * @param {string} tip.emoji - Emoji icon for the tip
 * @param {string} tip.title - Title of the tip
 * @param {string} tip.description - Description/tip text
 */
const EmotionTipCard = ({ tip }) => {
  if (!tip) return null;

  return (
    <div className="bg-white dark:bg-dark-surface rounded-softer p-6 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 hover:scale-[1.01] max-w-[350px] w-full">
      {/* Emoji Icon */}
      <div className="text-5xl mb-4 text-center">
        {tip.emoji}
      </div>

      {/* Title */}
      <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-3 text-center">
        {tip.title}
      </h3>

      {/* Description */}
      <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed text-center">
        {tip.description}
      </p>
    </div>
  );
};

export default EmotionTipCard;

