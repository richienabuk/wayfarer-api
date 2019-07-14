import chai from 'chai';
import chaiHttp from 'chai-http';
import moment from 'moment';
import app from '../../src/index';
import Auth from '../../src/controllers/utils/AuthHelper';
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
  let busId = 11;
  let tripId = 11;
  let bookingId = 11;

  before(async () => {
    const createUserQuery = `INSERT INTO
      users(id, email, first_name, last_name, password, is_admin, created_at, updated_at)
      VALUES($1,$2,$3,$4,$5,$6,$7,$8)
      returning *`;
    const hashPassword = Auth.hashPassword('secret');
    const user = [
      11,
      'bookingtestt@mochar5.com',
      'Ikpa',
      'Uwem',
      hashPassword,
      false,
      moment(new Date()),
      moment(new Date()),
    ];
    const { rows } = await db.query(createUserQuery, user);
    token = Auth.generateToken(rows[0].id, rows[0].is_admin);

    const createBusQuery = `INSERT INTO
      buses(id, number_plate, manufacturer, model, year, capacity, created_at, updated_at)
      VALUES($1,$2,$3,$4,$5,$6,$7,$8)
      returning *`;
    const bus = [
      11,
      'AK111IKtP5r',
      'Toyota',
      'Venza',
      '2019',
      14,
      moment(new Date()),
      moment(new Date()),
    ];
    const busRows = await db.query(createBusQuery, bus);
    busId = busRows.rows[0].id;

    const createTripQuery = `INSERT INTO
      trips(id, bus_id, origin, destination, trip_date, status, fare, created_at, updated_at)
      VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9)
      returning *`;
    const trip = [
      11,
      busId,
      'Uyo - Akwa Ibom',
      'Oshodi - Lagos',
      '10-10-2019',
      'active',
      50.55,
      moment(new Date()),
      moment(new Date()),
    ];
    const TripRows = await db.query(createTripQuery, trip);
    tripId = TripRows.rows[0].id;

    // const createBookingQuery = `INSERT INTO
    //   bookings(id, trip_id, user_id, seat_number, created_at, updated_at)
    //   VALUES($1,$2,$3,$4,$5,$6)
    //   returning *`;
    // const booking = [
    //   11,
    //   11,
    //   11,
    //   11,
    //   moment(new Date()),
    //   moment(new Date()),
    // ];
    // const BookingRows = await db.query(createBookingQuery, booking);
    // bookingId = BookingRows.rows[0].id;
  });

  let booking = {
    trip_id: 11,
    seat_number: 8,
  };

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
    it('should create new booking', (done) => {
      // send request to the app
      chai.request(app)
        .post('/api/v1/bookings')
        .set('Content-Type', 'Application/json')
        .set('x-access-token', `${token}`)
        .send(booking)
        .end((e, res) => {
          should.exist(res.body);
          // validate
          res.should.have.status(201);
          res.body.should.be.a('object');
          res.body.should.have.property('status').eq('success');
          done();
        });
    });
    //
    // it('should create a new booking', (done) => {
    //   chai.request(app)
    //     .post('/api/v1/bookings')
    //     .set('Content-Type', 'application/json')
    //     .set('x-access-token', `${token}`)
    //     .send({
    //       trip_id: '5',
    //       // seat_number: 8,
    //     })
    //     .end((e, res) => {
    //       if (e) throw e;
    //       should.exist(res.body);
    //       res.should.have.status(201);
    //       res.body.should.be.a('object');
    //       res.body.should.have.property('data');
    //       res.body.should.have.property('status').eq('success');
    //       done();
    //     });
    // });


    // it('should update seat number', (done) => {
    //   booking.seat_number = 5;
    //   chai.request(app)
    //     .put(`/api/v1/bookings/${bookingId}`)
    //     .set('Content-Type', 'Application/json')
    //     .set('x-access-token', `${token}`)
    //     .send(booking)
    //     .end((e, res) => {
    //       should.exist(res.body);
    //       res.should.have.status(200);
    //       res.body.should.be.a('object');
    //       res.body.should.have.property('status').eq('success');
    //       done();
    //     });
    // });

    // it('should delete a booking', (done) => {
    //   chai.request(app)
    //     .delete(`/api/v1/bookings/${bookingId}`)
    //     .set('Content-Type', 'application/json')
    //     .set('x-access-token', `${token}`)
    //     .send(booking)
    //     .end((e, res) => {
    //       res.should.have.status(204);
    //       done();
    //     });
    // });

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
