import { expect } from 'chai';

import { PersistentMenus } from 'models';

describe('PersistentMenus', () => {
  context('#findAllPersistentMenu', () => {
    it('returns all persistent menus associated with post back value', (done) => {
      PersistentMenus.findAllPersistentMenu().then(persistentMenus => {
        expect(persistentMenus.length).to.be.equal(1);

        const firstItem = persistentMenus[0];
        expect(firstItem.title).to.be.equal('Theo Bệnh');
        expect(firstItem.payload).to.be.equal('SEARCH_BY_DISEASE_PAYLOAD');
        done();
      });
    });
  });
});
