import { expect } from 'chai';

import { Diseases } from 'models';

describe('Diseases', () => {
  context('#findAllByPostbackValue', () => {
    it('returns all disease associated with post back value', (done) => {
      Diseases.findAllByPostbackValue('REQUEST_INFORMATION_PAYLOAD', 'DISEASE_COLDS_PAYLOAD').then(diseases => {
        expect(diseases.length).to.be.equal(1);
        expect(diseases[0].title).to.be.equal('thong tin cam cum');
        expect(diseases[0].Articles.length).to.be.equal(2);
        expect(diseases[0].Articles[0].title).to.be.equal('Những điều cần biết khi chăm sóc trẻ bị bệnh hô hấp');
        expect(diseases[0].Articles[0].imageURL).to.be.equal('http://img.webtretho.com/imageURLs/lifepedia/1.jpg');
        done();
      });
    });
  });
});
