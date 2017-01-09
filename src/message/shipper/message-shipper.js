import co from 'co';
import async from 'async';
import EventEmitter from 'events';
import { remove } from 'lodash';

import { SHIPPING_MESSAGE_EVENT, FINISHED_SHIPPING_MESSAGE_EVENT } from 'utils/event-constants';

import Utils from 'utils';

import { logger } from 'logs/winston-logger';

export default class MessageShipper extends EventEmitter {
  constructor() {
    super();
    this._listenEvent();
    this.messagesPool = [];
    this.isShipping = false;
  }

  _listenEvent() {
    this.on(SHIPPING_MESSAGE_EVENT, (messageStructure) => {
      logger.info('[Message Shipper] [SHIP_MESSAGE_EVENT]: %s', JSON.stringify(messageStructure));
      this.messagesPool.push(messageStructure);
      // if (!this.isShipping) {

      async.forEach(this.messagesPool, (messageStructure, callback) => {
          this.isShipping = true;


          Utils.callSendAPI(messageStructure).then(result => {
            logger.info('[Message Shipper] [SHIP_MESSAGE_EVENT][result]: %s', JSON.stringify(result));
            if (result) {
              logger.info('[Message Shipper] [SHIP_MESSAGE_EVENT][Before]: %s', JSON.stringify(this.messagesPool.length));
              logger.info('[Message Shipper] [SHIP_MESSAGE_EVENT][Before]: %s', JSON.stringify(this.messagesPool));
              remove(self.messagesPool, removedMessageStructure => {
                return removedMessageStructure === messageStructure
              });
              logger.info('[Message Shipper] [SHIP_MESSAGE_EVENT][After]: %s', JSON.stringify(this.messagesPool.length));
              logger.info('[Message Shipper] [SHIP_MESSAGE_EVENT][After]: %s', JSON.stringify(this.messagesPool));


              if (this.messagesPool.length === 0) {
                this.isShipping = false;
              }
            }
            callback();
          })
        }, (err) => {
          logger.info('[Message Shipper] [SHIP_MESSAGE_EVENT][Error]: %s', JSON.stringify(err));
          this.emit(FINISHED_SHIPPING_MESSAGE_EVENT, err);
        }
      );
    });
  }


}
