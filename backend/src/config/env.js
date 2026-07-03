require('dotenv').config();

const env = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  DATABASE_URL: process.env.DATABASE_URL,
  JWT_SECRET: process.env.JWT_SECRET || 'supersecretjwtkey_replace_me_in_prod',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  SUPABASE_URL: process.env.SUPABASE_URL,
  SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
  GROQ_API_KEY: process.env.GROQ_API_KEY,
  
  // Notification System
  EMAIL_ENABLED: process.env.EMAIL_ENABLED === 'true',
  EMAIL_RETRY_COUNT: parseInt(process.env.EMAIL_RETRY_COUNT || '3', 10),
  EMAIL_TIMEOUT: parseInt(process.env.EMAIL_TIMEOUT || '10000', 10),
  EMAIL_PROVIDER: process.env.EMAIL_PROVIDER || 'nodemailer',
  BREVO_API_KEY: process.env.BREVO_API_KEY,
  EMAIL_FROM: process.env.EMAIL_FROM || 'no-reply@rentflatmate.com',
  SMTP_HOST: process.env.SMTP_HOST || 'smtp.ethereal.email',
  SMTP_PORT: parseInt(process.env.SMTP_PORT || '587', 10),
  SMTP_USER: process.env.SMTP_USER,
  SMTP_PASS: process.env.SMTP_PASS,
  
  COMPATIBILITY_THRESHOLD: parseInt(process.env.COMPATIBILITY_THRESHOLD || '80', 10),
  LLM_TIMEOUT: parseInt(process.env.LLM_TIMEOUT || '10000', 10),
};

// Fail fast on critical environment variables
const requiredCriticalVars = ['DATABASE_URL', 'SUPABASE_URL', 'SUPABASE_ANON_KEY'];
requiredCriticalVars.forEach((key) => {
  if (!env[key]) {
    throw new Error(`CRITICAL ERROR: ${key} is missing from the environment variables.`);
  }
});

module.exports = env;
