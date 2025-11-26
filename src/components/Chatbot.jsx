import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useMood } from '../context/MoodContext';
import { useToast } from '../utils/Toast';
import api from '../utils/api';
import { FaPaperPlane, FaUser, FaRobot, FaTrash, FaEye, FaEyeSlash, FaLock } from 'react-icons/fa';
import { startConsecutiveNotifications } from '../utils/NotificationService';
import ConfirmationModal from './ConfirmationModal';

// Cute, touching, friendly nicknames for females
const FEMALE_NICKNAMES = [
  'sweetheart', 'darling', 'sunshine', 'honey', 'love', 'angel', 'star', 'treasure',
  'beautiful', 'precious', 'dear', 'sweetie', 'gem', 'moonbeam', 'starlight', 'sunbeam',
  'butterfly', 'rainbow', 'sparkle', 'dove', 'peach', 'cupcake', 'honeybee', 'diamond',
  'petal', 'dearest', 'beloved', 'princess', 'sweetness', 'heaven', 'moon', 'sugar',
  'joy', 'smile', 'happiness', 'light', 'glow', 'shine', 'radiance', 'brilliance',
  'rose', 'lily', 'cherry', 'pearl', 'crystal', 'sapphire', 'emerald', 'ruby',
  'queen', 'goddess', 'diva', 'beauty', 'elegance', 'grace', 'charm', 'blossom'
];

// Cute, touching, friendly nicknames for males
const MALE_NICKNAMES = [
  'champ', 'buddy', 'friend', 'hero', 'champion', 'rockstar', 'superstar', 'wonder',
  'warrior', 'king', 'prince', 'tiger', 'lion', 'eagle', 'phoenix', 'legend',
  'star', 'gem', 'diamond', 'treasure', 'champion', 'warrior', 'hero', 'legend',
  'buddy', 'pal', 'mate', 'bro', 'dude', 'chief', 'captain', 'boss',
  'ace', 'pro', 'master', 'genius', 'wizard', 'ninja', 'soldier', 'guardian',
  'knight', 'warrior', 'champion', 'hero', 'legend', 'star', 'gem', 'treasure',
  'rock', 'anchor', 'pillar', 'strength', 'power', 'force', 'thunder', 'lightning'
];

// Gender-neutral nicknames (for 'other' or 'prefer-not-to-say')
const NEUTRAL_NICKNAMES = [
  'sweetheart', 'darling', 'sunshine', 'honey', 'love', 'angel', 'star', 'treasure',
  'beautiful', 'precious', 'dear', 'sweetie', 'champ', 'buddy', 'friend', 'gem',
  'moonbeam', 'starlight', 'sunbeam', 'butterfly', 'rainbow', 'sparkle', 'dove',
  'peach', 'cupcake', 'honeybee', 'diamond', 'petal', 'dearest', 'beloved',
  'kiddo', 'sweetness', 'heaven', 'moon', 'sugar', 'joy', 'smile', 'happiness'
];

/**
 * Get a random cute nickname based on user's gender
 * @param {string} gender - User's gender ('male', 'female', 'other', 'prefer-not-to-say', or undefined)
 * @returns {string} A random nickname
 */
const getRandomNickname = (gender) => {
  let nicknameList;
  
  if (gender === 'female') {
    nicknameList = FEMALE_NICKNAMES;
  } else if (gender === 'male') {
    nicknameList = MALE_NICKNAMES;
  } else {
    // For 'other', 'prefer-not-to-say', or undefined, use neutral nicknames
    nicknameList = NEUTRAL_NICKNAMES;
  }
  
  return nicknameList[Math.floor(Math.random() * nicknameList.length)];
};

const Chatbot = () => {
  const { user, preferences } = useAuth();
  const { lastMood } = useMood();
  const { showToast, ToastContainer } = useToast();
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentNickname, setCurrentNickname] = useState('');
  const messagesEndRef = useRef(null);
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  // Set a random nickname based on user's gender when component mounts
  useEffect(() => {
    if (!currentNickname && preferences) {
      const gender = preferences?.personalInfo?.gender;
      const nickname = getRandomNickname(gender);
      setCurrentNickname(nickname);
    }
  }, [preferences, currentNickname]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (messages.length === 0 && currentNickname) {
      setMessages([
        {
          id: Date.now(),
          text: `Hello, ${currentNickname}! I'm your AI Twin, here to support you on your mental wellness journey. How are you feeling today? 💚`,
          sender: 'bot',
          timestamp: new Date(),
        },
      ]);
    }
  }, [currentNickname, messages.length]);

  // Start consecutive notifications system (every 2 minutes)
  useEffect(() => {
    if (!user) return;
    const cleanup = startConsecutiveNotifications(showToast, preferences, lastMood);
    return cleanup;
  }, [showToast, user, preferences, lastMood]);

  /**
   * Fetch chat history from API
   */
  const fetchChatHistory = async () => {
    if (!user) {
      setChatHistory([]);
      return;
    }

    setIsLoadingHistory(true);
    try {
      const userId = user.id || user.userId || user.email;
      const response = await api.get(`/chat/history?userId=${userId}`);
      
      if (response.data && response.data.success) {
        setChatHistory(response.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching chat history:', error);
      setChatHistory([]);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  /**
   * Load chat history when component mounts or user changes
   */
  useEffect(() => {
    if (user) {
      fetchChatHistory();
    }
  }, [user]);

  /**
   * Show confirmation modal for clearing chat history
   */
  const handleClearHistory = () => {
    if (!user) {
      showToast('Please log in to clear chat history', 'error');
      return;
    }
    setShowClearConfirm(true);
  };

  /**
   * Confirm and clear all chat history
   */
  const handleConfirmClearHistory = async () => {
    setIsClearing(true);
    try {
      const userId = user.id || user.userId || user.email;
      const response = await api.delete(`/chat/history?userId=${userId}`);

      if (response.data && response.data.success) {
        setChatHistory([]);
        showToast(
          `Successfully cleared ${response.data.deletedCount || 0} chat messages`,
          'success',
          3000
        );
      } else {
        throw new Error(response.data?.error || 'Failed to clear chat history');
      }
    } catch (error) {
      console.error('Error clearing chat history:', error);
      showToast(
        error.response?.data?.error || error.message || 'Failed to clear chat history. Please try again.',
        'error'
      );
    } finally {
      setIsClearing(false);
      setShowClearConfirm(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      text: inputMessage.trim(),
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Use the current nickname (should already be set from useEffect)
      const gender = preferences?.personalInfo?.gender;
      const nickname = currentNickname || getRandomNickname(gender);
      if (!currentNickname) {
        setCurrentNickname(nickname);
      }
      
      // Get userId - ensure we have a valid identifier
      const userId = user?.id || user?.userId || user?.email;
      if (!userId) {
        showToast('Please log in to chat', 'error');
        setIsLoading(false);
        return;
      }

      console.log('📤 Sending chat message with userId:', userId);
      
      const response = await api.post('/chat', {
        message: userMessage.text,
        userId: userId,
        userName: nickname, // Use cute nickname instead of real name
      });

      if (response.data && response.data.success) {
        const botMessage = {
          id: Date.now() + 1,
          text: response.data.message || response.data.response || 'I understand. How can I help you further?',
          sender: 'bot',
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, botMessage]);
        // Refresh chat history after sending a message (with a small delay to ensure DB save completes)
        setTimeout(() => {
          fetchChatHistory();
        }, 500);
      } else {
        throw new Error(response.data?.error || 'Failed to get response');
      }
    } catch (error) {
      console.error('Chatbot error:', error);
      const errorMessage = {
        id: Date.now() + 1,
        text: "I'm having trouble connecting right now. Please try again in a moment, or feel free to reach out through our contact page. 💙",
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
      showToast('Failed to send message. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-warm-pink dark:bg-dark-bg transition-all duration-300 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-calm-purple dark:bg-accent-blue mb-4">
            <FaRobot className="text-3xl text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-gray-100 mb-2">
            Chat with Your AI Twin
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Your empathetic companion for mental wellness support
          </p>
        </div>

        <div className="bg-white dark:bg-dark-surface rounded-softer shadow-lg overflow-hidden flex flex-col" style={{ height: '600px' }}>
          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50 dark:bg-dark-bg">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start gap-3 ${
                  message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
                }`}
              >
                <div
                  className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                    message.sender === 'user'
                      ? 'bg-calm-purple dark:bg-accent-blue'
                      : 'bg-soft-green dark:bg-accent-green'
                  }`}
                >
                  {message.sender === 'user' ? (
                    <FaUser className="text-white text-sm" />
                  ) : (
                    <FaRobot className="text-white text-sm" />
                  )}
                </div>

                <div
                  className={`max-w-[75%] rounded-soft p-4 ${
                    message.sender === 'user'
                      ? 'bg-calm-purple dark:bg-accent-blue text-white'
                      : 'bg-white dark:bg-dark-surface text-gray-800 dark:text-gray-100 border border-gray-200 dark:border-gray-700'
                  }`}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.text}</p>
                  <p
                    className={`text-xs mt-2 ${
                      message.sender === 'user'
                        ? 'text-white/70'
                        : 'text-gray-500 dark:text-gray-400'
                    }`}
                  >
                    {new Date(message.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-soft-green dark:bg-accent-green flex items-center justify-center">
                  <FaRobot className="text-white text-sm" />
                </div>
                <div className="bg-white dark:bg-dark-surface rounded-soft p-4 border border-gray-200 dark:border-gray-700">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSendMessage} className="border-t border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-dark-surface">
            <div className="flex gap-3">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Type your message here..."
                className="flex-1 px-4 py-3 rounded-soft border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-bg text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-calm-purple dark:focus:ring-accent-blue focus:border-transparent transition-all duration-300"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={!inputMessage.trim() || isLoading}
                className="px-6 py-3 rounded-soft bg-calm-purple dark:bg-accent-blue text-white font-semibold hover:bg-warm-pink dark:hover:bg-accent-blue/80 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <FaPaperPlane />
                <span className="hidden sm:inline">Send</span>
              </button>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
              Your conversations are private and secure. For professional help, please consult a licensed therapist.
            </p>
          </form>
        </div>

        {/* Chat History Section - Moved below the chat interface */}
        <div className="bg-white dark:bg-dark-surface rounded-softer p-8 mt-8 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
                Chat History 💬
              </h2>
              {!showHistory && (
                <span className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                  <FaLock className="text-xs" />
                  <span>Private</span>
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {/* Delete All Button */}
              {showHistory && chatHistory.length > 0 && (
                <button
                  onClick={handleClearHistory}
                  disabled={isClearing}
                  className="flex items-center gap-2 px-4 py-2 rounded-soft text-sm font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 border border-red-300 dark:border-red-700 text-red-700 dark:text-red-300"
                  title="Delete all chat history"
                >
                  <FaTrash className="text-base" />
                  <span>{isClearing ? 'Deleting...' : 'Clear All'}</span>
                </button>
              )}
              {/* Show/Hide Toggle Button */}
              <button
                onClick={() => setShowHistory(!showHistory)}
                className="flex items-center gap-2 px-4 py-2 rounded-soft text-sm font-medium transition-all duration-300 bg-gray-100 dark:bg-dark-bg hover:bg-gray-200 dark:hover:bg-dark-surface border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300"
                title={showHistory ? 'Hide chat history' : 'Show chat history'}
              >
                {showHistory ? (
                  <>
                    <FaEyeSlash className="text-base" />
                    <span>Hide</span>
                  </>
                ) : (
                  <>
                    <FaEye className="text-base" />
                    <span>Show</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {!showHistory ? (
            <div className="text-center py-12">
              <FaLock className="mx-auto text-4xl text-gray-400 dark:text-gray-600 mb-4" />
              <p className="text-gray-600 dark:text-gray-400 mb-2 font-medium">
                Chat history is hidden for privacy
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500">
                Click "Show" above to view your previous conversations
              </p>
            </div>
          ) : isLoadingHistory ? (
            <div className="text-center py-8">
              <p className="text-gray-600 dark:text-gray-400">Loading chat history...</p>
            </div>
          ) : chatHistory.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-500 text-center py-8">
              No chat history yet. Start a conversation above! 💚
            </p>
          ) : (
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {chatHistory.map((entry) => (
                <div
                  key={entry._id}
                  className="bg-sky-blue dark:bg-dark-bg p-6 rounded-soft shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                >
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                      {new Date(entry.timestamp).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-500">
                      {new Date(entry.timestamp).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                  <div className="space-y-3">
                    <div className="bg-white dark:bg-dark-surface p-3 rounded-soft">
                      <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">You:</p>
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                        {entry.message}
                      </p>
                    </div>
                    <div className="bg-calm-purple/20 dark:bg-accent-blue/20 p-3 rounded-soft">
                      <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">AI Twin:</p>
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                        {entry.response}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <ToastContainer />

      {/* Confirmation Modal for Clearing Chat History */}
      <ConfirmationModal
        isOpen={showClearConfirm}
        onClose={() => setShowClearConfirm(false)}
        onConfirm={handleConfirmClearHistory}
        title="Delete All Chat History"
        message="Are you sure you want to delete all your chat history? This action cannot be undone and you will lose all your previous conversations permanently."
        confirmText={isClearing ? "Deleting..." : "Delete All"}
        cancelText="Cancel"
        variant="danger"
      />
    </div>
  );
};

export default Chatbot;

