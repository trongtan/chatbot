import Promise from 'promise';
import { expect } from 'chai';
import sinon from 'sinon';
import { beforeEach, afterEach } from 'mocha';

import 'preload';
import services from 'services';
import GetStartedListener from 'observers/validate-listeners/get-started';
import { FACEBOOK_GET_STARTED_PAYLOAD } from 'utils/constants';
import { User } from 'models';

describe('get started observer', () => {
  let getStartedListener;

  beforeEach(() => {
    getStartedListener = new GetStartedListener();
  });

  context('#shouldHandle', () => {
    it('returns false if messageEvent is null', () => {
      expect(getStartedListener._shouldHandle(null)).to.be.false;
    });

    it('returns false if messageEvent.postback is null', () => {
      expect(getStartedListener._shouldHandle({ postback: null })).to.be.false;
    });

    it('returns false if messageEvent.postback.payload is not FACEBOOK_GET_STARTED_PAYLOAD', () => {
      expect(getStartedListener._shouldHandle({ postback: { payload: '' } })).to.be.false;
    });

    it('returns true if messageEvent.postback.payload is FACEBOOK_GET_STARTED_PAYLOAD', () => {
      expect(getStartedListener._shouldHandle({ postback: { payload: FACEBOOK_GET_STARTED_PAYLOAD } })).to.be.true;
    });
  });

  context('#handle', () => {
    let findOrCreateUserSpy;
    beforeEach(() => {
      findOrCreateUserSpy = sinon.stub(User, 'findOrCreateById', () => Promise.resolve('Success'));
    });
    afterEach(() => {
      User.findOrCreateById.restore();
    });
    it('does nothing if messageEvent is null', () => {
      getStartedListener._handle(null);
      expect(findOrCreateUserSpy.called).to.be.false;
    });

    it('does nothing if messageEvent.sender is null', () => {
      getStartedListener._handle({});
      expect(findOrCreateUserSpy.called).to.be.false;
    });

    it('saves user profile to database and send response data', (done) => {
      const spy = sinon.stub(getStartedListener, '_sendResponseMessage',
        () => Promise.resolve('Success'));
      sinon.stub(services, 'sendTextWithQuickReplyMessage', () => Promise.resolve('Success'));

      getStartedListener._handle({ sender: { id: '1' } }).then(() => {
        expect(findOrCreateUserSpy.called).to.be.true;
        expect(spy.called).to.be.true;
      }).done(() => {
        services.sendTextWithQuickReplyMessage.restore();
        done();
      });
    });
  });
});
