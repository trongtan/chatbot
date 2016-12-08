import Promise from 'promise';

import AnalyzeListener from 'observers/base/analyze-listener';
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
    logger.info('%s Validate Message And User State (%s, %s)', this.tag, text, JSON.stringify(user));
    return this._isAnsweringChildName(text, user);
  }

  _execute(dataAnalysis) {
    const { user } = dataAnalysis;
    const { userId, childName } = user;
    dataAnalysis['payload'] = payloadConstants.ASK_CHILD_NAME_PAYLOAD;

    return this._sendResponseMessage(dataAnalysis).then(() => {
      return User.updateChildName(userId, childName);
    });
  }

  _isAnsweringChildName(childName, user) {
    const { currentPayload } = user;
    if ([payloadConstants.IS_DAD_PAYLOAD, payloadConstants.IS_MOM_PAYLOAD].includes(currentPayload)) {
      user['childName'] = childName;
      return Promise.resolve({ shouldHandle: true, user: user});
    }

    return Promise.resolve({ shouldHandle: false });
  }
};
