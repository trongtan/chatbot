import { expect } from 'chai';

import { Elements } from 'models';

describe('Elements', () => {
  context('#findAllByPostbackValue', () => {
    it('returns all elements associated with post back value', (done) => {
      Elements.findAllByPostbackValue('MENU_PAYLOAD').then(elements => {
        expect(elements.length).to.be.equal(5);
        expect(elements[0].title).to.be.equal('Thông tin dịch bệnh');
        expect(elements[0].imageURL).to.be.equal('http://img.webtretho.com/images/lifepedia/b1.jpg');
        expect(elements[0].Buttons.length).to.be.equal(1);
        expect(elements[0].Buttons[0].title).to.be.equal('Theo bệnh');
        done();
      });
    });
  });
});
