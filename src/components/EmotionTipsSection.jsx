import React from 'react';
import EmotionTipCard from './EmotionTipCard';

/**
 * EmotionTipsSection Component
 * Displays all 15 emotion regulation tip cards in a responsive grid
 */
const EmotionTipsSection = () => {
  // Array of all 15 emotion regulation tips
  const emotionTips = [
    {
      emoji: '🥤',
      title: 'Hydrate Yourself',
      description: 'Dehydration affects mood more than people realize. Drink a glass of water slowly to give your body a reset.'
    },
    {
      emoji: '😮‍💨',
      title: '4-7-8 Breathing',
      description: 'Inhale for 4 seconds, hold for 7, exhale for 8. This technique calms your nervous system almost immediately.'
    },
    {
      emoji: '🚶‍♀️',
      title: 'Take a 5-Minute Walk',
      description: 'Movement clears mental fog. A short walk can reduce stress hormones and improve mood.'
    },
    {
      emoji: '✍️',
      title: 'Name the Emotion',
      description: 'Label what you feel in one sentence. Identifying an emotion reduces its intensity by making the brain feel safer.'
    },
    {
      emoji: '🤲',
      title: 'Grounding with 5-4-3-2-1',
      description: 'Identify 5 things you see, 4 you can touch, 3 you can hear, 2 you can smell, and 1 you can taste.'
    },
    {
      emoji: '🌤️',
      title: 'Step Into Fresh Air',
      description: 'A quick dose of natural light boosts serotonin and helps regulate mood.'
    },
    {
      emoji: '🤗',
      title: 'Self-Hug',
      description: 'Wrap your arms around yourself and hold for 10 seconds. This activates the body\'s calming system.'
    },
    {
      emoji: '🧊',
      title: 'Cold Splash Reset',
      description: 'Splash cold water on your face or hold something cool. It interrupts emotional spiraling and brings clarity.'
    },
    {
      emoji: '📵',
      title: 'Put Your Phone Away for 3 Minutes',
      description: 'Micro-breaks from stimulation help your brain settle and reduce overwhelm.'
    },
    {
      emoji: '😌',
      title: 'Relax Your Jaw & Shoulders',
      description: 'Tension hides in the jaw and shoulders. Release both intentionally to signal your body to relax.'
    },
    {
      emoji: '📓',
      title: 'Write a 2-Sentence Journal Note',
      description: 'Dump a quick thought out of your head. Clarity increases when you externalize stress.'
    },
    {
      emoji: '🛏️',
      title: 'Lie Down for 2 Minutes',
      description: 'A short rest resets emotional overload and stabilizes your breathing.'
    },
    {
      emoji: '🌧️',
      title: 'Let Yourself Feel It',
      description: 'Instead of fighting the feeling, allow it for 60 seconds. Emotions pass faster when not resisted.'
    },
    {
      emoji: '🔄',
      title: 'Do One Small Task',
      description: 'Choose a tiny action—fold one cloth, clean one surface. Small wins activate motivation pathways.'
    },
    {
      emoji: '🎧',
      title: 'Play One Calming Sound',
      description: 'Listen to rain, waves, or a soft track. Rhythmic sounds naturally regulate the nervous system.'
    }
  ];

  return (
    <div className="w-full">
      {/* Section Header */}
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-3">
          Emotion Regulation Tips 💙
        </h2>
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          Quick, actionable strategies to help you manage your emotions in the moment
        </p>
      </div>

      {/* Responsive Grid of Tip Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
        {emotionTips.map((tip, index) => (
          <EmotionTipCard key={index} tip={tip} />
        ))}
      </div>
    </div>
  );
};

export default EmotionTipsSection;

