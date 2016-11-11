import { logger } from 'logs/winston-logger';
import { isGetStarted } from './is-get-started';
import { isGreeting } from './is-greeting';
import { GET_STARTED_PAYLOAD, GREETING_PAYLOAD } from 'utils/constants';

export default class ClassifyCenter {
  constructor(transporter) {
    this.transporter = transporter;
  }

  receivedMessage (messagingEvent) {
    let responseMessage = { senderId: messagingEvent.sender.id };

    if (isGetStarted(messagingEvent)) {
      logger.log('info', '[Received] Get started - %j', messagingEvent);
      responseMessage.payload = GET_STARTED_PAYLOAD;
    } else if (isGreeting(messagingEvent)) {
      logger.log('info', '[Received] Greeting - %j', messagingEvent);
      responseMessage.payload = GREETING_PAYLOAD;
    } else {
      logger.log('info', '[Received] Unknown - %j', messagingEvent);
    }

    this.transporter.handle(responseMessage);
  }
}
