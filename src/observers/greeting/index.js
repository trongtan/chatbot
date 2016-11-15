import services from 'services';
import messages from './messages';
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

export default class GreetingListener {
  handle(messageEvent) {
    if (this._isGreeting(messageEvent)) {
      this._sendResponseMessage(messageEvent);
    }
  }

  _isGreeting(messageEvent) {
    if (!(messageEvent && messageEvent.message && messageEvent.message.text)) {
      return false;
    } else {
      const originText = messageEvent.message.text;
      const synonymText = replaceVietnameseCharacters(originText).toLowerCase();

      return synonymText in keywords && originText.includes(keywords[synonymText]);
    }
  }

  _sendResponseMessage(messageEvent) {
    if (messageEvent && messageEvent.sender.id) {
      const recipientId = messageEvent.sender.id;
      const message = this._buildResponseMessage();

      logger.log('info', 'Write response message %j to recipient %j', message, recipientId);
      services.sendTextMessage(recipientId, message);
    }
  }

  _buildResponseMessage() {
    return getRandomObjectFromArray(messages);
  };
}
