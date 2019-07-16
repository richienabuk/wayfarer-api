import chai from 'chai';
import chaiHttp from 'chai-http';
import db from '../../src/database';

chai.use(chaiHttp);

describe('User CRUD operations /api/v1/auth/', () => {
  before(() => {
    db.query('TRUNCATE TABLE bookings CASCADE, trips CASCADE, buses CASCADE, users CASCADE');
  });
});
