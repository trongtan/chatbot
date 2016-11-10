import { logger } from 'logs/winston-logger';
import { isGetStarted, getGetStartedResponseMessage } from './get_started';

export default class TransporterCenter {
  constructor(services) {
    this.services = services;
  }

  handle(responseMessage) {
    if (isGetStarted(responseMessage)) {
      const recipientId = responseMessage.senderId;
      const message = getGetStartedResponseMessage();
      logger.log('info', 'Write response message %j to recipient %j', message, recipientId);
      this.services.sendTextMessage(recipientId, message);
    }
  }
}
