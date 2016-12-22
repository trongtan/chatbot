import { expect } from 'chai';

import { ButtonTemplates } from 'models';

describe('ButtonTemplates', () => {
  context('#findAllByPostbackValue', () => {
    it('returns all button templates associated with post back value', (done) => {
      ButtonTemplates.findAllByPostbackValue('GREETING_PAYLOAD').then(buttonTemplates => {
        expect(buttonTemplates.length).to.be.equal(1);

        let greetingButton = buttonTemplates[0];
        expect(greetingButton.title).to.be.equal('greeting');
        expect(greetingButton.postbackId).to.be.equal('1');
        expect(greetingButton.Buttons.length).to.be.equal(2);
        expect(greetingButton.Buttons[0].title).to.be.equal('Hướng dẫn');
        expect(greetingButton.Buttons[0].Postback.value).to.be.equal('UNSUPPORTED_PAYLOAD');

        done();
      });
    });
  });
});
