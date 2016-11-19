import Promise from 'promise';
import sinon from 'sinon';
import { expect } from 'chai';
import { beforeEach } from 'mocha';

import AskDiseaseArticlesListener from 'observers/ask-disease-articles';

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
          expect(response).to.have.property('requestedTypeIds').and.include(1).and.include(5);
          expect(response).to.have.property('requestedDiseaseIds').and.include(1);
          done();
        });
    });

    it('returns corresponding diseases of message with default type', (done) => {
      askDiseaseArticlesListener._getRequest('cam lanh').then((response) => {
        expect(response).to.have.property('requestedTypeIds').and.include(1);
        expect(response).to.have.property('requestedDiseaseIds').and.include(1);
        done();
      });
    });
  });
});
