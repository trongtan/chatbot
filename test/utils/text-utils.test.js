import { expect } from 'chai';

import { payloadConstants } from 'utils/constants';
import { replaceVietnameseCharacters, getParentalName } from 'utils/text-utils';

describe('TextUtils', () => {
  context('#replaceVietnameseCharacters', () => {
    it('Remove the Vietnamese signs', () => {
      let text = 'á, è, đ';
      expect(replaceVietnameseCharacters(text)).to.be.equal('a, e, d');
    });
  });

  context('#getParentalName', () => {
    it('Return the parental name', () => {
      expect(getParentalName(payloadConstants.IS_DAD_PAYLOAD)).to.be.equal('Bố');
      expect(getParentalName(payloadConstants.IS_MOM_PAYLOAD)).to.be.equal('Mẹ');
      expect(getParentalName('')).to.be.equal('bạn');
    });
  });
});
