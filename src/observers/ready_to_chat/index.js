import Promise from 'promise';

import services from 'services';
import readyMessages from './ready-to-chat-messages';
import notReadyMessages from './not-ready-to-chat-messages';
import AnalyzeListener from 'observers/base/analyze-listener';
import { User } from 'models';
import { payloadConstants } from 'utils/constants';
import { getRandomObjectFromArray } from 'utils/helpers';
import { logger } from 'logs/winston-logger';
import { replaceVietnameseCharacters } from 'utils/text-utils';

const readyToChatResponse = ['co', 'san sang', 'yes'];
const notReadyToChatResponse = ['khong', 'ko', 'no'];

export default class ReadyToChatListener extends AnalyzeListener {
  _analyze(messageEvent) {

    if (messageEvent && messageEvent.sender && messageEvent.sender.id && messageEvent.message
      && messageEvent.message.quick_reply && messageEvent.message.quick_reply.payload) {
      const userId = messageEvent.sender.id;
      const payload = messageEvent.message.quick_reply.payload;

      if ([payloadConstants.READY_TO_CHAT_PAYLOAD, payloadConstants.NOT_READY_TO_CHAT_PAYLOAD]
          .includes(payload)) {
        return Promise.resolve({ shouldHandle: true, userId: userId, payload: payload })
      } else {
        return User.getCurrentPayload(userId).then(user => {
          if (user && user.currentPayload) {
            const currentPayload = user.currentPayload;

            if (currentPayload === payloadConstants.GET_STARTED_PAYLOAD) {
              const text = messageEvent.message.text;

              if (this._isReadyResponse(text)) {
                return Promise.resolve({
                  shouldHandle: true,
                  userId: userId,
                  payload: payloadConstants.READY_TO_CHAT_PAYLOAD
                });
              }

              if (this._isNotReadyResponse(text)) {
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
    }

    return Promise.resolve({ shouldHandle: false });
  }

  _handle(messageEvent, dataAnalysis) {
    const { shouldHandle, userId, payload } = dataAnalysis;

    if (shouldHandle) {
      if (payload === payloadConstants.READY_TO_CHAT_PAYLOAD) {
        const message = this._buildReadyResponseMessage();

        logger.log('info', '[Ready To Chat]Write response message %j to recipient %j', message, userId);
        return services.sendTextWithQuickReplyMessage(userId, message.text, message.replyOptions);
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

  _isReadyResponse(text) {
    const synonymText = replaceVietnameseCharacters(text).toLowerCase();
    for (let readyMessage of readyToChatResponse) {
      if (synonymText.includes(readyMessage)) {
        return true;
      }
    }
    return false;
  }

  _isNotReadyResponse(text) {
    const synonymText = replaceVietnameseCharacters(text).toLowerCase();
    for (let readyMessage of notReadyToChatResponse) {
      if (synonymText.includes(readyMessage)) {
        return true;
      }
    }
    return false;
  }
}
;
