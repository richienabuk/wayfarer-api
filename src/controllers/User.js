import db from '../database';
import Auth from './utils/AuthHelper';

const User = {
  async register(req, res) {
    if (!req.body.email || !req.body.password || !req.body.first_name || !req.body.last_name) {
      return res.status(401).send({
        status: 'error',
        error: 'Some values are missing',
      });
    }

    if (!Auth.isValidEmail(req.body.email)) {
      return res.status(401).send({
        status: 'error',
        error: 'Please enter a valid email address',
      });
    }

    const hashPassword = Auth.hashPassword(req.body.password);

    const createUserQuery = `INSERT INTO 
      users(email, first_name, last_name, password, is_admin) 
      VALUES($1,$2,$3,$4,$5) 
      returning *`;

    const user = [
      req.body.email,
      req.body.first_name,
      req.body.last_name,
      hashPassword,
      req.body.is_admin ? req.body.is_admin : false,
    ];

    try {
      const { rows } = await db.query(createUserQuery, user);
      const jwtToken = Auth.generateToken(rows[0].id, rows[0].is_admin);

      const data = {};
      data.user_id = rows[0].id;
      data.is_admin = rows[0].is_admin;
      data.token = jwtToken;
      return res.status(201).send({
        status: 'success',
        data,
      });
    } catch (e) {
      if (e.routine === '_bt_check_unique') {
        return res.status(422).send({
          status: 'error',
          error: 'User with that EMAIL already exist',
        });
      }
      return res.status(400).send({
        status: 'error',
        error: e,
      });
    }
  },

  async login(req, res) {
    if (!req.body.email || !req.body.password) {
      return res.status(400).send({
        status: 'error',
        error: 'Some values are missing',
      });
    }
    if (!Auth.isValidEmail(req.body.email)) {
      return res.status(401).send({
        status: 'error',
        error: 'Please enter a valid email address',
      });
    }
    const text = 'SELECT * FROM users WHERE email = $1';
    try {
      const { rows } = await db.query(text, [req.body.email]);
      if (!rows[0]) {
        return res.status(401).send({
          status: 'error',
          error: 'The credentials you provided is incorrect',
        });
      }
      if (!Auth.comparePassword(rows[0].password, req.body.password)) {
        return res.status(401).send({
          status: 'error',
          error: 'The credentials you provided is incorrect',
        });
      }
      const jwtToken = Auth.generateToken(rows[0].id, rows[0].is_admin);

      const data = {};
      data.user_id = rows[0].id;
      data.is_admin = rows[0].is_admin;
      data.token = jwtToken;
      return res.status(200).send({
        status: 'success',
        data,
      });
    } catch (e) {
      return res.status(400).send({
        status: 'error',
        error: `An error occured ${e}`,
      });
    }
  },

  async index(req, res) {
    res.status(200).send({
      status: 'success',
      message: 'Welcome to WayFarer API',
    });
  },
};

export default User;
