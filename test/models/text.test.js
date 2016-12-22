import { expect } from 'chai';

import { Texts } from 'models';

describe('Texts', () => {
  context('#findAllByPostbackValue', () => {
    it('returns all texts associated with post back value', (done) => {
      Texts.findAllByPostbackValue('GREETING_PAYLOAD').then(texts => {
        expect(texts.length).to.equal(1);
        expect(texts[0].title).to.equal('Greeting');
        expect(texts[0].Messages.length).to.equal(2);
        expect(texts[0].Messages[1].title).to.equal('welcome message 2');
        expect(texts[0].Messages[1].message).to.equal('Xin chào! Tôi là bác sĩ Lifebuoy. Bạn có muốn trò chuyện với chúng tôi hay bạn muốn tìm hiểu thông tin về các dịch bệnh nào?');
        done();
      });
    });
  });
});
