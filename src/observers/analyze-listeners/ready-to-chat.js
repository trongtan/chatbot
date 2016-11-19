import Promise from 'promise';

import AnalyzeListener from 'observers/base/analyze-listener';
import { payloadConstants } from 'utils/constants';
import { isSynonymTextInArray } from 'utils/helpers';
import { logger } from 'logs/winston-logger';

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
    logger.info('%s Validate Message And User State (%s, %s)', this.tag, text, JSON.stringify(user));
    const { currentPayload } = user;

    if (currentPayload === payloadConstants.GET_STARTED_PAYLOAD) {
      let payload;
      if (isSynonymTextInArray(text, readyToChatResponse)) payload = payloadConstants.READY_TO_CHAT_PAYLOAD;
      else if (isSynonymTextInArray(text, notReadyToChatResponse)) payload = payloadConstants.NOT_READY_TO_CHAT_PAYLOAD;

      if (payload) {
        return Promise.resolve({ shouldHandle: true, user: user, payload: payload });
      }
    }

    return Promise.resolve({ shouldHandle: false });
  }

  _execute(dataAnalysis) {
    return this._sendResponseMessage(dataAnalysis);
  }
};
