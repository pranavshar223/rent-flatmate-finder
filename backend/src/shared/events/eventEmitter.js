const EventEmitter = require('events');

class AppEventEmitter extends EventEmitter {
  emit(event, data = {}) {
    // Standardized event logging
    console.info(`[EVENT] ${event} | Data: ${JSON.stringify(data)}`);
    return super.emit(event, data);
  }
}

const eventEmitter = new AppEventEmitter();

module.exports = eventEmitter;
