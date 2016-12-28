import { expect } from 'chai';

import { Postback } from 'models';

describe.only('Postback', () => {
  context('#findAllByPostbackValue', () => {
    it('returns all postback', (done) => {
      Postback.getAllPostbackFromValues(['REQUEST_INFORMATION_PAYLOAD', 'DISEASE_COLDS_PAYLOAD']).then(result => {
        expect(result.length).to.equal(2);
        const informationPayload = result[0];
        const diseasePayload = result[1];

        expect(informationPayload.Types.priority).to.equal(2);
        expect(diseasePayload.Types.priority).to.equal(3);
        done();
      });
      //
    });
  });
});
