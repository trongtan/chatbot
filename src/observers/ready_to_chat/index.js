import Promise from 'promise';

import services from 'services';
import readyMessages from './ready-to-chat-messages';
import notReadyMessages from './not-ready-to-chat-messages';
import AnalyzeListener from 'observers/base/analyze-listener';
import { User } from 'models';
import { payloadConstants } from 'utils/constants';
import { getRandomObjectFromArray, isSynonymTextInArray } from 'utils/helpers';
import { logger } from 'logs/winston-logger';
import { replaceVietnameseCharacters } from 'utils/text-utils';

const readyToChatResponse = ['co', 'san sang', 'yes'];
const notReadyToChatResponse = ['khong', 'ko', 'no'];

export default class ReadyToChatListener extends AnalyzeListener {
  _analyze(messageEvent) {

    const isValidSender = messageEvent && messageEvent.sender && messageEvent.sender.id;
    const isValidMessage = messageEvent && messageEvent.message && messageEvent.message.quick_reply
      && messageEvent.message.quick_reply.payload;

    if (isValidSender && isValidMessage) {
      const userId = messageEvent.sender.id;
      const payload = messageEvent.message.quick_reply.payload;

      if ([payloadConstants.READY_TO_CHAT_PAYLOAD, payloadConstants.NOT_READY_TO_CHAT_PAYLOAD].includes(payload)) {
        return Promise.resolve({ shouldHandle: true, userId: userId, payload: payload })
      } else {
        const text = messageEvent.message.text;
        if (text) {
          return this._validateMessageAndCurrentPayload(text, userId);
        }
      }
    }

    return Promise.resolve({ shouldHandle: false });
  }

  _validateMessageAndCurrentPayload(text, userId) {
    return User.findById(userId).then(user => {
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

        logger.log('info', '[Ready To Chat]Write response message %j to recipient %j', message, userId);
        return User.updateCurrentPayload(userId, payloadConstants.READY_TO_CHAT_PAYLOAD).then(() => {
          return services.sendTextWithQuickReplyMessage(userId, message.text, message.replyOptions);
        });
      } else if (payload === payloadConstants.NOT_READY_TO_CHAT_PAYLOAD) {
        const message = this._buildNotReadyResponseMessage();

        logger.log('info', '[Ready To Chat]Write response message %j to recipient %j', message, userId);

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
