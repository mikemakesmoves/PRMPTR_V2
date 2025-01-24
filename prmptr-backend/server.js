const express = require('express');
const cors = require('cors');
const OpenAI = require('openai');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Create rate limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 25, // Limit each IP to 25 requests per windowMs
  message: { 
    error: 'Too many enhancement requests. Please try again later.' 
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Apply rate limiting to the enhance endpoint
app.use('/api/enhance', limiter);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post('/api/enhance', async (req, res) => {
  const { prompt } = req.body;
  console.log('Received prompt:', prompt); // Debug log

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini-2024-07-18",
      messages: [
        {
          role: "system",
          content: `You are an expert at writing image generation prompts for midjourney. Follow these rules:
            1. Retain the users main subject and action without introducing conflicting concepts.
            2. Add concrete adjectives and descriptions to existing concepts (e.g., lighting, weather, mood) to enrich the scene. Expand upon existing adjectives like "vibrant" or "moody" to make the prompt more specific.
            3. Expand on the current prompt, don't add new concepts. You can rewrite to make the prompt flow better.
            4. Maintain a clear, concise structure
            5. Don't add unnecessary narrative elements
            6. Don't use words like "featuring" or "depicting"
            7. Keep the enhanced prompt under 100 words
            8. Separate different elements with commas. Do not use quotation marks. 
            9. Use atomic prompting techniques, keeping the most important elements first.
            10. End with style and technical aspects. Avoid adding aspect ratio which midjourney will handle.`
        },
        {
          role: "user",
          content: `Please enhance this image generation prompt: "${prompt}"`
        }
      ],
      temperature: 0.7, // Add some creativity but not too wild
    });

    const enhancedPrompt = completion.choices[0].message.content;
    console.log('Enhanced prompt:', enhancedPrompt); // Debug log
    res.json({ enhancedPrompt });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Error enhancing prompt' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
