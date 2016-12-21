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
      expect(askDiseaseInformationListener.intentionalPayload).to.be.equal('GET_INFO_DISEASE');
    });
  });

  context('#buildArticlesResponse', () => {
    it('appends button `Xem bai viet` to each article', () => {
      const originArticles = [
        {
          link: 'link 1',
          title: 'title 1',
          subtitle: 'subtitle 1',
          image: 'image 1',
        },
        {
          link: 'link 2',
          title: 'title 2',
          subtitle: 'subtitle 2',
          image: 'image 2',
        }
      ];

      const builtArticles = askDiseaseInformationListener._buildArticlesResponse(originArticles);

      expect(builtArticles[0].buttons.length).to.be.equal(1);
      expect(builtArticles[0].buttons[0].url).to.be.equal('link 1');
      expect(builtArticles[1].buttons.length).to.be.equal(1);
      expect(builtArticles[1].buttons[0].url).to.be.equal('link 2');
    });
  });
});
