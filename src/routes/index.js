import express from 'express';
import Users from '../controllers/User';

const router = express.Router();

export default (app) => {
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  // User Auth endpoints
  router.post('/auth/signup', Users.create);
  router.get('/auth', Users.index);

  app.use('/api/v1', router);
};
