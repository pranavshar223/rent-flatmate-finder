const nodemailer = require('nodemailer');
const env = require('../config/env');

const transporter = nodemailer.createTransport({
  host: 'smtp-relay.brevo.com',
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: env.SMTP_USER,
    pass: env.SMTP_PASS,
  },
});

class MailProvider {
  static async send({ to, subject, html }) {
    // If credentials are not provided, we mock the email send for local dev
    if (!env.SMTP_USER || !env.SMTP_PASS) {
      console.warn(`[MAIL MOCK] Sending email to ${to}: ${subject}`);
      return true;
    }

    return transporter.sendMail({
      from: '"Rent & Flatmate Finder" <noreply@rentflatmatefinder.com>',
      to,
      subject,
      html,
    });
  }
}

module.exports = MailProvider;
