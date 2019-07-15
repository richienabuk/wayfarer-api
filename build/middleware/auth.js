"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _database = _interopRequireDefault(require("../database"));

// eslint-disable-next-line consistent-return
var _default =
/*#__PURE__*/
function () {
  var _ref = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee(req, res, next) {
    var token, decoded, text, _ref2, rows;

    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            /**
             * Check if token available
             * Returns 401
             */
            token = req.header('x-access-token');

            if (token) {
              _context.next = 3;
              break;
            }

            return _context.abrupt("return", res.status(401).send({
              status: 'error',
              error: 'Access denied. No token provided.'
            }));

          case 3:
            _context.prev = 3;
            decoded = _jsonwebtoken["default"].verify(token, process.env.JWT_SECRET);
            text = 'SELECT * FROM users WHERE id = $1';
            _context.next = 8;
            return _database["default"].query(text, [decoded.userId]);

          case 8:
            _ref2 = _context.sent;
            rows = _ref2.rows;

            if (rows[0]) {
              _context.next = 12;
              break;
            }

            return _context.abrupt("return", res.status(400).send({
              status: 'error',
              error: 'The token you provided is invalid'
            }));

          case 12:
            req.user = {
              id: decoded.userId,
              firstName: rows[0].first_name,
              lastName: rows[0].last_name,
              email: rows[0].email,
              isAdmin: decoded.isAdmin
            }; // req.user = decoded;

            next();
            _context.next = 19;
            break;

          case 16:
            _context.prev = 16;
            _context.t0 = _context["catch"](3);
            res.status(400).send({
              status: 'error',
              error: _context.t0
            });

          case 19:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[3, 16]]);
  }));

  return function (_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();

exports["default"] = _default;
//# sourceMappingURL=auth.js.map