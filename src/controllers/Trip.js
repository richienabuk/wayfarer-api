import db from '../database';

const Trip = {
  async create(req, res) {
    if (!req.body.bus_id
      || !req.body.origin
      || !req.body.destination
      || !req.body.trip_date
      || !req.body.status
      || !req.body.fare) {
      return res.status(400).send({
        status: 'error',
        error: 'Some values are missing',
      });
    }

    const checkBus = 'SELECT exists(SELECT 1 FROM buses WHERE id=$1 LIMIT 1)';
    const busInfo = await db.query(checkBus, [req.body.bus_id]);
    if (!busInfo.rows[0].exists) return res.status(404).send({ status: 'error', error: 'bus does not exist' });

    const createTripQuery = `INSERT INTO 
      trips(bus_id, origin, destination, trip_date, status, fare) 
      VALUES($1,$2,$3,$4,$5, $6) 
      returning *`;

    const trip = [
      req.body.bus_id,
      req.body.origin,
      req.body.destination,
      req.body.trip_date,
      req.body.status,
      req.body.fare,
    ];
    try {
      const { rows } = await db.query(createTripQuery, trip);
      const data = {};
      data.trip_id = rows[0].id;
      return res.status(201).send({
        status: 'success',
        data,
      });
    } catch (e) {
      return res.status(400).send({
        status: 'error',
        error: e,
      });
    }
  },

  async index(req, res) {
    const getAllQuery = 'SELECT * FROM trips WHERE status=$1';
    try {
      const { rows, rowCount } = await db.query(getAllQuery, ['active']);
      const data = rows;
      // data.trip_id = rows.id;
      // data.capacity = rows.capacity;
      return res.status(200).send({
        status: 'success',
        data,
        // rows,
        rowCount,
      });
    } catch (e) {
      return res.status(400).send({
        status: 'error',
        error: e,
      });
    }
  },

  async update(req, res) {
    const findOneQuery = 'SELECT * FROM trips WHERE id=$1';
    const updateOneQuery = `UPDATE trips
      SET status=$1, WHERE id=$2 returning *`;
    try {
      const { rows } = await db.query(findOneQuery, [req.params.id]);
      if (!rows[0]) {
        return res.status(404).send({
          status: 'error',
          error: 'trip not found',
        });
      }
      const values = [
        req.body.status || rows[0].status,
        req.params.id,
      ];
      const response = await db.query(updateOneQuery, values);
      return res.status(200).send(response.rows[0]);
    } catch (e) {
      return res.status(400).send(e);
    }
  },
};

export default Trip;
