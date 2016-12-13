import { expect } from 'chai';

import { QuickReply } from 'models';

describe('class methods', () => {
  context('#findByGroup', () => {
    it('returns all quick replies belong to the given group', (done) => {
      QuickReply.findByGroup('READY_TO_CHAT_PAYLOAD').then(result => {
        expect(result.length).to.equal(3);
        expect(result[0].title).to.equal('Bố');
        expect(result[1].title).to.equal('Mẹ');
        expect(result[2].title).to.equal('Mình chưa có con');
        done();
      });
    });

    it('returns empty array if the given group does not have any quick reply', (done) => {
      QuickReply.findByGroup('NON_QUICK_REPLY_GROUP').then(result => {
        expect(result).isNil;
        done();
      });
    });
  });
});
