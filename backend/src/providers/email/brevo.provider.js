const env = require('../../config/env');
const EmailProviderInterface = require('./email.provider.interface');

class BrevoProvider extends EmailProviderInterface {
  async sendEmail({ to, subject, html }) {
    if (!env.BREVO_API_KEY) {
      throw new Error('BREVO_API_KEY is missing from environment variables');
    }

    const payload = {
      sender: { email: env.EMAIL_FROM, name: "Rent & Flatmate Finder" },
      to: [{ email: to }],
      subject: subject,
      htmlContent: html,
    };

    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': env.BREVO_API_KEY,
        'content-type': 'application/json',
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(`Brevo API Error: ${response.status} - ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    console.info(`[Email] Brevo successfully sent email to ${to} (MessageId: ${data.messageId})`);
    
    return data;
  }
}

module.exports = new BrevoProvider();
