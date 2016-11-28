import { expect } from 'chai';
import { beforeEach } from 'mocha';

import AskDiseaseMenuListener from 'observers/validate-listeners/ask-disease-menu';

describe('ask disease menu observer', () => {
  let askDiseaseMenuListener;

  beforeEach(() => {
    askDiseaseMenuListener = new AskDiseaseMenuListener();
  });

  context('#constructor', () => {
    it('initializes successfully', () => {
      expect(askDiseaseMenuListener.tag).to.be.equal('[Ask Disease Menu]');
      expect(askDiseaseMenuListener.intentionalPayload).to.be.equal('SEARCH_BY_DISEASE_PAYLOAD');
    });
  });

  context('#getTemplateMessage', () => {
    it('returns list of diseases', (done) => {
      askDiseaseMenuListener._getTemplateMessage().then((result) => {
        expect(result.elements).to.have.lengthOf(10);
        done();
      });
    });
  });
});
