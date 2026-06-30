const NotificationRouter = require('./notification.router');
const { getTemplate } = require('./notification.templates');

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

class NotificationService {
  static async processNotification(dto) {
    const startTime = Date.now();
    let content;

    try {
      content = getTemplate(dto.type, dto.payload);
    } catch (error) {
      console.error(`[NOTIFICATION ERROR] Template generation failed for ${dto.type}`, error);
      return;
    }

    let attempt = 1;
    const maxAttempts = 3;

    while (attempt <= maxAttempts) {
      try {
        const response = await NotificationRouter.route(dto, content);
        console.info(`[NOTIFICATION] Success | Type: ${dto.type} | Channel: ${dto.channel} | To: ${dto.recipient.id} | Attempt: ${attempt} | Latency: ${Date.now() - startTime}ms`);
        return response;
      } catch (error) {
        console.warn(`[NOTIFICATION] Failed Attempt ${attempt}/${maxAttempts} | Type: ${dto.type} | To: ${dto.recipient.id} | Error: ${error.message}`);
        
        if (attempt === maxAttempts) {
          console.error(`[NOTIFICATION FATAL] Final failure for ${dto.type} to ${dto.recipient.id}. Max retries exceeded.`);
          break; // Exit retry loop
        }
        
        // Exponential backoff: 1s, 2s, 4s
        const backoffMs = Math.pow(2, attempt - 1) * 1000;
        await sleep(backoffMs);
        attempt++;
      }
    }
  }
}

module.exports = NotificationService;
