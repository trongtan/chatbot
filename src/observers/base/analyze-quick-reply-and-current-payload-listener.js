import Promise from 'promise';

import AnalyzeListener from './analyze-listener';
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
          return this._validateMessageAndCurrentPayload(text, userId);
        }
      }
    }

    return Promise.resolve({ shouldHandle: false });
  }

  _isIntentPayload(payload) {
    return payload !== '';
  }

  _validateMessageAndCurrentPayload(text, userId) {
  }
}
