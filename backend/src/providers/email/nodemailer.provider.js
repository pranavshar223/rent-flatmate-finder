const nodemailer = require('nodemailer');
const env = require('../../config/env');
const EmailProviderInterface = require('./email.provider.interface');

class NodemailerProvider extends EmailProviderInterface {
  constructor() {
    super();
    this.transporter = null;
    this.initialize();
  }

  async initialize() {
    if (env.SMTP_HOST === 'smtp.ethereal.email' && !env.SMTP_USER) {
      // Auto-generate ethereal account for local testing if no credentials provided
      const testAccount = await nodemailer.createTestAccount();
      this.transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
      console.info(`[Email] Ethereal test account created: ${testAccount.user}`);
    } else {
      // Use configured credentials
      this.transporter = nodemailer.createTransport({
        host: env.SMTP_HOST,
        port: env.SMTP_PORT,
        secure: env.SMTP_PORT === 465, // true for 465, false for other ports
        auth: {
          user: env.SMTP_USER,
          pass: env.SMTP_PASS,
        },
      });
    }
  }

  async sendEmail({ to, subject, html }) {
    if (!this.transporter) {
      await this.initialize();
    }

    const mailOptions = {
      from: env.EMAIL_FROM,
      to,
      subject,
      html,
    };

    const info = await this.transporter.sendMail(mailOptions);
    
    // Log the preview URL for Ethereal email testing
    if (info.messageId && env.SMTP_HOST === 'smtp.ethereal.email') {
      console.info(`[Email] Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
    }

    return info;
  }
}

module.exports = new NodemailerProvider();
