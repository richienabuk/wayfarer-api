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

var _AuthHelper = _interopRequireDefault(require("./utils/AuthHelper"));

var User = {
  register: function () {
    var _register = (0, _asyncToGenerator2["default"])(
    /*#__PURE__*/
    _regenerator["default"].mark(function _callee(req, res) {
      var hashPassword, createUserQuery, user, _ref, rows, jwtToken, data;

      return _regenerator["default"].wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              if (!(!req.body.email || !req.body.password || !req.body.first_name || !req.body.last_name)) {
                _context.next = 2;
                break;
              }

              return _context.abrupt("return", res.status(401).send({
                status: 'error',
                error: 'Some values are missing'
              }));

            case 2:
              if (_AuthHelper["default"].isValidEmail(req.body.email)) {
                _context.next = 4;
                break;
              }

              return _context.abrupt("return", res.status(401).send({
                status: 'error',
                error: 'Please enter a valid email address'
              }));

            case 4:
              hashPassword = _AuthHelper["default"].hashPassword(req.body.password);
              createUserQuery = "INSERT INTO \n      users(email, first_name, last_name, password, is_admin, created_at, updated_at)\n      VALUES($1,$2,$3,$4,$5,$6,$7)\n      returning *";
              user = [req.body.email, req.body.first_name, req.body.last_name, hashPassword, req.body.is_admin ? req.body.is_admin : false, (0, _moment["default"])(new Date()), (0, _moment["default"])(new Date())];
              _context.prev = 7;
              _context.next = 10;
              return _database["default"].query(createUserQuery, user);

            case 10:
              _ref = _context.sent;
              rows = _ref.rows;
              jwtToken = _AuthHelper["default"].generateToken(rows[0].id, rows[0].is_admin);
              data = {};
              data.user_id = rows[0].id;
              data.is_admin = rows[0].is_admin;
              data.token = jwtToken;
              return _context.abrupt("return", res.status(201).send({
                status: 'success',
                data: data
              }));

            case 20:
              _context.prev = 20;
              _context.t0 = _context["catch"](7);

              if (!(_context.t0.routine === '_bt_check_unique')) {
                _context.next = 24;
                break;
              }

              return _context.abrupt("return", res.status(422).send({
                status: 'error',
                error: 'User with that EMAIL already exist'
              }));

            case 24:
              return _context.abrupt("return", res.status(400).send({
                status: 'error',
                error: _context.t0
              }));

            case 25:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, null, [[7, 20]]);
    }));

    function register(_x, _x2) {
      return _register.apply(this, arguments);
    }

    return register;
  }(),
  login: function () {
    var _login = (0, _asyncToGenerator2["default"])(
    /*#__PURE__*/
    _regenerator["default"].mark(function _callee2(req, res) {
      var text, _ref2, rows, jwtToken, data;

      return _regenerator["default"].wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              if (!(!req.body.email || !req.body.password)) {
                _context2.next = 2;
                break;
              }

              return _context2.abrupt("return", res.status(400).send({
                status: 'error',
                error: 'Some values are missing'
              }));

            case 2:
              if (_AuthHelper["default"].isValidEmail(req.body.email)) {
                _context2.next = 4;
                break;
              }

              return _context2.abrupt("return", res.status(401).send({
                status: 'error',
                error: 'Please enter a valid email address'
              }));

            case 4:
              text = 'SELECT * FROM users WHERE email = $1';
              _context2.prev = 5;
              _context2.next = 8;
              return _database["default"].query(text, [req.body.email]);

            case 8:
              _ref2 = _context2.sent;
              rows = _ref2.rows;

              if (rows[0]) {
                _context2.next = 12;
                break;
              }

              return _context2.abrupt("return", res.status(401).send({
                status: 'error',
                error: 'The credentials you provided is incorrect'
              }));

            case 12:
              if (_AuthHelper["default"].comparePassword(rows[0].password, req.body.password)) {
                _context2.next = 14;
                break;
              }

              return _context2.abrupt("return", res.status(401).send({
                status: 'error',
                error: 'The credentials you provided is incorrect'
              }));

            case 14:
              jwtToken = _AuthHelper["default"].generateToken(rows[0].id, rows[0].is_admin);
              data = {};
              data.user_id = rows[0].id;
              data.is_admin = rows[0].is_admin;
              data.token = jwtToken;
              return _context2.abrupt("return", res.status(200).send({
                status: 'success',
                data: data
              }));

            case 22:
              _context2.prev = 22;
              _context2.t0 = _context2["catch"](5);
              return _context2.abrupt("return", res.status(400).send({
                status: 'error',
                error: "An error occured ".concat(_context2.t0)
              }));

            case 25:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2, null, [[5, 22]]);
    }));

    function login(_x3, _x4) {
      return _login.apply(this, arguments);
    }

    return login;
  }(),
  index: function () {
    var _index = (0, _asyncToGenerator2["default"])(
    /*#__PURE__*/
    _regenerator["default"].mark(function _callee3(req, res) {
      return _regenerator["default"].wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              res.status(200).send({
                status: 'success',
                message: 'Welcome to WayFarer API'
              });

            case 1:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3);
    }));

    function index(_x5, _x6) {
      return _index.apply(this, arguments);
    }

    return index;
  }()
};
var _default = User;
exports["default"] = _default;
//# sourceMappingURL=User.js.map