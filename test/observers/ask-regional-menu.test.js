import { expect } from 'chai';
import { beforeEach } from 'mocha';

import AskRegionalMenuListener from 'observers/validate-listeners/ask-regional-menu';

describe('ask regional menu observer', () => {
  let askRegionalMenuListener;

  beforeEach(() => {
    askRegionalMenuListener = new AskRegionalMenuListener();
  });

  context('#constructor', () => {
    it('initializes successfully', () => {
      expect(askRegionalMenuListener.tag).to.be.equal('[Ask Regional Menu]');
      expect(askRegionalMenuListener.intentionalPayload).to.be.equal('SEARCH_BY_REGION_PAYLOAD');
    });
  });

  context('#buildRegionalMenu', () => {
    it('appends button `Thong tin ${region}` to each item', () => {
      const originRegionalMenuItems = [
        {
          title: 'title 1',
          subtitle: 'subtitle 1',
          image: 'image 1',
        },
        {
          title: 'title 2',
          subtitle: 'subtitle 2',
          image: 'image 2',
        }
      ];

      const builtRegionalMenuItems = askRegionalMenuListener._buildRegionalMenu(originRegionalMenuItems);

      expect(builtRegionalMenuItems[0].buttons.length).to.be.equal(1);
      expect(builtRegionalMenuItems[0].buttons[0].type).to.be.equal('postback');
      expect(builtRegionalMenuItems[0].buttons[0].title).to.include('Thông tin');
      expect(builtRegionalMenuItems[1].buttons.length).to.be.equal(1);
      expect(builtRegionalMenuItems[1].buttons[0].type).to.be.equal('postback');
      expect(builtRegionalMenuItems[1].buttons[0].title).to.include('Thông tin');
    });
  });
});
