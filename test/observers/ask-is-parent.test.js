import Promise from 'promise';
import sinon from 'sinon';
import chai, { expect } from 'chai';
import { beforeEach } from 'mocha';
import chaiSubset from 'chai-subset';

import services from 'services';
import AskIsParentListener from 'observers/analyze-listeners/ask-is-parent';
import { payloadConstants } from 'utils/constants';
import { User } from 'models';

chai.use(chaiSubset);

describe('ask is parent observer', () => {
  let askIsParentListener;

  beforeEach(() => {
    askIsParentListener = new AskIsParentListener();
  });

  context('#analyze', () => {
    context('current payload is not READY_TO_CHAT_PAYLOAD', () => {
      it('returns false if messageEvent is null', (done) => {
        askIsParentListener._analyze(null).then((response) => {
          expect(JSON.stringify(response)).to.be.equal(JSON.stringify({ shouldHandle: false }));
          done();
        });
      });

      it('returns false if messageEvent.message is null', (done) => {
        askIsParentListener._analyze({}).then((response) => {
          expect(JSON.stringify(response)).to.be.equal(JSON.stringify({ shouldHandle: false }));
          done();
        });
      });

      it('returns false if messageEvent.message.quick_reply is null', (done) => {
        askIsParentListener._analyze({ message: {} }).then((response) => {
          expect(JSON.stringify(response)).to.be.equal(JSON.stringify({ shouldHandle: false }));
          done();
        });
      });

      it('returns false if messageEvent.message.quick_reply.payload is null', (done) => {
        askIsParentListener._analyze({ message: { quick_reply: {} } }).then((response) => {
          expect(JSON.stringify(response)).to.be.equal(JSON.stringify({ shouldHandle: false }));
          done();
        });
      });

      it('returns false if messageEvent.message.quick_reply.payload is neither IS_DAD_PAYLOAD nor IS_MOM_PAYLOAD nor NO_CHILDREN_PAYLOAD', (done) => {
        askIsParentListener._analyze({ message: { quick_reply: { payload: 'invalid_payload' } } }).then((response) => {
          expect(JSON.stringify(response)).to.be.equal(JSON.stringify({ shouldHandle: false }));
          done();
        });
      });

      it('returns false if message.sender is null', (done) => {
        askIsParentListener._analyze({ message: { quick_reply: { payload: payloadConstants.READY_TO_CHAT_PAYLOAD } } }).then((response) => {
          expect(JSON.stringify(response)).to.be.equal(JSON.stringify({ shouldHandle: false }));
          done();
        });
      });

      it('returns false if message.sender.id is null', (done) => {
        askIsParentListener._analyze({
          message: { quick_reply: { payload: payloadConstants.READY_TO_CHAT_PAYLOAD } },
          sender: {}
        }).then((response) => {
          expect(JSON.stringify(response)).to.be.equal(JSON.stringify({ shouldHandle: false }));
          done();
        });
      });

      context('valid', () => {
        let user = {
          userId: '1',
          currentPayload: payloadConstants.READY_TO_CHAT_PAYLOAD
        };

        beforeEach((done) => {
          User.sync({ force: true }).then(() => {
            User.create(user).then(() => {
              done();
            });
          });
        });

        it('returns true if messageEvent.message.quick_reply.payload is IS_DAD_PAYLOAD', (done) => {
          askIsParentListener._analyze({
            message: { quick_reply: { payload: payloadConstants.IS_DAD_PAYLOAD } },
            sender: { id: '1' }
          }).then((response) => {
            expect(response).to.containSubset({
              shouldHandle: true,
              payload: payloadConstants.IS_DAD_PAYLOAD
            });
            expect(response.user).to.containSubset(user);
            done();
          });
        });

        it('returns true if messageEvent.message.quick_reply.payload is IS_MOM_PAYLOAD', (done) => {
          askIsParentListener._analyze({
            message: { quick_reply: { payload: payloadConstants.IS_MOM_PAYLOAD } },
            sender: { id: '1' }
          }).then((response) => {
            expect(response).to.containSubset({
              shouldHandle: true,
              payload: payloadConstants.IS_MOM_PAYLOAD
            });
            expect(response.user).to.containSubset(user);
            done();
          });
        });

        it('returns true if messageEvent.message.quick_reply.payload is NO_CHILDREN_PAYLOAD', (done) => {
          askIsParentListener._analyze({
            message: { quick_reply: { payload: payloadConstants.NO_CHILDREN_PAYLOAD } },
            sender: { id: '1' }
          }).then((response) => {
            expect(response).to.containSubset({
              shouldHandle: true,
              payload: payloadConstants.NO_CHILDREN_PAYLOAD
            });
            expect(response.user).to.containSubset(user);
            done();
          });
        });
      });
    });

    context('#validate', () => {
      beforeEach((done) => {
        User.sync({ force: true }).then(function () {
          return User.create({
            userId: '1',
            firstName: 'First',
            lastName: 'Last',
            gender: 'Male',
            currentPayload: payloadConstants.READY_TO_CHAT_PAYLOAD
          });
        }).then(() => {
          done();
        });
      });

      it('calls validate method', (done) => {
        sinon.stub(askIsParentListener, '_validate', () => Promise.resolve('Success'));

        askIsParentListener._analyze({
          message: { text: 'bo' },
          sender: { id: '1' },
        }).then(response => {
          expect(response).to.be.equal('Success');
          done();
        });
      });

      it('doesn\'t call _validateMessageAndUserState method if text is invalid', (done) => {

        askIsParentListener._analyze({
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
      spy = sinon.stub(askIsParentListener, '_buildResponseMessage', () => Promise.resolve('Success'));
    });
    it('does nothing if shouldHandle is false', (done) => {
      askIsParentListener._handle(null, {
        shouldHandle: false
      }).then(() => {
        expect(spy.called).to.be.false;
        done();
      });
    });

    it('send message if payload is IS_DAD_PAYLOAD', (done) => {
      sinon.stub(services, 'sendTextMessage', () => Promise.resolve('Success'));
      sinon.stub(User, 'updateParental', () => Promise.resolve('Update database successfully'));

      askIsParentListener._handle(null, {
        shouldHandle: true,
        payload: payloadConstants.IS_DAD_PAYLOAD,
        user: {
          userId: '1',
          firstName: 'First',
          lastName: 'Last'
        }
      }).then((response) => {
        expect(response).to.be.equal('Update database successfully');
      }).done(() => {
        services.sendTextMessage.restore();
        User.updateParental.restore();
        done();
      });
    });
  });

  context('#validate', () => {
    let user;

    beforeEach((done) => {
      user = {
        userId: '1',
        firstName: 'First',
        lastName: 'Last',
        gender: 'Male',
        currentPayload: payloadConstants.READY_TO_CHAT_PAYLOAD
      };

      User.sync({ force: true }).then(function () {
        return User.create(user);
      }).then(() => {
        done();
      });
    });

    it('returns true if current payload is READY_TO_CHAT_PAYLOAD', (done) => {
      askIsParentListener._validate('bo', '1').then((response) => {
        expect(response).to.containSubset({
          shouldHandle: true,
          payload: payloadConstants.IS_DAD_PAYLOAD
        });
        expect(response.user).to.containSubset(user);
        done();
      });
    });

    it('returns true if current payload is READY_TO_CHAT_PAYLOAD', (done) => {
      askIsParentListener._validate('me', '1').then((response) => {
        expect(response).to.containSubset({
          shouldHandle: true,
          payload: payloadConstants.IS_MOM_PAYLOAD
        });
        expect(response.user).to.containSubset(user);
        done();
      });
    });

    it('returns true if current payload is READY_TO_CHAT_PAYLOAD', (done) => {
      askIsParentListener._validate('chua co con', '1').then((response) => {
        expect(response).to.containSubset({
          shouldHandle: true,
          payload: payloadConstants.NO_CHILDREN_PAYLOAD
        });
        expect(response.user).to.containSubset(user);
        done();
      });
    });
  });

  context('#execute', () => {
    let user;
    beforeEach((done) => {
      user = {
        userId: '1',
        firstName: 'First',
        lastName: 'Last',
        gender: 'Male',
        currentPayload: '',
        parental: ''
      };

      User.sync({ force: true }).then(() => {
        User.findOrCreate({
          where: { userId: user.userId },
          defaults: user
        }).then(() => {
          done();
        });
      });
    });

    it('calls send message and update user parental to database', (done) => {
      const spy = sinon.stub(askIsParentListener, '_sendResponseMessage', () => Promise.resolve('Success'));

      askIsParentListener._execute({ user: user, payload: payloadConstants.IS_DAD_PAYLOAD }).then(() => {
        expect(spy.called).to.be.true;
        User.findOne().then((user) => {
          expect(user.currentPayload).to.be.equal(payloadConstants.IS_DAD_PAYLOAD);
          expect(user.parental).to.be.equal('DAD');
          done();
        });
      });
    });
  });

  context('#buildResponseMessage', () => {
    it('builds message contains user name', (done) => {
      const user = {
        userId: '1',
        firstName: 'First',
        lastName: 'Last',
        gender: 'Male',
        currentPayload: payloadConstants.READY_TO_CHAT_PAYLOAD
      };

      User.sync({ force: true }).then(function () {
        return User.create(user);
      }).then(() => {
        askIsParentListener._buildResponseMessage({
          user: user,
          payload: payloadConstants.IS_DAD_PAYLOAD
        }).then((response) => {
          expect(response.text).to.contain('First');
          expect(response.text).to.contain('Last');
          done();
        });
      });
    });

    it('cannot build response message if user is null', (done) => {
      User.sync({ force: true }).then(() => {
        askIsParentListener._buildResponseMessage({
          user: null,
          payload: payloadConstants.IS_DAD_PAYLOAD
        }).then((response) => {
          expect(response).to.contain('Cannot build response message');
          done();
        });
      });
    });
  });

  context('#getParentalPayload', () => {
    it('returns parental base on input message', () => {
      expect(askIsParentListener._getParentalPayload('bo')).to.be.equal(payloadConstants.IS_DAD_PAYLOAD);
      expect(askIsParentListener._getParentalPayload('me')).to.be.equal(payloadConstants.IS_MOM_PAYLOAD);
      expect(askIsParentListener._getParentalPayload('chua co con')).to.be.equal(payloadConstants.NO_CHILDREN_PAYLOAD);
    });
  });
});
