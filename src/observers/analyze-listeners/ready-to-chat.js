import Promise from 'promise';

import AnalyzeListener from 'observers/base/analyze-listener';
import { payloadConstants } from 'utils/constants';
import { isSynonymTextInArray } from 'utils/helpers';

const readyToChatResponse = ['co', 'san sang', 'yes'];
const notReadyToChatResponse = ['khong', 'ko', 'no'];

export default class ReadyToChatListener extends AnalyzeListener {

  constructor() {
    super();
    this.tag = '[Ready To Chat]';
  }

  _isIntentPayload(payload) {
    return [payloadConstants.READY_TO_CHAT_PAYLOAD, payloadConstants.NOT_READY_TO_CHAT_PAYLOAD].includes(payload);
  }

  _validateMessageAndUserState(text, user) {
    const { userId, currentPayload } = user;

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

    return Promise.resolve({ shouldHandle: false });
  }

  _execute(dataAnalysis) {
    const { userId, payload } = dataAnalysis;
    return this._sendResponseMessage(userId, payload);
  }
};
