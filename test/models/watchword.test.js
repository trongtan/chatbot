import { expect } from 'chai';

import { Watchword } from 'models';
describe('Watchword', () => {
  context('#findAllWatchword', () => {
    it('returns all watch words', (done) => {
      Watchword.findAllWatchword().then(watchWords => {
        expect(watchWords.length).to.equal(5);
        expect(watchWords[0].value).to.equal('hey');
        expect(watchWords[0].Postback.value).to.equal('GREETING_PAYLOAD');
        done();
      });
    });
  });
});
