import Promise from 'promise';
import sinon from 'sinon';
import { expect } from 'chai';
import { beforeEach, afterEach } from 'mocha';

import AskDiseaseArticlesListener from 'observers/analyze-listeners/ask-disease-articles';
import { User } from 'models';

import Services from 'services';
import { logger } from 'logs/winston-logger';

describe('ask disease articles observer', () => {
  let askDiseaseArticlesListener;

  beforeEach(() => {
    askDiseaseArticlesListener = new AskDiseaseArticlesListener();
  });

  context('#analyze', () => {
    it('returns false if messageEvent is null', () => {
      askDiseaseArticlesListener._analyze(null).then((response) => {
        expect(JSON.stringify(response)).to.be.equal(JSON.stringify({ shouldHandle: false }));
      });
    });

    it('returns false if messageEvent.message is null', () => {
      askDiseaseArticlesListener._analyze({}).then((response) => {
        expect(JSON.stringify(response)).to.be.equal(JSON.stringify({ shouldHandle: false }));
      });
    });

    it('returns false if messageEvent.message.text is null', () => {
      askDiseaseArticlesListener._analyze({ message: {} }).then((response) => {
        expect(JSON.stringify(response)).to.be.equal(JSON.stringify({ shouldHandle: false }));
      });
    });

    it('returns false if not match database', () => {
      sinon.stub(askDiseaseArticlesListener, '_getRequest', () => Promise.resolve({
        requestedTypeIds: [],
        requestedDiseaseIds: []
      }));

      askDiseaseArticlesListener._analyze({ message: { text: 'text' } }).then((response) => {
        expect(JSON.stringify(response)).to.be.equal(JSON.stringify({ shouldHandle: false }));
      });
    });

    it('returns true with data if match database', () => {
      sinon.stub(askDiseaseArticlesListener, '_getRequest', () => Promise.resolve({
        requestedTypeIds: [1],
        requestedDiseaseIds: [1]
      }));

      askDiseaseArticlesListener._analyze({ message: { text: 'text' } }).then((response) => {
        expect(JSON.stringify(response)).to.be.equal(JSON.stringify({
          shouldHandle: true,
          requestedTypeIds: [1],
          requestedDiseaseIds: [1]
        }));
      });
    });
  });

  context('#handle', () => {
    it('does nothing if dataAnalysis.shouldHandle is false', (done) => {
      askDiseaseArticlesListener._handle(null, {}).then((response) => {
        expect(response).to.contain('skip');
        done();
      });
    });

    it('sends response message', (done) => {
      sinon.stub(askDiseaseArticlesListener, '_sendResponseMessage', () => Promise.resolve('Success'));
      askDiseaseArticlesListener._handle({ sender: { id: '1' } }, {
        shouldHandle: true,
        typeIds: [1],
        diseaseIds: [1]
      }).then(response => {
        expect(response).to.be.equal('Success');
        done();
      });
    });
  });

  context('#getRequest', () => {
    it('returns corresponding types and diseases of message', (done) => {
      askDiseaseArticlesListener._getRequest('thong tin, trieu chung cam lanh')
        .then((response) => {
          expect(response).to.have.property('requestedTypeIds').and.include('1').and.include('5');
          expect(response).to.have.property('requestedDiseaseIds').and.include('1');
          done();
        });
    });

    it('returns corresponding diseases of message with default type', (done) => {
      askDiseaseArticlesListener._getRequest('cam lanh').then((response) => {
        expect(response).to.have.property('requestedTypeIds').and.include('1');
        expect(response).to.have.property('requestedDiseaseIds').and.include('1');
        done();
      });
    });
  });

  context('#sendResponseMessage', () => {
    afterEach(() => {
      Services.sendTextMessage.restore();
      Services.sendCarouselMessage.restore();
      User.findOrCreateById.restore();
    });

    context('there are some diseases match with type', () => {
      it('returns articles needed to send to recipient', (done) => {
        let recipientId = '1', typeIds = ['1'], diseaseIds = ['1'];
        sinon.stub(Services, 'sendTextMessage', () => Promise.resolve('Success'));
        sinon.stub(Services, 'sendCarouselMessage', () => Promise.resolve('Success'));
        sinon.stub(User, 'findOrCreateById', () => Promise.resolve({ firstName: 'firstName', lastName: 'lastName' }));
        askDiseaseArticlesListener._sendResponseMessage(recipientId, typeIds, diseaseIds)
          .then((response) => {
            expect(response).to.be.equal('Success');
            done();
          });
      });
    });

    context('there are some error while trying fetch data', () => {
      it('logs the error to logger', (done) => {
        let recipientId = '1', typeIds = ['1'], diseaseIds = ['1'];
        const errorCallback = sinon.spy(logger, 'error');
        sinon.stub(User, 'findOrCreateById', () => Promise.resolve({ firstName: 'firstName', lastName: 'lastName' }));
        sinon.stub(Services, 'sendTextMessage').throws();
        sinon.stub(Services, 'sendCarouselMessage').throws();
        askDiseaseArticlesListener._sendResponseMessage(recipientId, typeIds, diseaseIds)
          .then(() => {
            expect(errorCallback.calledOnce).to.be.true;
            done();
          });
      });
    });
  });

  context('#validate', () => {
    context('should not handle incoming message', () => {
      it('returns fail if the incoming message do not match conditions', (done) => {
        let text = 'hey', userId = 1;
        askDiseaseArticlesListener._validate(text, userId)
          .then((response) => {
            expect(JSON.stringify(response)).to.be.equal(JSON.stringify({ shouldHandle: false }));
            done();
          });
      });
    });
  });

  context('the incoming message match with conditions', () => {
    it('returns true if the incoming message match conditions', (done) => {
      let text = 'trieu chung cam lanh', userId = '1';
      askDiseaseArticlesListener._validate(text, userId)
        .then((response) => {
          expect(JSON.stringify(response)).to.be.equal(JSON.stringify({
            shouldHandle: true,
            userId: userId,
            typeIds: ['5'],
            diseaseIds: ['1']
          }));
          done();
        });
    });
  });
});
