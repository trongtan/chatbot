import { expect } from 'chai';

import { TypeMessage } from 'models';

describe('class methods', () => {
  context('#findMessageByTypeId', () => {
    it('returns all message belong to type', (done) => {
      TypeMessage.findMessageByTypeId('1').then(result => {
        expect(result.length).to.equal(1);
        expect(result[0]).to.containSubset({ text: 'Thong tin benh ne' });
        done();
      });
    });
  });
});
