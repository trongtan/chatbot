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
        expect(response).to.be.deep.equal({ isAskingDisease: false });
      });
    });

    it('returns false if messageEvent.message is null', () => {
      askDiseaseArticlesListener._analyze({}).then((response) => {
        expect(response).to.be.deep.equal({ isAskingDisease: false });
      });
    });

    it('returns false if messageEvent.message.text is null', () => {
      askDiseaseArticlesListener._analyze({ message: {} }).then((response) => {
        expect(response).to.be.deep.equal({ isAskingDisease: false });
      });
    });

    it('returns false if not match database', () => {
      sinon.stub(askDiseaseArticlesListener, '_getRequest').returns(Promise.resolve({
        requestedTypeIds: [],
        requestedDiseaseIds: []
      }));

      askDiseaseArticlesListener._analyze({ message: { text: 'text' } }).then((response) => {
        expect(response).to.be.deep.equal({ isAskingDisease: false });
      });
    });

    it('returns true with data if match database', () => {
      sinon.stub(askDiseaseArticlesListener, '_getRequest').returns(Promise.resolve({
        requestedTypeIds: [1],
        requestedDiseaseIds: [1]
      }));

      askDiseaseArticlesListener._analyze({ message: { text: 'text' } }).then((response) => {
        expect(response).to.be.deep.equal({ isAskingDisease: true, requestedTypeIds: [1], requestedDiseaseIds: [1] });
      });
    });
  });

  context('#handle', () => {
    let spy;

    beforeEach(() => {
      spy = sinon.spy(askDiseaseArticlesListener, '_sendResponseMessage');
    });

    it('does nothing if dataAnalysis is null', () => {
      askDiseaseArticlesListener._handle(null, null);
      expect(spy.called).to.be.false;
    });

    it('does nothing if dataAnalysis.isAskingDisease is false', () => {
      askDiseaseArticlesListener._handle(null, {});
      expect(spy.called).to.be.false;
    });

    it('does nothing if messageEvent is null', () => {
      askDiseaseArticlesListener._handle(null, { isAskingDisease: true });
      expect(spy.called).to.be.false;
    });

    it('does nothing if messageEvent.sender is null', () => {
      askDiseaseArticlesListener._handle({}, { isAskingDisease: true });
      expect(spy.called).to.be.false;
    });

    it('does nothing if messageEvent.sender.id is null', () => {
      askDiseaseArticlesListener._handle({ sender: {} }, { isAskingDisease: true });
      expect(spy.called).to.be.false;
    });

    it('sends response message', () => {
      askDiseaseArticlesListener._handle({ sender: { id: '1' } }, {
        isAskingDisease: true,
        typeIds: [1],
        diseaseIds: [1]
      });
      expect(spy.withArgs('1', [1], [1]).calledOnce).to.be.true;
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
