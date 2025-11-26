import React, { useEffect } from 'react';
import EmotionTipsSection from '../components/EmotionTipsSection';
import { useAuth } from '../context/AuthContext';
import { useMood } from '../context/MoodContext';
import { useToast } from '../utils/Toast';
import { startConsecutiveNotifications } from '../utils/NotificationService';

/**
 * Exercises Page Component
 * Mindfulness and relaxation exercises for negative moods
 */
const Exercises = () => {
  const { user, preferences } = useAuth();
  const { lastMood } = useMood();
  const { showToast } = useToast();

  // Start consecutive notifications system (every 2 minutes)
  useEffect(() => {
    if (!user) return;
    const cleanup = startConsecutiveNotifications(showToast, preferences, lastMood);
    return cleanup;
  }, [showToast, user, preferences, lastMood]);
  const exercises = [
    {
      id: 1,
      title: 'Deep Breathing',
      description: 'Take slow, deep breaths to calm your mind and body.',
      icon: '🧘',
      duration: '5 minutes',
      steps: [
        'Sit or lie down comfortably',
        'Close your eyes if comfortable',
        'Inhale slowly for 4 counts',
        'Hold your breath for 4 counts',
        'Exhale slowly for 4 counts',
        'Repeat 5-10 times',
      ],
    },
    {
      id: 2,
      title: 'Progressive Muscle Relaxation',
      description: 'Tense and relax each muscle group to release tension.',
      icon: '💆',
      duration: '10 minutes',
      steps: [
        'Start with your toes',
        'Tense for 5 seconds, then relax',
        'Move up to your calves',
        'Continue with thighs, abdomen, arms',
        'Finish with your face and neck',
        'Notice the feeling of relaxation',
      ],
    },
    {
      id: 3,
      title: 'Guided Mindfulness',
      description: 'Practice being present in the moment without judgment.',
      icon: '🌿',
      duration: '7 minutes',
      steps: [
        'Find a quiet space',
        'Focus on your breath',
        'Notice any thoughts without reacting',
        'Return your attention to breathing',
        'Practice acceptance of current feelings',
        'End with gratitude',
      ],
    },
    {
      id: 4,
      title: 'Gentle Movement',
      description: 'Light stretching or walking to move your body and calm your mind.',
      icon: '🚶',
      duration: '15 minutes',
      steps: [
        'Start with slow arm circles',
        'Gently stretch your neck and shoulders',
        'Take a short walk if possible',
        'Move at your own pace',
        'Focus on your movements',
        'End with a few deep breaths',
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-warm-pink dark:bg-dark-bg py-12 px-4 sm:px-6 lg:px-8 transition-all duration-300">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-800 dark:text-gray-100">
            Mindfulness Exercises 🧘
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Take a moment for yourself. These exercises can help you feel more relaxed and centered.
          </p>
        </div>

        {/* Exercises Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {exercises.map((exercise) => (
            <div
              key={exercise.id}
              className="bg-white dark:bg-dark-surface rounded-softer p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
            >
              {/* Exercise Header */}
              <div className="flex items-start gap-4 mb-4">
                <div className="text-5xl">{exercise.icon}</div>
                <div className="flex-1">
                  <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-1">
                    {exercise.title}
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-500">
                    {exercise.duration}
                  </p>
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {exercise.description}
              </p>

              {/* Steps */}
              <div className="bg-sky-blue dark:bg-dark-bg rounded-soft p-4">
                <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-3">
                  How to do it:
                </h3>
                <ol className="list-decimal list-inside space-y-2">
                  {exercise.steps.map((step, index) => (
                    <li
                      key={index}
                      className="text-sm text-gray-600 dark:text-gray-400"
                    >
                      {step}
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          ))}
        </div>

        {/* Reminder */}
        <div className="mt-12 bg-white dark:bg-dark-surface rounded-softer p-6 shadow-lg text-center">
          <p className="text-gray-600 dark:text-gray-400">
            💚 <strong>Remember:</strong> It's okay to feel these emotions. These exercises are here to support you.
            Practice self-compassion and take things one moment at a time.
          </p>
        </div>

        {/* Emotion Regulation Tips Section */}
        <div className="mt-16">
          <EmotionTipsSection />
        </div>
      </div>
    </div>
  );
};

export default Exercises;

