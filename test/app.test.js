import Chai from 'chai';
import { sum } from 'abc';

const expect = Chai.expect;

describe('First test', function () {
  it('test #1', function () {
    expect(sum(1, 1)).to.equal(2);
  });
});
