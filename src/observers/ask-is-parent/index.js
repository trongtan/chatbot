import Promise from 'promise';

import services from 'services';
import AnalyzeQuickReplyAndCurrentPayloadListener
  from 'observers/base/analyze-quick-reply-and-current-payload-listener';
import { User } from 'models';
import { payloadConstants, parentalConstants } from 'utils/constants';
import { isSynonymTextInArray } from 'utils/helpers';
import { logger } from 'logs/winston-logger';

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

  _respond(userId, payload) {
    return this._buildResponseMessage(userId, payload).then((message) => {
      logger.log('info', '%sWrite response message %j to recipient %j', this.tag, message, userId);

      return User.updateCurrentPayload(userId, payloadConstants.ASK_PARENT_PAYLOAD).then(() => {
        return services.sendTextMessage(userId, message);
      });
    });
  }

  _buildResponseMessage(userId, parental) {
    logger.info('%s Build Response message (%s, %s)', this.tag, userId, parental);
    return User.findById(userId).then(user => {
      if (user) {
        const parentalStatus = this._getParentalStatus(parental);
        const message = `Ukie, xin chào ${parentalStatus} ${user.firstName} ${user.lastName}. Bé của bạn tên gì nè!`;
        logger.info('%s Message built', message);
        return Promise.resolve(message);
      }

      logger.info('%s Cannot build response message');
      return Promise.resolve('');
    });
  }

  _validateMessageAndCurrentPayload(text, userId, currentPayload) {
    if (currentPayload === payloadConstants.READY_TO_CHAT_PAYLOAD) {
      const parental = this._getParentalFromMessage(text);

      if (parental) {
        return Promise.resolve({ shouldHandle: true, userId: userId, payload: parental });
      }
    }
  }

  _getParentalFromMessage(text) {
    if (isSynonymTextInArray(text, isDadResponse)) return parentalConstants.DAD;
    if (isSynonymTextInArray(text, isMomResponse)) return parentalConstants.MOM;
    if (isSynonymTextInArray(text, isNotParentResponse)) return parentalConstants.NA;
    return null;
  }

  _getParentalStatus(parental) {
    if (parental === parentalConstants.DAD) return 'Bố';
    if (parental === parentalConstants.MOM) return 'Mẹ';
    return 'bạn';
  }
};
