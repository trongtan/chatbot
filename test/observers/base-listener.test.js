import Promise from 'promise';
import { expect } from 'chai';
import sinon from 'sinon';
import { beforeEach, afterEach } from 'mocha';

import services from 'services';
import BaseListener from 'observers/base/base-listener';

describe('base listener', () => {
  let baseListener;
  let metaData = { user: { userId: '1' }, payload: 'GET_STARTED_PAYLOAD' };

  beforeEach(() => {
    baseListener = new BaseListener();
  });

  context('sendResponseMessage', () => {
    it('does nothing if buildResponseMessage rejects', (done) => {
      sinon.stub(baseListener, '_buildResponseMessage', () => Promise.reject('Error'));

      baseListener._sendResponseMessage({ payload: 'GET_STARTED_PAYLOAD' }).then(null, error => {
        expect(error).to.include('Cannot send message');
        done();
      });
    });

    it('does nothing if buildResponseMessage returns empty message', (done) => {
      sinon.stub(baseListener, '_buildResponseMessage', () => Promise.resolve(''));

      baseListener._sendResponseMessage(metaData).then(null, error => {
        expect(error).to.include('Intentionally send no message');
        done();
      });
    });

    context('buildResponseMessage returns OK', () => {
      let sendTextWithQuickReplyMessageSpy;
      let sendTextWithButtonsSpy;
      let sendCarouselMessageSpy;
      let sendTextMessageSpy;

      beforeEach(() => {
        sendTextWithQuickReplyMessageSpy = sinon.stub(services, 'sendTextWithQuickReplyMessage', () => Promise.resolve('Success'));
        sendTextWithButtonsSpy = sinon.stub(services, 'sendTextWithButtons', () => Promise.resolve('Success'));
        sendCarouselMessageSpy = sinon.stub(services, 'sendCarouselMessage', () => Promise.resolve('Success'));
        sendTextMessageSpy = sinon.stub(services, 'sendTextMessage', () => Promise.resolve('Success'));
      });

      afterEach(() => {
        services.sendTextWithQuickReplyMessage.restore();
        services.sendTextWithButtons.restore();
        services.sendCarouselMessage.restore();
        services.sendTextMessage.restore();
      });

      it('sends message with quick reply buttons', (done) => {
        sinon.stub(baseListener, '_buildResponseMessage', () => Promise.resolve({ text: 'text', replyOptions: [] }));

        expect(baseListener._sendResponseMessage(metaData).then(() => {
          expect(sendTextWithQuickReplyMessageSpy.called).to.be.true;
          expect(sendTextWithButtonsSpy.called).to.be.false;
          expect(sendCarouselMessageSpy.called).to.be.false;
          expect(sendTextMessageSpy.called).to.be.false;
          done();
        }));
      });

      it('sends message with buttons', (done) => {
        sinon.stub(baseListener, '_buildResponseMessage', () => Promise.resolve({ text: 'text', buttons: [] }));

        expect(baseListener._sendResponseMessage(metaData).then(() => {
          expect(sendTextWithQuickReplyMessageSpy.called).to.be.false;
          expect(sendTextWithButtonsSpy.called).to.be.true;
          expect(sendCarouselMessageSpy.called).to.be.false;
          expect(sendTextMessageSpy.called).to.be.false;
          done();
        }));
      });

      it('sends carousel message', (done) => {
        sinon.stub(baseListener, '_buildResponseMessage', () => Promise.resolve({ text: 'text', elements: [] }));

        expect(baseListener._sendResponseMessage(metaData).then(() => {
          expect(sendTextWithQuickReplyMessageSpy.called).to.be.false;
          expect(sendTextWithButtonsSpy.called).to.be.false;
          expect(sendCarouselMessageSpy.called).to.be.true;
          expect(sendTextMessageSpy.called).to.be.false;
          done();
        }));
      });

      it('sends standard message', (done) => {
        sinon.stub(baseListener, '_buildResponseMessage', () => Promise.resolve({ text: 'text' }));

        expect(baseListener._sendResponseMessage(metaData).then(() => {
          expect(sendTextWithQuickReplyMessageSpy.called).to.be.false;
          expect(sendTextWithButtonsSpy.called).to.be.false;
          expect(sendCarouselMessageSpy.called).to.be.false;
          expect(sendTextMessageSpy.called).to.be.true;
          done();
        }));
      });
    });
  });

  context('buildResponseMessage', () => {
    it('rejects if user is null', (done) => {
      baseListener._buildResponseMessage({ payload: 'payload' }).then(null, error => {
        expect(error).to.include('Cannot build response message');
        done();
      });
    });

    it('resolves', (done) => {
      baseListener._buildResponseMessage(metaData).then(res => {
        expect(res.text).to.exist;
        done();
      });
    });
  });
});
