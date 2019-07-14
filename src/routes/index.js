import express from 'express';
import auth from '../middleware/auth';
import admin from '../middleware/admin';
import User from '../controllers/User';
import Bus from '../controllers/Bus';
import Trip from '../controllers/Trip';
import Booking from '../controllers/Booking';

const router = express.Router();

export default (app) => {
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  // User Auth endpoints
  router.post('/auth/signup', User.register);
  router.post('/auth/signin', User.login);
  router.get('/auth', User.index);

  // Bus endpoints
  router.post('/buses', [auth, admin], Bus.create);
  router.get('/buses', [auth, admin], Bus.index);

  // Trip endpoints
  router.post('/trips', [auth, admin], Trip.create);
  router.get('/trips', auth, Trip.index);
  // router.get('/trips/:id', auth, Trip.show);
  router.put('/trips/:id', [auth, admin], Trip.update);

  router.post('/bookings', auth, Booking.create);
  router.get('/bookings', auth, Booking.index);
  router.put('/bookings/:id', auth, Booking.update);
  router.delete('/bookings/:id', auth, Booking.delete);

  app.use('/api/v1', router);
};
