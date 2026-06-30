const MailProvider = require('../../providers/mail.provider');

class NotificationRouter {
  static async route(dto, content) {
    switch (dto.channel) {
      case 'EMAIL':
        return MailProvider.send({
          to: dto.recipient.email,
          subject: content.subject,
          html: content.html,
        });
      case 'SMS':
      case 'PUSH':
      case 'WHATSAPP':
      case 'SLACK':
      case 'DISCORD':
      default:
        console.warn(`[WARNING] Channel ${dto.channel} is not implemented yet.`);
        return false;
    }
  }
}

module.exports = NotificationRouter;
