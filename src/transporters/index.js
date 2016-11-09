import {logger} from 'logs/winston-logger';
import {isGetStartedResponse} from './get-started-transporter';

export default class TransporterCenter {
  handle(responseMessage) {
    if (isGetStartedResponse(responseMessage)) {
      logger.log('info', 'Write response message for %j', responseMessage);
    }
  }
};
