import EventEmitter from 'events';
import async from 'async';

import { sortBy } from 'lodash';

import { SHIPPING_MESSAGE_EVENT, FINISHED_SHIPPING_MESSAGE_EVENT } from 'utils/event-constants';

import Utils from 'utils';

import { logger } from 'logs/winston-logger';

export default class MessageShipper extends EventEmitter {
  constructor() {
    super();
    this._listenEvent();
  }

  _listenEvent() {
    this.on(SHIPPING_MESSAGE_EVENT, (messagesStructure) => {
      logger.info('[Message Shipper] [SHIP_MESSAGE_EVENT]: %s', JSON.stringify(messagesStructure));
      const messages = sortBy(messagesStructure, 'order');

      async.eachSeries(messages, (message, callback) => {
        Utils.callSendAPI(message).then(result => {
          callback();
          this.emit(FINISHED_SHIPPING_MESSAGE_EVENT, result);
        });
      });
    });
  }
}
