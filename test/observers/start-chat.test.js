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

  context('#getIntentionalKeywords', () => {
    it('returns list of menu keywords', (done) => {
      startChatListener._getIntentionalKeywords().then((results) => {
        expect(results).to.include('trò chuyện');
        expect(results).to.include('tro chuyen');
        expect(results).to.include('chat');
        done();
      });
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

  context('#getTemplateMessageOfUser', () => {
    let spy;

    beforeEach(() => {
      spy = sinon.stub(startChatListener, '_getTemplateMessage', () => Promise.resolve('Success'));
    });

    it('calls getTemplateMessage with param ASK_HEALTH_PAYLOAD if parental field exists', (done) => {
      startChatListener._getTemplateMessageOfUser({ parental: 'DAD' }).then(() => {
        expect(spy.calledWith('ASK_HEALTH_PAYLOAD')).to.be.true;
        done();
      });
    });

    it('calls getTemplateMessage with param READY_TO_CHAT_PAYLOAD if parental field doesn\'t exist', (done) => {
      startChatListener._getTemplateMessageOfUser({}).then(() => {
        expect(spy.calledWith('READY_TO_CHAT_PAYLOAD')).to.be.true;
        done();
      });
    });
  });
});
