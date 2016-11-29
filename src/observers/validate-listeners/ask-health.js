import ValidateListener from 'observers/base/validate-listener';
import { payloadConstants } from 'utils/constants';

export default class AskHealthListener extends ValidateListener {
  constructor() {
    super();
    this.tag = '[Ask Health]';
    this.intentionalPayload = payloadConstants.ASK_HEALTH_PAYLOAD;
  }
}
