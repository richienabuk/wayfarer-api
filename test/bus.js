import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../src/index';

/**
 * Generates a bus and apply the details for test
 */
const bus = {
  number_plate: 'AKB849UJ',
  manufacturer: 'Nabuk',
  model: 'First Love',
  year: '1945',
  capacity: 64,
};

const should = chai.should();
chai.use(chaiHttp);

/**
 * Test for creating a bus
 */
describe('/POST Bus create', () => {
  it('it should create a new bus', (done) => {
    // send request to the app
    chai.request(app)
      .post('/api/v1/buses')
      .type('json')
      .send(bus)
      .end((e, res) => {
        should.exist(res.body);
        res.should.have.status(201);
        res.body.should.be.a('object');
        res.body.should.have.property('data');
        // eslint-disable-next-line no-unused-expressions
        res.body.should.have.property('status').eq('success');
        done();
      });
  });
});

/**
 *  Test for showing all buses
 */
describe('/GET Bus index', () => {
  it('it should show all existing buses', (done) => {
    chai.request(app)
      .get('/api/v1/buses')
      .end((e, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        done();
      });
  });
});
