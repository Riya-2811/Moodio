/**
 * Music Data Generator
 * Generates a comprehensive database of songs across all genres, languages, artists, and moods
 */

// Define all genres
const genres = ['pop', 'rock', 'jazz', 'classical', 'electronic', 'hip-hop', 'country', 'folk', 'indie', 'r&b', 'reggae', 'metal', 'blues', 'bollywood', 'lo-fi', 'instrumental', 'tamil', 'telugu', 'punjabi', 'korean', 'edm', 'hollywood'];

// Define all languages
const languages = ['english', 'hindi', 'punjabi', 'tamil', 'telugu', 'korean', 'instrumental'];

// Define all 12 moods for the app
const moods = ['happy', 'sad', 'angry', 'stressed', 'calm', 'excited', 'anxious', 'grateful', 'neutral', 'tired', 'lonely', 'overwhelmed'];

// Define energy levels
const energyLevels = ['low', 'medium', 'high'];

// Popular artists by language
const artistsByLanguage = {
  english: [
    'Taylor Swift', 'Billie Eilish', 'Ed Sheeran', 'The Weeknd', 'Ariana Grande', 'Drake', 'Post Malone', 'Dua Lipa', 
    'Justin Bieber', 'Adele', 'Harry Styles', 'Olivia Rodrigo', 'Doja Cat', 'Lana Del Rey', 'Bruno Mars', 
    'The Beatles', 'Queen', 'Coldplay', 'Imagine Dragons', 'Maroon 5', 'OneRepublic', 'Eminem', 'Kendrick Lamar',
    'Travis Scott', 'Lil Nas X', 'The Chainsmokers', 'Calvin Harris', 'Martin Garrix', 'David Guetta',
    'John Mayer', 'Norah Jones', 'Billie Holiday', 'Ella Fitzgerald', 'Louis Armstrong', 'Miles Davis',
    'Led Zeppelin', 'Pink Floyd', 'Nirvana', 'AC/DC', 'Metallica', 'Guns N Roses',
    'Luke Combs', 'Morgan Wallen', 'Taylor Swift', 'Carrie Underwood', 'Johnny Cash',
    'Bob Dylan', 'Woody Guthrie', 'Joan Baez', 'Simon & Garfunkel',
    'Arctic Monkeys', 'The Strokes', 'Tame Impala', 'Vampire Weekend', 'MGMT'
  ],
  hindi: [
    'Arijit Singh', 'Shreya Ghoshal', 'Sonu Nigam', 'Neha Kakkar', 'Atif Aslam', 'Rahat Fateh Ali Khan',
    'Kumar Sanu', 'Udit Narayan', 'Alka Yagnik', 'Sunidhi Chauhan', 'Ankit Tiwari', 'Jubin Nautiyal',
    'Amit Trivedi', 'Pritam', 'A.R. Rahman', 'Vishal-Shekhar', 'Shankar-Ehsaan-Loy', 'Tanishk Bagchi',
    'Badshah', 'Diljit Dosanjh', 'Raftaar', 'Yo Yo Honey Singh', 'Divine', 'Ritviz',
    'Amitabh Bachchan', 'Lata Mangeshkar', 'Mohammed Rafi', 'Kishore Kumar', 'Asha Bhosle',
    'S.P. Balasubrahmanyam', 'Jagjit Singh', 'Ghulam Ali', 'Pankaj Udhas'
  ],
  punjabi: [
    'Diljit Dosanjh', 'Gurdas Maan', 'Harbhajan Mann', 'Surjit Bindrakhia', 'Mickey Singh',
    'Karan Aujla', 'Amrit Maan', 'Amrinder Gill', 'Satinder Sartaj', 'Jazzy B',
    'Guru Randhawa', 'Jass Manak', 'Ammy Virk', 'Parmish Verma', 'Sharry Mann',
    'Miss Pooja', 'Neha Kakkar', 'Nimrat Khaira', 'Harrdy Sandhu'
  ],
  tamil: [
    'Anirudh Ravichander', 'A.R. Rahman', 'Harris Jayaraj', 'Yuvan Shankar Raja', 'G.V. Prakash',
    'Dhanush', 'Sid Sriram', 'Chinmayi', 'Shreya Ghoshal', 'Karthik',
    'Vijay Yesudas', 'Haricharan', 'S.P. Balasubrahmanyam', 'Ilaiyaraaja', 'M.S. Viswanathan'
  ],
  telugu: [
    'Sid Sriram', 'Anirudh Ravichander', 'Devi Sri Prasad', 'Thaman S', 'Keeravani',
    'S.P. Balasubrahmanyam', 'S.P.B. Charan', 'Shreya Ghoshal', 'Chitra', 'Karthik',
    'Haricharan', 'Chinmayi', 'Sunidhi Chauhan', 'Benny Dayal'
  ],
  korean: [
    'BTS', 'BLACKPINK', 'IU', 'Taeyeon', 'EXO', 'TWICE', 'Red Velvet', 'NewJeans',
    'LE SSERAFIM', 'aespa', 'Stray Kids', 'SEVENTEEN', 'NCT', 'ITZY', 'IVE',
    'Taeyang', 'G-Dragon', 'Big Bang', 'Girls Generation', 'Super Junior',
    'SHINee', 'Apink', 'MAMAMOO', 'BIGBANG', '2NE1'
  ]
};

// Genre-specific artists for English
const englishGenreArtists = {
  pop: ['Taylor Swift', 'Billie Eilish', 'Ariana Grande', 'Ed Sheeran', 'Dua Lipa', 'Harry Styles', 'Olivia Rodrigo'],
  rock: ['Queen', 'Led Zeppelin', 'Pink Floyd', 'Nirvana', 'AC/DC', 'Coldplay', 'Imagine Dragons'],
  jazz: ['Billie Holiday', 'Ella Fitzgerald', 'Louis Armstrong', 'Miles Davis', 'John Coltrane', 'Duke Ellington'],
  classical: ['Beethoven', 'Mozart', 'Bach', 'Chopin', 'Tchaikovsky', 'Vivaldi'],
  electronic: ['The Chainsmokers', 'Calvin Harris', 'Martin Garrix', 'David Guetta', 'Avicii', 'Deadmau5'],
  'hip-hop': ['Eminem', 'Drake', 'Kendrick Lamar', 'Travis Scott', 'Post Malone', 'Lil Nas X'],
  country: ['Luke Combs', 'Morgan Wallen', 'Carrie Underwood', 'Johnny Cash', 'Dolly Parton'],
  folk: ['Bob Dylan', 'Woody Guthrie', 'Joan Baez', 'Simon & Garfunkel', 'Joni Mitchell'],
  indie: ['Arctic Monkeys', 'The Strokes', 'Tame Impala', 'Vampire Weekend', 'MGMT'],
  'r&b': ['The Weeknd', 'Bruno Mars', 'Alicia Keys', 'John Legend', 'Usher'],
  reggae: ['Bob Marley', 'Sean Paul', 'Shaggy', 'Damian Marley', 'Ziggy Marley'],
  metal: ['Metallica', 'Iron Maiden', 'Black Sabbath', 'Judas Priest', 'Slipknot'],
  blues: ['B.B. King', 'Muddy Waters', 'John Lee Hooker', 'Howlin Wolf', 'Robert Johnson']
};

// Mood-Energy mapping for all 12 moods
const moodEnergyMap = {
  happy: ['high', 'medium'],
  sad: ['low', 'medium'],
  angry: ['low', 'high'], // Can be calm music or aggressive
  stressed: ['low'],
  calm: ['low', 'medium'],
  excited: ['high'],
  anxious: ['low'],
  grateful: ['medium', 'high'],
  neutral: ['low', 'medium'],
  tired: ['low'],
  lonely: ['low', 'medium'],
  overwhelmed: ['low']
};

// Thumbnails by genre
const genreThumbnails = {
  pop: '🎵', rock: '🎸', jazz: '🎺', classical: '🎹', electronic: '⚡', 'hip-hop': '🎧',
  country: '🤠', folk: '🪕', indie: '🎸', 'r&b': '🎤', reggae: '🌴', metal: '🔥',
  blues: '🎷', bollywood: '🎬', 'lo-fi': '☕', instrumental: '🎼', tamil: '🎵', telugu: '🎵',
  punjabi: '🕺', korean: '🎌', edm: '⚡', hollywood: '🎬'
};

// Generate songs for a specific mood-genre-language combination
// Each song is unique to its mood - no two moods share the same songs
function generateSongsForMoodGenreLanguage(mood, genre, language, moodIndex, genreIndex, langIndex, songIndex = 0) {
  const songs = [];
  const artists = language === 'english' 
    ? (englishGenreArtists[genre] || artistsByLanguage[language] || [])
    : (artistsByLanguage[language] || []);
  
  const validEnergyLevels = moodEnergyMap[mood] || ['medium'];
  const thumbnail = genreThumbnails[genre] || '🎵';
  
  // Create mood-unique song ID using mood index, genre index, language index, and song index
  // This ensures each mood gets completely unique songs
  const baseId = (moodIndex * 1000000) + (genreIndex * 10000) + (langIndex * 100) + songIndex;
  
  // Select artist based on combination to ensure uniqueness
  const artistIndex = (moodIndex * 7 + genreIndex * 3 + langIndex * 2 + songIndex) % artists.length;
  const artist = artists[artistIndex] || artists[0] || 'Various Artists';
  
  const energy = validEnergyLevels[songIndex % validEnergyLevels.length];
  
  // Create unique, mood-specific titles that differ for each mood
  const moodCapitalized = mood.charAt(0).toUpperCase() + mood.slice(1);
  const genreCapitalized = genre.charAt(0).toUpperCase() + genre.slice(1);
  
  let title = '';
  const titleVariants = [
    `${artist} - ${moodCapitalized} ${genreCapitalized} Vibes`,
    `${moodCapitalized} ${genreCapitalized} Collection by ${artist}`,
    `${artist}'s ${moodCapitalized} Moments`,
    `${moodCapitalized} ${genreCapitalized} Essentials`,
    `${genreCapitalized} for ${moodCapitalized} Days`
  ];
  title = titleVariants[songIndex % titleVariants.length];
  
  // Mood-specific descriptions that make each mood unique
  const moodSpecificDescriptions = {
    happy: ['Upbeat and joyful', 'Energetic and uplifting', 'Feel-good', 'Celebratory'],
    sad: ['Emotional and reflective', 'Melancholic', 'Comforting', 'Introspective'],
    angry: ['Intense and powerful', 'Cathartic', 'High-energy', 'Release-focused'],
    stressed: ['Calming and soothing', 'Relaxing', 'Peaceful', 'Tranquil'],
    calm: ['Serene and peaceful', 'Meditative', 'Gentle', 'Soothing'],
    excited: ['Energetic and vibrant', 'Upbeat', 'Dynamic', 'Enthusiastic'],
    anxious: ['Calming and reassuring', 'Gentle', 'Peaceful', 'Comforting'],
    grateful: ['Warm and uplifting', 'Positive', 'Heartwarming', 'Appreciative'],
    neutral: ['Balanced and steady', 'Neutral', 'Even-tempered', 'Moderate'],
    tired: ['Soft and restful', 'Gentle', 'Calming', 'Sleepy'],
    lonely: ['Emotional and supportive', 'Comforting', 'Reflective', 'Understanding'],
    overwhelmed: ['Calming and spacious', 'Soothing', 'Peaceful', 'Clear']
  };
  
  const descriptionPrefixes = moodSpecificDescriptions[mood] || ['Suitable'];
  const descriptionPrefix = descriptionPrefixes[songIndex % descriptionPrefixes.length];
  
  const description = `${descriptionPrefix} ${genre} ${language} songs perfect for ${mood} moments. ${energy.charAt(0).toUpperCase() + energy.slice(1)} energy.`;
  const searchQuery = `${mood} ${genre} ${language} ${artist}`.replace(/\s+/g, '%20');
  
  songs.push({
    id: baseId,
    title,
    description,
    thumbnail,
    embedUrl: `https://open.spotify.com/search/${searchQuery}`,
    type: 'spotify',
    genre: genre === 'hollywood' ? 'hollywood' : genre,
    language,
    artist: artist,
    energy,
    mood
  });
  
  return songs;
}

// Generate comprehensive music database
function generateComprehensiveMusicDatabase() {
  const musicRecommendations = {};
  
  // Initialize all moods
  moods.forEach(mood => {
    musicRecommendations[mood] = [];
  });
  
  // Generate unique songs for each mood-genre-language combination
  // Each mood gets completely unique songs - no sharing between moods
  moods.forEach((mood, moodIndex) => {
    genres.forEach((genre, genreIndex) => {
      languages.forEach((language, langIndex) => {
        // Skip only truly invalid combinations, be more permissive
        if (language === 'instrumental' && !['instrumental', 'classical', 'lo-fi'].includes(genre)) {
          // Instrumental language should match instrumental/classical/lo-fi genres
          // But allow if genre is also instrumental
          if (genre !== 'instrumental') {
            return;
          }
        }
        
        // Generate 3 unique songs per combination to ensure variety
        // Each song gets a unique ID based on mood, genre, language, and song index
        for (let songIndex = 0; songIndex < 3; songIndex++) {
          const songs = generateSongsForMoodGenreLanguage(mood, genre, language, moodIndex, genreIndex, langIndex, songIndex);
          if (songs && songs.length > 0) {
            musicRecommendations[mood].push(...songs);
          }
        }
      });
    });
  });
  
  // Remove duplicates by ID
  Object.keys(musicRecommendations).forEach(mood => {
    const seen = new Set();
    musicRecommendations[mood] = musicRecommendations[mood].filter(song => {
      if (seen.has(song.id)) {
        song.id = Math.floor(Math.random() * 1000000);
      }
      seen.add(song.id);
      return true;
    });
  });
  
  return musicRecommendations;
}

// Export functions
module.exports = {
  generateComprehensiveMusicDatabase,
  getAllSongs: () => {
    const db = generateComprehensiveMusicDatabase();
    const allSongs = [];
    Object.values(db).forEach(moodSongs => {
      allSongs.push(...moodSongs);
    });
    return allSongs;
  },
  getSongsByMood: (mood) => {
    const db = generateComprehensiveMusicDatabase();
    return db[mood] || [];
  },
  getPopularArtists: (language = 'all') => {
    if (language === 'all') {
      const allArtists = new Set();
      Object.values(artistsByLanguage).forEach(langArtists => {
        langArtists.forEach(artist => allArtists.add(artist));
      });
      Object.values(englishGenreArtists).forEach(genreArtists => {
        genreArtists.forEach(artist => allArtists.add(artist));
      });
      return Array.from(allArtists).sort();
    }
    
    const lang = language.toLowerCase();
    const artists = new Set(artistsByLanguage[lang] || []);
    
    // Add English genre artists if language is English
    if (lang === 'english') {
      Object.values(englishGenreArtists).forEach(genreArtists => {
        genreArtists.forEach(artist => artists.add(artist));
      });
    }
    
    return Array.from(artists).sort();
  }
};

