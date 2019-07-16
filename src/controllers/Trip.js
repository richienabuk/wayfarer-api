import moment from 'moment';
import db from '../database';

const Trip = {
  async create(req, res) {
    // if (!req.body.bus_id
    //   || !req.body.origin
    //   || !req.body.destination
    //   || !req.body.trip_date
    //   || !req.body.status
    //   || !req.body.fare) {
    //   return res.status(400).send({
    //     status: 'error',
    //     error: 'Some values are missing',
    //   });
    // }

    const checkBus = 'SELECT exists(SELECT 1 FROM buses WHERE id=$1 LIMIT 1)';
    const busInfo = await db.query(checkBus, [req.body.bus_id]);
    if (!busInfo.rows[0].exists) return res.status(404).send({ status: 'error', error: 'bus does not exist' });

    const createTripQuery = `INSERT INTO 
      trips(bus_id, origin, destination, trip_date, status, fare, created_at, updated_at)
      VALUES($1,$2,$3,$4,$5,$6,$7,$8)
      returning *`;

    const trip = [
      req.body.bus_id,
      req.body.origin,
      req.body.destination,
      req.body.trip_date,
      'active',
      req.body.fare,
      moment(new Date()),
      moment(new Date()),
    ];
    try {
      const { rows } = await db.query(createTripQuery, trip);
      const data = {};
      data.id = rows[0].id;
      data.bus_id = rows[0].bus_id;
      data.origin = rows[0].origin;
      data.destination = rows[0].destination;
      data.trip_date = rows[0].trip_date;
      data.fare = rows[0].fare;
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
      // eslint-disable-next-line camelcase
      const data = rows.map((
        {
          // eslint-disable-next-line camelcase
          id: trip_id,
          // eslint-disable-next-line camelcase
          bus_id,
          origin,
          destination,
          // eslint-disable-next-line camelcase
          trip_date,
          fare,
          // eslint-disable-next-line camelcase
          created_at,
        },
      ) => ({
        trip_id,
        bus_id,
        origin,
        destination,
        trip_date,
        fare,
        created_at,
      }));

      // data.trip_id = rows.id;
      // data.capacity = rows.capacity;
      return res.status(200).send({
        status: 'success',
        data,
        rows,
        rowCount,
      });
    } catch (e) {
      return res.status(400).send({
        status: 'error',
        error: e,
      });
    }
  },

  // async update(req, res) {
  //   const findOneQuery = 'SELECT * FROM reflections WHERE id=$1 AND owner_id = $2';
  //   const updateOneQuery =`UPDATE reflections
  //     SET success=$1,low_point=$2,take_away=$3,modified_date=$4
  //     WHERE id=$5 AND owner_id = $6 returning *`;
  //   try {
  //     const { rows } = await db.query(findOneQuery, [req.params.id, req.user.id]);
  //     if(!rows[0]) {
  //       return res.status(404).send({'message': 'reflection not found'});
  //     }
  //     const values = [
  //       req.body.success || rows[0].success,
  //       req.body.low_point || rows[0].low_point,
  //       req.body.take_away || rows[0].take_away,
  //       moment(new Date()),
  //       req.params.id,
  //       req.user.id
  //     ];
  //     const response = await db.query(updateOneQuery, values);
  //     return res.status(200).send(response.rows[0]);
  //   } catch(err) {
  //     return res.status(400).send(err);
  //   }
  // },

  async update(req, res) {
    const findOneQuery = 'SELECT * FROM trips WHERE id=$1';
    const updateOneQuery = `UPDATE trips
      SET status='cancelled' WHERE id=${req.params.id} returning *`;
    try {
      const { rows } = await db.query(findOneQuery, [req.params.id]);
      // if (!rows[0]) {
      //   return res.status(404).send({
      //     status: 'error',
      //     error: 'trip not found',
      //   });
      // }
      // const values = [
      //   // req.body.status || rows[0].status,
      //   req.params.id,
      // ];
      const response = await db.query(updateOneQuery);
      //     return res.status(200).send(response.rows[0]);
      let data = response.rows[0];
      data.message = 'trip cancelled successfully';
      return res.status(200).send({
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
};

export default Trip;
