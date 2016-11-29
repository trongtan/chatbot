import { expect } from 'chai';
import { beforeEach } from 'mocha';

import AskUnsupportedPayloadsListener from 'observers/validate-listeners/ask-unsupported-payloads';

describe('ask unsupported payloads observer', () => {
  let askUnsupportedPayloadsListener;

  beforeEach(() => {
    askUnsupportedPayloadsListener = new AskUnsupportedPayloadsListener();
  });

  context('#constructor', () => {
    it('initializes successfully', () => {
      expect(askUnsupportedPayloadsListener.tag).to.be.equal('[Ask Unsupported Payloads]');
      expect(askUnsupportedPayloadsListener.intentionalPayload).to.be.equal('UNSUPPORTED_PAYLOAD');
    });
  });
});
