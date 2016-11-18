import Promise from 'promise';

import AnalyzeListener from './analyze-listener';
import { User } from 'models';
import { logger } from 'logs/winston-logger';

export default class AnalyzeQuickReplyAndCurrentPayloadListener extends AnalyzeListener {
  constructor() {
    super();
    this.tag = '';
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

  _validate(text, userId) {
    logger.info('%sValidate message and current payload', this.tag, text, userId);

    return User.findById(userId).then(user => {
      logger.info('%sValidate on user', this.tag, JSON.stringify(user));
      if (user && user.currentPayload) {
        return this._validateMessageAndCurrentPayload(text, userId, user.currentPayload);
      }

      return Promise.resolve({ shouldHandle: false });
    });
  }

  _handle(messageEvent, dataAnalysis) {
    logger.info('%s Handle (%s, %s)', this.tag, JSON.stringify(messageEvent), dataAnalysis);

    const { shouldHandle, userId, payload } = dataAnalysis;

    if (shouldHandle) {
      return this._execute(userId, payload);
    }

    return Promise.resolve(`${this.tag} skip message ${JSON.stringify(messageEvent)}`);
  }

  _execute(userId, payload) {
    return Promise.resolve('Do nothing');
  }

  _isIntentPayload(payload) {
    return payload !== '';
  }

  _validateMessageAndCurrentPayload(text, userId, currentPayload) {
    return Promise.resolve({ shouldHandle: false });
  }
}
