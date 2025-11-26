/**
 * Spotify Mood-Based Playlist Recommendations
 * Unique playlist recommendations for each mood based on Spotify search queries
 */

import { getSpotifySearchQuery, getSpotifySearchUrl } from '../utils/spotifyMoodMapping';

/**
 * Generate mood-specific Spotify playlist recommendations
 * @param {string} mood - The mood type
 * @returns {Array} - Array of playlist recommendation objects
 */
export const getSpotifyMoodPlaylists = (mood) => {
  const basePlaylists = {
    happy: [
      {
        id: `spotify-happy-1`,
        title: 'Happy Mood Vibes',
        description: 'Upbeat and joyful songs to keep your spirits high',
        thumbnail: '😊',
        embedUrl: getSpotifySearchUrl('happy'),
        type: 'spotify',
        genre: 'pop',
        language: 'english',
        mood: 'happy',
      },
      {
        id: `spotify-happy-2`,
        title: 'Feel-Good Pop Hits',
        description: 'Chart-topping pop songs that bring happiness and energy',
        thumbnail: '🎵',
        embedUrl: `https://open.spotify.com/search/${encodeURIComponent('feel good pop songs')}`,
        type: 'spotify',
        genre: 'pop',
        language: 'english',
        mood: 'happy',
      },
      {
        id: `spotify-happy-3`,
        title: 'Dance Party Mix',
        description: 'Energetic dance tracks perfect for celebrating',
        thumbnail: '🎉',
        embedUrl: `https://open.spotify.com/search/${encodeURIComponent('happy dance songs')}`,
        type: 'spotify',
        genre: 'edm',
        language: 'english',
        mood: 'happy',
      },
    ],
    sad: [
      {
        id: `spotify-sad-1`,
        title: 'Sad Songs Collection',
        description: 'Emotional and moving songs to help you process your feelings',
        thumbnail: '😢',
        embedUrl: getSpotifySearchUrl('sad'),
        type: 'spotify',
        genre: 'indie',
        language: 'english',
        mood: 'sad',
      },
      {
        id: `spotify-sad-2`,
        title: 'Melancholic Melodies',
        description: 'Gentle acoustic songs for quiet reflection',
        thumbnail: '🎸',
        embedUrl: `https://open.spotify.com/search/${encodeURIComponent('sad acoustic songs')}`,
        type: 'spotify',
        genre: 'acoustic',
        language: 'english',
        mood: 'sad',
      },
      {
        id: `spotify-sad-3`,
        title: 'Emotional Ballads',
        description: 'Powerful ballads that speak to your heart',
        thumbnail: '💔',
        embedUrl: `https://open.spotify.com/search/${encodeURIComponent('emotional ballads')}`,
        type: 'spotify',
        genre: 'pop',
        language: 'english',
        mood: 'sad',
      },
    ],
    angry: [
      {
        id: `spotify-angry-1`,
        title: 'Angry Rock Anthems',
        description: 'High-energy rock songs to channel your emotions',
        thumbnail: '😠',
        embedUrl: getSpotifySearchUrl('angry'),
        type: 'spotify',
        genre: 'rock',
        language: 'english',
        mood: 'angry',
      },
      {
        id: `spotify-angry-2`,
        title: 'Heavy Metal Power',
        description: 'Intense metal tracks for releasing tension',
        thumbnail: '🎸',
        embedUrl: `https://open.spotify.com/search/${encodeURIComponent('angry metal songs')}`,
        type: 'spotify',
        genre: 'metal',
        language: 'english',
        mood: 'angry',
      },
      {
        id: `spotify-angry-3`,
        title: 'Punk Rock Energy',
        description: 'Fast-paced punk rock to let it all out',
        thumbnail: '🎤',
        embedUrl: `https://open.spotify.com/search/${encodeURIComponent('punk rock playlist')}`,
        type: 'spotify',
        genre: 'rock',
        language: 'english',
        mood: 'angry',
      },
    ],
    stressed: [
      {
        id: `spotify-stressed-1`,
        title: 'Stress Relief Music',
        description: 'Calming sounds designed to reduce stress and anxiety',
        thumbnail: '😰',
        embedUrl: getSpotifySearchUrl('stressed'),
        type: 'spotify',
        genre: 'instrumental',
        language: 'instrumental',
        mood: 'stressed',
      },
      {
        id: `spotify-stressed-2`,
        title: 'Peaceful Instrumentals',
        description: 'Soft instrumental music to help you unwind',
        thumbnail: '🎹',
        embedUrl: `https://open.spotify.com/search/${encodeURIComponent('peaceful instrumental')}`,
        type: 'spotify',
        genre: 'instrumental',
        language: 'instrumental',
        mood: 'stressed',
      },
      {
        id: `spotify-stressed-3`,
        title: 'Nature Sounds & Meditation',
        description: 'Soothing nature sounds for deep relaxation',
        thumbnail: '🌿',
        embedUrl: `https://open.spotify.com/search/${encodeURIComponent('nature sounds meditation')}`,
        type: 'spotify',
        genre: 'ambient',
        language: 'instrumental',
        mood: 'stressed',
      },
    ],
    calm: [
      {
        id: `spotify-calm-1`,
        title: 'Calming Instrumental Playlist',
        description: 'Gentle instrumental tracks to bring peace to your mind',
        thumbnail: '😌',
        embedUrl: getSpotifySearchUrl('calm'),
        type: 'spotify',
        genre: 'instrumental',
        language: 'instrumental',
        mood: 'calm',
      },
      {
        id: `spotify-calm-2`,
        title: 'Soft Piano Melodies',
        description: 'Beautiful piano compositions for tranquility',
        thumbnail: '🎹',
        embedUrl: `https://open.spotify.com/search/${encodeURIComponent('calming piano music')}`,
        type: 'spotify',
        genre: 'classical',
        language: 'instrumental',
        mood: 'calm',
      },
      {
        id: `spotify-calm-3`,
        title: 'Zen Meditation Music',
        description: 'Meditative sounds for mindfulness and relaxation',
        thumbnail: '🧘',
        embedUrl: `https://open.spotify.com/search/${encodeURIComponent('zen meditation music')}`,
        type: 'spotify',
        genre: 'ambient',
        language: 'instrumental',
        mood: 'calm',
      },
    ],
    excited: [
      {
        id: `spotify-excited-1`,
        title: 'Energetic Pop Playlist',
        description: 'High-energy pop songs to match your excitement',
        thumbnail: '🤩',
        embedUrl: getSpotifySearchUrl('excited'),
        type: 'spotify',
        genre: 'pop',
        language: 'english',
        mood: 'excited',
      },
      {
        id: `spotify-excited-2`,
        title: 'Party Anthems',
        description: 'Festive songs perfect for celebrating',
        thumbnail: '🎉',
        embedUrl: `https://open.spotify.com/search/${encodeURIComponent('party anthems playlist')}`,
        type: 'spotify',
        genre: 'pop',
        language: 'english',
        mood: 'excited',
      },
      {
        id: `spotify-excited-3`,
        title: 'Upbeat Dance Hits',
        description: 'Dance-worthy tracks to keep the energy flowing',
        thumbnail: '💃',
        embedUrl: `https://open.spotify.com/search/${encodeURIComponent('upbeat dance songs')}`,
        type: 'spotify',
        genre: 'edm',
        language: 'english',
        mood: 'excited',
      },
    ],
    anxious: [
      {
        id: `spotify-anxious-1`,
        title: 'Anxiety Relief Music',
        description: 'Calming songs specifically designed to ease anxiety',
        thumbnail: '😟',
        embedUrl: getSpotifySearchUrl('anxious'),
        type: 'spotify',
        genre: 'ambient',
        language: 'instrumental',
        mood: 'anxious',
      },
      {
        id: `spotify-anxious-2`,
        title: 'Soothing Sleep Sounds',
        description: 'Gentle sounds to help quiet anxious thoughts',
        thumbnail: '🌙',
        embedUrl: `https://open.spotify.com/search/${encodeURIComponent('anxiety relief music')}`,
        type: 'spotify',
        genre: 'ambient',
        language: 'instrumental',
        mood: 'anxious',
      },
      {
        id: `spotify-anxious-3`,
        title: 'Breathing Exercises Music',
        description: 'Peaceful tracks to accompany breathing exercises',
        thumbnail: '💨',
        embedUrl: `https://open.spotify.com/search/${encodeURIComponent('breathing exercises music')}`,
        type: 'spotify',
        genre: 'ambient',
        language: 'instrumental',
        mood: 'anxious',
      },
    ],
    grateful: [
      {
        id: `spotify-grateful-1`,
        title: 'Positive Vibes Playlist',
        description: 'Uplifting songs about gratitude and positivity',
        thumbnail: '🙏',
        embedUrl: getSpotifySearchUrl('grateful'),
        type: 'spotify',
        genre: 'pop',
        language: 'english',
        mood: 'grateful',
      },
      {
        id: `spotify-grateful-2`,
        title: 'Inspirational Songs',
        description: 'Motivational tracks that inspire gratitude',
        thumbnail: '✨',
        embedUrl: `https://open.spotify.com/search/${encodeURIComponent('gratitude songs')}`,
        type: 'spotify',
        genre: 'pop',
        language: 'english',
        mood: 'grateful',
      },
      {
        id: `spotify-grateful-3`,
        title: 'Blessings & Thankfulness',
        description: 'Beautiful songs celebrating life\'s blessings',
        thumbnail: '🌟',
        embedUrl: `https://open.spotify.com/search/${encodeURIComponent('thankful songs')}`,
        type: 'spotify',
        genre: 'indie',
        language: 'english',
        mood: 'grateful',
      },
    ],
    neutral: [
      {
        id: `spotify-neutral-1`,
        title: 'Chill Vibes Playlist',
        description: 'Relaxed and mellow tracks for a balanced mood',
        thumbnail: '😐',
        embedUrl: getSpotifySearchUrl('neutral'),
        type: 'spotify',
        genre: 'indie',
        language: 'english',
        mood: 'neutral',
      },
      {
        id: `spotify-neutral-2`,
        title: 'Lo-fi Beats to Chill',
        description: 'Smooth lo-fi hip hop for background listening',
        thumbnail: '☕',
        embedUrl: `https://open.spotify.com/search/${encodeURIComponent('lo fi chill beats')}`,
        type: 'spotify',
        genre: 'lo-fi',
        language: 'instrumental',
        mood: 'neutral',
      },
      {
        id: `spotify-neutral-3`,
        title: 'Background Music',
        description: 'Easy-listening tracks for any time of day',
        thumbnail: '🎧',
        embedUrl: `https://open.spotify.com/search/${encodeURIComponent('chill background music')}`,
        type: 'spotify',
        genre: 'indie',
        language: 'english',
        mood: 'neutral',
      },
    ],
    tired: [
      {
        id: `spotify-tired-1`,
        title: 'Soft Acoustic Playlist',
        description: 'Gentle acoustic songs for when you\'re feeling tired',
        thumbnail: '😴',
        embedUrl: getSpotifySearchUrl('tired'),
        type: 'spotify',
        genre: 'acoustic',
        language: 'english',
        mood: 'tired',
      },
      {
        id: `spotify-tired-2`,
        title: 'Bedtime Stories Music',
        description: 'Peaceful songs perfect for winding down',
        thumbnail: '🌙',
        embedUrl: `https://open.spotify.com/search/${encodeURIComponent('soft bedtime music')}`,
        type: 'spotify',
        genre: 'ambient',
        language: 'instrumental',
        mood: 'tired',
      },
      {
        id: `spotify-tired-3`,
        title: 'Relaxing Folk Songs',
        description: 'Gentle folk melodies to soothe tiredness',
        thumbnail: '🪕',
        embedUrl: `https://open.spotify.com/search/${encodeURIComponent('soft folk songs')}`,
        type: 'spotify',
        genre: 'folk',
        language: 'english',
        mood: 'tired',
      },
    ],
    lonely: [
      {
        id: `spotify-lonely-1`,
        title: 'Lonely Songs Playlist',
        description: 'Songs that understand and accompany your solitude',
        thumbnail: '😔',
        embedUrl: getSpotifySearchUrl('lonely'),
        type: 'spotify',
        genre: 'indie',
        language: 'english',
        mood: 'lonely',
      },
      {
        id: `spotify-lonely-2`,
        title: 'Solitude & Reflection',
        description: 'Thoughtful songs for quiet moments alone',
        thumbnail: '🌌',
        embedUrl: `https://open.spotify.com/search/${encodeURIComponent('lonely songs collection')}`,
        type: 'spotify',
        genre: 'indie',
        language: 'english',
        mood: 'lonely',
      },
      {
        id: `spotify-lonely-3`,
        title: 'Emotional Indie',
        description: 'Deep indie tracks that resonate with loneliness',
        thumbnail: '🎸',
        embedUrl: `https://open.spotify.com/search/${encodeURIComponent('lonely indie songs')}`,
        type: 'spotify',
        genre: 'indie',
        language: 'english',
        mood: 'lonely',
      },
    ],
    overwhelmed: [
      {
        id: `spotify-overwhelmed-1`,
        title: 'Soothing Ambient Playlist',
        description: 'Calming ambient sounds to help you decompress',
        thumbnail: '😵',
        embedUrl: getSpotifySearchUrl('overwhelmed'),
        type: 'spotify',
        genre: 'ambient',
        language: 'instrumental',
        mood: 'overwhelmed',
      },
      {
        id: `spotify-overwhelmed-2`,
        title: 'Peaceful Space Music',
        description: 'Ethereal sounds to create a sense of calm',
        thumbnail: '🌌',
        embedUrl: `https://open.spotify.com/search/${encodeURIComponent('soothing ambient music')}`,
        type: 'spotify',
        genre: 'ambient',
        language: 'instrumental',
        mood: 'overwhelmed',
      },
      {
        id: `spotify-overwhelmed-3`,
        title: 'Mindful Meditation',
        description: 'Gentle meditation music to help clear your mind',
        thumbnail: '🧘',
        embedUrl: `https://open.spotify.com/search/${encodeURIComponent('meditation music calm')}`,
        type: 'spotify',
        genre: 'ambient',
        language: 'instrumental',
        mood: 'overwhelmed',
      },
    ],
  };

  return basePlaylists[mood?.toLowerCase()] || basePlaylists.neutral;
};

/**
 * Get Spotify playlists for multiple moods
 * @param {Array} moods - Array of mood types
 * @returns {Array} - Combined array of playlist recommendations
 */
export const getSpotifyPlaylistsForMoods = (moods) => {
  if (!Array.isArray(moods)) {
    return getSpotifyMoodPlaylists(moods);
  }

  const allPlaylists = [];
  moods.forEach(mood => {
    allPlaylists.push(...getSpotifyMoodPlaylists(mood));
  });

  // Remove duplicates based on id
  const uniquePlaylists = [];
  const seenIds = new Set();
  
  allPlaylists.forEach(playlist => {
    if (!seenIds.has(playlist.id)) {
      seenIds.add(playlist.id);
      uniquePlaylists.push(playlist);
    }
  });

  return uniquePlaylists;
};

