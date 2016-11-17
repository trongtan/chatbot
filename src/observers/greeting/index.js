import services from 'services';
import messages from './messages';
import ValidateListener from 'observers/base/validate-listener';
import { logger } from 'logs/winston-logger';
import { replaceVietnameseCharacters } from 'utils/text-utils';
import { getRandomObjectFromArray } from 'utils/helpers';

const keywords = {
  'hi': ['hi'],
  'xin chao': ['xin chao', 'xin chào'],
  'hello': ['hello'],
  'hey': ['hey'],
  'e': ['e', 'ê'],
  'bs oi': ['bs oi', 'bs ơi'],
  'bac si oi': ['bac si oi', 'bác sĩ ơi']
};

export default class GreetingListener extends ValidateListener {
  _shouldHandle(messageEvent) {
    if (!(messageEvent && messageEvent.message && messageEvent.message.text)) {
      return false;
    } else {
      const originText = messageEvent.message.text;
      const synonymText = replaceVietnameseCharacters(originText).toLowerCase();

      return synonymText in keywords && keywords[synonymText].includes(originText);
    }
  }

  _handle(messageEvent) {
    if (messageEvent && messageEvent.sender && messageEvent.sender.id) {
      const recipientId = messageEvent.sender.id;
      const message = this._buildResponseMessage();

      logger.log('info', 'Write response message %j to recipient %j', message, recipientId);
      return services.sendTextWithQuickReplyMessage(recipientId, message.text, message.replyOptions);
    }
  }

  _buildResponseMessage() {
    return getRandomObjectFromArray(messages);
  };
}
