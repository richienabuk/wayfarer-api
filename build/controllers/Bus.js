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

var Bus = {
  create: function () {
    var _create = (0, _asyncToGenerator2["default"])(
    /*#__PURE__*/
    _regenerator["default"].mark(function _callee(req, res) {
      var createBusQuery, bus, _ref, rows, data;

      return _regenerator["default"].wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              if (!(!req.body.number_plate || !req.body.manufacturer || !req.body.model || !req.body.year || !req.body.capacity)) {
                _context.next = 2;
                break;
              }

              return _context.abrupt("return", res.status(400).send({
                status: 'error',
                error: 'Some values are missing'
              }));

            case 2:
              createBusQuery = "INSERT INTO \n      buses(number_plate, manufacturer, model, year, capacity, created_at, updated_at)\n      VALUES($1,$2,$3,$4,$5,$6,$7)\n      returning *";
              bus = [req.body.number_plate, req.body.manufacturer, req.body.model, req.body.year, req.body.capacity, (0, _moment["default"])(new Date()), (0, _moment["default"])(new Date())];
              _context.prev = 4;
              _context.next = 7;
              return _database["default"].query(createBusQuery, bus);

            case 7:
              _ref = _context.sent;
              rows = _ref.rows;
              data = {};
              data.bus_id = rows[0].id;
              return _context.abrupt("return", res.status(201).send({
                status: 'success',
                data: data
              }));

            case 14:
              _context.prev = 14;
              _context.t0 = _context["catch"](4);

              if (!(_context.t0.routine === '_bt_check_unique')) {
                _context.next = 18;
                break;
              }

              return _context.abrupt("return", res.status(422).send({
                status: 'error',
                error: 'The bus with the plate number is already registered'
              }));

            case 18:
              return _context.abrupt("return", res.status(400).send({
                status: 'error',
                error: _context.t0
              }));

            case 19:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, null, [[4, 14]]);
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
              getAllQuery = 'SELECT * FROM buses';
              _context2.prev = 1;
              _context2.next = 4;
              return _database["default"].query(getAllQuery);

            case 4:
              _ref2 = _context2.sent;
              rows = _ref2.rows;
              rowCount = _ref2.rowCount;
              data = rows; // data.bus_id = rows.id;
              // data.capacity = rows.capacity;

              return _context2.abrupt("return", res.status(200).send({
                status: 'success',
                data: data,
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
  }()
};
var _default = Bus;
exports["default"] = _default;
//# sourceMappingURL=Bus.js.map