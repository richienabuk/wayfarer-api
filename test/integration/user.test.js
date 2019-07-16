import chai from 'chai';
import chaiHttp from 'chai-http';
import moment from 'moment';
import db from '../../src/database';
import Auth from '../../src/controllers/utils/AuthHelper';
import app from '../../src/index';

const should = chai.should();
chai.use(chaiHttp);
const { expect } = chai;

// const randString = Math.random().toString(25).substring(2, 8)
//   + Math.random().toString(25).substring(2, 8)
// const Mail = `${randString}@mail.com`;
const Mail = 'aisdfj@ldf.com';

/**
 * User registration and login
 * Protected route check
 * POST /api/v1/auth/signup
 * POST /api/v1/auth/signin
 */
describe('User CRUD operations /api/v1/auth/', () => {
  describe('POST /api/v1/auth/signup User registration', () => {
    it('should return 201 for signup and token for valid credentials', (done) => {
    // send request to the app
      chai.request(app)
        .post('/api/v1/auth/signup')
        .set('Content-Type', 'Application/json')
        .send({
          first_name: 'Essien',
          last_name: 'Raphael',
          email: 'firstuser@webmail.com',
          password: 'secret1234',
        })
        .end((e, res) => {
          should.exist(res.body);
          // validate
          res.should.have.status(201);
          // eslint-disable-next-line no-unused-expressions
          // expect(res.body.data.token).to.exist;
          // res.body.should.have.property('status').eq('success');
          console.log(res.status, res.body);
          done();
        });
    });

    it('should return 401 for invalid input', (done) => {
      chai.request(app)
        .post('/api/v1/auth/signup')
        .set('Content-Type', 'Application/json')
        .send({
          first_name: '',
          last_name: 'Bush',
          email: Mail,
          password: 'secret',
        })
        .end((e, res) => {
          res.should.have.status(401);
          res.body.should.have.property('status').eq('error');
          done();
        });
    });

    it('should return error 401 for invalid email', (done) => {
      chai.request(app)
        .post('/api/v1/auth/signup')
        .type('json')
        .send({
          first_name: 'Michael',
          last_name: 'Bush',
          email: 'mail@mmking',
          password: 'secret',
        })
        .end((e, res) => {
          res.should.have.status(401);
          res.body.should.have.property('status').eq('error');
          done();
        });
    });
  });

  /**
  * POST /api/v1/auth/signin
  * Authenticate registered user test
  */
  describe('POST /api/v1/auth/signin', () => {
    it('should return 200 and token for valid credentials', (done) => {
      chai.request(app)
        .post('/api/v1/auth/signin')
        .set('Content-Type', 'Application/json')
        .send({
          email: 'admin@andela.com',
          password: 'password',
        })
        .end((e, res) => {
          should.exist(res.body);
          res.should.have.status(200);
          // eslint-disable-next-line no-unused-expressions
          expect(res.body.data.token).to.exist;
          res.body.should.have.property('status').eq('success');
          done();
        });
    });

    it('should return error 401 for invalid email for signin', (done) => {
      chai.request(app)
        .post('/api/v1/auth/signin')
        .set('Content-Type', 'Application/json')
        .send({
          email: 'admin@andel',
          password: 'password',
        })
        .end((e, res) => {
          expect(res).to.have.status(401);
          res.body.should.have.property('status').eq('error');
          done();
        });
    });

    it('should return error 401 for invalid credentials', (done) => {
      chai.request(app)
        .post('/api/v1/auth/signin')
        .set('Content-Type', 'Application/json')
        .send({
          email: 'admin@andela.com',
          password: 'passwrr6ord',
        })
        .end((e, res) => {
          should.exist(res.body);
          res.should.have.status(401);
          res.body.should.have.property('status').eq('error');
          done();
        });
    });
  });

  /**
 * Check protected route middleware
 */
  describe('GET route middleware /api/v1/trips', () => {
    it('should return error 401 if no valid token provided', (done) => {
      chai.request(app)
        .get('/api/v1/trips')
        .set('x-access-token', '')
        .end((e, res) => {
          expect(res).to.have.status(401);
          res.body.should.have.property('status').eq('error');
          done();
        });
    });
  });
});
