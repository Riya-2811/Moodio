import React, { useState } from 'react';
import { getMusicRecommendations } from '../data/musicRecommendations';

/**
 * Music Recommendations Component
 * Displays personalized music playlists based on mood
 */
const MusicRecommendations = ({ mood, onClose }) => {
  const recommendations = getMusicRecommendations(mood);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);

  if (!mood || !recommendations || recommendations.length === 0) {
    return null;
  }

  return (
    <div className="bg-white dark:bg-dark-surface rounded-softer p-6 shadow-lg mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
          🎵 Music Recommendations
        </h3>
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-2xl leading-none"
          >
            ×
          </button>
        )}
      </div>

      <p className="text-gray-600 dark:text-gray-400 mb-6">
        Based on your mood ({mood}), here are some playlists to help:
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {recommendations.map((playlist) => (
          <div
            key={playlist.id}
            className="bg-sky-blue dark:bg-dark-bg rounded-softer p-4 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
            onClick={() => setSelectedPlaylist(playlist)}
          >
            <div className="text-5xl mb-3 text-center">{playlist.thumbnail}</div>
            <h4 className="font-semibold text-gray-800 dark:text-gray-100 mb-2 text-center">
              {playlist.title}
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 text-center mb-3">
              {playlist.description}
            </p>
            <button className="w-full px-4 py-2 rounded-soft bg-calm-purple dark:bg-accent-blue text-white font-semibold hover:bg-warm-pink dark:hover:bg-accent-blue/80 transition-all duration-300">
              ▶️ Play
            </button>
          </div>
        ))}
      </div>

      {/* Spotify Link Modal */}
      {selectedPlaylist && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-dark-surface rounded-softer shadow-xl max-w-2xl w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                {selectedPlaylist.title}
              </h4>
              <button
                onClick={() => setSelectedPlaylist(null)}
                className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-2xl leading-none"
              >
                ×
              </button>
            </div>
            <div className="text-center py-8">
              <div className="text-6xl mb-4">🎵</div>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {selectedPlaylist.description || 'Open this playlist on Spotify to start listening'}
              </p>
              <a
                href={selectedPlaylist.embedUrl || `https://open.spotify.com/search/${encodeURIComponent(selectedPlaylist.title)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-8 py-4 rounded-softer bg-soft-green dark:bg-green-500 text-white font-semibold text-lg hover:bg-green-600 dark:hover:bg-green-600 transition-all duration-300 shadow-md hover:shadow-lg"
              >
                ▶️ Open on Spotify
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MusicRecommendations;

