import ValidateListener from 'observers/base/validate-listener';
import { FACEBOOK_GET_STARTED_PAYLOAD } from 'utils/constants';
import { payloadConstants } from 'utils/constants';

export default class GetStartedListener extends ValidateListener {
  constructor() {
    super();
    this.tag = '[Get started]';
    this.intentionalPostbackPayload = FACEBOOK_GET_STARTED_PAYLOAD;
    this.messagePayload = payloadConstants.GET_STARTED_PAYLOAD;
  }
}
