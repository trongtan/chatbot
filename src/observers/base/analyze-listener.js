import Promise from 'promise';

import BaseListener from './base-listener';
import { logger } from 'logs/winston-logger';
import { User } from 'models';

export default class AnalyzeListener extends BaseListener {
  perform(messageEvent) {
    this._analyze(messageEvent).then(dataAnalysis => {
      this._handle(messageEvent, dataAnalysis).catch(exception => {
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

    if (isValidSender) {
      const userId = messageEvent.sender.id;

      if (isValidPayload) {
        const payload = messageEvent.message.quick_reply.payload;

        if (this._isIntentPayload(payload)) {
          return Promise.resolve({ shouldHandle: true, userId: userId, payload: payload });
        }
      } else if (isValidText) {
        const text = messageEvent.message.text;
        if (text) {
          return this._validate(text, userId);
        }
      }
    }

    return Promise.resolve({ shouldHandle: false });
  }

  _isIntentPayload(payload) {
    return false;
  }

  _validate(text, userId) {
    logger.info('%sValidate message and current payload', this.tag, text, userId);

    return User.findOrCreateById(userId).then(user => {
      logger.info('%sValidate on user', this.tag, JSON.stringify(user));
      if (user && user.currentPayload) {
        return this._validateMessageAndCurrentPayload(text, userId, user.currentPayload);
      }

      return Promise.resolve({ shouldHandle: false });
    });
  }

  _validateMessageAndCurrentPayload(text, userId, currentPayload) {
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
