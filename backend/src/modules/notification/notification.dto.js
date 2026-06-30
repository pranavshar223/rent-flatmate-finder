class NotificationDTO {
  constructor({ type, recipient, channel, payload }) {
    this.type = type;
    this.recipient = recipient; // Expected: { id, email, name }
    this.channel = channel; // e.g., 'EMAIL', 'SMS', 'PUSH'
    this.payload = payload;
  }
}

module.exports = NotificationDTO;
