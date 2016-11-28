import ValidateListener from 'observers/base/validate-listener';
import { payloadConstants } from 'utils/constants';

export default class AskUnsupportedPayloadsListener extends ValidateListener {
  constructor() {
    super();
    this.tag = '[Ask Unsupported Payloads]';
    this.intentionalPayload = payloadConstants.UNSUPPORTED_PAYLOAD;
  }
}
