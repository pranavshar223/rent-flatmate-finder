/**
 * Email Provider Interface
 * All email providers must implement this contract.
 */
class EmailProviderInterface {
  /**
   * Sends an email
   * @param {Object} options 
   * @param {string} options.to - Recipient email
   * @param {string} options.subject - Email subject
   * @param {string} options.html - Compiled HTML content
   * @returns {Promise<any>} Response from the provider
   */
  async sendEmail({ to, subject, html }) {
    throw new Error('Method sendEmail() must be implemented by concrete provider');
  }
}

module.exports = EmailProviderInterface;
