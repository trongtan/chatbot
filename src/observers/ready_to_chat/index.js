import Promise from 'promise';

import services from 'services';
import readyMessages from './ready-to-chat-messages';
import notReadyMessages from './not-ready-to-chat-messages';
import AnalyzeQuickReplyAndCurrentPayloadListener
  from 'observers/base/analyze-quick-reply-and-current-payload-listener';
import { User } from 'models';
import { payloadConstants } from 'utils/constants';
import { getRandomObjectFromArray, isSynonymTextInArray } from 'utils/helpers';
import { logger } from 'logs/winston-logger';

const readyToChatResponse = ['co', 'san sang', 'yes'];
const notReadyToChatResponse = ['khong', 'ko', 'no'];

export default class ReadyToChatListener extends AnalyzeQuickReplyAndCurrentPayloadListener {

  constructor() {
    super();
    this.tag = '[Ready To Chat]';
  }

  _isIntentPayload(payload) {
    return [payloadConstants.READY_TO_CHAT_PAYLOAD, payloadConstants.NOT_READY_TO_CHAT_PAYLOAD].includes(payload);
  }

  _validateMessageAndCurrentPayload(text, userId) {
    logger.info('%sValidate message and current payload', this.tag, text, userId);
    return User.findById(userId).then(user => {
      logger.info('%sValidate on user', this.tag, JSON.stringify(user));
      if (user && user.currentPayload) {
        const currentPayload = user.currentPayload;

        if (currentPayload === payloadConstants.GET_STARTED_PAYLOAD) {
          if (isSynonymTextInArray(text, readyToChatResponse)) {
            return Promise.resolve({
              shouldHandle: true,
              userId: userId,
              payload: payloadConstants.READY_TO_CHAT_PAYLOAD
            });
          }

          if (isSynonymTextInArray(text, notReadyToChatResponse)) {
            return Promise.resolve({
              shouldHandle: true,
              userId: userId,
              payload: payloadConstants.NOT_READY_TO_CHAT_PAYLOAD
            });
          }
        }
      }

      return Promise.resolve({ shouldHandle: false });
    });
  }

  _handle(messageEvent, dataAnalysis) {
    const { shouldHandle, userId, payload } = dataAnalysis;

    if (shouldHandle) {
      if (payload === payloadConstants.READY_TO_CHAT_PAYLOAD) {
        const message = this._buildReadyResponseMessage();

        logger.log('info', '%sWrite response message %j to recipient %j', this.tag, message, userId);
        return User.updateCurrentPayload(userId, payloadConstants.READY_TO_CHAT_PAYLOAD).then(() => {
          return services.sendTextWithQuickReplyMessage(userId, message.text, message.replyOptions);
        });
      } else if (payload === payloadConstants.NOT_READY_TO_CHAT_PAYLOAD) {
        const message = this._buildNotReadyResponseMessage();

        logger.log('info', '%sWrite response message %j to recipient %j', this.tag, message, userId);

        return services.sendTextMessage(userId, message);
      }
    }

    return Promise.resolve(`Ready-to-chat skip message ${JSON.stringify(messageEvent)}`);
  }

  _buildReadyResponseMessage() {
    return getRandomObjectFromArray(readyMessages);
  }

  _buildNotReadyResponseMessage() {
    return getRandomObjectFromArray(notReadyMessages);
  }
};
