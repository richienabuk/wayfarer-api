import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../src/index';
import Auth from '../../src/controllers/utils/AuthHelper';

const should = chai.should();
chai.use(chaiHttp);

// const { expect } = chai;

/**
 * POST /api/v1/bookings
 * GET /api/v1/bookings
 * GET /api/v1/trips
 */
describe('Booking CRUD operations', () => {
  let token;

  before(() => {
    it('should create user account for bookings', (done) => {
      chai.request(app)
        .post('/api/v1/auth/signup')
        .set('Content-Type', 'Application/json')
        .send({
          first_name: 'Uwem',
          last_name: 'Ikpa',
          email: 'uwemy@doet.com',
          password: 'secret',
          is_admin: false,
        })
        .end((e, res) => {
          res.should.have.status(201);
          done();
        });
    });

    token = Auth.generateToken(2, 'false');
  });

  let booking = {
    trip_id: 1,
    seat_number: 1,
  };

  let bookingId;

  describe('/api/v1/trips Active trips', () => {
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
      chai.request(app)
        .post('/api/v1/bookings')
        .set('Content-Type', 'application/json')
        .set('x-access-token', `${token}`)
        .send(booking)
        .end((e, res) => {
          should.exist(res.body);
          res.should.have.status(201);
          res.body.should.be.a('object');
          res.body.should.have.property('data');
          res.body.should.have.property('status').eq('success');
          bookingId = res.body.data.booking_id;
          done();
        });
    });

    it('should update seat number', (done) => {
      booking.seat_number = 4;
      let id = bookingId;
      chai.request(app)
        .post(`/api/v1/bookings/${id}`)
        .set('Content-Type', 'application/json')
        .set('x-access-token', `${token}`)
        .send(booking)
        .end((e, res) => {
          should.exist(res.body);
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('data');
          res.body.should.have.property('status').eq('success');
          done();
        });
    });

    it('should delete a booking', (done) => {
      let id = bookingId;
      chai.request(app)
        .delete(`/api/v1/bookings/${id}`)
        .set('Content-Type', 'application/json')
        .set('x-access-token', `${token}`)
        .send(booking)
        .end((e, res) => {
          res.should.have.status(200);
          done();
        });
    });

    it('should not create a booking if no token is supplied', (done) => {
      chai.request(app)
        .post('/api/v1/bookings')
        .set('Content-Type', 'application/json')
        .set('x-access-token', '')
        .send(booking)
        .end((e, res) => {
          should.exist(res.body);
          res.should.have.status(201);
          res.body.should.be.a('object');
          res.body.should.have.property('status').eq('error');
          done();
        });
    });

    it('should not create booking if field is no trip selected', (done) => {
      booking.trip_id = '';
      chai.request(app)
        .post('/api/v1/bookings')
        .set('Content-Type', 'application/json')
        .set('x-access-token', `${token}`)
        .send(booking)
        .end((e, res) => {
          should.exist(res.body);
          res.should.have.status(201);
          res.body.should.be.a('object');
          res.body.should.have.property('status').eq('error');
          done();
        });
    });
  });
});
