import EventEmitter from 'events';

import { isTextMessasge, isQuickReplyMessage, isPostbackmessage } from 'utils/message-utils';
import { TRACK_INCOMING_MESSAGE_EVENT, TRACK_OUT_GOING_MESSAGE_EVENT, TRACK_USER_PROFILE_EVENT } from 'utils/event-constants';
import { trackMessage, trackOutgoingMessage, trackUserProfile } from 'utils/bot-analytics';

import { logger } from 'logs/winston-logger';

export default class MessageTracker extends EventEmitter {
  constructor() {
    super();
    this._listenEvent();
  }

  _listenEvent() {
    this.on(TRACK_INCOMING_MESSAGE_EVENT, (messageEvent) => {


      if (isTextMessasge) {
        logger.info('[Message Tracker][Track incoming message]: %s', JSON.stringify(messageEvent));
        trackMessage(messageEvent.message.text, messageEvent.sender.id, messageEvent.timestamp);
      } else if (isPostbackmessage) {
        trackMessage(messageEvent.postback.payload, messageEvent.sender.id, messageEvent.timestamp);
      }
    });

    this.on(TRACK_OUT_GOING_MESSAGE_EVENT, messageStructure => {
      logger.info('[Message Tracker][Track outgoing message]: %s', JSON.stringify(messageStructure));
      trackOutgoingMessage(messageStructure);
    });

    this.on(TRACK_USER_PROFILE_EVENT, user => {
      logger.info('[Message Tracker][Track user profile]: %s', JSON.stringify(user));
      trackUserProfile(user.firstName, user.lastName, user.gender, user.userId);
    });
  }
}
