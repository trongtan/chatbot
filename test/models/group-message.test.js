import { expect } from 'chai';

import { GroupMessage } from 'models';

describe('class methods', () => {
  context('#findMesageByGroupName', () => {
    it('returns all messages belong to the given group', (done) => {
      GroupMessage.findMesageByGroupName('GET_STARTED_PAYLOAD').then(result => {
        expect(result.length).to.equal(1);

        const groupMessage = result[0];
        expect(groupMessage).to.containSubset({ text: 'Hey! Xin chào {{userName}}. Chào mừng bạn đã tham gia chat cùng Bác sĩ Lifebuoy. Nhiệm vụ của tớ là trả lời các câu hỏi, đồng thời cập nhật những thông tin mới nhất về các loại bệnh hiện nay cho các bạn, kèm theo đó là cảnh báo dịch bệnh nếu có. Rất đơn giản, hãy nhấn vào nút xin chào bên dưới để bắt đầu' });
        expect(groupMessage.Groups.name).to.be.equal('GET_STARTED_PAYLOAD');
        done();
      });
    });

    it('returns empty array if the given group does not have message', (done) => {
      GroupMessage.findMesageByGroupName('NON_MESSAGE_GROUP').then(result => {
        expect(result.length).to.equal(0);
        done();
      });
    });
  });
});
