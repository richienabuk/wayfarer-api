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

var Trip = {
  create: function () {
    var _create = (0, _asyncToGenerator2["default"])(
    /*#__PURE__*/
    _regenerator["default"].mark(function _callee(req, res) {
      var checkBus, busInfo, createTripQuery, trip, _ref, rows, data;

      return _regenerator["default"].wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              if (!(!req.body.bus_id || !req.body.origin || !req.body.destination || !req.body.trip_date || !req.body.status || !req.body.fare)) {
                _context.next = 2;
                break;
              }

              return _context.abrupt("return", res.status(400).send({
                status: 'error',
                error: 'Some values are missing'
              }));

            case 2:
              checkBus = 'SELECT exists(SELECT 1 FROM buses WHERE id=$1 LIMIT 1)';
              _context.next = 5;
              return _database["default"].query(checkBus, [req.body.bus_id]);

            case 5:
              busInfo = _context.sent;

              if (busInfo.rows[0].exists) {
                _context.next = 8;
                break;
              }

              return _context.abrupt("return", res.status(404).send({
                status: 'error',
                error: 'bus does not exist'
              }));

            case 8:
              createTripQuery = "INSERT INTO \n      trips(bus_id, origin, destination, trip_date, status, fare, created_at, updated_at)\n      VALUES($1,$2,$3,$4,$5,$6,$7,$8)\n      returning *";
              trip = [req.body.bus_id, req.body.origin, req.body.destination, req.body.trip_date, req.body.status, req.body.fare, (0, _moment["default"])(new Date()), (0, _moment["default"])(new Date())];
              _context.prev = 10;
              _context.next = 13;
              return _database["default"].query(createTripQuery, trip);

            case 13:
              _ref = _context.sent;
              rows = _ref.rows;
              data = {};
              data.trip_id = rows[0].id;
              return _context.abrupt("return", res.status(201).send({
                status: 'success',
                data: data
              }));

            case 20:
              _context.prev = 20;
              _context.t0 = _context["catch"](10);
              return _context.abrupt("return", res.status(400).send({
                status: 'error',
                error: _context.t0
              }));

            case 23:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, null, [[10, 20]]);
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
      var getAllQuery, _ref2, rows, rowCount, data;

      return _regenerator["default"].wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              getAllQuery = 'SELECT * FROM trips WHERE status=$1';
              _context2.prev = 1;
              _context2.next = 4;
              return _database["default"].query(getAllQuery, ['active']);

            case 4:
              _ref2 = _context2.sent;
              rows = _ref2.rows;
              rowCount = _ref2.rowCount;
              data = rows; // data.trip_id = rows.id;
              // data.capacity = rows.capacity;

              return _context2.abrupt("return", res.status(200).send({
                status: 'success',
                data: data,
                // rows,
                rowCount: rowCount
              }));

            case 11:
              _context2.prev = 11;
              _context2.t0 = _context2["catch"](1);
              return _context2.abrupt("return", res.status(400).send({
                status: 'error',
                error: _context2.t0
              }));

            case 14:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2, null, [[1, 11]]);
    }));

    function index(_x3, _x4) {
      return _index.apply(this, arguments);
    }

    return index;
  }(),
  update: function () {
    var _update = (0, _asyncToGenerator2["default"])(
    /*#__PURE__*/
    _regenerator["default"].mark(function _callee3(req, res) {
      var findOneQuery, updateOneQuery, _ref3, rows, values, response;

      return _regenerator["default"].wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              findOneQuery = 'SELECT * FROM trips WHERE id=$1';
              updateOneQuery = "UPDATE trips\n      SET status=$1 updated_at=$2, WHERE id=$3 returning *";
              _context3.prev = 2;
              _context3.next = 5;
              return _database["default"].query(findOneQuery, [req.params.id]);

            case 5:
              _ref3 = _context3.sent;
              rows = _ref3.rows;

              if (rows[0]) {
                _context3.next = 9;
                break;
              }

              return _context3.abrupt("return", res.status(404).send({
                status: 'error',
                error: 'trip not found'
              }));

            case 9:
              values = [req.body.status || rows[0].status, (0, _moment["default"])(new Date()), req.params.id];
              _context3.next = 12;
              return _database["default"].query(updateOneQuery, values);

            case 12:
              response = _context3.sent;
              return _context3.abrupt("return", res.status(200).send(response.rows[0]));

            case 16:
              _context3.prev = 16;
              _context3.t0 = _context3["catch"](2);
              return _context3.abrupt("return", res.status(400).send(_context3.t0));

            case 19:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3, null, [[2, 16]]);
    }));

    function update(_x5, _x6) {
      return _update.apply(this, arguments);
    }

    return update;
  }()
};
var _default = Trip;
exports["default"] = _default;
//# sourceMappingURL=Trip.js.map