import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import * as faceapi from 'face-api.js';
import api from '../utils/api';
import { useMood } from '../context/MoodContext';
import { useAuth } from '../context/AuthContext';

/**
 * Real-Time Mood Detector Component
 * Runs a 3-second detection session and produces a final mood verdict
 * Automatically redirects based on detected mood
 */
const RealTimeMoodDetector = ({ onClose, isModal = false, onMoodDetected, onError }) => {
  const navigate = useNavigate();
  const { saveMood, clearCurrentMood } = useMood();
  const { user } = useAuth();
  
  // Refs for video and canvas elements
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const detectionFramesRef = useRef([]);

  // State management
  const [isModelLoading, setIsModelLoading] = useState(true);
  const [isDetecting, setIsDetecting] = useState(false);
  const [finalMood, setFinalMood] = useState(null);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [hasPermission, setHasPermission] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [detectionStarted, setDetectionStarted] = useState(false);

  /**
   * Map face-api.js emotions to our mood types
   */
  const emotionToMoodMap = {
    happy: 'happy',
    sad: 'sad',
    angry: 'angry',
    disgusted: 'angry',
    fearful: 'anxious',
    surprised: 'excited',
    neutral: 'calm',
  };

  /**
   * Map moods to redirect destinations
   */
  const getRedirectPath = (mood) => {
    switch (mood) {
      case 'sad':
      case 'angry':
      case 'anxious':
        return '/exercises';
      case 'happy':
      case 'excited':
        return '/music';
      case 'calm':
      case 'neutral':
      default:
        return null;
    }
  };

  /**
   * Get mood emoji
   */
  const getMoodEmoji = (mood) => {
    const emojiMap = {
      happy: '😊',
      sad: '😢',
      angry: '😠',
      anxious: '😟',
      excited: '🤩',
      calm: '😌',
      neutral: '😐',
      tired: '😴',
      lonely: '😔',
      overwhelmed: '😵',
      stressed: '😰',
      grateful: '🙏',
    };
    return emojiMap[mood] || '😊';
  };

  /**
   * Load face-api.js models
   */
  const loadModels = async () => {
    try {
      setIsModelLoading(true);
      setError(null);

      const MODEL_URL = '/models';

      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
        faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
        faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
        faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
      ]);

      setIsModelLoading(false);
    } catch (err) {
      console.error('Error loading models:', err);
      setIsModelLoading(false);
      const errorMsg = 'Failed to load AI models. Please ensure models are in /public/models/ folder.';
      setError(errorMsg);
      if (onError) {
        onError(new Error(errorMsg));
      }
    }
  };

  /**
   * Request webcam access
   */
  const requestWebcam = async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user'
        },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setHasPermission(true);
      }
    } catch (err) {
      console.error('Error accessing webcam:', err);
      let errorMsg = 'Could not access webcam. Please check your camera permissions.';
      if (err.name === 'NotAllowedError') {
        errorMsg = 'Camera permission denied. Please allow camera access in your browser settings.';
      } else if (err.name === 'NotFoundError') {
        errorMsg = 'No camera found. Please connect a camera and try again.';
      } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
        errorMsg = 'Camera is already in use by another application. Please close other apps using the camera and try again.';
      }
      setError(errorMsg);
      setHasPermission(false);
      if (onError && isModal) {
        onError(new Error(errorMsg));
      }
    }
  };

  /**
   * Stop webcam stream
   */
  const stopWebcam = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setHasPermission(false);
  };

  /**
   * Detect emotion from current video frame
   */
  const detectEmotion = async () => {
    if (!videoRef.current || !canvasRef.current || !hasPermission) return null;

    try {
      const video = videoRef.current;
      const canvas = canvasRef.current;

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const detections = await faceapi
        .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceExpressions();

      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (detections.length > 0) {
        const resizedDetections = faceapi.resizeResults(detections, {
          width: video.videoWidth,
          height: video.videoHeight,
        });

        faceapi.draw.drawDetections(canvas, resizedDetections);
        faceapi.draw.drawFaceExpressions(canvas, resizedDetections);

        const expression = detections[0].expressions;
        let maxExpression = null;
        let maxScore = 0;

        Object.keys(expression).forEach((emotion) => {
          if (expression[emotion] > maxScore) {
            maxScore = expression[emotion];
            maxExpression = emotion;
          }
        });

        if (maxExpression && maxScore > 0.3) {
          const moodType = emotionToMoodMap[maxExpression] || 'calm';
          return {
            emotion: maxExpression,
            mood: moodType,
            confidence: maxScore,
          };
        }
      }
      return null;
    } catch (err) {
      console.error('Error detecting emotion:', err);
      return null;
    }
  };

  /**
   * Calculate dominant mood from collected frames
   */
  const calculateDominantMood = (frames) => {
    if (frames.length === 0) return null;

    const moodCounts = {};
    let totalConfidence = 0;

    frames.forEach((frame) => {
      if (frame && frame.mood) {
        moodCounts[frame.mood] = (moodCounts[frame.mood] || 0) + frame.confidence;
        totalConfidence += frame.confidence;
      }
    });

    let dominantMood = null;
    let maxCount = 0;

    Object.keys(moodCounts).forEach((mood) => {
      if (moodCounts[mood] > maxCount) {
        maxCount = moodCounts[mood];
        dominantMood = mood;
      }
    });

    return dominantMood ? {
      mood: dominantMood,
      confidence: maxCount / totalConfidence,
      totalFrames: frames.length,
    } : null;
  };

  /**
   * Save detected mood to database
   */
  const saveMoodToDatabase = async (moodData) => {
    if (!user) {
      console.error('User not logged in, cannot save mood to database');
      return;
    }

    setIsSaving(true);
    try {
      // Get user ID from auth context
      const userId = user.id || user.userId || user.email;

      await api.post('/detect-mood', {
        mood: moodData.mood,
        emotion: moodData.emotion || moodData.mood,
        confidence: moodData.confidence,
        userId: userId,
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      console.error('Error saving mood to database:', err);
    } finally {
      setIsSaving(false);
    }
  };

  /**
   * Start detection session - runs for 10 seconds OR until 5 successful detections
   */
  const startDetection = async () => {
    if (isModelLoading) {
      setError('Please wait for models to load.');
      return;
    }

    if (!hasPermission) {
      await requestWebcam();
      if (!hasPermission) return;
    }

    setIsDetecting(true);
    setError(null);
    setProgress(0);
    setDetectionStarted(true);
    detectionFramesRef.current = [];

    // Progress bar animation - reaches 100% in 10 seconds
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 1; // Reach 100% in 10 seconds
      });
    }, 100);

    // Collect detection frames for up to 10 seconds OR until 5 detections
    const detectionFrames = [];
    const startTime = Date.now();
    const maxDuration = 10000; // 10 seconds
    const minDetections = 5;

    const collectFrames = async () => {
      const frameData = await detectEmotion();
      if (frameData) {
        detectionFrames.push(frameData);
      }

      const elapsed = Date.now() - startTime;
      const hasEnoughDetections = detectionFrames.length >= minDetections;
      const timeElapsed = elapsed >= maxDuration;

      if (!timeElapsed && !hasEnoughDetections && isDetecting) {
        setTimeout(collectFrames, 200); // Check every 200ms
      } else {
        clearInterval(progressInterval);
        setIsDetecting(false);
        
        // Calculate final verdict from collected frames
        const dominantMood = calculateDominantMood(detectionFrames);
        
        if (dominantMood && detectionFrames.length > 0) {
          setFinalMood(dominantMood);
          
          // Save to database
          await saveMoodToDatabase(dominantMood);
          
          // Save to MoodContext for app-wide access
          saveMood(dominantMood);
          
          // Stop webcam
          stopWebcam();
          
          // Call onMoodDetected callback if provided (for toast notifications)
          if (onMoodDetected) {
            onMoodDetected(dominantMood);
          }
          
          // Don't auto-redirect anymore - let user choose action
        } else {
          // Show error but keep camera running so user can try again
          setError('Could not detect your mood. Please ensure your face is visible and well-lit, then try again.');
          setIsDetecting(false);
          // Don't stop webcam - let user try again
        }
      }
    };

    collectFrames();
  };

  // Load models on component mount
  useEffect(() => {
    loadModels();
    return () => {
      stopWebcam();
    };
  }, []);

  // Auto-start webcam if this is opened as modal
  useEffect(() => {
    if (isModal && !isModelLoading && !hasPermission && !error) {
      // Small delay to ensure modal is fully mounted
      const timer = setTimeout(() => {
        requestWebcam();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isModal, isModelLoading]);

  return (
    <div className="w-full flex flex-col items-center justify-center">
      {/* Video and Canvas Container */}
      <div className="bg-white dark:bg-dark-surface rounded-softer p-6 mb-4 shadow-lg w-full max-w-2xl mx-auto">
        <div className="relative flex justify-center items-center bg-gray-100 dark:bg-dark-bg rounded-softer overflow-hidden">
          {/* Video Element */}
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            className={`w-full max-w-full ${hasPermission ? 'block' : 'hidden'}`}
            style={{ maxHeight: '400px' }}
          />

          {/* Canvas for drawing detections */}
          <canvas
            ref={canvasRef}
            className={`absolute top-0 left-0 w-full h-full ${isDetecting ? 'block' : 'hidden'}`}
            style={{ objectFit: 'contain', pointerEvents: 'none' }}
          />

          {/* Placeholder when no webcam */}
          {!hasPermission && !isModelLoading && (
            <div className="w-full aspect-video flex flex-col items-center justify-center bg-gray-200 dark:bg-dark-bg rounded-softer p-8 text-center">
              <div className="text-6xl mb-4">📷</div>
              <p className="text-gray-600 dark:text-gray-400 mb-2">
                Camera access needed for mood detection
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500 mb-4">
                Please allow camera access when prompted by your browser
              </p>
              <button
                onClick={requestWebcam}
                className="mt-4 px-6 py-3 rounded-softer bg-calm-purple dark:bg-accent-blue text-white font-semibold hover:bg-warm-pink dark:hover:bg-accent-blue/80 transition-all duration-300 shadow-md hover:shadow-lg"
              >
                Allow Camera Access
              </button>
            </div>
          )}

          {/* Loading overlay */}
          {isModelLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 rounded-softer">
              <div className="text-center">
                <div className="text-4xl mb-2">⏳</div>
                <p className="text-white font-semibold">Loading AI models...</p>
              </div>
            </div>
          )}
        </div>

        {/* Progress Bar */}
        {isDetecting && (
          <div className="mt-4">
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 h-3 rounded-full transition-all duration-100 ease-linear"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-2">
              Detecting your mood... {Math.round(progress)}%
            </p>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="mt-4 p-4 rounded-soft bg-warm-pink dark:bg-dark-surface text-gray-800 dark:text-gray-100 text-center text-sm">
            <p className="mb-3">{error}</p>
            <button
              onClick={() => {
                setError(null);
                setFinalMood(null);
                stopWebcam();
                // Request webcam again
                setTimeout(() => {
                  requestWebcam();
                }, 100);
              }}
              className="mt-2 px-4 py-2 rounded-softer bg-calm-purple dark:bg-accent-blue text-white font-semibold hover:bg-warm-pink dark:hover:bg-accent-blue/80 transition-all duration-300"
            >
              🔄 Retry
            </button>
          </div>
        )}

        {/* Final Verdict Display */}
        {finalMood && (
          <div className="mt-6 p-8 rounded-soft bg-gradient-to-br from-soft-green to-calm-purple dark:bg-dark-surface text-center">
            <div className="flex flex-col items-center justify-center">
              <div className="text-8xl mb-6 animate-bounce">
              {getMoodEmoji(finalMood.mood)}
            </div>
              <p className="text-4xl font-bold text-white dark:text-gray-100 mb-3 capitalize">
                Your Mood Is: {finalMood.mood}
            </p>
              <p className="text-base text-white dark:text-gray-400 opacity-90 mb-4">
              Confidence: {(finalMood.confidence * 100).toFixed(1)}% • {finalMood.totalFrames} frames analyzed
            </p>
            {isSaving && (
                <p className="text-xs text-white dark:text-gray-500 mb-4">
                Saving to database...
              </p>
            )}
            
              {/* Action Buttons After Detection - Centered */}
              <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center items-center w-full">
              <button
                onClick={() => {
                  navigate('/music');
                  if (onClose) onClose();
                }}
                className="px-6 py-3 rounded-softer font-semibold text-white bg-gradient-to-r from-blue-500 to-purple-500 hover:from-purple-500 hover:to-pink-500 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                🎵 View Music Recommendations
              </button>
              
              <button
                onClick={() => {
                  setFinalMood(null);
                  clearCurrentMood();
                  stopWebcam();
                  // Reset to allow new detection
                  setProgress(0);
                  setError(null);
                  // Request webcam again for new detection
                  setTimeout(() => {
                    requestWebcam();
                  }, 100);
                }}
                className="px-6 py-3 rounded-softer font-semibold text-white bg-gradient-to-r from-green-500 to-teal-500 hover:from-teal-500 hover:to-green-500 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                🔁 Try Again
              </button>
              
              {onClose && (
                <button
                  onClick={() => {
                    stopWebcam();
                    clearCurrentMood();
                    onClose();
                  }}
                  className="px-6 py-3 rounded-softer font-semibold bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-gray-200 hover:bg-gray-400 dark:hover:bg-gray-700 transition-all duration-300"
                >
                  ✖ Close
                </button>
              )}
              </div>
            </div>
          </div>
        )}

        {/* Control Buttons */}
        {!finalMood && (
          <div className="mt-4 flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={startDetection}
              disabled={isModelLoading || isDetecting || !hasPermission}
              className={`px-8 py-4 rounded-softer font-semibold text-white transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 ${
                !isModelLoading && !isDetecting && hasPermission
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-purple-500 hover:to-pink-500'
                  : 'bg-gray-300 dark:bg-gray-600 cursor-not-allowed opacity-50'
              }`}
            >
              {isDetecting ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin">🎭</span>
                  Detecting...
                </span>
              ) : error && hasPermission ? (
                '🔄 Try Detection Again'
              ) : (
                '🎥 Start Detection'
              )}
            </button>

            {onClose && (
              <button
                onClick={() => {
                  stopWebcam();
                  clearCurrentMood();
                  if (finalMood) {
                    setFinalMood(null);
                  }
                  onClose();
                }}
                disabled={isDetecting}
                className={`px-8 py-4 rounded-softer font-semibold bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-gray-200 hover:bg-gray-400 dark:hover:bg-gray-700 transition-all duration-300 ${
                  isDetecting ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                ✖ Close
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default RealTimeMoodDetector;
