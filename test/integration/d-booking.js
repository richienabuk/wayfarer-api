import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../src/index';
import Auth from '../../src/controllers/utils/AuthHelper';

const should = chai.should();
chai.use(chaiHttp);

/**
 * POST /api/v1/bookings
 * GET /api/v1/bookings
 * GET /api/v1/trips
 */
describe('Booking CRUD operations', () => {
  const numb = Math.random().toString(36).substring(2, 15)
    + Math.random().toString(36).substring(2, 15);
  let token;
  let busId;
  let tripId;
  let bookingId;

  before(async () => {
    token = Auth.generateToken(1, true);
  });

  before((done) => {
    const bus = {
      number_plate: numb,
      manufacturer: 'Nabuk',
      model: 'First Love',
      year: '1945',
      capacity: 32,
    };
    chai.request(app)
      .post('/api/v1/buses')
      .set('Content-Type', 'application/json')
      .set('x-access-token', `${token}`)
      .send(bus)
      .end((e, res) => {
        should.exist(res.body);
        const { id } = res.body.data;
        busId = id;
        done();
      });
  });

  before((done) => {
    chai.request(app)
      .post('/api/v1/trips')
      .set('Content-Type', 'application/json')
      .set('x-access-token', `${token}`)
      .send({
        bus_id: busId,
        origin: 'Eket',
        destination: 'Gwagwalada',
        trip_date: '11-06-2019',
        fare: 850.50,
      })
      .end((e, res) => {
        const { id } = res.body.data;
        tripId = id;
        done();
      });
  });

  describe('/api/v1/trips Active trips', () => {
    it('should not show existing trips to unauthenticated user', (done) => {
      chai.request(app)
        .get('/api/v1/trips')
        .set('Content-Type', 'application/json')
        .set('x-access-token', '')
        .end((e, res) => {
          should.exist(res.body);
          res.should.have.status(401);
          res.body.should.be.a('object');
          res.body.should.have.property('status').eq('error');
          done();
        });
    });

    it('should show all existing trips to authenticated user', (done) => {
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

  describe('/api/v1/bookings Bookings', () => {
    it('should create a new booking', (done) => {
      const booking = {
        trip_id: tripId,
        seat_number: 12,
      };
      chai.request(app)
        .post('/api/v1/bookings')
        .set('Content-Type', 'application/json')
        .set('x-access-token', `${token}`)
        .send(booking)
        .end((e, res) => {
          if (e) throw e;
          should.exist(res.body);
          res.should.have.status(201);
          res.body.should.be.a('object');
          res.body.should.have.property('data');
          res.body.should.have.property('status').eq('success');
          const { id } = res.body.data;
          bookingId = id;
          done();
        });
    });

    it('It should not get a particular booking with non-numeric id', (done) => {
      const bookedId = 'aaa';
      chai.request(app)
        .get(`/api/v1/bookings/${bookedId}`)
        .set('Accept', 'application/json')
        .end((err, res) => {
          res.should.have.status(401);
          done();
        });
    });

    it('should not update a seat number with invalid id', (done) => {
      const wrongBooking = 11209393
      const booking = {
        seat_number: 5,
      };
      chai.request(app)
        .patch(`/api/v1/bookings/${wrongBooking}`)
        .set('Content-Type', 'Application/json')
        .set('x-access-token', `${token}`)
        .send(booking)
        .end((e, res) => {
          should.exist(res.body);
          res.should.have.status(404);
          done();
        });
    });

    it('should update seat number', (done) => {
      const booking = {
        seat_number: 5,
      };
      chai.request(app)
        .patch(`/api/v1/bookings/${bookingId}`)
        .set('Content-Type', 'Application/json')
        .set('x-access-token', `${token}`)
        .send(booking)
        .end((e, res) => {
          should.exist(res.body);
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('status').eq('success');
          done();
        });
    });

    it('should not delete a booking with invalid id', (done) => {
      const bookId = 77744444;
      chai.request(app)
        .delete(`/api/v1/bookings/${bookId}`)
        .set('Accept', 'application/json')
        .end((err, res) => {
          res.should.have.status(401);
          done();
        });
    });

    it('should delete a booking', (done) => {
      chai.request(app)
        .delete(`/api/v1/bookings/${bookingId}`)
        .set('Content-Type', 'application/json')
        .set('x-access-token', `${token}`)
        .send()
        .end((e, res) => {
          res.should.have.status(200);
          done();
        });
    });

    it('should not delete a booking with string as id', (done) => {
      const bookId = 'amadeaus';
      chai.request(app)
        .delete(`/api/v1/bookings/${bookId}`)
        .set('Accept', 'application/json')
        .end((err, res) => {
          res.should.have.status(401);
          done();
        });
    });

    it('should not create a booking if no token is supplied', (done) => {
      const booking = {
        trip_id: tripId,
        seat_number: 10,
      };
      chai.request(app)
        .post('/api/v1/bookings')
        .set('Content-Type', 'application/json')
        .set('x-access-token', '')
        .send(booking)
        .end((e, res) => {
          should.exist(res.body);
          res.should.have.status(401);
          res.body.should.be.a('object');
          res.body.should.have.property('status').eq('error');
          done();
        });
    });

    it('should not create booking if no trip is selected', (done) => {
      const booking = {};
      chai.request(app)
        .post('/api/v1/bookings')
        .set('Content-Type', 'application/json')
        .set('x-access-token', `${token}`)
        .send(booking)
        .end((e, res) => {
          should.exist(res.body);
          res.should.have.status(400);
          res.body.should.have.property('status').eq('error');
          done();
        });
    });
  });
});
