import Promise from 'promise';
import sinon from 'sinon';
import { expect } from 'chai';
import { beforeEach } from 'mocha';

import services from 'services';
import ReadyToChatListener from 'observers/ready_to_chat';
import { payloadConstants } from 'utils/constants';
import { User } from 'models';

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

    context('validate message and current payload', () => {
      it('calls validateMessageAndCurrentPayload method', (done) => {
        sinon.stub(readyToChatListener, '_validateMessageAndCurrentPayload', () => Promise.resolve('Success'));

        readyToChatListener._analyze({
          message: { text: 'co' },
          sender: { id: '1' },
        }).then(response => {
          expect(response).to.be.equal('Success');
          done();
        });
      });

      it('doesn\'t call validateMessageAndCurrentPayload method if text is invalid', (done) => {
        readyToChatListener._analyze({
          message: { text: 'text' },
          sender: { id: '1' },
        }).then(response => {
          expect(JSON.stringify(response)).to.be.equal(JSON.stringify({ shouldHandle: false }));
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

    it('does nothing if shouldHandle is false', (done) => {
      readyToChatListener._handle(null, {
        shouldHandle: false
      }).then(() => {
        expect(spy.called).to.be.false;
        done();
      });
    });

    it('does nothing if payload is neither READY_TO_CHAT_PAYLOAD nor NOT_READY_TO_CHAT_PAYLOAD', (done) => {
      readyToChatListener._handle(null, {
        shouldHandle: false
      }).then(() => {
        expect(spy.called).to.be.false;
        done();
      });
    });

    it('send message with quick reply options if payload is READY_TO_CHAT_PAYLOAD', (done) => {
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

    it('send message if payload is NOT_READY_TO_CHAT_PAYLOAD', (done) => {
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

  context('#validateMessageAndCurrentPayload', () => {
    context('database not ready', () => {
      it('return false', (done) => {
        readyToChatListener._validateMessageAndCurrentPayload('co', '1').then((response) => {
          expect(JSON.stringify(response)).to.be.equal(JSON.stringify({ shouldHandle: false }));
          done();
        });
      });
    });

    context('database ready', () => {
      beforeEach((done) => {
        User.sync({ force: true }).then(function () {
          return User.create({
            userId: '1',
            firstName: 'First',
            lastName: 'Last',
            gender: 'Male',
            currentPayload: payloadConstants.GET_STARTED_PAYLOAD
          });
        }).then(() => {
          done();
        });
      });

      it('returns true if current payload is GET_STARTED_PAYLOAD', (done) => {
        readyToChatListener._validateMessageAndCurrentPayload('co', '1').then((response) => {
          expect(JSON.stringify(response)).to.be.equal(JSON.stringify({
            shouldHandle: true,
            userId: '1',
            payload: payloadConstants.READY_TO_CHAT_PAYLOAD
          }));
          done();
        });
      });

      it('returns true if current payload is GET_STARTED_PAYLOAD', (done) => {
        readyToChatListener._validateMessageAndCurrentPayload('ko', '1').then((response) => {
          expect(JSON.stringify(response)).to.be.equal(JSON.stringify({
            shouldHandle: true,
            userId: '1',
            payload: payloadConstants.NOT_READY_TO_CHAT_PAYLOAD
          }));
          done();
        });
      });
    });
  });
});
