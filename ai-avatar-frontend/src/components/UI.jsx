import { useRef, useState, useEffect } from 'react';
import { useChat } from '../hooks/useChat';
import ReactMarkdown from 'react-markdown';
import LawBot from './LawBot';


export const UI = ({ hidden, ...props }) => {
  const input = useRef();
  const lawBotInput = useRef();
  const { chat, loading, cameraZoomed, setCameraZoomed } = useChat();
  const [isListening, setIsListening] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [mood, setMood] = useState(null);
  const [showLawBot, setShowLawBot] = useState(false);
  const [lawBotMessages, setLawBotMessages] = useState([]);
  const [isLawBotThinking, setIsLawBotThinking] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const audioRef = useRef(null);
  
  // Add this function to handle text-to-speech with ElevenLabs
  const speakText = async (text) => {
    if (isSpeaking) {
      // If already speaking, stop current speech
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      setIsSpeaking(false);
      return;
    }
    
    try {
      setIsSpeaking(true);
      
      // Replace with your ElevenLabs API key
      const ELEVEN_LABS_API_KEY = 'sk_866887576dc0d9693e10296977a1af429a3966ec94e832d3';
      // You can change the voice ID as needed
      const VOICE_ID = 'EXAVITQu4vr4xnSDxMaL'; // Default female voice
      
      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'xi-api-key': ELEVEN_LABS_API_KEY
        },
        body: JSON.stringify({
          text: text,
          model_id: 'eleven_monolingual_v1',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.5
          }
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to generate speech');
      }
      
      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      
      const audio = new Audio(audioUrl);
      audioRef.current = audio;
      
      audio.onended = () => {
        setIsSpeaking(false);
        audioRef.current = null;
      };
      
      audio.play();
    } catch (error) {
      console.error('Text-to-speech error:', error);
      setIsSpeaking(false);
    }
  };
  // Speech recognition setup
  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      setShowTooltip(true);
      setTimeout(() => setShowTooltip(false), 3000);
      return;
    }
    
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';
    
    recognition.onstart = () => {
      setIsListening(true);
    };
    
    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map(result => result[0])
        .map(result => result.transcript)
        .join('');
        
      if (input.current) {
        input.current.value = transcript;
      }
    };
    
    recognition.onerror = () => {
      setIsListening(false);
    };
    
    recognition.onend = () => {
      setIsListening(false);
    };
    
    recognition.start();
  };

  const sendMessage = () => {
    const text = input.current.value;
    if (!loading && text.trim()) {
      chat(text);
      input.current.value = '';
      setMood(null);
    }
  };

  // Law Bot message sending
  const sendLawBotMessage = async () => {
    const text = lawBotInput.current.value;
    if (!isLawBotThinking && text.trim()) {
      setLawBotMessages(prev => [...prev, { text, isUser: true }]);
      lawBotInput.current.value = '';
      setIsLawBotThinking(true);
      
      try {
        // Direct API call (no need for separate route file)
        const GEMINI_API_KEY = 'AIzaSyD42oSV5bZPq5-q1fHIDS0J0N3owU6TfFs'; // Replace with your API key or use a safer approach
        
        const response = await fetch('https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-goog-api-key': GEMINI_API_KEY
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `You are a law bot expert focused on women's safety laws in India. 
                    Provide accurate, helpful information about women's rights, safety laws, 
                    and legal procedures. Be precise and supportive in your responses.
                    
                    User question: ${text}`
                  }
                ]
              }
            ]
          })
        });
        
        const result = await response.json();
        const botReply = result.candidates?.[0]?.content?.parts?.[0]?.text || 
                        "I'm having trouble connecting to my knowledge base. Please try again later.";
        
        setLawBotMessages(prev => [...prev, { text: botReply, isUser: false }]);
        
        // Speak the law bot's response
        speakText(botReply);
      } catch (error) {
        console.error('Error:', error);
        setLawBotMessages(prev => [...prev, { 
          text: "I'm sorry, there was an error processing your request. Please try again later.", 
          isUser: false 
        }]);
      } finally {
        setIsLawBotThinking(false);
      }
    }
  };
  // Background patterns based on moods
  const getMoodBackground = () => {
    switch(mood) {
      case 'Happy':
        // Warm, soft and comforting background that makes you feel connected and not lonely
        return 'linear-gradient(135deg, #e4a88a 0%, #dc7a56 100%)';
      case 'Sad':
        return 'linear-gradient(135deg, #566f9e 0%, #2c3e50 100%)';
      case 'Anxious':
        return 'linear-gradient(135deg, #8e44ad 0%, #3a1c71 100%)';
      case 'Calm':
        return 'linear-gradient(135deg, #43cea2 0%, #185a9d 100%)';
      case 'Angry':
        return 'linear-gradient(135deg, #ff6a88 0%, #ff99ac 100%)';
      default:
        return 'linear-gradient(135deg, #2d3250 0%, #5a4894 100%)';
    }
  };

  useEffect(() => {
    // Set background based on mood
    document.body.style.background = getMoodBackground();
    
    return () => {
      document.body.style.background = '';
    };
  }, [mood]);

  const promptSuggestions = [
    { text: 'Indian Law', icon: "⚖️" },
    { text: 'Indian Law IPC 320', icon: "🔺" },
    { text: 'Women Rights', icon: "✓" },
    { text: 'Women Safety', icon: "👆" },
  ];

  if (hidden) {
    return null;
  }

  // Mood selection options
  const moodOptions = [
    { name: 'Happy', emoji: '😊', color: 'bg-amber-400' },
    { name: 'Sad', emoji: '😔', color: 'bg-blue-400' },
    { name: 'Anxious', emoji: '😰', color: 'bg-purple-400' },
    { name: 'Calm', emoji: '😌', color: 'bg-green-400' },
    { name: 'Angry', emoji: '😠', color: 'bg-pink-400' },
  ];

  return (
    <>
      {/* Floating particles that match the mood */}
      <div className="fixed top-0 left-0 right-0 bottom-0 overflow-hidden pointer-events-none">
        {[...Array(12)].map((_, i) => {
          // Particle color based on mood
          let particleColor = 'bg-white/10';
          if (mood === 'Happy') particleColor = 'bg-rose-100/20';
          if (mood === 'Sad') particleColor = 'bg-blue-200/20';
          if (mood === 'Anxious') particleColor = 'bg-purple-200/20';
          if (mood === 'Calm') particleColor = 'bg-green-200/20';
          if (mood === 'Angry') particleColor = 'bg-pink-200/30';
          
          return (
            <div 
              key={i}
              className={`absolute rounded-full ${particleColor} backdrop-blur-3xl`}
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                width: `${Math.random() * 200 + 100}px`,
                height: `${Math.random() * 200 + 100}px`,
                animation: `float ${Math.random() * 30 + 20}s infinite ease-in-out`,
                animationDelay: `${Math.random() * 20}s`,
                opacity: Math.random() * 0.3 + 0.1
              }}
            />
          );
        })}

        {/* Add special elements for "happy" mood to enhance the feeling of connection */}
        {mood === 'Happy' && [...Array(15)].map((_, i) => (
          <div 
            key={`connection-${i}`}
            className="absolute rounded-full bg-white/5"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: '4px',
              height: '4px',
              boxShadow: '0 0 15px 2px rgba(255,255,255,0.3)',
              animation: `twinkle ${Math.random() * 5 + 2}s infinite alternate ease-in-out`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          />
        ))}

        <style jsx global>{`
          @keyframes float {
            0%, 100% { transform: translate(0, 0) rotate(0deg); }
            25% { transform: translate(5%, 15%) rotate(5deg); }
            50% { transform: translate(-5%, 10%) rotate(-5deg); }
            75% { transform: translate(10%, -5%) rotate(3deg); }
          }
          
          @keyframes twinkle {
            0% { opacity: 0.3; transform: scale(0.8); }
            100% { opacity: 0.8; transform: scale(1.2); }
          }
          
          .custom-scrollbar::-webkit-scrollbar {
            width: 6px;
          }
          
          .custom-scrollbar::-webkit-scrollbar-track {
            background: transparent;
          }
          
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background-color: rgba(255, 255, 255, 0.3);
            border-radius: 20px;
          }
          
          .law-bot-container {
            transition: all 0.3s ease;
            transform-origin: center center;
          }
          
          .law-bot-container.collapsed {
            transform: scale(0);
            opacity: 0;
          }
          
          .law-bot-container.expanded {
            transform: scale(1);
            opacity: 1;
          }
          
          /* Add a fade overlay for LawBot modal */
          .modal-overlay {
            background-color: rgba(0, 0, 0, 0.5);
            backdrop-filter: blur(5px);
            transition: all 0.3s ease;
          }
        `}</style>
      </div>

      <div className="fixed top-0 left-0 right-0 bottom-0 z-10 flex justify-between p-8 flex-col pointer-events-none">
        {/* Header with warm, inviting design */}
        <div className="self-start pointer-events-auto rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 shadow-2xl p-6 transition-all duration-300 hover:bg-white/20 max-w-lg">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-xl bg-gradient-to-br from-rose-400 to-indigo-600 flex items-center justify-center shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                <path d="M18 7V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v3" />
                <path d="M18 14v3a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-3" />
                <rect width="18" height="7" x="3" y="7" rx="2" />
              </svg>
            </div>
            <div>
              <h1 className="font-bold text-2xl text-white tracking-tight">Safe Space</h1>
              <p className="text-white/80 text-base mt-1">Your companion on the journey to healing</p>
            </div>
          </div>
          
          {/* Dynamic quote based on mood */}
          <div className="mt-4 pl-4 border-l-4 border-indigo-400/50">
            <p className="italic text-white/80 text-sm">
              {mood === 'Happy' ? 
                "\"In the warmth of connection, loneliness cannot survive.\"" :
                "\"Healing doesn't mean the damage never existed. It means the damage no longer controls our lives.\""
              }
            </p>
          </div>
        </div>
        
        {/* Controls area with larger buttons */}
        <div className="w-full flex flex-col items-end justify-center gap-5">
          <div className="flex gap-3 pointer-events-auto">
            <button
              onClick={() => setCameraZoomed(!cameraZoomed)}
              className="h-14 w-14 rounded-xl bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/25 transition-all duration-200 shadow-xl"
              title={cameraZoomed ? "Zoom out" : "Zoom in"}
            >
              {cameraZoomed ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m21 21-6-6m-2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0Zm-7 0H7" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m21 21-6-6m-2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0Zm-7 0v-4m0 4h-4" />
                </svg>
              )}
            </button>
            
            <button
              onClick={() => {
                const body = document.querySelector('body');
                body.classList.toggle('greenScreen');
              }}
              className="h-14 w-14 rounded-xl bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/25 transition-all duration-200 shadow-xl"
              title="Toggle green screen"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 8V6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-6" />
                <path d="M2 12a4 4 0 0 1 8 0 4 4 0 0 1-8 0z" />
                <path d="M2 12h8" />
                <path d="M9.5 9v6" />
              </svg>
            </button>
          </div>
        </div>

        {/* REDUCED: How are you feeling section - 50% smaller */}
        <div className="w-full max-w-lg mx-auto pointer-events-auto mb-3">
          <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-2 shadow-xl">
            <h3 className="text-white/90 text-sm text-center mb-2">How are you feeling?</h3>
            <div className="flex justify-center gap-2 flex-wrap">
              {moodOptions.map((option) => (
                <button
                  key={option.name}
                  onClick={() => setMood(option.name)}
                  className={`flex items-center px-3 py-1 rounded-lg transition-all ${
                    mood === option.name 
                      ? `${option.color} text-white scale-105` 
                      : 'bg-white/10 hover:bg-white/20 text-white'
                  }`}
                >
                  <span className="text-lg mr-1">{option.emoji}</span>
                  <span className="text-xs">{option.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Input area with larger components */}
        <div className="relative max-w-screen-md w-full mx-auto pointer-events-auto">
          <div className="relative flex items-center gap-3 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-3 shadow-2xl">
            <input
              className="flex-1 bg-transparent text-white placeholder:text-white/50 rounded-lg p-4 text-lg focus:outline-none"
              placeholder={mood ? `Tell me why you're feeling ${mood.toLowerCase()}...` : "Share what's on your mind..."}
              ref={input}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  sendMessage();
                }
              }}
            />
            
            {/* Microphone button */}
            <button
              onClick={startListening}
              className={`relative h-14 w-14 flex items-center justify-center rounded-lg transition-all duration-200
                ${isListening 
                  ? 'bg-rose-500/70 text-white' 
                  : 'bg-white/15 hover:bg-white/25 text-white'
                }`}
              disabled={isListening}
              title="Speak"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
                className={isListening ? 'animate-pulse' : ''}
              >
                <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
                <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                <line x1="12" x2="12" y1="19" y2="22" />
              </svg>
              
              {isListening && (
                <span className="absolute top-0 right-0 h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
                </span>
              )}
            </button>
            
            {/* Send button */}
            <button
              disabled={loading}
              onClick={sendMessage}
              className={`flex items-center justify-center rounded-lg bg-gradient-to-r from-rose-400 to-indigo-600 hover:from-rose-500 hover:to-indigo-700 text-white px-6 py-3 text-base font-medium transition-all duration-200 ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {loading ? (
                <svg 
                  className="animate-spin h-5 w-5 text-white" 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <span className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                    <path d="m22 2-7 20-4-9-9-4Z" />
                    <path d="M22 2 11 13" />
                  </svg>
                  Send
                </span>
              )}
            </button>
          </div>
          
          {/* Status messages */}
          {isListening && (
            <div className="absolute -top-14 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full animate-pulse text-base">
              Listening to you...
            </div>
          )}
          
          {showTooltip && (
            <div className="absolute -top-14 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full text-base">
              Speech recognition not available
            </div>
          )}
        </div>

        {/* Mood-specific motivational message */}
        <div className="fixed bottom-32 left-1/2 transform -translate-x-1/2 pointer-events-none">
          <div className="bg-white/10 backdrop-blur-md text-white px-6 py-3 rounded-full text-base font-medium shadow-lg border border-white/20">
            {mood === 'Happy' && "You're surrounded by connection and warmth. You are never alone."}
            {mood === 'Sad' && "It's okay to feel down; this too shall pass"}
            {mood === 'Anxious' && "Take a deep breath; you're not alone in this"}
            {mood === 'Calm' && "Maintain this peaceful moment, you deserve it"}
            {mood === 'Angry' && "Feel your emotions without judgment"}
            {!mood && "Everything shared here is safe, private and confidential"}
          </div>
        </div>
      </div>

      {/* Law Bot Button (Always visible) */}
      <div className="fixed bottom-8 right-8 z-50 pointer-events-auto">
      <button
    onClick={() => setShowLawBot(!showLawBot)}
    className="group relative h-20 w-20 rounded-lg flex items-center justify-center transform hover:scale-110 transition-all duration-500"
    title="24/7 Law Support"
  >
    {/* Animated glow effect */}
    <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-700 animate-pulse opacity-70"></div>
    
    {/* Shimmering overlay */}
    <div 
      className="absolute inset-0 rounded-lg"
      style={{
        background: "linear-gradient(135deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0) 100%)",
        backgroundSize: "200% 200%",
        animation: "shimmer 2s infinite"
      }}
    ></div>

    {/* Border with gradient animation */}
    <div 
      className="absolute inset-0 rounded-lg" 
      style={{
        border: "2px solid transparent",
        // backgroundImage: "linear-gradient(135deg, #4f46e5, #7e22ce, #4f46e5)",
        backgroundOrigin: "border-box",
        backgroundClip: "padding-box, border-box",
        animation: "borderColor 3s ease infinite"
      }}
    ></div>
    
    {/* Inner content container */}
    <div className="absolute inset-2 rounded-md bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
      {/* Ripple effect on hover */}
      <div className="absolute inset-0 bg-transparent group-hover:bg-white/10 rounded-md transition-colors duration-300"></div>
    </div>
    
    {/* Modern gavel icon */}
    <div className="relative z-10 transform group-hover:rotate-12 transition-all duration-300">
    <svg
    xmlns="http://www.w3.org/2000/svg"
    width="30"
    height="30"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="text-purple-200 group-hover:text-white transition-colors duration-300"
    style={{ filter: "drop-shadow(0 0 2px rgba(255,255,255,0.6))" }}
  >
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
    <path d="M9 12h6"></path>
    <path d="M12 9v6"></path>
    <path d="M9 15l3 3 3-3"></path>
  </svg>
    </div>
    
    {/* Subtle particle effect */}
    <div className="absolute inset-0 overflow-hidden rounded-lg opacity-30">
      <div className="particle particle1"></div>
      <div className="particle particle2"></div>
      <div className="particle particle3"></div>
    </div>
  </button>
  
  {/* Particle and animation keyframes */}
  <style jsx>{`
    @keyframes shimmer {
      0% { background-position: 0% 0%; }
      50% { background-position: 100% 100%; }
      100% { background-position: 0% 0%; }
    }
    
    @keyframes borderColor {
      0%, 100% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
    }
    
    .particle {
      position: absolute;
      background: radial-gradient(circle, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 70%);
      border-radius: 50%;
    }
    
    .particle1 {
      width: 6px;
      height: 6px;
      top: 20%;
      left: 20%;
      animation: float 4s ease-in-out infinite;
    }
    
    .particle2 {
      width: 4px;
      height: 4px;
      top: 65%;
      left: 70%;
      animation: float 6s ease-in-out infinite reverse;
    }
    
    .particle3 {
      width: 5px;
      height: 5px;
      top: 40%;
      left: 60%;
      animation: float 5s ease-in-out infinite 1s;
    }
    
    @keyframes float {
      0%, 100% { transform: translateY(0) translateX(0); }
      25% { transform: translateY(-10px) translateX(5px); }
      50% { transform: translateY(0) translateX(10px); }
      75% { transform: translateY(10px) translateX(5px); }
    }
  `}</style>
</div>
{/* Neo-Cyberpunk Law Bot Modal */}
{showLawBot && (
  <>
    {/* Futuristic overlay with grid pattern */}
    <div
      className="fixed inset-0 z-60 bg-black/80 pointer-events-auto"
      onClick={() => setShowLawBot(false)}
      style={{
        backgroundImage: `
          linear-gradient(to right, rgba(0, 255, 255, 0.05) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(0, 255, 255, 0.05) 1px, transparent 1px)
        `,
        backgroundSize: '20px 20px'
      }}
    ></div>
    
    {/* Centered Law Bot window with glitch entrance animation */}
    <div className="fixed inset-0 z-[150] flex items-center justify-center pointer-events-none p-6">
      <div 
        className="w-4/5 h-4/5 bg-gray-900 rounded-md pointer-events-auto overflow-hidden flex flex-col max-w-5xl"
        style={{
          boxShadow: "0 0 30px rgba(255, 0, 255, 0.5), 0 0 50px rgba(0, 255, 255, 0.3)",
          border: "1px solid rgba(0, 255, 255, 0.5)",
          animation: "glitchIn 0.5s ease-out forwards"
        }}
      >
        {/* Cyberpunk header with scanning effect */}
        <div 
          className="relative bg-black p-4 text-white flex justify-between items-center overflow-hidden"
          style={{
            borderBottom: "1px solid rgba(0, 255, 255, 0.5)"
          }}
        >
          {/* Scanning line animation */}
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "linear-gradient(to bottom, transparent, rgba(0, 255, 255, 0.3), transparent)",
              backgroundSize: "100% 10px",
              backgroundRepeat: "no-repeat",
              animation: "scanline 2s linear infinite"
            }}
          ></div>
          
          {/* Left side - Title with tech look */}
          <div className="flex items-center gap-3 z-10">
            <div 
              className="h-12 w-12 rounded-md flex items-center justify-center relative overflow-hidden"
              style={{
                background: "linear-gradient(135deg, #000 0%, #333 100%)",
                border: "1px solid #00ffff"
              }}
            >
              {/* Hexagon pattern */}
              <div className="absolute inset-0 opacity-30"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z' fill='%2300ffff' fill-opacity='0.4'/%3E%3C/g%3E%3C/svg%3E")`,
                }}
              ></div>
               <svg
    xmlns="http://www.w3.org/2000/svg"
    width="30"
    height="30"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="text-purple-200 group-hover:text-white transition-colors duration-300"
    style={{ filter: "drop-shadow(0 0 2px rgba(255,255,255,0.6))" }}
  >
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
    <path d="M9 12h6"></path>
    <path d="M12 9v6"></path>
    <path d="M9 15l3 3 3-3"></path>
  </svg>
            </div>
            <div>
              <h2 className="font-mono text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-pink-500">
                LAW<span className="text-white">_</span>BOT<span className="text-cyan-400 animate-pulse">:</span>
              </h2>
              <p className="font-mono text-xs text-pink-500">
                <span className="text-gray-400">[</span>WOMEN'S SAFETY PROTOCOL<span className="text-gray-400">]</span>
              </p>
            </div>
          </div>
          
          {/* Right side - CyberClose button */}
          <button 
            onClick={() => setShowLawBot(false)} 
            className="h-10 w-10 bg-gray-900 flex items-center justify-center text-cyan-400 hover:text-pink-500 transition-colors duration-300 relative z-10"
            style={{
              border: "1px solid rgba(0, 255, 255, 0.5)",
              boxShadow: "0 0 10px rgba(0, 255, 255, 0.3)"
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6 6 18"></path>
              <path d="m6 6 12 12"></path>
            </svg>
          </button>
        </div>
        
        {/* Cyberpunk-themed Law Bot component container */}
        <div className="flex-1 overflow-hidden bg-gray-950">
          <LawBot
            lawBotMessages={lawBotMessages}
            isLawBotThinking={isLawBotThinking}
            lawBotInput={lawBotInput}
            sendLawBotMessage={sendLawBotMessage}
            promptSuggestions={promptSuggestions}
          />
        </div>
        
        {/* Decorative footer */}
        <div 
          className="h-2 w-full bg-black"
          style={{
            backgroundImage: "linear-gradient(90deg, transparent 0%, #00ffff 50%, transparent 100%)",
            boxShadow: "0 0 15px rgba(0, 255, 255, 0.7)"
          }}
        ></div>
      </div>
    </div>
  </>

      )}
      <style jsx>{`
  @keyframes scanline {
    0% { background-position: 0 -100%; }
    100% { background-position: 0 200%; }
  }
  
  @keyframes glitchIn {
    0% { clip-path: polygon(0 0, 100% 0, 100% 0, 0 0); }
    20% { clip-path: polygon(0 0, 100% 0, 100% 20%, 0 20%); }
    40% { clip-path: polygon(0 0, 100% 0, 100% 20%, 0 20%); }
    60% { clip-path: polygon(0 0, 100% 0, 100% 60%, 0 60%); }
    80% { clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%); filter: hue-rotate(90deg); }
    81% { clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%); filter: hue-rotate(0); }
    100% { clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%); }
  }
`}</style>
    </>
  );
};

export default UI;