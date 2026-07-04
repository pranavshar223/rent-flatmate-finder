const fs = require('fs');
const path = require('path');
const handlebars = require('handlebars');
const env = require('../../config/env');
const nodemailerProvider = require('../../providers/email/nodemailer.provider');
const brevoProvider = require('../../providers/email/brevo.provider');

// Cache for compiled templates
const templateCache = {};
let partialsLoaded = false;

class EmailService {
  constructor() {
    this.provider = env.EMAIL_PROVIDER === 'brevo' ? brevoProvider : nodemailerProvider;
    this.templatesDir = path.join(__dirname, '../../templates/emails');
  }

  _loadPartials() {
    if (partialsLoaded) return;
    try {
      const headerSource = fs.readFileSync(path.join(this.templatesDir, 'partials', 'header.hbs'), 'utf8');
      const footerSource = fs.readFileSync(path.join(this.templatesDir, 'partials', 'footer.hbs'), 'utf8');
      handlebars.registerPartial('header', headerSource);
      handlebars.registerPartial('footer', footerSource);
      partialsLoaded = true;
    } catch (error) {
      console.error("[EmailService] Error loading partials:", error);
    }
  }

  _getCompiledTemplate(templateName) {
    if (templateCache[templateName]) return templateCache[templateName];

    try {
      this._loadPartials();
      const baseSource = fs.readFileSync(path.join(this.templatesDir, 'layouts', 'base.hbs'), 'utf8');
      const templateSource = fs.readFileSync(path.join(this.templatesDir, `${templateName}.hbs`), 'utf8');

      // Compile inner template
      const compiledInner = handlebars.compile(templateSource);
      
      // Register it as a helper or just inject it into base manually.
      // Easiest is to compile the base, and pass the rendered inner as a variable {{{body}}}
      const compiledBase = handlebars.compile(baseSource);
      
      const compositeTemplate = (data) => {
        const bodyContent = compiledInner(data);
        return compiledBase({ ...data, body: bodyContent });
      };

      templateCache[templateName] = compositeTemplate;
      return compositeTemplate;
    } catch (error) {
      console.error(`[EmailService] Error loading template ${templateName}:`, error);
      throw new Error(`Template ${templateName} not found or invalid`);
    }
  }

  async sendTemplate(to, subject, templateName, data) {
    if (!env.EMAIL_ENABLED) {
      console.info(`[EmailService] Email disabled. Skipping email to ${to} (${subject})`);
      return;
    }

    try {
      // Add common data
      const templateData = {
        ...data,
        subject,
        currentYear: new Date().getFullYear(),
        platformUrl: env.FRONTEND_URL,
      };

      const template = this._getCompiledTemplate(templateName);
      const html = template(templateData);

      await this._sendWithRetry({ to, subject, html });
    } catch (error) {
      console.error(`[EmailService] Failed to send template ${templateName} to ${to}:`, error);
      throw error;
    }
  }

  async _sendWithRetry(options, attempt = 1) {
    const maxRetries = env.EMAIL_RETRY_COUNT;
    try {
      // Implementing timeout
      const sendPromise = this.provider.sendEmail(options);
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Email provider timeout')), env.EMAIL_TIMEOUT)
      );
      
      await Promise.race([sendPromise, timeoutPromise]);
      console.info(`[EmailService] Successfully sent email to ${options.to}`);
    } catch (error) {
      if (attempt < maxRetries) {
        console.warn(`[EmailService] Retry ${attempt}/${maxRetries} failed for ${options.to}. Retrying in 1s...`);
        await new Promise(res => setTimeout(res, 1000));
        return this._sendWithRetry(options, attempt + 1);
      } else {
        throw new Error(`Email sending failed after ${maxRetries} attempts. Last error: ${error.message}`);
      }
    }
  }
}

module.exports = new EmailService();
