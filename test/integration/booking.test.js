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
  let token;

  before((done) => {
    token = Auth.generateToken(1, true);
    done();
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
    // it('should create a new booking', (done) => {
    //   const booking = {
    //     trip_id: 1,
    //     seat_number: 5,
    //   };
    //   chai.request(app)
    //     .post('/api/v1/bookings')
    //     .set('Content-Type', 'application/json')
    //     .set('x-access-token', `${token}`)
    //     .send(booking)
    //     .end((e, res) => {
    //       should.exist(res.body);
    //       res.should.have.status(201);
    //       res.body.should.be.a('object');
    //       res.body.should.have.property('data');
    //       res.body.should.have.property('status').eq('success');
    //       done();
    //     });
    // });

    // it('should update seat number', (done) => {
    //   const booking = {
    //     seat_number: 5,
    //   };
    //   chai.request(app)
    //     .patch('/api/v1/bookings/1')
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
      const wrongBooking = 11209393;
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

    it('should not delete a booking with invalid id', (done) => {
      chai.request(app)
        .delete('/api/v1/bookings/77744444')
        .set('Accept', 'application/json')
        .end((err, res) => {
          res.should.have.status(401);
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
        trip_id: 1,
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

    // it('should delete a booking', (done) => {
    //   chai.request(app)
    //     .delete('/api/v1/bookings/1')
    //     .set('Content-Type', 'application/json')
    //     .set('x-access-token', `${token}`)
    //     .send()
    //     .end((e, res) => {
    //       res.should.have.status(200);
    //       done();
    //     });
    // });
  });
});
