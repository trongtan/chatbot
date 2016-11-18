import Promise from 'promise';

import AnalyzeQuickReplyAndCurrentPayloadListener from 'observers/base/analyze-quick-reply-and-current-payload-listener';
import messages from 'messages';
import { User } from 'models';
import { payloadConstants } from 'utils/constants';
import { isSynonymTextInArray } from 'utils/helpers';
import { logger } from 'logs/winston-logger';
import { getRandomObjectFromArray } from 'utils/helpers';

const isDadResponse = ['bo', 'ba', 'cha'];
const isMomResponse = ['me', 'ma'];
const isNotParentResponse = ['chua co con', 'khong co con', 'khong co'];

export default class AskIsParentListener extends AnalyzeQuickReplyAndCurrentPayloadListener {

  constructor() {
    super();
    this.tag = '[Ask is parent]';
  }

  _isIntentPayload(payload) {
    return [payloadConstants.IS_DAD_PAYLOAD, payloadConstants.IS_MOM_PAYLOAD, payloadConstants.NO_CHILDREN_PAYLOAD]
      .includes(payload)
  }

  _validateMessageAndCurrentPayload(text, userId, currentPayload) {
    if (currentPayload === payloadConstants.READY_TO_CHAT_PAYLOAD) {
      const parentalPayload = this._getParentalPayload(text);

      return Promise.resolve({ shouldHandle: true, userId: userId, payload: parentalPayload });
    }

    return Promise.resolve({ shouldHandle: false });
  }

  _getParentalPayload(text) {
    if (isSynonymTextInArray(text, isDadResponse)) return payloadConstants.IS_DAD_PAYLOAD;
    if (isSynonymTextInArray(text, isMomResponse)) return payloadConstants.IS_MOM_PAYLOAD;
    if (isSynonymTextInArray(text, isNotParentResponse)) return payloadConstants.NO_CHILDREN_PAYLOAD;
    return null;
  }

  _execute(userId, payload) {
    return this._sendResponseMessage(userId, payload);
  }

  _buildResponseMessage(userId, parental) {
    logger.info('%s Build Response message (%s, %s)', this.tag, userId, parental);
    const templateMessage = getRandomObjectFromArray(messages[parental]);

    return User.findById(userId).then(user => {
      if (user) {
        const parentalStatus = this._getParentalStatus(parental);
        const message = templateMessage.text
          .replace(/\{\{parentalStatus}}/g, parentalStatus)
          .replace(/\{\{userName}}/g, `${user.firstName} ${user.lastName}`);
        logger.info('%s Message built', message);
        return Promise.resolve(message);
      }

      logger.info('%s Cannot build response message', this.tag);
      return Promise.resolve(`${this.tag}Cannot build response message`);
    });
  }

  _getParentalStatus(payload) {
    if (payload === payloadConstants.IS_DAD_PAYLOAD) return 'Bố';
    if (payload === payloadConstants.IS_MOM_PAYLOAD) return 'Mẹ';
    return 'bạn';
  }
};
