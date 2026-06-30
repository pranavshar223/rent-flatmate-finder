const { GoogleGenAI } = require('@google/genai');
const env = require('../config/env');

let ai;
if (env.GEMINI_API_KEY) {
  ai = new GoogleGenAI({ apiKey: env.GEMINI_API_KEY });
} else {
  console.warn('⚠️ GEMINI_API_KEY is not set. Compatibility engine will use fallback algorithm.');
}

module.exports = ai;
