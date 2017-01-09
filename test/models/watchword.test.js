import { expect } from 'chai';

import { Watchword } from 'models';

describe('Watchword', () => {
  context('#findAllWatchword', () => {
    it('returns all watch words', (done) => {
      Watchword.findAllWatchword().then(watchWords => {
        expect(watchWords.length).to.equal(7);
        done();
      });
    });
  });
});
