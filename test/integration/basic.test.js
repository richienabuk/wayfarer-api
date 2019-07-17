import chai from 'chai';
import chaiHttp from 'chai-http';
import moment from 'moment';
import Auth from '../../src/controllers/utils/AuthHelper';
import db from '../../src/database';
import app from '../../src/index';

const { expect } = chai;
chai.use(chaiHttp);
const should = chai.should();

describe('Basic test', () => {
  // before((done) => {
  //   db.query('DELETE FROM users TRUNCATE').then(() => {
  //     db.query('DELETE FROM bookings').then(() => {
  //       done();
  //     }).catch((err) => {
  //       throw err;
  //     });
  //   }).catch((err) => {
  //     throw err;
  //   });
  // });
  before((done) => {
    const createUserQuery = `INSERT INTO users(id, email, first_name, last_name, password, is_admin, created_at, updated_at)
        SELECT $1,$2,$3,$4,$5,$6,$7,$8
    WHERE NOT EXISTS (
        SELECT 1 FROM users WHERE email='admin@andela.com'
    );`;
    const hashPassword = Auth.hashPassword('password');
    const user = [
      1,
      'admin@andela.com',
      'Richie',
      'Nabuk',
      hashPassword,
      true,
      moment(new Date()),
      moment(new Date()),
    ];
    db.query(createUserQuery, user);
    done();
  }, 15000);
  before((done) => {
    const createBusQuery = `INSERT INTO buses(id, number_plate, manufacturer, model, year, capacity, created_at, updated_at)
        SELECT $1,$2,$3,$4,$5,$6,$7,$8
    WHERE NOT EXISTS (
        SELECT 1 FROM buses WHERE number_plate='4FDG67GiJ'
    );`;
    const bus = [
      1,
      '4FDG67GiJ',
      'Nabuk',
      'Ford',
      '1945',
      32,
      moment(new Date()),
      moment(new Date()),
    ];
    db.query(createBusQuery, bus);
    done();
  }, 15000);
  before((done) => {
    const createTripQuery = `INSERT INTO trips(id, bus_id, origin, destination, trip_date, status, fare, created_at, updated_at)
        SELECT $1,$2,$3,$4,$5,$6,$7,$8,$9
    WHERE NOT EXISTS (
        SELECT 1 FROM trips WHERE id=1
    );`;
    const user = [
      1,
      1,
      'Eket',
      'Gwagwalada',
      '11-06-2019',
      'active',
      850.50,
      moment(new Date()),
      moment(new Date()),
    ];
    db.query(createTripQuery, user);
    done();
  }, 15000);
  before((done) => {
    const createTripQuery = `INSERT INTO trips(id, bus_id, origin, destination, trip_date, status, fare, created_at, updated_at)
        SELECT $1,$2,$3,$4,$5,$6,$7,$8,$9
    WHERE NOT EXISTS (
        SELECT 1 FROM trips WHERE id=25
    );`;
    const user = [
      25,
      1,
      'Eket',
      'Gwagwalada',
      '11-06-2019',
      'active',
      850.50,
      moment(new Date()),
      moment(new Date()),
    ];
    db.query(createTripQuery, user);
    done();
  }, 15000);
  before((done) => {
    const createBookingQuery = `INSERT INTO bookings(id, trip_id, user_id, seat_number, created_at, updated_at)
        SELECT $1,$2,$3,$4,$5,$6
    WHERE NOT EXISTS (
        SELECT 1 FROM bookings WHERE id=1
    );`;
    const booking = [
      1,
      1,
      1,
      12,
      moment(new Date()),
      moment(new Date()),
    ];
    db.query(createBookingQuery, booking);
    done();
  }, 15000);

  it('should check that app server exists', (done) => {
    expect(app).to.be.a('function');
    done();
  });

  it('should return 200 for landing page', (done) => {
    chai.request(app)
      .get('/')
      .end((e, res) => {
        should.exist(res.body);
        res.should.have.status(200);
        done();
      });
  });

  it('should test auth welcome page', (done) => {
    chai.request(app)
      .get('/api/v1/auth')
      .end((e, res) => {
        should.exist(res.body);
        res.should.have.status(200);
        done();
      });
  });
});
