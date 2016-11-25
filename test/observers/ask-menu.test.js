import { expect } from 'chai';
import { beforeEach } from 'mocha';

import AskMenuListener from 'observers/validate-listeners/ask-menu';

describe('ask menu observer', () => {
  let askMenuListener;

  beforeEach(() => {
    askMenuListener = new AskMenuListener();
  });

  context('#constructor', () => {
    it('initializes successfully', () => {
      expect(askMenuListener.tag).to.be.equal('[Ask Menu]');
      expect(askMenuListener.intentionalPostbackPayload).to.be.equal('GET_INFORMATION_PAYLOAD');
    })
  });

  context('#getIntentionalKeywords', () => {
    it('returns list of menu keywords', (done) => {
      askMenuListener._getIntentionalKeywords().then((results) => {
        expect(results).to.include('tìm hiểu thông tin');
        expect(results).to.include('tim hieu thong tin');
        expect(results).to.include('menu');
        done();
      });
    })
  });
});
