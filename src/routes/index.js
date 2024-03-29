import express from 'express';
import auth from '../middleware/auth';
import admin from '../middleware/admin';
import User from '../controllers/User';
import Bus from '../controllers/Bus';
import Trip from '../controllers/Trip';
import Booking from '../controllers/Booking';
import Search from '../controllers/Search';

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
  router.patch('/trips/:id', [auth, admin], Trip.update);

  // Booking endpoints
  router.post('/bookings', auth, Booking.create);
  router.get('/bookings', auth, Booking.index);
  router.get('/bookings/:id', auth, Booking.show);
  router.patch('/bookings/:id', auth, Booking.update);
  router.delete('/bookings/:id', auth, Booking.delete);

  // Filters endpoint
  router.get('/search', auth, Search.trips);

  app.use('/api/v1', router);

  app.get('/', (req, res) => res.send({
    status: 'success',
    message: 'Welcome to wayfarer API, visit this link for the documentation: https://documenter.getpostman.com/view/3054493/SVSHsAEG'
  }));
};
