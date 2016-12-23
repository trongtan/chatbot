import { expect } from 'chai';

import { Synonym } from 'models';

describe('Synonym', () => {
  context('#findAllWatchword', () => {
    it('returns all synonyms', (done) => {
      Synonym.findAllWatchwordSynonyms().then(synonyms => {
        expect(synonyms.length).to.equal(1);
        expect(synonyms[0].value).to.equal('heyy');
        expect(synonyms[0].Watchwords.value).to.equal('hey');
        done();
      });
    });
  });
});
