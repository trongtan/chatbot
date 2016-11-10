import { logger } from 'logs/winston-logger';
import { isGetStarted } from './is-get-started';
import { GET_STARTED_PAYLOAD } from 'utils/constants';

export default class ClassifyCenter {
  constructor(transporter) {
    this.transporter = transporter;
  }

  receivedMessage (messagingEvent) {
    let responseMessage = { senderId: messagingEvent.sender.id };

    if (isGetStarted(messagingEvent)) {
      logger.log('info', '[Received] Get started - %j', messagingEvent);
      responseMessage.payload = GET_STARTED_PAYLOAD;
    } else {
      logger.log('info', '[Received] - Unknown - %j', messagingEvent);
    }

    this.transporter.handle(responseMessage);
  }
}
