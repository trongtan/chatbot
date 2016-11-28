import ValidateListener from 'observers/base/validate-listener';
import { payloadConstants, keywordGroupConstants } from 'utils/constants';
import { Keyword } from 'models';

export default class AskGuideListener extends ValidateListener {
  constructor() {
    super();
    this.tag = '[Ask Guide]';
    this.intentionalPayload = payloadConstants.GUIDE_PAYLOAD;
  }

  _getIntentionalKeywords() {
    return Keyword.findKeyWordsByGroup(keywordGroupConstants.GUIDE);
  }
}
