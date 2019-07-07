import chai from 'chai';
import chaiHttp from 'chai-http';
import faker from 'faker';
import app from '../src/index';

const ranFirstName = faker.name.firstName();
const ranLastName = faker.name.lastName();
const ranEmail = faker.internet.email();


const should = chai.should();
chai.use(chaiHttp);

describe('/GET auth', () => {
  it('it should show auth landing', (done) => {
    chai.request(app)
      .get('/api/v1/auth')
      .end((e, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        done();
      });
  });
});

describe('/POST user', () => {
  it('it should register a new user', (done) => {
    const user = {
      first_name: ranFirstName,
      last_name: ranLastName,
      email: ranEmail,
      password: 'password',
    };
    chai.request(app)
      .post('/api/v1/auth/signup')
      .type('json')
      .send(user)
      .end((e, res) => {
        should.exist(res.body);
        res.should.have.status(201);
        res.body.should.be.a('object');
        res.body.should.have.property('data');
        res.body.should.have.property('status').eq('success');
        done();
      });
  });
});
