import chai from 'chai';
import chaiHttp from 'chai-http';
import jwt from 'jsonwebtoken';
import Auth from '../../src/controllers/utils/AuthHelper';

chai.use(chaiHttp);
const { expect } = chai;

/**
 * Assumes user one is admin and generates token
 * Token decoded is verified against userId and isAdmin status.
 */
describe('Generate authentication token', () => {
  let token;
  before((done) => {
    token = Auth.generateToken(1, true);
    done();
  });

  it('should return a valid JWT', (done) => {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    expect(decoded).to.include({ userId: 1, isAdmin: true });
    done();
  });
});
