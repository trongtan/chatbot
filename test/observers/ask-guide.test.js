import { expect } from 'chai';
import { beforeEach } from 'mocha';

import AskGuideListener from 'observers/validate-listeners/ask-guide';

describe('ask guide observer', () => {
  let askGuideListener;

  beforeEach(() => {
    askGuideListener = new AskGuideListener();
  });

  context('#constructor', () => {
    it('initializes successfully', () => {
      expect(askGuideListener.tag).to.be.equal('[Ask Guide]');
      expect(askGuideListener.intentionalPostbackPayload).to.be.equal('GUIDE_PAYLOAD');
    });
  });

  context('#getIntentionalKeywords', () => {
    it('returns list of guide keywords', (done) => {
      askGuideListener._getIntentionalKeywords().then((results) => {
        expect(results).to.include('hướng dẫn');
        expect(results).to.include('huong dan');
        done();
      });
    });
  });
});
