import Promise from 'promise';
import { expect } from 'chai';
import sinon from 'sinon';
import { beforeEach, afterEach } from 'mocha';

import 'preload';
import services from 'services';
import * as serviceUtils from 'utils/service-utils';
import GetStartedListener from 'observers/get_started';
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
    it('does nothing if messageEvent is null', () => {
      let spy = sinon.spy(getStartedListener, '_saveUserProfileToDatabase');
      getStartedListener._handle(null);
      expect(spy.called).to.be.false;
    });

    it('does nothing if messageEvent.sender is null', () => {
      let spy = sinon.spy(getStartedListener, '_saveUserProfileToDatabase');
      getStartedListener._handle({});
      expect(spy.called).to.be.false;
    });

    it('saves user profile to database and send response data', (done) => {
      const saveUserProfileToDatabaseSpy = sinon.stub(getStartedListener, '_saveUserProfileToDatabase',
        () => Promise.resolve('Success'));
      const sendResponseMessageSpy = sinon.stub(getStartedListener, '_sendResponseMessage',
        () => Promise.resolve('Success'));
      sinon.stub(services, 'sendTextMessage', () => Promise.resolve('Success'));

      getStartedListener._handle({ sender: { id: '1' } }).then(() => {
        expect(saveUserProfileToDatabaseSpy.called).to.be.true;
        expect(sendResponseMessageSpy.called).to.be.true;
      }).done(() => {
        services.sendTextMessage.restore();
        done();
      });
    });
  });

  context('#saveUserProfileToDatabase', () => {
    afterEach((done) => {
      User.destroy({ truncate: true }).then(done);
    });

    it('gets data via facebook API and save to database', (done) => {
      const userProfile = {
        first_name: 'test',
        last_name: 'test',
        gender: 'Male'
      };

      sinon.stub(serviceUtils, 'getUserProfile', () => Promise.resolve(userProfile));

      getStartedListener._saveUserProfileToDatabase('1').then(() => {
        User.findAll().then((users) => {
          expect(users.length).to.be.equal(1);
        });
      }).done(() => {
        serviceUtils.getUserProfile.restore();
        done();
      });
    });
  });

  context('#sendResponseMessage', () => {
    it('sends message to user', (done) => {
      sinon.stub(getStartedListener, '_buildResponseMessage', () => 'Response message');
      sinon.stub(services, 'sendTextMessage', () => Promise.resolve('Success'));

      getStartedListener._sendResponseMessage('1').then((result) => {
        expect(result).to.be.equal('Success');
      }).done(() => {
        services.sendTextMessage.restore();
        done();
      });
    });
  });

  context('#buildResponseMessage', () => {
    it('returns no message', () => {
      const responseMessage = getStartedListener._buildResponseMessage();
      expect(responseMessage).to.be.null;
    });
  });
});
