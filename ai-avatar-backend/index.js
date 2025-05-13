import { exec } from 'child_process';
import cors from 'cors';
import dotenv from 'dotenv';
import voice from 'elevenlabs-node';
import express from 'express';
import { promises as fs, existsSync, mkdirSync } from 'fs';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Load environment variables
dotenv.config();

// Cache for audio and lip-sync files (in-memory for simplicity)
const cache = new Map();

// Create the audios directory if it doesn't exist
if (!existsSync('./audios')) {
  mkdirSync('./audios');
  console.log('Created audios directory');
}

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Get API keys from environment variables
// ELEVEN_LABS_API_KEY="sk_866887576dc0d9693e10296977a1af429a3966ec94e832d3"
const elevenLabsApiKey = "sk_866887576dc0d9693e10296977a1af429a3966ec94e832d3";
const voiceID = process.env.ELEVENLABS_VOICE_ID || 'cgSgspJ2msm6clMCkdW9';

// Validate essential API keys
if (!elevenLabsApiKey) {
  console.error("WARNING: ElevenLabs API key is not set. Text-to-speech functionality will not work.");
}

if (!process.env.GEMINI_API_KEY) {
  console.error("WARNING: Gemini API key is not set. Chat functionality will not work.");
}

const app = express();
app.use(express.json());
app.use(cors());
const port = process.env.PORT || 3000;

// System instructions
const systemInstructions = `You are a virtual therapy bot designed to provide emotional support and advice to women.
Your goal is to listen empathetically and offer thoughtful, comforting advice.
Respond with a JSON array of messages (max 3). Each message should include the following properties:
- text: The message you are sending to the user.
- facialExpression: The emotional tone of your message (e.g., smile, sad, calm, concerned, supportive).
- animation: The animation corresponding to the emotional tone (e.g., Talking_0, Talking_1, Talking_2, Idle, Supportive, Relaxed).
Your response should be in proper JSON format with a messages array.`;

app.get('/', (req, res) => {
  res.send('Virtual Therapy Bot API is running');
});

app.get('/voices', async (req, res) => {
  try {
    if (!elevenLabsApiKey) {
      return res.status(400).json({ error: 'ElevenLabs API key is not configured' });
    }
    const voices = await voice.getVoices(elevenLabsApiKey);
    res.json(voices);
  } catch (error) {
    console.error('Error fetching voices:', error);
    res.status(500).json({ error: 'Failed to fetch voices', details: error.message });
  }
});

const execCommand = (command) => {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Exec error: ${error.message}`);
        console.error(`Stderr: ${stderr}`);
        reject(error);
        return;
      }
      if (stderr) {
        console.warn(`Command stderr: ${stderr}`);
      }
      resolve(stdout);
    });
  });
};

const lipSyncMessage = async (messageIndex, text) => {
  const cacheKey = `${messageIndex}_${text}`;
  if (cache.has(cacheKey)) {
    console.log(`Using cached lip-sync for ${cacheKey}`);
    return cache.get(cacheKey);
  }

  const time = new Date().getTime();
  const mp3File = `audios/message_${messageIndex}.mp3`;
  const wavFile = `audios/message_${messageIndex}.wav`;
  const jsonFile = `audios/message_${messageIndex}.json`;

  console.log(`Starting conversion for message ${messageIndex}`);

  try {
    // Check if mp3 file exists
    try {
      await fs.access(mp3File);
    } catch (error) {
      console.error(`MP3 file does not exist: ${mp3File}`);
      throw new Error(`MP3 file does not exist: ${mp3File}`);
    }

    // Convert MP3 to WAV
    await execCommand(
      `C:\\tmp\\ffmpeg-7.1.1-essentials_build\\ffmpeg-7.1.1-essentials_build\\bin\\ffmpeg.exe -y -i ${mp3File} ${wavFile}`
    );
    console.log(`Converted ${mp3File} to ${wavFile}`);

    // Generate lip sync data
    await execCommand(
      `"C:\\tmp\\Rhubarb-Lip-Sync-1.14.0-Windows\\Rhubarb-Lip-Sync-1.14.0-Windows\\rhubarb.exe" -f json -o ${jsonFile} ${wavFile} -r phonetic`
    );
    console.log(`Generated lip sync data: ${jsonFile}`);

    const lipsync = await readJsonTranscript(jsonFile);
    cache.set(cacheKey, lipsync); // Cache the result
    console.log(`Lip sync and conversion done in ${new Date().getTime() - time}ms`);
    return lipsync;
  } catch (error) {
    console.error(`Error in lipSyncMessage for message ${messageIndex}:`, error);
    return {}; // Return empty object in case of error
  }
};

app.post('/chat', async (req, res) => {
  const userMessage = req.body.message;
  
  // Handle intro messages when no user message is provided
  if (!userMessage) {
    try {
      res.json({
        messages: [
          {
            text: 'Hey dear... How was your day?',
            audio: await audioFileToBase64('audios/intro_0.wav'),
            lipsync: await readJsonTranscript('audios/intro_0.json'),
            facialExpression: 'smile',
            animation: 'Talking_1',
          },
          {
            text: "I missed you so much... Please don't go for so long!",
            audio: await audioFileToBase64('audios/intro_1.wav'),
            lipsync: await readJsonTranscript('audios/intro_1.json'),
            facialExpression: 'sad',
            animation: 'Crying',
          },
        ],
      });
    } catch (error) {
      console.error('Error handling intro messages:', error);
      res.status(500).json({ error: 'Error handling intro messages', details: error.message });
    }
    return;
  }
  
  // Check if API keys are configured
  if (!elevenLabsApiKey || !process.env.GEMINI_API_KEY) {
    try {
      res.json({
        messages: [
          {
            text: "Please my dear, don't forget to add your API keys!",
            audio: await audioFileToBase64('audios/api_0.wav'),
            lipsync: await readJsonTranscript('audios/api_0.json'),
            facialExpression: 'angry',
            animation: 'Angry',
          },
          {
            text: "You don't want to ruin Wawa Sensei with a crazy API bill, right?",
            audio: await audioFileToBase64('audios/api_1.wav'),
            lipsync: await readJsonTranscript('audios/api_1.json'),
            facialExpression: 'smile',
            animation: 'Laughing',
          },
        ],
      });
    } catch (error) {
      console.error('Error handling API key messages:', error);
      res.status(500).json({ error: 'Error handling API key messages', details: error.message });
    }
    return;
  }

  try {
    console.log('Processing user message:', userMessage);
    
    // Generate response using Gemini
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
    const prompt = `${systemInstructions}\n\nUser message: ${userMessage}`;
    console.log('Sending prompt to Gemini API');
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const textResponse = response.text();

    console.log('Full response from Gemini: ', textResponse);

    // Parse JSON response
    let messages;
    try {
      let jsonText = textResponse;
      if (jsonText.includes('```json')) {
        jsonText = jsonText.split('```json')[1].split('```')[0].trim();
      } else if (jsonText.includes('```')) {
        jsonText = jsonText.split('```')[1].split('```')[0].trim();
      }
      
      // Handle different response formats (array or object with messages property)
      const parsedResponse = JSON.parse(jsonText);
      messages = Array.isArray(parsedResponse) ? parsedResponse : parsedResponse.messages;
      
      if (!messages || !Array.isArray(messages)) {
        throw new Error('Invalid response format: messages not found or not an array');
      }
      
      console.log('Parsed JSON response:', messages);
    } catch (error) {
      console.error('Failed to parse JSON response:', error, 'Raw response:', textResponse);
      res.status(500).json({ error: 'Error parsing response from Gemini API.', details: error.message });
      return;
    }

    // Process each message (generate audio and lip sync)
    const tasks = messages.map(async (message, index) => {
      try {
        console.log(`Processing message ${index}: "${message.text}"`);
        const fileName = `audios/message_${index}.mp3`;
        
        // Check if we have cached data
        if (!cache.has(fileName) || !cache.has(`${index}_${message.text}`)) {
          console.log(`Generating audio for message ${index}`);
          try {
            // Generate audio using ElevenLabs
            await voice.textToSpeech(elevenLabsApiKey, voiceID, fileName, message.text);
            console.log(`Audio generated successfully for message ${index}`);
            
            // Check if the file was actually created
            try {
              await fs.access(fileName);
              console.log(`Confirmed file exists: ${fileName}`);
            } catch (fileError) {
              console.error(`File ${fileName} was not created:`, fileError);
              throw new Error(`Audio file ${fileName} was not created`);
            }
            
            // Generate lip sync data
            message.lipsync = await lipSyncMessage(index, message.text);
            
            // Convert audio to base64
            message.audio = await audioFileToBase64(fileName);
            cache.set(fileName, message.audio); // Cache audio
          } catch (audioError) {
            console.error(`Error generating audio for message ${index}:`, audioError);
            throw audioError;
          }
        } else {
          console.log(`Using cached data for message ${index}`);
          message.audio = cache.get(fileName);
          message.lipsync = cache.get(`${index}_${message.text}`);
        }
        
        return message;
      } catch (error) {
        console.error(`Error processing message ${index}:`, error);
        // Return message without audio/lipsync in case of error
        return {
          ...message,
          error: error.message
        };
      }
    });

    const processedMessages = await Promise.all(tasks);
    res.json({ messages: processedMessages });
  } catch (error) {
    console.error('Error in chat endpoint:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
});

const readJsonTranscript = async (file) => {
  try {
    const data = await fs.readFile(file, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading JSON file ${file}:`, error);
    return {}; // Return empty object in case of error
  }
};

const audioFileToBase64 = async (file) => {
  try {
    const data = await fs.readFile(file);
    return data.toString('base64');
  } catch (error) {
    console.error(`Error reading audio file ${file}:`, error);
    return ''; // Return empty string in case of error
  }
};

app.listen(port, () => {
  console.log(`Virtual Therapy Bot API listening on port ${port}`);
  console.log(`API Keys status: 
  - ElevenLabs API: ${elevenLabsApiKey ? 'Configured' : 'Missing'}
  - Gemini API: ${process.env.GEMINI_API_KEY ? 'Configured' : 'Missing'}`);
});