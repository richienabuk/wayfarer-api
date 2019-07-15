"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _moment = _interopRequireDefault(require("moment"));

var _database = _interopRequireDefault(require("../database"));

var _BookingHelper = _interopRequireDefault(require("./utils/BookingHelper"));

var Booking = {
  create: function () {
    var _create = (0, _asyncToGenerator2["default"])(
    /*#__PURE__*/
    _regenerator["default"].mark(function _callee(req, res) {
      var checkTrip, currentBooking, _ref, rows, tripInfo, bookingRows, bookedSeats, remainingSeat, seatNumber, createBookingQuery, booking, bookedResult, booked, data;

      return _regenerator["default"].wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              if (req.body.trip_id) {
                _context.next = 2;
                break;
              }

              return _context.abrupt("return", res.status(400).send({
                status: 'error',
                error: 'No trip selected'
              }));

            case 2:
              checkTrip = 'SELECT * FROM trips JOIN buses on trips.bus_id = buses.id WHERE trips.id=$1';
              currentBooking = 'SELECT seat_number FROM bookings where trip_id=$1';
              _context.prev = 4;
              _context.next = 7;
              return _database["default"].query(checkTrip, [req.body.trip_id]);

            case 7:
              _ref = _context.sent;
              rows = _ref.rows;

              if (rows[0]) {
                _context.next = 11;
                break;
              }

              return _context.abrupt("return", res.status(404).send({
                status: 'error',
                error: 'trip does not exist'
              }));

            case 11:
              if (!(rows[0].status !== 'active')) {
                _context.next = 13;
                break;
              }

              return _context.abrupt("return", res.status(404).send({
                status: 'error',
                error: 'the trip you intend to book has either been suspended or cancelled. Pls try another.'
              }));

            case 13:
              tripInfo = rows[0];
              _context.next = 16;
              return _database["default"].query(currentBooking, [req.body.trip_id]);

            case 16:
              bookingRows = _context.sent;
              bookedSeats = bookingRows.rows.map(function (seat) {
                return seat.seat_number;
              });
              remainingSeat = _BookingHelper["default"].getAvailableSeat(bookedSeats, tripInfo.capacity);

              if (remainingSeat.length) {
                _context.next = 21;
                break;
              }

              return _context.abrupt("return", res.status(404).send({
                status: 'error',
                error: 'the trip you intend to book is filled up, try another'
              }));

            case 21:
              if (!req.body.seat_number) {
                seatNumber = _BookingHelper["default"].generateSeatNumber(remainingSeat);
              } else if (!remainingSeat.includes(Number(req.body.seat_number))) {
                res.status(400).send({
                  status: 'error',
                  error: 'Seat is already taken'
                });
              } else {
                seatNumber = req.body.seat_number;
              }

              createBookingQuery = "INSERT INTO \n      bookings(trip_id, user_id, seat_number, created_at, updated_at) \n      VALUES($1,$2,$3,$4,$5) \n      returning *";
              booking = [req.body.trip_id, req.user.id, seatNumber, (0, _moment["default"])(new Date()), (0, _moment["default"])(new Date())];
              _context.prev = 24;
              _context.next = 27;
              return _database["default"].query(createBookingQuery, booking);

            case 27:
              bookedResult = _context.sent;
              booked = bookedResult.rows[0];
              data = {};
              data.booking_id = booked.id;
              data.user_id = booked.user_id;
              data.trip_id = booked.trip_id;
              data.bus_id = tripInfo.bus_id;
              data.trip_date = tripInfo.trip_date;
              data.seat_number = booked.seat_number;
              data.first_name = req.user.firstName;
              data.last_name = req.user.lastName;
              data.email = req.user.email;
              return _context.abrupt("return", res.status(201).send({
                status: 'success',
                data: data
              }));

            case 42:
              _context.prev = 42;
              _context.t0 = _context["catch"](24);

              if (!(_context.t0.constraint === 'bookings_trip_id_seat_number_key')) {
                _context.next = 46;
                break;
              }

              return _context.abrupt("return", res.status(422).send({
                status: 'error',
                error: 'Seat has already been taken, choose another one'
              }));

            case 46:
              if (!(_context.t0.constraint === 'bookings_pkey')) {
                _context.next = 48;
                break;
              }

              return _context.abrupt("return", res.status(422).send({
                status: 'error',
                error: 'You already have a booking for this trip'
              }));

            case 48:
              return _context.abrupt("return", res.status(400).send({
                status: 'error',
                error: _context.t0
              }));

            case 49:
              _context.next = 54;
              break;

            case 51:
              _context.prev = 51;
              _context.t1 = _context["catch"](4);
              return _context.abrupt("return", _context.t1);

            case 54:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, null, [[4, 51], [24, 42]]);
    }));

    function create(_x, _x2) {
      return _create.apply(this, arguments);
    }

    return create;
  }(),
  index: function () {
    var _index = (0, _asyncToGenerator2["default"])(
    /*#__PURE__*/
    _regenerator["default"].mark(function _callee2(req, res) {
      var getUserBookings, getBookings, data, _ref2, rows, _ref3, _rows;

      return _regenerator["default"].wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              getUserBookings = 'SELECT * FROM bookings where user_id = $1';
              getBookings = 'SELECT * FROM bookings';
              _context2.prev = 2;

              if (!req.user.isAdmin) {
                _context2.next = 11;
                break;
              }

              _context2.next = 6;
              return _database["default"].query(getBookings);

            case 6:
              _ref2 = _context2.sent;
              rows = _ref2.rows;
              data = rows;
              _context2.next = 16;
              break;

            case 11:
              _context2.next = 13;
              return _database["default"].query(getUserBookings, [req.user.id]);

            case 13:
              _ref3 = _context2.sent;
              _rows = _ref3.rows;
              data = _rows;

            case 16:
              return _context2.abrupt("return", res.status(200).send({
                status: 'success',
                data: data
              }));

            case 19:
              _context2.prev = 19;
              _context2.t0 = _context2["catch"](2);
              return _context2.abrupt("return", res.status(400).send({
                status: 'error',
                error: _context2.t0
              }));

            case 22:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2, null, [[2, 19]]);
    }));

    function index(_x3, _x4) {
      return _index.apply(this, arguments);
    }

    return index;
  }(),
  show: function () {
    var _show = (0, _asyncToGenerator2["default"])(
    /*#__PURE__*/
    _regenerator["default"].mark(function _callee3(req, res) {
      var text, _ref4, rows;

      return _regenerator["default"].wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              text = 'SELECT * FROM bookings WHERE id = $1 AND user_id = $2';
              _context3.prev = 1;
              _context3.next = 4;
              return _database["default"].query(text, [req.params.id, req.user.id]);

            case 4:
              _ref4 = _context3.sent;
              rows = _ref4.rows;

              if (rows[0]) {
                _context3.next = 8;
                break;
              }

              return _context3.abrupt("return", res.status(404).send({
                status: 'error',
                error: 'booking not found'
              }));

            case 8:
              return _context3.abrupt("return", res.status(200).send(rows[0]));

            case 11:
              _context3.prev = 11;
              _context3.t0 = _context3["catch"](1);
              return _context3.abrupt("return", res.status(400).send({
                status: 'error',
                error: _context3.t0
              }));

            case 14:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3, null, [[1, 11]]);
    }));

    function show(_x5, _x6) {
      return _show.apply(this, arguments);
    }

    return show;
  }(),
  update: function () {
    var _update = (0, _asyncToGenerator2["default"])(
    /*#__PURE__*/
    _regenerator["default"].mark(function _callee4(req, res) {
      var findOneQuery, findBooking, thisbooking, checkTrip, currentBooking, _ref5, rows, tripInfo, bookingRows, bookedSeats, remainingSeat, seatNumber, updateOneQuery, values, response;

      return _regenerator["default"].wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              findOneQuery = 'SELECT * FROM bookings WHERE id=$1 AND user_id = $2';
              _context4.prev = 1;
              _context4.next = 4;
              return _database["default"].query(findOneQuery, [req.params.id, req.user.id]);

            case 4:
              findBooking = _context4.sent;
              thisbooking = findBooking.rows[0];

              if (thisbooking) {
                _context4.next = 8;
                break;
              }

              return _context4.abrupt("return", res.status(404).send({
                status: 'error',
                error: 'booking not found'
              }));

            case 8:
              checkTrip = 'SELECT * FROM trips JOIN buses on trips.bus_id = buses.id WHERE trips.id=$1';
              currentBooking = 'SELECT seat_number FROM bookings where trip_id=$1';
              _context4.next = 12;
              return _database["default"].query(checkTrip, [thisbooking.trip_id]);

            case 12:
              _ref5 = _context4.sent;
              rows = _ref5.rows;

              if (!(rows[0].status !== 'active')) {
                _context4.next = 16;
                break;
              }

              return _context4.abrupt("return", res.status(404).send({
                status: 'error',
                error: 'You are not allowed to change seat for a suspended or cancelled trip'
              }));

            case 16:
              tripInfo = rows[0];
              _context4.next = 19;
              return _database["default"].query(currentBooking, [thisbooking.trip_id]);

            case 19:
              bookingRows = _context4.sent;
              bookedSeats = bookingRows.rows.map(function (seat) {
                return seat.seat_number;
              });
              remainingSeat = _BookingHelper["default"].getAvailableSeat(bookedSeats, tripInfo.capacity);

              if (remainingSeat.length) {
                _context4.next = 24;
                break;
              }

              return _context4.abrupt("return", res.status(404).send({
                status: 'error',
                error: 'sorry, there is no available seat to change to'
              }));

            case 24:
              if (!remainingSeat.includes(Number(req.body.seat_number))) {
                res.status(400).send({
                  status: 'error',
                  error: 'Seat is already taken'
                });
              } else {
                seatNumber = req.body.seat_number;
              }

              updateOneQuery = "UPDATE bookings\n      SET seat_number=$1, updated_at=$2\n      WHERE id=$3 AND user_id = $4 returning *";
              values = [seatNumber || thisbooking.seat_number, (0, _moment["default"])(new Date()), req.params.id, req.user.id];
              _context4.next = 29;
              return _database["default"].query(updateOneQuery, values);

            case 29:
              response = _context4.sent;
              return _context4.abrupt("return", res.status(200).send(response.rows[0]));

            case 33:
              _context4.prev = 33;
              _context4.t0 = _context4["catch"](1);
              return _context4.abrupt("return", res.status(400).send(_context4.t0));

            case 36:
            case "end":
              return _context4.stop();
          }
        }
      }, _callee4, null, [[1, 33]]);
    }));

    function update(_x7, _x8) {
      return _update.apply(this, arguments);
    }

    return update;
  }(),
  "delete": function () {
    var _delete2 = (0, _asyncToGenerator2["default"])(
    /*#__PURE__*/
    _regenerator["default"].mark(function _callee5(req, res) {
      var deleteQuery, _ref6, rows;

      return _regenerator["default"].wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              deleteQuery = 'DELETE FROM bookings WHERE id=$1 AND user_id = $2 returning *';
              _context5.prev = 1;
              _context5.next = 4;
              return _database["default"].query(deleteQuery, [req.params.id, req.user.id]);

            case 4:
              _ref6 = _context5.sent;
              rows = _ref6.rows;

              if (rows[0]) {
                _context5.next = 8;
                break;
              }

              return _context5.abrupt("return", res.status(404).send({
                status: 'error',
                error: 'booking not found'
              }));

            case 8:
              return _context5.abrupt("return", res.status(204).send({
                status: 'success',
                error: 'booking successfully deleted'
              }));

            case 11:
              _context5.prev = 11;
              _context5.t0 = _context5["catch"](1);
              return _context5.abrupt("return", res.status(400).send(_context5.t0));

            case 14:
            case "end":
              return _context5.stop();
          }
        }
      }, _callee5, null, [[1, 11]]);
    }));

    function _delete(_x9, _x10) {
      return _delete2.apply(this, arguments);
    }

    return _delete;
  }()
};
var _default = Booking;
exports["default"] = _default;
//# sourceMappingURL=Booking.js.map