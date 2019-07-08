import express from 'express';
import User from '../controllers/User';
import Bus from '../controllers/Bus';

const router = express.Router();

export default (app) => {
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  // User Auth endpoints
  router.post('/auth/signup', User.register);
  router.post('/auth/signin', User.login);
  router.get('/auth', User.index);

  // Bus endpoints
  router.post('/buses', Bus.create);
  router.get('/buses', Bus.index);

  app.use('/api/v1', router);
};
