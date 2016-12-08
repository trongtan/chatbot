import Promise from 'promise';
import sinon from 'sinon';
import chai, { expect } from 'chai';
import { beforeEach } from 'mocha';
import chaiSubset from 'chai-subset';

import AskFavoriteTimeListener from 'observers/analyze-listeners/ask-favorite-time';
import { User } from 'models';

chai.use(chaiSubset);

describe('ask child name observer', () => {
  let askFavoriteTimeListener;

  beforeEach(() => {
    askFavoriteTimeListener = new AskFavoriteTimeListener();
  });

  context('#validateMessageAndUserState', () => {
    it('returns false if current payload is neither ASK_CHILD_NAME_PAYLOAD nor ASK_CHILD_NAME_PAYLOAD', () => {
      askFavoriteTimeListener._validateMessageAndUserState('', { currentPayload: 'payload' })
        .then((response) => {
          expect(response).to.containSubset({ shouldHandle: false });
        });
    });

    it('returns false if current payload is ASK_CHILD_NAME_PAYLOAD but text is invalid', () => {
      askFavoriteTimeListener._validateMessageAndUserState('', { currentPayload: 'ASK_CHILD_NAME_PAYLOAD' })
        .then((response) => {
          expect(response).to.containSubset({ shouldHandle: false });
        });
    });

    it('returns true if current payload is ASK_CHILD_NAME_PAYLOAD and text is valid', () => {
      askFavoriteTimeListener._validateMessageAndUserState('12h', { currentPayload: 'ASK_CHILD_NAME_PAYLOAD' })
        .then((response) => {
          expect(response).to.containSubset({ shouldHandle: false });
        });
    });

    it('returns false if current payload is ASK_CHILD_NAME_PAYLOAD but text is invalid', () => {
      askFavoriteTimeListener._validateMessageAndUserState('', { currentPayload: 'ASK_CHILD_NAME_PAYLOAD' })
        .then((response) => {
          expect(response).to.containSubset({ shouldHandle: false });
        });
    });

    it('returns true if current payload is ASK_CHILD_NAME_PAYLOAD and text is valid', () => {
      askFavoriteTimeListener._validateMessageAndUserState('12h', { currentPayload: 'ASK_CHILD_NAME_PAYLOAD' })
        .then((response) => {
          expect(response).to.containSubset({ shouldHandle: true });
        });
    });
  });

  context('#execute', () => {
    it('sends response to user and update database', (done) => {
      sinon.stub(askFavoriteTimeListener, '_sendResponseMessage', () => Promise.resolve('Success'));
      sinon.stub(User, 'updateFavoriteTime', () => Promise.resolve('Success'));

      askFavoriteTimeListener._execute({ user: { userId: '1' }, hour: 12 }).then((response) => {
        expect(response).to.be.equal('Success');
      }).done(() => {
        User.updateFavoriteTime.restore();
        done();
      });
    });
  });

  context('#buildResponseMessage', () => {
    it('does nothing if user is null', (done) => {
      askFavoriteTimeListener._buildResponseMessage({}).then(null, error => {
        expect(error).to.include('Cannot build response message');
        done();
      });
    });

    it('builds response message includes first name and last name', (done) => {
      askFavoriteTimeListener._buildResponseMessage({
        user: { firstName: 'First', lastName: 'Last', childName: 'Child' },
        payload: 'ASK_FAVORITE_TIME_PAYLOAD'
      }).then(response => {
        expect(response.text).to.contain('First');
        expect(response.text).to.contain('Last');
        done();
      });
    });
  });
});
