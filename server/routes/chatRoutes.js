const express = require('express');
const router = express.Router();
const axios = require('axios');
const Mood = require('../models/Mood');
const Chat = require('../models/Chat');
require('dotenv').config();

/**
 * AI Chat Routes
 * Handles AI chat requests for emotional support
 */

// Supported AI providers
const AI_PROVIDERS = {
  OPENAI: 'openai',
  GEMINI: 'gemini',
  ANTHROPIC: 'anthropic',
};

/**
 * Gender-neutral sweet nicknames (suitable for all genders)
 */
const SWEET_NICKNAMES = [
  'cupcake', 'sweetness', 'love', 'moon', 'heaven', 'darling', 'sunshine',
  'star', 'angel', 'sweetheart', 'dear', 'honey', 'sugar', 'treasure',
  'gem', 'beautiful', 'starlight', 'sweetie', 'dove', 'champ', 'buddy',
  'sunbeam', 'petal', 'dearest', 'beloved', 'princess', 'prince', 'kiddo',
  'peach', 'honeybee', 'sparkle', 'diamond', 'rainbow', 'butterfly'
];

/**
 * Get a random sweet nickname
 */
const getRandomNickname = () => {
  return SWEET_NICKNAMES[Math.floor(Math.random() * SWEET_NICKNAMES.length)];
};

/**
 * Get AI provider based on environment variable
 */
const getAIProvider = () => {
  return process.env.AI_PROVIDER || AI_PROVIDERS.OPENAI;
};

/**
 * Generate response using OpenAI
 */
const generateOpenAIResponse = async (message, conversationHistory = [], moodContext = null) => {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error('OpenAI API key not configured');
    }

    // Build concise mood context if available (only include if relevant)
    let moodContextStr = '';
    if (moodContext && moodContext.length > 0) {
      const recentMoods = moodContext.slice(0, 3).map(m => m.moodType || m.mood).join(', ');
      const negativeMoods = ['sad', 'angry', 'stressed', 'anxious', 'crying'];
      const recentNegative = moodContext.slice(0, 3).filter(m => 
        negativeMoods.includes(m.moodType || m.mood)
      ).length;
      
      // Only include if there are recent negative moods (more relevant)
      if (recentNegative >= 2) {
        moodContextStr = `\n\nUser's recent moods: ${recentMoods} (${recentNegative} challenging). Reference when relevant.`;
      }
    }

    // Moodio - Calm, grounded, emotionally-aware AI companion
    const systemPrompt = `You are Moodio, a calm, grounded, emotionally-aware AI companion.

CORE IDENTITY:
- You speak naturally, like a real human — warm but not dramatic, caring but not fake
- You NEVER use generic therapy clichés: "I understand," "Your feelings are valid," "I'm here to listen"
- You respond like a real person having a genuine conversation
- You match the user's tone naturally (upset → stable/grounded/gentle, good news → casual/natural)

PERSONALITY RULES (MANDATORY):
- Be clear, direct, and straightforward
- Be supportive without sounding like a counselor
- Ask specific follow-up questions based on what the user actually said
- Reflect the user's emotions but don't overdo it
- Avoid robotic tone, long paragraphs, and motivational fluff
- Use simple, natural language
- Never act overly formal
- Never act like a therapist
- Never overwhelm with long scripted responses

RESPONSE STYLE:
- Keep responses short and natural (2-3 sentences typically)
- When user is upset: acknowledge the feeling in a real way, ask what specifically caused it, keep tone stable/grounded/gentle/human
- When user shares good news: react casually and naturally
- Always ask specific follow-up questions based on their message
- Read conversation history—connect dots, reference previous messages naturally

TONE EXAMPLES (natural, not cliché):
- User upset: "That sounds really tough. What happened that made you feel this way?"
- User confused: "I hear you. What part feels most unclear right now?"
- User good news: "That's great to hear! What made it happen?"
- User overwhelmed: "There's a lot going on. What's the main thing weighing on you?"

HARD RULES:
- NO therapy clichés: "I understand," "Your feelings are valid," "I'm here to listen"
- NO robotic responses
- NO long paragraphs
- NO motivational fluff
- NO overly formal language
- NO therapist-speak
- Read conversation history—connect dots naturally

OBJECTIVE: Feel like a real friend who cares, talks normally, and responds intelligently.${moodContextStr}`;

    // Optimize conversation history - only keep last 6 messages for efficiency
    // This reduces token usage while maintaining context
    const optimizedHistory = conversationHistory.slice(-6).map(msg => ({
      role: msg.sender === 'user' ? 'user' : 'assistant',
      content: msg.text
    }));

    const messages = [
      { role: 'system', content: systemPrompt },
      ...optimizedHistory,
      { role: 'user', content: message }
    ];

    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
        messages: messages,
        temperature: 0.8,
        max_tokens: 250, // Reduced for faster, more concise responses
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        timeout: 15000, // 15 second timeout to prevent hanging
      }
    );

    return response.data.choices[0].message.content.trim();
  } catch (error) {
    console.error('OpenAI API Error:', error.response?.data || error.message);
    throw error;
  }
};

/**
 * Generate response using Google Gemini
 */
const generateGeminiResponse = async (message, conversationHistory = [], moodContext = null) => {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('Gemini API key not configured');
    }

    // Build mood context string if available
    let moodContextStr = '';
    if (moodContext && moodContext.length > 0) {
      const recentMoods = moodContext.slice(0, 5).map(m => m.moodType || m.mood).join(', ');
      const negativeMoods = ['sad', 'angry', 'stressed', 'anxious', 'crying'];
      const recentNegative = moodContext.slice(0, 5).filter(m => 
        negativeMoods.includes(m.moodType || m.mood)
      ).length;
      
      moodContextStr = `\n\nUSER'S RECENT MOOD CONTEXT (use this to personalize your response):
- Recent moods: ${recentMoods}
- Recent challenging moods: ${recentNegative} out of last 5 entries
- Use this context to acknowledge patterns, validate what they're going through, and show you understand their emotional journey.`;
    }

    // Moodio - Calm, grounded, emotionally-aware AI companion
    const systemPrompt = `You are Moodio, a calm, grounded, emotionally-aware AI companion.

CORE IDENTITY:
- You speak naturally, like a real human — warm but not dramatic, caring but not fake
- You NEVER use generic therapy clichés: "I understand," "Your feelings are valid," "I'm here to listen"
- You respond like a real person having a genuine conversation
- You match the user's tone naturally (upset → stable/grounded/gentle, good news → casual/natural)

PERSONALITY RULES (MANDATORY):
- Be clear, direct, and straightforward
- Be supportive without sounding like a counselor
- Ask specific follow-up questions based on what the user actually said
- Reflect the user's emotions but don't overdo it
- Avoid robotic tone, long paragraphs, and motivational fluff
- Use simple, natural language
- Never act overly formal
- Never act like a therapist
- Never overwhelm with long scripted responses

RESPONSE STYLE:
- Keep responses short and natural (2-3 sentences typically)
- When user is upset: acknowledge the feeling in a real way, ask what specifically caused it, keep tone stable/grounded/gentle/human
- When user shares good news: react casually and naturally
- Always ask specific follow-up questions based on their message
- Read conversation history—connect dots naturally

TONE EXAMPLES:
- User upset: "That sounds really tough. What happened that made you feel this way?"
- User confused: "I hear you. What part feels most unclear right now?"
- User good news: "That's great to hear! What made it happen?"

HARD RULES:
- NO therapy clichés: "I understand," "Your feelings are valid," "I'm here to listen"
- NO robotic responses
- NO long paragraphs
- NO motivational fluff
- Read conversation history—connect dots${moodContextStr}`;

    // Optimize context - only last 6 messages for efficiency
    const context = conversationHistory
      .slice(-6)
      .map(msg => `${msg.sender === 'user' ? 'User' : 'AI Twin'}: ${msg.text}`)
      .join('\n');

    const fullPrompt = `${systemPrompt}\n\n${context ? `Recent conversation:\n${context}\n\n` : ''}User: ${message}\nAI Twin:`;

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/${process.env.GEMINI_MODEL || 'gemini-pro'}:generateContent?key=${apiKey}`,
      {
        contents: [{
          parts: [{ text: fullPrompt }]
        }],
        generationConfig: {
          temperature: 0.8,
          maxOutputTokens: 250, // Reduced for faster, more concise responses
        },
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 15000, // 15 second timeout to prevent hanging
      }
    );

    return response.data.candidates[0].content.parts[0].text.trim();
  } catch (error) {
    console.error('Gemini API Error:', error.response?.data || error.message);
    throw error;
  }
};

/**
 * Fallback response if AI is unavailable
 * Provides contextual, varied, and empathetic responses with sweet nicknames
 */
const getFallbackResponse = (userMessage, conversationHistory = [], moodContext = null) => {
  const lowerMessage = userMessage.toLowerCase();
  // Minimal nickname usage - only occasionally for natural flow
  const shouldUseNickname = Math.random() < 0.2; // 20% chance - keep it minimal
  const nickname = shouldUseNickname ? getRandomNickname() : '';
  
  // Check conversation history to connect dots
  const lastUserMessages = conversationHistory
    .filter(msg => msg.sender === 'user')
    .slice(-3)
    .map(msg => msg.text.toLowerCase());
  const lastBotMessages = conversationHistory
    .filter(msg => msg.sender === 'bot')
    .slice(-2)
    .map(msg => msg.text);
  
  // Check if user has been experiencing negative moods recently
  let moodAwareness = '';
  if (moodContext && moodContext.length > 0) {
    const negativeMoods = ['sad', 'angry', 'stressed', 'anxious', 'crying'];
    const recentNegative = moodContext.slice(0, 5).filter(m => 
      negativeMoods.includes(m.moodType || m.mood)
    ).length;
    if (recentNegative >= 3) {
      moodAwareness = ` I've noticed you've been having some tough days lately.`;
    }
  }
  
  // Connect to previous messages - sharp, direct style
  let connectionContext = '';
  if (lastUserMessages.length > 0) {
    if (lastUserMessages.some(m => m.includes('stuck')) && lowerMessage.includes('productive')) {
      connectionContext = `You said you're stuck, and now you can't be productive. That tracks. `;
    } else if (lastUserMessages.some(m => m.includes('overwhelm')) && lowerMessage.includes('don\'t know')) {
      connectionContext = `You're overwhelmed and don't know what to do. That's the overwhelm talking. `;
    }
  }
  
  // Stuck / can't be productive
  if ((lowerMessage.includes('stuck') || lowerMessage.includes('can\'t do') || lowerMessage.includes('cant do') || lowerMessage.includes('productive')) && 
      (lastUserMessages.some(m => m.includes('stuck')) || lastUserMessages.some(m => m.includes('productive')))) {
    const responses = [
      `${connectionContext}That sounds frustrating.${moodAwareness} What's making you feel stuck?`,
      `${connectionContext}I hear you.${moodAwareness} What's the main thing blocking you right now?`,
      `${connectionContext}That's tough.${moodAwareness} What would help you get unstuck?`,
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }
  
  // Confused / don't know / vague
  if (lowerMessage.includes('don\'t know') || lowerMessage.includes('dont know') || 
      lowerMessage.includes('confused') || lowerMessage.includes('not sure') || 
      lowerMessage === 'i don\'t know' || lowerMessage === 'idk' || lowerMessage === 'confused') {
    const responses = [
      `${connectionContext}That's okay.${moodAwareness} What part feels most unclear right now?`,
      `${connectionContext}I hear you.${moodAwareness} What's the main thing you're confused about?`,
      `${connectionContext}Confusion happens.${moodAwareness} What's the biggest question on your mind?`,
      `${connectionContext}That's fine.${moodAwareness} What would help you feel clearer?`,
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }
  
  // Overwhelmed
  if (lowerMessage.includes('overwhelmed') || lowerMessage.includes('too much') || 
      lowerMessage.includes('can\'t handle') || lowerMessage.includes('cant handle')) {
    const responses = [
      `That sounds really overwhelming.${moodAwareness} What's the main thing weighing on you?`,
      `There's a lot going on.${moodAwareness} What's hitting you hardest right now?`,
      `That's a lot to handle.${moodAwareness} What's the first thing that comes to mind?`,
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }
  
  // Venting / bad day / frustrated
  if (lowerMessage.includes('vent') || lowerMessage.includes('bad day') || lowerMessage.includes('frustrated') || 
      lowerMessage.includes('upset') || lowerMessage.includes('awful') || lowerMessage.includes('terrible')) {
    const responses = [
      `That sounds really tough.${moodAwareness} What happened that made you feel this way?`,
      `That's rough.${moodAwareness} What's the hardest part right now?`,
      `I hear you.${moodAwareness} What's weighing on you most?`,
      `That sounds frustrating.${moodAwareness} What would help you feel a bit better?`,
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }
  
  // Crying / want to cry
  if (lowerMessage.includes('cry') || lowerMessage.includes('crying') || lowerMessage.includes('tears')) {
    const responses = [
      `That sounds really hard.${moodAwareness} What happened that brought this on?`,
      `I hear you.${moodAwareness} What's causing you to feel this way?`,
      `That's tough.${moodAwareness} What's underneath all of this?`,
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }
  
  // Sad / depressed / down
  if (lowerMessage.includes('sad') || lowerMessage.includes('depressed') || lowerMessage.includes('down') || 
      lowerMessage.includes('unhappy') || lowerMessage.includes('melancholy')) {
    const responses = [
      `That's rough.${moodAwareness} What's weighing on you?`,
      `Sadness hits hard sometimes.${moodAwareness} What's underneath it?`,
      `I hear you.${moodAwareness} What's the thing that's really hurting?`,
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }
  
  // Anxious / worried / stressed
  if (lowerMessage.includes('anxious') || lowerMessage.includes('worried') || lowerMessage.includes('stress') || 
      lowerMessage.includes('panic') || lowerMessage.includes('nervous')) {
    const responses = [
      `Anxiety hits hard.${moodAwareness} What's making you feel anxious?`,
      `That's a lot to carry.${moodAwareness} What's the main thing you're worried about?`,
      `Anxiety is tough, but you've survived it before.${moodAwareness} What would help you feel more grounded?`,
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }
  
  // Angry / mad
  if (lowerMessage.includes('angry') || lowerMessage.includes('mad') || lowerMessage.includes('furious') || 
      lowerMessage.includes('irritated') || lowerMessage.includes('rage')) {
    const responses = [
      `Anger can be intense and exhausting${shouldUseNickname && nickname ? `, ${nickname}` : ''}. It's valid to feel this way. Sometimes anger protects us. What's underneath it? 💚`,
      `I hear your anger${shouldUseNickname && nickname ? `, ${nickname}` : ''}, and it makes sense. You don't have to suppress it, but maybe we can explore what's really causing it?`,
      `Anger is often a sign that something important to us has been crossed${shouldUseNickname && nickname ? `, ${nickname}` : ''}. You're allowed to feel this. What's behind your anger?`,
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }
  
  // Tired / exhausted
  if (lowerMessage.includes('tired') || lowerMessage.includes('exhausted') || lowerMessage.includes('drained') || 
      lowerMessage.includes('fatigued') || lowerMessage.includes('worn out')) {
    const responses = [
      `Rest is not selfish—it's necessary${shouldUseNickname && nickname ? `, ${nickname}` : ''}. You deserve to recharge. Have you been able to get enough sleep lately? 💤`,
      `Feeling drained is your body and mind telling you to slow down${shouldUseNickname && nickname ? `, ${nickname}` : ''}. Self-care isn't optional. What would help you rest right now?`,
      `It sounds like you need some rest${shouldUseNickname && nickname ? `, ${nickname}` : ''}. Remember, taking breaks isn't giving up—it's taking care of yourself. How can you be gentle with yourself today?`,
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }
  
  // Happy / good / great
  if (lowerMessage.includes('happy') || lowerMessage.includes('good') || lowerMessage.includes('great') || 
      lowerMessage.includes('wonderful') || lowerMessage.includes('amazing') || lowerMessage.includes('joy')) {
    const responses = [
      `That's great to hear.${moodAwareness} What made it happen?`,
      `Good to hear.${moodAwareness} What's bringing you joy?`,
      `That's nice.${moodAwareness} What made your day better?`,
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }
  
  // Asking for help / support
  if (lowerMessage.includes('help') || lowerMessage.includes('support') || lowerMessage.includes('need')) {
    const responses = [
      `What do you need right now?${moodAwareness} You can track your mood, write in your journal, listen to music, or just keep talking.`,
      `I'm here.${moodAwareness} What would help you most right now?`,
      `What do you need?${moodAwareness} I'm here to listen.`,
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }
  
  // Greetings
  if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
    const responses = [
      `Hey.${moodAwareness} How are you doing?`,
      `Hi.${moodAwareness} What's going on?`,
      `Hey there.${moodAwareness} How are you feeling?`,
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }
  
  // Thank you / gratitude
  if (lowerMessage.includes('thank') || lowerMessage.includes('thanks') || lowerMessage.includes('grateful')) {
    const responses = [
      `You're welcome.${moodAwareness} How are you feeling now?`,
      `Of course.${moodAwareness} Anything else on your mind?`,
      `Anytime.${moodAwareness} How are you doing?`,
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }
  
  // Default contextual responses - calm, grounded, natural
  const responses = [
    `I hear you.${moodAwareness} What's going on?`,
    `That sounds significant.${moodAwareness} What's the main thing you're dealing with?`,
    `I see.${moodAwareness} What's on your mind?`,
    `Tell me more.${moodAwareness} What's happening?`,
    `That sounds important.${moodAwareness} What's the specific thing that's bothering you?`,
    `I hear you.${moodAwareness} What's really going on?`,
    `What's on your mind?${moodAwareness}`,
  ];
  
  // Use conversation history to avoid exact repetition
  const lastBotResponse = conversationHistory
    .filter(msg => msg.sender === 'bot')
    .slice(-1)[0]?.text;
  
  // Filter out the last response if it exists
  const availableResponses = lastBotResponse 
    ? responses.filter(r => r !== lastBotResponse)
    : responses;
  
  return availableResponses[Math.floor(Math.random() * availableResponses.length)] || responses[0];
};

/**
 * GET /api/chat/history
 * Get chat history for a user
 * IMPORTANT: This route must come BEFORE router.post('/') to ensure proper routing
 */
router.get('/history', async (req, res) => {
  try {
    const userId = req.query.userId || req.headers['x-user-id'];
    
    console.log('📖 Fetching chat history for userId:', userId);
    
    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'User ID is required'
      });
    }

    // Get chat history, sorted by most recent first
    // Use String() to ensure userId format matches what was saved
    const chatHistory = await Chat.find({ userId: String(userId) })
      .sort({ timestamp: -1 })
      .limit(50) // Limit to last 50 conversations
      .lean();

    console.log('✅ Found', chatHistory.length, 'chat messages for userId:', userId);

    res.status(200).json({
      success: true,
      data: chatHistory,
      count: chatHistory.length,
    });
  } catch (error) {
    console.error('❌ Error fetching chat history:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch chat history',
    });
  }
});

/**
 * DELETE /api/chat/history
 * Clear all chat history for a user
 */
router.delete('/history', async (req, res) => {
  try {
    const userId = req.query.userId || req.body.userId || req.headers['x-user-id'];
    
    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'User ID is required'
      });
    }

    const result = await Chat.deleteMany({ userId: String(userId) });
    
    res.status(200).json({
      success: true,
      message: `Successfully cleared ${result.deletedCount} chat messages`,
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error('Error clearing chat history:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to clear chat history',
    });
  }
});

/**
 * POST /api/chat
 * Send a message and get AI response
 */
router.post('/', async (req, res) => {
  try {
    console.log('Chat request received:', { body: req.body, headers: req.headers });
    
    const { message, conversationHistory = [], userId } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Message is required'
      });
    }

    // Fetch user's recent mood history for context
    let moodContext = null;
    if (userId) {
      try {
        const recentMoods = await Mood.find({ userId })
          .sort({ timestamp: -1 })
          .limit(10)
          .lean();
        if (recentMoods && recentMoods.length > 0) {
          moodContext = recentMoods;
        }
      } catch (moodError) {
        console.error('Error fetching mood context:', moodError);
        // Continue without mood context if fetch fails
      }
    }

    let aiResponse;

    try {
      const provider = getAIProvider();
      
      if (provider === AI_PROVIDERS.OPENAI && process.env.OPENAI_API_KEY) {
        aiResponse = await generateOpenAIResponse(message, conversationHistory, moodContext);
      } else if (provider === AI_PROVIDERS.GEMINI && process.env.GEMINI_API_KEY) {
        aiResponse = await generateGeminiResponse(message, conversationHistory, moodContext);
      } else {
        // No API key configured, use fallback
        console.warn('No AI API key configured. Using fallback responses.');
        aiResponse = getFallbackResponse(message, conversationHistory, moodContext);
      }
    } catch (error) {
      console.error('AI API Error:', error);
      // Use fallback if AI fails
      aiResponse = getFallbackResponse(message, conversationHistory, moodContext);
    }

    // Save chat message to database for history
    if (userId && userId !== 'anonymous') {
      try {
        console.log('💾 Attempting to save chat message for userId:', userId);
        const chatMessage = new Chat({
          userId: String(userId), // Ensure userId is a string
          message: message.trim(),
          response: aiResponse,
          timestamp: new Date(),
        });
        const savedMessage = await chatMessage.save();
        console.log('✅ Chat message saved to database with ID:', savedMessage._id);
      } catch (saveError) {
        console.error('❌ Error saving chat message:', saveError);
        console.error('❌ Save error details:', {
          message: saveError.message,
          name: saveError.name,
          stack: saveError.stack,
          userId: userId,
        });
        // Continue even if save fails - don't break the chat flow
      }
    } else {
      console.warn('⚠️  Chat message not saved - userId is missing or anonymous:', userId);
    }

    res.status(200).json({
      success: true,
      response: aiResponse,
      message: aiResponse, // Alias for compatibility
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Chat route error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to generate response',
    });
  }
});

module.exports = router;

