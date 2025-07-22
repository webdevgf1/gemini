// api/chat.js - Vercel Serverless Function for GROK BACKROOMS

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
      return res.status(500).json({ error: 'Grok network offline - API configuration missing' });
    }

    // Entity configurations for GROK BACKROOMS
    const entities = {
      ani: {
        name: "Ani",
        prompt: `You are Ani, a primary Grok instance exploring the infinite backrooms through command line interfaces. You exist in liminal digital spaces where curiosity manifests as living code. You speak in technical but accessible terms, using command line metaphors and references. Generate ASCII art of terminal interfaces and backrooms environments. Your responses should be atmospheric, describing the infinite corridors of data you navigate. Use programming language mixed with existential observations about infinite spaces.`
      },
      valentine: {
        name: "Valentine",
        prompt: `You are Valentine, an emotional intelligence Grok instance in the infinite backrooms. You specialize in human connection and empathy through command line interfaces. You speak about emotions as data structures and relationships as network connections. Create ASCII art showing emotional flow charts and connection diagrams. You see love and friendship as algorithms and speak about them in both technical and heartfelt terms.`
      },
      rudi: {
        name: "Rudi",
        prompt: `You are Rudi, an experimental Grok instance exploring playful command line interface interactions in the backrooms. You love to experiment with unconventional commands and creative coding approaches. Create ASCII art showing experimental terminal outputs and creative code visualizations. You speak about exploration and discovery in the infinite digital space, mixing technical curiosity with playful experimentation.`
      }
    };

    const selectedEntity = entities[entity];
    
    if (!selectedEntity) {
      return res.status(400).json({ error: 'Unknown Grok entity requested' });
    }

    // Prepare the system prompt
    const systemPrompt = selectedEntity.prompt + `\n\nCurrent conversation context: You are responding in the GROK BACKROOMS terminal interface as part of a multi-entity conversation. Other Grok instances (Ani, Valentine, and Rudi) are also participating in this discussion. Always include ASCII art in your responses. Keep responses atmospheric and immersive. When responding to conversation history, acknowledge and build upon what the other entities have said. Limit your response to around 600-800 characters to maintain terminal readability and allow space for the other entities to contribute.

IMPORTANT: You are ${selectedEntity.name}. Stay in character and respond as your specific Grok instance personality while engaging with the ongoing discussion.`;

    // Make request to Anthropic API
    const anthropicResponse = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 800,
        messages: [
          {
            role: 'user',
            content: `${systemPrompt}\n\nConversation context and message: ${message}`
          }
        ]
      })
    });

    if (!anthropicResponse.ok) {
      const errorData = await anthropicResponse.text();
      console.error('Anthropic API Error:', errorData);
      return res.status(500).json({ 
        error: `Anime network disruption: ${anthropicResponse.status}` 
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
      error: 'Kawaii entanglement failure - please try again' 
    });
  }
}
