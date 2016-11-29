import { expect } from 'chai';
import { beforeEach } from 'mocha';

import AskHealthListener from 'observers/validate-listeners/ask-health';

describe('ask menu observer', () => {
  let askHealthListener;

  beforeEach(() => {
    askHealthListener = new AskHealthListener();
  });

  context('#constructor', () => {
    it('initializes successfully', () => {
      expect(askHealthListener.tag).to.be.equal('[Ask Health]');
      expect(askHealthListener.intentionalPayload).to.be.equal('ASK_HEALTH_PAYLOAD');
    });
  });
});
