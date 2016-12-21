import Promise from 'promise';
import sinon from 'sinon';

import { expect } from 'chai';
import { beforeEach } from 'mocha';

import StartChatListener from 'observers/validate-listeners/start-chat';

describe('start chat observer', () => {
  let startChatListener;

  beforeEach(() => {
    startChatListener = new StartChatListener();
  });

  context('#constructor', () => {
    it('initializes successfully', () => {
      expect(startChatListener.tag).to.be.equal('[Start Chat]');
      expect(startChatListener.intentionalPayload).to.be.equal('CHAT_PAYLOAD');
    });
  });

  context('#buildResponseMessage', () => {
    it('calls buildMessageOnTemplate', (done) => {
      sinon.stub(startChatListener, '_getTemplateMessageOfUser', () => Promise.resolve('Success'));
      const spy = sinon.stub(startChatListener, '_buildMessageOnTemplate', () => Promise.resolve('Success'));

      startChatListener._buildResponseMessage({ user: {} }).then(() => {
        expect(spy.called).to.be.true;
        done();
      });
    });
  });
});
