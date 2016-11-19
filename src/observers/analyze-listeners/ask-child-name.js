import Promise from 'promise';

import AnalyzeListener from 'observers/base/analyze-listener';
import messages from 'messages';
import { User } from 'models';
import { payloadConstants } from 'utils/constants';
import { logger } from 'logs/winston-logger';
import { getRandomObjectFromArray } from 'utils/helpers';
import { getParentalName } from 'utils/text-utils';

export default class AskChildNameListener extends AnalyzeListener {
  constructor() {
    super();
    this.tag = '[Ask Child Name]';
  }

  _validateMessageAndUserState(text, user) {
    logger.info('%s Validate Message And User State (%s, %s, %s)', this.tag, text, JSON.stringify(user));

    const { currentPayload } = user;
    if ([payloadConstants.IS_DAD_PAYLOAD, payloadConstants.IS_MOM_PAYLOAD].includes(currentPayload)) {
      return Promise.resolve({ shouldHandle: true, user: user, childName: text });
    }

    return Promise.resolve({ shouldHandle: false });
  }

  _execute(dataAnalysis) {
    const { user, childName } = dataAnalysis;
    const { userId } = user;

    return this._sendResponseMessage(dataAnalysis).then(() => {
      return User.updateChildName(userId, childName);
    });
  }

  _buildResponseMessage(dataAnalysis) {
    logger.info('%s Build Response message (%s)', this.tag, JSON.stringify(dataAnalysis));

    const { user, childName } = dataAnalysis;
    const templateMessage = getRandomObjectFromArray(messages[payloadConstants.ASK_CHILD_NAME_PAYLOAD]);

    if (user) {
      const { parental, firstName, lastName } = user;
      const parentalStatus = this._getParentalName(parental);
      const message = {
        text: templateMessage.text
          .replace(/\{\{parentalStatus}}/g, parentalStatus)
          .replace(/\{\{userName}}/g, `${firstName} ${lastName}`)
          .replace(/\{\{childName}}/g, `${childName}`)
      };
      logger.info('%s Message built %s', this.tag, JSON.stringify(message));
      return Promise.resolve(message);
    }

    logger.info('%s Cannot build response message', this.tag);
    return Promise.resolve(`${this.tag}Cannot build response message`);
  }

  _getParentalName(parental) {
    const parentalMap = {
      'DAD': 'Bố',
      'MOM': 'Mẹ',
      'NA': 'bạn'
    };
    return parentalMap[parental];
  }
};
