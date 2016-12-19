import EventEmitter from 'events';

import { Texts, Elements, ButtonTemplates, Diseases } from 'models';

import { BUILD_MESSAGE_EVENT, ANALYSE_REQUESTING_PAYLOADS } from 'utils/event-constants';
import { map, flatten, includes } from 'lodash';

import { logger } from 'logs/winston-logger';

export default class MessageReferee extends EventEmitter {
  constructor(definitions) {
    super();
    this.defintions = definitions;

    this.on(ANALYSE_REQUESTING_PAYLOADS, (senderId, requestingPayloads) => {
      let messagesReturned = [];
      logger.info('[Message Referee] [ANALYSE_REQUESTING_PAYLOADS]: %s', JSON.stringify(requestingPayloads));
      if (requestingPayloads.length > 1) {
        const userDefinedDefinitions = this.defintions.loadDefinitions(requestingPayloads);

        logger.info('[Message Referee] [ANALYSE_REQUESTING_PAYLOADS][Definitions]: %s %s', JSON.stringify(requestingPayloads), JSON.stringify(userDefinedDefinitions));

        messagesReturned = flatten(map(userDefinedDefinitions, definition => {
          return definition.then.sendMessageWithPayloads;
        }));

        logger.info('[Message Referee] [Payloads Returned]: %s', JSON.stringify(messagesReturned));
        this.emit(BUILD_MESSAGE_EVENT, senderId, messagesReturned);
      } else {
        messagesReturned.push({
          type: 'single',
          payloads: requestingPayloads
        });
        logger.info('[Message Referee] [BUILD_MESSAGE_EVENT]: %s %s', JSON.stringify(requestingPayloads), JSON.stringify(messagesReturned));
        this.emit(BUILD_MESSAGE_EVENT, senderId, messagesReturned);
      }
    });
  }
}
