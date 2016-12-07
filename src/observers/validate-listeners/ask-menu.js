import ValidateListener from 'observers/base/validate-listener';
import { payloadConstants } from 'utils/constants';
import { Keyword } from 'models';

export default class AskMenuListener extends ValidateListener {
  constructor() {
    super();
    this.tag = '[Ask Menu]';
    this.intentionalPayload = payloadConstants.GET_INFORMATION_PAYLOAD;
  }

  _getIntentionalKeywords() {
    return Keyword.findKeyWordsByGroup(payloadConstants.GET_INFORMATION_PAYLOAD);
  }
}
