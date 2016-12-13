import { expect } from 'chai';

import { TypeDisease } from 'models';

describe('class methods', () => {
  context('#findTypeIdByValue', () => {
    it('returns typeId of value', (done) => {
      TypeDisease.getArticles('1', '7').then(result => {
        expect(result.length).to.be.equal(8);
        expect(result[0].link).to.be.equal('http://www.webtretho.com/forum/f87/nhung-dieu-can-biet-khi-cham-soc-tre-bi-benh-ho-hap-1362764/');
        expect(result[0].title).to.be.equal('Những điều cần biết khi chăm sóc trẻ bị bệnh hô hấp');
        done();
      });
    });

    it('returns empty array if value not exist', (done) => {
      TypeDisease.getArticles('not exist', 'not exist').then(result => {
        expect(result).to.be.empty;
        done();
      });
    });
  });
});
