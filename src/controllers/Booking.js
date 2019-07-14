import db from '../database';
import Seat from './utils/BookingHelper';

const Booking = {
  async create(req, res) {
    if (!req.body.trip_id) {
      return res.status(400).send({
        status: 'error',
        error: 'No trip selected',
      });
    }

    const checkTrip = 'SELECT * FROM trips JOIN buses on trips.bus_id = buses.id WHERE trips.id=$1';
    const currentBooking = 'SELECT * FROM bookings where trip_id=$1';

    try {
      const { tripInfo } = await db.query(checkTrip, [req.body.trip_id]);
      if (!tripInfo[0]) return res.status(404).send({ status: 'error', error: 'trip does not exist' });
      if (!tripInfo[0].status === 'active') return res.status(404).send({ status: 'error', error: 'the trip you intend to book has either been suspended or cancelled. Pls try another.' });

      const { bookingRows } = await db.query(currentBooking, [req.body.trip_id]);

      const remainingSeat = Seat.getAvailableSeat(tripInfo[0].status, bookingRows);

      let seatNumber;

      if (!req.body.seat_number) {
        seatNumber = Seat.generateSeatNumber(remainingSeat);
      } else if (!remainingSeat.includes(req.body.seat_number)) {
        return res.status(400).send({
          status: 'error',
          error: 'Seat is already taken',
        });
      } else {
        seatNumber = req.body.seat_number;
      }

      const createBookingQuery = `INSERT INTO 
      bookings(trip_id, user_id, seat_number) 
      VALUES($1,$2,$3) 
      returning *`;

      const booking = [
        req.body.trip_id,
        req.user.id,
        seatNumber,
      ];
      try {
        const { booked } = await db.query(createBookingQuery, booking);
        const data = {};
        data.booking_id = booked[0].booking_id;
        data.user_id = booked[0].user_id;
        data.trip_id = booked[0].trip_id;
        data.bus_id = tripInfo[0].trip_id;
        data.trip_date = tripInfo[0].trip_date;
        data.seat_number = booked[0].seat_number;
        data.first_name = req.user.first_name;
        data.last_name = req.user.last_name;
        data.email = req.user.email;
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
    } catch (e) {
      return e;
    }
  },

  async index(req, res) {
    const getAllQuery = 'SELECT * FROM trips';
    try {
      const { rows, rowCount } = await db.query(getAllQuery);
      const data = rows;
      // data.trip_id = rows.id;
      // data.capacity = rows.capacity;
      return res.status(200).send({
        status: 'success',
        data,
        rowCount,
      });
    } catch (e) {
      return res.status(400).send({
        status: 'error',
        error: e,
      });
    }
  },

  async show(req, res) {
    const text = 'SELECT * FROM trips WHERE id = $1';
    try {
      const { rows } = await db.query(text, req.params.id);
      if (!rows[0]) {
        return res.status(404).send({
          status: 'error',
          error: 'trip not found',
        });
      }
      return res.status(200).send(rows[0]);
    } catch (e) {
      return res.status(400).send({
        status: 'error',
        error: e,
      });
    }
  },

  async update(req, res) {
    const findOneQuery = 'SELECT * FROM bookings WHERE id=$1 AND user_id = $2';
    const updateOneQuery = `UPDATE bookings
      SET seat_number=$1, updated_at=$2
      WHERE id=$3 AND user_id = $4 returning *`;
    try {
      const { rows } = await db.query(findOneQuery, [req.params.id, req.user.id]);
      if (!rows[0]) {
        return res.status(404).send({
          status: 'error',
          error: 'booking not found',
        });
      }
      const values = [
        req.body.seat_number || rows[0].seat_number,
        Date.now(),
        req.params.id,
        req.user.id,
      ];
      const response = await db.query(updateOneQuery, values);
      return res.status(200).send(response.rows[0]);
    } catch (e) {
      return res.status(400).send(e);
    }
  },


};

export default Booking;
