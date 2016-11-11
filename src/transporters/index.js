import { logger } from 'logs/winston-logger';
import { isGetStarted, handleGetStartedResponseMessage } from './get_started';
import { isGreeting, handleGreetingMessage } from './greeting';
import { isDiseaseResponse, handleDiseaseMessage } from './disease';

export default class TransporterCenter {
  constructor(services) {
    this.services = services;
  }

  handle(responseMessage) {
    if (isGetStarted(responseMessage)) {
      handleGetStartedResponseMessage(responseMessage, this.services);
    } else if (isGreeting(responseMessage)) {
      handleGreetingMessage(responseMessage, this.services);
    } else if (isDiseaseResponse(responseMessage)) {
      handleDiseaseMessage(responseMessage, this.services);
    } else {
      logger.info('Transporter received unsupported response message');
    }
  }
}
