/* eslint-disable camelcase */
import chai from 'chai';
import chaiHttp from 'chai-http';
import moment from 'moment';
import faker from 'faker';
import app from '../../src/index';

const should = chai.should();
chai.use(chaiHttp);
const { expect } = chai;

const firstName = faker.name.firstName();
const lastName = faker.name.lastName();
const Mail = faker.internet.email();

/**
 * User registration and login
 * Protected route check
 * POST /api/v1/auth/signup
 * POST /api/v1/auth/signin
 */
describe('User CRUD operations /api/v1/auth/', () => {
  // before(async () => {
  //   const createUserQuery = `INSERT INTO
  //     users(id, email, first_name, last_name, password, is_admin, created_at, updated_at)
  //     VALUES($1,$2,$3,$4,$5,$6,$7,$8) ON CONFLICT (email) DO NOTHING
  //     returning *`;
  //   const hashPassword = Auth.hashPassword('secret');
  //   const user = [
  //     1,
  //     'admin@emailadmin.com',
  //     'Admin',
  //     'Lastname',
  //     hashPassword,
  //     true,
  //     moment(new Date()),
  //     moment(new Date()),
  //   ];
  //   await db.query(createUserQuery, user);
  // });

  const user = {
    first_name: firstName,
    last_name: lastName,
    email: Mail,
    password: 'secret',
    created_at: moment(new Date()),
    updated_at: moment(new Date()),
  };

  it('should check that app server exists', () => {
    expect(app).to.be.a('function');
  });

  describe('POST /api/v1/auth/signup User registration', () => {
    it('should return 201 and token for valid credentials', (done) => {
    // send request to the app
      chai.request(app)
        .post('/api/v1/auth/signup')
        .set('Content-Type', 'Application/json')
        .send(user)
        .end((e, res) => {
          should.exist(res.body);
          // validate
          res.should.have.status(201);
          // eslint-disable-next-line no-unused-expressions
          expect(res.body.data.token).to.exist;
          res.body.should.have.property('status').eq('success');
          done();
        });
    });

    it('Should return error 422 when email already registered', (done) => {
      chai.request(app)
        .post('/api/v1/auth/signup')
        .set('Content-Type', 'Application/json')
        .send(user)
        .end((e, res) => {
          expect(res).to.have.status(422);
          res.body.should.have.property('status').eq('error');
          expect(res.body.error).to.be.equal('User with that EMAIL already exist');
          done();
        });
    });

    it('should return error 401 for invalid email', (done) => {
      user.email = 'uwemy@do';
      chai.request(app)
        .post('/api/v1/auth/signup')
        .type('json')
        .send(user)
        .end((e, res) => {
          res.should.have.status(401);
          res.body.should.have.property('status').eq('error');
          done();
        });
    });

    it('should return 401 for invalid input', (done) => {
      user.first_name = '';
      chai.request(app)
        .post('/api/v1/auth/signup')
        .set('Content-Type', 'Application/json')
        .send(user)
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
      user.email = 'admin@andela.com';
      user.password = 'password';
      chai.request(app)
        .post('/api/v1/auth/signin')
        .set('Content-Type', 'Application/json')
        .send(user)
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
      user.email = 'notvalidmail';
      chai.request(app)
        .post('/api/v1/auth/signin')
        .set('Content-Type', 'Application/json')
        .send(user)
        .end((e, res) => {
          expect(res).to.have.status(401);
          res.body.should.have.property('status').eq('error');
          done();
        });
    });

    it('should return error 401 for invalid credentials', (done) => {
      user.email = 'uwemy@doe.com';
      user.password = 'invalidPassword';
      chai.request(app)
        .post('/api/v1/auth/signin')
        .set('Content-Type', 'Application/json')
        .send(user)
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
