import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import * as faceapi from 'face-api.js';
import api from '../utils/api';
import SmartSuggestions from './SmartSuggestions';
import { useToast } from '../utils/Toast';
import { useAuth } from '../context/AuthContext';

/**
 * Emotion Detector Component (Full Page)
 * Uses face-api.js to detect emotions from webcam in real-time
 * Runs a 3-second detection session and produces final verdict
 */
const EmotionDetector = () => {
  const navigate = useNavigate();
  const { showToast, ToastContainer } = useToast();
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
      setError('Failed to load AI models. Please ensure models are in /public/models/ folder.');
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
      if (err.name === 'NotAllowedError') {
        setError('Camera permission denied. Please allow camera access in your browser settings.');
      } else if (err.name === 'NotFoundError') {
        setError('No camera found. Please connect a camera and try again.');
      } else {
        setError('Could not access webcam. Please check your camera permissions.');
      }
      setHasPermission(false);
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
          
          // Show success toast
          showToast(`Your mood has been detected as ${dominantMood.mood} 😊`, 'success', 3000);
          
          // Stop webcam
          stopWebcam();
          
          // Redirect based on mood
          setTimeout(() => {
            const redirectPath = getRedirectPath(dominantMood.mood);
            if (redirectPath) {
              navigate(redirectPath);
            }
          }, 2500); // Wait 2.5 seconds before redirect
        } else {
          setError('Could not detect your mood. Please try again.');
          stopWebcam();
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

  return (
    <div className="min-h-screen bg-calm-purple dark:bg-dark-bg py-12 px-4 sm:px-6 lg:px-8 transition-all duration-300">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-800 dark:text-gray-100">
            Emotion Detection 📸
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Real-time facial emotion detection using your webcam
          </p>
        </div>

        {/* Video and Canvas Container */}
        <div className="bg-white dark:bg-dark-surface rounded-softer p-6 mb-6 shadow-lg">
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
              <div className="w-full aspect-video flex flex-col items-center justify-center bg-gray-200 dark:bg-dark-bg rounded-softer p-8">
                <div className="text-6xl mb-4">📷</div>
                <p className="text-gray-600 dark:text-gray-400 text-center mb-2">
                  Camera access needed for mood detection
                </p>
                <button
                  onClick={requestWebcam}
                  className="mt-4 px-6 py-3 rounded-softer bg-calm-purple dark:bg-accent-blue text-white font-semibold hover:bg-warm-pink dark:hover:bg-accent-blue/80 transition-all duration-300"
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
              {error}
            </div>
          )}

          {/* Final Verdict Display */}
          {finalMood && (
            <div className="mt-4 p-6 rounded-soft bg-gradient-to-br from-soft-green to-calm-purple dark:bg-dark-surface text-center animate-pulse">
              <div className="text-7xl mb-4 animate-bounce">
                {getMoodEmoji(finalMood.mood)}
              </div>
              <p className="text-3xl font-bold text-white dark:text-gray-100 mb-2 capitalize">
                Your Mood is: {finalMood.mood}
              </p>
              <p className="text-sm text-white dark:text-gray-400 opacity-90">
                Confidence: {(finalMood.confidence * 100).toFixed(1)}% • {finalMood.totalFrames} frames analyzed
              </p>
              {isSaving && (
                <p className="text-xs text-white dark:text-gray-500 mt-2">
                  Saving to database...
                </p>
              )}
              {getRedirectPath(finalMood.mood) ? (
                <p className="text-sm text-white dark:text-gray-300 mt-4 animate-pulse">
                  Redirecting you to {getRedirectPath(finalMood.mood)}...
                </p>
              ) : (
                <p className="text-lg text-white dark:text-gray-200 mt-4">
                  You seem calm today 😌
                </p>
              )}
            </div>
          )}

          {/* Control Buttons */}
          {!finalMood && (
            <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center">
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
                ) : (
                  '🎥 Start Detection'
                )}
              </button>
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="bg-white dark:bg-dark-surface rounded-softer p-6 shadow-lg">
          <h3 className="text-xl font-semibold mb-3 text-gray-800 dark:text-gray-100">
            How to Use
          </h3>
          <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400 text-sm">
            <li>Click "Start Detection" to begin using your webcam</li>
            <li>Allow camera access when prompted by your browser</li>
            <li>Position your face clearly in front of the camera</li>
            <li>The AI will analyze your expression for up to 10 seconds or 5 detections</li>
            <li>Your mood is automatically saved to your history</li>
            <li>We'll suggest music or exercises based on your mood</li>
          </ul>
        </div>

        {/* Smart Suggestions */}
        {finalMood && (
          <SmartSuggestions
            detectedMood={finalMood}
            onClose={() => setFinalMood(null)}
          />
        )}

        {/* Toast Container */}
        <ToastContainer />
      </div>
    </div>
  );
};

export default EmotionDetector;
