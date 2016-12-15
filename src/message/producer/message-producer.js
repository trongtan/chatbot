import EventEmitter from 'events';

import { BUILD_MESSAGE_EVENT } from 'utils/event-constants';

import { logger } from 'logs/winston-logger';

export default class MessageProducer extends EventEmitter {
  constructor() {
    super();
    this.on(BUILD_MESSAGE_EVENT, payloads => {
      this.buildMessageFromPayloads(payloads);
    });
  }

  buildMessageFromPayloads(payloads) {
    logger.info('[Message Producer] [Build Message From Payloads]: %s', JSON.stringify(payloads));
  }
}
