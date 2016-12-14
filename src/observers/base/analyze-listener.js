import Promise from 'promise';

import BaseListener from './base-listener';
import { logger } from 'logs/winston-logger';
import { User } from 'models';

export default class AnalyzeListener extends BaseListener {
  perform(messageEvent) {
    return this._analyze(messageEvent).then(dataAnalysis => {
      return this._handle(messageEvent, dataAnalysis).catch(exception => {
        logger.log('error', 'Get %s on handling %j', exception, messageEvent);
      });
    });
  }

  _analyze(messageEvent) {
    logger.info('%s Analyze (%j)', this.tag, messageEvent);
    const isValidSender = messageEvent && messageEvent.sender && messageEvent.sender.id;
    const isValidText = messageEvent && messageEvent.message && messageEvent.message.text;
    const isValidPayload = messageEvent && messageEvent.message && messageEvent.message.quick_reply
      && messageEvent.message.quick_reply.payload;
    const isValidPayloadButton =  messageEvent && messageEvent.postback && messageEvent.postback.payload;

    if (isValidSender) {
      const userId = messageEvent.sender.id;

      if (isValidPayload) {
        const payload = messageEvent.message.quick_reply.payload;

        if (this._isIntentPayload(payload)) {
          return User.findOrCreateById(userId).then(user => {
            return Promise.resolve({ shouldHandle: true, user: user, payload: payload });
          });
        }
      } else if (isValidText) {
        return this._validate(messageEvent.message.text, userId);
      } else if (isValidPayloadButton) {
        return this._validatePostbackButton(messageEvent, userId);
      }
    }

    return Promise.resolve({ shouldHandle: false });
  }

  _isIntentPayload(payload) {
    return false;
  }

  _validate(text, userId) {
    logger.info('%sValidate message and current payload (%s, %s)', this.tag, text, userId);

    return User.findOrCreateById(userId).then(user => {
      logger.info('%sValidate on user', this.tag, JSON.stringify(user));
      if (user && user.currentPayload) {
        return this._validateMessageAndUserState(text, user);
      }

      return Promise.resolve({ shouldHandle: false });
    }).catch(() => {
      return Promise.resolve({ shouldHandle: false });
    });
  }

  _validateMessageAndUserState(text, user) {
    logger.info('%s Validate Message And User State (%s %s)', this.tag, text, JSON.stringify(user));
    return Promise.resolve({ shouldHandle: false });
  }

  _validatePostbackButton(messageEvent, userId) {
    logger.info('%s Validate Postback button(%s)', this.tag, JSON.stringify(messageEvent));
    return Promise.resolve({ shouldHandle: false });
  }

  _handle(messageEvent, dataAnalysis) {
    logger.info('%s Handle (%s, %s)', this.tag, JSON.stringify(messageEvent), JSON.stringify(dataAnalysis));

    const { shouldHandle } = dataAnalysis;

    if (shouldHandle) {
      return this._execute(dataAnalysis);
    }

    return Promise.resolve(`${this.tag} skip message ${JSON.stringify(messageEvent)}`);
  }

  _execute(dataAnalysis) {
    return Promise.resolve('Do nothing');
  }
}
