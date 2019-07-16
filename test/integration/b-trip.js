import chai from 'chai';
import chaiHttp from 'chai-http';
import faker from 'faker';
import app from '../../src/index';
import Auth from '../../src/controllers/utils/AuthHelper';

const should = chai.should();
chai.use(chaiHttp);
const { expect } = chai;

/**
 * Admin create a bus
 * Admin create a trip
 * POST /api/v1/buses
 * GET /api/v1/buses
 * POST /api/v1/trips
 * GET /api/v1/trips
 */
describe('Trip CRUD operations', () => {
  let token;
  let busId;
  const numb = faker.random.words(1);
  const plate = faker.random.number({ min: 578393, max: 399334044 })

  before(async () => {
    token = Auth.generateToken(1, true);
  });

  before((done) => {
    chai.request(app)
      .post('/api/v1/buses')
      .set('Content-Type', 'application/json')
      .set('x-access-token', `${token}`)
      .send({
        number_plate: plate,
        manufacturer: 'Toyota',
        model: 'First Love',
        year: '1945',
        capacity: 18,
      })
      .end((e, res) => {
        busId = res.body.data.bus_id;
        done();
      });
  });

  describe('/api/v1/buses Buses', () => {
    const bus = {
      number_plate: numb,
      manufacturer: 'Nabuk',
      model: 'First Love',
      year: '1945',
      capacity: 32,
    };
    it('should create a new bus', (done) => {
      chai.request(app)
        .post('/api/v1/buses')
        .set('Content-Type', 'application/json')
        .set('x-access-token', `${token}`)
        .send(bus)
        .end((e, res) => {
          should.exist(res.body);
          res.should.have.status(201);
          res.body.should.be.a('object');
          res.body.should.have.property('data');
          res.body.should.have.property('status').eq('success');
          done();
        });
    });

    it('Should return error 422 when bus with plate number already exist', (done) => {
      chai.request(app)
        .post('/api/v1/buses')
        .set('Content-Type', 'application/json')
        .set('x-access-token', `${token}`)
        .send(bus)
        .end((e, res) => {
          res.should.have.status(422);
          res.body.should.have.property('status').eq('error');
          expect(res.body.error).to.be.equal('The bus with the plate number is already registered');
          done();
        });
    });

    it('should show all existing buses', (done) => {
      chai.request(app)
        .get('/api/v1/buses')
        .set('Content-Type', 'application/json')
        .set('x-access-token', `${token}`)
        .end((e, res) => {
          should.exist(res.body);
          res.should.have.status(200);
          res.body.should.be.a('object');
          done();
        });
    });
  });

  describe('/api/v1/trips Trips', () => {
    it('should fail to create trip and return 401 for no user token supplied', (done) => {
      const trip = {
        bus_id: busId,
        origin: 'Eket',
        destination: 'Gwagwalada',
        trip_date: '11-06-2019',
        fare: 850.50,
        status: 'active',
      };
      // send request to the app
      chai.request(app)
        .post('/api/v1/trips')
        .set('Content-Type', 'application/json')
        .send(trip)
        .end((e, res) => {
          should.exist(res.body);
          res.should.have.status(401);
          res.body.should.have.property('status').eq('error');
          done();
        });
    });

    it('should create a trip', (done) => {
      const trip = {
        bus_id: busId,
        origin: 'Eket',
        destination: 'Gwagwalada',
        trip_date: '11-06-2019',
        fare: 850.50,
      };
      // send request to the app
      chai.request(app)
        .post('/api/v1/trips')
        .set('Content-Type', 'application/json')
        .set('x-access-token', `${token}`)
        .send(trip)
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

    it('return 404 for bus that does not exist', (done) => {
      const trip = {
        bus_id: 99966,
        origin: 'Eket',
        destination: 'Gwagwalada',
        trip_date: '11-06-2019',
        fare: 850.50,
        status: 'active',
      };
      // send request to the app
      chai.request(app)
        .post('/api/v1/trips')
        .set('Content-Type', 'application/json')
        .set('x-access-token', `${token}`)
        .send(trip)
        .end((e, res) => {
          should.exist(res.body);
          res.should.have.status(404);
          // eslint-disable-next-line no-unused-expressions
          res.body.should.have.property('status').eq('error');
          done();
        });
    });

    it('should not create a trip without complete field', (done) => {
      const trip = {
        bus_id: busId,
        origin: '',
        destination: '',
        trip_date: '11-06-2019',
        fare: 850.50,
      };
      chai.request(app)
        .post('/api/v1/trips')
        .set('Content-Type', 'application/json')
        .set('x-access-token', `${token}`)
        .send(trip)
        .end((e, res) => {
          should.exist(res.body);
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('error');
          done();
        });
    });

    it('should return 401 for unauthenticated users', (done) => {
      chai.request(app)
        .get('/api/v1/trips')
        .end((e, res) => {
          should.exist(res.body);
          res.should.have.status(401);
          res.body.should.have.property('status').eq('error');
          done();
        });
    });

    it('should show all existing trips', (done) => {
      chai.request(app)
        .get('/api/v1/trips')
        .set('Content-Type', 'application/json')
        .set('x-access-token', `${token}`)
        .end((e, res) => {
          should.exist(res.body);
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('status').eq('success');
          done();
        });
    });
  });
});
