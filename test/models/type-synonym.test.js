import { expect } from 'chai';

import { TypeSynonym } from 'models';

describe('class methods', () => {
  context('#findAllTypeSynonyms', () => {
    it('returns all type synonyms', (done) => {
      TypeSynonym.findAllTypeSynonyms().then(result => {
        expect(result.length).to.be.equal(37);
        expect(result[0].value).to.be.equal('thong tin');
        expect(result[1].value).to.be.equal('thông tin');
        done();
      });
    });
  });
});
