import { expect } from 'chai';

import { Type } from 'models';

describe('class methods', () => {
  context('#findTypeIdByValue', () => {
    it('returns typeId of value', (done) => {
      Type.findTypeIdByValue('thong tin').then(result => {
        expect(result).to.be.equal('1');
        done();
      });
    });

    it('returns nil if value not exist', (done) => {
      Type.findTypeIdByValue('not exist value').then(result => {
        expect(result).to.be.empty;
        done();
      });
    });
  });
});
