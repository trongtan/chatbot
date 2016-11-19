import Promise from 'promise';
import sinon from 'sinon';
import { expect } from 'chai';
import { beforeEach } from 'mocha';

import services from 'services';
import AskIsParentListener from 'observers/analyze-listeners/ask-is-parent';
import { payloadConstants } from 'utils/constants';
import { User } from 'models';

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

      it('returns true if messageEvent.message.quick_reply.payload is IS_DAD_PAYLOAD', (done) => {
        askIsParentListener._analyze({
          message: { quick_reply: { payload: payloadConstants.IS_DAD_PAYLOAD } },
          sender: { id: '1' }
        }).then((response) => {
          expect(JSON.stringify(response)).to.be.equal(JSON.stringify({
            shouldHandle: true,
            userId: '1',
            payload: payloadConstants.IS_DAD_PAYLOAD
          }));
          done();
        });
      });

      it('returns true if messageEvent.message.quick_reply.payload is IS_MOM_PAYLOAD', (done) => {
        askIsParentListener._analyze({
          message: { quick_reply: { payload: payloadConstants.IS_MOM_PAYLOAD } },
          sender: { id: '1' }
        }).then((response) => {
          expect(JSON.stringify(response)).to.be.equal(JSON.stringify({
            shouldHandle: true,
            userId: '1',
            payload: payloadConstants.IS_MOM_PAYLOAD
          }));
          done();
        });
      });

      it('returns true if messageEvent.message.quick_reply.payload is NO_CHILDREN_PAYLOAD', (done) => {
        askIsParentListener._analyze({
          message: { quick_reply: { payload: payloadConstants.NO_CHILDREN_PAYLOAD } },
          sender: { id: '1' }
        }).then((response) => {
          expect(JSON.stringify(response)).to.be.equal(JSON.stringify({
            shouldHandle: true,
            userId: '1',
            payload: payloadConstants.NO_CHILDREN_PAYLOAD
          }));
          done();
        });
      });
    });

    context('validate message and current payload', () => {
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

      it('doesn\'t call validateMessageAndCurrentPayload method if text is invalid', (done) => {
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
        userId: '1'
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
    context('database not ready', () => {
      it('return false', (done) => {
        askIsParentListener._validate('bo', '1').then((response) => {
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
            currentPayload: payloadConstants.READY_TO_CHAT_PAYLOAD
          });
        }).then(() => {
          done();
        });
      });

      it('returns true if current payload is READY_TO_CHAT_PAYLOAD', (done) => {
        askIsParentListener._validate('bo', '1').then((response) => {
          expect(JSON.stringify(response)).to.be.equal(JSON.stringify({
            shouldHandle: true,
            userId: '1',
            payload: payloadConstants.IS_DAD_PAYLOAD
          }));
          done();
        });
      });

      it('returns true if current payload is READY_TO_CHAT_PAYLOAD', (done) => {
        askIsParentListener._validate('me', '1').then((response) => {
          expect(JSON.stringify(response)).to.be.equal(JSON.stringify({
            shouldHandle: true,
            userId: '1',
            payload: payloadConstants.IS_MOM_PAYLOAD
          }));
          done();
        });
      });

      it('returns true if current payload is READY_TO_CHAT_PAYLOAD', (done) => {
        askIsParentListener._validate('chua co con', '1').then((response) => {
          expect(JSON.stringify(response)).to.be.equal(JSON.stringify({
            shouldHandle: true,
            userId: '1',
            payload: payloadConstants.NO_CHILDREN_PAYLOAD
          }));
          done();
        });
      });
    });
  });

  context('#execute', () => {
    beforeEach((done) => {
      User.sync({ force: true }).then(() => {
        const userProfile = {
          userId: '1',
          firstName: 'First',
          lastName: 'Last',
          gender: 'Male',
          currentPayload: '',
          parental: ''
        };

        User.findOrCreate({
          where: { userId: userProfile.userId },
          defaults: userProfile
        }).then(() => {
          done();
        });
      });
    });

    it('calls send message and update user parental to database', (done) => {
      const spy = sinon.stub(askIsParentListener, '_sendResponseMessage', () => Promise.resolve('Success'));

      askIsParentListener._execute({ userId: '1', payload: payloadConstants.IS_DAD_PAYLOAD }).then(() => {
        expect(spy.called).to.be.true;
        User.findOne().then((user) => {
          expect(user.currentPayload).to.be.equal(payloadConstants.ASK_PARENT_PAYLOAD);
          expect(user.parental).to.be.equal('DAD');
          done();
        });
      });
    });
  });

  context('#buildResponseMessage', () => {
    it('builds message contains user name', (done) => {
      User.sync({ force: true }).then(function () {
        return User.create({
          userId: '1',
          firstName: 'First',
          lastName: 'Last',
          gender: 'Male',
          currentPayload: payloadConstants.READY_TO_CHAT_PAYLOAD
        });
      }).then(() => {
        askIsParentListener._buildResponseMessage('1', payloadConstants.IS_DAD_PAYLOAD).then((response) => {
          expect(response.text).to.contain('First');
          expect(response.text).to.contain('Last');
          done();
        });
      });
    });

    it('builds message contains user name', (done) => {
      User.sync({ force: true }).then(() => {
        askIsParentListener._buildResponseMessage('1', payloadConstants.IS_DAD_PAYLOAD).then((response) => {
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
