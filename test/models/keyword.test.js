import { expect } from 'chai';

import { Keyword } from 'models';

describe('class methods', () => {
  context('#findKeyWordsByGroupName', () => {
    it('returns all keywords belong to the given group', (done) => {
      Keyword.findKeyWordsByGroupName('GREETING_PAYLOAD').then(result => {
        expect(result.length).to.equal(14);
        expect(result).contains('xin chào');
        expect(result).contains('bác sĩ ơi');
        done();
      });
    });

    it('returns empty array if the given group does not have any keyword', (done) => {
      Keyword.findKeyWordsByGroupName('NON_KEYWORD_GROUP').then(result => {
        expect(result.length).to.equal(0);
        done();
      });
    });
  });

  context('#findGroupNameByKeyword', () => {
    it('returns the group names associated with keyword', (done) => {
      Keyword.findGroupNameByKeyword('Hi').then(result => {
        expect(result).to.equal('GREETING_PAYLOAD');
        done();
      });
    });

    it('fallbacks to default value when nothing found', (done) => {
      Keyword.findGroupNameByKeyword('Not exist keyword').then(result => {
        expect(result).to.equal('UNSUPPORTED_PAYLOAD');
        done();
      });
    });
  });

  context('#findKeywordByName', () => {
    it('returns the keyword matching the name', (done) => {
      Keyword.findKeywordByName('xin chào').then(result => {
        expect(result.id).to.equal('3');
        expect(result.value).to.equal('xin chào');
        expect(result.groupId).to.equal('7');
        done();
      });
    });

    it('returns nil when nothing found', (done) => {
      Keyword.findKeywordByName('not existing keyword').then(result => {
        expect(result).isNil;
        done();
      });
    });
  });
});
