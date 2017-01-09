import { expect } from 'chai';

import { RSSes } from 'models';

describe('RSS', () => {
  context('#findAllRSS', () => {
    it('returns all elements associated with post back value', (done) => {
      RSSes.findAllRSS().then(elements => {
        expect(elements.length).to.be.equal(2);
        expect(elements[0].title).to.be.equal('Làm Mẹ');
        expect(elements[1].title).to.be.equal('Làm Đẹp');
        done();
      });
    });
  });
});
