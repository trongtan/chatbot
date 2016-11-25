import ValidateListener from 'observers/base/validate-listener';
import { Keyword } from 'models';
import { payloadConstants, keywordGroupConstants } from 'utils/constants';

export default class GreetingListener extends ValidateListener {
  constructor() {
    super();
    this.tag = '[Greeting]';
    this.intentionalPostbackPayload = payloadConstants.GREETING_PAYLOAD;
  }

  _getIntentionalKeywords() {
    return Keyword.findKeyWordsByGroup(keywordGroupConstants.GREETING);
  }
}
