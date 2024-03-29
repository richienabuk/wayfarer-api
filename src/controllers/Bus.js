import moment from 'moment';
import db from '../database';
import { success, error } from './utils/ResHelper';

const Bus = {
  async create(req, res) {
    if (!req.body.number_plate
      || !req.body.manufacturer
      || !req.body.model
      || !req.body.year
      || !req.body.capacity) {
      return res.status(400).send(error('Some values are missing'));
    }

    const createBusQuery = `INSERT INTO 
      buses(number_plate, manufacturer, model, year, capacity, created_at, updated_at)
      VALUES($1,$2,$3,$4,$5,$6,$7)
      returning *`;

    const bus = [
      req.body.number_plate,
      req.body.manufacturer,
      req.body.model,
      req.body.year,
      req.body.capacity,
      moment(new Date()),
      moment(new Date()),
    ];
    try {
      const { rows } = await db.query(createBusQuery, bus);
      const data = rows[0];
      return res.status(201).send(success(data));
    } catch (e) {
      if (e.routine === '_bt_check_unique') {
        return res.status(422).send(error('The bus with the plate number is already registered'));
      }
      return res.status(400).send(error(e));
    }
  },

  async index(req, res) {
    const getAllQuery = 'SELECT * FROM buses';
    try {
      const { rows, rowCount } = await db.query(getAllQuery);
      const data = rows;
      // data.bus_id = rows.id;
      // data.capacity = rows.capacity;
      return res.status(200).send(success(data, rowCount));
    } catch (e) {
      return res.status(400).send(error(e));
    }
  },
};

export default Bus;
