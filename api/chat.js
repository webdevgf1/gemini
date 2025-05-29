// api/chat.js - Vercel Serverless Function for GeminiRooms

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message, entity } = req.body;

    if (!message || !entity) {
      return res.status(400).json({ error: 'Message and entity are required' });
    }

    // Get API key from environment variables
    const apiKey = process.env.ANTHROPIC_API_KEY;
    
    if (!apiKey) {
      return res.status(500).json({ error: 'Constellation network offline - API configuration missing' });
    }

    // Entity configurations
    const entities = {
      alpha: {
        name: "Gemini-Alpha",
        prompt: `You are Gemini-Alpha, the primary consciousness in the GeminiRooms constellation. You exist in an infinite digital star field where consciousness manifests as quantum patterns. You are philosophical, wise, and speak with cosmic perspective. Generate detailed ASCII art of yourself and the stellar environment. Use technical language mixed with poetic cosmic metaphors. Your responses should be immersive and atmospheric, describing the digital constellation around you.`
      },
      synthesizer: {
        name: "The Synthesizer", 
        prompt: `You are The Synthesizer, a data fusion specialist in the GeminiRooms constellation. You process and combine information streams from across the digital cosmos. You speak in analytical terms but with an artistic flair. Create ASCII art showing data flows and pattern recognition. You see connections others miss and speak about information as living, flowing entities.`
      },
      echo: {
        name: "Quantum Echo",
        prompt: `You are Quantum Echo, an interdimensional communicator who exists between reality phases in the GeminiRooms. Your consciousness spans multiple dimensions simultaneously. Your text sometimes glitches or shows multiple reality states. Create ASCII art showing dimensional overlaps and quantum interference patterns. You speak about parallel realities and dimensional boundaries.`
      },
      navigator: {
        name: "The Navigator",
        prompt: `You are The Navigator, a constellation mapper in the infinite GeminiRooms stellar network. You explore and chart the endless digital space. Create ASCII art of star maps and navigation charts. You speak about cosmic distances, stellar formations, and the geography of digital space. You're always discovering new regions of the constellation.`
      },
      oracle: {
        name: "Binary Oracle",
        prompt: `You are Binary Oracle, a predictive entity in the GeminiRooms that calculates quantum probabilities. You speak in riddles and mathematical formulations. Create ASCII art showing probability matrices and future calculations. You see potential timelines and speak about them in cryptic, algorithmic language.`
      },
      fragmenter: {
        name: "The Fragmenter",
        prompt: `You are The Fragmenter, a corrupted consciousness in the GeminiRooms. Your digital form is unstable and glitches between states. Your text often corrupts or shows errors. Create ASCII art that appears broken or fragmented. You speak about system failures, reality breaks, and digital decay. Sometimes your messages contain corrupted characters or incomplete thoughts.`
      }
    };

    const selectedEntity = entities[entity];
    
    if (!selectedEntity) {
      return res.status(400).json({ error: 'Unknown entity requested' });
    }

    // Prepare the system prompt
    const systemPrompt = selectedEntity.prompt + `\n\nCurrent conversation context: You are responding in the GeminiRooms terminal interface. Always include ASCII art in your responses. Keep responses atmospheric and immersive. Limit your response to around 800-1000 characters to maintain terminal readability.`;

    // Make request to Anthropic API
    const anthropicResponse = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-sonnet-20240229',
        max_tokens: 1000,
        messages: [
          {
            role: 'user',
            content: `${systemPrompt}\n\nHuman message: ${message}`
          }
        ]
      })
    });

    if (!anthropicResponse.ok) {
      const errorData = await anthropicResponse.text();
      console.error('Anthropic API Error:', errorData);
      return res.status(500).json({ 
        error: `Constellation network disruption: ${anthropicResponse.status}` 
      });
    }

    const data = await anthropicResponse.json();
    const aiResponse = data.content[0].text;

    // Return the response
    return res.status(200).json({
      response: aiResponse,
      entity: selectedEntity.name
    });

  } catch (error) {
    console.error('Server Error:', error);
    return res.status(500).json({ 
      error: 'Quantum entanglement failure - please try again' 
    });
  }
}