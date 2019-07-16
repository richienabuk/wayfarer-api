import moment from 'moment';
import db from '../database';
import Seat from './utils/BookingHelper';

const Booking = {
  async create(req, res) {
    // if (!req.body.trip_id) {
    //   return res.status(400).send({
    //     status: 'error',
    //     error: 'No trip selected',
    //   });
    // }

    const checkTrip = 'SELECT * FROM trips JOIN buses on trips.bus_id = buses.id WHERE trips.id=$1';
    const currentBooking = 'SELECT seat_number FROM bookings where trip_id=$1';

    try {
      const { rows } = await db.query(checkTrip, [req.body.trip_id]);

      if (!rows[0]) return res.status(404).send({ status: 'error', error: 'trip does not exist' });
      if (rows[0].status !== 'active') return res.status(404).send({ status: 'error', error: 'the trip you intend to book has either been suspended or cancelled. Pls try another.' });
      const tripInfo = rows[0];

      const bookingRows = await db.query(currentBooking, [req.body.trip_id]);

      const bookedSeats = bookingRows.rows.map(seat => seat.seat_number);
      const remainingSeat = Seat.getAvailableSeat(bookedSeats, tripInfo.capacity);

      if (!remainingSeat.length) return res.status(404).send({ status: 'error', error: 'the trip you intend to book is filled up, try another' });

      let seatNumber;

      if (!req.body.seat_number) {
        seatNumber = Seat.generateSeatNumber(remainingSeat);
      } else if (!remainingSeat.includes(Number(req.body.seat_number))) {
        res.status(400).send({ status: 'error', error: 'Seat is already taken' });
      } else {
        seatNumber = req.body.seat_number;
      }

      const createBookingQuery = `INSERT INTO 
      bookings(trip_id, user_id, seat_number, created_at, updated_at) 
      VALUES($1,$2,$3,$4,$5) 
      returning *`;

      const booking = [
        req.body.trip_id,
        req.user.id,
        seatNumber,
        moment(new Date()),
        moment(new Date()),
      ];
      try {
        const bookedResult = await db.query(createBookingQuery, booking);
        const booked = bookedResult.rows[0];
        const data = {};
        data.id = booked.id;
        data.user_id = booked.user_id;
        data.trip_id = booked.trip_id;
        data.bus_id = tripInfo.bus_id;
        data.trip_date = tripInfo.trip_date;
        data.seat_number = booked.seat_number;
        data.first_name = req.user.firstName;
        data.last_name = req.user.lastName;
        data.email = req.user.email;
        return res.status(201).send({
          status: 'success',
          data,
        });
      } catch (e) {
        if (e.constraint === 'bookings_trip_id_seat_number_key') {
          return res.status(422).send({
            status: 'error',
            error: 'Seat has already been taken, choose another one',
          });
        }
        if (e.constraint === 'bookings_pkey') {
          return res.status(422).send({
            status: 'error',
            error: 'You already have a booking for this trip',
          });
        }
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
    const getUserBookings = 'SELECT * FROM bookings INNER JOIN users on bookings.user_id = users.id WHERE user_id = $1';
    const getBookings = 'SELECT * FROM bookings INNER JOIN users on bookings.user_id = users.id';

    let bookings;
    try {
      if (req.user.isAdmin) {
        const { rows } = await db.query(getBookings);
        bookings = rows;
      } else {
        const { rows } = await db.query(getUserBookings, [req.user.id]);
        bookings = rows;
      }

      const data = bookings.map((
        {
          // eslint-disable-next-line camelcase
          id, user_id, trip_id, bus_id, trip_date,
          // eslint-disable-next-line camelcase
          seat_number, first_name, last_name, email, created_at,
        },
      ) => ({
        id,
        user_id,
        trip_id,
        bus_id,
        trip_date,
        seat_number,
        first_name,
        last_name,
        email,
        created_at,
      }));

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

  async show(req, res) {
    const text = 'SELECT * FROM bookings WHERE id = $1 AND user_id = $2';
    try {
      const { rows } = await db.query(text, [req.params.id, req.user.id]);
      if (!rows[0]) {
        return res.status(404).send({
          status: 'error',
          error: 'booking not found',
        });
      }
      const booked = rows[0];
      const data = {};
      data.booking_id = booked.id;
      data.user_id = booked.user_id;
      data.trip_id = booked.trip_id;
      data.seat_number = booked.seat_number;
      data.first_name = req.user.firstName;
      data.last_name = req.user.lastName;
      data.email = req.user.email;
      return res.status(201).send({
        status: 'success',
        data,
      });
      // return res.status(200).send(rows[0]);
    } catch (e) {
      return res.status(400).send({
        status: 'error',
        error: e,
      });
    }
  },

  async update(req, res) {
    const findOneQuery = 'SELECT * FROM bookings WHERE id=$1 AND user_id = $2';
    try {
      const findBooking = await db.query(findOneQuery, [req.params.id, req.user.id]);
      const thisbooking = findBooking.rows[0];
      if (!thisbooking) {
        return res.status(404).send({
          status: 'error',
          error: 'booking not found',
        });
      }

      const checkTrip = 'SELECT * FROM trips JOIN buses on trips.bus_id = buses.id WHERE trips.id=$1';
      const currentBooking = 'SELECT seat_number FROM bookings where trip_id=$1';

      const { rows } = await db.query(checkTrip, [thisbooking.trip_id]);

      if (rows[0].status !== 'active') return res.status(404).send({ status: 'error', error: 'You are not allowed to change seat for a suspended or cancelled trip' });
      const tripInfo = rows[0];

      const bookingRows = await db.query(currentBooking, [thisbooking.trip_id]);

      const bookedSeats = bookingRows.rows.map(seat => seat.seat_number);
      const remainingSeat = Seat.getAvailableSeat(bookedSeats, tripInfo.capacity);

      if (!remainingSeat.length) return res.status(404).send({ status: 'error', error: 'sorry, there is no available seat to change to' });

      let seatNumber;

      if (!remainingSeat.includes(Number(req.body.seat_number))) {
        res.status(400).send({ status: 'error', error: 'Seat is already taken' });
      } else {
        seatNumber = req.body.seat_number;
      }

      const updateOneQuery = `UPDATE bookings
      SET seat_number=$1, updated_at=$2
      WHERE id=$3 AND user_id = $4 returning *`;

      const values = [
        seatNumber || thisbooking.seat_number,
        moment(new Date()),
        req.params.id,
        req.user.id,
      ];
      const response = await db.query(updateOneQuery, values);
      return res.status(200).send(response.rows[0]);
    } catch (e) {
      return res.status(400).send(e);
    }
  },

  async delete(req, res) {
    const deleteQuery = 'DELETE FROM bookings WHERE id=$1 AND user_id = $2 returning *';
    try {
      const { rows } = await db.query(deleteQuery, [req.params.id, req.user.id]);
      // if (!rows[0]) {
      //   return res.status(404).send({
      //     status: 'error',
      //     error: 'booking not found',
      //   });
      // }
      let data = rows[0];
      data.message = 'booking successfully deleted';
      return res.status(200).send({
        status: 'success',
        data,
      });
    } catch (e) {
      return res.status(400).send(e);
    }
  },
};

export default Booking;
