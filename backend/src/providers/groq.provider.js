const Groq = require('groq-sdk');
const env = require('../config/env');

let groqClient = null;

if (env.GROQ_API_KEY) {
  try {
    groqClient = new Groq({ apiKey: env.GROQ_API_KEY });
  } catch (error) {
    console.warn("Failed to initialize Groq client. Check GROQ_API_KEY.");
  }
} else {
  console.warn("GROQ_API_KEY is not set. AI capabilities will be disabled.");
}

module.exports = groqClient;
