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
      for (let hour = 1; hour <= 24; hour++) {
        if (text.includes(hour)) {
          return Promise.resolve({ shouldHandle: true, user: user, hour: hour });
        }
      }
    }

    return Promise.resolve({ shouldHandle: false });
  }

  _execute(dataAnalysis) {
    const { user, hour } = dataAnalysis;
    const { userId } = user;

    return this._sendResponseMessage(dataAnalysis).then(() => {
      return User.updateFavoriteTime(userId, hour);
    });
  }

  _buildResponseMessage(dataAnalysis) {
    logger.info('%s Build Response message (%s)', this.tag, JSON.stringify(dataAnalysis));

    const { user } = dataAnalysis;
    let templateMessage = getRandomObjectFromArray(messages[payloadConstants.ASK_FAVORITE_TIME_PAYLOAD]);

    if (user) {
      const { firstName, lastName } = user;
      const message = {
        text: templateMessage.text.replace(/\{\{userName}}/g, `${firstName} ${lastName}`),
        replyOptions: templateMessage.replyOptions
      };
      logger.info('%s Message built %s', this.tag, JSON.stringify(message));
      return Promise.resolve(message);
    }

    logger.info('%s Cannot build response message', this.tag);
    return Promise.resolve(`${this.tag}Cannot build response message`);
  }
};
