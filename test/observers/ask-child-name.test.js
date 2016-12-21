import Promise from 'promise';
import sinon from 'sinon';
import chai, { expect } from 'chai';
import { beforeEach } from 'mocha';
import chaiSubset from 'chai-subset';

import AskChildNameListener from 'observers/analyze-listeners/ask-child-name';
import { User } from 'models';

chai.use(chaiSubset);

describe('ask child name observer', () => {
  let askChildNameListener;

  beforeEach(() => {
    askChildNameListener = new AskChildNameListener();
  });

  context('#validateMessageAndUserState', () => {
    it('returns false if current payload is neither IS_DAD_PAYLOAD nor IS_MOM_PAYLOAD', () => {
      askChildNameListener._validateMessageAndUserState(null, { currentPayload: 'payload' }).then((response) => {
        expect(response).to.containSubset({ shouldHandle: false });
      });
    });

    it('returns true if current payload is IS_DAD_PAYLOAD', () => {
      askChildNameListener._validateMessageAndUserState(null, { currentPayload: 'IS_DAD_PAYLOAD' }).then((response) => {
        expect(response).to.containSubset({ shouldHandle: true });
      });
    });

    it('returns true if current payload is IS_MOM_PAYLOAD', () => {
      askChildNameListener._validateMessageAndUserState(null, { currentPayload: 'IS_MOM_PAYLOAD' }).then((response) => {
        expect(response).to.containSubset({ shouldHandle: true });
      });
    });
  });

  context('#execute', () => {
    it('sends response to user and update database', (done) => {
      sinon.stub(askChildNameListener, '_sendResponseMessage', () => Promise.resolve('Success'));
      sinon.stub(User, 'updateChildName', () => Promise.resolve('Success'));

      askChildNameListener._execute({ user: { userId: '1' }, childName: 'name' }).then((response) => {
        expect(response).to.be.equal('Success');
      }).done(() => {
        User.updateChildName.restore();
        done();
      });
    });
  });

  context('#getParentalName', () => {
    it('return "Bố" if parental is DAD', () => {
      expect(askChildNameListener._getParentalName('DAD')).to.be.equal('Bố');
    });

    it('return "Mẹ" if parental is MOM', () => {
      expect(askChildNameListener._getParentalName('MOM')).to.be.equal('Mẹ');
    });

    it('return "bạn" if parental is NA', () => {
      expect(askChildNameListener._getParentalName('NA')).to.be.equal('bạn');
    });
  });
});
