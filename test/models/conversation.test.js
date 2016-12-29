import { expect } from 'chai';

import { Conversations } from 'models';

describe.only('Conversations', () => {
  context('#findConversationWithId', () => {
    it('returns all watch words', (done) => {
      Conversations.findConversationDialog('1', '1').then(conversation => {
        console.log(JSON.stringify(conversation));
        done();
      });
    });
  });
});
