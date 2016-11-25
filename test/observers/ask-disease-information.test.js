import sinon from 'sinon';
import { expect } from 'chai';
import { beforeEach } from 'mocha';

import AskDiseaseInformationListener from 'observers/validate-listeners/ask-disease-information';

describe('ask disease information observer', () => {
  let askDiseaseInformationListener;

  beforeEach(() => {
    askDiseaseInformationListener = new AskDiseaseInformationListener();
  });

  context('#constructor', () => {
    it('initializes successfully', () => {
      expect(askDiseaseInformationListener.tag).to.be.equal('[Ask Disease Information]');
      expect(askDiseaseInformationListener.intentionalPostbackPayload).to.be.equal('GET_INFO_DISEASE');
    });
  });

  context('#getTemplateMessage', () => {
    it('returns list of diseases', (done) => {
      askDiseaseInformationListener._getTemplateMessage('GET_INFO_DISEASE_INFORMATION_1').then((result) => {
        expect(result.elements).to.be.exist;
        done();
      });
    });
  });

  context('#getDiseaseIdAndTypeId', () => {
    it('returns diseaseId and typeId', (done) => {
      sinon.stub(askDiseaseInformationListener, '_getTypeId', () => Promise.resolve('1'));

      askDiseaseInformationListener._getDiseaseIdAndTypeId('GET_INFO_DISEASE_INFORMATION_1').then(result => {
        expect(result.diseaseId).to.be.equal('1');
        expect(result.typeId).to.be.equal('1');
        done();
      });
    });
  });
});
