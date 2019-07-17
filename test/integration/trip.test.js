import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../src/index';
import Auth from '../../src/controllers/utils/AuthHelper';
import moment from './basic.test';
import db from '../../src/database';

const should = chai.should();
chai.use(chaiHttp);

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
  const busId = 1;
  // const tripId = 1;

  before((done) => { token = Auth.generateToken(1, true); done(); });

  // before((done) => {
  //   const createBusQuery = `INSERT INTO buses(id, number_plate, manufacturer, model, year, capacity, created_at, updated_at)
  //       SELECT $1,$2,$3,$4,$5,$6,$7,$8
  //   WHERE NOT EXISTS (
  //       SELECT 1 FROM buses WHERE number_plate='4FDG67GiJ'
  //   );`;
  //   const bus = [
  //     1,
  //     '4FDG67GiJ',
  //     'Nabuk',
  //     'Ford',
  //     '1945',
  //     32,
  //     moment(new Date()),
  //     moment(new Date()),
  //   ];
  //   db.query(createBusQuery, bus);
  //   done();
  // });
  // before((done) => {
  //   const createTripQuery = `INSERT INTO trips(id, bus_id, origin, destination, trip_date, status, fare, created_at, updated_at)
  //       SELECT $1,$2,$3,$4,$5,$6,$7,$8,$9
  //   WHERE NOT EXISTS (
  //       SELECT 1 FROM trips WHERE id=1
  //   );`;
  //   const user = [
  //     1,
  //     1,
  //     'Eket',
  //     'Gwagwalada',
  //     '11-06-2019',
  //     'active',
  //     850.50,
  //     moment(new Date()),
  //     moment(new Date()),
  //   ];
  //   db.query(createTripQuery, user);
  //   done();
  // });
  // before((done) => {
  //   const createTripQuery = `INSERT INTO trips(id, bus_id, origin, destination, trip_date, status, fare, created_at, updated_at)
  //       SELECT $1,$2,$3,$4,$5,$6,$7,$8,$9
  //   WHERE NOT EXISTS (
  //       SELECT 1 FROM trips WHERE id=25
  //   );`;
  //   const user = [
  //     25,
  //     1,
  //     'Eket',
  //     'Gwagwalada',
  //     '11-06-2019',
  //     'active',
  //     850.50,
  //     moment(new Date()),
  //     moment(new Date()),
  //   ];
  //   db.query(createTripQuery, user);
  //   done();
  // });
  // before((done) => {
  //   const createBookingQuery = `INSERT INTO bookings(id, trip_id, user_id, seat_number, created_at, updated_at)
  //       SELECT $1,$2,$3,$4,$5,$6
  //   WHERE NOT EXISTS (
  //       SELECT 1 FROM bookings WHERE id=1
  //   );`;
  //   const booking = [
  //     1,
  //     1,
  //     1,
  //     12,
  //     moment(new Date()),
  //     moment(new Date()),
  //   ];
  //   db.query(createBookingQuery, booking);
  //   done();
  // });

  describe('/api/v1/buses Buses', () => {
    const bus = {
      number_plate: Math.random().toString(36).substring(2, 15)
        + Math.random().toString(36).substring(2, 15),
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

    it('Should fail to create a bus without token', (done) => {
      chai.request(app)
        .post('/api/v1/buses')
        .set('Content-Type', 'application/json')
        .set('x-access-token', '')
        .send(bus)
        .end((e, res) => {
          res.should.have.status(401);
          res.body.should.have.property('status').eq('error');
          done();
        });
    });

    it('Should fail to create a bus with insufficient field', (done) => {
      bus.model = '';
      bus.year = '';
      chai.request(app)
        .post('/api/v1/buses')
        .set('Content-Type', 'application/json')
        .set('x-access-token', `${token}`)
        .send(bus)
        .end((e, res) => {
          res.should.have.status(400);
          res.body.should.have.property('status').eq('error');
          done();
        });
    });
  });

  describe('/api/v1/trips Trips', () => {
    // it('should create a trip', (done) => {
    //   const trip = {
    //     bus_id: busId,
    //     origin: 'Eket',
    //     destination: 'Gwagwalada',
    //     trip_date: '11-06-2019',
    //     fare: 850.50,
    //   };
    //   chai.request(app)
    //     .post('/api/v1/trips')
    //     .set('Content-Type', 'application/json')
    //     .set('x-access-token', `${token}`)
    //     .send(trip)
    //     .end((e, res) => {
    //       should.exist(res.body);
    //       res.should.have.status(201);
    //       res.body.should.be.a('object');
    //       res.body.should.have.property('data');
    //       // eslint-disable-next-line no-unused-expressions
    //       res.body.should.have.property('status').eq('success');
    //       done();
    //     });
    // });

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

    it('should return 404 for bus does not exist', (done) => {
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

    // it('should update a trip and change status to cancelled', (done) => {
    //   chai.request(app)
    //     .patch('/api/v1/trips/25')
    //     .set('Content-Type', 'application/json')
    //     .set('x-access-token', `${token}`)
    //     .send()
    //     .end((e, res) => {
    //       should.exist(res.body);
    //       res.should.have.status(200);
    //       res.body.should.be.a('object');
    //       // eslint-disable-next-line no-unused-expressions
    //       res.body.should.have.property('status').eq('success');
    //       done();
    //     });
    // });

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

    // it('should show all existing trips', (done) => {
    //   chai.request(app)
    //     .get('/api/v1/trips')
    //     .set('Content-Type', 'application/json')
    //     .set('x-access-token', `${token}`)
    //     .end((e, res) => {
    //       should.exist(res.body);
    //       res.should.have.status(200);
    //       res.body.should.be.a('object');
    //       res.body.should.have.property('status').eq('success');
    //       done();
    //     });
    // });

    it('should return 400 if no search parameter is given', (done) => {
      chai.request(app)
        .get('/api/v1/search')
        .set('Content-Type', 'application/json')
        .set('x-access-token', `${token}`)
        .end((e, res) => {
          should.exist(res.body);
          res.should.have.status(400);
          done();
        });
    });

    it('should return 401 if no token is added to search', (done) => {
      chai.request(app)
        .get('/api/v1/search')
        .set('Content-Type', 'application/json')
        .set('x-access-token', '')
        .end((e, res) => {
          should.exist(res.body);
          res.should.have.status(401);
          done();
        });
    });

    // it('should return search and show existing trips', (done) => {
    //   chai.request(app)
    //     .get('/api/v1/search')
    //     .set('Content-Type', 'application/json')
    //     .set('x-access-token', `${token}`)
    //     .send({ origin: 'a', destination: 'e' })
    //     .end((e, res) => {
    //       should.exist(res.body);
    //       res.should.have.status(200);
    //       done();
    //     });
    // });
  });
});
