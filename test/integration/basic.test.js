import chai from 'chai';
import chaiHttp from 'chai-http';
import db from '../../src/database';
import app from '../../src/index';

const { expect } = chai;
chai.use(chaiHttp);
const should = chai.should();

describe('Basic test', () => {
  // before((done) => {
  //   db.query('DELETE FROM bookings').then(() => {
  //     db.query('DELETE FROM trips').then(() => {
  //       db.query('DELETE FROM users').then(() => {
  //         done();
  //       }).catch((err) => {
  //         throw err;
  //       });
  //     }).catch((err) => {
  //       throw err;
  //     });
  //   }).catch((err) => {
  //     throw err;
  //   });
  // });

  it('should check that app server exists', () => {
    expect(app).to.be.a('function');
  });

  it('should return 200 for landing page', (done) => {
    chai.request(app)
      .get('/')
      .end((e, res) => {
        should.exist(res.body);
        res.should.have.status(200);
        done();
      });
  });

  it('should test auth welcome page', (done) => {
    chai.request(app)
      .get('/api/v1/auth')
      .end((e, res) => {
        should.exist(res.body);
        res.should.have.status(200);
        done();
      });
  });
});
