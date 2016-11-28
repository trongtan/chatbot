import co from 'co';

import ValidateListener from 'observers/base/validate-listener';
import messages from 'messages';
import { payloadConstants } from 'utils/constants';
import { logger } from 'logs/winston-logger';

export default class AskVideoIntroductionListener extends ValidateListener {
  constructor() {
    super();
    this.tag = '[Ask Video Introduction]';
    this.intentionalPayload = payloadConstants.ASK_VIDEO_INTRODUCTION;
  }

  _buildResponseMessage(metaData) {
    logger.info('%s Build Response Message (%s)', this.tag, JSON.stringify(metaData));

    const { user, nextStepPayload } = metaData;
    const self = this;

    return co(function*() {
      const templateMessage = yield self._getVideoTemplateMessageOnStep(nextStepPayload);
      return self._buildMessageOnTemplate(templateMessage, user);
    });
  }

  _getVideoTemplateMessageOnStep(stepPayload) {
    const self = this;
    logger.info('%s Get Video Template Message On Step (%s)', self.tag, stepPayload);

    return co(function*() {
      let message;
      const templateMessage = yield self._getTemplateMessage(payloadConstants.ASK_VIDEO_INTRODUCTION);

      if ('ASK_VIDEO_INTRODUCTION_URL' == stepPayload) {
        message = templateMessage[1];
      } else if ('ASK_VIDEO_INTRODUCTION_QUESTION' == stepPayload) {
        message = templateMessage[2];
      } else {
        message = templateMessage[0];
      }

      logger.info('%s Message Template (%s)', self.tag, JSON.stringify(message));
      return message;
    });
  }

  _getTemplateMessage(payload) {
    return Promise.resolve(messages[payload]);
  }
}
