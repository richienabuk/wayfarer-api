import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../src/index';
import Auth from '../../src/controllers/utils/AuthHelper';
// import User from '../../src/controllers/User';
import db from '../../src/database';

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
  const booking = {
    trip_id: 1,
    seat_number: 1,
  };
  let bookingId = 1;

  before(async () => {
    // it('should create user account for bookings', (done) => {
    //   chai.request(app)
    //     .post('/api/v1/auth/signup')
    //     .set('Content-Type', 'Application/json')
    //     .send({
    //       first_name: 'Uwem',
    //       last_name: 'Ikpa',
    //       email: 'uwemy@doe7tyr.com',
    //       password: 'secret',
    //       is_admin: false,
    //     })
    //     .end((e, res) => {
    //       res.should.have.status(201);
    //       done();
    //     });
    // });
    const createUserQuery = `INSERT INTO
      users(email, first_name, last_name, password, is_admin)
      VALUES($1,$2,$3,$4,$5)
      returning *`;
    const hashPassword = Auth.hashPassword('secret');
    const user = [
      'test@mocha.com',
      'Ikpa',
      'Uwem',
      hashPassword,
      false,
    ];

    const { rows } = await db.query(createUserQuery, user);
    token = Auth.generateToken(rows[0].id, rows[0].is_admin);
  });

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


    // it('should update seat number', (done) => {
    //   booking.seat_number = 4;
    //   chai.request(app)
    //     .post(`/api/v1/bookings/${bookingId}`)
    //     .set('Content-Type', 'application/json')
    //     .set('x-access-token', `${token}`)
    //     .send(booking)
    //     .end((e, res) => {
    //       should.exist(res.body);
    //       res.should.have.status(200);
    //       res.body.should.be.a('object');
    //       res.body.should.have.property('data');
    //       res.body.should.have.property('status').eq('success');
    //       done();
    //     });
    // });

    it('should delete a booking', (done) => {
      chai.request(app)
        .delete(`/api/v1/bookings/${bookingId}`)
        .set('Content-Type', 'application/json')
        .set('x-access-token', `${token}`)
        .send(booking)
        .end((e, res) => {
          res.should.have.status(204);
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
          res.should.have.status(401);
          res.body.should.be.a('object');
          res.body.should.have.property('status').eq('error');
          done();
        });
    });

    it('should not create booking if no trip is selected', (done) => {
      booking.trip_id = '';
      chai.request(app)
        .post('/api/v1/bookings')
        .set('Content-Type', 'application/json')
        .set('x-access-token', `${token}`)
        .send(booking)
        .end((e, res) => {
          should.exist(res.body);
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('status').eq('error');
          done();
        });
    });
  });
});
