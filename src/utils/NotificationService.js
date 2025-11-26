/**
 * Notification Service
 * Manages daily notifications and thoughts of the day
 */

const notificationMessages = [
  "You've got this. One deep breath at a time 🌿",
  "Even small progress is still progress 🌼",
  "Take a sip of water and unclench your jaw 💧",
  "You're stronger than you think 💪",
  "It's okay to take things one moment at a time ⏰",
  "Your feelings are valid, and so are you 💛",
  "Remember to breathe deeply today 🌬️",
  "Small acts of self-care matter 🌟",
  "You're doing better than you think 📈",
  "Give yourself credit for trying 🌈",
  "Rest is productive too 💤",
  "You deserve kindness, especially from yourself 🫶",
];

// Zomato-style personalized, caring, empathetic, uplifting notifications
const personalizedCareMessages = [
  // Sweet & Friendly
  "Hey there! Just checking in - how are you feeling today? 💙",
  "You matter, and your feelings matter too. Always remember that ✨",
  "Taking a moment for yourself isn't selfish - it's necessary 🌸",
  "You're doing great, even on days when it doesn't feel like it 🌼",
  
  // Caring & Empathetic
  "Sometimes it's okay to just be, without needing to do anything 💚",
  "Your mental health is just as important as your physical health 💪",
  "Feeling overwhelmed? That's okay. Take it one step at a time 🫂",
  "You're not alone in this. We're here with you every step of the way 🤗",
  
  // Uplifting & Supportive
  "Every day is a fresh start. You've got this! 🌟",
  "Small steps lead to big changes. Keep going! 🚀",
  "Your journey is unique, and that's what makes it beautiful 🌈",
  "You're stronger than you know, braver than you feel 💫",
  
  // Encouraging & Warm
  "Remember to be kind to yourself today - you deserve it 🎀",
  "Progress isn't always visible, but every effort counts 📈",
  "You're allowed to have off days. They don't define you 💛",
  "Take a deep breath. You're doing better than you think 🌬️",
  
  // Supportive & Understanding
  "Your emotions are valid, even the difficult ones 🕊️",
  "It's okay to ask for help when you need it. That's strength 💙",
  "You've overcome challenges before, and you'll overcome this too 🌊",
  "Give yourself permission to rest - you've earned it 🛌",
  
  // Motivational & Gentle
  "You're exactly where you need to be in your journey 🌻",
  "Self-care isn't a luxury, it's a necessity. Treat yourself kindly 🌺",
  "Your feelings are temporary, but your strength is lasting 💎",
  "Remember: healing isn't linear, and that's completely okay 🦋",
  
  // Positive & Reassuring
  "You have the power to turn things around, one moment at a time ⚡",
  "Believe in yourself - we believe in you! 🌟",
  "You're allowed to take breaks. Your wellbeing comes first 🍃",
  "Every emotion you feel is a message from your mind. Listen to it 🎧",
  
  // Comforting & Loving
  "You're loved, you're valued, and you're enough - just as you are ❤️",
  "It's okay to not be okay. Healing takes time 🌙",
  "You're making progress, even when it doesn't feel like it 🌱",
  "Take care of yourself like you'd take care of someone you love 💐",
];

// Mood Detection Reminder Messages
const moodDetectionReminderMessages = [
  "How are you feeling right now? Take a moment to check in with yourself 📸",
  "Your mood matters! Consider using mood detection to track how you're feeling today 😊",
  "Time for a quick mood check? It only takes a moment and helps you understand yourself better 🌈",
  "Feeling something? Let's capture that moment with mood detection 💚",
  "Your emotions are important. Track them with our mood detection feature 📊",
  "A quick mood check can help you understand your patterns better. Ready to try? ✨",
];

// Well-being Reminder Messages
const wellbeingReminderMessages = [
  "Remember to take a break and breathe deeply 🌬️",
  "Have you had enough water today? Stay hydrated! 💧",
  "A few minutes of movement can boost your mood. How about a quick stretch? 🧘",
  "Self-care isn't selfish - it's essential. What can you do for yourself right now? 💙",
  "Your wellbeing matters. Take a moment to check in with your body and mind 🫂",
  "Small acts of self-care add up. What's one thing you can do for yourself today? 🌸",
  "Remember: rest is productive too. Give yourself permission to pause 🛌",
  "Your mental health is just as important as your physical health. How are you doing? 💚",
];

// Supportive Reminder Messages
const supportiveReminderMessages = [
  "You're doing better than you think. Keep going! 💪",
  "Every small step forward counts. You've got this! 🌟",
  "It's okay to have difficult days. You're still moving forward 🌈",
  "You're stronger than you know. Remember that 💎",
  "Progress isn't always visible, but you're making it. Trust the process 📈",
  "You're not alone in this journey. We're here with you 🤗",
  "Your feelings are valid. It's okay to feel what you're feeling 💙",
  "You've overcome challenges before. You can do it again! 🚀",
  "Be gentle with yourself today. You're doing your best 🌸",
  "Remember: healing and growth take time. Be patient with yourself 🦋",
];

const thoughtsOfTheDay = [
  {
    quote: "The only way out is through.",
    author: "Robert Frost",
  },
  {
    quote: "You yourself, as much as anybody in the entire universe, deserve your love and affection.",
    author: "Buddha",
  },
  {
    quote: "The present moment is the only time over which we have dominion.",
    author: "Thich Nhat Hanh",
  },
  {
    quote: "It's okay to not be okay, but it's not okay to stay that way.",
    author: "Unknown",
  },
  {
    quote: "Progress, not perfection.",
    author: "Unknown",
  },
  {
    quote: "Healing is not linear.",
    author: "Unknown",
  },
  {
    quote: "You are enough just as you are.",
    author: "Unknown",
  },
  {
    quote: "Feelings are temporary visitors. Let them come and go.",
    author: "Unknown",
  },
  {
    quote: "Self-care is giving the world the best of you, instead of what's left of you.",
    author: "Katie Reed",
  },
  {
    quote: "Your mental health is more important than your productivity.",
    author: "Unknown",
  },
];

/**
 * Get today's date as a string for localStorage key
 */
const getTodayKey = () => {
  const today = new Date();
  return `notification_${today.getFullYear()}_${today.getMonth()}_${today.getDate()}`;
};

/**
 * Get unique user identifier for thought storage
 */
const getUserId = () => {
  // Try to get user ID from localStorage or use session-based ID
  try {
    const user = localStorage.getItem('moodio_user');
    if (user) {
      const parsedUser = JSON.parse(user);
      return parsedUser.id || parsedUser.email || parsedUser.userId || 'anonymous';
    }
  } catch (e) {
    // If parsing fails, continue with session ID
  }
  
  // Generate or get a session-based ID that persists only for this browser session
  let sessionId = sessionStorage.getItem('moodio_session_id');
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    sessionStorage.setItem('moodio_session_id', sessionId);
  }
  return sessionId;
};

/**
 * Get unique thought index based on timestamp and user ID (ensures uniqueness per visit)
 */
const getThoughtIndex = (userId, timestamp) => {
  // Combine user ID, timestamp, and random factor for true uniqueness
  const combinedSeed = (userId + timestamp + Math.random().toString()).split('').reduce((acc, char) => {
    return acc + char.charCodeAt(0);
  }, 0);
  return combinedSeed % thoughtsOfTheDay.length;
};

/**
 * Get recently shown thoughts for this user to avoid immediate repeats
 */
const getRecentThoughts = (userId) => {
  const key = `recent_thoughts_${userId}`;
  try {
    const recent = localStorage.getItem(key);
    return recent ? JSON.parse(recent) : [];
  } catch (e) {
    return [];
  }
};

/**
 * Get recently shown personalized care messages to avoid immediate repeats
 */
const getRecentCareMessages = () => {
  const key = 'recent_care_messages';
  try {
    const recent = localStorage.getItem(key);
    return recent ? JSON.parse(recent) : [];
  } catch (e) {
    return [];
  }
};

/**
 * Save recent care message to avoid immediate repeats
 */
const saveRecentCareMessage = (messageIndex) => {
  const key = 'recent_care_messages';
  const recent = getRecentCareMessages();
  // Keep only last 10 messages to avoid repeats
  recent.push(messageIndex);
  if (recent.length > 10) {
    recent.shift();
  }
  try {
    localStorage.setItem(key, JSON.stringify(recent));
  } catch (e) {
    // If storage fails, continue anyway
  }
};

/**
 * Get personalized care message (Zomato-style: sweet, caring, empathetic, uplifting)
 * @param {Object} lastMood - User's last detected mood for personalization
 * @returns {string} Personalized care message
 */
export const getPersonalizedCareMessage = (lastMood = null) => {
  const recentMessages = getRecentCareMessages();
  let availableMessages = [];
  
  // If user has a last mood, prioritize mood-appropriate messages
  if (lastMood && lastMood.mood) {
    const mood = lastMood.mood.toLowerCase();
    
    // Mood-specific care messages (more empathetic for negative moods)
    const moodCareMessages = {
      sad: [
        "It's okay to feel sad sometimes. We're here with you 💙",
        "Your feelings matter. Take all the time you need 🕊️",
        "You're allowed to feel what you feel. That's completely valid 💚",
        "This feeling will pass. Until then, we've got your back 🫂",
      ],
      anxious: [
        "Take a deep breath. You're safe in this moment 🌬️",
        "Anxiety is just your mind trying to protect you. You're okay 💙",
        "One step at a time, one breath at a time. You've got this 🌸",
        "Remember: feelings are temporary. This will pass ✨",
      ],
      stressed: [
        "Stress is overwhelming, but you're stronger than it feels 💪",
        "Give yourself permission to pause and breathe 🌿",
        "It's okay to take a break when things feel too much 🛌",
        "You're handling a lot. Be kind to yourself today 💚",
      ],
      angry: [
        "Anger is valid. What matters is how you channel it 🌊",
        "Take a moment to breathe. You're in control of your response 🌬️",
        "It's okay to feel angry. Your feelings are always valid 💙",
        "Sometimes anger is just hurt in disguise. Be gentle with yourself 🕊️",
      ],
      tired: [
        "You've been working hard. Rest isn't giving up - it's recharging 🛌",
        "Tired? That's okay. Your body is asking for rest - honor that 🌙",
        "Even superheroes need rest. Take care of yourself today 💤",
        "Being tired is valid. You deserve rest and relaxation 🌸",
      ],
      lonely: [
        "You're not alone, even when it feels that way. We're here 💙",
        "Loneliness is hard. Remember, connection is just one moment away 🤗",
        "Your feelings of loneliness are valid. Reach out when you're ready 🕊️",
        "You matter, and you're connected to a world that cares about you 🌟",
      ],
      overwhelmed: [
        "When everything feels too much, focus on just one thing at a time 🌊",
        "You don't have to handle everything at once. Break it down 🌿",
        "Overwhelmed? That's okay. Let's take things one step at a time 💙",
        "Your mind is doing a lot. Give it (and yourself) some grace 🌸",
      ],
      happy: [
        "Your joy is beautiful! Keep spreading that positive energy 🌟",
        "We love seeing you happy! Keep those good vibes flowing ✨",
        "Happiness looks great on you! Enjoy every moment of it 😊",
        "Your positive energy is infectious - keep it up! 🌈",
      ],
      calm: [
        "Your peace is precious. Savor this moment of tranquility 🕊️",
        "Calm looks beautiful on you. Stay grounded in this feeling 🌿",
        "This peaceful energy suits you. Keep nurturing it ✨",
        "You've found your center - stay there as long as you need 🌸",
      ],
      excited: [
        "Your excitement is contagious! Channel that energy into something great 🚀",
        "We love your enthusiasm! Harness it for something amazing 🌟",
        "That excitement in you is powerful - use it wisely! ⚡",
        "Your positive energy is electric! Keep it flowing ✨",
      ],
      grateful: [
        "Gratitude looks beautiful on you. Keep that heart full 💛",
        "Your appreciation for life is inspiring. Keep counting those blessings 🌟",
        "Gratitude transforms ordinary moments into blessings. Keep it up ✨",
        "Your thankful heart is a gift to yourself and others 💎",
      ],
      neutral: [
        "Sometimes neutral is exactly what you need. That's perfectly fine 🎧",
        "A balanced mood is a gift. Enjoy this moment of calm 🌊",
        "Neutral isn't boring - it's stable and peaceful. Embrace it 🌸",
        "Being in the middle is okay. Life doesn't always need extremes 💙",
      ],
    };
    
    // Get mood-specific messages if available
    const moodMessages = moodCareMessages[mood];
    if (moodMessages && moodMessages.length > 0) {
      // Combine mood-specific with general messages, prioritizing mood-specific
      availableMessages = [...moodMessages, ...personalizedCareMessages];
    } else {
      availableMessages = personalizedCareMessages;
    }
  } else {
    availableMessages = personalizedCareMessages;
  }
  
  // Filter out recently shown messages
  let availableIndices = availableMessages
    .map((_, index) => index)
    .filter(index => !recentMessages.includes(index));
  
  // If all messages were recently shown, reset and use all messages
  if (availableIndices.length === 0) {
    try {
      localStorage.removeItem('recent_care_messages');
    } catch (e) {
      // Continue anyway
    }
    availableIndices = availableMessages.map((_, index) => index);
  }
  
  // Pick a random message from available ones
  const randomArrayIndex = Math.floor(Math.random() * availableIndices.length);
  const selectedIndex = availableIndices[randomArrayIndex];
  
  // Save this message to recent list
  saveRecentCareMessage(selectedIndex);
  
  return availableMessages[selectedIndex];
};

/**
 * Save recent thought to avoid immediate repeats
 */
const saveRecentThought = (userId, thoughtIndex) => {
  const key = `recent_thoughts_${userId}`;
  const recent = getRecentThoughts(userId);
  // Keep only last 5 thoughts to avoid repeats
  recent.push(thoughtIndex);
  if (recent.length > 5) {
    recent.shift();
  }
  try {
    localStorage.setItem(key, JSON.stringify(recent));
  } catch (e) {
    // If storage fails, continue anyway
  }
};

/**
 * Check if notification was shown today
 */
export const hasNotificationBeenShown = () => {
  const key = getTodayKey();
  return localStorage.getItem(key) === 'true';
};

/**
 * Mark notification as shown today
 */
export const markNotificationAsShown = () => {
  const key = getTodayKey();
  localStorage.setItem(key, 'true');
};

/**
 * Get personalized notification message based on user's last mood
 * @param {Object} lastMood - User's last detected mood
 * @returns {string} Personalized notification message
 */
export const getPersonalizedNotificationMessage = (lastMood = null) => {
  // If user has a last mood, provide mood-specific messages
  if (lastMood && lastMood.mood) {
    const mood = lastMood.mood.toLowerCase();
    
    // Mood-specific notification messages
    const moodMessages = {
      happy: [
        "Keep that positive energy flowing! 🌟",
        "Your happiness is contagious today! 😊",
        "You're radiating good vibes - keep it up! ✨",
      ],
      sad: [
        "You're stronger than you know. This feeling will pass 💙",
        "Take care of yourself today. You deserve kindness 💚",
        "It's okay to feel this way. You're not alone 🌼",
      ],
      stressed: [
        "Take a deep breath. You've got this 🌿",
        "Remember to pause and breathe. One moment at a time ⏰",
        "Give yourself permission to rest. Your mental health matters 💧",
      ],
      anxious: [
        "You're safe in this moment. Focus on your breathing 🌬️",
        "Take things one step at a time. You're doing your best 🌸",
        "Remember: feelings are temporary. This will pass 💛",
      ],
      angry: [
        "It's okay to feel angry. What matters is how you handle it 🌿",
        "Take a moment to breathe deeply. You're in control 💧",
        "Your feelings are valid. Consider what's really bothering you 💙",
      ],
      calm: [
        "You're in a peaceful space. Enjoy this moment of tranquility 🌿",
        "Your calm energy is beautiful. Keep nurturing it ✨",
        "You've found your center. Stay grounded today 💚",
      ],
      excited: [
        "Your enthusiasm is infectious! Channel that energy positively 🎉",
        "Harness that excitement for something great today! 🌟",
        "You're radiating positivity - share it with the world! ✨",
      ],
    };
    
    // Get messages for this mood
    const messages = moodMessages[mood] || notificationMessages;
    const index = Math.floor(Math.random() * messages.length);
    return messages[index];
  }
  
  // Default: return a general message
  const today = new Date();
  const index = today.getDate() % notificationMessages.length;
  return notificationMessages[index];
};

/**
 * Get random notification message (fallback for compatibility)
 */
export const getNotificationMessage = (lastMood = null) => {
  return getPersonalizedNotificationMessage(lastMood);
};

/**
 * Get thought of the day (unique for every visit and user)
 * Changes on every page load/refresh and is unique per user
 */
export const getThoughtOfTheDay = (forceNew = false) => {
  const userId = getUserId();
  const timestamp = Date.now();
  const recentThoughts = getRecentThoughts(userId);
  
  // Get a unique thought index based on user ID and timestamp
  let index = getThoughtIndex(userId, timestamp);
  
  // Avoid showing the same thought that was recently shown
  let attempts = 0;
  while (recentThoughts.includes(index) && attempts < thoughtsOfTheDay.length) {
    // Try next thought
    index = (index + 1) % thoughtsOfTheDay.length;
    attempts++;
  }
  
  // If we've shown all thoughts recently, allow repeats
  if (attempts >= thoughtsOfTheDay.length) {
    // Clear recent thoughts and start fresh
    try {
      localStorage.removeItem(`recent_thoughts_${userId}`);
    } catch (e) {
      // Continue anyway
    }
    // Get a fresh index
    index = getThoughtIndex(userId, timestamp);
  }
  
  const thought = thoughtsOfTheDay[index];
  
  // Save this thought to recent list to avoid immediate repeats
  saveRecentThought(userId, index);
  
  return thought;
};

/**
 * Show daily notification if not shown today and user has enabled reminders
 * @param {Function} showToast - Toast notification function
 * @param {Object} preferences - User preferences object
 * @param {Object} lastMood - User's last detected mood for personalization
 * @returns {string|null} - The notification message or null if not shown
 */
export const showDailyNotification = (showToast, preferences = null, lastMood = null) => {
  // Check if user has enabled reminders (default to true if preferences not provided)
  const remindersEnabled = preferences?.notificationPreferences?.reminders !== false;
  
  // If reminders are disabled, don't show notification
  if (!remindersEnabled) {
    return null;
  }
  
  if (!hasNotificationBeenShown()) {
    // Get personalized message based on user's last mood
    const message = getPersonalizedNotificationMessage(lastMood);
    if (showToast) {
      showToast(message, 'info', 5000);
    }
    markNotificationAsShown();
    return message;
  }
  return null;
};

/**
 * Show mood tracking reminder if user hasn't tracked mood today
 * @param {Function} showToast - Toast notification function
 * @param {Object} preferences - User preferences object
 * @param {Object} lastMood - User's last detected mood
 * @param {boolean} hasTrackedToday - Whether user has tracked mood today
 * @returns {string|null} - The reminder message or null if not shown
 */
export const showMoodTrackingReminder = (showToast, preferences = null, lastMood = null, hasTrackedToday = false) => {
  // Check if user has enabled mood tracking reminders (default to true if preferences not provided)
  const remindersEnabled = preferences?.notificationPreferences?.moodTrackingReminder !== false;
  
  // If reminders are disabled or already tracked today, don't show reminder
  if (!remindersEnabled || hasTrackedToday) {
    return null;
  }
  
  // Check if user has tracked mood in the last 24 hours
  const lastMoodDate = lastMood?.timestamp ? new Date(lastMood.timestamp) : null;
  const today = new Date();
  const oneDayAgo = new Date(today.getTime() - 24 * 60 * 60 * 1000);
  
  // If last mood was within 24 hours, don't show reminder
  if (lastMoodDate && lastMoodDate > oneDayAgo) {
    return null;
  }
  
  // Show personalized reminder based on time since last mood
  const messages = [
    "How are you feeling today? Take a moment to check in with yourself 💚",
    "Your mood matters! Consider tracking how you're feeling today 🌸",
    "Time for a quick mood check-in? It only takes a moment 😊",
    "Remember to track your mood - it helps you understand yourself better 🌿",
  ];
  
  const message = messages[Math.floor(Math.random() * messages.length)];
  if (showToast) {
    showToast(message, 'info', 5000);
  }
  return message;
};

/**
 * Start recurring personalized care notifications (every 2 minutes)
 * @param {Function} showToast - Toast notification function
 * @param {Object} preferences - User preferences object
 * @param {Object} lastMood - User's last detected mood for personalization
 * @returns {Function} - Cleanup function to stop the notifications
 */
export const startPersonalizedCareNotifications = (showToast, preferences = null, lastMood = null) => {
  // Check if user has enabled reminders (default to true if preferences not provided)
  const remindersEnabled = preferences?.notificationPreferences?.personalizedCareNotifications !== false;
  
  // If reminders are disabled, return a no-op cleanup function
  if (!remindersEnabled) {
    return () => {};
  }
  
  let intervalId = null;
  
  // Start showing notifications every 2 minutes (120000ms)
  intervalId = setInterval(() => {
    const message = getPersonalizedCareMessage(lastMood);
    if (showToast && message) {
      showToast(message, 'info', 6000); // Show for 6 seconds
    }
  }, 120000); // 2 minutes = 120000 milliseconds
  
  // Return cleanup function to stop notifications
  return () => {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
  };
};

/**
 * Start mood detection reminders (every 2 minutes)
 * @param {Function} showToast - Toast notification function
 * @param {Object} preferences - User preferences object
 * @returns {Function} - Cleanup function to stop the notifications
 */
export const startMoodDetectionReminders = (showToast, preferences = null) => {
  const remindersEnabled = preferences?.notificationPreferences?.moodDetectionReminders !== false;
  
  if (!remindersEnabled) {
    return () => {};
  }
  
  let intervalId = null;
  
  intervalId = setInterval(() => {
    const messages = moodDetectionReminderMessages;
    const message = messages[Math.floor(Math.random() * messages.length)];
    if (showToast && message) {
      showToast(message, 'info', 6000);
    }
  }, 120000); // 2 minutes
  
  return () => {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
  };
};

/**
 * Start well-being reminders (every 2 minutes)
 * @param {Function} showToast - Toast notification function
 * @param {Object} preferences - User preferences object
 * @returns {Function} - Cleanup function to stop the notifications
 */
export const startWellbeingReminders = (showToast, preferences = null) => {
  const remindersEnabled = preferences?.notificationPreferences?.wellbeingReminders !== false;
  
  if (!remindersEnabled) {
    return () => {};
  }
  
  let intervalId = null;
  
  intervalId = setInterval(() => {
    const messages = wellbeingReminderMessages;
    const message = messages[Math.floor(Math.random() * messages.length)];
    if (showToast && message) {
      showToast(message, 'info', 6000);
    }
  }, 120000); // 2 minutes
  
  return () => {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
  };
};

/**
 * Start supportive reminders (every 2 minutes)
 * @param {Function} showToast - Toast notification function
 * @param {Object} preferences - User preferences object
 * @returns {Function} - Cleanup function to stop the notifications
 */
export const startSupportiveReminders = (showToast, preferences = null) => {
  const remindersEnabled = preferences?.notificationPreferences?.supportiveReminders !== false;
  
  if (!remindersEnabled) {
    return () => {};
  }
  
  let intervalId = null;
  
  intervalId = setInterval(() => {
    const messages = supportiveReminderMessages;
    const message = messages[Math.floor(Math.random() * messages.length)];
    if (showToast && message) {
      showToast(message, 'info', 6000);
    }
  }, 120000); // 2 minutes
  
  return () => {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
  };
};

/**
 * Start consecutive notifications system
 * Rotates through all enabled notification types every 2 minutes
 * @param {Function} showToast - Toast notification function
 * @param {Object} preferences - User preferences object
 * @param {Object} lastMood - User's last detected mood for personalization
 * @returns {Function} - Cleanup function to stop the notifications
 */
export const startConsecutiveNotifications = (showToast, preferences = null, lastMood = null) => {
  // Build list of enabled notification types
  const enabledTypes = [];
  
  // Check which notification types are enabled
  if (preferences?.notificationPreferences?.personalizedCareNotifications !== false) {
    enabledTypes.push('personalizedCare');
  }
  if (preferences?.notificationPreferences?.moodDetectionReminders !== false) {
    enabledTypes.push('moodDetection');
  }
  if (preferences?.notificationPreferences?.wellbeingReminders !== false) {
    enabledTypes.push('wellbeing');
  }
  if (preferences?.notificationPreferences?.supportiveReminders !== false) {
    enabledTypes.push('supportive');
  }
  if (preferences?.notificationPreferences?.reminders !== false) {
    enabledTypes.push('daily');
  }
  if (preferences?.notificationPreferences?.moodTrackingReminder !== false) {
    enabledTypes.push('moodTracking');
  }
  
  // If no notifications are enabled, return no-op cleanup
  if (enabledTypes.length === 0) {
    return () => {};
  }
  
  let currentIndex = 0;
  let intervalId = null;
  
  // Function to get the next notification message based on type
  const getNextNotification = () => {
    if (enabledTypes.length === 0) return null;
    
    const type = enabledTypes[currentIndex];
    let message = null;
    
    switch (type) {
      case 'personalizedCare':
        message = getPersonalizedCareMessage(lastMood);
        break;
      case 'moodDetection':
        message = moodDetectionReminderMessages[Math.floor(Math.random() * moodDetectionReminderMessages.length)];
        break;
      case 'wellbeing':
        message = wellbeingReminderMessages[Math.floor(Math.random() * wellbeingReminderMessages.length)];
        break;
      case 'supportive':
        message = supportiveReminderMessages[Math.floor(Math.random() * supportiveReminderMessages.length)];
        break;
      case 'daily':
        message = getPersonalizedNotificationMessage(lastMood);
        break;
      case 'moodTracking':
        const today = new Date();
        const todayStr = today.toDateString();
        const lastMoodDate = lastMood?.timestamp ? new Date(lastMood.timestamp).toDateString() : null;
        const hasTrackedToday = lastMoodDate === todayStr;
        if (!hasTrackedToday) {
          const trackingMessages = [
            "How are you feeling today? Take a moment to check in with yourself 💚",
            "Your mood matters! Consider tracking how you're feeling today 🌸",
            "Time for a quick mood check-in? It only takes a moment 😊",
            "Remember to track your mood - it helps you understand yourself better 🌿",
          ];
          message = trackingMessages[Math.floor(Math.random() * trackingMessages.length)];
        }
        break;
      default:
        message = null;
    }
    
    // Move to next notification type (cycle back to start)
    currentIndex = (currentIndex + 1) % enabledTypes.length;
    
    return message;
  };
  
  // Start showing notifications consecutively every 2 minutes
  intervalId = setInterval(() => {
    // Try to get a message, skipping null results
    let attempts = 0;
    let message = null;
    
    // Try up to enabledTypes.length times to find a valid message
    while (attempts < enabledTypes.length && !message) {
      message = getNextNotification();
      attempts++;
    }
    
    if (showToast && message) {
      showToast(message, 'info', 6000); // Show for 6 seconds
    }
  }, 120000); // 2 minutes = 120000 milliseconds
  
  // Return cleanup function to stop notifications
  return () => {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
  };
};

export default {
  hasNotificationBeenShown,
  markNotificationAsShown,
  getNotificationMessage,
  getPersonalizedNotificationMessage,
  getThoughtOfTheDay,
  showDailyNotification,
  showMoodTrackingReminder,
  getPersonalizedCareMessage,
  startPersonalizedCareNotifications,
  startMoodDetectionReminders,
  startWellbeingReminders,
  startSupportiveReminders,
  startConsecutiveNotifications,
};

