const groq = require('../../../providers/groq.provider');
const env = require('../../../config/env');

class GroqCompatibilityService {
  static async calculateScore(profile, room) {
    if (!groq || !env.GROQ_API_KEY) {
      throw new Error("Groq API not configured.");
    }

    const prompt = `
      Evaluate the compatibility between this tenant and room on a scale of 0 to 100.
      Return ONLY valid JSON with keys "score" (number) and "explanation" (string). Do not return markdown blocks like \`\`\`json. Return pure JSON string.

      Tenant Profile:
      Location: ${profile.preferredLocation}
      Budget: ${profile.minBudget} to ${profile.maxBudget}
      Move in: ${profile.moveInDate}

      Room Details:
      Location: ${room.location}
      Rent: ${room.rent}
      Available: ${room.availableFrom}
      Type: ${room.roomType}
      Furnishing: ${room.furnishingStatus}
      Description: ${room.description}
    `;

    // Implement timeout
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('LLM Request Timeout')), env.LLM_TIMEOUT)
    );

    const apiPromise = groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama-3.1-8b-instant',
      temperature: 0.2,
      response_format: { type: 'json_object' }
    });

    try {
      const response = await Promise.race([apiPromise, timeoutPromise]);
      let rawResponse = response.choices[0]?.message?.content?.trim() || "";

      // Safeguard against markdown blocks if model ignores response_format
      if (rawResponse.startsWith('```json')) {
        rawResponse = rawResponse.replace(/```json/g, '').replace(/```/g, '').trim();
      }

      const scoreResult = JSON.parse(rawResponse);
      
      if (typeof scoreResult.score !== 'number' || typeof scoreResult.explanation !== 'string') {
        throw new Error('Invalid JSON structure from Groq');
      }

      return scoreResult;
    } catch (error) {
      throw error;
    }
  }

  static async askQuestion(profile, room, question) {
    console.log("askQuestion called. groq:", !!groq, "GROQ_API_KEY:", !!env.GROQ_API_KEY);
    if (!groq || !env.GROQ_API_KEY) {
      throw new Error(`Groq API not configured. Cannot answer questions. (groq: ${!!groq}, key: ${!!env.GROQ_API_KEY})`);
    }

    const prompt = `
      You are a helpful and polite AI assistant for a room rental platform. 
      A tenant is asking a question about a specific room. 
      Answer their question concisely (max 2-3 sentences). Be helpful and direct.
      Only use the context provided below. If you don't know the answer based on the context, say so politely.

      Tenant Profile Context:
      - Preferred Location: ${profile.preferredLocation}
      - Budget: ${profile.minBudget} to ${profile.maxBudget}
      - Move in Date: ${profile.moveInDate}

      Room Details Context:
      - Location: ${room.location}
      - Rent: ${room.rent}
      - Available: ${room.availableFrom}
      - Type: ${room.roomType}
      - Furnishing: ${room.furnishingStatus}
      - Description: ${room.description}

      Tenant Question: "${question}"
    `;

    // Implement timeout
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('LLM Request Timeout')), env.LLM_TIMEOUT)
    );

    const apiPromise = groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama-3.1-8b-instant',
      temperature: 0.4
    });

    try {
      const response = await Promise.race([apiPromise, timeoutPromise]);
      return response.choices[0]?.message?.content?.trim() || "";
    } catch (error) {
      if (error?.error?.error?.message?.includes('503') || error?.message?.includes('503')) {
        throw new Error("The AI is currently experiencing high demand. Please try asking again in a few moments.");
      }
      throw new Error("Sorry, the AI is having trouble processing your request right now.");
    }
  }
}

module.exports = GroqCompatibilityService;
