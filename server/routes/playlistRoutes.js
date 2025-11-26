const express = require('express');
const router = express.Router();
const Playlist = require('../models/Playlist');

/**
 * Helper function to get user ID from request
 */
const getUserId = (req) => {
  return req.body.userId || req.query.userId || req.headers['x-user-id'] || req.body.email || req.query.email;
};

/**
 * GET /api/playlists
 * Get all playlists for the logged-in user
 */
router.get('/', async (req, res) => {
  try {
    const userId = getUserId(req);

    if (!userId) {
      return res.status(400).json({ success: false, error: 'User ID is required' });
    }

    const { mood, genre, limit } = req.query;
    let query = { userId };

    // Filter by mood if provided
    if (mood) {
      query.mood = mood;
    }

    // Filter by genre if provided
    if (genre) {
      query.genre = { $in: [genre] };
    }

    let playlists = Playlist.find(query).sort({ createdAt: -1 });

    // Limit results if specified
    if (limit) {
      playlists = playlists.limit(parseInt(limit));
    }

    const result = await playlists.exec();

    res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.error('Error fetching playlists:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/playlists
 * Create a new playlist
 */
router.post('/', async (req, res) => {
  try {
    const userId = getUserId(req);
    const { title, description, thumbnail, songs, mood, genre, platform, isPublic, tags } = req.body;

    if (!userId) {
      return res.status(400).json({ success: false, error: 'User ID is required' });
    }

    if (!title || !title.trim()) {
      return res.status(400).json({ success: false, error: 'Playlist title is required' });
    }

    const playlist = new Playlist({
      userId,
      title: title.trim(),
      description: description?.trim() || '',
      thumbnail: thumbnail || '🎵',
      songs: songs || [],
      mood: mood || 'other',
      genre: genre || [],
      platform: platform || 'mixed',
      isPublic: isPublic || false,
      tags: tags || [],
    });

    await playlist.save();

    res.status(201).json({ success: true, data: playlist, message: 'Playlist created successfully' });
  } catch (error) {
    console.error('Error creating playlist:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/playlists/:id/songs
 * Add songs to a playlist
 * IMPORTANT: This route must come before /:id route to avoid route conflicts
 */
router.post('/:id/songs', async (req, res) => {
  try {
    console.log('Adding songs to playlist:', req.params.id);
    console.log('Request body:', req.body);
    
    const userId = getUserId(req);
    const { id } = req.params;
    const { songs } = req.body; // Array of songs to add

    if (!userId) {
      return res.status(400).json({ success: false, error: 'User ID is required' });
    }

    if (!songs || !Array.isArray(songs) || songs.length === 0) {
      return res.status(400).json({ success: false, error: 'Songs array is required' });
    }

    const playlist = await Playlist.findOne({ _id: id, userId });

    if (!playlist) {
      return res.status(404).json({ success: false, error: 'Playlist not found' });
    }

    // Add new songs to the playlist
    const newSongs = songs.map(song => ({
      title: song.title || '',
      artist: song.artist || '',
      url: song.url || '',
      platform: song.platform || 'spotify',
    }));

    playlist.songs = [...playlist.songs, ...newSongs];
    await playlist.save();

    console.log('Songs added successfully. Total songs:', playlist.songs.length);
    res.status(200).json({ success: true, data: playlist, message: 'Songs added successfully' });
  } catch (error) {
    console.error('Error adding songs to playlist:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * DELETE /api/playlists/:id/songs/:songId
 * Remove a song from a playlist
 * IMPORTANT: This route must come before /:id route to avoid route conflicts
 */
router.delete('/:id/songs/:songIndex', async (req, res) => {
  try {
    const userId = getUserId(req);
    const { id, songIndex } = req.params;

    if (!userId) {
      return res.status(400).json({ success: false, error: 'User ID is required' });
    }

    const playlist = await Playlist.findOne({ _id: id, userId });

    if (!playlist) {
      return res.status(404).json({ success: false, error: 'Playlist not found' });
    }

    const index = parseInt(songIndex);
    if (isNaN(index) || index < 0 || index >= playlist.songs.length) {
      return res.status(400).json({ success: false, error: 'Invalid song index' });
    }

    playlist.songs.splice(index, 1);
    await playlist.save();

    res.status(200).json({ success: true, data: playlist, message: 'Song removed successfully' });
  } catch (error) {
    console.error('Error removing song from playlist:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * DELETE /api/playlists/:id
 * Delete a playlist
 */
router.delete('/:id', async (req, res) => {
  try {
    const userId = getUserId(req);
    const { id } = req.params;

    if (!userId) {
      return res.status(400).json({ success: false, error: 'User ID is required' });
    }

    const playlist = await Playlist.findOneAndDelete({ _id: id, userId });

    if (!playlist) {
      return res.status(404).json({ success: false, error: 'Playlist not found' });
    }

    res.status(200).json({ success: true, message: 'Playlist deleted successfully' });
  } catch (error) {
    console.error('Error deleting playlist:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;

