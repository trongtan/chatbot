import ValidateListener from 'observers/base/validate-listener';
import { replaceVietnameseCharacters } from 'utils/text-utils';
import { payloadConstants } from 'utils/constants';

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
  constructor() {
    super();
    this.tag = '[Greeting]';
  }

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
      const userId = messageEvent.sender.id;

      return this._sendResponseMessage(userId, payloadConstants.GREETING_PAYLOAD);
    }
  }
}
