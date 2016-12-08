import Promise from 'promise';

import AnalyzeListener from 'observers/base/analyze-listener';
import messages from 'messages';
import { User } from 'models';
import { payloadConstants } from 'utils/constants';
import { logger } from 'logs/winston-logger';
import { getRandomObjectFromArray } from 'utils/helpers';
import { getParentalName } from 'utils/text-utils';

export default class AskFavoriteTimeListener extends AnalyzeListener {
  constructor() {
    super();
    this.tag = '[Ask Favorite Time]';
  }

  _validateMessageAndUserState(text, user) {
    logger.info('%s Validate Message And User State (%s, %s)', this.tag, text, JSON.stringify(user));

    const { currentPayload } = user;

    if (text
      && [payloadConstants.ASK_CHILD_NAME_PAYLOAD, payloadConstants.NO_CHILDREN_PAYLOAD].includes(currentPayload)) {
      const hour = text.replace(/^\D+/g, '');
      if (hour > 0 && hour <= 24) {
        return Promise.resolve({ shouldHandle: true, user: user, hour: hour });
      }
    }

    return Promise.resolve({ shouldHandle: false });
  }

  _execute(dataAnalysis) {
    const { user, hour } = dataAnalysis;
    const { userId } = user;
    dataAnalysis['payload'] = payloadConstants.ASK_FAVORITE_TIME_PAYLOAD;

    return this._sendResponseMessage(dataAnalysis).then(() => {
      return User.updateFavoriteTime(userId, hour);
    });
  }
};
