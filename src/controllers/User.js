import db from '../database';
import Auth from './Auth';

const Users = {
  async create(req, res) {
    if (!req.body.email || !req.body.password || !req.body.first_name || !req.body.last_name) {
      return res.status(400).send({
        status: 'failure',
        message: 'Some values are missing',
      });
    }

    if (!Auth.isValidEmail(req.body.email)) {
      return res.status(400).send({ message: 'Please enter a valid email address' });
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
      false,
    ];

    try {
      const { rows } = await db.query(createUserQuery, user);
      const jwtToken = Auth.generateToken(rows[0].id);

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
        return res.status(400).send({ message: 'User with that EMAIL already exist' });
      }
      return res.status(400).send(e);
    }
  },

  async index(req, res) {
    res.status(200).send({ message: 'Welcome to WayFarer API' });
  },
};

export default Users;
