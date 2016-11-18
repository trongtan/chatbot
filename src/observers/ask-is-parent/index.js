import Promise from 'promise';

import services from 'services';
import AnalyzeListener from 'observers/base/analyze-listener';
import { User } from 'models';
import { payloadConstants, parentalConstants } from 'utils/constants';
import { isSynonymTextInArray } from 'utils/helpers';
import { logger } from 'logs/winston-logger';

const isDadResponse = ['bo', 'ba', 'cha'];
const isMomResponse = ['me', 'ma'];
const isNotParentResponse = ['chua co con', 'khong co con', 'khong co'];

export default class AskIsParentListener extends AnalyzeListener {
  _analyze(messageEvent) {
    logger.info('[Ask is parent] Analyze (%j)', messageEvent);
    const isValidSender = messageEvent && messageEvent.sender && messageEvent.sender.id;
    const isValidText = messageEvent && messageEvent.message && messageEvent.message.text;
    const isValidPayload = messageEvent && messageEvent.message && messageEvent.message.quick_reply
      && messageEvent.message.quick_reply.payload;

    if (isValidSender) {
      const userId = messageEvent.sender.id;

      if (isValidPayload) {
        const payload = messageEvent.message.quick_reply.payload;

        if ([payloadConstants.IS_DAD_PAYLOAD, payloadConstants.IS_MOM_PAYLOAD, payloadConstants.NO_CHILDREN_PAYLOAD]
            .includes(payload)) {
          return Promise.resolve({ shouldHandle: true, userId: userId, parental: payload })
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

  _handle(messageEvent, dataAnalysis) {
    logger.info('[Ask is parent] Handle (%j, %j)', messageEvent, dataAnalysis);
    const { shouldHandle, userId, parental } = dataAnalysis;

    if (shouldHandle) {
      return this._buildResponseMessage(userId, parental).then((message) => {
        logger.log('info', '[Ask is parent]Write response message %j to recipient %j', message, userId);

        return User.updateCurrentPayload(userId, payloadConstants.ASK_PARENT_PAYLOAD).then(() => {
          return services.sendTextMessage(userId, message);
        });
      });
    }

    return Promise.resolve(`Ask-is-parent skip message ${JSON.stringify(messageEvent)}`);
  }

  _buildResponseMessage(userId, parental) {
    logger.info('[Ask is parent] Build Response message (%s, %s)', userId, parental);
    return User.findById(userId).then(user => {
      if (user) {
        const parentalStatus = this._getParentalStatus(parental);
        const message = `Ukie, xin chào ${parentalStatus} ${user.firstName} ${user.lastName}. Bé của bạn tên gì nè!`;
        logger.info('[Ask is parent] Message built', message);
        return Promise.resolve(message);
      }

      logger.info('[Ask is parent] Cannot build response message');
      return Promise.resolve('');
    });
  }

  _validateMessageAndCurrentPayload(text, userId) {
    logger.info('[Ask is parent] Validate message and current payload (%s, %s)', text, userId);
    return User.findById(userId).then(user => {
      logger.info('[Ask is parent] Response to user %s', JSON.stringify(user));
      if (user && user.currentPayload) {
        const currentPayload = user.currentPayload;

        if (currentPayload === payloadConstants.READY_TO_CHAT_PAYLOAD) {
          const parental = this._getParentalFromMessage(text);

          if (parental) {
            return Promise.resolve({ shouldHandle: true, userId: userId, parental: parental });
          }
        }
      }

      return Promise.resolve({ shouldHandle: false });
    });
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
