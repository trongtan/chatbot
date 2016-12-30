import EventEmitter from 'events';

import { SHIPPING_MESSAGE_EVENT, FINISHED_SHIPPING_MESSAGE_EVENT } from 'utils/event-constants';

import Utils from 'utils';

import { logger } from 'logs/winston-logger';

export default class MessageShipper extends EventEmitter {
  constructor() {
    super();
    this._listenEvent();
  }

  _listenEvent() {
    this.on(SHIPPING_MESSAGE_EVENT, (messageStructure) => {
      logger.info('[Message Shipper] [SHIP_MESSAGE_EVENT]: %s', JSON.stringify(messageStructure));

      Utils.callSendAPI(messageStructure).then(result => {
        this.emit(FINISHED_SHIPPING_MESSAGE_EVENT, result);
      });
    });
  }
}
