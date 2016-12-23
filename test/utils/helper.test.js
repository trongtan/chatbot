import { expect } from 'chai';

import { getRandomObjectFromArray, isSynonymTextInArray } from 'utils/helpers';

describe('Helper', () => {
  context('#getRandomObjectFromArray', () => {
    it('returns a random object from array', () => {
      const array = ['a', 'b', 'c'];
      expect(array.includes(getRandomObjectFromArray(array))).to.be.true;
      expect(getRandomObjectFromArray([])).to.be.null;
    });
  });

  context('#isSynonymTextInArray', () => {
    it('Return the parental name', () => {
      expect(isSynonymTextInArray('ba', ['ba', 'con'])).to.be.true;
      expect(isSynonymTextInArray('ba', [])).to.be.false;
    });
  });
});
