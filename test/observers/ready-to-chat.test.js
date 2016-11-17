import Promise from 'promise';
import sinon from 'sinon';
import { expect } from 'chai';
import { beforeEach } from 'mocha';

import services from 'services';
import ReadyToChatListener from 'observers/ready_to_chat';
import { payloadConstants } from 'utils/constants';

describe('ready to chat observer', () => {
  let readyToChatListener;

  beforeEach(() => {
    readyToChatListener = new ReadyToChatListener();
  });

  context('#analyze', () => {
    context('current payload is not GET_STARTED_PAYLOAD', () => {
      it('returns false if messageEvent is null', (done) => {
        readyToChatListener._analyze(null).then((response) => {
          expect(JSON.stringify(response)).to.be.equal(JSON.stringify({ shouldHandle: false }));
          done();
        });
      });

      it('returns false if messageEvent.message is null', (done) => {
        readyToChatListener._analyze({}).then((response) => {
          expect(JSON.stringify(response)).to.be.equal(JSON.stringify({ shouldHandle: false }));
          done();
        });
      });

      it('returns false if messageEvent.message.quick_reply is null', (done) => {
        readyToChatListener._analyze({ message: {} }).then((response) => {
          expect(JSON.stringify(response)).to.be.equal(JSON.stringify({ shouldHandle: false }));
          done();
        });
      });

      it('returns false if messageEvent.message.quick_reply.payload is null', (done) => {
        readyToChatListener._analyze({ message: { quick_reply: {} } }).then((response) => {
          expect(JSON.stringify(response)).to.be.equal(JSON.stringify({ shouldHandle: false }));
          done();
        });
      });

      it('returns false if messageEvent.message.quick_reply.payload is neither READY_TO_CHAT_PAYLOAD nor NOT_READY_TO_CHAT_PAYLOAD', (done) => {
        readyToChatListener._analyze({ message: { quick_reply: { payload: 'invalid_payload' } } }).then((response) => {
          expect(JSON.stringify(response)).to.be.equal(JSON.stringify({ shouldHandle: false }));
          done();
        });
      });

      it('returns false if message.sender is null', (done) => {
        readyToChatListener._analyze({ message: { quick_reply: { payload: payloadConstants.READY_TO_CHAT_PAYLOAD } } }).then((response) => {
          expect(JSON.stringify(response)).to.be.equal(JSON.stringify({ shouldHandle: false }));
          done();
        });
      });

      it('returns false if message.sender.id is null', (done) => {
        readyToChatListener._analyze({
          message: { quick_reply: { payload: payloadConstants.READY_TO_CHAT_PAYLOAD } },
          sender: {}
        }).then((response) => {
          expect(JSON.stringify(response)).to.be.equal(JSON.stringify({ shouldHandle: false }));
          done();
        });
      });

      it('returns true if messageEvent.message.quick_reply.payload is READY_TO_CHAT_PAYLOAD', (done) => {
        readyToChatListener._analyze({
          message: { quick_reply: { payload: payloadConstants.READY_TO_CHAT_PAYLOAD } },
          sender: { id: '1' }
        }).then((response) => {
          expect(JSON.stringify(response)).to.be.equal(JSON.stringify({
            shouldHandle: true,
            userId: '1',
            payload: payloadConstants.READY_TO_CHAT_PAYLOAD
          }));
          done();
        });
      });

      it('returns true if messageEvent.message.quick_reply.payload is NOT_READY_TO_CHAT_PAYLOAD', (done) => {
        readyToChatListener._analyze({
          message: { quick_reply: { payload: 'NOT_READY_TO_CHAT_PAYLOAD' } },
          sender: { id: '1' }
        }).then((response) => {
          expect(JSON.stringify(response)).to.be.equal(JSON.stringify({
            shouldHandle: true,
            userId: '1',
            payload: 'NOT_READY_TO_CHAT_PAYLOAD'
          }));
          done();
        });
      });
    });
  });

  context('#handle', () => {
    let spy;

    beforeEach(() => {
      spy = sinon.spy(readyToChatListener, '_buildReadyResponseMessage');
    });

    it ('does nothing if shouldHandle is false', (done) => {
      readyToChatListener._handle(null, {
        shouldHandle: false
      }).then(() => {
        expect(spy.called).to.be.false;
        done();
      });
    });

    it ('does nothing if payload is neither READY_TO_CHAT_PAYLOAD nor NOT_READY_TO_CHAT_PAYLOAD', (done) => {
      readyToChatListener._handle(null, {
        shouldHandle: false
      }).then(() => {
        expect(spy.called).to.be.false;
        done();
      });
    });

    it ('send message with quick reply options if payload is READY_TO_CHAT_PAYLOAD', (done) => {
      sinon.stub(services, 'sendTextWithQuickReplyMessage', () => Promise.resolve('Success'));

      readyToChatListener._handle(null, {
        shouldHandle: true,
        payload: payloadConstants.READY_TO_CHAT_PAYLOAD,
        userId: '1'
      }).then((response) => {
        expect(response).to.be.equal('Success');
      }).done(() => {
        services.sendTextWithQuickReplyMessage.restore();
        done();
      });
    });

    it ('send message if payload is NOT_READY_TO_CHAT_PAYLOAD', (done) => {
      sinon.stub(services, 'sendTextMessage', () => Promise.resolve('Success'));

      readyToChatListener._handle(null, {
        shouldHandle: true,
        payload: payloadConstants.NOT_READY_TO_CHAT_PAYLOAD,
        userId: '1'
      }).then((response) => {
        expect(response).to.be.equal('Success');
      }).done(() => {
        services.sendTextMessage.restore();
        done();
      });
    });
  });

  context('#isReadyResponse', () => {
    it('return true if parameter is in readyResponse', () => {
      expect(readyToChatListener._isReadyResponse('co')).to.be.true;
    });

    it('return false if parameter is not in readyResponse', () => {
      expect(readyToChatListener._isReadyResponse('ko')).to.be.false;
    });
  });

  context('#isNotReadyResponse', () => {
    it('return true if parameter is in notReadyResponse', () => {
      expect(readyToChatListener._isNotReadyResponse('khong')).to.be.true;
    });

    it('return false if parameter is not in notReadyResponse', () => {
      expect(readyToChatListener._isNotReadyResponse('co')).to.be.false;
    });
  });
});
