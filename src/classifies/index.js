import co from 'co';

import { logger } from 'logs/winston-logger';
import { isGetStarted } from './is-get-started';
import { isGreeting } from './is-greeting';
import { analyzeAskingDisease } from './analyze-asking-disease';
import { GET_STARTED_PAYLOAD, GREETING_PAYLOAD, DISEASE_PAYLOAD } from 'utils/constants';

export default class ClassifyCenter {
  constructor(transporter) {
    this.transporter = transporter;
  }

  receivedMessage(messagingEvent) {
    let responseMessage = { senderId: messagingEvent.sender.id };

    if (isGetStarted(messagingEvent)) {
      logger.log('info', '[Received] Get started - %j', messagingEvent);
      responseMessage.payload = GET_STARTED_PAYLOAD;

      this.transporter.handle(responseMessage);
    } else if (isGreeting(messagingEvent)) {
      logger.log('info', '[Received] Greeting - %j', messagingEvent);
      responseMessage.payload = GREETING_PAYLOAD;

      this.transporter.handle(responseMessage);
    } else {
      const self = this;

      co(function*() {
        const askingDiseaseAnalytics = yield analyzeAskingDisease(messagingEvent);
        if (askingDiseaseAnalytics.isAskingDisease) {
          responseMessage.payload = DISEASE_PAYLOAD;
          responseMessage.typeIds = askingDiseaseAnalytics.typeIds;
          responseMessage.diseaseIds = askingDiseaseAnalytics.diseaseIds;

          self.transporter.handle(responseMessage);
        } else {
          logger.log('info', '[Received] Unknown - %j', messagingEvent);
        }
      });
    }
  }
}
