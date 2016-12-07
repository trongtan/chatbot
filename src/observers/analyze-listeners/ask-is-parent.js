import Promise from 'promise';
import co from 'co';

import AnalyzeListener from 'observers/base/analyze-listener';
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
    logger.info('%s Is Intent Payload (%s)', payload);
    return [payloadConstants.IS_DAD_PAYLOAD, payloadConstants.IS_MOM_PAYLOAD, payloadConstants.NO_CHILDREN_PAYLOAD]
      .includes(payload)
  }

  _validateMessageAndUserState(text, user) {
    logger.info('%s Validate Message And User State (%s, %s)', this.tag, text, JSON.stringify(user));
    const { currentPayload } = user;
    if (currentPayload === payloadConstants.READY_TO_CHAT_PAYLOAD) {
      const parentalPayload = this._getParentalPayload(text);

      if (parentalPayload) {
        return Promise.resolve({ shouldHandle: true, user: user, payload: parentalPayload });
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
    logger.info('%s Execute (%s)', this.tag, JSON.stringify(dataAnalysis));
    return this._sendResponseMessage(dataAnalysis).then(() => {
      const { payload } = dataAnalysis;
      const { userId } = dataAnalysis.user;
      return User.updateParental(userId, payload, this._getParental(payload));
    });
  }

  _buildResponseMessage(dataAnalysis) {
    logger.info('%s Build Response Message (%s)', this.tag, JSON.stringify(dataAnalysis));
    const { user } = dataAnalysis;
    const parental = dataAnalysis.payload;
    const self = this;

    return co(function*() {
      if (user) {
        let templateMessage = yield self._getTemplateMessage(parental);

        const parentalStatus = self._getParentalText(parental);
        const message = {
          text: templateMessage.text
            .replace(/\{\{parentalStatus}}/g, parentalStatus)
            .replace(/\{\{userName}}/g, `${user.firstName} ${user.lastName}`)
        };
        logger.info('%s Message built', message);
        return Promise.resolve(message);
      }

      logger.info('%s Cannot build response message', self.tag);
      return Promise.resolve(`${self.tag}Cannot build response message`);
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
