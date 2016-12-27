import { expect } from 'chai';
import sinon from 'sinon';
import Promise from 'promise';

import { User } from 'models';
import Utils from 'utils';

describe('User', () => {
  context('#findOrCreateById', () => {
    it('creates new user profile and store it', (done) => {
      const nonExistId = 'not-existing-user-id-1';
      sinon.stub(Utils, 'getUserProfile', () => Promise.resolve('{\"first_name\": \"first name - test\", \"last_name\": \"last name - test\", \"gender\": \"male\"}'));
      User.findOrCreateById(nonExistId).then((user) => {
        expect(user.userId).to.be.equal(nonExistId);
        expect(user.firstName).to.be.equal('first name - test');
        expect(user.lastName).to.be.equal('last name - test');
        expect(user.gender).to.be.equal('male');
      }).done(() => {
        Utils.getUserProfile.restore();
        done();
      });
    });

    it('throws error when get user profile fail', (done) => {
      const nonExistId = 'not-existing-user-id-2';
      sinon.stub(Utils, 'getUserProfile', () => Promise.resolve('{\"first_name\": \"first name - test\", \"last_name\": \"last name - test\", \"gender\": \"male\"}'));
      sinon.stub(User, '_saveProfileForUser').throws('error');

      User.findOrCreateById(nonExistId).then(null, error => {
        expect(error).to.be.equal('Cannot get user profile of not-existing-user-id-2');
      }).done(() => {
        Utils.getUserProfile.restore();
        User._saveProfileForUser.restore();
        done();
      });
    });
  });
});
