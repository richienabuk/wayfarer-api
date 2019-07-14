import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../src/index';
import Auth from '../../src/controllers/utils/AuthHelper';

const should = chai.should();
chai.use(chaiHttp);
const { expect } = chai;

// const { expect } = chai;

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

  before(() => {
    it('should create admin account for trips', (done) => {
      chai.request(app)
        .post('/api/v1/auth/signup')
        .set('Content-Type', 'Application/json')
        .send({
          first_name: 'Uwem',
          last_name: 'Ikpa',
          email: 'uwemy@doet.com',
          password: 'secret',
          is_admin: true,
        })
        .end((e, res) => {
          res.should.have.status(201);
          done();
        });
    });

    token = Auth.generateToken(1, 'true');
  });

  const bus = {
    number_plate: '43TIM4I5O4',
    manufacturer: 'Nabuk',
    model: 'First Love',
    year: '1945',
    capacity: 32,
  };

  let busId = 1;

  describe('/api/v1/buses Buses', () => {
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
          busId = res.body.data.bus_id;
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

  const trip = {
    bus_id: busId,
    origin: 'Eket',
    destination: 'Gwagwalada',
    trip_date: '16-06-2019',
    fare: 850.50,
    status: 'active',
  };

  describe('/api/v1/trips Trips', () => {
    it('should fail to create trip and return 401 for no user token supplied', (done) => {
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
      trip.bus_id = 8888;
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
      trip.origin = '';
      trip.trip_date = '';
      trip.bus_id = 1;
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
