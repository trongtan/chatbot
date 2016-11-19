import Promise from 'promise';

import AnalyzeListener from 'observers/base/analyze-listener';
import messages from 'messages';
import { User } from 'models';
import { payloadConstants } from 'utils/constants';
import { isSynonymTextInArray } from 'utils/helpers';
import { logger } from 'logs/winston-logger';
import { getRandomObjectFromArray } from 'utils/helpers';

const isDadResponse = ['bo', 'ba', 'cha'];
const isMomResponse = ['me', 'ma'];
const isNotParentResponse = ['chua co con', 'khong co con', 'khong co'];

export default class AskIsParentListener extends AnalyzeListener {

  constructor() {
    super();
    this.tag = '[Ask is parent]';
  }

  _isIntentPayload(payload) {
    return [payloadConstants.IS_DAD_PAYLOAD, payloadConstants.IS_MOM_PAYLOAD, payloadConstants.NO_CHILDREN_PAYLOAD]
      .includes(payload)
  }

  _validateMessageAndUserState(text, user) {
    const { userId, currentPayload } = user;
    if (currentPayload === payloadConstants.READY_TO_CHAT_PAYLOAD) {
      const parentalPayload = this._getParentalPayload(text);

      if (parentalPayload) {
        return Promise.resolve({ shouldHandle: true, userId: userId, payload: parentalPayload });
      }
    }

    return Promise.resolve({ shouldHandle: false });
  }

  _getParentalPayload(text) {
    if (isSynonymTextInArray(text, isDadResponse)) return payloadConstants.IS_DAD_PAYLOAD;
    if (isSynonymTextInArray(text, isMomResponse)) return payloadConstants.IS_MOM_PAYLOAD;
    if (isSynonymTextInArray(text, isNotParentResponse)) return payloadConstants.NO_CHILDREN_PAYLOAD;
    return null;
  }

  _execute(dataAnalysis) {
    const { userId, payload } = dataAnalysis;

    return this._sendResponseMessage(userId, payload).then(() => {
      return User.updateParental(userId, this._getParental(payload));
    });
  }

  _buildResponseMessage(userId, parental) {
    logger.info('%s Build Response message (%s, %s)', this.tag, userId, parental);
    const templateMessage = getRandomObjectFromArray(messages[parental]);

    return User.findById(userId).then(user => {
      if (user) {
        const parentalStatus = this._getParentalText(parental);
        const message = {
          text: templateMessage.text
          .replace(/\{\{parentalStatus}}/g, parentalStatus)
          .replace(/\{\{userName}}/g, `${user.firstName} ${user.lastName}`)
        };
        logger.info('%s Message built', message);
        return Promise.resolve(message);
      }

      logger.info('%s Cannot build response message', this.tag);
      return Promise.resolve(`${this.tag}Cannot build response message`);
    });
  }

  _getParentalText(payload) {
    if (payload === payloadConstants.IS_DAD_PAYLOAD) return 'Bố';
    if (payload === payloadConstants.IS_MOM_PAYLOAD) return 'Mẹ';
    return 'bạn';
  }

  _getParental(payload) {
    if (payload === payloadConstants.IS_DAD_PAYLOAD) return 'DAD';
    if (payload === payloadConstants.IS_MOM_PAYLOAD) return 'MOM';
    return 'NA';
  }
};
