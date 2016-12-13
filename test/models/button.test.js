import { expect } from 'chai';

import { Button } from 'models';

describe('class methods', () => {
  context('#findButtonsByGroup', () => {
    it('returns all buttons belong to the given group', (done) => {
      Button.findButtonsByGroup('GET_STARTED_PAYLOAD').then(result => {
        expect(result.length).to.equal(2);
        expect(result[0]).to.containSubset({ title: 'Xin chào' });
        expect(result[1]).to.containSubset({ title: 'Hướng dẫn' });
        done();
      });
    });

    it('returns null if the given group does not have any button', (done) => {
      Button.findButtonsByGroup('NON_BUTTON_GROUP').then(result => {
        expect(result).to.be.null;
        done();
      });
    });
  });
});
